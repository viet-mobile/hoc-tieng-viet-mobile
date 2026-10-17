# -*- coding: utf-8 -*-
"""Class timetable with ONE responsible person per item (teaching_guide.json units[].timePlan).

Time is allotted to exactly four owners, never split inside an item:
    A       instructor A (Korean): culture, offered talks, daily conversation / sentences, general grammar, homework
            instructions, opening / closing song announcement, and every item not named below
    B       instructor B Bình (native): tone / continuous-tone practice, all five Watchtower vocabulary blocks (each word 3 times),
            pronunciation, numbers, songs
    assist  native assistant Mai (Bình on the days listed in ASSISTANT_SUBSTITUTE): all five vocabulary blocks (Monday to Friday)
            and the Bible-book reading practice, each word / book name 3 times
    group   group activity: everything where the students walk around (mingle, games, conversation practice); the group leaders
            help their members one by one
A row is [name, minutes, owner|None (break), reason key, posture] (+ {kind, part} for the vocabulary blocks).
Minutes may be half minutes (4.5 = 4 min 30 s).

Vocabulary blocks: 34 words x 3 readings. 한자음 (rhyme) words take 6 min 30 s per block, any other 34 words 4 min 30 s; the
10 Watchtower words of a block (ordinary words) take 1 min 30 s at the same rate.
"""
import math
import re

OPEN, CLOSE, HOMEWORK, BREAK, MINGLE, SLACK = (
    "시작 노래·기도", "마치는 노래·기도", "과제 확인·안내", "휴식", "돌아다니며 상호 대화 실습 (오늘 배운 표현으로)", "항목 전환·여유")
SUFFIX = " (이어서)"
STARTS = (8, 22, 36, 70, 84)                    # start minute of the five vocabulary blocks (spaced retrieval)
DAYS = ("월요일", "화요일", "수요일", "목요일", "금요일")
FIXED_MIN = {OPEN: 4, CLOSE: 4, HOMEWORK: 5, MINGLE: 10, BREAK: 10}
RHYME_BLOCK, OTHER_BLOCK, WT_BLOCK = 6.5, 4.5, 1.5
ASSISTANT = "Mai"
ASSISTANT_SUBSTITUTE = {"2026-11-15": "Bình"}   # date -> who reads in the assistant's place
RHYME_WORDS, EARLY_CLASSES, EARLY_QUOTA = 316, 4, 170   # [어휘] stream starts with the 316 한자음 words (course_vocab_plan)

LEADER_PARTS = ()                               # every vocabulary block is read by Mai (Bình) and every Watchtower block by B

EXPERIENCE, REENACT = "학생들 경험담 발표", "학생들 경험담 재연"
ENCOURAGE_A, ENCOURAGE_B, ENCOURAGE_MIN = "A 강사 격려사", "B 강사 격려사", 15
REHEARSAL, REHEARSAL_MIN = "파수대 집회 실연", 60      # the last class: one hour, break afterwards
B_TALK_FROM_UNIT = 4                            # class of 2026-10-31
B_TALK_RULES = re.compile(r"제공 연설|일상 회화|일상 생활 문장|이웃 사람과의 대화")

BOOK_REVIEW = re.compile(r"성경 책명 읽기 연습 \d \([^)]*\) 복습$")   # the Bible-book review is led by instructor A, not the assistant
A_RULES = re.compile(r"^시작 노래·기도$|^마치는 노래·기도$|제공 연설|^문화|일상 회화|일상 생활 문장|일반 문법|^과제 확인")
ASSIST_RULES = re.compile(r"어휘 학습|성경 책명 읽기 연습")
# Items whose length is fixed (minutes); every other teaching item shares the remaining time in proportion to its earlier length.
PINNED = (
    (re.compile(r"^베트남어 발음 – 자음, 모음 복습$"), 5),
    (re.compile(r"^성조연습, 연속성조$"), 8),
    (re.compile(r"^베트남어 제공 연설 \d+"), 5),
    (re.compile(r"성경 책명 읽기 연습 \d \([^)]*\)$"), 5),
    (re.compile(r"^신권 용어, 주요 인물 발음 연습"), 5),
    (re.compile(r"^베트남어 숫자 복습$"), 7),
    (re.compile(r"성경 책명 읽기 연습 1 \(창세기-시편\) 복습$"), 7),
)
FIRST_ITEM = "베트남어 발음 – 자음, 모음 복습"   # taught right after the opening prayer (no vocabulary block before it)
B_RULES = re.compile(r"성조|발음|숫자|요일|날짜|달, 계절|시간|신권 용어|남북|노래|합창")


def owner_of(name, posture, meta=None, unit=0):
    base = name.removesuffix(SUFFIX)
    kind = (meta or {}).get("kind")
    if base == BREAK:
        return None
    if kind in ("course-vocab", "watchtower-vocab"):
        if meta["part"] in LEADER_PARTS:
            return "group"                        # the group leaders lead blocks 2-4
        return "assist" if kind == "course-vocab" else "B"
    if base == ENCOURAGE_A:
        return "A"
    if base == ENCOURAGE_B:
        return "B"
    if posture == "move" or base == MINGLE:
        return "group"
    if unit >= B_TALK_FROM_UNIT and B_TALK_RULES.search(base):
        return "B"                                # from the 31 Oct class on, B takes these talk / conversation items
    if A_RULES.search(base) or BOOK_REVIEW.search(base):
        return "A"
    if ASSIST_RULES.search(base):
        return "assist"
    if B_RULES.search(base):
        return "B"
    return "A"


def reason_of(name, meta=None):
    base = name.removesuffix(SUFFIX)
    kind = (meta or {}).get("kind")
    if kind in ("course-vocab", "watchtower-vocab"):
        lead = meta["part"] in LEADER_PARTS
        return ("leadvocab" if kind == "course-vocab" else "leadwtvocab") if lead else ("vocab" if kind == "course-vocab" else "wtvocab")
    if re.search(r"성조", base):
        return "tone"
    if BOOK_REVIEW.search(base):
        return "bookreview"
    if re.search(r"성경 책명 읽기 연습", base):
        return "bookname"
    return None


def has_rhyme(unit, part):
    """Does part (0..4) of class `unit`'s daily vocabulary contain 한자음 words?"""
    if unit > EARLY_CLASSES:
        return False                              # the 한자음 words are used up within the first classes
    lo = EARLY_QUOTA * (unit - 1)
    a, b = lo + round(EARLY_QUOTA * part / 5), lo + round(EARLY_QUOTA * (part + 1) / 5)
    return a < RHYME_WORDS


def _pinned(name):
    for rx, minutes in PINNED:
        if rx.search(name):
            return int(minutes * 2)
    return None


def _apportion(weights, total, minimum, fixed=None):
    """Split `total` half minutes by weight (at least `minimum` each); entries of `fixed` that are not None keep that size."""
    fixed = fixed or [None] * len(weights)
    free = [i for i, f in enumerate(fixed) if f is None]
    left = total - sum(f for f in fixed if f is not None)
    out = [f if f is not None else 0 for f in fixed]
    if not free:
        if left != 0:
            raise ValueError("fixed items do not fill the window")
        return out
    w = [weights[i] for i in free]
    remaining = left - minimum * len(w)
    if remaining < 0:
        raise ValueError("too many teaching items for the available time")
    extra = [max(0, x - minimum) for x in w]
    raw = [remaining * x / sum(extra) for x in extra] if sum(extra) else [remaining / len(w)] * len(w)
    sz = [minimum + math.floor(v) for v in raw]
    for i in sorted(range(len(sz)), key=lambda i: (-(raw[i] % 1), i))[:left - sum(sz)]:
        sz[i] += 1
    for i, v in zip(free, sz):
        out[i] = v
    return out


def _num(half):
    return half // 2 if half % 2 == 0 else half / 2


def rebuild(plan, unit):
    """plan: current timePlan rows (any earlier shape) -> rows in the owner model.

    Every teaching item is ONE row (never cut by a vocabulary block or by the break). The five vocabulary blocks are placed at
    the item boundaries nearest to their spaced times (about 8, 22, 36 / 70, 84 minutes); the break is exactly at minute 50."""
    vocab_class = any(len(p) > 5 and p[5].get("kind") == "course-vocab" for p in plan)
    structural = ("open", "close", "homework", "mingle", "break", "vocab", "slack", "wtvocab")
    core, order, slack = {}, [], 0
    for p in plan:
        if p[3] == "slack":
            slack += p[1]
            continue
        if p[3] in structural or (len(p) > 5 and p[5].get("kind")):
            continue
        base = p[0].removesuffix(SUFFIX)
        if base not in core:
            core[base] = [0, p[3], p[4]]
            order.append(base)
        core[base][0] += p[1]
    out = []

    def row(name, minutes, reason, posture, meta=None):
        out.append([name, _num(int(round(minutes * 2))), owner_of(name, posture, meta, unit), reason_of(name, meta) or reason, posture] + ([meta] if meta else []))

    if vocab_class:
        blocks = [(RHYME_BLOCK if has_rhyme(unit, i) else OTHER_BLOCK) for i in range(5)]
        block_h = [int(2 * (b + WT_BLOCK)) for b in blocks]
        content = int(2 * (120 - sum(FIXED_MIN.values()) - sum(blocks) - 5 * WT_BLOCK))
    else:
        block_h = []
        content = 0
    if vocab_class:
        sizes = _apportion([2 * core[n][0] for n in order], content, 2, [_pinned(n) for n in order])   # half minutes, at least 1 min each
        items = [[n, sz, core[n][1], core[n][2], _pinned(n)] for n, sz in zip(order, sizes)]
        group_items = [it for it in items if owner_of(it[0], it[3], None, unit) == "group"]
        items = [it for it in items if it not in group_items]
        G = sum(it[1] for it in group_items)
        pre_total = 100 - 8 - sum(block_h[:3])           # half minutes of teaching before the break
        # whole items before the break: the prefix whose total is nearest to the window, rescaled to fill it exactly
        # (pinned items keep their length; a prefix whose pinned items alone cannot fit the window is skipped)
        post_total_all = content - G - pre_total
        cands, cum = [], 0
        for k in range(1, len(items)):
            cum += items[k - 1][1]
            cands.append((abs(cum - pre_total), k))
        k = len(items)
        for _, kk in sorted(cands):
            try:
                _apportion([it[1] for it in items[:kk]], pre_total, 2, [it[4] for it in items[:kk]])
                _apportion([it[1] for it in items[kk:]], post_total_all, 2, [it[4] for it in items[kk:]])
            except ValueError:
                continue
            k = kk
            break
        post_total = post_total_all
        if k < len(items):
            pre_sz = _apportion([it[1] for it in items[:k]], pre_total, 2, [it[4] for it in items[:k]])
            post_sz = _apportion([it[1] for it in items[k:]], post_total, 2, [it[4] for it in items[k:]])
            for it, sz in zip(items, pre_sz + post_sz):
                it[1] = sz
        pre, post = items[:k], items[k:]

        def place(seq, ideal, pending, clock):
            """Items whole; before an item, the pending blocks whose ideal time is nearer to now than to the item's end."""
            for name, size, reason, posture, _pin in seq:
                if name == FIRST_ITEM:
                    row(name, size / 2, reason, posture)
                    clock += size
                    continue
                while pending and abs(ideal[pending[0]] - clock) <= abs(ideal[pending[0]] - (clock + size)):
                    emit_block(pending.pop(0))
                    clock += block_h[len(done) - 1]
                row(name, size / 2, reason, posture)
                clock += size
            while pending:
                part = pending.pop(0)
                emit_block(part)
                clock += block_h[part]
            return clock

        done = []

        def emit_block(part):
            done.append(part)
            row("베트남어 어휘 학습 · %s 과제 묶음 (%d/5)" % (DAYS[part], part + 1), blocks[part], "vocab", "stand", {"kind": "course-vocab", "part": part})
            row("파수대 어휘 학습 · %s 과제 묶음 (%d/5)" % (DAYS[part], part + 1), WT_BLOCK, "wtvocab", "stand", {"kind": "watchtower-vocab", "part": part})

        ideal = {0: 16, 1: 44, 2: 72, 3: 140 + G, 4: 168 + G}   # half minutes
        row(OPEN, 4, "open", "stand")
        place(pre, ideal, [0, 1, 2], 8)
        row(BREAK, 10, "break", "rest")
        row(MINGLE, 10, "mingle", "move")
        for name, size, reason, posture, _pin in group_items:
            row(name, size / 2, reason, posture)
        place(post, ideal, [3, 4], 140 + G)
    else:
        # The last class (no vocabulary blocks, no break, no walk-around practice, no homework briefing): the Watchtower meeting
        # rehearsal is one 60-minute piece, then the students' experience presentations and their re-enactments, then one
        # 15-minute encouragement talk from each instructor. The class closes with the graduation song (the closing song).
        row(OPEN, 4, "open", "stand")
        lead = [n for n in order if n.startswith(REHEARSAL)]
        for n in lead:
            row(n, REHEARSAL_MIN, core[n][1], core[n][2])
        left = 120 - 4 - REHEARSAL_MIN * len(lead) - 2 * ENCOURAGE_MIN - 4
        row(EXPERIENCE, left // 2, "rehearsal", "stand")
        row(REENACT, left - left // 2, "rehearsal", "stand")
        row(ENCOURAGE_A, ENCOURAGE_MIN, "encourage", "stand")
        row(ENCOURAGE_B, ENCOURAGE_MIN, "encourage", "stand")
        row(CLOSE, 4, "close", "stand")
        assert sum(p[1] for p in out) == 120, sum(p[1] for p in out)
        return out
    row(HOMEWORK, 5, "homework", "sit")
    row(CLOSE, 4, "close", "stand")
    assert sum(p[1] for p in out) == 120, sum(p[1] for p in out)
    at = 0
    for p in out:
        if p[0] == BREAK:
            assert at == 50, at
        at += p[1]
    return out


INSTRUCTORS = {
    "title": {"ko": "담당 구분 (A · B · 보조자 · 조별 활동)", "vi": "Phân công phụ trách (A · B · trợ giảng · hoạt động nhóm)"},
    "A": {"label": {"ko": "A 강사", "vi": "Giảng viên A", "en": "Instructor A"},
          "short": {"ko": "한국어 설명·문법·안내", "vi": "giải thích tiếng Hàn, ngữ pháp, hướng dẫn", "en": "Korean explanations, grammar, instructions"},
          "profile": {"ko": "한국인 · 베트남어 학습 23년 이상", "vi": "Người Hàn · học tiếng Việt hơn 23 năm"},
          "strengths": {"ko": "문화 · 일반 문법 · 성경 책명 복습 · 과제 확인 안내 · 마치는 노래 안내 (10/31 수업부터 제공 연설·일상 회화·일상 생활 문장·이웃 사람과의 대화는 B 강사)",
                        "vi": "Văn hóa · ngữ pháp · hướng dẫn bài tập · giới thiệu bài hát kết thúc (từ buổi 31/10, bài nói chuyện, hội thoại, câu sinh hoạt và đối thoại với hàng xóm do giảng viên B phụ trách)"}},
    "B": {"label": {"ko": "B 강사 (Bình 형제)", "vi": "Giảng viên B (anh Bình)", "en": "Instructor B (Bình)"},
          "short": {"ko": "성조·파수대 어휘·발음", "vi": "thanh điệu, từ vựng Tháp Canh, phát âm", "en": "tones, Watchtower vocabulary, pronunciation"},
          "profile": {"ko": "베트남 원어민 · 한국어는 아주 유창하지 않음", "vi": "Người Việt bản ngữ · tiếng Hàn chưa thật lưu loát"},
          "strengths": {"ko": "성조연습·연속성조와 모든(월~금) 파수대 어휘 학습에서 각 단어를 3번씩 읽고, 10/31 수업부터 제공 연설·일상 회화·일상 생활 문장·이웃 사람과의 대화를 맡습니다",
                        "vi": "Đọc mỗi từ 3 lần trong luyện thanh điệu, thanh điệu liên tiếp và tất cả các phần từ vựng Tháp Canh (thứ Hai đến thứ Sáu)"}},
    "assist": {"label": {"ko": "원어민 보조자 (Mai 자매)", "vi": "Trợ giảng bản ngữ (chị Mai)", "en": "Native assistant (Mai)"},
               "short": {"ko": "어휘·성경 책명 읽기", "vi": "đọc từ vựng, tên sách Kinh Thánh", "en": "vocabulary and Bible book names"},
               "profile": {"ko": "베트남 원어민 보조자", "vi": "Trợ giảng người Việt bản ngữ"},
               "strengths": {"ko": "모든(월~금) 베트남어 어휘 학습과 성경 책명 읽기 연습에서 각 단어(책명)를 3번씩 읽어 줍니다",
                             "vi": "Đọc mỗi từ (tên sách) 3 lần trong tất cả các phần học từ vựng (thứ Hai đến thứ Sáu) và luyện đọc tên sách Kinh Thánh"},
               "substitute": {"ko": "{date}에는 Mai 자매 대신 Bình 형제가 읽습니다.", "vi": "Ngày {date}, anh Bình đọc thay chị Mai."}},
    "group": {"label": {"ko": "조별 활동", "vi": "Hoạt động nhóm", "en": "Group activity"},
              "short": {"ko": "조장이 조원을 개별적으로 도와준다", "vi": "tổ trưởng giúp từng thành viên trong nhóm", "en": "group leaders help their members one by one"},
              "profile": {"ko": "학습자 조별 활동", "vi": "Học viên hoạt động theo nhóm"},
              "strengths": {"ko": "돌아다니며 하는 모든 활동을 조별 활동으로 분류하며, 조장이 조원을 개별적으로 도와줍니다",
                          "vi": "Mọi hoạt động đi lại tính là hoạt động nhóm; tổ trưởng giúp từng thành viên"}},
    "note": {"ko": "시간은 A 강사, B 강사, 보조자, 조별 활동 중 한 곳에만 배정하며, 한 항목을 둘로 나누지 않습니다. 월~금 어휘 학습은 모두 보조자(Mai)가, 월~금 파수대 어휘 학습은 모두 B 강사가 읽습니다. 조별 활동에서는 조장이 조원을 개별적으로 도와줍니다. 어휘는 한자음 34개에 6분 30초, 그 외 34개에 4분 30초, 파수대 어휘 10개에 1분 30초를 잡았습니다.",
             "vi": "Mỗi mục chỉ giao cho một bên: giảng viên A, giảng viên B, trợ giảng hoặc hoạt động nhóm; mọi phần từ vựng (thứ Hai đến thứ Sáu) do trợ giảng Mai đọc, mọi phần từ vựng Tháp Canh do giảng viên B đọc; trong hoạt động nhóm, tổ trưởng giúp từng thành viên. 34 từ Hán Việt 6 phút 30 giây, 34 từ khác 4 phút 30 giây, 10 từ Tháp Canh 1 phút 30 giây."},
    "reasons": {
        "open": {"ko": "A 강사가 시작 노래와 기도를 안내합니다.", "vi": "Giảng viên A hướng dẫn bài hát và lời cầu nguyện mở đầu."},
        "close": {"ko": "A 강사가 마치는 노래를 안내합니다.", "vi": "Giảng viên A hướng dẫn bài hát kết thúc."},
        "homework": {"ko": "A 강사가 과제 내용을 확인하고 안내합니다.", "vi": "Giảng viên A kiểm tra và hướng dẫn bài tập."},
        "mingle": {"ko": "학생들이 돌아다니며 대화하는 조별 활동입니다.", "vi": "Hoạt động nhóm: học viên đi lại trò chuyện với nhau."},
        "vocab": {"ko": "보조자가 단어를 하나씩 3번 읽고 학생들이 따라 읽습니다.", "vi": "Trợ giảng đọc từng từ 3 lần, học viên đọc theo."},
        "leadvocab": {"ko": "각 조 조장이 이끌어 조원들이 단어를 하나씩 3번 읽습니다.", "vi": "Tổ trưởng từng nhóm dẫn dắt, các thành viên đọc từng từ 3 lần."},
        "leadwtvocab": {"ko": "각 조 조장이 이끌어 조원들이 파수대 어휘를 하나씩 3번 읽습니다.", "vi": "Tổ trưởng từng nhóm dẫn dắt, các thành viên đọc từng từ Tháp Canh 3 lần."},
        "wtvocab": {"ko": "B 강사가 파수대 어휘를 하나씩 3번 읽고 학생들이 따라 읽습니다.", "vi": "Giảng viên B đọc từng từ Tháp Canh 3 lần, học viên đọc theo."},
        "encourage": {"ko": "해당 강사가 학습자들에게 격려사를 전합니다(15분).", "vi": "Giảng viên phụ trách gửi lời khích lệ đến học viên (15 phút)."},
        "tone": {"ko": "B 강사가 각 단어를 3번씩 읽어 줍니다.", "vi": "Giảng viên B đọc mỗi từ 3 lần."},
        "bookreview": {"ko": "A 강사가 책명 복습을 이끌고 학생들이 풍선을 튕기며 책명을 읽습니다(#5).", "vi": "Giảng viên A hướng dẫn ôn tên sách, học viên vừa tung bóng vừa đọc (#5)."},
        "bookname": {"ko": "보조자가 각 책명을 3번씩 읽어 줍니다.", "vi": "Trợ giảng đọc mỗi tên sách 3 lần."},
    },
}

CLASS_NOTE = {
    "ko": "수업은 정확히 50분 진행한 뒤 10분 쉬고, 이어서 60분을 합니다. 휴식 직후 10분은 학생들이 돌아다니며 서로 대화하는 조별 활동입니다.",
    "vi": "Dạy đúng 50 phút rồi nghỉ 10 phút, sau đó học tiếp 60 phút. 10 phút ngay sau giờ nghỉ là hoạt động nhóm: học viên đi lại trò chuyện với nhau.",
    "en": "Teaching runs exactly 50 minutes, then a 10-minute break, then 60 more minutes. The 10 minutes right after the break are a group activity: students walk around and talk with each other.",
}


LAST_CLASS_NOTE = {
    "ko": "이 회차는 파수대 집회 실연 60분 뒤 학생들의 경험담 발표와 재연을 하고, A강사·B강사의 격려사(각 15분)로 마칩니다. 휴식, 돌아다니며 하는 대화, 졸업, 과제 확인 안내는 없습니다.",
    "vi": "Buổi này diễn tập buổi họp Tháp Canh 60 phút, rồi học viên trình bày và tái hiện kinh nghiệm, kết thúc bằng lời khích lệ của giảng viên A và B (mỗi người 15 phút). Không nghỉ giải lao, không hoạt động đi lại trò chuyện, không lễ tốt nghiệp và không giao bài tập.",
    "en": "This class rehearses the Watchtower meeting for 60 minutes, then students present and re-enact their experiences, and closes with a 15-minute encouragement talk from each instructor. There is no break, no walk-around practice, no graduation item and no homework briefing.",
}


def main():
    import json
    import os
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "teaching_guide.json")
    data = json.load(open(path, encoding="utf-8"))
    guide = data["jeonju"]
    for u in guide["units"]:
        u["timePlan"] = rebuild(u["timePlan"], u["unit"])
        if u["unit"] == 16:
            u["classNote"] = LAST_CLASS_NOTE
            guide.setdefault("viText", {}).update({EXPERIENCE: "Học viên trình bày kinh nghiệm", REENACT: "Học viên tái hiện kinh nghiệm", ENCOURAGE_A: "Lời khích lệ của giảng viên A", ENCOURAGE_B: "Lời khích lệ của giảng viên B"})
        who = ASSISTANT_SUBSTITUTE.get(u["date"])
        if who:
            u["assistant"] = who
        else:
            u.pop("assistant", None)
    guide["instructors"] = INSTRUCTORS
    guide["classStructure"]["note"] = CLASS_NOTE
    guide["classStructure"]["assistant"] = ASSISTANT
    guide["classStructure"]["assistantSubstitute"] = ASSISTANT_SUBSTITUTE
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    print("written", path)


if __name__ == "__main__":
    main()
