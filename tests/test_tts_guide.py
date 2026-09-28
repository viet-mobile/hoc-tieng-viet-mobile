# -*- coding: utf-8 -*-
"""[발음] > [설정] guide data (tts_guide_data.py) and where the build ships it (run build/assemble first).

- every UI language has the speed/pitch lines for all five device cards, the "no sound?" (KakaoTalk) help and
  the home-screen guide -- no ko/en stand-in, no leftover placeholder;
- the official menu names checked in tts_guide_data.py are the ones shown (iPhone "Speaking Rate", Safari
  "Add to Home Screen", Chrome "Install and create shortcut", Windows Settings > Time & Language > Speech);
- only the Korean KakaoTalk menu name (and the JEONJU site name) may appear in Hangul outside Korean;
- the home-screen guide is built for JEONJU only, with the name and address of its own site profile;
  the help reaches the target-language (JW Study) sites too.
"""
import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
os.chdir(ROOT)

from site_profiles import SITES  # noqa: E402
from tts_guide_data import TTS_GUIDE, TTS_GUIDE_ORDER, TTS_GUIDE_EXTRA, home_screen_guide  # noqa: E402

LANGS = ["ko", "vi", "cs", "zh_cn", "zh", "en", "fr", "de", "hu", "id", "ja", "pl"]
HANGUL = re.compile(r"[가-힣]")
KAKAO_MENU = "다른 브라우저로 열기"
# Official labels per UI language (Apple iph96b214f0 / iphea86e5236, Google chrome/answer/9658361).
SPEAKING_RATE = {"ko": "말하기 속도", "en": "Speaking Rate", "vi": "Tốc độ đọc", "cs": "Rychlost čtení", "zh_cn": "语速",
                 "zh": "朗讀速度", "ja": "読み上げ速度", "fr": "Débit vocal", "de": "Sprechtempo", "hu": "Beszédsebesség",
                 "id": "Laju Bicara", "pl": "Szybkość mówienia"}
ADD_TO_HOME = {"ko": "홈 화면에 추가", "en": "Add to Home Screen", "vi": "Thêm vào Màn hình chính", "cs": "Přidat na plochu",
               "zh_cn": "添加到主屏幕", "zh": "加入主畫面", "ja": "ホーム画面に追加", "fr": "Sur l’écran d’accueil",
               "de": "Zu Home-Bildschirm hinzufügen", "hu": "Hozzáadás a Főképernyőhöz", "id": "Tambah ke Layar Utama",
               "pl": "Do ekranu głównego"}
CHROME_INSTALL = {"ko": "설치 및 바로가기 만들기", "en": "Install and create shortcut", "vi": "Cài đặt và tạo lối tắt",
                  "cs": "Nainstalovat a vytvořit zástupce", "zh_cn": "安装并创建快捷方式", "zh": "安裝並建立捷徑",
                  "ja": "インストールしてショートカットを作成", "fr": "Installer et créer un raccourci",
                  "de": "Installieren und Verknüpfung erstellen", "hu": "Telepítés és parancsikon létrehozása",
                  "id": "Instal dan buat pintasan", "pl": "Zainstaluj i utwórz skrót"}

errors = []
checks = 0


def ok(cond, msg):
    global checks
    checks += 1
    if not cond:
        errors.append(msg)


def texts(value):
    if isinstance(value, str):
        yield value
    elif isinstance(value, list):
        for v in value:
            yield from texts(v)
    elif isinstance(value, dict):
        for v in value.values():
            yield from texts(v)


ok(sorted(TTS_GUIDE) == sorted(LANGS) and sorted(TTS_GUIDE_EXTRA) == sorted(LANGS), "TTS guide languages: %s" % sorted(TTS_GUIDE))
site = SITES["jeonju"]
home = home_screen_guide(site["title"], "https://" + site["domain"])
for lang in LANGS:
    g = TTS_GUIDE[lang]
    ok(bool(g.get("tuneTitle")), lang + ": speed/pitch heading")
    for card_id in TTS_GUIDE_ORDER:
        ok(bool(g["cards"][card_id].get("tune")), "%s/%s: speed/pitch lines" % (lang, card_id))
    help_ = g.get("help") or {}
    ok(help_.get("title") and help_.get("lead") and len(help_.get("steps", [])) == 4 and help_.get("note"), lang + ": help section")
    ok(any("Safari" in s for s in help_.get("steps", [])), lang + ": help names Safari for iPhone")
    ok(any(KAKAO_MENU in s for s in help_.get("steps", [])), lang + ": help names the KakaoTalk menu")
    # bold menu name, with the locale's own quotation marks where Apple uses them (“语速”, „Sprechtempo“, 「読み上げ速度」)
    ok(re.search(r"\*\*[“„「]?" + re.escape(SPEAKING_RATE[lang]) + r"[”“」]?\*\*", g["cards"]["ios"]["tune"][0]),
       lang + ": iPhone speed label " + SPEAKING_RATE[lang])
    ok("Speech rate" in g["cards"]["samsung"]["tune"][0] and "Pitch" in g["cards"]["samsung"]["tune"][0], lang + ": Samsung Speech rate / Pitch")
    h = home[lang]
    ok(ADD_TO_HOME[lang] in " ".join(h["ios"]["steps"]), lang + ": Safari " + ADD_TO_HOME[lang])
    ok(CHROME_INSTALL[lang] in " ".join(h["android"]["steps"]), lang + ": Chrome " + CHROME_INSTALL[lang])
    ok(site["title"] in h["title"] and site["domain"] in h["lead"], lang + ": home guide names the JEONJU site and address")
    for t in list(texts(g.get("help"))) + list(texts(g.get("tuneTitle"))) + [l for c in g["cards"].values() for l in c["tune"]] + list(texts(h)):
        ok("{" not in t and "}" not in t and t.count("**") % 2 == 0, "%s: placeholder or unbalanced ** in %r" % (lang, t[:60]))
        if lang != "ko":
            rest = t.replace(KAKAO_MENU, "").replace(site["title"], "")
            ok(not HANGUL.search(rest), "%s: Hangul outside the KakaoTalk menu / site name: %r" % (lang, t[:80]))
ok("시간 및 언어" in TTS_GUIDE["ko"]["cards"]["windows"]["tune"][0] and "음성 속도" in TTS_GUIDE["ko"]["cards"]["windows"]["tune"][1],
   "ko Windows: 설정 > 시간 및 언어 > 음성, 음성 속도")
ok(TTS_GUIDE["zh"]["help"]["title"] != TTS_GUIDE["zh_cn"]["help"]["title"], "zh and zh_cn are separate texts")

# Built outputs: home guide only in JEONJU; help reaches every site.
dist_sites = {"general": "dist", "jw": "dist/jw", "jeonju": "dist/jeonju", "ulsan": "dist/ulsan"}
dist_sites.update({k: SITES[k]["output_dir"] for k in SITES if k.startswith("jw_study_")})
for sid, d in dist_sites.items():
    files = [os.path.join(d, "index.html")] + glob.glob(os.path.join(d, "data.*.js"))
    ok(os.path.exists(files[0]), sid + ": built (run build_app.py / assemble_app.py --site all)")
    blob = "".join(open(f, encoding="utf-8").read() for f in files if os.path.exists(f))
    has_home = "const HOME_SCREEN_GUIDE" in blob
    ok(has_home == (sid == "jeonju"), "%s: HOME_SCREEN_GUIDE shipped=%s" % (sid, has_home))
    ok(TTS_GUIDE["ko"]["help"]["title"] in blob, sid + ": help section shipped")
    if sid != "jeonju":
        ok(home["ko"]["title"] not in blob, sid + ": JEONJU home-screen text leaked")

print("checks run: %d" % checks)
if errors:
    print("\n".join("FAIL: " + e for e in errors[:40]))
    sys.exit(1)
print("--- TTS GUIDE TESTS PASSED ---")
