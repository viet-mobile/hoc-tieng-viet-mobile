-- -*- coding: utf-8 -*-
-- Adds the song editor tables (SECTION G) to an existing database (run ONCE, before deploying the worker that serves /api/admin/songs).
-- Additive: no existing table changes; the worker in production does not read these tables, and the new worker answers the public
-- songs API with an empty list while they are missing.
--   npx wrangler d1 execute <DB_NAME> --remote --file regional_admin/migrations/0002_song_edits.sql

-- Song edits (SECTION G): the admin edits songs (lines, titles, line time markers, audio / JW links, new songs) as DRAFTS, previews them,
-- then PUBLISHES: the published JSON is what the public site reads at run time (/api/regional/songs) over the build's own data, so a
-- publish needs no redeploy. Unpublishing returns the song to the build's data. Existing databases: migrations/0002_song_edits.sql.
CREATE TABLE IF NOT EXISTS song_edits (
    region_id TEXT NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
    song_key TEXT NOT NULL,             -- 'kingdom:12' | 'original:osg-5' | 'children:pkon-3'
    kind TEXT NOT NULL CHECK (kind IN ('kingdom', 'original', 'children')),
    is_new INTEGER NOT NULL DEFAULT 0,  -- 1 = a song the build does not have yet
    draft TEXT,                         -- JSON of the working copy (NULL = no draft)
    draft_by TEXT,
    draft_at DATETIME,
    published TEXT,                     -- JSON live on the public site (NULL = not published)
    published_by TEXT,
    published_at DATETIME,
    version INTEGER NOT NULL DEFAULT 0, -- +1 on every change of this row: a stale editor cannot overwrite a newer save
    PRIMARY KEY (region_id, song_key)
);

CREATE TABLE IF NOT EXISTS song_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    region_id TEXT NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
    song_key TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('draft', 'publish', 'unpublish', 'discard', 'restore')),
    data TEXT,                          -- the JSON saved / published (NULL for unpublish / discard)
    username TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_song_history ON song_history(region_id, song_key, id DESC);

CREATE TABLE IF NOT EXISTS song_site_state (
    region_id TEXT PRIMARY KEY REFERENCES regions(id) ON DELETE CASCADE,
    revision INTEGER NOT NULL DEFAULT 0 -- +1 on every publish / unpublish: the public site's cache-busting number
);
