"""[어휘] meanings for zh_cn / cs / hu / id (word_meanings_extended.py + .json), checked on the curated layer
and on the built data blocks (run build_app.py --profile all first)."""
import copy
import json
import re
import unittest
from pathlib import Path

from site_profiles import SITES, data_block_name
from word_meanings_extended import (EXTENDED_LANGS, apply_extended_meanings, load_extended_meanings,
                                    with_extended_meanings)

ROOT = Path(__file__).resolve().parents[1]
LAYER = load_extended_meanings()
VN_SITES = [s for s, m in SITES.items() if m["engine"] == "vietnamese"]
HANGUL = re.compile("[가-힣㄰-㆏]")
CJK = re.compile("[぀-ヿ㐀-鿿]")
METHODS = {"ZH_TRAD_TO_SIMP", "AI_VI_KO_CROSSCHECK_CS", "AI_VI_KO_CROSSCHECK_HU", "AI_VI_KO_CROSSCHECK_ID",
           "EXISTING_VERIFIED"}
# The two senses whose Vietnamese headword and Korean meaning contradict each other in the source (FREQ_VOCAB):
# no cs/hu/id meaning is made up for them.
REVIEW_REQUIRED = {"kiến|벌다", "mặt|옷입다"}
# Traditional characters OpenCC t2s leaves as they are but Simplified Chinese does not use in these words.
TRADITIONAL_ONLY = set("們個這裡說話時們對會學國來後麼爲為還從關開點現實電經兩們長門問間頭顏體")


def consts(site):
    text = (ROOT / data_block_name(site)).read_text(encoding="utf-8")
    return {m[1]: m[2] for m in re.finditer(r"^const ([A-Za-z_$][\w$]*) = (.*);$", text, re.MULTILINE)}


def block(site, name):
    return json.loads(consts(site)[name])


class LayerTests(unittest.TestCase):
    # 1. Every entry is one sense ("vi|ko"), with a known method and basis per language.
    def test_schema_and_sense_keys(self):
        self.assertEqual(set(LAYER["methods"]), METHODS)
        scopes = {"UNIFIED", "DATASET", "HANJA_READING"}
        for key, entry in LAYER["entries"].items():
            self.assertIn(entry["scope"], scopes, key)
            self.assertEqual(key, f'{entry["vi"]}|{entry["ko"]}', key)
            for lang, value in entry["m"].items():
                self.assertIn(lang, EXTENDED_LANGS, key)
                meaning, method, basis = value
                self.assertTrue(meaning.strip() and meaning == meaning.strip(), key)
                self.assertIn(method, METHODS, key)
                self.assertTrue(basis, key)
                if method.startswith("AI_VI_KO_CROSSCHECK_"):
                    self.assertEqual(method[-2:].lower(), lang, key)
                if method == "ZH_TRAD_TO_SIMP":
                    self.assertEqual(lang, "zh_cn", key)

    # 2. Homonyms and polysemous words keep one meaning per sense.
    def test_homonyms_stay_separate(self):
        e = LAYER["entries"]
        self.assertEqual(e["kiến|세울 건(建)"]["m"]["cs"][0], "stavět, zakládat")
        self.assertEqual(e["kiến|볼 견(見)"]["m"]["cs"][0], "vidět")
        self.assertEqual(e["đông|겨울"]["m"]["hu"][0], "tél")
        self.assertEqual(e["đông|동녘 동(東)"]["m"]["hu"][0], "kelet")
        self.assertEqual(e["đường|설탕"]["m"]["id"][0], "gula")
        self.assertEqual(e["đường|길, 거리"]["m"]["id"][0], "jalan")
        # ";"-separated senses stay separate.
        self.assertEqual(e["hay|또는 ; 좋은"]["m"]["cs"][0], "nebo; dobrý")

    # 3. Script: no Korean anywhere, no CJK in cs/hu/id, CJK in zh_cn.
    def test_scripts(self):
        for key, entry in LAYER["entries"].items():
            for lang, (meaning, _, _) in entry["m"].items():
                self.assertIsNone(HANGUL.search(meaning), (key, lang, meaning))
                if lang == "zh_cn":
                    self.assertTrue(CJK.search(meaning), (key, meaning))
                else:
                    self.assertIsNone(CJK.search(meaning), (key, lang, meaning))

    # 4. zh_cn is the Simplified form of the verified zh text: no Traditional-only glyph left.
    def test_zh_cn_is_simplified(self):
        values = [e["m"]["zh_cn"][0] for e in LAYER["entries"].values() if "zh_cn" in e["m"]]
        values += list(LAYER["zh_cn_by_zh"].values())
        for v in values:
            self.assertFalse(set(v) & TRADITIONAL_ONLY, v)
        for trad, simp in LAYER["zh_cn_by_zh"].items():
            self.assertEqual(len(trad), len(simp), trad)
        try:
            import opencc
        except ImportError:
            return
        t2s = opencc.OpenCC("t2s")
        hand_fixed = {"黏貼，附著", "活著的", "活著", "意味著"}  # 著 -> 着 as the aspect particle
        for trad, simp in LAYER["zh_cn_by_zh"].items():
            if trad not in hand_fixed:
                self.assertEqual(simp, t2s.convert(trad), trad)
            if trad != "打破・打壞":  # t2s maps 坏 on to 坯; 坏 is the correct Simplified form here
                self.assertEqual(simp, t2s.convert(simp), trad)

    # 5. Existing meanings are kept (anh), never replaced.
    def test_existing_meanings_are_kept(self):
        anh = LAYER["entries"]["anh|꽃부리 영(英), 맏 형(兄)"]["m"]
        self.assertEqual(anh["cs"], ["květ, hrdina, Anglie; starší bratr", "EXISTING_VERIFIED", "WORD_MEANING_OVERRIDES"])
        self.assertEqual(anh["zh_cn"][1], "EXISTING_VERIFIED")
        word = {"vi": "anh", "kr": {"ko": "꽃부리 영(英), 맏 형(兄)", "cs": "keep me"}}
        apply_extended_meanings([word])
        self.assertEqual(word["kr"]["cs"], "keep me")

    # 6. REVIEW_REQUIRED senses get no meaning in cs/hu/id.
    def test_review_required_left_empty(self):
        self.assertEqual({r["key"] for r in LAYER["review_required"]}, REVIEW_REQUIRED)
        for key in REVIEW_REQUIRED:
            for lang in ("cs", "hu", "id"):
                self.assertNotIn(lang, LAYER["entries"][key]["m"], key)

    # 7. apply_extended_meanings fills only missing languages and does not touch a shared source dict.
    def test_apply_copies_and_fills_missing_only(self):
        shared = {"ko": "설탕", "zh": "糖", "en": "sugar"}
        word = {"vi": "đường", "kr": shared}
        apply_extended_meanings([word])
        self.assertEqual(shared, {"ko": "설탕", "zh": "糖", "en": "sugar"})
        self.assertEqual(word["kr"]["cs"], "cukr")
        self.assertEqual(word["kr"]["en"], "sugar")
        # A word whose "vi|ko" is not a known sense gets nothing -- never a meaning of the same spelling.
        other = {"vi": "đường", "kr": {"ko": "모르는 뜻"}}
        apply_extended_meanings([other])
        self.assertEqual(other["kr"], {"ko": "모르는 뜻"})

    # 8. The [어휘] source lists get the meanings on a copy; the lists themselves are unchanged.
    def test_dataset_copies(self):
        rhyme = [{"families": [{"words": [{"word": "kiến", "hanja": "建", "kr": "건",
                                           "gloss": {"ko": "세울 건", "zh": "建立", "en": "build, establish"}}]}]}]
        original = copy.deepcopy(rhyme)
        out = with_extended_meanings("RHYME_GROUPS", rhyme)
        self.assertEqual(rhyme, original)
        gloss = out[0]["families"][0]["words"][0]["gloss"]
        self.assertEqual((gloss["cs"], gloss["zh_cn"]), ("stavět, zakládat", "建立"))
        pairs = [{"vi1": "nhanh", "kr1": {"ko": "빨리", "zh": "快點，迅速地"}, "vi2": "chậm", "kr2": {"ko": "천천히"}}]
        out = with_extended_meanings("ANTONYM_PAIRS", pairs)
        self.assertEqual(out[0]["kr1"]["hu"], "gyorsan")
        self.assertEqual(out[0]["kr1"]["zh_cn"], "快点，迅速地")
        self.assertNotIn("hu", pairs[0]["kr1"])


class BuiltDataTests(unittest.TestCase):
    # 9. The built UNIFIED_WORDS: coverage per language, and no language outside zh_cn/cs/hu/id changed.
    def test_unified_words_coverage(self):
        words = block("jw", "UNIFIED_WORDS")
        self.assertEqual(len(words), 3270)
        count = lambda lang: sum(1 for w in words if w["kr"].get(lang))
        self.assertEqual({lang: count(lang) for lang in ("cs", "hu", "id")}, {"cs": 3268, "hu": 3268, "id": 3268})
        self.assertEqual(count("zh_cn"), count("zh"))
        self.assertEqual(count("ko"), 3270)
        for lang in ("en", "zh", "ja", "de", "fr", "pl"):
            self.assertEqual(count(lang), 2999, lang)
        self.assertEqual(count("vi"), 0)
        for w in words:
            key = f'{w["vi"]}|{w["kr"].get("ko", "")}'
            entry = LAYER["entries"].get(key)
            for lang in EXTENDED_LANGS:
                if w["kr"].get(lang):
                    self.assertIsNotNone(entry, key)
                    self.assertEqual(w["kr"][lang], entry["m"][lang][0], (key, lang))

    # 10. The [어휘] source lists in every Vietnamese profile carry the meanings of their own sense.
    def test_source_lists(self):
        for site in VN_SITES:
            c = consts(site)
            chain = json.loads(c["VOCAB_CHAIN"])
            self.assertTrue(all(it["meaning"].get("cs") for it in chain), site)
            for it in chain:
                if it["meaning"].get("zh"):
                    self.assertEqual(it["meaning"]["zh_cn"], LAYER["zh_cn_by_zh"][it["meaning"]["zh"]], site)
            rhyme = json.loads(c["RHYME_GROUPS"])
            glosses = [w["gloss"] for g in rhyme for f in g["families"] for w in f["words"]]
            self.assertTrue(all(g.get("cs") and g.get("zh_cn") for g in glosses), site)
            freq = json.loads(c["FREQ_VOCAB"])
            missing = sorted(f'{it["vi"]}|{it["kr"]["ko"]}' for it in freq if not it["kr"].get("cs"))
            self.assertEqual(missing, sorted(REVIEW_REQUIRED), site)

    # 11. Target sites (JW Study / Study) are untouched and carry no Vietnamese word lists.
    def test_target_sites_untouched(self):
        for site, meta in SITES.items():
            if meta["engine"] == "vietnamese":
                continue
            c = consts(site)
            for name in ("UNIFIED_WORDS", "VOCAB_CHAIN", "RHYME_GROUPS", "FREQ_VOCAB"):
                self.assertNotIn(name, c, site)


if __name__ == "__main__":
    unittest.main()
