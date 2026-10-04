# -*- coding: utf-8 -*-
"""[노래] > [오리지널 송] / [어린이 노래]: jw.org links of the two JSON files that do not open the song.

Every jwOrgUrl of jw_original_songs_ko_vi.json / jw_childrens_songs_ko_vi.json was opened on jw.org (2026-10): these
lead to the jw.org home page (the song is not published in that language), so the page shows no 전체 듣기 button for
them. The JSON files themselves stay as given. Re-check when jw.org adds languages (tests/check_song_links.py).
"""

SONG_LINKS_NOT_ON_JWORG = {
    ('osg-1', 'ko'),
    ('osg-112', 'ko'),
    ('osg-112', 'vi'),
    ('osg-117', 'ko'),
    ('osg-117', 'vi'),
    ('osg-18', 'ko'),
    ('osg-63', 'ko'),
    ('osg-63', 'vi'),
    ('pkon-3', 'vi'),
    ('pkon-4', 'vi'),
    ('pkon-6', 'vi'),
}
