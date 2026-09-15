# "베트남 문화" subtab -- the 5 culture sidebar articles transcribed verbatim
# from the course booklet (pages 80, 84, 89, 92, 126). These are genuine PDF
# content, not authored content -- the app's first-pass extraction had missed
# them because it was run against an incomplete copy of the PDF.
#
# Translatable Korean text fields (title/subtitle/paragraphs/kr) are stored as
# {"ko","zh","en","ja"} dicts so js_json() (see build_app.py) serializes them straight into JS
# objects that app_logic.js's T() helper can read directly. Vietnamese words (vi) and IPA-style
# Hangul pronunciation hints (ipa) are never translated, and page is a plain structural value.

CULTURE_ARTICLES = [{'title': {'ko': '베트남의 다양한 면 요리',
            'zh': '越南多樣的麵食料理',
            'en': 'Various Noodle Dishes of Vietnam',
            'ja': 'ベトナムの多様な麺料理'},
  'subtitle': {'ko': '내가 먹고 있는 쌀국수는 북부와 남부 중 어디 것일까?',
               'zh': '我吃的河粉是北部的還是南部的呢？',
               'en': "Is the pho I'm eating from the North or the South?",
               'ja': '私が食べているフォーは北部と南部どちらのものだろうか？'},
  'paragraphs': [{'ko': '숙주와 소고기, 개운한 국물에 국수가 한 데 어우러져 개운하고 깔끔한 맛을 내는 쌀국수. 쌀국수는 베트남 사람들이 즐겨먹는 음식으로 면은 조금 두껍고 '
                        '국물도 진한 편입니다. 쌀국수를 먹을 때는 고수 외에 다양한 채소를 넣어 먹으며, 북부 지역에서는 쌀국수에 기다란 튀김 빵을 함께 적셔 먹기도 '
                        '합니다.',
                  'zh': '豆芽菜與牛肉，配上清爽湯頭與麵條融為一體，呈現清爽俐落的滋味，這就是河粉。河粉是越南人喜愛的美食，麵條稍粗，湯頭也偏濃郁。吃河粉時，除了香菜之外還會加入各種蔬菜，在北部地區，人們也會把河粉搭配長條油條一起沾著吃。',
                  'en': 'Bean sprouts and beef come together with noodles in a refreshing broth to create '
                        'the clean, refreshing taste of pho. Pho is a dish loved by the Vietnamese people; '
                        'the noodles are somewhat thick and the broth tends to be rich. When eating pho, '
                        "people add various vegetables besides cilantro, and in the northern region, it's "
                        'also common to dip long fried breadsticks into the pho.',
                  'ja': 'もやしと牛肉、さっぱりとしたスープに麺が絡み合い、さっぱりとして後味の良い味わいを生み出すフォー。フォーはベトナムの人々に愛される料理で、麺はやや太めでスープも濃い目です。フォーを食べる際にはパクチーの他にも様々な野菜を入れて食べ、北部地域ではフォーに長い揚げパンを浸して食べることもあります。'},
                 {'ko': '쌀국수는 원래 하노이 등 베트남 북부 지역 음식이었습니다. 북부 지역은 나라의 근간인 농업을 중요시했기 때문에 소의 도축과 고기 판매를 금지했습니다. '
                        '따라서 육수도 닭고기 뼈를 고아 만들어서 담백한 편이죠.',
                  'zh': '河粉原本是河內等越南北部地區的食物。北部地區因重視作為國家根基的農業，因此禁止屠宰牛隻與販售牛肉，所以湯頭多以雞骨熬煮而成，味道較為清淡。',
                  'en': 'Pho was originally a dish from Hanoi and other parts of northern Vietnam. Because '
                        'the northern region placed great importance on agriculture as the foundation of the '
                        'nation, it banned the slaughter of cattle and the sale of beef. As a result, the '
                        'broth was made by boiling chicken bones, giving it a light, mild flavor.',
                  'ja': 'フォーはもともとハノイなどベトナム北部地域の料理でした。北部地域は国の基盤である農業を重視していたため、牛の屠殺と肉の販売を禁止していました。そのため出汁も鶏の骨を煮込んで作るので、あっさりとした味わいになっています。'},
                 {'ko': '남부 지역의 음식은 주로 단맛이 납니다. 따라서 쌀국수도 국물에서 단맛이 나는 편입니다. 또한 북부와는 다르게 소고기 뼈를 푹 고아 국물을 만들었다고 '
                        '합니다. 라임, 숙주, 여러 향채 등을 섞어 먹을 뿐만 아니라 소스들도 함께 곁들여 먹습니다.',
                  'zh': '南部地區的食物大多帶有甜味，因此河粉的湯頭也偏甜。此外，和北部不同的是，南部的湯頭是用牛骨長時間熬煮而成。吃的時候不僅會加入萊姆、豆芽菜及各種香草，還會搭配各式醬料一起享用。',
                  'en': 'Food in the southern region tends to have a sweet taste, so the broth of pho there '
                        'is also somewhat sweet. Also, unlike in the north, the broth is made by simmering '
                        'beef bones for a long time. People not only mix in lime, bean sprouts, and various '
                        'herbs, but also enjoy it with various dipping sauces.',
                  'ja': '南部地域の食べ物は主に甘みがあります。そのためフォーのスープも甘みがある方です。また北部とは異なり、牛の骨をじっくり煮込んでスープを作るそうです。ライムやもやし、様々な香草を混ぜて食べるだけでなく、ソースも一緒に添えて食べます。'},
                 {'ko': '현재 국내에서도 각양각색의 쌀국수를 맛볼 수 있게 되었는데요, 여러 종류의 소스를 적절히 배합하여 국물과 함께 먹거나, 고기를 찍어 먹기도 하는 '
                        '모습은 마치 베트남 남부 지역의 쌀국수와 비슷한 듯합니다.',
                  'zh': '現在在韓國國內也能品嚐到各式各樣的河粉了。將多種醬料適度調配後配著湯一起吃，或是用來沾肉吃的方式，似乎與越南南部地區的河粉頗為相似。',
                  'en': 'Nowadays, it has become possible to enjoy various kinds of pho here in Korea as '
                        'well. The way people mix different sauces to go with the broth, or dip meat into '
                        'them, seems quite similar to pho from southern Vietnam.',
                  'ja': '現在では韓国国内でも様々な種類のフォーを味わえるようになりました。数種類のソースを適度に配合してスープと一緒に食べたり、肉をつけて食べたりする様子は、まるでベトナム南部地域のフォーに似ているようです。'},
                 {'ko': '여러분은 베트남의 어느 지역 쌀국수를 더 좋아하시나요? 직접 가서 맛보는 것이 가장 좋겠지요?',
                  'zh': '大家比較喜歡越南哪個地區的河粉呢？親自前往品嚐應該是最好的方式吧？',
                  'en': "Which region's pho do you like better? Wouldn't it be best to go and taste it for "
                        'yourself?',
                  'ja': '皆さんはベトナムのどの地域のフォーがお好きですか？やはり直接行って味わってみるのが一番でしょうね？'}],
  'page': 79},
 {'title': {'ko': '베트남의 전통 의상', 'zh': '越南的傳統服飾', 'en': "Vietnam's Traditional Costume", 'ja': 'ベトナムの伝統衣装'},
  'subtitle': {'ko': '형형색색의 화려한 베트남의 아오자이',
               'zh': '五彩繽紛、華麗的越南奧黛',
               'en': "Vietnam's Colorful and Gorgeous Ao Dai",
               'ja': '色とりどりで華やかなベトナムのアオザイ'},
  'paragraphs': [{'ko': '베트남을 배경으로 한 영화를 떠올려 보면 가장 먼저 생각나는 것이 베트남 전통 의상인 아오자이를 입은 날씬한 여성일 것입니다. 베트남어로 '
                        "'아오(áo)'는 '옷', '자이(dài)'는 '길다'라는 뜻입니다. 즉 이름에서도 옷의 형태를 알 수 있죠.",
                  'zh': '若想到以越南為背景的電影，最先浮現腦海的大概就是身穿越南傳統服飾奧黛的苗條女性吧。在越南語中，「áo」意為「衣服」，「dài」意為「長」，也就是說，光從名稱就能看出這件衣服的形狀。',
                  'en': 'When you think of a movie set in Vietnam, the first thing that likely comes to mind '
                        "is a slender woman wearing the Ao Dai, Vietnam's traditional dress. In Vietnamese, "
                        '"áo" means "clothing" and "dài" means "long" — so the shape of the garment can be '
                        'understood just from its name.',
                  'ja': 'ベトナムを舞台にした映画を思い浮かべると、真っ先に思い浮かぶのはベトナムの伝統衣装アオザイを着た細身の女性ではないでしょうか。ベトナム語で「áo（アオ）」は「服」、「dài（ザイ）」は「長い」という意味です。つまり名前からも服の形がわかるのです。'},
                 {'ko': '아오자이의 상의는 보통 다리까지 내려올 정도로 길고, 하의는 통바지 형태로 되어 있습니다. 언뜻 보면 중국의 치파오와 비슷해 보이지만, 안에 통이 '
                        '넓은 바지를 입는다는 점이 다릅니다. 아오자이는 신체의 사이즈를 18곳이나 재서 만들 정도로 섬세한 옷입니다. 입는 사람의 몸에 꼭 맞으며 아름다운 '
                        '몸의 선이 그대로 드러나 마른 몸매의 베트남 여성들에게 무척 잘 어울리는 옷이기도 합니다.',
                  'zh': '奧黛的上衣通常長至腿部，下身則搭配寬管長褲。乍看之下與中國的旗袍相似，但不同之處在於裡面搭配的是褲管寬鬆的長褲。奧黛是一件相當講究的服裝，製作時甚至需要量測多達18處的身體尺寸。它能完美貼合穿著者的身形，展現出優美的身體曲線，因此也非常適合身材纖瘦的越南女性穿著。',
                  'en': 'The top of the Ao Dai is usually long enough to reach down to the legs, while the '
                        'bottom is worn with wide, straight-cut trousers. At first glance it may look '
                        'similar to the Chinese qipao, but it differs in that wide-legged trousers are worn '
                        'underneath. The Ao Dai is such a delicate garment that as many as 18 body '
                        "measurements are taken to make it. It fits snugly to the wearer's body, revealing "
                        'beautiful body lines, which is why it suits the slender build of Vietnamese women '
                        'so well.',
                  'ja': 'アオザイの上着は普通、脚まで届くほど長く、下は筒型のズボンの形になっています。一見すると中国のチャイナドレスに似ていますが、中にゆったりとしたズボンを履く点が異なります。アオザイは体のサイズを18ヶ所も測って作るほど繊細な服です。着る人の体にぴったり合い、美しい体のラインがそのまま表れるため、細身のベトナム人女性にとても似合う服でもあります。'},
                 {'ko': '베트남의 관공서, 은행, 호텔, 항공사에서의 유니폼, 그리고 결혼식, 입학식, 졸업식 등 특별한 행사가 있을 때 아오자이의 모습을 많이 볼 수 '
                        '있습니다.',
                  'zh': '在越南的政府機關、銀行、飯店、航空公司的制服，以及婚禮、入學典禮、畢業典禮等特別場合，都能經常看到奧黛的身影。',
                  'en': 'You can often see the Ao Dai worn as uniforms at government offices, banks, hotels, '
                        'and airlines in Vietnam, as well as at special occasions such as weddings, entrance '
                        'ceremonies, and graduation ceremonies.',
                  'ja': 'ベトナムの官公庁、銀行、ホテル、航空会社の制服、そして結婚式、入学式、卒業式など特別な行事の際に、アオザイの姿を多く見ることができます。'},
                 {'ko': '그렇다면 베트남에서 아오자이를 입어보고 싶을 때 꼭 신체 사이즈를 전부 재야 할까요? 그렇지는 않습니다. 요즘은 다양한 사이즈의 기성 제품들이 많기 '
                        '때문에 누구나 쉽게 자신의 사이즈에 맞는 아오자이를 구입할 수 있습니다.',
                  'zh': '那麼，如果想在越南試穿奧黛，一定要把身體尺寸全部量一遍嗎？其實不然。現在有許多不同尺寸的成品服裝，任何人都能輕鬆買到適合自己尺寸的奧黛。',
                  'en': 'So, if you want to try wearing an Ao Dai in Vietnam, do you have to have all your '
                        'body measurements taken? Not necessarily. These days there are many ready-made '
                        'products available in various sizes, so anyone can easily purchase an Ao Dai that '
                        'fits them.',
                  'ja': 'それでは、ベトナムでアオザイを着てみたいとき、必ず体のサイズを全部測らなければならないのでしょうか？そうではありません。最近は様々なサイズの既製品が多いため、誰でも簡単に自分のサイズに合ったアオザイを購入することができます。'},
                 {'ko': '하늘거리는 아오자이를 입고, 베트남의 예쁜 관광지에서 멋진 사진을 찍어보는 것은 어떨까요? 베트남 여행의 즐거움 중 하나가 될 것입니다.',
                  'zh': '穿上輕柔飄逸的奧黛，在越南美麗的觀光景點拍幾張美美的照片，如何呢？這將會成為越南旅行樂趣之一。',
                  'en': "How about wearing a flowing Ao Dai and taking some lovely photos at Vietnam's "
                        'beautiful tourist spots? It will surely be one of the joys of traveling in Vietnam.',
                  'ja': 'ふんわりと揺れるアオザイを着て、ベトナムの美しい観光地で素敵な写真を撮ってみるのはいかがでしょうか？ベトナム旅行の楽しみの一つになることでしょう。'}],
  'page': 83},
 {'title': {'ko': '오토바이의 나라 베트남',
            'zh': '摩托車王國越南',
            'en': 'Vietnam, the Country of Motorbikes',
            'ja': 'バイクの国ベトナム'},
  'subtitle': {'ko': '길은 이렇게 건너요!',
               'zh': '這樣過馬路吧！',
               'en': 'This Is How You Cross the Street!',
               'ja': '道はこうやって渡ります！'},
  'paragraphs': [{'ko': '"베트남" 하면 바로 오토바이가 떠오를 만큼 "오토바이의 나라"라고 불리는 것은 많은 분들께서 알고 계실 것 같습니다. 베트남의 오토바이 보유량은 전 '
                        '세계에서 TOP5 안에 들 정도로 엄청난 오토바이 수를 가지고 있습니다. 그럼 베트남은 왜 오토바이를 많이 이용하고 있는 것일까요?',
                  'zh': '一提到「越南」就會馬上聯想到摩托車，相信很多人都知道越南被稱為「摩托車王國」。越南的摩托車保有量在全世界能排進前五名，數量相當驚人。那麼，越南為什麼會這麼廣泛地使用摩托車呢？',
                  'en': 'Many of you probably already know that Vietnam is called "the country of '
                        'motorbikes," since the word "Vietnam" immediately brings motorbikes to mind. '
                        "Vietnam's number of motorbikes is so enormous that it ranks in the top 5 in the "
                        'entire world. So why do Vietnamese people rely on motorbikes so much?',
                  'ja': '「ベトナム」と聞けばすぐにバイクが思い浮かぶほど「バイクの国」と呼ばれていることを、多くの方がご存じかと思います。ベトナムのバイク保有台数は世界でもトップ5に入るほど、とてつもない数を誇っています。それでは、ベトナムはなぜこれほど多くバイクを利用しているのでしょうか？'},
                 {'ko': '첫 번째는 베트남의 도로 사정 때문입니다. 도로가 좁은 편이고, 일방통행도 많아서 베트남에서는 오토바이를 이용하는 것이 시간도 절약되고 편리하기 '
                        '때문입니다. 두 번째는 자동차의 가격이 굉장히 비싸서 오토바이를 많이 이용한다고 합니다.',
                  'zh': '第一個原因是越南的道路狀況。由於道路較為狹窄，加上單行道又多，因此在越南騎乘摩托車既能節省時間又相當便利。第二個原因則是汽車價格非常昂貴，所以人們大多選擇使用摩托車。',
                  'en': "The first reason is Vietnam's road conditions. Since the roads tend to be narrow "
                        'and there are many one-way streets, using a motorbike in Vietnam saves time and is '
                        'convenient. The second reason is that cars are extremely expensive, so many people '
                        'rely on motorbikes instead.',
                  'ja': '一つ目はベトナムの道路事情によるものです。道路が狭い方で、一方通行も多いため、ベトナムではバイクを利用する方が時間の節約にもなり便利だからです。二つ目は自動車の価格が非常に高いため、バイクを多く利用しているそうです。'},
                 {'ko': '이러한 이유들로 오토바이가 정말 많은 베트남! 하지만 여행객들에게는 매우 낯선 풍경이 아닐 수 없습니다. 특히 길을 건널 때 신호등이나 횡단보도가 '
                        '없으면 어디서 어떻게 건너야 할지 매우 고민이 되는데요. 오토바이가 온다고 빨리 건너기 위해서 절대 뛰어서는 안 됩니다. 천천히 걸어가면 오토바이들이 '
                        '잘 피해서 지나갈 것입니다.',
                  'zh': '因為這些原因，越南的摩托車真的非常多！但對旅客來說，這無疑是相當陌生的景象。尤其是過馬路時，如果沒有紅綠燈或斑馬線，該從哪裡、如何過馬路實在讓人十分苦惱。看到摩托車來了，也絕對不能為了快速通過而奔跑。只要慢慢地走，摩托車們自然會巧妙地繞過去。',
                  'en': 'For these reasons, Vietnam truly has an enormous number of motorbikes! But for '
                        'travelers, this can be a very unfamiliar sight. Especially when crossing the street '
                        'where there is no traffic light or crosswalk, it can be quite worrying figuring out '
                        'where and how to cross. You should never run just because a motorbike is coming, '
                        'trying to cross quickly. If you walk slowly and steadily, the motorbikes will '
                        'skillfully avoid you and pass by.',
                  'ja': 'こうした理由から、バイクが本当に多いベトナム！しかし旅行者にとっては非常に見慣れない光景に違いありません。特に道を渡る際、信号や横断歩道がないと、どこでどう渡ればいいのかとても悩んでしまいますよね。バイクが来るからといって急いで渡ろうと走ってはいけません。ゆっくり歩けば、バイクの方がうまく避けて通ってくれます。'},
                 {'ko': '베트남에서만 느낄 수 있는 아주 재밌는 경험일 것입니다.',
                  'zh': '這將會是只有在越南才能體驗到的非常有趣的經歷。',
                  'en': 'It will be a truly fun experience that you can only have in Vietnam.',
                  'ja': 'ベトナムでしか味わえない、とても面白い経験になることでしょう。'}],
  'page': 88},
 {'title': {'ko': '베트남의 기후', 'zh': '越南的氣候', 'en': "Vietnam's Climate", 'ja': 'ベトナムの気候'},
  'subtitle': {'ko': '베트남에서도 두꺼운 점퍼를 입는다고요?',
               'zh': '在越南竟然也要穿厚外套？',
               'en': 'They Wear Thick Jackets in Vietnam Too?',
               'ja': 'ベトナムでも厚手のジャンパーを着るんですか？'},
  'paragraphs': [{'ko': '베트남의 지형은 긴 S자 형태로, 최남단에서 최북단까지의 거리가 1,750km가 될 정도로 상당히 떨어져 있습니다. 이로 인해 지역별 기후 차도 매우 '
                        '뚜렷하게 나타납니다.',
                  'zh': '越南的地形呈長長的S字型，從最南端到最北端的距離長達1,750公里，相隔相當遙遠。因此各地區之間的氣候差異也十分明顯。',
                  'en': "Vietnam's terrain has a long S-shape, with the distance from the southernmost to "
                        'the northernmost point reaching as much as 1,750km. Because of this, the climate '
                        'differences between regions are very pronounced.',
                  'ja': 'ベトナムの地形は長いS字型をしており、最南端から最北端までの距離が1,750kmにもなるほどかなり離れています。そのため地域ごとの気候差も非常にはっきりと現れます。'},
                 {'ko': '베트남의 북부 지역은 한국과 비슷하게 사계절이 있습니다. 봄과 가을은 상대적으로 짧은 편이나 겨울에는 눈이 오는 지역도 있을 만큼 기온도 많이 '
                        '내려갑니다. 현지인들이 두꺼운 점퍼를 입고 다니는 모습을 흔하게 볼 수 있습니다.',
                  'zh': '越南北部地區和韓國一樣有四季之分。春季和秋季相對較短，但冬季氣溫下降得相當多，甚至有些地區會下雪。因此經常可以看到當地人穿著厚外套出門的樣子。',
                  'en': 'Northern Vietnam has four distinct seasons, similar to Korea. Spring and fall are '
                        'relatively short, but in winter the temperature drops quite a lot — enough that '
                        "some areas even get snow. It's common to see locals walking around in thick "
                        'jackets.',
                  'ja': 'ベトナムの北部地域は韓国と同じように四季があります。春と秋は比較的短いですが、冬には雪が降る地域もあるほど気温もかなり下がります。現地の人が厚手のジャンパーを着て歩いている姿をよく見かけます。'},
                 {'ko': '중부 지역 중에는 고원 지대가 있는 지역이 많은데, 이 고원 지대는 이름처럼 높이 위치해 있기 때문에 비교적 서늘한 기후를 보입니다. 이 서늘한 '
                        '기후로 인해 베트남의 커피와 같은 여러 작물 등을 많이 재배하는 지역이기도 합니다. 한국 가을~초겨울 정도의 날씨로 시원하고 선선하여 여행을 즐기기에 '
                        '아주 좋은 지역입니다.',
                  'zh': '中部地區有許多高原地帶，這些高原地帶正如其名，因地勢較高，氣候相對涼爽。也因為這種涼爽的氣候，這裡也是種植越南咖啡等多種作物的重要地區。氣溫大約如韓國的秋末到初冬般涼爽宜人，是非常適合享受旅行的地區。',
                  'en': 'Many areas in central Vietnam have highland regions, and as the name suggests, '
                        'these highlands sit at higher elevations, giving them a relatively cool climate. '
                        'Because of this cool climate, the region is also where many crops, such as '
                        'Vietnamese coffee, are widely cultivated. With weather similar to autumn through '
                        'early winter in Korea, it is cool and pleasant, making it a great region to enjoy '
                        'traveling.',
                  'ja': '中部地域には高原地帯がある地域が多く、この高原地帯は名前の通り高い場所に位置しているため、比較的涼しい気候を示します。この涼しい気候のおかげで、ベトナムコーヒーをはじめとする様々な作物を多く栽培している地域でもあります。韓国の秋から初冬くらいの気候で涼しく爽やかなため、旅行を楽しむにはとても良い地域です。'},
                 {'ko': '호찌민시를 중심으로 한 남부 지역은 전형적인 동남아 날씨입니다. 평균 기온은 27~30도이며, 건기와 우기로 계절을 나눌 수 있습니다. 건기는 한국의 '
                        '여름과 비교할 수 없을 정도로 햇볕이 뜨겁습니다. 우기가 되면 게릴라성 폭우가 하루에도 몇 번씩 내려, 베트남 사람들은 우기에 꼭 우비를 가지고 '
                        '다니곤 합니다.',
                  'zh': '以胡志明市為中心的南部地區屬於典型的東南亞氣候。平均氣溫為27～30度，可分為乾季和雨季。乾季時的陽光炎熱程度是韓國夏天無法比擬的。到了雨季，一天之內可能會下好幾次遊擊式暴雨，因此越南人在雨季時總是隨身攜帶雨衣。',
                  'en': 'The southern region, centered around Ho Chi Minh City, has a typical Southeast '
                        'Asian climate. The average temperature is 27-30°C, and the seasons can be divided '
                        'into a dry season and a rainy season. During the dry season, the sun is scorching '
                        'hot — far beyond anything comparable to Korean summers. When the rainy season '
                        'comes, sudden guerrilla-style downpours can occur several times a day, so '
                        'Vietnamese people always carry a raincoat during the rainy season.',
                  'ja': 'ホーチミン市を中心とした南部地域は典型的な東南アジアの気候です。平均気温は27～30度で、乾季と雨季に季節を分けることができます。乾季は韓国の夏とは比べ物にならないほど日差しが強烈です。雨季になるとゲリラ豪雨が一日に何度も降るため、ベトナムの人々は雨季には必ずレインコートを持ち歩きます。'}],
  'page': 91},
 {'title': {'ko': '베트남어와 한자', 'zh': '越南語與漢字', 'en': 'Vietnamese and Chinese Characters', 'ja': 'ベトナム語と漢字'},
  'subtitle': {'ko': '60% 이상이 한자어로 구성된 베트남어',
               'zh': '60%以上由漢字詞構成的越南語',
               'en': 'Vietnamese: Over 60% Made Up of Sino-Vietnamese Words',
               'ja': '60％以上が漢字語で構成されたベトナム語'},
  'paragraphs': [{'ko': '베트남어를 공부하시는 분들이라면 신기한 발견을 하셨을 것 같습니다. 바로 베트남어의 60% 정도가 한자 베트남어로 이루어졌다는 사실입니다.',
                  'zh': '如果是正在學習越南語的朋友，應該會有一個令人驚奇的發現，那就是越南語中約有60%是由漢越詞（漢字詞）所構成的。',
                  'en': "If you're studying Vietnamese, you've probably made an interesting discovery — the "
                        'fact that about 60% of Vietnamese vocabulary is made up of Sino-Vietnamese words.',
                  'ja': 'ベトナム語を勉強している方なら、興味深い発見をされたのではないでしょうか。それはベトナム語の約60％が漢字ベトナム語（漢越語）で構成されているという事実です。'},
                 {'ko': '베트남은 중국의 영향으로 한자음이 발달되어 있는 언어입니다. 그래서 베트남어의 글자는 로마자로 표기하고 있지만 한자음과 상당히 비슷한 부분이 많이 '
                        '있습니다.',
                  'zh': '越南語受中國影響，發展出許多漢字音，因此雖然越南語的文字是以羅馬字標記，但其中有不少部分與漢字讀音相當相似。',
                  'en': 'Due to Chinese influence, Vietnamese developed Sino-Vietnamese pronunciations. So '
                        'even though Vietnamese is written using the Roman alphabet, there are many parts of '
                        'it that sound quite similar to Chinese character pronunciations.',
                  'ja': 'ベトナムは中国の影響で漢字音が発達している言語です。そのためベトナム語の文字はローマ字で表記されていますが、漢字音とかなり似ている部分が多くあります。'},
                 {'ko': '예를 들어 드릴게요!',
                  'zh': '舉個例子給大家看吧！',
                  'en': 'Let me give you an example!',
                  'ja': '例を挙げてみますね！'},
                 {'ko': 'sinh hoạt [씽 호앋] 생활 / xã hội [싸 호이] 사회 / quan tâm [꽌떰] 관심',
                  'zh': 'sinh hoạt [씽 호앋] 生活 / xã hội [싸 호이] 社會 / quan tâm [꽌떰] 關心',
                  'en': 'sinh hoạt [씽 호앋] life/living / xã hội [싸 호이] society / quan tâm [꽌떰] '
                        'interest/concern',
                  'ja': 'sinh hoạt [씽 호앋] 生活 / xã hội [싸 호이] 社会 / quan tâm [꽌떰] 関心'},
                 {'ko': '위 단어들을 보시면 발음이 상당히 비슷한 것을 아셨을 텐데요. 물론 베트남어는 성조가 있어서 성조에 따라 그 뜻이 달라지지만 음은 같기 때문에 처음 '
                        '보는 단어일지라도 음으로 유추할 수가 있습니다.',
                  'zh': '看了上面的單字，大家應該會發現發音相當相似吧。當然，越南語有聲調之分，發音會因聲調不同而意思有所改變，但由於音節本身相同，就算是第一次見到的單字，也能透過發音來推測其意思。',
                  'en': "Looking at the words above, you've probably noticed how similar the pronunciations "
                        'are. Of course, Vietnamese has tones, so the meaning changes depending on the tone, '
                        'but since the base sound is the same, you can guess the meaning through sound even '
                        "for words you're seeing for the first time.",
                  'ja': '上の単語をご覧になると、発音がかなり似ていることにお気づきでしょう。もちろんベトナム語には声調があるため、声調によって意味が変わりますが、音自体は同じなので、初めて見る単語でも音から意味を推測することができます。'},
                 {'ko': '베트남어 공부 어렵게만 생각했는데, 이렇게 보니 베트남어 공부가 조금은 쉽게 느껴지지는 않으신가요?',
                  'zh': '原本以為越南語很難學，但這樣看下來，是不是覺得學越南語稍微變得簡單一些了呢？',
                  'en': 'You may have thought studying Vietnamese was only difficult, but seeing it this '
                        "way, doesn't it feel a little easier now?",
                  'ja': 'ベトナム語の勉強は難しいとばかり思っていましたが、こうして見てみるとベトナム語の勉強が少し簡単に感じられませんか？'}],
  'page': 125}]

CULTURE_HANJA_EXAMPLES = [{'vi': 'sinh hoạt', 'ipa': '씽 호앋', 'kr': {'ko': '생활', 'zh': '生活', 'en': 'Life', 'ja': '生活'}},
 {'vi': 'xã hội', 'ipa': '싸 호이', 'kr': {'ko': '사회', 'zh': '社會', 'en': 'Society', 'ja': '社会'}},
 {'vi': 'quan tâm', 'ipa': '꽌떰', 'kr': {'ko': '관심', 'zh': '關心', 'en': 'Interest', 'ja': '関心'}}]
