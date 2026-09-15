import ast
import sys
from opencc import OpenCC

cc = OpenCC('s2tw')

# Characters OpenCC's dictionary treats as ambiguous simplified forms (multiple possible
# traditional targets) where blind conversion is known-wrong for THIS corpus, because the source
# text is already mostly-correct traditional Chinese (not fully-simplified input) and these
# specific characters are legitimately used as themselves here:
#   - 台: JW.org's own Traditional Chinese publications consistently write the magazine title
#     as "守望台" (not "守望臺"), and other 台 occurrences in this corpus (台本, 一台電視) follow
#     the same common modern-Taiwan convention of keeping 台 rather than 臺.
#   - 郁: "濃郁" (rich/fragrant) is already correct as-is; OpenCC's default candidate for a bare
#     郁 is 鬱 (gloomy/dense), which is wrong here since there's no simplified-phrase context to
#     disambiguate against (the rest of the string is already traditional).
#   - 斗: "斗流路" is a phonetic transliteration of a Korean place name (두류길/Duryu-gil), not
#     the word "fight" (鬥) -- converting it would corrupt the transliteration.
#   - 污: "汙"/"污" are coexisting orthodox variants in Taiwan (both appear in official
#     dictionaries and government usage, e.g. 環境部 writes "水污染"), not a simplified-form
#     issue -- 污 is the far more common spelling and switching it isn't fixing anything.
#   - 霉: same story -- "發霉" is the everyday Taiwan spelling; "發黴" is technically also
#     valid but reads as unusually formal/archaic here.
NEVER_CONVERT = set("台郁斗污霉")


def safe_convert(orig):
    conv = cc.convert(orig)
    if len(conv) != len(orig):
        return conv  # length changed (rare); no positional revert possible, trust opencc
    out = []
    for a, b in zip(orig, conv):
        out.append(a if a in NEVER_CONVERT else b)
    return "".join(out)

FILES = [
    "pronunciation_data.py",
    "rhyme_data.py",
    "bible_numbers_data.py",
    "tone_pairs_data.py",
    "grammar_data.py",
    "curriculum_data.py",
    "culture_data.py",
    "offer_talks_data.py",
    "bible_names_data.py",
    "basic_words_list.py",
    "antonym_data.py",
    "sentence_gen_data.py",
    "grammar_extra_data.py",
    "grammar_dict_data.py",
    "dialect_words_data.py",
    "calendar_data.py",
]


def line_start_byte_offsets(src_bytes):
    """Return list where offsets[i] = byte offset of start of line i+1 (1-indexed lines)."""
    offsets = [0]
    idx = 0
    for line in src_bytes.split(b"\n")[:-1]:
        idx += len(line) + 1
        offsets.append(idx)
    return offsets


def collect_zh_replacements(src_text):
    tree = ast.parse(src_text)
    src_bytes = src_text.encode("utf-8")
    line_offsets = line_start_byte_offsets(src_bytes)
    replacements = []  # (abs_start, abs_end, new_bytes, orig_str)

    class Visitor(ast.NodeVisitor):
        def visit_Dict(self, node):
            for k, v in zip(node.keys, node.values):
                if (isinstance(k, ast.Constant) and k.value == "zh"
                        and isinstance(v, ast.Constant) and isinstance(v.value, str)):
                    orig = v.value
                    conv = safe_convert(orig)
                    if conv != orig:
                        abs_start = line_offsets[v.lineno - 1] + v.col_offset
                        abs_end = line_offsets[v.end_lineno - 1] + v.end_col_offset
                        new_literal = repr(conv).encode("utf-8")
                        replacements.append((abs_start, abs_end, new_literal, orig, conv))
            self.generic_visit(node)

    Visitor().visit(tree)
    return replacements, src_bytes


def process_file(path, apply=False):
    src_text = open(path, encoding="utf-8").read()
    replacements, src_bytes = collect_zh_replacements(src_text)
    if not replacements:
        return 0
    # apply from the end to keep earlier offsets valid
    replacements.sort(key=lambda r: r[0], reverse=True)
    out = bytearray(src_bytes)
    for abs_start, abs_end, new_literal, orig, conv in replacements:
        out[abs_start:abs_end] = new_literal
    if apply:
        open(path, "wb").write(bytes(out))
    else:
        # sanity check: must still be valid python
        ast.parse(out.decode("utf-8"))
    return len(replacements)


if __name__ == "__main__":
    apply = "--apply" in sys.argv
    total = 0
    for f in FILES:
        n = process_file(f, apply=apply)
        if n:
            print(f"{f}: {n} zh field(s) changed")
        total += n
    print("TOTAL changed:", total, "APPLIED" if apply else "(dry run)")
