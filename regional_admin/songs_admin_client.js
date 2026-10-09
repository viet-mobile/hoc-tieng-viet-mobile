// -*- coding: utf-8 -*-
/**
 * SECTION G -- the song editor of /admin (browser side; embedded by admin_ui.js after song_rules.js and before admin_client.js).
 *
 * Edits every song of the three collections (왕국 노래 / 오리지널 송 / 어린이 노래) and adds new ones: the lines of each language (split, merge,
 * insert, delete, edit), the start / end time of every sung line in its recording, the recording's URL and the jw.org media key of the
 * JW.ORG badge. An edit is saved as a DRAFT (D1), previewed on the public site (?songdraft=1, admin session only), and published; the public
 * site applies published edits at run time, unpublishing returns the song to the data of the build. The song starts from songs_baseline.json
 * (what the build shows). The shape of an edit and its rules are song_rules.js (the worker validates the same way).
 *
 * Provided by admin_client.js through SongsAdmin.render(container, {api, esc, toast}); no inline handlers (delegated, data-sg / data-sg-f).
 */
(function () {
  'use strict';
  var R = window.SongRules;
  var KIND_LABEL = { kingdom: '왕국 노래', original: '오리지널 송', children: '어린이 노래' };
  var LANG_LABEL = { vi: '베트남어', ko: '한국어', en: '영어', ja: '일본어', zh: '중국어(번체)', zh_cn: '중국어(간체)', fr: '프랑스어', de: '독일어', pl: '폴란드어', cs: '체코어', hu: '헝가리어', id: '인도네시아어' };
  var LANG_ORDER = ['vi', 'ko', 'en', 'ja', 'zh_cn', 'zh', 'fr', 'de', 'pl', 'cs', 'hu', 'id'];
  // jw.org's language code (langwritten) of each language, for the official markers
  var JW_CODE = { vi: 'VT', ko: 'KO', en: 'E', ja: 'J', zh: 'CH', zh_cn: 'CHS', fr: 'F', de: 'X', pl: 'P', cs: 'B', hu: 'H', id: 'I' };
  var ACTION_LABEL = { draft: '초안 저장', publish: '게시', unpublish: '게시 취소', discard: '초안 버림', restore: '이전 버전 복원' };

  var ctx = null, root = null;
  var S = {
    baseline: null, byKey: {}, edits: {}, revision: 0, kind: 'original', q: '', loading: false,
    cur: null,   // the open editor: { songKey, kind, key, isNew, number, titles, scripture, note, langs: {lang: L}, lang, version, published, history, dirty }
    audioStop: 0
  };
  // L (one language in the editor): { lines: [{t, s, e}], url, linkKind, linkKey, touched }; s / e are ms or null; touched = changed against the baseline

  function esc(v) { return ctx.esc(v); }
  function $(sel, el) { return (el || root).querySelector(sel); }
  function songKey(kind, key) { return kind + ':' + key; }

  /* ---------------- time helpers ---------------- */
  function fmt(ms) {
    if (ms === null || ms === undefined || ms === '') return '';
    var t = Math.max(0, Math.round(ms)), h = Math.floor(t / 3600000), m = Math.floor(t / 60000) % 60, s = Math.floor(t / 1000) % 60, x = t % 1000;
    var pad = function (n, w) { var o = String(n); while (o.length < w) o = '0' + o; return o; };
    return (h ? h + ':' + pad(m, 2) : m) + ':' + pad(s, 2) + '.' + pad(x, 3);
  }
  function parseTime(text) {
    var t = String(text || '').trim();
    if (!t) return null;
    if (/^\d+(\.\d+)?$/.test(t)) return Math.round(parseFloat(t) * 1000);   // plain seconds
    var m = /^(?:(\d+):)?(\d{1,2}):(\d{1,2}(?:\.\d{1,3})?)$/.exec(t);
    return m ? Math.round(((+m[1] || 0) * 3600 + (+m[2]) * 60 + parseFloat(m[3])) * 1000) : NaN;
  }

  /* ---------------- data ---------------- */
  function loadAll() {
    S.loading = true;
    var base = S.baseline ? Promise.resolve() : fetch('/songs_baseline.json', { credentials: 'same-origin' }).then(function (r) {
      if (!r.ok) throw new Error('baseline ' + r.status);
      return r.json();
    }).then(function (j) {
      S.baseline = j.songs; S.byKey = {};
      j.songs.forEach(function (s) { S.byKey[songKey(s.kind, s.key)] = s; });
    });
    return Promise.all([base, ctx.api('GET', '/api/admin/songs')]).then(function (both) {
      var r = both[1];
      if (!r.ok) throw new Error((r.data && r.data.error) || '노래 편집 목록을 불러오지 못했습니다.');
      S.edits = {}; r.data.songs.forEach(function (e) { S.edits[e.songKey] = e; });
      S.revision = r.data.revision; S.loading = false;
    }).catch(function (e) { S.loading = false; S.error = String(e && e.message || e); });
  }

  // The editor state of a song from (the saved draft, else the published copy) over the baseline.
  function openSong(kind, key, isNew) {
    var sk = songKey(kind, key);
    return ctx.api('GET', '/api/admin/songs/' + encodeURIComponent(sk)).then(function (r) {
      if (!r.ok) throw new Error((r.data && r.data.error) || '노래를 불러오지 못했습니다.');
      var d = r.data, base = S.byKey[sk] || { kind: kind, key: key, number: parseInt(String(key).replace(/\D+/g, ''), 10) || 0, titles: {}, scripture: {}, lines: {}, media: {} };
      var edit = d.draft || d.published || null;
      var cur = { songKey: sk, kind: kind, key: key, isNew: !!(edit && edit.isNew) || !!isNew || !S.byKey[sk], number: (edit && edit.number) || base.number,
        titles: Object.assign({}, base.titles, edit && edit.titles), scripture: Object.assign({}, base.scripture, edit && edit.scripture),
        note: (edit && edit.note) || '', langs: {}, lang: 'vi', version: d.version, hasDraft: !!d.draft, published: d.published, history: d.history || [], dirty: false };
      R.LANGS.forEach(function (lg) {
        var e = edit && edit.langs && edit.langs[lg], bl = base.lines[lg] || [], lines = (e && e.lines) || bl, media = (e && e.link) || base.media[lg] || null;
        var times = e && e.times, k = 0;
        cur.langs[lg] = {
          lines: lines.map(function (t) {
            var tm = R.isSingable(t) && times ? times[k++] : (R.isSingable(t) ? (k++, null) : null);
            return { t: t, s: tm ? tm.s : null, e: tm ? tm.e : null };
          }),
          url: (e && e.audio && e.audio.url) || '', linkKind: media ? media.kind : '', linkKey: media ? media.mediaKey : '',
          touched: !!e
        };
      });
      cur.lang = cur.langs.vi.lines.length || kind === 'kingdom' ? 'vi' : 'ko';
      S.cur = cur;
    });
  }

  // The edit to save: only the languages that differ from the build (or carry a time / recording), kingdom rows all together.
  function buildEdit() {
    var c = S.cur, base = S.byKey[c.songKey] || { lines: {}, media: {}, titles: {}, scripture: {} };
    var out = { v: 1, kind: c.kind, key: c.key, isNew: !!c.isNew, number: c.number, titles: {}, scripture: {}, langs: {}, note: c.note || '' };
    Object.keys(c.titles).forEach(function (lg) { if (c.titles[lg] && c.titles[lg] !== (base.titles || {})[lg]) out.titles[lg] = c.titles[lg]; });
    if (c.isNew) out.titles = Object.assign({}, c.titles);
    Object.keys(c.scripture).forEach(function (lg) { if (c.scripture[lg] && c.scripture[lg] !== (base.scripture || {})[lg]) out.scripture[lg] = c.scripture[lg]; });
    var viRows = c.langs.vi.lines.length, baseRows = (base.lines.vi || []).length;
    var structural = c.kind === 'kingdom' && viRows !== baseRows;
    R.LANGS.forEach(function (lg) {
      var L = c.langs[lg], texts = L.lines.map(function (x) { return x.t; }), bl = base.lines[lg] || [];
      var textChanged = c.kind === 'kingdom' ? (structural || texts.join('\n') !== bl.join('\n')) : texts.join('\n') !== bl.join('\n');
      var sing = L.lines.filter(function (x) { return R.isSingable(x.t); });
      var hasTimes = sing.some(function (x) { return x.s !== null && x.e !== null; });
      var bm = base.media[lg], linkChanged = !!L.linkKey && (!bm || bm.mediaKey !== L.linkKey || bm.kind !== L.linkKind);
      if (!textChanged && !hasTimes && !L.url && !linkChanged) return;
      var o = {};
      if (textChanged || hasTimes || c.kind === 'kingdom' && structural) o.lines = texts;
      if (hasTimes) o.times = sing.map(function (x) { return x.s !== null && x.e !== null ? { s: x.s, e: x.e } : null; });
      if (L.url) o.audio = { url: L.url };
      if (linkChanged && c.kind !== 'kingdom') o.link = { kind: L.linkKind, mediaKey: L.linkKey };
      if (Object.keys(o).length) out.langs[lg] = o;
    });
    // a kingdom edit that changes rows needs vi as the master row list
    if (c.kind === 'kingdom' && Object.keys(out.langs).some(function (lg) { return out.langs[lg].lines; }) && !(out.langs.vi && out.langs.vi.lines)) out.langs.vi = Object.assign(out.langs.vi || {}, { lines: c.langs.vi.lines.map(function (x) { return x.t; }) });
    return out;
  }

  /* ---------------- rendering ---------------- */
  function statusOf(sk) {
    var e = S.edits[sk];
    if (!e) return '';
    return e.unpublishedChanges ? (e.hasPublished ? '게시됨 + 수정 중' : (e.isNew ? '새 노래(초안)' : '초안')) : (e.hasPublished ? '게시됨' : '초안');
  }
  function render(container, c) {
    ctx = c; root = container;
    if (!S.baseline && !S.loading && !S.error) { root.innerHTML = '<div class="card">노래 목록을 불러오는 중...</div>'; loadAll().then(draw); return; }
    draw();
  }
  function draw() {
    if (!root || !root.isConnected) return;
    if (S.error) { root.innerHTML = '<div class="card"><div class="card-title">노래 편집</div><p>' + esc(S.error) + '</p><button type="button" class="btn" data-sg="reload">다시 시도</button></div>'; return; }
    root.innerHTML = S.cur ? editorHtml() : listHtml();
    if (S.cur) loadAudioInto(false);
  }

  function listHtml() {
    var q = S.q.trim().toLowerCase(), pending = Object.keys(S.edits).filter(function (k) { return S.edits[k].unpublishedChanges; }).length;
    var songs = S.baseline.filter(function (s) { return s.kind === S.kind; });
    Object.keys(S.edits).forEach(function (k) {   // new songs (not in the baseline)
      var e = S.edits[k]; if (e.kind === S.kind && !S.byKey[k]) songs.push({ kind: e.kind, key: k.split(':')[1], number: parseInt(k.split(':')[1].replace(/\D+/g, ''), 10) || 0, titles: { ko: e.title } });
    });
    songs.sort(function (a, b) { return a.number - b.number || (a.key < b.key ? -1 : 1); });
    var rows = songs.filter(function (s) {
      if (!q) return true;
      return (s.number + ' ' + s.key + ' ' + (s.titles.ko || '') + ' ' + (s.titles.vi || '')).toLowerCase().indexOf(q) >= 0;
    }).map(function (s) {
      var sk = songKey(s.kind, s.key), st = statusOf(sk);
      return '<tr><td>' + esc(s.key) + '</td><td>' + esc(s.titles.ko || s.titles.vi || '') + '<div class="sg-sub">' + esc(s.titles.vi || '') + '</div></td><td>' +
        (st ? '<span class="sg-badge sg-badge-' + (S.edits[sk].unpublishedChanges ? 'draft' : 'pub') + '">' + esc(st) + '</span>' : '') +
        '</td><td><button type="button" class="btn move-btn" data-sg="open" data-kind="' + esc(s.kind) + '" data-key="' + esc(s.key) + '">편집</button></td></tr>';
    }).join('');
    var tabs = R.KINDS.map(function (k) {
      return '<button type="button" class="week-nav-btn' + (S.kind === k ? ' active' : '') + '" data-sg="kind" data-kind="' + k + '">' + esc(KIND_LABEL[k]) + '</button>';
    }).join('');
    return STYLE + '<div class="card"><div class="card-title"><span>SECTION G — 노래 편집·게시</span>' +
      '<span><button type="button" class="btn" data-sg="new">+ 새 노래</button> ' +
      '<button type="button" class="btn btn-primary" data-sg="publish-all"' + (pending ? '' : ' disabled') + '>수정 중인 노래 ' + pending + '곡 모두 게시</button></span></div>' +
      '<p class="sg-sub">초안으로 저장 → 미리보기 → 게시하면 사이트에 바로 반영됩니다(재배포 없음). 게시를 취소하면 그 노래는 빌드에 들어 있는 원래 내용으로 돌아갑니다.</p>' +
      '<div class="week-nav">' + tabs + '</div>' +
      '<input type="search" class="sg-search" data-sg-f="q" placeholder="번호 또는 제목 검색" value="' + esc(S.q) + '">' +
      '<table class="sg-table"><thead><tr><th>번호</th><th>제목</th><th>상태</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  }

  var STYLE = '<style>.sg-sub{color:var(--ink-faint);font-size:12px}.sg-table{width:100%;border-collapse:collapse}.sg-table td,.sg-table th{padding:6px;border-bottom:1px solid var(--line,#ddd);text-align:left;vertical-align:top}' +
    '.sg-badge{display:inline-block;padding:2px 8px;border-radius:10px;font-size:12px;background:#E8EEF5}.sg-badge-draft{background:#FFF1CC}.sg-badge-pub{background:#DDF3E3}' +
    '.sg-search{width:100%;margin:8px 0;padding:8px;box-sizing:border-box}.sg-line{display:grid;grid-template-columns:32px 1fr;gap:6px;padding:6px 0;border-bottom:1px solid var(--line,#ddd)}' +
    '.sg-line textarea{width:100%;box-sizing:border-box;min-height:34px;resize:vertical}.sg-time{display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin-top:4px}.sg-time input{width:92px}' +
    '.sg-struct{opacity:.75}.sg-langs{display:flex;flex-wrap:wrap;gap:4px;margin:8px 0}.sg-field{display:flex;gap:6px;align-items:center;margin:6px 0;flex-wrap:wrap}.sg-field input[type=text],.sg-field input:not([type]){flex:1;min-width:160px}' +
    '.sg-markers{max-height:180px;overflow:auto;font-size:12px;border:1px solid var(--line,#ddd);padding:4px;margin:6px 0}</style>';

  function langTab(lg) {
    var L = S.cur.langs[lg], on = S.cur.lang === lg;
    var has = L.lines.length || L.url;
    return '<button type="button" class="week-nav-btn' + (on ? ' active' : '') + '" data-sg="lang" data-lang="' + lg + '">' + esc(LANG_LABEL[lg]) + (has ? '' : ' ·') + (L.touched ? ' ✎' : '') + '</button>';
  }

  function editorHtml() {
    var c = S.cur, L = c.langs[c.lang], k = 0;
    var lineRows = L.lines.map(function (x, i) {
      var sing = R.isSingable(x.t), n = sing ? ++k : 0;
      var t = sing ? '<div class="sg-time"><span class="sg-sub">소절 ' + n + '</span> 시작 <input type="text" data-sg-f="s" data-i="' + i + '" value="' + esc(fmt(x.s)) + '" placeholder="0:00.000" inputmode="decimal">' +
        '<button type="button" class="btn move-btn" data-sg="cap-s" data-i="' + i + '" title="재생 위치를 시작으로">시작=현재</button> 끝 <input type="text" data-sg-f="e" data-i="' + i + '" value="' + esc(fmt(x.e)) + '" placeholder="0:00.000" inputmode="decimal">' +
        '<button type="button" class="btn move-btn" data-sg="cap-e" data-i="' + i + '" title="재생 위치를 끝으로">끝=현재</button>' +
        '<button type="button" class="btn move-btn" data-sg="seg-play" data-i="' + i + '">▶ 구간</button></div>' : '<div class="sg-sub">구분 표시(소리 없음)</div>';
      return '<div class="sg-line' + (sing ? '' : ' sg-struct') + '"><div class="sg-sub">' + (i + 1) + '</div><div>' +
        '<textarea data-sg-f="t" data-i="' + i + '" rows="1">' + esc(x.t) + '</textarea>' + t +
        '<div class="sg-time"><button type="button" class="btn move-btn" data-sg="up" data-i="' + i + '" aria-label="위로">▲</button><button type="button" class="btn move-btn" data-sg="down" data-i="' + i + '" aria-label="아래로">▼</button>' +
        '<button type="button" class="btn move-btn" data-sg="split" data-i="' + i + '" title="커서 위치에서 둘로 나눔">나누기</button>' +
        '<button type="button" class="btn move-btn" data-sg="merge" data-i="' + i + '"' + (i + 1 < L.lines.length ? '' : ' disabled') + ' title="다음 줄과 합침">다음 줄과 합치기</button>' +
        '<button type="button" class="btn move-btn" data-sg="ins" data-i="' + i + '">+ 아래에 줄</button>' +
        '<button type="button" class="btn btn-danger move-btn" data-sg="del" data-i="' + i + '" aria-label="삭제">✕</button></div></div></div>';
    }).join('');
    var st = statusOf(c.songKey), kingdomNote = c.kind === 'kingdom' ? '<p class="sg-sub">왕국 노래는 모든 언어의 줄이 같은 위치에서 짝을 이룹니다. 줄을 나누거나 합치거나 넣거나 지우면 모든 언어에 함께 적용됩니다(다른 언어의 새 줄은 비어 있으니 채워 주세요).</p>' : '';
    var linkRow = c.kind === 'kingdom' ? '' : '<div class="sg-field"><label>JW.ORG 링크</label><select data-sg-f="linkKind"><option value="">(없음)</option><option value="VIDEO"' + (L.linkKind === 'VIDEO' ? ' selected' : '') + '>VIDEO</option><option value="AUDIO"' + (L.linkKind === 'AUDIO' ? ' selected' : '') + '>AUDIO</option></select>' +
      '<input type="text" data-sg-f="linkKey" placeholder="pub-osg_5_VIDEO" value="' + esc(L.linkKey) + '"></div>';
    var hist = (c.history || []).map(function (h) {
      return '<tr><td>' + esc(h.createdAt) + '</td><td>' + esc(ACTION_LABEL[h.action] || h.action) + '</td><td>' + esc(h.username) + '</td><td>' + esc(h.summary ? h.summary.title : '') +
        '</td><td>' + (h.restorable ? '<button type="button" class="btn move-btn" data-sg="restore" data-id="' + h.id + '">초안으로 복원</button>' : '') + '</td></tr>';
    }).join('');
    var titleFields = ['ko', 'vi'].concat(c.kind === 'kingdom' ? LANG_ORDER.slice(2) : []).map(function (lg) {
      return '<div class="sg-field"><label>제목(' + esc(LANG_LABEL[lg]) + ')</label><input type="text" data-sg-f="title" data-lang="' + lg + '" value="' + esc(c.titles[lg] || '') + '"></div>';
    }).join('');
    return STYLE + '<div class="card"><div class="card-title"><span>' + esc(KIND_LABEL[c.kind]) + ' ' + esc(c.key) + (c.isNew ? ' (새 노래)' : '') + '</span>' +
      '<span><button type="button" class="btn" data-sg="back">← 목록</button></span></div>' +
      '<div class="sg-sub">상태: ' + esc(st || '변경 없음') + ' · 버전 ' + c.version + (c.dirty ? ' · <b>저장하지 않은 변경 있음</b>' : '') + '</div>' +
      '<div class="sg-field"><button type="button" class="btn btn-primary" data-sg="save">초안 저장</button>' +
      '<button type="button" class="btn" data-sg="undo"' + (c.dirty ? '' : ' disabled') + '>저장 전 변경 모두 되돌리기</button>' +
      '<button type="button" class="btn" data-sg="preview">미리보기 열기(실제 플레이어)</button>' +
      '<button type="button" class="btn btn-primary" data-sg="publish"' + (c.hasDraft && !c.dirty ? '' : ' disabled') + '>게시</button>' +
      '<button type="button" class="btn" data-sg="unpublish"' + (c.published ? '' : ' disabled') + '>게시 취소(원래대로)</button>' +
      '<button type="button" class="btn btn-danger" data-sg="discard"' + (c.hasDraft ? '' : ' disabled') + '>초안 버리기</button></div>' +
      titleFields + '<div class="sg-field"><label>메모</label><input type="text" data-sg-f="note" value="' + esc(c.note) + '"></div>' + kingdomNote +
      '<div class="sg-langs">' + LANG_ORDER.map(langTab).join('') + '</div>' +
      '<div class="card-title"><span>' + esc(LANG_LABEL[c.lang]) + ' 가사 · 시간 마커 · 음원</span></div>' +
      '<div class="sg-field"><label>음원 주소</label><input type="text" data-sg-f="url" placeholder="https://….jw-cdn.org/….mp3" value="' + esc(L.url) + '">' +
      '<button type="button" class="btn" data-sg="load-audio">음원 불러오기</button></div>' + linkRow +
      '<div class="sg-field"><label>JW 공식 마커</label><input type="text" data-sg-f="pub" placeholder="출판물 예: osg" style="max-width:110px;flex:none"><input type="text" data-sg-f="track" placeholder="트랙 번호" style="max-width:100px;flex:none">' +
      '<button type="button" class="btn" data-sg="official">공식 마커·음원 불러오기</button><button type="button" class="btn" data-sg="fill-official" disabled>마커를 소절에 채우기</button></div>' +
      '<div id="sg-markers"></div>' +
      '<audio id="sg-audio" controls preload="none" style="width:100%"></audio>' +
      '<p class="sg-sub">시간은 m:ss.mmm 또는 초 단위(예: 1:43.000, 103)로 입력합니다. 노래하는 줄마다 시작·끝이 모두 있어야 ▶ ↻ 버튼이 생깁니다(비워 두면 그 줄은 버튼 없음).</p>' +
      lineRows + '<div class="sg-field"><button type="button" class="btn" data-sg="add-end">+ 맨 아래에 줄 추가</button></div></div>' +
      '<div class="card"><div class="card-title"><span>변경 이력</span></div>' + (hist ? '<table class="sg-table"><thead><tr><th>시각</th><th>작업</th><th>사용자</th><th>제목</th><th></th></tr></thead><tbody>' + hist + '</tbody></table>' : '<p class="sg-sub">아직 이력이 없습니다.</p>') + '</div>';
  }

  /* ---------------- actions ---------------- */
  function say(msg, isErr) { ctx.toast(msg, !!isErr); }
  function mark() { S.cur.dirty = true; S.cur.langs[S.cur.lang].touched = true; }
  function lang() { return S.cur.langs[S.cur.lang]; }
  // kingdom: a structure change applies to every language at the same index
  function eachRowLang(fn) { if (S.cur.kind === 'kingdom') R.LANGS.forEach(function (lg) { fn(S.cur.langs[lg].lines, lg); S.cur.langs[lg].touched = true; }); else fn(lang().lines, S.cur.lang); }

  function saveDraft() {
    var c = S.cur, edit;
    try { edit = buildEdit(); } catch (e) { say(String(e.message || e), true); return Promise.resolve(); }
    return ctx.api('PUT', '/api/admin/songs/' + encodeURIComponent(c.songKey), { baseVersion: c.version, edit: edit }).then(function (r) {
      if (!r.ok) { say((r.data && r.data.error) || '저장하지 못했습니다.', true); return false; }
      say('초안을 저장했습니다.'); c.version = r.data.version; c.hasDraft = true; c.dirty = false;
      return reopen(true);
    });
  }
  function reopen(keepLang) {
    var c = S.cur, lg = c.lang;
    return loadAll().then(function () { return openSong(c.kind, c.key, c.isNew); }).then(function () { if (keepLang) S.cur.lang = lg; draw(); });
  }
  function act(name, el) {
    var c = S.cur, i = el && el.getAttribute('data-i') !== null ? parseInt(el.getAttribute('data-i'), 10) : -1;
    switch (name) {
      case 'reload': S.error = null; S.baseline = null; render(root, ctx); return;
      case 'kind': S.kind = el.getAttribute('data-kind'); draw(); return;
      case 'open': openSong(el.getAttribute('data-kind'), el.getAttribute('data-key'), false).then(draw).catch(function (e) { say(e.message, true); }); return;
      case 'back':
        if (c.dirty && !window.confirm('저장하지 않은 변경이 사라집니다. 목록으로 돌아갈까요?')) return;
        S.cur = null; loadAll().then(draw); return;
      case 'new': newSongDialog(); return;
      case 'lang': c.lang = el.getAttribute('data-lang'); draw(); return;
      case 'save': saveDraft(); return;
      case 'undo':
        if (!window.confirm('저장하지 않은 변경을 모두 버리고 마지막 저장 상태로 되돌립니다.')) return;
        reopen(true); return;
      case 'preview':
        window.open('/?songdraft=1', '_blank', 'noopener'); return;
      case 'publish':
        if (!window.confirm('이 노래의 초안을 게시합니다. 사이트에 바로 반영됩니다.')) return;
        ctx.api('POST', '/api/admin/songs/' + encodeURIComponent(c.songKey) + '/publish', { baseVersion: c.version }).then(function (r) {
          if (!r.ok) { say((r.data && r.data.error) || '게시하지 못했습니다.', true); return; }
          say('게시했습니다. 사이트에 바로 반영됩니다.'); reopen(true);
        }); return;
      case 'unpublish':
        if (!window.confirm('게시를 취소하면 이 노래는 빌드에 들어 있는 원래 내용으로 돌아갑니다(새 노래는 사라집니다). 초안은 남습니다.')) return;
        ctx.api('POST', '/api/admin/songs/' + encodeURIComponent(c.songKey) + '/unpublish', {}).then(function (r) {
          if (!r.ok) { say((r.data && r.data.error) || '게시를 취소하지 못했습니다.', true); return; }
          say('게시를 취소했습니다.'); reopen(true);
        }); return;
      case 'discard':
        if (!window.confirm('초안을 버립니다. 게시된 내용은 그대로입니다.')) return;
        ctx.api('POST', '/api/admin/songs/' + encodeURIComponent(c.songKey) + '/discard', {}).then(function (r) {
          if (!r.ok) { say((r.data && r.data.error) || '초안을 버리지 못했습니다.', true); return; }
          say('초안을 버렸습니다.'); S.cur = null; loadAll().then(draw);
        }); return;
      case 'restore':
        if (!window.confirm('이 이력의 내용을 초안으로 불러옵니다(게시는 되지 않습니다).')) return;
        ctx.api('POST', '/api/admin/songs/' + encodeURIComponent(c.songKey) + '/restore', { historyId: parseInt(el.getAttribute('data-id'), 10) }).then(function (r) {
          if (!r.ok) { say((r.data && r.data.error) || '복원하지 못했습니다.', true); return; }
          say('초안으로 복원했습니다.'); reopen(true);
        }); return;
      case 'publish-all':
        if (!window.confirm('수정 중인 노래를 모두 게시합니다. 사이트에 바로 반영됩니다.')) return;
        ctx.api('POST', '/api/admin/songs/publish-all', {}).then(function (r) {
          if (!r.ok) { say((r.data && r.data.error) || '게시하지 못했습니다.', true); return; }
          say(r.data.published.length + '곡을 게시했습니다.'); loadAll().then(draw);
        }); return;
      case 'up': case 'down': {
        var j = name === 'up' ? i - 1 : i + 1;
        if (j < 0 || j >= lang().lines.length) return;
        eachRowLang(function (lines) { var t = lines[i]; lines[i] = lines[j]; lines[j] = t; });
        mark(); draw(); return;
      }
      case 'ins': eachRowLang(function (lines, lg) { lines.splice(i + 1, 0, { t: '', s: null, e: null }); }); mark(); draw(); return;
      case 'add-end': eachRowLang(function (lines) { lines.push({ t: '', s: null, e: null }); }); mark(); draw(); return;
      case 'del':
        if (!window.confirm('이 줄을 지웁니다.' + (c.kind === 'kingdom' ? ' (모든 언어의 같은 줄)' : ''))) return;
        eachRowLang(function (lines) { lines.splice(i, 1); }); mark(); draw(); return;
      case 'split': {
        var ta = root.querySelector('textarea[data-i="' + i + '"]'), pos = ta ? ta.selectionStart : 0, x = lang().lines[i];
        if (!(pos > 0 && pos < x.t.length)) { say('나눌 위치에 커서를 두세요(글자 사이).', true); return; }
        var a = x.t.slice(0, pos).trim(), b = x.t.slice(pos).trim();
        eachRowLang(function (lines, lg) {
          if (lg === c.lang) { lines[i] = { t: a, s: x.s, e: null }; lines.splice(i + 1, 0, { t: b, s: null, e: x.e }); }
          else lines.splice(i + 1, 0, { t: '', s: null, e: null });
        });
        mark(); draw(); return;
      }
      case 'merge': {
        var cur = lang().lines[i], nxt = lang().lines[i + 1];
        if (!nxt) return;
        eachRowLang(function (lines, lg) {
          var p = lines[i], q = lines[i + 1];
          lines.splice(i, 2, { t: (p.t + ' ' + q.t).trim(), s: p.s, e: q.e !== null ? q.e : p.e });
        });
        mark(); draw(); return;
      }
      case 'cap-s': case 'cap-e': {
        var au = $('#sg-audio'); if (!au || !au.src) { say('먼저 음원을 불러오세요.', true); return; }
        var ms = Math.round(au.currentTime * 1000); lang().lines[i][name === 'cap-s' ? 's' : 'e'] = ms; mark(); draw(); loadAudioInto(); return;
      }
      case 'seg-play': playSegment(i); return;
      case 'load-audio': loadAudioInto(true); return;
      case 'official': fetchOfficial(); return;
      case 'fill-official': fillOfficial(); return;
    }
  }

  function loadAudioInto(force) {
    var au = $('#sg-audio'), L = lang();
    if (!au) return;
    if (L.url && R.isJwCdnUrl(L.url)) { if (au.getAttribute('data-src') !== L.url) { au.setAttribute('data-src', L.url); au.src = L.url; } }
    else if (force) say('jw-cdn.org의 https mp3/mp4/m4a 주소를 먼저 입력하세요.', true);
  }
  function playSegment(i) {
    var au = $('#sg-audio'), x = lang().lines[i];
    if (!au || !lang().url) { say('먼저 음원 주소를 입력하세요.', true); return; }
    if (x.s === null || x.e === null || !(x.s < x.e)) { say('시작·끝 시각을 올바르게 입력하세요.', true); return; }
    loadAudioInto(true);
    clearInterval(S.audioStop);
    var go = function () {
      au.currentTime = x.s / 1000; au.play();
      S.audioStop = setInterval(function () { if (au.paused || au.currentTime * 1000 >= x.e - 15) { au.pause(); clearInterval(S.audioStop); } }, 30);
    };
    if (au.readyState >= 1) go(); else { au.addEventListener('loadedmetadata', go, { once: true }); au.load(); }
  }

  var officialMarkers = null;
  function fetchOfficial() {
    var pub = ($('[data-sg-f="pub"]').value || '').trim(), track = ($('[data-sg-f="track"]').value || '').trim();
    var m = /^pub-([a-z]+)_(\d+)_/.exec(lang().linkKey || '');
    if (!pub && m) pub = m[1]; if (!track && m) track = m[2];
    var code = JW_CODE[S.cur.lang];
    ctx.api('GET', '/api/admin/song-markers?pub=' + encodeURIComponent(pub) + '&track=' + encodeURIComponent(track) + '&lang=' + encodeURIComponent(code)).then(function (r) {
      if (!r.ok) { say((r.data && r.data.error) || '불러오지 못했습니다.', true); return; }
      officialMarkers = r.data; lang().url = r.data.url; lang().touched = true; S.cur.dirty = true;
      var sung = r.data.markers.filter(function (x) { return x.pid !== 99; });
      var box = $('#sg-markers');
      box.className = 'sg-markers';
      box.innerHTML = '음원: ' + esc(r.data.url) + '<br>마커 ' + r.data.markers.length + '개(노래 ' + sung.length + '개, pid 99 제외) · 노래하는 줄 ' + lang().lines.filter(function (x) { return R.isSingable(x.t); }).length + '줄<br>' +
        r.data.markers.map(function (x) { return (x.index + 1) + '. ' + fmt(x.s) + ' – ' + fmt(x.s + x.d) + (x.pid === 99 ? ' (간주/후주)' : ''); }).join('<br>');
      var inUrl = $('[data-sg-f="url"]'); if (inUrl) inUrl.value = r.data.url;
      $('[data-sg="fill-official"]').disabled = false;
      loadAudioInto(true);
    });
  }
  function fillOfficial() {
    if (!officialMarkers) return;
    var sung = officialMarkers.markers.filter(function (x) { return x.pid !== 99; }), L = lang(), k = 0;
    var n = L.lines.filter(function (x) { return R.isSingable(x.t); }).length;
    if (sung.length !== n) { say('공식 마커 ' + sung.length + '개와 노래하는 줄 ' + n + '줄의 수가 다릅니다. 줄을 나누거나 합쳐 맞추거나 시간을 직접 입력하세요.', true); return; }
    L.lines.forEach(function (x) { if (R.isSingable(x.t)) { var mk = sung[k++]; x.s = mk.s; x.e = mk.s + mk.d; } });
    mark(); draw(); loadAudioInto();
  }

  function newSongDialog() {
    var kind = S.kind, nums = S.baseline.filter(function (s) { return s.kind === kind; }).map(function (s) { return s.number; });
    Object.keys(S.edits).forEach(function (k) { if (S.edits[k].kind === kind) nums.push(parseInt(k.split(':')[1].replace(/\D+/g, ''), 10) || 0); });
    var next = Math.max.apply(null, nums.concat([0])) + 1;
    var suggestion = kind === 'kingdom' ? String(next) : kind === 'original' ? 'osg-' + next : 'pkon-' + next;
    var key = window.prompt(KIND_LABEL[kind] + ' 새 노래의 번호(주소)를 입력하세요.\n예: ' + suggestion, suggestion);
    if (!key) return;
    key = key.trim();
    if (!R.validKey(kind, key)) { say('번호 형식이 올바르지 않습니다. 예: ' + suggestion, true); return; }
    if (S.byKey[songKey(kind, key)] || S.edits[songKey(kind, key)]) { say('이미 있는 번호입니다. 목록에서 편집하세요.', true); return; }
    var ko = window.prompt('한국어 제목(새 노래에는 한국어 또는 베트남어 제목이 필요합니다):', '');
    var vi = window.prompt('베트남어 제목(없으면 비워 두세요):', '');
    if (!ko && !vi) { say('제목이 필요합니다.', true); return; }
    openSong(kind, key, true).then(function () {
      S.cur.isNew = true; S.cur.titles = { ko: (ko || '').trim(), vi: (vi || '').trim() }; S.cur.dirty = true;
      if (kind === 'kingdom') { S.cur.langs.vi.lines = [{ t: '', s: null, e: null }]; }
      draw();
    }).catch(function (e) { say(e.message, true); });
  }

  /* ---------------- input wiring ---------------- */
  document.addEventListener('click', function (ev) {
    var el = ev.target && ev.target.closest ? ev.target.closest('[data-sg]') : null;
    if (!el || !root || !root.contains(el)) return;
    ev.preventDefault();
    act(el.getAttribute('data-sg'), el);
  });
  document.addEventListener('input', function (ev) {
    var el = ev.target, f = el && el.getAttribute && el.getAttribute('data-sg-f');
    if (!f || !root || !root.contains(el)) return;
    if (f === 'q') { S.q = el.value; var pos = el.selectionStart; draw(); var n = $('[data-sg-f="q"]'); if (n) { n.focus(); n.setSelectionRange(pos, pos); } return; }
    var c = S.cur; if (!c) return;
    var i = parseInt(el.getAttribute('data-i'), 10);
    if (f === 't') c.langs[c.lang].lines[i].t = el.value;
    else if (f === 's' || f === 'e') {
      var v = parseTime(el.value);
      el.style.outline = isNaN(v) ? '2px solid #d33' : '';
      c.langs[c.lang].lines[i][f] = isNaN(v) ? null : v;
    }
    else if (f === 'url') c.langs[c.lang].url = el.value.trim();
    else if (f === 'linkKind') c.langs[c.lang].linkKind = el.value;
    else if (f === 'linkKey') c.langs[c.lang].linkKey = el.value.trim();
    else if (f === 'title') c.titles[el.getAttribute('data-lang')] = el.value;
    else if (f === 'note') c.note = el.value;
    else return;
    c.dirty = true; if (f !== 'title' && f !== 'note') c.langs[c.lang].touched = true;
  });
  document.addEventListener('change', function (ev) {
    var el = ev.target;
    if (el && el.getAttribute && el.getAttribute('data-sg-f') === 'linkKind' && root && root.contains(el)) { var c = S.cur; if (c) { c.langs[c.lang].linkKind = el.value; c.dirty = true; } }
  });

  window.SongsAdmin = { render: render, _state: S, _fmt: fmt, _parseTime: parseTime, _buildEdit: buildEdit };
})();
