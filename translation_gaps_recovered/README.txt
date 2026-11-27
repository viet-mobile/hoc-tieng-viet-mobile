JW 학습 5개 사이트 - 확실한 대응 문장만 복구한 결과
=====================================================

생성: python target_recover_report.py  (같은 원본과 코드로 다시 만들면 같은 파일이 나옵니다)
기준: multi-cs-hu 34f6103 의 빈칸 204,355칸 (translation_gaps/ 는 그대로 두었습니다)
결과: 3,549칸 복구, 200,806칸은 빈칸으로 남김 (AI 번역 없음)

파일 (모두 UTF-8 BOM CSV, Excel에서 바로 열립니다)
  summary_before.csv          복구 전 빈칸 수: 사이트 x 자료(elf/lpd/wt) x 언어
  summary_after.csv           복구 후 빈칸 수 (같은 형식)
  recovery_audit.csv          복구한 칸 전부: key, site, source, target_sentence, language,
                              recovered_translation, rule, context(같은 원본 행의 그 언어 문단 전체)
  <site>_recovered.csv        위와 같은 내용을 사이트별로
  conflicts.csv               증거끼리 모순되어(anchor 순서가 엇갈림) 채우지 않은 문단
  <site>_remaining.csv        아직 빈칸이 남은 문장 (translation_gaps/ 와 같은 열 구성)

복구 규칙 (모두 "같은 원본 행" 안에서만, 대상 언어 문장과 1:1)
  NUMBER_ANCHORED            두 문장의 숫자/성구 표기가 같고, 두 문단 안에서 그 숫자 조합을 가진 문장이
                             각각 하나뿐이며, 의문/평서와 문단 내 길이 비율도 맞는 경우
  UNIQUE_STRUCTURAL_MATCH    문단의 유일한 의문문이 두 언어 모두 문단 첫 문장(또는 마지막 문장)인 경우
  BETWEEN_CONFIRMED_ANCHORS  확정된 두 기준 문장(또는 문단 시작/끝) 사이에 양쪽 모두 정확히 한 문장만
                             남은 경우 (길이 비율 0.15 이내, 앞뒤 문장과 합치거나 나눈 것보다 1:1이 확실히
                             더 잘 맞을 때만)
  모든 규칙 공통: 한 칸을 채우려면 그 문장의 앞뒤 경계가 모두 확정되어야 합니다(문단 시작/끝, 또는 바로
  옆의 확정 문장). 번호/질문 표시((1), 2), (a), （ア）, 4. 등)가 있는 문장, 성구 조각("24:42-44; Rev. 1:3."),
  분할기가 놓친 문장 끝이 있는 문단(예: 체코어/독일어 „…“ 인용 뒤)은 쓰지 않습니다.
  문단 번호가 다른 행("label"), 행 검사 실패("row_check")는 다른 원본 행이므로 쓰지 않습니다.

하지 않은 것
  위치(N번째)만으로, 길이만으로, 짧은 문장 유사도로, 다른 언어를 거쳐서, 번체를 간체 대신,
  다른 행/문단에서, 문단 전체를 한 문장에 넣는 연결은 하지 않았습니다. zh_cn 칸은 같은 행의 zh_cn 원문에서만
  가져왔습니다.

폐기한 규칙
  AUTHORITATIVE_DUPLICATE    다른 곳에 있는 똑같은 문장의 번역 재사용 - 검수에서 오류가 나와 폐기.
                             출판물이 같은 문장을 곳마다 다르게 번역하고, 원본의 한 문장 행 중에는 내용이 다른
                             안내문끼리 짝지어진 것도 있어("Then discuss the questions that follow." /
                             "Játsszátok le a VIDEÓT, és beszéljétek meg ...") 재사용하면 오류가 퍼졌습니다.
