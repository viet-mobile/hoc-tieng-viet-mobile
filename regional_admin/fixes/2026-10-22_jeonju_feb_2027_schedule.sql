-- 전주 일정: 2027-02-13 휴강(왕국전도학교), 과정 종료일 2027-02-20 (16회차 = 졸업식). 전주 D1에 한 번 실행:
--   npx wrangler d1 execute hoc-tieng-viet-jeonju-db --remote --file regional_admin/fixes/2026-10-22_jeonju_feb_2027_schedule.sql
-- 수업 기회 20회 - 휴강 4회 = 16회차(2027-02-20)이므로 회차 수와 배정(course_plan_items)은 그대로다. 다시 실행해도 안전하다.
UPDATE regional_settings SET course_end_date = '2027-02-20', updated_at = CURRENT_TIMESTAMP WHERE region_id = 'jeonju' AND course_end_date = '2027-02-13';
INSERT OR IGNORE INTO class_cancellations (region_id, date, reason) VALUES ('jeonju', '2027-02-13', '왕국전도학교');
-- 공개 사이트가 보는 적용본(스냅샷)
UPDATE course_plans
   SET config_json = json_insert(json_set(config_json, '$.courseEndDate', '2027-02-20'), '$.cancellations[#]', json('{"date":"2027-02-13","reason":"왕국전도학교"}')),
       applied_at = CURRENT_TIMESTAMP
 WHERE region_id = 'jeonju' AND json_extract(config_json, '$.courseEndDate') = '2027-02-13'
   AND config_json NOT LIKE '%"2027-02-13","reason"%';
