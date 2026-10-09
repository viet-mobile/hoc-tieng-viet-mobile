// -*- coding: utf-8 -*-
/** Song editor backend: rules, drafts, publish, history, concurrency, auth, public payload -- on the real _worker.js bundle + SQLite D1. */
const assert = require('assert');
const rules = require('../regional_admin/song_rules');
const { makeRegionWorker, USERS } = require('./helpers/regional_env');
let count = 0;
const t = async (name, fn) => { await fn(); count++; console.log('✓ ' + name); };
const URL_OK = 'https://download-a.akamaihd.jw-cdn.org/x/y/osg_VI_005.mp3';
const edit = (o = {}) => Object.assign({ v: 1, kind: 'original', key: 'osg-5', titles: { ko: '시험 노래' }, langs: { vi: {
  lines: ['(ĐIỆP KHÚC)', 'Dòng một', 'Dòng hai'], times: [{ s: 1000, e: 2000 }, { s: 2000, e: 3500 }], audio: { url: URL_OK }, link: { kind: 'AUDIO', mediaKey: 'pub-osg_5_AUDIO' } } } }, o);
const enc = k => encodeURIComponent(k);

(async () => {
  await t('rules: singable, marker count, url, key', () => {
    assert.strictEqual(rules.singableCount(['(x)', '1', 'a', 'b']), 2);
    assert.ok(rules.normalizeSongEdit(edit(), { kind: 'original', key: 'osg-5' }));
    const bad = (o, re) => assert.throws(() => rules.normalizeSongEdit(o), e => e.songEditError && re.test(e.message));
    bad(edit({ langs: { vi: { lines: ['a', 'b'], times: [{ s: 1, e: 2 }], audio: { url: URL_OK } } } }), /마커 수/);
    bad(edit({ langs: { vi: { lines: ['a'], times: [{ s: 5, e: 5 }], audio: { url: URL_OK } } } }), /끝 시각/);
    bad(edit({ langs: { vi: { lines: ['a'], times: [{ s: 1, e: 5 }] } } }), /음원 주소/);
    bad(edit({ langs: { vi: { lines: ['a'], audio: { url: 'http://evil.example/a.mp3' } } } }), /jw-cdn/);
    bad(edit({ key: 'osg-0' }), /번호/);
    bad(edit({ isNew: true, titles: {} , langs: { vi: { lines: ['a'] } } }), /제목/);
  });
  const w = await makeRegionWorker('jeonju');
  const a = await w.login(USERS.jeonju);
  const H = { cookie: a.cookie, csrf: a.csrf };
  const key = 'original:osg-5';
  await t('no session -> 401, bad CSRF -> 403', async () => {
    assert.strictEqual((await w.call('GET', '/api/admin/songs')).status, 401);
    assert.strictEqual((await w.call('PUT', '/api/admin/songs/' + enc(key), { cookie: a.cookie, json: { edit: edit() } })).status, 403);
  });
  await t('public payload is empty before any publish; drafts need admin', async () => {
    const r = await w.call('GET', '/api/regional/songs');
    assert.deepStrictEqual(r.data, { revision: 0, songs: {}, drafts: false });
  });
  let v;
  await t('save draft -> not public; invalid edit -> 400 and nothing written', async () => {
    const bad = await w.call('PUT', '/api/admin/songs/' + enc(key), { ...H, json: { baseVersion: 0, edit: edit({ langs: { vi: { lines: ['a', 'b'], times: [] } } }) } });
    assert.strictEqual(bad.status, 400);
    const ok = await w.call('PUT', '/api/admin/songs/' + enc(key), { ...H, json: { baseVersion: 0, edit: edit() } });
    assert.strictEqual(ok.status, 200); v = ok.data.version; assert.strictEqual(v, 1);
    assert.deepStrictEqual((await w.call('GET', '/api/regional/songs')).data.songs, {});
    const pre = await w.call('GET', '/api/regional/songs?draft=1', { cookie: a.cookie });
    assert.ok(pre.data.songs[key] && pre.data.drafts);
    const anon = await w.call('GET', '/api/regional/songs?draft=1');
    assert.deepStrictEqual(anon.data.songs, {});
  });
  await t('stale baseVersion -> 409', async () => {
    const r = await w.call('PUT', '/api/admin/songs/' + enc(key), { ...H, json: { baseVersion: 0, edit: edit() } });
    assert.strictEqual(r.status, 409);
  });
  await t('publish -> public, revision 1; edit again does not change public until publish', async () => {
    const p = await w.call('POST', `/api/admin/songs/${enc(key)}/publish`, { ...H, json: { baseVersion: v } });
    assert.strictEqual(p.status, 200);
    let pub = (await w.call('GET', '/api/regional/songs')).data;
    assert.strictEqual(pub.revision, 1); assert.strictEqual(pub.songs[key].langs.vi.lines[1], 'Dòng một');
    const cur = (await w.call('GET', '/api/admin/songs/' + enc(key), H)).data;
    const e2 = edit(); e2.langs.vi.lines[1] = 'Dòng MỘT';
    await w.call('PUT', '/api/admin/songs/' + enc(key), { ...H, json: { baseVersion: cur.version, edit: e2 } });
    pub = (await w.call('GET', '/api/regional/songs')).data;
    assert.strictEqual(pub.songs[key].langs.vi.lines[1], 'Dòng một');
    const list = (await w.call('GET', '/api/admin/songs', H)).data;
    assert.strictEqual(list.songs[0].unpublishedChanges, true);
  });
  await t('history lists drafts/publish; restore brings the first draft back as a draft only', async () => {
    const g = (await w.call('GET', '/api/admin/songs/' + enc(key), H)).data;
    const first = g.history.filter(h => h.action === 'draft').pop();
    const r = await w.call('POST', `/api/admin/songs/${enc(key)}/restore`, { ...H, json: { historyId: first.id } });
    assert.strictEqual(r.status, 200); assert.strictEqual(r.data.draft.langs.vi.lines[1], 'Dòng một');
    assert.strictEqual((await w.call('POST', `/api/admin/songs/${enc(key)}/restore`, { ...H, json: { historyId: 99999 } })).status, 404);
  });
  await t('unpublish returns to build data (revision bumps); discard removes the draft; empty row is deleted', async () => {
    const u = await w.call('POST', `/api/admin/songs/${enc(key)}/unpublish`, { ...H, json: {} });
    assert.strictEqual(u.status, 200);
    const pub = (await w.call('GET', '/api/regional/songs')).data;
    assert.deepStrictEqual(pub.songs, {}); assert.strictEqual(pub.revision, 2);
    const d = await w.call('POST', `/api/admin/songs/${enc(key)}/discard`, { ...H, json: {} });
    assert.strictEqual(d.data.deleted, true);
    assert.strictEqual((await w.call('POST', `/api/admin/songs/${enc(key)}/discard`, { ...H, json: {} })).status, 400);
  });
  await t('publish-all publishes only changed drafts, atomically; audit log written', async () => {
    for (const k of ['original:osg-6', 'children:pkon-2']) {
      const [kind, kk] = k.split(':');
      await w.call('PUT', '/api/admin/songs/' + enc(k), { ...H, json: { baseVersion: 0, edit: edit({ kind, key: kk }) } });
    }
    const r = await w.call('POST', '/api/admin/songs/publish-all', { ...H, json: {} });
    assert.deepStrictEqual(r.data.published.sort(), ['children:pkon-2', 'original:osg-6']);
    assert.deepStrictEqual((await w.call('POST', '/api/admin/songs/publish-all', { ...H, json: {} })).data.published, []);
    const n = w.d1.raw.prepare("SELECT COUNT(*) n FROM audit_logs WHERE action LIKE 'song_%'").get().n;
    assert.ok(n >= 8, 'audit rows ' + n);
  });
  await t('kingdom rules: vi is the master row list, equal row counts, no link, blanks keep their place', () => {
    const k = (langs, extra = {}) => Object.assign({ v: 1, kind: 'kingdom', key: '12', titles: {}, langs }, extra);
    assert.ok(rules.normalizeSongEdit(k({ vi: { lines: ['a', 'b'] }, ko: { lines: ['가', ''] } })));
    const bad = (o, re) => assert.throws(() => rules.normalizeSongEdit(o), e => e.songEditError && re.test(e.message));
    bad(k({ ko: { lines: ['가'] } }), /베트남어/);
    bad(k({ vi: { lines: ['a', 'b'] }, ko: { lines: ['가'] } }), /줄 수가 같아야/);
    bad(k({ vi: { lines: ['a', ''] } }), /비워/);
    bad(k({ vi: { lines: ['a'], link: { kind: 'AUDIO', mediaKey: 'pub-osg_5_AUDIO' } } }), /배지/);
    assert.deepStrictEqual(rules.normalizeSongEdit(k({ vi: { lines: ['a'] } }, { titles: { ko: ' 제목 ' } })).titles, { ko: '제목' });
  });
  await t('official markers proxy: fixed host, validated codes, parsed ms, 404 / bad input', async () => {
    const real = globalThis.fetch, seen = [];
    globalThis.fetch = async u => {
      seen.push(String(u));
      if (/track=404/.test(u)) return new Response('', { status: 404 });
      return new Response(JSON.stringify({ files: { KO: { MP3: [{ pub: 'osg', track: 5, duration: 200, file: { url: URL_OK }, markers: { markers: [
        { startTime: '00:00:01.500', duration: '00:00:02.000', mepsParagraphId: 1 }, { startTime: '00:00:03.500', duration: '00:00:01.000', mepsParagraphId: 99 }] } }] } } }), { status: 200 });
    };
    try {
      const ok = await w.call('GET', '/api/admin/song-markers?pub=osg&track=5&lang=KO', { cookie: a.cookie });
      assert.strictEqual(ok.status, 200);
      assert.deepStrictEqual(ok.data.markers, [{ index: 0, pid: 1, s: 1500, d: 2000 }, { index: 1, pid: 99, s: 3500, d: 1000 }]);
      assert.strictEqual(ok.data.url, URL_OK); assert.strictEqual(ok.data.mediaKey, 'pub-osg_5_AUDIO');
      assert.ok(seen[0].startsWith('https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?'));
      assert.strictEqual((await w.call('GET', '/api/admin/song-markers?pub=osg&track=404&lang=KO', { cookie: a.cookie })).status, 404);
      assert.strictEqual((await w.call('GET', '/api/admin/song-markers?pub=../x&track=5&lang=KO', { cookie: a.cookie })).status, 400);
      assert.strictEqual((await w.call('GET', '/api/admin/song-markers?pub=osg&track=5&lang=ko', { cookie: a.cookie })).status, 400);
      assert.strictEqual((await w.call('GET', '/api/admin/song-markers?pub=osg&track=5&lang=KO')).status, 401);
      assert.strictEqual(seen.length, 2, 'invalid requests never reach jw.org');
    } finally { globalThis.fetch = real; }
  });
  await t('scenarios H/I: start>=end, out-of-order markers and instrumental sources are rejected; J: viewer cannot write', async () => {
    const put = (e) => w.call('PUT', '/api/admin/songs/' + enc('original:osg-7'), { ...H, json: { baseVersion: 0, edit: e } });
    const mk = (times, url) => edit({ key: 'osg-7', langs: { vi: { lines: ['a', 'b'], times, audio: { url: url || URL_OK } } } });
    assert.strictEqual((await put(mk([{ s: 5000, e: 5000 }, { s: 6000, e: 7000 }]))).status, 400);
    assert.strictEqual((await put(mk([{ s: 5000, e: 6000 }, { s: 1000, e: 2000 }]))).status, 400);
    const inst = await put(mk([{ s: 1000, e: 2000 }, { s: 3000, e: 4000 }], 'https://download-a.akamaihd.jw-cdn.org/x/sjjm_VT_007.mp3'));
    assert.strictEqual(inst.status, 400); assert.ok(/반주/.test(inst.data.error));
    assert.strictEqual((await put(mk([{ s: 1000, e: 2000 }, { s: 3000, e: 4000 }], 'https://download-a.akamaihd.jw-cdn.org/x/sjjc_VT_007.mp3'))).status, 200);
    const v = w.d1.raw.prepare("SELECT 1 FROM sqlite_master WHERE name='admin_users'").get() && null;
    w.d1.raw.prepare("UPDATE admin_users SET role = 'section_f_viewer' WHERE username = ?").run(USERS.jeonju.username);
    const viewer = await w.login(USERS.jeonju);
    const r = await w.call('PUT', '/api/admin/songs/' + enc('original:osg-8'), { cookie: viewer.cookie, csrf: viewer.csrf, json: { baseVersion: 0, edit: edit({ key: 'osg-8' }) } });
    assert.strictEqual(r.status, 403);
    assert.strictEqual((await w.call('GET', '/api/admin/songs', { cookie: viewer.cookie })).status, 403);
    assert.strictEqual((await w.call('POST', '/api/admin/songs/publish-all', { cookie: viewer.cookie, csrf: viewer.csrf, json: {} })).status, 403);
    w.d1.raw.prepare("UPDATE admin_users SET role = 'admin' WHERE username = ?").run(USERS.jeonju.username);
  });
  await t('audit trail records field-level before/after', async () => {
    const row = w.d1.raw.prepare("SELECT * FROM audit_logs WHERE action = 'song_save_draft' ORDER BY id DESC LIMIT 1").get();
    const text = JSON.stringify(row);
    assert.ok(/changes/.test(text) && /after/.test(text), text.slice(0, 300));
  });
  await t('ulsan data is separate from jeonju', async () => {
    const u = await makeRegionWorker('ulsan');
    assert.deepStrictEqual((await u.call('GET', '/api/regional/songs')).data.songs, {});
  });
  console.log(`SONG ADMIN BACKEND OK (${count})`);
})().catch(e => { console.error(e); process.exit(1); });
