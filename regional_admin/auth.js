// -*- coding: utf-8 -*-
/**
 * Regional Admin Authentication & Authorization
 * 
 * Standards:
 * - PBKDF2-SHA256 with 100,000 iterations and 16-byte random salt
 * - Constant-time hash comparison
 * - HttpOnly, Secure, SameSite=Strict session cookies (8 h), bound to the region they were issued for
 * - Optional Cloudflare Access: ONLY a cryptographically verified Cf-Access-Jwt-Assertion is trusted
 *   (RS256 signature against the team JWKS, kid, iss, aud, exp all mandatory). The
 *   Cf-Access-Authenticated-User-Email header is never trusted. Without CF_ACCESS_AUD and
 *   CF_ACCESS_TEAM_NAME the Access path is DISABLED (fail closed).
 * - Strict region isolation: Jeonju admin cannot mutate Ulsan; Ulsan cannot mutate Jeonju
 * - Brute-force protection keyed by cf-connecting-ip and by username (atomic counters, fail closed)
 */

const cryptoSubtle = (typeof crypto !== 'undefined' && crypto.subtle) ? crypto.subtle : require('crypto').webcrypto.subtle;
const nodeCrypto = (typeof crypto !== 'undefined' && crypto.getRandomValues) ? crypto : require('crypto');

function getRandomBytes(n) {
  const bytes = new Uint8Array(n);
  nodeCrypto.getRandomValues(bytes);
  return bytes;
}

function bytesToHex(bytes) {
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

async function hashPassword(password, saltBytes) {
  const salt = saltBytes || getRandomBytes(16);
  const enc = new TextEncoder();
  const passwordKey = await cryptoSubtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const derivedBits = await cryptoSubtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    256 // 32 bytes
  );
  const hashBytes = new Uint8Array(derivedBits);
  const saltHex = bytesToHex(salt);
  const hashHex = bytesToHex(hashBytes);
  return `pbkdf2:sha256:100000:${saltHex}:${hashHex}`;
}

async function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.startsWith('pbkdf2:sha256:100000:')) {
    return false;
  }
  const parts = storedHash.split(':');
  if (parts.length !== 5) return false;
  const saltHex = parts[3];
  const expectedHashHex = parts[4];
  const saltBytes = hexToBytes(saltHex);
  const expectedBytes = hexToBytes(expectedHashHex);

  const enc = new TextEncoder();
  const passwordKey = await cryptoSubtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const derivedBits = await cryptoSubtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    256
  );
  const computedBytes = new Uint8Array(derivedBits);
  return timingSafeEqual(computedBytes, expectedBytes);
}

function parseCookies(header) {
  const cookies = {};
  if (!header) return cookies;
  const pairs = header.split(';');
  for (const pair of pairs) {
    const idx = pair.indexOf('=');
    if (idx < 0) continue;
    const key = pair.substring(0, idx).trim();
    const val = pair.substring(idx + 1).trim();
    try {
      cookies[key] = decodeURIComponent(val);
    } catch (e) {
      cookies[key] = val;
    }
  }
  return cookies;
}

const SESSION_TTL_SECONDS = 8 * 3600;

function createSessionCookie(token, maxAgeSeconds = SESSION_TTL_SECONDS) {
  return `admin_session=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAgeSeconds}; HttpOnly; Secure; SameSite=Strict`;
}

function clearSessionCookie() {
  return `admin_session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;
}

function generateToken(length = 32) {
  return bytesToHex(getRandomBytes(length));
}

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_LOCK_MS = 15 * 60 * 1000;
const IP_FAIL_LIMIT = 5;
const USER_FAIL_LIMIT = 10; // higher than per-IP so a remote attacker cannot cheaply lock a real admin out

/**
 * Login attempt counters live in `login_attempts` keyed by an opaque string
 * ("ip:<addr>" / "user:<name>"). `clientIp` may also be a bare key for backwards compatibility.
 * Fails CLOSED: if the counter store cannot be read, logins are refused.
 */
async function checkRateLimit(db, key) {
  if (!db || !key) return { allowed: false, reason: 'Rate limiter unavailable.' };
  try {
    const row = await db.prepare(
      "SELECT fail_count, locked_until FROM login_attempts WHERE ip = ?"
    ).bind(key).first();

    if (!row) return { allowed: true };
    if (row.locked_until && new Date(row.locked_until) > new Date()) {
      return {
        allowed: false,
        reason: 'Too many failed attempts. Login temporarily locked for 15 minutes.',
      };
    }
    return { allowed: true };
  } catch (e) {
    return { allowed: false, reason: 'Rate limiter unavailable.' };
  }
}

/** Atomic increment (single upsert); stale windows restart at 1; reaching `limit` locks for 15 min. */
async function recordFailedLogin(db, key, limit = IP_FAIL_LIMIT) {
  if (!db || !key) return;
  const nowIso = new Date().toISOString();
  const windowStart = new Date(Date.now() - LOGIN_WINDOW_MS).toISOString();
  const lockIso = new Date(Date.now() + LOGIN_LOCK_MS).toISOString();
  try {
    await db.prepare(
      `INSERT INTO login_attempts (ip, fail_count, locked_until, last_attempt)
       VALUES (?, 1, NULL, ?)
       ON CONFLICT(ip) DO UPDATE SET
         fail_count = CASE WHEN last_attempt < ? THEN 1 ELSE fail_count + 1 END,
         locked_until = CASE WHEN (CASE WHEN last_attempt < ? THEN 1 ELSE fail_count + 1 END) >= ? THEN ? ELSE NULL END,
         last_attempt = ?`
    ).bind(key, nowIso, windowStart, windowStart, limit, lockIso, nowIso).run();
  } catch (e) {}
}

async function clearFailedLogins(db, key) {
  if (!db || !key) return;
  try {
    await db.prepare("DELETE FROM login_attempts WHERE ip = ?").bind(key).run();
  } catch (e) {}
}

function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  if (typeof atob === 'function') {
    const raw = atob(base64);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      bytes[i] = raw.charCodeAt(i);
    }
    return bytes;
  } else {
    return Buffer.from(base64, 'base64');
  }
}

function base64UrlDecodeJson(str) {
  const bytes = base64UrlDecode(str);
  const text = new TextDecoder().decode(bytes);
  return JSON.parse(text);
}

/* ---------------- Cloudflare Access (optional, fail-closed) ---------------- */

const ACCESS_CLOCK_SKEW_S = 30;
const JWKS_CACHE_MS = 60 * 60 * 1000;
const JWKS_REFRESH_MIN_MS = 5 * 60 * 1000;
let jwksCache = { team: null, keys: null, fetchedAt: 0 };

function isAccessConfigured(env) {
  return !!(env && env.CF_ACCESS_AUD && env.CF_ACCESS_TEAM_NAME);
}

function parseJwks(raw) {
  if (!raw) return null;
  try {
    const obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return obj && Array.isArray(obj.keys) ? obj.keys : null;
  } catch (e) {
    return null;
  }
}

/**
 * Key source, in order: env.CF_ACCESS_JWKS (static JSON, e.g. pinned in a Pages variable), else the team's
 * public certs endpoint https://<team>.cloudflareaccess.com/cdn-cgi/access/certs (cached; refetched at most
 * every 5 min when an unknown kid shows up so key rotation works without allowing a fetch storm).
 */
async function getAccessKeys(env, kid) {
  const pinned = parseJwks(env.CF_ACCESS_JWKS);
  if (pinned) return pinned;
  const team = env.CF_ACCESS_TEAM_NAME;
  const now = Date.now();
  const cacheFresh = jwksCache.team === team && jwksCache.keys && (now - jwksCache.fetchedAt) < JWKS_CACHE_MS;
  const hasKid = cacheFresh && jwksCache.keys.some(k => k.kid === kid);
  if (cacheFresh && (hasKid || (now - jwksCache.fetchedAt) < JWKS_REFRESH_MIN_MS)) return jwksCache.keys;
  if (typeof fetch !== 'function') return null;
  try {
    const resp = await fetch(`https://${team}.cloudflareaccess.com/cdn-cgi/access/certs`);
    if (!resp.ok) return cacheFresh ? jwksCache.keys : null;
    const keys = parseJwks(await resp.json());
    if (!keys) return null;
    jwksCache = { team, keys, fetchedAt: now };
    return keys;
  } catch (e) {
    return cacheFresh ? jwksCache.keys : null;
  }
}

/**
 * Verify a Cloudflare Access application token (Cf-Access-Jwt-Assertion).
 * Every check is mandatory: RS256 + kid, signature against a JWKS key, iss === https://<team>.cloudflareaccess.com,
 * aud contains CF_ACCESS_AUD, exp present and in the future, nbf (if present) not in the future, email present.
 * If Access is not configured the result is always invalid.
 */
async function verifyCloudflareAccessJWT(jwtToken, env = {}) {
  if (!isAccessConfigured(env)) {
    return { valid: false, error: 'Cloudflare Access is not enabled on this deployment' };
  }
  if (!jwtToken || typeof jwtToken !== 'string' || jwtToken.length > 8192) {
    return { valid: false, error: 'Missing or malformed JWT token' };
  }
  const parts = jwtToken.split('.');
  if (parts.length !== 3) {
    return { valid: false, error: 'JWT must have 3 dot-separated segments' };
  }

  let header, payload;
  try {
    header = base64UrlDecodeJson(parts[0]);
    payload = base64UrlDecodeJson(parts[1]);
  } catch (e) {
    return { valid: false, error: 'Failed to parse JWT JSON segments' };
  }
  if (!header || header.alg !== 'RS256' || typeof header.kid !== 'string' || !header.kid) {
    return { valid: false, error: 'Unsupported JWT header (RS256 with kid required)' };
  }
  if (!payload || typeof payload !== 'object') {
    return { valid: false, error: 'Malformed JWT payload' };
  }

  // Signature first: nothing in the payload is meaningful until it is authentic.
  const keys = await getAccessKeys(env, header.kid);
  const jwk = keys && keys.find(k => k.kid === header.kid && k.kty === 'RSA' && (!k.alg || k.alg === 'RS256'));
  if (!jwk) {
    return { valid: false, error: 'No matching Cloudflare Access signing key' };
  }
  try {
    const key = await cryptoSubtle.importKey(
      'jwk',
      { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const ok = await cryptoSubtle.verify(
      'RSASSA-PKCS1-v1_5',
      key,
      base64UrlDecode(parts[2]),
      new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
    );
    if (!ok) return { valid: false, error: 'Cryptographic signature verification failed' };
  } catch (e) {
    return { valid: false, error: 'Signature verification error' };
  }

  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== 'number' || payload.exp + ACCESS_CLOCK_SKEW_S < now) {
    return { valid: false, error: 'Token has expired or has no expiry' };
  }
  if (typeof payload.nbf === 'number' && payload.nbf - ACCESS_CLOCK_SKEW_S > now) {
    return { valid: false, error: 'Token is not yet active (nbf in future)' };
  }
  if (payload.iss !== `https://${env.CF_ACCESS_TEAM_NAME}.cloudflareaccess.com`) {
    return { valid: false, error: 'Issuer mismatch' };
  }
  const audList = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!audList.includes(env.CF_ACCESS_AUD)) {
    return { valid: false, error: 'Audience mismatch' };
  }
  const email = payload.email;
  if (typeof email !== 'string' || !email.includes('@')) {
    return { valid: false, error: 'No email identity found in JWT payload' };
  }
  return { valid: true, email: email.trim().toLowerCase(), payload };
}

/** CSRF token for the Access path: derived from (and therefore only knowable with) the verified JWT itself. */
async function deriveAccessCsrfToken(jwt) {
  const digest = await cryptoSubtle.digest('SHA-256', new TextEncoder().encode('regional-admin-csrf-v1:' + jwt));
  return bytesToHex(new Uint8Array(digest));
}

/**
 * Verify that the incoming request is authorized for the given region.
 * 1. Cloudflare Access (only if configured; cryptographically verified JWT, never the plain email header)
 * 2. Session cookie (admin_session) issued for THIS region
 * 3. Authorization: Bearer <session token>
 */
async function authenticateRequest(request, db, currentRegion, env = {}) {
  if (!db) {
    return { authorized: false, status: 500, error: 'Database binding missing' };
  }

  const cfJwt = request.headers.get('Cf-Access-Jwt-Assertion');
  const cfEmailHeader = request.headers.get('Cf-Access-Authenticated-User-Email');

  // A bare identity header is trivially forgeable by any client: never accept it as an identity.
  if (cfEmailHeader && !cfJwt) {
    return {
      authorized: false,
      status: 401,
      error: 'Security Warning: Unverified Cloudflare Access identity header rejected. Valid Cf-Access-Jwt-Assertion required.',
    };
  }

  if (cfJwt && isAccessConfigured(env)) {
    const jwtResult = await verifyCloudflareAccessJWT(cfJwt, env);
    if (!jwtResult.valid) {
      return { authorized: false, status: 401, error: `Cloudflare Access verification failed: ${jwtResult.error}` };
    }

    const user = await db.prepare(
      "SELECT id, username, email, allowed_region, is_active FROM admin_users WHERE lower(email) = ? AND is_active = 1"
    ).bind(jwtResult.email).first();

    if (!user) {
      return { authorized: false, status: 403, error: 'Cloudflare Access identity is not registered as an admin.' };
    }
    if (user.allowed_region !== '*' && user.allowed_region !== currentRegion) {
      return { authorized: false, status: 403, error: 'Access Denied: this account is not permitted for this region.' };
    }
    const csrfToken = await deriveAccessCsrfToken(cfJwt);
    return {
      authorized: true,
      authMethod: 'cf-access',
      user,
      csrfToken,
      session: { csrfToken },
    };
  }
  // Access not configured: any Cf-Access-* headers are ignored (they carry no authority here).

  const cookies = parseCookies(request.headers.get('Cookie'));
  let token = cookies['admin_session'];
  if (!token) {
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
  }
  if (!token) {
    return { authorized: false, status: 401, error: 'Authentication required. Please log in.' };
  }

  const sessionRow = await db.prepare(
    `SELECT s.token, s.csrf_token, s.expires_at, s.region_id,
            u.id as user_id, u.username, u.email, u.allowed_region, u.is_active
     FROM admin_sessions s
     JOIN admin_users u ON s.user_id = u.id
     WHERE s.token = ? AND u.is_active = 1`
  ).bind(token).first();

  if (!sessionRow) {
    return { authorized: false, status: 401, error: 'Invalid or expired session token.' };
  }
  if (new Date(sessionRow.expires_at) < new Date()) {
    try {
      await db.prepare("DELETE FROM admin_sessions WHERE token = ?").bind(token).run();
    } catch (e) {}
    return { authorized: false, status: 401, error: 'Session has expired. Please log in again.' };
  }

  // A session is only valid for the region it was issued for.
  if (sessionRow.region_id !== currentRegion) {
    return { authorized: false, status: 403, error: 'Region Access Forbidden: this session belongs to another region.' };
  }
  const userRegion = sessionRow.allowed_region;
  if (userRegion !== '*' && userRegion !== currentRegion) {
    return {
      authorized: false,
      status: 403,
      error: `Region Access Forbidden: You have '${userRegion}' admin rights, but this is the '${currentRegion}' admin area.`
    };
  }

  return {
    authorized: true,
    authMethod: 'session',
    user: {
      id: sessionRow.user_id,
      username: sessionRow.username,
      email: sessionRow.email,
      allowed_region: sessionRow.allowed_region,
    },
    csrfToken: sessionRow.csrf_token,
    session: {
      csrfToken: sessionRow.csrf_token,
      expiresAt: sessionRow.expires_at,
    },
  };
}

module.exports = {
  SESSION_TTL_SECONDS,
  IP_FAIL_LIMIT,
  USER_FAIL_LIMIT,
  hashPassword,
  verifyPassword,
  getRandomBytes,
  bytesToHex,
  hexToBytes,
  timingSafeEqual,
  generateToken,
  parseCookies,
  createSessionCookie,
  clearSessionCookie,
  checkRateLimit,
  recordFailedLogin,
  clearFailedLogins,
  authenticateRequest,
  verifyCloudflareAccessJWT,
  isAccessConfigured,
  deriveAccessCsrfToken,
  base64UrlDecode,
  base64UrlDecodeJson,
};
