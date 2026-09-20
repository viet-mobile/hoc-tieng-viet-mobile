# "교과 > 사용설명" subtab -- a from-scratch usage guide covering every app-wide common feature
# plus every subtab of every top-level tab, aimed at someone opening this app for the first time.
# Korean is the authored master; zh/en/ja/de are parallel translations, all five kept consistent with
# the terminology already used for buttons/labels elsewhere in the app (see I18N_UI in
# app_logic.js) so the guide's wording matches what the reader actually sees on screen.
#
# Text fields are {"ko","zh","en","ja","de"} dicts, same convention as curriculum_data.py -- js_json()
# (see build_app.py) serializes them straight into JS objects that app_logic.js's T() helper reads.

USAGE_GUIDE_COMMON = [{'name': {'ko': '복습 화면',
           'zh': '複習畫面',
           'en': 'Review screen',
           'ja': '復習画面',
           'de': 'Wiederholungsbildschirm'},
  'body': {'ko': '복습할 대분류와 하위 분류를 고른 뒤 학습 방식을 선택하세요. 자동 넘김은 시간을 두고 답을 보여 주며, “정답 시 다음 문제”는 맞힌 즉시 '
                 '다음 문제로 이동합니다.',
           'zh': '先選擇複習的大分類和小分類，再選擇練習方式。「自動切換」會在設定時間後顯示答案，「答對後下一題」則會在答對後立刻前往下一題。',
           'en': 'Choose a main and subcategory to review, then select a study mode. Auto-advance '
                 'reveals an answer after a delay; Next question when correct moves on immediately '
                 'after a correct answer.',
           'ja': '復習する大分類と小分類を選び，学習方法を選択します。「自動送り」は設定時間後に答えを表示し，「正解で次の問題」は正解した直後に次へ進みます。',
           'de': 'Wählen Sie eine Haupt- und Unterkategorie zum Wiederholen und anschließend eine '
                 'Lernmethode. „Automatisch weiter“ zeigt die Antwort nach einer kurzen Pause an; '
                 '„Bei richtiger Antwort weiter“ wechselt sofort nach einer richtigen Antwort zur '
                 'nächsten Frage.'}},
 {'name': {'ko': '언어 전환',
           'zh': '切換語言',
           'en': 'Language switcher',
           'ja': '言語切り替え',
           'de': 'Sprachauswahl'},
  'body': {'ko': '화면 위쪽의 한국어 / 繁體中文 / English / 日本語 버튼으로 앱의 모든 문구를 즉시 바꿀 수 있어요. 처음 접속하면 기기의 시스템 '
                 '언어에 맞춰 자동으로 선택되고, 이후에는 마지막으로 고른 언어가 기억돼요.',
           'zh': '點選畫面上方的 한국어 / 繁體中文 / English / 日本語 '
                 '按鈕，就能立刻切換整個應用程式的顯示語言。第一次開啟時會依裝置的系統語言自動選擇，之後則會記住您最後選擇的語言。',
           'en': 'The 한국어 / 繁體中文 / English / 日本語 buttons near the top of the screen instantly '
                 "switch every piece of text in the app. On first use it matches your device's "
                 'system language automatically, and afterward it remembers whichever language you '
                 'last chose.',
           'ja': '画面上部の 한국어 / 繁體中文 / English / 日本語 '
                 'ボタンで、アプリ内のすべての文言をすぐに切り替えられます。初回アクセス時は端末のシステム言語に合わせて自動的に選ばれ、以降は最後に選んだ言語が記憶されます。',
           'de': 'Über die Schaltflächen 한국어 / 繁體中文 / English / 日本語 / Deutsch oben auf dem '
                 'Bildschirm lässt sich die gesamte App-Sprache sofort umstellen. Beim ersten '
                 'Öffnen wird automatisch die Systemsprache Ihres Geräts gewählt; danach merkt '
                 'sich die App Ihre zuletzt gewählte Sprache.'}},
 {'name': {'ko': '발음 듣기 아이콘 (스피커 버튼)',
           'zh': '發音播放圖示（喇叭按鈕）',
           'en': 'Pronunciation icon (speaker button)',
           'ja': '発音再生アイコン（スピーカーボタン）',
           'de': 'Audio-Symbol (Lautsprecher-Schaltfläche)'},
  'body': {'ko': '베트남어 단어나 문장 옆의 스피커 모양 아이콘을 누르면 그 부분만 베트남어로 읽어줘요. 발음 > 설정 탭에서 고른 목소리와 반복 횟수가 그대로 '
                 '적용돼요.',
           'zh': '點選越南語單字或句子旁的喇叭圖示，就會只朗讀該處的越南語。系統會套用您在「發音 > 設定」分頁中選擇的語音與重複播放次數。',
           'en': 'Tapping the speaker icon next to any Vietnamese word or sentence reads just that '
                 'part aloud in Vietnamese, using whichever voice and repeat count you chose under '
                 'Pronunciation > Settings.',
           'ja': 'ベトナム語の単語や文の横にあるスピーカーアイコンを押すと、その部分だけをベトナム語で読み上げます。「発音 > '
                 '設定」タブで選んだ音声と繰り返し回数がそのまま適用されます。',
           'de': 'Tippen Sie auf das Lautsprecher-Symbol neben einem vietnamesischen Wort oder '
                 'Satz, um genau diesen Teil auf Vietnamesisch anzuhören. Dabei werden die unter '
                 'Aussprache > Einstellungen ausgewählte Stimme und die Wiederholungsanzahl '
                 'angewendet.'}},
 {'name': {'ko': '전체 듣기 버튼',
           'zh': '「全部播放」按鈕',
           'en': '"Play all" button',
           'ja': '「すべて再生」ボタン',
           'de': 'Schaltfläche „Alles abspielen“'},
  'body': {'ko': '단어·문장이 여러 개 나열된 화면 위쪽의 전체 듣기 버튼을 누르면 목록을 처음부터 순서대로 이어서 읽어줘요. 베트남어를 읽은 다음에는 현재 언어 '
                 '모드로 뜻(해석)도 이어서 읽어주고, 재생 중에는 버튼이 정지로 바뀌어 언제든 멈출 수 있어요.',
           'zh': '在列有多個單字、句子的畫面上方，點選「全部播放」按鈕就會從頭開始依序連續播放整份清單。唸完越南語後，還會接著以目前的顯示語言朗讀詞義（翻譯），播放期間按鈕會變成「停止」，可隨時按下暫停。',
           'en': 'On any screen listing several words or sentences, the "Play all" button near the '
                 'top reads through the whole list in order. After each Vietnamese phrase it also '
                 'reads the meaning in your current display language, and the button turns into '
                 '"Stop" while playing so you can halt it anytime.',
           'ja': '複数の単語や文が並ぶ画面上部の「すべて再生」ボタンを押すと、リストを最初から順番に続けて読み上げます。ベトナム語を読んだ後は、現在の表示言語で意味（訳）も続けて読み上げ、再生中はボタンが「停止」に変わり、いつでも止められます。',
           'de': 'Auf Bildschirmen mit mehreren Wörtern oder Sätzen liest die Schaltfläche „Alles '
                 'abspielen“ oben die gesamte Liste der Reihe nach vor. Nach jedem vietnamesischen '
                 'Ausdruck wird auch die Bedeutung in Ihrer aktuellen Anzeigesprache vorgelesen. '
                 'Während der Wiedergabe wechselt die Schaltfläche zu „Stopp“, sodass Sie '
                 'jederzeit anhalten können.'}},
 {'name': {'ko': '북부/남부 지역 토글',
           'zh': '北部／南部地區切換',
           'en': 'North/South dialect toggle',
           'ja': '北部・南部の切り替え',
           'de': 'Umschalter Nord/Süd'},
  'body': {'ko': '발음, 문법, 복습 탭에 있는 북부 / 남부 토글은 앱 전체에서 하나로 공유되는 설정이에요. 어느 화면에서 바꾸든 베트남어를 읽어줄 때 쓰는 '
                 '발음이 그 지역에 맞춰 함께 바뀌어요.',
           'zh': '「發音」「文法」「複習」分頁中的北部／南部切換是整個應用程式共用的同一項設定。無論在哪個畫面上更改，朗讀越南語時使用的發音都會一起切換成對應地區。',
           'en': 'The North/South toggle on the Pronunciation, Grammar, and Review tabs is one '
                 'shared setting across the whole app. Changing it on any screen switches the '
                 'accent used whenever Vietnamese is read aloud.',
           'ja': '「発音」「文法」「復習」タブにある北部・南部の切り替えは、アプリ全体で共有される1つの設定です。どの画面で変更しても、ベトナム語を読み上げる際の発音がその地域に合わせて一緒に切り替わります。',
           'de': 'Der Umschalter Nord / Süd in den Tabs Aussprache, Grammatik und Wiederholung ist '
                 'eine appweit gemeinsame Einstellung. Egal auf welchem Bildschirm Sie ihn '
                 'umstellen: Die Aussprache beim Vorlesen des Vietnamesischen passt sich sofort '
                 'der gewählten Region an.'}},
 {'name': {'ko': '베트남어 목소리 · 반복 듣기 횟수 설정',
           'zh': '越南語語音、重複播放次數設定',
           'en': 'Vietnamese voice & repeat-count settings',
           'ja': 'ベトナム語の音声・繰り返し再生回数の設定',
           'de': 'Vietnamesische Stimme & Wiederholungseinstellungen'},
  'body': {'ko': '발음 > 설정 탭에서 북부·남부 베트남어 목소리와 언어 모드(뜻 읽기) 목소리를 각각 고를 수 있고, 베트남어를 몇 번 반복해서 '
                 '들려줄지(1~5회)도 정할 수 있어요. 반복 횟수는 복습 탭에서도 똑같이 조정할 수 있고, 두 곳의 설정은 항상 함께 바뀌어요.',
           'zh': '在「發音 > '
                 '設定」分頁中，可以分別選擇北部與南部的越南語語音，以及目前顯示語言（朗讀詞義用）的語音，也能設定越南語要重複播放幾次（1~5次）。重複次數在「複習」分頁也能一樣調整，兩處的設定會始終保持一致。',
           'en': 'Under Pronunciation > Settings you can choose separate voices for North and '
                 'South Vietnamese plus the voice used to read meanings in your display language, '
                 'and set how many times (1-5) Vietnamese is repeated. The repeat count can also '
                 'be adjusted from the Review tab, and both always stay in sync.',
           'ja': '「発音 > '
                 '設定」タブでは、北部・南部それぞれのベトナム語の音声と、言語モード（意味の読み上げ）用の音声を選べるほか、ベトナム語を何回（1〜5回）繰り返し再生するかも設定できます。繰り返し回数は「復習」タブでも同じように調整でき、両方の設定は常に連動します。',
           'de': 'Unter Aussprache > Einstellungen können Sie getrennte Stimmen für Nord- und '
                 'Südvietnamesisch sowie für das Vorlesen der Bedeutungen in Ihrer Sprache '
                 'festlegen. Außerdem lässt sich einstellen, wie oft das Vietnamesische wiederholt '
                 'werden soll (1–5 Mal). Die Wiederholungsanzahl kann auch im Tab Wiederholung '
                 'geändert werden – beide Einstellungen bleiben stets synchron.'}},
 {'name': {'ko': '기기별 베트남어 음성(TTS) 설치 안내',
           'zh': '各裝置的越南語語音（TTS）安裝說明',
           'en': 'Device-specific Vietnamese voice (TTS) install guides',
           'ja': '端末別ベトナム語音声（TTS）インストール案内',
           'de': 'Anleitung zur Installation vietnamesischer Stimmen (TTS)'},
  'body': {'ko': '발음 > 설정 탭 아래쪽에 아이폰·아이패드, 안드로이드(삼성 포함), Mac, Windows별로 베트남어 음성을 설치하는 방법을 담은 카드가 '
                 '있어요. 항목을 눌러 펼치면 단계별 설치 방법을 볼 수 있어요.',
           'zh': '「發音 > 設定」分頁下方有針對 iPhone、iPad、Android（含三星）、Mac、Windows '
                 '各裝置的越南語語音安裝說明卡片。點選項目展開後即可查看逐步安裝方法。',
           'en': 'Below the voice settings on the Pronunciation tab are collapsible cards with '
                 'step-by-step instructions for installing a Vietnamese voice on iPhone/iPad, '
                 'Android (including Samsung), Mac, and Windows.',
           'ja': '「発音 > '
                 '設定」タブの下部には、iPhone・iPad、Android（Samsung含む）、Mac、Windowsごとにベトナム語音声のインストール方法をまとめたカードがあります。項目をタップして開くと、段階的なインストール手順を確認できます。',
           'de': 'Unten im Tab Aussprache > Einstellungen finden Sie aufklappbare Karten mit '
                 'Schritt-für-Schritt-Anleitungen zur Installation einer vietnamesischen '
                 'Sprachausgabe für iPhone/iPad, Android (inkl. Samsung), Mac und Windows.'}},
 {'name': {'ko': '검색창', 'zh': '搜尋欄', 'en': 'Search boxes', 'ja': '検索ボックス', 'de': 'Suchleiste'},
  'body': {'ko': '어휘 탭, 성경 탭, 문법 > 특강 탭에는 각각의 검색창이 있어서 단어나 표현을 입력하면 지금 보고 있는 소분류 안에서 바로 찾아줘요. 어휘 '
                 '탭에서 검색어를 입력하면 16주 과정에서 넘어올 때 뜨는 학습 범위 표시는 자동으로 해제돼요.',
           'zh': '「詞彙」「聖經」「文法 > 專題」分頁各自都有搜尋欄，輸入單字或用語即可在目前所在的小分類中立即找到。若在「詞彙」分頁輸入搜尋字詞，從 16 '
                 '週課程連結過來時顯示的學習範圍標示會自動解除。',
           'en': 'The Vocabulary, Bible, and Grammar > Special topics tabs each have their own '
                 "search box that filters within the subtab you're currently viewing. Typing into "
                 'the Vocabulary search box automatically clears the "focus range" banner shown '
                 'when you arrived via a shortcut from the 16-week course.',
           'ja': '「語彙」「聖書」「文法 > '
                 '特別講座」の各タブには、それぞれ専用の検索ボックスがあり、単語や表現を入力すると今見ている小分類内ですぐに検索できます。「語彙」タブで検索語を入力すると、16週コースから移動してきた際に表示される学習範囲の表示は自動的に解除されます。',
           'de': 'In den Tabs Wortschatz, Bibel und Grammatik > Besondere Themen gibt es jeweils '
                 'eigene Suchleisten, um innerhalb der aktuellen Unterkategorie schnell Wörter '
                 'oder Ausdrücke zu finden. Die Eingabe eines Suchbegriffs im Tab Wortschatz hebt '
                 'das Lernbereichs-Banner des 16-Wochen-Kurses automatisch auf.'}},
 {'name': {'ko': '바로가기 버튼',
           'zh': '「前往」按鈕',
           'en': '"Go" (shortcut) buttons',
           'ja': '「移動」ボタン',
           'de': 'Schaltfläche „Direkt zu“'},
  'body': {'ko': '16주 과정, 주간 수행 과제 등 곳곳에 있는 바로가기 버튼을 누르면 관련된 탭·소분류로 자동으로 이동하고, 필요하면 해당 항목까지 화면을 '
                 '스크롤해서 펼쳐 보여줘요.',
           'zh': '點選 16 週課程、每週學習作業等處的「前往」按鈕，就會自動跳到相關的分頁與小分類，並視需要捲動畫面、展開該項目讓您查看。',
           'en': 'The "Go" buttons scattered through the 16-week course, weekly assignments, and '
                 'elsewhere jump straight to the related tab and subtab, scrolling to and '
                 'expanding that item if needed.',
           'ja': '16週コースや週間の課題など、あちこちにある「移動」ボタンを押すと、関連するタブ・小分類へ自動的に移動し、必要に応じてその項目まで画面をスクロールして展開表示します。',
           'de': 'Die Schaltflächen „Direkt zu“ im 16-Wochen-Kurs, bei den wöchentlichen Aufgaben '
                 'und an anderen Stellen springen direkt zum passenden Tab und Untermenü und '
                 'scrollen bei Bedarf direkt zum entsprechenden Eintrag, um ihn aufzuklappen.'}},
 {'name': {'ko': '16주 과정의 학습 범위 배너',
           'zh': '16 週課程的學習範圍提示條',
           'en': '16-week course "focus range" banner',
           'ja': '16週コースの学習範囲バナー',
           'de': 'Lernbereichs-Banner des 16-Wochen-Kurses'},
  'body': {'ko': '바로가기로 어휘 탭에 들어가면 지금 보고 있는 단어 범위를 알려주는 배너가 뜨고, 학습 범위내 복습 게임 버튼으로 그 범위의 단어만 골라 복습 '
                 '게임을 할 수 있어요. 배너의 전체 보기 버튼을 누르거나 검색창에 검색어를 입력하면 범위가 풀려요.',
           'zh': '透過「前往」進入詞彙分頁時，畫面上會顯示告知目前所在單字範圍的提示條，並可用「本範圍複習遊戲」按鈕，只針對該範圍的單字進行複習遊戲。點選提示條上的「顯示全部」按鈕，或在搜尋欄輸入字詞，即可解除範圍限制。',
           'en': 'Arriving at the Vocabulary tab via a shortcut shows a banner telling you which '
                 'word range is currently in focus, with a "Review Game (This Range Only)" button '
                 "to practice just those words. Tapping the banner's clear button, or typing into "
                 'the search box, releases the scope.',
           'ja': 'ショートカットで語彙タブに入ると、現在表示中の単語範囲を知らせるバナーが表示され、「この範囲だけの復習ゲーム」ボタンでその範囲の単語だけを使った復習ゲームができます。バナーの解除ボタンを押すか、検索ボックスに語を入力すると範囲指定は解除されます。',
           'de': 'Wenn Sie über einen Direktlink zum Tab Wortschatz wechseln, zeigt ein Banner den '
                 'aktuellen Wortbereich an. Mit der Schaltfläche „Wiederholungsspiel (nur dieser '
                 'Bereich)“ können Sie gezielt nur diese Wörter üben. Durch Antippen von „Alle '
                 'anzeigen“ oder Eingabe in die Suchleiste wird die Bereichsbegrenzung wieder '
                 'aufgehoben.'}},
 {'name': {'ko': '복습 자동 넘김',
           'zh': '複習自動切換',
           'en': 'Review auto-advance',
           'ja': '復習の自動送り',
           'de': 'Automatisch weiter bei Wiederholung'},
  'body': {'ko': '복습 탭에서 자동 넘김을 켜고 초(3/5/8/10/15초 중 선택)를 정하면, 문제(반복 재생 포함) 음성이 다 끝난 뒤부터 그 시간을 세어 '
                 '자동으로 정답을 보여주고 다음 문제로 넘어가요. 정답 음성이 재생되는 시간도 이 자동 넘김 시간에는 포함되지 않아요.',
           'zh': '在「複習」分頁開啟自動切換並選定秒數（3／5／8／10／15 '
                 '秒可選）後，會等問題語音（含重複播放）完全播完才開始倒數，時間到就自動顯示正確答案並前往下一題。正確答案語音的播放時間同樣不會算入這段自動切換的等待時間內。',
           'en': 'Turning on auto-advance in the Review tab and picking a duration (3/5/8/10/15 '
                 'seconds) makes the countdown start only after the question audio (including all '
                 'repeats) finishes playing, then reveals the answer and moves to the next card. '
                 'Playing the answer audio afterward is likewise never counted against that '
                 'countdown.',
           'ja': '「復習」タブで自動送りをオンにし、秒数（3／5／8／10／15秒から選択）を設定すると、問題の音声（繰り返し再生を含む）が完全に終わってからその秒数のカウントが始まり、自動的に正解が表示されて次の問題に進みます。正解の音声が再生される時間も、この自動送りの時間には含まれません。',
           'de': 'Wenn Sie im Tab Wiederholung „Automatisch weiter“ aktivieren und eine Dauer '
                 '(3/5/8/10/15 Sekunden) wählen, beginnt der Countdown erst, nachdem die '
                 'Frage-Audiodatei (inklusive aller Wiederholungen) vollständig abgespielt wurde. '
                 'Anschließend wird die Lösung aufgedeckt und zur nächsten Karte gewechselt. Auch '
                 'die Audioausgabe der Antwort wird nicht auf die Wartezeit angerechnet.'}},
 {'name': {'ko': '다크/라이트 테마',
           'zh': '深色／淺色主題',
           'en': 'Dark/light theme',
           'ja': 'ダーク／ライトテーマ',
           'de': 'Dunkel-/Hell-Design'},
  'body': {'ko': '이 앱에는 화면 안에 별도의 다크·라이트 전환 버튼이 없고, 기기(또는 브라우저)의 시스템 설정을 그대로 따라가요. 기기의 화면 모드를 바꾸면 '
                 '이 앱의 색상도 자동으로 함께 바뀌어요.',
           'zh': '這個應用程式內沒有另外的深色／淺色切換按鈕，會直接依照裝置（或瀏覽器）的系統設定顯示。只要更改裝置的顯示模式，這裡的配色也會自動一併切換。',
           'en': 'There is no in-app toggle for dark or light mode -- the app simply follows your '
                 "device's (or browser's) system setting, so switching your device's display mode "
                 "automatically changes the app's colors too.",
           'ja': 'このアプリには画面内にダーク・ライト切り替え用の専用ボタンはなく、端末（またはブラウザ）のシステム設定にそのまま従います。端末の表示モードを変更すると、このアプリの配色も自動的に一緒に切り替わります。',
           'de': 'In dieser App gibt es keine eigene Schaltfläche für den Hell- oder Dunkelmodus – '
                 'sie passt sich automatisch den Systemeinstellungen Ihres Geräts (oder Browsers) '
                 'an. Wenn Sie das Design Ihres Geräts umstellen, wechselt auch die Farbgebung der '
                 'App entsprechend.'}},
 {'name': {'ko': '묵음(Mute) 옵션',
           'zh': '「靜音」選項',
           'en': 'Mute option',
           'ja': '「ミュート」オプション',
           'de': 'Stumm-Option'},
  'body': {'ko': '묵음 체크박스를 켜면 새 문제가 나올 때 자동으로 읽어 주는 음성을 끌 범위를 고를 수 있어요: 한(뜻 언어만) · 베(베트남어만) · 베한(둘 '
                 '다). 플래시카드 · 보기 · 어순 배열 · 받아쓰기는 문제가 이미 화면에 글자로 보이기 때문에 어느 쪽을 꺼도 풀 수 있어요. 듣기는 베트남어 '
                 '음성 자체가 문제이기 때문에 묵음을 켜면 자동으로 한(뜻 언어)만 꺼지고 베트남어는 항상 들려요. 묵음 상태에서도 다시 듣기 버튼은 그대로 '
                 '작동하고, 플래시카드 · 보기 · 듣기는 문제를 맞히거나 틀려도 다음 문제로 넘어가기 전에 정답을 항상 읽어 줘요.',
           'zh': '打開「靜音」核取方塊後，可以選擇要關閉哪個語言的自動播放語音：中文（只關詞義語言）、越南語（只關越南語）、全部（兩者都關）。「單字卡」「看選項猜四選一」「排列語序」「聽寫」的題目本身已經以文字顯示在畫面上，所以關掉任何一邊都能作答。「聽發音猜四選一」因為越南語語音本身就是題目，所以開啟靜音只會關掉中文（詞義語言），越南語一律照常播放。即使開啟靜音，「重新播放」按鈕仍可正常使用；「單字卡」「看選項猜四選一」「聽發音猜四選一」不論答對或答錯，換下一題前都會讀出正確答案。',
           'en': "Turning on the Mute checkbox lets you pick which language's automatic playback "
                 'to turn off: EN (meaning language only), VN (Vietnamese only), or All (both). '
                 'Flashcard, Reading, Word order, and Dictation already show the question as text '
                 "on screen, so you can mute either side and still answer. Listening's Vietnamese "
                 'audio IS the question, so turning on Mute there only ever mutes EN (the meaning '
                 'language) -- Vietnamese always plays. The replay button still works even while '
                 'muted, and Flashcard, Reading, and Listening always read the correct answer '
                 'aloud before moving to the next question, whether you got it right or wrong.',
           'ja': '「ミュート」チェックボックスをオンにすると、どちらの言語の自動再生をオフにするか選べます：日本語（意味の言語のみ）、ベトナム（ベトナム語のみ）、全て（両方）。「フラッシュカード」「読解」「語順並べ替え」「書き取り」は問題がすでに画面上に文字で表示されているため、どちらをミュートしても解答できます。「聞き取り」はベトナム語音声自体が問題なので、ミュートをオンにすると自動的に日本語（意味の言語）だけがミュートされ、ベトナム語は常に再生されます。ミュート中でも「もう一度聞く」ボタンは通常どおり使え、「フラッシュカード」「読解」「聞き取り」は正解・不正解にかかわらず、次の問題に進む前に必ず正解を読み上げます。',
           'de': 'Wenn Sie das Kontrollkästchen „Stumm“ aktivieren, können Sie festlegen, welche '
                 'Sprachausgabe bei neuen Fragen stummgeschaltet wird: DE (nur die Zielsprache der '
                 'Bedeutung), VN (nur Vietnamesisch) oder Alle (beide). Bei Karteikarten, Ansehen, '
                 'Wortstellung und Diktat ist die Frage bereits als Text sichtbar, sodass man jede '
                 'Seite stummschalten kann. Beim Modus „Hören“ ist die vietnamesische Audiodatei '
                 'die Frage selbst; daher wird hier bei Stummschaltung nur DE stummgeschaltet und '
                 'Vietnamesisch bleibt stets hörbar. Die Schaltfläche „Nochmal anhören“ '
                 'funktioniert auch bei Stummschaltung, und bei Karteikarten, Ansehen und Hören '
                 'wird die richtige Antwort vor der nächsten Frage immer vorgelesen.'}},
 {'name': {'ko': '언어별 바로가기 주소',
           'zh': '各語言的直達網址',
           'en': 'Language-specific web addresses',
           'ja': '言語別ショートカットURL',
           'de': 'Sprachspezifische Webadressen'},
  'body': {'ko': 'hoc.tieng.viet.mobile/ko, /en, /zt, /ja 주소로 바로 접속하면 그 언어 모드로 곧바로 열려요. 이렇게 열린 언어는 '
                 '저장되어 다음에 다시 방문할 때도 그대로 유지돼요.',
           'zh': '直接前往 hoc.tieng.viet.mobile/ko、/en、/zt、/ja '
                 '這些網址，就能以該語言模式立即開啟。這樣選擇的語言會被記住，下次造訪時也會維持相同語言。',
           'en': 'Going directly to hoc.tieng.viet.mobile/ko, /en, /zt, or /ja opens the app in '
                 'that language right away. The language you land on this way is remembered for '
                 'your next visit too.',
           'ja': 'hoc.tieng.viet.mobile/ko、/en、/zt、/ja '
                 'のアドレスに直接アクセスすると、その言語モードですぐに開きます。この方法で開いた言語は記憶され、次回訪問時も同じ言語が保持されます。',
           'de': 'Über direkte Adressen wie hoc.tieng.viet.mobile/de, /ko, /en, /zt oder /ja '
                 'öffnet sich die App sofort in der jeweiligen Sprache. Die so aufgerufene Sprache '
                 'wird gespeichert und bleibt auch beim nächsten Besuch erhalten.'}}]

USAGE_GUIDE_TABS = [{'tab_label': {'ko': '교과', 'zh': '課程', 'en': 'Curriculum', 'ja': '教科', 'de': 'Lehrplan'},
  'items': [{'name': {'ko': '16주 과정',
                      'zh': '16 週課程',
                      'en': '16-Week Course',
                      'ja': '16週コース',
                      'de': '16-Wochen-Kurs'},
             'body': {'ko': '학습반 16주 교과 과정 전체 목차예요. 맨 위 환영 카드를 펼치면 학습반 소개와 4단계(1~16주) 개요를 볼 수 있고, '
                            '주차별 카드를 펼치면 그 주에 배울 항목들과 바로가기 버튼, 그리고 그 주의 주간 수행 과제(복습·예습·어휘 범위)를 확인할 '
                            '수 있어요.',
                      'zh': '這是學習班 16 週課程的完整目錄。展開最上方的歡迎卡片，可以看到學習班介紹與 4 個階段（第 1~16 '
                            '週）的概要；展開各週卡片，則能查看該週要學的項目、「前往」按鈕，以及該週的每週學習作業（複習、預習、詞彙範圍）。',
                      'en': 'The full table of contents for the 16-week class curriculum. Expand '
                            'the welcome card at the top for an introduction to the class and an '
                            "overview of its four phases (weeks 1-16); expand any week's card to "
                            'see that week\'s items with "Go" buttons, plus its Weekly Assignment '
                            '(review/preview/vocabulary range).',
                      'ja': '学習コースの16週間の教科課程の全目次です。上部の歓迎カードを開くと、学習コースの紹介と4段階（1〜16週）の概要が見られ、各週のカードを開くと、その週に学ぶ項目や「移動」ボタン、そしてその週の週間の課題（復習・予習・語彙の範囲）を確認できます。',
                      'de': 'Vollständiges Inhaltsverzeichnis des 16-wöchigen Lehrplans. Klappen '
                            'Sie die Willkommenskarte oben auf, um eine Einführung in den Kurs und '
                            'einen Überblick über die 4 Phasen (Woche 1–16) zu sehen. In den '
                            'einzelnen Wochenkarten finden Sie die jeweiligen Lektionen mit '
                            '„Direkt zu“-Schaltflächen sowie die wöchentlichen Aufgaben '
                            '(Wiederholung, Vorbereitung und Wortschatzbereich).'}},
            {'name': {'ko': '문화', 'zh': '文化', 'en': 'Culture', 'ja': '文化', 'de': 'Kultur'},
             'body': {'ko': '베트남 문화를 소개하는 짧은 글 모음이에요. 특별한 설정 없이 읽기만 하면 되는 탭이에요.',
                      'zh': '這裡收錄了介紹越南文化的短文。這個分頁不需要特別設定，直接閱讀即可。',
                      'en': 'A collection of short articles introducing Vietnamese culture. '
                            "There's nothing to configure here -- just read.",
                      'ja': 'ベトナムの文化を紹介する短い読み物集です。特別な設定は不要で、読むだけのタブです。',
                      'de': 'Eine Sammlung kurzer Lesetexte über die vietnamesische Kultur. Hier '
                            'sind keine besonderen Einstellungen nötig – einfach öffnen und '
                            'lesen.'}},
            {'name': {'ko': '노래', 'zh': '詩歌', 'en': 'Songs', 'ja': '歌', 'de': 'Lieder'},
             'body': {'ko': '왕국 노래 가사를 절별로 들으며 따라 읽을 수 있고, 노래별 전체 듣기도 지원해요.',
                      'zh': '可以逐節聆聽王國詩歌歌詞並跟讀，也支援按首曲子整首播放。',
                      'en': 'Listen to Kingdom song lyrics verse by verse and read along, with a '
                            '"Play all" option per song.',
                      'ja': '王国の歌の歌詞を節ごとに聞きながら一緒に読むことができ、曲ごとの全部再生にも対応しています。',
                      'de': 'Hören Sie die Texte der Königreichslieder Strophe für Strophe an und '
                            'lesen Sie mit. Für jedes Lied steht auch eine „Alles '
                            'abspielen“-Funktion bereit.'}},
            {'name': {'ko': '기도', 'zh': '禱告', 'en': 'Prayer', 'ja': '祈り', 'de': 'Gebet'},
             'body': {'ko': '기도 준비하기에는 기도 예문과 발음 듣기 버튼, 전체 듣기 기능이 있어요.',
                      'zh': '「準備禱告」中收錄了禱告例句、發音播放按鈕與全部播放功能。',
                      'en': '"Prepare a Prayer" offers sample prayer lines with pronunciation '
                            'buttons and its own "Play all".',
                      'ja': '「祈りの準備」には祈りの例文と発音再生ボタン、全部再生機能があります。',
                      'de': 'Unter „Gebet vorbereiten“ finden Sie Beispielsätze für Gebete mit '
                            'Audio-Schaltflächen zum Anhören sowie einer Funktion zum '
                            'vollständigen Abspielen.'}},
            {'name': {'ko': '사용설명',
                      'zh': '使用說明',
                      'en': 'Usage Guide',
                      'ja': '使い方ガイド',
                      'de': 'Anleitung'},
             'body': {'ko': '지금 보고 계신 이 안내 화면이에요. 언제든 다시 돌아와 각 탭·소분류·설정과 버튼의 쓰임을 확인할 수 있어요.',
                      'zh': '這裡正是您現在看到的這份說明畫面。您隨時可以回來查看各分頁、小分類、設定與按鈕的用途。',
                      'en': "This is the very guide you're reading now -- come back anytime to "
                            'check what any tab, subtab, setting, or button does.',
                      'ja': '今ご覧になっているこの案内画面のことです。いつでも戻ってきて、各タブ・小分類・設定やボタンの使い方を確認できます。',
                      'de': 'Dies ist die vorliegende Anleitung. Sie können jederzeit hierher '
                            'zurückkehren, um die Funktionen der einzelnen Tabs, Unterkategorien, '
                            'Einstellungen und Schaltflächen nachzulesen.'}}]},
 {'tab_label': {'ko': '발음', 'zh': '發音', 'en': 'Pronunciation', 'ja': '発音', 'de': 'Aussprache'},
  'items': [{'name': {'ko': '설정', 'zh': '設定', 'en': 'Settings', 'ja': '設定', 'de': 'Einstellungen'},
             'body': {'ko': '북부·남부 목소리, 베트남어 반복 듣기 횟수, 언어 모드(뜻 읽기) 목소리를 고르는 곳이에요. 아래쪽에는 기기별 베트남어 '
                            '음성 설치 안내도 있어요.',
                      'zh': '在此可選擇北部、南部語音，設定越南語重複播放次數，以及選擇語言模式（朗讀詞義）用的語音。下方還有各裝置的越南語語音安裝說明。',
                      'en': 'Choose your North/South voices, the Vietnamese repeat count, and the '
                            'voice used to read meanings in your display language. Device-specific '
                            'voice-install guides are further down.',
                      'ja': '北部・南部の音声、ベトナム語の繰り返し再生回数、言語モード（意味の読み上げ）用の音声を選ぶ場所です。下部には端末別のベトナム語音声インストール案内もあります。',
                      'de': 'Hier wählen Sie die Stimmen für Nord- und Südvietnamesisch, die '
                            'Wiederholungsanzahl für das vietnamesische Audio sowie die Stimme für '
                            'Ihre Anzeigesprache (Vorlesen der Bedeutungen). Weiter unten finden '
                            'Sie Anleitungen zur Installation von TTS-Stimmen für verschiedene '
                            'Geräte.'}},
            {'name': {'ko': '문자', 'zh': '文字', 'en': 'Alphabet', 'ja': '文字', 'de': 'Buchstaben'},
             'body': {'ko': '베트남어 알파벳 글자를 모아 둔 표예요. 글자를 누르면 그 글자의 이름을 읽어주고, 전체 듣기로 전체를 이어서 들을 수 '
                            '있어요.',
                      'zh': '整理了越南語字母的表格。點選字母就會朗讀該字母的名稱，也能用「全部播放」連續聆聽全部字母。',
                      'en': 'A table of the Vietnamese alphabet. Tapping a letter reads its name '
                            'aloud, and "Play all" plays through the whole set.',
                      'ja': 'ベトナム語のアルファベットをまとめた表です。文字を押すとその文字の名前を読み上げ、「すべて再生」で全体を続けて聞くことができます。',
                      'de': 'Eine Übersichtstabelle des vietnamesischen Alphabets. Tippen Sie auf '
                            'einen Buchstaben, um seinen Namen zu hören; über „Alles abspielen“ '
                            'lässt sich das gesamte Alphabet der Reihe nach anhören.'}},
            {'name': {'ko': '모음', 'zh': '母音', 'en': 'Vowels', 'ja': '母音', 'de': 'Vokale'},
             'body': {'ko': '단모음·복모음을 표로 정리했어요. 각 행마다 발음 듣기 버튼이 있고, 묶음별 전체 듣기도 지원해요.',
                      'zh': '將單母音、複合母音整理成表格。每一列都有發音播放按鈕，也支援分組的全部播放。',
                      'en': 'Simple and compound vowels laid out in tables, each row with its own '
                            'pronunciation button, plus "Play all" per group.',
                      'ja': '単母音・複合母音を表にまとめました。各行に発音再生ボタンがあり、グループごとの全部再生にも対応しています。',
                      'de': 'Einfache und zusammengesetzte Vokale in übersichtlichen Tabellen. '
                            'Jede Zeile verfügt über eine Audio-Schaltfläche, und jede Gruppe kann '
                            'komplett abgespielt werden.'}},
            {'name': {'ko': '자음', 'zh': '子音', 'en': 'Consonants', 'ja': '子音', 'de': 'Konsonanten'},
             'body': {'ko': '단자음·복자음을 표로 정리했어요. ơ를 붙여 읽는 표기 관례도 함께 안내돼요.',
                      'zh': '將單子音、複合子音整理成表格，也一併說明搭配 ơ 來讀的標記慣例。',
                      'en': 'Simple and compound consonants in tables, with a note on the '
                            'convention of reading them with a trailing "ơ".',
                      'ja': '単子音・複合子音を表にまとめ、「ơ」を付けて読む表記の慣習についても案内しています。',
                      'de': 'Einfache und zusammengesetzte Konsonanten im Überblick, inklusive '
                            'Hinweisen zur Aussprachekonvention mit angehängtem „ơ“.'}},
            {'name': {'ko': '성조', 'zh': '聲調', 'en': 'Tones', 'ja': '声調', 'de': 'Töne'},
             'body': {'ko': '베트남어 6성조를 하나씩 듣고 연습할 수 있고, 성조와 중국어 성조의 대응 관계도 함께 볼 수 있어요.',
                      'zh': '可以逐一聆聽並練習越南語的 6 個聲調，也能查看聲調與中文聲調的對應關係。',
                      'en': 'Listen to and practice all six Vietnamese tones one by one, with a '
                            'chart comparing them to Chinese tones.',
                      'ja': 'ベトナム語の6声調を1つずつ聞いて練習でき、声調と中国語の声調との対応関係も確認できます。',
                      'de': 'Hören und üben Sie die 6 vietnamesischen Töne einzeln. Eine '
                            'Vergleichstabelle zeigt zudem die Entsprechungen zu den Tönen des '
                            'Mandarin.'}},
            {'name': {'ko': '연속 성조',
                      'zh': '連續聲調',
                      'en': 'Tone pairs',
                      'ja': '連続声調',
                      'de': 'Tonkombinationen'},
             'body': {'ko': '두 음절이 이어질 때의 성조 조합(첫 음절 성조별 6개 그룹, 총 36가지 조합)을 듣고 연습하는 곳이에요. 그룹을 펼쳐 각 '
                            '조합 카드의 발음을 듣거나 카드별로 전체 듣기를 할 수 있어요.',
                      'zh': '練習兩個音節相連時的聲調組合（依第一音節聲調分為 6 組，共 36 '
                            '種組合）。展開各組後，可聆聽每張組合卡片的發音，也能按卡片個別播放全部。',
                      'en': 'Practice how tones combine across two consecutive syllables (6 groups '
                            'by first-syllable tone, 36 combinations total). Expand a group to '
                            'hear each combination card, or use its "Play all".',
                      'ja': '2つの音節が続くときの声調の組み合わせ（最初の音節の声調ごとに6グループ、全36通り）を聞いて練習する場所です。グループを開いて各組み合わせカードの発音を聞いたり、カードごとに全部再生したりできます。',
                      'de': 'Hier üben Sie das Zusammenspiel der Töne über zwei '
                            'aufeinanderfolgende Silben (6 Gruppen nach dem Ton der ersten Silbe, '
                            'insgesamt 36 Kombinationen). Klappen Sie eine Gruppe auf, um einzelne '
                            'Kombinationen oder die gesamte Gruppe anzuhören.'}},
            {'name': {'ko': '남북 발음',
                      'zh': '南北發音差異',
                      'en': 'North/South differences',
                      'ja': '南北の発音',
                      'de': 'Nord/Süd-Aussprache'},
             'body': {'ko': '북부와 남부 베트남어 발음의 주요 차이점을 다섯 가지 카드로 정리했어요. 화면 언어가 한국어일 때는 한글로 표기한 발음 '
                            '예시도 함께 보여요.',
                      'zh': '用五張卡片整理了北部與南部越南語發音的主要差異。當畫面語言為韓文時，還會一併顯示以韓文標音的發音範例。',
                      'en': 'Five cards summarizing the main pronunciation differences between '
                            'North and South Vietnamese. When the display language is Korean, '
                            'Hangul phonetic examples are also shown.',
                      'ja': '北部と南部のベトナム語発音の主な違いを5枚のカードにまとめました。表示言語が韓国語の場合は、ハングルで表記した発音例も一緒に表示されます。',
                      'de': 'Fünf Karten fassen die wichtigsten Ausspracheunterschiede zwischen '
                            'Nord- und Südvietnamesisch zusammen. Wenn die Anzeigesprache '
                            'Koreanisch ist, werden auch Aussprachehilfen in Hangul angezeigt.'}}]},
 {'tab_label': {'ko': '성경', 'zh': '聖經', 'en': 'Bible', 'ja': '聖書', 'de': 'Bibel'},
  'items': [{'name': {'ko': '책명', 'zh': '書名', 'en': 'Bible books', 'ja': '書名', 'de': 'Bibelbücher'},
             'body': {'ko': '구약·신약 성경 책 이름을 베트남어로 찾아볼 수 있어요. 검색창으로 원하는 책을 바로 찾을 수 있고, 구약/신약별로 전체 '
                            '듣기도 지원해요.',
                      'zh': '可以查詢舊約、新約聖經書卷的越南語名稱。用搜尋欄可直接找到想要的書卷，也支援依舊約／新約分別全部播放。',
                      'en': 'Look up the Vietnamese names of Old and New Testament Bible books, '
                            'searchable, with "Play all" for each Testament.',
                      'ja': '旧約・新約聖書の書名をベトナム語で調べられます。検索欄で目的の書をすぐに探せるほか、旧約／新約ごとの全部再生にも対応しています。',
                      'de': 'Schlagen Sie die vietnamesischen Namen der Bücher des Alten und Neuen '
                            'Testaments nach. Mit der Suchleiste finden Sie schnell jedes Buch, '
                            'und für beide Testamente gibt es eine „Alles abspielen“-Funktion.'}},
            {'name': {'ko': '숫자', 'zh': '數字', 'en': 'Numbers', 'ja': '数字', 'de': 'Zahlen'},
             'body': {'ko': '1부터 10억 단위까지, 그리고 소수 표기 예시까지 구간별로 정리한 숫자 읽는 법이에요.',
                      'zh': '從 1 到 10 億，甚至小數點的標記範例，都依區間整理了越南語數字的讀法。',
                      'en': 'How to read numbers from 1 up through the billions, plus a '
                            'decimal-notation example, organized by range.',
                      'ja': '1から10億まで、さらに小数の表記例まで、区間ごとに整理した数字の読み方です。',
                      'de': 'Eine Übersicht über das Lesen von Zahlen von 1 bis in die Milliarden '
                            'sowie Beispiele für Dezimalzahlen, übersichtlich nach Zahlenbereichen '
                            'geordnet.'}},
            {'name': {'ko': '시간', 'zh': '時間', 'en': 'Time', 'ja': '時間', 'de': 'Uhrzeit'},
             'body': {'ko': '시각 읽는 법, 하루 중 시간대 표현, 실제 예문을 함께 볼 수 있어요.',
                      'zh': '可以一併查看報時的讀法、一天中各時段的說法，以及實際例句。',
                      'en': 'How to say the hour, phrases for different times of day, and example '
                            'sentences.',
                      'ja': '時刻の読み方、1日の時間帯の表現、実際の例文を一緒に確認できます。',
                      'de': 'Uhrzeitangaben, Tageszeiten und praktische Beispielsätze auf einen '
                            'Blick.'}},
            {'name': {'ko': '요일,날짜',
                      'zh': '星期、日期',
                      'en': 'Days & dates',
                      'ja': '曜日・日付',
                      'de': 'Wochentage, Datum'},
             'body': {'ko': '요일과 날짜(몽/mồng 표기 포함) 읽는 법을 정리했어요.',
                      'zh': '整理了星期與日期（含 mồng 標記）的讀法。',
                      'en': 'How to read days of the week and dates, including the "mồng" '
                            'notation.',
                      'ja': '曜日と日付（mồngの表記を含む）の読み方をまとめました。',
                      'de': 'Regeln und Ausdrücke für Wochentage und Datumsangaben (einschließlich '
                            'der Besonderheit „mồng“).'}},
            {'name': {'ko': '달,계절',
                      'zh': '月份、季節',
                      'en': 'Months & seasons',
                      'ja': '月・季節',
                      'de': 'Monate, Jahreszeiten'},
             'body': {'ko': '월(달) 이름, 연도를 읽을 때 쓰는 lẻ·không trăm 표기법, 계절 이름을 안내해요.',
                      'zh': '介紹月份名稱、讀年份時使用的 lẻ、không trăm 標記法，以及季節名稱。',
                      'en': 'Month names, the "lẻ"/"không trăm" convention for reading years, and '
                            'season names.',
                      'ja': '月の名前、年を読む際の lẻ・không trăm の表記法、季節の名前を案内します。',
                      'de': 'Monatsnamen, die Schreibweise von Jahreszahlen mit „lẻ“ und „không '
                            'trăm“ sowie die Bezeichnungen der Jahreszeiten.'}}]},
 {'tab_label': {'ko': '대화', 'zh': '對話', 'en': 'Conversation', 'ja': '対話', 'de': 'Dialog'},
  'items': [{'name': {'ko': '대화', 'zh': '對話', 'en': 'Conversation', 'ja': '対話', 'de': 'Dialog'},
             'body': {'ko': '참여자 정보에 나·봉사짝·상대방(도와주는 형제·자매)의 이름·성별·나이·전화번호·결혼 여부를 입력하면, 그 정보에 맞춘 실제 '
                            '대화문과 제공 연설이 자동으로 만들어져요. 몇 가지 질문(상대 성별 → 나이 관계 → [필요시] 연령대 → 지역)에 답하면 '
                            '알맞은 호칭과 존댓말 안내, 단계별 대화문(첫인사부터 재방문·집회 초대·성서 연구 사회까지)이 나와요. 한국어 뜻 가리고 '
                            '연습하기로 스스로 뜻을 떠올려 보는 연습도 할 수 있고, 다시 선택으로 조건을 처음부터 다시 고를 수 있어요.',
                      'zh': '在「參與者資訊」中輸入我、傳道夥伴、對方（協助的弟兄姊妹）的姓名、性別、年齡、電話號碼、婚姻狀況後，系統就會自動產生符合這些資訊的實際對話與提供講解。回答幾個問題（對方性別 '
                            '→ 年齡關係 → ［如需要］年齡層 → '
                            '地區）後，會顯示合適的稱呼與敬語提示，以及分階段的對話內容（從初次問候到再訪、邀請聚會、主持聖經研究）。可用「遮住韓文詞義來練習」自行回想詞義，也能用「重新選擇」從頭重新設定條件。',
                      'en': 'Enter names, gender, age, phone number, and marital status for '
                            "yourself, your ministry partner, and the person you're talking with "
                            'under "Participant Info", and the app builds an actual dialogue and '
                            'offer talk tailored to that. Answer a few questions (their gender → '
                            'age relationship → [if needed] age group → region) to see the right '
                            'terms of address, politeness notes, and a staged dialogue covering '
                            'the first greeting through return visits, meeting invitations, and '
                            'starting a Bible study. "Practice with Korean meaning hidden" lets '
                            'you recall meanings yourself, and "Choose again" restarts the '
                            'questions from scratch.',
                      'ja': '「参加者情報」に自分・奉仕の相手・話す相手（手伝ってくれる兄弟姉妹）の名前・性別・年齢・電話番号・既婚かどうかを入力すると、その情報に合わせた実際の対話文と提供の話が自動的に作成されます。いくつかの質問（相手の性別 '
                            '→ 年齢関係 → ［必要な場合］年代 → '
                            '地域）に答えると、適切な呼び方や丁寧語の案内、段階別の対話文（最初の挨拶から再訪問・集会への招待・聖書研究の司会まで）が表示されます。「韓国語の意味を隠して練習する」で自分で意味を思い出す練習もでき、「もう一度選ぶ」で条件を最初から選び直せます。',
                      'de': 'Geben Sie unter „Teilnehmer-Info“ Name, Geschlecht, Alter, '
                            'Telefonnummer und Familienstand von sich, Ihrem Dienstpartner und '
                            'Ihrem Gesprächspartner (dem helfenden Bruder oder der Schwester) ein. '
                            'Die App erstellt automatisch passende reale Dialoge und '
                            'Gesprächsvorschläge. Nach wenigen kurzen Fragen (Geschlecht des '
                            'Gegenübers → Altersverhältnis → [falls nötig] Altersgruppe → Region) '
                            'erhalten Sie die passende Anredeform, Höflichkeitshinweise und '
                            'stufenweise Dialoge (vom ersten Gruß über Rückbesuche und Einladungen '
                            'zu Zusammenkünften bis zum Leiten eines Bibelstudiums). Mit der '
                            'Option zum Ausblenden der Übersetzung können Sie sich selbst testen, '
                            'und mit „Neu auswählen“ setzen Sie alle Angaben zurück.'}},
            {'name': {'ko': '호칭',
                      'zh': '稱呼',
                      'en': 'Terms of address',
                      'ja': '呼び方',
                      'de': 'Anredeformen'},
             'body': {'ko': '상황별 호칭 표와 가족 관계도(호칭이 북부·남부에 따라 달라지는 경우도 함께 표시)를 볼 수 있어요. 세대별로 전체 듣기도 '
                            '지원해요.',
                      'zh': '可以查看依情境分類的稱呼表，以及家族關係圖（也會標示因南北部而不同的稱呼）。也支援依世代分別全部播放。',
                      'en': 'A table of terms of address by situation, and a family-tree diagram '
                            '(noting where terms differ North vs. South), with "Play all" per '
                            'generation.',
                      'ja': '状況別の呼び方の表と家系図（呼び方が北部・南部で異なる場合も表示）を見ることができます。世代ごとの全部再生にも対応しています。',
                      'de': 'Eine Tabelle der Anredeformen nach Situation sowie ein Stammbaum (mit '
                            'Kennzeichnung von Unterschieden zwischen Nord und Süd). Jede '
                            'Generation kann auch komplett angehört werden.'}},
            {'name': {'ko': '제공 연설',
                      'zh': '提供講解',
                      'en': 'Offer talks',
                      'ja': '提供の話',
                      'de': 'Gesprächsvorschläge'},
             'body': {'ko': '대화 탭에서 입력한 인물 정보 요약을 위에서 확인할 수 있고, 아래에는 상황별 제공 연설 대본이 있어요. 계산된 호칭이 '
                            '대화문에 자동으로 반영되고, 대본별 발음 듣기·전체 듣기를 지원해요.',
                      'zh': '上方可以查看在「對話」分頁輸入的人物資訊摘要，下方則是依情境分類的提供講解稿。計算出的稱呼會自動套用到對話文中，並支援各講稿的發音播放與全部播放。',
                      'en': 'A summary of the people info entered on the Conversation tab appears '
                            'up top, with situational offer-talk scripts below. The calculated '
                            'terms of address are woven into the dialogue automatically, and each '
                            'script supports pronunciation playback and "Play all".',
                      'ja': '上部には「対話」タブで入力した人物情報の要約が表示され、下部には状況別の提供の話の台本があります。計算された呼び方が対話文に自動的に反映され、台本ごとの発音再生・全部再生にも対応しています。',
                      'de': 'Oben sehen Sie die Zusammenfassung der im Tab Dialog eingegebenen '
                            'Personeninformationen, darunter finden Sie Gesprächsvorschläge für '
                            'verschiedene Situationen. Die berechneten Anredeformen fließen '
                            'automatisch in die Texte ein; jeder Vorschlag unterstützt Einzelaudio '
                            'und „Alles abspielen“.'}}]},
 {'tab_label': {'ko': '어휘', 'zh': '詞彙', 'en': 'Vocabulary', 'ja': '語彙', 'de': 'Wortschatz'},
  'items': [{'name': {'ko': '한자음',
                      'zh': '漢字音',
                      'en': 'Sino-Vietnamese (by rhyme)',
                      'ja': '漢字音',
                      'de': 'Sino-Vietnamesisch'},
             'body': {'ko': '한자어에서 온 베트남어 단어를 소리(운/모음) 계열별로 묶어서 볼 수 있어요. 그룹을 펼쳐 단어별 발음과 뜻을 확인해요.',
                      'zh': '將源自漢字詞的越南語單字，依讀音（韻母／母音）系列分組呈現。展開各組後，可查看各單字的發音與詞義。',
                      'en': 'Sino-Vietnamese words grouped by their rhyme/vowel family. Expand a '
                            "group to see each word's pronunciation and meaning.",
                      'ja': '漢字語に由来するベトナム語の単語を、音（韻・母音）の系列ごとにグループ分けして表示します。グループを開いて、単語ごとの発音と意味を確認できます。',
                      'de': 'Vietnamesische Wörter chinesischen Ursprungs, gruppiert nach Reim- '
                            'bzw. Vokalfamilien. Klappen Sie eine Gruppe auf, um Aussprache und '
                            'Bedeutung der einzelnen Wörter zu sehen.'}},
            {'name': {'ko': '어순반대',
                      'zh': '語序相反',
                      'en': 'Reversed word order',
                      'ja': '語順反対',
                      'de': 'Umgekehrte Wortstellung'},
             'body': {'ko': '한자어 순서와 베트남어 순서가 서로 반대인 단어들을 모은 목록이에요. 다른 어순으로도 쓰이는 경우 단어 끝에 (OO도 '
                            '씀)으로 표시돼요.',
                      'zh': '收錄了漢字詞順序與越南語順序相反的單字清單。若該詞也能以另一種語序使用，會在單字後方以「（也用OO）」標示。',
                      'en': 'A list of words whose Vietnamese syllable order is reversed from the '
                            "Sino-Korean order. Where the reversed order is also used, it's noted "
                            'at the end as "(OO도 씀)".',
                      'ja': '漢字語の順序とベトナム語の順序が逆になっている単語をまとめたリストです。逆の語順でも使われる場合は、単語の末尾に「（OOも使う）」と表示されます。',
                      'de': 'Eine Liste von Wörtern, deren Silbenreihenfolge im Vietnamesischen '
                            'der sino-koreanischen Reihenfolge entgegengesetzt ist. Wenn auch die '
                            'umgekehrte Reihenfolge gebräuchlich ist, wird dies am Ende '
                            'vermerkt.'}},
            {'name': {'ko': '동일음',
                      'zh': '同音',
                      'en': 'Shared syllables',
                      'ja': '同一音',
                      'de': 'Gleichlautend'},
             'body': {'ko': '같은 음절을 공유하는 단어들을 묶어서 보여주는 곳이에요.',
                      'zh': '這裡整理了共用相同音節的單字群組。',
                      'en': 'Words that share a syllable, grouped together.',
                      'ja': '同じ音節を共有する単語をまとめて表示する場所です。',
                      'de': 'Gruppierung von Wörtern, die dieselbe Silbe gemeinsam haben.'}},
            {'name': {'ko': '기본', 'zh': '基本', 'en': 'Basic words', 'ja': '基本', 'de': 'Grundlagen'},
             'body': {'ko': '학습반에서 자주 쓰는 기본 단어 목록이에요.',
                      'zh': '學習班中常用的基本單字清單。',
                      'en': 'Core vocabulary frequently used in class.',
                      'ja': '学習コースでよく使う基本単語のリストです。',
                      'de': 'Liste der im Kurs am häufigsten verwendeten Grundwörter.'}},
            {'name': {'ko': '반의', 'zh': '反義', 'en': 'Antonyms', 'ja': '反意', 'de': 'Gegenteile'},
             'body': {'ko': '뜻이 서로 반대인 단어를 짝(↔)으로 모아 뒀어요.',
                      'zh': '將意思相反的單字以配對（↔）方式收錄。',
                      'en': 'Antonym pairs, connected by "↔".',
                      'ja': '意味が反対の単語をペア（↔）でまとめています。',
                      'de': 'Wortpaare mit gegenteiliger Bedeutung, gekennzeichnet durch „↔“.'}},
            {'name': {'ko': '상용', 'zh': '常用', 'en': 'High-frequency', 'ja': '常用', 'de': 'Häufig'},
             'body': {'ko': '실생활에서 자주 쓰이는 고빈도 단어 목록이에요.',
                      'zh': '日常生活中經常使用的高頻單字清單。',
                      'en': 'A list of words used very frequently in everyday life.',
                      'ja': '日常生活でよく使われる高頻度の単語リストです。',
                      'de': 'Liste besonders häufig gebrauchter Wörter des Alltags.'}},
            {'name': {'ko': '신권',
                      'zh': '神權',
                      'en': 'Theocratic terms',
                      'ja': '神権',
                      'de': 'Theokratisch'},
             'body': {'ko': '여호와의 증인 신권 조직·모임과 관련된 전문 용어를 한자와 함께 알파벳순으로 정리했어요.',
                      'zh': '將與耶和華見證人神權組織、聚會相關的專門用語，連同漢字一起依字母順序整理。',
                      'en': "Terminology related to Jehovah's Witnesses' theocratic organization "
                            'and meetings, listed alphabetically with hanja.',
                      'ja': 'エホバの証人の神権組織や集会に関連する専門用語を、漢字と共にアルファベット順に整理しています。',
                      'de': 'Fachbegriffe im Zusammenhang mit der theokratischen Organisation und '
                            'den Zusammenkünften der Zeugen Jehovas, alphabetisch mit '
                            'Schriftzeichen geordnet.'}},
            {'name': {'ko': '인명', 'zh': '人名', 'en': 'Bible names', 'ja': '人名', 'de': 'Namen'},
             'body': {'ko': '성경에 나오는 사람 이름의 베트남어 표기를 모아 뒀어요.',
                      'zh': '收錄了聖經中人名的越南語寫法。',
                      'en': 'Vietnamese spellings of personal names found in the Bible.',
                      'ja': '聖書に登場する人名のベトナム語表記をまとめています。',
                      'de': 'Vietnamesische Schreibweise von Personennamen aus der Bibel.'}},
            {'name': {'ko': '끝말', 'zh': '接龍', 'en': 'Word chain', 'ja': 'しりとり', 'de': 'Wortketten'},
             'body': {'ko': '단어를 이어가며 익히는 끝말잇기식 어휘예요. 결합어는 어떤 기본 단어들이 합쳐졌는지도 함께 보여줘요.',
                      'zh': '以文字接龍方式串連學習的詞彙。複合詞也會標示是由哪些基本單字組成的。',
                      'en': 'Vocabulary learned in a word-chain style, where compound words also '
                            "show which base words they're built from.",
                      'ja': '単語をつなげながら覚えるしりとり式の語彙です。複合語については、どの基本単語が組み合わさっているかも表示されます。',
                      'de': 'Wortschatzlernen nach dem Prinzip der Wortkette. Bei '
                            'zusammengesetzten Wörtern wird gezeigt, aus welchen Grundwörtern sie '
                            'bestehen.'}},
            {'name': {'ko': '남북 단어',
                      'zh': '南北單字',
                      'en': 'North/South words',
                      'ja': '南北の単語',
                      'de': 'Nord/Süd-Wörter'},
             'body': {'ko': '같은 뜻이라도 북부와 남부에서 다르게 쓰이는 단어를 나란히 비교해서 볼 수 있어요. 각 단어마다 따로 발음을 들을 수 '
                            '있어요.',
                      'zh': '可以並排比較意思相同、但北部與南部用字不同的單字，每個單字都能個別聆聽發音。',
                      'en': 'Words that differ between North and South despite sharing the same '
                            'meaning, shown side by side with a separate pronunciation button for '
                            'each.',
                      'ja': '意味は同じでも北部と南部で使い方が異なる単語を並べて比較できます。各単語ごとに個別に発音を聞くことができます。',
                      'de': 'Wörter mit gleicher Bedeutung, die sich zwischen Nord und Süd '
                            'unterscheiden, im direkten Vergleich mit separater Audioausgabe für '
                            'jedes Wort.'}},
            {'name': {'ko': '파수대',
                      'zh': '守望台',
                      'en': 'Watchtower vocabulary',
                      'ja': '物見の塔',
                      'de': 'Wachtturm'},
             'body': {'ko': '16주 동안 배울 파수대 어휘 목록이에요. 주차별 카드를 펼치면 해당 기간과 단어·예문·번역을 볼 수 있어요.',
                      'zh': '16 週要學的守望台詞彙清單。展開各週卡片，即可查看該期間的單字、例句與翻譯。',
                      'en': "Watchtower-study vocabulary for all 16 weeks. Expand a week's card to "
                            'see its date range along with each word, example, and translation.',
                      'ja': '16週間で学ぶ「ものみの塔」語彙のリストです。週ごとのカードを開くと、その期間と単語・例文・訳を確認できます。',
                      'de': 'Der Wachtturm-Wortschatz für alle 16 Wochen. Klappen Sie eine '
                            'Wochenkarte auf, um Zeitraum, Wörter, Beispielsätze und Übersetzungen '
                            'zu sehen.'}},
            {'name': {'ko': '(탭 공통) 검색과 학습 범위',
                      'zh': '（分頁共通）搜尋與學習範圍',
                      'en': '(Shared) Search & focus range',
                      'ja': '（タブ共通）検索と学習範囲',
                      'de': '(Tab-übergreifend) Suche & Lernbereich'},
             'body': {'ko': '어휘 탭 상단의 검색창은 지금 보고 있는 소분류 안에서 바로 검색해 주고, 16주 과정에서 바로가기로 들어오면 학습 범위 '
                            '배너와 학습 범위내 복습 게임 버튼이 함께 나타나요.',
                      'zh': '詞彙分頁上方的搜尋欄可在目前所在的小分類中立即搜尋，若透過 16 '
                            '週課程的「前往」按鈕進入，畫面上還會同時出現學習範圍提示條與「本範圍複習遊戲」按鈕。',
                      'en': 'The search box at the top of the Vocabulary tab searches within '
                            "whichever subtab you're on, and arriving via a shortcut from the "
                            '16-week course also shows the focus-range banner with its "Review '
                            'Game (This Range Only)" button.',
                      'ja': '語彙タブ上部の検索ボックスは、今見ている小分類内をすぐに検索します。16週コースから「移動」で入ってきた場合は、学習範囲バナーと「この範囲だけの復習ゲーム」ボタンも一緒に表示されます。',
                      'de': 'Die Suchleiste oben im Tab Wortschatz sucht direkt in der aktuellen '
                            'Unterkategorie. Wenn Sie über einen Direktlink aus dem 16-Wochen-Kurs '
                            'kommen, erscheinen das Lernbereichs-Banner und die Schaltfläche für '
                            'das bereichsbezogene Wiederholungsspiel.'}}]},
 {'tab_label': {'ko': '문법', 'zh': '文法', 'en': 'Grammar', 'ja': '文法', 'de': 'Grammatik'},
  'items': [{'name': {'ko': '예문',
                      'zh': '例句',
                      'en': 'Example sentences',
                      'ja': '例文',
                      'de': 'Beispielsätze'},
             'body': {'ko': '문장 구조를 소개하는 도입 카드(베트남어·한국어 어순을 나란히 비교)와, 단원별 예문 카드를 볼 수 있어요. 예문마다 발음 '
                            '듣기, 단원별 전체 듣기를 지원해요.',
                      'zh': '可以查看介紹句子結構的入門卡片（越南語與韓語語序並列比較），以及各單元的例句卡片。每句例句都有發音播放，也支援依單元全部播放。',
                      'en': 'Intro cards comparing Vietnamese and Korean word order side by side, '
                            'plus example-sentence cards by unit -- each sentence has a '
                            'pronunciation button, and each unit its own "Play all".',
                      'ja': '文の構造を紹介する導入カード（ベトナム語・韓国語の語順を並べて比較）と、単元別の例文カードを見ることができます。例文ごとに発音再生、単元ごとの全部再生に対応しています。',
                      'de': 'Einführungskarten zum Satzbau (mit direktem Vergleich der '
                            'Wortstellung) sowie Beispielsatzkarten nach Lektionen. Jeder Satz hat '
                            'eine Audio-Schaltfläche, und jede Lektion lässt sich komplett '
                            'abspielen.'}},
            {'name': {'ko': '특강',
                      'zh': '專題',
                      'en': 'Special topics',
                      'ja': '特別講座',
                      'de': 'Besondere Themen'},
             'body': {'ko': '문법 주제를 다루는 A-Z 사전식 문법 자료예요. 자체 검색창이 있고, 검색하지 않을 때는 연결어·이동 동사·위치 전치사·길 '
                            '찾기 대화문도 함께 볼 수 있어요.',
                      'zh': '這是以 A-Z 字典方式編排的文法主題資料。備有專屬搜尋欄，未搜尋時還能一併查看連接詞、移動動詞、方位介詞及問路對話。',
                      'en': 'A dictionary-style A-Z reference of grammar topics with its own '
                            'search box; when not searching, it also shows connectives, motion '
                            'verbs, position prepositions, and direction-finding dialogues.',
                      'ja': '文法テーマをA-Zの辞書形式で扱う資料です。専用の検索ボックスがあり、検索していないときは接続詞・移動動詞・位置を表す前置詞・道案内の対話文も見ることができます。',
                      'de': 'Ein lexikalisches Nachschlagewerk von A bis Z zu grammatikalischen '
                            'Themen mit eigener Suchleiste. Wenn keine Suche aktiv ist, werden '
                            'Bindewörter, Bewegungsverben, Ortspräpositionen und '
                            'Wegbeschreibungs-Dialoge angezeigt.'}},
            {'name': {'ko': '범용 언어 생성표',
                      'zh': '通用造句表',
                      'en': 'General sentence-building table',
                      'ja': '汎用言語生成表',
                      'de': 'Satzbautabelle'},
             'body': {'ko': '주어·조동사류·동사·장소 등 품사별 단어 목록이에요. 단어마다 발음 듣기, 열(품사)별 전체 듣기를 지원해요.',
                      'zh': '依主詞、助動詞類、動詞、地點等詞性分類的單字清單。每個單字都有發音播放，也支援依欄（詞性）全部播放。',
                      'en': 'Word banks by part of speech -- subjects, auxiliary-type verbs, '
                            'verbs, places -- each word with a pronunciation button, and "Play '
                            'all" per column.',
                      'ja': '主語・助動詞類・動詞・場所などの品詞別単語リストです。単語ごとに発音再生、列（品詞）ごとの全部再生に対応しています。',
                      'de': 'Wortsammlungen nach Wortarten: Subjekte, Hilfsverben, Verben, '
                            'Ortsangaben usw. Jedes Wort hat eine Audio-Schaltfläche, und jede '
                            'Spalte kann komplett abgespielt werden.'}},
            {'name': {'ko': '문장 생성기',
                      'zh': '造句產生器',
                      'en': 'Sentence builder',
                      'ja': '文章生成器',
                      'de': 'Satzgenerator'},
             'body': {'ko': '문장 종류·의문사·접속어·주어·보조동사·동사·목적어·명사·전치사·형용사·부사(상태/장소/시간) 등을 드롭다운으로 고르면(직접 '
                            '입력도 가능) 문장 만들기 버튼으로 한국어 어순 단어가 베트남어 어순으로 움직이는 애니메이션과 함께 문장이 만들어져요.',
                      'zh': '從下拉選單中選擇句型、疑問詞、連接詞、主詞、助動詞、動詞、受詞、名詞、介詞、形容詞、副詞（狀態／地點／時間）等（也可直接輸入），按下「造句」按鈕，就會以韓語語序的單字移動成越南語語序的動畫方式產生句子。',
                      'en': 'Pick from dropdowns for sentence type, question word, connective, '
                            'subject, auxiliary verb, verb, object, noun, preposition, adjective, '
                            'and adverbs (manner/place/time) -- or type your own -- and "Build '
                            'sentence" animates the Korean-order words rearranging into Vietnamese '
                            'word order.',
                      'ja': '文の種類・疑問詞・接続語・主語・助動詞・動詞・目的語・名詞・前置詞・形容詞・副詞（状態／場所／時間）などをドロップダウンで選ぶと（直接入力も可能）、「文を作る」ボタンで韓国語の語順の単語がベトナム語の語順に並び替わるアニメーションと共に文が作られます。',
                      'de': 'Wählen Sie Satzart, Fragewort, Bindewort, Subjekt, Hilfsverb, Verb, '
                            'Objekt, Nomen, Präposition, Adjektiv und Adverbien aus Dropdown-Menüs '
                            '(oder tippen Sie eigene Wörter ein). Ein Klick auf „Satz erstellen“ '
                            'zeigt in einer Animation, wie sich die Wörter in die vietnamesische '
                            'Wortstellung anordnen.'}}]},
 {'tab_label': {'ko': '복습', 'zh': '複習', 'en': 'Review', 'ja': '復習', 'de': 'Wiederholung'},
  'items': [{'name': {'ko': '카테고리 필터',
                      'zh': '分類篩選',
                      'en': 'Category filter',
                      'ja': 'カテゴリーフィルター',
                      'de': 'Kategoriefilter'},
             'body': {'ko': '발음·성경·대화·어휘·문법 중에서 복습할 범위를 고를 수 있어요. 어휘 탭에서 학습 범위내 복습 게임으로 들어오면 그 범위로 '
                            '자동 설정돼요.',
                      'zh': '可以從發音、聖經、對話、詞彙、文法中選擇要複習的範圍。若透過詞彙分頁的「本範圍複習遊戲」進入，會自動設定為該範圍。',
                      'en': 'Pick which pool to review from -- Pronunciation, Bible, Conversation, '
                            'Vocabulary, or Grammar. Arriving via "Review Game (This Range Only)" '
                            'from Vocabulary sets this automatically.',
                      'ja': '発音・聖書・対話・語彙・文法の中から復習する範囲を選べます。語彙タブの「この範囲だけの復習ゲーム」から入ると、その範囲が自動的に設定されます。',
                      'de': 'Wählen Sie den gewünschten Wiederholungsbereich aus Aussprache, '
                            'Bibel, Dialog, Wortschatz oder Grammatik. Wenn Sie über ein '
                            'Wiederholungsspiel aus dem Tab Wortschatz kommen, ist der Bereich '
                            'bereits passend voreingestellt.'}},
            {'name': {'ko': '지역·반복 횟수 설정',
                      'zh': '地區、重複次數設定',
                      'en': 'Dialect & repeat-count settings',
                      'ja': '地域・繰り返し回数の設定',
                      'de': 'Dialekt- & Wiederholungseinstellungen'},
             'body': {'ko': '복습 탭에도 발음 > 설정과 똑같이 연동되는 북부/남부 토글과 베트남어 반복 듣기 횟수 설정이 있어요. 어느 쪽에서 바꾸든 '
                            '함께 바뀌어요.',
                      'zh': '「複習」分頁也和「發音 > 設定」一樣連動，備有北部／南部切換與越南語重複播放次數設定。無論在哪一邊更改，都會同步變更。',
                      'en': 'The Review tab has the same North/South toggle and Vietnamese '
                            'repeat-count setting as Pronunciation > Settings -- change either one '
                            'and both stay in sync.',
                      'ja': '「復習」タブにも「発音 > '
                            '設定」と同じように連動する北部・南部の切り替えと、ベトナム語の繰り返し再生回数の設定があります。どちらで変更しても一緒に変わります。',
                      'de': 'Im Tab Wiederholung finden Sie dieselbe Nord/Süd-Umschaltung und '
                            'Einstellung für vietnamesische Wiederholungen wie unter Aussprache > '
                            'Einstellungen – beide bleiben stets synchron.'}},
            {'name': {'ko': '플래시카드',
                      'zh': '字卡',
                      'en': 'Flashcard',
                      'ja': 'フラッシュカード',
                      'de': 'Karteikarten'},
             'body': {'ko': '카드를 눌러 뒤집으면 뜻이 나오고 동시에 뜻도 읽어 줘요. 이전·다음·섞기·다시 듣기 버튼을 사용할 수 있어요.',
                      'zh': '點選卡片翻面後即可看到詞義，同時也會讀出詞義。可使用上一個、下一個、隨機排列、重新聆聽等按鈕。',
                      'en': "Tap a card to flip it and reveal the meaning -- it's read aloud at "
                            'the same time. Previous, next, shuffle, and replay buttons are all '
                            'available.',
                      'ja': 'カードをタップして裏返すと意味が表示され、同時に意味も読み上げられます。前へ・次へ・シャッフル・もう一度聞くボタンが使えます。',
                      'de': 'Tippen Sie auf eine Karte, um sie umzudrehen und die Bedeutung '
                            'aufzudecken, die gleichzeitig vorgelesen wird. Schaltflächen für '
                            'Zurück, Weiter, Mischen und Nochmal anhören stehen bereit.'}},
            {'name': {'ko': '보기', 'zh': '閱讀', 'en': 'Reading', 'ja': '読解', 'de': 'Ansehen'},
             'body': {'ko': '베트남어 단어·문장이 보이면 알맞은 뜻을 4개 보기 중에서 고르는 모드예요. 맞히거나 틀리거나 다음 문제로 넘어가기 전에 '
                            '정답을 항상 읽어 줘요.',
                      'zh': '看到越南語單字或句子後，從 4 個選項中選出正確詞義的模式。不論答對或答錯，換下一題前都會讀出正確答案。',
                      'en': 'See a Vietnamese word or sentence and pick its meaning from four '
                            'choices. The correct answer is always read aloud before moving to the '
                            'next question, right or wrong.',
                      'ja': 'ベトナム語の単語や文が表示されたら、4つの選択肢の中から正しい意味を選ぶモードです。正解・不正解にかかわらず、次の問題に進む前に必ず正解を読み上げます。',
                      'de': 'Ein vietnamesisches Wort oder ein Satz wird angezeigt, und Sie wählen '
                            'die richtige Bedeutung aus 4 Optionen aus. Vor dem Wechsel zur '
                            'nächsten Frage wird die richtige Lösung immer vorgelesen.'}},
            {'name': {'ko': '듣기', 'zh': '聽力', 'en': 'Listening', 'ja': '聞き取り', 'de': 'Hören'},
             'body': {'ko': '글자 없이 음성만 듣고 알맞은 뜻을 4개 보기 중에서 고르는 모드예요. 맞히거나 틀리거나 다음 문제로 넘어가기 전에 정답을 '
                            '항상 읽어 줘요.',
                      'zh': '不顯示文字，只靠聆聽語音，從 4 個選項中選出正確詞義的模式。不論答對或答錯，換下一題前都會讀出正確答案。',
                      'en': 'Hear the audio with no text shown, and pick the meaning from four '
                            'choices. The correct answer is always read aloud before moving to the '
                            'next question, right or wrong.',
                      'ja': '文字なしで音声だけを聞き、4つの選択肢の中から正しい意味を選ぶモードです。正解・不正解にかかわらず、次の問題に進む前に必ず正解を読み上げます。',
                      'de': 'Es wird kein Text angezeigt, sondern nur die Audiodatei abgespielt. '
                            'Wählen Sie die richtige Bedeutung aus 4 Optionen. Vor der nächsten '
                            'Frage wird die Lösung stets vorgelesen.'}},
            {'name': {'ko': '어순 배열',
                      'zh': '排列語序',
                      'en': 'Word order',
                      'ja': '語順並べ',
                      'de': 'Wortstellung'},
             'body': {'ko': '문제 문장이 제시되면서 음성으로도 읽어 줘요. 베트남어 단어 조각을 순서대로 눌러 담아 문장을 완성하세요. 다시 담기나 '
                            '건너뛰기도 가능하고, 완성하면 자동으로 정답을 확인해줘요.',
                      'zh': '看到題目句子的同時也會朗讀出來。依序點選越南語單字碎片來完成句子。可以重新排列或跳過，完成後會自動核對答案。',
                      'en': 'The prompt sentence is shown and read aloud at the same time. Tap '
                            'Vietnamese word chips in order to build it. You can reset your picks '
                            'or skip, and it checks the answer automatically once complete.',
                      'ja': '問題文が表示されると同時に音声でも読み上げられます。ベトナム語の単語の断片を順番にタップして文を完成させます。やり直しやスキップも可能で、完成すると自動的に正解を確認します。',
                      'de': 'Der Fragesatz wird angezeigt und gleichzeitig vorgelesen. Tippen Sie '
                            'die vietnamesischen Wortbausteine in der richtigen Reihenfolge an, um '
                            'den Satz zu bauen. Sie können zurücksetzen oder überspringen; bei '
                            'Fertigstellung wird das Ergebnis automatisch geprüft.'}},
            {'name': {'ko': '받아쓰기', 'zh': '聽寫', 'en': 'Dictation', 'ja': '書き取り', 'de': 'Diktat'},
             'body': {'ko': '베트남어 음성을 듣고 그대로 받아 적는 모드예요. 다시 듣기 버튼으로 음성을 반복해서 들을 수 있어요.',
                      'zh': '聆聽越南語語音並直接聽寫下來的模式，可用「重新聆聽」按鈕反覆聽取語音。',
                      'en': 'Listen to Vietnamese audio and type exactly what you hear, with a '
                            'replay button to hear it again.',
                      'ja': 'ベトナム語の音声を聞いてそのまま書き取るモードです。もう一度聞くボタンで音声を繰り返し聞くことができます。',
                      'de': 'Hören Sie die vietnamesische Sprachausgabe und tippen Sie das Gehörte '
                            'genau ab. Mit der Wiederholungs-Schaltfläche können Sie die Aufnahme '
                            'mehrfach anhören.'}},
            {'name': {'ko': '(탭 공통) 자동 넘김·단축키·점수',
                      'zh': '（分頁共通）自動切換、快速鍵、分數',
                      'en': '(Shared) Auto-advance, shortcuts & score',
                      'ja': '（タブ共通）自動送り・ショートカット・スコア',
                      'de': '(Tab-übergreifend) Automatisch weiter, Kurzbefehle & Punktzahl'},
             'body': {'ko': '자동 넘김을 켜면 문제(반복 재생 포함)와 정답 음성이 모두 끝난 뒤부터 설정한 시간을 세어 자동으로 다음 문제로 넘어가요. '
                            '플래시카드·보기·듣기·어순 배열 모드에서는 스페이스바나 Enter 키로도 다음으로 넘어갈 수 있고, 보기·듣기에는 맞힌 '
                            '개수를 보여주는 점수 표시도 있어요.',
                      'zh': '開啟自動切換後，會等問題（含重複播放）與正確答案的語音都播完，才開始倒數設定的秒數並自動前往下一題。在字卡、閱讀、聽力、排列語序模式中，也可以用空白鍵或 '
                            'Enter 鍵前往下一題；閱讀、聽力還會顯示答對題數的分數。',
                      'en': 'With auto-advance on, the countdown starts only after both the '
                            'question audio (including repeats) and the answer audio finish, then '
                            'moves to the next card. In Flashcard, Reading, Listening, and Word '
                            'order, the spacebar or Enter key also advances; Reading and Listening '
                            'show a running score of correct answers.',
                      'ja': '自動送りをオンにすると、問題（繰り返し再生を含む）と正解の音声がすべて終わってから設定した時間をカウントし、自動的に次の問題へ進みます。フラッシュカード・読解・聞き取り・語順並べのモードではスペースキーやEnterキーでも次に進むことができ、読解・聞き取りには正解数を示すスコア表示もあります。',
                      'de': 'Bei aktiviertem automatischen Weiterschalten beginnt der Countdown '
                            'erst, wenn Frage- und Antwort-Audiodateien beendet sind, und wechselt '
                            'dann zur nächsten Karte. In den Modi Karteikarten, Ansehen, Hören und '
                            'Wortstellung kann man auch mit der Leertaste oder Enter '
                            'weiterschalten; bei Ansehen und Hören gibt es zudem eine '
                            'Punkteanzeige.'}}]}]
