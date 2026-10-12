# -*- coding: utf-8 -*-
"""
Audit of the [과정] > [주간 수행 과제] 예습 / 복습 labels against what each class actually teaches.

The assignments of unit u are done in the week BEFORE class u (the card of the previous class shows them), so:
  - an item that is taught in class u (or later) is a 예습 (preview) -- it has not been taught yet;
  - an item that an earlier class taught is a 복습 (review);
  - an item that a class repeats every week (성조연습, 연속성조 ...) is a 예습 in the week of the class that repeats it;
  - vocabulary / grammar ranges: contained in an earlier class's range -> 복습; otherwise 복습 only when the same range was already
    assigned earlier (the app's "다음 학습일 복습"), else 예습.
Items whose text matches no learning item are left alone and listed.

    python3 scripts/audit_assignment_categories.py [curriculum.json] [--sql out.sql]

curriculum.json defaults to the live https://jeonju.hoc.tieng.viet.mobile/api/regional/curriculum answer.
"""
import json, re, collections, sys, urllib.request

DEFAULT_URL = "https://jeonju.hoc.tieng.viet.mobile/api/regional/curriculum"
args = [a for a in sys.argv[1:] if not a.startswith("--")]
sql_out = sys.argv[sys.argv.index("--sql") + 1] if "--sql" in sys.argv else None
if sql_out and sql_out in args:
    args.remove(sql_out)
src = args[0] if args else DEFAULT_URL
if src.startswith("http"):
    with urllib.request.urlopen(src) as r:
        d = json.load(r)
else:
    d = json.load(open(src, encoding="utf-8"))
units = d["source"]["units"]
DAYS=["월","화","수","목","금"]
def key_range(t):
    m=re.match(r"^.*\((한자음|어순반대|동일음|반의|기본|상용|신권|인명|끝말|남북 단어|단어)\s*(\d+)~(\d+)번\)\s*$",t)
    if m: return ("v:"+m.group(1),int(m.group(2)),int(m.group(3)))
    m=re.match(r"^일반 문법 (\d+)~(\d+)번$",t)
    if m: return ("g",int(m.group(1)),int(m.group(2)))
    m=re.match(r"^일반 문법 (\d+)번$",t)
    if m: return ("g",int(m.group(1)),int(m.group(1)))
    return None
def is_vocab_like(t): return key_range(t) is not None
learn=collections.defaultdict(list)
for u in units:
    for it in u["learning"]:
        t=it["text"]["ko"]; learn[u["unit"]].append((t,key_range(t)))
def contains(rk,lk): return rk and lk and rk[0]==lk[0] and lk[1]<=rk[1] and rk[2]<=lk[2]
def units_of(t):
    rk=key_range(t); out=[]
    for u,items in sorted(learn.items()):
        for lt,lk in items:
            if lt==t or contains(rk,lk): out.append(u); break
    return out
ALIAS={(2,"베트남어 숫자"):"베트남어 숫자 1–9"}
# earlier appearance in the timeline (assignments of any category), by exact text
seen={}   # text -> (unit, dayidx) first
order=[]
for u in units:
    for it in u["assignments"]:
        order.append((u["unit"],DAYS.index(it["day"]),it))
order.sort(key=lambda x:(x[0],x[1]))
issues=[]
for (un,di,it) in order:
    cat=it["category"]; t0=it["text"]["ko"]
    first=seen.get(t0)
    if cat in("preview","review"):
        t=ALIAS.get((un,t0),t0)
        us=units_of(t)
        earlier=[x for x in us if x<un]
        cur=un in us
        if is_vocab_like(t):
            if earlier: want="review"
            elif us:   # taught in this or a later unit
                want="review" if (first and (first[0],first[1])<(un,di)) else "preview"
            else:
                want=None
        else:
            if cur: want="preview"
            elif earlier: want="review"
            elif us: want="preview"
            else: want=None
        if want and want!=cat: issues.append((un,it["day"],cat,want,t0,us,it["uid"]))
    seen.setdefault(t0,(un,di))


print("flagged", len(issues))
for i in issues:
    print("  unit %d %s %s -> %s  %s  (taught in class %s)  %s" % (i[0], i[1], i[2], i[3], i[4], i[5], i[6]))
if sql_out:
    with open(sql_out, "w", encoding="utf-8") as fh:
        fh.write("-- [과정] 주간 수행 과제: 예습/복습 표시 바로잡기 (scripts/audit_assignment_categories.py). 전주 D1에 한 번 실행:\n")
        fh.write("--   npx wrangler d1 execute hoc-tieng-viet-jeonju-db --remote --file %s\n" % sql_out)
        fh.write("-- 각 문장은 현재 분류가 예상과 같을 때만 바뀌므로(다시 실행해도 안전) 항목은 새 분류의 맨 뒤에 놓인다.\n")
        for (un, day, old, new, text, us, uid) in issues:
            fh.write("-- 수업 %d주 %s: %s  [%s -> %s]\n" % (un, day, text.replace("\n", " "), old, new))
            fh.write("UPDATE curriculum_assignment_items SET sort_order = (SELECT COALESCE(MAX(b.sort_order), -1) + 1 FROM curriculum_assignment_items b, curriculum_assignment_items a "
                     "WHERE a.region_id = 'jeonju' AND a.uid = '%s' AND b.region_id = 'jeonju' AND b.week_number = a.week_number AND b.day_name = a.day_name AND b.category = '%s'), "
                     "category = '%s' WHERE region_id = 'jeonju' AND uid = '%s' AND category = '%s';\n" % (uid, new, new, uid, old))
        details = json.dumps({"fixed": [[i[6], i[2], i[3]] for i in issues]}, ensure_ascii=False).replace("'", "''")
        fh.write("INSERT INTO audit_logs (region_id, user_id, username, action, details) VALUES ('jeonju', NULL, 'system', 'fix_assignment_categories', '%s');\n" % details)
    print("wrote", sql_out)
