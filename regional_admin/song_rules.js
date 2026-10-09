// -*- coding: utf-8 -*-
/**
 * Song edit rules shared by the regional worker (db.js validation) and the browser editor (admin_client / songs_admin_client).
 * Plain ES5-ish JavaScript with no imports so it runs in Node, in the Cloudflare worker bundle and inline in /admin.
 *
 * A SONG EDIT (what the admin saves and publishes) is, per song:
 *   { v: 1, kind: 'kingdom'|'original'|'children', key: '12' | 'osg-5' | 'pkon-3' | 'pk-special-0', isNew: bool,
 *     number: int (the song number / track),
 *     titles: { <lang>: string },  scripture: { <lang>: string } (왕국 노래),
 *     langs: { <lang>: { lines: [string, ...], times: [ {s, e} | null, ... ], audio: {url} | null, link: {kind, mediaKey} | null } },
 *     note: string }
 * - `lines` are the rows of that language as shown on the page; a row that is only a label -- "(ĐIỆP KHÚC)", "(코러스)", a bare
 *   verse number -- has no sound of its own. Splitting / merging a line is editing this array.
 * - `times` has ONE entry per SINGABLE line (see isSingable) in order: the start / end of that line in the audio, in milliseconds; null =
 *   no ▶ ↻ buttons for that line. Its length must equal the number of singable lines, so a split / merge always goes with its times.
 * - `audio.url` is the recording the times belong to: https, a *.jw-cdn.org file (mp3 / mp4 / m4a). `link` is the jw.org media key the
 *   JW.ORG badge of that language opens (the site builds the strict finder?srcid=jwlshare&wtlocale=... URL itself).
 * A language that is not in `langs` keeps the data of the build.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SongRules = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var LANGS = ['vi', 'cs', 'zh_cn', 'zh', 'en', 'fr', 'de', 'hu', 'id', 'ja', 'ko', 'pl'];
  var KINDS = ['kingdom', 'original', 'children'];
  var LIMITS = { title: 200, scripture: 300, line: 600, lines: 400, url: 500, note: 300, perSong: 250000, maxMs: 3 * 3600 * 1000 };
  // a chorus / bridge label, a bare verse number, a note line: no sound of its own (the same expression as the page's songSegSingable)
  var STRUCT = /^\s*(\(.*\)|（.*）|[\[【].*[\]】]|\d+\s*[.．。]?|[※＊*].*)\s*$/;
  var KEY_RE = { kingdom: /^[1-9]\d{0,2}$/, original: /^osg-[1-9]\d{0,2}$/, children: /^(pkon-[1-9]\d{0,2}|pk-special-\d)$/ };
  var MEDIA_KEY_RE = /^pub-[a-z]+_[0-9_]+_(VIDEO|AUDIO)$/;
  var JW_CDN_URL_RE = /^https:\/\/[a-z0-9-]+(\.[a-z0-9-]+)*\.jw-cdn\.org\/[^\s"'<>\\]+\.(mp3|mp4|m4a)(\?[^\s"'<>\\]*)?$/i;

  function isSingable(text) {
    var t = String(text === undefined || text === null ? '' : text).trim();
    return !!t && !STRUCT.test(t);
  }
  function singableCount(lines) {
    var n = 0;
    for (var i = 0; i < lines.length; i++) if (isSingable(lines[i])) n++;
    return n;
  }
  function songKey(kind, key) { return kind + ':' + key; }
  function parseSongKey(songKeyStr) {
    var m = /^(kingdom|original|children):(.+)$/.exec(String(songKeyStr || ''));
    return m && KEY_RE[m[1]].test(m[2]) ? { kind: m[1], key: m[2] } : null;
  }
  function validKey(kind, key) { return KINDS.indexOf(kind) >= 0 && typeof key === 'string' && KEY_RE[kind].test(key); }
  // sjjm / sjji are the instrumental recordings: never a source of sung-line times
  var INSTRUMENTAL_RE = /(^|[\/_.-])(sjjm|sjji)([_.-]|$)/i;
  function isInstrumentalUrl(url) { return typeof url === 'string' && INSTRUMENTAL_RE.test(url.split('?')[0]); }
  function isJwCdnUrl(url) { return typeof url === 'string' && url.length <= LIMITS.url && JW_CDN_URL_RE.test(url); }
  function isMediaKey(key) { return typeof key === 'string' && MEDIA_KEY_RE.test(key); }

  function fail(message) { var e = new Error(message); e.songEditError = true; throw e; }
  function str(value, max, label, required) {
    if (value === undefined || value === null || value === '') { if (required) fail(label + '은(는) 필수 입력 항목입니다.'); return ''; }
    if (typeof value !== 'string') fail(label + ' 형식이 올바르지 않습니다.');
    var t = value.replace(/\s+/g, ' ').trim();
    if (t.length > max) fail(label + '은(는) ' + max + '자 이내여야 합니다.');
    return t;
  }
  function ms(value, label) {
    if (typeof value !== 'number' || !isFinite(value) || Math.floor(value) !== value || value < 0 || value > LIMITS.maxMs) fail(label + ' 시각이 올바르지 않습니다.');
    return value;
  }

  /**
   * Validates and normalizes a song edit; returns the clean object or throws an Error with songEditError = true and a Korean message.
   * `expect` (optional) = { kind, key } the edit must belong to.
   */
  function normalizeSongEdit(input, expect) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) fail('노래 데이터 형식이 올바르지 않습니다.');
    var kind = input.kind, key = String(input.key === undefined ? '' : input.key);
    if (!validKey(kind, key)) fail('노래 종류 또는 번호가 올바르지 않습니다.');
    if (expect && (expect.kind !== kind || expect.key !== key)) fail('주소의 노래와 데이터의 노래가 다릅니다.');
    var out = { v: 1, kind: kind, key: key, isNew: input.isNew === true, number: 0, titles: {}, scripture: {}, langs: {}, note: str(input.note, LIMITS.note, '메모') };
    var num = typeof input.number === 'number' ? input.number : parseInt(String(key).replace(/\D+/g, ''), 10);
    out.number = (isFinite(num) && num >= 0 && num <= 999) ? Math.floor(num) : 0;
    var titles = input.titles || {};
    if (typeof titles !== 'object' || Array.isArray(titles)) fail('제목 형식이 올바르지 않습니다.');
    Object.keys(titles).forEach(function (lg) {
      if (LANGS.indexOf(lg) < 0) fail('지원하지 않는 언어입니다: ' + lg);
      var v = str(titles[lg], LIMITS.title, '제목(' + lg + ')');
      if (v) out.titles[lg] = v;
    });
    var scr = input.scripture || {};
    if (typeof scr !== 'object' || Array.isArray(scr)) fail('성구 형식이 올바르지 않습니다.');
    Object.keys(scr).forEach(function (lg) {
      if (LANGS.indexOf(lg) < 0) fail('지원하지 않는 언어입니다: ' + lg);
      var v = str(scr[lg], LIMITS.scripture, '성구(' + lg + ')');
      if (v) out.scripture[lg] = v;
    });
    var langs = input.langs || {};
    if (typeof langs !== 'object' || Array.isArray(langs)) fail('언어 데이터 형식이 올바르지 않습니다.');
    Object.keys(langs).forEach(function (lg) {
      if (LANGS.indexOf(lg) < 0) fail('지원하지 않는 언어입니다: ' + lg);
      var d = langs[lg] || {}, o = {};
      if (d.lines !== undefined && d.lines !== null) {
        if (!Array.isArray(d.lines)) fail('가사 형식이 올바르지 않습니다(' + lg + ').');
        if (d.lines.length > LIMITS.lines) fail('가사 줄 수가 너무 많습니다(' + lg + ', 최대 ' + LIMITS.lines + '줄).');
        o.lines = [];
        // 왕국 노래 rows are shared by all languages (row i of every language is the same line): a blank cell keeps its place there
        d.lines.forEach(function (l) { var t = str(l, LIMITS.line, '가사 한 줄(' + lg + ')'); if (t || kind === 'kingdom') o.lines.push(t); });
      }
      if (d.times !== undefined && d.times !== null) {
        if (!Array.isArray(d.times)) fail('시간 마커 형식이 올바르지 않습니다(' + lg + ').');
        if (!o.lines) fail('시간 마커는 가사 줄과 함께 저장해야 합니다(' + lg + ').');
        var sing = singableCount(o.lines);
        if (d.times.length !== sing) fail('시간 마커 수(' + d.times.length + ')가 노래하는 가사 줄 수(' + sing + ')와 다릅니다(' + lg + '). 줄을 나누거나 합치면 마커도 함께 맞춰야 합니다.');
        o.times = d.times.map(function (t, i) {
          if (t === null || t === undefined) return null;
          if (typeof t !== 'object') fail('시간 마커 형식이 올바르지 않습니다(' + lg + ' ' + (i + 1) + '번째 줄).');
          var s = ms(t.s, lg + ' ' + (i + 1) + '번째 줄 시작'), e = ms(t.e, lg + ' ' + (i + 1) + '번째 줄 끝');
          if (!(s < e)) fail(lg + ' ' + (i + 1) + '번째 줄: 끝 시각은 시작 시각보다 뒤여야 합니다.');
          return { s: s, e: e };
        });
        var prevS = -1;
        o.times.forEach(function (t, i) {
          if (!t) return;
          if (t.s < prevS) fail(lg + ' ' + (i + 1) + '번째 줄: 시작 시각이 앞 줄보다 빠릅니다(소절은 시간 순서여야 합니다).');
          prevS = t.s;
        });
      }
      if (d.audio !== undefined && d.audio !== null) {
        if (typeof d.audio !== 'object' || !isJwCdnUrl(d.audio.url)) fail('음원 주소는 jw-cdn.org의 https mp3/mp4/m4a 파일이어야 합니다(' + lg + ').');
        if (isInstrumentalUrl(d.audio.url)) fail('반주(sjjm/sjji) 음원은 소절 시간의 기준 음원으로 쓸 수 없습니다. 노래(보컬) 음원을 지정하세요(' + lg + ').');
        o.audio = { url: d.audio.url };
      } else if (o.times && o.times.some(function (t) { return !!t; })) {
        fail('시간 마커를 쓰려면 같은 언어의 음원 주소가 필요합니다(' + lg + ').');
      }
      if (d.link !== undefined && d.link !== null) {
        if (kind === 'kingdom') fail('왕국 노래의 JW.ORG 배지는 별도 표로 관리되어 여기서 바꿀 수 없습니다. 음원 주소는 바꿀 수 있습니다(' + lg + ').');
        if (typeof d.link !== 'object' || ['VIDEO', 'AUDIO'].indexOf(d.link.kind) < 0 || !isMediaKey(d.link.mediaKey) ||
            !new RegExp('_' + d.link.kind + '$').test(d.link.mediaKey)) fail('JW.ORG 링크 정보(종류·media key)가 올바르지 않습니다(' + lg + ').');
        o.link = { kind: d.link.kind, mediaKey: d.link.mediaKey };
      }
      if (Object.keys(o).length) out.langs[lg] = o;
    });
    if (kind === 'kingdom') {
      // row-aligned: Vietnamese is the master row list; every other edited language has exactly as many rows, and no Vietnamese row is blank
      var vi = out.langs.vi && out.langs.vi.lines;
      var others = Object.keys(out.langs).filter(function (lg) { return out.langs[lg].lines; });
      if (others.length && !vi) fail('왕국 노래의 가사를 고치려면 베트남어(vi) 가사가 함께 있어야 합니다.');
      others.forEach(function (lg) {
        if (out.langs[lg].lines.length !== vi.length) fail('왕국 노래는 모든 언어의 줄 수가 같아야 합니다(' + lg + ' ' + out.langs[lg].lines.length + '줄, vi ' + vi.length + '줄).');
      });
      if (vi && vi.some(function (t) { return !t; })) fail('왕국 노래의 베트남어 줄은 비워 둘 수 없습니다.');
    }
    if (!Object.keys(out.titles).length && !Object.keys(out.langs).length && !Object.keys(out.scripture).length) fail('수정한 내용이 없습니다.');
    if (out.isNew && !(out.titles.ko || out.titles.vi)) fail('새 노래에는 한국어 또는 베트남어 제목이 필요합니다.');
    if (JSON.stringify(out).length > LIMITS.perSong) fail('노래 데이터가 너무 큽니다.');
    return out;
  }

  /** Field-level changes between two normalized edits (null = nothing before): [{lang, field, before, after}], for the audit trail. */
  function diffEdits(before, after) {
    var out = [], b = before || { titles: {}, scripture: {}, langs: {} }, a = after;
    function add(lang, field, x, y) { if (JSON.stringify(x) !== JSON.stringify(y)) out.push({ lang: lang, field: field, before: x === undefined ? null : x, after: y === undefined ? null : y }); }
    Object.keys(Object.assign({}, b.titles, a.titles)).forEach(function (lg) { add(lg, 'title', b.titles[lg], a.titles[lg]); });
    Object.keys(Object.assign({}, b.scripture, a.scripture)).forEach(function (lg) { add(lg, 'scripture', b.scripture[lg], a.scripture[lg]); });
    Object.keys(Object.assign({}, b.langs, a.langs)).forEach(function (lg) {
      var x = b.langs[lg] || {}, y = a.langs[lg] || {};
      var xl = x.lines || [], yl = y.lines || [];
      for (var i = 0; i < Math.max(xl.length, yl.length); i++) add(lg, 'line ' + (i + 1), xl[i], yl[i]);
      var xt = x.times || [], yt = y.times || [];
      for (var j = 0; j < Math.max(xt.length, yt.length); j++) add(lg, 'time ' + (j + 1), xt[j], yt[j]);
      add(lg, 'audio', x.audio && x.audio.url, y.audio && y.audio.url);
      add(lg, 'link', x.link, y.link);
    });
    return out;
  }

  return {
    LANGS: LANGS, KINDS: KINDS, LIMITS: LIMITS, STRUCT: STRUCT,
    isSingable: isSingable, singableCount: singableCount, songKey: songKey, parseSongKey: parseSongKey, validKey: validKey,
    isJwCdnUrl: isJwCdnUrl, isInstrumentalUrl: isInstrumentalUrl, diffEdits: diffEdits, isMediaKey: isMediaKey, normalizeSongEdit: normalizeSongEdit,
  };
});
