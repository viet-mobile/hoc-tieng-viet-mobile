# -*- coding: utf-8 -*-
"""[발음] > [설정] > "기기별 TTS 음성 추가 방법": per-device steps for adding a Vietnamese voice and a
voice for the site's current UI language. Shipped to every profile as TTS_GUIDE.

Menu names follow the official documentation, checked 2026-09 (latest major OS versions):
  Samsung   samsung.com/us/support/answer/ANS10003701 (English labels); Korean labels from
            Samsung's own answer on Samsung Members. Samsung's support site has no localized page
            for the other UI languages, so those keep the English labels (the card says so).
            Voice packages: Galaxy Store "Samsung TTS <language> Voice" (Vietnamese, Japanese,
            Mandarin (China), Taiwanese Mandarin, Cantonese, Czech, Hungarian, Indonesian, Polish;
            Korean/English/French/German ship with the engine).
  Android   support.google.com/accessibility/android/answer/6006983 (all 12 locales).
  iPhone    support.apple.com/<locale>/guide/iphone/iph96b214f0/ios -- "Read & Speak" (older iOS:
            "Spoken Content", support.apple.com/<locale>/111798).
  Mac       support.apple.com/<locale>/guide/mac-help/mchlp2290/mac.
  Windows   support.microsoft.com/<locale>/.../download-languages-and-voices-for-immersive-reader...
            and .../download-language-pack-for-speech-24d06ef3...; voices: "Appendix A: Supported
            languages and voices" (Vietnamese: Microsoft An). Where Microsoft's localized page
            prints the Settings path garbled (ja, hu, pl), the English labels are kept.

Step text: "**x**" is shown bold; "{langs}" becomes the language list of `names` (Vietnamese first,
then the UI language -- only Vietnamese on the Vietnamese UI).
"""

TTS_GUIDE_ORDER = ["samsung", "android", "ios", "mac", "windows"]

TTS_GUIDE = {
    "ko": {
        "title": "기기별 TTS 음성 추가 방법",
        "intro": "이 사이트의 발음 듣기와 전체 듣기는 기기에 설치된 음성을 사용해요. 베트남어 음성과 현재 선택한 언어(한국어) 음성을 추가하세요.",
        "names": ["베트남어(Tiếng Việt)", "한국어"],
        "cards": {
            "samsung": {
                "title": "Samsung Galaxy",
                "lead": "갤럭시에서는 삼성 자체 음성 엔진(삼성 TTS)을 기준으로 안내해요. 같은 화면에서 Google 엔진을 고를 수도 있어요.",
                "steps": [
                    "**설정** > **일반** > **글자 읽어주기**를 엽니다.",
                    "**기본 엔진**을 눌러 **삼성** 엔진을 선택합니다.",
                    "**기본 엔진** 오른쪽의 설정(⚙) 아이콘 > **음성 데이터 설치**를 누릅니다.",
                    "{langs} 옆의 다운로드 아이콘을 누르고 **다운로드**를 누릅니다.",
                    "**글자 읽어주기** 화면의 **언어**에서 사용할 언어를 고릅니다.",
                ],
                "note": "One UI 버전에 따라 메뉴 이름이 조금 다를 수 있어요. 앱에 따라 사용하는 엔진이 다를 수 있으니, 브라우저에서 베트남어가 읽히지 않으면 아래 [기타 Android]의 Google 엔진에도 베트남어 음성을 추가하세요.",
            },
            "android": {
                "title": "기타 Android",
                "lead": "음성 엔진은 제조사와 Android 버전에 따라 달라요. Google 엔진을 쓰는 기기(예: Pixel)는 다음과 같이 추가해요.",
                "steps": [
                    "**설정** > **접근성** > **텍스트 음성 변환 출력**을 엽니다.",
                    "선호하는 엔진으로 Google 엔진을 선택합니다.",
                    "**음성 데이터 설치**를 선택하고 {langs}을(를) 설치합니다.",
                ],
            },
            "ios": {
                "title": "iPhone · iPad",
                "steps": [
                    "**설정** > **손쉬운 사용** > **읽기 및 말하기** > **음성**을 엽니다.",
                    "언어 목록에서 {langs}을(를) 차례로 누르고 사용할 음성을 고릅니다.",
                    "기기에 없는 음성은 선택할 때 다운로드돼요(다운로드 버튼이 보이면 누르세요. Wi‑Fi 권장).",
                ],
                "note": "이전 iOS에서는 이 메뉴 이름이 '콘텐츠 말하기'예요.",
            },
            "mac": {
                "title": "Mac",
                "steps": [
                    "**Apple 메뉴** > **시스템 설정**을 선택하고 사이드바에서 **손쉬운 사용**을 클릭합니다.",
                    "**읽기 및 말하기**를 클릭합니다.",
                    "**시스템 음성** 옆의 ⓘ 버튼을 클릭합니다.",
                    "왼쪽에서 {langs}을(를) 선택하고 음성 이름을 클릭합니다. 다운로드 아이콘이 있는 음성은 Apple에서 자동으로 다운로드돼요.",
                    "**시스템 음성** 팝업 메뉴에서 사용할 음성을 고릅니다.",
                ],
            },
            "windows": {
                "title": "Windows",
                "steps": [
                    "**설정** > **시간 & 언어** > **언어 & 지역**을 엽니다.",
                    "**언어 추가**를 선택하고 {langs}을(를) 찾아(텍스트 음성 변환 아이콘이 있는 언어) **다음**을 선택합니다.",
                    "기능 목록에서 텍스트 음성 변환을 체크하고 **설치**를 선택합니다. **내 Windows 표시 언어로 설정**은 체크하지 않아도 돼요.",
                    "이미 설치된 언어라면 언어 옆의 … > **언어 옵션** > **언어 기능**에서 **텍스트 음성 변환** 옆의 **다운로드**를 선택합니다.",
                ],
                "note": "Windows의 베트남어 음성은 Microsoft An이에요.",
            },
        },
    },
    "en": {
        "title": "Adding text-to-speech voices on your device",
        "intro": "The listen and play-all buttons on this site use the voices installed on your device. Add a Vietnamese voice and a voice for your current language (English).",
        "names": ["Vietnamese (Tiếng Việt)", "English"],
        "cards": {
            "samsung": {
                "title": "Samsung Galaxy",
                "lead": "On Galaxy phones this guide uses Samsung's own speech engine (Samsung TTS). Google's engine can also be chosen on the same screen.",
                "steps": [
                    "Open **Settings** > **General management** > **Text-to-speech**.",
                    "Tap **Preferred engine** and choose the **Samsung** engine.",
                    "Tap the settings (⚙) icon next to **Preferred engine** > **Install voice data**.",
                    "Tap the download icon next to {langs}, then **Download**.",
                    "On the **Text-to-speech** screen, tap **Language** to choose the language to use.",
                ],
                "note": "Menu names can differ slightly between One UI versions. Apps can use different engines: if your browser does not read Vietnamese aloud, also add the Vietnamese voice to Google's engine (see Other Android).",
            },
            "android": {
                "title": "Other Android phones",
                "lead": "The speech engine depends on the manufacturer and Android version. On phones that use Google's engine (e.g. Pixel):",
                "steps": [
                    "Open **Settings** > **Accessibility** > **Text-to-speech output**.",
                    "Choose Google's engine as the preferred engine.",
                    "Select **Install voice data** and install {langs}.",
                ],
            },
            "ios": {
                "title": "iPhone · iPad",
                "steps": [
                    "Open **Settings** > **Accessibility** > **Read & Speak** > **Voices**.",
                    "In the language list, tap {langs} in turn and choose a voice.",
                    "A voice that is not yet on the device is downloaded when you choose it (tap the download button if shown; Wi‑Fi recommended).",
                ],
                "note": "On older iOS versions this menu is called Spoken Content.",
            },
            "mac": {
                "title": "Mac",
                "steps": [
                    "Choose **Apple menu** > **System Settings**, then click **Accessibility** in the sidebar.",
                    "Click **Read & Speak**.",
                    "Click the ⓘ button next to **System voice**.",
                    "Select {langs} on the left and click a voice name. A voice with the download icon is downloaded from Apple.",
                    "Choose the voice in the **System voice** pop-up menu.",
                ],
            },
            "windows": {
                "title": "Windows",
                "steps": [
                    "Open **Settings** > **Time & language** > **Language & region**.",
                    "Select **Add a language**, find {langs} (languages with the text-to-speech icon), then select **Next**.",
                    "Check text-to-speech in the feature list and select **Install**. You don't need to check **Set as my Windows display language**.",
                    "For a language that is already installed: select … next to it > **Language options** > under **Language features**, select **Download** next to **Text-to-speech**.",
                ],
                "note": "The Vietnamese voice on Windows is Microsoft An.",
            },
        },
    },
}

TTS_GUIDE.update({
    "vi": {
        "title": "Cách thêm giọng đọc TTS theo thiết bị",
        "intro": "Các nút nghe phát âm và nghe tất cả trên trang này dùng giọng đọc đã cài trên thiết bị. Hãy thêm giọng đọc tiếng Việt.",
        "names": ["Tiếng Việt"],
        "cards": {
            "samsung": {
                "title": "Samsung Galaxy",
                "lead": "Trên Galaxy, hướng dẫn này dùng công cụ giọng nói của Samsung (Samsung TTS). Bạn cũng có thể chọn công cụ của Google trên cùng màn hình.",
                "steps": [
                    "Mở **Settings** > **General management** > **Text-to-speech**.",
                    "Chạm **Preferred engine** và chọn công cụ **Samsung**.",
                    "Chạm biểu tượng cài đặt (⚙) cạnh **Preferred engine** > **Install voice data**.",
                    "Chạm biểu tượng tải xuống cạnh {langs}, rồi chạm **Download**.",
                    "Trên màn hình **Text-to-speech**, chạm **Language** để chọn ngôn ngữ.",
                ],
                "note": "Tên menu được ghi theo tài liệu hỗ trợ tiếng Anh của Samsung; trên điện thoại, menu hiển thị bằng ngôn ngữ của máy và có thể khác đôi chút theo phiên bản One UI. Mỗi ứng dụng có thể dùng công cụ khác nhau: nếu trình duyệt không đọc tiếng Việt, hãy thêm giọng tiếng Việt cho công cụ của Google (xem Android khác).",
            },
            "android": {
                "title": "Android khác",
                "lead": "Công cụ giọng nói tùy theo nhà sản xuất và phiên bản Android. Với thiết bị dùng công cụ của Google (ví dụ Pixel):",
                "steps": [
                    "Mở **Cài đặt** > **Hỗ trợ tiếp cận** > **Đầu ra cho tính năng chuyển văn bản sang lời nói**.",
                    "Chọn công cụ của Google làm công cụ ưa thích.",
                    "Chọn **Cài đặt dữ liệu thoại** và cài {langs}.",
                ],
            },
            "ios": {
                "title": "iPhone · iPad",
                "steps": [
                    "Mở **Cài đặt** > **Trợ năng** > **Đọc & Nói** > **Giọng nói**.",
                    "Trong danh sách ngôn ngữ, chạm {langs} rồi chọn một giọng đọc.",
                    "Giọng chưa có trên thiết bị sẽ được tải về khi bạn chọn (chạm nút tải về nếu có; nên dùng Wi‑Fi).",
                ],
                "note": "Trên các phiên bản iOS cũ, menu này có tên Spoken Content (Nội dung được đọc).",
            },
            "mac": {
                "title": "Mac",
                "steps": [
                    "Chọn **menu Apple** > **Cài đặt hệ thống**, rồi bấm **Trợ năng** trong thanh bên.",
                    "Bấm **Đọc & Nói**.",
                    "Bấm nút ⓘ cạnh **Giọng nói hệ thống**.",
                    "Chọn {langs} ở bên trái rồi bấm tên giọng đọc. Giọng có biểu tượng tải về sẽ được tải từ Apple.",
                    "Chọn giọng trong menu bật lên **Giọng nói hệ thống**.",
                ],
            },
            "windows": {
                "title": "Windows",
                "steps": [
                    "Mở **Cài đặt** > **Thời gian & ngôn ngữ** > **Ngôn ngữ & khu vực**.",
                    "Chọn **Thêm ngôn ngữ**, tìm {langs} (ngôn ngữ có biểu tượng chuyển văn bản sang giọng nói), rồi chọn **Tiếp theo**.",
                    "Đánh dấu tính năng chuyển văn bản sang giọng nói và chọn **Cài đặt**. Không cần chọn **Đặt làm ngôn ngữ hiển thị Windows của tôi**.",
                    "Nếu ngôn ngữ đã được cài: chọn … bên cạnh > **Tùy chọn ngôn ngữ** > trong **Tính năng ngôn ngữ**, chọn **Tải xuống** cạnh tính năng chuyển văn bản sang giọng nói.",
                ],
                "note": "Giọng tiếng Việt trên Windows là Microsoft An.",
            },
        },
    },
    "ja": {
        "title": "デバイス別 TTS 音声の追加方法",
        "intro": "このサイトの発音再生と一括再生は、デバイスにインストールされた音声を使います。ベトナム語の音声と、現在の言語（日本語）の音声を追加してください。",
        "names": ["ベトナム語（Tiếng Việt）", "日本語"],
        "cards": {
            "samsung": {
                "title": "Samsung Galaxy",
                "lead": "Galaxy では Samsung 独自の音声エンジン（Samsung TTS）を基準に案内します。同じ画面で Google のエンジンを選ぶこともできます。",
                "steps": [
                    "**Settings** > **General management** > **Text-to-speech** を開きます。",
                    "**Preferred engine** をタップして **Samsung** エンジンを選びます。",
                    "**Preferred engine** の横の設定（⚙）アイコン > **Install voice data** をタップします。",
                    "{langs} の横のダウンロードアイコンをタップし、**Download** をタップします。",
                    "**Text-to-speech** 画面の **Language** で使用する言語を選びます。",
                ],
                "note": "メニュー名は Samsung の英語サポートページの表記です。端末では端末の言語で表示され、One UI のバージョンにより少し異なる場合があります。アプリによって使うエンジンが違うことがあるので、ブラウザでベトナム語が読み上げられない場合は、Google のエンジンにもベトナム語の音声を追加してください（「その他の Android」参照）。",
            },
            "android": {
                "title": "その他の Android",
                "lead": "音声エンジンはメーカーや Android のバージョンによって異なります。Google のエンジンを使う端末（Pixel など）では:",
                "steps": [
                    "デバイスの **設定** > **[ユーザー補助]** > **[テキスト読み上げの設定]** を開きます。",
                    "優先するエンジンとして Google のエンジンを選びます。",
                    "**[音声データをインストール]** を選び、{langs} をインストールします。",
                ],
            },
            "ios": {
                "title": "iPhone・iPad",
                "steps": [
                    "**「設定」** > **「アクセシビリティ」** > **「リーダーと読み上げ」** > **「声」** を開きます。",
                    "言語の一覧で {langs} を順にタップし、使う声を選びます。",
                    "デバイスにない声は選ぶとダウンロードされます（ダウンロードボタンがあればタップ。Wi‑Fi 推奨）。",
                ],
                "note": "以前の iOS では、このメニューは「読み上げコンテンツ」という名前です。",
            },
            "mac": {
                "title": "Mac",
                "steps": [
                    "**アップルメニュー** > **「システム設定」** と選択し、サイドバーで **「アクセシビリティ」** をクリックします。",
                    "**「リーダーと読み上げ」** をクリックします。",
                    "**「システムの声」** の横の ⓘ ボタンをクリックします。",
                    "左側で {langs} を選び、声の名前をクリックします。ダウンロードアイコンがある声は Apple から自動的にダウンロードされます。",
                    "**「システムの声」** ポップアップメニューで使う声を選びます。",
                ],
            },
            "windows": {
                "title": "Windows",
                "steps": [
                    "**[言語または地域の設定]** を開きます（**Settings** > **Time & language** > **Language & region**）。",
                    "**[言語の追加]** を選び、{langs}（テキスト読み上げアイコンのある言語）を探して **[次へ]** を選びます。",
                    "機能の一覧でテキスト読み上げにチェックを入れ、**[インストール]** を選びます。表示言語に設定する必要はありません。",
                    "インストール済みの言語は、言語の横の … > 言語のオプション > 言語の機能で、テキスト読み上げの **ダウンロード** を選びます。",
                ],
                "note": "Windows のベトナム語音声は Microsoft An です。Microsoft の日本語ページでは設定の経路の一部が英語表記のため、英語名を併記しています。",
            },
        },
    },
    "zh_cn": {
        "title": "各设备添加 TTS 语音的方法",
        "intro": "本网站的发音播放和全部播放使用设备上已安装的语音。请添加越南语语音和当前语言（简体中文/普通话）语音。",
        "names": ["越南语（Tiếng Việt）", "中文普通话（中国大陆）"],
        "cards": {
            "samsung": {
                "title": "Samsung Galaxy",
                "lead": "在 Galaxy 上，本指南以三星自己的语音引擎（Samsung TTS）为准。同一画面中也可以选择 Google 引擎。",
                "steps": [
                    "打开 **Settings** > **General management** > **Text-to-speech**。",
                    "轻点 **Preferred engine**，选择 **Samsung** 引擎。",
                    "轻点 **Preferred engine** 旁的设置（⚙）图标 > **Install voice data**。",
                    "轻点 {langs} 旁的下载图标，然后轻点 **Download**。三星 TTS 中普通话（中国）与台湾普通话、粤语是不同的项目。",
                    "在 **Text-to-speech** 画面的 **Language** 中选择要使用的语言。",
                ],
                "note": "菜单名称采用三星英文支持页面的写法；手机上会以手机的语言显示，并可能因 One UI 版本略有不同。不同应用可能使用不同引擎：如果浏览器不朗读越南语，请也为 Google 引擎添加越南语语音（见“其他 Android”）。",
            },
            "android": {
                "title": "其他 Android",
                "lead": "语音引擎因制造商和 Android 版本而异。使用 Google 引擎的设备（如 Pixel）：",
                "steps": [
                    "打开设备的 **“设置”** > **“无障碍”** > **“文字转语音输出”**。",
                    "选择 Google 引擎作为首选引擎。",
                    "选择 **安装语音数据包**，安装 {langs}。",
                ],
            },
            "ios": {
                "title": "iPhone · iPad",
                "steps": [
                    "打开 **“设置”** > **“无障碍”** > **“阅读与朗读”** > **“声音”**。",
                    "在语言列表中依次轻点 {langs}，选取要使用的声音；中文请选择中国大陆的普通话声音。",
                    "设备上没有的声音会在选取时下载（如显示下载按钮请轻点；建议使用 Wi‑Fi）。",
                ],
                "note": "在较早的 iOS 中，此菜单名为“朗读内容”。",
            },
            "mac": {
                "title": "Mac",
                "steps": [
                    "选取 **苹果菜单** > **“系统设置”**，然后点按边栏中的 **“无障碍”**。",
                    "点按 **“阅读与朗读”**。",
                    "点按 **“系统声音”** 旁边的 ⓘ 按钮。",
                    "在左侧选择 {langs}，然后点按声音名称。带下载图标的声音会从 Apple 自动下载。",
                    "在 **“系统声音”** 弹出式菜单中选取声音。",
                ],
            },
            "windows": {
                "title": "Windows",
                "steps": [
                    "打开 **设置** > **时间 & 语言** > **语言 & 区域**。",
                    "选择 **“添加语言”**，找到 {langs}（带文本到语音转换图标的语言），然后选择 **“下一步”**。",
                    "在功能列表中勾选文本转语音，然后选择 **“安装”**。不必设置为 Windows 显示语言。",
                    "已安装的语言：选择语言旁的 … > **语言选项** > 在 **语言功能** 下，选择文本转语音旁的 **下载**。",
                ],
                "note": "Windows 的越南语语音为 Microsoft An；中文（简体）语音为 Huihui、Yaoyao、Kangkang 等。",
            },
        },
    },
    "zh": {
        "title": "各裝置新增 TTS 語音的方法",
        "intro": "本網站的發音播放和全部播放會使用裝置上已安裝的語音。請新增越南語語音和目前語言（繁體中文／台灣國語）語音。",
        "names": ["越南語（Tiếng Việt）", "中文國語（台灣）"],
        "cards": {
            "samsung": {
                "title": "Samsung Galaxy",
                "lead": "在 Galaxy 上，本指南以三星自己的語音引擎（Samsung TTS）為準。同一畫面中也可以選擇 Google 引擎。",
                "steps": [
                    "開啟 **Settings** > **General management** > **Text-to-speech**。",
                    "點一下 **Preferred engine**，選擇 **Samsung** 引擎。",
                    "點一下 **Preferred engine** 旁的設定（⚙）圖示 > **Install voice data**。",
                    "點一下 {langs} 旁的下載圖示，再點 **Download**。三星 TTS 中台灣國語、普通話（中國）與粵語是不同的項目。",
                    "在 **Text-to-speech** 畫面的 **Language** 中選擇要使用的語言。",
                ],
                "note": "選單名稱採用三星英文支援頁面的寫法；手機上會以手機的語言顯示，並可能因 One UI 版本略有不同。不同 App 可能使用不同引擎：如果瀏覽器不朗讀越南語，請也為 Google 引擎新增越南語語音（見「其他 Android」）。",
            },
            "android": {
                "title": "其他 Android",
                "lead": "語音引擎會因製造商和 Android 版本而異。使用 Google 引擎的裝置（例如 Pixel）：",
                "steps": [
                    "開啟裝置的 **「設定」** > **「無障礙設定」** > **「文字轉語音輸出」**。",
                    "選擇 Google 引擎作為偏好的引擎。",
                    "選取 **「安裝語音資料」**，安裝 {langs}。",
                ],
            },
            "ios": {
                "title": "iPhone・iPad",
                "steps": [
                    "開啟 **「設定」** > **「輔助使用」** > **「閱讀與朗讀」** > **「聲音」**。",
                    "在語言列表中依序點一下 {langs}，選擇要使用的聲音；中文請選擇台灣的國語聲音（香港的粵語聲音是另一個項目）。",
                    "裝置上沒有的聲音會在選擇時下載（若顯示下載按鈕請點一下；建議使用 Wi‑Fi）。",
                ],
                "note": "在較早的 iOS 中，這個選單稱為「語音內容」。",
            },
            "mac": {
                "title": "Mac",
                "steps": [
                    "選擇 **「蘋果」選單** > **「系統設定」**，然後按一下側邊欄中的 **「輔助使用」**。",
                    "按一下 **「閱讀與朗讀」**。",
                    "按一下 **「系統聲音」** 旁的 ⓘ 按鈕。",
                    "在左側選取 {langs}，然後按一下聲音名稱。有下載圖像的聲音會自動從 Apple 下載。",
                    "在 **「系統聲音」** 彈出式選單中選擇聲音。",
                ],
            },
            "windows": {
                "title": "Windows",
                "steps": [
                    "開啟 **設定** > **時間 & 語言** > **語言 & 地區**。",
                    "選擇 **[新增語言]**，找到 {langs}（有文字轉換語音圖示的語言），然後選取 **[下一步]**。",
                    "在功能清單中勾選文字轉換語音，然後選取 **[安裝]**。不必設定為 Windows 顯示語言。",
                    "已安裝的語言：選取語言旁的 … > **語言選項**，在語音選項下選擇 **下載**。",
                ],
                "note": "Windows 的越南語語音為 Microsoft An；中文（台灣）語音為 Hanhan、Yating、Zhiwei。",
            },
        },
    },
    "cs": {
        "title": "Jak přidat hlasy TTS v jednotlivých zařízeních",
        "intro": "Tlačítka poslechu a přehrávání všeho na tomto webu používají hlasy nainstalované v zařízení. Přidejte vietnamský hlas a hlas pro aktuální jazyk (češtinu).",
        "names": ["vietnamština (Tiếng Việt)", "čeština"],
        "cards": {
            "samsung": {
                "title": "Samsung Galaxy",
                "lead": "U zařízení Galaxy tento návod vychází z vlastního řečového modulu Samsungu (Samsung TTS). Na stejné obrazovce lze zvolit i modul Google.",
                "steps": [
                    "Otevřete **Settings** > **General management** > **Text-to-speech**.",
                    "Klepněte na **Preferred engine** a zvolte modul **Samsung**.",
                    "Klepněte na ikonu nastavení (⚙) vedle **Preferred engine** > **Install voice data**.",
                    "Klepněte na ikonu stažení vedle {langs} a pak na **Download**.",
                    "Na obrazovce **Text-to-speech** zvolte v položce **Language** jazyk.",
                ],
                "note": "Názvy nabídek odpovídají anglické podpoře Samsungu; v telefonu se zobrazí v jazyce zařízení a mohou se podle verze One UI mírně lišit. Aplikace mohou používat různé moduly: pokud prohlížeč vietnamštinu nečte, přidejte vietnamský hlas i do modulu Google (viz Jiný Android).",
            },
            "android": {
                "title": "Jiný Android",
                "lead": "Řečový modul závisí na výrobci a verzi Androidu. V zařízeních s modulem Google (např. Pixel):",
                "steps": [
                    "Otevřete **Nastavení** > **Přístupnost** > **Výstup převodu textu na řeč**.",
                    "Jako preferovaný modul zvolte modul Google.",
                    "Vyberte **Nainstalovat hlasová data** a nainstalujte {langs}.",
                ],
            },
            "ios": {
                "title": "iPhone · iPad",
                "steps": [
                    "Otevřete **Nastavení** > **Zpřístupnění** > **Čtení a mluvení** > **Hlasy**.",
                    "V seznamu jazyků postupně klepněte na {langs} a vyberte hlas.",
                    "Hlas, který v zařízení ještě není, se po výběru stáhne (pokud se zobrazí tlačítko stažení, klepněte na ně; doporučeno Wi‑Fi).",
                ],
                "note": "Ve starších verzích iOS se tato nabídka jmenuje Předčítání obsahu.",
            },
            "mac": {
                "title": "Mac",
                "steps": [
                    "Vyberte **nabídku Apple** > **Nastavení systému** a na bočním panelu klikněte na **Zpřístupnění**.",
                    "Klikněte na **Čtení a mluvení**.",
                    "Klikněte na tlačítko ⓘ u položky **Hlas systému**.",
                    "Vlevo vyberte {langs} a klikněte na název hlasu. Hlas s ikonou stažení se stáhne ze serverů Apple.",
                    "V místní nabídce **Hlas systému** vyberte hlas.",
                ],
            },
            "windows": {
                "title": "Windows",
                "steps": [
                    "Otevřete **Nastavení** > **Čas & jazyk** > **Jazyk & oblast**.",
                    "Klikněte na **Přidat jazyk**, najděte {langs} (jazyky s ikonou převodu textu na řeč) a vyberte **Další**.",
                    "V seznamu funkcí zaškrtněte převod textu na řeč a vyberte **Nainstalovat**. Nastavovat jej jako jazyk zobrazení Windows není nutné.",
                    "U již nainstalovaného jazyka: vyberte … vedle něj > **jazykové možnosti** > v části **Jazykové funkce** vyberte **Stáhnout** u převodu textu na řeč.",
                ],
                "note": "Vietnamský hlas ve Windows je Microsoft An, český Microsoft Jakub.",
            },
        },
    },
    "de": {
        "title": "TTS-Stimmen je nach Gerät hinzufügen",
        "intro": "Die Anhören- und Alles-abspielen-Tasten dieser Seite nutzen die auf dem Gerät installierten Stimmen. Füge eine vietnamesische Stimme und eine Stimme für die aktuelle Sprache (Deutsch) hinzu.",
        "names": ["Vietnamesisch (Tiếng Việt)", "Deutsch"],
        "cards": {
            "samsung": {
                "title": "Samsung Galaxy",
                "lead": "Auf Galaxy-Geräten beschreibt diese Anleitung Samsungs eigenes Sprachmodul (Samsung TTS). Im selben Bildschirm lässt sich auch Googles Modul wählen.",
                "steps": [
                    "Öffne **Settings** > **General management** > **Text-to-speech**.",
                    "Tippe auf **Preferred engine** und wähle das Modul **Samsung**.",
                    "Tippe auf das Einstellungssymbol (⚙) neben **Preferred engine** > **Install voice data**.",
                    "Tippe auf das Download-Symbol neben {langs} und dann auf **Download**.",
                    "Wähle im Bildschirm **Text-to-speech** unter **Language** die Sprache.",
                ],
                "note": "Die Menünamen stammen aus Samsungs englischsprachiger Hilfe; auf dem Telefon erscheinen sie in der Gerätesprache und können je nach One-UI-Version leicht abweichen. Apps können unterschiedliche Module verwenden: Liest der Browser kein Vietnamesisch vor, füge die vietnamesische Stimme auch dem Google-Modul hinzu (siehe Anderes Android).",
            },
            "android": {
                "title": "Anderes Android",
                "lead": "Das Sprachmodul hängt vom Hersteller und der Android-Version ab. Auf Geräten mit Googles Modul (z. B. Pixel):",
                "steps": [
                    "Öffne die **Geräteeinstellungen** > **Bedienungshilfen** > **Sprachausgabe**.",
                    "Wähle Googles Modul als bevorzugtes Modul.",
                    "Wähle **Sprachdaten installieren** und installiere {langs}.",
                ],
            },
            "ios": {
                "title": "iPhone · iPad",
                "steps": [
                    "Öffne **„Einstellungen“** > **„Bedienungshilfen“** > **„Lesen & Sprechen“** > **„Stimmen“**.",
                    "Tippe in der Sprachenliste nacheinander auf {langs} und wähle eine Stimme.",
                    "Eine Stimme, die noch nicht auf dem Gerät ist, wird bei der Auswahl geladen (ggf. auf die Download-Taste tippen; WLAN empfohlen).",
                ],
                "note": "In älteren iOS-Versionen heißt dieses Menü „Gesprochene Inhalte“.",
            },
            "mac": {
                "title": "Mac",
                "steps": [
                    "Wähle **Menü „Apple“** > **„Systemeinstellungen“** und klicke in der Seitenleiste auf **„Bedienungshilfen“**.",
                    "Klicke auf **„Lesen & Sprechen“**.",
                    "Klicke neben **„Systemstimme“** auf die Taste ⓘ.",
                    "Wähle links {langs} und klicke auf einen Stimmennamen. Eine Stimme mit Download-Symbol wird von Apple geladen.",
                    "Wähle die Stimme im Einblendmenü **„Systemstimme“**.",
                ],
            },
            "windows": {
                "title": "Windows",
                "steps": [
                    "Öffne **Einstellungen** > **Zeit & Sprache** > **Sprache & Region**.",
                    "Wähle **Sprache hinzufügen**, suche {langs} (Sprachen mit Text-zu-Sprache-Symbol) und wähle **Weiter**.",
                    "Aktiviere Text-zu-Sprache in der Funktionsliste und wähle **Installieren**. Als Windows-Anzeigesprache festlegen ist nicht nötig.",
                    "Bei einer bereits installierten Sprache: … neben der Sprache > **Sprachoptionen** > unter **Sprachfeatures** bei **Text-zu-Sprache** auf **Herunterladen**.",
                ],
                "note": "Die vietnamesische Windows-Stimme ist Microsoft An.",
            },
        },
    },
    "fr": {
        "title": "Ajouter des voix de synthèse vocale selon l'appareil",
        "intro": "Les boutons d'écoute et « tout écouter » de ce site utilisent les voix installées sur l'appareil. Ajoutez une voix vietnamienne et une voix pour la langue actuelle (français).",
        "names": ["vietnamien (Tiếng Việt)", "français"],
        "cards": {
            "samsung": {
                "title": "Samsung Galaxy",
                "lead": "Sur Galaxy, ce guide s'appuie sur le moteur vocal de Samsung (Samsung TTS). Le moteur de Google peut aussi être choisi sur le même écran.",
                "steps": [
                    "Ouvrez **Settings** > **General management** > **Text-to-speech**.",
                    "Touchez **Preferred engine** et choisissez le moteur **Samsung**.",
                    "Touchez l'icône des réglages (⚙) à côté de **Preferred engine** > **Install voice data**.",
                    "Touchez l'icône de téléchargement à côté de {langs}, puis **Download**.",
                    "Sur l'écran **Text-to-speech**, choisissez la langue dans **Language**.",
                ],
                "note": "Les noms de menus suivent l'aide en anglais de Samsung ; sur le téléphone, ils s'affichent dans la langue de l'appareil et peuvent varier légèrement selon la version de One UI. Les applis peuvent utiliser des moteurs différents : si le navigateur ne lit pas le vietnamien, ajoutez aussi la voix vietnamienne au moteur de Google (voir Autre Android).",
            },
            "android": {
                "title": "Autre Android",
                "lead": "Le moteur vocal dépend du fabricant et de la version d'Android. Sur les appareils qui utilisent le moteur de Google (Pixel, par exemple) :",
                "steps": [
                    "Accédez aux **paramètres** de l'appareil > **Accessibilité** > **Sortie de la synthèse vocale**.",
                    "Choisissez le moteur de Google comme moteur préféré.",
                    "Sélectionnez **Installer les données vocales** et installez {langs}.",
                ],
            },
            "ios": {
                "title": "iPhone · iPad",
                "steps": [
                    "Ouvrez **Réglages** > **Accessibilité** > **Lire et énoncer** > **Voix**.",
                    "Dans la liste des langues, touchez tour à tour {langs} et choisissez une voix.",
                    "Une voix absente de l'appareil est téléchargée lorsque vous la choisissez (touchez le bouton de téléchargement s'il apparaît ; Wi‑Fi conseillé).",
                ],
                "note": "Dans les versions antérieures d'iOS, ce menu s'appelle Contenu énoncé.",
            },
            "mac": {
                "title": "Mac",
                "steps": [
                    "Choisissez **menu Pomme** > **Réglages Système**, puis cliquez sur **Accessibilité** dans la barre latérale.",
                    "Cliquez sur **« Lire et énoncer »**.",
                    "Cliquez sur le bouton ⓘ en regard de **« Voix système »**.",
                    "Sélectionnez {langs} à gauche et cliquez sur un nom de voix. Une voix accompagnée de l'icône de téléchargement est téléchargée depuis Apple.",
                    "Choisissez la voix dans le menu local **« Voix système »**.",
                ],
            },
            "windows": {
                "title": "Windows",
                "steps": [
                    "Ouvrez **Paramètres** > **Heure & langue** > **Langue & région**.",
                    "Sélectionnez **Ajouter une langue**, cherchez {langs} (langues avec l'icône de synthèse vocale), puis sélectionnez **Suivant**.",
                    "Cochez la synthèse vocale dans la liste des fonctionnalités et sélectionnez **Installer**. Inutile de la définir comme langue d'affichage Windows.",
                    "Pour une langue déjà installée : … à côté de la langue > **options de langue** > sous **Fonctionnalités de langage**, **Télécharger** à côté de **Synthèse vocale**.",
                ],
                "note": "La voix vietnamienne de Windows est Microsoft An.",
            },
        },
    },
    "hu": {
        "title": "TTS-beszédhangok hozzáadása eszközönként",
        "intro": "A webhely meghallgatás- és összes lejátszása gombjai az eszközre telepített beszédhangokat használják. Adjon hozzá vietnami és az aktuális nyelvhez (magyar) tartozó beszédhangot.",
        "names": ["vietnámi (Tiếng Việt)", "magyar"],
        "cards": {
            "samsung": {
                "title": "Samsung Galaxy",
                "lead": "Galaxy készülékeken ez az útmutató a Samsung saját beszédmotorját (Samsung TTS) veszi alapul. Ugyanitt a Google motorja is választható.",
                "steps": [
                    "Nyissa meg a **Settings** > **General management** > **Text-to-speech** menüt.",
                    "Koppintson a **Preferred engine** elemre, és válassza a **Samsung** motort.",
                    "Koppintson a **Preferred engine** melletti beállítás (⚙) ikonra > **Install voice data**.",
                    "Koppintson a letöltés ikonra a(z) {langs} mellett, majd a **Download** gombra.",
                    "A **Text-to-speech** képernyőn a **Language** elemnél válassza ki a nyelvet.",
                ],
                "note": "A menünevek a Samsung angol nyelvű súgóját követik; a telefonon a készülék nyelvén jelennek meg, és One UI-verziónként kissé eltérhetnek. Az appok eltérő motort használhatnak: ha a böngésző nem olvas fel vietnamiul, adja hozzá a vietnami hangot a Google motorjához is (lásd Egyéb Android).",
            },
            "android": {
                "title": "Egyéb Android",
                "lead": "A beszédmotor a gyártótól és az Android-verziótól függ. A Google motorját használó eszközökön (pl. Pixel):",
                "steps": [
                    "Nyissa meg a **Beállítások** > **Kisegítő lehetőségek** > **Szövegfelolvasás** menüpontot.",
                    "Válassza a Google motorját előnyben részesített motorként.",
                    "Válassza a **Hangadatok telepítése** lehetőséget, és telepítse: {langs}.",
                ],
            },
            "ios": {
                "title": "iPhone · iPad",
                "steps": [
                    "Nyissa meg a **Beállítások** > **Kisegítő lehetőségek** > **Felolvasás és kimondás** > **Beszédhangok** menüt.",
                    "A nyelvlistában koppintson sorban erre: {langs}, és válasszon beszédhangot.",
                    "Az eszközön még nem lévő hang kiválasztáskor letöltődik (ha megjelenik a letöltés gomb, koppintson rá; Wi‑Fi ajánlott).",
                ],
                "note": "A korábbi iOS-verziókban ez a menü a Felolvasott tartalom nevet viseli.",
            },
            "mac": {
                "title": "Mac",
                "steps": [
                    "Válassza az **Apple menü** > **Rendszerbeállítások** menüpontot, majd kattintson az oldalsáv **Kisegítő lehetőségek** elemére.",
                    "Kattintson a **Felolvasás és kimondás** elemre.",
                    "Kattintson a **„Rendszerbeszédhang”** melletti ⓘ gombra.",
                    "A bal oldalon válassza ki ezt: {langs}, és kattintson egy hang nevére. A letöltés ikonnal jelölt hang automatikusan letöltődik az Apple-től.",
                    "Válassza ki a hangot a **„Rendszerbeszédhang”** felugró menüben.",
                ],
            },
            "windows": {
                "title": "Windows",
                "steps": [
                    "Nyissa meg a **Nyelvi vagy területi beállításokat** (**Settings** > **Time & language** > **Language & region**).",
                    "Válassza az **Újabb nyelv beállítása** lehetőséget, keresse meg ezt: {langs} (szövegfelolvasó ikonnal jelölt nyelvek), majd válassza a **Tovább** gombot.",
                    "A funkciók listájában jelölje be a szövegfelolvasást, majd válassza a **Telepítés** lehetőséget. Megjelenítési nyelvként beállítani nem szükséges.",
                    "Már telepített nyelvnél: a nyelv melletti … > nyelvi beállítások > a **Nyelvi szolgáltatások** szakaszban a **Letöltés** gomb a szövegfelolvasás mellett.",
                ],
                "note": "A Windows vietnami hangja a Microsoft An, a magyar a Microsoft Szabolcs. A Microsoft magyar oldala a beállítások útvonalát részben angolul mutatja, ezért az angol nevek is szerepelnek.",
            },
        },
    },
    "id": {
        "title": "Cara menambahkan suara TTS di setiap perangkat",
        "intro": "Tombol dengar dan putar semua di situs ini memakai suara yang terpasang di perangkat. Tambahkan suara bahasa Vietnam dan suara untuk bahasa saat ini (Bahasa Indonesia).",
        "names": ["bahasa Vietnam (Tiếng Việt)", "Bahasa Indonesia"],
        "cards": {
            "samsung": {
                "title": "Samsung Galaxy",
                "lead": "Di Galaxy, panduan ini memakai mesin suara milik Samsung (Samsung TTS). Mesin Google juga dapat dipilih di layar yang sama.",
                "steps": [
                    "Buka **Settings** > **General management** > **Text-to-speech**.",
                    "Ketuk **Preferred engine** lalu pilih mesin **Samsung**.",
                    "Ketuk ikon setelan (⚙) di samping **Preferred engine** > **Install voice data**.",
                    "Ketuk ikon unduh di samping {langs}, lalu **Download**.",
                    "Di layar **Text-to-speech**, pilih bahasa pada **Language**.",
                ],
                "note": "Nama menu mengikuti bantuan Samsung berbahasa Inggris; di ponsel, menu tampil dalam bahasa perangkat dan bisa sedikit berbeda menurut versi One UI. Aplikasi dapat memakai mesin berbeda: jika browser tidak membacakan bahasa Vietnam, tambahkan juga suara bahasa Vietnam ke mesin Google (lihat Android lain).",
            },
            "android": {
                "title": "Android lain",
                "lead": "Mesin suara bergantung pada produsen dan versi Android. Pada perangkat yang memakai mesin Google (misalnya Pixel):",
                "steps": [
                    "Buka **Setelan** perangkat > **Aksesibilitas** > **Output text-to-speech**.",
                    "Pilih mesin Google sebagai mesin pilihan.",
                    "Pilih **Instal data suara** lalu instal {langs}.",
                ],
            },
            "ios": {
                "title": "iPhone · iPad",
                "steps": [
                    "Buka **Pengaturan** > **Aksesibilitas** > **Baca & Ucapkan** > **Suara**.",
                    "Di daftar bahasa, ketuk {langs} satu per satu lalu pilih suara.",
                    "Suara yang belum ada di perangkat diunduh saat dipilih (ketuk tombol unduh jika tampil; disarankan Wi‑Fi).",
                ],
                "note": "Pada versi iOS lama, menu ini bernama Konten Lisan.",
            },
            "mac": {
                "title": "Mac",
                "steps": [
                    "Pilih **menu Apple** > **Pengaturan Sistem**, lalu klik **Aksesibilitas** di bar samping.",
                    "Klik **Baca & Ucapkan**.",
                    "Klik tombol ⓘ di samping **“Suara sistem”**.",
                    "Pilih {langs} di sebelah kiri lalu klik nama suara. Suara dengan ikon unduh diunduh otomatis dari Apple.",
                    "Pilih suara di menu pop-up **“Suara sistem”**.",
                ],
            },
            "windows": {
                "title": "Windows",
                "steps": [
                    "Buka **Pengaturan** > **Waktu & bahasa** > **Bahasa & wilayah**.",
                    "Pilih **Tambahkan bahasa**, cari {langs} (bahasa dengan ikon teks-ke-tuturan), lalu pilih **Berikutnya**.",
                    "Centang teks-ke-tuturan pada daftar fitur lalu pilih **Instal**. Tidak perlu menjadikannya bahasa tampilan Windows.",
                    "Untuk bahasa yang sudah terpasang: … di samping bahasa > **Opsi Bahasa** > di bagian **Fitur Bahasa**, pilih **Unduh** di samping Text-to-speech.",
                ],
                "note": "Suara bahasa Vietnam di Windows adalah Microsoft An, suara Bahasa Indonesia Microsoft Andika.",
            },
        },
    },
    "pl": {
        "title": "Dodawanie głosów TTS w zależności od urządzenia",
        "intro": "Przyciski odsłuchu i odtwarzania wszystkiego w tej witrynie używają głosów zainstalowanych w urządzeniu. Dodaj głos wietnamski i głos dla bieżącego języka (polskiego).",
        "names": ["wietnamski (Tiếng Việt)", "polski"],
        "cards": {
            "samsung": {
                "title": "Samsung Galaxy",
                "lead": "Na urządzeniach Galaxy ten przewodnik opiera się na własnym mechanizmie mowy Samsunga (Samsung TTS). Na tym samym ekranie można też wybrać mechanizm Google.",
                "steps": [
                    "Otwórz **Settings** > **General management** > **Text-to-speech**.",
                    "Stuknij **Preferred engine** i wybierz mechanizm **Samsung**.",
                    "Stuknij ikonę ustawień (⚙) obok **Preferred engine** > **Install voice data**.",
                    "Stuknij ikonę pobierania obok {langs}, a potem **Download**.",
                    "Na ekranie **Text-to-speech** wybierz język w pozycji **Language**.",
                ],
                "note": "Nazwy menu pochodzą z anglojęzycznej pomocy Samsunga; w telefonie są wyświetlane w języku urządzenia i mogą się nieco różnić w zależności od wersji One UI. Aplikacje mogą używać różnych mechanizmów: jeśli przeglądarka nie czyta po wietnamsku, dodaj głos wietnamski także do mechanizmu Google (zob. Inny Android).",
            },
            "android": {
                "title": "Inny Android",
                "lead": "Mechanizm mowy zależy od producenta i wersji Androida. Na urządzeniach z mechanizmem Google (np. Pixel):",
                "steps": [
                    "Na urządzeniu otwórz **Ustawienia** > **Ułatwienia dostępu** > **Zamiana tekstu na mowę**.",
                    "Jako preferowany mechanizm wybierz mechanizm Google.",
                    "Wybierz **Zainstaluj dane głosowe** i zainstaluj {langs}.",
                ],
            },
            "ios": {
                "title": "iPhone · iPad",
                "steps": [
                    "Otwórz **Ustawienia** > **Dostępność** > **Czytaj i mów** > **Głosy**.",
                    "Na liście języków stuknij kolejno {langs} i wybierz głos.",
                    "Głos, którego nie ma jeszcze w urządzeniu, zostanie pobrany po wybraniu (stuknij przycisk pobierania, jeśli się pojawi; zalecane Wi‑Fi).",
                ],
                "note": "W starszych wersjach iOS to menu nazywa się Zawartość mówiona.",
            },
            "mac": {
                "title": "Mac",
                "steps": [
                    "Wybierz **menu Apple** > **Ustawienia systemowe**, a następnie kliknij w **Dostępność** na pasku bocznym.",
                    "Kliknij w **Czytaj i mów**.",
                    "Kliknij w przycisk ⓘ obok etykiety **Głos systemowy**.",
                    "Zaznacz po lewej {langs} i kliknij w nazwę głosu. Głos z ikoną pobierania zostanie pobrany z Apple.",
                    "Wybierz głos w menu podręcznym **Głos systemowy**.",
                ],
            },
            "windows": {
                "title": "Windows",
                "steps": [
                    "Otwórz **ustawienia języka lub regionu** (**Settings** > **Time & language** > **Language & region**).",
                    "Wybierz **Dodaj język**, znajdź {langs} (języki z ikoną zamiany tekstu na mowę) i wybierz **Dalej**.",
                    "Zaznacz zamianę tekstu na mowę na liście funkcji i wybierz **Zainstaluj**. Ustawianie go jako języka wyświetlania Windows nie jest potrzebne.",
                    "Dla zainstalowanego już języka: … obok języka > opcje języka > w sekcji **Funkcje językowe** wybierz **Pobierz** obok zamiany tekstu na mowę.",
                ],
                "note": "Wietnamski głos w Windows to Microsoft An, polskie – Microsoft Adam i Paulina. Polska strona Microsoft pokazuje część ścieżki ustawień po angielsku, dlatego podano nazwy angielskie.",
            },
        },
    },
})
