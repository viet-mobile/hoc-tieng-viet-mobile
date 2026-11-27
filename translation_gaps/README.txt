JW 학습 5개 사이트 - 대응 번역이 없는 문장 목록
=============================================

생성: python target_gap_report.py  (같은 원본과 코드로 다시 만들면 같은 파일이 나옵니다)

파일
  summary.csv                  사이트별 요약 (누락 문장 수, 자료별 수, 언어별 누락 칸 수)
  jw_study_english.csv         JW Study English   (학습 언어: 영어)
  jw_study_chinese.csv         JW Study Chinese   (학습 언어: 중국어 번체)
  jw_study_indonesian.csv      JW Study Indonesian
  jw_study_japanese.csv        JW Study Japanese
  jw_study_korean.csv          JW Study Korean
  모두 UTF-8(BOM) CSV라서 Excel에서 바로 열립니다.

한 줄 = 번역이 하나 이상 비어 있는 학습 문장 1개

열
  key                 문장의 고유 번호 (사이트|자료-단원|문단|문장) - 수정하지 마세요
  source              elf = 행복한 삶을 영원히 누리십시오! / lpd = 사람들을 사랑하고 제자로 삼으십시오 / wt = 파수대(연구용)
  unit, unit_title    단원(과/기사) 번호와 제목
  paragraph, sentence 단원 안의 문단 번호, 문단 안의 문장 번호 (1부터)
  target_sentence     학습 언어 문장 (사이트에 표시되는 문장)
  missing             번역이 비어 있는 UI 언어들
  <언어>              현재 번역. 비어 있으면 채워야 할 칸입니다.
  <언어>_paragraph    비어 있는 언어의 원본 문단 전체 (그 안에서 해당 문장을 찾아 <언어> 칸에 넣으면 됩니다)

채우는 방법
  비어 있는 <언어> 칸에 target_sentence 와 정확히 대응하는 그 언어의 문장만 넣어 주세요.
  문단 전체나 다른 문장을 넣지 마세요. 대응하는 문장이 정말 없으면 비워 두세요.
  key 열은 그대로 두고, 채운 CSV 파일을 돌려주시면 빌드에 반영합니다.
