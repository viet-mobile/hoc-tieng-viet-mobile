# -*- coding: utf-8 -*-
"""
Seed script to generate deterministic regional database initialization SQL (seed.sql).
Seeds CONTENT ONLY (no credentials) and is idempotent / non-destructive: every statement is
INSERT OR IGNORE, so re-running it never overwrites what regional admins have since edited.

- Regions: jeonju, ulsan
- Jeonju authoritative course configuration:
  preliminary_meeting_date = '2026-10-03', course_start_date = '2026-10-10', course_end_date = '2027-02-13',
  weekly classes, cancellations 2026-11-07 / 2026-12-05 / 2026-12-26
  -> 19 class opportunities - 3 cancellations = 16 instructional sessions (the authoritative timeline)
- Jeonju SOURCE CURRICULUM: 16 units of learning items + weekly assignments (WEEK16_TOC / WEEKLY_ASSIGNMENTS),
  every atomic item with a stable uid:  learning  L<unit:02>-<index:03>   assignment  A<unit:02>-<seq:03>
  (assignment seq follows the canonical order day 월..금 -> review, preview, vocab -> source order)
- Jeonju ACTIVE PLAN: 16 sessions = identity mapping (session k <- source unit k), exactly what
  regional_admin/distribution_engine.js produces for N == 16 (checked by scripts/verify_migration_parity.py).
- Ulsan initial state: everything NULL / empty (일정 미정, 자료 미정); no plan, no cancellations, 16 empty source units.
Administrator accounts are NOT seeded. Create them with scripts/create_admin_user.py.
"""
import json
import os
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

CATEGORIES = (("review", "reviews"), ("preview", "previews"), ("vocab", "vocab"))


def q(value):
    """SQL literal."""
    if value is None:
        return "NULL"
    return "'" + str(value).replace("'", "''") + "'"


def _ko_en(obj):
    if isinstance(obj, dict):
        return obj.get("ko", "") or "", obj.get("en", "") or ""
    return (obj or ""), ""


def learning_uid(unit, index):
    return f"L{unit:02d}-{index:03d}"


def assignment_uid(unit, seq):
    return f"A{unit:02d}-{seq:03d}"


def generate_seed_sql():
    from jeonju_data import (
        JEONJU_PRELIMINARY_DATE,
        JEONJU_COURSE_START_DATE,
        JEONJU_COURSE_END_DATE,
        JEONJU_INTERVAL_DAYS,
        JEONJU_CANCELLATIONS,
    )
    from weekly_assignments_data import WEEKLY_ASSIGNMENTS
    import build_app

    lines = ["-- -*- coding: utf-8 -*-", "-- Regional D1 Authoritative Seed Data (content only; no credentials)", ""]

    lines.append("INSERT OR IGNORE INTO regions (id, name, name_en, domain) VALUES")
    lines.append("('jeonju', '전주 베트남어 학습반', 'Jeonju Vietnamese Class', 'https://jeonju.hoc.tieng.viet.mobile'),")
    lines.append("('ulsan', '울산 베트남어 학습반', 'Ulsan Vietnamese Class', 'https://ulsan.hoc.tieng.viet.mobile');")
    lines.append("")

    cols = "region_id, preliminary_meeting_date, course_start_date, course_end_date, interval_days, meeting_weekday, welcome_title, welcome_body"
    lines.append(
        f"INSERT OR IGNORE INTO regional_settings ({cols}) VALUES "
        f"('jeonju', {q(JEONJU_PRELIMINARY_DATE)}, {q(JEONJU_COURSE_START_DATE)}, {q(JEONJU_COURSE_END_DATE)}, "
        f"{int(JEONJU_INTERVAL_DAYS)}, '매주 토요일', '2026-2027 전주 베트남어 학습반', NULL);"
    )
    # Ulsan: strictly NULL - NO fabricated dates.
    lines.append(
        f"INSERT OR IGNORE INTO regional_settings ({cols}) VALUES "
        "('ulsan', NULL, NULL, NULL, 7, '매주 토요일', '2026-2027 울산 베트남어 학습반', NULL);"
    )
    lines.append("")

    for c in JEONJU_CANCELLATIONS:
        lines.append(
            "INSERT OR IGNORE INTO class_cancellations (region_id, date, reason) "
            f"VALUES ('jeonju', {q(c['date'])}, {q(c['reason'])});"
        )
    lines.append("")

    # ---- Jeonju source curriculum: learning items ----
    plan_items = []  # (kind, uid, session, position)
    for entry in build_app.WEEK16_TOC:
        unit = entry["week"]
        if not isinstance(unit, int) or unit < 1 or unit > 16:
            continue
        t_ko, t_en = _ko_en(entry.get("title"))
        n_ko, n_en = _ko_en(entry.get("note"))
        lines.append(
            "INSERT OR IGNORE INTO curriculum_weeks (region_id, week_number, title_ko, title_en, note_ko, note_en) "
            f"VALUES ('jeonju', {unit}, {q(t_ko)}, {q(t_en)}, {q(n_ko)}, {q(n_en)});"
        )
        for idx, item in enumerate(entry.get("items", [])):
            ko, en = _ko_en(item.get("text", {}))
            page = item.get("page") or ""
            link = json.dumps(item["link"], ensure_ascii=False, sort_keys=True) if "link" in item else None
            uid = learning_uid(unit, idx)
            lines.append(
                "INSERT OR IGNORE INTO curriculum_learning_items (uid, region_id, week_number, sort_order, text_ko, text_en, page, link_json) "
                f"VALUES ({q(uid)}, 'jeonju', {unit}, {idx}, {q(ko)}, {q(en)}, {q(page)}, {q(link)});"
            )
            plan_items.append(("learning", uid, unit, idx))

    # ---- Jeonju source curriculum: weekly assignments ----
    for a_entry in WEEKLY_ASSIGNMENTS:
        unit = a_entry["week"]
        if not isinstance(unit, int) or unit < 1 or unit > 16:
            continue
        seq = 0
        for day_obj in a_entry.get("days", []):
            day_name = day_obj["day"]["ko"].replace("요일", "").strip()
            for cat, key in CATEGORIES:
                for s_order, it in enumerate(day_obj.get(key, [])):
                    ko, en = _ko_en(it.get("text", {}))
                    link = json.dumps(it["link"], ensure_ascii=False, sort_keys=True) if "link" in it else None
                    uid = assignment_uid(unit, seq)
                    lines.append(
                        "INSERT OR IGNORE INTO curriculum_assignment_items "
                        "(uid, region_id, week_number, day_name, category, sort_order, text_ko, text_en, link_json) "
                        f"VALUES ({q(uid)}, 'jeonju', {unit}, {q(day_name)}, {q(cat)}, {s_order}, {q(ko)}, {q(en)}, {q(link)});"
                    )
                    plan_items.append(("assignment", uid, unit, seq))
                    seq += 1

    # ---- Jeonju active plan: identity mapping for 16 sessions ----
    config = {
        "preliminaryMeetingDate": JEONJU_PRELIMINARY_DATE,
        "courseStartDate": JEONJU_COURSE_START_DATE,
        "courseEndDate": JEONJU_COURSE_END_DATE,
        "intervalDays": JEONJU_INTERVAL_DAYS,
        "cancellations": [{"date": c["date"], "reason": c["reason"]} for c in JEONJU_CANCELLATIONS],
    }
    lines.append(
        "INSERT OR IGNORE INTO course_plans (region_id, config_json, session_count, applied_by) VALUES "
        f"('jeonju', {q(json.dumps(config, ensure_ascii=False, sort_keys=True))}, 16, 'seed');"
    )
    for kind, uid, session, position in plan_items:
        lines.append(
            "INSERT OR IGNORE INTO course_plan_items (region_id, kind, item_uid, session_number, position, origin) "
            f"VALUES ('jeonju', {q(kind)}, {q(uid)}, {session}, {position}, 'auto');"
        )

    # ---- Ulsan: 16 empty source units, no plan ----
    for unit in range(1, 17):
        lines.append(
            "INSERT OR IGNORE INTO curriculum_weeks (region_id, week_number, title_ko, title_en, note_ko, note_en) "
            f"VALUES ('ulsan', {unit}, NULL, NULL, NULL, NULL);"
        )

    return "\n".join(lines)


if __name__ == "__main__":
    out_dir = os.path.join(REPO_ROOT, "regional_admin")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "seed.sql")
    sql = generate_seed_sql()
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(sql)
    print(f"Generated seed SQL: {out_file} ({len(sql)} bytes)")
