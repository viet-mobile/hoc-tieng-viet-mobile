// -*- coding: utf-8 -*-
/**
 * Cloudflare Pages Advanced Mode Worker for Regional Sites (_worker.js)
 * Scoped strictly to REGION_ID (jeonju or ulsan). The two __REGION_*__ placeholders are replaced by
 * regional_admin/bundle_worker.py; the GENERAL and JW builds never receive this file.
 *
 * Security model
 * - Identity: server-side sessions (PBKDF2 login) or, when configured, a cryptographically verified
 *   Cloudflare Access JWT. Client-supplied identity headers are never trusted.
 * - Authorization: the account's allowed_region must equal REGION_ID (or be '*') AFTER authentication,
 *   and the session must have been issued for this region.
 * - CSRF: every state-changing request (login, logout, all /api/admin mutations) must be same-origin
 *   (Origin header) and, once authenticated, carry the per-session X-CSRF-Token.
 * - Brute force: limits keyed by cf-connecting-ip and by username; fails closed.
 */

const {
  verifyPassword,
  generateToken,
  parseCookies,
  createSessionCookie,
  clearSessionCookie,
  checkRateLimit,
  recordFailedLogin,
  clearFailedLogins,
  authenticateRequest,
  timingSafeEqual,
  SESSION_TTL_SECONDS,
  IP_FAIL_LIMIT,
  USER_FAIL_LIMIT,
  hashPassword,
} = require('./auth');

const db = require('./db');
const { renderAdminHtml } = require('./admin_ui');

// Region placeholders are replaced by regional_admin/bundle_worker.py at build time.
const REGION_ID = "__REGION_ID__";
const REGION_NAME = "__REGION_NAME__";

const MAX_BODY_BYTES = 256 * 1024;
const SECURITY_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'same-origin',
};
function adminPageCsp(nonce) {
  return `default-src 'self'; script-src 'nonce-${nonce}'; style-src 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'`;
}

function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...SECURITY_HEADERS,
      ...headers,
    },
  });
}

function errorResponse(err) {
  if (err && err.name === 'ValidationError') {
    return jsonResponse({ error: err.message }, err.status || 400);
  }
  console.error('regional-admin internal error:', err && err.message ? err.message : err);
  return jsonResponse({ error: '서버 처리 중 오류가 발생했습니다.' }, 500);
}

function getClientIp(request) {
  // On Cloudflare Edge, 'cf-connecting-ip' is set by the edge itself and cannot be forged by the client.
  // X-Forwarded-For / X-Real-IP are client-controlled and MUST NOT be used for rate limiting.
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp && cfIp.trim()) {
    return cfIp.trim();
  }
  // Local development / tests only (no Cloudflare edge in front).
  return '127.0.0.1';
}

/** Same-origin check for state-changing requests (defense in depth alongside the CSRF token). */
function isSameOrigin(request, url) {
  const origin = request.headers.get('Origin');
  if (!origin || origin === 'null' || origin !== url.origin) return false;
  const site = request.headers.get('Sec-Fetch-Site');
  if (site && site !== 'same-origin') return false;
  return true;
}

async function readJson(request) {
  const type = (request.headers.get('Content-Type') || '').toLowerCase();
  if (!type.startsWith('application/json')) {
    const e = new Error('Content-Type must be application/json');
    e.name = 'ValidationError';
    e.status = 415;
    throw e;
  }
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) {
    const e = new Error('요청 본문이 너무 큽니다.');
    e.name = 'ValidationError';
    e.status = 413;
    throw e;
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    const e = new Error('요청 본문이 올바른 JSON이 아닙니다.');
    e.name = 'ValidationError';
    e.status = 400;
    throw e;
  }
}

// Verified against for unknown usernames so response time does not reveal which accounts exist.
let dummyHashPromise = null;
function getDummyHash() {
  if (!dummyHashPromise) {
    dummyHashPromise = hashPassword('not-a-real-password', new Uint8Array(16));
  }
  return dummyHashPromise;
}

async function handleLogin(request, env, url) {
  if (!isSameOrigin(request, url)) {
    return jsonResponse({ error: '허용되지 않는 요청 출처입니다.' }, 403);
  }
  const ipKey = 'ip:' + getClientIp(request);

  let body;
  try {
    body = await readJson(request);
  } catch (err) {
    return errorResponse(err);
  }
  const username = body && typeof body.username === 'string' ? body.username.trim() : '';
  const password = body && typeof body.password === 'string' ? body.password : '';
  if (!username || !password || username.length > 64 || password.length > 256) {
    return jsonResponse({ error: '아이디와 비밀번호를 입력해주세요.' }, 400);
  }
  const userKey = 'user:' + username.toLowerCase();

  const ipCheck = await checkRateLimit(env.DB, ipKey);
  const userCheck = await checkRateLimit(env.DB, userKey);
  if (!ipCheck.allowed || !userCheck.allowed) {
    return jsonResponse({ error: (ipCheck.allowed ? userCheck : ipCheck).reason }, 429);
  }

  try {
    const user = await env.DB.prepare(
      "SELECT id, username, password_hash, allowed_region, is_active FROM admin_users WHERE username = ? AND is_active = 1"
    ).bind(username).first();

    const valid = await verifyPassword(password, user ? user.password_hash : await getDummyHash());
    if (!user || !valid) {
      await recordFailedLogin(env.DB, ipKey, IP_FAIL_LIMIT);
      await recordFailedLogin(env.DB, userKey, USER_FAIL_LIMIT);
      return jsonResponse({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' }, 401);
    }

    // Strict region check: a Jeonju admin cannot log into Ulsan and vice versa.
    if (user.allowed_region !== '*' && user.allowed_region !== REGION_ID) {
      return jsonResponse({ error: `이 계정은 '${REGION_NAME}' 관리 권한이 없습니다.` }, 403);
    }

    await clearFailedLogins(env.DB, userKey);

    const sessionToken = generateToken(32);
    const csrfToken = generateToken(16);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_TTL_SECONDS * 1000).toISOString();

    await env.DB.batch([
      env.DB.prepare("DELETE FROM admin_sessions WHERE expires_at < ?").bind(now.toISOString()),
      env.DB.prepare(
        `INSERT INTO admin_sessions (token, user_id, region_id, csrf_token, expires_at)
         VALUES (?, ?, ?, ?, ?)`
      ).bind(sessionToken, user.id, REGION_ID, csrfToken, expiresAt),
    ]);

    return jsonResponse(
      { success: true, user: { id: user.id, username: user.username, allowed_region: user.allowed_region }, csrfToken },
      200,
      { 'Set-Cookie': createSessionCookie(sessionToken) }
    );
  } catch (e) {
    return errorResponse(e);
  }
}

async function handleRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // 1. Admin SPA UI route
  if (path === '/admin' || path === '/admin/') {
    if (method !== 'GET' && method !== 'HEAD') {
      return jsonResponse({ error: 'Method not allowed' }, 405, { Allow: 'GET, HEAD' });
    }
    const authRes = env.DB ? await authenticateRequest(request, env.DB, REGION_ID, env) : { authorized: false };
    const nonce = generateToken(16);
    const html = renderAdminHtml(
      REGION_ID,
      REGION_NAME,
      authRes.authorized ? authRes.user : null,
      authRes.authorized ? authRes.csrfToken : '',
      nonce
    );
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Security-Policy': adminPageCsp(nonce),
        ...SECURITY_HEADERS,
      },
    });
  }

  // 2. Authentication API
  if (path === '/api/auth/login' && method === 'POST') {
    if (!env.DB) return jsonResponse({ error: 'Database binding missing' }, 500);
    return handleLogin(request, env, url);
  }

  if (path === '/api/auth/logout' && method === 'POST') {
    if (!isSameOrigin(request, url)) {
      return jsonResponse({ error: '허용되지 않는 요청 출처입니다.' }, 403);
    }
    const token = parseCookies(request.headers.get('Cookie'))['admin_session'];
    if (token && env.DB) {
      try {
        await env.DB.prepare("DELETE FROM admin_sessions WHERE token = ? AND region_id = ?").bind(token, REGION_ID).run();
      } catch (e) {}
    }
    return jsonResponse({ success: true }, 200, { 'Set-Cookie': clearSessionCookie() });
  }

  if (path === '/api/auth/me' && method === 'GET') {
    const authRes = await authenticateRequest(request, env.DB, REGION_ID, env);
    if (!authRes.authorized) {
      return jsonResponse({ error: authRes.error }, authRes.status);
    }
    return jsonResponse({
      user: authRes.user,
      authMethod: authRes.authMethod,
      csrfToken: authRes.csrfToken,
      session: authRes.session,
    });
  }

  // 3. Public regional plan API (read-only): source curriculum + configuration + active session plan, so the public site
  // can pick up applied admin changes without a redeploy.
  if (path === '/api/regional/curriculum' && method === 'GET') {
    if (!env.DB) return jsonResponse({ error: 'Database binding missing' }, 500);
    try {
      return jsonResponse(await db.getPublicPlan(env.DB, REGION_ID), 200, { 'Cache-Control': 'no-cache' });
    } catch (e) {
      return errorResponse(e);
    }
  }

  // 4. Admin mutation & query routes (authenticated)
  if (path.startsWith('/api/admin/')) {
    const authRes = await authenticateRequest(request, env.DB, REGION_ID, env);
    if (!authRes.authorized) {
      return jsonResponse({ error: authRes.error }, authRes.status);
    }
    const user = authRes.user;

    if (method !== 'GET' && method !== 'HEAD') {
      if (!isSameOrigin(request, url)) {
        return jsonResponse({ error: '허용되지 않는 요청 출처입니다.' }, 403);
      }
      const sent = request.headers.get('X-CSRF-Token') || '';
      const expected = authRes.csrfToken || '';
      const enc = new TextEncoder();
      if (!sent || !expected || !timingSafeEqual(enc.encode(sent), enc.encode(expected))) {
        return jsonResponse({ error: 'CSRF 토큰이 올바르지 않습니다. 페이지를 새로고침해 주세요.' }, 403);
      }
    }

    try {
      if (path === '/api/admin/schedule' && method === 'GET') {
        const [settings, cancellations] = await Promise.all([
          db.getRegionalSettings(env.DB, REGION_ID),
          db.getCancellations(env.DB, REGION_ID),
        ]);
        return jsonResponse({ settings, cancellations });
      }

      if (path === '/api/admin/settings' && method === 'PUT') {
        return jsonResponse(await db.updateRegionalSettings(env.DB, REGION_ID, await readJson(request), user));
      }

      if (path === '/api/admin/cancellations' && method === 'GET') {
        return jsonResponse(await db.getCancellations(env.DB, REGION_ID));
      }

      if (path === '/api/admin/cancellations' && method === 'POST') {
        return jsonResponse(await db.addCancellation(env.DB, REGION_ID, await readJson(request), user));
      }

      const cancelMatch = path.match(/^\/api\/admin\/cancellations\/(\d+)$/);
      if (cancelMatch) {
        const cancelId = parseInt(cancelMatch[1], 10);
        if (method === 'PUT') {
          return jsonResponse(await db.updateCancellation(env.DB, REGION_ID, cancelId, await readJson(request), user));
        }
        if (method === 'DELETE') {
          return jsonResponse(await db.deleteCancellation(env.DB, REGION_ID, cancelId, user));
        }
      }

      if (path === '/api/admin/curriculum' && method === 'GET') {
        return jsonResponse(await db.getCurriculum(env.DB, REGION_ID));
      }

      const currMatch = path.match(/^\/api\/admin\/curriculum\/(\d+)$/);
      if (currMatch && method === 'PUT') {
        const weekNum = parseInt(currMatch[1], 10);
        return jsonResponse(await db.updateCurriculumWeek(env.DB, REGION_ID, weekNum, await readJson(request), user));
      }

      if (path === '/api/admin/plan' && method === 'GET') {
        return jsonResponse(await db.getPlanState(env.DB, REGION_ID));
      }

      if (path === '/api/admin/plan/apply' && method === 'POST') {
        return jsonResponse(await db.applyPlan(env.DB, REGION_ID, await readJson(request), user));
      }

      if (path === '/api/admin/plan/pin' && method === 'PUT') {
        return jsonResponse(await db.setPlanPin(env.DB, REGION_ID, await readJson(request), user));
      }

      if (path === '/api/admin/audit' && method === 'GET') {
        return jsonResponse(await db.getAuditLogs(env.DB, REGION_ID));
      }

      const restoreMatch = path.match(/^\/api\/admin\/audit\/(\d+)\/restore$/);
      if (restoreMatch && method === 'POST') {
        return jsonResponse(await db.restoreAuditSnapshot(env.DB, REGION_ID, parseInt(restoreMatch[1], 10), user));
      }
    } catch (err) {
      return errorResponse(err);
    }

    return jsonResponse({ error: 'Endpoint not found' }, 404);
  }

  // 5. Everything else is the static site (Pages assets)
  if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
    return env.ASSETS.fetch(request);
  }

  return new Response('Not Found', { status: 404 });
}

module.exports = {
  fetch: handleRequest,
};
