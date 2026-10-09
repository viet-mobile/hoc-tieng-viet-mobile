# -*- coding: utf-8 -*-
"""Splits every class of regional_admin/teaching_guide.json (units[].timePlan) between the two instructors.

    python scripts/assign_instructors.py            # rewrite teaching_guide.json
    python scripts/assign_instructors.py --report   # only print the per-class totals

Instructor A: Korean, has studied Vietnamese for 23+ years -- explains in Korean, links Vietnamese to Korean (grammar,
Sino-Vietnamese / Sino-Korean vocabulary, Bible book names), runs homework, games and ceremonies.
Instructor B: native Vietnamese speaker, not very fluent in Korean -- pronunciation and tone models, songs, conversation,
natural phrasing, reading aloud, feedback on what the students say.

Class structure (guide['classStructure']): 50 minutes of teaching, the 10-minute break exactly at minute 50, then 60 minutes
that start with the 10-minute walk-around conversation practice (every class) and end with homework and the closing
song/prayer. A teaching item that straddles minute 50 is split in two ("... (이어서)" for the second part).

Every timePlan entry becomes [name, minutes, minutes of instructor A, reason key, posture]; minutes of B = minutes - A. A break has
A = null (nobody teaches). The break counts 5 + 5 minutes towards the instructors' totals, so each class comes out near
60 min for A and 60 min for B (the tolerance is TOLERANCE minutes). The reason keys are explained in guide['instructors'].
"""
import json
import os
import re
import sys

PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "regional_admin", "teaching_guide.json")
TOLERANCE = 2          # |A - B| in minutes after the balancing
BREAK_KEY = "break"

# (regex on the item name, share of the minutes taken by A (0..1), reason key, fixed = not moved by the balancing)
RULES = [
    (r"^돌아다니며 상호 대화 실습", 0.5, "mingle", True),
    (r"^시작 노래·기도$", 0.0, "open", True),
    (r"^마치는 노래·기도$", 1.0, "close", True),
    (r"^과제 확인·안내$", 1.0, "homework", True),
    (r"^휴식$", None, BREAK_KEY, True),
    (r"^항목 전환·여유$", 0.5, "slack", False),
    (r"^졸업", 1.0, "ceremony", True),
    (r"^졸업식 준비", 1.0, "ceremony", True),
    (r"집회 실연|집회 리허설|사회 표현|발표 준비|상황별 실연", 0.5, "rehearsal", False),
    (r"성서 연구 사회 실습", 0.5, "rehearsal", False),
    (r"일기쓰고 발표", 0.4, "feedback", False),
    (r"범용언어 생성법 소개", 1.0, "method", False),
    (r"범용언어 생성법을 통한|문장 만들기", 0.5, "sentence", False),
    (r"일반 문법|문법 특강|문법 예문|핵심 문형|문법 사전|연결사|어순 단원|움직임을 나타내는 동사", 0.75, "grammar", False),
    (r"어순반대 한자어|한자음", 0.6, "vocab", False),
    (r"어휘 학습", 0.55, "vocab", False),
    (r"성경 복습|성경 찾기 시험", 0.6, "bible", False),
    (r"끝말잇기|복습 게임|숫자 복습", 0.5, "game", False),
    (r"문화", 0.5, "culture", False),
    (r"호칭", 0.5, "usage", False),
    (r"남북", 0.4, "native", False),
    (r"행누|랑제|파수대 읽기", 0.4, "reading", False),
    (r"노래|합창", 0.25, "model", False),
    (r"제공 연설", 0.25, "model", False),
    (r"일상 회화|일상 생활 문장|이웃 사람과의 대화|대화 연습|길찾기|기도 준비", 0.3, "conversation", False),
    (r"문자", 0.5, "script", False),
    (r"발음|성조|숫자|요일|날짜|달, 계절|시간|책명|신권 용어", 0.35, "pron", False),
]

REASONS = {
    "mingle": {"ko": "두 강사가 함께 돌아다니며 학생들의 대화를 듣고 발음과 표현을 바로잡아 줍니다.",
               "vi": "Hai giảng viên cùng đi quanh lớp nghe học viên trò chuyện và sửa phát âm, cách diễn đạt."},
    "open": {"ko": "원어민이 선창해 발음·억양의 본보기를 보입니다.",
             "vi": "Người bản ngữ dẫn hát, làm mẫu phát âm và ngữ điệu."},
    "close": {"ko": "과제 안내와 이어서 한국어로 마무리합니다.",
              "vi": "Kết thúc bằng tiếng Hàn, nối tiếp phần giao bài tập."},
    "homework": {"ko": "과제 내용은 한국어로 정확하게 안내합니다.",
                 "vi": "Hướng dẫn bài tập chính xác bằng tiếng Hàn."},
    "slack": {"ko": "항목 전환과 여유 시간은 반씩 맡아 각자의 순서를 이끕니다.",
              "vi": "Thời gian chuyển mục và dự phòng chia đôi, mỗi người dẫn phần của mình."},
    "break": {"ko": "휴식 10분은 두 강사가 반씩(5분) 나눕니다.",
              "vi": "10 phút nghỉ chia đôi cho hai giảng viên (mỗi người 5 phút)."},
    "ceremony": {"ko": "졸업식 진행은 한국어로 합니다.",
                 "vi": "Lễ tốt nghiệp được dẫn dắt bằng tiếng Hàn."},
    "rehearsal": {"ko": "A: 집회 순서와 내용(한국어) · B: 자연스러운 베트남어 표현과 발음 교정.",
                  "vi": "A: trình tự và nội dung buổi họp (tiếng Hàn) · B: sửa cách diễn đạt và phát âm tự nhiên."},
    "feedback": {"ko": "B가 표현의 자연스러움과 발음을 봐 주고, A가 한국어로 보충합니다.",
                 "vi": "B sửa cách diễn đạt và phát âm, A bổ sung bằng tiếng Hàn."},
    "method": {"ko": "학습법 설명은 한국어로 A가 합니다.",
               "vi": "A giải thích phương pháp học bằng tiếng Hàn."},
    "sentence": {"ko": "A가 문장 구조를 이끌고, B가 자연스러운 표현으로 고쳐 줍니다.",
                 "vi": "A dẫn dắt cấu trúc câu, B chỉnh thành cách nói tự nhiên."},
    "grammar": {"ko": "문법 설명은 한국어로 A가, 예문 낭독과 확인은 B가 맡습니다.",
                "vi": "A giải thích ngữ pháp bằng tiếng Hàn, B đọc và kiểm tra câu ví dụ."},
    "vocab": {"ko": "A: 뜻과 한자어 연결 · B: 발음과 예문 낭독.",
              "vi": "A: nghĩa và liên hệ từ Hán · B: phát âm và đọc câu ví dụ."},
    "bible": {"ko": "성경 책 순서와 한국어 대응은 A가, 베트남어 발음은 B가 확인합니다.",
              "vi": "A lo thứ tự và tên sách tiếng Hàn tương ứng, B kiểm tra phát âm tiếng Việt."},
    "game": {"ko": "A가 한국어로 규칙을 진행하고, B가 발음과 정답을 확인합니다.",
             "vi": "A điều hành luật chơi bằng tiếng Hàn, B kiểm tra phát âm và đáp án."},
    "culture": {"ko": "B가 원어민의 실제 경험을, A가 한국어 설명과 비교를 맡습니다.",
                "vi": "B kể trải nghiệm thực tế của người bản ngữ, A giải thích và so sánh bằng tiếng Hàn."},
    "usage": {"ko": "A가 호칭 규칙을 설명하고, B가 실제 쓰임을 보여 줍니다.",
              "vi": "A giải thích quy tắc xưng hô, B cho thấy cách dùng thực tế."},
    "native": {"ko": "남북 차이는 원어민 B의 발음 시범이 중심입니다. A는 한국어로 정리합니다.",
               "vi": "Khác biệt Bắc–Nam chủ yếu do B phát âm mẫu, A tóm tắt bằng tiếng Hàn."},
    "reading": {"ko": "B가 먼저 읽어 들려주고 학생이 따라 읽습니다. A는 뜻과 내용을 한국어로 확인합니다.",
                "vi": "B đọc mẫu trước, học viên đọc theo; A xác nhận nghĩa và nội dung bằng tiếng Hàn."},
    "model": {"ko": "원어민 B가 소리의 본보기를, A가 한국어로 뜻을 보충합니다.",
              "vi": "B làm mẫu âm thanh, A bổ sung nghĩa bằng tiếng Hàn."},
    "conversation": {"ko": "B가 자연스러운 대화의 본보기를, A가 한국어 뜻과 연습 진행을 맡습니다.",
                     "vi": "B làm mẫu hội thoại tự nhiên, A lo nghĩa tiếng Hàn và điều hành luyện tập."},
    "script": {"ko": "A가 한글과 비교해 설명하고, B가 글자 소리를 들려줍니다.",
               "vi": "A so sánh với Hangul, B đọc mẫu âm của chữ cái."},
    "pron": {"ko": "B가 발음·성조 시범과 교정을, A가 한국어로 조음 설명을 보충합니다.",
             "vi": "B làm mẫu và sửa phát âm, thanh điệu; A bổ sung giải thích cách phát âm bằng tiếng Hàn."},
}

INSTRUCTORS = {
    "title": {"ko": "강사 분담 (A · B)", "vi": "Phân công giảng viên (A · B)"},
    "A": {"label": {"ko": "A 강사", "vi": "Giảng viên A", "en": "Instructor A"},
          "short": {"ko": "한국어 설명·문법", "vi": "giải thích tiếng Hàn, ngữ pháp", "en": "Korean explanations, grammar"},
          "profile": {"ko": "한국인 · 베트남어 학습 23년 이상",
                      "vi": "Người Hàn · học tiếng Việt hơn 23 năm"},
          "strengths": {"ko": "한국어 설명 · 문법 · 한자어 어휘 · 과제·게임·행사 진행",
                        "vi": "Giải thích bằng tiếng Hàn · ngữ pháp · từ Hán · bài tập, trò chơi, nghi thức"}},
    "B": {"label": {"ko": "B 강사", "vi": "Giảng viên B", "en": "Instructor B"},
          "short": {"ko": "원어민 발음·회화", "vi": "phát âm, hội thoại bản ngữ", "en": "native pronunciation & conversation"},
          "profile": {"ko": "베트남 원어민 · 한국어는 아주 유창하지 않음",
                      "vi": "Người Việt bản ngữ · tiếng Hàn chưa thật lưu loát"},
          "strengths": {"ko": "발음·성조 시범 · 노래 · 회화 · 읽기 · 자연스러운 표현 교정",
                        "vi": "Làm mẫu phát âm, thanh điệu · bài hát · hội thoại · đọc · sửa cách nói tự nhiên"}},
    "note": {"ko": "한 수업을 2시간으로 보고 A·B가 각각 약 60분을 맡도록 나눴습니다(휴식 10분은 반씩). 항목마다 분 단위로 정하며, 실제 진행에서는 상황에 맞게 바꿔도 됩니다.",
             "vi": "Mỗi buổi 2 giờ được chia để A và B mỗi người đảm nhận khoảng 60 phút (10 phút nghỉ chia đôi). Mỗi mục được chia theo phút; khi dạy thực tế có thể điều chỉnh linh hoạt."},
    "reasons": REASONS,
}


# ---- class structure -------------------------------------------------------------------------------------------------
FIRST_BLOCK = 50       # minutes of teaching before the break
BREAK_MIN = 10
CLASS_MIN = 120
MINGLE_MIN = 10
MINGLE_NAME = "돌아다니며 상호 대화 실습 (오늘 배운 표현으로)"
SLACK_NAME = "항목 전환·여유"
SLACK_MIN = 4          # at least this much transition time stays in a class
SPLIT_SUFFIX = " (이어서)"
OPEN_NAME, CLOSE_NAME, HOMEWORK_NAME, BREAK_NAME = "시작 노래·기도", "마치는 노래·기도", "과제 확인·안내", "휴식"
STRUCTURAL = {OPEN_NAME, CLOSE_NAME, HOMEWORK_NAME, BREAK_NAME, SLACK_NAME, MINGLE_NAME}

# posture of the students: stand / sit / move (walking around and talking with each other); the first match wins
POSTURES = [
    (r"^돌아다니며 상호 대화", "move"),
    (r"복습 게임|숫자 복습|끝말잇기|대화 연습", "move"),
    (r"^시작 노래·기도$|^마치는 노래·기도$", "stand"),
    (r"집회 실연|집회 리허설|사회 표현|졸업", "stand"),
    (r"노래|합창", "stand"),
    (r"제공 연설", "stand"),
    (r"일상 회화|일상 생활 문장|이웃 사람과의 대화|위치 전치사", "stand"),
    (r"어휘 학습|어순반대 한자어", "stand"),         # choral repetition of the words, standing (method #1)
    (r"발음|성조|숫자|요일|날짜|달, 계절|시간|책명|신권 용어", "stand"),
]
DEFAULT_POSTURE = "sit"

CLASS_STRUCTURE = {
    "firstBlock": FIRST_BLOCK, "break": BREAK_MIN, "secondBlock": CLASS_MIN - FIRST_BLOCK - BREAK_MIN, "mingle": MINGLE_MIN,
    "postures": {
        "stand": {"ko": "서서", "vi": "đứng", "en": "Standing"},
        "sit": {"ko": "앉아서", "vi": "ngồi", "en": "Seated"},
        "move": {"ko": "돌아다니며 대화", "vi": "đi lại trò chuyện", "en": "Walking & talking"},
        "flex": {"ko": "상황에 따라", "vi": "tùy tình huống", "en": "As needed"},
    },
    "note": {"ko": "수업은 정확히 50분 진행한 뒤 10분 쉬고, 이어서 60분을 합니다. 휴식 직후 10분은 학생들이 돌아다니며 서로 대화하는 실습입니다.",
             "vi": "Dạy đúng 50 phút rồi nghỉ 10 phút, sau đó học tiếp 60 phút. 10 phút ngay sau giờ nghỉ là thực hành đi lại trò chuyện với nhau.",
             "en": "Teaching runs exactly 50 minutes, then a 10-minute break, then 60 more minutes. The 10 minutes right after the break are a walk-around conversation practice."},
}


def posture_of(name):
    if name == BREAK_NAME:
        return "rest"
    if name == SLACK_NAME:
        return "flex"          # spare minutes between items: whatever the class needs, not counted as sitting
    for pattern, posture in POSTURES:
        if re.search(pattern, name):
            return posture
    return DEFAULT_POSTURE


MAX_SIT_RUN = 24       # minutes of sitting in a row, at most (where the class has another item to pull forward)
MAX_ACTIVE_RUN = 28    # ... and of standing / walking in a row


def kind_of(name):
    return "sit" if posture_of(name) == "sit" else ("active" if posture_of(name) in ("stand", "move") else "flex")


def spread_sitting(content):
    """Keeps the order inside each kind but pulls a later item of the other kind forward when the students would sit more than
    MAX_SIT_RUN, or stand / walk more than MAX_ACTIVE_RUN, minutes in a row. The run restarts at the break (about minute 54
    of the content; the walk-around practice that follows the break counts as 10 active minutes)."""
    rest = [list(i) for i in content]
    out, run, run_kind, cum = [], 4, "active", 4          # the opening song / prayer is standing
    limit = {"sit": MAX_SIT_RUN, "active": MAX_ACTIVE_RUN}
    while rest:
        pick = 0
        k0 = kind_of(rest[0][0])
        if k0 in limit and run_kind == k0 and run + rest[0][1] > limit[k0]:
            for k, it in enumerate(rest):
                if kind_of(it[0]) not in (k0, "flex"):
                    pick = k
                    break
        it = rest.pop(pick)
        out.append(it)
        k = kind_of(it[0])
        if k == run_kind:
            run += it[1]
        else:
            run_kind, run = k, it[1]
        cum += it[1]
        if cum >= FIRST_BLOCK + 4 and cum - it[1] < FIRST_BLOCK + 4:
            run_kind, run = "active", MINGLE_MIN
    return out


def restructure(plan):
    """plan: the unit's current timePlan (any earlier shape) -> [[name, minutes], ...] in the new order: 50 min, break, 60 min."""
    items = []
    for entry in plan:
        name, minutes = entry[0], entry[1]
        if name.endswith(SPLIT_SUFFIX) and items and items[-1][0] == name[:-len(SPLIT_SUFFIX)]:
            items[-1][1] += minutes                      # re-run: the two parts of a split item are one item again
        else:
            items.append([name, minutes])
    content = [i for i in items if i[0] not in STRUCTURAL]
    fixed = 4 + 5 + 4 + BREAK_MIN + MINGLE_MIN           # open + homework + close + break + mingle
    c = sum(i[1] for i in content)
    while CLASS_MIN - fixed - c < SLACK_MIN:             # not enough room: the largest teaching item gives a minute
        biggest = max(content, key=lambda i: i[1])
        biggest[1] -= 1
        c -= 1
    slack = CLASS_MIN - fixed - c

    content = spread_sitting(content)

    first, cum = [[OPEN_NAME, 4]], 4
    rest = [list(i) for i in content]
    while rest and cum + rest[0][1] <= FIRST_BLOCK:
        first.append(rest.pop(0))
        cum += first[-1][1]
    gap = FIRST_BLOCK - cum
    slack1 = min(gap, max(0, slack - 3)) if rest else min(gap, slack)
    if slack1:
        first.append([SLACK_NAME, slack1])
        cum += slack1
    gap = FIRST_BLOCK - cum
    if gap and rest:                                     # an item straddles the break: split it
        head, tail = rest[0], rest[0]
        first.append([head[0], gap])
        rest[0] = [head[0] + SPLIT_SUFFIX, head[1] - gap]
    second = [[BREAK_NAME, BREAK_MIN], [MINGLE_NAME, MINGLE_MIN]] + rest
    slack2 = slack - slack1
    if slack2:
        second.append([SLACK_NAME, slack2])
    second += [[HOMEWORK_NAME, 5], [CLOSE_NAME, 4]]
    out = first + second
    assert sum(m for _, m in out) == CLASS_MIN, (sum(m for _, m in out), out)
    cum = 0
    for name, m in out:
        if name == BREAK_NAME:
            assert cum == FIRST_BLOCK, (cum, out)
        cum += m
    return out


def classify(name):
    for pattern, share, key, fixed in RULES:
        if re.search(pattern, name):
            return share, key, fixed
    raise SystemExit("no rule for time-plan item: %r" % name)


def split_unit(plan):
    """plan: [[name, minutes, ...], ...] -> [[name, minutes, a_minutes_or_None, reason_key, fixed], ...]"""
    rows = []   # [name, minutes, a, key, fixed]
    flip = 0
    for entry in plan:
        name, minutes = entry[0], entry[1]
        share, key, fixed = classify(name)
        if share is None:
            rows.append([name, minutes, None, key, True])
            continue
        a = share * minutes
        if abs(a - int(a) - 0.5) < 1e-9:           # exact half minute: alternate who gets it
            a = int(a) + (flip % 2)
            flip += 1
        else:
            a = int(round(a))
        rows.append([name, minutes, a, key, fixed])

    def totals():
        a = sum(r[2] for r in rows if r[2] is not None)
        b = sum(r[1] - r[2] for r in rows if r[2] is not None)
        brk = sum(r[1] for r in rows if r[2] is None)
        return a + brk / 2.0, b + brk / 2.0

    guard = 0
    while guard < 400:
        guard += 1
        ta, tb = totals()
        if abs(ta - tb) <= TOLERANCE:
            break
        move_from_a = ta > tb
        best = None
        for r in rows:
            if r[2] is None or r[4]:
                continue
            lo, hi = (int(round(0.3 * r[1])), int(round(0.7 * r[1]))) if r[3] == "slack" else (0, r[1])   # slack stays shared
            can = r[2] > lo if move_from_a else r[2] < hi
            if not can:
                continue
            mixed = abs(r[2] / float(r[1]) - 0.5)       # the most shared item moves first
            if best is None or mixed < best[0]:
                best = (mixed, r)
        if best is None:
            break
        best[1][2] += -1 if move_from_a else 1
    return rows, totals()


def main():
    report = "--report" in sys.argv
    with open(PATH, encoding="utf-8") as f:
        data = json.load(f)
    guide = data["jeonju"]
    for u in guide["units"]:
        rows, (ta, tb) = split_unit(restructure(u["timePlan"]))
        total = sum(r[1] for r in rows)
        by = {}
        sit_run = longest = 0
        for r in rows:
            post = posture_of(r[0])
            by[post] = by.get(post, 0) + r[1]
            sit_run = sit_run + r[1] if post in ("sit",) else 0
            longest = max(longest, sit_run)
        print("unit %2d %s  total %3d  A %5.1f  B %5.1f  stand %2d sit %2d move %2d flex %2d  longest sitting run %2d" %
              (u["unit"], u["date"], total, ta, tb, by.get("stand", 0), by.get("sit", 0), by.get("move", 0), by.get("flex", 0), longest))
        u["timePlan"] = [[r[0], r[1], r[2], r[3], posture_of(r[0])] for r in rows]
    guide["instructors"] = INSTRUCTORS
    guide["classStructure"] = CLASS_STRUCTURE
    guide.setdefault("viText", {})[MINGLE_NAME] = "Đi lại trò chuyện với nhau (dùng các mẫu câu vừa học)"
    if not report:
        with open(PATH, "w", encoding="utf-8") as f:
            f.write(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
        print("written", os.path.normpath(PATH))


if __name__ == "__main__":
    main()
