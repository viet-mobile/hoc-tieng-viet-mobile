import json, copy, re
from peer_data import PEER_SAME_SEX, PEER_OPPOSITE_MALE, PEER_OPPOSITE_FEMALE
from elder_data import build_elder_same, build_elder_opposite, build_stranger
from extra_stages import build_extra, study_conducting_extra

existing = json.load(open("master_situations.json", encoding="utf-8"))

# canonical entries from pptx (1-16) -- drop 'stages_south', keep only 'stages_north' as 'stages'
cases = []
for num in [str(i) for i in range(1,17)]:
    v = existing[num]
    entry = {
        "id": f"s{num}",
        "speaker": v["speaker"],
        "listener_gender": v["listener_gender"],
        "rel": v["rel"],
        "self_term": v["self_term"],
        "listener_term": v["listener_term"],
        "same_sex": v["same_sex"],
        "self_term_south": v.get("self_term_south"),
        "listener_term_south": None,
        "stages": v["stages_north"],
    }
    cases.append(entry)

def fill_me(stages, name_vi, name_kr):
    out = {}
    for stage, items in stages.items():
        newitems = []
        for it in items:
            newit = dict(it)
            newit["viet"] = it["viet"].replace("{ME_VI}", name_vi)
            newit["gloss"] = it["gloss"].replace("{ME_VI}", name_vi)
            newit["translation"] = it["translation"].replace("{ME_KR}", name_kr)
            newitems.append(newit)
        out[stage] = newitems
    return out

# peer (same-age) cases: brother/sister x male/female listener
# North-canonical pronouns: tớ (I) / cậu (you); South: mình (I) / bạn (you) -- see app_logic.js region swap.
peer_defs = [
    ("brother", "male",   "Đông-ju", "동주", PEER_SAME_SEX, True),
    ("brother", "female", "Đông-ju", "동주", PEER_OPPOSITE_FEMALE, False),
    ("sister",  "male",   "Suji",    "수지", PEER_OPPOSITE_MALE, False),
    ("sister",  "female", "Suji",    "수지", PEER_SAME_SEX, True),
]
for i, (speaker, lgender, name_vi, name_kr, script, same_sex) in enumerate(peer_defs, start=17):
    entry = {
        "id": f"s{i}",
        "speaker": speaker,
        "listener_gender": lgender,
        "rel": "peer",
        "self_term": "tớ",
        "listener_term": "cậu",
        "same_sex": same_sex,
        "self_term_south": "mình",
        "listener_term_south": "bạn",
        "stages": fill_me(script, name_vi, name_kr),
    }
    cases.append(entry)

# --- elder_uncle_aunt: speaker is uncle/aunt-age relative to listener ---
# self = chú(brother)/cô(sister), listener always addressed as cháu(north)/con(south)
elder_kin_defs = [
    ("brother", "male",   "chú", "Minh", "민", None),
    ("brother", "female", "chú", "Lan",  "란", ("chị", "Mai", "마이", "자매")),
    ("sister",  "female", "cô",  "Lan",  "란", None),
    ("sister",  "male",   "cô",  "Minh", "민", ("anh", "Bình", "빈", "형제")),
]
for speaker, lgender, self_term, contact, contact_kr, companion in elder_kin_defs:
    name_vi, name_kr = ("Đông-ju", "동주") if speaker == "brother" else ("Suji", "수지")
    if companion is None:
        stages = build_elder_same(self_term, contact, contact_kr, name_vi, name_kr)
    else:
        ct, cname, cname_kr, role = companion
        stages = build_elder_opposite(self_term, ct, cname, cname_kr, role, contact, contact_kr, name_vi, name_kr)
    cases.append({
        "id": None,
        "speaker": speaker, "listener_gender": lgender, "rel": "elder_uncle_aunt",
        "self_term": self_term, "listener_term": "cháu", "same_sex": companion is None,
        "self_term_south": None, "listener_term_south": "con",
        "stages": fill_me(stages, name_vi, name_kr),
    })

# --- elder_parent_age: speaker is older than listener's parents ---
# self = bác (either speaker gender), listener always cháu(north)/con(south)
elder_parent_defs = [
    ("brother", "male",   "Minh", "민", None),
    ("brother", "female", "Lan",  "란", ("chị", "Mai", "마이", "자매")),
    ("sister",  "female", "Lan",  "란", None),
    ("sister",  "male",   "Minh", "민", ("anh", "Bình", "빈", "형제")),
]
for speaker, lgender, contact, contact_kr, companion in elder_parent_defs:
    name_vi, name_kr = ("Đông-ju", "동주") if speaker == "brother" else ("Suji", "수지")
    if companion is None:
        stages = build_elder_same("bác", contact, contact_kr, name_vi, name_kr)
    else:
        ct, cname, cname_kr, role = companion
        stages = build_elder_opposite("bác", ct, cname, cname_kr, role, contact, contact_kr, name_vi, name_kr)
    cases.append({
        "id": None, "speaker": speaker, "listener_gender": lgender, "rel": "elder_parent_age",
        "self_term": "bác", "listener_term": "cháu", "same_sex": companion is None,
        "self_term_south": None, "listener_term_south": "con",
        "stages": fill_me(stages, name_vi, name_kr),
    })

# --- stranger_polite: first meeting, keep a polite distance, self = tôi (no south variant) ---
# listener_term depends on listener's estimated age bracket + gender:
#   "2030" (20s-30s): male -> anh, female -> chị
#   "4070" (40s-70s): male -> chú, female -> cô
#   "80+"  (80s+):    either gender -> bác
stranger_defs = [
    ("brother", "male",   "2030", "anh", "Long", "롱"),
    ("brother", "female", "2030", "chị", "Linh", "린"),
    ("brother", "male",   "4070", "chú", "Hùng", "훙"),
    ("brother", "female", "4070", "cô",  "Xuân", "쑤언"),
    ("brother", "male",   "80+",  "bác", "Tâm",  "떰"),
    ("brother", "female", "80+",  "bác", "Hoa",  "호아"),
    ("sister",  "male",   "2030", "anh", "Long", "롱"),
    ("sister",  "female", "2030", "chị", "Linh", "린"),
    ("sister",  "male",   "4070", "chú", "Hùng", "훙"),
    ("sister",  "female", "4070", "cô",  "Xuân", "쑤언"),
    ("sister",  "male",   "80+",  "bác", "Tâm",  "떰"),
    ("sister",  "female", "80+",  "bác", "Hoa",  "호아"),
]
for speaker, lgender, bracket, listener_term, contact, contact_kr in stranger_defs:
    name_vi, name_kr = ("Đông-ju", "동주") if speaker == "brother" else ("Suji", "수지")
    same_sex = (speaker == "brother" and lgender == "male") or (speaker == "sister" and lgender == "female")
    stages = build_stranger(listener_term, contact, contact_kr, name_vi, name_kr)
    cases.append({
        "id": None, "speaker": speaker, "listener_gender": lgender, "rel": "stranger_polite",
        "self_term": "tôi", "listener_term": listener_term, "same_sex": same_sex,
        "self_term_south": None, "listener_term_south": None, "age_bracket": bracket,
        "stages": fill_me(stages, name_vi, name_kr),
    })

# assign sequential ids to every case appended after the original 20
next_id = 21
for c in cases:
    if c["id"] is None:
        c["id"] = f"s{next_id}"
        next_id += 1

# --- inject PDF "제공 연설" bonus content missing from every case: God's name + a short
#     video offer + a brief hope message (Ps 37:29 / tract-offer idea) + the meeting time
#     detail, appended as a new final stage; plus the Ps 119:105 flashlight illustration
#     appended onto each case's existing last ("...연구 사회") stage. Register (style) is
#     chosen per rel category to match the house style already used elsewhere in the app. ---
REL_STYLE = {
    "younger_sibling": "self_senior",
    "peer": "peer",
    "older_sibling": "self_junior",
    "younger_than_parent": "self_junior_a",
    "older_than_parent": "self_junior_a",
    "elder_uncle_aunt": "self_senior",
    "elder_parent_age": "self_senior",
    "stranger_polite": "stranger",
}

for c in cases:
    style = REL_STYLE[c["rel"]]
    first_stage_items = next(iter(c["stages"].values()))
    contact_name = "Nam"
    for it in first_stage_items:
        if it.get("reply"):
            m = re.match(r"^(\S+):", it["reply"])
            if m:
                contact_name = m.group(1)
                break
    last_key = list(c["stages"].keys())[-1]
    c["stages"][last_key] = c["stages"][last_key] + study_conducting_extra(style)
    extra = build_extra(c["self_term"], c["listener_term"], style, contact_name, "")
    c["stages"].update(extra)

# Global fixups applied to the fully assembled data:
#  - example phone number changed from the original placeholder to a distinct one.
raw = json.dumps(cases, ensure_ascii=False)
raw = raw.replace("010-1234-5678", "010-2345-6789")
cases = json.loads(raw)

#  - the "ạ" politeness particle stays ONLY for the one scenario it originally models:
#    cháu (self) addressing chú/cô/bác (listener) -- i.e. rel in younger_than_parent /
#    older_than_parent, and only in the north-canonical text (the south "con" variant has
#    ạ stripped too, but that swap happens at render time in app_logic.js since south text
#    is derived from the north text on the fly). Every other rel (younger_sibling, peer,
#    older_sibling, elder_uncle_aunt, elder_parent_age, stranger_polite) never used ạ this
#    way, so strip it from their source text now.
A_EXEMPT_RELS = {"younger_than_parent", "older_than_parent"}


def strip_a(text):
    if not text:
        return text
    return re.sub(r"\sạ(?=[!?.,]|\s|$)", "", text)


for c in cases:
    if c["rel"] in A_EXEMPT_RELS:
        continue
    for stage, items in c["stages"].items():
        for it in items:
            it["viet"] = strip_a(it["viet"])
            it["gloss"] = it["gloss"].replace("  (높임)", "").replace(" (높임)", "")
            if it.get("reply"):
                it["reply"] = strip_a(it["reply"])

json.dump(cases, open("app_data.json", "w", encoding="utf-8"), ensure_ascii=False, indent=0)
print("total cases:", len(cases))
sizes = {c["id"]: sum(len(x) for x in c["stages"].values()) for c in cases}
print(sizes)
