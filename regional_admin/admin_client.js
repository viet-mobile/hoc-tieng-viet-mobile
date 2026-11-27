// -*- coding: utf-8 -*-
/**
 * Regional admin single-page client (runs in the browser; embedded into /admin by admin_ui.js).
 *
 * - Globals provided by admin_ui.js before this file: window.__ADMIN_BOOT ({regionId, regionName, csrfToken, role, guide, ...};
 *   guide and the course translations only when signed in)
 *   and calculateRegionalSchedule() (the SAME function the public site uses, from schedule_engine.js).
 * - No inline event handlers: everything is wired through delegated listeners (data-act / data-f),
 *   so the page can run under a nonce-only script CSP.
 * - Every string that comes from the server or the user goes through esc() before it is put in HTML.
 * - Every state-changing request carries X-CSRF-Token.
 */
(function () {
  'use strict';

  var boot = window.__ADMIN_BOOT || {};
  var DAYS = ['월', '화', '수', '목', '금'];
  var CATS = [['reviews', '복습'], ['previews', '예습'], ['vocab', '어휘']];
  var ACTION_LABELS = {
    update_settings: '기본 일정 변경',
    add_cancellation: '휴강 추가',
    update_cancellation: '휴강 수정',
    delete_cancellation: '휴강 삭제',
    update_curriculum: '원본 커리큘럼 수정',
    apply_plan: '회차 배정 적용',
    update_plan_pin: '항목 회차 지정',
    restore_version: '이전 버전 복구'
  };
  var RESTORABLE = { update_settings: 1, add_cancellation: 1, update_cancellation: 1, delete_cancellation: 1, update_curriculum: 1, apply_plan: 1, update_plan_pin: 1 };

  var state = {
    user: null,
    tab: 'schedule',
    settings: null,
    cancellations: [],
    curriculum: [],
    week: 1,
    edit: null,
    dirty: false,
    editingCancel: null,
    plan: null
  };

  function esc(s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function $(id) { return document.getElementById(id); }

  /* ---------------- UI language (Korean source text, Vietnamese translation) ----------------
   * The page is written in Korean. In Vietnamese mode every rendered text node, placeholder / aria-label / title,
   * toast, confirm and server error is looked up here: exact phrases first (UI + the teacher's guide viText),
   * then patterns for text with numbers or dates. Unknown text (course content, audit details) stays as it is.
   */
  var LANG = (function () {
    try {
      var saved = localStorage.getItem('admin-lang');
      if (saved === 'ko' || saved === 'vi') return saved;
      return localStorage.getItem('vn-app-lang') === 'vi' ? 'vi' : 'ko';
    } catch (e) { return 'ko'; }
  })();
  var DAY_VI = { '월': 'thứ Hai', '화': 'thứ Ba', '수': 'thứ Tư', '목': 'thứ Năm', '금': 'thứ Sáu' };
  var VI = {
    '로그아웃': 'Đăng xuất', '로딩 중...': 'Đang tải...', '전주': 'Jeonju', '울산': 'Ulsan',
    '전주 베트남어 학습반': 'Lớp học tiếng Việt Jeonju', '울산 베트남어 학습반': 'Lớp học tiếng Việt Ulsan',
    '아이디': 'Tên đăng nhập', '비밀번호': 'Mật khẩu', '로그인': 'Đăng nhập',
    '로그인되었습니다.': 'Đã đăng nhập.', '로그인 실패': 'Đăng nhập thất bại', '서버 연결 실패': 'Không kết nối được máy chủ',
    'SECTION F 읽기 전용': 'PHẦN F (chỉ đọc)', '이 계정은 SECTION F(교사용 지도서) 읽기 전용입니다.': 'Tài khoản này chỉ được đọc PHẦN F (Sách hướng dẫn giáo viên).',
    '이 계정의 권한을 확인할 수 없습니다.': 'Không xác định được quyền của tài khoản này.',
    '이 지역에는 교사용 지도서가 없습니다.': 'Khu vực này chưa có sách hướng dẫn giáo viên.',
    'SECTION A — 수업 기간': 'PHẦN A — Thời gian khóa học', 'SECTION B — 휴강 관리': 'PHẦN B — Quản lý ngày nghỉ học',
    'SECTION C — 원본 커리큘럼': 'PHẦN C — Chương trình gốc', 'SECTION D — 회차 배정': 'PHẦN D — Phân bổ buổi học',
    'SECTION E — 변경 이력 & 복구': 'PHẦN E — Lịch sử thay đổi & khôi phục', 'SECTION F — 교사용 지도서': 'PHẦN F — Sách hướng dẫn giáo viên',
    '기본 일정 변경': 'Đổi lịch cơ bản', '휴강 추가': 'Thêm ngày nghỉ học', '휴강 수정': 'Sửa ngày nghỉ học', '휴강 삭제': 'Xóa ngày nghỉ học',
    '원본 커리큘럼 수정': 'Sửa chương trình gốc', '회차 배정 적용': 'Áp dụng phân bổ buổi học', '항목 회차 지정': 'Chỉ định buổi cho mục', '이전 버전 복구': 'Khôi phục phiên bản trước',
    '복습': 'Ôn tập', '예습': 'Chuẩn bị bài', '어휘': 'Từ vựng',
    // SECTION F
    '적용할 교수법': 'Phương pháp giảng dạy áp dụng', '수업 적용': 'Áp dụng trong lớp', '교사 준비물': 'Giáo viên chuẩn bị',
    '학생 준비물 (학생 [과정]에 표시)': 'Học viên chuẩn bị (hiện trong [Khóa học] của học viên)',
    '분': 'phút', '시간': 'Thời gian', '활동': 'Hoạt động', '교수법': 'Phương pháp giảng dạy', '단계': 'Các bước', '변형': 'Biến thể', '준비물': 'Đồ cần chuẩn bị',
    '교재 메모·베트남어 적용': 'Ghi chú sách hướng dẫn · áp dụng cho tiếng Việt', '출처:': 'Nguồn:', '예비 모임': 'Buổi gặp mặt chuẩn bị', '예비': 'Chuẩn bị',
    '이 내용은 읽기 전용이며 코드(regional_admin/teaching_guide.json)에서 관리합니다. 각 주의 교수법과 학생 준비물은 학생용 [과정] 카드에도 표시됩니다.':
      'Nội dung này chỉ để đọc và được quản lý trong mã nguồn (regional_admin/teaching_guide.json). Phương pháp giảng dạy và đồ học viên cần chuẩn bị của mỗi tuần cũng hiện trên thẻ [Khóa học] của học viên.',
    '날짜는 원래 계획 기준입니다. SECTION D에서 회차 배정이 바뀌면 원본 단위 번호로 맞춰 보세요.':
      'Ngày theo kế hoạch ban đầu. Nếu phân bổ buổi học ở PHẦN D thay đổi, hãy đối chiếu theo số đơn vị gốc.',
    '주별 지도 계획': 'Kế hoạch giảng dạy theo tuần', '방법별 사용 주': 'Tuần sử dụng theo phương pháp', '사용 주': 'Tuần sử dụng',
    '2시간 표준 수업안': 'Giáo án chuẩn 2 giờ', '교수법 16가지 (교재 Method #1–#16)': '16 phương pháp giảng dạy (Method #1–#16 trong sách hướng dẫn)',
    '공통 원칙': 'Nguyên tắc chung', '베트남어 조음 위치 (Basic Linguistics)': 'Vị trí cấu âm tiếng Việt (Basic Linguistics)', '전체 보기': 'Xem toàn bộ',
    '적용되지 않은 일정/배정 변경이 있습니다. 공개 사이트에는 아직 반영되지 않았습니다.': 'Có thay đổi lịch/phân bổ chưa được áp dụng. Trang công khai vẫn chưa được cập nhật.',
    'SECTION D — 회차 배정에서 미리보기를 확인한 뒤 적용하세요.': 'Hãy xem trước ở PHẦN D — Phân bổ buổi học rồi áp dụng.',
    '저장하지 않은 변경사항이 있습니다. 버리고 이동할까요?': 'Có thay đổi chưa lưu. Bỏ thay đổi và chuyển trang?',
    // SECTION A
    '종료일이 시작일보다 빠릅니다.': 'Ngày kết thúc sớm hơn ngày bắt đầu.', '기간이 너무 깁니다 (수업 기회 최대 200회).': 'Thời gian quá dài (tối đa 200 buổi học).',
    '날짜 형식이 올바르지 않습니다.': 'Định dạng ngày không đúng.', '수업 기간이 올바르지 않습니다.': 'Thời gian khóa học không hợp lệ.',
    '시작일과 종료일을 입력하면 수업 회차가 자동으로 계산됩니다. (일정 미정)': 'Nhập ngày bắt đầu và ngày kết thúc thì số buổi học sẽ được tính tự động. (Chưa xác định lịch)',
    '자동 계산 결과': 'Kết quả tính tự động', '수업 기간': 'Thời gian khóa học', '달력상 수업 기회': 'Số buổi học theo lịch',
    '휴강 횟수': 'Số buổi nghỉ học', '실제 수업 회차': 'Số buổi học thực tế',
    '현재 일정 미정 상태입니다. 시작일과 종료일이 설정되기 전까지 공개 사이트에는 날짜가 표시되지 않고 \'일정 미정\'이 유지됩니다.':
      'Hiện chưa xác định lịch. Cho đến khi đặt ngày bắt đầu và kết thúc, trang công khai sẽ không hiện ngày và vẫn ghi \'Chưa xác định lịch\'.',
    '수업 기간 설정': 'Cài đặt thời gian khóa học', '예비 모임 일자': 'Ngày buổi gặp mặt chuẩn bị',
    '수업 시작 전 예비 모임 날짜. 미정이면 비워두세요. 과정 시작일보다 늦을 수 없습니다.': 'Ngày buổi gặp mặt chuẩn bị trước khi khai giảng. Nếu chưa định thì để trống. Không được muộn hơn ngày bắt đầu khóa học.',
    '과정 시작일 (첫 수업일)': 'Ngày bắt đầu khóa học (buổi học đầu tiên)', '과정 종료일 (마지막 수업 가능일)': 'Ngày kết thúc khóa học (ngày có thể học cuối cùng)',
    '수업 회차(예: 16주)를 직접 입력하지 않습니다. 시작일~종료일과 휴강일로 회차가 자동 계산되고, 전체 학습 분량이 그 회차에 맞게 배분됩니다.':
      'Không nhập trực tiếp số buổi (ví dụ 16 tuần). Số buổi được tính tự động từ ngày bắt đầu–kết thúc và các ngày nghỉ, rồi toàn bộ nội dung học được phân bổ theo số buổi đó.',
    '수업 주기': 'Chu kỳ học', '매주 (시작일과 같은 요일)': 'Hằng tuần (cùng thứ với ngày bắt đầu)', '격주': 'Hai tuần một lần', '매주': 'Hằng tuần',
    '수업 요일 / 설명': 'Thứ học / mô tả',
    '저장하면 설정만 바뀝니다. 공개 사이트의 회차 배정은 SECTION D — 회차 배정에서 미리보기를 확인하고 \'적용\'해야 바뀝니다.':
      'Lưu chỉ thay đổi phần cài đặt. Phân bổ buổi học trên trang công khai chỉ thay đổi sau khi xem trước và bấm \'Áp dụng\' ở PHẦN D — Phân bổ buổi học.',
    '설정 저장': 'Lưu cài đặt', '수업 기간이 저장되었습니다. 회차 배정은 미리보기 후 적용해 주세요.': 'Đã lưu thời gian khóa học. Hãy xem trước rồi áp dụng phân bổ buổi học.',
    '저장 실패': 'Lưu thất bại', '요청 중 오류가 발생했습니다.': 'Đã xảy ra lỗi khi gửi yêu cầu.', '요청 중 오류 발생': 'Lỗi khi gửi yêu cầu',
    // SECTION B
    '수업 일정(요일/주기)에 해당하지 않아 무시됨': 'Bị bỏ qua vì không trùng lịch học (thứ/chu kỳ)', '과정 시작일 이전이라 무시됨': 'Bị bỏ qua vì trước ngày bắt đầu khóa học',
    '과정 종료일 이후라 무시됨': 'Bị bỏ qua vì sau ngày kết thúc khóa học', '저장': 'Lưu', '취소': 'Hủy', '수정': 'Sửa', '삭제': 'Xóa',
    '회차 자동 재계산 미리보기': 'Xem trước số buổi tính lại tự động',
    '수업 기간(시작일·종료일)이 설정되지 않아 일정을 미리볼 수 없습니다. SECTION A에서 먼저 입력해주세요.': 'Chưa đặt thời gian khóa học (ngày bắt đầu·kết thúc) nên không thể xem trước lịch. Hãy nhập ở PHẦN A trước.',
    '휴강 일자': 'Ngày nghỉ học', '휴강 사유 (필수)': 'Lý do nghỉ học (bắt buộc)', '예: 순회대회, 명절, 방학 등': 'Ví dụ: hội nghị vòng quanh, ngày lễ, kỳ nghỉ...',
    '휴강 일자는 수업 기간 안의 실제 수업일(시작일과 같은 요일/주기)이어야 하며 같은 날짜를 두 번 등록할 수 없습니다. 휴강은 수업 기회는 소모하지만 학습 진도는 소모하지 않습니다. 휴강 횟수는 이 목록에서 자동으로 계산됩니다.':
      'Ngày nghỉ học phải là ngày học thực tế trong thời gian khóa học (cùng thứ/chu kỳ với ngày bắt đầu) và không được đăng ký một ngày hai lần. Ngày nghỉ dùng mất một buổi học nhưng không làm mất tiến độ học. Số buổi nghỉ được tính tự động từ danh sách này.',
    '등록된 휴강 목록': 'Danh sách ngày nghỉ học đã đăng ký', '등록된 휴강 일자가 없습니다.': 'Chưa có ngày nghỉ học nào.', '일자': 'Ngày', '사유': 'Lý do', '관리': 'Quản lý',
    '휴강 일자가 추가되었습니다. 회차 수가 자동 재계산되었습니다 (배정은 SECTION D에서 적용).': 'Đã thêm ngày nghỉ học. Số buổi đã được tính lại tự động (áp dụng phân bổ ở PHẦN D).',
    '추가 실패': 'Thêm thất bại', '휴강 정보가 수정되었습니다.': 'Đã sửa thông tin ngày nghỉ học.', '수정 실패': 'Sửa thất bại',
    '이 휴강 일자를 삭제하시겠습니까? 삭제 시 이후 일정이 다시 앞당겨집니다.': 'Xóa ngày nghỉ học này? Nếu xóa, lịch học sau đó sẽ được dời lên sớm hơn.',
    '휴강 일자가 삭제되었습니다.': 'Đã xóa ngày nghỉ học.', '삭제 실패': 'Xóa thất bại',
    '휴강': 'Nghỉ học', '군산 한국어 순회대회': 'Hội nghị vòng quanh tiếng Hàn Gunsan', '왕국전도학교': 'Trường dành cho người công bố Nước Trời', '천안 베트남어 순회대회 파이오니아 모임': 'Buổi họp tiên phong – hội nghị vòng quanh tiếng Việt Cheonan',
    // SECTION C
    '페이지': 'Trang', '내용': 'Nội dung', '위로 이동': 'Chuyển lên', '아래로 이동': 'Chuyển xuống', '등록된 학습 내용이 없습니다.': 'Chưa có nội dung học.', '+ 추가': '+ Thêm',
    '원본 커리큘럼 단위 선택 (1 ~ 16)': 'Chọn đơn vị chương trình gốc (1 ~ 16)',
    '여기는 전체 학습 분량(원본 커리큘럼)입니다. 실제 수업 회차 수와 무관하며, 일정이 바뀌어도 이 내용은 바뀌지 않습니다. 회차별 배정은 SECTION D에서 자동 계산됩니다.':
      'Đây là toàn bộ nội dung học (chương trình gốc). Không phụ thuộc số buổi học thực tế, và không thay đổi khi lịch thay đổi. Phân bổ theo buổi được tính tự động ở PHẦN D.',
    '저장 안 됨': 'Chưa lưu', '단위 제목': 'Tiêu đề đơn vị', '참고 사항 (Note)': 'Ghi chú (Note)', '학습 내용 목록': 'Danh sách nội dung học',
    '+ 항목 추가': '+ Thêm mục', '요일별 과제': 'Bài tập theo thứ',
    '위/아래 버튼으로 순서를 바꾼 뒤 저장하면 전체 순서가 한 번에(모두 성공하거나 모두 취소) 저장됩니다. 텍스트를 수정한 항목의 영어 번역은 비워지며, 링크는 유지됩니다.':
      'Đổi thứ tự bằng nút lên/xuống rồi lưu thì toàn bộ thứ tự được lưu một lần (thành công hết hoặc hủy hết). Mục nào sửa chữ thì bản dịch tiếng Anh bị xóa, liên kết vẫn giữ nguyên.',
    // SECTION D
    '학습 자료': 'Tài liệu học', '수행 과제': 'Bài tập', '없음': 'Không có', '자동': 'Tự động', '회차 지정': 'Chỉ định buổi', '수동': 'Thủ công',
    '배정 정보를 불러오지 못했습니다.': 'Không tải được thông tin phân bổ.',
    '수업 기간(시작일·종료일)이 설정되지 않았습니다. 공개 사이트에는 \'일정 미정\'이 표시됩니다.': 'Chưa đặt thời gian khóa học (ngày bắt đầu·kết thúc). Trang công khai hiện \'Chưa xác định lịch\'.',
    '현재 적용됨': 'Đang áp dụng', '적용된 배정 없음': 'Chưa có phân bổ được áp dụng', '제안 (미리보기)': 'Đề xuất (xem trước)', '변경 여부': 'Có thay đổi không',
    '변경됨 — 적용 필요': 'Đã thay đổi — cần áp dụng', '현재 적용본과 동일': 'Giống bản đang áp dụng', '적용': 'Áp dụng',
    '적용 전에는 공개 사이트가 바뀌지 않습니다. 원본 커리큘럼은 절대 수정되지 않습니다.': 'Trang công khai không thay đổi trước khi áp dụng. Chương trình gốc không bao giờ bị sửa.',
    '배정할 회차가 없습니다.': 'Không có buổi nào để phân bổ.',
    '항목 옆 선택으로 특정 회차에 수동 지정할 수 있습니다. 수동 지정 항목은 이후 자동 재배정에서도 유지됩니다(회차 범위를 벗어나면 조정).':
      'Có thể chỉ định thủ công một mục vào buổi cụ thể bằng ô chọn bên cạnh. Mục chỉ định thủ công được giữ nguyên khi phân bổ lại tự động (nếu vượt phạm vi số buổi thì được điều chỉnh).',
    '자동 재배정 미리보기': 'Xem trước phân bổ lại tự động', '제안된 회차별 배정': 'Phân bổ đề xuất theo buổi',
    '회차 배정이 적용되었습니다.': 'Đã áp dụng phân bổ buổi học.', '적용 실패': 'Áp dụng thất bại', '회차가 지정되었습니다.': 'Đã chỉ định buổi.',
    '자동 배정으로 되돌렸습니다.': 'Đã trở lại phân bổ tự động.', '지정 실패': 'Chỉ định thất bại',
    // SECTION E
    '변경 이력 불러오는 중...': 'Đang tải lịch sử thay đổi...', '기록된 변경 이력이 없습니다.': 'Chưa có lịch sử thay đổi.', '일시': 'Thời điểm', '관리자': 'Quản trị viên',
    '작업': 'Thao tác', '상세 요약': 'Tóm tắt chi tiết', '복구': 'Khôi phục', '변경 이력 (Audit Log & Restore)': 'Lịch sử thay đổi (Audit Log & Restore)',
    '모든 일정 및 커리큘럼 변경이 기록됩니다. 복구하면 해당 변경이 일어나기 전 상태로 되돌립니다.': 'Mọi thay đổi lịch và chương trình đều được ghi lại. Khôi phục sẽ đưa về trạng thái trước khi thay đổi đó xảy ra.',
    '변경 이력을 불러오지 못했습니다.': 'Không tải được lịch sử thay đổi.', '이 변경을 되돌리시겠습니까? 현재 값이 덮어씌워집니다.': 'Hoàn tác thay đổi này? Giá trị hiện tại sẽ bị ghi đè.',
    '성공적으로 복구되었습니다.': 'Đã khôi phục thành công.', '복구 실패': 'Khôi phục thất bại', '복구 중 오류 발생': 'Lỗi khi khôi phục',
    // server errors (worker.js / db.js)
    '서버 처리 중 오류가 발생했습니다.': 'Máy chủ gặp lỗi khi xử lý.', '요청 본문이 너무 큽니다.': 'Nội dung yêu cầu quá lớn.',
    '요청 본문이 올바른 JSON이 아닙니다.': 'Nội dung yêu cầu không phải JSON hợp lệ.', '허용되지 않는 요청 출처입니다.': 'Nguồn yêu cầu không được phép.',
    '아이디와 비밀번호를 입력해주세요.': 'Hãy nhập tên đăng nhập và mật khẩu.', '아이디 또는 비밀번호가 올바르지 않습니다.': 'Tên đăng nhập hoặc mật khẩu không đúng.',
    'CSRF 토큰이 올바르지 않습니다. 페이지를 새로고침해 주세요.': 'Mã CSRF không hợp lệ. Hãy tải lại trang.',
    '링크 형식이 올바르지 않습니다.': 'Định dạng liên kết không đúng.', '링크 데이터가 너무 깁니다.': 'Dữ liệu liên kết quá dài.',
    '과정 종료일은 시작일보다 빠를 수 없습니다.': 'Ngày kết thúc khóa học không được sớm hơn ngày bắt đầu.',
    '과정 기간이 너무 깁니다 (수업 기회 최대 200회).': 'Thời gian khóa học quá dài (tối đa 200 buổi học).',
    '과정 시작일/종료일 형식이 올바르지 않습니다.': 'Định dạng ngày bắt đầu/kết thúc khóa học không đúng.', '요청 본문이 올바르지 않습니다.': 'Nội dung yêu cầu không hợp lệ.',
    '수업 주기는 매주(7일) 또는 격주(14일)여야 합니다.': 'Chu kỳ học phải là hằng tuần (7 ngày) hoặc hai tuần một lần (14 ngày).',
    '예비 모임 날짜는 과정 시작일보다 늦을 수 없습니다.': 'Ngày buổi gặp mặt chuẩn bị không được muộn hơn ngày bắt đầu khóa học.',
    '과정 기간이 올바르지 않습니다.': 'Thời gian khóa học không hợp lệ.', '환영 문구 형식이 올바르지 않습니다.': 'Định dạng lời chào mừng không đúng.',
    '휴강 날짜 형식이 올바르지 않습니다 (실제 존재하는 날짜, YYYY-MM-DD 필요).': 'Định dạng ngày nghỉ học không đúng (cần ngày có thật, dạng YYYY-MM-DD).',
    '휴강을 등록하려면 먼저 과정 시작일과 종료일을 설정하세요.': 'Để đăng ký ngày nghỉ học, hãy đặt ngày bắt đầu và kết thúc khóa học trước.',
    '과정 기간 설정이 올바르지 않아 휴강을 등록할 수 없습니다.': 'Cài đặt thời gian khóa học không hợp lệ nên không thể đăng ký ngày nghỉ học.',
    '해당 휴강 일자를 찾을 수 없습니다.': 'Không tìm thấy ngày nghỉ học này.', '학습 내용 목록 형식이 올바르지 않습니다.': 'Định dạng danh sách nội dung học không đúng.',
    '학습 내용 항목 형식이 올바르지 않습니다.': 'Định dạng mục nội dung học không đúng.', '항목 식별자 형식이 올바르지 않습니다.': 'Định dạng mã mục không đúng.',
    '과제 데이터 형식이 올바르지 않습니다.': 'Định dạng dữ liệu bài tập không đúng.', '과제 요일 형식이 올바르지 않습니다.': 'Định dạng thứ của bài tập không đúng.',
    '과제 요일은 월~금 중 하나여야 합니다.': 'Thứ của bài tập phải từ thứ Hai đến thứ Sáu.', '과제 목록 형식이 올바르지 않습니다.': 'Định dạng danh sách bài tập không đúng.',
    '과제 항목 형식이 올바르지 않습니다.': 'Định dạng mục bài tập không đúng.', '주차는 1~16 사이여야 합니다.': 'Tuần phải từ 1 đến 16.',
    '주차 제목이 너무 깁니다.': 'Tiêu đề tuần quá dài.', '참고 사항이 너무 깁니다.': 'Ghi chú quá dài.', '항목 식별자가 중복되었습니다.': 'Mã mục bị trùng.',
    '항목 식별자 또는 순서가 충돌하여 저장하지 못했습니다. 페이지를 새로고침해 주세요.': 'Không lưu được vì mã mục hoặc thứ tự bị xung đột. Hãy tải lại trang.',
    '적용하려면 미리보기 확인 토큰이 필요합니다.': 'Cần mã xác nhận xem trước để áp dụng.',
    '미리보기 이후 설정이 변경되었습니다. 미리보기를 다시 확인한 뒤 적용해 주세요.': 'Cài đặt đã thay đổi sau khi xem trước. Hãy xem trước lại rồi áp dụng.',
    '수업 일정이 설정되지 않았거나 수업 가능한 회차가 없어 재배정할 수 없습니다.': 'Không thể phân bổ lại vì chưa đặt lịch học hoặc không có buổi học nào.',
    '항목 식별자가 필요합니다.': 'Cần mã mục.', '먼저 재배정을 적용해야 회차를 지정할 수 있습니다.': 'Phải áp dụng phân bổ lại trước thì mới chỉ định buổi được.',
    '해당 항목을 찾을 수 없습니다.': 'Không tìm thấy mục này.'
  };
  var VI_FIELDS = { '예비 모임 날짜': 'Ngày buổi gặp mặt chuẩn bị', '과정 시작일': 'Ngày bắt đầu khóa học', '과정 종료일': 'Ngày kết thúc khóa học',
    '수업 요일': 'Thứ học', '환영 제목': 'Tiêu đề chào mừng', '휴강 사유': 'Lý do nghỉ học', '학습 내용': 'Nội dung học', '과제 내용': 'Nội dung bài tập',
    '주차 제목': 'Tiêu đề tuần', '참고 사항': 'Ghi chú', '페이지': 'Trang' };
  function fld(k) { return VI_FIELDS[k] || k; }
  function vd(d) { return DAY_VI[d] || d; }
  var VI_RULES = [
    [/^(.+) \(이어서\)$/, function (m) { return tr(m[1]) + ' (tiếp)'; }],
    [/^(\d{4}-\d{4}) (.+) 관리자$/, function (m) { return 'Quản trị ' + tr(m[2]) + ' ' + m[1]; }],
    [/^(.+) 관리자님$/, function (m) { return 'Quản trị viên ' + m[1]; }],
    [/^(.+) 관리자 로그인$/, function (m) { return 'Đăng nhập quản trị — ' + tr(m[1]); }],
    [/^(.+) 지역 관리 권한을 가진 계정으로 로그인하세요\.$/, function (m) { return 'Hãy đăng nhập bằng tài khoản có quyền quản lý ' + tr(m[1]) + '.'; }],
    [/^(\d+)주$/, function (m) { return 'Tuần ' + m[1]; }],
    [/^(\d+)회$/, function (m) { return m[1] + ' buổi'; }],
    [/^(\d+)회차$/, function (m) { return 'Buổi ' + m[1]; }],
    [/^(\d+)쪽$/, function (m) { return 'trang ' + m[1]; }],
    [/^([\d–\-, ]+)쪽$/, function (m) { return 'trang ' + m[1]; }],
    [/^(월|화|수|목|금)요일 과제$/, function (m) { return 'Bài tập ' + vd(m[1]); }],
    [/^(월|화|수|목|금) (복습|예습|어휘)$/, function (m) { return vd(m[1]) + ' ' + tr(m[2]); }],
    [/^(.+) \[휴강\]$/, function (m) { return m[1] + ' [Nghỉ học]'; }],
    [/^(\S+) ~ (\S+) \((매주|격주)\)$/, function (m) { return m[1] + ' ~ ' + m[2] + ' (' + tr(m[3]) + ')'; }],
    [/^\(마지막 수업 (.+)\)$/, function (m) { return '(buổi học cuối ' + m[1] + ')'; }],
    [/^\(수업 일정에 해당하지 않아 반영되지 않은 휴강 (\d+)건 별도\)$/, function (m) { return '(thêm ' + m[1] + ' ngày nghỉ không trùng lịch học nên không được tính)'; }],
    [/^\(학습 자료 (\d+) · 수행 과제 (\d+)\)$/, function (m) { return '(tài liệu học ' + m[1] + ' · bài tập ' + m[2] + ')'; }],
    [/^수업 기회 (\d+) − 휴강 (\d+)$/, function (m) { return m[1] + ' buổi theo lịch − ' + m[2] + ' buổi nghỉ'; }],
    [/^수업 기간이 올바르지 않습니다: (.*)$/, function (m) { return 'Thời gian khóa học không hợp lệ: ' + tr(m[1]); }],
    [/^적용하면 (\d+)회차 → (\d+)회차로 재배정됩니다\.$/, function (m) { return 'Nếu áp dụng, sẽ phân bổ lại từ ' + m[1] + ' buổi thành ' + m[2] + ' buổi.'; }],
    [/^수동 지정 (\d+)건이 회차 범위를 벗어나 가장 가까운 회차로 조정됩니다\.$/, function (m) { return m[1] + ' mục chỉ định thủ công vượt phạm vi số buổi nên được chuyển sang buổi gần nhất.'; }],
    [/^원본에 새로 추가된 항목 (\d+)개가 마지막 회차에 임시로 표시됩니다\. 위의 '적용'으로 재배정하세요\.$/, function (m) { return m[1] + ' mục mới thêm vào chương trình gốc đang tạm hiện ở buổi cuối. Hãy bấm \'Áp dụng\' ở trên để phân bổ lại.'; }],
    [/^현재 적용된 배정 \((\d+)회차\)$/, function (m) { return 'Phân bổ đang áp dụng (' + m[1] + ' buổi)'; }],
    [/^(?:(\d+)회차 → )?(\d+)회차로 공개 사이트의 회차 배정을 교체합니다\. 계속할까요\?$/, function (m) { return 'Sẽ thay phân bổ buổi học trên trang công khai ' + (m[1] ? 'từ ' + m[1] + ' buổi ' : '') + 'thành ' + m[2] + ' buổi. Tiếp tục?'; }],
    [/^교사용 지도서 — (\d+)주$/, function (m) { return 'Sách hướng dẫn giáo viên — Tuần ' + m[1]; }],
    [/^원본 단위 (\d+) — 학습 자료 및 수행 과제 편집$/, function (m) { return 'Đơn vị gốc ' + m[1] + ' — sửa tài liệu học và bài tập'; }],
    [/^원본 단위 (\d+) 저장$/, function (m) { return 'Lưu đơn vị gốc ' + m[1]; }],
    [/^원본 단위 (\d+)이\(가\) 저장되었습니다\. 새 항목은 SECTION D에서 재배정할 때까지 마지막 회차에 표시됩니다\.$/, function (m) { return 'Đã lưu đơn vị gốc ' + m[1] + '. Mục mới sẽ hiện ở buổi cuối cho đến khi phân bổ lại ở PHẦN D.'; }],
    [/^((?:예비|\d+주)(?:, (?:예비|\d+주))*)$/, function (m) { return m[1].split(', ').map(function (x) { return tr(x); }).join(', '); }],
    [/^이 계정은 '(.+)' 관리 권한이 없습니다\.$/, function (m) { return 'Tài khoản này không có quyền quản lý \'' + tr(m[1]) + '\'.'; }],
    [/^(.+) 형식이 올바르지 않습니다 \(실제 존재하는 날짜, YYYY-MM-DD 필요\)\.$/, function (m) { return 'Định dạng ' + fld(m[1]) + ' không đúng (cần ngày có thật, dạng YYYY-MM-DD).'; }],
    [/^(.+)은\(는\) 필수 입력 항목입니다\.$/, function (m) { return fld(m[1]) + ' là mục bắt buộc.'; }],
    [/^(.+)은\(는\) (\d+)자 이내여야 합니다\.$/, function (m) { return fld(m[1]) + ' tối đa ' + m[2] + ' ký tự.'; }],
    [/^(.+) 형식이 올바르지 않습니다\.$/, function (m) { return 'Định dạng ' + fld(m[1]) + ' không đúng.'; }],
    [/^휴강 일자는 과정 시작일\((.+)\) 이후여야 합니다\.$/, function (m) { return 'Ngày nghỉ học phải sau ngày bắt đầu khóa học (' + m[1] + ').'; }],
    [/^휴강 일자는 과정 종료일\((.+)\) 이전이어야 합니다\.$/, function (m) { return 'Ngày nghỉ học phải trước ngày kết thúc khóa học (' + m[1] + ').'; }],
    [/^휴강 일자는 수업 일정\(시작일 (\S+) 기준 (매주|격주) (.+)\)에 해당하는 날짜여야 합니다\.$/, function (m) { return 'Ngày nghỉ học phải trùng lịch học (' + tr(m[2]).toLowerCase() + ' ' + m[3] + ', tính từ ngày bắt đầu ' + m[1] + ').'; }],
    [/^해당 일자\((.+)\)에 이미 등록된 (다른 )?휴강 일정이 존재합니다\.$/, function (m) { return 'Ngày ' + m[1] + ' đã có ' + (m[2] ? 'một ngày nghỉ học khác' : 'ngày nghỉ học') + ' được đăng ký.'; }],
    [/^학습 내용은 주차당 최대 (\d+)개까지 등록할 수 있습니다\.$/, function (m) { return 'Mỗi tuần được đăng ký tối đa ' + m[1] + ' nội dung học.'; }],
    [/^과제 요일이 중복되었습니다: (.+)$/, function (m) { return 'Thứ của bài tập bị trùng: ' + vd(m[1]); }]
  ];
  var VI_GUIDE = (boot.guide && boot.guide.viText) || {};
  var VI_COURSE = boot.courseVi || {};
  var VI_LIVE = (boot.liveI18n || []).map(function (r) { return [new RegExp(r[0]), r[1]]; });
  /** Vietnamese of a course text (curriculum items, titles, notes), or '' when there is none. */
  function courseVi(ko) {
    var t = String(ko || '').trim();
    if (!t) return '';
    if (VI_COURSE[t]) return VI_COURSE[t];
    for (var i = 0; i < VI_LIVE.length; i++) if (VI_LIVE[i][0].test(t)) return t.replace(VI_LIVE[i][0], VI_LIVE[i][1]);
    return '';
  }
  function tr(s) {
    if (LANG !== 'vi' || s === null || s === undefined) return s;
    var str = String(s);
    var t = str.trim();
    if (!t || !/[가-힣]/.test(t)) return str;
    var lead = str.slice(0, str.indexOf(t)), trail = str.slice(str.indexOf(t) + t.length);
    var out = VI[t] || VI_GUIDE[t] || courseVi(t) || undefined;
    if (out === undefined) {
      for (var i = 0; i < VI_RULES.length; i++) {
        var m = VI_RULES[i][0].exec(t);
        if (m) { out = VI_RULES[i][1](m); break; }
      }
    }
    return out === undefined ? str : lead + out + trail;
  }
  function ask(msg) { return window.confirm(tr(msg)); }
  var TR_ATTRS = ['placeholder', 'aria-label', 'title'];
  function translateTree(root) {
    if (LANG !== 'vi' || !root) return;
    if (root.nodeType === 3) { var v = tr(root.nodeValue); if (v !== root.nodeValue) root.nodeValue = v; return; }
    if (root.nodeType !== 1) return;
    if (root.tagName === 'SCRIPT' || root.tagName === 'STYLE' || root.tagName === 'TEXTAREA') return;
    TR_ATTRS.forEach(function (a) { var x = root.getAttribute(a); if (x) { var y = tr(x); if (y !== x) root.setAttribute(a, y); } });
    for (var c = root.firstChild; c; c = c.nextSibling) translateTree(c);
  }
  function startTranslation() {
    document.documentElement.setAttribute('lang', LANG);
    var sel = $('lang-select');
    if (sel) sel.value = LANG;
    if (LANG !== 'vi') return;
    document.title = tr(document.title);
    translateTree(document.body);
    new MutationObserver(function (list) {
      list.forEach(function (rec) { rec.addedNodes.forEach(translateTree); });
    }).observe(document.body, { childList: true, subtree: true });
  }
  document.addEventListener('change', function (ev) {
    if (!ev.target || ev.target.id !== 'lang-select') return;
    if (!confirmDiscard()) { ev.target.value = LANG; return; }
    try { localStorage.setItem('admin-lang', ev.target.value); } catch (e) { /* private mode: this page only */ }
    location.reload();
  });

  var toastTimer = null;
  function toast(msg, isError) {
    var el = $(isError ? 'toast-error' : 'toast-success');
    if (!el) return;
    el.textContent = tr(msg);
    el.style.display = 'block';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.style.display = 'none'; }, 3500);
  }

  function api(method, url, body) {
    var opts = { method: method, headers: {}, credentials: 'same-origin' };
    if (body !== undefined) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
    if (method !== 'GET' && boot.csrfToken) opts.headers['X-CSRF-Token'] = boot.csrfToken;
    return fetch(url, opts).then(function (res) {
      return res.json().catch(function () { return null; }).then(function (data) {
        return { ok: res.ok, status: res.status, data: data };
      });
    });
  }

  function errText(r, fallback) {
    return tr((r && r.data && r.data.error) || fallback);
  }

  /* ---------------- bootstrap / auth ---------------- */

  function init() {
    api('GET', '/api/auth/me').then(function (r) {
      if (!r.ok) { renderLogin(); return; }
      state.user = r.data.user;
      if (r.data.csrfToken) boot.csrfToken = r.data.csrfToken;
      $('logout-btn').style.display = 'inline-block';
      if (isSectionFViewer()) {
        // SECTION F only: the guide is in the page; the server refuses every /api/admin/* call for this role.
        $('user-info').innerHTML = esc(state.user.username) + ' · <span>SECTION F 읽기 전용</span>';
        if (!GUIDE) {
          $('app-container').innerHTML = '<div class="card"><p class="help-text">이 지역에는 교사용 지도서가 없습니다.</p></div>';
          return;
        }
        TABS = [['guide', 'SECTION F — 교사용 지도서']];
        state.tab = 'guide';
        renderApp();
        return;
      }
      $('user-info').textContent = state.user.username + ' 관리자님';
      return loadData().then(function () { restoreView(); renderApp(); });
    }).catch(renderLogin);
  }

  // A reload shows the screen it was reloaded on: the tab and the curriculum week are remembered in this browser (unsaved edits are not).
  var VIEW_KEY = 'admin-view';
  function saveView() {
    try { localStorage.setItem(VIEW_KEY, JSON.stringify({ tab: state.tab, week: state.week, user: state.user && state.user.username })); } catch (e) { /* no storage */ }
  }
  function restoreView() {
    try {
      var v = JSON.parse(localStorage.getItem(VIEW_KEY) || 'null');
      if (!v || v.user !== (state.user && state.user.username)) return;
      if (TABS.some(function (t) { return t[0] === v.tab; })) state.tab = v.tab;
      if (v.week >= 1 && v.week <= 99 && state.curriculum.some(function (w) { return w.week === v.week; })) state.week = v.week;
    } catch (e) { /* ignore */ }
  }

  function loadData() {
    return Promise.all([
      api('GET', '/api/admin/schedule'),
      api('GET', '/api/admin/curriculum'),
      api('GET', '/api/admin/plan')
    ]).then(function (rs) {
      if (rs[0].ok) {
        state.settings = rs[0].data.settings;
        state.cancellations = rs[0].data.cancellations || [];
      }
      if (rs[1].ok) state.curriculum = rs[1].data;
      if (rs[2].ok) state.plan = rs[2].data;
      resetEdit();
    });
  }

  function renderLogin() {
    $('user-info').textContent = '';
    $('logout-btn').style.display = 'none';
    $('app-container').innerHTML =
      '<div class="login-box">' +
      '<h2 style="font-size:20px;font-weight:800;margin-bottom:8px;text-align:center;">' + esc(boot.regionName) + ' 관리자 로그인</h2>' +
      '<p style="color:var(--ink-soft);font-size:13px;margin-bottom:20px;text-align:center;">' + esc(boot.regionName) + ' 지역 관리 권한을 가진 계정으로 로그인하세요.</p>' +
      '<form id="login-form">' +
      '<div class="form-group"><label for="login-username">아이디</label><input type="text" id="login-username" class="form-control" required autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false"></div>' +
      '<div class="form-group"><label for="login-password">비밀번호</label><input type="password" id="login-password" class="form-control" required autocomplete="current-password"></div>' +
      '<button type="submit" class="btn btn-primary" style="width:100%;padding:10px;margin-top:10px;">로그인</button>' +
      '</form></div>';
  }

  function handleLogin(form) {
    var u = $('login-username').value.trim();
    var p = $('login-password').value;
    api('POST', '/api/auth/login', { username: u, password: p }).then(function (r) {
      if (r.ok) {
        if (r.data.csrfToken) boot.csrfToken = r.data.csrfToken;
        // Reload: the server embeds the teacher's guide only in a signed-in page.
        location.reload();
      } else {
        toast(errText(r, '로그인 실패'), true);
      }
    }).catch(function () { toast('서버 연결 실패', true); });
  }

  function handleLogout() {
    api('POST', '/api/auth/logout').then(function () { location.reload(); });
  }

  /* ---------------- layout ---------------- */

  var TABS = [
    ['schedule', 'SECTION A — 수업 기간'],
    ['cancellations', 'SECTION B — 휴강 관리'],
    ['curriculum', 'SECTION C — 원본 커리큘럼'],
    ['plan', 'SECTION D — 회차 배정'],
    ['audit', 'SECTION E — 변경 이력 & 복구'],
    ['songs', 'SECTION G — 노래 편집·게시'],
    ['mwb', 'SECTION H — 생활과 봉사 집회 임명']
  ];
  var GUIDE = boot.guide || null;
  if (GUIDE) TABS.push(['guide', 'SECTION F — 교사용 지도서']);
  function isSectionFViewer() { return !!(state.user && state.user.role === 'section_f_viewer'); }

  function renderApp() {
    var nav = TABS.map(function (t) {
      return '<button type="button" class="tab-item' + (state.tab === t[0] ? ' active' : '') + '" data-act="tab" data-tab="' + t[0] + '">' + esc(t[1]) + '</button>';
    }).join('');
    $('app-container').innerHTML = pendingBanner() + '<nav class="tabs-nav">' + nav + '</nav><div id="tab-content"></div>';
    renderTab();
  }

  function renderTab() {
    var c = $('tab-content');
    if (!c) return;
    if (state.tab === 'schedule') renderSchedule(c);
    else if (state.tab === 'cancellations') renderCancellations(c);
    else if (state.tab === 'curriculum') renderCurriculum(c);
    else if (state.tab === 'plan') renderPlan(c);
    else if (state.tab === 'audit') renderAudit(c);
    else if (state.tab === 'songs') window.SongsAdmin.render(c, { api: api, esc: esc, toast: toast });
    else if (state.tab === 'guide') renderGuide(c);
    else if (state.tab === 'mwb') renderMwb(c);
  }

  /* ---------------- SECTION F: teacher's guide (read-only, teaching_guide.json) ---------------- */

  function guideMethod(id) {
    return ((GUIDE && GUIDE.methods) || []).filter(function (m) { return m.id === id; })[0] || null;
  }
  function guideChips(ids) {
    return (ids || []).map(function (id) {
      var m = guideMethod(id);
      return '<span class="guide-chip">' + esc(m ? m.label : id) + '</span>';
    }).join('');
  }
  function guideList(label, list) {
    if (!list || !list.length) return '';
    return '<div class="guide-label">' + esc(label) + '</div><ul>' + list.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
  }
  // Estimated minutes of each part of the class (teaching_guide.json timePlan, from the class-time simulation). An entry is
  // [name, minutes, minutes of instructor A (null = break), reason key]; B takes the rest. guide.instructors describes A and B.
  function instrText(o) { return o ? (LANG === 'vi' ? (o.vi || o.ko) : (o.ko || o.vi)) || '' : ''; }
  var OWNER_KEYS = ['A', 'B', 'assist', 'group', 'circuit'];
  function ownerLabel(k, unit) {
    if (k === 'circuit') return LANG === 'vi' ? 'Giám thị vòng quanh' : '순회감독자';
    var ins = GUIDE && GUIDE.instructors, l = ins && ins[k] ? instrText(ins[k].label) : k;
    if (k === 'assist' && unit && unit.assistant) {
      if (unit.assistant === 'A 강사') {
        l = LANG === 'vi' ? 'Trợ giảng GV A' : '보조자 A 강사';
      } else {
        l = l.replace(/Mai/, unit.assistant);
      }
    }
    return l;
  }
  function ownerShort(k) {
    return { A: 'A', B: 'B', assist: LANG === 'vi' ? 'TG' : '보조', group: LANG === 'vi' ? 'Nhóm' : '조별', circuit: 'CO' }[k] || k;
  }
  function fmtMin(m) { return m % 1 ? Math.floor(m) + ':30' : String(m); }
  function guideInstructorLegend() {
    var ins = GUIDE && GUIDE.instructors;
    if (!ins) return '';
    function who(k) {
      var i = ins[k];
      if (!i) return '';
      return '<div class="guide-ins guide-ins-' + k.toLowerCase() + '"><span class="guide-ins-badge">' + esc(ownerShort(k)) + '</span><span><strong>' + esc(instrText(i.label)) + '</strong> · ' +
        esc(instrText(i.profile)) + '<br><span class="guide-ins-strong">' + esc(instrText(i.strengths)) + '</span></span></div>';
    }
    return '<div class="guide-label">' + esc(instrText(ins.title)) + '</div><div class="guide-ins-box">' + OWNER_KEYS.map(who).join('') +
      '<p class="guide-time-note">' + esc(instrText(ins.note)) + '</p></div>';
  }
  var POSTURE_ICON = { stand: '\uD83E\uDDCD', sit: '\uD83E\uDE91', move: '\uD83D\uDEB6', flex: '\u23F3', rest: '\u2615' };
  function postureLabel(code) {
    var cs = GUIDE && GUIDE.classStructure, o = cs && cs.postures && cs.postures[code];
    return o ? (LANG === 'vi' ? o.vi : o.ko) : '';
  }
  function guideTimePlan(u) {
    if (!u.timePlan || !u.timePlan.length) return '';
    var ins = GUIDE && GUIDE.instructors, cs = GUIDE && GUIDE.classStructure;
    var total = 0, tot = { A: 0, B: 0, assist: 0, group: 0, circuit: 0 }, brk = 0, clock = 0, by = {};
    var rows = u.timePlan.map(function (p) {
      var start = clock, post = p[4] || '';
      total += p[1]; clock += p[1];
      by[post] = (by[post] || 0) + p[1];
      var when = '<td class="guide-time-at">' + fmtMin(start) + '–' + fmtMin(clock) + '</td>';
      var who = post && post !== 'rest' ? '<span class="guide-post guide-post-' + esc(post) + '" title="' + esc(postureLabel(post)) + '">' + (POSTURE_ICON[post] || '') + ' ' + esc(postureLabel(post)) + '</span> ' : '';
      var o = p[2];
      if (o === null) {
        brk += p[1];
        return '<tr class="guide-time-breakrow">' + when + '<td>' + esc(p[0]) + '</td><td class="guide-time-min">' + fmtMin(p[1]) + '</td><td class="guide-time-min guide-time-brk">' + POSTURE_ICON.rest + ' ' + esc(tr('휴식')) + '</td></tr>';
      }
      tot[o] = (tot[o] || 0) + p[1];
      var reason = ins && ins.reasons && ins.reasons[p[3]] ? '<div class="guide-time-why">' + esc(instrText(ins.reasons[p[3]])) + '</div>' : '';
      return '<tr>' + when + '<td>' + who + esc(p[0]) + reason + '</td><td class="guide-time-min">' + fmtMin(p[1]) + '</td>' +
        '<td class="guide-time-min guide-time-o guide-time-o-' + esc(o) + '">' + esc(ownerLabel(o, u)) + '</td></tr>';
    }).join('');
    var head = '<tr class="guide-time-head"><td>' + esc(tr('시간')) + ' (' + esc(tr('분')) + ')</td><td></td><td class="guide-time-min">' + esc(tr('분')) + '</td><td class="guide-time-min">' + (LANG === 'vi' ? 'Phụ trách' : '담당') + '</td></tr>';
    var foot = '<tr class="guide-time-total"><td></td><td>' + esc(tr('합계')) + '</td><td class="guide-time-min">' + fmtMin(total) + '</td><td class="guide-time-min">' +
      OWNER_KEYS.filter(function (k) { return tot[k]; }).map(function (k) { return esc(ownerShort(k)) + ' ' + fmtMin(tot[k]); }).join(' · ') + (brk ? ' · ' + esc(tr('휴식')) + ' ' + fmtMin(brk) : '') + '</td></tr>';
    var sum = ['stand', 'sit', 'move'].filter(function (k) { return by[k]; }).map(function (k) {
      return '<span class="guide-post guide-post-' + k + '">' + POSTURE_ICON[k] + ' ' + esc(postureLabel(k)) + ' ' + fmtMin(by[k]) + esc(tr('분')) + '</span>';
    }).join(' ');
    var subs = cs && cs.assistantSubstitute, subNote = '';
    if (subs && u.assistant) {
      var subObj = (u.assistant === 'A 강사' && ins.assist.substituteA) ? ins.assist.substituteA : (ins.assist.substitute || {});
      var subTpl = subObj[LANG === 'vi' ? 'vi' : 'ko'] || '';
      subNote = '<p class="guide-time-note">' + esc(subTpl.replace('{date}', u.date)) + '</p>';
    }
    return guideInstructorLegend() + ((u.classNote || (cs && cs.note)) ? '<p class="guide-time-note">' + esc(instrText(u.classNote || cs.note)) + '</p>' : '') + subNote +
      '<div class="guide-label">예상 시간 배분 (2시간 기준, 분)</div>' +
      '<div class="guide-post-sum">' + sum + '</div>' +
      '<table class="guide-time"><tbody>' + head + rows + foot + '</tbody></table>' +
      '<p class="guide-time-note">일반 문법은 핵심 문형 3~4개, 이웃 대화는 앞부분 역할 읽기, 행누·랑제는 한 단락을 다룹니다. 어휘는 주간 과제 범위를 5개 묶음으로 나누어 보조자가 각 단어를 3번씩 읽습니다(한자음 34개 7분, 그 외 34개 4분 30초). 파수대 어휘 10개는 B 강사가 1분 30초 동안 읽습니다.</p>' +
      guideList('과제로만 (수업에서 다루지 않음; 전주 예습 · 후주 복습)', u.homeworkOnly);
  }
  function courseSongsHtml(week) {
    var songs = (boot.courseSongs || {})[String(week)] || [];
    if (!songs.length) return '';
    return '<div class="course-songs" data-course-songs="' + esc(week) + '">' + songs.map(function (song) {
      var label = LANG === 'vi' ? (song.kind === 'open' ? 'Bài hát mở đầu' : 'Bài hát kết thúc') : (song.kind === 'open' ? '시작 노래' : '마치는 노래');
      return '<p><strong>' + esc(label) + '</strong>: ' + esc(song.text[LANG] || song.text.ko) + '</p>';
    }).join('') + '</div>';
  }
  function guideUnitBody(u, hideSongs) {
    return '<div class="guide-body">' + (hideSongs ? '' : courseSongsHtml(u.unit === undefined ? 'prelim' : u.unit)) + ((u.methods || []).length ? '<div class="guide-label">적용할 교수법</div><div>' + guideChips(u.methods) + '</div>' : '') +
      guideTimePlan(u) +
      guideList('수업 적용', u.notes) + guideList('교사 준비물', u.teacherPrep) + guideList('학생 준비물 (학생 [과정]에 표시)', u.studentMaterials) + '</div>';
  }
  function guideUnitFor(week) {
    return ((GUIDE && GUIDE.units) || []).filter(function (u) { return u.unit === week; })[0] || null;
  }
  function renderGuide(c) {
    var g = GUIDE;
    var plan = '<table class="table"><thead><tr><th>시간</th><th>활동</th><th>교수법</th></tr></thead><tbody>' +
      (g.lessonPlan || []).map(function (r) { return '<tr><td>' + esc(r.time) + '</td><td>' + esc(r.activity) + '</td><td>' + esc(r.method) + '</td></tr>'; }).join('') + '</tbody></table>';
    var methods = '<div class="guide-grid">' + (g.methods || []).map(function (m) {
      function sub(label, list) {
        return (list && list.length) ? '<div class="guide-label">' + esc(label) + '</div><ul>' + list.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '';
      }
      return '<div class="guide-method guide-body"><h4>' + esc(m.label) + ' <span style="font-weight:400;color:var(--ink-faint);font-size:12px;">' + esc(m.name) + (m.page ? ' · <span>' + esc(m.page) + '쪽</span>' : '') + '</span></h4><p>' + esc(m.summary) + '</p>' +
        '<div class="guide-label">단계</div><ol>' + (m.steps || []).map(function (st) { return '<li>' + esc(st) + '</li>'; }).join('') + '</ol>' +
        sub('변형', m.variations) + sub('준비물', m.materials) + sub('교재 메모·베트남어 적용', m.teacherMemo) + '</div>';
    }).join('') + '</div>';
    var principles = '<ul style="margin-left:18px;">' + (g.principles || []).map(function (p) {
      return '<li style="margin-bottom:4px;"><b>' + esc(p.name) + '</b> — <span>' + esc(p.body) + '</span></li>';
    }).join('') + '</ul>';
    var pre = g.preliminary ? '<details class="guide-unit" open><summary><span>예비 모임</span> · ' + esc(g.preliminary.date) + ' · <span>' + esc(g.preliminary.theme) + '</span></summary>' + guideUnitBody(g.preliminary) + '</details>' : '';
    var units = (g.units || []).map(function (u) {
      return '<details class="guide-unit"' + (u.unit === state.week ? ' open' : '') + '><summary><span>' + u.unit + '주</span> · ' + esc(u.date) + ' · <span>' + esc(u.theme) + '</span></summary>' + guideUnitBody(u) + '</details>';
    }).join('');
    c.innerHTML =
      '<div class="card"><div class="card-title">' + esc(g.title) + '</div>' +
      '<p class="help-text" style="margin-bottom:6px;"><span>출처:</span> <span>' + esc(g.source) + '</span></p>' +
      '<p class="help-text" style="margin-bottom:12px;">이 내용은 읽기 전용이며 코드(regional_admin/teaching_guide.json)에서 관리합니다. 각 주의 교수법과 학생 준비물은 학생용 [과정] 카드에도 표시됩니다.</p>' +
      '<div class="guide-hint">날짜는 원래 계획 기준입니다. SECTION D에서 회차 배정이 바뀌면 원본 단위 번호로 맞춰 보세요.</div></div>' +
      '<div class="card"><div class="card-title">주별 지도 계획</div>' + pre + units + '</div>' +
      '<div class="card"><div class="card-title">방법별 사용 주</div><table class="table"><thead><tr><th>교수법</th><th>사용 주</th></tr></thead><tbody>' +
      (g.methods || []).map(function (m) {
        var weeks = [];
        if (g.preliminary && (g.preliminary.methods || []).indexOf(m.id) >= 0) weeks.push('예비');
        (g.units || []).forEach(function (u) { if ((u.methods || []).indexOf(m.id) >= 0) weeks.push(u.unit + '주'); });
        return '<tr><td>' + esc(m.label) + '</td><td>' + esc(weeks.join(', ')) + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<div class="card"><div class="card-title">2시간 표준 수업안</div>' + plan + '</div>' +
      '<div class="card"><div class="card-title">교수법 16가지 (교재 Method #1–#16)</div>' + methods + '</div>' +
      '<div class="card"><div class="card-title">공통 원칙</div>' + principles + '</div>' +
      '<div class="card"><div class="card-title">베트남어 조음 위치 (Basic Linguistics)</div><ul style="margin-left:18px;">' +
      (g.linguistics || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>';
  }

  function pendingBanner() {
    var pr = state.plan && state.plan.proposal;
    if (!pr || !pr.changed || !pr.canApply) return '';
    return '<div class="unconfigured-banner"><div>적용되지 않은 일정/배정 변경이 있습니다. 공개 사이트에는 아직 반영되지 않았습니다. ' +
      '<a href="#" data-act="tab" data-tab="plan">SECTION D — 회차 배정에서 미리보기를 확인한 뒤 적용하세요.</a></div></div>';
  }

  function confirmDiscard() {
    if (!state.dirty) return true;
    if (ask('저장하지 않은 변경사항이 있습니다. 버리고 이동할까요?')) { state.dirty = false; return true; }
    return false;
  }

  /* ---------------- SECTION A: course period ---------------- */

  function formValues() {
    var iv = $('sett-interval');
    return {
      preliminaryMeetingDate: ($('sett-prelim') && $('sett-prelim').value) || null,
      courseStartDate: ($('sett-start') && $('sett-start').value) || null,
      courseEndDate: ($('sett-end') && $('sett-end').value) || null,
      intervalDays: iv ? Number(iv.value) : 7
    };
  }

  function scheduleWith(values) {
    return calculateRegionalSchedule({
      preliminaryMeetingDate: values.preliminaryMeetingDate,
      courseStartDate: values.courseStartDate,
      courseEndDate: values.courseEndDate,
      intervalDays: values.intervalDays,
      cancellations: state.cancellations
    });
  }

  var PERIOD_MESSAGES = {
    'end-before-start': '종료일이 시작일보다 빠릅니다.',
    'too-long': '기간이 너무 깁니다 (수업 기회 최대 200회).',
    'bad-date': '날짜 형식이 올바르지 않습니다.'
  };

  /** Derived numbers only: nothing here is typed in, and the cancellation count comes from the actual records. */
  function summaryHtml(values) {
    var sch = scheduleWith(values);
    if (sch.status === 'unconfigured') {
      return '<div class="preview-box" style="color:var(--ink-faint);">시작일과 종료일을 입력하면 수업 회차가 자동으로 계산됩니다. (일정 미정)</div>';
    }
    if (sch.status === 'invalid') {
      return '<div class="preview-box" style="color:var(--danger);">' + esc(PERIOD_MESSAGES[sch.errors[0]] || '수업 기간이 올바르지 않습니다.') + '</div>';
    }
    var ignored = sch.unalignedCancellations.length + sch.preCourseCancellations.length + sch.postCourseCancellations.length;
    return '<div class="preview-box"><div style="font-weight:700;margin-bottom:8px;color:var(--primary);">자동 계산 결과</div>' +
      '<table class="table"><tbody>' +
      '<tr><th>수업 기간</th><td>' + esc(sch.courseStartDate) + ' ~ ' + esc(sch.courseEndDate) + ' (' + (sch.intervalDays === 14 ? '격주' : '매주') + ')</td></tr>' +
      '<tr><th>달력상 수업 기회</th><td>' + sch.calendarOpportunities + '회</td></tr>' +
      '<tr><th>휴강 횟수</th><td><span>' + sch.cancellationCount + '회</span>' + (ignored ? ' <span class="help-text">(수업 일정에 해당하지 않아 반영되지 않은 휴강 ' + ignored + '건 별도)</span>' : '') + '</td></tr>' +
      '<tr><th>실제 수업 회차</th><td><strong>' + sch.instructionalSessions + '회</strong>' + (sch.completionDate ? ' <span>(마지막 수업 ' + esc(sch.completionDate) + ')</span>' : '') + '</td></tr>' +
      '</tbody></table></div>';
  }

  function renderSchedule(c) {
    var s = state.settings || {};
    var banner = (s.courseStartDate && s.courseEndDate) ? '' :
      '<div class="unconfigured-banner"><div>현재 일정 미정 상태입니다. 시작일과 종료일이 설정되기 전까지 공개 사이트에는 날짜가 표시되지 않고 \'일정 미정\'이 유지됩니다.</div></div>';
    c.innerHTML = banner +
      '<div class="card"><div class="card-title">수업 기간 설정</div>' +
      '<form id="settings-form">' +
      '<div class="form-group"><label for="sett-prelim">예비 모임 일자</label><input type="date" id="sett-prelim" class="form-control" value="' + esc(s.preliminaryMeetingDate || '') + '">' +
      '<div class="help-text">수업 시작 전 예비 모임 날짜. 미정이면 비워두세요. 과정 시작일보다 늦을 수 없습니다.</div></div>' +
      '<div class="form-group"><label for="sett-start">과정 시작일 (첫 수업일)</label><input type="date" id="sett-start" class="form-control" value="' + esc(s.courseStartDate || '') + '"></div>' +
      '<div class="form-group"><label for="sett-end">과정 종료일 (마지막 수업 가능일)</label><input type="date" id="sett-end" class="form-control" value="' + esc(s.courseEndDate || '') + '">' +
      '<div class="help-text">수업 회차(예: 16주)를 직접 입력하지 않습니다. 시작일~종료일과 휴강일로 회차가 자동 계산되고, 전체 학습 분량이 그 회차에 맞게 배분됩니다.</div></div>' +
      '<div class="form-group"><label for="sett-interval">수업 주기</label><select id="sett-interval" class="form-control">' +
      '<option value="7"' + (s.intervalDays !== 14 ? ' selected' : '') + '>매주 (시작일과 같은 요일)</option>' +
      '<option value="14"' + (s.intervalDays === 14 ? ' selected' : '') + '>격주</option></select></div>' +
      '<div class="form-group"><label for="sett-weekday">수업 요일 / 설명</label><input type="text" id="sett-weekday" class="form-control" maxlength="40" value="' + esc(s.meetingWeekday || '매주 토요일') + '"></div>' +
      '<div id="course-summary">' + summaryHtml(formValuesFrom(s)) + '</div>' +
      '<p class="help-text" style="margin:10px 0;">저장하면 설정만 바뀝니다. 공개 사이트의 회차 배정은 SECTION D — 회차 배정에서 미리보기를 확인하고 \'적용\'해야 바뀝니다.</p>' +
      '<button type="submit" class="btn btn-primary">설정 저장</button></form></div>';
  }

  function formValuesFrom(s) {
    return { preliminaryMeetingDate: s.preliminaryMeetingDate || null, courseStartDate: s.courseStartDate || null, courseEndDate: s.courseEndDate || null, intervalDays: s.intervalDays === 14 ? 14 : 7 };
  }

  function refreshSummary() {
    var box = $('course-summary');
    if (box) box.innerHTML = summaryHtml(formValues());
  }

  function saveSettings() {
    var cur = state.settings || {};
    var v = formValues();
    api('PUT', '/api/admin/settings', {
      preliminaryMeetingDate: v.preliminaryMeetingDate,
      courseStartDate: v.courseStartDate,
      courseEndDate: v.courseEndDate,
      intervalDays: v.intervalDays,
      meetingWeekday: $('sett-weekday').value || '매주 토요일',
      welcomeTitle: cur.welcomeTitle || null,
      welcomeBody: cur.welcomeBody || null
    }).then(function (r) {
      if (r.ok) { toast('수업 기간이 저장되었습니다. 회차 배정은 미리보기 후 적용해 주세요.'); return reloadAll(); }
      toast(errText(r, '저장 실패'), true);
    }).catch(function () { toast('요청 중 오류가 발생했습니다.', true); });
  }

  function reloadAll() {
    return loadData().then(renderApp);
  }

  /* ---------------- SECTION B: cancellations ---------------- */

  function scheduleFor(s) {
    return scheduleWith(formValuesFrom(s));
  }

  function cancellationStatus(sch) {
    var flagged = {};
    sch.unalignedCancellations.forEach(function (x) { flagged[x.date] = '수업 일정(요일/주기)에 해당하지 않아 무시됨'; });
    sch.preCourseCancellations.forEach(function (x) { flagged[x.date] = '과정 시작일 이전이라 무시됨'; });
    sch.postCourseCancellations.forEach(function (x) { flagged[x.date] = '과정 종료일 이후라 무시됨'; });
    return flagged;
  }

  function renderCancellations(c) {
    var s = state.settings || {};
    var cancels = state.cancellations || [];
    var flagged = cancellationStatus(scheduleFor(s));
    var rows = cancels.map(function (x) {
      if (state.editingCancel === x.id) {
        return '<tr><td><input type="date" class="form-control" id="cedit-date" value="' + esc(x.date) + '"></td>' +
          '<td><input type="text" class="form-control" id="cedit-reason" maxlength="200" value="' + esc(x.reason) + '"></td>' +
          '<td><button type="button" class="btn btn-primary move-btn" data-act="cancel-save" data-id="' + x.id + '">저장</button> ' +
          '<button type="button" class="btn move-btn" data-act="cancel-edit-stop">취소</button></td></tr>';
      }
      return '<tr><td><strong>' + esc(x.date) + '</strong>' + (flagged[x.date] ? '<div class="help-text" style="color:var(--danger);">' + esc(flagged[x.date]) + '</div>' : '') + '</td><td>' + esc(x.reason) + '</td>' +
        '<td><button type="button" class="btn move-btn" data-act="cancel-edit" data-id="' + x.id + '">수정</button> ' +
        '<button type="button" class="btn btn-danger move-btn" data-act="cancel-delete" data-id="' + x.id + '">삭제</button></td></tr>';
    }).join('');

    var preview;
    var sch = scheduleFor(s);
    if (sch.status === 'configured') {
      preview = summaryHtml(formValuesFrom(s)) +
        '<div class="preview-box"><div style="font-weight:700;margin-bottom:6px;color:var(--primary);">회차 자동 재계산 미리보기</div>' +
        '<div class="preview-timeline">' + sch.slots.map(function (slot) {
          return slot.type === 'cancellation'
            ? '<div class="preview-item cancellation"><span>' + esc(slot.date) + ' [휴강]</span><span>' + esc(slot.reason) + '</span></div>'
            : '<div class="preview-item"><span>' + esc(slot.date) + '</span><span>' + slot.session + '회차</span></div>';
        }).join('') + '</div></div>';
    } else {
      preview = '<div class="preview-box" style="color:var(--ink-faint);">수업 기간(시작일·종료일)이 설정되지 않아 일정을 미리볼 수 없습니다. SECTION A에서 먼저 입력해주세요.</div>';
    }

    c.innerHTML =
      '<div class="card"><div class="card-title">휴강 추가</div>' +
      '<form id="cancel-form" style="display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap;">' +
      '<div class="form-group" style="margin-bottom:0;flex:1;min-width:180px;"><label for="cancel-date">휴강 일자</label><input type="date" id="cancel-date" class="form-control" required></div>' +
      '<div class="form-group" style="margin-bottom:0;flex:2;min-width:240px;"><label for="cancel-reason">휴강 사유 (필수)</label><input type="text" id="cancel-reason" class="form-control" maxlength="200" placeholder="예: 순회대회, 명절, 방학 등" required></div>' +
      '<button type="submit" class="btn btn-primary" style="height:38px;">휴강 추가</button></form>' +
      '<div class="help-text">휴강 일자는 수업 기간 안의 실제 수업일(시작일과 같은 요일/주기)이어야 하며 같은 날짜를 두 번 등록할 수 없습니다. 휴강은 수업 기회는 소모하지만 학습 진도는 소모하지 않습니다. 휴강 횟수는 이 목록에서 자동으로 계산됩니다.</div></div>' +
      '<div class="card"><div class="card-title">등록된 휴강 목록</div>' +
      (cancels.length === 0 ? '<p style="color:var(--ink-faint);">등록된 휴강 일자가 없습니다.</p>' :
        '<table class="table"><thead><tr><th>일자</th><th>사유</th><th>관리</th></tr></thead><tbody>' + rows + '</tbody></table>') +
      preview + '</div>';
  }

  function addCancellation() {
    api('POST', '/api/admin/cancellations', { date: $('cancel-date').value, reason: $('cancel-reason').value.trim() }).then(function (r) {
      if (r.ok) { toast('휴강 일자가 추가되었습니다. 회차 수가 자동 재계산되었습니다 (배정은 SECTION D에서 적용).'); return reloadAll(); }
      toast(errText(r, '추가 실패'), true);
    }).catch(function () { toast('요청 중 오류 발생', true); });
  }

  function saveCancellationEdit(id) {
    api('PUT', '/api/admin/cancellations/' + id, { date: $('cedit-date').value, reason: $('cedit-reason').value.trim() }).then(function (r) {
      if (r.ok) { state.editingCancel = null; toast('휴강 정보가 수정되었습니다.'); return reloadAll(); }
      toast(errText(r, '수정 실패'), true);
    }).catch(function () { toast('요청 중 오류 발생', true); });
  }

  function deleteCancellation(id) {
    if (!ask('이 휴강 일자를 삭제하시겠습니까? 삭제 시 이후 일정이 다시 앞당겨집니다.')) return;
    api('DELETE', '/api/admin/cancellations/' + id).then(function (r) {
      if (r.ok) { toast('휴강 일자가 삭제되었습니다.'); return reloadAll(); }
      toast(errText(r, '삭제 실패'), true);
    }).catch(function () { toast('요청 중 오류 발생', true); });
  }

  /* ---------------- SECTION C: curriculum ---------------- */

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function normText(t) {
    if (typeof t === 'string') return { ko: t, en: null };
    return { ko: (t && t.ko) || '', en: (t && t.en) || null };
  }

  /** Working copy of the selected week. Keeps each item's link and (unchanged) English text. */
  function resetEdit() {
    var w = (state.curriculum || []).filter(function (x) { return x.week === state.week; })[0] || { week: state.week };
    var days = DAYS.map(function (d) {
      var src = ((w.assignments && w.assignments.days) || []).filter(function (x) {
        return x.day && x.day.ko && x.day.ko.replace('요일', '') === d;
      })[0] || {};
      var out = { day: d };
      CATS.forEach(function (cat) {
        out[cat[0]] = (src[cat[0]] || []).map(function (it) {
          return { uid: it.uid, text: normText(it.text), link: it.link || null, _ko: normText(it.text).ko };
        });
      });
      return out;
    });
    state.edit = {
      title: normText(w.title),
      note: normText(w.note),
      items: (w.items || []).map(function (it) {
        return { uid: it.uid, text: normText(it.text), page: it.page || '', link: it.link || null, _ko: normText(it.text).ko };
      }),
      days: days
    };
    state.dirty = false;
  }

  function rowHtml(kind, idx, it, extra) {
    var attrs = ' data-i="' + idx + '"' + (extra || '');
    var page = kind === 'item'
      ? '<input type="text" class="form-control" style="max-width:100px;" data-f="item-page"' + attrs + ' value="' + esc(it.page || '') + '" placeholder="페이지" maxlength="100" aria-label="페이지">'
      : '';
    return '<div class="item-row">' +
      '<input type="text" class="form-control" data-f="' + kind + '-text"' + attrs + ' value="' + esc(it.text.ko) + '" maxlength="1000" placeholder="내용" aria-label="내용">' +
      page +
      '<button type="button" class="btn move-btn" data-act="' + kind + '-up"' + attrs + ' aria-label="위로 이동">▲</button>' +
      '<button type="button" class="btn move-btn" data-act="' + kind + '-down"' + attrs + ' aria-label="아래로 이동">▼</button>' +
      '<button type="button" class="btn btn-danger move-btn" data-act="' + kind + '-del"' + attrs + ' aria-label="삭제">✕</button></div>' + viHint(it.text.ko);
  }

  /** Vietnamese mode: the course text's Vietnamese under its (Korean, editable) input. */
  function viHint(ko) {
    var v = LANG === 'vi' ? courseVi(ko) : '';
    return v ? '<div class="help-text vi-hint">' + esc(v) + '</div>' : '';
  }

  function renderCurriculum(c) {
    var e = state.edit;
    var nav = '<div class="week-nav-grid">';
    for (var w = 1; w <= 16; w++) {
      nav += '<button type="button" class="week-nav-btn' + (w === state.week ? ' active' : '') + '" data-act="week" data-w="' + w + '">' + w + '주</button>';
    }
    nav += '</div>';

    var items = e.items.map(function (it, i) { return rowHtml('item', i, it); }).join('') ||
      '<p style="color:var(--ink-faint);font-size:13px;">등록된 학습 내용이 없습니다.</p>';

    var assign = e.days.map(function (day, di) {
      var cats = CATS.map(function (cat) {
        var list = day[cat[0]].map(function (it, i) {
          return rowHtml('a', i, it, ' data-d="' + di + '" data-c="' + cat[0] + '"');
        }).join('');
        return '<div style="margin:8px 0 10px 8px;"><div style="font-weight:600;font-size:12px;color:var(--ink-soft);margin-bottom:4px;display:flex;justify-content:space-between;align-items:center;">' +
          '<span>' + cat[1] + '</span><button type="button" class="btn move-btn" data-act="a-add" data-d="' + di + '" data-c="' + cat[0] + '">+ 추가</button></div>' + list + '</div>';
      }).join('');
      return '<details><summary style="cursor:pointer;font-weight:700;padding:6px 0;">' + day.day + '요일 과제</summary>' + cats + '</details>';
    }).join('');

    c.innerHTML =
      '<div class="card"><div class="card-title">원본 커리큘럼 단위 선택 (1 ~ 16)</div>' + nav +
      '<p class="help-text">여기는 전체 학습 분량(원본 커리큘럼)입니다. 실제 수업 회차 수와 무관하며, 일정이 바뀌어도 이 내용은 바뀌지 않습니다. 회차별 배정은 SECTION D에서 자동 계산됩니다.</p></div>' +
      (courseSongsHtml(state.week) ? '<div class="card">' + courseSongsHtml(state.week) + '</div>' : '') +
      (guideUnitFor(state.week) ? '<div class="card"><div class="card-title"><span>교사용 지도서 — ' + state.week + '주</span> <button type="button" class="btn move-btn" data-act="tab" data-tab="guide">전체 보기</button></div>' + guideUnitBody(guideUnitFor(state.week), true) + '</div>' : '') +
      '<div class="card"><div class="card-title">원본 단위 ' + state.week + ' — 학습 자료 및 수행 과제 편집' + (state.dirty ? ' <span class="tag tag-cancel">저장 안 됨</span>' : '') + '</div>' +
      '<form id="week-form">' +
      '<div class="form-group"><label for="week-title">단위 제목</label><input type="text" id="week-title" class="form-control" data-f="title" maxlength="200" value="' + esc(e.title.ko) + '">' + viHint(e.title.ko) + '</div>' +
      '<div class="form-group"><label for="week-note">참고 사항 (Note)</label><input type="text" id="week-note" class="form-control" data-f="note" maxlength="1000" value="' + esc(e.note.ko) + '">' + viHint(e.note.ko) + '</div>' +
      '<div style="font-weight:700;margin:18px 0 8px;display:flex;justify-content:space-between;align-items:center;"><span>학습 내용 목록</span>' +
      '<button type="button" class="btn btn-primary move-btn" data-act="item-add">+ 항목 추가</button></div>' +
      '<div id="items-list">' + items + '</div>' +
      '<div style="font-weight:700;margin:22px 0 4px;">요일별 과제</div>' + assign +
      '<p class="help-text">위/아래 버튼으로 순서를 바꾼 뒤 저장하면 전체 순서가 한 번에(모두 성공하거나 모두 취소) 저장됩니다. 텍스트를 수정한 항목의 영어 번역은 비워지며, 링크는 유지됩니다.</p>' +
      '<button type="submit" class="btn btn-primary" style="margin-top:14px;">원본 단위 ' + state.week + ' 저장</button></form></div>';
  }

  function listFor(t) {
    var d = t.getAttribute('data-d');
    if (d !== null && d !== undefined && t.hasAttribute('data-c')) return state.edit.days[+d][t.getAttribute('data-c')];
    return state.edit.items;
  }

  function editText(rec, value) {
    rec.text.ko = value;
    if (value !== rec._ko) rec.text.en = null; // the English text belonged to the previous Korean text
  }

  function move(list, i, dir) {
    var j = i + dir;
    if (j < 0 || j >= list.length) return;
    var tmp = list[i]; list[i] = list[j]; list[j] = tmp;
    state.dirty = true;
    renderTab();
  }

  function payloadItem(it, withPage) {
    var out = { text: { ko: it.text.ko.trim(), en: it.text.en || null }, link: it.link || null };
    if (it.uid) out.uid = it.uid;
    if (withPage) out.page = (it.page || '').trim() || null;
    return out;
  }

  function saveWeek() {
    var e = state.edit;
    var payload = {
      title: { ko: e.title.ko.trim(), en: e.title.en || null },
      note: { ko: e.note.ko.trim(), en: e.note.en || null },
      items: e.items.filter(function (it) { return it.text.ko.trim(); }).map(function (it) { return payloadItem(it, true); }),
      assignments: {
        days: e.days.map(function (d) {
          var o = { day: { ko: d.day + '요일' } };
          CATS.forEach(function (cat) {
            o[cat[0]] = d[cat[0]].filter(function (it) { return it.text.ko.trim(); }).map(function (it) { return payloadItem(it, false); });
          });
          return o;
        })
      }
    };
    api('PUT', '/api/admin/curriculum/' + state.week, payload).then(function (r) {
      if (r.ok) { toast('원본 단위 ' + state.week + '이(가) 저장되었습니다. 새 항목은 SECTION D에서 재배정할 때까지 마지막 회차에 표시됩니다.'); state.dirty = false; return reloadAll(); }
      toast(errText(r, '저장 실패'), true);
    }).catch(function () { toast('요청 중 오류 발생', true); });
  }

  /* ---------------- SECTION D: session distribution (preview / apply) ---------------- */

  function itemLabel(lookup, uid) {
    var it = lookup[uid];
    if (!it) return esc(uid);
    var tag = it.kind === 'assignment' ? ' <span class="tag tag-active">' + esc((it.day || '') + ' ' + ({ review: '복습', preview: '예습', vocab: '어휘' }[it.category] || '')) + '</span>' : '';
    return esc(it.ko) + tag;
  }

  function sessionCard(sess, lookup, withPins, maxSession, pins) {
    var learn = sess.learning.map(function (uid) { return '<li>' + itemLabel(lookup, uid) + pinControl(uid, withPins, maxSession, pins) + '</li>'; }).join('');
    var assign = sess.assignments.map(function (uid) { return '<li>' + itemLabel(lookup, uid) + pinControl(uid, withPins, maxSession, pins) + '</li>'; }).join('');
    return '<details class="preview-item" style="display:block;">' +
      '<summary style="cursor:pointer;font-weight:700;"><span>' + sess.session + '회차</span>' + (sess.date ? ' — ' + esc(sess.date) : '') +
      ' <span class="help-text">(학습 자료 ' + sess.learning.length + ' · 수행 과제 ' + sess.assignments.length + ')</span></summary>' +
      '<div style="margin:6px 0 0 8px;"><div style="font-weight:600;font-size:12px;">학습 자료</div>' + (learn ? '<ul style="margin-left:18px;">' + learn + '</ul>' : '<p class="help-text">없음</p>') +
      '<div style="font-weight:600;font-size:12px;margin-top:6px;">수행 과제</div>' + (assign ? '<ul style="margin-left:18px;">' + assign + '</ul>' : '<p class="help-text">없음</p>') + '</div></details>';
  }

  function pinControl(uid, withPins, maxSession, pins) {
    if (!withPins) return '';
    var opts = '';
    for (var n = 1; n <= maxSession; n++) opts += '<option value="' + n + '"' + (pins[uid] === n ? ' selected' : '') + '>' + n + '회차</option>';
    return ' <select class="form-control" style="width:auto;display:inline-block;padding:2px 4px;font-size:12px;" data-f="pin" data-uid="' + esc(uid) + '" aria-label="회차 지정"><option value="">자동</option>' + opts + '</select>' +
      (pins[uid] ? ' <span class="tag tag-cancel">수동</span>' : '');
  }

  function renderPlan(c) {
    var st = state.plan;
    if (!st) { c.innerHTML = '<div class="card">배정 정보를 불러오지 못했습니다.</div>'; return; }
    var pr = st.proposal, act = st.active, sch = pr.schedule;
    var head;
    if (sch.status === 'unconfigured') {
      head = '<div class="unconfigured-banner"><div>수업 기간(시작일·종료일)이 설정되지 않았습니다. 공개 사이트에는 \'일정 미정\'이 표시됩니다.</div></div>';
    } else if (sch.status === 'invalid') {
      head = '<div class="unconfigured-banner"><div>수업 기간이 올바르지 않습니다: ' + esc(PERIOD_MESSAGES[sch.errors[0]] || '') + '</div></div>';
    } else {
      head = '';
    }
    var prevCount = act ? act.sessionCount : null;
    var compare = '<div class="preview-box"><table class="table"><tbody>' +
      '<tr><th>현재 적용됨</th><td>' + (act ? '<span>' + act.sessionCount + '회차</span> (' + esc(act.config.courseStartDate) + ' ~ ' + esc(act.config.courseEndDate) + ', ' + esc(act.appliedAt || '') + ' ' + esc(act.appliedBy || '') + ')' : '적용된 배정 없음') + '</td></tr>' +
      '<tr><th>제안 (미리보기)</th><td><strong>' + pr.proposed.sessionCount + '회차</strong> — <span>수업 기회 ' + sch.calendarOpportunities + ' − 휴강 ' + sch.cancellationCount + '</span></td></tr>' +
      '<tr><th>변경 여부</th><td>' + (pr.changed ? '<span class="tag tag-cancel">변경됨 — 적용 필요</span>' : '<span class="tag tag-active">현재 적용본과 동일</span>') + '</td></tr>' +
      '</tbody></table>' +
      (prevCount !== null && prevCount !== pr.proposed.sessionCount ? '<p style="margin-top:8px;font-weight:700;color:var(--danger);">적용하면 ' + prevCount + '회차 → ' + pr.proposed.sessionCount + '회차로 재배정됩니다.</p>' : '') +
      (pr.clampedPins.length ? '<p class="help-text" style="color:var(--danger);">수동 지정 ' + pr.clampedPins.length + '건이 회차 범위를 벗어나 가장 가까운 회차로 조정됩니다.</p>' : '') +
      '<button type="button" class="btn btn-primary" data-act="plan-apply" data-token="' + esc(pr.token) + '" data-from="' + (prevCount === null ? '' : prevCount) + '" data-to="' + pr.proposed.sessionCount + '"' + ((pr.canApply && pr.changed) ? '' : ' disabled') + '>적용</button>' +
      '<span class="help-text" style="margin-left:8px;">적용 전에는 공개 사이트가 바뀌지 않습니다. 원본 커리큘럼은 절대 수정되지 않습니다.</span></div>';

    var proposed = pr.proposed.sessions.length
      ? '<div class="preview-timeline" style="max-height:none;">' + pr.proposed.sessions.map(function (x) { return sessionCard(x, pr.items, false); }).join('') + '</div>'
      : '<p class="help-text">배정할 회차가 없습니다.</p>';

    var current = '';
    if (act) {
      var pins = act.manualPins || {};
      var note = act.unplaced && (act.unplaced.learning.length + act.unplaced.assignments.length)
        ? '<p class="help-text" style="color:var(--danger);">원본에 새로 추가된 항목 ' + (act.unplaced.learning.length + act.unplaced.assignments.length) + '개가 마지막 회차에 임시로 표시됩니다. 위의 \'적용\'으로 재배정하세요.</p>' : '';
      current = '<div class="card"><div class="card-title">현재 적용된 배정 (' + act.sessionCount + '회차)</div>' + note +
        '<p class="help-text">항목 옆 선택으로 특정 회차에 수동 지정할 수 있습니다. 수동 지정 항목은 이후 자동 재배정에서도 유지됩니다(회차 범위를 벗어나면 조정).</p>' +
        '<div class="preview-timeline" style="max-height:none;">' + act.sessions.map(function (x) { return sessionCard(x, pr.items, true, act.sessionCount, pins); }).join('') + '</div></div>';
    }

    c.innerHTML = head +
      '<div class="card"><div class="card-title">자동 재배정 미리보기</div>' + summaryHtml(formValuesFrom(state.settings || {})) + compare +
      '<div style="font-weight:700;margin:14px 0 6px;">제안된 회차별 배정</div>' + proposed + '</div>' + current;
  }

  function applyPlan(token, from, to) {
    var msg = (from ? from + '회차 → ' + to + '회차로' : to + '회차로') + ' 공개 사이트의 회차 배정을 교체합니다. 계속할까요?';
    if (!ask(msg)) return;
    api('POST', '/api/admin/plan/apply', { token: token }).then(function (r) {
      if (r.ok) { toast('회차 배정이 적용되었습니다.'); return reloadAll(); }
      toast(errText(r, '적용 실패'), true);
      if (r.status === 409) return reloadAll();
    }).catch(function () { toast('요청 중 오류 발생', true); });
  }

  function pinItem(uid, value) {
    api('PUT', '/api/admin/plan/pin', { uid: uid, session: value ? Number(value) : null }).then(function (r) {
      if (r.ok) { toast(value ? '회차가 지정되었습니다.' : '자동 배정으로 되돌렸습니다.'); return reloadAll(); }
      toast(errText(r, '지정 실패'), true);
    }).catch(function () { toast('요청 중 오류 발생', true); });
  }

  /* ---------------- SECTION E: audit ---------------- */

  function renderAudit(c) {
    c.innerHTML = '<div class="card"><div class="card-title">변경 이력 불러오는 중...</div></div>';
    api('GET', '/api/admin/audit').then(function (r) {
      if (!r.ok) throw new Error('audit');
      var logs = r.data;
      var body = logs.length === 0 ? '<p style="color:var(--ink-faint);">기록된 변경 이력이 없습니다.</p>' :
        '<table class="table"><thead><tr><th>일시</th><th>관리자</th><th>작업</th><th>상세 요약</th><th>복구</th></tr></thead><tbody>' +
        logs.map(function (l) {
          return '<tr><td>' + esc(l.created_at) + '</td><td><strong>' + esc(l.username) + '</strong></td>' +
            '<td><span class="tag tag-active">' + esc(ACTION_LABELS[l.action] || l.action) + '</span></td>' +
            '<td style="font-size:12px;max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + esc(String(l.details || '').slice(0, 200)) + '</td>' +
            '<td>' + (RESTORABLE[l.action] ? '<button type="button" class="btn move-btn" data-act="restore" data-id="' + esc(l.id) + '">복구</button>' : '') + '</td></tr>';
        }).join('') + '</tbody></table>';
      c.innerHTML = '<div class="card"><div class="card-title">변경 이력 (Audit Log & Restore)</div>' +
        '<p style="color:var(--ink-soft);font-size:13px;margin-bottom:14px;">모든 일정 및 커리큘럼 변경이 기록됩니다. 복구하면 해당 변경이 일어나기 전 상태로 되돌립니다.</p>' + body + '</div>';
    }).catch(function () {
      c.innerHTML = '<div class="card"><div style="color:var(--danger);">변경 이력을 불러오지 못했습니다.</div></div>';
    });
  }

  function restore(id) {
    if (!ask('이 변경을 되돌리시겠습니까? 현재 값이 덮어씌워집니다.')) return;
    api('POST', '/api/admin/audit/' + id + '/restore').then(function (r) {
      if (r.ok) { toast('성공적으로 복구되었습니다.'); return reloadAll(); }
      toast(errText(r, '복구 실패'), true);
    }).catch(function () { toast('복구 중 오류 발생', true); });
  }

  /* ---------------- events ---------------- */

  document.addEventListener('submit', function (ev) {
    var id = ev.target && ev.target.id;
    if (!id) return;
    ev.preventDefault();
    if (id === 'login-form') handleLogin(ev.target);
    else if (id === 'settings-form') saveSettings();
    else if (id === 'cancel-form') addCancellation();
    else if (id === 'week-form') saveWeek();
  });

  document.addEventListener('change', function (ev) {
    var t = ev.target;
    if (t && t.getAttribute && t.getAttribute('data-f') === 'pin') pinItem(t.getAttribute('data-uid'), t.value);
    if (t && t.getAttribute && t.getAttribute('data-act') === 'mwb-assign-change') {
      var sKey = t.getAttribute('data-slot-key');
      var sVal = t.value.trim();
      var mwbMap = getMwbAssignmentsMap();
      if (sVal) mwbMap[sKey] = sVal;
      else delete mwbMap[sKey];
      saveMwbAssignmentsMap(mwbMap);
      toast('임명이 변경되었습니다: ' + (sVal || '(미정)'));
    }
    if (t && t.getAttribute && t.getAttribute('data-act') === 'mwb-role-toggle') {
      var mIdx = +t.getAttribute('data-member-idx');
      var rName = t.getAttribute('data-role');
      var rList = getMwbRoster();
      if (rList[mIdx]) {
        if (!rList[mIdx].roles) rList[mIdx].roles = {};
        rList[mIdx].roles[rName] = t.checked ? 1 : 0;
        saveMwbRoster(rList);
        toast('자격이 변경되었습니다.');
      }
    }
  });

  document.addEventListener('input', function (ev) {
    var t = ev.target;
    if (t && t.id && /^sett-(prelim|start|end|interval)$/.test(t.id)) { refreshSummary(); return; }
    var f = t && t.getAttribute && t.getAttribute('data-f');
    if (!f || !state.edit || f === 'pin') return;
    var wasDirty = state.dirty;
    state.dirty = true;
    if (f === 'title') state.edit.title.ko = t.value;
    else if (f === 'note') state.edit.note.ko = t.value;
    else if (f === 'item-text' || f === 'a-text') editText(listFor(t)[+t.getAttribute('data-i')], t.value);
    else if (f === 'item-page') listFor(t)[+t.getAttribute('data-i')].page = t.value;
    if (!wasDirty) {
      var badge = document.querySelector('#week-form') && document.querySelector('#week-form').parentNode.querySelector('.card-title');
      if (badge && !badge.querySelector('.tag')) badge.insertAdjacentHTML('beforeend', ' <span class="tag tag-cancel">저장 안 됨</span>');
    }
  });

  document.addEventListener('click', function (ev) {
    var t = ev.target && ev.target.closest ? ev.target.closest('[data-act]') : null;
    if (!t) return;
    var act = t.getAttribute('data-act');
    var i = +t.getAttribute('data-i');
    var id = t.getAttribute('data-id');
    switch (act) {
      case 'logout': handleLogout(); break;
      case 'tab':
        if (!confirmDiscard()) break;
        if (isSectionFViewer() && t.getAttribute('data-tab') !== 'guide') break;
        state.tab = t.getAttribute('data-tab');
        if (state.tab === 'curriculum') resetEdit();
        saveView();
        renderApp();
        break;
      case 'week':
        if (!confirmDiscard()) break;
        state.week = +t.getAttribute('data-w');
        resetEdit();
        saveView();
        renderTab();
        break;
      case 'cancel-edit': state.editingCancel = +id; renderTab(); break;
      case 'cancel-edit-stop': state.editingCancel = null; renderTab(); break;
      case 'cancel-save': saveCancellationEdit(+id); break;
      case 'cancel-delete': deleteCancellation(+id); break;
      case 'item-add':
        state.edit.items.push({ text: { ko: '', en: null }, page: '', link: null, _ko: '' });
        state.dirty = true; renderTab(); break;
      case 'item-up': move(state.edit.items, i, -1); break;
      case 'item-down': move(state.edit.items, i, 1); break;
      case 'item-del': state.edit.items.splice(i, 1); state.dirty = true; renderTab(); break;
      case 'a-add':
        state.edit.days[+t.getAttribute('data-d')][t.getAttribute('data-c')].push({ text: { ko: '', en: null }, link: null, _ko: '' });
        state.dirty = true; renderTab(); break;
      case 'a-up': move(listFor(t), i, -1); break;
      case 'a-down': move(listFor(t), i, 1); break;
      case 'a-del': listFor(t).splice(i, 1); state.dirty = true; renderTab(); break;
      case 'restore': restore(id); break;
      case 'plan-apply': applyPlan(t.getAttribute('data-token'), t.getAttribute('data-from'), t.getAttribute('data-to')); break;
      case 'mwb-subtab':
        state.mwbSubTab = t.getAttribute('data-subtab');
        renderTab();
        break;
      case 'mwb-auto-assign':
        var resCounts = executeAutoAssignment();
        toast('11주차 집회 임명 자동 배정이 완료되었습니다!');
        renderTab();
        break;
      case 'mwb-add-member':
        state.mwbShowAdd = true;
        state.mwbEditingIdx = undefined;
        renderTab();
        break;
      case 'mwb-edit-member':
        state.mwbEditingIdx = +t.getAttribute('data-idx');
        state.mwbShowAdd = true;
        renderTab();
        break;
      case 'mwb-cancel-member':
        state.mwbShowAdd = false;
        state.mwbEditingIdx = undefined;
        renderTab();
        break;
      case 'mwb-save-member':
        var editIdx = t.getAttribute('data-idx');
        var ko = ($('mwb-in-ko') && $('mwb-in-ko').value.trim()) || '';
        var vi = ($('mwb-in-vi') && $('mwb-in-vi').value.trim()) || '';
        var call = ($('mwb-in-call') && $('mwb-in-call').value.trim()) || '';
        var gender = ($('mwb-in-gender') && $('mwb-in-gender').value) || 'M';
        var spouse = ($('mwb-in-spouse') && $('mwb-in-spouse').value.trim()) || undefined;
        var pOfRaw = ($('mwb-in-parentOf') && $('mwb-in-parentOf').value.trim()) || '';
        var pOf = pOfRaw ? pOfRaw.split(',').map(function(s){return s.trim();}).filter(Boolean) : undefined;
        if (!ko) { toast('한국어 성명을 입력해주세요.', true); break; }
        var curRoster = getMwbRoster();
        if (editIdx !== '' && curRoster[+editIdx]) {
          var targetMem = curRoster[+editIdx];
          targetMem.ko = ko; targetMem.vi = vi; targetMem.call = call; targetMem.gender = gender;
          if (spouse) targetMem.spouse = spouse; else delete targetMem.spouse;
          if (pOf && pOf.length) targetMem.parentOf = pOf; else delete targetMem.parentOf;
        } else {
          curRoster.push({
            ko: ko, vi: vi, call: call, gender: gender,
            spouse: spouse, parentOf: pOf,
            roles: { ministry: 1, prayer: gender === 'M' ? 1 : 0, gems: gender === 'M' ? 1 : 0, reading: gender === 'M' ? 1 : 0 }
          });
        }
        saveMwbRoster(curRoster);
        state.mwbShowAdd = false;
        state.mwbEditingIdx = undefined;
        toast('성원 정보가 저장되었습니다.');
        renderTab();
        break;
      case 'mwb-del-member':
        var delIdx = +t.getAttribute('data-idx');
        var curRoster2 = getMwbRoster();
        if (curRoster2[delIdx]) {
          if (confirm(curRoster2[delIdx].ko + ' 성원을 명단에서 삭제하시겠습니까?')) {
            curRoster2.splice(delIdx, 1);
            saveMwbRoster(curRoster2);
            toast('삭제되었습니다.');
            renderTab();
          }
        }
        break;
      case 'mwb-reset-roster':
        if (confirm('성원 명단을 초기 33명 기본값으로 복원하시겠습니까?')) {
          localStorage.removeItem('jeonju_mwb_roster');
          toast('성원 명단이 기본값으로 복원되었습니다.');
          renderTab();
        }
        break;
      case 'mwb-reset-assign':
        if (confirm('배정표를 기본 자동 배정 값으로 복원하시겠습니까?')) {
          localStorage.removeItem('jeonju_mwb_assignments');
          executeAutoAssignment();
          toast('배정표가 기본값으로 복원되었습니다.');
          renderTab();
        }
        break;
    }
  });

  window.addEventListener('DOMContentLoaded', function () { startTranslation(); init(); });


  /* ---------------- SECTION H: Christian Life and Ministry Meeting Assignments (생활과 봉사 집회 임명) ---------------- */

  var DEFAULT_MWB_MEMBERS = [{"ko": "김재윤", "vi": "Thành Tín", "call": "anh Tín", "gender": "M", "roles": {"chairman": 0, "prayer": 1, "talk10": 0, "gems": 1, "reading": 1, "ministry": 1, "cbsCond": 0, "cbsRead": 0}, "spouse": "오호경"}, {"ko": "오호경", "vi": "Hồ Khánh", "call": "chị Khánh", "gender": "F", "roles": {"chairman": 0, "prayer": 0, "talk10": 0, "gems": 0, "reading": 0, "ministry": 1, "cbsCond": 0, "cbsRead": 0}, "spouse": "김재윤"}, {"ko": "김종배", "vi": "Pháp", "call": "anh Pháp", "gender": "M", "roles": {"chairman": 0, "prayer": 1, "talk10": 0, "gems": 1, "reading": 1, "ministry": 1, "cbsCond": 0, "cbsRead": 0}, "spouse": "최미순"}, {"ko": "최미순", "vi": "Mỹ Xuân", "call": "chị Xuân", "gender": "F", "roles": {"chairman": 0, "prayer": 0, "talk10": 0, "gems": 0, "reading": 0, "ministry": 1, "cbsCond": 0, "cbsRead": 0}, "spouse": "김종배"}, {"ko": "박정환", "vi": "Hiếu", "call": "anh Hiếu", "gender": "M", "roles": {"chairman": 0, "prayer": 1, "talk10": 0, "gems": 1, "reading": 1, "ministry": 1, "cbsCond": 0, "cbsRead": 0}, "spouse": "원혜진", "parentOf": ["박준우", "박유나"]}, {"ko": "원혜진", "vi": "Hiền", "call": "chị Hiền", "gender": "F", "roles": {"chairman": 0, "prayer": 0, "talk10": 0, "gems": 0, "reading": 0, "ministry": 1, "cbsCond": 0, "cbsRead": 0}, "spouse": "박정환", "parentOf": ["박준우", "박유나"]}, {"ko": "박유나", "vi": "Na", "call": "em Na", "gender": "F", "roles": {"chairman": 0, "prayer": 0, "talk10": 0, "gems": 0, "reading": 0, "ministry": 1, "cbsCond": 0, "cbsRead": 0}, "childOf": ["박정환", "원혜진"]}, {"ko": "박철현", "vi": "Trung Dũng", "call": "anh Dũng", "gender": "M", "roles": {"chairman": 0, "prayer": 1, "talk10": 0, "gems": 1, "reading": 1, "ministry": 1, "cbsCond": 0, "cbsRead": 0}}, {"ko": "송제홍", "vi": "Lý", "call": "anh Lý", "gender": "M", "roles": {"chairman": 0, "prayer": 1, "talk10": 0, "gems": 1, "reading": 1, "ministry": 1, "cbsCond": 0, "cbsRead": 0}, "spouse": "이서희"}, {"ko": "이서희", "vi": "Thụy Vy", "call": "chị Vy", "gender": "F", "roles": {"chairman": 0, "prayer": 0, "talk10": 0, "gems": 0, "reading": 0, "ministry": 1, "cbsCond": 0, "cbsRead": 0}, "spouse": "송제홍"}, {"ko": "이수연", "vi": "Xuyến", "call": "chị Xuyến", "gender": "F", "roles": {"chairman": 0, "prayer": 0, "talk10": 0, "gems": 0, "reading": 0, "ministry": 1, "cbsCond": 0, "cbsRead": 0}}, {"ko": "이종명", "vi": "Minh", "call": "anh Minh", "gender": "M", "roles": {"chairman": 0, "prayer": 1, "talk10": 0, "gems": 1, "reading": 1, "ministry": 1, "cbsCond": 0, "cbsRead": 0}, "spouse": "이주옥", "parentOf": ["이제희", "이제아"]}, {"ko": "이주옥", "vi": "Ngọc", "call": "chị Ngọc", "gender": "F", "roles": {"chairman": 0, "prayer": 0, "talk10": 0, "gems": 0, "reading": 0, "ministry": 1, "cbsCond": 0, "cbsRead": 0}, "spouse": "이종명", "parentOf": ["이제희", "이제아"]}, {"ko": "이제희", "vi": "Thiên Vui", "call": "em Vui", "gender": "F", "roles": {"chairman": 0, "prayer": 0, "talk10": 0, "gems": 0, "reading": 0, "ministry": 1, "cbsCond": 0, "cbsRead": 0}, "childOf": ["이종명", "이주옥"]}, {"ko": "이제아", "vi": "Thiên Nga", "call": "em Nga", "gender": "F", "roles": {"chairman": 0, "prayer": 0, "talk10": 0, "gems": 0, "reading": 0, "ministry": 1, "cbsCond": 0, "cbsRead": 0}, "childOf": ["이종명", "이주옥"]}, {"ko": "최영주", "vi": "Ánh Châu", "call": "chị Châu", "gender": "F", "roles": {"chairman": 0, "prayer": 0, "talk10": 0, "gems": 0, "reading": 0, "ministry": 1, "cbsCond": 0, "cbsRead": 0}}, {"ko": "한상현", "vi": "Huy", "call": "anh Huy", "gender": "M", "roles": {"chairman": 0, "prayer": 1, "talk10": 0, "gems": 1, "reading": 1, "ministry": 1, "cbsCond": 0, "cbsRead": 0}}, {"ko": "한도희", "vi": "Đạo", "call": "anh Đạo", "gender": "M", "roles": {"chairman": 0, "prayer": 1, "talk10": 0, "gems": 1, "reading": 1, "ministry": 1, "cbsCond": 0, "cbsRead": 0}, "spouse": "서주연", "parentOf": ["한정우"]}, {"ko": "서주연", "vi": "Quyên", "call": "chị Quyên", "gender": "F", "roles": {"chairman": 0, "prayer": 0, "talk10": 0, "gems": 0, "reading": 0, "ministry": 1, "cbsCond": 0, "cbsRead": 0}, "spouse": "한도희", "parentOf": ["한정우"]}, {"ko": "한정우", "vi": "Chinh Du", "call": "em Du", "gender": "M", "roles": {"chairman": 0, "prayer": 0, "talk10": 0, "gems": 0, "reading": 0, "ministry": 1, "cbsCond": 0, "cbsRead": 0}, "childOf": ["한도희", "서주연"]}, {"ko": "유계화", "vi": "Hoa", "call": "chị Hoa", "gender": "F", "roles": {"chairman": 0, "prayer": 0, "talk10": 0, "gems": 0, "reading": 0, "ministry": 1, "cbsCond": 0, "cbsRead": 0}}, {"ko": "최찬호", "vi": "Lam Phong", "call": "anh Phong", "gender": "M", "roles": {"chairman": 1, "prayer": 1, "talk10": 1, "gems": 1, "reading": 1, "ministry": 1, "cbsCond": 1, "cbsRead": 1}, "spouse": "이재순"}, {"ko": "이재순", "vi": "Mỹ Duyên", "call": "chị Duyên", "gender": "F", "roles": {"chairman": 0, "prayer": 0, "talk10": 0, "gems": 0, "reading": 0, "ministry": 1, "cbsCond": 0, "cbsRead": 0}, "spouse": "최찬호"}, {"ko": "김한빈", "vi": "Dương Bình", "call": "anh Bình", "gender": "M", "roles": {"chairman": 1, "prayer": 1, "talk10": 1, "gems": 1, "reading": 1, "ministry": 1, "cbsCond": 1, "cbsRead": 1}, "spouse": "김수민", "parentOf": ["김예나"]}, {"ko": "김수민", "vi": "Ngọc Bích", "call": "chị Bích", "gender": "F", "roles": {"chairman": 0, "prayer": 0, "talk10": 0, "gems": 0, "reading": 0, "ministry": 1, "cbsCond": 0, "cbsRead": 0}, "spouse": "김한빈", "parentOf": ["김예나"]}, {"ko": "김예나", "vi": "Trang Thanh", "call": "em Thanh", "gender": "F", "roles": {"chairman": 0, "prayer": 0, "talk10": 0, "gems": 0, "reading": 0, "ministry": 1, "cbsCond": 0, "cbsRead": 0}, "childOf": ["김한빈", "김수민"]}, {"ko": "김동주", "vi": "Minh Phước", "call": "anh Phước", "gender": "M", "roles": {"chairman": 0, "prayer": 1, "talk10": 0, "gems": 1, "reading": 1, "ministry": 1, "cbsCond": 0, "cbsRead": 0}}, {"ko": "쩐응옥마이", "vi": "Ngọc Mai", "call": "chị Mai", "gender": "F", "roles": {"chairman": 0, "prayer": 0, "talk10": 0, "gems": 0, "reading": 0, "ministry": 1, "cbsCond": 0, "cbsRead": 0}}, {"ko": "김소영", "vi": "Mỹ Tâm", "call": "chị Tâm", "gender": "F", "roles": {"chairman": 0, "prayer": 0, "talk10": 0, "gems": 0, "reading": 0, "ministry": 1, "cbsCond": 0, "cbsRead": 0}}, {"ko": "김종현", "vi": "Minh Trường", "call": "anh Trường", "gender": "M", "roles": {"chairman": 1, "prayer": 1, "talk10": 1, "gems": 1, "reading": 1, "ministry": 1, "cbsCond": 1, "cbsRead": 1}}, {"ko": "김영임", "vi": "Minh Thương", "call": "chị Thương", "gender": "F", "roles": {"chairman": 0, "prayer": 0, "talk10": 0, "gems": 0, "reading": 0, "ministry": 1, "cbsCond": 0, "cbsRead": 0}}, {"ko": "김대훈", "vi": "Huấn", "call": "anh Huấn", "gender": "M", "roles": {"chairman": 1, "prayer": 1, "talk10": 1, "gems": 1, "reading": 1, "ministry": 1, "cbsCond": 1, "cbsRead": 1}}, {"ko": "박준우", "vi": "Duy", "call": "anh Duy", "gender": "M", "roles": {"chairman": 1, "prayer": 1, "talk10": 1, "gems": 1, "reading": 1, "ministry": 1, "cbsCond": 1, "cbsRead": 1}, "childOf": ["박정환", "원혜진"]}];
  var DEFAULT_MWB_PROGRAMS = [{"meta": {"startDate": "2026-12-07", "endDate": "2026-12-13", "classDate": "2026-12-12", "weekNum": 7, "docid": "202026406"}, "date": {"vi": "NGÀY 7-13 THÁNG 12", "ko": "12월 7-13일"}, "reading": {"vi": "Ê-XÊ-CHI-ÊN 3, 4", "ko": "에스겔 3-4장"}, "songs": [71, 161, 7], "chairman": "김대훈 (Huấn, anh Huấn)", "opening_prayer": "박철현 (Trung Dũng, anh Dũng)", "closing_prayer": "한상현 (Huy, anh Huy)", "items": [{"num": 1, "section": 1, "title": {"vi": "Tại sao chúng ta dạn dĩ rao giảng?", "ko": "우리가 두려움 없이 전파하는 이유"}, "isStudent": false, "isCbs": false, "speaker": "김한빈 (Dương Bình, anh Bình)", "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 2, "section": 1, "title": {"vi": "Viên ngọc thiêng liêng", "ko": "영적 보물 찾기"}, "isStudent": false, "isCbs": false, "speaker": "최찬호 (Lam Phong, anh Phong)", "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 3, "section": 1, "title": {"vi": "Đọc Kinh Thánh", "ko": "성경 낭독"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "한도희 (Đạo, anh Đạo)", "assistant": null, "conductor": null, "reader": null}, {"num": 4, "section": 2, "title": {"vi": "Bắt đầu cuộc trò chuyện", "ko": "대화 시작하기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "김재윤 (Thành Tín, anh Tín)", "assistant": "오호경 (Hồ Khánh, chị Khánh)", "conductor": null, "reader": null}, {"num": 5, "section": 2, "title": {"vi": "Bắt đầu cuộc trò chuyện", "ko": "대화 시작하기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "김종배 (Pháp, anh Pháp)", "assistant": "최미순 (Mỹ Xuân, chị Xuân)", "conductor": null, "reader": null}, {"num": 6, "section": 2, "title": {"vi": "Đào tạo môn đồ", "ko": "제자가 되도록 돕기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "박정환 (Hiếu, anh Hiếu)", "assistant": "원혜진 (Hiền, chị Hiền)", "conductor": null, "reader": null}, {"num": 7, "section": 3, "title": {"vi": "Nhu cầu địa phương", "ko": "회중의 필요"}, "isStudent": false, "isCbs": false, "speaker": null, "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 8, "section": 3, "title": {"vi": "Phần học Kinh Thánh của hội thánh", "ko": "회중 성서 연구"}, "isStudent": false, "isCbs": true, "speaker": null, "assignee": null, "assistant": null, "conductor": "김종현 (Minh Trường, anh Trường)", "reader": "박준우 (Duy, anh Duy)"}]}, {"meta": {"startDate": "2026-12-14", "endDate": "2026-12-20", "classDate": "2026-12-19", "weekNum": 8, "docid": "202026407"}, "date": {"vi": "NGÀY 14-20 THÁNG 12", "ko": "12월 14-20일"}, "reading": {"vi": "Ê-XÊ-CHI-ÊN 5, 6", "ko": "에스겔 5-6장"}, "songs": [49, 153, 133], "chairman": "김한빈 (Dương Bình, anh Bình)", "opening_prayer": "최찬호 (Lam Phong, anh Phong)", "closing_prayer": "한도희 (Đạo, anh Đạo)", "items": [{"num": 1, "section": 1, "title": {"vi": "Những người thờ thần tượng khiến ‘lòng Đức Giê-hô-va đau đớn’", "ko": "우상 숭배는 여호와의 마음을 아프게 합니다"}, "isStudent": false, "isCbs": false, "speaker": "김대훈 (Huấn, anh Huấn)", "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 2, "section": 1, "title": {"vi": "Viên ngọc thiêng liêng", "ko": "영적 보물 찾기"}, "isStudent": false, "isCbs": false, "speaker": "이종명 (Minh, anh Minh)", "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 3, "section": 1, "title": {"vi": "Đọc Kinh Thánh", "ko": "성경 낭독"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "김동주 (Minh Phước, anh Phước)", "assistant": null, "conductor": null, "reader": null}, {"num": 4, "section": 2, "title": {"vi": "Bắt đầu cuộc trò chuyện", "ko": "대화 시작하기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "박유나 (Na, em Na)", "assistant": "이서희 (Thụy Vy, chị Vy)", "conductor": null, "reader": null}, {"num": 5, "section": 2, "title": {"vi": "Thăm lại", "ko": "관심이 자라도록 돕기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "송제홍 (Lý, anh Lý)", "assistant": "한정우 (Chinh Du, em Du)", "conductor": null, "reader": null}, {"num": 6, "section": 2, "title": {"vi": "Anh chị sẽ nói gì?", "ko": "뭐라고 말할 것입니까?"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "이수연 (Xuyến, chị Xuyến)", "assistant": "이주옥 (Ngọc, chị Ngọc)", "conductor": null, "reader": null}, {"num": 7, "section": 3, "title": {"vi": "Tại sao cần tránh tham gia các nghi lễ quốc gia?", "ko": "그리스도인이 애국 의식에 참여하지 않는 이유"}, "isStudent": false, "isCbs": false, "speaker": null, "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 8, "section": 3, "title": {"vi": "Phần học Kinh Thánh của hội thánh", "ko": "회중 성서 연구"}, "isStudent": false, "isCbs": true, "speaker": null, "assignee": null, "assistant": null, "conductor": "박준우 (Duy, anh Duy)", "reader": "김종현 (Minh Trường, anh Trường)"}]}, {"meta": {"startDate": "2026-12-21", "endDate": "2026-12-27", "classDate": "2026-12-26", "weekNum": 9, "docid": "202026408"}, "date": {"vi": "NGÀY 21-27 THÁNG 12", "ko": "12월 21-27일"}, "reading": {"vi": "Ê-XÊ-CHI-ÊN 7, 8", "ko": "에스겔 7-8장"}, "songs": [128, 139, 154], "chairman": "김종현 (Minh Trường, anh Trường)", "opening_prayer": "박정환 (Hiếu, anh Hiếu)", "closing_prayer": "이종명 (Minh, anh Minh)", "items": [{"num": 1, "section": 1, "title": {"vi": "Ngày của Đức Giê-hô-va sẽ đến vào đúng thời điểm", "ko": "여호와의 날은 정해진 때에 올 것입니다"}, "isStudent": false, "isCbs": false, "speaker": "박준우 (Duy, anh Duy)", "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 2, "section": 1, "title": {"vi": "Viên ngọc thiêng liêng", "ko": "영적 보물 찾기"}, "isStudent": false, "isCbs": false, "speaker": "김종배 (Pháp, anh Pháp)", "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 3, "section": 1, "title": {"vi": "Đọc Kinh Thánh", "ko": "성경 낭독"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "김재윤 (Thành Tín, anh Tín)", "assistant": null, "conductor": null, "reader": null}, {"num": 4, "section": 2, "title": {"vi": "Bắt đầu cuộc trò chuyện", "ko": "대화 시작하기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "이제희 (Thiên Vui, em Vui)", "assistant": "이제아 (Thiên Nga, em Nga)", "conductor": null, "reader": null}, {"num": 5, "section": 2, "title": {"vi": "Thăm lại", "ko": "관심이 자라도록 돕기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "최영주 (Ánh Châu, chị Châu)", "assistant": "서주연 (Quyên, chị Quyên)", "conductor": null, "reader": null}, {"num": 6, "section": 2, "title": {"vi": "Đào tạo môn đồ", "ko": "제자가 되도록 돕기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "유계화 (Hoa, chị Hoa)", "assistant": "이재순 (Mỹ Duyên, chị Duyên)", "conductor": null, "reader": null}, {"num": 7, "section": 3, "title": {"vi": "Nghĩ đến kết cuộc", "ko": "결과를 미리 생각해 보십시오"}, "isStudent": false, "isCbs": false, "speaker": null, "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 8, "section": 3, "title": {"vi": "Phần học Kinh Thánh của hội thánh", "ko": "회중 성서 연구"}, "isStudent": false, "isCbs": true, "speaker": null, "assignee": null, "assistant": null, "conductor": "김대훈 (Huấn, anh Huấn)", "reader": "김한빈 (Dương Bình, anh Bình)"}]}, {"meta": {"startDate": "2026-12-28", "endDate": "2027-01-03", "classDate": "2027-01-02", "weekNum": 10, "docid": "202026409"}, "date": {"vi": "NGÀY 28 THÁNG 12 NĂM 2026–NGÀY 3 THÁNG 1 NĂM 2027", "ko": "2026년 12월 28일–2027년 1월 3일"}, "reading": {"vi": "Ê-XÊ-CHI-ÊN 9, 10", "ko": "에스겔 9-10장"}, "songs": [119, 60, 135], "chairman": "최찬호 (Lam Phong, anh Phong)", "opening_prayer": "김동주 (Minh Phước, anh Phước)", "closing_prayer": "송제홍 (Lý, anh Lý)", "items": [{"num": 1, "section": 1, "title": {"vi": "Giúp người khác sống sót qua Ha-ma-ghê-đôn", "ko": "다른 사람들이 아마겟돈에서 생존하도록 도우십시오"}, "isStudent": false, "isCbs": false, "speaker": "김종현 (Minh Trường, anh Trường)", "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 2, "section": 1, "title": {"vi": "Viên ngọc thiêng liêng", "ko": "영적 보물 찾기"}, "isStudent": false, "isCbs": false, "speaker": "박철현 (Trung Dũng, anh Dũng)", "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 3, "section": 1, "title": {"vi": "Đọc Kinh Thánh", "ko": "성경 낭독"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "한상현 (Huy, anh Huy)", "assistant": null, "conductor": null, "reader": null}, {"num": 4, "section": 2, "title": {"vi": "Bắt đầu cuộc trò chuyện", "ko": "대화 시작하기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "김수민 (Ngọc Bích, chị Bích)", "assistant": "김예나 (Trang Thanh, em Thanh)", "conductor": null, "reader": null}, {"num": 5, "section": 2, "title": {"vi": "Thăm lại", "ko": "관심이 자라도록 돕기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "쩐응옥마이 (Ngọc Mai, chị Mai)", "assistant": "김소영 (Mỹ Tâm, chị Tâm)", "conductor": null, "reader": null}, {"num": 6, "section": 2, "title": {"vi": "Giải thích niềm tin", "ko": "우리의 신앙 설명하기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "김영임 (Minh Thương, chị Thương)", "assistant": "오호경 (Hồ Khánh, chị Khánh)", "conductor": null, "reader": null}, {"num": 7, "section": 3, "title": {"vi": "Cứu chính mình và những người lắng nghe mình", "ko": "우리 자신과 우리의 소식을 듣는 사람들을 구원하는 방법"}, "isStudent": false, "isCbs": false, "speaker": null, "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 8, "section": 3, "title": {"vi": "Phần học Kinh Thánh của hội thánh", "ko": "회중 성서 연구"}, "isStudent": false, "isCbs": true, "speaker": null, "assignee": null, "assistant": null, "conductor": "김한빈 (Dương Bình, anh Bình)", "reader": "김대훈 (Huấn, anh Huấn)"}]}, {"meta": {"startDate": "2027-01-04", "endDate": "2027-01-10", "classDate": "2027-01-09", "weekNum": 11, "docid": "202027001"}, "date": {"vi": "NGÀY 4-10 THÁNG 1", "ko": "1월 4-10일"}, "reading": {"vi": "Ê-XÊ-CHI-ÊN 11, 12", "ko": "에스겔 11-12장"}, "songs": [83, 2, 164], "chairman": "박준우 (Duy, anh Duy)", "opening_prayer": "김재윤 (Thành Tín, anh Tín)", "closing_prayer": "박정환 (Hiếu, anh Hiếu)", "items": [{"num": 1, "section": 1, "title": {"vi": "“Biết đâu chúng sẽ để ý”", "ko": "‘그들이 혹시 유의해서 볼지도 모른다’"}, "isStudent": false, "isCbs": false, "speaker": "최찬호 (Lam Phong, anh Phong)", "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 2, "section": 1, "title": {"vi": "Viên ngọc thiêng liêng", "ko": "영적 보물 찾기"}, "isStudent": false, "isCbs": false, "speaker": "한도희 (Đạo, anh Đạo)", "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 3, "section": 1, "title": {"vi": "Đọc Kinh Thánh", "ko": "성경 낭독"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "김종배 (Pháp, anh Pháp)", "assistant": null, "conductor": null, "reader": null}, {"num": 4, "section": 2, "title": {"vi": "Thăm lại", "ko": "관심이 자라도록 돕기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "최미순 (Mỹ Xuân, chị Xuân)", "assistant": "원혜진 (Hiền, chị Hiền)", "conductor": null, "reader": null}, {"num": 5, "section": 2, "title": {"vi": "Thăm lại", "ko": "관심이 자라도록 돕기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "박유나 (Na, em Na)", "assistant": "이수연 (Xuyến, chị Xuyến)", "conductor": null, "reader": null}, {"num": 6, "section": 2, "title": {"vi": "Anh chị sẽ nói gì?", "ko": "뭐라고 말할 것입니까?"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "이서희 (Thụy Vy, chị Vy)", "assistant": "이주옥 (Ngọc, chị Ngọc)", "conductor": null, "reader": null}, {"num": 7, "section": 3, "title": {"vi": "Nhu cầu địa phương", "ko": "회중의 필요"}, "isStudent": false, "isCbs": false, "speaker": null, "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 8, "section": 3, "title": {"vi": "Phần học Kinh Thánh của hội thánh", "ko": "회중 성서 연구"}, "isStudent": false, "isCbs": true, "speaker": null, "assignee": null, "assistant": null, "conductor": "김대훈 (Huấn, anh Huấn)", "reader": "김한빈 (Dương Bình, anh Bình)"}]}, {"meta": {"startDate": "2027-01-11", "endDate": "2027-01-17", "classDate": "2027-01-16", "weekNum": 12, "docid": "202027002"}, "date": {"vi": "NGÀY 11-17 THÁNG 1", "ko": "1월 11-17일"}, "reading": {"vi": "Ê-XÊ-CHI-ÊN 13, 14", "ko": "에스겔 13-14장"}, "songs": [39, 56, 98], "chairman": "김종현 (Minh Trường, anh Trường)", "opening_prayer": "김동주 (Minh Phước, anh Phước)", "closing_prayer": "송제홍 (Lý, anh Lý)", "items": [{"num": 1, "section": 1, "title": {"vi": "Đức Giê-hô-va vui khi anh chị làm điều đúng", "ko": "여호와께서는 옳은 일을 하려는 우리의 노력을 소중히 여기십니다"}, "isStudent": false, "isCbs": false, "speaker": "박준우 (Duy, anh Duy)", "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 2, "section": 1, "title": {"vi": "Viên ngọc thiêng liêng", "ko": "영적 보물 찾기"}, "isStudent": false, "isCbs": false, "speaker": "한상현 (Huy, anh Huy)", "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 3, "section": 1, "title": {"vi": "Đọc Kinh Thánh", "ko": "성경 낭독"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "박철현 (Trung Dũng, anh Dũng)", "assistant": null, "conductor": null, "reader": null}, {"num": 4, "section": 2, "title": {"vi": "Bắt đầu cuộc trò chuyện", "ko": "대화 시작하기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "이제희 (Thiên Vui, em Vui)", "assistant": "최영주 (Ánh Châu, chị Châu)", "conductor": null, "reader": null}, {"num": 5, "section": 2, "title": {"vi": "Thăm lại", "ko": "관심이 자라도록 돕기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "이제아 (Thiên Nga, em Nga)", "assistant": "서주연 (Quyên, chị Quyên)", "conductor": null, "reader": null}, {"num": 6, "section": 2, "title": {"vi": "Giải thích niềm tin", "ko": "우리의 신앙 설명하기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "한정우 (Chinh Du, em Du)", "assistant": "이종명 (Minh, anh Minh)", "conductor": null, "reader": null}, {"num": 7, "section": 3, "title": {"vi": "Hãy củng cố niềm tin chắc nơi những điều mình tin khi còn trẻ", "ko": "어릴 때부터 이 길이 옳다는 확신을 기르십시오"}, "isStudent": false, "isCbs": false, "speaker": null, "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 8, "section": 3, "title": {"vi": "Phần học Kinh Thánh của hội thánh", "ko": "회중 성서 연구"}, "isStudent": false, "isCbs": true, "speaker": null, "assignee": null, "assistant": null, "conductor": "최찬호 (Lam Phong, anh Phong)", "reader": "김대훈 (Huấn, anh Huấn)"}]}, {"meta": {"startDate": "2027-01-18", "endDate": "2027-01-24", "classDate": "2027-01-23", "weekNum": 13, "docid": "202027003"}, "date": {"vi": "NGÀY 18-24 THÁNG 1", "ko": "1월 18-24일"}, "reading": {"vi": "Ê-XÊ-CHI-ÊN 15, 16", "ko": "에스겔 15-16장"}, "songs": [130, 58, 159], "chairman": "김한빈 (Dương Bình, anh Bình)", "opening_prayer": "김종배 (Pháp, anh Pháp)", "closing_prayer": "한도희 (Đạo, anh Đạo)", "items": [{"num": 1, "section": 1, "title": {"vi": "“Ta sẽ… không cảm thấy bị xúc phạm nữa”", "ko": "“내가 다시는 노하지 않을 것이다”"}, "isStudent": false, "isCbs": false, "speaker": "김종현 (Minh Trường, anh Trường)", "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 2, "section": 1, "title": {"vi": "Viên ngọc thiêng liêng", "ko": "영적 보물 찾기"}, "isStudent": false, "isCbs": false, "speaker": "김재윤 (Thành Tín, anh Tín)", "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 3, "section": 1, "title": {"vi": "Đọc Kinh Thánh", "ko": "성경 낭독"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "박정환 (Hiếu, anh Hiếu)", "assistant": null, "conductor": null, "reader": null}, {"num": 4, "section": 2, "title": {"vi": "Bắt đầu cuộc trò chuyện", "ko": "대화 시작하기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "유계화 (Hoa, chị Hoa)", "assistant": "김수민 (Ngọc Bích, chị Bích)", "conductor": null, "reader": null}, {"num": 5, "section": 2, "title": {"vi": "Thăm lại", "ko": "관심이 자라도록 돕기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "이재순 (Mỹ Duyên, chị Duyên)", "assistant": "김예나 (Trang Thanh, em Thanh)", "conductor": null, "reader": null}, {"num": 6, "section": 2, "title": {"vi": "Giải thích niềm tin", "ko": "우리의 신앙 설명하기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "쩐응옥마이 (Ngọc Mai, chị Mai)", "assistant": "김영임 (Minh Thương, chị Thương)", "conductor": null, "reader": null}, {"num": 7, "section": 3, "title": {"vi": "Đừng quên trở lại", "ko": "잊지 말고 다시 찾아가십시오"}, "isStudent": false, "isCbs": false, "speaker": null, "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 8, "section": 3, "title": {"vi": "Phần học Kinh Thánh của hội thánh", "ko": "회중 성서 연구"}, "isStudent": false, "isCbs": true, "speaker": null, "assignee": null, "assistant": null, "conductor": "박준우 (Duy, anh Duy)", "reader": "최찬호 (Lam Phong, anh Phong)"}]}, {"meta": {"startDate": "2027-01-25", "endDate": "2027-01-31", "classDate": "2027-01-30", "weekNum": 14, "docid": "202027004"}, "date": {"vi": "NGÀY 25-31 THÁNG 1", "ko": "1월 25-31일"}, "reading": {"vi": "Ê-XÊ-CHI-ÊN 17, 18", "ko": "에스겔 17-18장"}, "songs": [30, 3, 94], "chairman": "김대훈 (Huấn, anh Huấn)", "opening_prayer": "박철현 (Trung Dũng, anh Dũng)", "closing_prayer": "한상현 (Huy, anh Huy)", "items": [{"num": 1, "section": 1, "title": {"vi": "Chúng ta chịu trách nhiệm trước mặt Đức Giê-hô-va về hành động của mình", "ko": "우리는 자신의 행동에 대해 여호와께 책임을 져야 합니다"}, "isStudent": false, "isCbs": false, "speaker": "김한빈 (Dương Bình, anh Bình)", "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 2, "section": 1, "title": {"vi": "Viên ngọc thiêng liêng", "ko": "영적 보물 찾기"}, "isStudent": false, "isCbs": false, "speaker": "김동주 (Minh Phước, anh Phước)", "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 3, "section": 1, "title": {"vi": "Đọc Kinh Thánh", "ko": "성경 낭독"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "이종명 (Minh, anh Minh)", "assistant": null, "conductor": null, "reader": null}, {"num": 4, "section": 2, "title": {"vi": "Đào tạo môn đồ", "ko": "제자가 되도록 돕기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "김소영 (Mỹ Tâm, chị Tâm)", "assistant": "오호경 (Hồ Khánh, chị Khánh)", "conductor": null, "reader": null}, {"num": 5, "section": 2, "title": {"vi": "Đào tạo môn đồ", "ko": "제자가 되도록 돕기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "최미순 (Mỹ Xuân, chị Xuân)", "assistant": "박유나 (Na, em Na)", "conductor": null, "reader": null}, {"num": 6, "section": 2, "title": {"vi": "Đào tạo môn đồ", "ko": "제자가 되도록 돕기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "원혜진 (Hiền, chị Hiền)", "assistant": "이서희 (Thụy Vy, chị Vy)", "conductor": null, "reader": null}, {"num": 7, "section": 2, "title": {"vi": "Đào tạo môn đồ", "ko": "제자가 되도록 돕기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "이수연 (Xuyến, chị Xuyến)", "assistant": "이제희 (Thiên Vui, em Vui)", "conductor": null, "reader": null}, {"num": 8, "section": 3, "title": {"vi": "Nương cậy Đức Giê-hô-va khi đương đầu với vấn đề sức khỏe", "ko": "건강 문제가 있을 때 여호와를 의지하십시오"}, "isStudent": false, "isCbs": false, "speaker": null, "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 9, "section": 3, "title": {"vi": "Phần học Kinh Thánh của hội thánh", "ko": "회중 성서 연구"}, "isStudent": false, "isCbs": true, "speaker": null, "assignee": null, "assistant": null, "conductor": "김종현 (Minh Trường, anh Trường)", "reader": "박준우 (Duy, anh Duy)"}]}, {"meta": {"startDate": "2027-02-01", "endDate": "2027-02-07", "classDate": "2027-02-06", "weekNum": 15, "docid": "202027005"}, "date": {"vi": "NGÀY 1-7 THÁNG 2", "ko": "2월 1-7일"}, "reading": {"vi": "Ê-XÊ-CHI-ÊN 19, 20", "ko": "에스겔 19-20장"}, "songs": [11, 76, 128], "chairman": "최찬호 (Lam Phong, anh Phong)", "opening_prayer": "김종배 (Pháp, anh Pháp)", "closing_prayer": "김재윤 (Thành Tín, anh Tín)", "items": [{"num": 1, "section": 1, "title": {"vi": "‘Ta hành động vì cớ danh ta’", "ko": "“나는 내 이름을 위해 행동하였다”"}, "isStudent": false, "isCbs": false, "speaker": "김대훈 (Huấn, anh Huấn)", "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 2, "section": 1, "title": {"vi": "Viên ngọc thiêng liêng", "ko": "영적 보물 찾기"}, "isStudent": false, "isCbs": false, "speaker": "송제홍 (Lý, anh Lý)", "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 3, "section": 1, "title": {"vi": "Đọc Kinh Thánh", "ko": "성경 낭독"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "한도희 (Đạo, anh Đạo)", "assistant": null, "conductor": null, "reader": null}, {"num": 4, "section": 2, "title": {"vi": "Anh chị sẽ nói gì?", "ko": "뭐라고 말할 것입니까?"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "이주옥 (Ngọc, chị Ngọc)", "assistant": "이제아 (Thiên Nga, em Nga)", "conductor": null, "reader": null}, {"num": 5, "section": 2, "title": {"vi": "Thăm lại", "ko": "관심이 자라도록 돕기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "최영주 (Ánh Châu, chị Châu)", "assistant": "유계화 (Hoa, chị Hoa)", "conductor": null, "reader": null}, {"num": 6, "section": 2, "title": {"vi": "Bài giảng", "ko": "연설"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "한정우 (Chinh Du, em Du)", "assistant": null, "conductor": null, "reader": null}, {"num": 7, "section": 3, "title": {"vi": "Làm thế nào để duy trì lòng sốt sắng trong thánh chức?", "ko": "봉사의 직무에 대한 열심을 유지하는 방법"}, "isStudent": false, "isCbs": false, "speaker": null, "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 8, "section": 3, "title": {"vi": "Phần học Kinh Thánh của hội thánh", "ko": "회중 성서 연구"}, "isStudent": false, "isCbs": true, "speaker": null, "assignee": null, "assistant": null, "conductor": "김한빈 (Dương Bình, anh Bình)", "reader": "김종현 (Minh Trường, anh Trường)"}]}, {"meta": {"startDate": "2027-02-08", "endDate": "2027-02-14", "classDate": "2027-02-13", "weekNum": null, "docid": "202027006", "note": "2027-02-13 휴강 (왕국전도학교)"}, "date": {"vi": "NGÀY 8-14 THÁNG 2", "ko": "2월 8-14일"}, "reading": {"vi": "Ê-XÊ-CHI-ÊN 21, 22", "ko": "에스겔 21-22장"}, "songs": [122, 104, 114], "chairman": "박준우 (Duy, anh Duy)", "opening_prayer": "이종명 (Minh, anh Minh)", "closing_prayer": "박철현 (Trung Dũng, anh Dũng)", "items": [{"num": 1, "section": 1, "title": {"vi": "Giữ thanh sạch về đạo đức trong một thế gian bại hoại", "ko": "도덕적으로 타락한 세상에서 깨끗한 상태를 유지하십시오"}, "isStudent": false, "isCbs": false, "speaker": "최찬호 (Lam Phong, anh Phong)", "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 2, "section": 1, "title": {"vi": "Viên ngọc thiêng liêng", "ko": "영적 보물 찾기"}, "isStudent": false, "isCbs": false, "speaker": "박정환 (Hiếu, anh Hiếu)", "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 3, "section": 1, "title": {"vi": "Đọc Kinh Thánh", "ko": "성경 낭독"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "송제홍 (Lý, anh Lý)", "assistant": null, "conductor": null, "reader": null}, {"num": 4, "section": 2, "title": {"vi": "Bắt đầu cuộc trò chuyện", "ko": "대화 시작하기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "서주연 (Quyên, chị Quyên)", "assistant": "이재순 (Mỹ Duyên, chị Duyên)", "conductor": null, "reader": null}, {"num": 5, "section": 2, "title": {"vi": "Thăm lại", "ko": "관심이 자라도록 돕기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "김수민 (Ngọc Bích, chị Bích)", "assistant": "쩐응옥마이 (Ngọc Mai, chị Mai)", "conductor": null, "reader": null}, {"num": 6, "section": 2, "title": {"vi": "Giải thích niềm tin", "ko": "우리의 신앙 설명하기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "김예나 (Trang Thanh, em Thanh)", "assistant": "김소영 (Mỹ Tâm, chị Tâm)", "conductor": null, "reader": null}, {"num": 7, "section": 3, "title": {"vi": "Đừng để bất cứ điều gì cản trở anh chị phụng sự Đức Giê-hô-va với lương tâm trong sạch", "ko": "깨끗한 양심으로 여호와를 섬기십시오"}, "isStudent": false, "isCbs": false, "speaker": null, "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 8, "section": 3, "title": {"vi": "Phần học Kinh Thánh của hội thánh", "ko": "회중 성서 연구"}, "isStudent": false, "isCbs": true, "speaker": null, "assignee": null, "assistant": null, "conductor": "김대훈 (Huấn, anh Huấn)", "reader": "김한빈 (Dương Bình, anh Bình)"}]}, {"meta": {"startDate": "2027-02-15", "endDate": "2027-02-21", "classDate": "2027-02-20", "weekNum": 16, "docid": "202027007", "note": "2027-02-20 졸업식"}, "date": {"vi": "NGÀY 15-21 THÁNG 2", "ko": "2월 15-21일"}, "reading": {"vi": "Ê-XÊ-CHI-ÊN 23, 24", "ko": "에스겔 23-24장"}, "songs": [49, 73, 124], "chairman": "김종현 (Minh Trường, anh Trường)", "opening_prayer": "한도희 (Đạo, anh Đạo)", "closing_prayer": "김종배 (Pháp, anh Pháp)", "items": [{"num": 1, "section": 1, "title": {"vi": "Học từ minh họa về Ô-hô-la và Ô-hô-li-ba", "ko": "오홀라와 오홀리바의 비유에서 배울 수 있는 교훈"}, "isStudent": false, "isCbs": false, "speaker": "박준우 (Duy, anh Duy)", "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 2, "section": 1, "title": {"vi": "Viên ngọc thiêng liêng", "ko": "영적 보물 찾기"}, "isStudent": false, "isCbs": false, "speaker": "한상현 (Huy, anh Huy)", "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 3, "section": 1, "title": {"vi": "Đọc Kinh Thánh", "ko": "성경 낭독"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "김동주 (Minh Phước, anh Phước)", "assistant": null, "conductor": null, "reader": null}, {"num": 4, "section": 2, "title": {"vi": "Bắt đầu cuộc trò chuyện", "ko": "대화 시작하기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "김영임 (Minh Thương, chị Thương)", "assistant": "최미순 (Mỹ Xuân, chị Xuân)", "conductor": null, "reader": null}, {"num": 5, "section": 2, "title": {"vi": "Thăm lại", "ko": "관심이 자라도록 돕기"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "한정우 (Chinh Du, em Du)", "assistant": "서주연 (Quyên, chị Quyên)", "conductor": null, "reader": null}, {"num": 6, "section": 2, "title": {"vi": "Bài giảng", "ko": "연설"}, "isStudent": true, "isCbs": false, "speaker": null, "assignee": "김재윤 (Thành Tín, anh Tín)", "assistant": null, "conductor": null, "reader": null}, {"num": 7, "section": 3, "title": {"vi": "Báo cáo công tác hằng năm", "ko": "연례 봉사 보고"}, "isStudent": false, "isCbs": false, "speaker": null, "assignee": null, "assistant": null, "conductor": null, "reader": null}, {"num": 8, "section": 3, "title": {"vi": "Phần học Kinh Thánh của hội thánh", "ko": "회중 성서 연구"}, "isStudent": false, "isCbs": true, "speaker": null, "assignee": null, "assistant": null, "conductor": "최찬호 (Lam Phong, anh Phong)", "reader": "김대훈 (Huấn, anh Huấn)"}]}];

  function getMwbPrograms() {
    return (typeof window !== 'undefined' && window.JEONJU_MWB_PROGRAMS && window.JEONJU_MWB_PROGRAMS.length)
      ? window.JEONJU_MWB_PROGRAMS
      : DEFAULT_MWB_PROGRAMS;
  }

  function getMwbRoster() {
    try {
      var raw = localStorage.getItem('jeonju_mwb_roster');
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch(e) {}
    return JSON.parse(JSON.stringify(DEFAULT_MWB_MEMBERS));
  }

  function saveMwbRoster(list) {
    try {
      localStorage.setItem('jeonju_mwb_roster', JSON.stringify(list));
    } catch(e) {}
  }

  function getMwbAssignmentsMap() {
    try {
      var raw = localStorage.getItem('jeonju_mwb_assignments');
      return raw ? JSON.parse(raw) : {};
    } catch(e) { return {}; }
  }

  function saveMwbAssignmentsMap(map) {
    try {
      localStorage.setItem('jeonju_mwb_assignments', JSON.stringify(map));
    } catch(e) {}
  }

  function formatMember(m) {
    if (!m) return '';
    return m.ko + ' (' + m.vi + ', ' + m.call + ')';
  }

  function canPairMembers(m1, m2) {
    if (!m1 || !m2 || m1.ko === m2.ko) return false;
    if (m1.gender === m2.gender) return true;
    if (m1.spouse === m2.ko || m2.spouse === m1.ko) return true;
    if ((m1.parentOf || []).indexOf(m2.ko) >= 0 || (m2.parentOf || []).indexOf(m1.ko) >= 0) return true;
    if ((m1.childOf || []).indexOf(m2.ko) >= 0 || (m2.childOf || []).indexOf(m1.ko) >= 0) return true;
    return false;
  }

  function executeAutoAssignment() {
    var roster = getMwbRoster();
    var programs = getMwbPrograms();
    var counts = {};
    var roleCounts = {};
    var usedPairs = {};

    roster.forEach(function (m) {
      counts[m.ko] = 0;
      roleCounts[m.ko] = {};
    });

    var assignments = getMwbAssignmentsMap();

    programs.forEach(function (prog) {
      var meta = prog.meta || {};
      var sDate = meta.startDate;
      var weekAssigned = {};

      function pickCandidate(candList, roleName) {
        var available = candList.filter(function (c) { return !weekAssigned[c.ko]; });
        if (!available.length) available = candList.slice();
        available.sort(function (a, b) {
          var ca = counts[a.ko] || 0;
          var cb = counts[b.ko] || 0;
          if (ca !== cb) return ca - cb;
          var rca = (roleCounts[a.ko] && roleCounts[a.ko][roleName]) || 0;
          var rcb = (roleCounts[b.ko] && roleCounts[b.ko][roleName]) || 0;
          return rca - rcb;
        });
        var chosen = available[0];
        if (chosen) {
          weekAssigned[chosen.ko] = true;
          counts[chosen.ko] = (counts[chosen.ko] || 0) + 1;
          roleCounts[chosen.ko][roleName] = ((roleCounts[chosen.ko] && roleCounts[chosen.ko][roleName]) || 0) + 1;
        }
        return chosen;
      }

      // 1. Chairman
      var chairCands = roster.filter(function (m) { return m.roles && m.roles.chairman; });
      var chosenChair = pickCandidate(chairCands, 'chairman');
      if (chosenChair) assignments[sDate + '-chairman'] = formatMember(chosenChair);

      // 2. 10-min Talk (Item 1)
      var talkCands = roster.filter(function (m) { return m.roles && m.roles.talk10; });
      var chosenTalk = pickCandidate(talkCands, 'talk10');
      if (chosenTalk) assignments[sDate + '-item-1-speaker'] = formatMember(chosenTalk);

      // 3. CBS Conductor
      var cbsCondCands = roster.filter(function (m) { return m.roles && m.roles.cbsCond; });
      var chosenCbsCond = pickCandidate(cbsCondCands, 'cbsCond');
      if (chosenCbsCond) assignments[sDate + '-cbs-conductor'] = formatMember(chosenCbsCond);

      // 4. CBS Reader
      var cbsReadCands = roster.filter(function (m) { return m.roles && m.roles.cbsRead; });
      var chosenCbsRead = pickCandidate(cbsReadCands, 'cbsRead');
      if (chosenCbsRead) assignments[sDate + '-cbs-reader'] = formatMember(chosenCbsRead);

      // 5. Gems (Item 2)
      var gemsCands = roster.filter(function (m) { return m.roles && m.roles.gems; });
      var chosenGems = pickCandidate(gemsCands, 'gems');
      if (chosenGems) assignments[sDate + '-item-2-speaker'] = formatMember(chosenGems);

      // 6. Bible Reading (Item 3)
      var readingCands = roster.filter(function (m) { return m.roles && m.roles.reading; });
      var chosenReading = pickCandidate(readingCands, 'reading');
      if (chosenReading) assignments[sDate + '-item-3-student'] = formatMember(chosenReading);

      // 7. Ministry items (Section 2)
      (prog.items || []).forEach(function (it) {
        if (it.section === 2) {
          var tKo = (it.title && it.title.ko) || '';
          var tVi = (it.title && it.title.vi) || '';
          var isTalk = (tKo.indexOf('연설') >= 0 || tVi.indexOf('Bài giảng') >= 0);
          if (isTalk) {
            var brotherCands = roster.filter(function (m) { return m.gender === 'M'; });
            var sp = pickCandidate(brotherCands, 'ministry_talk');
            if (sp) assignments[sDate + '-item-' + it.num + '-student'] = formatMember(sp);
          } else {
            var ministryCands = roster.filter(function (m) { return m.roles && m.roles.ministry; });
            var st = pickCandidate(ministryCands, 'ministry');
            if (st) {
              assignments[sDate + '-item-' + it.num + '-student'] = formatMember(st);

              var availAssts = roster.filter(function (m) {
                return !weekAssigned[m.ko] && canPairMembers(st, m);
              });
              if (!availAssts.length) {
                availAssts = roster.filter(function (m) {
                  return m.ko !== st.ko && canPairMembers(st, m);
                });
              }

              availAssts.sort(function (a, b) {
                var pKeyA = [st.ko, a.ko].sort().join(':');
                var pKeyB = [st.ko, b.ko].sort().join(':');
                var usedA = usedPairs[pKeyA] ? 1 : 0;
                var usedB = usedPairs[pKeyB] ? 1 : 0;
                if (usedA !== usedB) return usedA - usedB;
                var ca = counts[a.ko] || 0;
                var cb = counts[b.ko] || 0;
                return ca - cb;
              });

              var asst = availAssts[0];
              if (asst) {
                weekAssigned[asst.ko] = true;
                counts[asst.ko] = (counts[asst.ko] || 0) + 1;
                roleCounts[asst.ko]['ministry'] = ((roleCounts[asst.ko] && roleCounts[asst.ko]['ministry']) || 0) + 1;
                usedPairs[[st.ko, asst.ko].sort().join(':')] = true;
                assignments[sDate + '-item-' + it.num + '-assistant'] = formatMember(asst);
              }
            }
          }
        }
      });

      // 8. Opening Prayer
      var prayerCands = roster.filter(function (m) { return m.roles && m.roles.prayer; });
      var chosenOpenPrayer = pickCandidate(prayerCands, 'prayer');
      if (chosenOpenPrayer) assignments[sDate + '-open-prayer'] = formatMember(chosenOpenPrayer);

      // 9. Closing Prayer
      var chosenClosePrayer = pickCandidate(prayerCands, 'prayer');
      if (chosenClosePrayer) assignments[sDate + '-close-prayer'] = formatMember(chosenClosePrayer);
    });

    saveMwbAssignmentsMap(assignments);
    return counts;
  }

  function renderMwb(c) {
    if (!state.mwbSubTab) state.mwbSubTab = 'schedule';
    var roster = getMwbRoster();
    var programs = getMwbPrograms();
    var assignments = getMwbAssignmentsMap();

    // Calculate participation stats
    var memberCounts = {};
    roster.forEach(function (m) { memberCounts[m.ko] = 0; });
    Object.keys(assignments).forEach(function (k) {
      var val = assignments[k] || '';
      roster.forEach(function (m) {
        if (val.indexOf(m.ko) >= 0) memberCounts[m.ko] = (memberCounts[m.ko] || 0) + 1;
      });
    });

    var subTabNav = '<div style="display:flex;gap:8px;margin-bottom:14px;">' +
      '<button type="button" class="btn ' + (state.mwbSubTab === 'schedule' ? 'btn-primary' : 'btn-secondary') + '" data-act="mwb-subtab" data-subtab="schedule">📅 주차별 배정표 (11주간)</button>' +
      '<button type="button" class="btn ' + (state.mwbSubTab === 'roster' ? 'btn-primary' : 'btn-secondary') + '" data-act="mwb-subtab" data-subtab="roster">👥 성원 명단 및 역할 자격 (' + roster.length + '명)</button>' +
      '<button type="button" class="btn btn-primary" data-act="mwb-auto-assign" style="margin-left:auto;background:#059669;border-color:#059669;color:#fff;font-weight:700;">⚡ 자동 배정 실행 (Auto-Assign)</button>' +
      '</div>';

    var headerCard = '<div class="card">' +
      '<div class="card-title" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">' +
      '<span>📖 그리스도인 생활과 봉사 집회 임명 관리 (Lối sống và thánh chức)</span>' +
      '<span class="tag tag-active" style="background:#e0f2fe;color:#0369a1;font-weight:600;">2026-12-07 ~ 2027-02-15 (11주간)</span>' +
      '</div>' +
      '<p class="help-text" style="margin-bottom:12px;">동일 주간 중복 임명 금지(1인 1임명 우선), 2인 짝 과제 파트너 순환, 가족 짝 규칙(부부·부모자녀 첫방문 가능, 그 외 동성 짝) 및 전체 성원 공평 분배 알고리즘이 적용됩니다.</p>' +
      subTabNav +
      '</div>';

    if (state.mwbSubTab === 'roster') {
      var rosterHtml = renderMwbRosterTab(roster, memberCounts);
      c.innerHTML = headerCard + rosterHtml;
    } else {
      var scheduleHtml = renderMwbScheduleTab(programs, roster, assignments, memberCounts);
      c.innerHTML = headerCard + scheduleHtml;
    }
  }

  function renderMwbRosterTab(roster, counts) {
    var editIdx = state.mwbEditingIdx;
    var formHtml = '';
    if (state.mwbShowAdd || editIdx !== undefined) {
      var mem = (editIdx !== undefined && roster[editIdx]) ? roster[editIdx] : { ko: '', vi: '', call: 'anh', gender: 'M', roles: { ministry: 1 } };
      formHtml = '<div class="card" style="border:2px solid var(--primary);background:#f8fafc;margin-bottom:16px;">' +
        '<div class="card-title">' + (editIdx !== undefined ? '성원 정보 수정' : '신규 성원 추가') + '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-bottom:12px;">' +
        '<div><label style="font-size:12px;font-weight:600;">한국어 성명</label><input type="text" id="mwb-in-ko" class="form-control" value="' + esc(mem.ko) + '"></div>' +
        '<div><label style="font-size:12px;font-weight:600;">베트남어 이름</label><input type="text" id="mwb-in-vi" class="form-control" value="' + esc(mem.vi) + '"></div>' +
        '<div><label style="font-size:12px;font-weight:600;">호칭 (anh/chị/em)</label><input type="text" id="mwb-in-call" class="form-control" value="' + esc(mem.call) + '"></div>' +
        '<div><label style="font-size:12px;font-weight:600;">성별</label><select id="mwb-in-gender" class="form-control"><option value="M"' + (mem.gender === 'M' ? ' selected' : '') + '>형제 (M)</option><option value="F"' + (mem.gender === 'F' ? ' selected' : '') + '>자매 (F)</option></select></div>' +
        '<div><label style="font-size:12px;font-weight:600;">배우자 성명 (선택)</label><input type="text" id="mwb-in-spouse" class="form-control" value="' + esc(mem.spouse || '') + '"></div>' +
        '<div><label style="font-size:12px;font-weight:600;">자녀 성명 (쉼표 구분)</label><input type="text" id="mwb-in-parentOf" class="form-control" value="' + esc((mem.parentOf || []).join(',')) + '"></div>' +
        '</div>' +
        '<div style="display:flex;gap:8px;">' +
        '<button type="button" class="btn btn-primary" data-act="mwb-save-member" data-idx="' + (editIdx !== undefined ? editIdx : '') + '">저장</button>' +
        '<button type="button" class="btn btn-secondary" data-act="mwb-cancel-member">취소</button>' +
        '</div></div>';
    }

    var rows = roster.map(function (m, idx) {
      var r = m.roles || {};
      var rel = [];
      if (m.spouse) rel.push('배우자: ' + m.spouse);
      if (m.parentOf && m.parentOf.length) rel.push('자녀: ' + m.parentOf.join(','));
      if (m.childOf && m.childOf.length) rel.push('부모: ' + m.childOf.join(','));
      var relText = rel.join(' · ') || '-';

      return '<tr>' +
        '<td><strong>' + esc(m.ko) + '</strong><br><span style="font-size:12px;color:var(--ink-soft);">' + esc(m.vi) + ' (' + esc(m.call) + ')</span></td>' +
        '<td><span class="tag ' + (m.gender === 'M' ? 'tag-active' : 'tag-cancel') + '">' + (m.gender === 'M' ? '형제' : '자매') + '</span></td>' +
        '<td style="font-size:12px;color:var(--ink-soft);">' + esc(relText) + '</td>' +
        '<td style="text-align:center;"><input type="checkbox" data-act="mwb-role-toggle" data-member-idx="' + idx + '" data-role="chairman"' + (r.chairman ? ' checked' : '') + (m.gender === 'F' ? ' disabled' : '') + '></td>' +
        '<td style="text-align:center;"><input type="checkbox" data-act="mwb-role-toggle" data-member-idx="' + idx + '" data-role="prayer"' + (r.prayer ? ' checked' : '') + (m.gender === 'F' ? ' disabled' : '') + '></td>' +
        '<td style="text-align:center;"><input type="checkbox" data-act="mwb-role-toggle" data-member-idx="' + idx + '" data-role="talk10"' + (r.talk10 ? ' checked' : '') + (m.gender === 'F' ? ' disabled' : '') + '></td>' +
        '<td style="text-align:center;"><input type="checkbox" data-act="mwb-role-toggle" data-member-idx="' + idx + '" data-role="gems"' + (r.gems ? ' checked' : '') + (m.gender === 'F' ? ' disabled' : '') + '></td>' +
        '<td style="text-align:center;"><input type="checkbox" data-act="mwb-role-toggle" data-member-idx="' + idx + '" data-role="reading"' + (r.reading ? ' checked' : '') + (m.gender === 'F' ? ' disabled' : '') + '></td>' +
        '<td style="text-align:center;"><input type="checkbox" data-act="mwb-role-toggle" data-member-idx="' + idx + '" data-role="ministry"' + (r.ministry ? ' checked' : '') + '></td>' +
        '<td style="text-align:center;"><input type="checkbox" data-act="mwb-role-toggle" data-member-idx="' + idx + '" data-role="cbsCond"' + (r.cbsCond ? ' checked' : '') + (m.gender === 'F' ? ' disabled' : '') + '></td>' +
        '<td style="text-align:center;"><input type="checkbox" data-act="mwb-role-toggle" data-member-idx="' + idx + '" data-role="cbsRead"' + (r.cbsRead ? ' checked' : '') + (m.gender === 'F' ? ' disabled' : '') + '></td>' +
        '<td style="text-align:center;"><span class="badge" style="background:#f1f5f9;font-weight:700;">' + (counts[m.ko] || 0) + '회</span></td>' +
        '<td>' +
        '<button type="button" class="btn move-btn" data-act="mwb-edit-member" data-idx="' + idx + '">수정</button> ' +
        '<button type="button" class="btn move-btn" style="color:var(--danger);" data-act="mwb-del-member" data-idx="' + idx + '">삭제</button>' +
        '</td>' +
        '</tr>';
    }).join('');

    return formHtml + '<div class="card">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">' +
      '<div class="card-title" style="margin:0;">성원 자격 및 가족 관계 명단 (' + roster.length + '명)</div>' +
      '<div style="display:flex;gap:8px;">' +
      '<button type="button" class="btn btn-primary" data-act="mwb-add-member">➕ 성원 추가</button>' +
      '<button type="button" class="btn btn-secondary" data-act="mwb-reset-roster">초기 명단 복원</button>' +
      '</div></div>' +
      '<div style="overflow-x:auto;">' +
      '<table class="table" style="font-size:13px;">' +
      '<thead><tr>' +
      '<th>성명 (한/베)</th><th>성별</th><th>가족 관계</th>' +
      '<th>사회</th><th>기도</th><th>10분</th><th>보물</th><th>낭독</th><th>봉사</th><th>회중사회</th><th>회중낭독</th>' +
      '<th>배정수</th><th>관리</th>' +
      '</tr></thead>' +
      '<tbody>' + rows + '</tbody>' +
      '</table></div></div>';
  }

  function renderMwbScheduleTab(programs, roster, assignments, counts) {
    function personSelect(slotKey, currentVal, filterRole, brotherOnly) {
      var opts = '<option value="">-- 미정 --</option>';
      roster.forEach(function (m) {
        if (brotherOnly && m.gender !== 'M') return;
        if (filterRole && (!m.roles || !m.roles[filterRole])) return;
        var formatted = formatMember(m);
        var sel = (currentVal === formatted || currentVal.indexOf(m.ko) >= 0) ? ' selected' : '';
        opts += '<option value="' + esc(formatted) + '"' + sel + '>' + esc(formatted) + '</option>';
      });
      return '<select class="form-control" style="font-size:12px;padding:3px 6px;height:auto;max-width:260px;" data-act="mwb-assign-change" data-slot-key="' + esc(slotKey) + '">' + opts + '</select>';
    }

    var cards = programs.map(function (prog, pIdx) {
      var meta = prog.meta || {};
      var sDate = meta.startDate;
      var d = prog.date || {};
      var rd = prog.reading || {};

      var chairVal = assignments[sDate + '-chairman'] || prog.chairman || '';
      var openPrVal = assignments[sDate + '-open-prayer'] || prog.opening_prayer || '';
      var closePrVal = assignments[sDate + '-close-prayer'] || prog.closing_prayer || '';

      var rowsHtml = '';

      // Officer row
      rowsHtml += '<tr style="background:#f0fdf4;">' +
        '<td colspan="2"><strong>Chủ tọa (집회 사회자)</strong></td>' +
        '<td>' + personSelect(sDate + '-chairman', chairVal, 'chairman', true) + '</td>' +
        '<td></td></tr>';
      rowsHtml += '<tr style="background:#f0fdf4;">' +
        '<td colspan="2"><strong>Cầu nguyện mở đầu (시작 기도)</strong></td>' +
        '<td>' + personSelect(sDate + '-open-prayer', openPrVal, 'prayer', true) + '</td>' +
        '<td></td></tr>';

      (prog.items || []).forEach(function (it) {
        var num = it.num;
        var tKo = (it.title && it.title.ko) || '';
        var tVi = (it.title && it.title.vi) || '';
        var secName = it.section === 1 ? '💎 보물' : (it.section === 2 ? '🌾 봉사' : '🐑 생활');

        if (num === 1) {
          var t10Val = assignments[sDate + '-item-1-speaker'] || it.speaker || '';
          rowsHtml += '<tr>' +
            '<td><span class="tag" style="background:#ecfdf5;color:#047857;">' + secName + '</span> ' + num + '. ' + esc(tVi) + '<br><span style="font-size:12px;color:var(--ink-soft);">' + esc(tKo) + '</span></td>' +
            '<td>Diễn giả (10분 연설)</td>' +
            '<td>' + personSelect(sDate + '-item-1-speaker', t10Val, 'talk10', true) + '</td>' +
            '<td></td></tr>';
        } else if (num === 2) {
          var gemsVal = assignments[sDate + '-item-2-speaker'] || it.speaker || '';
          rowsHtml += '<tr>' +
            '<td><span class="tag" style="background:#ecfdf5;color:#047857;">' + secName + '</span> ' + num + '. ' + esc(tVi) + '<br><span style="font-size:12px;color:var(--ink-soft);">' + esc(tKo) + '</span></td>' +
            '<td>Người hướng dẫn (영적 보물)</td>' +
            '<td>' + personSelect(sDate + '-item-2-speaker', gemsVal, 'gems', true) + '</td>' +
            '<td></td></tr>';
        } else if (num === 3) {
          var rdVal = assignments[sDate + '-item-3-student'] || it.assignee || '';
          rowsHtml += '<tr>' +
            '<td><span class="tag" style="background:#ecfdf5;color:#047857;">' + secName + '</span> ' + num + '. ' + esc(tVi) + '<br><span style="font-size:12px;color:var(--ink-soft);">' + esc(tKo) + '</span></td>' +
            '<td>Người đọc (성경 낭독)</td>' +
            '<td>' + personSelect(sDate + '-item-3-student', rdVal, 'reading', true) + '</td>' +
            '<td></td></tr>';
        } else if (it.section === 2) {
          var isTalk = (tKo.indexOf('연설') >= 0 || tVi.indexOf('Bài giảng') >= 0);
          var stVal = assignments[sDate + '-item-' + num + '-student'] || it.assignee || '';
          var asstVal = assignments[sDate + '-item-' + num + '-assistant'] || it.assistant || '';
          rowsHtml += '<tr>' +
            '<td><span class="tag" style="background:#fef3c7;color:#b45309;">' + secName + '</span> ' + num + '. ' + esc(tVi) + '<br><span style="font-size:12px;color:var(--ink-soft);">' + esc(tKo) + '</span></td>' +
            '<td>' + (isTalk ? 'Bài giảng (연설)' : 'Học viên (학생)') + '</td>' +
            '<td>' + personSelect(sDate + '-item-' + num + '-student', stVal, 'ministry', isTalk) + '</td>' +
            '<td>' + (isTalk ? '-' : personSelect(sDate + '-item-' + num + '-assistant', asstVal, 'ministry', false)) + '</td></tr>';
        } else if (it.isCbs) {
          var condVal = assignments[sDate + '-cbs-conductor'] || it.conductor || '';
          var cbsRdVal = assignments[sDate + '-cbs-reader'] || it.reader || '';
          rowsHtml += '<tr style="background:#faf5ff;">' +
            '<td><span class="tag" style="background:#f3e8ff;color:#7e22ce;">' + secName + '</span> ' + num + '. ' + esc(tVi) + '<br><span style="font-size:12px;color:var(--ink-soft);">' + esc(tKo) + '</span></td>' +
            '<td>회중 성서 연구 (Chủ tọa/Người đọc)</td>' +
            '<td>사회: ' + personSelect(sDate + '-cbs-conductor', condVal, 'cbsCond', true) + '</td>' +
            '<td>낭독: ' + personSelect(sDate + '-cbs-reader', cbsRdVal, 'cbsRead', true) + '</td></tr>';
        }
      });

      rowsHtml += '<tr style="background:#f0fdf4;">' +
        '<td colspan="2"><strong>Cầu nguyện kết thúc (마치는 기도)</strong></td>' +
        '<td>' + personSelect(sDate + '-close-prayer', closePrVal, 'prayer', true) + '</td>' +
        '<td></td></tr>';

      return '<div class="card" style="margin-bottom:16px;">' +
        '<div class="card-title" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">' +
        '<span>📅 ' + esc(d.vi || '') + ' (' + esc(d.ko || '') + ') — <span style="font-weight:400;color:var(--ink-soft);">' + esc(rd.vi || '') + '</span></span>' +
        '<span class="tag tag-active" style="background:#dcfce7;color:#166534;">' + sDate + '</span>' +
        '</div>' +
        '<div style="overflow-x:auto;">' +
        '<table class="table" style="font-size:13px;">' +
        '<thead><tr><th>순서 및 항목</th><th>역할</th><th>담당자 (배정자)</th><th>보조자 / 낭독자</th></tr></thead>' +
        '<tbody>' + rowsHtml + '</tbody>' +
        '</table></div></div>';
    }).join('');

    return '<div style="margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">' +
      '<div><strong>전체 11주차 집회 임명표</strong> (총 ' + programs.length + '주간)</div>' +
      '<button type="button" class="btn btn-secondary" data-act="mwb-reset-assign">기본 배정 복원</button>' +
      '</div>' + cards;
  }

})();
