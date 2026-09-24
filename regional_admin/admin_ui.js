// -*- coding: utf-8 -*-
/**
 * Regional Admin page shell (Korean). Renders /admin: static HTML + CSS, the shared schedule engine
 * and admin_client.js (the actual SPA), all under a nonce-only script CSP.
 *
 * admin_client.js and the two engines are real JS files. In a build, bundle_worker.py injects them as string modules
 * ('./admin_client_source' ...); when this file is loaded straight from the repo (tests) they are read from disk.
 */

function loadSource(name) {
  try {
    return require('./' + name + '_source');
  } catch (e) {
    return require('fs').readFileSync(require('path').join(__dirname, name + '.js'), 'utf8');
  }
}

/** JSON that is safe inside an inline <script>: no "</script>", no HTML comment openers, no line separators. */
function safeJson(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .split(String.fromCharCode(0x2028)).join('\\u2028')
    .split(String.fromCharCode(0x2029)).join('\\u2029');
}

function escapeHtml(s) {
  return String(s === undefined || s === null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const STYLES = `
    :root {
      --bg: #F4F6F8;
      --surface: #FFFFFF;
      --border: #DDE2E5;
      --ink: #1B242C;
      --ink-soft: #5A6A78;
      --ink-faint: #8E9BA6;
      --primary: #0F52BA;
      --primary-hover: #0C4194;
      --primary-light: #EBF2FC;
      --accent: #E3A855;
      --danger: #D9383A;
      --danger-light: #FDECEC;
      --good: #2E8B57;
      --good-light: #EAF6F0;
      --radius: 8px;
      --shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans KR", sans-serif;
      background: var(--bg);
      color: var(--ink);
      line-height: 1.5;
      font-size: 14px;
    }
    header {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 14px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .header-left { display: flex; align-items: center; gap: 12px; }
    .region-badge {
      background: var(--primary-light);
      color: var(--primary);
      font-weight: 700;
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 20px;
      border: 1px solid rgba(15, 82, 186, 0.2);
    }
    .header-title { font-size: 18px; font-weight: 800; }
    .header-right { display: flex; align-items: center; gap: 12px; }
    .btn {
      padding: 7px 14px;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--ink);
      font-weight: 600;
      cursor: pointer;
      font-size: 13px;
      transition: background .15s, border-color .15s;
    }
    .btn:hover { background: #EDF1F5; }
    .btn-primary {
      background: var(--primary);
      color: #FFF;
      border-color: var(--primary);
    }
    .btn-primary:hover { background: var(--primary-hover); }
    .btn-danger {
      background: var(--danger-light);
      color: var(--danger);
      border-color: rgba(217, 56, 58, 0.3);
    }
    .btn-danger:hover { background: #FCDCDC; }
    .container {
      max-width: 1000px;
      margin: 20px auto;
      padding: 0 16px 60px;
    }
    .tabs-nav {
      display: flex;
      gap: 6px;
      margin-bottom: 20px;
      border-bottom: 2px solid var(--border);
      padding-bottom: 1px;
    }
    .tab-item {
      padding: 10px 18px;
      font-weight: 700;
      cursor: pointer;
      color: var(--ink-soft);
      border-bottom: 3px solid transparent;
      margin-bottom: -3px;
      transition: color .15s, border-color .15s;
    }
    .tab-item.active {
      color: var(--primary);
      border-color: var(--primary);
    }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: var(--shadow);
    }
    .card-title {
      font-size: 16px;
      font-weight: 800;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .form-group {
      margin-bottom: 16px;
    }
    .form-group label {
      display: block;
      font-weight: 700;
      margin-bottom: 6px;
      font-size: 13px;
    }
    .form-control {
      width: 100%;
      padding: 9px 12px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      font-size: 14px;
      color: var(--ink);
    }
    .form-control:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(15, 82, 186, 0.15);
    }
    .help-text {
      font-size: 12px;
      color: var(--ink-faint);
      margin-top: 4px;
    }
    .unconfigured-banner {
      background: #FFF8E6;
      border: 1px solid #FFE08A;
      color: #8A6D00;
      padding: 14px 18px;
      border-radius: var(--radius);
      margin-bottom: 20px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    .table th, .table td {
      padding: 10px 12px;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }
    .table th {
      background: #F8FAFC;
      font-weight: 700;
      color: var(--ink-soft);
      font-size: 12px;
    }
    .tag {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
    }
    .tag-cancel { background: #FFE8E8; color: #D9383A; }
    .tag-active { background: #EBF2FC; color: #0F52BA; }
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      padding: 12px 20px;
      border-radius: var(--radius);
      color: #FFF;
      font-weight: 600;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      z-index: 1000;
      display: none;
    }
    .toast-success { background: var(--good); }
    .toast-error { background: var(--danger); }
    .login-box {
      max-width: 400px;
      margin: 80px auto;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 30px;
      box-shadow: var(--shadow);
    }
    .preview-box {
      background: #F8FAFC;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 14px;
      margin-top: 14px;
    }
    .preview-timeline {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 10px;
      max-height: 280px;
      overflow-y: auto;
    }
    .preview-item {
      display: flex;
      justify-content: space-between;
      padding: 6px 10px;
      background: #FFF;
      border: 1px solid #E5E9EC;
      border-radius: 4px;
      font-size: 13px;
    }
    .preview-item.cancellation {
      background: #FFF5F5;
      border-color: #FED7D7;
      color: #C53030;
    }
    .week-nav-grid {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 6px;
      margin-bottom: 16px;
    }
    .week-nav-btn {
      padding: 8px 4px;
      text-align: center;
      border: 1px solid var(--border);
      background: var(--surface);
      border-radius: 6px;
      cursor: pointer;
      font-weight: 700;
      font-size: 12px;
    }
    .week-nav-btn.active {
      background: var(--primary);
      color: #FFF;
      border-color: var(--primary);
    }
    .item-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      background: #FDFDFD;
      border: 1px solid var(--border);
      padding: 8px 10px;
      border-radius: 6px;
    }
    .item-row input {
      flex: 1;
    }
    .move-btn {
      padding: 4px 8px;
      font-size: 11px;
    }
`;

function renderAdminHtml(regionId, regionName, currentUser = null, csrfToken = '', nonce = '') {
  const badge = regionId === 'jeonju' ? '전주' : (regionId === 'ulsan' ? '울산' : regionId);
  const title = `2026-2027 ${regionName} 관리자`;
  const nonceAttr = nonce ? ` nonce="${escapeHtml(nonce)}"` : '';
  const boot = safeJson({ regionId, regionName, csrfToken: csrfToken || '' });

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>${escapeHtml(title)}</title>
  <style>${STYLES}</style>
</head>
<body>

<header>
  <div class="header-left">
    <span class="region-badge">${escapeHtml(badge)}</span>
    <h1 class="header-title">${escapeHtml(title)}</h1>
  </div>
  <div class="header-right">
    <span id="user-info" style="font-weight: 600; color: var(--ink-soft); font-size: 13px;"></span>
    <button type="button" class="btn btn-danger" id="logout-btn" style="display:none;" data-act="logout">로그아웃</button>
  </div>
</header>

<div class="container" id="app-container">
  <div style="text-align:center; padding: 60px 0; color: var(--ink-faint);">로딩 중...</div>
</div>

<div class="toast toast-success" id="toast-success" role="status"></div>
<div class="toast toast-error" id="toast-error" role="alert"></div>

<script${nonceAttr}>
window.__ADMIN_BOOT = ${boot};
${loadSource('schedule_engine')}
${loadSource('distribution_engine')}
${loadSource('admin_client')}
</script>
</body>
</html>`;
}

module.exports = {
  renderAdminHtml,
  safeJson,
};
