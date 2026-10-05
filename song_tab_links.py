# -*- coding: utf-8 -*-
"""[노래] > [오리지널 송] / [어린이 노래]: jw.org links of the two JSON files that do not open the song.

Every jwOrgUrl of jw_original_songs_ko_vi.json / jw_childrens_songs_ko_vi.json was opened on jw.org (2026-10): these
lead to the jw.org home page (the song is not published in that language), so the page shows no 전체 듣기 button for
them. The JSON files themselves stay as given. Re-check when jw.org adds languages (tests/check_song_links.py).
"""

SONG_LINKS_NOT_ON_JWORG = {
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

# The 12 learner-language keys a song file may hold (the UI locale ids of the site).
SONG_LANGS = ("vi", "cs", "zh_cn", "zh", "en", "fr", "de", "hu", "id", "ja", "ko", "pl")

# Official media of a song given as data: kind + jw.org media key. OSG 1 is an AUDIO (not a video): the finder link of each
# language that has the song is jwlshare&wtlocale=<that language's JW code>&lank=pub-osg_1_AUDIO. Other songs keep their
# own (verified) jwOrgUrl.
SONG_MEDIA_KEYS = {
    "osg-1": {"kind": "AUDIO", "mediaKey": "pub-osg_1_AUDIO"},
}
