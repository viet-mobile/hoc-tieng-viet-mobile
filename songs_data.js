// Updated from Songs(3).xlsx; D41 restored from Songs(2).xlsx on all sheets.
const SONGS_DATA = [
  {
    "number": 1,
    "sourceSheet": "1",
    "labels": {
      "vi": "BÀI HÁT 1",
      "ko": "1번",
      "zh": "詩歌第1首",
      "en": "SONG 1",
      "ja": "1番"
    },
    "title": {
      "vi": "Các đức tính của Đức Giê-hô-va",
      "ko": "여호와의 속성",
      "zh": "耶和華的美德",
      "en": "Jehovah's Attributes",
      "ja": "エホバとはどんな方か"
    },
    "scripture": {
      "vi": "(Khải huyền 4:11)",
      "ko": "(요한 계시록 4:11)",
      "zh": "（啟示錄4:11）",
      "en": "(Revelation 4:11)",
      "ja": "（啓示 4:11）"
    },
    "lines": [
      {
        "vi": "1. Thật Cha Giê-hô-va sức mạnh ai sánh bằng,",
        "ko": "1. 오, 전능하신 우리 하느님,",
        "zh": "1．偉大耶和華，全能的上帝，",
        "en": "1. Jehovah our God, exalted in might,",
        "ja": "1. 創造者 神エホバ"
      },
      {
        "vi": "vì muôn sự sống và nguồn ánh sáng đến từ Cha.",
        "ko": "생명과 빛을 주신 여호와여,",
        "zh": "你帶來光明，賜予生命氣息。",
        "en": "Creator of life and Provider of light.",
        "ja": "大宇宙 造り出した"
      },
      {
        "vi": "Vạn vật biểu dương quyền năng Cha vĩ đại thay!",
        "ko": "하늘과 땅 모두 영원토록",
        "zh": "萬物訴說你的無限能力，",
        "en": "Creation speaks of your power so grand;",
        "ja": "天地に住む全ては"
      },
      {
        "vi": "Nên trời và đất sẽ mãi luôn trường tồn.",
        "ko": "그 크신 능력 알리리다.",
        "zh": "憑你的雙手天地屹立。",
        "en": "The heavens and earth forever stand.",
        "ja": "心からたたえる"
      },
      {
        "vi": "2. Lập ngôi cao vững bền trên nền công lý ngài,",
        "ko": "2. 주 다스림은 늘 공의롭고",
        "zh": "2．你天上寶座以公正確立，",
        "en": "2. Your heavenly throne, on justice it stands.",
        "ja": "2. 公正な王エホバ"
      },
      {
        "vi": "ngài ban luật chính trực cho tôi tớ biết đường ngay.",
        "ko": "가르쳐 주신 계명 의로우니",
        "zh": "正義的命令樂意向人顯明。",
        "en": "To us you make known all your righteous commands.",
        "ja": "真実を教えている"
      },
      {
        "vi": "Hằng ngày tra xem Kinh Thánh thấy rõ ràng hơn",
        "ko": "주의 말씀 펴서 살펴보면",
        "zh": "你的話語給人光明指引，",
        "en": "And as we turn to your Word, we can see",
        "ja": "あなたの書 読むたびに"
      },
      {
        "vi": "muôn vàn sự khôn ngoan của Giê-hô-va.",
        "ko": "그 깊은 지혜 보리이다.",
        "zh": "蘊含的智慧探索不盡。",
        "en": "Your wisdom revealed so brilliantly.",
        "ja": "光る知恵 見つける"
      },
      {
        "vi": "3. Tình yêu thương của ngài cao trọng hơn tất cả,",
        "ko": "3. 주 완전하고 큰 사랑으로",
        "zh": "3．你表現的愛完美又無瑕，",
        "en": "3. The greatest of all is your perfect love.",
        "ja": "3. 愛の神 父エホバ"
      },
      {
        "vi": "và không gì sánh bằng quà vô giá đến từ Cha.",
        "ko": "비할 데 없는 선물 주셨으니",
        "zh": "豐盛的福分總是慷慨賜下。",
        "en": "Beyond all compare are your gifts from above.",
        "ja": "たくさんの愛 下さる"
      },
      {
        "vi": "Nguyện cùng ca khen bao đức tính tốt lành Cha,",
        "ko": "주의 속성, 영화로운 이름",
        "zh": "我要高歌稱頌你的美德，",
        "en": "Your attributes and your glorious name,",
        "ja": "喜びに満たされて"
      },
      {
        "vi": "rao truyền và tôn vinh thánh danh của ngài.",
        "ko": "늘 기쁨으로 알리리다.",
        "zh": "將你的聖名傳遍全地。",
        "en": "With joy and with zeal, we will proclaim.",
        "ja": "神の名を知らせる"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 36:9; 145:6-13; Truyền 3:14; Gia 1:17).",
      "ko": "(시 36:9; 145:6-13; 전도 3:14; 야고보 1:17 참조)",
      "zh": "（參看詩36:9；145:6-13；傳3:14；雅1:17）",
      "en": "(See also Ps. 36:9; 145:6-13; Eccl. 3:14; Jas. 1:17.)",
      "ja": "（詩 36:9; 145:6-13; 伝 3:14; ヤコ 1:17も参照。）"
    }
  },
  {
    "number": 2,
    "sourceSheet": "2",
    "labels": {
      "vi": "BÀI HÁT 2",
      "ko": "2번",
      "zh": "詩歌第2首",
      "en": "SONG 2",
      "ja": "2番"
    },
    "title": {
      "vi": "Giê-hô-va là danh Cha",
      "ko": "주의 이름 여호와",
      "zh": "你的名是耶和華",
      "en": "Jehovah Is Your Name",
      "ja": "あなたの名はエホバ"
    },
    "scripture": {
      "vi": "(Thi thiên 83:18)",
      "ko": "(시편 83:18)",
      "zh": "（詩篇83:18）",
      "en": "(Psalm 83:18)",
      "ja": "（詩編 83:18）"
    },
    "lines": [
      {
        "vi": "1. Vật muôn nơi Cha tạo ra",
        "ko": "1. 만물을 지으신",
        "zh": "1．永恆的耶和華，",
        "en": "1. The living and true God—",
        "ja": "1. 天地全て "
      },
      {
        "vi": "biểu dương khôn ngoan, uy quyền Cha.",
        "ko": "살아 계신 하느님,",
        "zh": "萬物都因你存在。",
        "en": "The God of all creation",
        "ja": "創造された"
      },
      {
        "vi": "Từ xưa qua bao đời ghi nhớ",
        "ko": "영원토록 기억될",
        "zh": "你的名從不更改，",
        "en": "In ev'ry generation—",
        "ja": "永遠の神 "
      },
      {
        "vi": "về thánh danh Giê-hô-va.",
        "ko": "주 이름 여호와.",
        "zh": "流傳千秋萬代。",
        "en": "Jehovah is your name.",
        "ja": "それはエホバ"
      },
      {
        "vi": "Mừng vui khi mang đặc ân",
        "ko": "주의 회중 되는",
        "zh": "我們多麼榮幸，",
        "en": "We're honored and we're proud",
        "ja": "あなたの名を"
      },
      {
        "vi": "sánh vai chung tay cùng dân Chúa.",
        "ko": "큰 영예 주셨으니",
        "zh": "成為你名下子民，",
        "en": "To be your congregation.",
        "ja": "誇りに思い"
      },
      {
        "vi": "Đến muôn nơi, cho dù xa gần,",
        "ko": "주 영광 알리는 일",
        "zh": "向人宣揚你聖名，",
        "en": "In ev'ry tribe and nation,",
        "ja": "広く告げます "
      },
      {
        "vi": "truyền rao danh Cha thánh khiết.",
        "ko": "온 힘 다하리다.",
        "zh": "榮耀讚美上帝。",
        "en": "Your glory we proclaim.",
        "ja": "心込めて"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Giê-hô-va, Giê-hô-va,",
        "ko": "여호와, 여호와,",
        "zh": "耶和華，耶和華，",
        "en": "Jehovah, Jehovah,",
        "ja": "エホバ エホバ "
      },
      {
        "vi": "là Đấng Tối Cao muôn đời.",
        "ko": "오, 주와 같은 분",
        "zh": "沒有別神像你。",
        "en": "There is no God like you.",
        "ja": "あなただけが"
      },
      {
        "vi": "Nơi tầng trời cao hay là mặt đất,",
        "ko": "땅과 하늘 어디에도",
        "zh": "天地之間你是唯一，",
        "en": "There's no other in the heavens",
        "ja": "全てを治める"
      },
      {
        "vi": "chỉ có Cha không ai bằng.",
        "ko": "결코 없나이다.",
        "zh": "誰能與你相比？",
        "en": "Or on the earth below.",
        "ja": "至高の神"
      },
      {
        "vi": "Thần gian dối sao so được với Cha,",
        "ko": "모두가 알게 하소서,",
        "zh": "全人類都當稱頌你，",
        "en": "You alone are God Almighty,",
        "ja": "地上に輝く "
      },
      {
        "vi": "người người muôn nơi phải biết.",
        "ko": "주 전능한 능력.",
        "zh": "至高全能上帝。",
        "en": "And this all men must know.",
        "ja": "その栄光"
      },
      {
        "vi": "Giê-hô-va, Giê-hô-va,",
        "ko": "여호와, 여호와,",
        "zh": "耶和華，耶和華，",
        "en": "Jehovah, Jehovah,",
        "ja": "エホバ エホバ "
      },
      {
        "vi": "thành kính ca khen danh Cha đời đời.",
        "ko": "여호와만 섬기리다.",
        "zh": "你永遠是獨一上帝。",
        "en": "We have no other God but you.",
        "ja": "あなただけが神"
      },
      {
        "vi": "2. Trở nên như công cụ Cha,",
        "ko": "2. 주께서 원하는",
        "zh": "2．永恆的耶和華",
        "en": "2. You cause us to become",
        "ja": "2. 望むものに"
      },
      {
        "vi": "chúng con luôn vâng theo lệnh Cha,",
        "ko": "무엇이든 되도록",
        "zh": "能按照自己心意，",
        "en": "Whatever you desire,",
        "ja": "人をならせる"
      },
      {
        "vi": "thực thi bao nhiêu điều Cha muốn,",
        "ko": "우리를 도우시는",
        "zh": "賜我們所需能力，",
        "en": "To do as you require—",
        "ja": "全能の神 "
      },
      {
        "vi": "làm thánh danh Giê-hô-va.",
        "ko": "주 이름 여호와.",
        "zh": "達成偉大旨意。",
        "en": "Jehovah is your name.",
        "ja": "それはエホバ"
      },
      {
        "vi": "Nhờ Cha yêu thương, từ nhân,",
        "ko": "주의 증인 되는",
        "zh": "我們多麼感恩，",
        "en": "And Witnesses for you",
        "ja": "あなたの名を"
      },
      {
        "vi": "chúng con mang danh hiệu Nhân Chứng.",
        "ko": "친절 베푸셨으니",
        "zh": "擁有這獨特身分，",
        "en": "Is what you've kindly named us.",
        "ja": "語る名誉を"
      },
      {
        "vi": "Sướng vui, hân hoan và vinh dự",
        "ko": "그 이름 지닌 우린",
        "zh": "為你的名作見證，",
        "en": "We're honored you have claimed us—",
        "ja": "今 心から"
      },
      {
        "vi": "làm dân mang danh thánh Chúa.",
        "ko": "주 백성입니다.",
        "zh": "敬奉崇拜真神。",
        "en": "A people for your name.",
        "ja": "感謝します"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Giê-hô-va, Giê-hô-va,",
        "ko": "여호와, 여호와,",
        "zh": "耶和華，耶和華，",
        "en": "Jehovah, Jehovah,",
        "ja": "エホバ エホバ "
      },
      {
        "vi": "là Đấng Tối Cao muôn đời.",
        "ko": "오, 주와 같은 분",
        "zh": "沒有別神像你。",
        "en": "There is no God like you.",
        "ja": "あなただけが"
      },
      {
        "vi": "Nơi tầng trời cao hay là mặt đất,",
        "ko": "땅과 하늘 어디에도",
        "zh": "天地之間你是唯一，",
        "en": "There's no other in the heavens",
        "ja": "全てを治める"
      },
      {
        "vi": "chỉ có Cha không ai bằng.",
        "ko": "결코 없나이다.",
        "zh": "誰能與你相比？",
        "en": "Or on the earth below.",
        "ja": "至高の神"
      },
      {
        "vi": "Thần gian dối sao so được với Cha,",
        "ko": "모두가 알게 하소서,",
        "zh": "全人類都當稱頌你，",
        "en": "You alone are God Almighty,",
        "ja": "地上に輝く "
      },
      {
        "vi": "người người muôn nơi phải biết.",
        "ko": "주 전능한 능력.",
        "zh": "至高全能上帝。",
        "en": "And this all men must know.",
        "ja": "その栄光"
      },
      {
        "vi": "Giê-hô-va, Giê-hô-va,",
        "ko": "여호와, 여호와,",
        "zh": "耶和華，耶和華，",
        "en": "Jehovah, Jehovah,",
        "ja": "エホバ エホバ "
      },
      {
        "vi": "thành kính ca khen danh Cha đời đời.",
        "ko": "여호와만 섬기리다.",
        "zh": "你永遠是獨一上帝。",
        "en": "We have no other God but you.",
        "ja": "あなただけが神"
      }
    ],
    "reference": {
      "vi": "(Cũng xem 2 Sử 6:14; Thi 72:19; Ê-sai 42:8).",
      "ko": "(역대기하 6:14; 시 72:19; 이사야 42:8 참조)",
      "zh": "（參看代下6:14；詩72:19；賽42:8）",
      "en": "(See also 2 Chron. 6:14; Ps. 72:19; Isa. 42:8.)",
      "ja": "（代二 6:14; 詩 72:19; イザ 42:8も参照。）"
    }
  },
  {
    "number": 3,
    "sourceSheet": "3",
    "labels": {
      "vi": "BÀI HÁT 3",
      "ko": "3번",
      "zh": "詩歌第3首",
      "en": "SONG 3",
      "ja": "3番"
    },
    "title": {
      "vi": "Sức mạnh, hy vọng và niềm tin cậy của chúng con",
      "ko": "우리의 힘, 희망, 확신",
      "zh": "我的依靠、希望和力量",
      "en": "Our Strength, Our Hope, Our Confidence",
      "ja": "私たちの力，希望，確信"
    },
    "scripture": {
      "vi": "(Châm ngôn 14:26)",
      "ko": "(잠언 14:26)",
      "zh": "（箴言14:26）",
      "en": "(Proverbs 14:26)",
      "ja": "（格言 14:26）"
    },
    "lines": [
      {
        "vi": "1. Giê-hô-va, ngài đã ban cho mọi dân",
        "ko": "1. 여호와여, 가슴 설레는 ",
        "zh": "1．耶和華你賜予的希望，",
        "en": "1. O Jehovah, you have given us",
        "ja": "1. エホバよ あなたから"
      },
      {
        "vi": "tương lai ngời sáng biết bao,",
        "ko": "이 희망 주시니",
        "zh": "我們緊握不放。",
        "en": "a hope that we hold dear.",
        "ja": "得た慰め"
      },
      {
        "vi": "là niềm hy vọng chúng con hằng mong",
        "ko": "온 세상이 다 듣도록 ",
        "zh": "渴望與所有人分享，",
        "en": "It's a hope we find so thrilling",
        "ja": "たくさんの人に"
      },
      {
        "vi": "và muốn rao ra khắp nơi.",
        "ko": "기뻐 외칩니다.",
        "zh": "未來美好盼望。",
        "en": "we want the world to hear.",
        "ja": "分けたいのに"
      },
      {
        "vi": "Vậy nhưng nay, nhiều lúc chúng con phiền lo,",
        "ko": "하지만 삶이 힘겨울 때 ",
        "zh": "但有時憂慮讓人心慌，",
        "en": "But at times this life's anxieties",
        "ja": "時には苦しくて"
      },
      {
        "vi": "lòng hoang mang vì lắm gian nan.",
        "ko": "지치고 두려워서",
        "zh": "喜樂被恐懼隱藏。",
        "en": "are the cause of fears within,",
        "ja": "心は重く"
      },
      {
        "vi": "Niềm trông mong mà chính Cha tặng ban",
        "ko": "밝게 타오르던 희망 ",
        "zh": "希望曾經照亮心房，",
        "en": "And the hope that burned so brightly",
        "ja": "明るい希望の火も"
      },
      {
        "vi": "dần tắt qua từng tháng ngày.",
        "ko": "희미해집니다.",
        "zh": "如今黯淡無光。",
        "en": "has suddenly grown dim.",
        "ja": "消えそう"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Giê-hô-va luôn dẫn dắt,",
        "ko": "내게 희망과 힘, ",
        "zh": "你是我的依靠、",
        "en": "You're our strength, you're our hope,",
        "ja": "力 希望 "
      },
      {
        "vi": "ban sức mới không thôi.",
        "ko": "확신 주시며",
        "zh": "希望和力量，",
        "en": "you're our confidence.",
        "ja": "確信は"
      },
      {
        "vi": "Chúng con tin cậy Cha hằng ở bên.",
        "ko": "부족함 채워 주시니",
        "zh": "我的需要你不遺忘。",
        "en": "Whatever we lack, you supply.",
        "ja": "あなたからのもの"
      },
      {
        "vi": "Chẳng lung lay, tin chắc chắn",
        "ko": "당신의 도움을 ",
        "zh": "滿懷信心將",
        "en": "When we preach, when we teach,",
        "ja": "どんなときも"
      },
      {
        "vi": "khi rao tin cứu rỗi.",
        "ko": "확신합니다,",
        "zh": "真理向人宣揚，",
        "en": "we have confidence",
        "ja": "頼るなら"
      },
      {
        "vi": "Hướng trông đến tương lai sáng huy hoàng.",
        "ko": "오 나의 희망 여호와!",
        "zh": "因你時刻在我身旁。",
        "en": "because it's on you we rely.",
        "ja": "また強くなれる"
      },
      {
        "vi": "2. Cầu xin Cha hãy giúp chúng con đừng quên",
        "ko": "2. 여호와여, 도와주소서, ",
        "zh": "2．耶和華當我陷入困境，",
        "en": "2. So Jehovah, please instill in us",
        "ja": "2. つらいときはいつも "
      },
      {
        "vi": "Cha vẫn trợ giúp, ủi an.",
        "ko": "늘 잊지 않도록,",
        "zh": "求你使我想起，",
        "en": "a heart that won't forget,",
        "ja": "ずっとそばで"
      },
      {
        "vi": "Dù chông gai, thử thách, không hề chi,",
        "ko": "힘겨울 때 내게 주신 ",
        "zh": "真正安慰全來自你，",
        "en": "For you've always been our comfort",
        "ja": "慰めてくれた"
      },
      {
        "vi": "vì có Cha Giê-hô-va.",
        "ko": "따뜻한 위로를.",
        "zh": "你會賜我勇氣。",
        "en": "when troubled times we've met.",
        "ja": "あなたのこと"
      },
      {
        "vi": "Nhờ trông mong và nhớ phước ân ngài ban,",
        "ko": "희망의 빛 되살려 주는 ",
        "zh": "原本將滅的希望之光，",
        "en": "And these thoughts that lift and strengthen us",
        "ja": "忘れないでいれば "
      },
      {
        "vi": "niềm tin nơi ngài cứ thêm lên.",
        "ko": "소중한 그 기억들,",
        "zh": "又重新點燃綻放。",
        "en": "can revive that dying flame,",
        "ja": "希望の光"
      },
      {
        "vi": "Lòng hăng say truyền bá danh ngài ra,",
        "ko": "여호와의 이름 전할 ",
        "zh": "內心再次振作堅強，",
        "en": "For they fill our hearts with courage",
        "ja": "また明るくなり "
      },
      {
        "vi": "bừng cháy hy vọng sáng ngời.",
        "ko": "용기를 줍니다.",
        "zh": "將你聖名傳講。",
        "en": "to speak about your name.",
        "ja": "勇気出せる"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Giê-hô-va luôn dẫn dắt,",
        "ko": "내게 희망과 힘, ",
        "zh": "你是我的依靠、",
        "en": "You're our strength, you're our hope,",
        "ja": "力 希望 "
      },
      {
        "vi": "ban sức mới không thôi.",
        "ko": "확신 주시며",
        "zh": "希望和力量，",
        "en": "you're our confidence.",
        "ja": "確信は"
      },
      {
        "vi": "Chúng con tin cậy Cha hằng ở bên.",
        "ko": "부족함 채워 주시니",
        "zh": "我的需要你不遺忘。",
        "en": "Whatever we lack, you supply.",
        "ja": "あなたからのもの"
      },
      {
        "vi": "Chẳng lung lay, tin chắc chắn",
        "ko": "당신의 도움을 ",
        "zh": "滿懷信心將",
        "en": "When we preach, when we teach,",
        "ja": "どんなときも"
      },
      {
        "vi": "khi rao tin cứu rỗi.",
        "ko": "확신합니다,",
        "zh": "真理向人宣揚，",
        "en": "we have confidence",
        "ja": "頼るなら"
      },
      {
        "vi": "Hướng trông đến tương lai sáng huy hoàng.",
        "ko": "오 나의 희망 여호와!",
        "zh": "因你時刻在我身旁。",
        "en": "because it's on you we rely.",
        "ja": "また強くなれる"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 72:13, 14; Châm 3:5, 6, 26; Giê 17:7).",
      "ko": "(시 72:13, 14; 잠언 3:5, 6, 26; 예레미야 17:7 참조)",
      "zh": "（參看詩72:13,14；箴3:5,6,26；耶17:7）",
      "en": "(See also Ps. 72:13, 14; Prov. 3:5, 6, 26; Jer. 17:7.)",
      "ja": "（詩 72:13，14; 格 3:5，6，26; エレ 17:7も参照。）"
    }
  },
  {
    "number": 4,
    "sourceSheet": "4",
    "labels": {
      "vi": "BÀI HÁT 4",
      "ko": "4번",
      "zh": "詩歌第4首",
      "en": "SONG 4",
      "ja": "4番"
    },
    "title": {
      "vi": "\"Đức Giê-hô-va là Đấng Chăn Giữ của tôi\"",
      "ko": "\"여호와는 나의 목자\"",
      "zh": "耶和華是我的牧人",
      "en": "\"Jehovah Is My Shepherd\"",
      "ja": "「エホバは私の牧者」"
    },
    "scripture": {
      "vi": "(Thi thiên 23)",
      "ko": "(시편 23)",
      "zh": "（詩篇23篇）",
      "en": "(Psalm 23)",
      "ja": "（詩編 23編）"
    },
    "lines": [
      {
        "vi": "1. Giê-hô-va là Đấng Chăn Chiên hiền.",
        "ko": "1. 여호와 내 목자시니",
        "zh": "1．耶和華是我的牧人，",
        "en": "1. Jehovah God is my Shepherd;",
        "ja": "1. エホバは私の"
      },
      {
        "vi": "Tôi xin luôn đi theo đường ngài.",
        "ko": "어디든 따라가리.",
        "zh": "我願聽從他呼聲。",
        "en": "I'll follow where he will lead.",
        "ja": "優しい牧者"
      },
      {
        "vi": "Mọi điều mà lòng tôi trông mong, ao ước,",
        "ko": "내 소망, 나의 모든 필요,",
        "zh": "我的需要他瞭如指掌，",
        "en": "He knows my hopes and my heart's desire;",
        "ja": "羊を忘れずに"
      },
      {
        "vi": "Cha cũng đều hay biết, quan tâm.",
        "ko": "여호와는 아시네.",
        "zh": "他深知我的願望。",
        "en": "He knows what I truly need.",
        "ja": "深く気遣う"
      },
      {
        "vi": "Cha đưa bầy đến cánh đồng thanh bình,",
        "ko": "물가로 인도하시네,",
        "zh": "他帶我到青翠牧場，",
        "en": "To watered pastures he leads me,",
        "ja": "静かな水辺で"
      },
      {
        "vi": "nghỉ ngơi bên con suối mát trong.",
        "ko": "편안히 쉴 곳으로.",
        "zh": "使我身心得舒暢。",
        "en": "To places secure and blessed.",
        "ja": "私を癒やし"
      },
      {
        "vi": "Được Cha chăn trong yêu thương thành tín tuyệt vời,",
        "ko": "주의 사랑의 인도 따르면",
        "zh": "他忠貞的愛時刻引領我，",
        "en": "And he guides me always with loyal love",
        "ja": "平和と安らぎで"
      },
      {
        "vi": "bầy chiên tìm được chốn nghỉ ngơi.",
        "ko": "늘 평화를 누리리.",
        "zh": "到安歇之地躺臥。",
        "en": "To where I find peace and rest.",
        "ja": "心を満たす"
      },
      {
        "vi": "Ngài mãi yêu thương dẫn đưa tôi đời đời,",
        "ko": "주 사랑의 인도 따르면",
        "zh": "他以忠貞的愛引領我，",
        "en": "He guides me always with loyal love",
        "ja": "平和と安らぎで"
      },
      {
        "vi": "phước lành và an vui không vơi.",
        "ko": "늘 평화를 누리리.",
        "zh": "到安歇之地躺臥。",
        "en": "To where I find peace and rest.",
        "ja": "心を満たす"
      },
      {
        "vi": "2. Cầu xin Cha vì cớ danh cao trọng",
        "ko": "2. 의의 길로 인도하여",
        "zh": "2．上帝道路公平正義，",
        "en": "2. Refreshing are all your pathways,",
        "ja": "2. 恐れず歩もう "
      },
      {
        "vi": "cho chân con đi không chệch đường.",
        "ko": "새 힘 주시는 주여,",
        "zh": "讓我能恢復活力。",
        "en": "The ways of your righteousness.",
        "ja": "深い谷間も"
      },
      {
        "vi": "Vì đường ngài dạy luôn khôn ngoan, công chính,",
        "ko": "이 길을 충실히 걷도록",
        "zh": "求你幫助我行事忠義，",
        "en": "For your name's sake never let me stray",
        "ja": "あなたが共にいて"
      },
      {
        "vi": "con có được sức mới nơi Cha.",
        "ko": "발을 지켜 주소서.",
        "zh": "行走正道不偏離。",
        "en": "From walking in faithfulness.",
        "ja": "守ってくれる"
      },
      {
        "vi": "Quanh con dù bóng tối mờ che đường,",
        "ko": "골짜기 깊고 험해도",
        "zh": "當我走在幽暗山谷，",
        "en": "In valleys deep in the shadows,",
        "ja": "正しく生きたい "
      },
      {
        "vi": "gậy Cha đưa con bước vững tâm.",
        "ko": "주 의지하리이다.",
        "zh": "你隨時指引、看顧。",
        "en": "Assured by your staff and rod,",
        "ja": "その名のために"
      },
      {
        "vi": "Dù gian nguy vây quanh, con chẳng hãi sợ gì,",
        "ko": "나의 하느님 함께하시니",
        "zh": "你是我的上帝、我的朋友，",
        "en": "I will fear no danger of lasting harm,",
        "ja": "私の神エホバ "
      },
      {
        "vi": "vì Cha là Bạn tốt của con.",
        "ko": "두려워 않으리다.",
        "zh": "我從不害怕擔憂。",
        "en": "For you are my Friend and God.",
        "ja": "本当の友"
      },
      {
        "vi": "Đời dẫu nguy nan cũng không lo sợ gì,",
        "ko": "내 하느님 함께하시니",
        "zh": "你是我的上帝和朋友，",
        "en": "I fear no danger of lasting harm,",
        "ja": "私の神エホバ "
      },
      {
        "vi": "vững lòng vì Cha luôn bên con.",
        "ko": "두려워 않으리다.",
        "zh": "我從不害怕擔憂。",
        "en": "For you are my Friend and God.",
        "ja": "本当の友"
      },
      {
        "vi": "3. Giê-hô-va là Đấng Chăn Chiên hiền.",
        "ko": "3. 여호와 내 목자시여,",
        "zh": "3．上帝，你是我的牧人，",
        "en": "3. Jehovah, you are my Shepherd;",
        "ja": "3. エホバの豊かな"
      },
      {
        "vi": "Con xin luôn đi theo đường ngài.",
        "ko": "날 인도해 주소서.",
        "zh": "我願追隨你一生。",
        "en": "I follow where you will lead.",
        "ja": "愛ある世話と"
      },
      {
        "vi": "Ngài hằng trợ lực cho con thêm vững chí.",
        "ko": "새 힘과 내게 필요한 것",
        "zh": "你細心呵護、溫柔餵養，",
        "en": "You strengthen me, and you give me rest;",
        "ja": "その揺るぎない愛 "
      },
      {
        "vi": "Con thiếu gì Cha chẳng ban cho?",
        "ko": "모두 주시나이다.",
        "zh": "也賜我所需力量。",
        "en": "You give all I truly need.",
        "ja": "私のそばに"
      },
      {
        "vi": "Tương lai ngời sáng đong đầy hy vọng,",
        "ko": "주께서 주신 희망을",
        "zh": "你永遠是我的上帝，",
        "en": "As you most surely are living,",
        "ja": "希望と喜び "
      },
      {
        "vi": "lòng con tin Cha hứa chẳng sai.",
        "ko": "굳건히 믿으오니",
        "zh": "我必全心信賴你。",
        "en": "So sure is my hope in you.",
        "ja": "感謝にあふれ"
      },
      {
        "vi": "Tình yêu thương Cha luôn luôn thành tín trọn vẹn,",
        "ko": "주의 충성스런 사랑으로",
        "zh": "願一生在你懷裡受保護，",
        "en": "May your loyal love and your care for me",
        "ja": "永遠に住みたい "
      },
      {
        "vi": "đời con được ngài mãi chở che.",
        "ko": "항상 돌봐 주소서.",
        "zh": "蒙忠貞的愛眷顧。",
        "en": "Pursue me my whole life through.",
        "ja": "エホバの家に"
      },
      {
        "vi": "Ngài vẫn yêu thương, tín trung không đổi dời.",
        "ko": "주 충성스런 사랑으로",
        "zh": "我願在你懷裡受保護，",
        "en": "Your loyal love and your care for me",
        "ja": "永遠に住みたい "
      },
      {
        "vi": "Suốt đời ngài bên con chăm lo.",
        "ko": "항상 돌봐 주소서.",
        "zh": "蒙忠貞的愛眷顧。",
        "en": "Pursue me my whole life through.",
        "ja": "エホバの家に"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 28:9; 80:1).",
      "ko": "(시 28:9; 80:1 참조)",
      "zh": "（參看詩28:9；80:1）",
      "en": "(See also Ps. 28:9; 80:1.)",
      "ja": "（詩 28:9; 80:1も参照。）"
    }
  },
  {
    "number": 5,
    "sourceSheet": "5",
    "labels": {
      "vi": "BÀI HÁT 5",
      "ko": "5번",
      "zh": "詩歌第5首",
      "en": "SONG 5",
      "ja": "5番"
    },
    "title": {
      "vi": "Các công việc kỳ diệu của Đức Chúa Trời",
      "ko": "하느님의 놀라운 일들",
      "zh": "上帝的奇妙作為",
      "en": "God's Wondrous Works",
      "ja": "エホバは素晴らしい創造者"
    },
    "scripture": {
      "vi": "(Thi thiên 139)",
      "ko": "(시편 139)",
      "zh": "（詩篇139篇）",
      "en": "(Psalm 139)",
      "ja": "（詩編 139編）"
    },
    "lines": [
      {
        "vi": "1. Cha hay khi con đi trên mỗi nẻo đường,",
        "ko": "1. 주여, 나 일어나는 것과",
        "zh": "1．上帝，無論我沉睡、清醒，",
        "en": "1. O God, you know my rest and waking,",
        "ja": "エホバ あなただけは"
      },
      {
        "vi": "dù ngồi hay đứng, lúc con ngủ và thức dậy.",
        "ko": "눕는 것을 모두 아십니다.",
        "zh": "躺下、站立，你都仔細留意。",
        "en": "When I lie down and when I rise anew.",
        "ja": "私の全てを知り"
      },
      {
        "vi": "Ngài dò tư tưởng, xem sâu xa khuynh hướng của lòng.",
        "ko": "깊은 생각, 성향을 살피시고",
        "zh": "你審察我內心深處的意念，",
        "en": "You search my thoughts, my inmost inclination,",
        "ja": "いつでも見守っている "
      },
      {
        "vi": "Dù lời chưa nói trên môi hay đang làm gì, Cha biết.",
        "ko": "하는 말, 걷는 길도 다 아십니다.",
        "zh": "我的言行在你眼前清楚可見。",
        "en": "The words I speak, the ways I walk, you know them too.",
        "ja": "私の心と生き方"
      },
      {
        "vi": "Ngay khi con chưa sinh ra, Chúa biết rồi",
        "ko": "내가 만들어지던 때에",
        "zh": "漆黑母腹中你看見我，",
        "en": "You saw when I was made in secret,",
        "ja": "母の胎の中で"
      },
      {
        "vi": "và mọi xương cốt của thân con ngài đếm cả.",
        "ko": "나의 뼈와 구조도 보시고",
        "zh": "小小身軀逐漸成長發育，",
        "en": "My very bones not hidden from your sight.",
        "ja": "命になった時も"
      },
      {
        "vi": "Mọi phần trong con, Cha biên trên trang sách của ngài.",
        "ko": "모든 부분 기록되게 하시니",
        "zh": "塑造成形全按你冊上指令，",
        "en": "You saw my form; its parts were down in writing.",
        "ja": "あなただけは初めから"
      },
      {
        "vi": "Ngợi khen Cha mãi, tôn vinh bao công việc của tay Cha.",
        "ko": "놀라운 그 일 찬양할 뿐입니다.",
        "zh": "你的奇妙大能讓我驚嘆不已。",
        "en": "I love the wonder of your ways and praise your might.",
        "ja": "私に気付いておられた"
      },
      {
        "vi": "Lạy Giê-hô-va, tri thức Cha ôi siêu phàm thay!",
        "ko": "주의 지식 놀랍고 두려움을",
        "zh": "你的作為是多麼奇妙可畏，",
        "en": "Your knowledge, God, is wondrous, awe-inspiring;",
        "ja": "心から賛美したい "
      },
      {
        "vi": "Ngài thật thông sáng, xứng đáng muôn dân ngợi khen!",
        "ko": "내 영혼이 정말 잘 압니다.",
        "zh": "你的智慧我願用心領會。",
        "en": "Of this my soul is very well-aware.",
        "ja": "素晴らしい創造者"
      },
      {
        "vi": "Dù lòng kinh hãi, tăm tối, đêm đen vây phủ con,",
        "ko": "어둠 속에 묻혀 두려울 때도",
        "zh": "縱使恐懼如黑暗將我包圍，",
        "en": "If I should fear that darkness might enfold me,",
        "ja": "あなたに見えないもの"
      },
      {
        "vi": "ngài làm con vững với thần khí ngài soi lối.",
        "ko": "그 속에서 날 찾으십니다.",
        "zh": "你的力量也會予我安慰。",
        "en": "Your spirit, God, would find me, even there.",
        "ja": "は一つもないのだから"
      },
      {
        "vi": "Ôi Cha, nơi đâu che con khuất khỏi ngài?",
        "ko": "내가 주의 얼굴을 피해",
        "zh": "上帝，我往哪裡躲避你？",
        "en": "Where could I hide from you, Jehovah,",
        "ja": "たとえ闇の中で"
      },
      {
        "vi": "Vùng nào sâu kín khiến Cha chẳng hề thấy được?",
        "ko": "숨을 곳이 과연 있으리까?",
        "zh": "藏身黑夜或在幽暗海底，",
        "en": "Or be concealed, be hidden from your face?",
        "ja": "孤独に包まれても"
      },
      {
        "vi": "Thật chẳng nơi đâu, trên cao kia hay dưới đất này,",
        "ko": "하늘에도, 깊은 바닷속에도",
        "zh": "在墳墓裡或升到高天之上，",
        "en": "Not in the Grave nor in the highest heaven,",
        "ja": "あなたの聖なる力 "
      },
      {
        "vi": "dù tận trong biển mênh mông hay trong lòng mộ âm u.",
        "ko": "숨을 곳 그 어디에도 없습니다.",
        "zh": "無論身在何處你都時刻看顧。",
        "en": "Not in the dark nor in the sea; there is no place.",
        "ja": "私をすぐに見つけ出す"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 66:3; 94:19; Giê 17:10).",
      "ko": "(시 66:3; 94:19; 예레미야 17:10 참조)",
      "zh": "（參看詩66:3；94:19；耶17:10）",
      "en": "(See also Ps. 66:3; 94:19; Jer. 17:10.)",
      "ja": "（詩 66:3; 94:19; エレ 17:10も参照。）"
    }
  },
  {
    "number": 6,
    "sourceSheet": "6",
    "labels": {
      "vi": "BÀI HÁT 6",
      "ko": "6번",
      "zh": "詩歌第6首",
      "en": "SONG 6",
      "ja": "6番"
    },
    "title": {
      "vi": "Bầu trời rao truyền sự vinh hiển của Đức Chúa Trời",
      "ko": "하늘이 하느님의 영광을 알리네",
      "zh": "高天宣揚耶和華的榮耀",
      "en": "The Heavens Declare God's Glory",
      "ja": "天はエホバをたたえる"
    },
    "scripture": {
      "vi": "(Thi thiên 19)",
      "ko": "(시편 19)",
      "zh": "（詩篇19篇）",
      "en": "(Psalm 19)",
      "ja": "（詩編 19編）"
    },
    "lines": [
      {
        "vi": "1. Trời cao rao ra vinh hiển của Cha Giê-hô-va.",
        "ko": "1. 저 하늘은 주의 영광 알리고",
        "zh": "1．高天宣揚耶和華榮耀光輝，",
        "en": "1. The heavens tell the glory of Jehovah.",
        "ja": "1. エホバを天はたたえる"
      },
      {
        "vi": "Việc tay Cha, muôn dân thấy",
        "ko": "여호와의 솜씨",
        "zh": "浩瀚宇宙述說",
        "en": "The work of his own hand,",
        "ja": "その偉大さ "
      },
      {
        "vi": "khi xem tầng trời cao vút.",
        "ko": "나타내 준다네.",
        "zh": "上帝奇妙作為。",
        "en": "we see in skies above.",
        "ja": "空は示す"
      },
      {
        "vi": "Ngày mới hát mừng, ca khen các công lao ngài.",
        "ko": "오, 날은 날마다 찬양하고",
        "zh": "滿天星辰讚美他的大能，",
        "en": "And each new day brings to him rightful praise.",
        "ja": "太陽 星の光"
      },
      {
        "vi": "Ngàn sao tôn cao yêu thương, thông sáng",
        "ko": "또 밤은 별의 광채로",
        "zh": "稱頌他的愛心、智慧，",
        "en": "The starlit night proclaims his might,",
        "ja": "神の知恵と愛 "
      },
      {
        "vi": "cùng với uy quyền nơi ngài.",
        "ko": "주 위력 알리네.",
        "zh": "晝夜永不停歇。",
        "en": "His wisdom, and his love.",
        "ja": "教えている"
      },
      {
        "vi": "2. Luật Cha thanh cao, cho chúng ta cuộc đời tươi đẹp.",
        "ko": "2. 생명 주는 완전한 주의 법은",
        "zh": "2．上帝律法純淨又完美無瑕，",
        "en": "2. Jehovah's law is perfect, life-restoring,",
        "ja": "2. エホバの貴い教え"
      },
      {
        "vi": "Lời Cha khuyên răn, đưa bước",
        "ko": "우리 가야 할 길",
        "zh": "領受上帝提醒，",
        "en": "And his reminders guide",
        "ja": "私たちの"
      },
      {
        "vi": "muôn dân dù trẻ hay lớn.",
        "ko": "일깨워 준다네.",
        "zh": "必定重獲力量。",
        "en": "the steps of old and young.",
        "ja": "生きる力"
      },
      {
        "vi": "Mọi phán quyết ngài luôn theo đúng lẽ công bằng.",
        "ko": "그 판결 의롭고 올바르며",
        "zh": "上帝法令既公平又正義，",
        "en": "His rulings prove to be true, right, and just.",
        "ja": "輝く知恵に満ちた"
      },
      {
        "vi": "Điều răn Cha, ôi khôn ngoan, thanh khiết!",
        "ko": "큰 힘을 주는 그 말씀",
        "zh": "他的話語真實可信，",
        "en": "His word is sure, his law so pure,",
        "ja": "確かな教えに"
      },
      {
        "vi": "Lời Chúa thơm ngọt hơn mật.",
        "ko": "꿀보다 달다네.",
        "zh": "如蜜滋潤人心。",
        "en": "So sweet upon the tongue.",
        "ja": "導かれる"
      },
      {
        "vi": "3. Sự uy nghi Cha xứng đáng cho muôn người vâng phục.",
        "ko": "3. 주의 계명 금보다 더 좋으며",
        "zh": "3．敬畏上帝，永遠服從他命令。",
        "en": "3. The fear of God is pure and lasts forever.",
        "ja": "3. エホバのおきては全て"
      },
      {
        "vi": "Bầy chiên an nhiên, vui sướng",
        "ko": "그 유익한 명령",
        "zh": "他的明智訓誨",
        "en": "The worth of his commands",
        "ja": "金に勝る"
      },
      {
        "vi": "do luôn được ngài dẫn dắt.",
        "ko": "우릴 지켜 주네.",
        "zh": "比黃金更珍貴，",
        "en": "exceeds the finest gold.",
        "ja": "宝のよう"
      },
      {
        "vi": "Lời Chúa phán dạy, bao năm vẫn quý hơn vàng.",
        "ko": "영원히 하느님 경외하며",
        "zh": "謹守遵行，得享真正生命。",
        "en": "His orders lead and preserve all his own.",
        "ja": "気高い心抱き"
      },
      {
        "vi": "Nguyện ta tôn vinh danh Cha thánh khiết",
        "ko": "거룩한 주 이름 위해",
        "zh": "決心顯揚上帝聖名，",
        "en": "His honor, fame, and holy name,",
        "ja": "永遠の神を"
      },
      {
        "vi": "và hát khen ngài muôn đời.",
        "ko": "충성을 다하리.",
        "zh": "對他忠貞不渝。",
        "en": "We loyally uphold.",
        "ja": "たたえていく"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 111:9; 145:5; Khải 4:11).",
      "ko": "(시 111:9; 145:5; 계시록 4:11 참조)",
      "zh": "（參看詩111:9；145:5；啟4:11）",
      "en": "(See also Ps. 111:9; 145:5; Rev. 4:11.)",
      "ja": "（詩 111:9; 145:5; 啓 4:11も参照。）"
    }
  },
  {
    "number": 7,
    "sourceSheet": "7",
    "labels": {
      "vi": "BÀI HÁT 7",
      "ko": "7번",
      "zh": "詩歌第7首",
      "en": "SONG 7",
      "ja": "7番"
    },
    "title": {
      "vi": "Đức Giê-hô-va, ngài là sức mạnh của chúng con",
      "ko": "여호와, 우리의 힘",
      "zh": "耶和華是我們的力量",
      "en": "Jehovah, Our Strength",
      "ja": "エホバは私たちの力"
    },
    "scripture": {
      "vi": "(Ê-sai 12:2)",
      "ko": "(이사야 12:2)",
      "zh": "（以賽亞書12:2）",
      "en": "(Isaiah 12:2)",
      "ja": "（イザヤ 12:2）"
    },
    "lines": [
      {
        "vi": "1. Chúng con mạnh mẽ do cậy trông Giê-hô-va,",
        "ko": "1. 여호와, 우리의 힘과 능력,",
        "zh": "1．耶和華上帝我們的力量，",
        "en": "1. Gracious Jehovah, our strength and our might,",
        "ja": "1. 優しい神エホバは"
      },
      {
        "vi": "sướng vui vì nay nương náu nơi cánh tay Cha.",
        "ko": "구원과 기쁨을 주시는 분.",
        "zh": "施行拯救，我們歡呼頌揚。",
        "en": "You are our Savior, in you we delight.",
        "ja": "保護と救い与える"
      },
      {
        "vi": "Báo tin mừng lớn cho mọi dân trên khắp đất,",
        "ko": "우리는 당신의 증인 되어",
        "zh": "願為你作見證傳好消息，",
        "en": "We are your Witnesses bearing your news,",
        "ja": "私たちは証人"
      },
      {
        "vi": "dẫu nghe hay chối vẫn kiên quyết làm hăng say.",
        "ko": "듣든지 않든지 전하리다.",
        "zh": "不論人接受或拒絕聆聽。",
        "en": "Whether men hear or they proudly refuse.",
        "ja": "告げる 神の知らせを"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Rao báo cho muôn dân danh thánh Giê-hô-va.",
        "ko": "여호와, 우리의 힘과 능력,",
        "zh": "耶和華上帝，我們的力量，",
        "en": "Jehovah, our Rock, Our strength and our might,",
        "ja": "力の神エホバは"
      },
      {
        "vi": "Quyền năng Cha mạnh mẽ, không sao chuyển lay.",
        "ko": "당신의 이름 알리리다.",
        "zh": "願將你聖名晝夜宣揚。",
        "en": "Your name we make known Both day and night.",
        "ja": "全能の主権者"
      },
      {
        "vi": "Chúa Giê-hô-va, Vua Toàn Năng uy quyền lớn,",
        "ko": "빛나는 여호와, 전능한 분,",
        "zh": "榮耀的上帝你偉大全能，",
        "en": "Glorious Jehovah, Almighty in pow'r,",
        "ja": "昼も夜もあなたに"
      },
      {
        "vi": "nơi nương náu chắc và tháp cao cho dân ngài.",
        "ko": "우리의 산성이 되시리다.",
        "zh": "我們的庇護所、堅強後盾。",
        "en": "You are our hiding place; You are our Tow'r.",
        "ja": "賛美捧げ 生きます"
      },
      {
        "vi": "2. Chúng con mừng rỡ khi là tôi tớ theo Cha,",
        "ko": "2. 밝은 빛 우리 눈 열어 주니",
        "zh": "2．受你的光指引滿心歡喜，",
        "en": "2. We who now serve you rejoice in your light;",
        "ja": "2. 喜びつつ仕える"
      },
      {
        "vi": "mắt nay nhận ra chân lý cao quý Cha ban.",
        "ko": "진리를 선명히 보나이다.",
        "zh": "得以明辨是非、洞悉真理。",
        "en": "Eyes that are opened now see truth and right.",
        "ja": "神の光の中で"
      },
      {
        "vi": "Dốc công tìm kiếm, nghe điều răn Cha đã phán,",
        "ko": "성경을 살펴서 계명 듣고",
        "zh": "查考你的話語，聽從命令，",
        "en": "Searching the Scriptures, we hear your command;",
        "ja": "聖書読んで従い"
      },
      {
        "vi": "mãi đi theo sát, trung kiên vững bền không thôi.",
        "ko": "주의 왕국 편에 서리이다.",
        "zh": "決心擁護王國，堅定不移。",
        "en": "Making our choice, for your Kingdom we stand.",
        "ja": "望む 神の統治を"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Rao báo cho muôn dân danh thánh Giê-hô-va.",
        "ko": "여호와, 우리의 힘과 능력,",
        "zh": "耶和華上帝，我們的力量，",
        "en": "Jehovah, our Rock, Our strength and our might,",
        "ja": "力の神エホバは"
      },
      {
        "vi": "Quyền năng Cha mạnh mẽ, không sao chuyển lay.",
        "ko": "당신의 이름 알리리다.",
        "zh": "願將你聖名晝夜宣揚。",
        "en": "Your name we make known Both day and night.",
        "ja": "全能の主権者"
      },
      {
        "vi": "Chúa Giê-hô-va, Vua Toàn Năng uy quyền lớn,",
        "ko": "빛나는 여호와, 전능한 분,",
        "zh": "榮耀的上帝你偉大全能，",
        "en": "Glorious Jehovah, Almighty in pow'r,",
        "ja": "昼も夜もあなたに"
      },
      {
        "vi": "nơi nương náu chắc và tháp cao cho dân ngài.",
        "ko": "우리의 산성이 되시리다.",
        "zh": "我們的庇護所、堅強後盾。",
        "en": "You are our hiding place; You are our Tow'r.",
        "ja": "賛美捧げ 生きます"
      },
      {
        "vi": "3. Chúng con hạnh phúc khi làm theo ý trên cao.",
        "ko": "3. 즐거이 주의 뜻 행하리다,",
        "zh": "3．我們樂意執行上帝旨意，",
        "en": "3. Gladly, O God, we keep doing your will.",
        "ja": "3. サタン 脅すとしても"
      },
      {
        "vi": "Dẫu Sa-tan ngăn nhưng quyết tin chắc nơi Cha.",
        "ko": "사탄이 비웃고 해하여도.",
        "zh": "雖受撒但迫害仍信賴你。",
        "en": "Though Satan mocks us, we're trusting you still.",
        "ja": "命奪うとしても"
      },
      {
        "vi": "Thiết tha cầu khẩn, xin ngài ban ơn giúp đỡ",
        "ko": "주 통치 끝까지 옹호하여",
        "zh": "求你幫助我們忍受艱辛，",
        "en": "Though he may slay us, oh, help us to be",
        "ja": "私たちは負けない"
      },
      {
        "vi": "chúng con không ngã, trung kiên ủng hộ ngôi Cha.",
        "ko": "확고함 지키게 도우소서.",
        "zh": "擁護你的統治，忠貞到底。",
        "en": "Firm to the end for your grand Sov'reignty.",
        "ja": "選ぶ 神の主権を"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Rao báo cho muôn dân danh thánh Giê-hô-va.",
        "ko": "여호와, 우리의 힘과 능력,",
        "zh": "耶和華上帝，我們的力量，",
        "en": "Jehovah, our Rock, Our strength and our might,",
        "ja": "力の神エホバは"
      },
      {
        "vi": "Quyền năng Cha mạnh mẽ, không sao chuyển lay.",
        "ko": "당신의 이름 알리리다.",
        "zh": "願將你聖名晝夜宣揚。",
        "en": "Your name we make known Both day and night.",
        "ja": "全能の主権者"
      },
      {
        "vi": "Chúa Giê-hô-va, Vua Toàn Năng uy quyền lớn,",
        "ko": "빛나는 여호와, 전능한 분,",
        "zh": "榮耀的上帝你偉大全能，",
        "en": "Glorious Jehovah, Almighty in pow'r,",
        "ja": "昼も夜もあなたに"
      },
      {
        "vi": "nơi nương náu chắc và tháp cao cho dân ngài.",
        "ko": "우리의 산성이 되시리다.",
        "zh": "我們的庇護所、堅強後盾。",
        "en": "You are our hiding place; You are our Tow'r.",
        "ja": "賛美捧げ 生きます"
      }
    ],
    "reference": {
      "vi": "(Cũng xem 2 Sa 22:3; Thi 18:2; Ê-sai 43:12).",
      "ko": "(사무엘하 22:3; 시 18:2; 이사야 43:12 참조)",
      "zh": "（參看撒下22:3；詩18:2；賽43:12）",
      "en": "(See also 2 Sam. 22:3; Ps. 18:2; Isa. 43:12.)",
      "ja": "（サム二 22:3; 詩 18:2; イザ 43:12も参照。）"
    }
  },
  {
    "number": 8,
    "sourceSheet": "8",
    "labels": {
      "vi": "BÀI HÁT 8",
      "ko": "8번",
      "zh": "詩歌第8首",
      "en": "SONG 8",
      "ja": "8番"
    },
    "title": {
      "vi": "Đức Giê-hô-va là nơi trú náu của chúng ta",
      "ko": "여호와는 우리의 도피처",
      "zh": "耶和華是我們的庇護所",
      "en": "Jehovah Is Our Refuge",
      "ja": "エホバは避難所"
    },
    "scripture": {
      "vi": "(Thi thiên 91)",
      "ko": "(시편 91)",
      "zh": "（詩篇91篇）",
      "en": "(Psalm 91)",
      "ja": "（詩編 91編）"
    },
    "lines": [
      {
        "vi": "1. Giê-hô-va, nơi ẩn náu chắc,",
        "ko": "1. 여호와 하느님은 ",
        "zh": "1．耶和華是庇護所，",
        "en": "1. Jehovah is our refuge,",
        "ja": "1. 神は避難所 "
      },
      {
        "vi": "là đấng chúng ta cậy trông.",
        "ko": "우리의 도피처,",
        "zh": "救我躲避災禍。",
        "en": "Our God in whom we trust.",
        "ja": "翼の陰"
      },
      {
        "vi": "Nhờ bóng Chúa, ta được trú náu",
        "ko": "그 보호 그늘 아래 ",
        "zh": "要尋求他的保護，",
        "en": "His shadow is our shelter;",
        "ja": "そこにとどまり "
      },
      {
        "vi": "an chắc suốt trong đời sống.",
        "ko": "항상 머물리라.",
        "zh": "留在安全之處。",
        "en": "Remain in it we must.",
        "ja": "神に頼る"
      },
      {
        "vi": "Cha sẽ không quên những ai thành trung",
        "ko": "견고한 산성과 같이 ",
        "zh": "上帝守護忠心僕人，",
        "en": "His faithful ones he will defend,",
        "ja": "忠実な人はいつも"
      },
      {
        "vi": "nên hãy tin Cha mãi che chở ta.",
        "ko": "늘 충실하신 여호와,",
        "zh": "力量無窮值得信任。",
        "en": "On this we know we can depend.",
        "ja": "守られる"
      },
      {
        "vi": "Giê-hô-va như thành lũy chắc.",
        "ko": "굳건히 의지하면 ",
        "zh": "上帝是堅固城堡，",
        "en": "Jehovah is a stronghold,",
        "ja": "神は公正 "
      },
      {
        "vi": "Cha vẫn mãi mãi tín trung, công bằng.",
        "ko": "항상 지켜 주시리라.",
        "zh": "永遠忠貞、信實、可靠。",
        "en": "Ever faithful, loyal, and just.",
        "ja": "揺るぎないとりで"
      },
      {
        "vi": "2. Dù chứng kiến muôn người ngã xuống,",
        "ko": "2. 만 인이 내 곁에서 ",
        "zh": "2．你看見在你身邊",
        "en": "2. Though thousands will have fallen",
        "ja": "2. 悪のはびこる"
      },
      {
        "vi": "đầy dẫy ở ngay cạnh ta,",
        "ko": "쓰러질지라도",
        "zh": "萬人紛紛倒下，",
        "en": "And many at our side,",
        "ja": "暗闇から"
      },
      {
        "vi": "mình vẫn bước trung thành đến cuối,",
        "ko": "의롭고 온유한 자 ",
        "zh": "你不用恐懼戰兢，",
        "en": "The righteous and the meek ones",
        "ja": "神は助ける "
      },
      {
        "vi": "tin chắc Chúa luôn gìn giữ.",
        "ko": "늘 보호받으리.",
        "zh": "禍患不會臨近。",
        "en": "Will never be denied.",
        "ja": "正しい人"
      },
      {
        "vi": "Ta chẳng hoang mang hay lo sợ chi",
        "ko": "그 어떤 재앙이라도 ",
        "zh": "所有謙卑、正義忠僕",
        "en": "So in our hearts we need not fear;",
        "ja": "どんな災難も"
      },
      {
        "vi": "do biết chắc Cha vẫn bên cạnh ta.",
        "ko": "우릴 해치지 못하리.",
        "zh": "必受天父大能保護，",
        "en": "Calamity will not come near.",
        "ja": "及ぶことはない"
      },
      {
        "vi": "Mặc khốn khó, muôn trùng sóng gió,",
        "ko": "하느님 날개 아래 ",
        "zh": "在他的翅膀之下",
        "en": "From danger he will shield us,",
        "ja": "神は保護する "
      },
      {
        "vi": "nương dưới cánh Chúa, chúng ta an toàn.",
        "ko": "우린 안전히 거하리.",
        "zh": "尋得真正安居之處。",
        "en": "For beneath God's wings we'll reside.",
        "ja": "その翼広げ"
      },
      {
        "vi": "3. Ngài giải thoát ta khỏi bẫy ác,",
        "ko": "3. 올무를 피하도록 ",
        "zh": "3．耶和華在我左右",
        "en": "3. He'll keep us and protect us",
        "ja": "3. 夜の危険も"
      },
      {
        "vi": "gìn giữ lối ta bình an.",
        "ko": "보호하시리니",
        "zh": "救我脫離網羅，",
        "en": "From snares along our way,",
        "ja": "昼間の矢も"
      },
      {
        "vi": "Được Chúa giúp, ta chẳng vấp ngã",
        "ko": "낮에도 밤중에도 ",
        "zh": "在白晝不怕飛箭，",
        "en": "From terrors in the nighttime,",
        "ja": "神は大盾 "
      },
      {
        "vi": "nhưng sẽ vững tâm, bền chí.",
        "ko": "두렵지 않으리.",
        "zh": "黑夜無懼危險。",
        "en": "And arrows by the day.",
        "ja": "全て防ぐ"
      },
      {
        "vi": "Bao mũi tên bay, ta không sợ chi.",
        "ko": "마음이 불안하거나 ",
        "zh": "天父看顧我的道路，",
        "en": "Yes, there will be no cause for dread,",
        "ja": "恐れることなく "
      },
      {
        "vi": "Đêm tối vây quanh, ta không hề lo.",
        "ko": "무서워 떨 일 없으리.",
        "zh": "我必不再害怕無助。",
        "en": "No place where we will fear to tread.",
        "ja": "いつでも歩める"
      },
      {
        "vi": "Giê-hô-va, nơi ẩn náu chắc.",
        "ko": "여호와 도피처니 ",
        "zh": "耶和華必搭救我，",
        "en": "Jehovah is our refuge,",
        "ja": "神は避難所 "
      },
      {
        "vi": "Cha sẽ cứu thoát khỏi bao tai họa.",
        "ko": "항상 지켜 주시리라.",
        "zh": "是永遠的庇護之所。",
        "en": "Ever guarding us on our way.",
        "ja": "私の隠れが"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 97:10; 121:3, 5; Ê-sai 52:12).",
      "ko": "(시 97:10; 121:3, 5; 이사야 52:12 참조)",
      "zh": "（參看詩97:10；121:3,5；賽52:12）",
      "en": "(See also Ps. 97:10; 121:3, 5; Isa. 52:12.)",
      "ja": "（詩 97:10; 121:3，5; イザ 52:12も参照。）"
    }
  },
  {
    "number": 9,
    "sourceSheet": "9",
    "labels": {
      "vi": "BÀI HÁT 9",
      "ko": "9번",
      "zh": "詩歌第9首",
      "en": "SONG 9",
      "ja": "9番"
    },
    "title": {
      "vi": "Đức Giê-hô-va là Vua chúng ta!",
      "ko": "여호와가 우리의 왕이시다!",
      "zh": "耶和華是我們的王！",
      "en": "Jehovah Is Our King!",
      "ja": "エホバは王！"
    },
    "scripture": {
      "vi": "(Thi thiên 97:1)",
      "ko": "(시편 97:1)",
      "zh": "（詩篇97:1）",
      "en": "(Psalm 97:1)",
      "ja": "（詩編 97:1）"
    },
    "lines": [
      {
        "vi": "1. Hân hoan tôn vinh, ca ngợi Giê-hô-va,",
        "ko": "1. 영광 돌리라, 여호와께.",
        "zh": "1．把榮耀、讚美歸給上帝，",
        "en": "1. Rejoice, give glory to Jehovah,",
        "ja": "1. 歓喜の声上がる"
      },
      {
        "vi": "vì trời cao rao vinh hiển Chúa suốt bao đêm ngày.",
        "ko": "주의 의로움, 하늘도 알리네.",
        "zh": "天上歡樂地宣揚上帝正義。",
        "en": "For the heavens proclaim all his righteousness.",
        "ja": "神の正義 天 告げる"
      },
      {
        "vi": "Ta vui mừng cùng hòa tiếng hát chúc tụng và ngợi khen,",
        "ko": "찬양의 노래를 즐겁게 부르며",
        "zh": "一起歡呼歌唱，衷心稱頌上帝，",
        "en": "Let us sing to our God joyful songs to his praise;",
        "ja": "神に向かい賛美歌う"
      },
      {
        "vi": "truyền việc Chúa đến khắp muôn dân gần xa.",
        "ko": "크신 행적 모두 알리라.",
        "zh": "偉大作為要傳遍全地！",
        "en": "Let us speak to all of his great acts.",
        "ja": "偉大な王エホバ"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Tầng trời nay vui biết bao, địa cầu nay vui xiết bao,",
        "ko": "하늘과 땅이여, 기쁨에 넘치라.",
        "zh": "天上一片歡欣，地上一同高唱，",
        "en": "Let the heavens rejoice, Let the earth joyful be,",
        "ja": "歓喜満ちて 天地叫ぶ"
      },
      {
        "vi": "vì Giê-hô-va trên ngôi cao làm Vua!",
        "ko": "주 여호와 왕이 되셨다!",
        "zh": "因為耶和華已經作王！",
        "en": "For Jehovah has become our King!",
        "ja": "全ての王エホバ"
      },
      {
        "vi": "Tầng trời nay vui biết bao, địa cầu nay vui xiết bao,",
        "ko": "하늘과 땅이여, 기쁨에 넘치라.",
        "zh": "天上一片歡欣，地上一同高唱，",
        "en": "Let the heavens rejoice, Let the earth joyful be,",
        "ja": "歓喜あふれ 天地叫ぶ"
      },
      {
        "vi": "vì Giê-hô-va trên ngôi cao làm Vua!",
        "ko": "주 여호와 왕이 되셨다!",
        "zh": "因為耶和華已經作王！",
        "en": "For Jehovah has become our King!",
        "ja": "宇宙の王エホバ"
      },
      {
        "vi": "2. Rao ra bao vinh quang ngài cùng muôn dân,",
        "ko": "2. 우릴 구원해 주시리니",
        "zh": "2．要傳講耶和華的榮耀，",
        "en": "2. His glory tell among the nations;",
        "ja": "2. エホバの栄光は"
      },
      {
        "vi": "vì ngày nay Cha mang đến cứu rỗi cho nhân loại.",
        "ko": "주의 영광을 온 세상 보리라.",
        "zh": "唯有他是施行拯救的上帝。",
        "en": "For Jehovah to us is a God who saves.",
        "ja": "世界中で示される"
      },
      {
        "vi": "Vua Muôn Đời, ngài là thánh, đáng kính sợ và ngợi khen!",
        "ko": "우리 왕 여호와, 주 앞에 나아가",
        "zh": "耶和華已作王，配受讚美、顯揚，",
        "en": "Yes, Jehovah is King; he deserves all the praise.",
        "ja": "王座につき賛美受ける"
      },
      {
        "vi": "Mình quỳ xuống trước đấng uy nghi, quyền năng.",
        "ko": "경배하며 찬양하리라.",
        "zh": "我們在寶座前敬拜他。",
        "en": "So we bow before his mighty throne.",
        "ja": "救いの王エホバ"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Tầng trời nay vui biết bao, địa cầu nay vui xiết bao,",
        "ko": "하늘과 땅이여, 기쁨에 넘치라.",
        "zh": "天上一片歡欣，地上一同高唱，",
        "en": "Let the heavens rejoice, Let the earth joyful be,",
        "ja": "歓喜満ちて 天地叫ぶ"
      },
      {
        "vi": "vì Giê-hô-va trên ngôi cao làm Vua!",
        "ko": "주 여호와 왕이 되셨다!",
        "zh": "因為耶和華已經作王！",
        "en": "For Jehovah has become our King!",
        "ja": "全ての王エホバ"
      },
      {
        "vi": "Tầng trời nay vui biết bao, địa cầu nay vui xiết bao,",
        "ko": "하늘과 땅이여, 기쁨에 넘치라.",
        "zh": "天上一片歡欣，地上一同高唱，",
        "en": "Let the heavens rejoice, Let the earth joyful be,",
        "ja": "歓喜あふれ 天地叫ぶ"
      },
      {
        "vi": "vì Giê-hô-va trên ngôi cao làm Vua!",
        "ko": "주 여호와 왕이 되셨다!",
        "zh": "因為耶和華已經作王！",
        "en": "For Jehovah has become our King!",
        "ja": "宇宙の王エホバ"
      },
      {
        "vi": "3. Cha ban ngôi vua cho Con là Giê-su.",
        "ko": "3. 의로운 통치 세우시고",
        "zh": "3．上帝正義統治已建立，",
        "en": "3. His righteous rule is now established.",
        "ja": "3. 神の子 選ばれて"
      },
      {
        "vi": "Quyền lực Cha luôn vững chắc, Nước Chúa đang cai trị.",
        "ko": "아들을 왕좌에 앉게 하셨네.",
        "zh": "他委任愛子耶穌掌權管理。",
        "en": "On his throne, he has placed his anointed Son.",
        "ja": "正しい統治 開始する"
      },
      {
        "vi": "Bao nhiêu thần tượng giả dối phải hổ thẹn, bị cười chê.",
        "ko": "이 세상 신들은 수치 당하리니",
        "zh": "眾假神必蒙羞，全都不再存留，",
        "en": "Let the gods of this world be brought down and be shamed,",
        "ja": "エホバ以外 神はいない"
      },
      {
        "vi": "Một mình Chúa xứng đáng muôn dân thờ tôn.",
        "ko": "여호와만 찬양하여라.",
        "zh": "只有耶和華配受稱頌。",
        "en": "For the praise belongs to God alone.",
        "ja": "無敵の王エホバ"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Tầng trời nay vui biết bao, địa cầu nay vui xiết bao,",
        "ko": "하늘과 땅이여, 기쁨에 넘치라.",
        "zh": "天上一片歡欣，地上一同高唱，",
        "en": "Let the heavens rejoice, Let the earth joyful be,",
        "ja": "歓喜満ちて 天地叫ぶ"
      },
      {
        "vi": "vì Giê-hô-va trên ngôi cao làm Vua!",
        "ko": "주 여호와 왕이 되셨다!",
        "zh": "因為耶和華已經作王！",
        "en": "For Jehovah has become our King!",
        "ja": "全ての王エホバ"
      },
      {
        "vi": "Tầng trời nay vui biết bao, địa cầu nay vui xiết bao,",
        "ko": "하늘과 땅이여, 기쁨에 넘치라.",
        "zh": "天上一片歡欣，地上一同高唱，",
        "en": "Let the heavens rejoice, Let the earth joyful be,",
        "ja": "歓喜あふれ 天地叫ぶ"
      },
      {
        "vi": "vì Giê-hô-va trên ngôi cao làm Vua!",
        "ko": "주 여호와 왕이 되셨다!",
        "zh": "因為耶和華已經作王！",
        "en": "For Jehovah has become our King!",
        "ja": "宇宙の王エホバ"
      }
    ],
    "reference": {
      "vi": "(Cũng xem 1 Sử 16:9; Thi 68:20; 97:6, 7).",
      "ko": "(역대기상 16:9; 시 68:20; 97:6, 7 참조)",
      "zh": "（參看代上16:9；詩68:20；97:6,7）",
      "en": "(See also 1 Chron. 16:9; Ps. 68:20; 97:6, 7.)",
      "ja": "（代一 16:9; 詩 68:20; 97:6，7も参照。）"
    }
  },
  {
    "number": 10,
    "sourceSheet": "10",
    "labels": {
      "vi": "BÀI HÁT 10",
      "ko": "10번",
      "zh": "詩歌第10首",
      "en": "SONG 10",
      "ja": "10番"
    },
    "title": {
      "vi": "Hãy khen ngợi Đức Giê-hô-va!",
      "ko": "우리 하느님 여호와를 찬양하라!",
      "zh": "讚美我們的上帝耶和華！",
      "en": "Praise Jehovah Our God!",
      "ja": "私たちの神エホバを賛美しましょう！"
    },
    "scripture": {
      "vi": "(Thi thiên 145:12)",
      "ko": "(시편 145:12)",
      "zh": "（詩篇145:12）",
      "en": "(Psalm 145:12)",
      "ja": "（詩編 145:12）"
    },
    "lines": [
      {
        "vi": "1. Ca khen Cha! Khen ngợi Giê-hô-va!",
        "ko": "1. 찬양해! 우리 여호와!",
        "zh": "1．來讚美，讚美耶和華！",
        "en": "1. Praise our God! Praise Jehovah God!",
        "ja": "1. 賛美捧げよう "
      },
      {
        "vi": "Rao truyền danh của ngài khắp mọi nơi!",
        "ko": "영광된 이름 알리세!",
        "zh": "他榮耀聖名要傳揚！",
        "en": "Make his glorious name known to all!",
        "ja": "栄光の神に"
      },
      {
        "vi": "Hô vang lên! Báo ngày Cha gần rồi,",
        "ko": "전파해! 모두 듣도록.",
        "zh": "要宣告終結快來臨，",
        "en": "Sound alarm, For his day is near,",
        "ja": "告げよう エホバの日 "
      },
      {
        "vi": "giúp các dân được lắng nghe thông điệp ngài.",
        "ko": "주의 큰 날 가까웠다네.",
        "zh": "耶和華的大日子已近。",
        "en": "Help all people hear his warning call.",
        "ja": "人々助けよう"
      },
      {
        "vi": "Từ trời ngài mừng vui công bố Đấng Ki-tô,",
        "ko": "‘이제 맏아들 통치할 때다'",
        "zh": "耶和華上帝已頒布法令，",
        "en": "Jehovah decreed that now is the time",
        "ja": "キリストの王国は"
      },
      {
        "vi": "Con Đầu Lòng, được phong Vua Nước Cha.",
        "ko": "여호와 선언하셨네.",
        "zh": "任命他的愛子作王。",
        "en": "For his Firstborn to rule as King.",
        "ja": "喜びの知らせ"
      },
      {
        "vi": "Nào mời mọi dân nghe tin ấy, họ sẽ biết",
        "ko": "모두 듣도록 전해 주면서",
        "zh": "上帝王國給人光明希望，",
        "en": "Reach out to all people, tell them the news,",
        "ja": "心込め告げていく "
      },
      {
        "vi": "nhiều ân phước mai này Cha mang lại!",
        "ko": "미래의 축복 알리세!",
        "zh": "要盡力向人人傳講。",
        "en": "Tell what blessings our God will bring!",
        "ja": "神の祝福を"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Ca khen Cha! Khen ngợi Giê-hô-va!",
        "ko": "찬양해! 우리 여호와!",
        "zh": "來讚美，讚美耶和華！",
        "en": "Praise our God! Praise Jehovah God!",
        "ja": "賛美捧げよう"
      },
      {
        "vi": "Báo sự vĩ đại Cha gần xa khắp chốn.",
        "ko": "주의 위대함을 알리세!",
        "zh": "他的作為要傳遍天下！",
        "en": "Make his greatness known in all the earth!",
        "ja": "エホバをたたえよう"
      },
      {
        "vi": "2. Ca khen Cha! Khen ngợi danh của ngài!",
        "ko": "2. 찬양해! 크고 힘차게!",
        "zh": "2．來高聲讚美耶和華！",
        "en": "2. Praise our God! Sing it loud and clear!",
        "ja": "2. 賛美捧げよう "
      },
      {
        "vi": "Hát bài ca mừng ngài rõ và to!",
        "ko": "기쁜 노래로 찬미해!",
        "zh": "一同歡樂地稱頌他！",
        "en": "With a joyful song, laud his name!",
        "ja": "喜びを込めて"
      },
      {
        "vi": "Mang ơn Cha, với lòng chân thành mình,",
        "ko": "선포해! 주의 영광을,",
        "zh": "要衷心感謝耶和華，",
        "en": "From the heart, From a grateful heart,",
        "ja": "歌おう 声高く "
      },
      {
        "vi": "quyết vững tâm truyền bá danh vinh hiển ngài.",
        "ko": "마음 다해 감사하면서.",
        "zh": "勇敢宣揚上帝的榮耀。",
        "en": "All his glory boldly we proclaim.",
        "ja": "エホバのお名前を"
      },
      {
        "vi": "Dù ngài thật uy nghi, công sức Cha vô biên",
        "ko": "우리 하느님 위대하시며",
        "zh": "上帝作為奇妙，偉大全能，",
        "en": "Though grand is our God and great are his works,",
        "ja": "憐れみと親切に"
      },
      {
        "vi": "nhưng khiêm nhường, đầy từ nhân, xót thương.",
        "ko": "선하고 겸손하시네.",
        "zh": "卻謙卑善待所有人。",
        "en": "He is humble and good to all.",
        "ja": "満ちあふれる方"
      },
      {
        "vi": "Lòng mình cần điều chi, Cha cũng đều hay biết,",
        "ko": "우리 필요를 돌봐 주시는",
        "zh": "我們的需要天父都知道，",
        "en": "Our merciful Father knows what we need;",
        "ja": "感謝して近づこう "
      },
      {
        "vi": "ngài nghe tiếng ta cầu xin đêm ngày.",
        "ko": "자비로우신 아버지.",
        "zh": "他也樂意回應禱告。",
        "en": "He responds when he hears our call.",
        "ja": "偉大なエホバに"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Ca khen Cha! Khen ngợi Giê-hô-va!",
        "ko": "찬양해! 우리 여호와!",
        "zh": "來讚美，讚美耶和華！",
        "en": "Praise our God! Praise Jehovah God!",
        "ja": "賛美捧げよう"
      },
      {
        "vi": "Báo sự vĩ đại Cha gần xa khắp chốn.",
        "ko": "주의 위대함을 알리세!",
        "zh": "他的作為要傳遍天下！",
        "en": "Make his greatness known in all the earth!",
        "ja": "エホバをたたえよう"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 89:27; 105:1; Giê 33:11).",
      "ko": "(시 89:27; 105:1; 예레미야 33:11 참조)",
      "zh": "（參看詩89:27；105:1；耶33:11）",
      "en": "(See also Ps. 89:27; 105:1; Jer. 33:11.)",
      "ja": "（詩 89:27; 105:1; エレ 33:11も参照。）"
    }
  },
  {
    "number": 11,
    "sourceSheet": "11",
    "labels": {
      "vi": "BÀI HÁT 11",
      "ko": "11번",
      "zh": "詩歌第11首",
      "en": "SONG 11",
      "ja": "11番"
    },
    "title": {
      "vi": "Công trình sáng tạo ngợi khen Đức Chúa Trời",
      "ko": "창조물이 하느님을 찬양하네",
      "zh": "萬物讚美上帝",
      "en": "Creation Praises God",
      "ja": "エホバを賛美せずにはいられない"
    },
    "scripture": {
      "vi": "(Thi thiên 19)",
      "ko": "(시편 19)",
      "zh": "（詩篇19篇）",
      "en": "(Psalm 19)",
      "ja": "（詩編 19編）"
    },
    "lines": [
      {
        "vi": "1. Lạy Giê-hô-va, biết bao kỳ công Cha tạo",
        "ko": "1. 여호와여, 찬란한 별들이",
        "zh": "1．銀河無邊，夜空繁星點點，",
        "en": "1. Your glory, God, your mighty works abound,",
        "ja": "1. 見上げる広い空は"
      },
      {
        "vi": "đồng ngợi khen Cha hiển vinh, cao quý khôn cùng.",
        "ko": "주의 크신 위력 찬양하니",
        "zh": "上帝榮耀、大能隨處可見。",
        "en": "In skies above, their praise for you resounds.",
        "ja": "あなたについて語る"
      },
      {
        "vi": "Dù không lên tiếng và không lời nói vang vọng",
        "ko": "찬양 소리, 온 세상 끝까지",
        "zh": "奇妙萬物縱然無聲無言，",
        "en": "Creation speaks without a voice or word;",
        "ja": "星空 風の匂い"
      },
      {
        "vi": "vẫn rao thông điệp lan rộng khắp nơi gần xa.",
        "ko": "소리 없이 울려 퍼집니다.",
        "zh": "讚美之歌迴盪天地之間。",
        "en": "In all the earth, its message can be heard.",
        "ja": "あなたが語り掛ける"
      },
      {
        "vi": "Dù không lên tiếng và không lời nói vang vọng",
        "ko": "찬양 소리, 온 세상 끝까지",
        "zh": "奇妙萬物縱然無聲無言，",
        "en": "Creation speaks without a voice or word;",
        "ja": "明けゆく朝の光"
      },
      {
        "vi": "vẫn rao thông điệp lan rộng khắp nơi xa gần.",
        "ko": "소리 없이 울려 퍼집니다.",
        "zh": "讚美之歌迴盪天地之間。",
        "en": "In all the earth, its message can be heard.",
        "ja": "暮れゆく空の色も"
      },
      {
        "vi": "2. Lời Cha thanh khiết khắc ghi vào sâu trong lòng.",
        "ko": "2. 창조주신 주를 경외하면",
        "zh": "2．敬畏上帝得享真正智慧，",
        "en": "2. True wisdom starts with wholesome fear of you",
        "ja": "2. あなたの教え 清く"
      },
      {
        "vi": "Nhờ sự khôn ngoan chở che con khỏi tai họa.",
        "ko": "참된 지혜 깨닫게 되오니",
        "zh": "一切言行必受指引、護衛。",
        "en": "And guards our way in all we say and do.",
        "ja": "心に喜び湧く"
      },
      {
        "vi": "Điều răn thông sáng làm bao người thấy vui mừng,",
        "ko": "금보다 더 소중한 계명들",
        "zh": "寶貴法令價值遠勝純金，",
        "en": "Your wise commands enlighten young and old—",
        "ja": "全ての宝よりも"
      },
      {
        "vi": "quý hơn muôn lượng vàng ròng đã tinh luyện qua.",
        "ko": "올바른 길 환히 비춥니다.",
        "zh": "明智提醒使人一生獲益。",
        "en": "A treasure far exceeding finest gold.",
        "ja": "価値ある あなたの知恵"
      },
      {
        "vi": "Điều răn thông sáng làm bao người thấy vui mừng,",
        "ko": "금보다 더 소중한 계명들",
        "zh": "寶貴法令價值遠勝純金，",
        "en": "Your wise commands enlighten young and old—",
        "ja": "私の宝物は"
      },
      {
        "vi": "quý hơn muôn lượng vàng ròng đã qua tinh luyện.",
        "ko": "올바른 길 환히 비춥니다.",
        "zh": "明智提醒使人一生獲益。",
        "en": "A treasure far exceeding finest gold.",
        "ja": "輝く あなたの知恵"
      },
      {
        "vi": "3. Đời không vô nghĩa bởi nay được biết đến ngài.",
        "ko": "3. 아버지를 알게 된 우리는",
        "zh": "3．認識上帝生活充滿意義，",
        "en": "3. By knowing you, our life is not in vain,",
        "ja": "3. あなたのことを知れば"
      },
      {
        "vi": "Nhờ Lời Cha ban, giờ đây con có an bình.",
        "ko": "삶의 의미 찾게 되었으니",
        "zh": "你的話語給人永遠生命。",
        "en": "And by your word, our life will be sustained.",
        "ja": "豊かに生きていける"
      },
      {
        "vi": "Truyền rao danh thánh là vinh dự quý vô cùng,",
        "ko": "주 이름을 거룩게 하는 일",
        "zh": "盡力顯揚上帝偉大聖名，",
        "en": "The greatest honor anyone can gain",
        "ja": "あなたに従うなら"
      },
      {
        "vi": "chính Cha ban tặng cho người sống theo luật Cha.",
        "ko": "무엇보다 큰 영광입니다.",
        "zh": "豐厚獎賞天父必定賜予。",
        "en": "Will come to all who sanctify your name.",
        "ja": "幸せ 弾む心"
      },
      {
        "vi": "Truyền rao danh thánh là vinh dự quý vô cùng,",
        "ko": "주 이름을 거룩게 하는 일",
        "zh": "盡力顯揚上帝偉大聖名，",
        "en": "The greatest honor anyone can gain",
        "ja": "私の全て捧げ"
      },
      {
        "vi": "chính Cha ban tặng cho người sống theo luật ngài.",
        "ko": "무엇보다 큰 영광입니다.",
        "zh": "豐厚獎賞天父必定賜予。",
        "en": "Will come to all who sanctify your name.",
        "ja": "あなたを賛美したい"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 12:6; 89:7; 144:3; Rô 1:20).",
      "ko": "(시 12:6; 89:7; 144:3; 로마 1:20 참조)",
      "zh": "（參看詩12:6；89:7；144:3；羅1:20）",
      "en": "(See also Ps. 12:6; 89:7; 144:3; Rom. 1:20.)",
      "ja": "（詩 12:6; 89:7; 144:3; ロマ 1:20も参照。）"
    }
  },
  {
    "number": 12,
    "sourceSheet": "12",
    "labels": {
      "vi": "BÀI HÁT 12",
      "ko": "12번",
      "zh": "詩歌第12首",
      "en": "SONG 12",
      "ja": "12番"
    },
    "title": {
      "vi": "Đức Giê-hô-va, ngài thật vĩ đại",
      "ko": "위대한 하느님, 여호와",
      "zh": "偉大的耶和華上帝",
      "en": "Great God, Jehovah",
      "ja": "エホバは賛美を受けるにふさわしい方"
    },
    "scripture": {
      "vi": "(Xuất Ai Cập 34:6, 7)",
      "ko": "(출애굽기 34:6, 7)",
      "zh": "（出埃及記34:6,7）",
      "en": "(Exodus 34:6, 7)",
      "ja": "（出エジプト 34:6，7）"
    },
    "lines": [
      {
        "vi": "1. Hỡi Cha Giê-hô-va, đấng cai trị tối cao,",
        "ko": "1. 찬양받으실 위대한 주여,",
        "zh": "1．耶和華上帝，良善又正義，",
        "en": "1. Great God, Jehovah, you are deserving,",
        "ja": "1. 永遠の王エホバ"
      },
      {
        "vi": "ngài yêu thương, công chính vô cùng,",
        "ko": "언제나 선하시며",
        "zh": "一切讚美都歸你，",
        "en": "Worthy of the highest praise,",
        "ja": "賛美受けるに"
      },
      {
        "vi": "được ca khen, tôn vinh trên hết.",
        "ko": "의로우시나이다.",
        "zh": "唯有你配受崇敬。",
        "en": "Good and just in all your ways.",
        "ja": "ふさわしい方"
      },
      {
        "vi": "Lối Cha tuyệt hảo thay với bao điều sáng khôn.",
        "ko": "사랑과 지혜, 능력이 크신",
        "zh": "你充滿力量、智慧和愛心，",
        "en": "You have such power, deep love, and wisdom.",
        "ja": "深い愛 知恵を持つ "
      },
      {
        "vi": "Ngài là Vua vinh hiển, quyền năng.",
        "ko": "영원하신 하느님.",
        "zh": "永永遠遠是上帝。",
        "en": "You are God to endless days.",
        "ja": "公正な神"
      },
      {
        "vi": "2. Chúng con thật biết ơn bởi Cha hằng xót thương.",
        "ko": "2. 동정심 많은 아버지시여,",
        "zh": "2．仁愛的天父，我雖如塵土，",
        "en": "2. Father, we feel your tender compassion.",
        "ja": "2. 憐れみの父エホバ"
      },
      {
        "vi": "Ngài nghiêng tai nghe tiếng kêu cầu",
        "ko": "한없이 작은 나의",
        "zh": "你卻體恤和關心，",
        "en": "We are dust, and still you care;",
        "ja": "罪と過ち "
      },
      {
        "vi": "và gần bên quan tâm, chăm sóc.",
        "ko": "기도 들어 주소서.",
        "zh": "傾聽我訴說心意。",
        "en": "Graciously you hear our prayer.",
        "ja": "許される方"
      },
      {
        "vi": "Chúa khuyên dạy chúng con bước theo đường thẳng ngay.",
        "ko": "언제나 나를 지켜 주시는",
        "zh": "你賜予生命、教導和指引，",
        "en": "How you sustain us, teach us, and guide us!",
        "ja": "優しさと思いやり "
      },
      {
        "vi": "Hằng ngày Cha nâng đỡ, ủi an.",
        "ko": "따뜻하신 아버지.",
        "zh": "我的幫助來自你。",
        "en": "Help from you is always there.",
        "ja": "心に迫る"
      },
      {
        "vi": "3. Chúng con thành kính dâng tiếng ca ngợi đến Cha.",
        "ko": "3. 하늘과 땅이 주 찬양하고",
        "zh": "3．天地都稱頌榮耀的上帝，",
        "en": "3. Heaven and earth now sing of your glory.",
        "ja": "3. 全能の神エホバ"
      },
      {
        "vi": "Bầu trời rao ra hiển vinh ngài,",
        "ko": "우리 함께 영원히",
        "zh": "我們要歡呼高唱，",
        "en": "Joyfully with voices raised,",
        "ja": "全てのものを"
      },
      {
        "vi": "vật muôn nơi tôn vinh danh thánh.",
        "ko": "주를 드높이리니",
        "zh": "一生一世讚頌你。",
        "en": "We exalt you all our days.",
        "ja": "造られた方"
      },
      {
        "vi": "Suốt trong đời chúng con hát khen Giê-hô-va,",
        "ko": "위대하신 분, 주 여호와여,",
        "zh": "偉大的上帝，你配受崇敬，",
        "en": "Great God, Jehovah, you are deserving.",
        "ja": "この命ある限り"
      },
      {
        "vi": "nguyện xin Cha nghe tiếng ngợi ca.",
        "ko": "찬양을 받으소서.",
        "zh": "我們衷心讚美你。",
        "en": "Please accept our heartfelt praise.",
        "ja": "賛美歌おう"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Phục 32:4; Châm 16:12; Mat 6:10; Khải 4:11).",
      "ko": "(신명 32:4; 잠언 16:12; 마태 6:10; 계시록 4:11 참조)",
      "zh": "（參看申32:4；箴16:12；太6:10；啟4:11）",
      "en": "(See also Deut. 32:4; Prov. 16:12; Matt. 6:10; Rev. 4:11.)",
      "ja": "（申 32:4; 格 16:12; マタ 6:10; 啓 4:11も参照。）"
    }
  },
  {
    "number": 13,
    "sourceSheet": "13",
    "labels": {
      "vi": "BÀI HÁT 13",
      "ko": "13번",
      "zh": "詩歌第13首",
      "en": "SONG 13",
      "ja": "13番"
    },
    "title": {
      "vi": "Đấng Ki-tô, gương mẫu của chúng ta",
      "ko": "그리스도, 우리의 본",
      "zh": "基督是我們的榜樣",
      "en": "Christ, Our Model",
      "ja": "キリストは私たちの手本"
    },
    "scripture": {
      "vi": "(1 Phi-e-rơ 2:21)",
      "ko": "(베드로 전서 2:21)",
      "zh": "（彼得前書2:21）",
      "en": "(1 Peter 2:21)",
      "ja": "（ペテロ第一 2:21）"
    },
    "lines": [
      {
        "vi": "1. Vì Giê-hô-va nhân từ,",
        "ko": "1. 예수는 기꺼이 ",
        "zh": "1．耶和華就是愛，",
        "en": "1. What love Jehovah showed,",
        "ja": "1. 愛のエホバ "
      },
      {
        "vi": "ngài ban phước xuống dư tràn",
        "ko": "자신 바치시어",
        "zh": "樂意施恩行善，",
        "en": "What goodness from him flowed,",
        "ja": "私たちに"
      },
      {
        "vi": "và Cha hy sinh chính Con một để cứu muôn dân.",
        "ko": "하느님 사랑을 보여 주셨네.",
        "zh": "他為全人類獻出寶貴兒子。",
        "en": "When for all mankind he offered his Firstborn.",
        "ja": "独り子イエス与えた"
      },
      {
        "vi": "Từ trời xuống thế gian này,",
        "ko": "여호와 이름을 ",
        "zh": "耶穌擔當重任，",
        "en": "Christ took on human form—",
        "ja": "愛を学び"
      },
      {
        "vi": "Giê-su sống giữa nhân loại,",
        "ko": "드높이신 예수,",
        "zh": "甘願降世為人，",
        "en": "The Son of man was born—",
        "ja": "示すために "
      },
      {
        "vi": "ngài tôn vinh danh thánh khi hằng giữ trung thành.",
        "ko": "우리의 훌륭한 본 되시네.",
        "zh": "他完美榜樣為上帝增光。",
        "en": "By his example, God's name he adorned.",
        "ja": "良い手本下さった"
      },
      {
        "vi": "2. Lời Giê-hô-va khuyên dạy,",
        "ko": "2. 주 말씀 예수께 ",
        "zh": "2．耶穌一生遵行",
        "en": "2. Jehovah's Word, he said,",
        "ja": "2. イエスいつも "
      },
      {
        "vi": "ngài xem quý giá vô cùng;",
        "ko": "살아갈 힘 주고",
        "zh": "耶和華的話語，",
        "en": "Sustained his life like bread.",
        "ja": "神の言葉 "
      },
      {
        "vi": "Lời Cha ban thông sáng, vô vàn hiểu biết, khôn ngoan.",
        "ko": "지식과 지혜를 갖게 하였네.",
        "zh": "他充滿智慧、知識，明辨事理。",
        "en": "It gave him wisdom and knowledge and insight.",
        "ja": "生きていく支えにした"
      },
      {
        "vi": "Ngài làm đúng ý Cha truyền,",
        "ko": "아버지 마음을 ",
        "zh": "耶穌甘心樂意",
        "en": "His Father's willing slave,",
        "ja": "力を得て "
      },
      {
        "vi": "là gương chiếu sáng rạng ngời,",
        "ko": "기쁘게 하면서",
        "zh": "聽從上帝命令，",
        "en": "A model Jesus gave;",
        "ja": "父のために"
      },
      {
        "vi": "hầu cho Cha vui sướng trong lòng mãi muôn đời.",
        "ko": "예수도 기쁨을 얻으셨네.",
        "zh": "他多麼開心讓天父歡喜。",
        "en": "To please his Father would bring him delight.",
        "ja": "心込めて仕えた"
      },
      {
        "vi": "3. Học đường lối Giê-su dạy,",
        "ko": "3. 우리도 예수의 ",
        "zh": "3．我們仔細留意",
        "en": "3. Like Jesus, may our days",
        "ja": "3. よく学んで"
      },
      {
        "vi": "mình kiên quyết bước theo ngài,",
        "ko": "발자취 따라서",
        "zh": "耶穌一切言行，",
        "en": "Provide Jehovah praise,",
        "ja": "従いたい "
      },
      {
        "vi": "nguyện dâng lên bao tiếng ca tụng và kính tôn Cha.",
        "ko": "여호와 섬기며 살아가리라.",
        "zh": "要向他學習，天天榮耀上帝。",
        "en": "And may his footsteps become our own roadway.",
        "ja": "キリストの愛の手本"
      },
      {
        "vi": "Mình hằng nhớ đến gương ngài",
        "ko": "예수의 좋은 본 ",
        "zh": "一生緊緊跟從",
        "en": "Let Jesus' model be",
        "ja": "同じ愛を"
      },
      {
        "vi": "hầu theo sát dấu chân ngài",
        "ko": "영원히 따르며",
        "zh": "耶穌基督腳蹤，",
        "en": "Our path eternally,",
        "ja": "神に示し "
      },
      {
        "vi": "thì Cha ban vô số ơn lành suốt trong đời.",
        "ko": "주 은혜 날마다 누리리라.",
        "zh": "效法他榜樣，上帝必讚賞。",
        "en": "And then God's favor we'll know day by day.",
        "ja": "神に賛美捧げる"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Giăng 8:29; Ê-phê 5:2; Phi-líp 2:5-7).",
      "ko": "(요한 8:29; 에베소 5:2; 빌립보 2:5-7 참조)",
      "zh": "（參看約8:29；弗5:2；腓2:5-7）",
      "en": "(See also John 8:29; Eph. 5:2; Phil. 2:5-7.)",
      "ja": "（ヨハ 8:29; エフェ 5:2; フィリ 2:5-7も参照。）"
    }
  },
  {
    "number": 14,
    "sourceSheet": "14",
    "labels": {
      "vi": "BÀI HÁT 14",
      "ko": "14번",
      "zh": "詩歌第14首",
      "en": "SONG 14",
      "ja": "14番"
    },
    "title": {
      "vi": "Ngợi khen Vua mới của trái đất",
      "ko": "땅의 새로운 왕을 찬양하라",
      "zh": "讚美地球的新王",
      "en": "Praising Earth's New King",
      "ja": "地球を治める新しい王をたたえる"
    },
    "scripture": {
      "vi": "(Thi thiên 2:12)",
      "ko": "(시편 2:12)",
      "zh": "（詩篇2:12）",
      "en": "(Psalm 2:12)",
      "ja": "（詩編 2:12）"
    },
    "lines": [
      {
        "vi": "1. Nhìn xem đám đông, người trong các dân",
        "ko": "1. 모든 나라, 언어에서",
        "zh": "1．一大群人來自萬國，",
        "en": "1. A multitude is gathering",
        "ja": "1. 地球を治める"
      },
      {
        "vi": "cùng nhau đến đây ngợi khen Cha,",
        "ko": "사람들 모여드네.",
        "zh": "數目正不斷增多。",
        "en": "from ev'ry tribe and nation,",
        "ja": "王キリストは"
      },
      {
        "vi": "họ sướng vui nghe theo Giê-su với \"bầy nhỏ\" ",
        "ko": "주 예수와 남은 자들,",
        "zh": "主耶穌和他的弟兄",
        "en": "Collected by the Christ and his",
        "ja": "人々集める "
      },
      {
        "vi": "kêu gọi hết tâm tình.",
        "ko": "큰 무리 모으시네.",
        "zh": "召集人擁護王國。",
        "en": "anointed congregation.",
        "ja": "世界中から"
      },
      {
        "vi": "Hiện nay Nước Cha lập không chuyển lay.",
        "ko": "왕국이 탄생했으니",
        "zh": "上帝王國已經誕生，",
        "en": "God's Kingdom has been brought to birth;",
        "ja": "王国 地球を"
      },
      {
        "vi": "Nguyện ý muốn Cha nay mai sẽ thành.",
        "ko": "곧 하느님 뜻 이루리.",
        "zh": "願他旨意大功告成。",
        "en": "We pray his will be done on earth.",
        "ja": "楽園に変える"
      },
      {
        "vi": "Thật quý giá biết bao hy vọng ngài ban",
        "ko": "더없이 소중한 이 희망,",
        "zh": "樂園的希望多麼寶貴，",
        "en": "This hope is a gift of priceless worth,",
        "ja": "素晴らしい希望を"
      },
      {
        "vi": "để muôn dân khắp nơi được ủi an!",
        "ko": "기쁨과 새 힘을 주네.",
        "zh": "帶給我們快樂、安慰。",
        "en": "Giving joy and consolation.",
        "ja": "喜び歌おう"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Hãy đồng hát khen Giê-hô-va, hòa tiếng ca khen Con ngài,",
        "ko": "우리 하느님과 아들 찬양하라,",
        "zh": "來讚美耶和華，讚美他的兒子，",
        "en": "Praise our God, Jehovah; Praise his Son forever—",
        "ja": "神エホバと王イエスに"
      },
      {
        "vi": "là vị Vua trổi hơn mọi thế lực.",
        "ko": "왕들의 왕, 야의 아들을.",
        "zh": "耶穌基督是萬王之王。",
        "en": "King of all kings and the Lord of lords.",
        "ja": "賛美を捧げよう"
      },
      {
        "vi": "Mãi chung vai bên nhau ngợi ca, tôn vinh ngài,",
        "ko": "우리 하나 되어 왕이신 예수",
        "zh": "團結一心順服天上君王，",
        "en": "Now unitedly we bow to his rule",
        "ja": "新しい王イエス "
      },
      {
        "vi": "đồng lòng vâng theo Vua Nước Trời.",
        "ko": "늘 찬양하리라.",
        "zh": "永永遠遠讚美他。",
        "en": "And praise him with one accord.",
        "ja": "たたえていこう"
      },
      {
        "vi": "2. Nào ta hát ca ngợi khen Giê-su,",
        "ko": "2. 찬양하라, 그리스도",
        "zh": "2．君王耶穌已經登基，",
        "en": "2. We praise the Christ, our reigning King,",
        "ja": "2. 平和をもたらす"
      },
      {
        "vi": "vị Vua hiển vinh ngự trên ngôi,",
        "ko": "평화의 왕이시니.",
        "zh": "要向他歡呼致敬。",
        "en": "with sounds of jubilation.",
        "ja": "王キリストは"
      },
      {
        "vi": "là đấng Cha ban vai trò Quan Trưởng Bình An",
        "ko": "이 땅을 심판하시고",
        "zh": "基督身為和平領袖，",
        "en": "This Prince of Peace will be our Judge",
        "ja": "救いの希望を"
      },
      {
        "vi": "mai này cứu nhân loại.",
        "ko": "우릴 구원하시리.",
        "zh": "將為人帶來拯救。",
        "en": "and bring about salvation.",
        "ja": "人に与える"
      },
      {
        "vi": "Kìa bao cảnh huy hoàng ngay trước ta:",
        "ko": "그 환희의 때 오리니",
        "zh": "美好希望就在前頭，",
        "en": "We see the joys that lie ahead:",
        "ja": "恐れや不安が"
      },
      {
        "vi": "Một trái đất không lo âu, kinh sợ;",
        "ko": "두려워할 일 없으리.",
        "zh": "即將揮別恐懼、擔憂。",
        "en": "An earth released from fear and dread;",
        "ja": "なくなる世界で"
      },
      {
        "vi": "người chết bấy lâu nay, Vua gọi hồi sinh;",
        "ko": "죽은 자도 부활되리니",
        "zh": "死去的親友終必復活，",
        "en": "The time for our Lord to raise the dead.",
        "ja": "生き返る人々 "
      },
      {
        "vi": "khắp muôn nơi sống thanh bình, ấm no.",
        "ko": "기뻐하고 기뻐하라!",
        "zh": "歡欣盼望樂園生活。",
        "en": "What a time for exultation!",
        "ja": "迎える時来る"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Hãy đồng hát khen Giê-hô-va, hòa tiếng ca khen Con ngài,",
        "ko": "우리 하느님과 아들 찬양하라,",
        "zh": "來讚美耶和華，讚美他的兒子，",
        "en": "Praise our God, Jehovah; Praise his Son forever—",
        "ja": "神エホバと王イエスに"
      },
      {
        "vi": "là vị Vua trổi hơn mọi thế lực.",
        "ko": "왕들의 왕, 야의 아들을.",
        "zh": "耶穌基督是萬王之王。",
        "en": "King of all kings and the Lord of lords.",
        "ja": "賛美を捧げよう"
      },
      {
        "vi": "Mãi chung vai bên nhau ngợi ca, tôn vinh ngài,",
        "ko": "우리 하나 되어 왕이신 예수",
        "zh": "團結一心順服天上君王，",
        "en": "Now unitedly we bow to his rule",
        "ja": "新しい王イエス "
      },
      {
        "vi": "đồng lòng vâng theo Vua Nước Trời.",
        "ko": "늘 찬양하리라.",
        "zh": "永永遠遠讚美他。",
        "en": "And praise him with one accord.",
        "ja": "たたえていこう"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 2:6; 45:1; Ê-sai 9:6; Giăng 6:40).",
      "ko": "(시 2:6; 45:1; 이사야 9:6; 요한 6:40 참조)",
      "zh": "（參看詩2:6；45:1；賽9:6；約6:40）",
      "en": "(See also Ps. 2:6; 45:1; Isa. 9:6; John 6:40.)",
      "ja": "（詩 2:6; 45:1; イザ 9:6; ヨハ 6:40も参照。）"
    }
  },
  {
    "number": 15,
    "sourceSheet": "15",
    "labels": {
      "vi": "BÀI HÁT 15",
      "ko": "15번",
      "zh": "詩歌第15首",
      "en": "SONG 15",
      "ja": "15番"
    },
    "title": {
      "vi": "Khen ngợi Con Đầu Lòng của Đức Giê-hô-va!",
      "ko": "여호와의 맏아들을 찬양하라!",
      "zh": "讚美耶和華的長子！",
      "en": "Praise Jehovah's Firstborn!",
      "ja": "神の初子を賛美しましょう"
    },
    "scripture": {
      "vi": "(Hê-bơ-rơ 1:6)",
      "ko": "(히브리서 1:6)",
      "zh": "（希伯來書1:6）",
      "en": "(Hebrews 1:6)",
      "ja": "（ヘブライ 1:6）"
    },
    "lines": [
      {
        "vi": "1. Nào cùng trỗi tiếng khen ngợi,",
        "ko": "1. 주의 임명된 왕",
        "zh": "1．來向基督歡呼！",
        "en": "1. Praise Jehovah's Firstborn,",
        "ja": "1. 賛美しよう "
      },
      {
        "vi": "chào mừng vị Vua Nước của Cha!",
        "ko": "맏아들 찬양하라.",
        "zh": "讚美上帝的長子。",
        "en": "God's duly appointed King.",
        "ja": "神の初子を"
      },
      {
        "vi": "Trị vì nhờ chính nghĩa, công bằng,",
        "ko": "공의로 다스려서",
        "zh": "他持守正義、真理，",
        "en": "He reigns for truth and justice;",
        "ja": "天の王座に"
      },
      {
        "vi": "triều đại ngài ân phước dư tràn.",
        "ko": "축복 넘치게 하리.",
        "zh": "施行賢明的統治。",
        "en": "Rich blessings his rule will bring.",
        "ja": "つかれた方を"
      },
      {
        "vi": "Vua hằng yêu mến Giê-hô-va.",
        "ko": "주 이름 사랑하는,",
        "zh": "他帶著光彩榮耀，",
        "en": "With dignity and splendor",
        "ja": "栄光に満ち "
      },
      {
        "vi": "Trong sự vinh hiển, quyền uy,",
        "ko": "위엄 지닌 예수,",
        "zh": "彰顯上帝聖名，",
        "en": "And love for God's great name,",
        "ja": "真理守り"
      },
      {
        "vi": "Vua làm danh thánh được tôn quý,",
        "ko": "여호와 입증하고",
        "zh": "擁護天父的統治，",
        "en": "He'll vindicate Jehovah,",
        "ja": "神の主権を"
      },
      {
        "vi": "khen Chúa Tối Thượng oai nghi.",
        "ko": "그 주권 알리리.",
        "zh": "為上帝作見證。",
        "en": "His sov'reignty proclaim.",
        "ja": "掲げる方"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Nào cùng trỗi tiếng khen ngợi,",
        "ko": "여호와가 세운",
        "zh": "來向基督歡呼！",
        "en": "Praise Jehovah's Firstborn!",
        "ja": "賛美しよう"
      },
      {
        "vi": "chào mừng vị Vua mới lên ngôi!",
        "ko": "맏아들 찬양하라!",
        "zh": "讚美上帝的長子。",
        "en": "All praise God's anointed Son.",
        "ja": "神の初子を"
      },
      {
        "vi": "Triều đại ngài vững chắc, huy hoàng,",
        "ko": "왕으로 즉위하여",
        "zh": "他在錫安山作王，",
        "en": "Installed upon Mount Zion,",
        "ja": "王はシオンで"
      },
      {
        "vi": "được lập tại trên núi Si-ôn.",
        "ko": "지금 다스린다네!",
        "zh": "現在已掌權統治！",
        "en": "His Kingship has now begun!",
        "ja": "統治始めた"
      },
      {
        "vi": "2. Nào cùng trỗi tiếng khen ngợi,",
        "ko": "2. 우리 대속주인",
        "zh": "2．讚美上帝長子！",
        "en": "2. Praise Jehovah's Firstborn,",
        "ja": "2. 賛美しよう "
      },
      {
        "vi": "chào mừng vị Vua cứu chúng ta!",
        "ko": "맏아들 찬양하라.",
        "zh": "他甘願獻出贖價，",
        "en": "Who died so that we may live.",
        "ja": "神の初子を"
      },
      {
        "vi": "Nhờ ngài chịu chết cách khiêm nhường,",
        "ko": "겸손히 자신 바쳐",
        "zh": "讓人人得到救贖，",
        "en": "He humbly paid the ransom;",
        "ja": "贖いとなり "
      },
      {
        "vi": "mình được nhận sự sống muôn đời.",
        "ko": "죄 용서받게 했네.",
        "zh": "享有光明的前途。",
        "en": "Our sins God can now forgive.",
        "ja": "命捧げた"
      },
      {
        "vi": "Nay nàng dâu đón đợi Vua đến,",
        "ko": "흰옷으로 단장한",
        "zh": "「新娘」已披上嫁衣，",
        "en": "The bride of Christ awaits him,",
        "ja": "喜びの日を"
      },
      {
        "vi": "áo nàng tinh trắng làm sao.",
        "ko": "신부 예비됐네.",
        "zh": "等候上帝愛子，",
        "en": "Adorned for him in white.",
        "ja": "待つ花嫁"
      },
      {
        "vi": "Trên trời, hôn lễ này minh chứng",
        "ko": "그 결혼은 주 주권",
        "zh": "他們將一同顯揚",
        "en": "This marriage in the heavens",
        "ja": "輝く衣 "
      },
      {
        "vi": "Cha đáng kính thờ, tôn vinh.",
        "ko": "정당함 알리리.",
        "zh": "上帝正義統治。",
        "en": "Will prove God's rule is right.",
        "ja": "身にまとって"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Nào cùng trỗi tiếng khen ngợi,",
        "ko": "여호와가 세운",
        "zh": "來向基督歡呼！",
        "en": "Praise Jehovah's Firstborn!",
        "ja": "賛美しよう "
      },
      {
        "vi": "chào mừng vị Vua mới lên ngôi!",
        "ko": "맏아들 찬양하라!",
        "zh": "讚美上帝的長子。",
        "en": "All praise God's anointed Son.",
        "ja": "神の初子を"
      },
      {
        "vi": "Triều đại ngài vững chắc, huy hoàng,",
        "ko": "왕으로 즉위하여",
        "zh": "他在錫安山作王，",
        "en": "Installed upon Mount Zion,",
        "ja": "王はシオンで"
      },
      {
        "vi": "được lập tại trên núi Si-ôn.",
        "ko": "지금 다스린다네!",
        "zh": "現在已掌權統治！",
        "en": "His Kingship has now begun!",
        "ja": "統治始めた"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 2:6; 45:3, 4; Khải 19:8).",
      "ko": "(시 2:6; 45:3, 4; 계시록 19:8 참조)",
      "zh": "（參看詩2:6；45:3,4；啟19:8）",
      "en": "(See also Ps. 2:6; 45:3, 4; Rev. 19:8.)",
      "ja": "（詩 2:6; 45:3，4; 啓 19:8も参照。）"
    }
  },
  {
    "number": 16,
    "sourceSheet": "16",
    "labels": {
      "vi": "BÀI HÁT 16",
      "ko": "16번",
      "zh": "詩歌第16首",
      "en": "SONG 16",
      "ja": "16番"
    },
    "title": {
      "vi": "Ca ngợi Gia vì người Con được xức dầu của ngài",
      "ko": "아들을 기름부으신 야를 찬양하라",
      "zh": "讚美耶和華，他已委任愛子作王！",
      "en": "Praise Jah for His Son, the Anointed",
      "ja": "王を任命したヤハを賛美する"
    },
    "scripture": {
      "vi": "(Khải huyền 21:2)",
      "ko": "(요한 계시록 21:2)",
      "zh": "（啟示錄21:2）",
      "en": "(Revelation 21:2)",
      "ja": "（啓示 21:2）"
    },
    "lines": [
      {
        "vi": "1. Cha ban người Con quý ngôi hiển vinh,",
        "ko": "1. 아들 기름부으셨네,",
        "zh": "1．上帝委任他的愛子",
        "en": "1. Jehovah anointed his Son",
        "ja": "1. 神はキリストを"
      },
      {
        "vi": "cai quản khắp muôn dân gần xa.",
        "ko": "온 땅 다스리도록.",
        "zh": "在天上作王統治。",
        "en": "To rule over ev'ryone.",
        "ja": "王に選んだ"
      },
      {
        "vi": "Ngôi Nước lập trên bao công lý, chính trực,",
        "ko": "예수 공의로 다스려서",
        "zh": "他的寶座憑公正堅立，",
        "en": "His throne is established on justice,",
        "ja": "神の望むことを"
      },
      {
        "vi": "mai mốt thực thi ý Chúa khắp đất.",
        "ko": "주의 뜻을 이루리라.",
        "zh": "必定實現上帝旨意。",
        "en": "That God's will on earth may be done.",
        "ja": "成し遂げるために"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Nào hãy cất tiếng hát khen Giê-hô-va.",
        "ko": "주 여호와를 찬양하라.",
        "zh": "讚美耶和華偉大天父，",
        "en": "Praise Jah for his Son, the Anointed.",
        "ja": "忠実な羊はヤハを"
      },
      {
        "vi": "Chào đón Đấng Cứu Rỗi nay làm Vua.",
        "ko": "아들 예수 찬양하라.",
        "zh": "稱頌天上君王耶穌，",
        "en": "Praise Jesus, O you faithful sheep,",
        "ja": "賛美する"
      },
      {
        "vi": "Bầy chiên luôn chú tâm theo sát bao điều răn,",
        "ko": "모든 계명에 순종하면서",
        "zh": "忠貞門徒聽從基督吩咐，",
        "en": "Who loyally follow day after day",
        "ja": "毎日の生活で"
      },
      {
        "vi": "bước đi trung thành luôn cùng Vua.",
        "ko": "왕 예수를 따르라.",
        "zh": "天天跟隨他腳步。",
        "en": "and all his commandments keep.",
        "ja": "おきてを守る"
      },
      {
        "vi": "Nào hãy cất tiếng hát khen Giê-hô-va,",
        "ko": "주 여호와를 찬양하라.",
        "zh": "讚美耶和華偉大天父，",
        "en": "Praise Jah for his Son, the Anointed,",
        "ja": "忠実な羊は"
      },
      {
        "vi": "vì đã xuống phước lớn cho mọi dân!",
        "ko": "아들 예수 찬양하라.",
        "zh": "來向天上君王歡呼，",
        "en": "the Ruler of heavenly fame,",
        "ja": "イエスをたたえる"
      },
      {
        "vi": "Ngài ban Con dấu yêu vinh hiển, bao quyền năng ",
        "ko": "기쁨, 위력이 넘치는 예수,",
        "zh": "基督歡欣領受統治權柄，",
        "en": "Anointed with exultation and might",
        "ja": "神により選ばれた"
      },
      {
        "vi": "hầu làm rạng danh Cha không ngớt.",
        "ko": "주 여호와 높이리.",
        "zh": "彰顯天父的聖名。",
        "en": "to honor God's holy name.",
        "ja": "王に従う"
      },
      {
        "vi": "2. Bao nhiêu người trung tín Cha xức dầu,",
        "ko": "2. 하느님이 부르셨네,",
        "zh": "2．基督的弟兄蒙揀選，",
        "en": "2. Christ's brothers are chosen and called.",
        "ja": "2. 神はキリストに"
      },
      {
        "vi": "Cha hứa sẽ ban cho quyền uy.",
        "ko": "그리스도 형제들.",
        "zh": "由上帝親自委任，",
        "en": "God gives them their own new birth.",
        "ja": "兄弟与え"
      },
      {
        "vi": "Vui sướng cùng Giê-su trên ngôi Nước Trời,",
        "ko": "함께 이 땅을 다스려서",
        "zh": "即將與耶穌同享王權，",
        "en": "This bride class will share in the Kingdom",
        "ja": "共にこの地球を"
      },
      {
        "vi": "đem đến nhiều ân phước khắp trái đất.",
        "ko": "낙원 만들게 하시리.",
        "zh": "讓地上的樂園重現。",
        "en": "And bring Paradise to this earth.",
        "ja": "楽園に変える"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Nào hãy cất tiếng hát khen Giê-hô-va.",
        "ko": "주 여호와를 찬양하라.",
        "zh": "讚美耶和華偉大天父，",
        "en": "Praise Jah for his Son, the Anointed.",
        "ja": "忠実な羊はヤハを"
      },
      {
        "vi": "Chào đón Đấng Cứu Rỗi nay làm Vua.",
        "ko": "아들 예수 찬양하라.",
        "zh": "稱頌天上君王耶穌，",
        "en": "Praise Jesus, O you faithful sheep,",
        "ja": "賛美する"
      },
      {
        "vi": "Bầy chiên luôn chú tâm theo sát bao điều răn,",
        "ko": "모든 계명에 순종하면서",
        "zh": "忠貞門徒聽從基督吩咐，",
        "en": "Who loyally follow day after day",
        "ja": "毎日の生活で"
      },
      {
        "vi": "bước đi trung thành luôn cùng Vua.",
        "ko": "왕 예수를 따르라.",
        "zh": "天天跟隨他腳步。",
        "en": "and all his commandments keep.",
        "ja": "おきてを守る"
      },
      {
        "vi": "Nào hãy cất tiếng hát khen Giê-hô-va,",
        "ko": "주 여호와를 찬양하라.",
        "zh": "讚美耶和華偉大天父，",
        "en": "Praise Jah for his Son, the Anointed,",
        "ja": "忠実な羊は"
      },
      {
        "vi": "vì đã xuống phước lớn cho mọi dân!",
        "ko": "아들 예수 찬양하라.",
        "zh": "來向天上君王歡呼，",
        "en": "the Ruler of heavenly fame,",
        "ja": "イエスをたたえる"
      },
      {
        "vi": "Ngài ban Con dấu yêu vinh hiển, bao quyền năng ",
        "ko": "기쁨, 위력이 넘치는 예수,",
        "zh": "基督歡欣領受統治權柄，",
        "en": "Anointed with exultation and might",
        "ja": "神により選ばれた"
      },
      {
        "vi": "hầu làm rạng danh Cha không ngớt.",
        "ko": "주 여호와 높이리.",
        "zh": "彰顯天父的聖名。",
        "en": "to honor God's holy name.",
        "ja": "王に従う"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Châm 29:4; Ê-sai 66:7, 8; Giăng 10:4; Khải 5:9, 10).",
      "ko": "(잠언 29:4; 이사야 66:7, 8; 요한 10:4; 계시록 5:9, 10 참조)",
      "zh": "（參看箴29:4；賽66:7,8；約10:4；啟5:9,10）",
      "en": "(See also Prov. 29:4; Isa. 66:7, 8; John 10:4; Rev. 5:9, 10.)",
      "ja": "（格 29:4; イザ 66:7，8; ヨハ 10:4; 啓 5:9，10も参照。）"
    }
  },
  {
    "number": 17,
    "sourceSheet": "17",
    "labels": {
      "vi": "BÀI HÁT 17",
      "ko": "17번",
      "zh": "詩歌第17首",
      "en": "SONG 17",
      "ja": "17番"
    },
    "title": {
      "vi": "\"Tôi muốn\"",
      "ko": "\"내가 원합니다\"",
      "zh": "「我很願意」",
      "en": "\"I Want To\"",
      "ja": "「そう望みます」"
    },
    "scripture": {
      "vi": "(Lu-ca 5:13)",
      "ko": "(누가복음 5:13)",
      "zh": "（路加福音5:13）",
      "en": "(Luke 5:13)",
      "ja": "（ルカ 5:13）"
    },
    "lines": [
      {
        "vi": "1. Xưa Giê-su bởi thương xót vô bờ",
        "ko": "1. 예수 우리 사랑하여",
        "zh": "1．從天上來到這世界，",
        "en": "1. Kind and patient, perfect in love,",
        "ja": "1. 親切 辛抱 "
      },
      {
        "vi": "nguyện rời nơi cao xuống chốn nhân gian.",
        "ko": "아버지의 곁을 떠나",
        "zh": "耶穌甘心樂意捨己。",
        "en": "Was Christ, who came down from above.",
        "ja": "イエスは示した"
      },
      {
        "vi": "Ngài kiên nhẫn, yêu thương và",
        "ko": "사람들 따뜻이 ",
        "zh": "滿懷仁慈、耐心，",
        "en": "He took care of our needs",
        "ja": "人を愛し"
      },
      {
        "vi": "thường quan tâm, cảm thông,",
        "ko": "위로하시며",
        "zh": "以言行證明，",
        "en": "With words and by deeds;",
        "ja": "慰めた "
      },
      {
        "vi": "sẻ chia những lời ủi an, từ nhân;",
        "ko": "지친 마음 안으셨네.",
        "zh": "對人的關懷和愛心。",
        "en": "He gave of his time and his love.",
        "ja": "天から地に来て"
      },
      {
        "vi": "luôn nói: \"Tôi muốn\" trợ giúp mọi người,",
        "ko": "병든 이들 고쳐 주며",
        "zh": "他治癒各樣的殘疾，",
        "en": "He would keep the lowly in mind",
        "ja": "関心示した "
      },
      {
        "vi": "trị lành về thể chất lẫn tâm linh.",
        "ko": "마음 다해 돌보셨네.",
        "zh": "寒微人他惦記在心。",
        "en": "By healing the sick, deaf, and blind.",
        "ja": "弱い人たちに"
      },
      {
        "vi": "Ngài cho thấy khi cai trị từ trời cao,",
        "ko": "충실히 일하며 하신 말씀,",
        "zh": "上帝交託使命全力執行，",
        "en": "To his royal commission he proved true",
        "ja": "愛あるイエスは言った"
      },
      {
        "vi": "Vua sẽ đưa tay trợ giúp người gần xa.",
        "ko": "‘내가 정말 원합니다.'",
        "zh": "他衷心地說：「我願意。」",
        "en": "And willingly said: \"I want to.\"",
        "ja": "「私はそう望む」"
      },
      {
        "vi": "2. Luôn nói: \"Tôi muốn\" như Giê-su dạy,",
        "ko": "2. 우리 마음 감동받아",
        "zh": "2．願我們都效法耶穌，",
        "en": "2. We now try to follow his way",
        "ja": "2. イエスの生き方 "
      },
      {
        "vi": "đường ngài đi theo sát mãi không sai.",
        "ko": "예수의 본 따르리라.",
        "zh": "天天跟隨他的腳步。",
        "en": "In all of our dealings each day.",
        "ja": "学ぶべき模範"
      },
      {
        "vi": "Mình thương xót, quan tâm và",
        "ko": "선한 사람 찾아 ",
        "zh": "懷著仁慈、愛心，",
        "en": "We are loving and kind",
        "ja": "心からの"
      },
      {
        "vi": "dạy muôn dân lắng nghe",
        "ko": "진리 알도록",
        "zh": "傳王國信息，",
        "en": "To all whom we find;",
        "ja": "愛示す "
      },
      {
        "vi": "tiếng Cha phán truyền, quyết tâm làm theo.",
        "ko": "참사랑으로 도우리.",
        "zh": "教導人們聽從上帝。",
        "en": "We help them to learn and obey.",
        "ja": "どんな人にでも"
      },
      {
        "vi": "Trong khó khăn, chúng ta ở bên cạnh",
        "ko": "아픔, 시련 겪는 벗들",
        "zh": "弟兄姐妹陷入困境，",
        "en": "We respond to friends when in need;",
        "ja": "涙の友にはすぐに"
      },
      {
        "vi": "tận tình yêu thương, giúp đỡ anh em.",
        "ko": "우리 사랑 느끼리라.",
        "zh": "要以行動表現愛心。",
        "en": "We love them in word and in deed.",
        "ja": "手を伸ばし"
      },
      {
        "vi": "Vậy nếu thấy ai là mồ côi, đơn chiếc,",
        "ko": "그들을 도우며 말하리라,",
        "zh": "若有孤兒寡婦向你求助，",
        "en": "So if widows and orphans should ask you,",
        "ja": "そばで寄り添い 言おう"
      },
      {
        "vi": "ta muốn đưa tay trợ giúp và ủi an.",
        "ko": "‘내가 정말 원합니다.'",
        "zh": "要樂意地說：「我願意。」",
        "en": "Then readily say: \"I want to.\"",
        "ja": "「私はそう望む」"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Giăng 18:37; Ê-phê 3:19; Phi-líp 2:7).",
      "ko": "(요한 18:37; 에베소 3:19; 빌립보 2:7 참조)",
      "zh": "（參看約18:37；弗3:19；腓2:7）",
      "en": "(See also John 18:37; Eph. 3:19; Phil. 2:7.)",
      "ja": "（ヨハ 18:37; エフェ 3:19; フィリ 2:7も参照。）"
    }
  },
  {
    "number": 18,
    "sourceSheet": "18",
    "labels": {
      "vi": "BÀI HÁT 18",
      "ko": "18번",
      "zh": "詩歌第18首",
      "en": "SONG 18",
      "ja": "18番"
    },
    "title": {
      "vi": "Biết ơn về giá chuộc",
      "ko": "대속 마련에 감사합니다",
      "zh": "感激上帝的贖價恩賜",
      "en": "Grateful for the Ransom",
      "ja": "贖いに感謝する"
    },
    "scripture": {
      "vi": "(Lu-ca 22:20)",
      "ko": "(누가복음 22:20)",
      "zh": "（路加福音22:20）",
      "en": "(Luke 22:20)",
      "ja": "（ルカ 22:20）"
    },
    "lines": [
      {
        "vi": "1. Mọi người hôm nay đứng trước ngôi Cha uy nghi, cao trọng.",
        "ko": "1. 여호와여, 당신 앞에 설 수 있는",
        "zh": "1．我們今天來到耶和華寶座前，",
        "en": "1. Today, Jehovah God, we stand before your throne,",
        "ja": "1. エホバよ あなたに近づき"
      },
      {
        "vi": "Tạ ơn Chúa đã ban Con một chịu tội thay cho chúng con.",
        "ko": "한없는 그 사랑, 감사할 뿐입니다.",
        "zh": "感謝你向人表現無與倫比的愛。",
        "en": "For you showed the greatest love that could ever be shown.",
        "ja": "尊い愛に感謝します"
      },
      {
        "vi": "Tình yêu thương Cha quá lớn! Chúng con được Cha thương xót, ",
        "ko": "우리를 살리려 아들 내어 주신",
        "zh": "為拯救人甘願作出重大犧牲，",
        "en": "You gave the gift of your dear Son, that we might live.",
        "ja": "私たちを救うために"
      },
      {
        "vi": "sống trong hy vọng, hướng tới tương lai đầy ân phước dư tràn.",
        "ko": "크신 그 희생 무엇에 비하리이까!",
        "zh": "樂意賜下親愛兒子使人得永生。",
        "en": "No greater sacrifice than this could you ever give.",
        "ja": "イエスを与えてくださった"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Nhờ nơi huyết báu Con một của Cha,",
        "ko": "고귀한 생명의 피로",
        "zh": "全因耶穌為人犧牲，",
        "en": "He gave his life to set us free.",
        "ja": "こんな素晴らしい"
      },
      {
        "vi": "giờ ai tin Chúa sẽ được cứu chuộc.",
        "ko": "우리를 구원하시니",
        "zh": "得享自由美好福分。",
        "en": "His precious blood provides the key.",
        "ja": "贈り物はない"
      },
      {
        "vi": "Một lòng tôn kính, chúng con ca khen danh ngài đời đời không thôi.",
        "ko": "여호와여, 감사드립니다, 영원토록.",
        "zh": "感激稱頌耶和華的救恩直到永恆。",
        "en": "With all our hearts, we'll go on thanking you eternally.",
        "ja": "決して忘れない この感謝を"
      },
      {
        "vi": "2. Vì yêu thương nên chính Đấng Ki-tô hy sinh thân mình,",
        "ko": "2. 예수는 완전한 생명을 바치고",
        "zh": "2．耶穌聽從天父吩咐來到世上，",
        "en": "2. It was a willing sacrifice that Jesus made.",
        "ja": "2. 命の希望 持てるよう"
      },
      {
        "vi": "chịu đau đớn, chết cho nhân loại, đẩy lùi đêm đen tối tăm.",
        "ko": "사랑으로 우리의 빚을 갚으시니,",
        "zh": "他深愛人類甘願獻出貴重贖價。",
        "en": "Out of love, his perfect life was the price that he paid.",
        "ja": "イエスは深い愛を示し"
      },
      {
        "vi": "Nhờ ngài, mai đây chết chóc sẽ luôn chìm trong quên lãng.",
        "ko": "아무 희망 없이 살아왔던 우리",
        "zh": "捨棄完美生命給人光明希望，",
        "en": "We had no hope until he came to save mankind.",
        "ja": "私たちを救うために"
      },
      {
        "vi": "Chúng con vui mừng, háo hức trông mong nhận sự sống muôn đời.",
        "ko": "이제는 영원한 생명 바라봅니다.",
        "zh": "他的寶血使我們能夠擺脫死亡。",
        "en": "But now our hope is finding life, leaving death behind.",
        "ja": "貴重な命を差し出した"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Nhờ nơi huyết báu Con một của Cha,",
        "ko": "고귀한 생명의 피로",
        "zh": "全因耶穌為人犧牲，",
        "en": "He gave his life to set us free.",
        "ja": "こんな素晴らしい"
      },
      {
        "vi": "giờ ai tin Chúa sẽ được cứu chuộc.",
        "ko": "우리를 구원하시니",
        "zh": "得享自由美好福分。",
        "en": "His precious blood provides the key.",
        "ja": "贈り物はない"
      },
      {
        "vi": "Một lòng tôn kính, chúng con ca khen danh ngài đời đời không thôi.",
        "ko": "여호와여, 감사드립니다, 영원토록.",
        "zh": "感激稱頌耶和華的救恩直到永恆。",
        "en": "With all our hearts, we'll go on thanking you eternally.",
        "ja": "決して忘れない この感謝を"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Hê 9:13, 14; 1 Phi 1:18, 19).",
      "ko": "(히브리 9:13, 14; 베드로 전서 1:18, 19 참조)",
      "zh": "（參看來9:13,14；彼前1:18,19）",
      "en": "(See also Heb. 9:13, 14; 1 Pet. 1:18, 19.)",
      "ja": "（ヘブ 9:13，14; ペテ一 1:18，19も参照。）"
    }
  },
  {
    "number": 19,
    "sourceSheet": "19",
    "labels": {
      "vi": "BÀI HÁT 19",
      "ko": "19번",
      "zh": "詩歌第19首",
      "en": "SONG 19",
      "ja": "19番"
    },
    "title": {
      "vi": "Bữa Ăn Tối Của Chúa",
      "ko": "주의 만찬",
      "zh": "主的晚餐",
      "en": "The Lord's Evening Meal",
      "ja": "主の晩餐"
    },
    "scripture": {
      "vi": "(Ma-thi-ơ 26:26-30)",
      "ko": "(마태복음 26:26-30)",
      "zh": "（馬太福音26:26-30）",
      "en": "(Matthew 26:26-30)",
      "ja": "（マタイ 26:26-30）"
    },
    "lines": [
      {
        "vi": "1. Ôi Cha Giê-hô-va trên tầng trời cao,",
        "ko": "1. 우리 아버지 여호와여,",
        "zh": "1．天父耶和華偉大真神，",
        "en": "1. Jehovah, our Father in heaven,",
        "ja": "1. 天の父を思う "
      },
      {
        "vi": "đêm nay đêm thánh khiết, trang trọng thay!",
        "ko": "실로 거룩한 이 밤에",
        "zh": "今晚是何等的神聖！",
        "en": "Oh, this is a most sacred night!",
        "ja": "神聖な夜に"
      },
      {
        "vi": "Vì công chính và quyền lực, đầy thông sáng và rộng lượng,",
        "ko": "오래전 보이신 사랑과 위력을",
        "zh": "千年前那一夜，你決意要展現",
        "en": "It was then, long ago, you determined to show",
        "ja": "父は深い愛示した "
      },
      {
        "vi": "ngài muốn giúp muôn dân được giải cứu.",
        "ko": "깊이 생각하나이다.",
        "zh": "愛心、公正、力量、智慧。",
        "en": "Your love, justice, wisdom, and might.",
        "ja": "昔のこの日に"
      },
      {
        "vi": "Nhờ dâng lên chiên con theo ý Cha truyền",
        "ko": "그 밤 유월절 양을 통해",
        "zh": "逾越節羊羔帶來拯救，",
        "en": "The Passover lamb gave protection,",
        "ja": "人々救うため "
      },
      {
        "vi": "mà dân Cha khi xưa thoát ách nô.",
        "ko": "이스라엘 해방됐고",
        "zh": "以色列人重獲自由。",
        "en": "And your favored people were freed.",
        "ja": "子を犠牲にして"
      },
      {
        "vi": "Ngàn năm sau Giê-su đến và dâng hiến chính thân mình;",
        "ko": "오랜 후 예수는 생명 바치시어",
        "zh": "許多世紀過去，耶穌流出寶血，",
        "en": "Cent'ries later our Lord his own lifeblood outpoured",
        "ja": "命の扉を開いた "
      },
      {
        "vi": "huyết vô tội làm lời hứa Cha vẹn toàn.",
        "ko": "예언을 이루셨나이다.",
        "zh": "經上的預言終獲應驗。",
        "en": "To fulfill this divine prophecy.",
        "ja": "子に従う人に"
      },
      {
        "vi": "2. Xưa kia Con yêu dấu trung thành cùng Cha,",
        "ko": "2. 빵과 포도주 마주하니",
        "zh": "2．面前餅和酒提醒我們，",
        "en": "2. The bread and the wine are reminders,",
        "ja": "2. イエスの死を思う "
      },
      {
        "vi": "chông gai hay gian khó không hề chi.",
        "ko": "깊은 감동 느낍니다.",
        "zh": "你付出了貴重代價。",
        "en": "How great is the price that you paid.",
        "ja": "パンとぶどう酒で"
      },
      {
        "vi": "Giờ qua bánh và rượu này, hằng ghi nhớ việc ngài làm.",
        "ko": "우리를 위하여 아들 주신 것은",
        "zh": "你樂意為世人，賜下深愛兒子，",
        "en": "And the good that was done through the gift of your Son,",
        "ja": "イエス 父の願い受けて "
      },
      {
        "vi": "Điều Chúa đã hy sinh thật vô giá!",
        "ko": "아버지의 크신 선물.",
        "zh": "藉他成就許多美事。",
        "en": "In life and in death he obeyed.",
        "ja": "命差し出した"
      },
      {
        "vi": "Hằng năm, khi tham gia nghi lễ cao trọng,",
        "ko": "이 밤 기념식 지키면서",
        "zh": "我們每年舉行這聚會，",
        "en": "We gratefully keep this Memorial;",
        "ja": "生涯貫いた "
      },
      {
        "vi": "lòng ghi sâu công ơn Cha thuở xưa.",
        "ko": "마음속에 새깁니다,",
        "zh": "深思你賜予的恩惠。",
        "en": "This night is a time to recall",
        "ja": "父への忠誠"
      },
      {
        "vi": "Nhờ Giê-su nguyện hy sinh, chịu đau đớn cứu nhân loại,",
        "ko": "우리를 살리려 아들 희생하신",
        "zh": "耶穌甘願犧牲，捨生命救贖人，",
        "en": "How the death of your Son paid the ransom that won",
        "ja": "人を罪から救い出す "
      },
      {
        "vi": "ách nô lệ của tội lỗi mãi không còn.",
        "ko": "당신의 깊은 그 은혜를.",
        "zh": "使人擺脫死亡得永生。",
        "en": "The redemption from death for us all.",
        "ja": "命と引き換えに"
      },
      {
        "vi": "3. Hôm nay, Cha cho chúng con họp lại đây,",
        "ko": "3. 아버지의 초대를 받아",
        "zh": "3．我們多榮幸受你邀請，",
        "en": "3. We're gathered together before you.",
        "ja": "3. 神の前に集う "
      },
      {
        "vi": "theo y như khuôn mẫu Con ngài ban.",
        "ko": "여기 다 함께 모여서",
        "zh": "欣然在你面前聚集。",
        "en": "At your invitation we've come",
        "ja": "感謝にあふれて"
      },
      {
        "vi": "Ngợi khen Chúa thật tuyệt vời vì ban Con một của ngài.",
        "ko": "아들을 내주신 크나큰 사랑을",
        "zh": "我們衷心感恩你無私愛世人，",
        "en": "To give praise for your love that brought Christ from above ",
        "ja": "生きる意味が与えられた "
      },
      {
        "vi": "Thờ kính Giê-hô-va đầy vinh hiển.",
        "ko": "높이 찬양하렵니다.",
        "zh": "賜下耶穌為人犧牲。",
        "en": "And honor to you and your Son.",
        "ja": "贖いによって"
      },
      {
        "vi": "Cùng nhau tôn vinh Cha qua Lễ Tưởng Niệm,",
        "ko": "이 기념식 주 드높이며",
        "zh": "「主的晚餐」榮耀你的名，",
        "en": "The Lord's Ev'ning Meal brings you glory",
        "ja": "神と子の犠牲を"
      },
      {
        "vi": "lòng thêm yêu thương Cha tha thiết hơn.",
        "ko": "내 마음에 힘을 주니",
        "zh": "讓我們信心更堅定。",
        "en": "And strengthens our heart and our mind.",
        "ja": "決して忘れない"
      },
      {
        "vi": "Nguyện đi trên đường công chính và theo sát chẳng xa rời,",
        "ko": "예수 걸어가신 그 길 따라 걸어",
        "zh": "決心天天跟從耶穌基督腳蹤，",
        "en": "So we'll walk ev'ry day as Christ showed us the way,",
        "ja": "開かれた命の道を"
      },
      {
        "vi": "với hy vọng nhận sự sống đến muôn đời.",
        "ko": "영원한 생명 살렵니다.",
        "zh": "期待在未來永遠生活。",
        "en": "And then life everlasting we'll find.",
        "ja": "神のために生きる"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Lu 22:14-20; 1 Cô 11:23-26).",
      "ko": "(누가 22:14-20; 고린도 전서 11:23-26 참조)",
      "zh": "（參看路22:14-20；林前11:23-26）",
      "en": "(See also Luke 22:14-20; 1 Cor. 11:23-26.)",
      "ja": "（ルカ 22:14-20; コリ一 11:23-26も参照。）"
    }
  },
  {
    "number": 20,
    "sourceSheet": "20",
    "labels": {
      "vi": "BÀI HÁT 20",
      "ko": "20번",
      "zh": "詩歌第20首",
      "en": "SONG 20",
      "ja": "20番"
    },
    "title": {
      "vi": "Ngài ban Con một yêu quý",
      "ko": "소중한 아들을 주신 은혜",
      "zh": "感謝你賜下寶貴兒子",
      "en": "You Gave Your Precious Son",
      "ja": "あなたは貴重な子を与えてくださった"
    },
    "scripture": {
      "vi": "(1 Giăng 4:9)",
      "ko": "(요한 1서 4:9)",
      "zh": "（約翰一書4:9）",
      "en": "(1 John 4:9)",
      "ja": "（ヨハネ第一 4:9）"
    },
    "lines": [
      {
        "vi": "1. Cả nhân loại đều than khóc,",
        "ko": "1. 여호와 아버지, ",
        "zh": "1．親愛的耶和華，",
        "en": "1. Jehovah, dear Father,",
        "ja": "1. 愛のエホバ "
      },
      {
        "vi": "đều vô vọng và lầm lạc.",
        "ko": "대속을 통해서",
        "zh": "我們曾經絕望，",
        "en": "There seemed no hope for us.",
        "ja": "天の父よ"
      },
      {
        "vi": "Giê-hô-va đầy thương xót",
        "ko": "희망을 주시니 ",
        "zh": "但贖價為人類",
        "en": "The ransom has given",
        "ja": "人を許す "
      },
      {
        "vi": "đã ban Con của Cha.",
        "ko": "감사합니다!",
        "zh": "帶來了希望。",
        "en": "Hope to ev'ryone!",
        "ja": "贖いで"
      },
      {
        "vi": "Thờ kính ngài nên chúng con",
        "ko": "내 생명 다 바쳐 ",
        "zh": "我們獻出自己，",
        "en": "We give our lives to you,",
        "ja": "あなたの愛 "
      },
      {
        "vi": "nguyện hết mình bước theo ngài",
        "ko": "주의 뜻 행하고",
        "zh": "為你竭盡全力，",
        "en": "Our best in all we do.",
        "ja": "学んだ時"
      },
      {
        "vi": "và mỗi ngày rao báo tin",
        "ko": "더없는 그 사랑 ",
        "zh": "告訴人好消息：",
        "en": "And we'll tell others too,",
        "ja": "生きる意味に"
      },
      {
        "vi": "hầu ý Cha luôn thực thi.",
        "ko": "늘 알리렵니다.",
        "zh": "新世界快來臨。",
        "en": "That your will might be done.",
        "ja": "光差した"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Đồng hát khen Cha suốt đời",
        "ko": "우리 하나 되어 ",
        "zh": "感謝你耶和華，",
        "en": "You gave your precious Son,",
        "ja": "あなたのため"
      },
      {
        "vi": "vì đã ban Con một quý.",
        "ko": "노래 부릅니다.",
        "zh": "將獨生子賜下。",
        "en": "And now we sing as one,",
        "ja": "永遠まで"
      },
      {
        "vi": "Thành kính ca khen đến muôn đời",
        "ko": "아들을 주신 은혜 ",
        "zh": "你偉大無私恩情，",
        "en": "A song we'll sing forever,",
        "ja": "歌い続ける "
      },
      {
        "vi": "vì đã hy sinh Con yêu của Cha.",
        "ko": "영원히 기리는 노래.",
        "zh": "我們永遠銘記在心。",
        "en": "for giving us your precious Son.",
        "ja": "あふれる感謝を"
      },
      {
        "vi": "2. Ngài nhân từ, đầy thương xót",
        "ko": "2. 친절과 자비로 ",
        "zh": "2．你仁慈又憐憫，",
        "en": "2. Your kindness, your mercy,",
        "ja": "2. 愛のエホバ "
      },
      {
        "vi": "mời muôn người làm bạn ngài.",
        "ko": "이끌어 주시고",
        "zh": "我們受你吸引。",
        "en": "They draw us close to you.",
        "ja": "真の神よ"
      },
      {
        "vi": "Và danh ngài thật thanh khiết,",
        "ko": "벗 되어 주시니 ",
        "zh": "能與你更親近",
        "en": "Your great name, your friendship,",
        "ja": "人を迎え "
      },
      {
        "vi": "chúng con luôn ngợi khen.",
        "ko": "행복합니다.",
        "zh": "是莫大榮幸。",
        "en": "These we've come to love.",
        "ja": "友となる"
      },
      {
        "vi": "Một món quà cao quý thay",
        "ko": "하지만 그보다 ",
        "zh": "你差耶穌基督，",
        "en": "But something more than this",
        "ja": "あなたの子が"
      },
      {
        "vi": "là giá chuộc của Con ngài,",
        "ko": "더 귀한 선물은",
        "zh": "救人擺脫痛苦，",
        "en": "Is your most precious gift.",
        "ja": "命懸けて"
      },
      {
        "vi": "chịu chết hầu cho chúng con",
        "ko": "우리를 위하여 ",
        "zh": "贖價這份禮物，",
        "en": "He died that we might live.",
        "ja": "神への道 "
      },
      {
        "vi": "được sống an vui dài lâu.",
        "ko": "아들 보내신 일.",
        "zh": "予人光明前途。",
        "en": "You sent him from above.",
        "ja": "切り開いた"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Đồng hát khen Cha suốt đời",
        "ko": "우리 하나 되어 ",
        "zh": "感謝你耶和華，",
        "en": "You gave your precious Son,",
        "ja": "あなたのため"
      },
      {
        "vi": "vì đã ban Con một quý.",
        "ko": "노래 부릅니다.",
        "zh": "將獨生子賜下。",
        "en": "And now we sing as one,",
        "ja": "永遠まで"
      },
      {
        "vi": "Thành kính ca khen đến muôn đời",
        "ko": "아들을 주신 은혜 ",
        "zh": "你偉大無私恩情，",
        "en": "A song we'll sing forever,",
        "ja": "歌い続ける "
      },
      {
        "vi": "vì đã hy sinh Con yêu của Cha.",
        "ko": "영원히 기리는 노래.",
        "zh": "我們永遠銘記在心。",
        "en": "for giving us your precious Son.",
        "ja": "あふれる感謝を"
      },
      {
        "vi": "(KẾT THÚC)",
        "ko": "(엔딩)",
        "zh": "（結尾）",
        "en": "(ENDING)",
        "ja": "（結尾）"
      },
      {
        "vi": "Giê-hô-va, nguyện tôn kính và chân thành cảm tạ ngài.",
        "ko": "여호와 아버지, 늘 감사합니다,",
        "zh": "親愛的耶和華，感謝你的厚恩。",
        "en": "Jehovah, dear Father, we pray in gratitude.",
        "ja": "愛のエホバ あなただけに"
      },
      {
        "vi": "Ngài ban tặng người Con quý, chúng con mang ơn Cha từ nhân.",
        "ko": "소중한 아들을 우리 위해 주심을.",
        "zh": "你賜下獨生子，讓我們得享永生。",
        "en": "We offer our thanks for giving us your precious Son.",
        "ja": "今日も祈る 感謝を込めて"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Giăng 3:16; 15:13).",
      "ko": "(요한 3:16; 15:13 참조)",
      "zh": "（參看約3:16；15:13）",
      "en": "(See also John 3:16; 15:13.)",
      "ja": "（ヨハ 3:16; 15:13も参照。）"
    }
  },
  {
    "number": 21,
    "sourceSheet": "21",
    "labels": {
      "vi": "BÀI HÁT 21",
      "ko": "21번",
      "zh": "詩歌第21首",
      "en": "SONG 21",
      "ja": "21番"
    },
    "title": {
      "vi": "Hãy luôn tìm kiếm Nước Trời trước hết",
      "ko": "왕국을 계속 첫째로 구하라",
      "zh": "不斷先求王國",
      "en": "Keep On Seeking First the Kingdom",
      "ja": "神の王国をいつも第一にする"
    },
    "scripture": {
      "vi": "(Ma-thi-ơ 6:33)",
      "ko": "(마태복음 6:33)",
      "zh": "（馬太福音6:33）",
      "en": "(Matthew 6:33)",
      "ja": "（マタイ 6:33）"
    },
    "lines": [
      {
        "vi": "1. Có một điều Giê-hô-va thật quý,",
        "ko": "1. 여호와께 소중하네,",
        "zh": "1．上帝王國已經建立，",
        "en": "1. Something precious to Jehovah,",
        "ja": "1. エホバは愛する "
      },
      {
        "vi": "khiến cho ngài lòng vui không ngớt,",
        "ko": "그리스도 왕국은.",
        "zh": "耶和華為此歡欣。",
        "en": "Bringing him such keen delight,",
        "ja": "天の王国"
      },
      {
        "vi": "ấy Nước Trời mà Giê-su nhận lãnh,",
        "ko": "모든 일을 바로잡아",
        "zh": "耶穌已在天上登基，",
        "en": "Is his Kingdom by Christ Jesus,",
        "ja": "イエスが治めて"
      },
      {
        "vi": "mai xóa tan mọi nỗi sầu đau.",
        "ko": "주께 기쁨 드리네.",
        "zh": "王國將伸張正義。",
        "en": "Which will set all matters right.",
        "ja": "全てを正す"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Nước của ngài, ta hãy kiếm trước tiên.",
        "ko": "온 땅에 주 찬양하라.",
        "zh": "不斷先求上帝王國",
        "en": "Keep on seeking first the Kingdom",
        "ja": "神の王国を"
      },
      {
        "vi": "Ta tìm điều công chính ưu tiên.",
        "ko": "충실하게 섬기라.",
        "zh": "以及上帝的正義，",
        "en": "And Jehovah's righteousness.",
        "ja": "第一にして"
      },
      {
        "vi": "Ngợi khen Cha, truyền rao danh thánh ngài.",
        "ko": "계속 첫째로 구하라,",
        "zh": "在萬國中讚美真神，",
        "en": "Sing his praise among the nations,",
        "ja": "忠実 保とう"
      },
      {
        "vi": "Phụng sự ngài, ta quyết trung kiên.",
        "ko": "하느님의 왕국을.",
        "zh": "願一生忠貞不渝。",
        "en": "Serving him in faithfulness.",
        "ja": "どんなときにも"
      },
      {
        "vi": "2. Cớ sao mình lại lo lắng ngày mai:",
        "ko": "2. 무엇을 먹고 마실까",
        "zh": "2．不要為明天而擔心，",
        "en": "2. Why be anxious for tomorrow,",
        "ja": "2. エホバの支えに"
      },
      {
        "vi": "\"Uống, ăn, mặc làm sao ta có?\".",
        "ko": "염려하지 않으리.",
        "zh": "不為衣食而憂慮。",
        "en": "‘Will we hunger, will we thirst?'",
        "ja": "信仰持とう"
      },
      {
        "vi": "Bởi Cha ban mình bao thứ cần thiết",
        "ko": "왕국 첫째로 구하면",
        "zh": "先追求王國與正義，",
        "en": "For our God will make provision",
        "ja": "次の日のことは"
      },
      {
        "vi": "khi trước tiên tìm Nước của Cha.",
        "ko": "모두 더해 주시리.",
        "zh": "上帝必提供所需。",
        "en": "If we seek his Kingdom first.",
        "ja": "思い悩まず"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Nước của ngài, ta hãy kiếm trước tiên.",
        "ko": "온 땅에 주 찬양하라.",
        "zh": "不斷先求上帝王國",
        "en": "Keep on seeking first the Kingdom",
        "ja": "神の王国を"
      },
      {
        "vi": "Ta tìm điều công chính ưu tiên.",
        "ko": "충실하게 섬기라.",
        "zh": "以及上帝的正義，",
        "en": "And Jehovah's righteousness.",
        "ja": "第一にして"
      },
      {
        "vi": "Ngợi khen Cha, truyền rao danh thánh ngài.",
        "ko": "계속 첫째로 구하라,",
        "zh": "在萬國中讚美真神，",
        "en": "Sing his praise among the nations,",
        "ja": "忠実 保とう"
      },
      {
        "vi": "Phụng sự ngài, ta quyết trung kiên.",
        "ko": "하느님의 왕국을.",
        "zh": "願一生忠貞不渝。",
        "en": "Serving him in faithfulness.",
        "ja": "どんなときにも"
      },
      {
        "vi": "3. Hãy rao truyền về tin Nước Trời đến,",
        "ko": "3. 왕국 소식 선포하여",
        "zh": "3．要盡力傳王國信息，",
        "en": "3. So declare the Kingdom good news;",
        "ja": "3. 王国の知らせ"
      },
      {
        "vi": "giúp cho người lòng đang khao khát",
        "ko": "합당한 자 도우라.",
        "zh": "幫助人學習真理。",
        "en": "Help deserving ones to see",
        "ja": "広めていこう"
      },
      {
        "vi": "thấy hy vọng họ nay đến từ Chúa,",
        "ko": "여호와와 그 통치에",
        "zh": "將希望寄託於上帝，",
        "en": "That their hope is in Jehovah",
        "ja": "希望をかなえる "
      },
      {
        "vi": "bao khổ đau ngài sẽ dẹp tan.",
        "ko": "희망 두게 되리라.",
        "zh": "盼王國統治全地。",
        "en": "And in his Theocracy.",
        "ja": "神の統治を"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Nước của ngài, ta hãy kiếm trước tiên.",
        "ko": "온 땅에 주 찬양하라.",
        "zh": "不斷先求上帝王國",
        "en": "Keep on seeking first the Kingdom",
        "ja": "神の王国を"
      },
      {
        "vi": "Ta tìm điều công chính ưu tiên.",
        "ko": "충실하게 섬기라.",
        "zh": "以及上帝的正義，",
        "en": "And Jehovah's righteousness.",
        "ja": "第一にして"
      },
      {
        "vi": "Ngợi khen Cha, truyền rao danh thánh ngài.",
        "ko": "계속 첫째로 구하라,",
        "zh": "在萬國中讚美真神，",
        "en": "Sing his praise among the nations,",
        "ja": "忠実 保とう"
      },
      {
        "vi": "Phụng sự ngài, ta quyết trung kiên.",
        "ko": "하느님의 왕국을.",
        "zh": "願一生忠貞不渝。",
        "en": "Serving him in faithfulness.",
        "ja": "どんなときにも"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 27:14; Mat 6:34; 10:11, 13; 1 Phi 1:21).",
      "ko": "(시 27:14; 마태 6:34; 10:11, 13; 베드로 전서 1:21 참조)",
      "zh": "（參看詩27:14；太6:34；10:11,13；彼前1:21）",
      "en": "(See also Ps. 27:14; Matt. 6:34; 10:11, 13; 1 Pet. 1:21.)",
      "ja": "（詩 27:14; マタ 6:34; 10:11，13; ペテ一 1:21も参照。）"
    }
  },
  {
    "number": 22,
    "sourceSheet": "22",
    "labels": {
      "vi": "BÀI HÁT 22",
      "ko": "22번",
      "zh": "詩歌第22首",
      "en": "SONG 22",
      "ja": "22番"
    },
    "title": {
      "vi": "Nước Trời đang cai trị—Xin Nước ấy được đến!",
      "ko": "왕국이 세워졌으니, 오게 하소서!",
      "zh": "王國已經建立，願王國來臨！",
      "en": "The Kingdom Is in Place—Let It Come!",
      "ja": "王国は統治している 王国が来ますように！"
    },
    "scripture": {
      "vi": "(Khải huyền 11:15; 12:10)",
      "ko": "(요한 계시록 11:15; 12:10)",
      "zh": "（啟示錄11:15；12:10）",
      "en": "(Revelation 11:15; 12:10)",
      "ja": "（啓示 11:15; 12:10）"
    },
    "lines": [
      {
        "vi": "1. Ôi Cha Giê-hô-va thật tối cao,",
        "ko": "1. 영원하신 여호와여,",
        "zh": "1．耶和華你永遠存在，",
        "en": "1. Jehovah, you always have been,",
        "ja": "1. メシアの王国 "
      },
      {
        "vi": "hiện hữu suốt bao đời nay!",
        "ko": "주 아들 왕 되어",
        "zh": "從過去到未來。",
        "en": "And always you will be.",
        "ja": "天に生まれ"
      },
      {
        "vi": "Giờ Nước Chúa đã trao cho người Con;",
        "ko": "아버지의 법 따르며",
        "zh": "你將寶座賜予基督，",
        "en": "You've given the throne to your Son;",
        "ja": "イエスは治める "
      },
      {
        "vi": "Vua sắp thực thi uy quyền.",
        "ko": "다스리십니다.",
        "zh": "讓他作王統治。",
        "en": "He rules by your decree.",
        "ja": "王座につき"
      },
      {
        "vi": "Nước Cha nay thành lập, ta vui sướng.",
        "ko": "왕국이 탄생했으니",
        "zh": "天上王國已經建立，",
        "en": "The Kingdom has been brought to birth;",
        "ja": "王国の力やがて"
      },
      {
        "vi": "Chúa Giê-su trị vì trên khắp đất.",
        "ko": "온 땅을 통치하리다.",
        "zh": "即將管理地上萬民。",
        "en": "His rulership will fill the earth.",
        "ja": "地に及ぶ"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Điều ta trông mong đã đến,",
        "ko": "왕국이 세워져",
        "zh": "王國已經誕生，",
        "en": "For now have come to pass",
        "ja": "実現した "
      },
      {
        "vi": "vương quyền Giê-hô-va được biểu dương.",
        "ko": "구원, 위력이 넘치니",
        "zh": "彰顯上帝力量、救恩！",
        "en": "Salvation and kingdom and might.",
        "ja": "救いと王国"
      },
      {
        "vi": "Hiện Vua trên ngôi vinh hiển.",
        "ko": "\"오게 해 주소서,",
        "zh": "期盼王國來臨，",
        "en": "The Kingdom is in place.",
        "ja": "来ますように "
      },
      {
        "vi": "Cầu Nước Chúa trên cao đến thật mau!",
        "ko": "왕국 오게 해 주소서!\"",
        "zh": "實現天父偉大旨意。",
        "en": "We pray: \"Let it come, Let it come!\"",
        "ja": "エホバの王国"
      },
      {
        "vi": "2. Nay mai khi Sa-tan bị tống giam,",
        "ko": "2. 우린 믿음의 눈으로",
        "zh": "2．魔鬼撒但餘日無多，",
        "en": "2. The time for the Devil is short;",
        "ja": "2. 天には平和と"
      },
      {
        "vi": "bè lũ ác gian còn đâu.",
        "ko": "앞날을 봅니다,",
        "zh": "地上充滿災禍。",
        "en": "We know what this will mean.",
        "ja": "自由戻り"
      },
      {
        "vi": "Cuộc sống dẫu khó khăn, ta vượt qua",
        "ko": "마귀의 때 곧 끝나고",
        "zh": "上帝忠僕不畏艱辛，",
        "en": "Though living in times of distress,",
        "ja": "歓喜の歌声 "
      },
      {
        "vi": "do thấy điều Cha đang làm.",
        "ko": "눈물 없을 날을.",
        "zh": "深信拯救臨近。",
        "en": "We see the things unseen.",
        "ja": "響き渡る"
      },
      {
        "vi": "Nước Cha nay thành lập, ta vui sướng.",
        "ko": "왕국이 탄생했으니",
        "zh": "天上王國已經建立，",
        "en": "The Kingdom has been brought to birth;",
        "ja": "王国の力やがて"
      },
      {
        "vi": "Chúa Giê-su trị vì trên khắp đất.",
        "ko": "온 땅을 통치하리다.",
        "zh": "即將管理地上萬民。",
        "en": "His rulership will fill the earth.",
        "ja": "地に及ぶ"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Điều ta trông mong đã đến,",
        "ko": "왕국이 세워져",
        "zh": "王國已經誕生，",
        "en": "For now have come to pass",
        "ja": "実現した "
      },
      {
        "vi": "vương quyền Giê-hô-va được biểu dương.",
        "ko": "구원, 위력이 넘치니",
        "zh": "彰顯上帝力量、救恩！",
        "en": "Salvation and kingdom and might.",
        "ja": "救いと王国"
      },
      {
        "vi": "Hiện Vua trên ngôi vinh hiển.",
        "ko": "\"오게 해 주소서,",
        "zh": "期盼王國來臨，",
        "en": "The Kingdom is in place.",
        "ja": "来ますように "
      },
      {
        "vi": "Cầu Nước Chúa trên cao đến thật mau!",
        "ko": "왕국 오게 해 주소서!\"",
        "zh": "實現天父偉大旨意。",
        "en": "We pray: \"Let it come, Let it come!\"",
        "ja": "エホバの王国"
      },
      {
        "vi": "3. Muôn thiên binh đang reo hò sướng vui,",
        "ko": "3. 천사들이 노래하며",
        "zh": "3．天使大軍齊聲歡唱，",
        "en": "3. The angels in heaven rejoice",
        "ja": "3. サタンの支配の"
      },
      {
        "vi": "đồng cất tiếng ca dội vang",
        "ko": "기뻐 외칩니다,",
        "zh": "歌聲雄壯嘹亮。",
        "en": "And sing with joyful cries.",
        "ja": "終わり近い"
      },
      {
        "vi": "vì biết Chúa đã quăng quân tà gian",
        "ko": "사탄 마귀 하늘에서",
        "zh": "天上一片歡欣鼓舞，",
        "en": "The heavens above are relieved",
        "ja": "希望の光が"
      },
      {
        "vi": "ra khỏi trời cao muôn đời.",
        "ko": "추방되었다고.",
        "zh": "撒但已被驅逐。",
        "en": "From Satan and his lies.",
        "ja": "闇を照らす"
      },
      {
        "vi": "Nước Cha nay thành lập, ta vui sướng.",
        "ko": "왕국이 탄생했으니",
        "zh": "天上王國已經建立，",
        "en": "The Kingdom has been brought to birth;",
        "ja": "王国の力やがて"
      },
      {
        "vi": "Chúa Giê-su trị vì trên khắp đất.",
        "ko": "온 땅을 통치하리다.",
        "zh": "即將管理地上萬民。",
        "en": "His rulership will fill the earth.",
        "ja": "地に及ぶ"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Điều ta trông mong đã đến,",
        "ko": "왕국이 세워져",
        "zh": "王國已經誕生，",
        "en": "For now have come to pass",
        "ja": "実現した "
      },
      {
        "vi": "vương quyền Giê-hô-va được biểu dương.",
        "ko": "구원, 위력이 넘치니",
        "zh": "彰顯上帝力量、救恩！",
        "en": "Salvation and kingdom and might.",
        "ja": "救いと王国"
      },
      {
        "vi": "Hiện Vua trên ngôi vinh hiển.",
        "ko": "\"오게 해 주소서,",
        "zh": "期盼王國來臨，",
        "en": "The Kingdom is in place.",
        "ja": "来ますように "
      },
      {
        "vi": "Cầu Nước Chúa trên cao đến thật mau!",
        "ko": "왕국 오게 해 주소서!\"",
        "zh": "實現天父偉大旨意。",
        "en": "We pray: \"Let it come, Let it come!\"",
        "ja": "エホバの王国"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Đa 2:34, 35; 2 Cô 4:18).",
      "ko": "(다니엘 2:34, 35; 고린도 후서 4:18 참조)",
      "zh": "（參看但2:34,35；林後4:18）",
      "en": "(See also Dan. 2:34, 35; 2 Cor. 4:18.)",
      "ja": "（ダニ 2:34，35; コリ二 4:18も参照。）"
    }
  },
  {
    "number": 23,
    "sourceSheet": "23",
    "labels": {
      "vi": "BÀI HÁT 23",
      "ko": "23번",
      "zh": "詩歌第23首",
      "en": "SONG 23",
      "ja": "23番"
    },
    "title": {
      "vi": "Đức Giê-hô-va bắt đầu sự trị vì của ngài",
      "ko": "여호와께서 통치를 시작하신다",
      "zh": "耶和華統治了！",
      "en": "Jehovah Begins His Rule",
      "ja": "エホバは統治を始める"
    },
    "scripture": {
      "vi": "(Khải huyền 11:15)",
      "ko": "(요한 계시록 11:15)",
      "zh": "（啟示錄11:15）",
      "en": "(Revelation 11:15)",
      "ja": "（啓示 11:15）"
    },
    "lines": [
      {
        "vi": "1. Giờ đây Vua lãnh nhận vương quyền,",
        "ko": "1. 왕국이 다스리니",
        "zh": "1．上帝王國已建立，",
        "en": "1. God's Kingdom rules from above.",
        "ja": "1. キリストすでに"
      },
      {
        "vi": "mọi dân vang tiếng ngợi khen ngài.",
        "ko": "모두 다 찬양하세.",
        "zh": "要讚美他的愛子，",
        "en": "All praise his Son, the beloved.",
        "ja": "王座についた"
      },
      {
        "vi": "Chính nơi Si-ôn, Vua quyền thế đang cai trị.",
        "ko": "아들의 통치가 시작됐네.",
        "zh": "基督已在錫安作王統治。",
        "en": "Christ reigns in Zion, the chief cornerstone.",
        "ja": "天から今 統治する"
      },
      {
        "vi": "Nào ta ca hát và vui mừng,",
        "ko": "기쁘게 소리 높여",
        "zh": "一起來高聲頌揚，",
        "en": "Let us all lift up our voice.",
        "ja": "皆声上げて"
      },
      {
        "vi": "ngợi khen Cha với lòng chân thành.",
        "ko": "하느님 찬송하라.",
        "zh": "要向耶和華歌唱，",
        "en": "Sing to our God, and rejoice.",
        "ja": "賛美歌おう"
      },
      {
        "vi": "Cùng nhau ta đón chào Đấng Ki-tô trên ngôi cao trọng.",
        "ko": "우리를 구원하실 왕을 주셨다.",
        "zh": "他委任救主基督作王國君王。",
        "en": "Christ, Lord and Savior, has been placed upon His throne.",
        "ja": "歓喜の叫び届けよう"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Điều chi Nước Chúa mang lại cho mọi dân?",
        "ko": "여호와 왕국 통치하니",
        "zh": "上帝王國會帶來什麼？",
        "en": "What will you bring, Jehovah's Kingdom?",
        "ja": "エホバの王国は"
      },
      {
        "vi": "Sự thật, công chính soi rạng nơi nơi.",
        "ko": "진리가 승리하리라.",
        "zh": "真理顯揚，正義伸張。",
        "en": "Triumph of truth and righteousness.",
        "ja": "公正で満ちる"
      },
      {
        "vi": "Còn điều chi nữa Nước ngài ban mọi dân?",
        "ko": "여호와 왕국 통치하니",
        "zh": "上帝王國還帶來什麼？",
        "en": "And bring what else, Jehovah's Kingdom?",
        "ja": "幸せと命を"
      },
      {
        "vi": "Đời đời no ấm, thanh bình, an vui.",
        "ko": "영원히 행복하리라.",
        "zh": "永遠生命，幸福安康。",
        "en": "Eternal life and happiness.",
        "ja": "世界に与える"
      },
      {
        "vi": "Hãy khen Vua Tối Thượng Hoàn Vũ là",
        "ko": "찬양하라, 주권자를.",
        "zh": "讚美宇宙至高上帝，",
        "en": "Praise the Universal Sov'reign",
        "ja": "エホバは主権者"
      },
      {
        "vi": "đấng yêu thương, chân thật tuyệt vời.",
        "ko": "오, 그 사랑, 그 충실.",
        "zh": "他既信實又仁愛。",
        "en": "For his love and faithfulness.",
        "ja": "さあ たたえよう"
      },
      {
        "vi": "2. Kìa, Vua cao quý đầy uy quyền!",
        "ko": "2. 왕 예수 다스리니",
        "zh": "2．基督已獲賜權柄，",
        "en": "2. Christ now in power is here,",
        "ja": "2. ハルマゲドンは"
      },
      {
        "vi": "Ha-ma-ghê-đôn gần đây rồi!",
        "ko": "아마겟돈 가깝네.",
        "zh": "哈米吉多頓已近，",
        "en": "And Armageddon is near.",
        "ja": "近づいている"
      },
      {
        "vi": "Thế gian Sa-tan mai này sẽ chóng suy tàn.",
        "ko": "사탄의 세상 곧 사라지리.",
        "zh": "撒但的舊制度即將消逝。",
        "en": "Satan's old system will soon pass away.",
        "ja": "サタンの世は なくなる"
      },
      {
        "vi": "Giờ đây ta hãy cùng rao truyền,",
        "ko": "이 소식 전파하여",
        "zh": "現在就竭盡全力，",
        "en": "Now is the season to preach.",
        "ja": "伝道しよう "
      },
      {
        "vi": "dạy ai chưa biết về tin mừng.",
        "ko": "사람들 도와야 해.",
        "zh": "在各地宣揚真理，",
        "en": "Many there are yet to reach;",
        "ja": "奉仕をしよう"
      },
      {
        "vi": "Mời muôn dân đến thờ kính, tôn vinh danh Giê-hô-va.",
        "ko": "지금은 모두 주의 편에 설 때다.",
        "zh": "呼籲所有謙和的人擁護上帝。",
        "en": "Time for the meek to take their stand for Him today.",
        "ja": "温和な人を集めよう"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Điều chi Nước Chúa mang lại cho mọi dân?",
        "ko": "여호와 왕국 통치하니",
        "zh": "上帝王國會帶來什麼？",
        "en": "What will you bring, Jehovah's Kingdom?",
        "ja": "エホバの王国は"
      },
      {
        "vi": "Sự thật, công chính soi rạng nơi nơi.",
        "ko": "진리가 승리하리라.",
        "zh": "真理顯揚，正義伸張。",
        "en": "Triumph of truth and righteousness.",
        "ja": "公正で満ちる"
      },
      {
        "vi": "Còn điều chi nữa Nước ngài ban mọi dân?",
        "ko": "여호와 왕국 통치하니",
        "zh": "上帝王國還帶來什麼？",
        "en": "And bring what else, Jehovah's Kingdom?",
        "ja": "幸せと命を"
      },
      {
        "vi": "Đời đời no ấm, thanh bình, an vui.",
        "ko": "영원히 행복하리라.",
        "zh": "永遠生命，幸福安康。",
        "en": "Eternal life and happiness.",
        "ja": "世界に与える"
      },
      {
        "vi": "Hãy khen Vua Tối Thượng Hoàn Vũ là",
        "ko": "찬양하라, 주권자를.",
        "zh": "讚美宇宙至高上帝，",
        "en": "Praise the Universal Sov'reign",
        "ja": "エホバは主権者"
      },
      {
        "vi": "đấng yêu thương, chân thật tuyệt vời.",
        "ko": "오, 그 사랑, 그 충실.",
        "zh": "他既信實又仁愛。",
        "en": "For his love and faithfulness.",
        "ja": "さあ たたえよう"
      },
      {
        "vi": "3. Đồng thanh ta trỗi giọng khen ngợi",
        "ko": "3. 여호와 이름으로",
        "zh": "3．上帝委任的君王",
        "en": "3. God's reigning Ruler we prize.",
        "ja": "3. 王座についた"
      },
      {
        "vi": "vị Vua tôn quý ngự trên trời,",
        "ko": "우리 왕 다스리니",
        "zh": "將成就非凡大事，",
        "en": "Wondrous he is in our eyes.",
        "ja": "天の統治者"
      },
      {
        "vi": "đấng nhân danh Cha cai trị các dân xa gần.",
        "ko": "드높이 받들고 찬양하리.",
        "zh": "我們衷心順服他的統治。",
        "en": "He comes in God's name; we bow to our King.",
        "ja": "神が権威 与えた"
      },
      {
        "vi": "Cùng nhau ta tới tại nơi đền,",
        "ko": "성전에 들어가서",
        "zh": "要進入聖殿大門，",
        "en": "Enter the grand temple gate;",
        "ja": "王国のため"
      },
      {
        "vi": "ngày đêm tôn kính Giê-hô-va.",
        "ko": "주 은혜 간청하라.",
        "zh": "求上帝嘉許施恩，",
        "en": "God's favor now supplicate.",
        "ja": "皆で祈ろう"
      },
      {
        "vi": "Rồi đây khắp chốn đều sống yên vui, muôn nơi an hòa.",
        "ko": "아들이 만물을 곧 다스리신다.",
        "zh": "期盼基督統治造福全地的人。",
        "en": "Soon dawns that day when he rules over ev'rything.",
        "ja": "エホバとイエス たたえよう"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Điều chi Nước Chúa mang lại cho mọi dân?",
        "ko": "여호와 왕국 통치하니",
        "zh": "上帝王國會帶來什麼？",
        "en": "What will you bring, Jehovah's Kingdom?",
        "ja": "エホバの王国は"
      },
      {
        "vi": "Sự thật, công chính soi rạng nơi nơi.",
        "ko": "진리가 승리하리라.",
        "zh": "真理顯揚，正義伸張。",
        "en": "Triumph of truth and righteousness.",
        "ja": "公正で満ちる"
      },
      {
        "vi": "Còn điều chi nữa Nước ngài ban mọi dân?",
        "ko": "여호와 왕국 통치하니",
        "zh": "上帝王國還帶來什麼？",
        "en": "And bring what else, Jehovah's Kingdom?",
        "ja": "幸せと命を"
      },
      {
        "vi": "Đời đời no ấm, thanh bình, an vui.",
        "ko": "영원히 행복하리라.",
        "zh": "永遠生命，幸福安康。",
        "en": "Eternal life and happiness.",
        "ja": "世界に与える"
      },
      {
        "vi": "Hãy khen Vua Tối Thượng Hoàn Vũ là",
        "ko": "찬양하라, 주권자를.",
        "zh": "讚美宇宙至高上帝，",
        "en": "Praise the Universal Sov'reign",
        "ja": "エホバは主権者"
      },
      {
        "vi": "đấng yêu thương, chân thật tuyệt vời.",
        "ko": "오, 그 사랑, 그 충실.",
        "zh": "他既信實又仁愛。",
        "en": "For his love and faithfulness.",
        "ja": "さあ たたえよう"
      }
    ],
    "reference": {
      "vi": "(Cũng xem 2 Sa 7:22; Đa 2:44; Khải 7:15).",
      "ko": "(사무엘하 7:22; 다니엘 2:44; 계시록 7:15 참조)",
      "zh": "（參看撒下7:22；但2:44；啟7:15）",
      "en": "(See also 2 Sam. 7:22; Dan. 2:44; Rev. 7:15.)",
      "ja": "（サム二 7:22; ダニ 2:44; 啓 7:15も参照。）"
    }
  },
  {
    "number": 24,
    "sourceSheet": "24",
    "labels": {
      "vi": "BÀI HÁT 24",
      "ko": "24번",
      "zh": "詩歌第24首",
      "en": "SONG 24",
      "ja": "24番"
    },
    "title": {
      "vi": "Hãy lên núi của Đức Giê-hô-va",
      "ko": "여호와의 산으로 오라",
      "zh": "來登耶和華的山",
      "en": "Come to Jehovah's Mountain",
      "ja": "エホバの山に登ろう"
    },
    "scripture": {
      "vi": "(Ê-sai 2:2-4)",
      "ko": "(이사야 2:2-4)",
      "zh": "（以賽亞書2:2-4）",
      "en": "(Isaiah 2:2-4)",
      "ja": "（イザヤ 2:2-4）"
    },
    "lines": [
      {
        "vi": "1. Ngước nhìn đằng nơi xa ấy,",
        "ko": "1. 보라, 이 시대에",
        "zh": "1．一同舉目觀看，",
        "en": "1. Raise your eyes up and see,",
        "ja": "1. 目を上げれば"
      },
      {
        "vi": "mình trông thấy núi Giê-hô-va.",
        "ko": "여호와의 높은 산,",
        "zh": "耶和華至高聖山，",
        "en": "Far above the highest hill.",
        "ja": "高くそびえる"
      },
      {
        "vi": "Trổi hơn, vượt lên cao nhất mọi",
        "ko": "높이 솟아올라서",
        "zh": "今天，它巍峨屹立",
        "en": "There stands Jehovah's mountain",
        "ja": "ああ 麗しい"
      },
      {
        "vi": "núi đồi, không chi sánh bằng.",
        "ko": "우뚝 서 있다네.",
        "zh": "超越一切山嶺。",
        "en": "Lifted up in this day.",
        "ja": "エホバの山"
      },
      {
        "vi": "Tấp nập người đi lên đó,",
        "ko": "먼 곳, 온 땅에서",
        "zh": "萬民飄洋過海，",
        "en": "People come from afar,",
        "ja": "共に行こう "
      },
      {
        "vi": "từ muôn phương khắp nơi xa gần.",
        "ko": "모여드는 사람들",
        "zh": "從遠方各地而來，",
        "en": "Ev'rywhere from sea to sea,",
        "ja": "呼び掛け合って"
      },
      {
        "vi": "Sướng vui, họ mời dân khắp vùng: \"Đến thờ Chúa, vâng theo ngài\".",
        "ko": "함께 소리 높이네, ‘와서 주 섬기라.'",
        "zh": "他們彼此呼喊說：「快來敬奉上帝！」",
        "en": "Calling to one another, ‘Come serve God and obey.'",
        "ja": "「さあ エホバの山に登ろう」"
      },
      {
        "vi": "Vào thời nay, dân của Cha",
        "ko": "그때가 되었네,",
        "zh": "指定的時間到，",
        "en": "Now the time has arrived",
        "ja": "神に仕え"
      },
      {
        "vi": "hùng mạnh thay, gia tăng thêm đông biết bao!",
        "ko": "작은 자 큰 나라 이루네.",
        "zh": "渺小國族要變得強盛，",
        "en": "For the small, a great nation to be.",
        "ja": "従う人たちは"
      },
      {
        "vi": "Lòng mừng vui khi ta thấy",
        "ko": "영적인 번영은",
        "zh": "耶和華他賜福，",
        "en": "As we grow and we thrive,",
        "ja": "光掲げ"
      },
      {
        "vi": "từ trời Chúa vẫn dẫn dắt và ban phước.",
        "ko": "주의 축복을 보여 주네.",
        "zh": "讓子民更茁壯、更興旺。",
        "en": "God's direction and blessing we see.",
        "ja": "祝福を味わう"
      },
      {
        "vi": "Có hàng triệu người trên đất",
        "ko": "많은 사람들이",
        "zh": "千萬正義的人",
        "en": "Millions now come to God",
        "ja": "感謝の歌 "
      },
      {
        "vi": "nguyện theo Đấng Tối Cao muôn đời.",
        "ko": "충성 서약하면서",
        "zh": "願接受上帝統治，",
        "en": "And accept his sov'reignty.",
        "ja": "揺るぎない愛"
      },
      {
        "vi": "Quyết tâm thành trung với Chúa, ",
        "ko": "주의 주권 받들고",
        "zh": "決心一生忠於耶和華",
        "en": "Loyal they vow to be",
        "ja": "ただ神に捧げ"
      },
      {
        "vi": "thờ kính ngài mãi mãi không rời.",
        "ko": "그 편에 선다네.",
        "zh": "絕不偏離。",
        "en": "And from his side never stray.",
        "ja": "日々生きる"
      },
      {
        "vi": "2. Nhớ lệnh mà Giê-su phán,",
        "ko": "2. ‘가서 전파하라'",
        "zh": "2．基督發出命令：",
        "en": "2. Jesus gave the command",
        "ja": "2. 良い知らせを"
      },
      {
        "vi": "mình hăng say giảng rao tin mừng.",
        "ko": "예수 명령하셨네.",
        "zh": "要向人傳講真理！",
        "en": "To go forth and preach the word.",
        "ja": "全ての人に"
      },
      {
        "vi": "Báo cho mọi dân trên đất này",
        "ko": "왕국 좋은 소식이",
        "zh": "今天，上帝王國好消息",
        "en": "Good news about the Kingdom",
        "ja": "今伝えよう"
      },
      {
        "vi": "biết về tương lai sáng ngời.",
        "ko": "온 땅에 이르네.",
        "zh": "傳遍遠近。",
        "en": "Reaches all men today.",
        "ja": "広く遠く"
      },
      {
        "vi": "Nước Trời giờ đây đã đến",
        "ko": "예수 다스리며",
        "zh": "君王呼籲萬民，",
        "en": "Christ now rules from above,",
        "ja": "神の言葉受け"
      },
      {
        "vi": "và Vua kêu những ai nhu mì",
        "ko": "곁에 서라 하시니",
        "zh": "要擁護他的統治，",
        "en": "Urging all to take his side.",
        "ja": "入れる人"
      },
      {
        "vi": "lắng nghe và vâng theo tiếng ngài,",
        "ko": "선한 사람들 듣고",
        "zh": "所有心地謙和的人",
        "en": "Meek ones who hear his voice",
        "ja": "王イエスは導く "
      },
      {
        "vi": "để Lời Chúa chiếu soi đường.",
        "ko": "주 말씀 따르네.",
        "zh": "都衷心響應。",
        "en": "Let God's Word show them the way.",
        "ja": "今日も"
      },
      {
        "vi": "Thật mừng vui khi thấy bao",
        "ko": "기쁨이 넘치네,",
        "zh": "多喜樂，多歡欣，",
        "en": "It brings joy to the heart,",
        "ja": "大群衆が"
      },
      {
        "vi": "người thờ Cha Giê-hô-va đang mãi tăng!",
        "ko": "큰 무리 점점 더 늘어나!",
        "zh": "大群人數目與日俱增。",
        "en": "As the great crowd continues to grow.",
        "ja": "増えていく姿に"
      },
      {
        "vi": "Nào cùng nhau, mình đi giúp",
        "ko": "최선을 다하여",
        "zh": "多榮幸幫助人",
        "en": "And we all have a part,",
        "ja": "心躍り"
      },
      {
        "vi": "mọi người biết đấng xứng đáng được tôn kính.",
        "ko": "모든 사람이 알게 하리.",
        "zh": "認識耶和華這位真神。",
        "en": "As we strive to let ev'ryone know.",
        "ja": "喜びがあふれる"
      },
      {
        "vi": "Cất giọng dội vang khắp đất",
        "ko": "우리 소리 높여",
        "zh": "一起大聲宣告：",
        "en": "Let us lift up the voice,",
        "ja": "賛美の声 "
      },
      {
        "vi": "hầu muôn dân biết ta đang mời:",
        "ko": "모두 듣게 외치세,",
        "zh": "「所有愛真理的人，",
        "en": "Calling out for all to hear,",
        "ja": "奏でるハーモニー"
      },
      {
        "vi": "\"Hãy đi cùng nhau lên núi Giê-hô-va để tôn vinh ngài\".",
        "ko": "‘주의 영원한 산에 와서 늘 머물라.'",
        "zh": "快來，登上聖山崇拜他直到永恆。」",
        "en": "‘Come to Jehovah's mountain, Here forever to stay.'",
        "ja": "「さあ エホバの山に登ろう」"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 43:3; 99:9; Ê-sai 60:22; Công 16:5).",
      "ko": "(시 43:3; 99:9; 이사야 60:22; 사도 16:5 참조)",
      "zh": "（參看詩43:3；99:9；賽60:22；徒16:5）",
      "en": "(See also Ps. 43:3; 99:9; Isa. 60:22; Acts 16:5.)",
      "ja": "（詩 43:3; 99:9; イザ 60:22; 使徒 16:5も参照。）"
    }
  },
  {
    "number": 25,
    "sourceSheet": "25",
    "labels": {
      "vi": "BÀI HÁT 25",
      "ko": "25번",
      "zh": "詩歌第25首",
      "en": "SONG 25",
      "ja": "25番"
    },
    "title": {
      "vi": "Một sản nghiệp đặc biệt",
      "ko": "특별한 소유",
      "zh": "上帝特別擁有的產業",
      "en": "A Special Possession",
      "ja": "特別な所有物"
    },
    "scripture": {
      "vi": "(1 Phi-e-rơ 2:9)",
      "ko": "(베드로 전서 2:9)",
      "zh": "（彼得前書2:9）",
      "en": "(1 Peter 2:9)",
      "ja": "（ペテロ第一 2:9）"
    },
    "lines": [
      {
        "vi": "1. Cha lập một dân cho danh ngài,",
        "ko": "1. 새로운 창조물인",
        "zh": "1．上帝接納一群人，",
        "en": "1. God has a new creation,",
        "ja": "1. 天での報い"
      },
      {
        "vi": "dân được nhận ngôi Nước trên trời,",
        "ko": "주의 영적 아들들,",
        "zh": "成為他特別產業。",
        "en": "His spirit-anointed sons.",
        "ja": "約束された"
      },
      {
        "vi": "được Cha đoái xem như con ngài",
        "ko": "이 땅에서 선택된",
        "zh": "人類當中蒙揀選，",
        "en": "He has bought them from mankind;",
        "ja": "聖なる民は"
      },
      {
        "vi": "và giao phó bao đặc ân.",
        "ko": "승인받은 이들.",
        "zh": "贏得上帝喜悅。",
        "en": "His approval they've won.",
        "ja": "恵み受ける"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Dân Cha chọn và quý yêu.",
        "ko": "여호와 이름을",
        "zh": "多珍貴、多特別，",
        "en": "A special possession,",
        "ja": "エホバ神の"
      },
      {
        "vi": "Một dân thánh, sản nghiệp của Cha.",
        "ko": "지닌 특별한 소유,",
        "zh": "他們永遠屬於你。",
        "en": "They're a people for your name.",
        "ja": "特別な民"
      },
      {
        "vi": "Họ hát khen, thờ kính Cha,",
        "ko": "당신의 이름을",
        "zh": "稱頌你、愛戴你，",
        "en": "They love you. They praise you.",
        "ja": "神を愛し"
      },
      {
        "vi": "sánh vai cùng công bố khắp nơi về ngài.",
        "ko": "마음 다해 찬양합니다.",
        "zh": "齊心協力宣揚你聖名。",
        "en": "As one they declare abroad your fame.",
        "ja": "神の名をたたえる"
      },
      {
        "vi": "2. Dân được biệt riêng ra cho ngài",
        "ko": "2. 진리를 수호하는",
        "zh": "2．他們是聖潔國族，",
        "en": "2. They are a holy nation,",
        "ja": "2. 光の中へ"
      },
      {
        "vi": "rao truyền Lời Cha khắp xa gần,",
        "ko": "주의 거룩한 나라,",
        "zh": "不偏離上帝話語。",
        "en": "Who handle the truth aright.",
        "ja": "招き入れられ"
      },
      {
        "vi": "rời xa thế gian âm u này,",
        "ko": "하느님이 빛으로",
        "zh": "從黑暗裡被召集，",
        "en": "God has called them from darkness",
        "ja": "真理の言葉 "
      },
      {
        "vi": "được Cha chiếu soi đường đi.",
        "ko": "이끌어 주셨네.",
        "zh": "進入奇妙光裡。",
        "en": "To his wonderful light.",
        "ja": "広く告げる"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Dân Cha chọn và quý yêu.",
        "ko": "여호와 이름을",
        "zh": "多珍貴、多特別，",
        "en": "A special possession,",
        "ja": "エホバ神の"
      },
      {
        "vi": "Một dân thánh, sản nghiệp của Cha.",
        "ko": "지닌 특별한 소유,",
        "zh": "他們永遠屬於你。",
        "en": "They're a people for your name.",
        "ja": "特別な民"
      },
      {
        "vi": "Họ hát khen, thờ kính Cha,",
        "ko": "당신의 이름을",
        "zh": "稱頌你、愛戴你，",
        "en": "They love you. They praise you.",
        "ja": "神を愛し"
      },
      {
        "vi": "sánh vai cùng công bố khắp nơi về ngài.",
        "ko": "마음 다해 찬양합니다.",
        "zh": "齊心協力宣揚你聖名。",
        "en": "As one they declare abroad your fame.",
        "ja": "神の名をたたえる"
      },
      {
        "vi": "3. Thi hành việc Cha không lơ là,",
        "ko": "3. 그들은 최선 다해",
        "zh": "3．耶和華交託任務，",
        "en": "3. Faithful to their commission,",
        "ja": "3. イエスの教え"
      },
      {
        "vi": "kêu gọi và thu nhóm chiên về,",
        "ko": "다른 양들 모으며",
        "zh": "他們都全力以赴。",
        "en": "They gather the other sheep.",
        "ja": "固く守って"
      },
      {
        "vi": "họ chăm chú nghe Vua khuyên dạy,",
        "ko": "‘어린양'의 명령을",
        "zh": "召集另外的綿羊，",
        "en": "To the Lamb they are loyal.",
        "ja": "羊を集め "
      },
      {
        "vi": "thành trung mãi không đổi thay.",
        "ko": "충실히 따르네.",
        "zh": "忠貞跟從基督。",
        "en": "His commandments they keep.",
        "ja": "務め果たす"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Dân Cha chọn và quý yêu.",
        "ko": "여호와 이름을",
        "zh": "多珍貴、多特別，",
        "en": "A special possession,",
        "ja": "エホバ神の"
      },
      {
        "vi": "Một dân thánh, sản nghiệp của Cha.",
        "ko": "지닌 특별한 소유,",
        "zh": "他們永遠屬於你。",
        "en": "They're a people for your name.",
        "ja": "特別な民"
      },
      {
        "vi": "Họ hát khen, thờ kính Cha,",
        "ko": "당신의 이름을",
        "zh": "稱頌你、愛戴你，",
        "en": "They love you. They praise you.",
        "ja": "神を愛し"
      },
      {
        "vi": "sánh vai cùng công bố khắp nơi về ngài.",
        "ko": "마음 다해 찬양합니다.",
        "zh": "齊心協力宣揚你聖名。",
        "en": "As one they declare abroad your fame.",
        "ja": "神の名をたたえる"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Ê-sai 43:20b, 21; Mal 3:17; Cô 1:13).",
      "ko": "(이사야 43:20ㄴ, 21; 말라기 3:17; 골로새 1:13 참조)",
      "zh": "（參看賽43:20下,21；瑪3:17；西1:13）",
      "en": "(See also Isa. 43:20b, 21; Mal. 3:17; Col. 1:13.)",
      "ja": "（イザ 43:20後半，21; マラ 3:17; コロ 1:13も参照。）"
    }
  },
  {
    "number": 26,
    "sourceSheet": "26",
    "labels": {
      "vi": "BÀI HÁT 26",
      "ko": "26번",
      "zh": "詩歌第26首",
      "en": "SONG 26",
      "ja": "26番"
    },
    "title": {
      "vi": "Ngươi đã làm điều ấy cho ta",
      "ko": "바로 나에게 한 것이다",
      "zh": "所做的全都是為我",
      "en": "You Did It for Me",
      "ja": "私にしたのです"
    },
    "scripture": {
      "vi": "(Ma-thi-ơ 25:34-40)",
      "ko": "(마태복음 25:34-40)",
      "zh": "（馬太福音25:34-40）",
      "en": "(Matthew 25:34-40)",
      "ja": "（マタイ 25:34-40）"
    },
    "lines": [
      {
        "vi": "1. Trung thành đi cùng Giê-su cho dù vô vàn hiểm nguy,",
        "ko": "1. 주의 다른 양들 적은 무리 도와",
        "zh": "1．大群另外綿羊聽從耶穌吩咐，",
        "en": "1. Other sheep Jesus has, and they serve alongside",
        "ja": "1. ほかの羊 主に仕える"
      },
      {
        "vi": "song hành bên anh em Chúa dẫu khó khăn dường bao,",
        "ko": "그들 지원하며 위로해 주네.",
        "zh": "與基督的新娘肩並肩服務。",
        "en": "those anointed to be Christ's heavenly bride.",
        "ja": "小さな群れを支えて"
      },
      {
        "vi": "chiên khác chân thành ủi an, luôn sát cánh đi bên họ.",
        "ko": "하늘 신부 따뜻이 돌보아 준 일,",
        "zh": "盡心竭力給他們需要的幫助，",
        "en": "All the things that are done for their comfort and aid",
        "ja": "イエスは見ている 全てを"
      },
      {
        "vi": "Bởi tín trung, Vua hứa ban cho phần thưởng lớn lao.",
        "ko": "예수께서 보답해 주시리라.",
        "zh": "耶穌必銘記在心，賜予厚福。",
        "en": "Are things he considers that must be repaid.",
        "ja": "そして報いを与える"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "\"Vì khi khó khăn bủa vây thì ngươi vẫn thành trung,",
        "ko": "\"그들 정성 다해 돌봐 준 것은",
        "zh": "「你們樂意服務又不怕辛苦，",
        "en": "\"If you comforted them, you comforted me.",
        "ja": "イエスは言う"
      },
      {
        "vi": "thật lòng quan tâm, ủi an, gắn bó không rời xa.",
        "ko": "바로 나를 돌봐 준 것이란다.",
        "zh": "他們若有需要，都全力協助，",
        "en": "If you did it for them, you did it for me.",
        "ja": "「その助け 私にしたのと同じ"
      },
      {
        "vi": "Việc tốt ngươi hằng làm khi giúp họ, ta đều thấy.",
        "ko": "그들 위한 진심 어린 수고는",
        "zh": "為照顧他們，心甘情願付出。",
        "en": "Your labors for them were your labors for me.",
        "ja": "その労苦は私への"
      },
      {
        "vi": "Giúp đỡ cho họ luôn, dù khó không quản chi,",
        "ko": "바로 나에게, 바로 나에게,",
        "zh": "你們為了我，樂意這麼做，",
        "en": "You did it for them; you did it for me.",
        "ja": "私への深い愛"
      },
      {
        "vi": "là ngươi đã tương trợ ta, thành tín, yêu thương ta\".",
        "ko": "바로 나를 위해 한 것이란다.\"",
        "zh": "凡為他們所做，全都是為我。」",
        "en": "If you did it for them, you did it for me.\"",
        "ja": "私のため してくれた」"
      },
      {
        "vi": "2. \"Ngươi từng san sẻ khi ta đang cần an ủi, đỡ nâng.",
        "ko": "2. \"내가 굶주리고 목말라 힘들 때,",
        "zh": "2．「當我飢寒交迫，你們支持了我，",
        "en": "2. \"Yes, you comforted me in my hunger and thirst,",
        "ja": "2. 「私が飢え 喉渇くと"
      },
      {
        "vi": "Cho dù gian nan đói khát, vẫn có ngươi kề bên\".",
        "ko": "먼저 다가와서 돌봐 주었지.\"",
        "zh": "在我需要時候，從不曾退縮。」",
        "en": "and whatever my need, you came to me first.\"",
        "ja": "あなたはすぐ来てくれた"
      },
      {
        "vi": "Chiên khác nghe liền ngạc nhiên: \"Tôi giúp Chúa tôi khi nào?\".",
        "ko": "\"주여, 언제 우리가 그랬나이까?\"",
        "zh": "綿羊問他：「我們何時伸出援手？」",
        "en": "\"Tell us, when did we do this?\" these ones will reply.",
        "ja": "困っているとそばに来て"
      },
      {
        "vi": "Rồi chính Vua giải thích cho họ hiểu được lý do:",
        "ko": "그 물음에, 예수는 말하시리.",
        "zh": "君王耶穌向他們說明理由：",
        "en": "The King will then answer them, telling them why:",
        "ja": "助けの手を差し伸べた」"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "\"Vì khi khó khăn bủa vây thì ngươi vẫn thành trung,",
        "ko": "\"그들 정성 다해 돌봐 준 것은",
        "zh": "「你們樂意服務又不怕辛苦，",
        "en": "\"If you comforted them, you comforted me.",
        "ja": "イエスは言う"
      },
      {
        "vi": "thật lòng quan tâm, ủi an, gắn bó không rời xa.",
        "ko": "바로 나를 돌봐 준 것이란다.",
        "zh": "他們若有需要，都全力協助，",
        "en": "If you did it for them, you did it for me.",
        "ja": "「その助け 私にしたのと同じ"
      },
      {
        "vi": "Việc tốt ngươi hằng làm khi giúp họ, ta đều thấy.",
        "ko": "그들 위한 진심 어린 수고는",
        "zh": "為照顧他們，心甘情願付出。",
        "en": "Your labors for them were your labors for me.",
        "ja": "その労苦は私への"
      },
      {
        "vi": "Giúp đỡ cho họ luôn, dù khó không quản chi,",
        "ko": "바로 나에게, 바로 나에게,",
        "zh": "你們為了我，樂意這麼做，",
        "en": "You did it for them; you did it for me.",
        "ja": "私への深い愛"
      },
      {
        "vi": "là ngươi đã tương trợ ta, thành tín, yêu thương ta\".",
        "ko": "바로 나를 위해 한 것이란다.\"",
        "zh": "凡為他們所做，全都是為我。」",
        "en": "If you did it for them, you did it for me.\"",
        "ja": "私のため してくれた」"
      },
      {
        "vi": "3. \"Ngươi hằng trung thành bên ta, chu toàn công việc đã giao,",
        "ko": "3. \"나의 형제들과 함께 전파하며",
        "zh": "3．「你們忠貞待我，完成許多善工，",
        "en": "3. \"You've been loyal to me, doing works that are fine,",
        "ja": "3. 羊たちの忠実褒め"
      },
      {
        "vi": "cùng bầy nhỏ đi rao báo Nước Chúa ra gần xa\".",
        "ko": "너희 충성 다해 참 잘했구나.\"",
        "zh": "支持我的弟兄，傳上帝王國。」",
        "en": "as you preach alongside these brothers of mine.\"",
        "ja": "王イエスはこう語る"
      },
      {
        "vi": "Vua cất lên lời ngợi khen, rồi phán với chiên bên ngài:",
        "ko": "오른편 양들에게 말씀하시리.",
        "zh": "耶穌親切地向右邊的綿羊說：",
        "en": "So the King will then say to the sheep on his right:",
        "ja": "「さあ受けなさい 王国と"
      },
      {
        "vi": "\"Hãy sống vui trên đất đến muôn đời trong thái an\".",
        "ko": "\"생명과 이 땅을 상속받아라.\"",
        "zh": "「你們必在樂園裡永遠生活。」",
        "en": "\"Inherit the earth and perfection of life.\"",
        "ja": "パラダイスでの命を」"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "\"Vì khi khó khăn bủa vây thì ngươi vẫn thành trung,",
        "ko": "\"그들 정성 다해 돌봐 준 것은",
        "zh": "「你們樂意服務又不怕辛苦，",
        "en": "\"If you comforted them, you comforted me.",
        "ja": "イエスは言う"
      },
      {
        "vi": "thật lòng quan tâm, ủi an, gắn bó không rời xa.",
        "ko": "바로 나를 돌봐 준 것이란다.",
        "zh": "他們若有需要，都全力協助，",
        "en": "If you did it for them, you did it for me.",
        "ja": "「その助け 私にしたのと同じ"
      },
      {
        "vi": "Việc tốt ngươi hằng làm khi giúp họ, ta đều thấy.",
        "ko": "그들 위한 진심 어린 수고는",
        "zh": "為照顧他們，心甘情願付出。",
        "en": "Your labors for them were your labors for me.",
        "ja": "その労苦は私への"
      },
      {
        "vi": "Giúp đỡ cho họ luôn, dù khó không quản chi,",
        "ko": "바로 나에게, 바로 나에게,",
        "zh": "你們為了我，樂意這麼做，",
        "en": "You did it for them; you did it for me.",
        "ja": "私への深い愛"
      },
      {
        "vi": "là ngươi đã tương trợ ta, thành tín, yêu thương ta\".",
        "ko": "바로 나를 위해 한 것이란다.\"",
        "zh": "凡為他們所做，全都是為我。」",
        "en": "If you did it for them, you did it for me.\"",
        "ja": "私のため してくれた」"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Châm 19:17; Mat 10:40-42; 2 Ti 1:16, 17).",
      "ko": "(잠언 19:17; 마태 10:40-42; 디모데 후서 1:16, 17 참조)",
      "zh": "（參看箴19:17；太10:40-42；提後1:16,17）",
      "en": "(See also Prov. 19:17; Matt. 10:40-42; 2 Tim. 1:16, 17.)",
      "ja": "（格 19:17; マタ 10:40-42; テモ二 1:16，17も参照。）"
    }
  },
  {
    "number": 27,
    "sourceSheet": "27",
    "labels": {
      "vi": "BÀI HÁT 27",
      "ko": "27번",
      "zh": "詩歌第27首",
      "en": "SONG 27",
      "ja": "27番"
    },
    "title": {
      "vi": "Các con của Đức Chúa Trời được tỏ lộ",
      "ko": "하느님의 아들들이 곧 나타나리라",
      "zh": "上帝的兒子們顯露出來",
      "en": "The Revealing of God's Sons",
      "ja": "神の子たちが明らかにされる"
    },
    "scripture": {
      "vi": "(Rô-ma 8:19)",
      "ko": "(로마서 8:19)",
      "zh": "（羅馬書8:19）",
      "en": "(Romans 8:19)",
      "ja": "（ローマ 8:19）"
    },
    "lines": [
      {
        "vi": "1. Giờ gần đến lúc anh em xức dầu",
        "ko": "1. 이제 곧 나타나리라,",
        "zh": "1．耶和華揀選的忠僕",
        "en": "1. The time is near when God reveals",
        "ja": "1. 神に選ばれた"
      },
      {
        "vi": "nhận quyền bính lớn Cha ban.",
        "ko": "하느님 아들들.",
        "zh": "快要顯露出來。",
        "en": "His faithful chosen ones.",
        "ja": "聖なる者"
      },
      {
        "vi": "Họ cùng Giê-su trị vì trên cao,",
        "ko": "하늘에서 주 예수와",
        "zh": "復活到天上與基督",
        "en": "In heaven they will rule with Christ",
        "ja": "統治を始める "
      },
      {
        "vi": "mang ân phước đến ngàn đời.",
        "ko": "함께 다스리리.",
        "zh": "一同作王統治。",
        "en": "As mighty spirit sons.",
        "ja": "王イエスと"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Kìa các con Cha tỏ lộ nay mai",
        "ko": "마침내 나타나리라,",
        "zh": "上帝兒子們與基督",
        "en": "The sons of God will be revealed",
        "ja": "明らかにされる"
      },
      {
        "vi": "cùng Đấng Ki-tô, Chúa họ,",
        "ko": "하느님 아들들.",
        "zh": "即將執行審判，",
        "en": "Along with Christ, their Lord.",
        "ja": "神の子たち"
      },
      {
        "vi": "xông pha cùng ngài, chung vui chiến thắng.",
        "ko": "주와 함께 승리하며",
        "zh": "消滅邪惡，一路戰勝，",
        "en": "They'll join him in his victory",
        "ja": "キリストと共に"
      },
      {
        "vi": "Cha ban tràn đầy hiển vinh.",
        "ko": "큰 상을 받으리.",
        "zh": "同得榮耀、賞賜。",
        "en": "And share in his reward.",
        "ja": "報い受ける"
      },
      {
        "vi": "2. Kèn thổi tiếng chót kêu ai sót lại",
        "ko": "2. 마지막 남은 자들을",
        "zh": "2．萬王之王、萬主之主",
        "en": "2. And soon the last remaining ones",
        "ja": "2. 天からの声が"
      },
      {
        "vi": "đoàn tụ với Đấng Ki-tô.",
        "ko": "모두 부르시리.",
        "zh": "從天發號施令，",
        "en": "Will hear his final call.",
        "ja": "鳴り響いて"
      },
      {
        "vi": "Vào giờ phút cuối, họ được Giê-su",
        "ko": "‘왕들의 왕, 주들의 주'",
        "zh": "所有忠心的小群羊，",
        "en": "The King of kings and Lord of lords",
        "ja": "残りの者 "
      },
      {
        "vi": "yêu thương nhóm hết về trời.",
        "ko": "그들 모으시리.",
        "zh": "將全數被召集。",
        "en": "Will then collect them all.",
        "ja": "皆集められる"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Kìa các con Cha tỏ lộ nay mai",
        "ko": "마침내 나타나리라,",
        "zh": "上帝兒子們與基督",
        "en": "The sons of God will be revealed",
        "ja": "明らかにされる"
      },
      {
        "vi": "cùng Đấng Ki-tô, Chúa họ,",
        "ko": "하느님 아들들.",
        "zh": "即將執行審判，",
        "en": "Along with Christ, their Lord.",
        "ja": "神の子たち"
      },
      {
        "vi": "xông pha cùng ngài, chung vui chiến thắng.",
        "ko": "주와 함께 승리하며",
        "zh": "消滅邪惡，一路戰勝，",
        "en": "They'll join him in his victory",
        "ja": "キリストと共に"
      },
      {
        "vi": "Cha ban tràn đầy hiển vinh.",
        "ko": "큰 상을 받으리.",
        "zh": "同得榮耀、賞賜。",
        "en": "And share in his reward.",
        "ja": "報い受ける"
      },
      {
        "vi": "(ĐOẠN CHUYỂN)",
        "ko": "(브리지)",
        "zh": "（過門）",
        "en": "(BRIDGE)",
        "ja": "（ブリッジ）"
      },
      {
        "vi": "Trận cuối họ luôn theo sát bên Vua",
        "ko": "최후의 전쟁 나가서",
        "zh": "君王基督帶領他們",
        "en": "And then with Christ, these sons of God",
        "ja": "最後の戦い"
      },
      {
        "vi": "đánh tan mọi quân bạo tàn.",
        "ko": "승리를 거두고",
        "zh": "發動最後戰役，",
        "en": "Will wage the final war.",
        "ja": "勝利収め"
      },
      {
        "vi": "Giờ phút mừng vui, hôn lễ Chiên Con",
        "ko": "어린양의 신부 되어",
        "zh": "天上婚禮隨後舉行，",
        "en": "The joyous marriage to the Lamb",
        "ja": "イエスと結ばれ"
      },
      {
        "vi": "được Cha chúc phước đời đời.",
        "ko": "영원히 머물리.",
        "zh": "歡欣喜樂洋溢。",
        "en": "Will last forevermore.",
        "ja": "とわに生きる"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Kìa các con Cha tỏ lộ nay mai",
        "ko": "마침내 나타나리라,",
        "zh": "上帝兒子們與基督",
        "en": "The sons of God will be revealed",
        "ja": "明らかにされる"
      },
      {
        "vi": "cùng Đấng Ki-tô, Chúa họ,",
        "ko": "하느님 아들들.",
        "zh": "即將執行審判，",
        "en": "Along with Christ, their Lord.",
        "ja": "神の子たち"
      },
      {
        "vi": "xông pha cùng ngài, chung vui chiến thắng.",
        "ko": "주와 함께 승리하며",
        "zh": "消滅邪惡，一路戰勝，",
        "en": "They'll join him in his victory",
        "ja": "キリストと共に"
      },
      {
        "vi": "Cha ban tràn đầy hiển vinh.",
        "ko": "큰 상을 받으리.",
        "zh": "同得榮耀、賞賜。",
        "en": "And share in his reward.",
        "ja": "報い受ける"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Đa 2:34, 35; 1 Cô 15:51, 52; 1 Tê 4:15-17).",
      "ko": "(다니엘 2:34, 35; 고린도 전서 15:51, 52; 데살로니가 전서 4:15-17 참조)",
      "zh": "（參看但2:34,35；林前15:51,52；帖前4:15-17）",
      "en": "(See also Dan. 2:34, 35; 1 Cor. 15:51, 52; 1 Thess. 4:15-17.)",
      "ja": "（ダニ 2:34，35; コリ一 15:51，52; テサ一 4:15-17も参照。）"
    }
  },
  {
    "number": 28,
    "sourceSheet": "28",
    "labels": {
      "vi": "BÀI HÁT 28",
      "ko": "28번",
      "zh": "詩歌第28首",
      "en": "SONG 28",
      "ja": "28番"
    },
    "title": {
      "vi": "Để được làm bạn với Đức Giê-hô-va",
      "ko": "여호와의 벗이 되리",
      "zh": "贏得耶和華的友誼",
      "en": "Gaining Jehovah\"s Friendship",
      "ja": "エホバの友となる"
    },
    "scripture": {
      "vi": "(Thi thiên 15)",
      "ko": "(시편 15)",
      "zh": "（詩篇15篇）",
      "en": "(Psalm 15)",
      "ja": "（詩編 15編）"
    },
    "lines": [
      {
        "vi": "1. Ai được kết bạn với Chúa?",
        "ko": "1. 오, 우리 하느님, ",
        "zh": "1．耶和華，誰能夠",
        "en": "1. Who is your friend, O God?",
        "ja": "1. 神の友"
      },
      {
        "vi": "Ai được ở lều của Cha?",
        "ko": "주 집에 거하며",
        "zh": "成為你的朋友？",
        "en": "Who in your tent may dwell?",
        "ja": "はどんな人"
      },
      {
        "vi": "Những ai Chúa tin cậy, mãi luôn mến thương?",
        "ko": "주 신뢰받고 주 아는 벗, ",
        "zh": "誰能夠在你聖幕居住，",
        "en": "Who gains your friendship? Who gains your trust?",
        "ja": "神が愛するの"
      },
      {
        "vi": "Những ai trở nên bạn Cha?",
        "ko": "그 누구입니까?",
        "zh": "得你信任賜福？",
        "en": "Who really knows you well?",
        "ja": "はどんな人"
      },
      {
        "vi": "Ấy ai hết lòng theo Chúa,",
        "ko": "말씀 받아들여 ",
        "zh": "就是顯出信心、",
        "en": "All who embrace your Word,",
        "ja": "聖書学び "
      },
      {
        "vi": "quý yêu các lời Thánh Kinh,",
        "ko": "믿음 나타내고",
        "zh": "喜愛真理的人，",
        "en": "All who have faith in you,",
        "ja": "信仰持ち"
      },
      {
        "vi": "đức tin vững nơi ngài, tín trung chẳng lay,",
        "ko": "충성과 진리 사랑하는 ",
        "zh": "他對你忠貞，為人正義，",
        "en": "All who are loyal, all who are just,",
        "ja": "変わらずに正しく"
      },
      {
        "vi": "bước theo lối Cha suốt đời.",
        "ko": "사람들입니다.",
        "zh": "按你話語而行。",
        "en": "Living the truth for you.",
        "ja": "生きる人"
      },
      {
        "vi": "2. Ai được kết bạn với Chúa,",
        "ko": "2. 하느님 벗 되어 ",
        "zh": "2．耶和華，誰能夠",
        "en": "2. Who is your friend, O God?",
        "ja": "2. 神の友"
      },
      {
        "vi": "có ân phước cầu đến Cha?",
        "ko": "주 곁에 다가가",
        "zh": "靠近你的寶座？",
        "en": "Who may approach your throne?",
        "ja": "はどんな人"
      },
      {
        "vi": "Những ai Chúa yêu chuộng, vẫn luôn nhớ tên?",
        "ko": "즐거움, 기쁨 드리는 이, ",
        "zh": "誰能與你有良好關係，",
        "en": "Who brings delight and makes you rejoice?",
        "ja": "神が喜ぶの"
      },
      {
        "vi": "Những ai khiến Cha mừng vui?",
        "ko": "그 누구입니까?",
        "zh": "讓你的心歡喜？",
        "en": "Whose name to you is known?",
        "ja": "はどんな人"
      },
      {
        "vi": "Ấy ai kính sợ danh thánh,",
        "ko": "주 이름 높이며 ",
        "zh": "就是聽從聖經、",
        "en": "All who exalt your name,",
        "ja": "神をたたえ "
      },
      {
        "vi": "lắng nghe các lời Chúa khuyên,",
        "ko": "말씀 순종하고",
        "zh": "稱頌你名的人，",
        "en": "All who your Word obey,",
        "ja": "よく従い"
      },
      {
        "vi": "quyết luôn sống trung thành, có tâm thẳng ngay,",
        "ko": "진실 말하고 마음 참된 ",
        "zh": "他誠實可靠，待人忠信，",
        "en": "All who are faithful, honest in heart,",
        "ja": "正直で心の"
      },
      {
        "vi": "nói năng đáng tin, chân thật.",
        "ko": "사람들입니다.",
        "zh": "總是心口如一。",
        "en": "Truthful in all they say.",
        "ja": "清い人"
      },
      {
        "vi": "3. Biết bao gánh nặng, lo lắng,",
        "ko": "3. 날마다 기도로 ",
        "zh": "3．卸下一切煩憂，",
        "en": "3. Throwing our cares on you,",
        "ja": "3. 祈りにより"
      },
      {
        "vi": "thiết tha giãi bày với Cha,",
        "ko": "염려 내맡기고",
        "zh": "向你盡情傾訴。",
        "en": "Baring our hearts in prayer,",
        "ja": "悩み委ね"
      },
      {
        "vi": "chúng con kính yêu và biết Cha rõ hơn,",
        "ko": "주 가까이서 주의 ",
        "zh": "天天親近你，在你愛裡，",
        "en": "Drawing us closer, bonding in love,",
        "ja": "すぐそばに感じる"
      },
      {
        "vi": "đấng chăm sóc ân cần thay.",
        "ko": "사랑 매일 느끼려고",
        "zh": "受你呵護關心。",
        "en": "Feeling your daily care,",
        "ja": "神の愛"
      },
      {
        "vi": "Chúng con muốn gần Cha mãi,",
        "ko": "주의 벗이 되어 ",
        "zh": "渴望與你為友，",
        "en": "We yearn to be your friend.",
        "ja": "今日も明日も"
      },
      {
        "vi": "ước ao kết bạn với Cha",
        "ko": "늘 머물렵니다.",
        "zh": "但願友誼長久，",
        "en": "Long may our friendship grow.",
        "ja": "どんな時も"
      },
      {
        "vi": "bởi Cha tốt vô cùng, hỡi Giê-hô-va,",
        "ko": "더 훌륭한 벗 또 없으니 ",
        "zh": "你是我真正知心好友，",
        "en": "No greater Friend could we ever gain,",
        "ja": "エホバこそ"
      },
      {
        "vi": "chẳng ai sánh được với ngài.",
        "ko": "벗 되어 주소서.",
        "zh": "直到天長地久。",
        "en": "No greater Friend we\"ll know.",
        "ja": "私の真の友"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 139:1; 1 Phi 5:6, 7).",
      "ko": "(시 139:1; 베드로 전서 5:6, 7 참조)",
      "zh": "（參看詩139:1；彼前5:6,7）",
      "en": "(See also Ps. 139:1; 1 Pet. 5:6, 7.)",
      "ja": "（詩 139:1; ペテ一 5:6，7も参照。）"
    }
  },
  {
    "number": 29,
    "sourceSheet": "29",
    "labels": {
      "vi": "BÀI HÁT 29",
      "ko": "29번",
      "zh": "詩歌第29首",
      "en": "SONG 29",
      "ja": "29番"
    },
    "title": {
      "vi": "Sống xứng đáng với danh hiệu Cha ban cho",
      "ko": "우리의 이름에 합당하게 살렵니다",
      "zh": "做名副其實的耶和華見證人",
      "en": "Living Up to Our Name",
      "ja": "エホバの証人として生きる"
    },
    "scripture": {
      "vi": "(Ê-sai 43:10-12)",
      "ko": "(이사야 43:10-12)",
      "zh": "（以賽亞書43:10-12）",
      "en": "(Isaiah 43:10-12)",
      "ja": "（イザヤ 43:10-12）"
    },
    "lines": [
      {
        "vi": "1. Giê-hô-va hiển vinh, ngài tối cao và muôn đời,",
        "ko": "1. 사랑과 능력이 크신 아버지,",
        "zh": "1．榮耀的耶和華，永恆而全能，",
        "en": "1. Glorious Jehovah, almighty, eternal,",
        "ja": "1. 栄光と愛に満ちる"
      },
      {
        "vi": "là Cha công chính, đầy quyền năng, yêu thương thay!",
        "ko": "하늘의 주권자 여호와여,",
        "zh": "你力量充沛，慈愛又公正。",
        "en": "Perfect in justice, in power, in love.",
        "ja": "天に住むエホバ神"
      },
      {
        "vi": "Chính Cha là suối nguồn sự sáng khôn và chân thật.",
        "ko": "지혜와 공의가 완전하시니",
        "zh": "真理的來源，充滿無窮智慧，",
        "en": "Source of all truth and of infinite wisdom,",
        "ja": "始まりも終わりもない"
      },
      {
        "vi": "Cha là Vua Tối Cao trên trời bao la kia.",
        "ko": "영원히 찬양을 받으소서.",
        "zh": "你是至高者，必永遠統治。",
        "en": "You rule as Sov\"reign in heaven above.",
        "ja": "公正な主権者よ"
      },
      {
        "vi": "Nguyện chúng con hân hoan tham gia trong công việc ngài,",
        "ko": "우리는 즐거이 주를 섬기며",
        "zh": "能稱為你名下子民多歡欣，",
        "en": "We as your people delight in your service;",
        "ja": "あなたに仕える名誉"
      },
      {
        "vi": "rao báo cho muôn người về Nước Trời trên cao.",
        "ko": "기쁨으로 왕국 전합니다.",
        "zh": "我們樂意傳王國好消息。",
        "en": "Your Kingdom truth we delight to proclaim.",
        "ja": "名を負う民の誇り"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Thật một đặc ân được gọi tên là Nhân Chứng Cha!",
        "ko": "당신의 증인 됨 큰 영예이니",
        "zh": "能代表耶和華是無上光榮，",
        "en": "Being your Witnesses, great is our priv\"lege.",
        "ja": "ふさわしく生きていたい"
      },
      {
        "vi": "Mong sao được xứng với danh hiệu Cha ban cho.",
        "ko": "이름에 합당히 살렵니다!",
        "zh": "願做名副其實的見證人。",
        "en": "Oh, may we ever live up to our name!",
        "ja": "神の証人として"
      },
      {
        "vi": "2. Chúng con hợp nhất cùng hoàn tất công việc Chúa giao,",
        "ko": "2. 거룩한 봉사를 함께 드리며",
        "zh": "2．我們並肩敬奉偉大的天父，",
        "en": "2. Working together in your sacred service",
        "ja": "2. 栄光と賛美の声"
      },
      {
        "vi": "tạo dây liên kết hòa thuận, anh em yêu thương.",
        "ko": "사랑으로 연합한 우리들,",
        "zh": "親如兄弟享友愛與和睦。",
        "en": "Binds us as brothers in love and in peace.",
        "ja": "神に向けられるよう"
      },
      {
        "vi": "Giúp muôn người biết về Lời Chúa, nghe ngài khuyên dạy.",
        "ko": "찬양의 소리를 점점 높이니",
        "zh": "盡心教導真理，反映你榮耀，",
        "en": "Teaching the truth and reflecting your glory",
        "ja": "喜んで真理教え"
      },
      {
        "vi": "Vui mừng khi thấy thêm bao người ca khen Cha.",
        "ko": "그 기쁨 마음에 넘칩니다.",
        "zh": "人人讚美你，我們心歡喜。",
        "en": "Fill us with joy as your praises increase.",
        "ja": "一致する 友たちと"
      },
      {
        "vi": "Nhiều phước ân thay khi nay mang danh Giê-hô-va,",
        "ko": "아버지 이름을 지닌 우리는",
        "zh": "耶和華我們身為你的子民，",
        "en": "Known by your name, O Jehovah, our Father,",
        "ja": "輝くあなたの栄誉"
      },
      {
        "vi": "xin góp công lao mình làm Chúa được tôn vinh.",
        "ko": "모든 영광 주께 돌립니다.",
        "zh": "能為天父增光深感榮幸。",
        "en": "We have the honor to add to your fame.",
        "ja": "名を負う民が映す"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Thật một đặc ân được gọi tên là Nhân Chứng Cha!",
        "ko": "당신의 증인 됨 큰 영예이니",
        "zh": "能代表耶和華是無上光榮，",
        "en": "Being your Witnesses, great is our priv\"lege.",
        "ja": "ふさわしく生きていたい"
      },
      {
        "vi": "Mong sao được xứng với danh hiệu Cha ban cho.",
        "ko": "이름에 합당히 살렵니다!",
        "zh": "願做名副其實的見證人。",
        "en": "Oh, may we ever live up to our name!",
        "ja": "神の証人として"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Phục 32:4; Thi 43:3; Đa 2:20, 21).",
      "ko": "(신명 32:4; 시 43:3; 다니엘 2:20, 21 참조)",
      "zh": "（參看申32:4；詩43:3；但2:20,21）",
      "en": "(See also Deut. 32:4; Ps. 43:3; Dan. 2:20, 21.)",
      "ja": "（申 32:4; 詩 43:3; ダニ 2:20，21も参照。）"
    }
  },
  {
    "number": 30,
    "sourceSheet": "30",
    "labels": {
      "vi": "BÀI HÁT 30",
      "ko": "30번",
      "zh": "詩歌第30首",
      "en": "SONG 30",
      "ja": "30番"
    },
    "title": {
      "vi": "Ngài là Cha, là Đức Chúa Trời và là Bạn tôi",
      "ko": "내 아버지, 내 하느님, 내 벗",
      "zh": "我的上帝、慈父和良朋",
      "en": "My Father, My God and Friend",
      "ja": "私の父，私の神，私の友"
    },
    "scripture": {
      "vi": "(Hê-bơ-rơ 6:10)",
      "ko": "(히브리서 6:10)",
      "zh": "（希伯來書6:10）",
      "en": "(Hebrews 6:10)",
      "ja": "（ヘブライ 6:10）"
    },
    "lines": [
      {
        "vi": "1. Đời muôn chông gai, bao khốn khó,",
        "ko": "1. 이 세상 사는 동안",
        "zh": "1．現在生活多坎坷，",
        "en": "1. Life in this world can be hard.",
        "ja": "1. 涙あふれて"
      },
      {
        "vi": "nhiều điều gây ra đau thương hay lệ đắng.",
        "ko": "서럽고 힘든 일 많지만",
        "zh": "流淚悲傷，身心多痛苦。",
        "en": "Life in this world can bring tears and pain.",
        "ja": "疲れ果てる時も"
      },
      {
        "vi": "Dù vậy, tôi luôn vui sướng nói:",
        "ko": "허무한 삶 사는 듯",
        "zh": "每天仍深信不疑，",
        "en": "Still ev\"ry day I will say,",
        "ja": "この生き方は"
      },
      {
        "vi": "\"Tôi sống có ích dường bao!\".",
        "ko": "탄식지 않으리.",
        "zh": "此生從未虛度。",
        "en": "\"My life is not in vain.\"",
        "ja": "無駄ではない"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Vì Chúa, đấng công chính muôn đời,",
        "ko": "주는 의로우시어",
        "zh": "仁愛正義的上帝，",
        "en": "For God is not unrighteous,",
        "ja": "私の愛を神は"
      },
      {
        "vi": "ngài không quên công khó, tình yêu thương tôi.",
        "ko": "내 사랑 잊지 않으시네.",
        "zh": "必不忘記我表現的愛。",
        "en": "And he remembers the love I\"ve shown.",
        "ja": "忘れ去らず"
      },
      {
        "vi": "Chúa luôn gần bên tôi mọi lúc,",
        "ko": "항상 곁에 계시니",
        "zh": "他常陪伴我身邊，",
        "en": "So he is ever near me;",
        "ja": "すぐそばにいて"
      },
      {
        "vi": "tôi chẳng sợ hãi, chẳng thấy lẻ loi.",
        "ko": "난 혼자가 아니라네.",
        "zh": "我倚靠他絕不孤單。",
        "en": "With Jehovah, I\"m not alone.",
        "ja": "支えてくださる"
      },
      {
        "vi": "Thật Chúa, đấng chăm sóc ân cần,",
        "ko": "끝까지 돌보시며",
        "zh": "上帝賜予我一切，",
        "en": "Yes, God is my provider",
        "ja": "愛のエホバは"
      },
      {
        "vi": "ngài yêu thương che chở dù trong gian khó.",
        "ko": "보호하시는 주 여호와,",
        "zh": "每天守護我直到永恆。",
        "en": "and my protector down to the end.",
        "ja": "いつの日も"
      },
      {
        "vi": "Chính ngài là Chúa, cũng là Cha tốt,",
        "ko": "내 아버지, 내 하느님,",
        "zh": "耶和華是我的上帝、",
        "en": "Yes, Jehovah is my Father,",
        "ja": "私の父です "
      },
      {
        "vi": "là Bạn của tôi.",
        "ko": "내 벗이네.",
        "zh": "慈父、良朋。",
        "en": "My God and Friend.",
        "ja": "神です 友です"
      },
      {
        "vi": "2. Thời xuân xanh tôi qua chóng vánh,",
        "ko": "2. 젊은 날 지나가고",
        "zh": "2．青春歲月成過去，",
        "en": "2. Gone are the days of my youth;",
        "ja": "2. 若さ過ぎ去り"
      },
      {
        "vi": "ngày gian nan như mây âm u phủ lối.",
        "ko": "노년의 아픔을 겪지만",
        "zh": "年事已高，處境多無奈。",
        "en": "Days of calamity now are here.",
        "ja": "苦しみ続いても"
      },
      {
        "vi": "Dù vậy, tương lai tôi vẫn sáng",
        "ko": "믿음이 주는 희망",
        "zh": "每天仍保持信心，",
        "en": "Still through the eyes of my faith,",
        "ja": "信仰の目に"
      },
      {
        "vi": "trong mắt đức tin của tôi.",
        "ko": "밝고 선명하네.",
        "zh": "展望光明未來。",
        "en": "My hope is bright and clear.",
        "ja": "見える希望"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Vì Chúa, đấng công chính muôn đời,",
        "ko": "주는 의로우시어",
        "zh": "仁愛正義的上帝，",
        "en": "For God is not unrighteous,",
        "ja": "私の愛を神は"
      },
      {
        "vi": "ngài không quên công khó, tình yêu thương tôi.",
        "ko": "내 사랑 잊지 않으시네.",
        "zh": "必不忘記我表現的愛。",
        "en": "And he remembers the love I\"ve shown.",
        "ja": "忘れ去らず"
      },
      {
        "vi": "Chúa luôn gần bên tôi mọi lúc,",
        "ko": "항상 곁에 계시니",
        "zh": "他常陪伴我身邊，",
        "en": "So he is ever near me;",
        "ja": "すぐそばにいて"
      },
      {
        "vi": "tôi chẳng sợ hãi, chẳng thấy lẻ loi.",
        "ko": "난 혼자가 아니라네.",
        "zh": "我倚靠他絕不孤單。",
        "en": "With Jehovah, I\"m not alone.",
        "ja": "支えてくださる"
      },
      {
        "vi": "Thật Chúa, đấng chăm sóc ân cần,",
        "ko": "끝까지 돌보시며",
        "zh": "上帝賜予我一切，",
        "en": "Yes, God is my provider",
        "ja": "愛のエホバは"
      },
      {
        "vi": "ngài yêu thương che chở dù trong gian khó.",
        "ko": "보호하시는 주 여호와,",
        "zh": "每天守護我直到永恆。",
        "en": "and my protector down to the end.",
        "ja": "いつの日も"
      },
      {
        "vi": "Chính ngài là Chúa, cũng là Cha tốt,",
        "ko": "내 아버지, 내 하느님,",
        "zh": "耶和華是我的上帝、",
        "en": "Yes, Jehovah is my Father,",
        "ja": "私の父です "
      },
      {
        "vi": "là Bạn của tôi.",
        "ko": "내 벗이네.",
        "zh": "慈父、良朋。",
        "en": "My God and Friend.",
        "ja": "神です 友です"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 71:17, 18).",
      "ko": "(시 71:17, 18 참조)",
      "zh": "（參看詩71:17,18）",
      "en": "(See also Ps. 71:17, 18.)",
      "ja": "（詩 71:17，18も参照。）"
    }
  },
  {
    "number": 31,
    "sourceSheet": "31",
    "labels": {
      "vi": "BÀI HÁT 31",
      "ko": "31번",
      "zh": "詩歌第31首",
      "en": "SONG 31",
      "ja": "31番"
    },
    "title": {
      "vi": "Hãy bước đi với Đức Chúa Trời!",
      "ko": "하느님과 함께 걸으라!",
      "zh": "與上帝同行",
      "en": "Oh, Walk With God!",
      "ja": "神と共に歩む"
    },
    "scripture": {
      "vi": "(Mi-chê 6:8)",
      "ko": "(미가 6:8)",
      "zh": "（彌迦書6:8）",
      "en": "(Micah 6:8)",
      "ja": "（ミカ 6:8）"
    },
    "lines": [
      {
        "vi": "1. Ta nguyện khiêm tốn theo Cha hằng ngày,",
        "ko": "1. 겸허하게 주와 걷고",
        "zh": "1．表現謙遜，忠誠專一，",
        "en": "1. Oh, walk with God in modesty;",
        "ja": "1. エホバと歩もう "
      },
      {
        "vi": "trung tín, yêu thương, luôn chân thật.",
        "ko": "그 곁에 머물면서",
        "zh": "天天與上帝同行。",
        "en": "Show loyal love, and be true.",
        "ja": "慎み持って"
      },
      {
        "vi": "Hằng nương náu nơi Cha và gắn bó không thôi,",
        "ko": "충성스러운 사랑 보이고",
        "zh": "親近耶和華，全心依靠他，",
        "en": "Stay close to Jehovah, leaning on him,",
        "ja": "神のそば離れず"
      },
      {
        "vi": "sức Cha làm ta hăng hái thêm.",
        "ko": "주 힘에 의지하라.",
        "zh": "讓他加添你力量。",
        "en": "And let his strength sustain you.",
        "ja": "にいつでも頼り"
      },
      {
        "vi": "Một khi vâng giữ Lời Cha ban,",
        "ko": "여호와 말씀을 지키면",
        "zh": "你若遵行他信實話語，",
        "en": "Keep holding tight to his faithful Word;",
        "ja": "道を照らす"
      },
      {
        "vi": "ta chẳng dạt trôi đi xa lối ngay.",
        "ko": "흔들림 없으리.",
        "zh": "必不隨流漂去。",
        "en": "You\"ll never drift away.",
        "ja": "教え守り続け"
      },
      {
        "vi": "Mình hãy đưa tay cho Cha dìu dắt,",
        "ko": "주 손잡은 아이처럼",
        "zh": "虛心聽從上帝命令，",
        "en": "So let God lead you by the hand",
        "ja": "その手 握り締め"
      },
      {
        "vi": "lắng tai nghe, vâng theo muôn đời.",
        "ko": "주의 인도 따르라.",
        "zh": "接受他指引帶領。",
        "en": "As you listen and obey.",
        "ja": "共に歩もう"
      },
      {
        "vi": "2. Đi đường thanh khiết theo Cha hằng ngày.",
        "ko": "2. 거룩하게 주와 걷고",
        "zh": "2．一切言行保持聖潔，",
        "en": "2. Oh, walk with God in holiness;",
        "ja": "2. エホバと歩もう "
      },
      {
        "vi": "Tâm trí mong sao luôn trong sạch.",
        "ko": "순결한 생각하면",
        "zh": "天天與上帝同行。",
        "en": "Consider things that are pure.",
        "ja": "清さ保って"
      },
      {
        "vi": "Dù thử thách vây quanh, ngài sẽ giúp cho ta",
        "ko": "아무리 강한 유혹이라도",
        "zh": "無論在前頭有多大誘惑，",
        "en": "No matter how great temptations may be,",
        "ja": "誘惑に耐え"
      },
      {
        "vi": "vững tin vượt qua, không thoái lui.",
        "ko": "이기게 도우시리.",
        "zh": "他會幫助你忍受。",
        "en": "He\"ll help you to endure them.",
        "ja": "るため助けを求め"
      },
      {
        "vi": "Điều chi công chính và trang nghiêm",
        "ko": "참되고 칭찬할 만한 것",
        "zh": "真實和值得讚美的事，",
        "en": "Whatever praiseworthy things there are,",
        "ja": "考え続けよう "
      },
      {
        "vi": "hay điều lành ngay, nhân đức, đáng khen",
        "ko": "계속 생각하면",
        "zh": "都要不斷深思。",
        "en": "Whatever things are true,",
        "ja": "正しいこと"
      },
      {
        "vi": "thì hãy chuyên tâm suy tư, nghiền ngẫm,",
        "ko": "주 여호와 내 곁에서",
        "zh": "讓耶和華的心歡喜，",
        "en": "Continue to consider them,",
        "ja": "そのときエホバは"
      },
      {
        "vi": "Chúa sẽ luôn bên ta tương trợ.",
        "ko": "항상 함께하시리.",
        "zh": "他必與你更親近。",
        "en": "And our God will be with you.",
        "ja": "すぐそばにいる"
      },
      {
        "vi": "3. Ta mừng vui bước theo Cha hằng ngày",
        "ko": "3. 행복하게 주와 걷고",
        "zh": "3．與耶和華締結友誼，",
        "en": "3. Oh, walk with God in happiness;",
        "ja": "3. エホバと歩もう "
      },
      {
        "vi": "khi biết Cha xem ta là bạn.",
        "ko": "그분의 벗이 되어",
        "zh": "喜樂地與他同行。",
        "en": "Rejoice that he is your Friend.",
        "ja": "喜びながら"
      },
      {
        "vi": "Nhiều ân phước trong tay mình vui hưởng lâu nay",
        "ko": "한없이 좋은 선물 즐기며",
        "zh": "要衷心感激他慷慨施與，",
        "en": "Be thankful for all the gifts that he gives",
        "ja": "永遠に注がれる"
      },
      {
        "vi": "chính do ngài ban, ta biết ơn.",
        "ko": "그 축복 감사하라.",
        "zh": "賜下美福數不盡。",
        "en": "And blessings that are endless.",
        "ja": "祝福見つめ"
      },
      {
        "vi": "Đời ta mong mãi gần bên Cha,",
        "ko": "늘 주와 즐거이 걸으며",
        "zh": "下定決心與天父同行，",
        "en": "Oh, walk with God, let your heart be glad;",
        "ja": "心に喜びが"
      },
      {
        "vi": "đong đầy niềm vui, hân hoan hát ca.",
        "ko": "큰 기쁨 보일 때,",
        "zh": "必定滿心歡喜。",
        "en": "Express your joy in song.",
        "ja": "湧き上がれば"
      },
      {
        "vi": "Từ khắp bốn phương muôn dân đều thấy",
        "ko": "난 여호와께 속함을",
        "zh": "流露心中喜樂之情，",
        "en": "Your joy will show, and all will know,",
        "ja": "エホバとの絆 "
      },
      {
        "vi": "chúng ta đi bên Cha không rời.",
        "ko": "모두 알게 되리라.",
        "zh": "你表明屬於上帝。",
        "en": "To Jehovah you belong.",
        "ja": "皆に伝わる"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Sáng 5:24; 6:9; Phi-líp 4:8; 1 Ti 6:6-8).",
      "ko": "(창세 5:24; 6:9; 빌립보 4:8; 디모데 전서 6:6-8 참조)",
      "zh": "（參看創5:24；6:9；腓4:8；提前6:6-8）",
      "en": "(See also Gen. 5:24; 6:9; Phil. 4:8; 1 Tim. 6:6-8.)",
      "ja": "（創 5:24; 6:9; フィリ 4:8; テモ一 6:6-8も参照。）"
    }
  },
  {
    "number": 32,
    "sourceSheet": "32",
    "labels": {
      "vi": "BÀI HÁT 32",
      "ko": "32번",
      "zh": "詩歌第32首",
      "en": "SONG 32",
      "ja": "32番"
    },
    "title": {
      "vi": "Hãy đứng về phía Đức Giê-hô-va!",
      "ko": "여호와의 편에 서라!",
      "zh": "要擁護耶和華！",
      "en": "Take Sides With Jehovah!",
      "ja": "エホバの側に立つ"
    },
    "scripture": {
      "vi": "(Xuất Ai Cập 32:26)",
      "ko": "(출애굽기 32:26)",
      "zh": "（出埃及記32:26）",
      "en": "(Exodus 32:26)",
      "ja": "（出エジプト 32:26）"
    },
    "lines": [
      {
        "vi": "1. Trong lòng ta xưa đầy hoang mang với lo âu",
        "ko": "1. 한때는 혼란과 의문 속에",
        "zh": "1．錯誤宗教蒙蔽人的思想，",
        "en": "1. Once with confusion our sad hearts were filled,",
        "ja": "1. 真の自由手にした"
      },
      {
        "vi": "do rượu u mê từ tôn giáo sai quanh mình,",
        "ko": "거짓된 종교를 믿었지만",
        "zh": "讓人痛苦憂傷，困惑迷惘。",
        "en": "Drinking the cup false religion distilled;",
        "ja": "神の意志を学んで"
      },
      {
        "vi": "nhưng rồi tâm ta tràn bao vui sướng hân hoan,",
        "ko": "왕국의 소식을 알게 되어",
        "zh": "多高興上帝王國的信息",
        "en": "But with what happiness our hearts were thrilled",
        "ja": "心躍り叫んだ"
      },
      {
        "vi": "khi được nghe đến tin Cha truyền.",
        "ko": "더없이 행복하네.",
        "zh": "滋潤乾渴的內心。",
        "en": "When of God's Kingdom we heard.",
        "ja": "希望見つけて"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Quyết đứng luôn về phía Cha; nơi Chúa ta mừng vui.",
        "ko": "주의 편에 서서 기쁨 누리라.",
        "zh": "要擁護耶和華，因他而歡欣，",
        "en": "Take sides with Jehovah; Make him your delight.",
        "ja": "立ち続ける 神の側"
      },
      {
        "vi": "Chúa sẽ không xa lìa mình. Quyết bước đi trung thành.",
        "ko": "그 평화, 그 자유 널리 전하라.",
        "zh": "走在他的光裡，他永不捨棄。",
        "en": "He'll never forsake you; Walk on in his light.",
        "ja": "自由を得て光浴び"
      },
      {
        "vi": "Hãy giảng rao về Nước Cha, Vua Giê-su cao quý",
        "ko": "아들 예수 통치, 늘 확장되니",
        "zh": "要宣告好消息：自由快來臨，",
        "en": "Tell, tell the glad tidings Of freedom and peace.",
        "ja": "良い知らせを広めよう"
      },
      {
        "vi": "sẽ ban nhân loại thái bình, tự do và ấm no.",
        "ko": "여호와의 편에 굳게 서리라.",
        "zh": "上帝通過基督，將帶來和平。",
        "en": "His rule by Christ Jesus Will ever increase.",
        "ja": "神の統治たたえよう"
      },
      {
        "vi": "2. Ta cùng chung vai phụng sự Cha Giê-hô-va,",
        "ko": "2. 우리는 여호와 곁에 서서",
        "zh": "2．我們肩並肩擁護耶和華，",
        "en": "2. Shoulder to shoulder we stand on God's side,",
        "ja": "2. 世界中で告げよう"
      },
      {
        "vi": "không ngừng truyền rao Lời Cha đến cho bao người.",
        "ko": "왕국의 소식을 전하리라.",
        "zh": "齊心將好消息傳遍天下。",
        "en": "Preaching the news of his Kingdom earth wide.",
        "ja": "真の友と一緒に"
      },
      {
        "vi": "Nay thời gian không còn bao lâu để muôn dân",
        "ko": "선택을 해야 할 시간이니",
        "zh": "現在每個人都必須決定",
        "en": "Now is the time for each one to decide,",
        "ja": "神の側に立つよう"
      },
      {
        "vi": "mau chọn theo phía Giê-hô-va.",
        "ko": "하느님 편에 서라.",
        "zh": "是否要擁護上帝。",
        "en": "Time to take sides with our God.",
        "ja": "人に知らせる"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Quyết đứng luôn về phía Cha; nơi Chúa ta mừng vui.",
        "ko": "주의 편에 서서 기쁨 누리라.",
        "zh": "要擁護耶和華，因他而歡欣，",
        "en": "Take sides with Jehovah; Make him your delight.",
        "ja": "立ち続ける 神の側"
      },
      {
        "vi": "Chúa sẽ không xa lìa mình. Quyết bước đi trung thành.",
        "ko": "그 평화, 그 자유 널리 전하라.",
        "zh": "走在他的光裡，他永不捨棄。",
        "en": "He'll never forsake you; Walk on in his light.",
        "ja": "自由を得て光浴び"
      },
      {
        "vi": "Hãy giảng rao về Nước Cha, Vua Giê-su cao quý",
        "ko": "아들 예수 통치, 늘 확장되니",
        "zh": "要宣告好消息：自由快來臨，",
        "en": "Tell, tell the glad tidings Of freedom and peace.",
        "ja": "良い知らせを広めよう"
      },
      {
        "vi": "sẽ ban nhân loại thái bình, tự do và ấm no.",
        "ko": "여호와의 편에 굳게 서리라.",
        "zh": "上帝通過基督，將帶來和平。",
        "en": "His rule by Christ Jesus Will ever increase.",
        "ja": "神の統治たたえよう"
      },
      {
        "vi": "3. Không sợ Sa-tan bày ra mưu kế gian manh.",
        "ko": "3. 우리는 여호와 신뢰하며",
        "zh": "3．不必害怕魔鬼陰險惡毒，",
        "en": "3. We will not fear what the Devil can do.",
        "ja": "3. 神にいつも頼ろう"
      },
      {
        "vi": "Ta cậy trông Cha vượt qua biết bao tai họa.",
        "ko": "마귀를 두려워하지 않네.",
        "zh": "信賴上帝的人必受保護。",
        "en": "Trusting Jehovah will carry us through.",
        "ja": "敵が怖いときにも"
      },
      {
        "vi": "Quân thù quanh ta dù cho đông đến bao nhiêu,",
        "ko": "적들이 아무리 많다 해도",
        "zh": "雖然敵人強大數目眾多，",
        "en": "Though they are many and though we are few,",
        "ja": "エホバ神に祈れば"
      },
      {
        "vi": "Cha hằng ban sức ta thêm mạnh.",
        "ko": "여호와 힘 주시네.",
        "zh": "全能上帝必搭救。",
        "en": "God is our strength and our might.",
        "ja": "力みなぎる"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Quyết đứng luôn về phía Cha; nơi Chúa ta mừng vui.",
        "ko": "주의 편에 서서 기쁨 누리라.",
        "zh": "要擁護耶和華，因他而歡欣，",
        "en": "Take sides with Jehovah; Make him your delight.",
        "ja": "立ち続ける 神の側"
      },
      {
        "vi": "Chúa sẽ không xa lìa mình. Quyết bước đi trung thành.",
        "ko": "그 평화, 그 자유 널리 전하라.",
        "zh": "走在他的光裡，他永不捨棄。",
        "en": "He'll never forsake you; Walk on in his light.",
        "ja": "自由を得て光浴び"
      },
      {
        "vi": "Hãy giảng rao về Nước Cha, Vua Giê-su cao quý",
        "ko": "아들 예수 통치, 늘 확장되니",
        "zh": "要宣告好消息：自由快來臨，",
        "en": "Tell, tell the glad tidings Of freedom and peace.",
        "ja": "良い知らせを広めよう"
      },
      {
        "vi": "sẽ ban nhân loại thái bình, tự do và ấm no.",
        "ko": "여호와의 편에 굳게 서리라.",
        "zh": "上帝通過基督，將帶來和平。",
        "en": "His rule by Christ Jesus Will ever increase.",
        "ja": "神の統治たたえよう"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 94:14; Châm 3:5, 6; Hê 13:5).",
      "ko": "(시 94:14; 잠언 3:5, 6; 히브리 13:5 참조)",
      "zh": "（參看詩94:14；箴3:5,6；來13:5）",
      "en": "(See also Ps. 94:14; Prov. 3:5, 6; Heb. 13:5.)",
      "ja": "（詩 94:14; 格 3:5，6; ヘブ 13:5も参照。）"
    }
  },
  {
    "number": 33,
    "sourceSheet": "33",
    "labels": {
      "vi": "BÀI HÁT 33",
      "ko": "33번",
      "zh": "詩歌第33首",
      "en": "SONG 33",
      "ja": "33番"
    },
    "title": {
      "vi": "Hãy trút gánh nặng cho Đức Giê-hô-va",
      "ko": "너의 짐을 여호와께 맡기라",
      "zh": "把重擔卸給耶和華",
      "en": "Throw Your Burden on Jehovah",
      "ja": "エホバに重荷を委ねる"
    },
    "scripture": {
      "vi": "(Thi thiên 55)",
      "ko": "(시편 55)",
      "zh": "（詩篇55篇）",
      "en": "(Psalm 55)",
      "ja": "（詩編 55編）"
    },
    "lines": [
      {
        "vi": "1. Lạy Giê-hô-va, xin ngài lắng nghe",
        "ko": "1. 주여, 귀 기울이시고",
        "zh": "1．耶和華，懇求你垂聽，",
        "en": "1. \"Listen to my prayer,\" Jehovah.",
        "ja": "1. 私の祈りを"
      },
      {
        "vi": "mỗi lúc con cầu khẩn với Cha.",
        "ko": "나를 멀리 마소서.",
        "zh": "回應我呼求聲音。",
        "en": "Let yourself be found by me.",
        "ja": "聞いてください"
      },
      {
        "vi": "Cầu ngài thấu cho tâm hồn đang đớn đau",
        "ko": "나의 아픔 들으시고",
        "zh": "請安慰我憂慮的心，",
        "en": "Feel the anguish deep inside me;",
        "ja": "届きますように"
      },
      {
        "vi": "và giúp con không sợ chi.",
        "ko": "시름 없애 주소서.",
        "zh": "驅逐我內心恐懼。",
        "en": "Help me unafraid to be.",
        "ja": "心の苦悩"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Trao bao gánh nặng cho Giê-hô-va,",
        "ko": "여호와가 힘 주시고",
        "zh": "把重擔卸給耶和華，",
        "en": "Throw your burden on Jehovah;",
        "ja": "エホバに重荷を"
      },
      {
        "vi": "Chúa mãi bên cạnh cứu thoát qua nguy nan.",
        "ko": "너를 보호해 주시리니",
        "zh": "他必定會扶持、拯救你。",
        "en": "Trust in him to sustain and save you.",
        "ja": "委ねて歩めば"
      },
      {
        "vi": "Vì hằng tín trung, chân thật,",
        "ko": "항상 그분 신뢰하며",
        "zh": "他是忠貞信實上帝，",
        "en": "He will always give protection.",
        "ja": "支えてくださる"
      },
      {
        "vi": "ngài đỡ nâng, gìn giữ cho ta bình an.",
        "ko": "모든 짐을 맡기라.",
        "zh": "時刻保護他子民。",
        "en": "He is loyal; he is true.",
        "ja": "大きな愛で"
      },
      {
        "vi": "2. Lòng thầm ước như chim sải cánh bay",
        "ko": "2. 내가 날개 가졌다면",
        "zh": "2．願我能有翅膀飛翔，",
        "en": "2. Had I wings just as a dove has,",
        "ja": "2. 今ハトのように"
      },
      {
        "vi": "tới chốn an toàn tránh bão giông,",
        "ko": "멀리멀리 날아가",
        "zh": "逃離危險和恐慌。",
        "en": "Far from danger I would fly,",
        "ja": "翼があれば"
      },
      {
        "vi": "ẩn mình tránh xa quân thù đang tấn công,",
        "ko": "해하려는 자들 피해",
        "zh": "但願尋得藏身地方，",
        "en": "Safe from those who seek to hurt me,",
        "ja": "嵐の中から"
      },
      {
        "vi": "khỏi kẻ vu oan, gièm pha.",
        "ko": "안전히 거할 텐데.",
        "zh": "不再被惡人所傷。",
        "en": "Sheltered from their hateful cry.",
        "ja": "飛び去れるのに"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Trao bao gánh nặng cho Giê-hô-va,",
        "ko": "여호와가 힘 주시고",
        "zh": "把重擔卸給耶和華，",
        "en": "Throw your burden on Jehovah;",
        "ja": "エホバに重荷を"
      },
      {
        "vi": "Chúa mãi bên cạnh cứu thoát qua nguy nan.",
        "ko": "너를 보호해 주시리니",
        "zh": "他必定會扶持、拯救你。",
        "en": "Trust in him to sustain and save you.",
        "ja": "委ねて歩めば"
      },
      {
        "vi": "Vì hằng tín trung, chân thật,",
        "ko": "항상 그분 신뢰하며",
        "zh": "他是忠貞信實上帝，",
        "en": "He will always give protection.",
        "ja": "支えてくださる"
      },
      {
        "vi": "ngài đỡ nâng, gìn giữ cho ta bình an.",
        "ko": "모든 짐을 맡기라.",
        "zh": "時刻保護他子民。",
        "en": "He is loyal; he is true.",
        "ja": "大きな愛で"
      },
      {
        "vi": "3. Tìm sự ủi an nơi Giê-hô-va,",
        "ko": "3. 주는 우릴 위로하며",
        "zh": "3．我的安慰來自上帝，",
        "en": "3. Comfort from our God, Jehovah,",
        "ja": "3. エホバは豊かに"
      },
      {
        "vi": "trú náu yên bình dưới bóng Cha.",
        "ko": "마음에 쉼 주시고",
        "zh": "他賜我內心安寧。",
        "en": "Always brings us peace of mind.",
        "ja": "愛情注ぎ"
      },
      {
        "vi": "Vì ngài gánh thay ta hằng muôn khó khăn,",
        "ko": "사랑으로 친절하게",
        "zh": "仁愛天父在我身旁，",
        "en": "He will help us bear our burden.",
        "ja": "与えてくださる"
      },
      {
        "vi": "làm gánh ta vơi nhẹ đi.",
        "ko": "견딜힘을 주시네.",
        "zh": "賜我所需的力量。",
        "en": "He is loving; he is kind.",
        "ja": "心の平和"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Trao bao gánh nặng cho Giê-hô-va,",
        "ko": "여호와가 힘 주시고",
        "zh": "把重擔卸給耶和華，",
        "en": "Throw your burden on Jehovah;",
        "ja": "エホバに重荷を"
      },
      {
        "vi": "Chúa mãi bên cạnh cứu thoát qua nguy nan.",
        "ko": "너를 보호해 주시리니",
        "zh": "他必定會扶持、拯救你。",
        "en": "Trust in him to sustain and save you.",
        "ja": "委ねて歩めば"
      },
      {
        "vi": "Vì hằng tín trung, chân thật,",
        "ko": "항상 그분 신뢰하며",
        "zh": "他是忠貞信實上帝，",
        "en": "He will always give protection.",
        "ja": "支えてくださる"
      },
      {
        "vi": "ngài đỡ nâng, gìn giữ cho ta bình an.",
        "ko": "모든 짐을 맡기라.",
        "zh": "時刻保護他子民。",
        "en": "He is loyal; he is true.",
        "ja": "大きな愛で"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 22:5; 31:1-24).",
      "ko": "(시 22:5; 31:1-24 참조)",
      "zh": "（參看詩22:5；31:1-24）",
      "en": "(See also Ps. 22:5; 31:1-24.)",
      "ja": "（詩 22:5; 31:1-24も参照。）"
    }
  },
  {
    "number": 34,
    "sourceSheet": "34",
    "labels": {
      "vi": "BÀI HÁT 34",
      "ko": "34번",
      "zh": "詩歌第34首",
      "en": "SONG 34",
      "ja": "34番"
    },
    "title": {
      "vi": "Bước theo sự trọn thành",
      "ko": "충절로 걸으리",
      "zh": "行事忠義",
      "en": "Walking in Integrity",
      "ja": "高潔さを捨てずに歩む"
    },
    "scripture": {
      "vi": "(Thi thiên 26)",
      "ko": "(시편 26)",
      "zh": "（詩篇26篇）",
      "en": "(Psalm 26)",
      "ja": "（詩編 26編）"
    },
    "lines": [
      {
        "vi": "1. Tấm lòng con đây trọn thành, trung kiên mãi mãi.",
        "ko": "1. 오 나의 주, 날 판단하소서.",
        "zh": "1．我的上帝，請審察我的心，",
        "en": "1. Please judge me, Lord, observe my loyalty;",
        "ja": "1. エホバよ この私の"
      },
      {
        "vi": "Niềm tin con luôn vững chắc, cầu xin Cha nay xét đoán.",
        "ko": "나의 신뢰심과 충절을 보소서.",
        "zh": "是否對你忠義，對你信念堅定。",
        "en": "Observe my trust in you and my integrity.",
        "ja": "心の奥どうか調べ"
      },
      {
        "vi": "Xin Cha dò xét thấu nơi tâm tư thầm kín,",
        "ko": "날 살피고 날 시험하소서.",
        "zh": "請察驗我，請徹底試驗我，",
        "en": "Examine me, and put me to the test;",
        "ja": "精錬してください"
      },
      {
        "vi": "trí tâm con tinh luyện kỹ, để sao cho con được phước.",
        "ko": "내 정신, 내 마음 정련해 주소서.",
        "zh": "願我心思意念時刻讓你喜悅。",
        "en": "My mind and heart refine, that my soul might be blessed.",
        "ja": "あなたの目にかなうように"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Lòng con vẫn nguyện thành trung quyết không hề lay,",
        "ko": "난 단연코 주의 길 걸으며",
        "zh": "我已決定一生都忠於你，",
        "en": "But as for me, Determined I will be",
        "ja": "私は固く誓う"
      },
      {
        "vi": "đi trong đường Cha mỗi ngày, trung kiên bền vững không thay.",
        "ko": "영원히 충절을 지키겠나이다.",
        "zh": "我會堅定不移，永遠行事忠義！",
        "en": "to walk eternally In my integrity.",
        "ja": "高潔さを捨てず歩む"
      },
      {
        "vi": "2. Quyết chẳng chơi chung cùng bọn gian manh, dối trá.",
        "ko": "2. 악한 자와 함께 앉지 않고",
        "zh": "2．我絕不與說謊的人為友，",
        "en": "2. I do not sit with wicked men of lies.",
        "ja": "2. 真実隠す人や"
      },
      {
        "vi": "Lòng con lâu nay gớm ghét kẻ khinh khi chân lý Chúa.",
        "ko": "진리의 적들을 난 미워하오니,",
        "zh": "藐視真理的人，我不與他同夥。",
        "en": "I hate the company of those who truth despise.",
        "ja": "争う人 友とせずに"
      },
      {
        "vi": "Con xin ngài chớ để con bị diệt cùng chúng,",
        "ko": "여호와여, 악인들 멸할 때",
        "zh": "不要將我與惡人同處決，",
        "en": "Jehovah, please, don't take away my life",
        "ja": "エホバの真理愛し"
      },
      {
        "vi": "chớ cho con rơi vào bẫy của quân gian tham, tàn ác.",
        "ko": "내 생명, 내 영혼 취하지 마소서.",
        "zh": "貪心賄賂的人，你必完全消滅。",
        "en": "With men who take delight in bribery and strife.",
        "ja": "命の道歩んでいく"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Lòng con vẫn nguyện thành trung quyết không hề lay,",
        "ko": "난 단연코 주의 길 걸으며",
        "zh": "我已決定一生都忠於你，",
        "en": "But as for me, Determined I will be",
        "ja": "私は固く誓う"
      },
      {
        "vi": "đi trong đường Cha mỗi ngày, trung kiên bền vững không thay.",
        "ko": "영원히 충절을 지키겠나이다.",
        "zh": "我會堅定不移，永遠行事忠義！",
        "en": "to walk eternally In my integrity.",
        "ja": "高潔さを捨てず歩む"
      },
      {
        "vi": "3. Hỡi Giê-hô-va, nhà ngài con yêu thắm thiết,",
        "ko": "3. 주의 집을 난 사랑하오니",
        "zh": "3．你的殿宇，我一向都喜愛。",
        "en": "3. For I have loved the dwelling of your house.",
        "ja": "3. エホバの家を愛し"
      },
      {
        "vi": "nguyện xin cho con đến đó thờ tôn danh Cha thánh khiết.",
        "ko": "순결한 숭배를 드높이리이다.",
        "zh": "我願全力擁護你的正確崇拜。",
        "en": "Your worship, oh, so pure, I daily will espouse.",
        "ja": "この崇拝 清く保ち"
      },
      {
        "vi": "Con xin được bước đi xung quanh nơi đền thánh,",
        "ko": "주의 제단 둘레를 걸으며",
        "zh": "我必決心繞著祭壇而行，",
        "en": "And I will march around your altar grand,",
        "ja": "あふれる感謝歌い"
      },
      {
        "vi": "hát vang lên cảm tạ Chúa đến tai muôn dân gần xa.",
        "ko": "온 세상 듣도록 감사드리리다.",
        "zh": "向你高聲感謝，讓所有人聽見。",
        "en": "To make thanksgiving heard aloud throughout the land.",
        "ja": "神の栄光 日々たたえる"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Lòng con vẫn nguyện thành trung quyết không hề lay,",
        "ko": "난 단연코 주의 길 걸으며",
        "zh": "我已決定一生都忠於你，",
        "en": "But as for me, Determined I will be",
        "ja": "私は固く誓う"
      },
      {
        "vi": "đi trong đường Cha mỗi ngày, trung kiên bền vững không thay.",
        "ko": "영원히 충절을 지키겠나이다.",
        "zh": "我會堅定不移，永遠行事忠義！",
        "en": "to walk eternally In my integrity.",
        "ja": "高潔さを捨てず歩む"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 25:2).",
      "ko": "(시 25:2 참조)",
      "zh": "（參看詩25:2）",
      "en": "(See also Ps. 25:2.)",
      "ja": "（詩 25:2も参照。）"
    }
  },
  {
    "number": 35,
    "sourceSheet": "35",
    "labels": {
      "vi": "BÀI HÁT 35",
      "ko": "35번",
      "zh": "詩歌第35首",
      "en": "SONG 35",
      "ja": "35番"
    },
    "title": {
      "vi": "\"Nhận biết những điều quan trọng hơn\"",
      "ko": "‘더 중요한 것들을 확인하라'",
      "zh": "看清哪些事更為重要",
      "en": "\"Make Sure of the More Important Things\"",
      "ja": "「より重要なことを見極め」よう"
    },
    "scripture": {
      "vi": "(Phi-líp 1:10)",
      "ko": "(빌립보서 1:10)",
      "zh": "（腓立比書1:10）",
      "en": "(Philippians 1:10)",
      "ja": "（フィリピ 1:10）"
    },
    "lines": [
      {
        "vi": "1. Ngày Cha không xa, nay ta nên sáng suốt",
        "ko": "1. 오늘날 우리 더 중요한 것을",
        "zh": "1．我們必須明辨是非，培養悟性，",
        "en": "1. How great our need today for discernment,",
        "ja": "1. エホバの心に今"
      },
      {
        "vi": "xem điều chi ưu tiên nhất đời ta.",
        "ko": "확인해야 하네.",
        "zh": "這多麼重要。",
        "en": "To know the things that are true,",
        "ja": "快いもの"
      },
      {
        "vi": "Đúng sai nơi đâu nên phân biệt cho rõ,",
        "ko": "참된 것들과 해야 할 일들을",
        "zh": "必須明白有些責任不能推辭，",
        "en": "To know which things have greater importance,",
        "ja": "より重要なことを"
      },
      {
        "vi": "biết công việc nào nên làm trên hết.",
        "ko": "분별해야 하네!",
        "zh": "要分清主次。",
        "en": "To know which things we must do!",
        "ja": "見分ける力"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（コーラス）"
      },
      {
        "vi": "Đường ngay ta bước, lối gian lìa xa",
        "ko": "악한 것을 미워하고",
        "zh": "熱愛正義，憎恨惡事，",
        "en": "Love what is good; Hate what is bad.",
        "ja": "善いこと行い"
      },
      {
        "vi": "khiến Cha mừng vui.",
        "ko": "선 행하여",
        "zh": "行事明智，",
        "en": "Make God's heart glad;",
        "ja": "避けよう"
      },
      {
        "vi": "Phước ân Cha ban đầy dư không sao kể hết",
        "ko": "주의 마음에 기쁨 되리니,",
        "zh": "作決定時運用判斷能力，",
        "en": "Oh, what rich blessings it brings when we learn,",
        "ja": "憎まれること"
      },
      {
        "vi": "nếu ta nhận ra",
        "ko": "우린 항상",
        "zh": "明辨事理，",
        "en": "When we discern,",
        "ja": "そして 味わう"
      },
      {
        "vi": "các công việc ưu tiên và quyết làm theo.",
        "ko": "더 중요한 일들 행하리.",
        "zh": "先做重要的事必受益。",
        "en": "And when we do the important things!",
        "ja": "エホバからの恵み"
      },
      {
        "vi": "2. Việc chi nay ta nên ưu tiên nhất?",
        "ko": "2. 왕국 소식을 전하는 일보다",
        "zh": "2．我們必須努力向所有人傳道，",
        "en": "2. And what could be of greater importance",
        "ja": "2. 何よりも大切な"
      },
      {
        "vi": "Ấy công việc đi rao tin Nước của Cha,",
        "ko": "중요한 일 없네.",
        "zh": "這多麼重要。",
        "en": "Than sharing Kingdom good news,",
        "ja": "王国知らせ"
      },
      {
        "vi": "kiếm ai như chiên mong nghe về chân lý,",
        "ko": "양들을 찾아 주의 길 걷도록",
        "zh": "尋找渴求真理的人，教導他們",
        "en": "To search for those who hunger for truth",
        "ja": "エホバへの愛示す"
      },
      {
        "vi": "giúp cho họ chọn theo đường Cha mãi.",
        "ko": "도와야 한다네.",
        "zh": "行正義之道。",
        "en": "And to help them God's way to choose?",
        "ja": "務め果たして"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（コーラス）"
      },
      {
        "vi": "Đường ngay ta bước, lối gian lìa xa",
        "ko": "악한 것을 미워하고",
        "zh": "熱愛正義，憎恨惡事，",
        "en": "Love what is good; Hate what is bad.",
        "ja": "エホバを知らずに"
      },
      {
        "vi": "khiến Cha mừng vui.",
        "ko": "선 행하여",
        "zh": "行事明智，",
        "en": "Make God's heart glad;",
        "ja": "さまよい"
      },
      {
        "vi": "Phước ân Cha ban đầy dư không sao kể hết",
        "ko": "주의 마음에 기쁨 되리니,",
        "zh": "作決定時運用判斷能力，",
        "en": "Oh, what rich blessings it brings when we learn,",
        "ja": "生きている人見つけ"
      },
      {
        "vi": "nếu ta nhận ra",
        "ko": "우린 항상",
        "zh": "明辨事理，",
        "en": "When we discern,",
        "ja": "導く"
      },
      {
        "vi": "các công việc ưu tiên và quyết làm theo.",
        "ko": "더 중요한 일들 행하리.",
        "zh": "先做重要的事必受益。",
        "en": "And when we do the important things!",
        "ja": "王国の戸口へ"
      },
      {
        "vi": "3. Giờ đây, khôn ngoan chăm lo cho bất cứ",
        "ko": "3. 더 중요한 일 열심히 행하면",
        "zh": "3．如果我們天天完成重要的事，",
        "en": "3. If we take care to do what's important,",
        "ja": "3. 今日もまた善いことを"
      },
      {
        "vi": "công việc chi ưu tiên nhất đời ta.",
        "ko": "참된 만족 있네.",
        "zh": "就快樂充實。",
        "en": "Then true contentment we'll find.",
        "ja": "行う時に"
      },
      {
        "vi": "Chúa luôn bên ta nên trong lòng vui sướng,",
        "ko": "형언치 못할 평화를 누리며",
        "zh": "上帝必定賜下平安守護我們",
        "en": "The peace surpassing all understanding",
        "ja": "爽やかな幸せは"
      },
      {
        "vi": "trí tâm được bình an chở che mãi.",
        "ko": "큰 힘 얻으리라.",
        "zh": "思想和內心。",
        "en": "Will guard our heart and our mind.",
        "ja": "心にあふれ"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（コーラス）"
      },
      {
        "vi": "Đường ngay ta bước, lối gian lìa xa",
        "ko": "악한 것을 미워하고",
        "zh": "熱愛正義，憎恨惡事，",
        "en": "Love what is good; Hate what is bad.",
        "ja": "あなたに守られ"
      },
      {
        "vi": "khiến Cha mừng vui.",
        "ko": "선 행하여",
        "zh": "行事明智，",
        "en": "Make God's heart glad;",
        "ja": "あなたの"
      },
      {
        "vi": "Phước ân Cha ban đầy dư không sao kể hết",
        "ko": "주의 마음에 기쁨 되리니,",
        "zh": "作決定時運用判斷能力，",
        "en": "Oh, what rich blessings it brings when we learn,",
        "ja": "愛を感じる だから"
      },
      {
        "vi": "nếu ta nhận ra",
        "ko": "우린 항상",
        "zh": "明辨事理，",
        "en": "When we discern,",
        "ja": "私は"
      },
      {
        "vi": "các công việc ưu tiên và quyết làm theo.",
        "ko": "더 중요한 일들 행하리.",
        "zh": "先做重要的事必受益。",
        "en": "And when we do the important things!",
        "ja": "今も幸せです"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 97:10; Giăng 21:15-17; Phi-líp 4:7).",
      "ko": "(시 97:10; 요한 21:15-17; 빌립보 4:7 참조)",
      "zh": "（參看詩97:10；約21:15-17；腓4:7）",
      "en": "(See also Ps. 97:10; John 21:15-17; Phil. 4:7.)",
      "ja": "（詩 97:10; ヨハ 21:15-17; フィリ 4:7も参照。）"
    }
  },
  {
    "number": 36,
    "sourceSheet": "36",
    "labels": {
      "vi": "BÀI HÁT 36",
      "ko": "36번",
      "zh": "詩歌第36首",
      "en": "SONG 36",
      "ja": "36番"
    },
    "title": {
      "vi": "Hãy bảo vệ lòng mình",
      "ko": "내 마음을 지키리",
      "zh": "保護我們的心",
      "en": "We Guard Our Hearts",
      "ja": "心を守る"
    },
    "scripture": {
      "vi": "(Châm ngôn 4:23)",
      "ko": "(잠언 4:23)",
      "zh": "（箴言4:23）",
      "en": "(Proverbs 4:23)",
      "ja": "（格言 4:23）"
    },
    "lines": [
      {
        "vi": "1. Mình cần giữ lòng cho thật trọn vẹn,",
        "ko": "1. 내 마음을 잘 지켜서",
        "zh": "1．保護內心，遠避惡行，",
        "en": "1. We guard our hearts, it means our life;",
        "ja": "1. 命守るため"
      },
      {
        "vi": "sự sống vốn từ đó ra.",
        "ko": "생명을 얻으리.",
        "zh": "就能保全生命。",
        "en": "We shun the path of sin.",
        "ja": "心守る"
      },
      {
        "vi": "Giê-hô-va đọc được thấu trong lòng,",
        "ko": "주는 마음속 깊은 곳",
        "zh": "我們一切心思意念",
        "en": "God reads the heart, and there he finds",
        "ja": "エホバの言葉に"
      },
      {
        "vi": "ngài xem sâu thẳm tâm hồn.",
        "ko": "속사람 보시네.",
        "zh": "耶和華都察驗。",
        "en": "The person deep within.",
        "ja": "心映し"
      },
      {
        "vi": "Lòng thường dối gạt đưa mình lầm lạc",
        "ko": "때론 우리의 마음이",
        "zh": "內心可能欺騙思想，",
        "en": "Sometimes the heart deceives the mind,",
        "ja": "正しく心を"
      },
      {
        "vi": "và khiến ta dần xa Chúa.",
        "ko": "자신을 속이니",
        "zh": "讓人偏離方向。",
        "en": "And we begin to stray.",
        "ja": "導くなら"
      },
      {
        "vi": "Mong sao trí khôn luôn canh chừng lòng,",
        "ko": "늘 올바른 생각하여",
        "zh": "要讓思想引導內心，",
        "en": "So may our mind direct our heart",
        "ja": "それることはない"
      },
      {
        "vi": "đường ngài giữ theo không rời.",
        "ko": "내 마음 지키리.",
        "zh": "在正路上前行。",
        "en": "And keep Jehovah's way.",
        "ja": "エホバの道"
      },
      {
        "vi": "2. Lòng cần chuẩn bị khi học về ngài",
        "ko": "2. 내 마음을 준비하여",
        "zh": "2．我們經常衷心禱告，",
        "en": "2. Prepared in heart, we search for God",
        "ja": "2. 心整えて"
      },
      {
        "vi": "bằng cách khẩn cầu thiết tha.",
        "ko": "기도를 드리리.",
        "zh": "熱切尋求上帝。",
        "en": "By means of earnest prayer.",
        "ja": "神に頼り"
      },
      {
        "vi": "Luôn khen ngợi ngài, mình cám ơn ngài",
        "ko": "내 염려 모두 맡기며",
        "zh": "天天感謝讚美天父，",
        "en": "Each day we give him praise and thanks,",
        "ja": "毎日祈って"
      },
      {
        "vi": "và cho Cha biết ưu phiền.",
        "ko": "주 찬양하리라.",
        "zh": "向他傾訴心意。",
        "en": "Revealing ev'ry care.",
        "ja": "感謝示す"
      },
      {
        "vi": "Mình cần phải làm theo Lời ngài dạy",
        "ko": "여호와 주신 교훈에",
        "zh": "上帝所賜一切命令",
        "en": "The things Jehovah teaches us,",
        "ja": "喜んで神に"
      },
      {
        "vi": "và khắc ghi vào tâm trí.",
        "ko": "늘 순종하면서",
        "zh": "我們樂於遵行。",
        "en": "We gladly will obey.",
        "ja": "従うなら"
      },
      {
        "vi": "Ta mong bước đi theo Cha trọn thành,",
        "ko": "충성스런 마음 길러",
        "zh": "努力培養忠貞的心，",
        "en": "We cultivate a loyal heart,",
        "ja": "心に神への"
      },
      {
        "vi": "hằng ngày khiến Cha vui lòng.",
        "ko": "주께 기쁨 되리.",
        "zh": "令耶和華歡喜。",
        "en": "To please him ev'ry day.",
        "ja": "愛が育つ"
      },
      {
        "vi": "3. Lòng mình xét điều chân thật, lành mạnh",
        "ko": "3. 나쁜 생각 멀리하여",
        "zh": "3．排除惡念，保護內心，",
        "en": "3. Our hearts we shield from harmful thoughts,",
        "ja": "3. 真実を愛し"
      },
      {
        "vi": "và tránh ý tưởng xấu xa.",
        "ko": "내 마음 지키리.",
        "zh": "思念真實的事。",
        "en": "We dwell on what is true.",
        "ja": "考えれば"
      },
      {
        "vi": "Ta nên để Lời ngài dẫn đưa lòng",
        "ko": "주 말씀에 감동받아",
        "zh": "上帝話語感動內心，",
        "en": "We love God's Word to touch our hearts,",
        "ja": "心動かされ"
      },
      {
        "vi": "hầu cho đổi mới, thêm mạnh.",
        "ko": "새 힘을 얻으리.",
        "zh": "使人恢復活力。",
        "en": "To strengthen and renew.",
        "ja": "強くされる"
      },
      {
        "vi": "Lòng ngài quý người trung thành cùng ngài,",
        "ko": "충성스러운 사람을",
        "zh": "上帝深愛忠貞的人，",
        "en": "Jehovah loves his loyal ones;",
        "ja": "心から神を"
      },
      {
        "vi": "điều ấy ta thật tin chắc.",
        "ko": "주 사랑하시니",
        "zh": "我們充滿信心。",
        "en": "On this we can depend.",
        "ja": "たたえるなら"
      },
      {
        "vi": "Nên ta quyết tâm theo Cha trọn lòng,",
        "ko": "마음 다해 숭배하여",
        "zh": "全心全意崇拜上帝，",
        "en": "We'll worship him wholeheartedly",
        "ja": "神から愛され"
      },
      {
        "vi": "làm bạn với Cha muôn đời.",
        "ko": "늘 주의 벗 되리.",
        "zh": "永遠與他親近。",
        "en": "Forever as his friend.",
        "ja": "友になれる"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 34:1; Phi-líp 4:8; 1 Phi 3:4).",
      "ko": "(시 34:1; 빌립보 4:8; 베드로 전서 3:4 참조)",
      "zh": "（參看詩34:1；腓4:8；彼前3:4）",
      "en": "(See also Ps. 34:1; Phil. 4:8; 1 Pet. 3:4.)",
      "ja": "（詩 34:1; フィリ 4:8; ペテ一 3:4も参照。）"
    }
  },
  {
    "number": 37,
    "sourceSheet": "37",
    "labels": {
      "vi": "BÀI HÁT 37",
      "ko": "37번",
      "zh": "詩歌第37首",
      "en": "SONG 37",
      "ja": "37番"
    },
    "title": {
      "vi": "Phụng sự Đức Giê-hô-va hết mình",
      "ko": "영혼을 다해 여호와를 섬기리",
      "zh": "全心全意敬奉耶和華",
      "en": "Serving Jehovah Whole-Souled",
      "ja": "自分の全てを尽くしてエホバに仕える"
    },
    "scripture": {
      "vi": "(Ma-thi-ơ 22:37)",
      "ko": "(마태복음 22:37)",
      "zh": "（馬太福音22:37）",
      "en": "(Matthew 22:37)",
      "ja": "（マタイ 22:37）"
    },
    "lines": [
      {
        "vi": "1. Giê-hô-va là đấng thật tối cao,",
        "ko": "1. 주권자인 여호와여,",
        "zh": "1．耶和華至高的上帝，",
        "en": "1. O Jehovah, Sov'reign Ruler,",
        "ja": "1. 日ごとに愛する"
      },
      {
        "vi": "xin vâng theo Chúa, yêu thương ngài không thôi.",
        "ko": "내 모든 정성 받으소서.",
        "zh": "唯有你配受人人崇敬。",
        "en": "You are the one I love and obey.",
        "ja": "主権者エホバ神"
      },
      {
        "vi": "Đời con dâng trọn để thờ kính Cha.",
        "ko": "나의 주인, 내 하느님,",
        "zh": "我願愛戴服從上帝，",
        "en": "You deserve my full devotion;",
        "ja": "専心捧げる"
      },
      {
        "vi": "Con kiên quyết theo ngài mãi không rời xa.",
        "ko": "날마다 주를 섬기리다.",
        "zh": "天天盡心竭力敬奉你。",
        "en": "You are my God; I'll serve you each day.",
        "ja": "私のよりどころ"
      },
      {
        "vi": "Con hằng mến chuộng luật Cha đã phán ra,",
        "ko": "주의 명령 충성스럽게",
        "zh": "我多麼喜愛你的話語，",
        "en": "Your commands I loyally follow;",
        "ja": "変わらぬ愛により"
      },
      {
        "vi": "trung thành giữ gìn những chi Cha khuyên.",
        "ko": "모두 지켜 행하리다.",
        "zh": "忠心服從你的指引。",
        "en": "How I love reminders from you!",
        "ja": "おきてに従い"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Giờ đây con nguyện hết mình tôn vinh",
        "ko": "사랑하는 여호와여,",
        "zh": "耶和華你配受崇敬，",
        "en": "O Jehovah, you are worthy;",
        "ja": "自分の全てを"
      },
      {
        "vi": "Cha Giê-hô-va, là đấng cao trọng thay.",
        "ko": "영혼을 다해 섬기리다.",
        "zh": "我願全心全意愛戴你。",
        "en": "Whole-souled devotion I give to you.",
        "ja": "尽くして仕えます"
      },
      {
        "vi": "2. Vật muôn nơi, trời, đất cùng ánh sao",
        "ko": "2. 저 광활한 땅과 하늘",
        "zh": "2．天父你的作為奇妙，",
        "en": "2. Father, all your works exalt you.",
        "ja": "2. 作品全てが"
      },
      {
        "vi": "rao ra vinh hiển, ca khen quyền năng Cha.",
        "ko": "주의 영광을 드높이니",
        "zh": "日月星辰彰顯你榮耀。",
        "en": "Earth, moon, and stars your glory proclaim.",
        "ja": "あなたを賛美する"
      },
      {
        "vi": "Lòng mong sao thành tín, truyền thánh danh",
        "ko": "나도 함께 힘을 다해",
        "zh": "我也樂意保持忠信，",
        "en": "May I also be as faithful,",
        "ja": "星たちのように"
      },
      {
        "vi": "Cha ra khắp nơi bằng hết sức lực con.",
        "ko": "주의 이름을 알리리다.",
        "zh": "全力讚頌你偉大聖名。",
        "en": "Using my strength to make known your name.",
        "ja": "栄光映したい"
      },
      {
        "vi": "Con nguyện suốt đời đi theo Chúa mãi thôi,",
        "ko": "내가 살아 숨을 쉬는 한",
        "zh": "我願獻出一生崇拜你，",
        "en": "May I use my whole life to serve you,",
        "ja": "変わらぬ愛により"
      },
      {
        "vi": "luôn làm hết lòng, tín trung không lay.",
        "ko": "충성 다해 섬기리다.",
        "zh": "信守誓言、忠貞不渝。",
        "en": "Proving to be loyal and true.",
        "ja": "教えに従い"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Giờ đây con nguyện hết mình tôn vinh",
        "ko": "사랑하는 여호와여,",
        "zh": "耶和華你配受崇敬，",
        "en": "O Jehovah, you are worthy;",
        "ja": "自分の全てを"
      },
      {
        "vi": "Cha Giê-hô-va, là đấng cao trọng thay.",
        "ko": "영혼을 다해 섬기리다.",
        "zh": "我願全心全意愛戴你。",
        "en": "Whole-souled devotion I give to you.",
        "ja": "尽くして仕えます"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Phục 6:15; Thi 40:8; 113:1-3; Truyền 5:4; Giăng 4:34).",
      "ko": "(신명 6:15; 시 40:8; 113:1-3; 전도 5:4; 요한 4:34 참조)",
      "zh": "（參看申6:15；詩40:8；113:1-3；傳5:4；約4:34）",
      "en": "(See also Deut. 6:15; Ps. 40:8; 113:1-3; Eccl. 5:4; John 4:34.)",
      "ja": "（申 6:15; 詩 40:8; 113:1-3; 伝 5:4; ヨハ 4:34も参照。）"
    }
  },
  {
    "number": 38,
    "sourceSheet": "38",
    "labels": {
      "vi": "BÀI HÁT 38",
      "ko": "38번",
      "zh": "詩歌第38首",
      "en": "SONG 38",
      "ja": "38番"
    },
    "title": {
      "vi": "Ngài sẽ làm chúng ta mạnh mẽ",
      "ko": "그분이 강하게 해 주시리",
      "zh": "他必使你堅定剛強",
      "en": "He Will Make You Strong",
      "ja": "神はあなたを強い人にしてくださる"
    },
    "scripture": {
      "vi": "(1 Phi-e-rơ 5:10)",
      "ko": "(베드로 전서 5:10)",
      "zh": "（彼得前書5:10）",
      "en": "(1 Peter 5:10)",
      "ja": "（ペテロ第一 5:10）"
    },
    "lines": [
      {
        "vi": "1. Giê-hô-va cho ta biết điều đúng trong bao lời Cha,",
        "ko": "1. 주 하느님 찾고 올바로 살려는",
        "zh": "1．上帝樂意讓你認識他的話語，",
        "en": "1. There was a reason why God brought the truth to you",
        "ja": "1. あなたは世の闇の中で"
      },
      {
        "vi": "từ đêm tối Chúa gọi ra ánh sáng tự do.",
        "ko": "내 마음속을 보신 여호와,",
        "zh": "帶你走出黑暗迎接光明。",
        "en": "And called you from the darkness to the light.",
        "ja": "真理を求めていた"
      },
      {
        "vi": "Vì Cha từ trên xem thấy điều ước ao trong lòng ta,",
        "ko": "어둠 속 헤매던 나를 이끄시어",
        "zh": "他看出你內心熱切渴慕真理，",
        "en": "Within your heart, he saw the longing that you had",
        "ja": "エホバはその願いかなえ"
      },
      {
        "vi": "khát khao tìm ngài, chỉ mong làm điều công chính.",
        "ko": "이 진리의 빛 보게 하셨네.",
        "zh": "一心尋求他又喜愛正義。",
        "en": "To search for him and practice what is right.",
        "ja": "あなたを導かれた"
      },
      {
        "vi": "Mình đã dâng thân mình xin làm theo ý Chúa;",
        "ko": "주의 뜻 행할 힘 주셨으며",
        "zh": "你禱告說要遵從他旨意，",
        "en": "You promised him in prayer to do his will;",
        "ja": "真の光の中へ"
      },
      {
        "vi": "Chúa đã bên ta thì nay ngài không thay đổi.",
        "ko": "늘 변함없이 도와주시리.",
        "zh": "他必幫助你，永不會離棄。",
        "en": "He helped you then, and he will help you still.",
        "ja": "引き寄せてくださった"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Do Cha chuộc ta qua Con một,",
        "ko": "예수 피로 산 우리,",
        "zh": "他通過基督寶血，",
        "en": "With Jesus' blood He bought you,",
        "ja": "あなたの命"
      },
      {
        "vi": "ta thuộc về duy nhất Cha.",
        "ko": "하느님 소유니",
        "zh": "救贖你的生命，",
        "en": "to God you now belong.",
        "ja": "その心も"
      },
      {
        "vi": "Vì thế Cha ban lực ta",
        "ko": "그분이 힘 주고",
        "zh": "他必賜你力量，",
        "en": "So he will make you firm,",
        "ja": "エホバのもの"
      },
      {
        "vi": "mạnh mẽ không sao chuyển lay.",
        "ko": "강하게 하시리.",
        "zh": "使你堅定剛強。",
        "en": "and he will make you strong.",
        "ja": "永遠まで"
      },
      {
        "vi": "Cha soi đường ta nên không cần sợ",
        "ko": "늘 보호하며 이끌어",
        "zh": "他必定指引保護，",
        "en": "He'll guide you and protect you,",
        "ja": "神はあなたを"
      },
      {
        "vi": "dầu khốn khó, nguy nan.",
        "ko": "주신 여호와,",
        "zh": "愛你一如既往。",
        "en": "as he has all along.",
        "ja": "いつも守り"
      },
      {
        "vi": "Mạnh mẽ ta do nơi Cha,",
        "ko": "그분이 힘 주고",
        "zh": "他必賜你力量，",
        "en": "Yes, he will make you firm,",
        "ja": "強い人に"
      },
      {
        "vi": "bền vững ta do nơi Cha.",
        "ko": "강하게 하시리.",
        "zh": "使你堅定剛強。",
        "en": "and he will make you strong.",
        "ja": "してくださる"
      },
      {
        "vi": "2. Ngài ban người Con yêu dấu chịu chết cho ta tự do,",
        "ko": "2. 사랑하는 아들 주신 하느님은",
        "zh": "2．上帝為你犧牲他深愛的兒子，",
        "en": "2. God gave his own beloved Son in your behalf;",
        "ja": "2. 愛する子のイエスさえも"
      },
      {
        "vi": "vậy nên Chúa muốn nhìn tôi tớ Chúa thành công.",
        "ko": "나 올바로 살기 바라시네.",
        "zh": "他多麼希望你一生成功。",
        "en": "On this account, He wants you to succeed.",
        "ja": "与えたエホバ神は"
      },
      {
        "vi": "Vì Cha từng ban Con quý, chẳng lẽ ta nghi ngờ Cha",
        "ko": "아낌없이 아들 내어 주셨으니",
        "zh": "他既樂意為你付出高昂代價，",
        "en": "If He did not withhold the gift of His dear Son,",
        "ja": "どんな時もあなたのこと"
      },
      {
        "vi": "sẽ không trợ lực, giúp ta vượt mọi gian khó.",
        "ko": "필요한 힘도 분명 주시리.",
        "zh": "必定慷慨賜你所需力量。",
        "en": "Then never doubt He'll give the strength you need.",
        "ja": "優しく気遣われる"
      },
      {
        "vi": "Ngài chắc không quên lòng tin, tình yêu ta có,",
        "ko": "우리의 사랑 기억하시고",
        "zh": "你顯信心、愛心他永不忘，",
        "en": "He won't forget the faith and love you've shown;",
        "ja": "神のために示した"
      },
      {
        "vi": "vẫn mãi chăm lo bầy chiên mà Cha yêu mến.",
        "ko": "우리 반드시 돌봐 주시리.",
        "zh": "他會時刻陪伴在你身旁。",
        "en": "He will not fail to care for all His own.",
        "ja": "あなたの愛忘れず"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Do Cha chuộc ta qua Con một,",
        "ko": "예수 피로 산 우리,",
        "zh": "他通過基督寶血，",
        "en": "With Jesus' blood He bought you,",
        "ja": "あなたの命"
      },
      {
        "vi": "ta thuộc về duy nhất Cha.",
        "ko": "하느님 소유니",
        "zh": "救贖你的生命，",
        "en": "to God you now belong.",
        "ja": "その心も"
      },
      {
        "vi": "Vì thế Cha ban lực ta",
        "ko": "그분이 힘 주고",
        "zh": "他必賜你力量，",
        "en": "So he will make you firm,",
        "ja": "エホバのもの"
      },
      {
        "vi": "mạnh mẽ không sao chuyển lay.",
        "ko": "강하게 하시리.",
        "zh": "使你堅定剛強。",
        "en": "and he will make you strong.",
        "ja": "永遠まで"
      },
      {
        "vi": "Cha soi đường ta nên không cần sợ",
        "ko": "늘 보호하며 이끌어",
        "zh": "他必定指引保護，",
        "en": "He'll guide you and protect you,",
        "ja": "神はあなたを"
      },
      {
        "vi": "dầu khốn khó, nguy nan.",
        "ko": "주신 여호와,",
        "zh": "愛你一如既往。",
        "en": "as he has all along.",
        "ja": "いつも守り"
      },
      {
        "vi": "Mạnh mẽ ta do nơi Cha,",
        "ko": "그분이 힘 주고",
        "zh": "他必賜你力量，",
        "en": "Yes, he will make you firm,",
        "ja": "強い人に"
      },
      {
        "vi": "bền vững ta do nơi Cha.",
        "ko": "강하게 하시리.",
        "zh": "使你堅定剛強。",
        "en": "and he will make you strong.",
        "ja": "してくださる"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Rô 8:32; 14:8, 9; Hê 6:10; 1 Phi 2:9).",
      "ko": "(로마 8:32; 14:8, 9; 히브리 6:10; 베드로 전서 2:9 참조)",
      "zh": "（參看羅8:32；14:8,9；來6:10；彼前2:9）",
      "en": "(See also Rom. 8:32; 14:8, 9; Heb. 6:10; 1 Pet. 2:9.)",
      "ja": "（ロマ 8:32; 14:8，9; ヘブ 6:10; ペテ一 2:9も参照。）"
    }
  },
  {
    "number": 39,
    "sourceSheet": "39",
    "labels": {
      "vi": "BÀI HÁT 39",
      "ko": "39번",
      "zh": "詩歌第39首",
      "en": "SONG 39",
      "ja": "39番"
    },
    "title": {
      "vi": "Tạo danh tiếng tốt trước mắt Chúa",
      "ko": "하느님 앞에서 좋은 이름을 얻으라",
      "zh": "在上帝面前建立美名",
      "en": "Make a Good Name With God",
      "ja": "神の前で良い名を得る"
    },
    "scripture": {
      "vi": "(Truyền đạo 7:1)",
      "ko": "(전도서 7:1)",
      "zh": "（傳道書7:1）",
      "en": "(Ecclesiastes 7:1)",
      "ja": "（伝道 7:1）"
    },
    "lines": [
      {
        "vi": "1. Suốt trong đời mình sống, ta muốn sao cho mỗi ngày",
        "ko": "1. 나 사는 동안 좋은 이름 위해",
        "zh": "1．但願每一天，都能善用生命，",
        "en": "1. Throughout our lifetime, We want to use each day",
        "ja": "1. 温かな神の前で"
      },
      {
        "vi": "bước theo điều luật Cha, danh tốt ta luôn gây dựng.",
        "ko": "주의 법 모두 매일 지키리라.",
        "zh": "建立好名聲，衷心服從上帝。",
        "en": "To make a good name And all God's laws obey.",
        "ja": "良い名得る 力尽くし"
      },
      {
        "vi": "Gắng công vâng theo ý ngài, quyết tâm làm điều chính trực,",
        "ko": "여호와의 눈에 옳은 일 행하여",
        "zh": "我們竭盡全力，謹守他的命令，",
        "en": "If in Jehovah's sight We strive to do what's right,",
        "ja": "神の教え 心に留め"
      },
      {
        "vi": "Chúa Giê-hô-va sẽ cảm thấy vui lòng.",
        "ko": "마음 기쁘게 해 드리리.",
        "zh": "耶和華必定滿心歡喜。",
        "en": "Then we will please him, To his delight.",
        "ja": "当てはめる 日ごとに"
      },
      {
        "vi": "2. Thế gian giăng cạm bẫy mong chúng ta đi sai đường,",
        "ko": "2. 이 세상에서 이름을 떨치고",
        "zh": "2．不仿效世人名譽地位至上，",
        "en": "2. This world may cause us To try to make a name,",
        "ja": "2. 世の中の栄光には"
      },
      {
        "vi": "kiếm ngôi vị, hào quang, danh tiếng cao xa hơn người.",
        "ko": "칭송받는 것 정녕 헛되다네.",
        "zh": "刻意迎合人，只求別人讚賞。",
        "en": "To seek its favor, To bask in its acclaim.",
        "ja": "空しさが伴うだけ"
      },
      {
        "vi": "Đó luôn là điều hão huyền. Nếu ta làm bạn với đời,",
        "ko": "이 세상 벗 되어 인정을 받으면",
        "zh": "若與世界為友，令耶和華傷心，",
        "en": "But that is vanity, For if its friend we'll be,",
        "ja": "世の友にはならないよう"
      },
      {
        "vi": "Chúa Giê-hô-va sẽ chẳng xuống ân huệ.",
        "ko": "여호와 은혜 잃게 되리.",
        "zh": "失去他友誼，只剩空虛。",
        "en": "Jehovah's favor, We will not see.",
        "ja": "神見つめ生きよう"
      },
      {
        "vi": "3. Chúng ta mong được giữ trong trí Cha Giê-hô-va,",
        "ko": "3. 생명책 속에, 주의 기억 속에",
        "zh": "3．但願耶和華紀念我們的名，",
        "en": "3. In God's remembrance, We want our name to be",
        "ja": "3. 私の名 記憶される"
      },
      {
        "vi": "muốn gây dựng một danh qua tháng năm không phai mờ.",
        "ko": "우리 이름이 영원히 남기를.",
        "zh": "我們要努力贏得上帝嘉許。",
        "en": "And have a good name For all eternity.",
        "ja": "いつまでもエホバ神に"
      },
      {
        "vi": "Chúng ta tin Giê-hô-va, muốn bênh vực Lời của ngài,",
        "ko": "주를 의지하고 진리 옹호하여",
        "zh": "時刻信賴上帝，決心捍衛真理，",
        "en": "On him we can depend, So we his truth defend",
        "ja": "神に頼り奉仕続け"
      },
      {
        "vi": "ước ao luôn gìn giữ danh tốt muôn đời.",
        "ko": "좋은 이름을 꼭 지키리.",
        "zh": "留下好名聲，忠貞不渝。",
        "en": "And keep our good name Down to the end.",
        "ja": "この良い名 保とう"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Sáng 11:4; Châm 22:1; Mal 3:16; Khải 20:15).",
      "ko": "(창세 11:4; 잠언 22:1; 말라기 3:16; 계시록 20:15 참조)",
      "zh": "（參看創11:4；箴22:1；瑪3:16；啟20:15）",
      "en": "(See also Gen. 11:4; Prov. 22:1; Mal. 3:16; Rev. 20:15.)",
      "ja": "（創 11:4; 格 22:1; マラ 3:16; 啓 20:15も参照。）"
    }
  },
  {
    "number": 40,
    "sourceSheet": "40",
    "labels": {
      "vi": "BÀI HÁT 40",
      "ko": "40번",
      "zh": "詩歌第40首",
      "en": "SONG 40",
      "ja": "40番"
    },
    "title": {
      "vi": "Chúng ta thuộc về ai?",
      "ko": "우리는 누구에게 속해 있는가?",
      "zh": "誰是你的上帝？",
      "en": "To Whom Do We Belong?",
      "ja": "私たちは誰のものだろう"
    },
    "scripture": {
      "vi": "(Rô-ma 14:8)",
      "ko": "(로마서 14:8)",
      "zh": "（羅馬書14:8）",
      "en": "(Romans 14:8)",
      "ja": "（ローマ 14:8）"
    },
    "lines": [
      {
        "vi": "1. Giờ ai ta đang thờ kính?",
        "ko": "1. 넌 누구 섬기냐?",
        "zh": "1．誰是你的上帝？",
        "en": "1. To whom do you belong?",
        "ja": "1. 誰に仕え"
      },
      {
        "vi": "Và đấng ta cậy trông là ai?",
        "ko": "어느 편에 속하냐?",
        "zh": "你聽從誰的命令？",
        "en": "Which god do you now obey?",
        "ja": "崇拝するか"
      },
      {
        "vi": "Vì ai ta yêu mến, thờ tôn trên hết,",
        "ko": "너 절하면 그의 종 되니,",
        "zh": "你現在向誰下拜屈膝，",
        "en": "Your master's the one to whom you bow.",
        "ja": "今までのあなたは"
      },
      {
        "vi": "chính ta xem người là chúa của mình.",
        "ko": "그 신을 섬기겠느냐?",
        "zh": "他就成為你的上帝。",
        "en": "He is your god; you serve him now.",
        "ja": "誰のものだろう"
      },
      {
        "vi": "Lòng ta không thể sùng kính,",
        "ko": "마음을 나누어",
        "zh": "你只可以專一，",
        "en": "You cannot serve two gods;",
        "ja": "2人の主に"
      },
      {
        "vi": "cùng lúc đi thờ tôn hai thần.",
        "ko": "두 신에게 못 주니,",
        "zh": "崇拜敬奉一個神。",
        "en": "Devotion cannot be shared.",
        "ja": "仕えられない"
      },
      {
        "vi": "Vậy nay ta tôn kính, chọn theo ai trong đời",
        "ko": "네 마음을 내준 그 신에게",
        "zh": "你的抉擇顯示你的內心",
        "en": "And so in the end your choice will depend",
        "ja": "心の向きは示す"
      },
      {
        "vi": "bởi do tự lòng ta dẫn đưa.",
        "ko": "네 정성 주게 되리.",
        "zh": "究竟服從哪個神。",
        "en": "On how your heart is prepared.",
        "ja": "自分の神を"
      },
      {
        "vi": "2. Giờ ai ta sẽ thờ kính?",
        "ko": "2. 넌 누구 섬기냐?",
        "zh": "2．誰是你的上帝？",
        "en": "2. To whom do you belong?",
        "ja": "2. 誰に仕え"
      },
      {
        "vi": "Và đấng ta cậy trông là ai?",
        "ko": "어느 편에 속하냐?",
        "zh": "你聽從誰的命令？",
        "en": "Which god will you now obey?",
        "ja": "何を選ぶか"
      },
      {
        "vi": "Một bên luôn trung tín, một bên gian dối,",
        "ko": "거짓 신과 참신 있으니",
        "zh": "誰是真神假神要分清，",
        "en": "For one god is false and one is true,",
        "ja": "これからのあなたは"
      },
      {
        "vi": "muốn theo bên nào là chính ta chọn.",
        "ko": "너 섬길 신을 택하라.",
        "zh": "必須作明智的決定。",
        "en": "So make your choice; it's up to you.",
        "ja": "誰のものだろう"
      },
      {
        "vi": "Giờ đây ta phải tự quyết:",
        "ko": "네 충성 아직도",
        "zh": "你會選擇擁護",
        "en": "Will Caesar of this world",
        "ja": "真の神か"
      },
      {
        "vi": "Chọn thế gian cùng bao nhiêu thần?",
        "ko": "카이사르 것이냐?",
        "zh": "這世上的統治者，",
        "en": "Possess your allegiance still?",
        "ja": "偽りの神"
      },
      {
        "vi": "Hoặc ta theo Cha mãi, thành trung luôn trong đời,",
        "ko": "참하느님에게 순종하여",
        "zh": "還是決心忠於獨一真神，",
        "en": "Or will you obey the true God today",
        "ja": "2つの道しかない"
      },
      {
        "vi": "sướng vui thi hành theo ý Cha?",
        "ko": "그 뜻을 행하겠냐?",
        "zh": "天天遵行他旨意？",
        "en": "By always doing his will?",
        "ja": "見渡す限り"
      },
      {
        "vi": "3. Vậy ai tôi sẽ thờ kính?",
        "ko": "3. 난 마음 다하여",
        "zh": "3．誰是我的上帝？",
        "en": "3. To whom do I belong?",
        "ja": "3. 誰に仕え"
      },
      {
        "vi": "Lòng quyết vâng lời Giê-hô-va.",
        "ko": "여호와를 섬기리.",
        "zh": "我會服從耶和華。",
        "en": "Jehovah I will obey.",
        "ja": "何を誓うか"
      },
      {
        "vi": "Thật tâm tôi vui thích thờ Cha duy nhất,",
        "ko": "하늘의 아버지 섬기며",
        "zh": "決心履行獻身的承諾，",
        "en": "My Father in heaven I will serve;",
        "ja": "献身した私"
      },
      {
        "vi": "gắng sao chu toàn lời hứa với ngài.",
        "ko": "내 서원 모두 갚으리.",
        "zh": "全心全意崇拜天父。",
        "en": "I'll pay my vows without reserve.",
        "ja": "誰のものだろう"
      },
      {
        "vi": "Ngài ban Con xuống chịu chết,",
        "ko": "큰 희생 치르며",
        "zh": "上帝付出重價",
        "en": "He bought me at great cost;",
        "ja": "犠牲により"
      },
      {
        "vi": "một giá cao chuộc tôi muôn đời.",
        "ko": "나를 사신 하느님,",
        "zh": "讓人擺脫罪捆綁，",
        "en": "Devoted to him I'll stay.",
        "ja": "買われた命"
      },
      {
        "vi": "Đời tôi dâng lên Chúa, từng giây tôn vinh ngài,",
        "ko": "내가 살아 있는 모든 순간",
        "zh": "我願獻出一生為他服務，",
        "en": "To him I will give each moment I live.",
        "ja": "エホバのために生きる"
      },
      {
        "vi": "hát khen, ca ngợi danh thánh Cha.",
        "ko": "여호와 높이리라.",
        "zh": "稱頌偉大的天父。",
        "en": "His name I'll honor each day.",
        "ja": "1秒ごとに"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Giô-suê 24:15; Thi 116:14, 18; 2 Ti 2:19).",
      "ko": "(여호수아 24:15; 시 116:14, 18; 디모데 후서 2:19 참조)",
      "zh": "（參看書24:15；詩116:14,18；提後2:19）",
      "en": "(See also Josh. 24:15; Ps. 116:14, 18; 2 Tim. 2:19.)",
      "ja": "（ヨシュ 24:15; 詩 116:14，18; テモ二 2:19も参照。）"
    }
  },
  {
    "number": 41,
    "sourceSheet": "41",
    "labels": {
      "vi": "BÀI HÁT 41",
      "ko": "41번",
      "zh": "詩歌第41首",
      "en": "SONG 41",
      "ja": "41番"
    },
    "title": {
      "vi": "Xin nghe lời cầu nguyện của con",
      "ko": "내 기도를 들어 주소서",
      "zh": "求你垂聽我禱告",
      "en": "Please Hear My Prayer",
      "ja": "どうか私の祈りを聞いてください"
    },
    "scripture": {
      "vi": "(Thi thiên 54)",
      "ko": "(시편 54)",
      "zh": "（詩篇54篇）",
      "en": "(Psalm 54)",
      "ja": "（詩編 54編）"
    },
    "lines": [
      {
        "vi": "1. Xin Giê-hô-va lắng nghe con ngợi khen.",
        "ko": "1. 내 아버지, 오 내 하느님,",
        "zh": "1．慈愛天父，懇求你細聽。",
        "en": "1. Heavenly Father, please hear my song.",
        "ja": "1. 私の神エホバ"
      },
      {
        "vi": "Cha cao quý là đấng con hằng kính thờ.",
        "ko": "나의 주는 당신입니다.",
        "zh": "我的上帝，我只屬於你。",
        "en": "You are my God; to you I belong.",
        "ja": "あなたに歌います"
      },
      {
        "vi": "Thật không chi sánh cho bằng danh cao cả.",
        "ko": "누구보다 위대하시니",
        "zh": "你的聖名偉大又崇高。",
        "en": "Great is your name, beyond all compare.",
        "ja": "あなたへの賛美を"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Xin nghe con khấn nguyện, hỡi Cha nhân từ.",
        "ko": "들어 주소서, 내 기도를.",
        "zh": "但願你垂聽我的禱告。",
        "en": "Gracious Jehovah, please hear my prayer.",
        "ja": "どうか聞いてください"
      },
      {
        "vi": "2. Con xin cảm tạ Chúa cho con ngày nay,",
        "ko": "2. 오늘 생명 허락하시고",
        "zh": "2．慈愛天父，多麼感謝你，",
        "en": "2. Thank you, O God, for granting this day,",
        "ja": "2. あなたの親切と"
      },
      {
        "vi": "cho con sống và dẫn đưa con suốt đời.",
        "ko": "돌보시니 감사합니다.",
        "zh": "賜予生命和寶貴指引。",
        "en": "Giving me life, and showing the way.",
        "ja": "気遣い数えます"
      },
      {
        "vi": "Được Cha chăm sóc, con mừng vui khôn xiết.",
        "ko": "주의 인도 기뻐하오니",
        "zh": "受你關愛，生命多美好。",
        "en": "How I delight in your tender care.",
        "ja": "あなたへの感謝を"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Xin nghe con khấn nguyện, hỡi Cha nhân từ.",
        "ko": "들어 주소서, 내 기도를.",
        "zh": "但願你垂聽我的禱告。",
        "en": "Gracious Jehovah, please hear my prayer.",
        "ja": "どうか聞いてください"
      },
      {
        "vi": "3. Con ao ước làm đúng theo như Lời Cha.",
        "ko": "3. 옳은 일을 늘 열망하니",
        "zh": "3．你的話語我渴望謹守，",
        "en": "3. Oh, how I long to do what is right!",
        "ja": "3. 力と励ましを"
      },
      {
        "vi": "Xin Cha giúp để bước đi trong lối ngài.",
        "ko": "빛 안에서 걷게 하소서.",
        "zh": "請幫助我在光中行走。",
        "en": "Help me, O Lord, to walk in the light.",
        "ja": "信じて歩みます"
      },
      {
        "vi": "Cầu Cha ban sức con vượt qua gian khó.",
        "ko": "짐 감당할 힘을 주시고",
        "zh": "賜我力量能忍受煎熬。",
        "en": "Give me the strength all burdens to bear.",
        "ja": "あなたへの祈りを"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Xin nghe con khấn nguyện, hỡi Cha nhân từ.",
        "ko": "들어 주소서, 내 기도를.",
        "zh": "但願你垂聽我的禱告。",
        "en": "Gracious Jehovah, please hear my prayer.",
        "ja": "どうか聞いてください"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Xuất 22:27; Thi 106:4; Gia 5:11).",
      "ko": "(출애굽 22:27; 시 106:4; 야고보 5:11 참조)",
      "zh": "（參看出22:27；詩106:4；雅5:11）",
      "en": "(See also Ex. 22:27; Ps. 106:4; Jas. 5:11.)",
      "ja": "（出 22:27; 詩 106:4; ヤコ 5:11も参照。）"
    }
  },
  {
    "number": 42,
    "sourceSheet": "42",
    "labels": {
      "vi": "BÀI HÁT 42",
      "ko": "42번",
      "zh": "詩歌第42首",
      "en": "SONG 42",
      "ja": "42番"
    },
    "title": {
      "vi": "Lời cầu nguyện của tôi tớ Đức Chúa Trời",
      "ko": "하느님의 종의 기도",
      "zh": "上帝僕人的禱告",
      "en": "The Prayer of God's Servant",
      "ja": "私たちの祈願"
    },
    "scripture": {
      "vi": "(Ê-phê-sô 6:18)",
      "ko": "(에베소서 6:18)",
      "zh": "（以弗所書6:18）",
      "en": "(Ephesians 6:18)",
      "ja": "（エフェソス 6:18）"
    },
    "lines": [
      {
        "vi": "1. Ôi Giê-hô-va, là Vua oai nghi, tối cao,",
        "ko": "1. 우리 하느님, 우리 아버지,",
        "zh": "1．偉大上帝，全能的耶和華，",
        "en": "1. Almighty God, Jehovah, our Father,",
        "ja": "1. エホバよ 偉大な神"
      },
      {
        "vi": "nay con khấn nguyện rằng danh Cha muôn năm hiển vinh.",
        "ko": "당신의 이름 거룩게 하소서.",
        "zh": "願你聖名受到所有人尊崇。",
        "en": "May your great name be sanctified and honored.",
        "ja": "祈りを聞いてください"
      },
      {
        "vi": "Mong sao đời đời ý Cha luôn hoàn thành.",
        "ko": "아버지 뜻 다 이루시고",
        "zh": "你必實現自己的承諾，",
        "en": "All that you wish you cause to become.",
        "ja": "お名前 尊ばれ"
      },
      {
        "vi": "Xin Nước Cha cai trị trên đất như trên trời.",
        "ko": "당신의 왕국 오게 하소서.",
        "zh": "我們滿懷信心向你祈求。",
        "en": "Great God, in faith we pray for your Kingdom.",
        "ja": "王国が来ますように"
      },
      {
        "vi": "Nguyện cầu Cha ban bao ân phước,",
        "ko": "약속하신 그 축복",
        "zh": "願你的王國來臨，",
        "en": "May it come when you decree,",
        "ja": "その祝福を"
      },
      {
        "vi": "khắp muôn nơi an vui, thanh bình.",
        "ko": "속히 이뤄 주소서.",
        "zh": "帶來幸福的生活。",
        "en": "And its blessings may we see.",
        "ja": "見せてください"
      },
      {
        "vi": "2. Con xin cảm tạ vì Cha ban muôn phước ân;",
        "ko": "2. 우리 하느님, 감사합니다,",
        "zh": "2．感謝上帝慷慨賜下福分，",
        "en": "2. Thank you, dear God, for each daily blessing,",
        "ja": "2. エホバよ 愛ある神"
      },
      {
        "vi": "bao nhiêu món quà ngài ban cho ôi vô giá thay!",
        "ko": "한없이 좋은 선물을 주시니.",
        "zh": "我們享有數之不盡的厚恩。",
        "en": "Gifts from your hand—good things beyond assessing.",
        "ja": "感謝を聞いてください"
      },
      {
        "vi": "Do Cha là nguồn sáng khôn không đổi dời",
        "ko": "귀중한 생명 주셨으며",
        "zh": "你賜我們生命和真理，",
        "en": "Source of all life, Provider of light,",
        "ja": "命と日の光"
      },
      {
        "vi": "nên chúng con nay được thông biết, khôn ngoan thật.",
        "ko": "놀라운 지식, 지혜 주시니,",
        "zh": "給我們智慧能洞悉事理。",
        "en": "You give us knowledge, wisdom, and insight.",
        "ja": "今日もまた下さった"
      },
      {
        "vi": "Lòng tạ ơn Giê-hô-va mãi,",
        "ko": "사랑 넘친 그 은혜",
        "zh": "仁愛天父，感謝你，",
        "en": "May we thank you ev'ry day",
        "ja": "あなたのために"
      },
      {
        "vi": "hát khen Cha yêu thương vô bờ.",
        "ko": "매일 찬양합니다.",
        "zh": "願天天都讚美你。",
        "en": "As we praise your loving way.",
        "ja": "生きられるよう"
      },
      {
        "vi": "3. Gian nan, khốn cùng bủa vây khi trong thế gian",
        "ko": "3. 눈물 가득한 이 세상에서",
        "zh": "3．每天生活難免經歷患難，",
        "en": "3. While in this world, we have tribulation.",
        "ja": "3. エホバよ 希望の神"
      },
      {
        "vi": "nên con khẩn cầu, cậy trông Cha quan tâm, ủi an.",
        "ko": "따뜻한 위로 주시는 아버지,",
        "zh": "我們向你尋求安慰和希望。",
        "en": "We look to you for hope and consolation.",
        "ja": "悩みを聞いてください"
      },
      {
        "vi": "Bao nhiêu nhọc nhằn gánh trên vai hàng ngày",
        "ko": "무거운 짐을 맡기오니",
        "zh": "願將重擔全都卸給你，",
        "en": "Father, we throw our burden on you.",
        "ja": "孤独でつらい時"
      },
      {
        "vi": "xin trút cho Cha hầu Cha giúp con thêm mạnh.",
        "ko": "다시 일어날 힘을 주소서.",
        "zh": "請幫助我們遵行你旨意。",
        "en": "Give us the will and strength to continue.",
        "ja": "慰めと知恵と保護"
      },
      {
        "vi": "Nguyện đời con dâng cho Cha mãi;",
        "ko": "주의 뜻 행하도록",
        "zh": "助我們立定心願，",
        "en": "Help us, please, to do your will,",
        "ja": "意欲と力"
      },
      {
        "vi": "ý Cha ban, con luôn thi hành.",
        "ko": "우릴 도와주소서.",
        "zh": "謹守獻身的誓言。",
        "en": "And our vows to you fulfill.",
        "ja": "どうか下さい"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 36:9; 50:14; Giăng 16:33; Gia 1:5).",
      "ko": "(시 36:9; 50:14; 요한 16:33; 야고보 1:5 참조)",
      "zh": "（參看詩36:9；50:14；約16:33；雅1:5）",
      "en": "(See also Ps. 36:9; 50:14; John 16:33; Jas. 1:5.)",
      "ja": "（詩 36:9; 50:14; ヨハ 16:33; ヤコ 1:5も参照。）"
    }
  },
  {
    "number": 43,
    "sourceSheet": "43",
    "labels": {
      "vi": "BÀI HÁT 43",
      "ko": "43번",
      "zh": "詩歌第43首",
      "en": "SONG 43",
      "ja": "43番"
    },
    "title": {
      "vi": "Lời cầu nguyện tạ ơn",
      "ko": "감사의 기도",
      "zh": "感恩的禱告",
      "en": "A Prayer of Thanks",
      "ja": "感謝の祈り"
    },
    "scripture": {
      "vi": "(Thi thiên 95:2)",
      "ko": "(시편 95:2)",
      "zh": "（詩篇95:2）",
      "en": "(Psalm 95:2)",
      "ja": "（詩編 95:2）"
    },
    "lines": [
      {
        "vi": "1. Ôi Giê-hô-va, cầu ngài hãy đoái đến lắng nghe",
        "ko": "1. 여호와 하느님 우리 아버지,",
        "zh": "1．耶和華有恩典，配受人讚美，",
        "en": "1. Gracious Jehovah, we praise you and thank you.",
        "ja": "1. 感謝します 神エホバ"
      },
      {
        "vi": "dân Cha vang tiếng hát xướng ngợi khen, biết ơn.",
        "ko": "언제나 따뜻이 돌보시니,",
        "zh": "我們衷心向你禱告感謝。",
        "en": "Father, we make these expressions in prayer.",
        "ja": "あなたの深い愛に"
      },
      {
        "vi": "Chúng con trọn lòng thờ ngài, trú náu dưới cánh Cha.",
        "ko": "당신께 나아가 감사드리며",
        "zh": "天父，我們願全心為你服務，",
        "en": "Trusting in you, we will serve you completely,",
        "ja": "思いやりと温かさ"
      },
      {
        "vi": "Bên Cha yêu thương, chúng con hạnh phúc vô ngần.",
        "ko": "찬양의 기도를 드립니다.",
        "zh": "受你細心呵護，心滿意足。",
        "en": "Knowing we thrive under your tender care.",
        "ja": "生きる活力になる"
      },
      {
        "vi": "Khi sinh ra, di truyền tội lỗi, thiếu mất hiển vinh",
        "ko": "약하여 날마다 잘못 범하니",
        "zh": "我們都不完美天天會犯錯，",
        "en": "Daily our errors reveal imperfection.",
        "ja": "自分の価値 見失う"
      },
      {
        "vi": "nên xin Cha khoan dung tha sai phạm hàng ngày.",
        "ko": "우리 죄 용서해 주옵소서.",
        "zh": "懇求上帝寬恕一切過錯。",
        "en": "For our transgressions forgiveness we seek.",
        "ja": "繰り返す過ちで"
      },
      {
        "vi": "Cha hy sinh Con một chịu chết cứu rỗi chúng con,",
        "ko": "귀중한 대속을 마련해 주신",
        "zh": "感謝你通過贖價帶來拯救，",
        "en": "Thankful we are that our lives have been ransomed.",
        "ja": "許しがある あなたから"
      },
      {
        "vi": "xin mang ơn Cha đã nhân từ xuống ân huệ.",
        "ko": "그 은혜, 늘 감사드립니다.",
        "zh": "感謝你體恤我們的軟弱。",
        "en": "Thankful we are that you know we are weak.",
        "ja": "また前に踏み出せる"
      },
      {
        "vi": "2. Mang ơn Cha vô cùng vì đoái đến mỗi chúng con.",
        "ko": "2. 부족한 우리를 사랑하시어",
        "zh": "2．天父，你向人表現仁慈、愛心，",
        "en": "2. Grateful we are that you show love and kindness.",
        "ja": "2. 感謝します 父エホバ"
      },
      {
        "vi": "Cha yêu thương dẫn dắt đến gần ngôi chí tôn,",
        "ko": "곁으로 부르신 여호와여,",
        "zh": "感謝你讓我們能親近你。",
        "en": "Thank you for drawing us closer to you.",
        "ja": "愛情深い保護に"
      },
      {
        "vi": "giúp cho chiên nhu mì được biết rõ Đấng Tối Cao,",
        "ko": "당신을 알도록 가르치시니",
        "zh": "求你教導我們認識、敬奉你，",
        "en": "Teach us to know you, and help us to serve you.",
        "ja": "どんなときも あなたから"
      },
      {
        "vi": "trung kiên theo Cha, bước trên đường lối chân thật.",
        "ko": "감사의 기도를 드립니다.",
        "zh": "幫助我們對你忠貞不渝。",
        "en": "Show us the way to be loyal and true.",
        "ja": "愛と励ましを得る"
      },
      {
        "vi": "Cha ban cho dư tràn thần khí thánh giúp chúng con",
        "ko": "옳은 길 걷도록 인도하시고",
        "zh": "感謝你賜予我們強大力量，",
        "en": "Thankful we are for your powerful spirit.",
        "ja": "仕えたいと願うのに"
      },
      {
        "vi": "luôn đi rao tin Cha can trường và mạnh dạn.",
        "ko": "전파할 용기를 주옵소서.",
        "zh": "讓我們勇敢將真理宣揚。",
        "en": "Grateful we are for the courage to speak.",
        "ja": "勇気なくす日もある"
      },
      {
        "vi": "Dân Cha nay vui mừng thờ kính ở núi thánh Cha,",
        "ko": "아버지 섬기는 기쁨 주시니,",
        "zh": "感謝耶和華關懷照顧我們，",
        "en": "May we be humble and happy to serve you;",
        "ja": "力を得る あなたから"
      },
      {
        "vi": "mong sao đi bên Cha khiêm nhường đến muôn đời.",
        "ko": "그 은혜, 늘 감사드립니다.",
        "zh": "願謙卑稱頌你直到永恆。",
        "en": "May we give thanks, for you favor the meek.",
        "ja": "再び立ち上がれる"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 65:2, 4, 11; Phi-líp 4:6).",
      "ko": "(시 65:2, 4, 11; 빌립보 4:6 참조)",
      "zh": "（參看詩65:2,4,11；腓4:6）",
      "en": "(See also Ps. 65:2, 4, 11; Phil. 4:6.)",
      "ja": "（詩 65:2，4，11; フィリ 4:6も参照。）"
    }
  },
  {
    "number": 44,
    "sourceSheet": "44",
    "labels": {
      "vi": "BÀI HÁT 44",
      "ko": "44번",
      "zh": "詩歌第44首",
      "en": "SONG 44",
      "ja": "44番"
    },
    "title": {
      "vi": "Lời cầu nguyện của người khốn cùng",
      "ko": "간청의 기도",
      "zh": "淒苦人的禱告",
      "en": "A Prayer of the Lowly One",
      "ja": "謙遜な人の祈り"
    },
    "scripture": {
      "vi": "(Thi thiên 4:1)",
      "ko": "(시편 4:1)",
      "zh": "（詩篇4:1）",
      "en": "(Psalm 4:1)",
      "ja": "（詩編 4:1）"
    },
    "lines": [
      {
        "vi": "1. Ôi Giê-hô-va, con kêu cầu ngài",
        "ko": "1. 주 여호와여, 간청하니",
        "zh": "1．耶和華啊，我的懇求",
        "en": "1. Jehovah God, I call to you and ask you:",
        "ja": "1. エホバ 祈りを"
      },
      {
        "vi": "xin Cha từ trời nghe thấu.",
        "ko": "들어 주소서.",
        "zh": "但願你能垂聽，",
        "en": "\"Hear my prayer.\"",
        "ja": "聞いてください"
      },
      {
        "vi": "Vết thương từ lòng không sao lành được",
        "ko": "내 상처 깊어 낫지 않고",
        "zh": "心裡的傷難以癒合，",
        "en": "My wounds are deep and slow to heal;",
        "ja": "私のこの重荷"
      },
      {
        "vi": "và gánh con mang quá nặng.",
        "ko": "짐 힘겨우며",
        "zh": "有如重擔千斤，",
        "en": "my load is hard to bear.",
        "ja": "深い傷"
      },
      {
        "vi": "Chúa biết hay chăng buồn nản, đau thương,",
        "ko": "나 희망 잃고 좌절하여",
        "zh": "絕望痛苦揮之不去，",
        "en": "Despondent thoughts and disappointed hopes",
        "ja": "心は責められ"
      },
      {
        "vi": "mờ tối vây quanh đời con?",
        "ko": "약해져 가니,",
        "zh": "令我心緒難平，",
        "en": "have left me weak.",
        "ja": "弱り果てる"
      },
      {
        "vi": "Ngài hãy rủ lòng yêu thương đoái đến,",
        "ko": "오, 주의 은혜 베푸시어",
        "zh": "賜一切安慰的天父，",
        "en": "O God of comfort, care for me;",
        "ja": "あなたの恵みが"
      },
      {
        "vi": "xin Cha dịu dàng an ủi.",
        "ko": "새 힘 주소서.",
        "zh": "請安撫我的心。",
        "en": "your favor I do seek.",
        "ja": "必要です"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Lạy Giê-hô-va, dìu con bước tiếp,",
        "ko": "날 일으켜 인내하며",
        "zh": "求你助我不再擔憂，",
        "en": "Do raise me up; help me endure.",
        "ja": "この手をつかんで"
      },
      {
        "vi": "vượt qua gian khó; làm con tin chắc",
        "ko": "희망 보게 하옵소서.",
        "zh": "每當困惑，希望重獲。",
        "en": "When I'm in doubt, make my hope sure.",
        "ja": "助けてください"
      },
      {
        "vi": "lời Cha đã hứa. Từ vực sâu thẳm,",
        "ko": "절망 속에 간청하니",
        "zh": "難過失落，你扶持我，",
        "en": "From deep despair, I turn to you.",
        "ja": "希望と力を"
      },
      {
        "vi": "lòng hướng đến ngài hầu Chúa nâng dậy.",
        "ko": "여호와여, 힘 주소서.",
        "zh": "你必使我重新振作。",
        "en": "Jehovah God, my strength renew.",
        "ja": "エホバよ 下さい"
      },
      {
        "vi": "2. Tra xem Lời ngài, con như được ngụ",
        "ko": "2. 주의 말씀은 약할 때에",
        "zh": "2．我軟弱時你的良言",
        "en": "2. Your Word has been my comfort and",
        "ja": "2. あなたが記した"
      },
      {
        "vi": "nơi yên bình, được thêm sức.",
        "ko": "위안이 되고",
        "zh": "多麼溫暖心窩，",
        "en": "a refuge when I'm weak,",
        "ja": "祈りの書は"
      },
      {
        "vi": "Nỗi đau đè nặng không sao thành lời,",
        "ko": "말 못 할 나의 심정 헤아려",
        "zh": "彷彿說出我心深處",
        "en": "Expressing feelings dear to me",
        "ja": "声にならない"
      },
      {
        "vi": "Lời Chúa thay con giãi bày.",
        "ko": "주었으니,",
        "zh": "難言喻的感受。",
        "en": "in words I cannot speak.",
        "ja": "私のうめき"
      },
      {
        "vi": "Hãy giúp con vun bồi đức tin thêm bền vững,",
        "ko": "주 말씀으로 믿음, 신뢰",
        "zh": "請幫助我更加信賴",
        "en": "Please build in me the faith and trust",
        "ja": "聖書読み"
      },
      {
        "vi": "luôn tin cậy Cha",
        "ko": "키워 주시고",
        "zh": "你的話和承諾，",
        "en": "that your Word does impart.",
        "ja": "信仰強められ"
      },
      {
        "vi": "và nhớ rằng tình yêu Cha rất lớn,",
        "ko": "내 마음보다 크신 사랑",
        "zh": "時刻想起你深愛我",
        "en": "And help me always know your love",
        "ja": "あなたの大きな愛"
      },
      {
        "vi": "Cha luôn hiểu lòng con rõ.",
        "ko": "알게 하소서.",
        "zh": "也樂意包容我。",
        "en": "is greater than my heart.",
        "ja": "感じる"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Lạy Giê-hô-va, dìu con bước tiếp,",
        "ko": "날 일으켜 인내하며",
        "zh": "求你助我不再擔憂，",
        "en": "Do raise me up; help me endure.",
        "ja": "この手をつかんで"
      },
      {
        "vi": "vượt qua gian khó; làm con tin chắc",
        "ko": "희망 보게 하옵소서.",
        "zh": "每當困惑，希望重獲。",
        "en": "When I'm in doubt, make my hope sure.",
        "ja": "助けてください"
      },
      {
        "vi": "lời Cha đã hứa. Từ vực sâu thẳm,",
        "ko": "절망 속에 간청하니",
        "zh": "難過失落，你扶持我，",
        "en": "From deep despair, I turn to you.",
        "ja": "希望と力を"
      },
      {
        "vi": "lòng hướng đến ngài hầu Chúa nâng dậy.",
        "ko": "여호와여, 힘 주소서.",
        "zh": "你必使我重新振作。",
        "en": "Jehovah God, my strength renew.",
        "ja": "エホバよ 下さい"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 42:6; 119:28; Rô 8:26; 2 Cô 4:16; 1 Giăng 3:20).",
      "ko": "(시 42:6; 119:28; 로마 8:26; 고린도 후서 4:16; 요한 1서 3:20 참조)",
      "zh": "（參看詩42:6；119:28；羅8:26；林後4:16；約一3:20）",
      "en": "(See also Ps. 42:6; 119:28; Rom. 8:26; 2 Cor. 4:16; 1 John 3:20.)",
      "ja": "（詩 42:6; 119:28; ロマ 8:26; コリ二 4:16; ヨハ一 3:20も参照。）"
    }
  },
  {
    "number": 45,
    "sourceSheet": "45",
    "labels": {
      "vi": "BÀI HÁT 45",
      "ko": "45번",
      "zh": "詩歌第45首",
      "en": "SONG 45",
      "ja": "45番"
    },
    "title": {
      "vi": "Sự suy ngẫm của lòng con",
      "ko": "내 마음의 묵상",
      "zh": "內心沉思的事",
      "en": "The Meditation of My Heart",
      "ja": "心の黙想"
    },
    "scripture": {
      "vi": "(Thi thiên 19:14)",
      "ko": "(시편 19:14)",
      "zh": "（詩篇19:14）",
      "en": "(Psalm 19:14)",
      "ja": "（詩編 19:14）"
    },
    "lines": [
      {
        "vi": "1. Hỡi Chúa, lòng con luôn mong ước sao",
        "ko": "1. 온종일 내 마음 바쳐",
        "zh": "1．上帝，我願守護內心，",
        "en": "1. The meditation of my heart,",
        "ja": "1. 私の心を"
      },
      {
        "vi": "bất cứ điều chi tâm con ngẫm suy",
        "ko": "깊이 묵상한 생각을",
        "zh": "天天沉思美好的事，",
        "en": "The thoughts I ponder through the day—",
        "ja": "巡る考えを"
      },
      {
        "vi": "mang đến niềm vui cho Cha kính yêu",
        "ko": "주여, 기뻐해 주시고",
        "zh": "心思意念讓你歡喜，",
        "en": "May they be pleasing to you, Lord,",
        "ja": "いつでもあなたの"
      },
      {
        "vi": "và con theo sát lối Chúa không rời.",
        "ko": "내 걸음 지켜 주소서.",
        "zh": "我願一生堅守忠義。",
        "en": "And keep me steadfast in your way.",
        "ja": "知恵で満たしたい"
      },
      {
        "vi": "Mỗi lúc sầu lo vây quanh trí tâm,",
        "ko": "근심, 걱정에 시달려",
        "zh": "心中承受重大壓力，",
        "en": "When worries weigh upon my mind",
        "ja": "心が疲れて"
      },
      {
        "vi": "thao thức lòng con không yên suốt đêm,",
        "ko": "잠 못 이루는 밤에도",
        "zh": "痛苦難耐無法安睡，",
        "en": "And make me restless in the night,",
        "ja": "眠れない夜も"
      },
      {
        "vi": "suy ngẫm về Cha giúp bớt ưu phiền,",
        "ko": "올바른 길 묵상하며",
        "zh": "我會細想你的作為，",
        "en": "Then may I meditate on you",
        "ja": "正しい思いを"
      },
      {
        "vi": "với bao điều đúng hầu không ngã lòng.",
        "ko": "당신 생각하렵니다.",
        "zh": "仔細沉思正義的事。",
        "en": "And things I know to be upright.",
        "ja": "抱けますように"
      },
      {
        "vi": "2. Nghĩ đến điều yêu thương, công chính luôn",
        "ko": "2. 무엇이든지 참되고",
        "zh": "2．所有可稱頌的美德，",
        "en": "2. Whatever things are chaste and true,",
        "ja": "2. 清く良いことと"
      },
      {
        "vi": "với những điều trang nghiêm hay đáng khen,",
        "ko": "순결하고 덕이 되는",
        "zh": "任何純潔、真實的事，",
        "en": "Whatever virtue there may be,",
        "ja": "高潔なことを"
      },
      {
        "vi": "khi ấy lòng con đang theo ý Cha,",
        "ko": "좋은 것 생각한다면",
        "zh": "天天都要不斷深思，",
        "en": "Whatever things well-spoken-of—",
        "ja": "考え続けて"
      },
      {
        "vi": "bình an Cha xuống khỏa lấp ưu phiền.",
        "ko": "평온함 얻게 됩니다.",
        "zh": "必享內心平靜安寧。",
        "en": "May thoughts of these bring peace to me.",
        "ja": "安らぎを得たい"
      },
      {
        "vi": "Quý báu dường bao ôi tư tưởng Cha;",
        "ko": "주여, 셀 수 없이 많은",
        "zh": "上帝，你的意念深廣，",
        "en": "How precious are your thoughts, O God!",
        "ja": "あなたの貴い"
      },
      {
        "vi": "vô số thật con không sao đếm đo!",
        "ko": "소중한 말씀과 생각,",
        "zh": "你的想法多麼寶貴。",
        "en": "Beyond all counting is their sum.",
        "ja": "言葉をよく読み"
      },
      {
        "vi": "Suy ngẫm Lời Cha sốt sắng đêm ngày,",
        "ko": "온 마음을 기울여서",
        "zh": "我會認真用心體會，",
        "en": "So may I ponder your own words,",
        "ja": "深く考えて"
      },
      {
        "vi": "thấm sâu vào tấm lòng con suốt đời.",
        "ko": "깊이 묵상하렵니다.",
        "zh": "仔細沉思你的智慧。",
        "en": "Absorbed in them may I become.",
        "ja": "守れますように"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 49:3; 63:6; 139:17, 23; Phi-líp 4:7, 8; 1 Ti 4:15).",
      "ko": "(시 49:3; 63:6; 139:17, 23; 빌립보 4:7, 8; 디모데 전서 4:15 참조)",
      "zh": "（參看詩49:3；63:6；139:17,23；腓4:7,8；提前4:15）",
      "en": "(See also Ps. 49:3; 63:6; 139:17, 23; Phil. 4:7, 8; 1 Tim. 4:15.)",
      "ja": "（詩 49:3; 63:6; 139:17，23; フィリ 4:7，8; テモ一 4:15も参照。）"
    }
  },
  {
    "number": 46,
    "sourceSheet": "46",
    "labels": {
      "vi": "BÀI HÁT 46",
      "ko": "46번",
      "zh": "詩歌第46首",
      "en": "SONG 46",
      "ja": "46番"
    },
    "title": {
      "vi": "Cảm tạ Cha Giê-hô-va",
      "ko": "여호와여, 감사합니다",
      "zh": "感謝耶和華",
      "en": "We Thank You, Jehovah",
      "ja": "エホバ，私たちは感謝します"
    },
    "scripture": {
      "vi": "(1 Tê-sa-lô-ni-ca 5:18)",
      "ko": "(데살로니가 전서 5:18)",
      "zh": "（帖撒羅尼迦前書5:18）",
      "en": "(1 Thessalonians 5:18)",
      "ja": "（テサロニケ第一 5:18）"
    },
    "lines": [
      {
        "vi": "1. Lạy Cha Giê-hô-va, xin cám ơn Cha đêm ngày,",
        "ko": "1. 오, 감사합니다, 주 여호와여.",
        "zh": "1．感謝耶和華發出真理之光，",
        "en": "1. We thank you, Jehovah, each day and each night,",
        "ja": "1. 感謝します 父エホバ"
      },
      {
        "vi": "sự sáng Cha chiếu rọi trên chúng con rạng ngời.",
        "ko": "이 소중한 빛 비춰 주시고,",
        "zh": "指引你僕人走正確方向。",
        "en": "That you shed upon us your precious light.",
        "ja": "道を照らす光を"
      },
      {
        "vi": "Tạ ơn Cha hết lòng vì phước ân kêu cầu ngài,",
        "ko": "내 모든 염려를 말씀드리는",
        "zh": "感謝耶和華讓我們有榮幸",
        "en": "We thank you that we have the priv'lege of prayer,",
        "ja": "この祈りの贈り物"
      },
      {
        "vi": "hầu chúng con cùng trao mọi lo lắng cho ngài.",
        "ko": "특권 주시니 감사합니다.",
        "zh": "能通過禱告天天親近你。",
        "en": "That we can approach you with ev'ry care.",
        "ja": "感謝します あなたに"
      },
      {
        "vi": "2. Lạy Cha Giê-hô-va, xin cám ơn ban Con một,",
        "ko": "2. 오, 감사합니다. 아들 보내어",
        "zh": "2．感謝耶和華無私犧牲愛子，",
        "en": "2. We thank you, Jehovah, for your loving Son,",
        "ja": "2. 感謝します 父エホバ"
      },
      {
        "vi": "do đức tin vững mạnh, nay thắng thế gian rồi.",
        "ko": "믿음의 승리 보여 주시고,",
        "zh": "他忠心至死，戰勝這世界。",
        "en": "Who conquered the world; by his faith he won.",
        "ja": "イエスによる犠牲を"
      },
      {
        "vi": "Tạ ơn Cha dắt dìu, dạy chúng con theo đường ngài",
        "ko": "우리의 서원을 이행하도록",
        "zh": "感謝你教導我們行你旨意，",
        "en": "We thank you for guidance in doing your will.",
        "ja": "誓い果たす導きを"
      },
      {
        "vi": "hầu chúng con làm theo lời thề ước dâng mình.",
        "ko": "도와주시니 감사합니다.",
        "zh": "助我們實踐獻身的誓言。",
        "en": "You lovingly help us our vows fulfill.",
        "ja": "感謝します あなたに"
      },
      {
        "vi": "3. Lạy Cha Giê-hô-va, xin cám ơn ban vinh dự",
        "ko": "3. 오, 주의 이름과 왕국 알리는",
        "zh": "3．感謝耶和華讓我們有榮幸",
        "en": "3. We thank you, our God, for the honor to preach",
        "ja": "3. 感謝します 父エホバ"
      },
      {
        "vi": "rao báo danh thánh ngài, chân lý cho bao người.",
        "ko": "영예 주시니 감사합니다.",
        "zh": "宣揚你聖名和聖經真理。",
        "en": "About your great name and the truth to teach.",
        "ja": "真理告げる名誉を"
      },
      {
        "vi": "Tạ ơn Cha xóa sạch mọi khổ đau mai không còn,",
        "ko": "영원히 눈물을 없애시리니",
        "zh": "感謝耶和華即將消除痛苦，",
        "en": "We thank you that soon all earth's woes will be past,",
        "ja": "とわに続く王国を"
      },
      {
        "vi": "và Nước trên trời mang lại ân phước muôn đời.",
        "ko": "오 여호와여, 감사합니다.",
        "zh": "王國會帶來永恆的幸福。",
        "en": "While your Kingdom blessings forever last.",
        "ja": "感謝します あなたに"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 50:14; 95:2; 147:7; Cô 3:15).",
      "ko": "(시 50:14; 95:2; 147:7; 골로새 3:15 참조)",
      "zh": "（參看詩50:14；95:2；147:7；西3:15）",
      "en": "(See also Ps. 50:14; 95:2; 147:7; Col. 3:15.)",
      "ja": "（詩 50:14; 95:2; 147:7; コロ 3:15も参照。）"
    }
  },
  {
    "number": 47,
    "sourceSheet": "47",
    "labels": {
      "vi": "BÀI HÁT 47",
      "ko": "47번",
      "zh": "詩歌第47首",
      "en": "SONG 47",
      "ja": "47番"
    },
    "title": {
      "vi": "Hãy cầu nguyện với Cha Giê-hô-va hằng ngày",
      "ko": "여호와께 날마다 기도하라",
      "zh": "天天向耶和華禱告",
      "en": "Pray to Jehovah Each Day",
      "ja": "日ごとにエホバに祈る"
    },
    "scripture": {
      "vi": "(1 Tê-sa-lô-ni-ca 5:17)",
      "ko": "(데살로니가 전서 5:17)",
      "zh": "（帖撒羅尼迦前書5:17）",
      "en": "(1 Thessalonians 5:17)",
      "ja": "（テサロニケ第一 5:17）"
    },
    "lines": [
      {
        "vi": "1. Hãy luôn cầu nguyện với Giê-hô-va Tối Cao,",
        "ko": "1. 기도하여라, 주 여호와께.",
        "zh": "1．耶和華樂意聽我們傾訴，",
        "en": "1. Pray to Jehovah, the Hearer of prayer.",
        "ja": "1. 日ごと神に祈ろう"
      },
      {
        "vi": "chính đây ân huệ lớn cho bao người thờ Cha.",
        "ko": "우리가 받은 큰 특권이니.",
        "zh": "我們要親近仁愛的天父。",
        "en": "This is our priv'lege, for his name we bear.",
        "ja": "神は聞いてくださる"
      },
      {
        "vi": "Vậy ta đến với Cha như người bạn tâm giao.",
        "ko": "벗에게 하듯 마음을 열고",
        "zh": "上帝值得我們全心依靠，",
        "en": "Open your heart as you would to a friend,",
        "ja": "心開き近づき"
      },
      {
        "vi": "Hãy tin Cha trợ giúp, nơi ngài ta náu thân.",
        "ko": "언제나 여호와 의지하라.",
        "zh": "與他為友，向他訴說煩惱。",
        "en": "Trust that on Him you can always depend.",
        "ja": "友に話す気持ちで"
      },
      {
        "vi": "Cầu với Giê-hô-va hằng ngày.",
        "ko": "날마다 기도하라.",
        "zh": "要天天向他禱告。",
        "en": "Pray to Jehovah each day.",
        "ja": "日ごと祈ろう"
      },
      {
        "vi": "2. Hãy luôn cầu nguyện cám ơn điều Cha đã ban,",
        "ko": "2. 감사하여라, 생명 주시니.",
        "zh": "2．感謝耶和華賜生命之恩，",
        "en": "2. Pray to Jehovah, give thanks that we live,",
        "ja": "2. 感謝しよう エホバに"
      },
      {
        "vi": "cúi xin tha tội lỗi ta vô tình làm sai.",
        "ko": "용서하면서 용서 구하라.",
        "zh": "他深知我們是塵土之身。",
        "en": "Asking forgiveness as we do forgive.",
        "ja": "生きることの喜び"
      },
      {
        "vi": "Mình tin tưởng Cha nên xưng tội cùng Cha luôn.",
        "ko": "우리가 흙임을 잘 아시니",
        "zh": "向他承認過錯懇求寬恕，",
        "en": "May we confess to our God whom we trust.",
        "ja": "罪の許し求めて"
      },
      {
        "vi": "Nhớ ta từ bụi đất, Cha cảm thông chúng ta.",
        "ko": "여호와 신뢰하며 말하라.",
        "zh": "努力效法他樂意寬恕人。",
        "en": "He is our Maker and knows we are dust.",
        "ja": "神に心打ち明け"
      },
      {
        "vi": "Cầu với Giê-hô-va hằng ngày.",
        "ko": "날마다 기도하라.",
        "zh": "要天天向他禱告。",
        "en": "Pray to Jehovah each day.",
        "ja": "日ごと祈ろう"
      },
      {
        "vi": "3. Hãy luôn cầu nguyện mỗi khi gặp chi khó khăn.",
        "ko": "3. 기도하여라, 힘겨울 때에.",
        "zh": "3．若陷於困境要不斷懇求，",
        "en": "3. Pray to Jehovah when troubles appear.",
        "ja": "3. つらい時も祈ろう"
      },
      {
        "vi": "Giê-hô-va gần gũi, không bao giờ lìa xa.",
        "ko": "아버지 항상 곁에 계시니.",
        "zh": "尋求耶和華指引和拯救。",
        "en": "He is our Father and ever so near.",
        "ja": "保護と助け求めて"
      },
      {
        "vi": "Cầu Cha đoái xem ta, luôn trợ lực cho ta.",
        "ko": "여호와 도움을 구하면서",
        "zh": "慈愛天父常在我們左右，",
        "en": "Seek his protection, and look for his aid;",
        "ja": "不安委ね頼ろう"
      },
      {
        "vi": "Chớ lo sợ vì Chúa ta quyền năng tối cao.",
        "ko": "굳건히 믿고 두려워 말라.",
        "zh": "全心信賴他就不必擔憂。",
        "en": "He is our confidence; don't be afraid.",
        "ja": "神はそばで支える"
      },
      {
        "vi": "Cầu với Giê-hô-va hằng ngày.",
        "ko": "날마다 기도하라.",
        "zh": "要天天向他禱告。",
        "en": "Pray to Jehovah each day.",
        "ja": "日ごと祈ろう"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 65:5; Mat 6:9-13; 26:41; Lu 18:1).",
      "ko": "(시 65:5; 마태 6:9-13; 26:41; 누가 18:1 참조)",
      "zh": "（參看詩65:5；太6:9-13；26:41；路18:1）",
      "en": "(See also Ps. 65:5; Matt. 6:9-13; 26:41; Luke 18:1.)",
      "ja": "（詩 65:5; マタ 6:9-13; 26:41; ルカ 18:1も参照。）"
    }
  },
  {
    "number": 48,
    "sourceSheet": "48",
    "labels": {
      "vi": "BÀI HÁT 48",
      "ko": "48번",
      "zh": "詩歌第48首",
      "en": "SONG 48",
      "ja": "48番"
    },
    "title": {
      "vi": "Hằng ngày bước đi với Đức Giê-hô-va",
      "ko": "날마다 여호와와 함께 걸으리",
      "zh": "天天與耶和華同行",
      "en": "Daily Walking With Jehovah",
      "ja": "毎日エホバと共に歩む"
    },
    "scripture": {
      "vi": "(Mi-chê 6:8)",
      "ko": "(미가 6:8)",
      "zh": "（彌迦書6:8）",
      "en": "(Micah 6:8)",
      "ja": "（ミカ 6:8）"
    },
    "lines": [
      {
        "vi": "1. Nguyện ta bước đi bên ngài hằng ngày",
        "ko": "1. 사랑하는 아버지와",
        "zh": "1．謙卑與耶和華同行，",
        "en": "1. Hand in hand with our dear Father,",
        "ja": "1. 握り締めた手に"
      },
      {
        "vi": "và khiêm tốn theo Cha không hề rời xa.",
        "ko": "손을 잡고 매일 걸으리.",
        "zh": "天天牽著他的手前進。",
        "en": "We would humbly walk with him each day.",
        "ja": "父のぬくもり"
      },
      {
        "vi": "Ngài luôn xót thương, nhân từ cùng người",
        "ko": "함께 걷는 자들에게",
        "zh": "尋求天父指引的人，",
        "en": "Oh, how undeserved his kindness",
        "ja": "お父さんエホバ"
      },
      {
        "vi": "lòng đang khát khao, trông mong nghe về Cha.",
        "ko": "넘치도록 친절하시네!",
        "zh": "必定得著豐盛的福分。",
        "en": "That he grants to those who seek his way!",
        "ja": "あなたと歩く"
      },
      {
        "vi": "Nhờ ơn Cha mà nay chúng ta được",
        "ko": "사랑에 찬 마련으로",
        "zh": "上帝滿足我們需求，",
        "en": "By his love God made provision;",
        "ja": "この手を離さず"
      },
      {
        "vi": "nắm tay Cha, song hành bên Cha.",
        "ko": "그분 손잡게 되니,",
        "zh": "他樂意伸出援手。",
        "en": "We may freely take his hand.",
        "ja": "いついつまでも"
      },
      {
        "vi": "Vậy ta dâng mình và đứng bên Cha;",
        "ko": "여호와께 헌신하고",
        "zh": "我們許下獻身誓言，",
        "en": "So we make our dedication;",
        "ja": "慎み忘れず"
      },
      {
        "vi": "quyết tâm trung kiên không chi chuyển lay.",
        "ko": "항상 그 편에 서리라.",
        "zh": "決心敬奉仁愛上帝。",
        "en": "With Jehovah we take our stand.",
        "ja": "光の道を"
      },
      {
        "vi": "2. Ngày Cha phán xét nhân loại gần kề;",
        "ko": "2. 세상 끝이 다가오니",
        "zh": "2．撒但深知時候無多，",
        "en": "2. In this day of Satan's anger,",
        "ja": "2. 握り締めた手が"
      },
      {
        "vi": "thời gian chóng qua, Sa-tan căm giận hơn.",
        "ko": "사탄 박해 거세져 가네.",
        "zh": "不斷製造難題和災禍。",
        "en": "As the end is drawing ever near,",
        "ja": "勇気与える"
      },
      {
        "vi": "Vậy nên khó khăn thêm ngày càng nhiều",
        "ko": "우리 때론 두려워서",
        "zh": "我們面對迫害反對，",
        "en": "We are faced with opposition",
        "ja": "恐れの気持ちに"
      },
      {
        "vi": "cùng muôn bẫy giăng, bao âm mưu hại ta.",
        "ko": "물러서려 할 때도 있네.",
        "zh": "難免灰心，想半途而廢。",
        "en": "That could make us turn away in fear.",
        "ja": "負けたりしない"
      },
      {
        "vi": "Đừng hoang mang, vì Cha chở che mình.",
        "ko": "우릴 보호해 주시는",
        "zh": "但耶和華力量強大，",
        "en": "But Jehovah gives protection;",
        "ja": "悲しみの谷を"
      },
      {
        "vi": "Chúng ta mong sao gần bên Cha,",
        "ko": "주 여호와 곁에서",
        "zh": "若能時刻倚靠他，",
        "en": "Close to him we want to stay,",
        "ja": "あなたと抜けて"
      },
      {
        "vi": "thờ tôn trung thành cho đến muôn đời.",
        "ko": "변함없이 충성하며",
        "zh": "就能永遠與他同行，",
        "en": "That we might forever serve him.",
        "ja": "喜びの丘を"
      },
      {
        "vi": "Mãi luôn yêu thương Cha, không rời xa.",
        "ko": "주를 영원히 섬기리.",
        "zh": "忠於耶和華不偏離。",
        "en": "Love him loyally, never stray.",
        "ja": "あなたと歩く"
      },
      {
        "vi": "3. Ngài nâng đỡ ta qua Lời của ngài",
        "ko": "3. 우릴 도와주시려고",
        "zh": "3．上帝賜下他的話語，",
        "en": "3. Help for us God has provided",
        "ja": "3. 握り締めた手は"
      },
      {
        "vi": "và ban sức thêm cho ta qua lực Cha.",
        "ko": "주의 영과 말씀 주셨네.",
        "zh": "賜人力量，助人走正道；",
        "en": "Through his spirit and his written Word,",
        "ja": "幸せあふれ"
      },
      {
        "vi": "Nhờ hội thánh nên ta được rèn luyện,",
        "ko": "회중 마련해 주시고",
        "zh": "上帝賜下弟兄團體，",
        "en": "Through the Christian congregation,",
        "ja": "心を通わせ"
      },
      {
        "vi": "và Cha ủi an khi nghe lời cầu xin.",
        "ko": "기도 응답 약속하셨네.",
        "zh": "他也垂聽我們的禱告。",
        "en": "Through assurance that our prayer is heard.",
        "ja": "毎日歩く"
      },
      {
        "vi": "Một khi ta cùng đi với Cha thì",
        "ko": "여호와와 함께 걸어",
        "zh": "全心全意與他同行，",
        "en": "As we're walking with Jehovah,",
        "ja": "あなたに頼って"
      },
      {
        "vi": "lối công minh ta hằng vâng theo.",
        "ko": "옳은 일을 배우고",
        "zh": "行走正確的路徑，",
        "en": "He will help us do what's right.",
        "ja": "力を尽くし"
      },
      {
        "vi": "Nhờ Cha khuyên dạy, ta mãi trung thành.",
        "ko": "겸허하고 충실하게",
        "zh": "他必幫助我們忠心，",
        "en": "He will help us to be loyal",
        "ja": "この手を離さず"
      },
      {
        "vi": "Bước đi bên Cha, ta khiêm nhường luôn.",
        "ko": "매일 그 길로 걸으리.",
        "zh": "天天謙卑與他同行。",
        "en": "And walk modestly in his sight.",
        "ja": "光の道を"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Sáng 5:24; 6:9; 1 Vua 2:3, 4).",
      "ko": "(창세 5:24; 6:9; 열왕기상 2:3, 4 참조)",
      "zh": "（參看創5:24；6:9；王上2:3,4）",
      "en": "(See also Gen. 5:24; 6:9; 1 Ki. 2:3, 4.)",
      "ja": "（創 5:24; 6:9; 王一 2:3，4も参照。）"
    }
  },
  {
    "number": 49,
    "sourceSheet": "49",
    "labels": {
      "vi": "BÀI HÁT 49",
      "ko": "49번",
      "zh": "詩歌第49首",
      "en": "SONG 49",
      "ja": "49番"
    },
    "title": {
      "vi": "Làm Cha Giê-hô-va vui lòng",
      "ko": "여호와의 마음을 기쁘게 하리",
      "zh": "使耶和華的心歡喜",
      "en": "Making Jehovah's Heart Glad",
      "ja": "日々エホバに喜んでいただく"
    },
    "scripture": {
      "vi": "(Châm ngôn 27:11)",
      "ko": "(잠언 27:11)",
      "zh": "（箴言27:11）",
      "en": "(Proverbs 27:11)",
      "ja": "（格言 27:11）"
    },
    "lines": [
      {
        "vi": "1. Lạy Chúa, chúng con nguyện theo ý ngài;",
        "ko": "1. 하느님 뜻 행하기로",
        "zh": "1．上帝，我們許下誓言，",
        "en": "1. Great God, we've vowed to do your will;",
        "ja": "1. 賢く歩んで"
      },
      {
        "vi": "việc Chúa, chúng con hằng khôn khéo làm;",
        "ko": "우린 서원했나이다.",
        "zh": "決心執行你的旨意，",
        "en": "In wisdom your work we'll fulfill,",
        "ja": "誓い果たしたい"
      },
      {
        "vi": "lòng mừng vì đang thực thi ý Chúa;",
        "ko": "주 마음 기쁘게 하며",
        "zh": "行事明智，聽從命令，",
        "en": "For then we know we'll have a part",
        "ja": "愛するエホバの"
      },
      {
        "vi": "ra sức làm vui lòng Giê-hô-va.",
        "ko": "지혜로 행하리이다.",
        "zh": "天天使你的心歡喜。",
        "en": "In making glad your loving heart.",
        "ja": "栄光のために"
      },
      {
        "vi": "2. \"Đầy tớ\" của Cha ở trên đất này",
        "ko": "2. 당신의 충실한 종이",
        "zh": "2．地上忠信睿智奴隸，",
        "en": "2. Your slave, your steward here on earth,",
        "ja": "2. 思慮深い奴隷"
      },
      {
        "vi": "truyền bá thánh danh, sự cao quý ngài.",
        "ko": "주 위대하심 알리며",
        "zh": "宣揚你的偉大能力，",
        "en": "Declares your greatness and your worth",
        "ja": "食物与える"
      },
      {
        "vi": "Tận tụy, họ cho đồ ăn đúng lúc,",
        "ko": "제때에 양식을 주어",
        "zh": "按時餵養你的子民，",
        "en": "And feeds us nourishment when due,",
        "ja": "神からの務め"
      },
      {
        "vi": "dân Chúa mạnh thêm và tiến không ngừng.",
        "ko": "새 힘 얻게 하나이다.",
        "zh": "幫助我們行你旨意。",
        "en": "To strengthen us your will to do.",
        "ja": "行えるように"
      },
      {
        "vi": "3. Thần khí, chúng con cầu xin mỗi ngày",
        "ko": "3. 당신의 성령 주시어",
        "zh": "3．求你賜下你的力量，",
        "en": "3. Impart to us your active force,",
        "ja": "3. あなたの力を"
      },
      {
        "vi": "hầu giúp bước đi thành trung suốt đời",
        "ko": "충실히 살게 하소서.",
        "zh": "幫助我們堅守立場，",
        "en": "That we may keep a faithful course",
        "ja": "与えてください"
      },
      {
        "vi": "và ngày càng sinh nhiều bông trái tốt,",
        "ko": "영의 열매를 맺어서",
        "zh": "結出好果實讚美你，",
        "en": "And bring forth fruitage to your praise.",
        "ja": "日ごと忠実に"
      },
      {
        "vi": "như thế làm vui lòng Chúa trên trời.",
        "ko": "늘 기쁨 드리리이다.",
        "zh": "永遠使你的心歡喜。",
        "en": "May we make glad your heart each day.",
        "ja": "歩めますように"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Mat 24:45-47; Lu 11:13; 22:42).",
      "ko": "(마태 24:45-47; 누가 11:13; 22:42 참조)",
      "zh": "（參看太24:45-47；路11:13；22:42）",
      "en": "(See also Matt. 24:45-47; Luke 11:13; 22:42.)",
      "ja": "（マタ 24:45-47; ルカ 11:13; 22:42も参照。）"
    }
  },
  {
    "number": 50,
    "sourceSheet": "50",
    "labels": {
      "vi": "BÀI HÁT 50",
      "ko": "50번",
      "zh": "詩歌第50首",
      "en": "SONG 50",
      "ja": "50番"
    },
    "title": {
      "vi": "Lời cầu nguyện dâng mình",
      "ko": "헌신의 기도",
      "zh": "獻身的禱告",
      "en": "My Prayer of Dedication",
      "ja": "私の献身の祈り"
    },
    "scripture": {
      "vi": "(Ma-thi-ơ 22:37)",
      "ko": "(마태복음 22:37)",
      "zh": "（馬太福音22:37）",
      "en": "(Matthew 22:37)",
      "ja": "（マタイ 22:37）"
    },
    "lines": [
      {
        "vi": "1. Hết tâm này nguyện hiến dâng ngài,",
        "ko": "1. 내 마음을 드리니",
        "zh": "1．我願意全心全意，",
        "en": "1. Take my heart and may it love",
        "ja": "1. 感謝に満ちた"
      },
      {
        "vi": "ước ao được Lời Chúa khuyên dạy.",
        "ko": "주여, 받아 주소서.",
        "zh": "尋求智慧和真理。",
        "en": "Truth and wisdom from above.",
        "ja": "声も心も"
      },
      {
        "vi": "Hãy cho con tôn vinh ngài mãi,",
        "ko": "내 목소리 다하여",
        "zh": "我願歌頌讚美你，",
        "en": "Take my voice and let it sing",
        "ja": "あなたのもとに"
      },
      {
        "vi": "trỗi giọng hát khen Vua Toàn Năng.",
        "ko": "찬양하게 하소서.",
        "zh": "一生一世崇拜你。",
        "en": "Praises always to my King.",
        "ja": "届いてほしい"
      },
      {
        "vi": "2. Hết thân mình nguyện hiến dâng ngài,",
        "ko": "2. 나의 몸을 다 바쳐",
        "zh": "2．我願意獻出自己，",
        "en": "2. Take my feet and take my hands;",
        "ja": "2. この手も足も"
      },
      {
        "vi": "giữ theo mệnh lệnh Chúa ban hành.",
        "ko": "주의 명령 행하고",
        "zh": "遵守你明智法令。",
        "en": "Let them serve your wise commands.",
        "ja": "全ての物も"
      },
      {
        "vi": "Dẫu trong tay con bao vật quý,",
        "ko": "내가 가진 것 모두",
        "zh": "我願意獻出一切，",
        "en": "Take my silver and my gold.",
        "ja": "あなたのために"
      },
      {
        "vi": "cũng chẳng tiếc, xin dâng về Cha.",
        "ko": "주께 드리렵니다.",
        "zh": "毫無保留敬奉你。",
        "en": "Nothing, Lord, would I withhold.",
        "ja": "用いていたい"
      },
      {
        "vi": "3. Hiến dâng trọn đời sống cho ngài",
        "ko": "3. 나의 삶이 주 뜻과",
        "zh": "3．我願意獻出生命，",
        "en": "3. Take my life and bring it, Lord,",
        "ja": "3. 命の限り"
      },
      {
        "vi": "để thi hành điều Chúa yêu chuộng.",
        "ko": "하나 되게 하시어",
        "zh": "一生執行你旨意。",
        "en": "With your will, in full accord.",
        "ja": "誓い果たして"
      },
      {
        "vi": "Hãy cho con dâng lên trọn ý,",
        "ko": "내가 하는 일 모두",
        "zh": "我願意竭盡全力，",
        "en": "Take myself, may all I do",
        "ja": "あなたにいつも"
      },
      {
        "vi": "quyết làm Chúa trên cao mừng vui.",
        "ko": "기쁨 되게 하소서.",
        "zh": "時刻讓你心歡喜。",
        "en": "Be well-pleasing, Jah, to you.",
        "ja": "喜ばれたい"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 40:8; Giăng 8:29; 2 Cô 10:5).",
      "ko": "(시 40:8; 요한 8:29; 고린도 후서 10:5 참조)",
      "zh": "（參看詩40:8；約8:29；林後10:5）",
      "en": "(See also Ps. 40:8; John 8:29; 2 Cor. 10:5.)",
      "ja": "（詩 40:8; ヨハ 8:29; コリ二 10:5も参照。）"
    }
  },
  {
    "number": 51,
    "sourceSheet": "51",
    "labels": {
      "vi": "BÀI HÁT 51",
      "ko": "51번",
      "zh": "詩歌第51首",
      "en": "SONG 51",
      "ja": "51番"
    },
    "title": {
      "vi": "Chúng ta dâng mình cho Đức Chúa Trời!",
      "ko": "우리는 하느님께 헌신했네!",
      "zh": "我們已獻身給上帝！",
      "en": "To God We Are Dedicated!",
      "ja": "私たちは神に献身しました！"
    },
    "scripture": {
      "vi": "(Ma-thi-ơ 16:24)",
      "ko": "(마태복음 16:24)",
      "zh": "（馬太福音16:24）",
      "en": "(Matthew 16:24)",
      "ja": "（マタイ 16:24）"
    },
    "lines": [
      {
        "vi": "1. Nhờ Cha Giê-hô-va, mình được gọi theo Chúa Giê-su,",
        "ko": "1. 주 우리를 예수에게 이끄시고",
        "zh": "1．上帝吸引我們緊緊跟隨耶穌，",
        "en": "1. To Christ, by our God, Jehovah, we have been drawn",
        "ja": "1. 愛あるエホバに招かれ"
      },
      {
        "vi": "từ nay sẽ đi theo đường ngài luôn luôn.",
        "ko": "그의 제자 되게 하셨네.",
        "zh": "我們樂意做基督門徒。",
        "en": "To be his disciples from now on.",
        "ja": "イエスの弟子となる"
      },
      {
        "vi": "Từ ngôi thánh cao cả trên trời,",
        "ko": "여호와 왕좌에서",
        "zh": "耶和華從寶座上，",
        "en": "From Jehovah's lofty throne,",
        "ja": "真理の光"
      },
      {
        "vi": "ngài soi sáng chân lý rạng ngời.",
        "ko": "진리 밝게 비치니",
        "zh": "發出真理的光芒。",
        "en": "How the light of truth has shone.",
        "ja": "心を照らす"
      },
      {
        "vi": "Vì tin Chúa, ta hứa dâng mình,",
        "ko": "믿음 굳게 자라서",
        "zh": "我們信心更堅強，",
        "en": "In our hearts, our faith has grown;",
        "ja": "今この命"
      },
      {
        "vi": "luôn yêu thương Cha và trung kiên.",
        "ko": "우리 생명 바치네.",
        "zh": "從此屬於耶和華。",
        "en": "Our lives we vow to disown.",
        "ja": "神に捧げる"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Nguyện dâng hiến cho Cha trọn đời mình, lòng ta tự quyết.",
        "ko": "주께 헌신하는 길을 택했으니,",
        "zh": "我們決心將一生獻給耶和華，",
        "en": "To God we are dedicated; This is our choice.",
        "ja": "神への献身誓って"
      },
      {
        "vi": "Chúng ta vui trong Cha và cùng mừng trong Con.",
        "ko": "주 안에서 즐거워하리라.",
        "zh": "天天忠貞喜樂地敬奉他。",
        "en": "In him and in Jesus we now rejoice.",
        "ja": "喜び満ちあふれる"
      },
      {
        "vi": "2. Thành tâm chúng ta dâng lời nguyện cầu trình trước ngôi Cha,",
        "ko": "2. 우린 여호와 앞에서 기도했네,",
        "zh": "2．我們向耶和華禱告許下誓言，",
        "en": "2. In prayer we have come before Jehovah to say",
        "ja": "2. 心から祈る エホバに"
      },
      {
        "vi": "từ nay đến mai sau phụng sự riêng Cha.",
        "ko": "주 영원히 섬기겠다고.",
        "zh": "承諾服從他直到永遠。",
        "en": "We'll serve him forever and obey.",
        "ja": "とわに仕えたいと"
      },
      {
        "vi": "Niềm vui sướng nào sánh cho bằng",
        "ko": "주의 이름 지니고",
        "zh": "我們歸附他名下，",
        "en": "It's a joy beyond compare,",
        "ja": "神の名前と"
      },
      {
        "vi": "được chia sẻ cùng với bao người",
        "ko": "왕국 소식 전하니",
        "zh": "努力教人認識他，",
        "en": "One that we are glad to share,",
        "ja": "王国知らせ"
      },
      {
        "vi": "về tin Nước Cha đã cai trị,",
        "ko": "비할 데 없는 기쁨,",
        "zh": "宣揚王國的真理，",
        "en": "As Jehovah's name we bear,",
        "ja": "この喜びを"
      },
      {
        "vi": "danh Giê-hô-va mà ta mang.",
        "ko": "큰 행복을 누리네.",
        "zh": "這喜樂難以言喻。",
        "en": "And Kingdom truth we declare.",
        "ja": "伝えていこう"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Nguyện dâng hiến cho Cha trọn đời mình, lòng ta tự quyết.",
        "ko": "주께 헌신하는 길을 택했으니,",
        "zh": "我們決心將一生獻給耶和華，",
        "en": "To God we are dedicated; This is our choice.",
        "ja": "神への献身誓って"
      },
      {
        "vi": "Chúng ta vui trong Cha và cùng mừng trong Con.",
        "ko": "주 안에서 즐거워하리라.",
        "zh": "天天忠貞喜樂地敬奉他。",
        "en": "In him and in Jesus we now rejoice.",
        "ja": "喜び満ちあふれる"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 43:3; 107:22; Giăng 6:44).",
      "ko": "(시 43:3; 107:22; 요한 6:44 참조)",
      "zh": "（參看詩43:3；107:22；約6:44）",
      "en": "(See also Ps. 43:3; 107:22; John 6:44.)",
      "ja": "（詩 43:3; 107:22; ヨハ 6:44も参照。）"
    }
  },
  {
    "number": 52,
    "sourceSheet": "52",
    "labels": {
      "vi": "BÀI HÁT 52",
      "ko": "52번",
      "zh": "詩歌第52首",
      "en": "SONG 52",
      "ja": "52番"
    },
    "title": {
      "vi": "Sự dâng mình của môn đồ Đấng Ki-tô",
      "ko": "그리스도인 헌신",
      "zh": "基督徒的獻身",
      "en": "Christian Dedication",
      "ja": "クリスチャンの献身"
    },
    "scripture": {
      "vi": "(Hê-bơ-rơ 10:7, 9)",
      "ko": "(히브리서 10:7, 9)",
      "zh": "（希伯來書10:7,9）",
      "en": "(Hebrews 10:7, 9)",
      "ja": "（ヘブライ 10:7，9）"
    },
    "lines": [
      {
        "vi": "1. Chúa Giê-hô-va tạo lập nên đất,",
        "ko": "1. 여호와 지으신 우주",
        "zh": "1．耶和華以大能創造",
        "en": "1. Because Jehovah created",
        "ja": "1. 海も地も空も"
      },
      {
        "vi": "hoàn vũ chính Cha dựng nên,",
        "ko": "참 웅장하구나.",
        "zh": "廣大浩瀚宇宙，",
        "en": "The universe so grand,",
        "ja": "その息吹も"
      },
      {
        "vi": "trời đất chứa bao kỳ công tuyệt diệu,",
        "ko": "온 땅과 하늘, 만물을",
        "zh": "天地萬物全屬於他，",
        "en": "To him belong the earth and sky,",
        "ja": "全てを造った"
      },
      {
        "vi": "hết thảy đều thuộc riêng Cha.",
        "ko": "모두 지으셨네.",
        "zh": "都出自他雙手。",
        "en": "The works of his own hand.",
        "ja": "エホバのもの"
      },
      {
        "vi": "Hãy xem các sinh vật đầy trên đất,",
        "ko": "생명 주신 여호와는",
        "zh": "他賜萬物生命氣息，",
        "en": "The breath of life he has given",
        "ja": "命そのものが"
      },
      {
        "vi": "ngài ban hơi thở sự sống.",
        "ko": "찬양을 받으며",
        "zh": "憑此充分顯明，",
        "en": "And to his creatures shown",
        "ja": "絶えず語る"
      },
      {
        "vi": "Ngài quả xứng đáng cho mọi tạo vật thờ",
        "ko": "그 지으신 모두에게서",
        "zh": "唯有他配受人人讚美，",
        "en": "That worthy is he to have the praise,",
        "ja": "あなたこそ賛美を"
      },
      {
        "vi": "duy nhất trong vũ trụ đời đời.",
        "ko": "숭배받을 분이네.",
        "zh": "崇拜他天經地義。",
        "en": "The worship of all his own.",
        "ja": "受けるべきだと"
      },
      {
        "vi": "2. Giê-su báp-têm trầm mình trong nước,",
        "ko": "2. 예수는 의 이루고자",
        "zh": "2．耶穌以水浸禮表明",
        "en": "2. In water Jesus was baptized",
        "ja": "2. 忠実なイエス"
      },
      {
        "vi": "làm đúng ý Cha thuở xưa.",
        "ko": "물침례 받았네.",
        "zh": "甘願獻出自己。",
        "en": "To righteousness fulfill.",
        "ja": "水に浸る"
      },
      {
        "vi": "Thành kính với Cha, ngài hứa nguyện rằng:",
        "ko": "‘주 뜻 행하러 왔다'고",
        "zh": "他向天父衷心禱告：",
        "en": "In solemn prayer he said to God:",
        "ja": "正しい決意を"
      },
      {
        "vi": "‘Con đến để làm theo Cha'.",
        "ko": "기도를 드렸네.",
        "zh": "「願執行你旨意。」",
        "en": "‘I've come to do your will.'",
        "ja": "表すため"
      },
      {
        "vi": "Chính Cha đổ trên ngài đầy thần khí,",
        "ko": "기름부음받은 예수,",
        "zh": "他在約旦河中受浸，",
        "en": "When he came up from the Jordan",
        "ja": "父見守る中"
      },
      {
        "vi": "vừa khi ra khỏi mặt nước.",
        "ko": "충성을 다하며",
        "zh": "接受上帝委任。",
        "en": "As God's anointed Son,",
        "ja": "子は願った"
      },
      {
        "vi": "Thành trung theo ý Cha, ngài hằng nguyện cầu:",
        "ko": "아버지의 뜻 이뤄지길",
        "zh": "時刻服從天父的命令，",
        "en": "Obedient and loyal he would pray:",
        "ja": "あなたの意志のため"
      },
      {
        "vi": "‘Lạy Cha, xin ý Cha nên trọn'.",
        "ko": "간절히 기도했네.",
        "zh": "一生都對他忠貞。",
        "en": "‘My Father, your will be done.'",
        "ja": "身を差し出すと"
      },
      {
        "vi": "3. Chúng con trước ngôi ngài, Giê-hô-va,",
        "ko": "3. 나는 주를 찬양코자",
        "zh": "3．天父，我們在你面前，",
        "en": "3. We come before you, Jehovah,",
        "ja": "3. 今私たちも"
      },
      {
        "vi": "thành kính hát khen ngợi Cha.",
        "ko": "주 앞에 나아가",
        "zh": "謙卑獻出自己，",
        "en": "To praise your name so great.",
        "ja": "自分を捨て"
      },
      {
        "vi": "Trọn ý chúng con nguyện dâng mình làm",
        "ko": "겸손히 자신 버리고",
        "zh": "樂意按你吩咐而行，",
        "en": "Disowning self, with humble hearts,",
        "ja": "命捧げます"
      },
      {
        "vi": "tôi tớ hầu việc riêng Cha.",
        "ko": "헌신하나이다.",
        "zh": "讚美你的聖名。",
        "en": "Our lives we dedicate.",
        "ja": "エホバ神に"
      },
      {
        "vi": "Biết ơn giá chuộc mà ngài cung cấp,",
        "ko": "아들로 치르게 하신",
        "zh": "天父，你願犧牲愛子，",
        "en": "You gave your only begotten,",
        "ja": "贖いに応え"
      },
      {
        "vi": "là ban Con quý chịu chết.",
        "ko": "그 희생 참 크니",
        "zh": "付出貴重贖價。",
        "en": "Who paid the price so high.",
        "ja": "固く誓う"
      },
      {
        "vi": "Ngài chết cho chúng con vì vậy trọn đời",
        "ko": "나 자신 위해 살지 않고",
        "zh": "我們決心不再為己活，",
        "en": "No longer as living for ourselves,",
        "ja": "生きるのも死ぬのも"
      },
      {
        "vi": "xin sống theo ý Cha trên trời.",
        "ko": "주를 위해 살리다.",
        "zh": "生死都為耶和華。",
        "en": "For you we will live or die.",
        "ja": "あなたのためと"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Mat 16:24; Mác 8:34; Lu 9:23).",
      "ko": "(마태 16:24; 마가 8:34; 누가 9:23 참조)",
      "zh": "（參看太16:24；可8:34；路9:23）",
      "en": "(See also Matt. 16:24; Mark 8:34; Luke 9:23.)",
      "ja": "（マタ 16:24; マル 8:34; ルカ 9:23も参照。）"
    }
  },
  {
    "number": 53,
    "sourceSheet": "53",
    "labels": {
      "vi": "BÀI HÁT 53",
      "ko": "53번",
      "zh": "詩歌第53首",
      "en": "SONG 53",
      "ja": "53番"
    },
    "title": {
      "vi": "Chuẩn bị đi rao giảng",
      "ko": "봉사하기 전에 준비를",
      "zh": "做好準備去傳道",
      "en": "Preparing to Preach",
      "ja": "奉仕に行こう"
    },
    "scripture": {
      "vi": "(Giê-rê-mi 1:17)",
      "ko": "(예레미야 1:17)",
      "zh": "（耶利米書1:17）",
      "en": "(Jeremiah 1:17)",
      "ja": "（エレミヤ 1:17）"
    },
    "lines": [
      {
        "vi": "1. Sớm mai rồi,",
        "ko": "1. 아침이",
        "zh": "1．一早起，",
        "en": "1. Morning comes.",
        "ja": "1. 朝が"
      },
      {
        "vi": "ta chuẩn bị đi,",
        "ko": "밝았네요.",
        "zh": "告訴自己，",
        "en": "Soon we will be",
        "ja": "やって来た"
      },
      {
        "vi": "lên đường báo tin vui từng nhà.",
        "ko": "오늘 봉사하는 날.",
        "zh": "今天要傳好消息。",
        "en": "On our way to preach good news.",
        "ja": "今日も奉仕へ"
      },
      {
        "vi": "Trời u ám bên ngoài",
        "ko": "창밖을 보니",
        "zh": "窗外飄著雨，",
        "en": "But it's dark outside,",
        "ja": "でも雨が"
      },
      {
        "vi": "và cơn mưa bắt đầu rơi.",
        "ko": "비가 내리네요.",
        "zh": "出門真不容易。",
        "en": "And the rain starts to fall.",
        "ja": "降り始めた"
      },
      {
        "vi": "Đường xa khó khăn ngăn trở ta cất bước",
        "ko": "집에서 쉬고픈 마음도",
        "zh": "就算心裡掙扎，別灰心、",
        "en": "It would be easy to stay inside,",
        "ja": "休もうかと迷う"
      },
      {
        "vi": "dời chân đi.",
        "ko": "들지만,",
        "zh": "別放棄。",
        "en": "sleepy-eyed.",
        "ja": "けれど"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Tập rao báo tin, siêng năng và hăng hái.",
        "ko": "긍정적인 생각과 준비,",
        "zh": "正面思考，充分準備好，",
        "en": "Positive thoughts and preparation,",
        "ja": "気持ちを切り替えて"
      },
      {
        "vi": "Cầu xin Chúa luôn bên ta.",
        "ko": "진실한 기도는",
        "zh": "向耶和華禱告，",
        "en": "Praying that we'll succeed;",
        "ja": "準備をして"
      },
      {
        "vi": "Ngài thêm sức ta nên không hề nao núng,",
        "ko": "봉사에 필요한 열심을",
        "zh": "就有力量能每分每秒",
        "en": "This can provide the inspiration,",
        "ja": "勇気を出せるよう"
      },
      {
        "vi": "quyết tâm truyền rao.",
        "ko": "갖게 하죠.",
        "zh": "繼續傳道。",
        "en": "We'll surely need.",
        "ja": "祈ろう"
      },
      {
        "vi": "Cạnh ta có bao nhiêu anh chị thân thiết,",
        "ko": "천사들은 예수 뜻 따라",
        "zh": "耶穌差天使指引陪伴，",
        "en": "We're not alone; the angels guide us.",
        "ja": "イエスが共にいる"
      },
      {
        "vi": "cùng thiên sứ luôn chung vai.",
        "ko": "우릴 인도하고",
        "zh": "永遠不會孤單。",
        "en": "Jesus commands them all.",
        "ja": "天使たちも"
      },
      {
        "vi": "Và Vua Giê-su trên cao hằng đưa lối,",
        "ko": "충실한 벗도 곁에 있어",
        "zh": "有弟兄姐妹做我同伴，",
        "en": "And with a loyal friend beside us,",
        "ja": "仲間もそばにいる"
      },
      {
        "vi": "giúp dân của ngài.",
        "ko": "힘이 나죠.",
        "zh": "不怕困難。",
        "en": "We'll never fall.",
        "ja": "さあ行こう"
      },
      {
        "vi": "2. Ý Cha truyền,",
        "ko": "2. 어느새",
        "zh": "2．別忘記",
        "en": "2. Soon we'll see",
        "ja": "2. きっと"
      },
      {
        "vi": "ta quyết làm theo,",
        "ko": "즐거워요.",
        "zh": "做好準備，",
        "en": "Joy come our way",
        "ja": "楽しく"
      },
      {
        "vi": "trong lòng sướng vui không gì bằng.",
        "ko": "기쁨 가득해져요.",
        "zh": "快樂就一路相隨。",
        "en": "If these things we keep in mind.",
        "ja": "奉仕ができる"
      },
      {
        "vi": "Từ ngôi thánh trên trời,",
        "ko": "내가 흘린 땀,",
        "zh": "要竭盡全力，",
        "en": "And Jehovah sees",
        "ja": "そう 神は"
      },
      {
        "vi": "Giê-hô-va dõi nhìn theo",
        "ko": "열심과 사랑을",
        "zh": "顯出無私愛心，",
        "en": "Ev'ry effort we make,",
        "ja": "見てくださる"
      },
      {
        "vi": "và ghi nhớ bao công việc ta dốc sức",
        "ko": "여호와 소중히 기억해",
        "zh": "每分努力上帝都嘉許、",
        "en": "And he remembers the love we show;",
        "ja": "私たちの示す"
      },
      {
        "vi": "vì yêu thương.",
        "ko": "주시죠.",
        "zh": "都珍惜。",
        "en": "this we know.",
        "ja": "愛を"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Tập rao báo tin, siêng năng và hăng hái.",
        "ko": "긍정적인 생각과 준비,",
        "zh": "正面思考，充分準備好，",
        "en": "Positive thoughts and preparation,",
        "ja": "気持ちを切り替えて"
      },
      {
        "vi": "Cầu xin Chúa luôn bên ta.",
        "ko": "진실한 기도는",
        "zh": "向耶和華禱告，",
        "en": "Praying that we'll succeed;",
        "ja": "準備をして"
      },
      {
        "vi": "Ngài thêm sức ta nên không hề nao núng,",
        "ko": "봉사에 필요한 열심을",
        "zh": "就有力量能每分每秒",
        "en": "This can provide the inspiration,",
        "ja": "勇気を出せるよう"
      },
      {
        "vi": "quyết tâm truyền rao.",
        "ko": "갖게 하죠.",
        "zh": "繼續傳道。",
        "en": "We'll surely need.",
        "ja": "祈ろう"
      },
      {
        "vi": "Cạnh ta có bao nhiêu anh chị thân thiết,",
        "ko": "천사들은 예수 뜻 따라",
        "zh": "耶穌差天使指引陪伴，",
        "en": "We're not alone; the angels guide us.",
        "ja": "イエスが共にいる"
      },
      {
        "vi": "cùng thiên sứ luôn chung vai.",
        "ko": "우릴 인도하고",
        "zh": "永遠不會孤單。",
        "en": "Jesus commands them all.",
        "ja": "天使たちも"
      },
      {
        "vi": "Và Vua Giê-su trên cao hằng đưa lối,",
        "ko": "충실한 벗도 곁에 있어",
        "zh": "有弟兄姐妹做我同伴，",
        "en": "And with a loyal friend beside us,",
        "ja": "仲間もそばにいる"
      },
      {
        "vi": "giúp dân của ngài.",
        "ko": "힘이 나죠.",
        "zh": "不怕困難。",
        "en": "We'll never fall.",
        "ja": "さあ行こう"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Truyền 11:4; Mat 10:5, 7; Lu 10:1; Tít 2:14).",
      "ko": "(전도 11:4; 마태 10:5, 7; 누가 10:1; 디도 2:14 참조)",
      "zh": "（參看傳11:4；太10:5,7；路10:1；多2:14）",
      "en": "(See also Eccl. 11:4; Matt. 10:5, 7; Luke 10:1; Titus 2:14.)",
      "ja": "（伝 11:4; マタ 10:5，7; ルカ 10:1; テト 2:14も参照。）"
    }
  },
  {
    "number": 54,
    "sourceSheet": "54",
    "labels": {
      "vi": "BÀI HÁT 54",
      "ko": "54번",
      "zh": "詩歌第54首",
      "en": "SONG 54",
      "ja": "54番"
    },
    "title": {
      "vi": "\"Đây là đường\"",
      "ko": "‘바로 이 길이다'",
      "zh": "這是正路",
      "en": "\"This Is the Way\"",
      "ja": "「これが道である」"
    },
    "scripture": {
      "vi": "(Ê-sai 30:20, 21)",
      "ko": "(이사야 30:20, 21)",
      "zh": "（以賽亞書30:20,21）",
      "en": "(Isaiah 30:20, 21)",
      "ja": "（イザヤ 30:20，21）"
    },
    "lines": [
      {
        "vi": "1. Một đường luôn luôn",
        "ko": "1. 평화의 길,",
        "zh": "1．和平之路，",
        "en": "1. There is a way of peace,",
        "ja": "1. 進もう"
      },
      {
        "vi": "có an bình, ta biết rõ lâu nay.",
        "ko": "우리 이 길로 걸으리.",
        "zh": "你已認識你已找到，",
        "en": "The way you've come to know.",
        "ja": "平和満ちる道"
      },
      {
        "vi": "Đường thuở xưa Cha đã ban,",
        "ko": "배움으로",
        "zh": "耶穌基督",
        "en": "It is the way you learned,",
        "ja": "イエスが"
      },
      {
        "vi": "mình học đi theo đường ấy.",
        "ko": "깨달은 오래된 이 길,",
        "zh": "親自教導何謂正路，",
        "en": "The way of long ago,",
        "ja": "教えたこの道"
      },
      {
        "vi": "Đường này Giê-su khuyên dạy",
        "ko": "예수께서",
        "zh": "寶貴真理",
        "en": "The way that Jesus taught you",
        "ja": "エホバの"
      },
      {
        "vi": "và gọi ta bước theo ngài.",
        "ko": "가르치신 그 길이네.",
        "zh": "深具價值、流傳千古，",
        "en": "When his voice you heard.",
        "ja": "言葉を学んで"
      },
      {
        "vi": "Thật bình an quá con đường",
        "ko": "주 말씀이",
        "zh": "上帝話語",
        "en": "This is the way of peace,",
        "ja": "見つけた"
      },
      {
        "vi": "tìm được trong bao lời Chúa!",
        "ko": "알려 주는 평화의 길.",
        "zh": "清楚顯示和平之路。",
        "en": "Found in Jehovah's Word.",
        "ja": "平和のこの道"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Đây con đường Cha, đường sự sống đón đợi ta.",
        "ko": "생명의 길, 바로 이 길이니",
        "zh": "這是正路，通往生命之路。",
        "en": "This is the way to life; This is the way.",
        "ja": "これこそ命の道"
      },
      {
        "vi": "Chớ đi chệch ra, dù chỉ trong giây lát thôi.",
        "ko": "한시라도 벗어나지 마라!",
        "zh": "不要懷疑，不要偏離正途。",
        "en": "Don't look aside; Not for a moment stray!",
        "ja": "離れない どんなときも"
      },
      {
        "vi": "Từ trên cao Cha ra lệnh: ‘Đây là lối,",
        "ko": "‘돌아보지 말고 걸어라.",
        "zh": "上帝呼籲：「這就是正路！",
        "en": "God's voice is calling: ‘This is the way;",
        "ja": "エホバは呼び掛ける"
      },
      {
        "vi": "chớ quay ngược xuôi, chú tâm bước theo đường này'.",
        "ko": "이 길이다. 바로 이 길이다.'",
        "zh": "繼續行走這條生命之路！」",
        "en": "Do not look back, for yes, this is the way.'",
        "ja": "「これこそ命の道」"
      },
      {
        "vi": "2. Này đường yêu thương",
        "ko": "2. 사랑의 길,",
        "zh": "2．仁愛之路，",
        "en": "2. There is a way of love,",
        "ja": "2. 歩もう"
      },
      {
        "vi": "Chúa ban, cần chi đi kiếm đâu xa.",
        "ko": "우리 확고히 걸으리.",
        "zh": "你不必再到處尋找，",
        "en": "No need to look around.",
        "ja": "愛あふれる道"
      },
      {
        "vi": "Từ trên ngôi cao, Chúa soi",
        "ko": "하느님의",
        "zh": "偉大天父",
        "en": "God's voice has shown the way",
        "ja": "迷いは"
      },
      {
        "vi": "đường mình mỗi lúc một sáng.",
        "ko": "음성이 알려 주는 길,",
        "zh": "樂意向人提供指導。",
        "en": "He lets himself be found.",
        "ja": "もう みじんもない"
      },
      {
        "vi": "Tình ngài bao la, chân thành,",
        "ko": "따뜻하고",
        "zh": "上帝的愛",
        "en": "His love is full and good;",
        "ja": "豊かな"
      },
      {
        "vi": "hiền từ, ấm áp vô cùng.",
        "ko": "참된 주의 사랑이네.",
        "zh": "充滿良善、多麼溫暖，",
        "en": "His love is warm and true.",
        "ja": "神の愛受けて"
      },
      {
        "vi": "Mình được đưa dẫn trong đời",
        "ko": "모든 일에",
        "zh": "感動我們",
        "en": "This is the way of love;",
        "ja": "ひたすら"
      },
      {
        "vi": "bằng đường yêu thương của Chúa.",
        "ko": "스며 있는 사랑의 길.",
        "zh": "對人表現真摯的愛。",
        "en": "It touches all we do.",
        "ja": "歩む 愛の道"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Đây con đường Cha, đường sự sống đón đợi ta.",
        "ko": "생명의 길, 바로 이 길이니",
        "zh": "這是正路，通往生命之路。",
        "en": "This is the way to life; This is the way.",
        "ja": "これこそ命の道"
      },
      {
        "vi": "Chớ đi chệch ra, dù chỉ trong giây lát thôi.",
        "ko": "한시라도 벗어나지 마라!",
        "zh": "不要懷疑，不要偏離正途。",
        "en": "Don't look aside; Not for a moment stray!",
        "ja": "離れない どんなときも"
      },
      {
        "vi": "Từ trên cao Cha ra lệnh: ‘Đây là lối,",
        "ko": "‘돌아보지 말고 걸어라.",
        "zh": "上帝呼籲：「這就是正路！",
        "en": "God's voice is calling: ‘This is the way;",
        "ja": "エホバは呼び掛ける"
      },
      {
        "vi": "chớ quay ngược xuôi, chú tâm bước theo đường này'.",
        "ko": "이 길이다. 바로 이 길이다.'",
        "zh": "繼續行走這條生命之路！」",
        "en": "Do not look back, for yes, this is the way.'",
        "ja": "「これこそ命の道」"
      },
      {
        "vi": "3. Đường ta đang đi",
        "ko": "3. 생명의 길,",
        "zh": "3．生命之路，",
        "en": "3. There is a way of life,",
        "ja": "3. さあ行こう"
      },
      {
        "vi": "có hy vọng tươi sáng ở tương lai.",
        "ko": "나 후회 없이 걸으리.",
        "zh": "你已找到不必徬徨，",
        "en": "No need to look behind.",
        "ja": "命への道を"
      },
      {
        "vi": "Đường này không sai, cứ đi,",
        "ko": "더 좋은 길",
        "zh": "上帝保證",
        "en": "Our God has promised us:",
        "ja": "後ろへ"
      },
      {
        "vi": "đừng nên quay bước lạc lối.",
        "ko": "없다고 약속하신 길,",
        "zh": "這是人生最佳方向。",
        "en": "No better way we'll find,",
        "ja": "戻ることはない"
      },
      {
        "vi": "Đường nào yêu thương cho bằng,",
        "ko": "사랑, 평화",
        "zh": "感激上帝",
        "en": "No higher way to peace,",
        "ja": "ほかには"
      },
      {
        "vi": "đường nào mang đến an bình?",
        "ko": "이룰 탁월한 길이네.",
        "zh": "顯示和平仁愛途徑，",
        "en": "No finer way to love.",
        "ja": "見いだせない道"
      },
      {
        "vi": "Một đường duy nhất nơi ngài",
        "ko": "주 힘입어",
        "zh": "帶領我們",
        "en": "This is the way to life,",
        "ja": "平和と"
      },
      {
        "vi": "là đường cho ta sự sống.",
        "ko": "걸어가는 생명의 길.",
        "zh": "一路前行得享生命。",
        "en": "Thanks to our God above.",
        "ja": "愛もたらす道"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Đây con đường Cha, đường sự sống đón đợi ta.",
        "ko": "생명의 길, 바로 이 길이니",
        "zh": "這是正路，通往生命之路。",
        "en": "This is the way to life; This is the way.",
        "ja": "これこそ命の道"
      },
      {
        "vi": "Chớ đi chệch ra, dù chỉ trong giây lát thôi.",
        "ko": "한시라도 벗어나지 마라!",
        "zh": "不要懷疑，不要偏離正途。",
        "en": "Don't look aside; Not for a moment stray!",
        "ja": "離れない どんなときも"
      },
      {
        "vi": "Từ trên cao Cha ra lệnh: ‘Đây là lối,",
        "ko": "‘돌아보지 말고 걸어라.",
        "zh": "上帝呼籲：「這就是正路！",
        "en": "God's voice is calling: ‘This is the way;",
        "ja": "エホバは呼び掛ける"
      },
      {
        "vi": "chớ quay ngược xuôi, chú tâm bước theo đường này'.",
        "ko": "이 길이다. 바로 이 길이다.'",
        "zh": "繼續行走這條生命之路！」",
        "en": "Do not look back, for yes, this is the way.'",
        "ja": "「これこそ命の道」"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 32:8; 139:24; Châm 6:23).",
      "ko": "(시 32:8; 139:24; 잠언 6:23 참조)",
      "zh": "（參看詩32:8；139:24；箴6:23）",
      "en": "(See also Ps. 32:8; 139:24; Prov. 6:23.)",
      "ja": "（詩 32:8; 139:24; 格 6:23も参照。）"
    }
  },
  {
    "number": 55,
    "sourceSheet": "55",
    "labels": {
      "vi": "BÀI HÁT 55",
      "ko": "55번",
      "zh": "詩歌第55首",
      "en": "SONG 55",
      "ja": "55番"
    },
    "title": {
      "vi": "Đừng sợ chúng!",
      "ko": "그들을 두려워하지 마라!",
      "zh": "不要害怕他們！",
      "en": "Fear Them Not!",
      "ja": "恐れてはいけない！"
    },
    "scripture": {
      "vi": "(Ma-thi-ơ 10:28)",
      "ko": "(마태복음 10:28)",
      "zh": "（馬太福音10:28）",
      "en": "(Matthew 10:28)",
      "ja": "（マタイ 10:28）"
    },
    "lines": [
      {
        "vi": "1. Nào cùng tiến lên dân sự của ta,",
        "ko": "1. 전진하는 나의 백성,",
        "zh": "1．我的忠僕，勇往向前，",
        "en": "1. Ever onward, O my people,",
        "ja": "1. 王国の知らせ"
      },
      {
        "vi": "hãy rao tin mừng cùng mọi nhà.",
        "ko": "왕국 소식 전하라.",
        "zh": "面對仇敵別驚慌，",
        "en": "Let the Kingdom tidings go.",
        "ja": "恐れず語れ"
      },
      {
        "vi": "Chớ hoang mang vì bọn nghịch thù.",
        "ko": "적을 두려워 말고",
        "zh": "王國信息要宣揚，",
        "en": "Tremble not before our foe.",
        "ja": "敵が行く手を"
      },
      {
        "vi": "Giúp ai yêu sự thật biết tin",
        "ko": "모두에게 알리라.",
        "zh": "告訴人美好希望：",
        "en": "Let all lovers of truth know",
        "ja": "阻むとしても"
      },
      {
        "vi": "hiện giờ chính Con ta là Giê-su",
        "ko": "‘그리스도 이 땅으로",
        "zh": "我的兒子已經作王，",
        "en": "That my reigning Son, Christ Jesus,",
        "ja": "天でキリストは"
      },
      {
        "vi": "đã lên ngôi quăng thù nghịch xa",
        "ko": "사탄 추방했으니,",
        "zh": "將仇敵摔到地上，",
        "en": "To the earth has cast the foe,",
        "ja": "敵を倒した"
      },
      {
        "vi": "và rồi mai đây sẽ giam hắn lại,",
        "ko": "마귀는 곧 결박되고",
        "zh": "很快就會捆綁撒但，",
        "en": "Soon to bind the Devil, Satan,",
        "ja": "間もなく罪から"
      },
      {
        "vi": "giúp muôn dân thoát ách nô lệ.",
        "ko": "너희 풀려나리라.'",
        "zh": "讓受害者得釋放。",
        "en": "Letting all his victims go.",
        "ja": "人 解き放つ"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Chớ hoang mang, hỡi bầy chiên dấu yêu,",
        "ko": "오, 소중한 내 종들아,",
        "zh": "不要害怕敵人恐嚇，",
        "en": "Fear them not, O my beloved,",
        "ja": "恐れなくていい"
      },
      {
        "vi": "dẫu đe dọa từ chúng càng nhiều.",
        "ko": "그들 두려워 마라.",
        "zh": "我的子民要站穩，",
        "en": "Though their boasting threats may fly.",
        "ja": "敵多くても"
      },
      {
        "vi": "Hãy tin ta gìn giữ con đến cùng",
        "ko": "나의 눈동자와 같이",
        "zh": "我必守護忠心僕人，",
        "en": "I will keep my faithful servant",
        "ja": "私が必ず"
      },
      {
        "vi": "tựa như con ngươi mắt ta vậy.",
        "ko": "너희 지켜 주리라.",
        "zh": "如保護眼中瞳仁。",
        "en": "As the apple of my eye.",
        "ja": "あなたを守る"
      },
      {
        "vi": "2. Dù người chống con đông và sức hăng,",
        "ko": "2. 너희 적들 수가 많고",
        "zh": "2．仇敵雖多看似強大，",
        "en": "2. Even though your foes are many,",
        "ja": "2. 敵たちが脅し"
      },
      {
        "vi": "dẫu ngăm đe dùng lời nhục mạ,",
        "ko": "위협하고 욕해도",
        "zh": "對你威脅且辱罵，",
        "en": "Though they threaten and revile,",
        "ja": "欺くときも"
      },
      {
        "vi": "có đôi khi dùng lời nịnh bợ,",
        "ko": "거짓 미소 지으며",
        "zh": "花言巧語哄騙人，",
        "en": "Though they flatter and they smile,",
        "ja": "うその笑顔で"
      },
      {
        "vi": "cố âm mưu lừa gạt dối gian,",
        "ko": "속이려고 하여도",
        "zh": "誘使人迷失方向。",
        "en": "To mislead and to beguile.",
        "ja": "ほほ笑むときも"
      },
      {
        "vi": "đừng sợ chúng hay áp lực bủa vây,",
        "ko": "충성스런 용사들아,",
        "zh": "我的忠僕，鼓起勇氣，",
        "en": "Fear them not, my faithful people,",
        "ja": "恐れず戦え"
      },
      {
        "vi": "hỡi dân luôn trung thành cùng ta,",
        "ko": "박해 두려워 마라.",
        "zh": "面對迫害別恐慌，",
        "en": "Nor their persecution's heat,",
        "ja": "勝利の日まで"
      },
      {
        "vi": "vì rằng ta che chở ai trung thành",
        "ko": "승리하는 그날까지",
        "zh": "我必保護忠貞子民，",
        "en": "For I will preserve the faithful",
        "ja": "私は与える"
      },
      {
        "vi": "đến tương lai chiến thắng huy hoàng.",
        "ko": "너희 보호하리라.",
        "zh": "直到仇敵都滅亡。",
        "en": "Till the vict'ry is complete.",
        "ja": "みなぎる力"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Chớ hoang mang, hỡi bầy chiên dấu yêu,",
        "ko": "오, 소중한 내 종들아,",
        "zh": "不要害怕敵人恐嚇，",
        "en": "Fear them not, O my beloved,",
        "ja": "恐れなくていい"
      },
      {
        "vi": "dẫu đe dọa từ chúng càng nhiều.",
        "ko": "그들 두려워 마라.",
        "zh": "我的子民要站穩，",
        "en": "Though their boasting threats may fly.",
        "ja": "敵多くても"
      },
      {
        "vi": "Hãy tin ta gìn giữ con đến cùng",
        "ko": "나의 눈동자와 같이",
        "zh": "我必守護忠心僕人，",
        "en": "I will keep my faithful servant",
        "ja": "私が必ず"
      },
      {
        "vi": "tựa như con ngươi mắt ta vậy.",
        "ko": "너희 지켜 주리라.",
        "zh": "如保護眼中瞳仁。",
        "en": "As the apple of my eye.",
        "ja": "あなたを守る"
      },
      {
        "vi": "3. Đừng sợ hãi con sẽ bị bỏ quên,",
        "ko": "3. 잊혀졌다 생각 마라,",
        "zh": "3．我是你的盾牌、力量，",
        "en": "3. Never fear you are forgotten;",
        "ja": "3. 忠誠貫き"
      },
      {
        "vi": "bởi ta luôn là nguồn trợ lực.",
        "ko": "내가 너의 힘 되니.",
        "zh": "絕不會將你遺忘！",
        "en": "I am still your strength and shield.",
        "ja": "戦う人を"
      },
      {
        "vi": "Dẫu lâm nguy và bị thiệt mạng,",
        "ko": "싸우다가 죽어도",
        "zh": "即使你失去生命，",
        "en": "Though you die upon the field,",
        "ja": "私が守る"
      },
      {
        "vi": "có ta đây ban sự sống cho.",
        "ko": "정녕 부활되리라.",
        "zh": "復活希望必得享。",
        "en": "Even death to me will yield.",
        "ja": "大盾となり"
      },
      {
        "vi": "Đừng sợ những ai giết được xác thân,",
        "ko": "영혼만은 못 죽이는",
        "zh": "仇敵或許能殺害你，",
        "en": "Fear them not who kill the body",
        "ja": "命を落とした"
      },
      {
        "vi": "hãy tin nơi hy vọng ngày sau.",
        "ko": "그들 두려워 마라.",
        "zh": "永生卻不能奪去。",
        "en": "But cannot destroy the soul.",
        "ja": "忠実な人"
      },
      {
        "vi": "Lòng hằng mong con quyết tâm trung thành",
        "ko": "끝까지 늘 충실하면",
        "zh": "不要放棄、忠貞到底，",
        "en": "To the end may you be faithful;",
        "ja": "私が再び"
      },
      {
        "vi": "để mai đây sống mãi muôn đời!",
        "ko": "너의 상을 주리라!",
        "zh": "我必扶持、保護你。",
        "en": "I will bring you to your goal!",
        "ja": "命与える"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Chớ hoang mang, hỡi bầy chiên dấu yêu,",
        "ko": "오, 소중한 내 종들아,",
        "zh": "不要害怕敵人恐嚇，",
        "en": "Fear them not, O my beloved,",
        "ja": "恐れなくていい"
      },
      {
        "vi": "dẫu đe dọa từ chúng càng nhiều.",
        "ko": "그들 두려워 마라.",
        "zh": "我的子民要站穩，",
        "en": "Though their boasting threats may fly.",
        "ja": "敵多くても"
      },
      {
        "vi": "Hãy tin ta gìn giữ con đến cùng",
        "ko": "나의 눈동자와 같이",
        "zh": "我必守護忠心僕人，",
        "en": "I will keep my faithful servant",
        "ja": "私が必ず"
      },
      {
        "vi": "tựa như con ngươi mắt ta vậy.",
        "ko": "너희 지켜 주리라.",
        "zh": "如保護眼中瞳仁。",
        "en": "As the apple of my eye.",
        "ja": "あなたを守る"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Phục 32:10; Nê 4:14; Thi 59:1; 83:2, 3).",
      "ko": "(신명 32:10; 느헤미야 4:14; 시 59:1; 83:2, 3 참조)",
      "zh": "（參看申32:10；尼4:14；詩59:1；83:2,3）",
      "en": "(See also Deut. 32:10; Neh. 4:14; Ps. 59:1; 83:2, 3.)",
      "ja": "（申 32:10; ネヘ 4:14; 詩 59:1; 83:2，3も参照。）"
    }
  },
  {
    "number": 56,
    "sourceSheet": "56",
    "labels": {
      "vi": "BÀI HÁT 56",
      "ko": "56번",
      "zh": "詩歌第56首",
      "en": "SONG 56",
      "ja": "56番"
    },
    "title": {
      "vi": "Tự chọn bước theo Đức Chúa Trời",
      "ko": "진리를 자신의 것으로 만들라",
      "zh": "將真理珍藏在心裡",
      "en": "Make the Truth Your Own",
      "ja": "真理を生き方にする"
    },
    "scripture": {
      "vi": "(Châm ngôn 3:1, 2)",
      "ko": "(잠언 3:1, 2)",
      "zh": "（箴言3:1,2）",
      "en": "(Proverbs 3:1, 2)",
      "ja": "（格言 3:1，2）"
    },
    "lines": [
      {
        "vi": "1. Chọn bước theo Chúa là một lối sống tốt nhất cho ta,",
        "ko": "1. 더없이 좋은 진리의 길 걸으리.",
        "zh": "1．按真理而行是最佳生活方式，",
        "en": "1. The way of the truth is the best way of living,",
        "ja": "1. 人生は代わりがいない"
      },
      {
        "vi": "quyết đi theo ngài nay do chính chúng ta.",
        "ko": "나 스스로 선택한 이 길.",
        "zh": "你若選擇就必定獲益。",
        "en": "But no one can live your life for you.",
        "ja": "自分自身の道"
      },
      {
        "vi": "Vậy hãy nghe tiếng ngài, hầu ta thêm thông sáng khôn ngoan;",
        "ko": "여호와께서 일러 주시는 대로",
        "zh": "要留心聽從上帝的明智勸告，",
        "en": "So take the advice that Jehovah is giving;",
        "ja": "だからこそ神の言葉を"
      },
      {
        "vi": "vững tâm tin Lời Cha khuyên luôn đúng.",
        "ko": "굳게 믿고 따르리라.",
        "zh": "他的話語真實可靠。",
        "en": "Believe what he tells you is true.",
        "ja": "信じて生きよう"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Hãy sống theo Cha dạy,",
        "ko": "소중한 진리",
        "zh": "要熱愛真理，",
        "en": "Make the truth your own.",
        "ja": "真理学び"
      },
      {
        "vi": "đường chân lý quyết luôn bước theo.",
        "ko": "살아 숨 쉬게 하리.",
        "zh": "按上帝話語而行，",
        "en": "Make it live, yes, make it real.",
        "ja": "生き方にする"
      },
      {
        "vi": "Thật vui sướng vì ta",
        "ko": "이 진리를 내 것",
        "zh": "你若將真理",
        "en": "And then feel the joy",
        "ja": "神からの"
      },
      {
        "vi": "nhận lãnh ơn Cha ban",
        "ko": "만들어서",
        "zh": "珍藏在心裡，",
        "en": "Jehovah gives you",
        "ja": "喜びを"
      },
      {
        "vi": "nếu ta chọn bước đi theo Cha.",
        "ko": "주 기쁨 함께하리.",
        "zh": "必定會滿心歡喜。",
        "en": "When you make the truth your own.",
        "ja": "味わうために"
      },
      {
        "vi": "2. Thờ kính Cha hết lòng, nhiệt tâm rao tin Nước trên cao,",
        "ko": "2. 하느님 위해, 하느님 왕국 위해,",
        "zh": "2．你不辭辛勞，盡全力善用光陰，",
        "en": "2. The effort you make and the time you are spending",
        "ja": "2. 神のため自分捧げる"
      },
      {
        "vi": "hiến dâng bao thời gian, công sức của ta,",
        "ko": "시간 노력 바쳐 일하리.",
        "zh": "努力宣揚王國好消息。",
        "en": "In service to God and his Kingdom",
        "ja": "良い実生み出す道"
      },
      {
        "vi": "đời sẽ luôn thỏa nguyện vì Cha ban ân phước lớn lao,",
        "ko": "보람 느끼며 끝없는 삶 살면서",
        "zh": "你辛勤耕耘，必獲得豐盛收成，",
        "en": "Will yield rich results and a life that's unending,",
        "ja": "永遠の命もたらす"
      },
      {
        "vi": "tương lai huy hoàng không lâu sẽ đến.",
        "ko": "큰 행복을 누리리라.",
        "zh": "得享上帝所賜永生。",
        "en": "A life full of good things to come.",
        "ja": "奉仕続けよう"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Hãy sống theo Cha dạy,",
        "ko": "소중한 진리",
        "zh": "要熱愛真理，",
        "en": "Make the truth your own.",
        "ja": "真理学び"
      },
      {
        "vi": "đường chân lý quyết luôn bước theo.",
        "ko": "살아 숨 쉬게 하리.",
        "zh": "按上帝話語而行，",
        "en": "Make it live, yes, make it real.",
        "ja": "生き方にする"
      },
      {
        "vi": "Thật vui sướng vì ta",
        "ko": "이 진리를 내 것",
        "zh": "你若將真理",
        "en": "And then feel the joy",
        "ja": "神からの"
      },
      {
        "vi": "nhận lãnh ơn Cha ban",
        "ko": "만들어서",
        "zh": "珍藏在心裡，",
        "en": "Jehovah gives you",
        "ja": "喜びを"
      },
      {
        "vi": "nếu ta chọn bước đi theo Cha.",
        "ko": "주 기쁨 함께하리.",
        "zh": "必定會滿心歡喜。",
        "en": "When you make the truth your own.",
        "ja": "味わうために"
      },
      {
        "vi": "3. Dù chúng ta trẻ già, ngài yêu thương như các con thơ",
        "ko": "3. 하느님 앞에 우린 아이 같아서",
        "zh": "3．我們像小孩，缺乏知識和經驗，",
        "en": "3. Compared with our God, we are all little children",
        "ja": "3. いつの日もエホバを頼る"
      },
      {
        "vi": "nên Cha khuyên dạy, đưa tay dẫn dắt đi.",
        "ko": "아버지 인도 필요하네.",
        "zh": "需要上帝引導和勸勉。",
        "en": "And need his direction and counsel.",
        "ja": "祝福される道"
      },
      {
        "vi": "Vậy hãy theo lối ngài, từ trên cao Cha dõi theo ta,",
        "ko": "늘 하느님과 함께 걸어가면서",
        "zh": "與天父同行必得他關心愛護，",
        "en": "So walk ev'ry day with our Father in heaven;",
        "ja": "愛される子供のように"
      },
      {
        "vi": "ban bao ơn lành không sao kể xiết.",
        "ko": "큰 축복을 누리리라.",
        "zh": "享有無窮快樂幸福。",
        "en": "Receive his rich blessing in full.",
        "ja": "エホバと歩もう"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Hãy sống theo Cha dạy,",
        "ko": "소중한 진리",
        "zh": "要熱愛真理，",
        "en": "Make the truth your own.",
        "ja": "真理学び"
      },
      {
        "vi": "đường chân lý quyết luôn bước theo.",
        "ko": "살아 숨 쉬게 하리.",
        "zh": "按上帝話語而行，",
        "en": "Make it live, yes, make it real.",
        "ja": "生き方にする"
      },
      {
        "vi": "Thật vui sướng vì ta",
        "ko": "이 진리를 내 것",
        "zh": "你若將真理",
        "en": "And then feel the joy",
        "ja": "神からの"
      },
      {
        "vi": "nhận lãnh ơn Cha ban",
        "ko": "만들어서",
        "zh": "珍藏在心裡，",
        "en": "Jehovah gives you",
        "ja": "喜びを"
      },
      {
        "vi": "nếu ta chọn bước đi theo Cha.",
        "ko": "주 기쁨 함께하리.",
        "zh": "必定會滿心歡喜。",
        "en": "When you make the truth your own.",
        "ja": "味わうために"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 26:3; Châm 8:35; 15:31; Giăng 8:31, 32).",
      "ko": "(시 26:3; 잠언 8:35; 15:31; 요한 8:31, 32 참조)",
      "zh": "（參看詩26:3；箴8:35；15:31；約8:31,32）",
      "en": "(See also Ps. 26:3; Prov. 8:35; 15:31; John 8:31, 32.)",
      "ja": "（詩 26:3; 格 8:35; 15:31; ヨハ 8:31，32も参照。）"
    }
  },
  {
    "number": 57,
    "sourceSheet": "57",
    "labels": {
      "vi": "BÀI HÁT 57",
      "ko": "57번",
      "zh": "詩歌第57首",
      "en": "SONG 57",
      "ja": "57番"
    },
    "title": {
      "vi": "Rao giảng cho mọi loại người",
      "ko": "모든 부류의 사람들에게 전파하라",
      "zh": "向各種各樣的人傳道",
      "en": "Preaching to All Sorts of People",
      "ja": "あらゆる人に伝道する"
    },
    "scripture": {
      "vi": "(1 Ti-mô-thê 2:4)",
      "ko": "(디모데 전서 2:4)",
      "zh": "（提摩太前書2:4）",
      "en": "(1 Timothy 2:4)",
      "ja": "（テモテ第一 2:4）"
    },
    "lines": [
      {
        "vi": "1. Mình muốn noi gương của Cha từ nhân, tốt lành.",
        "ko": "1. 우리는 정말 닮고 싶어요,",
        "zh": "1．發自內心向耶和華學習，",
        "en": "1. We really want to imitate our God,",
        "ja": "1. エホバ神に倣って"
      },
      {
        "vi": "Ngài quan tâm, đoái thương muôn dân, không thiên vị",
        "ko": "편파적이지 않은 하느님.",
        "zh": "我們要待人公平、不偏心。",
        "en": "To be impartial, as we know he is.",
        "ja": "あらゆる人に語る"
      },
      {
        "vi": "và hằng mong sao người từ muôn nơi hay biết",
        "ko": "누구라도 기회를 주시고",
        "zh": "上帝希望拯救人的生命，",
        "en": "To save all sorts of people is his will;",
        "ja": "公平な神エホバ"
      },
      {
        "vi": "triển vọng mai sau được cứu qua bao khổ đau.",
        "ko": "가족으로 다 받아 주시죠.",
        "zh": "邀請所有人成為他子民。",
        "en": "He welcomes all to come and to be his.",
        "ja": "人々を引き寄せる"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Hãy loan báo cho dân gần xa,",
        "ko": "겉모습이 아니라",
        "zh": "不管人來自何方，",
        "en": "It's the person, not the place;",
        "ja": "人の心と"
      },
      {
        "vi": "chớ thành kiến hay phân biệt ai.",
        "ko": "속사람을 보아요.",
        "zh": "只要他打開心房，",
        "en": "It's the heart and not the face.",
        "ja": "人の外見"
      },
      {
        "vi": "Bất cứ ai ta đều giảng rao thông điệp Cha.",
        "ko": "그게 더 중요한 걸 알지요.",
        "zh": "將真理向所有民族傳揚。",
        "en": "God's message to all people we extend.",
        "ja": "大切なのは心"
      },
      {
        "vi": "Với yêu thương, quan tâm thật lòng,",
        "ko": "전해 주고 싶어요,",
        "zh": "別人生命我看重，",
        "en": "So because we really care,",
        "ja": "あらゆる人に"
      },
      {
        "vi": "chúng ta siêng năng đi làm chứng:",
        "ko": "\"어떤 사람이라도",
        "zh": "向各種各樣人說：",
        "en": "We keep preaching ev'rywhere:",
        "ja": "伝えていこう"
      },
      {
        "vi": "\"Mọi dân đến với Cha, nên bạn thân của ngài\".",
        "ko": "하느님 친구 될 수 있다\"고.",
        "zh": "「你們都能做上帝的朋友。」",
        "en": "\"All sorts of people can become God's friend.\"",
        "ja": "「神の友になれる」と"
      },
      {
        "vi": "2. Giê-hô-va không hề xem màu da, sắc tộc,",
        "ko": "2. 언제, 어디서 누굴 만나든",
        "zh": "2．無論對方有怎樣的經歷，",
        "en": "2. It doesn't matter where they may be found",
        "ja": "2. エホバはよく見ている"
      },
      {
        "vi": "ngoại hình hay những chi ta xem qua bên ngoài.",
        "ko": "첫인상 어떻게 느껴지든",
        "zh": "或者有不同文化與背景，",
        "en": "Or what at first they might appear to be.",
        "ja": "人の心の中を"
      },
      {
        "vi": "Điều ngài quan tâm là lòng bên trong sâu kín.",
        "ko": "중요한 건 여호와 보시는",
        "zh": "還是會教他們認識聖經，",
        "en": "What really counts is what they are at heart—",
        "ja": "どんな人であろうと"
      },
      {
        "vi": "Từ trên ngôi cao, ngài thấy tâm tư người ta.",
        "ko": "그 속사람, 그 마음이지요.",
        "zh": "因為耶和華看人的內心。",
        "en": "The inner self, the one Jehovah sees.",
        "ja": "良い知らせ伝えよう"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Hãy loan báo cho dân gần xa,",
        "ko": "겉모습이 아니라",
        "zh": "不管人來自何方，",
        "en": "It's the person, not the place;",
        "ja": "人の心と"
      },
      {
        "vi": "chớ thành kiến hay phân biệt ai.",
        "ko": "속사람을 보아요.",
        "zh": "只要他打開心房，",
        "en": "It's the heart and not the face.",
        "ja": "人の外見"
      },
      {
        "vi": "Bất cứ ai ta đều giảng rao thông điệp Cha.",
        "ko": "그게 더 중요한 걸 알지요.",
        "zh": "將真理向所有民族傳揚。",
        "en": "God's message to all people we extend.",
        "ja": "大切なのは心"
      },
      {
        "vi": "Với yêu thương, quan tâm thật lòng,",
        "ko": "전해 주고 싶어요,",
        "zh": "別人生命我看重，",
        "en": "So because we really care,",
        "ja": "あらゆる人に"
      },
      {
        "vi": "chúng ta siêng năng đi làm chứng:",
        "ko": "\"어떤 사람이라도",
        "zh": "向各種各樣人說：",
        "en": "We keep preaching ev'rywhere:",
        "ja": "伝えていこう"
      },
      {
        "vi": "\"Mọi dân đến với Cha, nên bạn thân của ngài\".",
        "ko": "하느님 친구 될 수 있다\"고.",
        "zh": "「你們都能做上帝的朋友。」",
        "en": "\"All sorts of people can become God's friend.\"",
        "ja": "「神の友になれる」と"
      },
      {
        "vi": "3. Người giống chiên nhu mì luôn được Cha đón chào.",
        "ko": "3. 이 세상의 길 버린 사람들",
        "zh": "3．每當有人改變從前生活，",
        "en": "3. Jehovah welcomes all who make the choice",
        "ja": "3. エホバに仕えるため"
      },
      {
        "vi": "Họ rời xa thế gian, chuyên tâm đi theo ngài.",
        "ko": "여호와 모두 안아 주시죠.",
        "zh": "上帝樂意親近伸出雙手。",
        "en": "To leave the world and all its ways behind.",
        "ja": "生き方変える人は"
      },
      {
        "vi": "Điều Cha rao ra, mình cùng hăng say loan báo.",
        "ko": "내가 받은 이 소중한 진리",
        "zh": "我們努力幫助人人得救，",
        "en": "This we have learned, and this we want to share,",
        "ja": "エホバに喜ばれる"
      },
      {
        "vi": "Lòng ta hân hoan làm chứng cho dân mọi nơi.",
        "ko": "모두에게 전하고 싶어요.",
        "zh": "信息傳遍世上每個角落。",
        "en": "And so we preach to people of all kinds.",
        "ja": "そのことを伝えたい"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Hãy loan báo cho dân gần xa,",
        "ko": "겉모습이 아니라",
        "zh": "不管人來自何方，",
        "en": "It's the person, not the place;",
        "ja": "人の心と"
      },
      {
        "vi": "chớ thành kiến hay phân biệt ai.",
        "ko": "속사람을 보아요.",
        "zh": "只要他打開心房，",
        "en": "It's the heart and not the face.",
        "ja": "人の外見"
      },
      {
        "vi": "Bất cứ ai ta đều giảng rao thông điệp Cha.",
        "ko": "그게 더 중요한 걸 알지요.",
        "zh": "將真理向所有民族傳揚。",
        "en": "God's message to all people we extend.",
        "ja": "大切なのは心"
      },
      {
        "vi": "Với yêu thương, quan tâm thật lòng,",
        "ko": "전해 주고 싶어요,",
        "zh": "別人生命我看重，",
        "en": "So because we really care,",
        "ja": "あらゆる人に"
      },
      {
        "vi": "chúng ta siêng năng đi làm chứng:",
        "ko": "\"어떤 사람이라도",
        "zh": "向各種各樣人說：",
        "en": "We keep preaching ev'rywhere:",
        "ja": "伝えていこう"
      },
      {
        "vi": "\"Mọi dân đến với Cha, nên bạn thân của ngài\".",
        "ko": "하느님 친구 될 수 있다\"고.",
        "zh": "「你們都能做上帝的朋友。」",
        "en": "\"All sorts of people can become God's friend.\"",
        "ja": "「神の友になれる」と"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Giăng 12:32; Công 10:34; 1 Ti 4:10; Tít 2:11).",
      "ko": "(요한 12:32; 사도 10:34; 디모데 전서 4:10; 디도 2:11 참조)",
      "zh": "（參看約12:32；徒10:34；提前4:10；多2:11）",
      "en": "(See also John 12:32; Acts 10:34; 1 Tim. 4:10; Titus 2:11.)",
      "ja": "（ヨハ 12:32; 使徒 10:34; テモ一 4:10; テト 2:11も参照。）"
    }
  },
  {
    "number": 58,
    "sourceSheet": "58",
    "labels": {
      "vi": "BÀI HÁT 58",
      "ko": "58번",
      "zh": "詩歌第58首",
      "en": "SONG 58",
      "ja": "58番"
    },
    "title": {
      "vi": "Tìm kiếm người yêu chuộng sự bình an",
      "ko": "평화의 벗들을 찾으라",
      "zh": "尋找和平之友",
      "en": "Searching for Friends of Peace",
      "ja": "平和を望む人を探す"
    },
    "scripture": {
      "vi": "(Lu-ca 10:6)",
      "ko": "(누가복음 10:6)",
      "zh": "（路加福音10:6）",
      "en": "(Luke 10:6)",
      "ja": "（ルカ 10:6）"
    },
    "lines": [
      {
        "vi": "1. ‘Tin mừng rao khắp nơi', Chúa Giê-su từng khuyên.",
        "ko": "1. ‘진리 전하라' 명하신 예수,",
        "zh": "1．不管豔陽照或塵土飛揚，",
        "en": "1. Jesus commanded: ‘Let the truth be heard.'",
        "ja": "1. 良い知らせ伝えよう"
      },
      {
        "vi": "Dẫu nắng trưa hè, ngài không nghỉ ngơi,",
        "ko": "타는 햇살, 먼짓길도",
        "zh": "耶穌依然走遍四方，把真理向人人傳講。",
        "en": "In summer heat, on dusty roads,",
        "ja": "イエスが命じた"
      },
      {
        "vi": "nhiệt tâm đi kiếm tìm ai giống chiên;",
        "ko": "그분을 막지 못했네.",
        "zh": "他深愛所有願意聽的人，",
        "en": "He let all hear Jehovah's word.",
        "ja": "大切な務め"
      },
      {
        "vi": "ân cần chăm sóc chiên, bảo ban, khuyên dạy chiên;",
        "ko": "양들을 깊이 사랑하시어",
        "zh": "尋找他們，打從清晨，一直到黃昏。",
        "en": "He loved God's sheep and called to ev'ryone.",
        "ja": "日の出から日暮れまで"
      },
      {
        "vi": "sốt sắng đêm ngày truyền danh thánh Cha,",
        "ko": "새벽부터 밤늦도록",
        "zh": "無論逐戶或在街上，我們將好消息宣揚，",
        "en": "He searched the land from the sunrise",
        "ja": "イエスは伝えた"
      },
      {
        "vi": "không quản chi khó khăn.",
        "ko": "전파하셨네.",
        "zh": "告訴所有人未來充滿希望。",
        "en": "‘til the day was done.",
        "ja": "人々に"
      },
      {
        "vi": "Gặp bất cứ ai, chúng ta rao truyền,",
        "ko": "집집에서, 거리에서",
        "zh": "（副歌）",
        "en": "From door to door and in the street,",
        "ja": "家から家へと"
      },
      {
        "vi": "dù phố xá đông hay chốn thôn làng,",
        "ko": "모두에게 다 전하리,",
        "zh": "尋找所有",
        "en": "We share with ev'ryone we meet",
        "ja": "人から人へと"
      },
      {
        "vi": "Lời Chúa ủi an, thắp lên hy vọng cho các dân.",
        "ko": "이 모든 슬픔 사라질 거라고.",
        "zh": "想與上帝做朋友的人，",
        "en": "The news that soon man's troubles all will be gone.",
        "ja": "語ろう イエスに倣い"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "他們心中",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Kiếm tìm những ai",
        "ko": "찾을 거야,",
        "zh": "期盼進入得救的大門。",
        "en": "Searching the world",
        "ja": "探そう"
      },
      {
        "vi": "yêu chuộng bình an từ các dân xa gần.",
        "ko": "어딘가 있을 평화의 벗.",
        "zh": "救生責任",
        "en": "For friends of peace in ev'ry nation,",
        "ja": "平和を望む人"
      },
      {
        "vi": "Chẳng ngại nắng mưa,",
        "ko": "꼭 찾으리,",
        "zh": "決心完成。",
        "en": "Searching to find",
        "ja": "探そう"
      },
      {
        "vi": "mong gặp người nghe chân lý mang hy vọng.",
        "ko": "구원받도록 찾을 거야.",
        "zh": "2．時間不回頭，要加緊腳步。",
        "en": "A heart inclined toward salvation,",
        "ja": "一人も残さずに"
      },
      {
        "vi": "Kiếm tìm khắp nơi,",
        "ko": "최선 다해,",
        "zh": "無數的人需要幫助，才能得到永恆幸福。",
        "en": "Wanting to leave",
        "ja": "世界の"
      },
      {
        "vi": "tận tâm giảng rao.",
        "ko": "후회 없이.",
        "zh": "要持續助人，愛心是動力。",
        "en": "No stone unturned.",
        "ja": "果てまで"
      },
      {
        "vi": "2. Nay thời gian chóng qua, chúng ta mau khẩn trương.",
        "ko": "2. 정해진 시간, 수많은 사람",
        "zh": "聖經信息能夠安慰破碎的心靈。",
        "en": "2. Time waits for no one, so the search goes on.",
        "ja": "2. 最善を尽くしたい"
      },
      {
        "vi": "Sốt sắng rao truyền mọi dân biết tin.",
        "ko": "영혼 다해 난 찾으리,",
        "zh": "找遍城市以及鄉間，當願意聽的人出現，",
        "en": "A million hearts, a million lives,",
        "ja": "残りの時間は"
      },
      {
        "vi": "Tình yêu thôi thúc mình luôn quyết tâm.",
        "ko": "단 한 사람만이라도.",
        "zh": "喜樂之心激勵我不斷向前。",
        "en": "We give our all to save just one.",
        "ja": "あとわずかだから"
      },
      {
        "vi": "Thăm lại ai giống chiên, sẻ chia thông điệp Cha.",
        "ko": "마음이 찢긴 많은 사람들",
        "zh": "（副歌）",
        "en": "Love is the force that makes us call again.",
        "ja": "1人でも救うため"
      },
      {
        "vi": "Cố gắng xoa dịu lòng đang đớn đau,",
        "ko": "사랑하는 마음 다해",
        "zh": "尋找所有",
        "en": "A wounded heart can be healed,",
        "ja": "再び訪ねる"
      },
      {
        "vi": "tâm hồn đang nát tan.",
        "ko": "찾아가리라.",
        "zh": "想與上帝做朋友的人，",
        "en": "and broken lives can mend.",
        "ja": "愛込めて"
      },
      {
        "vi": "Dù bất cứ đâu, chốn quê, đô thành,",
        "ko": "도시에서, 마을에서",
        "zh": "他們心中",
        "en": "We search the towns and city squares,",
        "ja": "町から町へと"
      },
      {
        "vi": "tìm kiếm những ai khao khát tin mừng.",
        "ko": "좋은 사람 찾아내면",
        "zh": "期盼進入得救的大門。",
        "en": "And when we find someone who cares,",
        "ja": "人から人へと"
      },
      {
        "vi": "Hào hứng, sướng vui, chúng ta không ngừng loan báo tin.",
        "ko": "이 기쁜 마음 계속 힘내게 해.",
        "zh": "救生責任",
        "en": "The joy we feel inspires us to go on.",
        "ja": "語ろう 救いの知らせ"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "決心完成。",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Kiếm tìm những ai",
        "ko": "찾을 거야,",
        "zh": "（參看賽52:7；太28:19,20；路8:1；羅10:10）",
        "en": "Searching the world",
        "ja": "探そう"
      },
      {
        "vi": "yêu chuộng bình an từ các dân xa gần.",
        "ko": "어딘가 있을 평화의 벗.",
        "zh": "",
        "en": "For friends of peace in ev'ry nation,",
        "ja": "平和を望む人"
      },
      {
        "vi": "Chẳng ngại nắng mưa,",
        "ko": "꼭 찾으리,",
        "zh": "",
        "en": "Searching to find",
        "ja": "探そう"
      },
      {
        "vi": "mong gặp người nghe chân lý mang hy vọng.",
        "ko": "구원받도록 찾을 거야.",
        "zh": "",
        "en": "A heart inclined toward salvation,",
        "ja": "一人も残さずに"
      },
      {
        "vi": "Kiếm tìm khắp nơi,",
        "ko": "최선 다해,",
        "zh": "",
        "en": "Wanting to leave",
        "ja": "世界の"
      },
      {
        "vi": "tận tâm giảng rao.",
        "ko": "후회 없이.",
        "zh": "",
        "en": "No stone unturned.",
        "ja": "果てまで"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Ê-sai 52:7; Mat 28:19, 20; Lu 8:1; Rô 10:10).",
      "ko": "(이사야 52:7; 마태 28:19, 20; 누가 8:1; 로마 10:10 참조)",
      "zh": "",
      "en": "(See also Isa. 52:7; Matt. 28:19, 20; Luke 8:1; Rom. 10:10.)",
      "ja": "（イザ 52:7; マタ 28:19，20; ルカ 8:1; ロマ 10:10も参照。）"
    }
  },
  {
    "number": 59,
    "sourceSheet": "59",
    "labels": {
      "vi": "BÀI HÁT 59",
      "ko": "59번",
      "zh": "詩歌第59首",
      "en": "SONG 59",
      "ja": "59番"
    },
    "title": {
      "vi": "Hãy cùng tôi ngợi khen Đức Giê-hô-va",
      "ko": "우리 함께 여호와를 찬양하세",
      "zh": "一同讚美耶和華！",
      "en": "Praise Jah With Me",
      "ja": "共にヤハを賛美しましょう"
    },
    "scripture": {
      "vi": "(Thi thiên 146:2)",
      "ko": "(시편 146:2)",
      "zh": "（詩篇146:2）",
      "en": "(Psalm 146:2)",
      "ja": "（詩編 146:2）"
    },
    "lines": [
      {
        "vi": "1. Ca cùng với tôi khen Giê-hô-va!",
        "ko": "1. 찬양하라, 여호와를!",
        "zh": "1．一同高歌讚頌上帝，",
        "en": "1. Praise Jah with me; Come! Let us sing!",
        "ja": "1. 歌おう 声上げ"
      },
      {
        "vi": "Ngài ban sức sống, hơi thở, thêm bao điều hay.",
        "ko": "생명과 모든 것 주시는 분.",
        "zh": "感謝他賜我們生命、氣息。",
        "en": "He gives us life, breath, and ev'ry good thing.",
        "ja": "共にヤハ賛美しよう"
      },
      {
        "vi": "Đêm ngày chúng ta ca tụng thánh danh.",
        "ko": "주 이름을 드높이고",
        "zh": "天天宣揚上帝聖名，",
        "en": "Each day and night, His name we bless,",
        "ja": "豊かなその愛"
      },
      {
        "vi": "Tình yêu Chúa lớn với uy quyền đáng ngợi khen.",
        "ko": "그 능력, 그 사랑 말하여라.",
        "zh": "他的愛心、大能配受崇敬。",
        "en": "Praising his love and his almightiness.",
        "ja": "偉大なそのお名前"
      },
      {
        "vi": "Hòa chung tiếng hát, ta cùng nhau khen danh ngài.",
        "ko": "날마다 그 이름 찬양하세.",
        "zh": "一同讚美耶和華的聖名！",
        "en": "We sing his praise, and his name we confess.",
        "ja": "喜んで伝えよう"
      },
      {
        "vi": "2. Khen Giê-hô-va!",
        "ko": "2. 찬양하라, 여호와를.",
        "zh": "2．一同高歌讚頌天父，",
        "en": "2. Praise Jah with me;",
        "ja": "2. 祈ろう 感謝し"
      },
      {
        "vi": "Cha hằng lắng nghe mọi tôi tớ đến kêu cầu Cha bao ngày đêm.",
        "ko": "우리를 돌보아 주시는 분.",
        "zh": "一切需要他都樂意供應。",
        "en": "He satisfies. He hears our prayers as our needs he supplies.",
        "ja": "共にヤハ賛美しよう"
      },
      {
        "vi": "Cha trợ sức cho tâm hồn đớn đau.",
        "ko": "강한 팔로 힘 주시고",
        "zh": "他賜力量扶持我們，",
        "en": "His mighty arm Strengthens the weak;",
        "ja": "聖なる力で"
      },
      {
        "vi": "Ngài ban sức mới để dân ngài vững mạnh thêm.",
        "ko": "온유한 자에게 영 주시네.",
        "zh": "樂意幫助所有謙卑的人。",
        "en": "His holy spirit sustains all the meek.",
        "ja": "優しく人支える"
      },
      {
        "vi": "Mình rao khắp chốn uy quyền Cha, thánh danh ngài.",
        "ko": "여호와 그 이름 찬양하세.",
        "zh": "一同讚美耶和華的大能！",
        "en": "His name we praise; Of his power we speak.",
        "ja": "その力知らせよう"
      },
      {
        "vi": "3. Khen Giê-hô-va!",
        "ko": "3. 찬양하라, 여호와를.",
        "zh": "3．一同高歌讚頌上帝，",
        "en": "3. Praise Jah with me;",
        "ja": "3. 喜び仕えよう"
      },
      {
        "vi": "Cha thật tốt thay. Ngài an ủi những ai thành trung, tin cậy Cha.",
        "ko": "공의로 위로해 주시는 분.",
        "zh": "他必消除痛苦、伸張正義。",
        "en": "Our God is just. He brings us comfort, in him we can trust.",
        "ja": "共にヤハ賛美しよう"
      },
      {
        "vi": "Đau buồn, khóc than, mai ngài xóa tan.",
        "ko": "모든 일을 바로잡고",
        "zh": "他的旨意必定達成，",
        "en": "Wrongs he will right; Hearts he will heal.",
        "ja": "王国来る時"
      },
      {
        "vi": "Mọi dân sẽ thấy phước ân nhờ Nước của Cha.",
        "ko": "왕국의 축복을 베푸시리.",
        "zh": "王國將為人類帶來福分。",
        "en": "Rich Kingdom blessings all mankind will feel.",
        "ja": "祝福満ちあふれる"
      },
      {
        "vi": "Nào ta sốt sắng, vui mừng khen Giê-hô-va!",
        "ko": "다 함께 여호와 찬양하세!",
        "zh": "一同熱心讚美偉大真神！",
        "en": "Come let us praise him with joy and with zeal!",
        "ja": "さあヤハをたたえよう"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 94:18, 19; 145:21; 147:1; 150:2; Công 17:25).",
      "ko": "(시 94:18, 19; 145:21; 147:1; 150:2; 사도 17:25 참조)",
      "zh": "（參看詩94:18,19；145:21；147:1；150:2；徒17:25）",
      "en": "(See also Ps. 94:18, 19; 145:21; 147:1; 150:2; Acts 17:25.)",
      "ja": "（詩 94:18，19; 145:21; 147:1; 150:2; 使徒 17:25も参照。）"
    }
  },
  {
    "number": 60,
    "sourceSheet": "60",
    "labels": {
      "vi": "BÀI HÁT 60",
      "ko": "60번",
      "zh": "詩歌第60首",
      "en": "SONG 60",
      "ja": "60番"
    },
    "title": {
      "vi": "Thông điệp mang lại sự sống",
      "ko": "생명이 달려 있는 소식",
      "zh": "拯救生命的信息",
      "en": "It Means Their Life",
      "ja": "命を意味する知らせ"
    },
    "scripture": {
      "vi": "(Ê-xê-chi-ên 3:17-19)",
      "ko": "(에스겔 3:17-19)",
      "zh": "（以西結書3:17-19）",
      "en": "(Ezekiel 3:17-19)",
      "ja": "（エゼキエル 3:17-19）"
    },
    "lines": [
      {
        "vi": "1. Này là năm Giê-hô-va",
        "ko": "1. 주의 선의의 해",
        "zh": "1．耶和華大日子快來臨，",
        "en": "1. In this year of goodwill",
        "ja": "1. 扉はまだ"
      },
      {
        "vi": "vẫn còn đang ban ơn mọi dân.",
        "ko": "이제 곧 끝나 가니",
        "zh": "審判已近。",
        "en": "by our God, all need to hear",
        "ja": "開かれている"
      },
      {
        "vi": "Rồi mai đây ngài ra tay",
        "ko": "경고의 소식을",
        "zh": "努力讓所有人都聽見",
        "en": "That the day of his anger",
        "ja": "聞いて 真理"
      },
      {
        "vi": "phán xét ai không theo đường ngay.",
        "ko": "모두에게 전하리.",
        "zh": "寶貴真理。",
        "en": "will come, and it is near.",
        "ja": "求める人に"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Thông điệp Nước Trời mang lại sự sống",
        "ko": "이웃 생명, 내 생명 다",
        "zh": "傳好消息，能救自己，",
        "en": "It means their life, but not just theirs;",
        "ja": "命を意味する"
      },
      {
        "vi": "dành cho muôn dân với cho mình.",
        "ko": "이 일에 달려 있네.",
        "zh": "也拯救別人生命。",
        "en": "It means our own life as well.",
        "ja": "エホバの知らせ"
      },
      {
        "vi": "Cảnh báo người ta tránh xa đường xấu.",
        "ko": "순종하여 살 수 있게",
        "zh": "救生信息，傳遍全地，",
        "en": "It means their life if they obey,",
        "ja": "心を尽くして"
      },
      {
        "vi": "Truyền rao khắp chốn cho dân nơi nơi",
        "ko": "모두에게 꼭 전하리,",
        "zh": "幫助別人聽從上帝，",
        "en": "So all the nations we must tell;",
        "ja": "伝えよう 今日も"
      },
      {
        "vi": "biết tin này.",
        "ko": "전하리.",
        "zh": "得生命。",
        "en": "We must tell.",
        "ja": "明日も"
      },
      {
        "vi": "2. Người thời nay đang cần nghe",
        "ko": "2. 우리는 온 땅에",
        "zh": "2．要熱心盡全力將信息",
        "en": "2. There's a message to preach,",
        "ja": "2. どんな壁も"
      },
      {
        "vi": "những lời mang yên vui, ủi an.",
        "ko": "좋은 소식 전하네,",
        "zh": "廣傳出去，",
        "en": "so we spread it all abroad.",
        "ja": "乗り越えられる"
      },
      {
        "vi": "Nào cùng đi mời muôn dân",
        "ko": "와서 하느님과",
        "zh": "邀請人與上帝建立起",
        "en": "We invite all to come and",
        "ja": "できることを"
      },
      {
        "vi": "đến với Cha yêu thương, từ nhân.",
        "ko": "화해할 수 있다고.",
        "zh": "深厚友誼。",
        "en": "be reconciled to God.",
        "ja": "探していけば"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Thông điệp Nước Trời mang lại sự sống",
        "ko": "이웃 생명, 내 생명 다",
        "zh": "傳好消息，能救自己，",
        "en": "It means their life, but not just theirs;",
        "ja": "命を意味する"
      },
      {
        "vi": "dành cho muôn dân với cho mình.",
        "ko": "이 일에 달려 있네.",
        "zh": "也拯救別人生命。",
        "en": "It means our own life as well.",
        "ja": "エホバの知らせ"
      },
      {
        "vi": "Cảnh báo người ta tránh xa đường xấu.",
        "ko": "순종하여 살 수 있게",
        "zh": "救生信息，傳遍全地，",
        "en": "It means their life if they obey,",
        "ja": "心を尽くして"
      },
      {
        "vi": "Truyền rao khắp chốn cho dân nơi nơi",
        "ko": "모두에게 꼭 전하리,",
        "zh": "幫助別人聽從上帝，",
        "en": "So all the nations we must tell;",
        "ja": "伝えよう 今日も"
      },
      {
        "vi": "biết tin này.",
        "ko": "전하리.",
        "zh": "得生命。",
        "en": "We must tell.",
        "ja": "明日も"
      },
      {
        "vi": "(ĐOẠN CHUYỂN)",
        "ko": "(브리지)",
        "zh": "（過門）",
        "en": "(BRIDGE)",
        "ja": "（間奏）"
      },
      {
        "vi": "Ta chuyên cần, quyết tâm làm chứng",
        "ko": "긴급히 해야 할 일,",
        "zh": "要加速救生腳步，",
        "en": "It's urgent, it's important,",
        "ja": "真理求めて"
      },
      {
        "vi": "hầu người như chiên nghe theo tin mừng.",
        "ko": "생명이 달려 있는 일.",
        "zh": "樂意付出不怕辛苦。",
        "en": "That people listen, learn, and live.",
        "ja": "待ち続ける人"
      },
      {
        "vi": "Không lơ là báo thông điệp ấy,",
        "ko": "더없이 중요하니",
        "zh": "告訴人，教導他們，",
        "en": "We tell them, and we teach them;",
        "ja": "探し救おう"
      },
      {
        "vi": "dạy người muôn phương phục tùng theo Chúa.",
        "ko": "내 모든 것 바치리라.",
        "zh": "宣揚真理絕不放棄。",
        "en": "Life-giving truth we freely give.",
        "ja": "急ごう 奉仕へ"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Thông điệp Nước Trời mang lại sự sống",
        "ko": "이웃 생명, 내 생명 다",
        "zh": "傳好消息，能救自己，",
        "en": "It means their life, but not just theirs;",
        "ja": "命を意味する"
      },
      {
        "vi": "dành cho muôn dân với cho mình.",
        "ko": "이 일에 달려 있네.",
        "zh": "也拯救別人生命。",
        "en": "It means our own life as well.",
        "ja": "エホバの知らせ"
      },
      {
        "vi": "Cảnh báo người ta tránh xa đường xấu.",
        "ko": "순종하여 살 수 있게",
        "zh": "救生信息，傳遍全地，",
        "en": "It means their life if they obey,",
        "ja": "心を尽くして"
      },
      {
        "vi": "Truyền rao khắp chốn cho dân nơi nơi",
        "ko": "모두에게 꼭 전하리,",
        "zh": "幫助別人聽從上帝，",
        "en": "So all the nations we must tell;",
        "ja": "伝えよう 今日も"
      },
      {
        "vi": "biết tin này.",
        "ko": "전하리.",
        "zh": "得生命。",
        "en": "We must tell.",
        "ja": "明日も"
      }
    ],
    "reference": {
      "vi": "(Cũng xem 2 Sử 36:15; Ê-sai 61:2; Ê-xê 33:6; 2 Tê 1:8).",
      "ko": "(역대기하 36:15; 이사야 61:2; 에스겔 33:6; 데살로니가 후서 1:8 참조)",
      "zh": "（參看代下36:15；賽61:2；結33:6；帖後1:8）",
      "en": "(See also 2 Chron. 36:15; Isa. 61:2; Ezek. 33:6; 2 Thess. 1:8.)",
      "ja": "（代二 36:15; イザ 61:2; エゼ 33:6; テサ二 1:8も参照。）"
    }
  },
  {
    "number": 61,
    "sourceSheet": "61",
    "labels": {
      "vi": "BÀI HÁT 61",
      "ko": "61번",
      "zh": "詩歌第61首",
      "en": "SONG 61",
      "ja": "61番"
    },
    "title": {
      "vi": "Hỡi các Nhân Chứng, hãy tiến lên!",
      "ko": "증인들아, 전진하여라!",
      "zh": "耶和華見證人，向前邁進！",
      "en": "Forward, You Witnesses!",
      "ja": "証人たちよ，進め！"
    },
    "scripture": {
      "vi": "(Lu-ca 16:16)",
      "ko": "(누가복음 16:16)",
      "zh": "（路加福音16:16）",
      "en": "(Luke 16:16)",
      "ja": "（ルカ 16:16）"
    },
    "lines": [
      {
        "vi": "1. Trong thời kỳ sau cùng này, bao tôi tớ can trường",
        "ko": "1. 하느님 종들은 마지막 때에",
        "zh": "1．我們在末期必須堅定不移，",
        "en": "1. Firm and determined in this time of the end,",
        "ja": "1. 世に告げる 良い知らせを"
      },
      {
        "vi": "được Cha sửa soạn cho một lòng đi rao báo tin mừng.",
        "ko": "좋은 소식 변호할 각오했도다.",
        "zh": "時刻準備好，擁護真理不遲疑。",
        "en": "Prepared are God's servants the good news to defend.",
        "ja": "終わり近いこの時代に"
      },
      {
        "vi": "Dẫu Sa-tan nay đang ra sức phá hoại,",
        "ko": "사탄 아무리 대적해도",
        "zh": "雖受撒但反對不驚慌，",
        "en": "The Devil has fought and opposed them.",
        "ja": "悪魔に立ち向かう"
      },
      {
        "vi": "đừng sợ chi, nương sức Cha nên ta được thắng trận.",
        "ko": "주의 힘 입어 굴복하지 않네.",
        "zh": "我們要倚靠上帝賜予力量。",
        "en": "With Jehovah, they take their stand against him.",
        "ja": "神の主権を支持して"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Nào đi, Nhân Chứng Giê-hô-va, chúng ta quyết tiến bước!",
        "ko": "증인들아, 용감히 전진하여라!",
        "zh": "耶和華的見證人，勇敢向前進！",
        "en": "Then forward, you Witnesses, ever strong of heart!",
        "ja": "立ち止まらない 最後まで"
      },
      {
        "vi": "Cùng nhau ta hân hoan đi rao báo cho khắp các nước,",
        "ko": "주의 일을 행하며 기쁨 얻으라!",
        "zh": "能為耶和華服務是無上光榮！",
        "en": "Rejoice that in God's work, you too may have a part!",
        "ja": "神と歩むこの喜び"
      },
      {
        "vi": "để các dân hay rằng mai mốt trái đất được thái an",
        "ko": "다가오는 낙원을 널리 알리며",
        "zh": "告訴所有人美好希望將實現，",
        "en": "Go tell far and wide that the Paradise is near",
        "ja": "広く語る 真の希望"
      },
      {
        "vi": "và ngàn phước lành đời đời Cha xuống dư tràn.",
        "ko": "곧 있을 그 축복 전하여라.",
        "zh": "滿心盼望未來地上樂園。",
        "en": "And that soon all its blessings will be here.",
        "ja": "私たちは証人"
      },
      {
        "vi": "2. Không màng lợi riêng vì mình đây tôi tớ của Cha;",
        "ko": "2. 주 군사 편안한 생활 버리고",
        "zh": "2．上帝的僕人不求生活安逸，",
        "en": "2. Servants of Jah do not seek a life of ease;",
        "ja": "2. 試される奉仕者たち"
      },
      {
        "vi": "đừng tôn sùng người ta dù quyền uy, danh tiếng cao xa.",
        "ko": "이 세상을 기쁘게 하지 않도다.",
        "zh": "絕不取悅人也不受撒但奴役。",
        "en": "The world and its rulers we do not try to please.",
        "ja": "欲にふけるこの時代に"
      },
      {
        "vi": "Thế gian theo Sa-tan, ta giữ tách biệt.",
        "ko": "항상 흠 없이 생활하며",
        "zh": "決心要永遠堅守忠義，",
        "en": "Unspotted at all times remaining,",
        "ja": "忠誠守り抜く"
      },
      {
        "vi": "Lòng trung kiên ta giữ sao cho không hề đổi dời.",
        "ko": "흔들림 없이 충절 지키리라.",
        "zh": "努力不讓這世界玷污自己。",
        "en": "Our integrity we will keep maintaining.",
        "ja": "世に汚されることなく"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Nào đi, Nhân Chứng Giê-hô-va, chúng ta quyết tiến bước!",
        "ko": "증인들아, 용감히 전진하여라!",
        "zh": "耶和華的見證人，勇敢向前進！",
        "en": "Then forward, you Witnesses, ever strong of heart!",
        "ja": "立ち止まらない 最後まで"
      },
      {
        "vi": "Cùng nhau ta hân hoan đi rao báo cho khắp các nước,",
        "ko": "주의 일을 행하며 기쁨 얻으라!",
        "zh": "能為耶和華服務是無上光榮！",
        "en": "Rejoice that in God's work, you too may have a part!",
        "ja": "神と歩むこの喜び"
      },
      {
        "vi": "để các dân hay rằng mai mốt trái đất được thái an",
        "ko": "다가오는 낙원을 널리 알리며",
        "zh": "告訴所有人美好希望將實現，",
        "en": "Go tell far and wide that the Paradise is near",
        "ja": "広く語る 真の希望"
      },
      {
        "vi": "và ngàn phước lành đời đời Cha xuống dư tràn.",
        "ko": "곧 있을 그 축복 전하여라.",
        "zh": "滿心盼望未來地上樂園。",
        "en": "And that soon all its blessings will be here.",
        "ja": "私たちは証人"
      },
      {
        "vi": "3. Bao người thời nay cười nhạo, khinh khi Nước trên cao.",
        "ko": "3. 하느님 왕국이 조롱당하고",
        "zh": "3．世人普遍對上帝毫不尊重，",
        "en": "3. God and his Kingdom are mocked and pushed aside;",
        "ja": "3. 神の名とその王国"
      },
      {
        "vi": "Họ xem thường luật Cha và cười chê danh thánh Cha mang.",
        "ko": "주 거룩한 이름이 모욕당하니,",
        "zh": "嘲笑耶和華，不接受他的王國。",
        "en": "His great name is slandered, its holiness denied.",
        "ja": "あざけられるこの時代に"
      },
      {
        "vi": "Hãy ca khen, tôn vinh danh Giê-hô-va,",
        "ko": "그 이름을 거룩게 하며",
        "zh": "我們要彰顯上帝聖名，",
        "en": "Let's share in its sanctification,",
        "ja": "神の清さ告げる"
      },
      {
        "vi": "cùng truyền rao ra khắp nơi cho muôn người biết ngài.",
        "ko": "모든 나라에 널리 선포하라.",
        "zh": "盡力將他的名聲傳遍全地。",
        "en": "And declare it to ev'ry tribe and nation.",
        "ja": "世の全ての国民に"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Nào đi, Nhân Chứng Giê-hô-va, chúng ta quyết tiến bước!",
        "ko": "증인들아, 용감히 전진하여라!",
        "zh": "耶和華的見證人，勇敢向前進！",
        "en": "Then forward, you Witnesses, ever strong of heart!",
        "ja": "立ち止まらない 最後まで"
      },
      {
        "vi": "Cùng nhau ta hân hoan đi rao báo cho khắp các nước,",
        "ko": "주의 일을 행하며 기쁨 얻으라!",
        "zh": "能為耶和華服務是無上光榮！",
        "en": "Rejoice that in God's work, you too may have a part!",
        "ja": "神と歩むこの喜び"
      },
      {
        "vi": "để các dân hay rằng mai mốt trái đất được thái an",
        "ko": "다가오는 낙원을 널리 알리며",
        "zh": "告訴所有人美好希望將實現，",
        "en": "Go tell far and wide that the Paradise is near",
        "ja": "広く語る 真の希望"
      },
      {
        "vi": "và ngàn phước lành đời đời Cha xuống dư tràn.",
        "ko": "곧 있을 그 축복 전하여라.",
        "zh": "滿心盼望未來地上樂園。",
        "en": "And that soon all its blessings will be here.",
        "ja": "私たちは証人"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Xuất 9:16; Phi-líp 1:7; 2 Ti 2:3, 4; Gia 1:27).",
      "ko": "(출애굽 9:16; 빌립보 1:7; 디모데 후서 2:3, 4; 야고보 1:27 참조)",
      "zh": "（參看出9:16；腓1:7；提後2:3,4；雅1:27）",
      "en": "(See also Ex. 9:16; Phil. 1:7; 2 Tim. 2:3, 4; Jas. 1:27.)",
      "ja": "（出 9:16; フィリ 1:7; テモ二 2:3，4; ヤコ 1:27も参照。）"
    }
  },
  {
    "number": 62,
    "sourceSheet": "62",
    "labels": {
      "vi": "BÀI HÁT 62",
      "ko": "62번",
      "zh": "詩歌第62首",
      "en": "SONG 62",
      "ja": "62番"
    },
    "title": {
      "vi": "Bài ca mới",
      "ko": "새 노래",
      "zh": "新歌",
      "en": "The New Song",
      "ja": "新しい歌"
    },
    "scripture": {
      "vi": "(Thi thiên 98)",
      "ko": "(시편 98)",
      "zh": "（詩篇98篇）",
      "en": "(Psalm 98)",
      "ja": "（詩編 98編）"
    },
    "lines": [
      {
        "vi": "1. Hãy hát bài ca mới, khúc ca hào hứng về Giê-hô-va.",
        "ko": "1. 노래 부르라, 찬양의 힘찬 새 노래.",
        "zh": "1．要向耶和華高唱讚美他的新歌，",
        "en": "1. Sing to God a song, A song of praise that's bold and new.",
        "ja": "1. さあ歌おう 新しい歌を"
      },
      {
        "vi": "Việc tay Cha ôi vĩ đại! Hãy cùng sướng vui truyền rao.",
        "ko": "주 하신 큰일과 하실 일 전하라.",
        "zh": "傳揚他的作為，歌頌他的救恩。",
        "en": "Tell of all the great things He's done and yet will do.",
        "ja": "神エホバの勝利たたえ"
      },
      {
        "vi": "Hát khen ngài quyền năng, Chúa luôn toàn thắng từ thuở đầu tiên,",
        "ko": "강력한 팔로 언제나 승리하시고",
        "zh": "他充滿力量，最終必定大獲全勝。",
        "en": "Praise his mighty arm; He is the God of victory.",
        "ja": "公正で強力な神は"
      },
      {
        "vi": "phán xét muôn dân công bằng vì sự chính trực của Cha.",
        "ko": "의로 심판하여 공의 이루시네.",
        "zh": "他必伸張正義，審判絕對公正。",
        "en": "In the cause of justice, He judges righteously.",
        "ja": "裁き下し悪滅ぼす"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Bài ca mới! Hãy hát ca vang mọi nơi!",
        "ko": "찬양해! 힘찬 새 노래로.",
        "zh": "唱，唱，唱！新歌響徹四方。",
        "en": "Sing, sing, sing! The new song, let it ring!",
        "ja": "歌おう 賛美しよう"
      },
      {
        "vi": "Cùng reo lớn! Chúa Giê-hô-va là Vua.",
        "ko": "찬양해! 우리 왕 여호와.",
        "zh": "唱，唱，唱！耶和華已作王。",
        "en": "Sing, sing, sing! Jehovah is our King.",
        "ja": "歌おう エホバは王"
      },
      {
        "vi": "2. Hãy reo hò khen Chúa, tiếng vang rền thấu tận đến trời cao!",
        "ko": "2. 기뻐 외치라, 왕이신 주 여호와께!",
        "zh": "2．向上帝歡呼，全力擁護至高君王。",
        "en": "2. Make a joyful shout, A joyful cry to God, our King!",
        "ja": "2. さあ歌おう 喜びに満ちて"
      },
      {
        "vi": "Đồng ca khen, tôn kính ngài; thảy đều cất cao giọng hát.",
        "ko": "주 이름 높이고 영예를 돌리라.",
        "zh": "要讚頌耶和華，為他聖名增光。",
        "en": "Laud his name, give honor; A joyful anthem sing.",
        "ja": "王エホバの統治たたえ"
      },
      {
        "vi": "Trước ngôi ngài cao quý, đám đông mừng rỡ đàn hát cùng nhau.",
        "ko": "목소리 높여 다 함께 노래 부르라.",
        "zh": "在上帝面前一同揚聲高歌歡唱，",
        "en": "Join the mighty crowd, And sing aloud before the Lord.",
        "ja": "たて琴と角笛とラッパ"
      },
      {
        "vi": "Tiếng sáo du dương, đàn hạc cùng kèn chan hòa xướng ca.",
        "ko": "수금, 뿔나팔로 드높이 찬양해.",
        "zh": "歌曲優美動聽，旋律美妙悠揚。",
        "en": "Harp and horn and trumpet Sound praise in full accord.",
        "ja": "鳴り響かせ 皆で歌う"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Bài ca mới! Hãy hát ca vang mọi nơi!",
        "ko": "찬양해! 힘찬 새 노래로.",
        "zh": "唱，唱，唱！新歌響徹四方。",
        "en": "Sing, sing, sing! The new song, let it ring!",
        "ja": "歌おう 賛美しよう"
      },
      {
        "vi": "Cùng reo lớn! Chúa Giê-hô-va là Vua.",
        "ko": "찬양해! 우리 왕 여호와.",
        "zh": "唱，唱，唱！耶和華已作王。",
        "en": "Sing, sing, sing! Jehovah is our King.",
        "ja": "歌おう エホバは王"
      },
      {
        "vi": "3. Hãy vui gầm vang tiếng, hỡi muôn vật dưới đại dương ngàn khơi.",
        "ko": "3. 찬양하여라, 온 땅의 창조물들아.",
        "zh": "3．聽！浩瀚海洋，水中百物一同歌唱。",
        "en": "3. Let the mighty sea And all that fills it give him praise.",
        "ja": "3. さあ歌おう 生きるもの全て"
      },
      {
        "vi": "Kỳ công Cha trên đất này, trỗi giọng hát khen ngợi Cha.",
        "ko": "드넓은 바다도 힘차게 외쳐라.",
        "zh": "地上受造萬物，一同高聲讚揚。",
        "en": "Join with earth's creation, And joyful voices raise.",
        "ja": "創造者の偉業たたえ"
      },
      {
        "vi": "Đất reo mừng ca hát, vỗ tay nào hỡi ngàn suối cùng sông.",
        "ko": "땅과 강들아, 손뼉을 치며 기뻐해.",
        "zh": "大地也喝彩，江河湖泊一同拍掌。",
        "en": "Let the land rejoice, And let the rivers clap their hands.",
        "ja": "山々も海も手をたたき"
      },
      {
        "vi": "Các núi cao cheo leo và mọi đồi xanh cùng hát vang.",
        "ko": "산과 언덕들도 새 노래 불러라.",
        "zh": "高山、丘陵、溪谷，全都齊聲頌揚。",
        "en": "Mountains, hills, and valleys Sing praise in all the lands.",
        "ja": "全地球が賛美歌う"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Bài ca mới! Hãy hát ca vang mọi nơi!",
        "ko": "찬양해! 힘찬 새 노래로.",
        "zh": "唱，唱，唱！新歌響徹四方。",
        "en": "Sing, sing, sing! The new song, let it ring!",
        "ja": "歌おう 賛美しよう"
      },
      {
        "vi": "Cùng reo lớn! Chúa Giê-hô-va là Vua.",
        "ko": "찬양해! 우리 왕 여호와.",
        "zh": "唱，唱，唱！耶和華已作王。",
        "en": "Sing, sing, sing! Jehovah is our King.",
        "ja": "歌おう エホバは王"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 96:1; 149:1; Ê-sai 42:10).",
      "ko": "(시 96:1; 149:1; 이사야 42:10 참조)",
      "zh": "（參看詩96:1；149:1；賽42:10）",
      "en": "(See also Ps. 96:1; 149:1; Isa. 42:10.)",
      "ja": "（詩 96:1; 149:1; イザ 42:10も参照。）"
    }
  },
  {
    "number": 63,
    "sourceSheet": "63",
    "labels": {
      "vi": "BÀI HÁT 63",
      "ko": "63번",
      "zh": "詩歌第63首",
      "en": "SONG 63",
      "ja": "63番"
    },
    "title": {
      "vi": "Chúng ta là Nhân Chứng Giê-hô-va!",
      "ko": "우리는 여호와의 증인!",
      "zh": "我們是耶和華見證人！",
      "en": "We're Jehovah's Witnesses!",
      "ja": "私たちはエホバの証人"
    },
    "scripture": {
      "vi": "(Ê-sai 43:10-12)",
      "ko": "(이사야 43:10-12)",
      "zh": "（以賽亞書43:10-12）",
      "en": "(Isaiah 43:10-12)",
      "ja": "（イザヤ 43:10-12）"
    },
    "lines": [
      {
        "vi": "1. Khắp đất người ta không biết Cha,",
        "ko": "1. 우상을 섬기는 자,",
        "zh": "1．不認識上帝的人，",
        "en": "1. Men make gods of wood and stone,",
        "ja": "1. エホバを知らず"
      },
      {
        "vi": "họ tôn vinh biết bao tà thần.",
        "ko": "참하느님 모르네.",
        "zh": "雕刻偶像拜別神。",
        "en": "But the true God they've not known.",
        "ja": "人はあがめる"
      },
      {
        "vi": "Ngài là Chúa thật tối cao,",
        "ko": "우리 하느님은",
        "zh": "耶和華已證明",
        "en": "He is God Almighty,",
        "ja": "形だけの"
      },
      {
        "vi": "quyền năng lớn vô cùng.",
        "ko": "전능하신 분.",
        "zh": "他才是真神。",
        "en": "As he's often shown.",
        "ja": "神たちを"
      },
      {
        "vi": "Tất cả thần khác không hề hay",
        "ko": "다른 신은 앞날을",
        "zh": "其他神不能預知",
        "en": "Other gods just cannot see",
        "ja": "何もできない"
      },
      {
        "vi": "điều gì sẽ xảy ra ngày mai.",
        "ko": "내다볼 수 없으며",
        "zh": "未來將發生何事，",
        "en": "What in future days will be.",
        "ja": "作られた神"
      },
      {
        "vi": "Chúng tìm ra nhân chứng cho mình nơi đâu?",
        "ko": "그들의 신격 증명해 줄",
        "zh": "不能證明自己是真神，",
        "en": "For witnesses they look all in vain,",
        "ja": "偽りの神には"
      },
      {
        "vi": "Vì quyền năng chúng hoàn toàn vô nghĩa.",
        "ko": "증인도 전혀 없구나.",
        "zh": "也沒有任何見證人。",
        "en": "Since none their godship can maintain.",
        "ja": "証人もいない"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Cất tiếng dạn dĩ rao về Cha,",
        "ko": "담대하게 외치세,",
        "zh": "耶和華的見證人，",
        "en": "We're Jehovah's Witnesses.",
        "ja": "エホバは選ぶ"
      },
      {
        "vi": "là Nhân Chứng cho Giê-hô-va.",
        "ko": "\"참하느님 여호와!\"",
        "zh": "勇敢無畏作見證。",
        "en": "We speak out in fearlessness.",
        "ja": "証人たちを"
      },
      {
        "vi": "Những lời tiên tri phán từ xa xưa ấy",
        "ko": "그분을 알리는 우리는",
        "zh": "我們的上帝永遠不變，",
        "en": "Ours is the God of true prophecy;",
        "ja": "主権者をたたえる"
      },
      {
        "vi": "sẽ thành đúng như Lời Chúa rao.",
        "ko": "여호와의 증인들.",
        "zh": "他的預言必實現。",
        "en": "What he foretells comes to be.",
        "ja": "エホバの証人"
      },
      {
        "vi": "2. Quyết chí truyền rao danh của Cha",
        "ko": "2. 주의 이름 알리고",
        "zh": "2．彰顯上帝名為聖，",
        "en": "2. Proudly we declare God's name,",
        "ja": "2. 神の名前に"
      },
      {
        "vi": "cùng vinh quang Chúa cho muôn người.",
        "ko": "그 명성 증거하며",
        "zh": "全力為他作見證，",
        "en": "Bearing witness to his fame.",
        "ja": "誇りを持って"
      },
      {
        "vi": "Mình dạn dĩ truyền khắp nơi",
        "ko": "담대하게 왕국",
        "zh": "勇敢向人傳揚",
        "en": "News about his Kingdom,",
        "ja": "告げていこう"
      },
      {
        "vi": "về tin Nước trên trời.",
        "ko": "널리 전하네.",
        "zh": "王國的希望。",
        "en": "Boldly we proclaim.",
        "ja": "偉大さを"
      },
      {
        "vi": "Giúp đỡ người bốn phương đều hay",
        "ko": "자유 주는 진리를",
        "zh": "努力幫助人學習",
        "en": "We help others come to see",
        "ja": "自由与える"
      },
      {
        "vi": "sự thật Chúa sẽ mang tự do,",
        "ko": "이해하게 도우면",
        "zh": "帶來自由的真理。",
        "en": "How the truth can set them free.",
        "ja": "神の言葉を"
      },
      {
        "vi": "khiến họ hân hoan cất cao giọng reo vui,",
        "ko": "많은 사람들 소리 높여",
        "zh": "他們的信念日益堅強，",
        "en": "As they grow strong, their voices they'll raise,",
        "ja": "受け入れた人たち"
      },
      {
        "vi": "cùng mình tôn kính và ca khen Chúa.",
        "ko": "힘차게 찬양하리라.",
        "zh": "讚美歌聲響徹四方。",
        "en": "Singing to God this song of praise.",
        "ja": "賛美に加わる"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Cất tiếng dạn dĩ rao về Cha,",
        "ko": "담대하게 외치세,",
        "zh": "耶和華的見證人，",
        "en": "We're Jehovah's Witnesses.",
        "ja": "エホバは選ぶ"
      },
      {
        "vi": "là Nhân Chứng cho Giê-hô-va.",
        "ko": "\"참하느님 여호와!\"",
        "zh": "勇敢無畏作見證。",
        "en": "We speak out in fearlessness.",
        "ja": "証人たちを"
      },
      {
        "vi": "Những lời tiên tri phán từ xa xưa ấy",
        "ko": "그분을 알리는 우리는",
        "zh": "我們的上帝永遠不變，",
        "en": "Ours is the God of true prophecy;",
        "ja": "主権者をたたえる"
      },
      {
        "vi": "sẽ thành đúng như Lời Chúa rao.",
        "ko": "여호와의 증인들.",
        "zh": "他的預言必實現。",
        "en": "What he foretells comes to be.",
        "ja": "エホバの証人"
      },
      {
        "vi": "3. Thánh chức làm danh Cha hiển vinh",
        "ko": "3. 주의 이름 더럽힌",
        "zh": "3．為耶和華作見證，",
        "en": "3. Witnessing exalts God's name,",
        "ja": "3. 神の名前は"
      },
      {
        "vi": "và xua tan nhuốc nhơ, bôi nhọ.",
        "ko": "악인들 경고하고,",
        "zh": "尊崇他偉大聖名，",
        "en": "Lifts therefrom reproach and shame.",
        "ja": "輝きを増す"
      },
      {
        "vi": "Mình cảnh báo người ác gian,",
        "ko": "거룩한 주 이름",
        "zh": "我們勇敢警告",
        "en": "And it warns the wicked,",
        "ja": "私たちの"
      },
      {
        "vi": "người bêu xấu danh ngài.",
        "ko": "드높이리라.",
        "zh": "毀謗他的人。",
        "en": "Who God's name defame.",
        "ja": "振る舞いで"
      },
      {
        "vi": "Nếu những người xấu nay đổi thay",
        "ko": "여호와 찾는 이들",
        "zh": "他們若衷心認錯，",
        "en": "Pardon it holds out to men,",
        "ja": "エホバの側に"
      },
      {
        "vi": "thì ngài sẽ thứ tha tội cho.",
        "ko": "모두 용서받으리.",
        "zh": "上帝必赦免罪過。",
        "en": "If they turn to God again.",
        "ja": "立場定めて"
      },
      {
        "vi": "Hết lòng theo Cha, sống muôn đời an vui,",
        "ko": "영혼을 다해 주 섬기면",
        "zh": "宣揚王國得喜樂、安寧，",
        "en": "Whole-souled devotion brings joy and peace;",
        "ja": "平和の良い知らせ"
      },
      {
        "vi": "tràn đầy ân phước từ Cha ban xuống.",
        "ko": "생명과 기쁨 얻으리.",
        "zh": "迎接未來光明前景。",
        "en": "Promise of life that will not cease.",
        "ja": "携えていこう"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Cất tiếng dạn dĩ rao về Cha,",
        "ko": "담대하게 외치세,",
        "zh": "耶和華的見證人，",
        "en": "We're Jehovah's Witnesses.",
        "ja": "エホバは選ぶ"
      },
      {
        "vi": "là Nhân Chứng cho Giê-hô-va.",
        "ko": "\"참하느님 여호와!\"",
        "zh": "勇敢無畏作見證。",
        "en": "We speak out in fearlessness.",
        "ja": "証人たちを"
      },
      {
        "vi": "Những lời tiên tri phán từ xa xưa ấy",
        "ko": "그분을 알리는 우리는",
        "zh": "我們的上帝永遠不變，",
        "en": "Ours is the God of true prophecy;",
        "ja": "主権者をたたえる"
      },
      {
        "vi": "sẽ thành đúng như Lời Chúa rao.",
        "ko": "여호와의 증인들.",
        "zh": "他的預言必實現。",
        "en": "What he foretells comes to be.",
        "ja": "エホバの証人"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Ê-sai 37:19; 55:11; Ê-xê 3:19).",
      "ko": "(이사야 37:19; 55:11; 에스겔 3:19 참조)",
      "zh": "（參看賽37:19；55:11；結3:19）",
      "en": "(See also Isa. 37:19; 55:11; Ezek. 3:19.)",
      "ja": "（イザ 37:19; 55:11; エゼ 3:19も参照。）"
    }
  },
  {
    "number": 64,
    "sourceSheet": "64",
    "labels": {
      "vi": "BÀI HÁT 64",
      "ko": "64번",
      "zh": "詩歌第64首",
      "en": "SONG 64",
      "ja": "64番"
    },
    "title": {
      "vi": "Vui mừng tham gia mùa gặt",
      "ko": "수확하는 일에 기쁘게 참여하세",
      "zh": "歡樂地參與收割",
      "en": "Sharing Joyfully in the Harvest",
      "ja": "喜んで収穫に参加する"
    },
    "scripture": {
      "vi": "(Ma-thi-ơ 13:1-23)",
      "ko": "(마태복음 13:1-23)",
      "zh": "（馬太福音13:1-23）",
      "en": "(Matthew 13:1-23)",
      "ja": "（マタイ 13:1-23）"
    },
    "lines": [
      {
        "vi": "1. Ngày nay ta được sống trong mùa lúa Cha,",
        "ko": "1. 마지막 날 수확하는 일",
        "zh": "1．現在這時期多麼特別，",
        "en": "1. We live in the time of the harvest,",
        "ja": "1. さあ収穫の時"
      },
      {
        "vi": "đặc ân không gì sánh so được bằng.",
        "ko": "참으로 영예로운 일.",
        "zh": "是莊稼成熟的時節。",
        "en": "A priv'lege beyond all compare.",
        "ja": "特別な時代"
      },
      {
        "vi": "Đồng mênh mông vàng chín đang chờ đón ta,",
        "ko": "기쁘게 이 일을 즐기며",
        "zh": "金黃色麥田映入眼簾，",
        "en": "The wheat fields stand ready before us,",
        "ja": "広い小麦畑"
      },
      {
        "vi": "mau cùng nhau hăng hái thâu về kho.",
        "ko": "내 할 일을 다하리라.",
        "zh": "要盡快收割不停歇。",
        "en": "And eagerly we have a share.",
        "ja": "すぐそこに見える"
      },
      {
        "vi": "Thật Giê-su là tấm gương tuyệt hảo thay,",
        "ko": "예수께서 인도하시니",
        "zh": "耶穌向我們發出邀請：",
        "en": "With Jesus, our finest example,",
        "ja": "収穫の仕方は"
      },
      {
        "vi": "dẫn đầu thâu gom bao bông lúa tốt.",
        "ko": "나 기꺼이 따르리라.",
        "zh": "要熱心宣揚好消息。",
        "en": "Directing our work in the field,",
        "ja": "イエスが教える"
      },
      {
        "vi": "Với tấm lòng vui sướng, mang vinh dự to lớn,",
        "ko": "참으로 영예로운 일이니",
        "zh": "我們有榮幸能參與收割，",
        "en": "How happy and honored we feel each day.",
        "ja": "共に働く人は"
      },
      {
        "vi": "mỗi ngày ta đều hăng say góp thâu.",
        "ko": "늘 기쁘게 참여하리.",
        "zh": "天天傳道多麼快樂。",
        "en": "We joyfully share in the yield.",
        "ja": "幸福になれる"
      },
      {
        "vi": "2. Việc thâu gom, truyền giảng nay càng khẩn trương,",
        "ko": "2. 주와 이웃 사랑하기에",
        "zh": "2．對上帝和別人的真愛，",
        "en": "2. True love for our God and our neighbor",
        "ja": "2. 神と人への愛"
      },
      {
        "vi": "ngày Cha đang gần đến, xong mùa gặt.",
        "ko": "더 바쁘게 참여하네.",
        "zh": "推動我們加倍努力。",
        "en": "Now moves us to speed up our pace.",
        "ja": "心にあふれる"
      },
      {
        "vi": "Vì yêu Cha cùng với bao người khác nên",
        "ko": "끝날 때가 가까워 오니",
        "zh": "邪惡制度終結快來到，",
        "en": "Both preaching and teaching are urgent,",
        "ja": "もっと広く遠く"
      },
      {
        "vi": "ta càng siêng năng, chú tâm làm hơn.",
        "ko": "더 긴급히 일하리라.",
        "zh": "傳道教人多麼重要。",
        "en": "For shortly the end we will face.",
        "ja": "真理教えよう"
      },
      {
        "vi": "Nhờ Giê-hô-va chúng ta hạnh phúc thay,",
        "ko": "큰 기쁨을 주는 이 일은",
        "zh": "宣揚王國帶來的喜樂，",
        "en": "The joy we receive is a blessing,",
        "ja": "希望捨てないなら"
      },
      {
        "vi": "suốt đời hân hoan, vui tươi biết mấy!",
        "ko": "여호와의 선물이네.",
        "zh": "是上帝所賜的福分。",
        "en": "A gift that Jehovah provides.",
        "ja": "喜び味わう"
      },
      {
        "vi": "Quyết chí bền tâm đến khi xong việc giao phó,",
        "ko": "믿음으로 끝까지 일하여",
        "zh": "堅持不懈直到完成收割，",
        "en": "By faith we endure till this work is done",
        "ja": "収穫が終わるまで"
      },
      {
        "vi": "hết lòng ta cùng chung tay với Cha.",
        "ko": "주 기쁨에 참여하리.",
        "zh": "與耶和華一同歡樂。",
        "en": "And joyfully share at his side.",
        "ja": "神と働こう"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Mat 24:13; 1 Cô 3:9; 2 Ti 4:2).",
      "ko": "(마태 24:13; 고린도 전서 3:9; 디모데 후서 4:2 참조)",
      "zh": "（參看太24:13；林前3:9；提後4:2）",
      "en": "(See also Matt. 24:13; 1 Cor. 3:9; 2 Tim. 4:2.)",
      "ja": "（マタ 24:13; コリ一 3:9; テモ二 4:2も参照。）"
    }
  },
  {
    "number": 65,
    "sourceSheet": "65",
    "labels": {
      "vi": "BÀI HÁT 65",
      "ko": "65번",
      "zh": "詩歌第65首",
      "en": "SONG 65",
      "ja": "65番"
    },
    "title": {
      "vi": "Hãy tấn tới!",
      "ko": "앞으로 나가세!",
      "zh": "向前進！",
      "en": "Move Ahead!",
      "ja": "進歩し続けよう"
    },
    "scripture": {
      "vi": "(Hê-bơ-rơ 6:1)",
      "ko": "(히브리서 6:1)",
      "zh": "（希伯來書6:1）",
      "en": "(Hebrews 6:1)",
      "ja": "（ヘブライ 6:1）"
    },
    "lines": [
      {
        "vi": "1. Nào cùng nhau, mọi anh em, cùng nhau ta tấn tới!",
        "ko": "1. 앞으로 나가세, 장성 향해서!",
        "zh": "1．向前進，向前進，向成熟邁進！",
        "en": "1. Move ahead, move ahead to maturity!",
        "ja": "1. 進歩続け"
      },
      {
        "vi": "Hãy siêng năng giảng rao về lời chân lý cho mọi dân biết.",
        "ko": "우리의 진보를 모두에게 보이세.",
        "zh": "讓人人都看見我們的良好品行。",
        "en": "Shine the light of the truth so that all may plainly see.",
        "ja": "打ち込もう"
      },
      {
        "vi": "Việc của Cha, mình hăng say, luôn hết tâm chu toàn.",
        "ko": "온전히 하느님 신뢰하면서",
        "zh": "要努力多傳道，每天求進步，",
        "en": "Try your best to improve in your ministry;",
        "ja": "神に頼り 奉仕に励み"
      },
      {
        "vi": "Tin nơi Chúa thì sẽ thành công.",
        "ko": "최선을 다하리라.",
        "zh": "耶和華必定賜福。",
        "en": "Trust in God for true success.",
        "ja": "小さなこと1つずつ"
      },
      {
        "vi": "Nào anh em, ta quyết tâm đi loan báo,",
        "ko": "진리를 전하는 이 일은",
        "zh": "耶穌說好消息要宣告，",
        "en": "There's a place in the service for all.",
        "ja": "さあ行おう"
      },
      {
        "vi": "việc thuở trước Chúa Giê-su từng đảm đương.",
        "ko": "주 예수 하신 그 일이네.",
        "zh": "基督徒有義務要傳道。",
        "en": "It's the work Jesus did, you'll recall.",
        "ja": "良い知らせを飾る"
      },
      {
        "vi": "Mình cậy trông Giê-hô-va, vượt qua bao sóng gió,",
        "ko": "하느님 도움을 의지하면서",
        "zh": "要尋求耶和華的仁愛指引，",
        "en": "Look to God for support that you may not fall,",
        "ja": "振る舞い続けよう"
      },
      {
        "vi": "mãi đi trong đường Cha dạy khuyên.",
        "ko": "의를 굳게 지키세.",
        "zh": "正義之路不偏離。",
        "en": "Standing firm for righteousness.",
        "ja": "光高く輝かせ イエス目指そう"
      },
      {
        "vi": "2. Nào cùng nhau, mọi anh em, mạnh dạn đi loan báo!",
        "ko": "2. 앞으로 나가세, 증거 위하여!",
        "zh": "2．向前進，向前進，要勇敢傳道！",
        "en": "2. Move ahead, move ahead, boldly witnessing!",
        "ja": "2. 進歩続け打ち込もう"
      },
      {
        "vi": "Để muôn dân biết tin mừng là Cha sẽ đem bình an đến.",
        "ko": "영원한 소식을 모두에게 전하세.",
        "zh": "向世上所有人傳講真理多美好。",
        "en": "Everlasting good news to all sorts of people bring.",
        "ja": "良い知らせを人から人へ"
      },
      {
        "vi": "Cùng hòa ca ngợi khen Cha, Vua Tối Cao muôn đời;",
        "ko": "왕이신 여호와 찬양하면서",
        "zh": "我們向每一家宣揚好消息，",
        "en": "Join in praise to Jehovah, our God and King,",
        "ja": "心揺さぶる言葉で"
      },
      {
        "vi": "truyền cho mỗi nhà dân đều nghe.",
        "ko": "집집에 전파하세.",
        "zh": "讚美耶和華上帝。",
        "en": "As we preach from door to door.",
        "ja": "王国語る"
      },
      {
        "vi": "Dù cho ai gây khó khăn hay kinh khiếp,",
        "ko": "적들의 반대를 받아도",
        "zh": "面對迫害反對別害怕，",
        "en": "Though opposers would like us to fear,",
        "ja": "露のような奉仕"
      },
      {
        "vi": "đừng sợ hãi thoái lui nhưng dạn dĩ rao",
        "ko": "물러서지 말고 전하세.",
        "zh": "要繼續傳揚美好希望。",
        "en": "Don't hold back, but let ev'ryone hear.",
        "ja": "爽やかさを残す"
      },
      {
        "vi": "rằng hiện nay Giê-su đang ngự trên ngôi cao quý.",
        "ko": "하느님 왕국이 이미 왔으니",
        "zh": "告訴人王國已在天上建立，",
        "en": "Tell the news that the Kingdom of God is here.",
        "ja": "神の愛に包まれて"
      },
      {
        "vi": "Giúp muôn dân được nghe Lời Cha.",
        "ko": "진리 더욱 전하세.",
        "zh": "教他們認識真理。",
        "en": "Teach the truth yet more and more.",
        "ja": "恐れ消え去る"
      },
      {
        "vi": "3. Nào cùng nhau, mọi anh em, mình luôn luôn tấn tới!",
        "ko": "3. 앞으로 나가세, 최선 다하세!",
        "zh": "3．向前進，向前進，要堅持傳道！",
        "en": "3. Move ahead, move ahead, always follow through,",
        "ja": "3. 進歩続け"
      },
      {
        "vi": "Kỹ năng ta gắng trau dồi",
        "ko": "할 일이 많으니",
        "zh": "莊稼多，收割忙，傳道效能要提高。",
        "en": "And improve in your skills,",
        "ja": "打ち込もう"
      },
      {
        "vi": "vì đang có bao việc phía trước.",
        "ko": "기술 더욱 익히세.",
        "zh": "要不斷受上帝指引和帶領，",
        "en": "for there's so much work to do.",
        "ja": "神と共に"
      },
      {
        "vi": "Tìm niềm vui từ nơi Cha cho sức ta thêm mạnh.",
        "ko": "성령의 인도를 계속 따르면",
        "zh": "得到快樂與安寧。",
        "en": "Let the spirit of God keep on leading you.",
        "ja": "働く誇り"
      },
      {
        "vi": "Thần khí thánh hằng đưa đường ta.",
        "ko": "큰 기쁨을 얻으리.",
        "zh": "盡全力作見證顯愛心，",
        "en": "Find the joy that is divine.",
        "ja": "神の愛が引き寄せた"
      },
      {
        "vi": "Thành tâm yêu thương những ai ta đã kiếm.",
        "ko": "양들을 계속 찾아가서",
        "zh": "教導人，打動他們的心。",
        "en": "Love the people you work hard to find.",
        "ja": "人を愛そう"
      },
      {
        "vi": "Tận tình đến viếng thăm bao người lắng nghe.",
        "ko": "그들 마음에 호소하세.",
        "zh": "幫助人更成熟、信心更堅強，",
        "en": "Keep returning to reach heart and mind.",
        "ja": "神の言葉教え"
      },
      {
        "vi": "Dạy họ theo luật Cha ban và ăn năn thay đổi,",
        "ko": "날마다 자라게 도움 베풀어",
        "zh": "發出真理的亮光。",
        "en": "And assist them to grow and to be refined,",
        "ja": "心を動かそう"
      },
      {
        "vi": "để mai đây họ khen ngợi Cha.",
        "ko": "진리의 빛 비추세.",
        "zh": "（參看腓1:27；3:16；來10:39）",
        "en": "So the light of truth will shine.",
        "ja": "光る笑顔絶やさずに 進歩遂げよう"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Phi-líp 1:27; 3:16; Hê 10:39).",
      "ko": "(빌립보 1:27; 3:16; 히브리 10:39 참조)",
      "zh": "",
      "en": "(See also Phil. 1:27; 3:16; Heb. 10:39.)",
      "ja": "（フィリ 1:27; 3:16; ヘブ 10:39も参照。）"
    }
  },
  {
    "number": 66,
    "sourceSheet": "66",
    "labels": {
      "vi": "BÀI HÁT 66",
      "ko": "66번",
      "zh": "詩歌第66首",
      "en": "SONG 66",
      "ja": "66番"
    },
    "title": {
      "vi": "Hãy rao truyền tin mừng",
      "ko": "좋은 소식을 선포하라",
      "zh": "宣揚好消息",
      "en": "Declare the Good News",
      "ja": "良い知らせを伝える"
    },
    "scripture": {
      "vi": "(Khải huyền 14:6, 7)",
      "ko": "(요한 계시록 14:6, 7)",
      "zh": "（啟示錄14:6,7）",
      "en": "(Revelation 14:6, 7)",
      "ja": "（啓示 14:6，7）"
    },
    "lines": [
      {
        "vi": "1. Ý muốn Cha Giê-hô-va mầu nhiệm từ bao năm qua.",
        "ko": "1. 오랫동안 감춰졌던 왕국 진리,",
        "zh": "1．王國真理過去隱藏了千百年，",
        "en": "1. The fullness of the Kingdom truth was long concealed.",
        "ja": "1. ついに明かされた真実"
      },
      {
        "vi": "Vua đã lên ngôi nay ta nhận diện là Đấng Hứa Trước.",
        "ko": "마침내 그 모든 진리 밝혀졌네.",
        "zh": "上帝逐步讓人明白神聖預言。",
        "en": "The truth about the promised King is now revealed.",
        "ja": "約束の王の到来"
      },
      {
        "vi": "Bởi Chúa xót thương và mến yêu công bằng nên đoái đến",
        "ko": "여호와는 죄 많은 인류 위하여",
        "zh": "他熱愛正義，也樂意賜予恩惠，",
        "en": "Jehovah in his mercy and his love of right",
        "ja": "憐れみと愛のエホバは"
      },
      {
        "vi": "nhân loại lầm than, khổ sầu triền miên vì lỗi tổ tông.",
        "ko": "큰 자비와 깊은 사랑 보이셨네.",
        "zh": "渴望幫助人擺脫身心不完美。",
        "en": "Considered man's condition in his sinful plight.",
        "ja": "人の罪を見て悲しむ"
      },
      {
        "vi": "Cha muốn mai sau Giê-su trị vì mọi dân trên đất.",
        "ko": "왕국이 탄생할 때를 정하시고",
        "zh": "他決定讓愛子耶穌管理全地，",
        "en": "He formed his purpose that his Son should rule the earth;",
        "ja": "罪取り去るため定めた"
      },
      {
        "vi": "Ngôi Nước trên cao nay được thành lập như xưa đã báo trước.",
        "ko": "아들이 왕으로 다스리게 하셨네.",
        "zh": "讓天上王國在指定的時候建立。",
        "en": "In God's due time the Kingdom rule would be brought to birth.",
        "ja": "キリストと花嫁の統治"
      },
      {
        "vi": "Sắm sẵn \"cô dâu\", vợ của Chiên Con, đồng kế tự ngôi.",
        "ko": "아들을 돕는 신부 예비하시어",
        "zh": "上帝已經為他愛子預備新娘，",
        "en": "And that he might arrange to bring his Son a bride,",
        "ja": "選ばれた者が集まり"
      },
      {
        "vi": "Trong Nước Cha ban, \"bầy nhỏ\" Cha chọn được ơn vinh hiển.",
        "ko": "적은 무리 큰 영광 얻게 하셨네.",
        "zh": "小群羊即將得到榮耀和獎賞。",
        "en": "A little flock of chosen ones is glorified.",
        "ja": "イエスと統治を行う"
      },
      {
        "vi": "2. Cha đã ban cho muôn dân tin mừng từ thời xa xưa",
        "ko": "2. 오래전에 정해진 이 좋은 소식,",
        "zh": "2．我們宣揚的信息自古已預定，",
        "en": "2. The good news that we now declare was long foreknown.",
        "ja": "2. 良い知らせ 昔告げられ"
      },
      {
        "vi": "nhưng đến hôm nay Cha cho tin này tỏa sáng khắp chốn.",
        "ko": "오늘날 알려지기를 바라시네.",
        "zh": "耶和華要好消息在此時顯明。",
        "en": "Jehovah wills that in this time it would be shown.",
        "ja": "神の意志で今解かれる"
      },
      {
        "vi": "Thiên sứ trên cao hợp sức tham gia cùng ta sốt sắng",
        "ko": "천사들도 언제나 우리 곁에서",
        "zh": "上帝手下的天使也甘心樂意，",
        "en": "Along with us, his angels take delight to share,",
        "ja": "天使も働く一緒に"
      },
      {
        "vi": "để trợ lực thêm, giúp mình tự tin truyền bá Nước Cha.",
        "ko": "기쁨으로 이 소식 함께 알리네.",
        "zh": "協助我們把好消息傳遍大地。",
        "en": "To aid us as the Kingdom truth we now declare.",
        "ja": "王国の真理 知らせる"
      },
      {
        "vi": "Tôn kính danh Cha, ta khen ngợi ngài ngày đêm không ngớt.",
        "ko": "우리에게 이 큰 특권 주셨으니",
        "zh": "今天我們有責任要聽從命令，",
        "en": "We have the duty and the honor in these days",
        "ja": "神の名たたえる務めは"
      },
      {
        "vi": "Ân phước lớn lao, nhiệm vụ ngài giao, ta xem quý giá nhất.",
        "ko": "여호와 이름을 드높이 찬양하리.",
        "zh": "讚美耶和華並顯揚他榮耀聖名。",
        "en": "To sanctify his name and give him his rightful praise.",
        "ja": "今一番大事な仕事"
      },
      {
        "vi": "Ta biết ơn Cha vì đã cho ta nhận lãnh đặc ân",
        "ko": "그 이름 지닌 영예에 감동되어",
        "zh": "能夠為他作見證是多麼榮幸，",
        "en": "We're honored as his Witnesses that name to bear",
        "ja": "エホバの名を負う証人"
      },
      {
        "vi": "làm chứng cho Cha, truyền giảng tin mừng gần xa khắp đất.",
        "ko": "영원한 좋은 소식 매일 전하리.",
        "zh": "要熱心宣揚永恆王國好消息。",
        "en": "With everlasting good news that we now declare.",
        "ja": "誇り持ち 知らせ伝える"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Mác 4:11; Công 5:31; 1 Cô 2:1, 7).",
      "ko": "(마가 4:11; 사도 5:31; 고린도 전서 2:1, 7 참조)",
      "zh": "（參看可4:11；徒5:31；林前2:1,7）",
      "en": "(See also Mark 4:11; Acts 5:31; 1 Cor. 2:1, 7.)",
      "ja": "（マル 4:11; 使徒 5:31; コリ一 2:1，7も参照。）"
    }
  },
  {
    "number": 67,
    "sourceSheet": "67",
    "labels": {
      "vi": "BÀI HÁT 67",
      "ko": "67번",
      "zh": "詩歌第67首",
      "en": "SONG 67",
      "ja": "67番"
    },
    "title": {
      "vi": "\"Hãy rao giảng lời Đức Chúa Trời\"",
      "ko": "\"말씀을 전파하라\"",
      "zh": "要傳講神聖的話語",
      "en": "\"Preach the Word\"",
      "ja": "「神の言葉を広めなさい」"
    },
    "scripture": {
      "vi": "(2 Ti-mô-thê 4:2)",
      "ko": "(디모데 후서 4:2)",
      "zh": "（提摩太後書4:2）",
      "en": "(2 Timothy 4:2)",
      "ja": "（テモテ第二 4:2）"
    },
    "lines": [
      {
        "vi": "1. Truyền ra khắp đất tin mừng Nước Cha",
        "ko": "1. 하느님 우리 시대에",
        "zh": "1．上帝的話要留心聽，",
        "en": "1. God has commanded us this day;",
        "ja": "1. 今私たちに"
      },
      {
        "vi": "là đặc ân ta xem thật quý cao vô cùng.",
        "ko": "말씀 전파하라 명하셨네.",
        "zh": "甘心樂意遵從天父命令。",
        "en": "He has given us a charge to obey.",
        "ja": "エホバは命じている"
      },
      {
        "vi": "Mình quyết rao truyền muôn dân biết hy vọng",
        "ko": "‘너희 품은 희망의 이유",
        "zh": "時刻準備好怎麼回答，",
        "en": "At all times, be ready to impart",
        "ja": "準備を整えて"
      },
      {
        "vi": "rằng Nước Chúa sẽ xuống phước, khắp nơi an bình.",
        "ko": "변호할 준비 항상 하여라.'",
        "zh": "把心中的希望清楚表達。",
        "en": "The reason for the hope within your heart.",
        "ja": "希望広めるように"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Cùng rao Lời Cha,",
        "ko": "전파하라,",
        "zh": "務要傳道，",
        "en": "So preach the word",
        "ja": "知らせよう"
      },
      {
        "vi": "hầu muôn dân khắp chốn đều hay.",
        "ko": "모든 사람 듣도록!",
        "zh": "宣揚王國的信息；",
        "en": "So that ev'ryone can hear!",
        "ja": "全ての人に"
      },
      {
        "vi": "Rao Lời Cha,",
        "ko": "전파해,",
        "zh": "要傳道，",
        "en": "Preach the word,",
        "ja": "告げよう"
      },
      {
        "vi": "ngày thế gian suy tàn chẳng xa.",
        "ko": "끝이 가까웠으니.",
        "zh": "邪惡制度快終止；",
        "en": "For we know the end is near.",
        "ja": "終わりは近い"
      },
      {
        "vi": "Rao Lời Cha,",
        "ko": "전파해,",
        "zh": "要傳道，",
        "en": "Preach the word,",
        "ja": "話そう"
      },
      {
        "vi": "dạy người khiêm nhu biết về Cha.",
        "ko": "온유한 자 돕도록.",
        "zh": "教導謙卑人學習；",
        "en": "Help the meek to understand.",
        "ja": "温和な人に"
      },
      {
        "vi": "Rao Lời Cha",
        "ko": "전파해,",
        "zh": "要傳道，",
        "en": "Preach the word",
        "ja": "語ろう"
      },
      {
        "vi": "khắp nơi xa gần.",
        "ko": "온 땅으로!",
        "zh": "傳遍四境！",
        "en": "Throughout the land!",
        "ja": "世界で"
      },
      {
        "vi": "2. Thời kỳ sau cuối bao điều khó khăn,",
        "ko": "2. 어려운 시기 직면해",
        "zh": "2．縱使逆境時常出現，",
        "en": "2. Seasons of trouble we will face;",
        "ja": "2. 問題を抱え"
      },
      {
        "vi": "nhiều người khinh khi hay thù ghét, ta không sợ.",
        "ko": "반대받고 수치 겪게 되리.",
        "zh": "飽受侮辱迫害、艱辛試煉。",
        "en": "Opposition may bring shame and disgrace.",
        "ja": "迫害に遭う時も"
      },
      {
        "vi": "Dù có ai cười chê, phỉ báng tin mừng,",
        "ko": "전하기 어려울 때라도",
        "zh": "傳道工作看似不合時，",
        "en": "Though preaching may out of season seem,",
        "ja": "奉仕を続けよう"
      },
      {
        "vi": "mình quyết mãi mãi giữ vững đức tin nơi ngài.",
        "ko": "주 신뢰하며 계속 전하리.",
        "zh": "仍衷心信賴全能的上帝。",
        "en": "Our trust is in our God, who is supreme.",
        "ja": "エホバの助けがある"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Cùng rao Lời Cha,",
        "ko": "전파하라,",
        "zh": "務要傳道，",
        "en": "So preach the word",
        "ja": "知らせよう"
      },
      {
        "vi": "hầu muôn dân khắp chốn đều hay.",
        "ko": "모든 사람 듣도록!",
        "zh": "宣揚王國的信息；",
        "en": "So that ev'ryone can hear!",
        "ja": "全ての人に"
      },
      {
        "vi": "Rao Lời Cha,",
        "ko": "전파해,",
        "zh": "要傳道，",
        "en": "Preach the word,",
        "ja": "告げよう"
      },
      {
        "vi": "ngày thế gian suy tàn chẳng xa.",
        "ko": "끝이 가까웠으니.",
        "zh": "邪惡制度快終止；",
        "en": "For we know the end is near.",
        "ja": "終わりは近い"
      },
      {
        "vi": "Rao Lời Cha,",
        "ko": "전파해,",
        "zh": "要傳道，",
        "en": "Preach the word,",
        "ja": "話そう"
      },
      {
        "vi": "dạy người khiêm nhu biết về Cha.",
        "ko": "온유한 자 돕도록.",
        "zh": "教導謙卑人學習；",
        "en": "Help the meek to understand.",
        "ja": "温和な人に"
      },
      {
        "vi": "Rao Lời Cha",
        "ko": "전파해,",
        "zh": "要傳道，",
        "en": "Preach the word",
        "ja": "語ろう"
      },
      {
        "vi": "khắp nơi xa gần.",
        "ko": "온 땅으로!",
        "zh": "傳遍四境！",
        "en": "Throughout the land!",
        "ja": "世界で"
      },
      {
        "vi": "3. Thuận lợi hay khó khăn đều quyết tâm,",
        "ko": "3. 모든 일 순조로울 때",
        "zh": "3．把握和平順利時期，",
        "en": "3. Seasons of favor we will see,",
        "ja": "3. 順調な時は"
      },
      {
        "vi": "một lòng rao ra tin mừng Chúa cho bao người,",
        "ko": "말씀 전하는 것 당연한 일.",
        "zh": "全力教導別人聖經真理。",
        "en": "And the need for us to teach, there will be.",
        "ja": "伝道に打ち込もう"
      },
      {
        "vi": "dạy dỗ cho họ hay chân lý sáng ngời.",
        "ko": "구원의 길 널리 전하며",
        "zh": "熱心宣揚拯救的信息，",
        "en": "The way to salvation we proclaim",
        "ja": "人々を助けて"
      },
      {
        "vi": "Nhờ thế các nước sẽ hát xướng khen danh ngài.",
        "ko": "여호와 이름 거룩게 하리.",
        "zh": "彰顯耶和華偉大的聖名。",
        "en": "And help to sanctify Jehovah's name.",
        "ja": "神の名を賛美する"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Cùng rao Lời Cha,",
        "ko": "전파하라,",
        "zh": "務要傳道，",
        "en": "So preach the word",
        "ja": "知らせよう"
      },
      {
        "vi": "hầu muôn dân khắp chốn đều hay.",
        "ko": "모든 사람 듣도록!",
        "zh": "宣揚王國的信息；",
        "en": "So that ev'ryone can hear!",
        "ja": "全ての人に"
      },
      {
        "vi": "Rao Lời Cha,",
        "ko": "전파해,",
        "zh": "要傳道，",
        "en": "Preach the word,",
        "ja": "告げよう"
      },
      {
        "vi": "ngày thế gian suy tàn chẳng xa.",
        "ko": "끝이 가까웠으니.",
        "zh": "邪惡制度快終止；",
        "en": "For we know the end is near.",
        "ja": "終わりは近い"
      },
      {
        "vi": "Rao Lời Cha,",
        "ko": "전파해,",
        "zh": "要傳道，",
        "en": "Preach the word,",
        "ja": "話そう"
      },
      {
        "vi": "dạy người khiêm nhu biết về Cha.",
        "ko": "온유한 자 돕도록.",
        "zh": "教導謙卑人學習；",
        "en": "Help the meek to understand.",
        "ja": "温和な人に"
      },
      {
        "vi": "Rao Lời Cha",
        "ko": "전파해,",
        "zh": "要傳道，",
        "en": "Preach the word",
        "ja": "語ろう"
      },
      {
        "vi": "khắp nơi xa gần.",
        "ko": "온 땅으로!",
        "zh": "傳遍四境！",
        "en": "Throughout the land!",
        "ja": "世界で"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Mat 10:7; 24:14; Công 10:42; 1 Phi 3:15).",
      "ko": "(마태 10:7; 24:14; 사도 10:42; 베드로 전서 3:15 참조)",
      "zh": "（參看太10:7；24:14；徒10:42；彼前3:15）",
      "en": "(See also Matt. 10:7; 24:14; Acts 10:42; 1 Pet. 3:15.)",
      "ja": "（マタ 10:7; 24:14; 使徒 10:42; ペテ一 3:15も参照。）"
    }
  },
  {
    "number": 68,
    "sourceSheet": "68",
    "labels": {
      "vi": "BÀI HÁT 68",
      "ko": "68번",
      "zh": "詩歌第68首",
      "en": "SONG 68",
      "ja": "68番"
    },
    "title": {
      "vi": "Gieo hạt giống Nước Trời",
      "ko": "왕국의 씨를 뿌리라",
      "zh": "撒播王國的種子",
      "en": "Sowing Kingdom Seed",
      "ja": "王国の種をまく"
    },
    "scripture": {
      "vi": "(Ma-thi-ơ 13:4-8)",
      "ko": "(마태복음 13:4-8)",
      "zh": "（馬太福音13:4-8）",
      "en": "(Matthew 13:4-8)",
      "ja": "（マタイ 13:4-8）"
    },
    "lines": [
      {
        "vi": "1. Nào đến, ta cùng nhau chung sức chung lòng,",
        "ko": "1. ‘오라!' 초대해 주신 예수,",
        "zh": "1．來接受耶穌基督邀請，",
        "en": "1. Come share in the work of our Master;",
        "ja": "1. 奉仕に出掛けよう"
      },
      {
        "vi": "làm công việc thuở trước Chúa kêu gọi.",
        "ko": "마음 다해 따르리라.",
        "zh": "聽從吩咐、為他效力。",
        "en": "Respond to his call and obey.",
        "ja": "イエスに従い"
      },
      {
        "vi": "Ngài vẫn luôn kề bên soi lối đưa đường,",
        "ko": "진리의 씨를 뿌리는 법,",
        "zh": "他教導我們該怎麼做，",
        "en": "He offers to help and to guide you;",
        "ja": "真理の種まこう"
      },
      {
        "vi": "rèn luyện ta mỗi ngày thêm hữu hiệu.",
        "ko": "내게 가르쳐 주시리.",
        "zh": "指引我們向左向右。",
        "en": "His teaching will show you the way.",
        "ja": "主の指導受けて"
      },
      {
        "vi": "Hạt giống trong Lời Chúa, mình đã gieo và tưới,",
        "ko": "좋은 마음에 씨를 뿌리면",
        "zh": "將真理撒播純正心田中，",
        "en": "The seed of the truth has power to grow",
        "ja": "良い土に落ちる種"
      },
      {
        "vi": "dần lớn nơi tấm lòng yêu chân lý.",
        "ko": "점점 자라게 되리라.",
        "zh": "有朝一日開花結果。",
        "en": "In hearts that are honest and true.",
        "ja": "深く根を伸ばす"
      },
      {
        "vi": "Vậy hãy mau cùng nhau gieo khắp nơi hạt tươi tốt,",
        "ko": "내게 맡겨진 소중한 일이니",
        "zh": "忠心執行傳好消息的工作，",
        "en": "So give of your best as you faithfully share",
        "ja": "心にまかれた種が"
      },
      {
        "vi": "gắng siêng năng trong công việc ta được giao.",
        "ko": "정성을 다하여 일하리.",
        "zh": "決心盡全力不負所託。",
        "en": "In the work you've been given to do.",
        "ja": "育つのは喜び"
      },
      {
        "vi": "2. Phần giúp ta thành công trong lúc gieo hạt",
        "ko": "2. 얼마나 많이 거둘지는",
        "zh": "2．只要我們多努力傳道，",
        "en": "2. How much of your work is successful",
        "ja": "2. 真理を学ぶ人"
      },
      {
        "vi": "là do mình siêng tưới với vun bồi.",
        "ko": "흔히 나에게 달렸네.",
        "zh": "成果必定會更美好。",
        "en": "May often depend much on you.",
        "ja": "助けが必要"
      },
      {
        "vi": "Mình giúp cho người ta nghe tiếng Cha dạy",
        "ko": "마음에 깊이 심어 주면",
        "zh": "別人若願意聆聽真理，",
        "en": "Those hearing will need your assistance",
        "ja": "訪れる嵐に"
      },
      {
        "vi": "và học yêu mến ngài theo tháng ngày.",
        "ko": "진리 소중히 여기리.",
        "zh": "要教導他們愛上帝。",
        "en": "To learn and to love what is true.",
        "ja": "立ち向かうために"
      },
      {
        "vi": "Dù khó khăn thử thách xảy đến trong đời sống,",
        "ko": "꼭 겪게 되는 갈등과 압력",
        "zh": "幫助他們克服心中疑慮，",
        "en": "So help them to deal with pressures and doubts",
        "ja": "この奉仕打ち込めば"
      },
      {
        "vi": "họ vẫn luôn vững vàng không lay chuyển.",
        "ko": "잘 이기도록 도우면",
        "zh": "面對壓力也不放棄。",
        "en": "They're certain to face on their way.",
        "ja": "豊かに刈り取る"
      },
      {
        "vi": "Hạt giống ta từng gieo nay lớn lên và sinh trái.",
        "ko": "그 진리의 씨 날마다 자라니",
        "zh": "看他們一點一滴改變內心，",
        "en": "The seed of the truth will bring joy when you see",
        "ja": "忠実に心尽くし"
      },
      {
        "vi": "Sướng vui khi thấy bao người theo đường Cha.",
        "ko": "우린 큰 기쁨을 누리리.",
        "zh": "我們的喜樂難以言喻。",
        "en": "How it grows in their heart day by day.",
        "ja": "この仕事果たそう"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Mat 13:19-23; 22:37).",
      "ko": "(마태 13:19-23; 22:37 참조)",
      "zh": "（參看太13:19-23；22:37）",
      "en": "(See also Matt. 13:19-23; 22:37.)",
      "ja": "（マタ 13:19-23; 22:37も参照。）"
    }
  },
  {
    "number": 69,
    "sourceSheet": "69",
    "labels": {
      "vi": "BÀI HÁT 69",
      "ko": "69번",
      "zh": "詩歌第69首",
      "en": "SONG 69",
      "ja": "69番"
    },
    "title": {
      "vi": "Hãy tiến lên loan báo về Nước Trời!",
      "ko": "전진하라, 왕국 전파자들!",
      "zh": "勇往向前傳王國好消息",
      "en": "Go Forward in Preaching the Kingdom!",
      "ja": "王国を伝え続けましょう"
    },
    "scripture": {
      "vi": "(2 Ti-mô-thê 4:5)",
      "ko": "(디모데 후서 4:5)",
      "zh": "（提摩太後書4:5）",
      "en": "(2 Timothy 4:5)",
      "ja": "（テモテ第二 4:5）"
    },
    "lines": [
      {
        "vi": "1. Nào ta cùng rao cho mọi dân trên đất",
        "ko": "1. 온 땅 거하는 사람에게",
        "zh": "1．勇往向前，在世界各地",
        "en": "1. Go forward in preaching the Kingdom",
        "ja": "1. 世界中どこでも"
      },
      {
        "vi": "nghe đến thông điệp về Nước Cha.",
        "ko": "가서 왕국 전하라.",
        "zh": "宣揚王國好消息，",
        "en": "To people in ev'ry land.",
        "ja": "伝え続ける"
      },
      {
        "vi": "Vì yêu người xung quanh, mình đi loan báo,",
        "ko": "이웃 진실로 사랑하며",
        "zh": "幫助謙卑人擁護真理，",
        "en": "With love in your hearts for your neighbor,",
        "ja": "人々への愛を"
      },
      {
        "vi": "giúp đỡ ai nhu mì biết Cha.",
        "ko": "온유한 자 도우라.",
        "zh": "顯出真摯的愛心。",
        "en": "Help meek ones to take their stand.",
        "ja": "熱く抱いて"
      },
      {
        "vi": "Hăng hái rao ra Lời Cha trong suốt đời.",
        "ko": "우린 주의 일 좋아하니",
        "zh": "為上帝服務多麼榮幸，",
        "en": "Our service to God is a priv'lege;",
        "ja": "神から託された"
      },
      {
        "vi": "Vui sướng biết bao khi tôn vinh Chúa.",
        "ko": "전파하는 일 즐겁네.",
        "zh": "傳揚真理心中歡喜。",
        "en": "His word we are glad to proclaim.",
        "ja": "特別な仕事"
      },
      {
        "vi": "Mùa thu hoạch nay đang cần ta chung sức,",
        "ko": "야외 나가서 전파하여",
        "zh": "願加緊腳步、盡心竭力，",
        "en": "Go out in the field and keep preaching;",
        "ja": "奉仕に出掛けよう"
      },
      {
        "vi": "công bố thánh danh Cha ra gần xa.",
        "ko": "주 이름을 드높이리.",
        "zh": "顯揚上帝偉大聖名。",
        "en": "Give witness to God's holy name.",
        "ja": "神の名広めよう"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Ta tiến lên hăng say đi",
        "ko": "전진하라, 담대하게",
        "zh": "勇往向前，",
        "en": "Forward, boldly preach the",
        "ja": "進もう"
      },
      {
        "vi": "loan thông điệp muôn nơi, không hãi chi đâu.",
        "ko": "왕국 널리 전하라.",
        "zh": "要將王國好消息傳遍四境。",
        "en": "Kingdom message ever far and wide.",
        "ja": "遠く広く伝えよう"
      },
      {
        "vi": "Cùng nhau ta quyết tâm luôn luôn trung thành,",
        "ko": "전진하라, 주의 편에",
        "zh": "向前邁進，決心忠貞",
        "en": "Forward, faithful, loyally remaining",
        "ja": "進もう"
      },
      {
        "vi": "hát khen danh Cha muôn đời.",
        "ko": "서서 충성 지키라.",
        "zh": "擁護耶和華上帝。",
        "en": "on Jehovah's side.",
        "ja": "地の果てまで大胆に"
      },
      {
        "vi": "2. Già nua hoặc thanh niên, dù nam hay nữ,",
        "ko": "2. 적은 무리와 다른 양들,",
        "zh": "2．基督弟兄和另外綿羊",
        "en": "2. Together we press ever forward,",
        "ja": "2. 仲間たち全てと"
      },
      {
        "vi": "quyết bước theo sự thật mãi thôi.",
        "ko": "함께 전진한다네.",
        "zh": "肩並肩勇往向前，",
        "en": "Anointed and other sheep.",
        "ja": "伝え続ける"
      },
      {
        "vi": "Ngày nay dù ai \"xức dầu\" hay \"chiên khác\",",
        "ko": "남녀노소가 진리 따라",
        "zh": "基督徒不分男女老少",
        "en": "The old and the young men and women",
        "ja": "年長の人たち"
      },
      {
        "vi": "hãy tiến lên hầu việc Nước Cha.",
        "ko": "보조 맞춰 나가네.",
        "zh": "都行走真理之道。",
        "en": "In step with the truth do keep.",
        "ja": "若者たちも"
      },
      {
        "vi": "Dân khắp nơi đang cần nghe tin Nước Trời",
        "ko": "이 왕국의 좋은 소식을",
        "zh": "王國的信息多麼美好，",
        "en": "The good news of God's coming Kingdom",
        "ja": "互いに助け合い"
      },
      {
        "vi": "sẽ đến xóa tan đi bao cay đắng.",
        "ko": "모두에게 전하리라.",
        "zh": "所有人都需要聽到。",
        "en": "Is something that all need to hear.",
        "ja": "肩並べ歩む"
      },
      {
        "vi": "Dù cho nhiều gian nan bủa vây không ngớt,",
        "ko": "우리 하느님 힘 주시니",
        "zh": "倚賴耶和華所賜力量",
        "en": "We preach in the strength of Jehovah;",
        "ja": "エホバの力得て"
      },
      {
        "vi": "nương sức Chúa ta không lo sợ chi.",
        "ko": "두려울 것 하나 없네!",
        "zh": "繼續勇敢向人傳道。",
        "en": "With him there is nothing to fear!",
        "ja": "恐れず語ろう"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Ta tiến lên hăng say đi",
        "ko": "전진하라, 담대하게",
        "zh": "勇往向前，",
        "en": "Forward, boldly preach the",
        "ja": "進もう"
      },
      {
        "vi": "loan thông điệp muôn nơi, không hãi chi đâu.",
        "ko": "왕국 널리 전하라.",
        "zh": "要將王國好消息傳遍四境。",
        "en": "Kingdom message ever far and wide.",
        "ja": "遠く広く伝えよう"
      },
      {
        "vi": "Cùng nhau ta quyết tâm luôn luôn trung thành,",
        "ko": "전진하라, 주의 편에",
        "zh": "向前邁進，決心忠貞",
        "en": "Forward, faithful, loyally remaining",
        "ja": "進もう"
      },
      {
        "vi": "hát khen danh Cha muôn đời.",
        "ko": "서서 충성 지키라.",
        "zh": "擁護耶和華上帝。",
        "en": "on Jehovah's side.",
        "ja": "地の果てまで大胆に"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 23:4; Công 4:29, 31; 1 Phi 2:21).",
      "ko": "(시 23:4; 사도 4:29, 31; 베드로 전서 2:21 참조)",
      "zh": "（參看詩23:4；徒4:29,31；彼前2:21）",
      "en": "(See also Ps. 23:4; Acts 4:29, 31; 1 Pet. 2:21.)",
      "ja": "（詩 23:4; 使徒 4:29，31; ペテ一 2:21も参照。）"
    }
  },
  {
    "number": 70,
    "sourceSheet": "70",
    "labels": {
      "vi": "BÀI HÁT 70",
      "ko": "70번",
      "zh": "詩歌第70首",
      "en": "SONG 70",
      "ja": "70番"
    },
    "title": {
      "vi": "Tìm kiếm những người xứng đáng",
      "ko": "합당한 사람들을 찾으라",
      "zh": "找出配得的人",
      "en": "Search Out Deserving Ones",
      "ja": "ふさわしい人を探そう"
    },
    "scripture": {
      "vi": "(Ma-thi-ơ 10:11-15)",
      "ko": "(마태복음 10:11-15)",
      "zh": "（馬太福音10:11-15）",
      "en": "(Matthew 10:11-15)",
      "ja": "（マタイ 10:11-15）"
    },
    "lines": [
      {
        "vi": "1. Thời xưa Chúa Giê-su chỉ cho ta cách rao truyền,",
        "ko": "1. 왕국 소식을 전하는 방법을",
        "zh": "1．我們要聽從耶穌基督指引，",
        "en": "1. In preaching the Kingdom and teaching the truth,",
        "ja": "1. ふさわしい人探そう"
      },
      {
        "vi": "dạy dỗ cho mọi nước nghe Lời Cha:",
        "ko": "예수 가르쳐 주셨네.",
        "zh": "宣揚王國、教人真理。",
        "en": "Our Lord showed us how to proceed:",
        "ja": "イエスに従い"
      },
      {
        "vi": "‘Dù đi đến nơi đâu hãy siêng năng để tìm kiếm",
        "ko": "‘영적 필요를 느끼는 사람들",
        "zh": "他說：「要找出願意聆聽的人，",
        "en": "‘Search out those deserving and ready to hear,",
        "ja": "真の神を探す人"
      },
      {
        "vi": "ai thành tâm mong được Cha chiếu soi đường.",
        "ko": "힘써 찾으려 노력하라.",
        "zh": "他們都渴望認識真神。",
        "en": "Those aware of their spiritual need.",
        "ja": "区域で待っている"
      },
      {
        "vi": "Đến nhà, mình hỏi thăm và chúc cho bao phước lành,",
        "ko": "인사하면서 평화 빌어 주고",
        "zh": "要向人問好，顯出真摯關懷，",
        "en": "By greeting the household and wishing it peace,",
        "ja": "追い返される日もある"
      },
      {
        "vi": "sự bình an Cha có thể xuống trên họ.",
        "ko": "그 평화 머물게 하여라.",
        "zh": "願上帝賜平安給他們。",
        "en": "Then it may be that peace you'll impart.",
        "ja": "でも務め果たした"
      },
      {
        "vi": "Còn ai chối không nghe, hãy đi ra khỏi nhà ấy,",
        "ko": "돌아가라며 듣지 않는다면",
        "zh": "若人不想聽，就要安靜離開，",
        "en": "But when they refuse you or turn you away,",
        "ja": "前を見てまた進もう"
      },
      {
        "vi": "giũ bụi đất nơi bàn chân, chẳng nên buồn'.",
        "ko": "먼지 털어 내고 떠나라.'",
        "zh": "再找出願意聆聽的人。」",
        "en": "Shake the dust from your feet and depart.'",
        "ja": "気持ちを切り替えて"
      },
      {
        "vi": "2. Người đang lắng nghe ta cũng như nghe tiếng Cha dạy,",
        "ko": "2. 마음 열고서 반기는 사람들",
        "zh": "2．人敞開心扉聆聽上帝話語，",
        "en": "2. All those who receive you receive him as well,",
        "ja": "2. ふさわしい人探そう"
      },
      {
        "vi": "lòng sướng vui hưởng ứng thông điệp Cha.",
        "ko": "정성 다해 도와주리.",
        "zh": "就是接受耶穌教導。",
        "en": "Respond when their heart opens wide.",
        "ja": "希望捨てないで"
      },
      {
        "vi": "Họ thêm vững tin nơi Giê-hô-va nên nguyện ước",
        "ko": "좋은 성향을 보이는 사람들",
        "zh": "他們若一心尋求真正生命，",
        "en": "Their right disposition for unending life",
        "ja": "心で聞く人がいる"
      },
      {
        "vi": "bên cạnh ta tôn thờ Cha đến muôn đời.",
        "ko": "함께 하느님 섬기리라.",
        "zh": "必學習聖經，崇拜上帝。",
        "en": "Will impel them to serve at your side.",
        "ja": "あなたを待っている"
      },
      {
        "vi": "Chúng ta không phải lo nên nói chi hay giảng gì",
        "ko": "무슨 말 해야 좋을지 모를 때",
        "zh": "耶和華必賜你口才和智慧，",
        "en": "And never be anxious about what to say,",
        "ja": "よく準備して話そう"
      },
      {
        "vi": "vì rằng Cha soi chiếu lối dẫn đưa mình.",
        "ko": "여호와 도움을 주시네.",
        "zh": "你不用煩惱如何應對。",
        "en": "For Jehovah will help you to speak.",
        "ja": "心配は要らない"
      },
      {
        "vi": "Lời ta phải nêm thêm muối sao cho luôn tử tế,",
        "ko": "항상 맛 내어 친절히 말하여",
        "zh": "你態度溫和，說話用鹽調味，",
        "en": "Your answer when gracious and seasoned with salt",
        "ja": "神の力働けば"
      },
      {
        "vi": "cho người ngay nghe về Cha, hát khen ngài.",
        "ko": "겸손한 사람들 도우리.",
        "zh": "他們會看出真理可貴。",
        "en": "Will appeal to the humble and meek.",
        "ja": "人の心動く"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Công 13:48; 16:14; Cô 4:6).",
      "ko": "(사도 13:48; 16:14; 골로새 4:6 참조)",
      "zh": "（參看徒13:48；16:14；西4:6）",
      "en": "(See also Acts 13:48; 16:14; Col. 4:6.)",
      "ja": "（使徒 13:48; 16:14; コロ 4:6も参照。）"
    }
  },
  {
    "number": 71,
    "sourceSheet": "71",
    "labels": {
      "vi": "BÀI HÁT 71",
      "ko": "71번",
      "zh": "詩歌第71首",
      "en": "SONG 71",
      "ja": "71番"
    },
    "title": {
      "vi": "Chúng ta là đạo quân của Đức Giê-hô-va!",
      "ko": "우리는 여호와의 군대!",
      "zh": "耶和華的英勇戰士",
      "en": "We Are Jehovah's Army!",
      "ja": "私たちはエホバの軍勢！"
    },
    "scripture": {
      "vi": "(Ê-phê-sô 6:11-14)",
      "ko": "(에베소 6:11-14)",
      "zh": "（以弗所書6:11-14）",
      "en": "(Ephesians 6:11-14)",
      "ja": "（エフェソス 6:11-14）"
    },
    "lines": [
      {
        "vi": "1. Mình như những quân binh can trường",
        "ko": "1. 우리는 여호와의",
        "zh": "1．上帝的英勇戰士",
        "en": "1. We are Jehovah's army,",
        "ja": "1. 神に従う"
      },
      {
        "vi": "thuộc về Giê-hô-va.",
        "ko": "용감한 군대.",
        "zh": "服從他愛子。",
        "en": "Under Christ, his Son.",
        "ja": "軍勢は"
      },
      {
        "vi": "Cùng nhau tiến lên, không lùi bước",
        "ko": "예수의 지휘 아래",
        "zh": "儘管受撒但反對，",
        "en": "Though we're opposed by Satan,",
        "ja": "足並みそろえ"
      },
      {
        "vi": "mặc dù Sa-tan tấn công.",
        "ko": "사탄과 맞서네.",
        "zh": "依然勇往直前。",
        "en": "We are marching as one.",
        "ja": "進んでいく"
      },
      {
        "vi": "Quyết tâm đi truyền giảng tin mừng",
        "ko": "충실하게 말씀을",
        "zh": "我們服從耶和華，",
        "en": "We keep serving faithfully,",
        "ja": "どんな迫害"
      },
      {
        "vi": "để muôn dân được biết.",
        "ko": "전파하면서",
        "zh": "將信息傳揚，",
        "en": "Preaching far and near;",
        "ja": "起ころうと"
      },
      {
        "vi": "Dù chông gai khắp nẻo đường,",
        "ko": "계속 전진하네,",
        "zh": "決心保持堅毅，",
        "en": "We remain determined",
        "ja": "真理語り"
      },
      {
        "vi": "lòng không hãi sợ chi.",
        "ko": "두려움 없이.",
        "zh": "不退縮害怕。",
        "en": "With no hint of fear.",
        "ja": "恐れない"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Là bao chiến binh luôn trung thành",
        "ko": "주 여호와의 군대,",
        "zh": "上帝的英勇戰士，",
        "en": "We are Jehovah's army;",
        "ja": "エホバの軍は"
      },
      {
        "vi": "kề bên Chúa Giê-su,",
        "ko": "기뻐 외치세,",
        "zh": "要團結一致。",
        "en": "With his Christ we're one,",
        "ja": "勇ましく"
      },
      {
        "vi": "chúng ta vui mừng rao truyền:",
        "ko": "\"하느님의 통치",
        "zh": "一同歡樂宣告：",
        "en": "Joyfully declaring,",
        "ja": "神の統治"
      },
      {
        "vi": "\"Nước Cha nay trị vì\".",
        "ko": "시작되었다.\"",
        "zh": "「上帝已統治。」",
        "en": "\"God's rule has begun.\"",
        "ja": "告げていく"
      },
      {
        "vi": "2. Là tôi tớ Cha nên ta nguyện",
        "ko": "2. 소중한 주의 양들",
        "zh": "2．上帝的忠心僕人",
        "en": "2. We are Jehovah's servants,",
        "ja": "2. 神に仕える"
      },
      {
        "vi": "thành tâm kiếm tìm chiên,",
        "ko": "찾아야 하네.",
        "zh": "盡全力服務，",
        "en": "Searching for his sheep,",
        "ja": "軍勢は"
      },
      {
        "vi": "tìm ai vẫn đang đi lạc lối,",
        "ko": "길 잃고 탄식하는",
        "zh": "尋找迷失的綿羊，",
        "en": "Those who are lost and scattered,",
        "ja": "嘆き悲しむ羊"
      },
      {
        "vi": "người lẻ loi đang khóc than.",
        "ko": "수많은 사람을.",
        "zh": "細心照顧餵養。",
        "en": "Those who sigh and who weep.",
        "ja": "探す"
      },
      {
        "vi": "Chúng ta chuyên cần viếng thăm họ,",
        "ko": "충실하게 찾아가",
        "zh": "我們要堅持不懈",
        "en": "These we try to find and feed",
        "ja": "神の言葉を"
      },
      {
        "vi": "gắng siêng năng dạy dỗ;",
        "ko": "계속 돌보며",
        "zh": "邀他們聚會，",
        "en": "With repeated calls;",
        "ja": "よく教え"
      },
      {
        "vi": "và ta yêu thương khích lệ",
        "ko": "함께 모이도록",
        "zh": "樂意伸出援手，",
        "en": "These we keep inviting",
        "ja": "いつも招く"
      },
      {
        "vi": "họ đi đến nhà Cha.",
        "ko": "초대하리라.",
        "zh": "陪伴在左右。",
        "en": "To our Kingdom Halls.",
        "ja": "集会へ"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Là bao chiến binh luôn trung thành",
        "ko": "주 여호와의 군대,",
        "zh": "上帝的英勇戰士，",
        "en": "We are Jehovah's army;",
        "ja": "エホバの軍は"
      },
      {
        "vi": "kề bên Chúa Giê-su,",
        "ko": "기뻐 외치세,",
        "zh": "要團結一致。",
        "en": "With his Christ we're one,",
        "ja": "勇ましく"
      },
      {
        "vi": "chúng ta vui mừng rao truyền:",
        "ko": "\"하느님의 통치",
        "zh": "一同歡樂宣告：",
        "en": "Joyfully declaring,",
        "ja": "神の統治"
      },
      {
        "vi": "\"Nước Cha nay trị vì\".",
        "ko": "시작되었다.\"",
        "zh": "「上帝已統治。」",
        "en": "\"God's rule has begun.\"",
        "ja": "告げていく"
      },
      {
        "vi": "3. Là bao chiến binh do Cha chọn,",
        "ko": "3. 예수의 명령 따라",
        "zh": "3．上帝的英勇戰士",
        "en": "3. We are Jehovah's army,",
        "ja": "3. イエス率いる"
      },
      {
        "vi": "mình theo Chúa Giê-su.",
        "ko": "주의 군대는",
        "zh": "聽基督吩咐，",
        "en": "Under Christ's command,",
        "ja": "軍勢は"
      },
      {
        "vi": "Nhận binh khí thiêng liêng đầy đủ,",
        "ko": "전투할 준비하고",
        "zh": "做好出戰的準備，",
        "en": "Fully equipped for battle,",
        "ja": "装備固める"
      },
      {
        "vi": "rồi xông pha đi chiến chinh.",
        "ko": "굳건히 서 있네.",
        "zh": "決心永不後退。",
        "en": "Each one firmly will stand.",
        "ja": "神の武具で"
      },
      {
        "vi": "Chú tâm canh chừng mối nguy hại,",
        "ko": "신중하게 옳은 길",
        "zh": "我們要謹慎行事，",
        "en": "Cautious though we need to be,",
        "ja": "用心深く"
      },
      {
        "vi": "quyết trung kiên bền vững.",
        "ko": "계속 걸으며",
        "zh": "不偏離正義，",
        "en": "Upright we remain.",
        "ja": "大胆に"
      },
      {
        "vi": "Dù lâm nguy trên chiến trận,",
        "ko": "위험 직면해도",
        "zh": "面對考驗、威脅，",
        "en": "In the face of danger,",
        "ja": "真理の道"
      },
      {
        "vi": "nguyện vâng giữ Lời Cha.",
        "ko": "진리 지키리.",
        "zh": "仍擁護真理。",
        "en": "Truth we will maintain.",
        "ja": "突き進む"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Là bao chiến binh luôn trung thành",
        "ko": "주 여호와의 군대,",
        "zh": "上帝的英勇戰士，",
        "en": "We are Jehovah's army;",
        "ja": "エホバの軍は"
      },
      {
        "vi": "kề bên Chúa Giê-su,",
        "ko": "기뻐 외치세,",
        "zh": "要團結一致。",
        "en": "With his Christ we're one,",
        "ja": "勇ましく"
      },
      {
        "vi": "chúng ta vui mừng rao truyền:",
        "ko": "\"하느님의 통치",
        "zh": "一同歡樂宣告：",
        "en": "Joyfully declaring,",
        "ja": "神の統治"
      },
      {
        "vi": "\"Nước Cha nay trị vì\".",
        "ko": "시작되었다.\"",
        "zh": "「上帝已統治。」",
        "en": "\"God's rule has begun.\"",
        "ja": "告げていく"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Ê-phê 6:11, 14; Phi-líp 1:7; Phi-lê 2).",
      "ko": "(빌립보 1:7; 빌레몬 2 참조)",
      "zh": "（參看腓1:7；門2）",
      "en": "(See also Phil. 1:7; Philem. 2.)",
      "ja": "（フィリ 1:7; フィレ 2も参照。）"
    }
  },
  {
    "number": 72,
    "sourceSheet": "72",
    "labels": {
      "vi": "BÀI HÁT 72",
      "ko": "72번",
      "zh": "詩歌第72首",
      "en": "SONG 72",
      "ja": "72番"
    },
    "title": {
      "vi": "Rao truyền chân lý",
      "ko": "왕국 진리를 알리라",
      "zh": "宣揚王國的真理",
      "en": "Making Known the Kingdom Truth",
      "ja": "王国の真理を知らせる"
    },
    "scripture": {
      "vi": "(Công vụ 20:20, 21)",
      "ko": "(사도행전 20:20, 21)",
      "zh": "（使徒行傳20:20,21）",
      "en": "(Acts 20:20, 21)",
      "ja": "（使徒 20:20，21）"
    },
    "lines": [
      {
        "vi": "1. Đời mình xưa kia không biết đường nào",
        "ko": "1. 그리스도 따르는 길",
        "zh": "1．我們從前並不知道，",
        "en": "1. There was a time we did not know",
        "ja": "1. 今や悟った"
      },
      {
        "vi": "là đường chính đáng cho tín đồ thật,",
        "ko": "우리 한때 몰랐지만,",
        "zh": "真基督徒行走的道。",
        "en": "The way a Christian ought to go.",
        "ja": "歩むべき道を"
      },
      {
        "vi": "đến khi Cha soi chiếu cho mình",
        "ko": "여호와 빛 주시니",
        "zh": "耶和華逐步啟迪，",
        "en": "Then Jehovah sent the light,",
        "ja": "きらめく光に"
      },
      {
        "vi": "về chân lý mang hy vọng Nước Trời.",
        "ko": "왕국 진리 밝혀졌네.",
        "zh": "王國真理明亮清晰。",
        "en": "His Kingdom truth so clear and bright.",
        "ja": "心は目覚めて"
      },
      {
        "vi": "Hiểu được ý muốn Cha Giê-hô-va,",
        "ko": "신권 통치 확장하며",
        "zh": "我們明白天父旨意，",
        "en": "Our Father's will we then could see",
        "ja": "エホバをたたえて"
      },
      {
        "vi": "lòng ta sốt sắng, vui sướng thờ ngài.",
        "ko": "주의 명성 선포하고",
        "zh": "追求王國，行事正義。",
        "en": "To serve the grand Theocracy,",
        "ja": "真理を知らせる"
      },
      {
        "vi": "Chúng ta luôn dạn dĩ rao truyền",
        "ko": "그 이름 높이는 것,",
        "zh": "要讚頌上帝美名，",
        "en": "To declare Jehovah's fame,",
        "ja": "何て素晴らしい"
      },
      {
        "vi": "sự vinh hiển Cha, khen ngợi thánh danh của ngài.",
        "ko": "아버지 여호와의 뜻이네.",
        "zh": "一同榮耀天父偉大聖名。",
        "en": "And help to glorify his holy name.",
        "ja": "名誉あるこの務め"
      },
      {
        "vi": "Gặp người muôn nơi, từng nhà, góc phố,",
        "ko": "우리 이제 어디서나",
        "zh": "走在街上傳頌上帝，",
        "en": "We witness now to all we meet,",
        "ja": "会う人全てに"
      },
      {
        "vi": "để họ biết đến Cha Giê-hô-va.",
        "ko": "모두에게 증거하네.",
        "zh": "挨家挨戶宣揚真理。",
        "en": "From door to door and on the street.",
        "ja": "真理を語ろう"
      },
      {
        "vi": "Mình gắng chuyên tâm dạy ai nấy biết",
        "ko": "시간 내어 가르쳐서",
        "zh": "幫助別人改變生活，",
        "en": "We take the time to help them see;",
        "ja": "自由へ導く"
      },
      {
        "vi": "lối đi bình an, ngời sáng tương lai.",
        "ko": "자유의 진리 전하네.",
        "zh": "真理能讓人得自由。",
        "en": "We teach the truth that sets us free.",
        "ja": "命の言葉を"
      },
      {
        "vi": "Nhiệm vụ Cha giao, ta gắng hoàn thành",
        "ko": "참숭배의 확장 위해",
        "zh": "全力宣揚王國信息，",
        "en": "And as we strive in ev'ry land",
        "ja": "世界の果てまで"
      },
      {
        "vi": "để người khắp chốn tôn kính mình ngài.",
        "ko": "온 땅에서 힘쓰리라.",
        "zh": "正確崇拜傳遍大地。",
        "en": "Jehovah's worship to expand,",
        "ja": "王国広める"
      },
      {
        "vi": "Chúng ta nguyện hợp nhất rao truyền",
        "ko": "여호와 하느님이",
        "zh": "要執行傳道重任，",
        "en": "May we serve our God as one",
        "ja": "力尽くそう"
      },
      {
        "vi": "từ nay đến khi Cha lệnh: ‘Đã xong việc rồi!'.",
        "ko": "\"다 되었다\"고 하실 때까지.",
        "zh": "直到上帝宣布大功告成。",
        "en": "Until Jehovah says the work is done.",
        "ja": "エホバ定めた日まで"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Giô-suê 9:9; Ê-sai 24:15; Giăng 8:12, 32).",
      "ko": "(여호수아 9:9; 이사야 24:15; 요한 8:12, 32 참조)",
      "zh": "（參看書9:9；賽24:15；約8:12,32）",
      "en": "(See also Josh. 9:9; Isa. 24:15; John 8:12, 32.)",
      "ja": "（ヨシュ 9:9; イザ 24:15; ヨハ 8:12，32も参照。）"
    }
  },
  {
    "number": 73,
    "sourceSheet": "73",
    "labels": {
      "vi": "BÀI HÁT 73",
      "ko": "73번",
      "zh": "詩歌第73首",
      "en": "SONG 73",
      "ja": "73番"
    },
    "title": {
      "vi": "Xin giúp chúng con dạn dĩ",
      "ko": "담대함을 주소서",
      "zh": "求你賜我們勇氣",
      "en": "Grant Us Boldness",
      "ja": "私たちに大胆さを与えてください"
    },
    "scripture": {
      "vi": "(Công vụ 4:29)",
      "ko": "(사도행전 4:29)",
      "zh": "（使徒行傳4:29）",
      "en": "(Acts 4:29)",
      "ja": "（使徒 4:29）"
    },
    "lines": [
      {
        "vi": "1. Ngày ngày đi rao truyền về danh thánh",
        "ko": "1. 왕국 소식 알리면서",
        "zh": "1．我們傳揚王國信息，",
        "en": "1. As we tell about the Kingdom,",
        "ja": "1. 王国の知らせ"
      },
      {
        "vi": "và Nước Cha trị vì đời đời.",
        "ko": "주 이름 증거할 때,",
        "zh": "稱頌耶和華的名，",
        "en": "As we witness for your name,",
        "ja": "伝える時に"
      },
      {
        "vi": "Nhiều kẻ khinh khi, nhạo cười, chê trách",
        "ko": "반대하고 욕하는 자",
        "zh": "難免經歷反對、艱辛，",
        "en": "There are many who oppose us",
        "ja": "反対されても"
      },
      {
        "vi": "về Nhân Chứng của Giê-hô-va.",
        "ko": "아무리 많다 해도",
        "zh": "遭受不公與不平。",
        "en": "And who try to bring us shame.",
        "ja": "あざけられても"
      },
      {
        "vi": "Dù gian khó, lòng đầy quyết tâm.",
        "ko": "두려워 떨지 않고",
        "zh": "但我們無所畏懼，",
        "en": "But instead of fearing men,",
        "ja": "人を恐れず"
      },
      {
        "vi": "Nguyện theo Cha mãi, chẳng hề thoái lui.",
        "ko": "주께만 순종하리니,",
        "zh": "下定決心忠貞不渝。",
        "en": "It's really you we must obey.",
        "ja": "エホバに従う"
      },
      {
        "vi": "Mọi tôi tớ khẩn cầu, xin Cha đáp lời,",
        "ko": "아버지 영을 간청하는",
        "zh": "求你聽我們熱切懇求，",
        "en": "So we beg you now for your spirit;",
        "ja": "導きを求めて"
      },
      {
        "vi": "truyền thêm sức mạnh cùng thần khí Cha.",
        "ko": "기도를 들어 주소서.",
        "zh": "幫助我們剛強堅毅。",
        "en": "O Jehovah, hear what we pray.",
        "ja": "エホバに祈ろう"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Cầu ngài ban cho một lòng dạn dĩ,",
        "ko": "담대하게 해 주소서,",
        "zh": "求你賜予我們勇氣，",
        "en": "Grant us boldness as we witness;",
        "ja": "与えてください"
      },
      {
        "vi": "để hăng hái truyền giảng từng nhà.",
        "ko": "두려움 이기도록.",
        "zh": "放膽宣揚好消息。",
        "en": "Help us overcome our fear.",
        "ja": "強い心を"
      },
      {
        "vi": "Chẳng sợ chi nhưng nhiệt thành loan báo",
        "ko": "힘과 용기를 주소서,",
        "zh": "讓我們能滿懷信心",
        "en": "Give us confidence and courage",
        "ja": "恐れに負けずに"
      },
      {
        "vi": "mọi dân biết về Giê-hô-va.",
        "ko": "널리 전파하도록.",
        "zh": "在全地傳揚真理。",
        "en": "So that all the world may hear.",
        "ja": "語れるように"
      },
      {
        "vi": "Ha-ma-ghê-đôn giờ đây chẳng xa,",
        "ko": "아마겟돈 다가오니",
        "zh": "你的大日子已臨近，",
        "en": "Armageddon draws ever near,",
        "ja": "大胆に語る"
      },
      {
        "vi": "lòng kiên quyết rao Lời Cha khắp nơi.",
        "ko": "마지막 그 순간까지",
        "zh": "求你賜予我們勇氣，",
        "en": "But until that great day is here,",
        "ja": "勇気と力を"
      },
      {
        "vi": "Cầu ngài ban cho một lòng dạn dĩ",
        "ko": "담대하게 전할 용기,",
        "zh": "滿懷信心傳好消息，",
        "en": "Grant us boldness as we witness.",
        "ja": "与えてください"
      },
      {
        "vi": "báo tin vui này.",
        "ko": "힘 주소서.",
        "zh": "堅定不移。",
        "en": "This is our prayer.",
        "ja": "エホバよ"
      },
      {
        "vi": "2. Dù sợ nhưng tin rằng ngài ghi nhớ",
        "ko": "2. 두려움에 떨릴 때도",
        "zh": "2．有時感到害怕退縮，",
        "en": "2. Even though we may be fearful,",
        "ja": "2. 弱さと恐れを"
      },
      {
        "vi": "đầy tớ Cha chỉ là người phàm.",
        "ko": "우리 약함 아시고",
        "zh": "你深知我們軟弱。",
        "en": "You remember we are dust.",
        "ja": "感じる時も"
      },
      {
        "vi": "Một lòng tin nơi lời ngài đã hứa,",
        "ko": "함께하며 힘 주시니",
        "zh": "我們面對考驗逼迫，",
        "en": "Your assurance to support us",
        "ja": "エホバの支えを"
      },
      {
        "vi": "ngài thêm sức, trợ lực hằng ngày.",
        "ko": "흔들림 없으리다.",
        "zh": "仍深信你的承諾。",
        "en": "Is a promise we can trust.",
        "ja": "信じて頼る"
      },
      {
        "vi": "Xin Cha hãy từ trời đoái xem",
        "ko": "박해, 위협받을 때",
        "zh": "雖受迫害和欺壓，",
        "en": "Give attention to the threats",
        "ja": "神は必ず"
      },
      {
        "vi": "người ta ghen ghét, sỉ nhục chúng con.",
        "ko": "주의를 기울이시어",
        "zh": "你必賜予我們力量，",
        "en": "Of those who persecute and blame.",
        "ja": "助けてくださる"
      },
      {
        "vi": "Cầu Cha mãi ở cùng mọi tôi tớ ngài",
        "ko": "계속 담대히 주의 이름",
        "zh": "請幫助我們更加堅定，",
        "en": "May you help us all to continue",
        "ja": "導きを求めて"
      },
      {
        "vi": "hầu danh thánh ngài được dạn dĩ rao.",
        "ko": "증거할 힘을 주소서.",
        "zh": "勇敢宣揚你的聖名。",
        "en": "As we boldly speak in your name.",
        "ja": "エホバに祈ろう"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Cầu ngài ban cho một lòng dạn dĩ,",
        "ko": "담대하게 해 주소서,",
        "zh": "求你賜予我們勇氣，",
        "en": "Grant us boldness as we witness;",
        "ja": "与えてください"
      },
      {
        "vi": "để hăng hái truyền giảng từng nhà.",
        "ko": "두려움 이기도록.",
        "zh": "放膽宣揚好消息。",
        "en": "Help us overcome our fear.",
        "ja": "強い心を"
      },
      {
        "vi": "Chẳng sợ chi nhưng nhiệt thành loan báo",
        "ko": "힘과 용기를 주소서,",
        "zh": "讓我們能滿懷信心",
        "en": "Give us confidence and courage",
        "ja": "恐れに負けずに"
      },
      {
        "vi": "mọi dân biết về Giê-hô-va.",
        "ko": "널리 전파하도록.",
        "zh": "在全地傳揚真理。",
        "en": "So that all the world may hear.",
        "ja": "語れるように"
      },
      {
        "vi": "Ha-ma-ghê-đôn giờ đây chẳng xa,",
        "ko": "아마겟돈 다가오니",
        "zh": "你的大日子已臨近，",
        "en": "Armageddon draws ever near,",
        "ja": "大胆に語る"
      },
      {
        "vi": "lòng kiên quyết rao Lời Cha khắp nơi.",
        "ko": "마지막 그 순간까지",
        "zh": "求你賜予我們勇氣，",
        "en": "But until that great day is here,",
        "ja": "勇気と力を"
      },
      {
        "vi": "Cầu ngài ban cho một lòng dạn dĩ",
        "ko": "담대하게 전할 용기,",
        "zh": "滿懷信心傳好消息，",
        "en": "Grant us boldness as we witness.",
        "ja": "与えてください"
      },
      {
        "vi": "báo tin vui này.",
        "ko": "힘 주소서.",
        "zh": "堅定不移。",
        "en": "This is our prayer.",
        "ja": "エホバよ"
      }
    ],
    "reference": {
      "vi": "(Cũng xem 1 Tê 2:2; Hê 10:35).",
      "ko": "(데살로니가 전서 2:2; 히브리 10:35 참조)",
      "zh": "（參看帖前2:2；來10:35）",
      "en": "(See also 1 Thess. 2:2; Heb. 10:35.)",
      "ja": "（テサ一 2:2; ヘブ 10:35も参照。）"
    }
  },
  {
    "number": 74,
    "sourceSheet": "74",
    "labels": {
      "vi": "BÀI HÁT 74",
      "ko": "74번",
      "zh": "詩歌第74首",
      "en": "SONG 74",
      "ja": "74番"
    },
    "title": {
      "vi": "Hãy cùng hát bài ca Nước Trời!",
      "ko": "함께 왕국 노래를 부르세!",
      "zh": "一同高唱王國之歌！",
      "en": "Join in the Kingdom Song!",
      "ja": "王国の歌に加わろう"
    },
    "scripture": {
      "vi": "(Thi thiên 98:1)",
      "ko": "(시편 98:1)",
      "zh": "（詩篇98:1）",
      "en": "(Psalm 98:1)",
      "ja": "（詩編 98:1）"
    },
    "lines": [
      {
        "vi": "1. Bài ca chiến thắng, một ca khúc vui mừng nức lòng;",
        "ko": "1. 이 노래는 승리의 기쁜 노래.",
        "zh": "1．這是一首快樂的勝利之歌，",
        "en": "1. This is a song, a happy song of vict'ry;",
        "ja": "1. 至高の神をたたえる"
      },
      {
        "vi": "bài ca tôn vinh về Cha Tối Cao trên trời.",
        "ko": "지존하신 하느님 높이네.",
        "zh": "顯揚至高偉大的耶和華。",
        "en": "It magnifies the One who is supreme.",
        "ja": "うれしい勝利の歌"
      },
      {
        "vi": "Lời ca thôi thúc và mang đến hy vọng sáng ngời.",
        "ko": "희망 주며 충성심 고무하니",
        "zh": "王國之歌給人無限的希望，",
        "en": "The words give hope and prompt all to be loyal.",
        "ja": "仲間と共に歌えば"
      },
      {
        "vi": "Chúng ta hòa chung một giọng hát ca khen ngài:",
        "ko": "노래하세, 왕국을 주제로.",
        "zh": "請與我們一同高聲歡唱！",
        "en": "Come sing with us; enjoy its Kingdom theme:",
        "ja": "希望があふれてくる"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "\"Mau cùng nhau đến khen ngợi danh thánh,",
        "ko": "‘주 여호와 숭배하고",
        "zh": "稱頌上帝，要敬拜他。",
        "en": "‘Come worship God Before his throne.",
        "ja": "エホバをたたえよう"
      },
      {
        "vi": "cho mọi dân biết Con được ban Nước!",
        "ko": "아들 통치 알려 주세!",
        "zh": "基督作王，廣為宣揚。",
        "en": "His Son is King; Let's make it known!",
        "ja": "聖なるその名を"
      },
      {
        "vi": "Giờ đây ta hãy học ca khúc rao về Nước Cha,",
        "ko": "왕국 노래, 이 노래 함께 배워",
        "zh": "王國之歌，一起來快樂高唱，",
        "en": "Come learn this song, this song about the Kingdom;",
        "ja": "王国の歌を学び"
      },
      {
        "vi": "mãi tôn thờ Cha, hạ mình trước ngôi cao trọng\".",
        "ko": "주 섬기고 그 이름 높이세.'",
        "zh": "忠於上帝，將他聖名傳講。",
        "en": "Bow down to God, and praise his holy name.'",
        "ja": "イエスの統治 告げよう"
      },
      {
        "vi": "2. Bài ca đây mới, truyền rao khắp nơi về Nước Trời;",
        "ko": "2. 새 노래로 왕국을 광고하네.",
        "zh": "2．這首新歌宣揚上帝的王國，",
        "en": "2. With this new song, we advertise the Kingdom.",
        "ja": "2. 王国 天に建てられ"
      },
      {
        "vi": "Giê-su lên ngôi, quyền vương khắp trên địa cầu.",
        "ko": "그리스도 이 땅 다스리네.",
        "zh": "耶穌基督快要統治全地。",
        "en": "Christ Jesus rules; the earth is his domain.",
        "ja": "新しい歌が響く"
      },
      {
        "vi": "Được tiên tri trước, một dân mới vui mừng đón chờ",
        "ko": "예언대로 탄생한 주의 백성",
        "zh": "聖經預告一個新國族誕生，",
        "en": "And as foretold, there is a newborn nation:",
        "ja": "聖なる国民生まれ"
      },
      {
        "vi": "sẽ cai trị trong triều đại của Vua uy quyền.",
        "ko": "예수 통치 기꺼이 받드네.",
        "zh": "他們忠貞擁護君王基督。",
        "en": "The Kingdom heirs, who welcome Jesus' reign:",
        "ja": "加わる その統治に"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "\"Mau cùng nhau đến khen ngợi danh thánh,",
        "ko": "‘주 여호와 숭배하고",
        "zh": "稱頌上帝，要敬拜他。",
        "en": "‘Come worship God Before his throne.",
        "ja": "エホバをたたえよう"
      },
      {
        "vi": "cho mọi dân biết Con được ban Nước!",
        "ko": "아들 통치 알려 주세!",
        "zh": "基督作王，廣為宣揚。",
        "en": "His Son is King; Let's make it known!",
        "ja": "聖なるその名を"
      },
      {
        "vi": "Giờ đây ta hãy học ca khúc rao về Nước Cha,",
        "ko": "왕국 노래, 이 노래 함께 배워",
        "zh": "王國之歌，一起來快樂高唱，",
        "en": "Come learn this song, this song about the Kingdom;",
        "ja": "王国の歌を学び"
      },
      {
        "vi": "mãi tôn thờ Cha, hạ mình trước ngôi cao trọng\".",
        "ko": "주 섬기고 그 이름 높이세.'",
        "zh": "忠於上帝，將他聖名傳講。",
        "en": "Bow down to God, and praise his holy name.'",
        "ja": "イエスの統治 告げよう"
      },
      {
        "vi": "3. Người ngay, khiêm tốn đồng thanh hát vang bài Nước Trời;",
        "ko": "3. 겸손한 자 배울 수 있는 노래,",
        "zh": "3．王國之歌，謙卑的人都高唱，",
        "en": "3. This Kingdom song, all humble ones can master.",
        "ja": "3. 心が謙遜な人"
      },
      {
        "vi": "lời ca trong sáng, mừng vui, chứa chan hy vọng.",
        "ko": "그 가사는 밝으며 따뜻해.",
        "zh": "歌聲嘹亮，信息令人舒暢。",
        "en": "The words are clear, their message warm and bright.",
        "ja": "誰もが歌える歌"
      },
      {
        "vi": "Ngày nay vô số người trên đất ca bài hát này,",
        "ko": "많은 사람 이 노래 배웠으며",
        "zh": "萬國萬族已紛紛響應呼籲，",
        "en": "In all the earth, a multitude have learned it,",
        "ja": "明るい希望の歌を"
      },
      {
        "vi": "sánh vai cùng nhau mời người khắp nơi như vầy:",
        "ko": "함께 부를 사람들 모으네.",
        "zh": "邀請別人來讚美耶和華。",
        "en": "And they in turn still others now invite:",
        "ja": "伝えよう 世界中に"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "\"Mau cùng nhau đến khen ngợi danh thánh,",
        "ko": "‘주 여호와 숭배하고",
        "zh": "稱頌上帝，要敬拜他。",
        "en": "‘Come worship God Before his throne.",
        "ja": "エホバをたたえよう"
      },
      {
        "vi": "cho mọi dân biết Con được ban Nước!",
        "ko": "아들 통치 알려 주세!",
        "zh": "基督作王，廣為宣揚。",
        "en": "His Son is King; Let's make it known!",
        "ja": "聖なるその名を"
      },
      {
        "vi": "Giờ đây ta hãy học ca khúc rao về Nước Cha,",
        "ko": "왕국 노래, 이 노래 함께 배워",
        "zh": "王國之歌，一起來快樂高唱，",
        "en": "Come learn this song, this song about the Kingdom;",
        "ja": "王国の歌を学び"
      },
      {
        "vi": "mãi tôn thờ Cha, hạ mình trước ngôi cao trọng\".",
        "ko": "주 섬기고 그 이름 높이세.'",
        "zh": "忠於上帝，將他聖名傳講。",
        "en": "Bow down to God, and praise his holy name.'",
        "ja": "イエスの統治 告げよう"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 95:6; 1 Phi 2:9, 10; Khải 12:10).",
      "ko": "(시 95:6; 베드로 전서 2:9, 10; 계시록 12:10 참조)",
      "zh": "（參看詩95:6；彼前2:9,10；啟12:10）",
      "en": "(See also Ps. 95:6; 1 Pet. 2:9, 10; Rev. 12:10.)",
      "ja": "（詩 95:6; ペテ一 2:9，10; 啓 12:10も参照。）"
    }
  },
  {
    "number": 75,
    "sourceSheet": "75",
    "labels": {
      "vi": "BÀI HÁT 75",
      "ko": "75번",
      "zh": "詩歌第75首",
      "en": "SONG 75",
      "ja": "75番"
    },
    "title": {
      "vi": "\"Có con đây! Xin sai con!\"",
      "ko": "‘내가 여기 있나이다! 나를 보내 주소서'",
      "zh": "「我在這裡！請差遣我！」",
      "en": "\"Here I Am! Send Me!\"",
      "ja": "「ここに私がおります！ 私を遣わしてください！」"
    },
    "scripture": {
      "vi": "(Ê-sai 6:8)",
      "ko": "(이사야 6:8)",
      "zh": "（以賽亞書6:8）",
      "en": "(Isaiah 6:8)",
      "ja": "（イザヤ 6:8）"
    },
    "lines": [
      {
        "vi": "1. Ngày nay nhiều người khinh ghét, chê bai",
        "ko": "1. 여호와 선한 이름에",
        "zh": "1．世人辱罵上帝聖名，",
        "en": "1. Today men heap reproach and shame",
        "ja": "1. 聖なる神の名"
      },
      {
        "vi": "và không ngừng làm hoen ố danh Cha.",
        "ko": "사람들 모독 돌리고",
        "zh": "指責上帝軟弱無能，",
        "en": "Upon Jehovah's holy name.",
        "ja": "人々が汚す"
      },
      {
        "vi": "Người cho rằng ngài xa cách, vô tâm.",
        "ko": "하느님 악하다 하며",
        "zh": "或聲稱他殘酷不仁，",
        "en": "Some show God weak; some paint him cruel.",
        "ja": "非難を浴びせて"
      },
      {
        "vi": "Kẻ luôn khăng khăng rằng: \"Chúa đâu ra?\".",
        "ko": "\"하느님 없다!\" 외치네.",
        "zh": "甚至宣稱沒有真神。",
        "en": "\"There is no God,\" so shouts the fool.",
        "ja": "偽りを語る"
      },
      {
        "vi": "Nay ai nguyện đi làm chứng về Cha,",
        "ko": "누가 주를 찬양하며",
        "zh": "誰願維護上帝名聲，",
        "en": "Who'll go Jehovah's name to clear?",
        "ja": "誰が名を清め"
      },
      {
        "vi": "hát khen danh Cha và chúc tụng ngài?",
        "ko": "그 이름 거룩게 할까?",
        "zh": "向人讚頌他的大能？",
        "en": "Who'll sing his praise for all to hear?",
        "ja": "賛美歌うのか"
      },
      {
        "vi": "(ĐIỆP KHÚC 1)",
        "ko": "(후렴 1)",
        "zh": "（副歌1）",
        "en": "(CHORUS 1)",
        "ja": "（※ 繰り返し 1）"
      },
      {
        "vi": "\"Lạy Cha, xin sai tôi tớ ngài đây!",
        "ko": "‘내가 여기 있나이다!",
        "zh": "「我在這裡！請差遣我！",
        "en": "‘Lord, here I am! Send me, send me!",
        "ja": "私がおります"
      },
      {
        "vi": "Thành trung ca khen Cha suốt đời con.",
        "ko": "충실히 찬양하리다.",
        "zh": "我要永遠讚美真神。",
        "en": "I'll sing your praises faithfully.",
        "ja": "賛美歌うため"
      },
      {
        "vi": "Thờ Cha là đặc ân con xem cao quý.",
        "ko": "더 큰 영예 없나니, 주여,",
        "zh": "為耶和華服務真光榮！",
        "en": "No greater honor could there be, Lord.",
        "ja": "遣わしてください"
      },
      {
        "vi": "Có con đây, xin Cha dùng con!\"",
        "ko": "나를 보내 주소서.'",
        "zh": "天父，請你差遣我！」",
        "en": "Here I am! Send me, send me!'",
        "ja": "どうか私を"
      },
      {
        "vi": "2. Ngày nay nhiều người không kính tôn Cha.",
        "ko": "2. 하느님 느리다 하며",
        "zh": "2．世人不敬畏耶和華，",
        "en": "2. Some make the claim that God is slow;",
        "ja": "2. エホバの力を"
      },
      {
        "vi": "Họ chê cười ngài cứ kéo lê thê,",
        "ko": "여호와 두려워 않네.",
        "zh": "認為末日只是神話。",
        "en": "The fear of God they do not know.",
        "ja": "人々侮り"
      },
      {
        "vi": "tượng vô dụng lại ra sức kêu xin,",
        "ko": "돌로 된 우상 섬기고",
        "zh": "他們寧可崇拜偶像，",
        "en": "Some worship idols made of stone;",
        "ja": "偽の神たたえ"
      },
      {
        "vi": "thích tôn vinh con người thế ngôi Cha.",
        "ko": "카이사르 숭배하네.",
        "zh": "或效忠於地上君王。",
        "en": "Some would put Caesar on God's throne.",
        "ja": "王たちに頼る"
      },
      {
        "vi": "Nay ai truyền rao điều sắp xảy ra?",
        "ko": "누가 주의 큰 전쟁을",
        "zh": "誰願警告邪惡的人，",
        "en": "Who'll tell the wicked what's in store?",
        "ja": "誰が人々に"
      },
      {
        "vi": "Có ai loan tin trận chiến của ngài?",
        "ko": "악인에게 경고할까?",
        "zh": "宣告終結即將來臨？",
        "en": "Who'll warn of God's great final war?",
        "ja": "警告するのか"
      },
      {
        "vi": "(ĐIỆP KHÚC 2)",
        "ko": "(후렴 2)",
        "zh": "（副歌2）",
        "en": "(CHORUS 2)",
        "ja": "（※ 繰り返し 2）"
      },
      {
        "vi": "\"Lạy Cha, xin sai tôi tớ ngài đây!",
        "ko": "‘내가 여기 있나이다!",
        "zh": "「我在這裡！請差遣我！",
        "en": "‘Lord, here I am! Send me, send me!",
        "ja": "私がおります"
      },
      {
        "vi": "Nguyện con luôn luôn can đảm truyền rao.",
        "ko": "담대히 경고하리다.",
        "zh": "我會勇敢發出警告。",
        "en": "I'll sound the warning fearlessly.",
        "ja": "警告するため"
      },
      {
        "vi": "Thờ Cha là đặc ân con xem cao quý.",
        "ko": "더 큰 영예 없나니, 주여,",
        "zh": "為耶和華服務真光榮！",
        "en": "No greater honor could there be, Lord.",
        "ja": "遣わしてください"
      },
      {
        "vi": "Có con đây, xin Cha dùng con!\"",
        "ko": "나를 보내 주소서.'",
        "zh": "天父，請你差遣我！」",
        "en": "Here I am! Send me, send me!'",
        "ja": "どうか私を"
      },
      {
        "vi": "3. Giờ bao người hiền đau đớn than van",
        "ko": "3. 세상에 악이 가득해",
        "zh": "3．今天惡事猖獗無度，",
        "en": "3. Today the meek ones mourn and sigh",
        "ja": "3. 悪が増え続け"
      },
      {
        "vi": "vì quanh họ toàn hung ác, gian tham;",
        "ko": "온유한 자 슬퍼하네.",
        "zh": "謙和的人嘆息哀哭。",
        "en": "Because the evils multiply.",
        "ja": "人々苦しむ"
      },
      {
        "vi": "thành tâm tìm đường chân lý nơi đâu,",
        "ko": "정직한 마음 가진 자",
        "zh": "他們衷心尋求真理，",
        "en": "With honest hearts they seek to find",
        "ja": "悲嘆し疲れて"
      },
      {
        "vi": "để sao cho tâm hồn bớt lo âu.",
        "ko": "진리를 찾아 헤매네.",
        "zh": "渴望得到內心安寧。",
        "en": "The truth that gives real peace of mind.",
        "ja": "安らぎ求める"
      },
      {
        "vi": "Nay ai ủi an người khóc sầu đau,",
        "ko": "누가 그들 위로하며",
        "zh": "誰願安慰謙和的人，",
        "en": "Who'll go with comfort to the meek?",
        "ja": "誰が良い知らせ"
      },
      {
        "vi": "lối đi công minh nguyện giúp họ tìm?",
        "ko": "진리 찾도록 도울까?",
        "zh": "幫助他們追求正義？",
        "en": "Who'll help them righteousness to seek?",
        "ja": "伝えに行くのか"
      },
      {
        "vi": "(ĐIỆP KHÚC 3)",
        "ko": "(후렴 3)",
        "zh": "（副歌3）",
        "en": "(CHORUS 3)",
        "ja": "（※ 繰り返し 3）"
      },
      {
        "vi": "\"Lạy Cha, xin sai tôi tớ ngài đây!",
        "ko": "‘내가 여기 있나이다!",
        "zh": "「我在這裡！請差遣我！",
        "en": "‘Lord, here I am! Send me, send me!",
        "ja": "私がおります"
      },
      {
        "vi": "Nguyện con kiên tâm đi giúp người ngay.",
        "ko": "끝까지 알리리이다.",
        "zh": "我會耐心教導別人。",
        "en": "I'll teach the meek ones patiently.",
        "ja": "伝えに行くため"
      },
      {
        "vi": "Thờ Cha là đặc ân con xem cao quý.",
        "ko": "더 큰 영예 없나니, 주여,",
        "zh": "為耶和華服務真光榮！",
        "en": "No greater honor could there be, Lord.",
        "ja": "遣わしてください"
      },
      {
        "vi": "Có con đây, xin Cha dùng con!\"",
        "ko": "나를 보내 주소서.'",
        "zh": "天父，請你差遣我！」",
        "en": "Here I am! Send me, send me!'",
        "ja": "どうか私を"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 10:4; Ê-xê 9:4).",
      "ko": "(시 10:4; 에스겔 9:4 참조)",
      "zh": "（參看詩10:4；結9:4）",
      "en": "(See also Ps. 10:4; Ezek. 9:4.)",
      "ja": "（詩 10:4; エゼ 9:4も参照。）"
    }
  },
  {
    "number": 76,
    "sourceSheet": "76",
    "labels": {
      "vi": "BÀI HÁT 76",
      "ko": "76번",
      "zh": "詩歌第76首",
      "en": "SONG 76",
      "ja": "76番"
    },
    "title": {
      "vi": "Lòng bạn cảm thấy làm sao?",
      "ko": "행복한 그 기분",
      "zh": "傳道感覺真好！",
      "en": "How Does It Make You Feel?",
      "ja": "どんな気持ち？"
    },
    "scripture": {
      "vi": "(Hê-bơ-rơ 13:15)",
      "ko": "(히브리서 13:15)",
      "zh": "（希伯來書13:15）",
      "en": "(Hebrews 13:15)",
      "ja": "（ヘブライ 13:15）"
    },
    "lines": [
      {
        "vi": "1. Hằng ngày rao truyền Nước Cha,",
        "ko": "1. 정말로 행복해,",
        "zh": "1．傳道感覺真好！",
        "en": "1. How does it make you feel",
        "ja": "1. どんな気持ち？"
      },
      {
        "vi": "dạy Kinh Thánh cho ai lòng thành,",
        "ko": "함께 봉사 나갈 때,",
        "zh": "竭盡全力去尋找，",
        "en": "when you preach and teach with zeal,",
        "ja": "ベスト尽くして"
      },
      {
        "vi": "người như chiên vui sướng nghe Cha,",
        "ko": "마음 정직한 사람",
        "zh": "謙卑又正直的人，",
        "en": "When you know you've done your part",
        "ja": "聞く人たちを"
      },
      {
        "vi": "lòng bạn cảm thấy làm sao?",
        "ko": "열심히 찾을 때.",
        "zh": "你一定能找到。",
        "en": "to reach an honest heart?",
        "ja": "見つける時"
      },
      {
        "vi": "Phần mình chuyên cần giảng rao",
        "ko": "최선을 다하고",
        "zh": "盡力做到最好！",
        "en": "Knowing you've done your best;",
        "ja": "やるべきこと"
      },
      {
        "vi": "rồi Cha sẽ chăm lo phần ngài.",
        "ko": "여호와께 맡겨요.",
        "zh": "上帝是我的依靠。",
        "en": "then our God will do the rest.",
        "ja": "全てしたなら"
      },
      {
        "vi": "Từ trời cao, Cha biết những ai",
        "ko": "주를 찾는 사람들",
        "zh": "誰真心尋求真理，",
        "en": "Honest hearts he surely knows—",
        "ja": "あとはエホバに"
      },
      {
        "vi": "thật lòng mong muốn theo ngài.",
        "ko": "그분은 아시죠.",
        "zh": "耶和華都知道。",
        "en": "all those to him disposed.",
        "ja": "委ねるだけ"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Ngập tràn vui sướng rao tin về Cha,",
        "ko": "기쁨 주는 즐거운 일",
        "zh": "我願付出真摯愛心，",
        "en": "It makes us glad, and we rejoice",
        "ja": "全てを差し出し"
      },
      {
        "vi": "là vật tế lễ dâng Giê-hô-va.",
        "ko": "마음 다해 행하리라.",
        "zh": "全心全意讚美上帝。",
        "en": "to give our heart and mind and voice.",
        "ja": "賛美捧げれば"
      },
      {
        "vi": "Nguyện luôn trung tín ca khen danh ngài,",
        "ko": "찬양의 희생 영원히",
        "zh": "傳好消息讓我天天",
        "en": "So may our sacrifice of praise",
        "ja": "心に喜び"
      },
      {
        "vi": "trọn lòng theo Chúa muôn đời.",
        "ko": "드릴 수 있기를.",
        "zh": "感到滿足、開心！",
        "en": "continue all our days.",
        "ja": "あふれていく"
      },
      {
        "vi": "2. Dùng lời khéo chọn giúp cho",
        "ko": "2. 정말로 행복해,",
        "zh": "2．傳道感覺真好！",
        "en": "2. How does it make you feel",
        "ja": "2. どんな気持ち？"
      },
      {
        "vi": "người ngay thẳng đi theo đường ngài,",
        "ko": "누군가 잘 들을 때,",
        "zh": "多開心能夠看到",
        "en": "when the words you speak appeal",
        "ja": "神の言葉で"
      },
      {
        "vi": "họ nhận bao ân phước Cha ban,",
        "ko": "영원한 생명 얻을",
        "zh": "謙卑人願意聆聽，",
        "en": "To the ones whose heart is right",
        "ja": "人の瞳が"
      },
      {
        "vi": "lòng bạn cảm thấy làm sao?",
        "ko": "성향 보여 줄 때.",
        "zh": "受耶和華教導！",
        "en": "for everlasting life?",
        "ja": "輝く時"
      },
      {
        "vi": "Dù ai quay mặt thoái lui",
        "ko": "다 듣진 않아도",
        "zh": "身為上帝代表，",
        "en": "Some people turn away,",
        "ja": "時に誰か"
      },
      {
        "vi": "hoặc không giữ trung kiên trọn vẹn,",
        "ko": "여전히 행복하게",
        "zh": "向別人發出宣告，",
        "en": "others might be led astray.",
        "ja": "背を向けたって"
      },
      {
        "vi": "mình hân hoan loan báo không thôi,",
        "ko": "여호와의 이름을",
        "zh": "不管人反應如何，",
        "en": "Still we're glad to bear his name",
        "ja": "諦めないで"
      },
      {
        "vi": "một lòng kiên quyết trung thành.",
        "ko": "알리고 싶어요.",
        "zh": "我會繼續傳道。",
        "en": "and witness just the same.",
        "ja": "伝えていく"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Ngập tràn vui sướng rao tin về Cha,",
        "ko": "기쁨 주는 즐거운 일",
        "zh": "我願付出真摯愛心，",
        "en": "It makes us glad, and we rejoice",
        "ja": "全てを差し出し"
      },
      {
        "vi": "là vật tế lễ dâng Giê-hô-va.",
        "ko": "마음 다해 행하리라.",
        "zh": "全心全意讚美上帝。",
        "en": "to give our heart and mind and voice.",
        "ja": "賛美捧げれば"
      },
      {
        "vi": "Nguyện luôn trung tín ca khen danh ngài,",
        "ko": "찬양의 희생 영원히",
        "zh": "傳好消息讓我天天",
        "en": "So may our sacrifice of praise",
        "ja": "心に喜び"
      },
      {
        "vi": "trọn lòng theo Chúa muôn đời.",
        "ko": "드릴 수 있기를.",
        "zh": "感到滿足、開心！",
        "en": "continue all our days.",
        "ja": "あふれていく"
      },
      {
        "vi": "3. Ngài giao trách nhiệm lớn lao,",
        "ko": "3. 정말로 행복해,",
        "zh": "3．傳道感覺真好！",
        "en": "3. How does it make you feel,",
        "ja": "3. この務めを"
      },
      {
        "vi": "đặc ân giảng rao tin mừng này,",
        "ko": "주의 손길 느낄 때,",
        "zh": "這項任務很重要，",
        "en": "knowing God's support is real,",
        "ja": "果たしていこう"
      },
      {
        "vi": "và Cha ban thêm sức cho ta,",
        "ko": "맡겨 주신 일 하며",
        "zh": "耶和華親自託付，",
        "en": "And that he's entrusted you",
        "ja": "神が支えて"
      },
      {
        "vi": "lòng bạn cảm thấy làm sao?",
        "ko": "승인을 얻을 때.",
        "zh": "提供仁愛指導。",
        "en": "to do the work we do?",
        "ja": "くださるから"
      },
      {
        "vi": "Tự hào rao truyền khắp nơi,",
        "ko": "자부심 느끼며",
        "zh": "多榮幸能傳道！",
        "en": "Proudly we preach and teach,",
        "ja": "誇り持って"
      },
      {
        "vi": "dù dạn dĩ nhưng luôn mềm mại.",
        "ko": "담대하게 말해요,",
        "zh": "溫和、堅定不可少，",
        "en": "using bold but gracious speech,",
        "ja": "語り続ける"
      },
      {
        "vi": "Vì ngày Cha sắp đến nay mai,",
        "ko": "합당한 자 찾는 일",
        "zh": "這項工作快完成，",
        "en": "Searching out deserving ones;",
        "ja": "ふさわしい人"
      },
      {
        "vi": "việc ngài ta gắng chu toàn.",
        "ko": "다 끝날 때까지.",
        "zh": "把握每分每秒。",
        "en": "this work will soon be done.",
        "ja": "探しながら"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Ngập tràn vui sướng rao tin về Cha,",
        "ko": "기쁨 주는 즐거운 일",
        "zh": "我願付出真摯愛心，",
        "en": "It makes us glad, and we rejoice",
        "ja": "全てを差し出し"
      },
      {
        "vi": "là vật tế lễ dâng Giê-hô-va.",
        "ko": "마음 다해 행하리라.",
        "zh": "全心全意讚美上帝。",
        "en": "to give our heart and mind and voice.",
        "ja": "賛美捧げれば"
      },
      {
        "vi": "Nguyện luôn trung tín ca khen danh ngài,",
        "ko": "찬양의 희생 영원히",
        "zh": "傳好消息讓我天天",
        "en": "So may our sacrifice of praise",
        "ja": "心に喜び"
      },
      {
        "vi": "trọn lòng theo Chúa muôn đời.",
        "ko": "드릴 수 있기를.",
        "zh": "感到滿足、開心！",
        "en": "continue all our days.",
        "ja": "あふれていく"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Công 13:48; 1 Tê 2:4; 1 Ti 1:11).",
      "ko": "(사도 13:48; 데살로니가 전서 2:4; 디모데 전서 1:11 참조)",
      "zh": "（參看徒13:48；帖前2:4；提前1:11）",
      "en": "(See also Acts 13:48; 1 Thess. 2:4; 1 Tim. 1:11.)",
      "ja": "（使徒 13:48; テサ一 2:4; テモ一 1:11も参照。）"
    }
  },
  {
    "number": 77,
    "sourceSheet": "77",
    "labels": {
      "vi": "BÀI HÁT 77",
      "ko": "77번",
      "zh": "詩歌第77首",
      "en": "SONG 77",
      "ja": "77番"
    },
    "title": {
      "vi": "Ánh sáng trong thế gian tăm tối",
      "ko": "어두운 세상을 비추는 빛",
      "zh": "黑暗裡現光芒",
      "en": "Light in a Darkened World",
      "ja": "闇に差す光"
    },
    "scripture": {
      "vi": "(2 Cô-rinh-tô 4:6)",
      "ko": "(고린도 후서 4:6)",
      "zh": "（哥林多後書4:6）",
      "en": "(2 Corinthians 4:6)",
      "ja": "（コリント第二 4:6）"
    },
    "lines": [
      {
        "vi": "1. Cả thế gian chìm đắm trong đêm tàn,",
        "ko": "1. 어두운 악한 세상을",
        "zh": "1．全世界已深陷黑夜，",
        "en": "1. In these days, dark and lawless days,",
        "ja": "1. 深い闇の中"
      },
      {
        "vi": "đầy dẫy khó khăn, lầm than.",
        "ko": "비추는 새벽빛,",
        "zh": "幽暗何時終結？",
        "en": "Shines a light we can see.",
        "ja": "光が差す"
      },
      {
        "vi": "Nào chúng ta, rọi ánh sáng chan hòa,",
        "ko": "다가올 새날 알리며",
        "zh": "曙光現，白晝已不遠，",
        "en": "Like the dawn of another day",
        "ja": "やがて訪れる"
      },
      {
        "vi": "tựa ánh dương lúc bình minh.",
        "ko": "점점 밝아 오네.",
        "zh": "迎接嶄新一天。",
        "en": "That will soon come to be.",
        "ja": "新たな日が"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Xua màn đêm tăm tối này,",
        "ko": "어둠을 가르는",
        "zh": "黑暗裡現光芒，",
        "en": "Shining through the darkness,",
        "ja": "光"
      },
      {
        "vi": "báo tin mừng đến cho muôn người,",
        "ko": "희망과 빛의 소식",
        "zh": "真理如燦爛太陽，",
        "en": "Ours is a message so bright.",
        "ja": "放つ"
      },
      {
        "vi": "thắp lên hy vọng sáng ngời.",
        "ko": "널리 퍼져 가네.",
        "zh": "照亮未來方向。",
        "en": "It offers hope and light—",
        "ja": "希望の言葉"
      },
      {
        "vi": "Mong ngày mai đang đến gần,",
        "ko": "그 빛 찬란하니",
        "zh": "看見真理之光，",
        "en": "Sparkling like the daylight,",
        "ja": "道を照らす"
      },
      {
        "vi": "khắp nơi bừng sáng trong huy hoàng,",
        "ko": "밤은 다 지나가고",
        "zh": "輝煌的日子在望，",
        "en": "Bringing tomorrow in sight—",
        "ja": "光 満ちる"
      },
      {
        "vi": "bóng đêm lùi xa.",
        "ko": "새날 오네.",
        "zh": "不再徬徨。",
        "en": "So ends the night.",
        "ja": "輝くあした 近づく"
      },
      {
        "vi": "2. Còn biết bao người ngủ trong đêm trường,",
        "ko": "2. 잠든 자 깨워야 하네,",
        "zh": "2．快喚醒沉睡中的人，",
        "en": "2. Those who sleep need awakening",
        "ja": "2. 人に呼び掛ける"
      },
      {
        "vi": "nào biết thế gian dần qua.",
        "ko": "긴급한 이 날에.",
        "zh": "末日迅速臨近。",
        "en": "As the time ebbs away.",
        "ja": "目を覚ませと"
      },
      {
        "vi": "Giờ chúng ta truyền báo tin cho họ,",
        "ko": "희망과 새 힘 주면서",
        "zh": "給別人希望與鼓勵，",
        "en": "We give hope and encouragement.",
        "ja": "希望差し伸べる"
      },
      {
        "vi": "lòng ước ai nấy đều nghe.",
        "ko": "우린 기도하리.",
        "zh": "願他們聽真理。",
        "en": "For their future we'll pray.",
        "ja": "祈り込めて"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Xua màn đêm tăm tối này,",
        "ko": "어둠을 가르는",
        "zh": "黑暗裡現光芒，",
        "en": "Shining through the darkness,",
        "ja": "光"
      },
      {
        "vi": "báo tin mừng đến cho muôn người,",
        "ko": "희망과 빛의 소식",
        "zh": "真理如燦爛太陽，",
        "en": "Ours is a message so bright.",
        "ja": "放つ"
      },
      {
        "vi": "thắp lên hy vọng sáng ngời.",
        "ko": "널리 퍼져 가네.",
        "zh": "照亮未來方向。",
        "en": "It offers hope and light—",
        "ja": "希望の言葉"
      },
      {
        "vi": "Mong ngày mai đang đến gần,",
        "ko": "그 빛 찬란하니",
        "zh": "看見真理之光，",
        "en": "Sparkling like the daylight,",
        "ja": "道を照らす"
      },
      {
        "vi": "khắp nơi bừng sáng trong huy hoàng,",
        "ko": "밤은 다 지나가고",
        "zh": "輝煌的日子在望，",
        "en": "Bringing tomorrow in sight—",
        "ja": "光 満ちる"
      },
      {
        "vi": "bóng đêm lùi xa.",
        "ko": "새날 오네.",
        "zh": "不再徬徨。",
        "en": "So ends the night.",
        "ja": "輝くあした 近づく"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Giăng 3:19; 8:12; Rô 13:11, 12; 1 Phi 2:9).",
      "ko": "(요한 3:19; 8:12; 로마 13:11, 12; 베드로 전서 2:9 참조)",
      "zh": "（參看約3:19；8:12；羅13:11,12；彼前2:9）",
      "en": "(See also John 3:19; 8:12; Rom. 13:11, 12; 1 Pet. 2:9.)",
      "ja": "（ヨハ 3:19; 8:12; ロマ 13:11，12; ペテ一 2:9も参照。）"
    }
  },
  {
    "number": 78,
    "sourceSheet": "78",
    "labels": {
      "vi": "BÀI HÁT 78",
      "ko": "78번",
      "zh": "詩歌第78首",
      "en": "SONG 78",
      "ja": "78番"
    },
    "title": {
      "vi": "\"Dạy lời Đức Chúa Trời\"",
      "ko": "\"하느님의 말씀을 가르치라\"",
      "zh": "教導人上帝的話語",
      "en": "\"Teaching the Word of God\"",
      "ja": "「神の言葉を教え」よう"
    },
    "scripture": {
      "vi": "(Công vụ 18:11)",
      "ko": "(사도행전 18:11)",
      "zh": "（使徒行傳18:11）",
      "en": "(Acts 18:11)",
      "ja": "（使徒 18:11）"
    },
    "lines": [
      {
        "vi": "1. Giảng dạy Lời Cha cho dân mọi nơi",
        "ko": "1. 주 여호와의 말씀을",
        "zh": "1．教導人上帝的話語，",
        "en": "1. For those who teach the Word of God,",
        "ja": "1. イエスの模範を"
      },
      {
        "vi": "chính là đặc ân cao quý.",
        "ko": "가르쳐 주는 일,",
        "zh": "內心喜樂洋溢。",
        "en": "There is a joyful share.",
        "ja": "思い浮かべ"
      },
      {
        "vi": "Đời ta thỏa nguyện, tràn đầy hân hoan",
        "ko": "큰 기쁨과 보람 주며",
        "zh": "辛勞付出必得獎賞，",
        "en": "The benefits that we receive",
        "ja": "愛を込め語る"
      },
      {
        "vi": "bởi luôn hết lòng dạy dỗ.",
        "ko": "내게 유익하네.",
        "zh": "福分超乎想像。",
        "en": "Are far beyond compare.",
        "ja": "神の言葉"
      },
      {
        "vi": "Ước nguyện dạy như Con Cha thuở xưa",
        "ko": "사랑으로 가르치신",
        "zh": "效法耶穌教導別人，",
        "en": "We imitate the Son of God",
        "ja": "エホバを身近に"
      },
      {
        "vi": "với lòng yêu thương tha thiết.",
        "ko": "예수 본받아서",
        "zh": "表現真正愛心。",
        "en": "And how he taught with love.",
        "ja": "感じるよう"
      },
      {
        "vi": "Tận tâm giúp họ nhận biết Giê-hô-va,",
        "ko": "그들도 주의 벗이 되도록",
        "zh": "教人真理，幫助他們",
        "en": "And as we teach, the ones we're helping",
        "ja": "伝える"
      },
      {
        "vi": "đắp xây tình bạn với ngài.",
        "ko": "도와주리라.",
        "zh": "與上帝更加親近。",
        "en": "Draw close to God above.",
        "ja": "心に響く言葉"
      },
      {
        "vi": "2. Giảng dạy Lời Cha cho bao người nghe",
        "ko": "2. 주 말씀 가르치면서",
        "zh": "2．我們先要以身作則",
        "en": "2. As teachers of Jehovah's Word,",
        "ja": "2. エホバの光を"
      },
      {
        "vi": "với lòng quan tâm sâu sắc.",
        "ko": "옳은 일 행하여",
        "zh": "才能教導別人。",
        "en": "We strive to do what's right,",
        "ja": "映し出そう"
      },
      {
        "vi": "Người ngay cảm nhận lòng thành nơi ta,",
        "ko": "우리 행실로 주의 빛",
        "zh": "努力表現上帝美德，",
        "en": "So all may see sincerity",
        "ja": "良いこと行う"
      },
      {
        "vi": "thấy gương tốt lành phản chiếu.",
        "ko": "나타내 보이리.",
        "zh": "待人真摯誠懇。",
        "en": "As we reflect God's light.",
        "ja": "人になって"
      },
      {
        "vi": "Gắng tập ngày đêm suy ngẫm Lời Cha,",
        "ko": "열심히 주 말씀 살펴",
        "zh": "認真研讀上帝話語，",
        "en": "With diligence we search God's Word,",
        "ja": "毎日学ぼう"
      },
      {
        "vi": "kiếm tìm, đào sâu chân lý",
        "ko": "나를 가르치고",
        "zh": "重視聖經真理。",
        "en": "For it has news to tell.",
        "ja": "神の言葉"
      },
      {
        "vi": "thì ta sẽ hằng thành tín vâng theo Cha,",
        "ko": "마음에 새긴 좋은 그 보물",
        "zh": "向人分享寶貴的信息，",
        "en": "So we can share our heart's good treasure",
        "ja": "きらめく宝を"
      },
      {
        "vi": "hết tâm truyền giảng tin mừng.",
        "ko": "나눠 주리라.",
        "zh": "自己也能獲益。",
        "en": "And teach ourselves as well.",
        "ja": "分け合うため"
      },
      {
        "vi": "3. Chúa Giê-hô-va khuyên răn, dạy dỗ,",
        "ko": "3. 주 말씀 가르칠 때에",
        "zh": "3．我們得到上帝幫助，",
        "en": "3. Jehovah gives us all we need",
        "ja": "3. 人々の進歩"
      },
      {
        "vi": "huấn luyện mình đi loan báo.",
        "ko": "기도를 드리리.",
        "zh": "勝任教導任務。",
        "en": "To teach his precious Word.",
        "ja": "助けていこう"
      },
      {
        "vi": "Ngài luôn ở cạnh trợ lực cho ta,",
        "ko": "여호와 나를 반드시",
        "zh": "只要我們懇切禱告，",
        "en": "So if we pray to ask for help,",
        "ja": "エホバへの愛を"
      },
      {
        "vi": "lắng nghe tiếng mình cầu khẩn.",
        "ko": "도와주시리라.",
        "zh": "上帝必定協助。",
        "en": "We know that we'll be heard.",
        "ja": "育てていこう"
      },
      {
        "vi": "Quý trọng Lời Cha, hăng say truyền bá",
        "ko": "사랑으로 가르치고",
        "zh": "我們喜愛上帝話語，",
        "en": "We love what's in the Word of God;",
        "ja": "いつでもエホバに"
      },
      {
        "vi": "bởi là Lời mang chân lý.",
        "ko": "친절히 도우면",
        "zh": "確信這是真理，",
        "en": "What's more, we know it's true.",
        "ja": "頼りながら"
      },
      {
        "vi": "Rồi đây những người mình giúp với yêu thương",
        "ko": "그들도 함께 주의 말씀",
        "zh": "用愛教導學生，",
        "en": "And as we love the ones we're teaching,",
        "ja": "愛そう 人々と"
      },
      {
        "vi": "sẽ nên người dạy như mình!",
        "ko": "가르치게 되리.",
        "zh": "也幫助他們以愛教人。",
        "en": "They'll soon be teachers too!",
        "ja": "神の言葉"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 119:97; 2 Ti 4:2; Tít 2:7; 1 Giăng 5:14).",
      "ko": "(시 119:97; 디모데 후서 4:2; 디도 2:7; 요한 1서 5:14 참조.)",
      "zh": "（參看詩119:97；提後4:2；多2:7；約一5:14）",
      "en": "(See also Ps. 119:97; 2 Tim. 4:2; Titus 2:7; 1 John 5:14.)",
      "ja": "（詩 119:97; テモ二 4:2; テト 2:7; ヨハ一 5:14も参照。）"
    }
  },
  {
    "number": 79,
    "sourceSheet": "79",
    "labels": {
      "vi": "BÀI HÁT 79",
      "ko": "79번",
      "zh": "詩歌第79首",
      "en": "SONG 79",
      "ja": "79番"
    },
    "title": {
      "vi": "Xin Cha giúp chiên vững vàng",
      "ko": "굳건히 서도록 가르치라",
      "zh": "幫助他們堅定不移",
      "en": "Teach Them to Stand Firm",
      "ja": "しっかりと立つよう教える"
    },
    "scripture": {
      "vi": "(Ma-thi-ơ 28:19, 20)",
      "ko": "(마태복음 28:19, 20)",
      "zh": "（馬太福音28:19,20）",
      "en": "(Matthew 28:19, 20)",
      "ja": "（マタイ 28:19，20）"
    },
    "lines": [
      {
        "vi": "1. Thật sướng vui dạy chiên của Giê-hô-va",
        "ko": "1. 이 기쁨 무엇에 비하리,",
        "zh": "1．當看見謙卑人在改變，",
        "en": "1. What a joy to teach Jehovah's sheep",
        "ja": "1. 真理 人に教え"
      },
      {
        "vi": "và thấy chiên ngày thêm lớn mạnh.",
        "ko": "양들이 자라 가니.",
        "zh": "讓真理發芽心田，",
        "en": "And to see how they have grown.",
        "ja": "助け差し伸べ"
      },
      {
        "vi": "Được chính Cha rọi soi lối đi ngay lành,",
        "ko": "그들은 마침내 진리를",
        "zh": "若用心灌溉、付出時間，",
        "en": "We have seen how he has guided them",
        "ja": "神に導くのは"
      },
      {
        "vi": "họ quyết tâm bước theo đường ngài.",
        "ko": "자기 것 만들었네.",
        "zh": "心歡喜笑臉浮現。",
        "en": "As they've made the truth their own.",
        "ja": "深い喜び"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Lạy Giê-hô-va, chúng con khẩn cầu,",
        "ko": "오 주여, 기도하오니",
        "zh": "努力教導，絕不放棄，",
        "en": "Jehovah, may you hear our prayer",
        "ja": "エホバよ"
      },
      {
        "vi": "nguyện Cha chăm sóc, che chở chiên ngài.",
        "ko": "그들을 지켜 주소서.",
        "zh": "日夜懇求，時刻關心。",
        "en": "And keep them in your watchful care.",
        "ja": "あなたの羊を見守り"
      },
      {
        "vi": "Nài xin Cha hãy thương xót giúp chiên bước đi trung thành",
        "ko": "따뜻이 돌봐 주소서.",
        "zh": "求耶和華顧念垂聽：",
        "en": "In Jesus' name, for them we plead: May they succeed;",
        "ja": "助けてください"
      },
      {
        "vi": "và luôn vững tin nơi ngài trong đời.",
        "ko": "그들 모두 굳건히 서게 하소서.",
        "zh": "「幫助他們，在真理中堅定不移。」",
        "en": "May ev'ry one of them stand firm.",
        "ja": "揺るがず立ち続けるため"
      },
      {
        "vi": "2. Ngày lẫn đêm cầu Cha đoái thương chiên ngài",
        "ko": "2. 날마다 기도를 드렸네,",
        "zh": "2．耶和華，請賜他們力量，",
        "en": "2. Ev'ry day we said a prayer for them,",
        "ja": "2. 真の友となって"
      },
      {
        "vi": "vì thế gian hiểm nguy, khốn cùng.",
        "ko": "양들의 믿음 위해.",
        "zh": "來面對前頭風浪，",
        "en": "As their faith was under test.",
        "ja": "いつも寄り添い"
      },
      {
        "vi": "Phần chúng con tận tâm giúp chiên thêm mạnh,",
        "ko": "시련을 이길 힘 얻도록",
        "zh": "能勇敢繼續堅守立場，",
        "en": "We made time to teach and care for them;",
        "ja": "力尽きないよう"
      },
      {
        "vi": "hầu Chúa ban phước chiên dồi dào.",
        "ko": "내 마음 다하였네.",
        "zh": "停靠在避風之港。",
        "en": "They've grown strong, and they've been blessed.",
        "ja": "祈り捧げた"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Lạy Giê-hô-va, chúng con khẩn cầu,",
        "ko": "오 주여, 기도하오니",
        "zh": "努力教導，絕不放棄，",
        "en": "Jehovah, may you hear our prayer",
        "ja": "エホバよ"
      },
      {
        "vi": "nguyện Cha chăm sóc, che chở chiên ngài.",
        "ko": "그들을 지켜 주소서.",
        "zh": "日夜懇求，時刻關心。",
        "en": "And keep them in your watchful care.",
        "ja": "あなたの羊を見守り"
      },
      {
        "vi": "Nài xin Cha hãy thương xót giúp chiên bước đi trung thành",
        "ko": "따뜻이 돌봐 주소서.",
        "zh": "求耶和華顧念垂聽：",
        "en": "In Jesus' name, for them we plead: May they succeed;",
        "ja": "助けてください"
      },
      {
        "vi": "và luôn vững tin nơi ngài trong đời.",
        "ko": "그들 모두 굳건히 서게 하소서.",
        "zh": "「幫助他們，在真理中堅定不移。」",
        "en": "May ev'ry one of them stand firm.",
        "ja": "揺るがず立ち続けるため"
      },
      {
        "vi": "3. Hằng ước mong bầy chiên vững tâm tin cậy",
        "ko": "3. 여호와 굳게 신뢰하며",
        "zh": "3．願他們信賴仁愛天父，",
        "en": "3. May they all maintain their confidence,",
        "ja": "3. 強い信仰持ち"
      },
      {
        "vi": "vào chính Cha cùng Con của ngài.",
        "ko": "끝까지 순종하여",
        "zh": "將信仰牢牢守護，",
        "en": "Trust in God and in his Son.",
        "ja": "勝利 得るよう"
      },
      {
        "vi": "Nhờ tín trung và kiên quyết vâng theo ngài,",
        "ko": "다 함께 생명의 경주를",
        "zh": "往目標奮力邁開腳步，",
        "en": "Through endurance and obedience,",
        "ja": "友のために願う"
      },
      {
        "vi": "họ sẽ luôn sống trong địa đàng.",
        "ko": "반드시 완주하길.",
        "zh": "把獎賞緊緊握住。",
        "en": "May their race for life be won.",
        "ja": "神の祝福"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Lạy Giê-hô-va, chúng con khẩn cầu,",
        "ko": "오 주여, 기도하오니",
        "zh": "努力教導，絕不放棄，",
        "en": "Jehovah, may you hear our prayer",
        "ja": "エホバよ"
      },
      {
        "vi": "nguyện Cha chăm sóc, che chở chiên ngài.",
        "ko": "그들을 지켜 주소서.",
        "zh": "日夜懇求，時刻關心。",
        "en": "And keep them in your watchful care.",
        "ja": "あなたの羊を見守り"
      },
      {
        "vi": "Nài xin Cha hãy thương xót giúp chiên bước đi trung thành",
        "ko": "따뜻이 돌봐 주소서.",
        "zh": "求耶和華顧念垂聽：",
        "en": "In Jesus' name, for them we plead: May they succeed;",
        "ja": "助けてください"
      },
      {
        "vi": "và luôn vững tin nơi ngài trong đời.",
        "ko": "그들 모두 굳건히 서게 하소서.",
        "zh": "「幫助他們，在真理中堅定不移。」",
        "en": "May ev'ry one of them stand firm.",
        "ja": "揺るがず立ち続けるため"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Lu 6:48; Công 5:42; Phi-líp 4:1).",
      "ko": "(누가 6:48; 사도 5:42; 빌립보 4:1 참조)",
      "zh": "（參看路6:48；徒5:42；腓4:1）",
      "en": "(See also Luke 6:48; Acts 5:42; Phil. 4:1.)",
      "ja": "（ルカ 6:48; 使徒 5:42; フィリ 4:1も参照。）"
    }
  },
  {
    "number": 80,
    "sourceSheet": "80",
    "labels": {
      "vi": "BÀI HÁT 80",
      "ko": "80번",
      "zh": "詩歌第80首",
      "en": "SONG 80",
      "ja": "80番"
    },
    "title": {
      "vi": "\"Nếm thử và nghiệm thấy Đức Giê-hô-va tốt thay!\"",
      "ko": "‘여호와의 선하심을 맛보아 알아라'",
      "zh": "嘗嘗主恩就知道耶和華是良善的",
      "en": "\"Taste and See That Jehovah Is Good\"",
      "ja": "「エホバが善い神であること」を味わい知る"
    },
    "scripture": {
      "vi": "(Thi thiên 34:8)",
      "ko": "(시편 34:8)",
      "zh": "（詩篇34:8）",
      "en": "(Psalm 34:8)",
      "ja": "（詩編 34:8）"
    },
    "lines": [
      {
        "vi": "1. Mình được thờ tôn Chúa Giê-hô-va,",
        "ko": "1. 주 섬기며 전파하는",
        "zh": "1．能崇拜上帝多快樂，",
        "en": "1. Our service to God we cherish;",
        "ja": "1. 良い知らせ語る"
      },
      {
        "vi": "nhận đặc ân rao báo về danh thánh.",
        "ko": "이 특권 참 소중하네.",
        "zh": "多榮幸能傳道教人。",
        "en": "We value our priv'lege to preach.",
        "ja": "大切な仕事"
      },
      {
        "vi": "Quyết tâm dâng cho ngài hết năng lực ta có,",
        "ko": "시간을 사서 최선 다하리,",
        "zh": "願竭盡全力，善用這一生，",
        "en": "We buy out the time and give God our best,",
        "ja": "エホバから喜ばれ"
      },
      {
        "vi": "giúp muôn dân được biết về tin mừng.",
        "ko": "찾을 사람 아직 많네.",
        "zh": "尋找愛好真理的人。",
        "en": "For many we still need to reach.",
        "ja": "幸せ膨らむ"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Chúng ta được Cha mời: ‘Hãy nếm thử xem",
        "ko": "‘주 여호와의 선하심을",
        "zh": "良善的上帝邀請我們：",
        "en": "God's Word invites us: ‘Come taste and see—",
        "ja": "最善を尽くそう"
      },
      {
        "vi": "lòng Cha tốt, yêu thương dường bao!'.",
        "ko": "맛보아 알지어다.'",
        "zh": "來親自嘗嘗主恩。",
        "en": "See that Jehovah is good.'",
        "ja": "エホバのために"
      },
      {
        "vi": "Nếu ta sùng kính ngài, phước ân nhiều thay!",
        "ko": "경건한 정성 이득 크니",
        "zh": "敬虔的生活真正富足，",
        "en": "Godly devotion brings greatest gain,",
        "ja": "エホバこそ善い神"
      },
      {
        "vi": "Mãi tôn vinh ngài hết lòng ta.",
        "ko": "모든 할 일 다하리.",
        "zh": "我們願獻出全部。",
        "en": "We know we've done all we could.",
        "ja": "味わい知ろう"
      },
      {
        "vi": "2. Trọn thời gian dâng Chúa sẽ mang lại",
        "ko": "2. 전 시간 주 섬기는 자",
        "zh": "2．能全時為天父服務，",
        "en": "2. For those in the full-time service,",
        "ja": "2. 全時間奉仕"
      },
      {
        "vi": "niềm vui cùng ân phước thật vô giá.",
        "ko": "기쁨, 축복 넘친다네.",
        "zh": "感受他賜豐盛美福。",
        "en": "Rich blessings and treasures abound.",
        "ja": "人生の宝"
      },
      {
        "vi": "Chúng ta tin cậy ngài chở che và chăm sóc,",
        "ko": "하느님 돌봄 굳게 믿으니",
        "zh": "深信耶和華必關懷照顧，",
        "en": "By trusting in God to care for our needs,",
        "ja": "喜びと満足で"
      },
      {
        "vi": "bước theo Cha lòng thỏa nguyện, vui mừng.",
        "ko": "모든 일에 만족하네.",
        "zh": "我們天天心滿意足。",
        "en": "In all things contentment is found.",
        "ja": "力が湧き出る"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Chúng ta được Cha mời: ‘Hãy nếm thử xem",
        "ko": "‘주 여호와의 선하심을",
        "zh": "良善的上帝邀請我們：",
        "en": "God's Word invites us: ‘Come taste and see—",
        "ja": "最善を尽くそう"
      },
      {
        "vi": "lòng Cha tốt, yêu thương dường bao!'.",
        "ko": "맛보아 알지어다.'",
        "zh": "來親自嘗嘗主恩。",
        "en": "See that Jehovah is good.'",
        "ja": "エホバのために"
      },
      {
        "vi": "Nếu ta sùng kính ngài, phước ân nhiều thay!",
        "ko": "경건한 정성 이득 크니",
        "zh": "敬虔的生活真正富足，",
        "en": "Godly devotion brings greatest gain,",
        "ja": "エホバこそ善い神"
      },
      {
        "vi": "Mãi tôn vinh ngài hết lòng ta.",
        "ko": "모든 할 일 다하리.",
        "zh": "我們願獻出全部。",
        "en": "We know we've done all we could.",
        "ja": "味わい知ろう"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Mác 14:8; Lu 21:2; 1 Ti 1:12; 6:6).",
      "ko": "(마가 14:8; 누가 21:2; 디모데 전서 1:12; 6:6 참조)",
      "zh": "（參看可14:8；路21:2；提前1:12；6:6）",
      "en": "(See also Mark 14:8; Luke 21:2; 1 Tim. 1:12; 6:6.)",
      "ja": "（マル 14:8; ルカ 21:2; テモ一 1:12; 6:6も参照。）"
    }
  },
  {
    "number": 81,
    "sourceSheet": "81",
    "labels": {
      "vi": "BÀI HÁT 81",
      "ko": "81번",
      "zh": "詩歌第81首",
      "en": "SONG 81",
      "ja": "81番"
    },
    "title": {
      "vi": "Đời sống của người tiên phong",
      "ko": "파이오니아의 삶",
      "zh": "先驅的生活",
      "en": "The Life of a Pioneer",
      "ja": "開拓者の生き方"
    },
    "scripture": {
      "vi": "(Truyền đạo 11:6)",
      "ko": "(전도서 11:6)",
      "zh": "（傳道書11:6）",
      "en": "(Ecclesiastes 11:6)",
      "ja": "（伝道 11:6）"
    },
    "lines": [
      {
        "vi": "1. Bình minh lên, ngày mới sang, mình đi rao truyền Nước Cha.",
        "ko": "1. 하루가 시작된 조금 이른 아침,",
        "zh": "1．當曙光剛出現，揉揉惺忪睡眼，",
        "en": "1. At the start of the day, with the sun yet to rise,",
        "ja": "1. 早く起きて"
      },
      {
        "vi": "Cầu xin Cha hằng bên ta.",
        "ko": "졸린 눈을 뜨고",
        "zh": "我禱告準備好，",
        "en": "We are making our way",
        "ja": "眠いけれど"
      },
      {
        "vi": "Dù đôi mắt đang trĩu nặng, ta thẳng tiến.",
        "ko": "기도를 드리며 나가네.",
        "zh": "一整天將好消息傳遍。",
        "en": "with the sleep in our eyes, and we pray.",
        "ja": "祈り捧げ"
      },
      {
        "vi": "Lòng hăng say, cười tươi vui cùng loan báo cho muôn người.",
        "ko": "관심을 갖거나 지나가겠지만",
        "zh": "點點頭、微微笑，向人人問聲好。",
        "en": "We are there with a smile for the people we meet.",
        "ja": "街路に立つ 今日も"
      },
      {
        "vi": "Người chăm chú nghe Lời Cha",
        "ko": "우린 따뜻한 미소로",
        "zh": "無論人是否聽真理",
        "en": "Some may stop for a while,",
        "ja": "通る人にほほ笑み掛け"
      },
      {
        "vi": "hay từ chối, ta chẳng lay lòng quyết tâm.",
        "ko": "이 자리를 지키리.",
        "zh": "我還是繼續傳道。",
        "en": "some pass by on the street, but we stay.",
        "ja": "立ち続ける 心 神に向けて"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Con đường ta chọn bước theo,",
        "ko": "여호와를 위해",
        "zh": "為耶和華付出，",
        "en": "It's the life that we choose;",
        "ja": "エホバのため"
      },
      {
        "vi": "dù năm tháng không xa rời.",
        "ko": "걷는 내 삶의 길,",
        "zh": "這是我選的路，",
        "en": "For Jehovah we live.",
        "ja": "選んだ道"
      },
      {
        "vi": "Đời ta vui sao khi luôn sống vì Cha!",
        "ko": "나의 마음, 영혼 다하리.",
        "zh": "面對艱辛不停下腳步。",
        "en": "And whatever he asks, we will do.",
        "ja": "力尽くし歩む"
      },
      {
        "vi": "Chuyên cần thi hành ý Cha,",
        "ko": "충실히 섬기며",
        "zh": "我會堅持到底，",
        "en": "In the work we endure,",
        "ja": "晴れた日にも"
      },
      {
        "vi": "mặc cho nắng mưa dãi dầu.",
        "ko": "매일 말하리라,",
        "zh": "不管是晴是雨，",
        "en": "Whether sunshine or rain.",
        "ja": "雨の日にも"
      },
      {
        "vi": "Lòng ta hoan ca: “Con yêu mến ngài thay, Giê-hô-va”.",
        "ko": "“여호와여 사랑합니다, 영원히.”",
        "zh": "每天我都用行動表明：「我愛你。」",
        "en": "It's a way we can say ev'ry day: “I love you.”",
        "ja": "この愛伝えたい 神に"
      },
      {
        "vi": "2. Hoàng hôn xuống, ngày sắp qua, mình quay gót dời bước chân.",
        "ko": "2. 하루가 끝나고 기도를 드릴 때",
        "zh": "2．當夕陽染天邊，捶捶疲憊雙腿，",
        "en": "2. At the end of the day, with the sun sinking low,",
        "ja": "2. 日暮れ時の"
      },
      {
        "vi": "Hoàn thành xong việc Cha giao,",
        "ko": "몸은 피곤해도",
        "zh": "踏上漫漫歸途，",
        "en": "Feeling happy and tired,",
        "ja": "帰り道は"
      },
      {
        "vi": "ta vui sướng, bao mỏi mệt đâu hề chi.",
        "ko": "마음은 너무나 행복해.",
        "zh": "我的內心卻充滿喜悅。",
        "en": "in our heart there's a glow, and we pray.",
        "ja": "疲れたけど"
      },
      {
        "vi": "Tạ ơn Cha vì yêu thương và ban phước ân dư dật.",
        "ko": "최선을 다하는 나의 멋진 삶은",
        "zh": "獻出我的全部，感謝上帝賜福。",
        "en": "It's a life that we love, always giving our best.",
        "ja": "熱い思いあふれ"
      },
      {
        "vi": "Dành hết sức trong đời ta",
        "ko": "매일 축복을 맛보니",
        "zh": "我很愛這生活，",
        "en": "And Jehovah we thank,",
        "ja": "神の恵み数えながら"
      },
      {
        "vi": "gieo hạt giống, khen ngợi Cha Giê-hô-va.",
        "ko": "여호와께 감사해.",
        "zh": "天天過得滿足又豐富。",
        "en": "for by him we are blessed ev'ry day.",
        "ja": "心からの感謝 神に祈る"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Con đường ta chọn bước theo,",
        "ko": "여호와를 위해",
        "zh": "為耶和華付出，",
        "en": "It's the life that we choose;",
        "ja": "エホバのため"
      },
      {
        "vi": "dù năm tháng không xa rời.",
        "ko": "걷는 내 삶의 길,",
        "zh": "這是我選的路，",
        "en": "For Jehovah we live.",
        "ja": "選んだ道"
      },
      {
        "vi": "Đời ta vui sao khi luôn sống vì Cha!",
        "ko": "나의 마음, 영혼 다하리.",
        "zh": "面對艱辛不停下腳步。",
        "en": "And whatever he asks, we will do.",
        "ja": "力尽くし歩む"
      },
      {
        "vi": "Chuyên cần thi hành ý Cha,",
        "ko": "충실히 섬기며",
        "zh": "我會堅持到底，",
        "en": "In the work we endure,",
        "ja": "晴れた日にも"
      },
      {
        "vi": "mặc cho nắng mưa dãi dầu.",
        "ko": "매일 말하리라,",
        "zh": "不管是晴是雨，",
        "en": "Whether sunshine or rain.",
        "ja": "雨の日にも"
      },
      {
        "vi": "Lòng ta hoan ca: “Con yêu mến ngài thay, Giê-hô-va”.",
        "ko": "“여호와여 사랑합니다, 영원히.”",
        "zh": "每天我都用行動表明：「我愛你。」",
        "en": "It's a way we can say ev'ry day: “I love you.”",
        "ja": "この愛伝えたい 神に"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Giô-suê 24:15; Thi 92:2; Rô 14:8).",
      "ko": "(여호수아 24:15; 시 92:2; 로마 14:8 참조)",
      "zh": "（參看書24:15；詩92:2；羅14:8）",
      "en": "(See also Josh. 24:15; Ps. 92:2; Rom. 14:8.)",
      "ja": "（ヨシュ 24:15; 詩 92:2; ロマ 14:8も参照。）"
    }
  },
  {
    "number": 82,
    "sourceSheet": "82",
    "labels": {
      "vi": "BÀI HÁT 82",
      "ko": "82번",
      "zh": "詩歌第82首",
      "en": "SONG 82",
      "ja": "82番"
    },
    "title": {
      "vi": "“Hãy chiếu ánh sáng của anh em”",
      "ko": "‘빛을 비추라'",
      "zh": "你們的光該在人前照耀",
      "en": "“Let Your Light Shine”",
      "ja": "「光を人々の前に輝かせなさい」"
    },
    "scripture": {
      "vi": "(Ma-thi-ơ 5:16)",
      "ko": "(마태복음 5:16)",
      "zh": "（馬太福音5:16）",
      "en": "(Matthew 5:16)",
      "ja": "（マタイ 5:16）"
    },
    "lines": [
      {
        "vi": "1. Như vầng dương mãi sáng soi cho muôn người khắp nơi,",
        "ko": "1. 예수 명령 따라 빛을 비추리,",
        "zh": "1．耶穌吩咐門徒要發出亮光，",
        "en": "1. Jesus has commanded That we shine our light,",
        "ja": "1. 光を今 輝かせ"
      },
      {
        "vi": "ta truyền báo về chân lý mà không chút thiên vị.",
        "ko": "희망, 위안 주는 저 햇살같이.",
        "zh": "像太陽照萬物，溫暖又明亮。",
        "en": "Like the sun, impartial, Comforting and bright.",
        "ja": "暗い世界 照らします"
      },
      {
        "vi": "Lời Thánh Kinh ẩn chứa bao tin an vui, hạnh phúc.",
        "ko": "평화의 길 환히 비추는 성경,",
        "zh": "上帝話語宣告和平的信息，",
        "en": "Through the Holy Scriptures, Thoughts of peace are heard.",
        "ja": "人の心 温める"
      },
      {
        "vi": "Ta chiếu soi sự sáng Cha dạy bằng công việc giảng rao.",
        "ko": "그 말씀 가르쳐서 빛을 비추리.",
        "zh": "我們將真理宣揚，為天父增光。",
        "en": "May we now reflect his light As we teach God's Word.",
        "ja": "神の言葉を届けます"
      },
      {
        "vi": "2. Ta truyền rao khắp bốn phương để muôn người lắng nghe.",
        "ko": "2. 왕국 소식 모두 듣게 도우리,",
        "zh": "2．上帝話語亮光給我們指引，",
        "en": "2. Let God's Kingdom message Speak to ev'ry heart;",
        "ja": "2. エホバ神のメッセージ"
      },
      {
        "vi": "Thông điệp Nước Trời tươi sáng tỏa ra khắp xa gần.",
        "ko": "모든 사람 듣고 선택하도록.",
        "zh": "向人傳好消息，盡心又盡力。",
        "en": "Let it shine before us As we play our part.",
        "ja": "良い知らせを伝えます"
      },
      {
        "vi": "Lời Chúa soi đường lối ta khi hăng say dạy dỗ.",
        "ko": "성경의 밝은 빛 우릴 이끄니",
        "zh": "讓王國的信息照亮每顆心，",
        "en": "Light from Scripture guides us As we bring good news.",
        "ja": "真の希望と慰めを"
      },
      {
        "vi": "Chân lý soi rọi để bao người chọn theo Giê-hô-va.",
        "ko": "최선을 다하여서 전파하리라.",
        "zh": "願他們下定決心按真理而行。",
        "en": "Sharing truth with ev'ryone; Truth is theirs to choose.",
        "ja": "心を込めて語ります"
      },
      {
        "vi": "3. Ta tỏa ra ánh sáng qua bao công việc tốt thay,",
        "ko": "3. 옳은 일 행하고 친절 베풀면",
        "zh": "3．我們的好行為照亮這世界，",
        "en": "3. Light from acts of kindness Brightens up this world,",
        "ja": "3. 思いやりと親切は"
      },
      {
        "vi": "qua lời nói từ nhân giống ngọc trai quý vô ngần.",
        "ko": "진리의 빛 계속 밝게 빛나리.",
        "zh": "彷彿無價珍珠，明亮又可貴。",
        "en": "To our words adds beauty Like a priceless pearl.",
        "ja": "神の教え飾ります"
      },
      {
        "vi": "Nguyện chiếu soi sự sáng khi trung kiên theo đường đúng.",
        "ko": "여호와 마음에 기쁨 드리며",
        "zh": "每天行事正義，令上帝開心。",
        "en": "May our light keep shining As we do what's right,",
        "ja": "真珠のように輝いて"
      },
      {
        "vi": "Như thế ta làm Chúa vui lòng, ngài ban ngàn phước ân.",
        "ko": "이 소식 아름답게 단장하리라.",
        "zh": "願不斷發出亮光，榮耀耶和華。",
        "en": "Then our works will always be Pleasing in God's sight.",
        "ja": "神の光を映します"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 119:130; Mat 5:14, 15, 45; Cô 4:6).",
      "ko": "(시 119:130; 마태 5:14, 15, 45; 골로새 4:6 참조)",
      "zh": "（參看詩119:130；太5:14,15,45；西4:6）",
      "en": "(See also Ps. 119:130; Matt. 5:14, 15, 45; Col. 4:6.)",
      "ja": "（詩 119:130; マタ 5:14，15，45; コロ 4:6も参照。）"
    }
  },
  {
    "number": 83,
    "sourceSheet": "83",
    "labels": {
      "vi": "BÀI HÁT 83",
      "ko": "83번",
      "zh": "詩歌第83首",
      "en": "SONG 83",
      "ja": "83番"
    },
    "title": {
      "vi": "“Từ nhà này sang nhà kia”",
      "ko": "‘집집으로'",
      "zh": "挨家挨戶",
      "en": "“From House to House”",
      "ja": "「家から家へ」"
    },
    "scripture": {
      "vi": "(Công vụ 20:20)",
      "ko": "(사도행전 20:20)",
      "zh": "（使徒行傳20:20）",
      "en": "(Acts 20:20)",
      "ja": "（使徒 20:20）"
    },
    "lines": [
      {
        "vi": "1. Truyền Lời Cha cho từng nhà dân nghe,",
        "ko": "1. 집집으로 찾아가서",
        "zh": "1．挨家挨戶將好消息",
        "en": "1. From house to house, from door to door,",
        "ja": "1. 家から家へと"
      },
      {
        "vi": "truyền bá khắp nơi gần xa.",
        "ko": "말씀을 전하며",
        "zh": "向所有人宣揚，",
        "en": "Jehovah's word we spread.",
        "ja": "真理広め"
      },
      {
        "vi": "Từ thành xa xôi, từ mọi phố xá,",
        "ko": "도시 농촌 어디서나",
        "zh": "走遍城鎮，傳遍鄉村，",
        "en": "From town to town, from farm to farm,",
        "ja": "町から町へと"
      },
      {
        "vi": "dạn dĩ giảng rao tin mừng.",
        "ko": "양들을 먹이네.",
        "zh": "餵養上帝的羊。",
        "en": "Jehovah's sheep are fed.",
        "ja": "羊探す"
      },
      {
        "vi": "Dù trẻ hoặc già, chúng ta thật lòng",
        "ko": "그리스도 예언대로",
        "zh": "基督門徒不分老幼",
        "en": "The good news that God's Kingdom rules,",
        "ja": "王国の知らせ"
      },
      {
        "vi": "giúp chiên đi theo đường Chúa.",
        "ko": "하느님 왕국을",
        "zh": "努力傳講真理，",
        "en": "As Jesus Christ foretold,",
        "ja": "肩を並べ"
      },
      {
        "vi": "Ta làm đúng thay như lời trước kia",
        "ko": "남녀노소 주 백성이",
        "zh": "告訴人人",
        "en": "Is now declared throughout the earth",
        "ja": "世界に伝える"
      },
      {
        "vi": "Thầy Lớn đã ban mệnh lệnh.",
        "ko": "온 땅에 전하네.",
        "zh": "上帝王國已在天上建立。",
        "en": "By Christians young and old.",
        "ja": "預言通り"
      },
      {
        "vi": "2. Nhiệt thành đi rao từng nhà dân nghe",
        "ko": "2. 집집으로 찾아가서",
        "zh": "2．挨家挨戶，竭盡全力，",
        "en": "2. From house to house, from door to door,",
        "ja": "2. 神の名伝える"
      },
      {
        "vi": "sự cứu rỗi cho người ngay.",
        "ko": "구원 선포하니",
        "zh": "宣告得救信息，",
        "en": "Salvation we proclaim.",
        "ja": "家から家"
      },
      {
        "vi": "Người cầu danh Cha, thờ ngài sốt sắng",
        "ko": "주 이름을 부르는 자",
        "zh": "幫助所有謙卑的人",
        "en": "It comes to those who make the choice",
        "ja": "応じる人皆"
      },
      {
        "vi": "nhận lãnh phước ân dư tràn.",
        "ko": "구원을 받으리.",
        "zh": "呼求上帝聖名。",
        "en": "To call upon God's name.",
        "ja": "報い受ける"
      },
      {
        "vi": "Họ chẳng thể nào đến kêu cầu ngài",
        "ko": "여호와를 모른다면",
        "zh": "教導他們認識真神，",
        "en": "But how can they respect the name",
        "ja": "伝道する人"
      },
      {
        "vi": "nếu chưa nghe danh của Chúa,",
        "ko": "부를 수 없으니",
        "zh": "親近仁愛上帝。",
        "en": "Of One they do not know?",
        "ja": "いないならば"
      },
      {
        "vi": "nên mình giảng rao danh ngài khắp nơi,",
        "ko": "그 거룩한 주 이름을",
        "zh": "我們必須每家每戶",
        "en": "To ev'ry home and ev'ry door,",
        "ja": "決して届かない"
      },
      {
        "vi": "dạn dĩ đến ngay từng nhà.",
        "ko": "집집에 알리세.",
        "zh": "傳揚上帝聖名。",
        "en": "The sacred name must go.",
        "ja": "清い名前"
      },
      {
        "vi": "3. Mình cùng đi rao từng nhà dân nghe",
        "ko": "3. 모두 함께 왕국 소식",
        "zh": "3．挨家挨戶，不遺餘力，",
        "en": "3. So let us go from door to door",
        "ja": "3. 向かおう 戸口へ"
      },
      {
        "vi": "về những phước ân ngày sau.",
        "ko": "집집에 전하세.",
        "zh": "傳王國好消息，",
        "en": "To spread the Kingdom news.",
        "ja": "知らせるため"
      },
      {
        "vi": "Dù họ không nghe hoặc là hưởng ứng,",
        "ko": "잘 듣든지 안 듣든지",
        "zh": "讓人決定",
        "en": "And whether it's embraced or not,",
        "ja": "心の良い人"
      },
      {
        "vi": "mình vẫn giảng rao không ngừng.",
        "ko": "기회를 주리라.",
        "zh": "是否願意接受聖經真理。",
        "en": "We'll let the people choose.",
        "ja": "命選ぶ"
      },
      {
        "vi": "Lời Chúa thành thật, thánh danh của ngài,",
        "ko": "여호와의 크신 이름,",
        "zh": "全力執行傳道使命，",
        "en": "At least we'll name Jehovah's name,",
        "ja": "エホバの真理を"
      },
      {
        "vi": "hãy rao cho dân mọi nước.",
        "ko": "소중한 진리를",
        "zh": "宣揚上帝聖名。",
        "en": "His glorious truth declare.",
        "ja": "伝えるなら"
      },
      {
        "vi": "Ta tìm thấy ai nhu mì giống chiên",
        "ko": "집집마다 말해 주고",
        "zh": "盡力散播真理之光，",
        "en": "And as we go from door to door,",
        "ja": "羊は見つかる"
      },
      {
        "vi": "tại khắp chốn hay từng nhà.",
        "ko": "양들을 찾으리.",
        "zh": "找出上帝的羊。",
        "en": "We'll find his sheep are there.",
        "ja": "その戸口に"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Công 2:21; Rô 10:14).",
      "ko": "(사도 2:21; 로마 10:14 참조)",
      "zh": "（參看徒2:21；羅10:14）",
      "en": "(See also Acts 2:21; Rom. 10:14.)",
      "ja": "（使徒 2:21; ロマ 10:14も参照。）"
    }
  },
  {
    "number": 84,
    "sourceSheet": "84",
    "labels": {
      "vi": "BÀI HÁT 84",
      "ko": "84번",
      "zh": "詩歌第84首",
      "en": "SONG 84",
      "ja": "84番"
    },
    "title": {
      "vi": "Phụng sự ở nơi có nhu cầu",
      "ko": "필요한 곳 어디든",
      "zh": "為上帝盡全力",
      "en": "Reaching Out",
      "ja": "人々の力になろう"
    },
    "scripture": {
      "vi": "(Ma-thi-ơ 9:37, 38)",
      "ko": "(마태복음 9:37, 38)",
      "zh": "（馬太福音9:37,38）",
      "en": "(Matthew 9:37, 38)",
      "ja": "（マタイ 9:37，38）"
    },
    "lines": [
      {
        "vi": "1. Giê-hô-va ban những thứ mình cần",
        "ko": "1. 여호와는 잘 아시네,",
        "zh": "1．上帝知道我的需要，",
        "en": "1. Jehovah knows just what we need",
        "ja": "1. エホバは知ってる"
      },
      {
        "vi": "vì ngài muốn ta sướng vui, thành công.",
        "ko": "어떤 삶이 행복한지.",
        "zh": "怎樣才能成功快樂。",
        "en": "To bring us joy and to succeed.",
        "ja": "与える喜び"
      },
      {
        "vi": "Ngài cung cấp cho bao cách phụng sự",
        "ko": "기쁨으로 섬기도록",
        "zh": "天父提供服務機會，",
        "en": "So he provides so many ways",
        "ja": "エホバに倣おう"
      },
      {
        "vi": "để mình thỏa tâm thi hành ý Chúa.",
        "ko": "다양한 일 맡기셨네.",
        "zh": "讓我一生敬奉真神。",
        "en": "In which to serve and spend our days.",
        "ja": "機会を捉えて"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Ở nơi nào có nhu cầu,",
        "ko": "모든 걸 드리리,",
        "zh": "為上帝盡全力，",
        "en": "Reaching out, giving all,",
        "ja": "勇気出して"
      },
      {
        "vi": "tình nguyện mình sẽ đi.",
        "ko": "여호와 위해.",
        "zh": "用行動證明。",
        "en": "for our God above.",
        "ja": "踏み出そう"
      },
      {
        "vi": "Vì yêu thương Chúa trên trời suốt trong đời,",
        "ko": "도움 필요한 곳 어디든",
        "zh": "無論要到哪裡都願意，",
        "en": "And where the need is great, there we'll be,",
        "ja": "きっと何かできる"
      },
      {
        "vi": "một lòng ta sẵn sàng.",
        "ko": "달려가리라.",
        "zh": "受愛心激勵。",
        "en": "reaching out in love.",
        "ja": "私にも"
      },
      {
        "vi": "2. Kìa bao phước ân đang đón đợi mình",
        "ko": "2. 우리 손길 필요한 곳",
        "zh": "2．世界各地都有需求，",
        "en": "2. There's work to do in ev'ry land.",
        "ja": "2. 世界のどこかで"
      },
      {
        "vi": "ở mọi quốc gia, khắp nơi gần xa.",
        "ko": "온 세상에 참 많다네.",
        "zh": "我很願意伸出援手。",
        "en": "Where there's a need, we lend a hand.",
        "ja": "助けを待ってる"
      },
      {
        "vi": "Cùng nhau sẻ chia, chung sức hỗ trợ",
        "ko": "정성 다해 도움 주고",
        "zh": "開闊心胸關懷別人，",
        "en": "By reaching out, we show we care.",
        "ja": "自分を差し出し"
      },
      {
        "vi": "ở tại những nơi đang cần giúp đỡ.",
        "ko": "필요한 곳 찾아가리.",
        "zh": "盡己所能做得更多。",
        "en": "We want to help and want to share.",
        "ja": "力になりたい"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Ở nơi nào có nhu cầu,",
        "ko": "모든 걸 드리리,",
        "zh": "為上帝盡全力，",
        "en": "Reaching out, giving all,",
        "ja": "勇気出して"
      },
      {
        "vi": "tình nguyện mình sẽ đi.",
        "ko": "여호와 위해.",
        "zh": "用行動證明。",
        "en": "for our God above.",
        "ja": "踏み出そう"
      },
      {
        "vi": "Vì yêu thương Chúa trên trời suốt trong đời,",
        "ko": "도움 필요한 곳 어디든",
        "zh": "無論要到哪裡都願意，",
        "en": "And where the need is great, there we'll be,",
        "ja": "きっと何かできる"
      },
      {
        "vi": "một lòng ta sẵn sàng.",
        "ko": "달려가리라.",
        "zh": "受愛心激勵。",
        "en": "reaching out in love.",
        "ja": "私にも"
      },
      {
        "vi": "3. Tại ngay chính nơi ta vẫn phụng sự,",
        "ko": "3. 멀리멀리 못 떠나도",
        "zh": "3．勇於嘗試全新技能，",
        "en": "3. And here at home, in towns nearby,",
        "ja": "3. 近くの区域で"
      },
      {
        "vi": "rèn luyện kỹ năng, cất xây nhà Cha.",
        "ko": "둘러보면 할 일 많네.",
        "zh": "樂意支持興建工程。",
        "en": "We plan, we build, new skills we try.",
        "ja": "建設手伝う"
      },
      {
        "vi": "Mình học nói thêm ngôn ngữ nước ngoài",
        "ko": "건축 봉사, 외국어 밭,",
        "zh": "努力學習不同外語，",
        "en": "We learn to speak a foreign tongue",
        "ja": "言語を学んで"
      },
      {
        "vi": "để truyền ý Cha cho người khắp chốn.",
        "ko": "필요한 일 찾아 하리.",
        "zh": "將好消息傳遍各地。",
        "en": "And bring good news to ev'ryone.",
        "ja": "真理を伝える"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Ở nơi nào có nhu cầu,",
        "ko": "모든 걸 드리리,",
        "zh": "為上帝盡全力，",
        "en": "Reaching out, giving all,",
        "ja": "勇気出して"
      },
      {
        "vi": "tình nguyện mình sẽ đi.",
        "ko": "여호와 위해.",
        "zh": "用行動證明。",
        "en": "for our God above.",
        "ja": "踏み出そう"
      },
      {
        "vi": "Vì yêu thương Chúa trên trời suốt trong đời,",
        "ko": "도움 필요한 곳 어디든",
        "zh": "無論要到哪裡都願意，",
        "en": "And where the need is great, there we'll be,",
        "ja": "きっと何かできる"
      },
      {
        "vi": "một lòng ta sẵn sàng.",
        "ko": "달려가리라.",
        "zh": "受愛心激勵。",
        "en": "reaching out in love.",
        "ja": "私にも"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Giăng 4:35; Công 2:8; Rô 10:14).",
      "ko": "(요한 4:35; 사도 2:8; 로마 10:14 참조)",
      "zh": "（參看約4:35；徒2:8；羅10:14）",
      "en": "(See also John 4:35; Acts 2:8; Rom. 10:14.)",
      "ja": "（ヨハ 4:35; 使徒 2:8; ロマ 10:14も参照。）"
    }
  },
  {
    "number": 85,
    "sourceSheet": "85",
    "labels": {
      "vi": "BÀI HÁT 85",
      "ko": "85번",
      "zh": "詩歌第85首",
      "en": "SONG 85",
      "ja": "85番"
    },
    "title": {
      "vi": "Hãy tiếp đón nhau",
      "ko": "서로 환영하라",
      "zh": "彼此樂意接納",
      "en": "Welcome One Another",
      "ja": "互いを迎え入れましょう"
    },
    "scripture": {
      "vi": "(Rô-ma 15:7)",
      "ko": "(로마서 15:7)",
      "zh": "（羅馬書15:7）",
      "en": "(Romans 15:7)",
      "ja": "（ローマ 15:7）"
    },
    "lines": [
      {
        "vi": "1. Ta cùng hân hoan chào đón nhau trong phiên họp.",
        "ko": "1. 하느님 우릴 불러 주시니",
        "zh": "1．歡迎你今天來參加聚會，",
        "en": "1. Welcome to all who gather here this day",
        "ja": "1. エホバから学ぶため"
      },
      {
        "vi": "Mình thành tâm đến để được Cha dạy khuyên.",
        "ko": "그 말씀 배우러 모였네.",
        "zh": "一起學習聖經的教誨。",
        "en": "To hear God's Word and to learn his way.",
        "ja": "集まる人たちを"
      },
      {
        "vi": "Lòng mừng khi biết sự thật đem bao phước ân.",
        "ko": "생명의 진리 배우는 우리,",
        "zh": "上帝教導人永生的真理，",
        "en": "Life-giving truth he offers to us all;",
        "ja": "心から迎えよう"
      },
      {
        "vi": "Tạ ơn Cha nay kéo đến, hết tâm ta vâng theo ngài.",
        "ko": "마음 다하여 모두를 환영하리.",
        "zh": "我們滿懷感謝在他面前聚集。",
        "en": "With thankfulness of heart, we respond to his call.",
        "ja": "共に神をたたえていこう"
      },
      {
        "vi": "2. Ta tạ ơn Cha vì phái bao anh chăn bầy",
        "ko": "2. 하느님 사랑 배운 형제들",
        "zh": "2．感激耶和華賜忠心牧人，",
        "en": "2. Thanks to our God for brothers such as these,",
        "ja": "2. 人々を温かく"
      },
      {
        "vi": "phục vụ dân Cha, đón chào anh chị em.",
        "ko": "우리를 따뜻이 반기네.",
        "zh": "他們仁愛又親切溫和。",
        "en": "Who welcome us and who seek to please.",
        "ja": "迎える牧者たち"
      },
      {
        "vi": "Mình nguyện yêu mến, học làm theo gương các anh",
        "ko": "형제들 항상 사랑하면서,",
        "zh": "願我們珍惜弟兄的服務，",
        "en": "May we keep holding men of that sort dear,",
        "ja": "その模範 見倣って"
      },
      {
        "vi": "và luôn yêu thương tiếp đón bất cứ ai đến phiên họp.",
        "ko": "함께 새로운 벗들도 환영하리.",
        "zh": "學習他們榜樣，互相關心幫助。",
        "en": "And now we welcome others who meet with us here.",
        "ja": "来る人皆 迎え入れよう"
      },
      {
        "vi": "3. Cha Giê-hô-va mời những ai tâm nhu mì",
        "ko": "3. 하느님 모두 초대하시네,",
        "zh": "3．耶和華邀請所有謙卑人",
        "en": "3. God's invitation reaches all mankind,",
        "ja": "3. 神招く 温かく"
      },
      {
        "vi": "lại cùng dân Cha để được nghe dạy khuyên.",
        "ko": "진리를 구하는 사람들.",
        "zh": "尋求真理，得美好福分。",
        "en": "That all sincere ones the truth may find.",
        "ja": "全ての人たちを"
      },
      {
        "vi": "Ngài dùng Con quý chuộc tội, đưa ta đến đây.",
        "ko": "주 곁에 우릴 이끄셨으니",
        "zh": "我們受吸引與天父親近，",
        "en": "God by his Son has drawn us to His side.",
        "ja": "その愛に倣いたい"
      },
      {
        "vi": "Vậy nay ta mau tiếp đón, đến với nhau trong vui mừng.",
        "ko": "마음을 열고 서로를 환영하리.",
        "zh": "也要敞開心胸，彼此接納歡迎。",
        "en": "So welcome one another with hearts opened wide.",
        "ja": "互いを さあ迎え入れよう"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Giăng 6:44; Phi-líp 2:29; Khải 22:17).",
      "ko": "(요한 6:44; 빌립보 2:29; 계시록 22:17 참조)",
      "zh": "（參看約6:44；腓2:29；啟22:17）",
      "en": "(See also John 6:44; Phil. 2:29; Rev. 22:17.)",
      "ja": "（ヨハ 6:44; フィリ 2:29; 啓 22:17も参照。）"
    }
  },
  {
    "number": 86,
    "sourceSheet": "86",
    "labels": {
      "vi": "BÀI HÁT 86",
      "ko": "86번",
      "zh": "詩歌第86首",
      "en": "SONG 86",
      "ja": "86番"
    },
    "title": {
      "vi": "Hãy để Đức Giê-hô-va dạy dỗ",
      "ko": "여호와께 배우라",
      "zh": "我們必須受耶和華教導",
      "en": "We Must Be Taught",
      "ja": "エホバの教えを受けましょう"
    },
    "scripture": {
      "vi": "(Ê-sai 50:4; 54:13)",
      "ko": "(이사야 50:4; 54:13)",
      "zh": "（以賽亞書50:4；54:13）",
      "en": "(Isaiah 50:4; 54:13)",
      "ja": "（イザヤ 50:4; 54:13）"
    },
    "lines": [
      {
        "vi": "1. Thần khí kêu gọi mọi dân mau đến nghe Giê-hô-va,",
        "ko": "1. 기쁘게 여호와 가르침 배우리.",
        "zh": "1．來認識耶和華，接受他的教導，",
        "en": "1. Come with rejoicing, and learn about Jehovah.",
        "ja": "1. 真理求め探す人は"
      },
      {
        "vi": "mời những người thành tâm đang khao khát tin mừng",
        "ko": "‘생명수 마시라' 부르시네.",
        "zh": "聖經說快來喝生命之水！",
        "en": "“Come drink life's water,” the spirit has said.",
        "ja": "その心満たされる"
      },
      {
        "vi": "đến đây bên dân ngài, lắng nghe Cha khuyên dạy.",
        "ko": "건전한 교훈 베푸시리니",
        "zh": "上帝已賜下健全的教誨，",
        "en": "Healthful instruction, God has provided.",
        "ja": "爽やかな集会で"
      },
      {
        "vi": "Nước Cha ban, ai uống nhận hy vọng sống thật.",
        "ko": "진리를 찾는 자 만족하리.",
        "zh": "渴求真理的人必得智慧。",
        "en": "All those who hunger for truth will be fed.",
        "ja": "神の教え受けよう"
      },
      {
        "vi": "2. Nào nhóm nhau lại tại đây, ta chớ đi đâu xa bầy,",
        "ko": "2. 함께 모이는 일 소중히 여기며",
        "zh": "2．不要輕易放棄基督徒的聚會，",
        "en": "2. Never forsaking our gathering together,",
        "ja": "2. 仲間たちとよく学んで"
      },
      {
        "vi": "cùng nghe lời Giê-hô-va răn bảo, tôi luyện.",
        "ko": "반드시 옳은 길 배우리라.",
        "zh": "學習正義、領受上帝教誨。",
        "en": "We must be taught; we must learn what is right.",
        "ja": "正しいこと行う"
      },
      {
        "vi": "Đức tin ta thêm mạnh, với anh em bên cạnh,",
        "ko": "성령과 형제 늘 함께하니",
        "zh": "有上帝力量和弟兄情誼，",
        "en": "Here with God's spirit, here with our brothers,",
        "ja": "ここに来て力得て"
      },
      {
        "vi": "có Cha ban ân phước và ban thần khí ngài.",
        "ko": "빛 안에 걸을 힘 얻게 되리.",
        "zh": "我們步伐堅定，走在光裡。",
        "en": "Here we are strengthened to walk in the light.",
        "ja": "光の中 歩もう"
      },
      {
        "vi": "3. Lời nói êm dịu cùng muôn câu hát khen Cha trên trời",
        "ko": "3. 찬양의 노래는 새 힘 솟게 하고",
        "zh": "3．頌讚上帝之聲多麼鼓舞人心，",
        "en": "3. Lips that sing praise, how encouraging to hear them!",
        "ja": "3. 皆で祈り皆で歌い"
      },
      {
        "vi": "từ anh chị làm ta thêm thư thái tâm hồn.",
        "ko": "주시는 가르침 꿀과 같네!",
        "zh": "受他教導的人言詞動聽。",
        "en": "Tongues of the taught ones, how sweet is their sound!",
        "ja": "喜びを共にする"
      },
      {
        "vi": "Ước mong luôn bên cạnh với anh em không rời.",
        "ko": "주의 백성과 늘 함께하며",
        "zh": "上帝的僕人要經常聚集，",
        "en": "Oh, may we always meet with God's people!",
        "ja": "集会を休まずに"
      },
      {
        "vi": "Chúng ta chung vai kính thờ Cha trọn tấm lòng.",
        "ko": "언제나 이곳에 머물리라!",
        "zh": "團結一致敬奉偉大上帝。",
        "en": "Oh, may we always among them be found!",
        "ja": "いつも励まし合おう"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Hê 10:24, 25; Khải 22:17).",
      "ko": "(히브리 10:24, 25; 계시록 22:17 참조)",
      "zh": "（參看來10:24,25；啟22:17）",
      "en": "(See also Heb. 10:24, 25; Rev. 22:17.)",
      "ja": "（ヘブ 10:24，25; 啓 22:17も参照。）"
    }
  },
  {
    "number": 87,
    "sourceSheet": "87",
    "labels": {
      "vi": "BÀI HÁT 87",
      "ko": "87번",
      "zh": "詩歌第87首",
      "en": "SONG 87",
      "ja": "87番"
    },
    "title": {
      "vi": "Hãy đến để được tươi tỉnh!",
      "ko": "와서, 새 힘을 얻으라!",
      "zh": "來吧！你必受激勵！",
      "en": "Come! Be Refreshed",
      "ja": "爽やかになれる場所"
    },
    "scripture": {
      "vi": "(Hê-bơ-rơ 10:24, 25)",
      "ko": "(히브리서 10:24, 25)",
      "zh": "（希伯來書10:24,25）",
      "en": "(Hebrews 10:24, 25)",
      "ja": "（ヘブライ 10:24，25）"
    },
    "lines": [
      {
        "vi": "1. Khắp mọi nơi bao nhiêu người kiêu căng, không biết Cha,",
        "ko": "1. 이 세상은 하느님 길 모르니",
        "zh": "1．世人迷失在這混亂世界中，",
        "en": "1. We live in a world that is wayward and lost;",
        "ja": "1. エホバの道を知らない"
      },
      {
        "vi": "cứ sống trong u mê và tăm tối.",
        "ko": "방향 잃고 빗나가네.",
        "zh": "不知道上帝的要求。",
        "en": "The way of our God is not known.",
        "ja": "暗闇の時代"
      },
      {
        "vi": "Muốn thành công đi theo đường Giê-hô-va sáng soi,",
        "ko": "내 생각을 따르면 위험하니",
        "zh": "我們需要指引才能向前走，",
        "en": "We need sure direction to safeguard our steps;",
        "ja": "自分の歩み導く"
      },
      {
        "vi": "chúng ta nghe Cha khuyên dạy, răn bảo.",
        "ko": "참된 지침 필요하네.",
        "zh": "單靠自己無法成功。",
        "en": "We cannot succeed on our own.",
        "ja": "助けが必要"
      },
      {
        "vi": "Phiên họp cho ta thêm vui, hy vọng tươi sáng hơn,",
        "ko": "새 힘과 밝은 희망 주는 집회,",
        "zh": "聚會讓人把希望銘記在心，",
        "en": "Our meetings refresh us and brighten our hope;",
        "ja": "休まず行こう 集会"
      },
      {
        "vi": "giúp ta trông cậy nơi Cha trên cao.",
        "ko": "강한 믿음 심어 주네.",
        "zh": "建立對上帝的信心。",
        "en": "They help us build faith in our God.",
        "ja": "楽しく爽やか"
      },
      {
        "vi": "Nhờ anh em luôn quan tâm, yêu thương nhau thiết tha,",
        "ko": "그 말씀은 마음에 감동 주니",
        "zh": "我們受到激勵表現好品行，",
        "en": "They move us with words that incite to fine deeds,",
        "ja": "互いに愛を表す行い"
      },
      {
        "vi": "chúng ta sinh ra bao việc nhân đức.",
        "ko": "늘 선을 행하게 되리.",
        "zh": "獲得力量不斷前行。",
        "en": "They give us the strength to go on.",
        "ja": "学べる"
      },
      {
        "vi": "Nhóm họp mang cho ta niềm vui sâu xa, thỏa tâm,",
        "ko": "여호와의 명령을 잊지 않고",
        "zh": "要一生聽從耶和華的話語，",
        "en": "We'll never forsake what Jehovah commands;",
        "ja": "エホバの意志に従い"
      },
      {
        "vi": "hướng dẫn ta đi trong đường công chính.",
        "ko": "하느님 뜻 행하리라.",
        "zh": "一切言行合他心意。",
        "en": "His will is what we want to do.",
        "ja": "いつも集まれば"
      },
      {
        "vi": "Suốt đời ta trung kiên và chuyên tâm theo lối Cha,",
        "ko": "함께 모여 옳은 길 교훈받아",
        "zh": "聚會幫助我們能行事正義，",
        "en": "Our meetings instruct us in ways that are right;",
        "ja": "真理を深く愛して"
      },
      {
        "vi": "mến yêu bao điều Cha hằng răn dạy.",
        "ko": "진리 더욱 사랑하리.",
        "zh": "深愛真理，堅定不移。",
        "en": "Our love for the truth they renew.",
        "ja": "正しく歩める"
      },
      {
        "vi": "2. Giê-hô-va yêu thương và quan tâm, chăm sóc ta",
        "ko": "2. 여호와는 우리를 잘 아시니",
        "zh": "2．天父清楚知道我們的需要，",
        "en": "2. Jehovah is keenly aware of our needs;",
        "ja": "2. エホバは助け与える"
      },
      {
        "vi": "thế nên ta nghe theo Lời Cha mãi.",
        "ko": "그분 교훈 들어야 해.",
        "zh": "要留心聽他的勸告。",
        "en": "His counsel by us should be heard.",
        "ja": "必要な時に"
      },
      {
        "vi": "Nhóm họp siêng năng cho dù gian nan hay khó khăn,",
        "ko": "집회 위해 시간을 사는 이들",
        "zh": "我們努力參加基督徒聚會，",
        "en": "To buy out the time for occasions to meet",
        "ja": "集まる時間取り分け"
      },
      {
        "vi": "chứng minh ta khôn ngoan và tin Chúa.",
        "ko": "주를 신뢰하는 사람.",
        "zh": "信賴聖經，顯出智慧。",
        "en": "Shows wisdom and trust in his Word.",
        "ja": "信仰示そう"
      },
      {
        "vi": "Bao người chăn chiên luôn chăm lo và đưa dẫn ta,",
        "ko": "하느님 경외하는 남자들이",
        "zh": "敬畏上帝的弟兄提供指引，",
        "en": "By wholesome instruction from God-fearing men,",
        "ja": "長老たちは優しく"
      },
      {
        "vi": "giúp ta an toàn trong nơi dân Cha.",
        "ko": "믿음의 길 가르치네.",
        "zh": "激勵我們表現信心。",
        "en": "We learn how our faith can be shown.",
        "ja": "羊を教える"
      },
      {
        "vi": "Mọi anh em xung quanh luôn yêu thương nâng đỡ nhau,",
        "ko": "믿음 안의 가족이 힘을 주니",
        "zh": "享有弟兄姐妹的溫暖陪伴，",
        "en": "With loving support from our fam'ly of faith,",
        "ja": "家族のような仲間の"
      },
      {
        "vi": "sánh vai bên nhau không hề đơn lẻ.",
        "ko": "난 혼자가 아니라네.",
        "zh": "我們不會感到孤單。",
        "en": "We know that we're never alone.",
        "ja": "愛に包まれる"
      },
      {
        "vi": "Đón chờ tương lai huy hoàng khi xưa Cha hứa ban,",
        "ko": "사랑하는 벗들과 함께 모여",
        "zh": "一起展望美好光明的未來，",
        "en": "So as we look forward to much better times,",
        "ja": "明るい時代待ちつつ"
      },
      {
        "vi": "gắn bó bên bao anh chị yêu dấu.",
        "ko": "낙원 희망 얘기하며",
        "zh": "張開雙手迎接摯愛。",
        "en": "We'll meet with the ones whom we love.",
        "ja": "いつも集まろう"
      },
      {
        "vi": "Chúa mừng vui ban cho sự khôn ngoan, thông sáng hơn",
        "ko": "하느님의 지혜로 사는 법을",
        "zh": "我們參加聚會不斷受提醒，",
        "en": "And here at these meetings we'll learn how to live",
        "ja": "エホバの知恵を学べる"
      },
      {
        "vi": "nếu ta vâng lời, không rời xa bầy.",
        "ko": "집회에서 배우리라.",
        "zh": "每天按照真理而行。",
        "en": "With wisdom that comes from above.",
        "ja": "大事な集会"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 37:18; 140:1; Châm 18:1; Ê-phê 5:16; Gia 3:17).",
      "ko": "(시 37:18; 140:1; 잠언 18:1; 에베소 5:16; 야고보 3:17 참조)",
      "zh": "（參看詩37:18；140:1；箴18:1；弗5:16；雅3:17）",
      "en": "(See also Ps. 37:18; 140:1; Prov. 18:1; Eph. 5:16; Jas. 3:17.)",
      "ja": "（詩 37:18; 140:1; 格 18:1; エフェ 5:16; ヤコ 3:17も参照。）"
    }
  },
  {
    "number": 88,
    "sourceSheet": "88",
    "labels": {
      "vi": "BÀI HÁT 88",
      "ko": "88번",
      "zh": "詩歌第88首",
      "en": "SONG 88",
      "ja": "88番"
    },
    "title": {
      "vi": "Xin dạy con biết đường lối Cha",
      "ko": "당신의 길을 알려 주소서",
      "zh": "求你使我認識你的道",
      "en": "Make Me Know Your Ways",
      "ja": "あなたの道を教えてください"
    },
    "scripture": {
      "vi": "(Thi thiên 25:4)",
      "ko": "(시편 25:4)",
      "zh": "（詩篇25：4）",
      "en": "(Psalm 25:4)",
      "ja": "（詩編25：4）"
    },
    "lines": [
      {
        "vi": "1. Bao nhiêu người tôi tớ cùng nhau nhóm chung lại đây,",
        "ko": "1. 오 여호와여, 주의 초대받아",
        "zh": "1．上帝，我們願接受你的邀請，",
        "en": "1. We're gathered together, Jehovah our God,",
        "ja": "1．神のもとに集まった"
      },
      {
        "vi": "mong nghe sự hướng dẫn của Giê-hô-va.",
        "ko": "우리 함께 모였나이다.",
        "zh": "欣然在你的面前聚集。",
        "en": "Accepting your warm invitation.",
        "ja": "真理学ぶために"
      },
      {
        "vi": "Lời Chúa như đèn soi thật sáng cho đường chúng con,",
        "ko": "주의 말씀은 길 밝히는 등불,",
        "zh": "你話語彷彿明燈給人指引，",
        "en": "Your Word is a lamp that lights up our pathway,",
        "ja": "その言葉光となり"
      },
      {
        "vi": "thấy rõ tri thức Cha cao quý vô ngần.",
        "ko": "신권 교육의 원천이니,",
        "zh": "你賜予我們神聖教育。",
        "en": "The source of divine education.",
        "ja": "行くべき道照らす"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Xin dạy con biết lối đúng cho con làm theo.",
        "ko": "주의 길을 가르쳐 주소서.",
        "zh": "我會細聽你智慧的提醒，",
        "en": "Teach me your ways, and make me understand;",
        "ja": "あなたが導く道"
      },
      {
        "vi": "Hãy giúp con chuyên lòng nghe tiếng Chúa khuyên dạy.",
        "ko": "지혜의 계명 들려주소서.",
        "zh": "請你教我明白永生真理。",
        "en": "Incline my ear to hear your wise command.",
        "ja": "ああ教えてください"
      },
      {
        "vi": "Dìu con bước tiếp lối sáng khôn, chân thật luôn,",
        "ko": "진리의 길 올바로 걸으며",
        "zh": "求你助我行走正確路徑，",
        "en": "Cause me to walk in ways of truth and right,",
        "ja": "真理を喜びとし"
      },
      {
        "vi": "vui thích nghe theo ngài hầu được sống dài lâu.",
        "ko": "주의 법 기뻐하게 하소서.",
        "zh": "願我深深喜愛你的法令。",
        "en": "And make your law my principal delight.",
        "ja": "正しく生きるために"
      },
      {
        "vi": "2. Ôi Cha Giê-hô-va, nguồn thông sáng ai bằng Cha;",
        "ko": "2. 주의 지혜는 헤아릴 수 없고",
        "zh": "2．上帝，你智慧多奇妙，多高深，",
        "en": "2. Unreachably high is your wisdom, O God;",
        "ja": "2．神の知恵とその教え"
      },
      {
        "vi": "con tin ngài phán xét đúng theo công bằng.",
        "ko": "주의 판결 힘 주나이다.",
        "zh": "你的法則信實又公正。",
        "en": "Your judgments we find reassuring.",
        "ja": "心から頼れる"
      },
      {
        "vi": "Lời Chúa sâu nhiệm thay, bền vững muôn đời chẳng lay,",
        "ko": "말씀에 담긴 한없이 놀라운",
        "zh": "你話語長存，是不變的真理，",
        "en": "Your Word is a source of unending wonder;",
        "ja": "その言葉当てはめれば"
      },
      {
        "vi": "cho con nguồn sáng soi, vui thích theo ngài.",
        "ko": "그 진리는 변함없으니,",
        "zh": "令人讚嘆又無與倫比。",
        "en": "Your sayings of truth are enduring.",
        "ja": "無限の価値を知る"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Xin dạy con biết lối đúng cho con làm theo.",
        "ko": "주의 길을 가르쳐 주소서.",
        "zh": "我會細聽你智慧的提醒，",
        "en": "Teach me your ways, and make me understand;",
        "ja": "あなたが導く道"
      },
      {
        "vi": "Hãy giúp con chuyên lòng nghe tiếng Chúa khuyên dạy.",
        "ko": "지혜의 계명 들려주소서.",
        "zh": "請你教我明白永生真理。",
        "en": "Incline my ear to hear your wise command.",
        "ja": "ああ教えてください"
      },
      {
        "vi": "Dìu con bước tiếp lối sáng khôn, chân thật luôn,",
        "ko": "진리의 길 올바로 걸으며",
        "zh": "求你助我行走正確路徑，",
        "en": "Cause me to walk in ways of truth and right,",
        "ja": "真理を喜びとし"
      },
      {
        "vi": "vui thích nghe theo ngài hầu được sống dài lâu.",
        "ko": "주의 법 기뻐하게 하소서.",
        "zh": "願我深深喜愛你的法令。",
        "en": "And make your law my principal delight.",
        "ja": "正しく生きるために"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Xuất 53:15; Thi 1:2; 119:27, 55, 75, 105).",
      "ko": "(출애굽 33:13; 시 1:2; 119:27, 35, 73, 105 참조)",
      "zh": "（參看出33：13；詩1：2；119：27，35，73，105）",
      "en": "(See also Ex. 33:13; Ps. 1:2; 119:27, 35, 73, 105.)",
      "ja": "（出33：13；詩1：2；119：27，35，73，105も参照。）"
    }
  },
  {
    "number": 89,
    "sourceSheet": "89",
    "labels": {
      "vi": "BÀI HÁT 89",
      "ko": "89번",
      "zh": "詩歌第89首",
      "en": "SONG 89",
      "ja": "89番"
    },
    "title": {
      "vi": "Nghe và giữ Lời Chúa sẽ được ban phước",
      "ko": "잘듣고 순종하여 축복을 받으라",
      "zh": "聽從而得福",
      "en": "Listen, Obey, and Be Blessed",
      "ja": "聞いて従い，神の祝福を得る"
    },
    "scripture": {
      "vi": "(Lu-ca 11:28)",
      "ko": "(누가복음 11:28)",
      "zh": "（路加福音11：28）",
      "en": "(Luke 11:28)",
      "ja": "（ルカ11：28）"
    },
    "lines": [
      {
        "vi": "1. Chúa Giê-su dạy mọi điều lành mang đến phước ân,",
        "ko": "1. 예수의 말씀 듣고 실행하리,",
        "zh": "1．基督的教誨我們天天謹記，",
        "en": "1. If we have listened to Christ, will we show it?",
        "ja": "1．イエスの教えは示"
      },
      {
        "vi": "chiếu sáng con đường người hiền từ theo lối ngài.",
        "ko": "가야 할 길 환하게 비추니.",
        "zh": "真理之光引導我們的路，",
        "en": "His teaching shines as it shows us the way.",
        "ja": "す人の行くべき道を"
      },
      {
        "vi": "Nếu lắng nghe ngài thì lòng mình vui sướng biết bao.",
        "ko": "잘 듣고 알게 되어 행복해도",
        "zh": "多麼高興能接受他的教導，",
        "en": "It makes us happy to hear and to know it,",
        "ja": "聞いてそれに従え"
      },
      {
        "vi": "Quyết chí vâng lời, mình được ngài ban phước lớn.",
        "ko": "순종치 않으면 소용없네.",
        "zh": "虛心遵行必得上帝賜福。",
        "en": "But we'll be blessed if we know and obey.",
        "ja": "ば神の祝福受ける"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Nghe và vâng giữ điều răn Chúa,",
        "ko": "주의 뜻 알리실 때",
        "zh": "聽從上帝的話語，",
        "en": "Listen, obey, and be blessed",
        "ja": "聞いて従い祝福得よう"
      },
      {
        "vi": "mang đến cho ta nhiều phước ân.",
        "ko": "잘 듣고 순종하라.",
        "zh": "你必受他的照顧。",
        "en": "When you hear God's will expressed.",
        "ja": "神に従う人"
      },
      {
        "vi": "Ta hằng vâng nghe và theo sát lối Cha dạy,",
        "ko": "주의 쉼과 축복 얻으려면",
        "zh": "你期望一生快樂又滿足，",
        "en": "If you'd be happy and enter his rest,",
        "ja": "は幸せになる"
      },
      {
        "vi": "tâm hồn thư thái, bao phước lành.",
        "ko": "잘 듣고 순종하라.",
        "zh": "聽從他必然得福。",
        "en": "Listen, obey, and be blessed.",
        "ja": "2．真理の言葉に根差"
      },
      {
        "vi": "2. Hết thảy mọi điều Thầy từng dạy, ta hãy lắng nghe;",
        "ko": "2. 말씀대로 행하면 보호받아",
        "zh": "2．我願實踐基督仁愛的勸導，",
        "en": "2. Our way of life, like a house, gives protection",
        "ja": "す生き方を続ければ"
      },
      {
        "vi": "quyết chí vâng lời, cuộc đời mình bao thỏa nguyện.",
        "ko": "반석 위에 지은 집 같으리.",
        "zh": "彷彿房子建在磐石之上，",
        "en": "When it is built on the rock, not on sand.",
        "ja": "嵐のような日来ても"
      },
      {
        "vi": "Giống những ngôi nhà được lập nền trên đá cứng thay,",
        "ko": "예수의 가르침을 적용하면",
        "zh": "風吹雨打，根基仍扎實穩固。",
        "en": "If we apply Jesus' loving direction,",
        "ja": "負けない強さを得る"
      },
      {
        "vi": "nước lũ, mưa tràn chẳng hề gì vì vững chắc.",
        "ko": "흔들림 없는 삶 살아가리.",
        "zh": "願我們持守這正確方向。",
        "en": "We'll build a life which on bedrock will stand.",
        "ja": "3．エホバのそばにとど"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Nghe và vâng giữ điều răn Chúa,",
        "ko": "주의 뜻 알리실 때",
        "zh": "聽從上帝的話語，",
        "en": "Listen, obey, and be blessed",
        "ja": "聞いて従い祝福得よう"
      },
      {
        "vi": "mang đến cho ta nhiều phước ân.",
        "ko": "잘 듣고 순종하라.",
        "zh": "你必受他的照顧。",
        "en": "When you hear God's will expressed.",
        "ja": "神に従う人"
      },
      {
        "vi": "Ta hằng vâng nghe và theo sát lối Cha dạy,",
        "ko": "주의 쉼과 축복 얻으려면",
        "zh": "你期望一生快樂又滿足，",
        "en": "If you'd be happy and enter his rest,",
        "ja": "は幸せになる"
      },
      {
        "vi": "tâm hồn thư thái, bao phước lành.",
        "ko": "잘 듣고 순종하라.",
        "zh": "聽從他必然得福。",
        "en": "Listen, obey, and be blessed.",
        "ja": "2．真理の言葉に根差"
      },
      {
        "vi": "3. Quyết bước trung thành, mình hằng làm theo tiếng phán Cha,",
        "ko": "3. 물가에 뿌리 깊이 내린 나무",
        "zh": "3．樹木栽種在水邊，葉茂根深，",
        "en": "3. Just as a tree rooted deep by the waters",
        "ja": "まり真理の"
      },
      {
        "vi": "sẽ sống muôn đời và nhận được bao phước lành.",
        "ko": "계절마다 열매를 내듯이,",
        "zh": "按時結果，生長茁壯豐盛。",
        "en": "Gives of its fruit when each season arrives,",
        "ja": "水を飲めば"
      },
      {
        "vi": "Giống những cây mạnh trồng gần dòng sông suối mát trong,",
        "ko": "하느님 자녀로서 순종하면",
        "zh": "我們服從耶和華仁愛天父，",
        "en": "If we obey as God's own sons and daughters,",
        "ja": "たくさんの良い実"
      },
      {
        "vi": "lá biếc xanh màu, mùa lại mùa sinh bông trái.",
        "ko": "끝없는 삶의 축복 누리리.",
        "zh": "他必賜福，使我們享永生。",
        "en": "We'll all be blessed and enjoy endless lives.",
        "ja": "生まれ将来の命得る"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Nghe và vâng giữ điều răn Chúa,",
        "ko": "주의 뜻 알리실 때",
        "zh": "聽從上帝的話語，",
        "en": "Listen, obey, and be blessed",
        "ja": "聞いて従い祝福得よう"
      },
      {
        "vi": "mang đến cho ta nhiều phước ân.",
        "ko": "잘 듣고 순종하라.",
        "zh": "你必受他的照顧。",
        "en": "When you hear God's will expressed.",
        "ja": "神に従う人"
      },
      {
        "vi": "Ta hằng vâng nghe và theo sát lối Cha dạy,",
        "ko": "주의 쉼과 축복 얻으려면",
        "zh": "你期望一生快樂又滿足，",
        "en": "If you'd be happy and enter his rest,",
        "ja": "は幸せになる"
      },
      {
        "vi": "tâm hồn thư thái, bao phước lành.",
        "ko": "잘 듣고 순종하라.",
        "zh": "聽從他必然得福。",
        "en": "Listen, obey, and be blessed.",
        "ja": "2．真理の言葉に根差"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Phục 28:2; Thi 1:5; Châm 10:22; Mat 7:24-27; Lu 6:47-49).",
      "ko": "(신명 28:2; 시 1:3; 잠언 10:22; 마태 7:24-27; 누가 6:47-49 참조)",
      "zh": "（參看申28：2；詩1：3；箴10：22；太7：24-27；路6：47-49）",
      "en": "(See also Deut. 28:2; Ps. 1:3; Prov. 10:22; Matt. 7:24-27; Luke 6:47-49.)",
      "ja": "（申28：2；詩1：3；格10：22；マタ7：24‐27；ルカ6：47‐49も参照。）"
    }
  },
  {
    "number": 90,
    "sourceSheet": "90",
    "labels": {
      "vi": "BÀI HÁT 90",
      "ko": "90번",
      "zh": "詩歌第90首",
      "en": "SONG 90",
      "ja": "90番"
    },
    "title": {
      "vi": "Hãy khuyến khích nhau",
      "ko": "서로 격려하라",
      "zh": "要彼此鼓勵",
      "en": "Encourage One Another",
      "ja": "励まし合いましょう"
    },
    "scripture": {
      "vi": "(Hê-bo-rơ 10:24, 25)",
      "ko": "(히브리서 10:24, 25)",
      "zh": "（希伯來書10：24，25）",
      "en": "(Hebrews 10:24, 25)",
      "ja": "（ヘブライ10：24，25）"
    },
    "lines": [
      {
        "vi": "1. Ta hãy giúp anh chị em, khích lệ họ",
        "ko": "1. 충실히 주를 섬기면서",
        "zh": "1．基督徒之間互相勉勵，",
        "en": "1. As we encourage one another",
        "ja": "1．励まし合いなが"
      },
      {
        "vi": "quyết tâm một lòng thờ Giê-hô-va.",
        "ko": "서로를 격려해 주면",
        "zh": "一同忠貞敬奉上帝，",
        "en": "To serve Jehovah faithfully,",
        "ja": "らエホバに仕えて"
      },
      {
        "vi": "Như thế, giữ dây tình yêu mãi bền chặt,",
        "ko": "우리의 사랑 깊어져서",
        "zh": "彼此關心能加深友誼，",
        "en": "We find the bonds of love are strengthened;",
        "ja": "強い絆結び"
      },
      {
        "vi": "chúng †a vui sống chan hòa cùng nhau.",
        "ko": "평화와 연합 이루리.",
        "zh": "團結和諧、溫情洋溢。",
        "en": "Fine works bring peace and unity.",
        "ja": "愛を育てよう"
      },
      {
        "vi": "Thử thách dẫu lớn mấy đều bước qua được",
        "ko": "주 백성 소유한 이 사랑",
        "zh": "弟兄姐妹表現的真愛，",
        "en": "The love we find among God's people",
        "ja": "神の民の愛"
      },
      {
        "vi": "vì ta luôn có anh em trợ lực.",
        "ko": "인내할 강한 힘 주니,",
        "zh": "給人勇氣不斷忍耐。",
        "en": "Gives each the courage to endure.",
        "ja": "は耐え忍ぶ力"
      },
      {
        "vi": "Hội thánh chính nơi mình nương náu tuyệt vời,",
        "ko": "회중은 피난처가 되어",
        "zh": "會眾是我們的避風港，",
        "en": "Our congregation is a refuge,",
        "ja": "会衆は避難"
      },
      {
        "vi": "giúp ta cảm thấy an toàn bên Cha.",
        "ko": "마음의 평온을 주네.",
        "zh": "置身其中得享平安。",
        "en": "A place where we can feel secure.",
        "ja": "所私の安らぎ"
      },
      {
        "vi": "2. Như táo long lanh vàng trên đĩa cần bạc,",
        "ko": "2. 때에 알맞은 말 한마디",
        "zh": "2．親切問候與真誠關懷，",
        "en": "2. A word when spoken at the right time",
        "ja": "2．金のリンゴに似"
      },
      {
        "vi": "nói năng phải thì thật an ủi thay!",
        "ko": "참으로 위안이 되네!",
        "zh": "來自忠貞親密友伴。",
        "en": "Is, oh, how comforting to hear!",
        "ja": "た優しい言葉を"
      },
      {
        "vi": "Luôn có anh em đầy yêu mến cạnh mình,",
        "ko": "따듯이 위로하는 벗들",
        "zh": "合時的言語多麼美好，",
        "en": "We hear these words of consolation",
        "ja": "友から掛けら"
      },
      {
        "vi": "đỡ nâng ta với bao lời dịu êm.",
        "ko": "너무나 소중하다네.",
        "zh": "予人安慰、帶走煩惱。",
        "en": "From friends so faithful and so dear.",
        "ja": "れて心温まる"
      },
      {
        "vi": "Thật tốt sát cánh kết hợp với anh chị",
        "ko": "희망과 생각이 같은 벗",
        "zh": "大家懷著共同的信念，",
        "en": "How good it is to work together",
        "ja": "思い一つに"
      },
      {
        "vi": "thờ Cha, thêm sốt sắng trong việc ngài.",
        "ko": "함께하여 행복하네!",
        "zh": "並肩工作綻放笑臉！",
        "en": "With those whose hopes and goals we share!",
        "ja": "して働く喜び"
      },
      {
        "vi": "Ta giúp các anh chị em, khích lệ họ,",
        "ko": "각자의 짐을 질 수 있게",
        "zh": "重擔要樂於互相擔當，",
        "en": "We seek to strengthen one another",
        "ja": "重い荷を負い合"
      },
      {
        "vi": "sẻ chia, mang lấy gánh nặng cho nhau.",
        "ko": "서로 힘 더해 주리라.",
        "zh": "彼此信心更加堅強。",
        "en": "And help each one his burden bear.",
        "ja": "い友を支えよう"
      },
      {
        "vi": "3. Do có đức tin mạnh nơi Giê-hô-va,",
        "ko": "3. 여호와의 날 가까움을",
        "zh": "3．我們有信心就能看清",
        "en": "3. As we with eyes of faith are seeing",
        "ja": "3．仲間との集まり"
      },
      {
        "vi": "chúng ta hiểu rằng ngày Cha chẳng xa.",
        "ko": "믿음의 눈으로 보니",
        "zh": "上帝大日子已臨近。",
        "en": "The nearness of Jehovah's day,",
        "ja": "忘れることなく"
      },
      {
        "vi": "Siêng nhóm anh em cùng nhau kính thờ ngài,",
        "ko": "이 길을 계속 걸으면서",
        "zh": "我們要經常參加聚會，",
        "en": "We need our gathering together",
        "ja": "確信を抱いてエ"
      },
      {
        "vi": "giúp ta không bước xa rời đường Cha.",
        "ko": "더욱더 함께 모이리.",
        "zh": "行走正道永不偏離。",
        "en": "To keep us walking in the way.",
        "ja": "ホバの日待とう"
      },
      {
        "vi": "Hợp nhất, gắn bó với toàn thể dân ngài,",
        "ko": "주의 백성과 연합하여",
        "zh": "上帝的忠僕團結一心，",
        "en": "United with Jehovah's people,",
        "ja": "友と肩を並べ"
      },
      {
        "vi": "lòng ta ao ước mãi theo hầu ngài.",
        "ko": "영원히 주 섬기리니,",
        "zh": "期盼永遠崇拜上帝。",
        "en": "We hope to serve eternally.",
        "ja": "エホバに仕えて"
      },
      {
        "vi": "Ta hãy yêu thương và khuyến khích mọi người",
        "ko": "충절을 굳게 지키도록",
        "zh": "弟兄姐妹都彼此鼓勵，",
        "en": "So we encourage one another",
        "ja": "励まし合いなが"
      },
      {
        "vi": "quyết tâm luôn giữ vững lòng trung kiên.",
        "ko": "서로 꼭 격려하리라.",
        "zh": "必能保持忠貞到底！",
        "en": "To hold to our integrity.",
        "ja": "ら忠誠尽くそう"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Lu 22:32; Công 14:21, 22; Ga 6:2; 1 Tê 5:14).",
      "ko": "(누가 22:32; 사도 14:21, 22; 갈라디아 6:2; 데살로니가 전서 5:14 참조)",
      "zh": "（參看路22：32；徒14：21，22；加6：2；帖前5：14）",
      "en": "(See also Luke 22:32; Acts 14:21, 22; Gal. 6:2; 1 Thess. 5:14.)",
      "ja": "（ルカ22：32；使徒14：21，22；ガラ6：2；テサ一5：14も参照。）"
    }
  },
  {
    "number": 91,
    "sourceSheet": "91",
    "labels": {
      "vi": "BÀI HÁT 91",
      "ko": "91번",
      "zh": "詩歌第91首",
      "en": "SONG 91",
      "ja": "91番"
    },
    "title": {
      "vi": "Công việc của tình vêu thương",
      "ko": "사랑으로 흘린땀",
      "zh": "出於愛心的辛勞",
      "en": "Our Laborof Love",
      "ja": "力を合わせて建てる"
    },
    "scripture": {
      "vi": "(Thi thiên 127:1)",
      "ko": "(시편 127:1)",
      "zh": "（詩篇127：1）",
      "en": "(Psalm 127:1)",
      "ja": "（詩編127：1）"
    },
    "lines": [
      {
        "vi": "1. Ngày hằng trông mong giờ đã đến,",
        "ko": "1. 특별한 날인 오늘",
        "zh": "1．耶和華，我們今天",
        "en": "1. Jehovah, this is the day;",
        "ja": "1．愛するエホバ"
      },
      {
        "vi": "mọi người nơi đây cầu nguyện trước Chúa.",
        "ko": "진실로 기도드리니,",
        "zh": "衷心感謝你的恩典。",
        "en": "Now from our hearts, we want to pray.",
        "ja": "この日を迎えて"
      },
      {
        "vi": "Tạ ơn Chúa đã nhân từ xuống ơn lành",
        "ko": "형언할 수 없는 이",
        "zh": "能得到你嘉許，多光榮，",
        "en": "How you have honored us, favored us,",
        "ja": "心からの祈り捧げます"
      },
      {
        "vi": "thật không sao đếm được!",
        "ko": "영예 주셨나이다!",
        "zh": "感動在心中！",
        "en": "More than words can say!",
        "ja": "今ここに建"
      },
      {
        "vi": "Vì lòng yêu thương và sốt sắng,",
        "ko": "사랑으로 흘린 땀",
        "zh": "我們都出於愛心，",
        "en": "Upon our labor of love,",
        "ja": "つ崇拝の家は"
      },
      {
        "vi": "nhiều người xây nên nhà Giê-hô-va.",
        "ko": "주께서 축복하시니,",
        "zh": "為你的殿不怕艱辛。",
        "en": "We've seen your blessing from above.",
        "ja": "あなたから"
      },
      {
        "vi": "Ngài ban phước lớn vô cùng xuống nơi này",
        "ko": "이 건물 세워져 그",
        "zh": "這地方能落成，全因你",
        "en": "And now a building stands, by our hands,",
        "ja": "の祝福の証拠"
      },
      {
        "vi": "và dân Cha hát mừng.",
        "ko": "증거 되었나이다.",
        "zh": "眷顧和指引。",
        "en": "As the proof thereof.",
        "ja": "エホバよこの恵み"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Đặc ân vô giá khi ta được cất xây",
        "ko": "큰 특권 주신 여호와여,",
        "zh": "主耶和華，我們很榮幸",
        "en": "Jehovah God, it was a priv'lege",
        "ja": "深く感謝して"
      },
      {
        "vi": "chính nơi này đề thờ Đấng Toàn Năng.",
        "ko": "주 위해 지었나이다.",
        "zh": "把這地方呈獻給你。",
        "en": "For us to build this place for you.",
        "ja": "命の日の限り"
      },
      {
        "vi": "Nguyện luôn tôn kính, thờ Chúa Giê-hô-va, mãi ca khen ngoài;",
        "ko": "우리는 일평생 주 섬겨 모든 일로",
        "zh": "願意每天衷心讚頌你，一生一世，",
        "en": "May we continue in your service throughout our days",
        "ja": "あなたに賛"
      },
      {
        "vi": "việc làm, câu nói quyết theo ý ngài.",
        "ko": "주를 찬양하리이다.",
        "zh": "行事明智，忠貞到底。",
        "en": "And bring you praise in all we do.",
        "ja": "美捧げます"
      },
      {
        "vi": "2. Tìm được bao nhiêu bằng hữu tốt,",
        "ko": "2. 행복한 이 모습들!",
        "zh": "2．你我的快樂笑臉，",
        "en": "2. What happy faces we see,",
        "ja": "2．あふれる笑"
      },
      {
        "vi": "lòng đầy hân hoan, thỏa nguyện biết mấy!",
        "ko": "우리 우정 깊어져서",
        "zh": "彼此之間情誼相牽。",
        "en": "And what good friends we've come to be!",
        "ja": "顔友情の絆"
      },
      {
        "vi": "Cùng nhau sát cánh bao ngày, quý vô cùng,",
        "ko": "함께한 이 추억",
        "zh": "無數美好回憶與友情，",
        "en": "And how we'll cherish these memories",
        "ja": "私たちは決"
      },
      {
        "vi": "thời gian không xóa nhòa.",
        "ko": "영원히 남으리이다!",
        "zh": "珍藏在心裡。",
        "en": "For eternity!",
        "ja": "して忘れない"
      },
      {
        "vi": "Nhờ Giê-hô-va hằng giúp sức,",
        "ko": "주의 영 함께하여",
        "zh": "全憑耶和華指引，",
        "en": "We saw your spirit, O Lord,",
        "ja": "力合わせて"
      },
      {
        "vi": "mọi người chung vai làm việc hăng say.",
        "ko": "한마음 되어서 한 일.",
        "zh": "我們才能團結一心。",
        "en": "In how we worked with one accord.",
        "ja": "働いた時に"
      },
      {
        "vi": "Quà cao quý nhất không gì sánh hơn là",
        "ko": "주 이름 높이는 큰",
        "zh": "盡一分力彰顯你聖名，",
        "en": "And how we've added fame to your name;",
        "ja": "神の助け味"
      },
      {
        "vi": "làm danh Cha sáng nơời.",
        "ko": "상을 받았나이다!",
        "zh": "心中多歡欣！",
        "en": "What a grand reward!",
        "ja": "わったことも"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Đặc ân vô giá khi ta được cất xây",
        "ko": "큰 특권 주신 여호와여,",
        "zh": "主耶和華，我們很榮幸",
        "en": "Jehovah God, it was a priv'lege",
        "ja": "深く感謝して"
      },
      {
        "vi": "chính nơi này đề thờ Đấng Toàn Năng.",
        "ko": "주 위해 지었나이다.",
        "zh": "把這地方呈獻給你。",
        "en": "For us to build this place for you.",
        "ja": "命の日の限り"
      },
      {
        "vi": "Nguyện luôn tôn kính, thờ Chúa Giê-hô-va, mãi ca khen ngoài;",
        "ko": "우리는 일평생 주 섬겨 모든 일로",
        "zh": "願意每天衷心讚頌你，一生一世，",
        "en": "May we continue in your service throughout our days",
        "ja": "あなたに賛"
      },
      {
        "vi": "việc làm, câu nói quyết theo ý ngài.",
        "ko": "주를 찬양하리이다.",
        "zh": "行事明智，忠貞到底。",
        "en": "And bring you praise in all we do.",
        "ja": "美捧げます"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 116:1; 147:1; Rô 15:6).",
      "ko": "(시 116:1; 147:1; 로마 15:6 참조)",
      "zh": "（參看詩116：1；147：1；羅15：6）",
      "en": "(See also Ps. 116:1; 147:1; Rom. 15:6.)",
      "ja": "（詩116：1；147：1；ロマ15：6も参照。）"
    }
  },
  {
    "number": 92,
    "sourceSheet": "92",
    "labels": {
      "vi": "BÀI HÁT 92",
      "ko": "92번",
      "zh": "詩歌第92首",
      "en": "SONG 92",
      "ja": "92番"
    },
    "title": {
      "vi": "Một nơi mang danh Cha",
      "ko": "당신의 이름을 위한 집",
      "zh": "屬於耶和華的地方",
      "en": "A Place BearingYour Name",
      "ja": "あなたのお名前が付された場所"
    },
    "scripture": {
      "vi": "(1 Sử ký 29:16)",
      "ko": "(역대기상 29:16)",
      "zh": "（歷代志上29：16）",
      "en": "(1 Chronicles 29:16)",
      "ja": "（歴代第一29：16）"
    },
    "lines": [
      {
        "vi": "1. Vui thay khi nhận đặc ân rất lớn này,",
        "ko": "1. 여호와여, 이곳을",
        "zh": "1．耶和華，我們多麼榮幸",
        "en": "1. How great is the honor, Jehovah,",
        "ja": "1．愛する父エホ"
      },
      {
        "vi": "hợp sức xây nên nơi thờ tôn Chúa.",
        "ko": "짓는 큰 영예를 주셨으니",
        "zh": "將這地方呈獻給你。",
        "en": "To build you a place for your name!",
        "ja": "バ感謝捧げます"
      },
      {
        "vi": "Giờ xin dâng đến Chúa nơi được cất xây,",
        "ko": "이제 주 이름 드높이며",
        "zh": "盡力顯揚你偉大聖名，",
        "en": "We offer it now with rejoicing",
        "ja": "美しいこの家建"
      },
      {
        "vi": "làm sáng danh ngài mãi, vinh hiển thay.",
        "ko": "기쁨으로 바칩니다.",
        "zh": "內心充滿喜樂歡欣。",
        "en": "To add to your glory and fame.",
        "ja": "てられたことを"
      },
      {
        "vi": "Bao nhiêu ơn tuyệt diệu dân Chúa có được",
        "ko": "우리 드릴 수 있는",
        "zh": "我們擁有的能力、財物，",
        "en": "Whatever the things we may give you,",
        "ja": "あなたの栄光で"
      },
      {
        "vi": "đều bởi Cha rộng lượng ban phước xuống.",
        "ko": "것들 모두 주의 것이오니",
        "zh": "全都來自仁愛天父，",
        "en": "They rightly were yours from the start.",
        "ja": "満ちますように"
      },
      {
        "vi": "Tài năng hay của cải, năng lực chúng con",
        "ko": "힘과 재능, 모든",
        "zh": "我們樂意將一切獻出，",
        "en": "Our labor, our skill, our possessions,",
        "ja": "あなたのお名前が"
      },
      {
        "vi": "xin hiến dâng cho Cha Giê-hô-va.",
        "ko": "소유를 마음 다해 드립니다.",
        "zh": "心甘情願為你服務。",
        "en": "We joyfully give from the heart.",
        "ja": "付されたこの場所"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Trọn lòng dâng hiến chính nơi này đây,",
        "ko": "이곳을 주께 바치니",
        "zh": "願這屬於你的地方，",
        "en": "May we present this place to you,",
        "ja": "エホバこの家"
      },
      {
        "vi": "đề chúng con khen ngợi thánh danh.",
        "ko": "주 이름을 두소서.",
        "zh": "使你聖名受顯揚。",
        "en": "And here may your name be known.",
        "ja": "をお捧げします"
      },
      {
        "vi": "Nguyện cầu xin Chúa chấp nhận, ban phước,",
        "ko": "오늘 우리 봉헌하니",
        "zh": "我們獻上這個地方，",
        "en": "We dedicate this place to you;",
        "ja": "用いてください"
      },
      {
        "vi": "khiến nơi đây mãi mang danh ngoài.",
        "ko": "부디 받아 주소서.",
        "zh": "懇求你賜福、接納。",
        "en": "Please accept it as your own.",
        "ja": "あなたのために"
      },
      {
        "vi": "2. Mong sao nơi nhà ngài vang tiếng cảm tạ,",
        "ko": "2. 주의 백성의 찬양 소리",
        "zh": "2．天父，我們渴望敬拜你，",
        "en": "2. And now may we honor you, Father,",
        "ja": "2．愛する父エホ"
      },
      {
        "vi": "lời hát tôn vinh Cha đầy cao quý.",
        "ko": "이곳에 가득하오니,",
        "zh": "在這裡稱頌你的名。",
        "en": "By filling this place with your praise.",
        "ja": "バ賛美捧げます"
      },
      {
        "vi": "Nguyện danh Giê-hô-va luôn được hiển vinh,",
        "ko": "주의 길을 배우는 사람",
        "zh": "願人人前來受你教導，",
        "en": "May glory ascend with the increase",
        "ja": "崇拝のこの家"
      },
      {
        "vi": "vì có thêm người đến khen ngợi Cha.",
        "ko": "더 늘어나게 하소서.",
        "zh": "為你增添讚美、榮耀。",
        "en": "Of those who are learning your ways.",
        "ja": "大切にします"
      },
      {
        "vi": "Nơi đây, nơi thờ phượng dân Chúa nhóm lại,",
        "ko": "주 이름을 드높이도록",
        "zh": "這崇拜的地方屬於你，",
        "en": "Committing this place to your worship,",
        "ja": "新たな仲間たち"
      },
      {
        "vi": "nguyện sẽ luôn tận tình chăm sóc tốt.",
        "ko": "정성 다해 돌보리니,",
        "zh": "我們樂意用心管理。",
        "en": "We give it our generous care.",
        "ja": "ここに招きます"
      },
      {
        "vi": "Nhà Cha thu hút biết bao người giống chiên",
        "ko": "숭배 위해 바쳐진 이곳",
        "zh": "願這裡成為美好見證，",
        "en": "And long may it stand as a witness,",
        "ja": "あなたのお名前が"
      },
      {
        "vi": "vui sướng đến nghe Cha, theo lối ngài.",
        "ko": "길이 서 있게 하소서.",
        "zh": "顯揚真理、讚美真神。",
        "en": "Supporting the message we bear.",
        "ja": "付されたこの場所"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Trọn lòng dâng hiến chính nơi này đây,",
        "ko": "이곳을 주께 바치니",
        "zh": "願這屬於你的地方，",
        "en": "May we present this place to you,",
        "ja": "エホバこの家"
      },
      {
        "vi": "đề chúng con khen ngợi thánh danh.",
        "ko": "주 이름을 두소서.",
        "zh": "使你聖名受顯揚。",
        "en": "And here may your name be known.",
        "ja": "をお捧げします"
      },
      {
        "vi": "Nguyện cầu xin Chúa chấp nhận, ban phước,",
        "ko": "오늘 우리 봉헌하니",
        "zh": "我們獻上這個地方，",
        "en": "We dedicate this place to you;",
        "ja": "用いてください"
      },
      {
        "vi": "khiến nơi đây mãi mang danh ngoài.",
        "ko": "부디 받아 주소서.",
        "zh": "懇求你賜福、接納。",
        "en": "Please accept it as your own.",
        "ja": "あなたのために"
      }
    ],
    "reference": {
      "vi": "(Cũng xem 1 Vua 8:18, 27; 1 Sử 29:11-14; Công 20:24).",
      "ko": "(열왕기상 8:18, 27; 역대기상 29:11-14; 사도 20:24 참조)",
      "zh": "（參看王上8：18，27；代上29：11-14；徒20：24）",
      "en": "(See also 1 Ki. 8:18, 27; 1 Chron. 29:11-14; Acts 20:24.)",
      "ja": "（王一8：18，27；代一29：11‐14；使徒20：24も参照。）"
    }
  },
  {
    "number": 93,
    "sourceSheet": "93",
    "labels": {
      "vi": "BÀI HÁT 93",
      "ko": "93번",
      "zh": "詩歌第93首",
      "en": "SONG 93",
      "ja": "93番"
    },
    "title": {
      "vi": "95 Xin Cha ban phước cho buổi nhóm họp",
      "ko": "우리의 모임을 축복하소서",
      "zh": "求你賜福給我們的聚會",
      "en": "Bless Our Meeting Together",
      "ja": "集会を祝福してください"
    },
    "scripture": {
      "vi": "(Hê-bo-rơ 10:24, 25)",
      "ko": "(히브리서 10:24, 25)",
      "zh": "（希伯來書10：24，25）",
      "en": "(Hebrews 10:24, 25)",
      "ja": "（ヘブライ10：24，25）"
    },
    "lines": [
      {
        "vi": "1. Lạy Giê-hô-va, chúng con họp lại,",
        "ko": "1. 여호와여, 우리",
        "zh": "1．上帝，我們聚在一起，",
        "en": "1. Bless us as we meet together,",
        "ja": "1．喜びもたら"
      },
      {
        "vi": "cầu Cha ban phước nhóm hôm nay.",
        "ko": "모임 크게 축복하소서.",
        "zh": "禱告感謝讚美你。",
        "en": "O Jehovah, we now pray.",
        "ja": "すこの集会に"
      },
      {
        "vi": "Bao câu cảm tạ, dâng Cha hết lòng.",
        "ko": "모든 집회 감사하니",
        "zh": "參加聚會，得你力量，",
        "en": "We are thankful for our meetings;",
        "ja": "支えと祝福あ"
      },
      {
        "vi": "Nguyện thần khí Cha ngự tại đây.",
        "ko": "주의 영을 주소서.",
        "zh": "真理中扎根茁壯。",
        "en": "May your spirit with us stay.",
        "ja": "りますように"
      },
      {
        "vi": "2. Cầu Cha giúp chúng con nên tỉnh luyện,",
        "ko": "2. 주여, 우릴 말씀으로",
        "zh": "2．求你教導我們真理，",
        "en": "2. Help us, Lord, refine our worship;",
        "ja": "2．教えてくださ"
      },
      {
        "vi": "Lời Cha ghi khắc trong tâm tư.",
        "ko": "순결하게 하소서.",
        "zh": "使我們合你心意。",
        "en": "With your Word, oh, do us fill.",
        "ja": "いあなたの言葉"
      },
      {
        "vi": "Xin Cha huấn luyện cho tôi tớ ngài",
        "ko": "사랑으로 전파하게",
        "zh": "訓練我們傳好消息，",
        "en": "Train our minds and tongues to witness;",
        "ja": "正しい崇拝"
      },
      {
        "vi": "rao tin Nước Trời thành thạo hơn.",
        "ko": "가르침을 주소서.",
        "zh": "表現真摯的愛心。",
        "en": "Love within our hearts instill.",
        "ja": "捧げるために"
      },
      {
        "vi": "3. Cầu Cha chúc phước cho phiên họp này,",
        "ko": "3. 아버지여, 이 모임에",
        "zh": "3．慈愛天父，求你賜福，",
        "en": "3. Loving Father, bless our meetings;",
        "ja": "3．与えてくださ"
      },
      {
        "vi": "bình an xin xuống khắp dân Cha.",
        "ko": "평화, 연합 주소서.",
        "zh": "讓我們團結和睦。",
        "en": "Grant us peace and unity.",
        "ja": "い平和と一致"
      },
      {
        "vi": "Mong luôn hết lòng tôn Vua Tối Thượng",
        "ko": "언행으로 주의 주권",
        "zh": "但願我們言行一致，",
        "en": "May our words and may our actions",
        "ja": "あなたの主権を"
      },
      {
        "vi": "qua câu nói hay trong việc làm.",
        "ko": "드높이게 하소서.",
        "zh": "擁護你正義統治。",
        "en": "Magnify your Sov'reignty.",
        "ja": "たたえるために"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 22:22; 34:5; Ê-sai 50:4).",
      "ko": "(시 22:22; 34:3; 이사야 50:4 참조)",
      "zh": "（參看詩22：22；34：3；賽50：4）",
      "en": "(See also Ps. 22:22; 34:3; Isa. 50:4.)",
      "ja": "（詩22：22；34：3；イザ50：4も参照。）"
    }
  },
  {
    "number": 94,
    "sourceSheet": "94",
    "labels": {
      "vi": "BÀI HÁT 94",
      "ko": "94번",
      "zh": "詩歌第94首",
      "en": "SONG 94",
      "ja": "94番"
    },
    "title": {
      "vi": "Biết ơn Đức Chúa Trời vì đã ban Lời ngài",
      "ko": "하느님의 말씀에대해감사하라",
      "zh": "感謝上帝賜下聖經",
      "en": "Grateful for God's Word",
      "ja": "神の言葉に感謝する"
    },
    "scripture": {
      "vi": "(Phi-líp 2:16)",
      "ko": "(빌립보서 2:16)",
      "zh": "（腓立比書2：16）",
      "en": "(Philippians 2:16)",
      "ja": "（フィリピ2：16）"
    },
    "lines": [
      {
        "vi": "1. Lạy Giê-hô-va yêu thương, giờ đây tôi tớ ngài",
        "ko": "1. 하느님 아버지, 감사합니다,",
        "zh": "1．我們衷心感激耶和華上帝，",
        "en": "1. Jehovah, our Father, we want to express",
        "ja": "1．感謝します父エホバ"
      },
      {
        "vi": "đồng lòng tạ ơn Cha ban Kinh Thánh quý biết bao!",
        "ko": "당신의 말씀을 들려주시니!",
        "zh": "多麼高興能擁有你的話語。",
        "en": "How grateful we are that your Word we possess!",
        "ja": "あなたから"
      },
      {
        "vi": "Ngài soi dẫn ghi lại muôn điều",
        "ko": "성경의 진리 통해 자유를 주시고",
        "zh": "你啟示忠心僕人，",
        "en": "All Scripture is inspired;",
        "ja": "のこの言葉"
      },
      {
        "vi": "về chân lý khôn ngoan thay.",
        "ko": "진리의 빛 밝게 비추십니다.",
        "zh": "寫下寶貴聖經，",
        "en": "its truth has set us free.",
        "ja": "ページ開けば光放つ"
      },
      {
        "vi": "Lời Cha mang đến tự do, chúng con thêm mừng vui.",
        "ko": "2. 아버지 말씀은 큰 힘 있으니",
        "zh": "讓人認識真理，享自由安寧。",
        "en": "Its light gives us knowledge; the truth we can see.",
        "ja": "真理学び愛します"
      },
      {
        "vi": "2. Lời Chúa sắc nhọn hơn gươm, dò tâm tư mỗi người;",
        "ko": "내 생각과 의도를 드러내고,",
        "zh": "2．聖經蘊含力量，像寶劍一樣，",
        "en": "2. Your Word has the power to reach deep inside.",
        "ja": "2．心の奥深くまで"
      },
      {
        "vi": "quyền lực thật vô biên phân tách ý nghĩ thẳm sâu.",
        "ko": "그 법은 완전하며 그 지침 분명해",
        "zh": "能穿透人心，辨明意念、想法。",
        "en": "Our thoughts and intentions, it helps to divide.",
        "ja": "届いていくその言葉"
      },
      {
        "vi": "Luật Cha phán ra đều chân thật,",
        "ko": "옳은 길로 항상 인도합니다.",
        "zh": "上帝的律法完美，",
        "en": "Your laws are clear and perfect,",
        "ja": "真の自分に"
      },
      {
        "vi": "sự phần quyết luôn công minh,",
        "ko": "3. 소중한 그 말씀,",
        "zh": "法令真實正義，",
        "en": "your judgments ever true.",
        "ja": "気付かされて"
      },
      {
        "vi": "cùng bao nguyên tắc dạy cho chúng con theo đường ngay.",
        "ko": "감동을 주네.",
        "zh": "他的明智提醒指引人前行。",
        "en": "Your principles guide us in all that we do.",
        "ja": "正しい道求めます"
      },
      {
        "vi": "3. Tìm thấy trong Lời Cha ban nhiều gương tôi tớ ngài.",
        "ko": "우리처럼 느꼈던 주의 종들,",
        "zh": "3．耶和華的話語能打動人心，",
        "en": "3. Your Word, O Jehovah, has human appeal.",
        "ja": "3．思い出そう預言者を"
      },
      {
        "vi": "Họ đều là phàm nhân mang cảm xúc giống chúng con.",
        "ko": "그 삶의 기록들은",
        "zh": "先知的感人記載激發共鳴。",
        "en": "Your prophets were like us; they felt what we feel.",
        "ja": "その涙と信仰を"
      },
      {
        "vi": "Nguyện xin mãi theo đường Cha dạy,",
        "ko": "강한 믿음 주니",
        "zh": "求你使我們堅定，",
        "en": "Please help us build a strong faith",
        "ja": "心重ねて励みを得る"
      },
      {
        "vi": "dựng xây đức tin thêm lên.",
        "ko": "여호와 하느님,",
        "zh": "天天實踐真理，",
        "en": "that follows what is heard.",
        "ja": "強い信仰"
      },
      {
        "vi": "Tạ ơn Cha Giê-hô-va đã ban cho Lời Cha.",
        "ko": "감사합니다.",
        "zh": "感謝你耶和華，賜寶貴話語。",
        "en": "We thank you, Jehovah, for your precious Word!",
        "ja": "持つために"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 19:9; 119:16, 162; 2 Tỉ 5:16; Gia 5:17; 2 Phi 1:21).",
      "ko": "(시 19:9; 119:16, 162; 디모데 후서 3:16; 야고보 5:17; 베드로 후서 1:21 참조)",
      "zh": "（參看詩19：9；119：16，162；提後3：16；雅5：17；彼後1：21）",
      "en": "(See also Ps. 19:9; 119:16, 162; 2 Tim. 3:16; Jas. 5:17; 2 Pet. 1:21.)",
      "ja": "（詩19：9；119：16，162；テモ二3：16；ヤコ5：17；ペテ二1：21も参照。）"
    }
  },
  {
    "number": 95,
    "sourceSheet": "95",
    "labels": {
      "vi": "BÀI HÁT 95",
      "ko": "95번",
      "zh": "詩歌第95首",
      "en": "SONG 95",
      "ja": "95番"
    },
    "title": {
      "vi": "Anh sáng càng sáng thêm",
      "ko": "점점 밝아지는 빛",
      "zh": "真理之光日益明亮",
      "en": "The Light Gets Brighter",
      "ja": "光は明るさを増す"
    },
    "scripture": {
      "vi": "(Châm ngôn 4:18)",
      "ko": "(잠언 4:18)",
      "zh": "（箴言4：18）",
      "en": "(Proverbs 4:18)",
      "ja": "（格言4：18）"
    },
    "lines": [
      {
        "vi": "1. Nhiều người từ ngàn đời ao ước biết Vua Mê-si",
        "ko": "1. 예언자들도 알고 싶어 했네,",
        "zh": "1．古代的先知熱切盼望看見，",
        "en": "1. The prophets of old sought to learn of the Christ,",
        "ja": "1．はるか昔預言者"
      },
      {
        "vi": "mà Cha Giê-hô-va xưa đã hứa ban.",
        "ko": "모두의 희망 그리스도.",
        "zh": "受苦的人類獲得紓解，",
        "en": "The hope of all groaning creation.",
        "ja": "は救いを待ち望み"
      },
      {
        "vi": "Bởi Cha ban ơn nên mình hay biết Đấng Cứu Thế",
        "ko": "우릴 구원할 메시아 오심을",
        "zh": "上帝曾預告彌賽亞會出現，",
        "en": "God's spirit revealed that Messiah would come,",
        "ja": "聖なる力は示"
      },
      {
        "vi": "mai mốt cứu rỗi những người đang khóc than.",
        "ko": "하느님의 영 밝혀 줬네.",
        "zh": "拯救的日子已經不遠。",
        "en": "Providing the means of salvation.",
        "ja": "す解放の道筋"
      },
      {
        "vi": "Ta biết Vua hiện nay đang hiển vinh trên trời cao;",
        "ko": "지금 메시아 다스리는 때니,",
        "zh": "如今彌賽亞已在天上掌權，",
        "en": "The time has arrived, the Messiah now reigns,",
        "ja": "時が来てメシア治め"
      },
      {
        "vi": "bao dấu cho mình hay, ôi rõ thay!",
        "ko": "그 증거는 분명하네.",
        "zh": "作王證據清楚可見。",
        "en": "The proof of his presence is clear.",
        "ja": "そろうその証拠"
      },
      {
        "vi": "Phước ân thật to lớn được biết đến điều cao quý,",
        "ko": "천사들 역시 알고 싶어 한 일,",
        "zh": "我們多榮幸能夠明白預言，",
        "en": "How great is the favor of learning such things;",
        "ja": "この希望深い知"
      },
      {
        "vi": "mọi thiên sứ hằng ao ước được xem thấu.",
        "ko": "알게 된 그 은혜 참 크네!",
        "zh": "連天使也期待它應驗。",
        "en": "Into these even angels would peer!",
        "ja": "識天使たちも願う"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Cha soi đường ta sáng, mỗi ngày thêm rạng;",
        "ko": "우리의 길 점점 밝아져",
        "zh": "我們的道路日益明亮，",
        "en": "Our path now becomes ever brighter;",
        "ja": "真上に昇る日"
      },
      {
        "vi": "ta bước vui mừng trong ánh sáng ngoài.",
        "ko": "온전한 빛에 이르네. ",
        "zh": "像正午照耀的太陽。",
        "en": "We walk in the full light of day.",
        "ja": "が真の道照らす"
      },
      {
        "vi": "Ngài soi mình hiểu bao điều vô giá thay,",
        "ko": "걸음마다 인도하시는",
        "zh": "上帝發出真理的亮光，",
        "en": "Behold what our God is revealing;",
        "ja": "見失いはし"
      },
      {
        "vi": "dẫn lối cho mình đi theo muôn đời.",
        "ko": "주의 빛을 바라보라.",
        "zh": "不斷指引我們方向。",
        "en": "He guides us each step of the way.",
        "ja": "ない神導く道"
      },
      {
        "vi": "2. Giê-hô-va bổ nhiệm tôi tớ tín trung, khôn ngoan",
        "ko": "2. 예수, 충실한 종을 임명하여",
        "zh": "2．忠信的奴隸關愛基督門徒，",
        "en": "2. Our Lord has appointed a trustworthy slave,",
        "ja": "2．イエスは奴隷を通"
      },
      {
        "vi": "tận tâm chăn chiên Cha trên khắp thế gian.",
        "ko": "때에 따라 양식 주시네.",
        "zh": "在適當時候餵養、照顧。",
        "en": "Through whom He gives food in due season.",
        "ja": "し深い真理明かす"
      },
      {
        "vi": "Chúa ban khôn ngoan cho họ mang đến ánh sáng Chúa",
        "ko": "그 진리의 빛 점점 더 밝아져",
        "zh": "真理的光芒更加耀眼明亮，",
        "en": "The light of the truth has grown brighter with time,",
        "ja": "適切な時を選"
      },
      {
        "vi": "nên khắp đất biết rõ điều Cha sắp làm.",
        "ko": "마음, 정신에 호소하네.",
        "zh": "打動人的心，啟發思想。",
        "en": "Appealing to heart and to reason.",
        "ja": "び心に響かせる"
      },
      {
        "vi": "Ta bước trên đường đi thêm sáng hơn trong thời nay,",
        "ko": "우리의 길 더욱더 선명하여",
        "zh": "道路更明確，腳步更加堅定，",
        "en": "Our path ever clearer, our steps ever firm,",
        "ja": "時が来て輝き増し"
      },
      {
        "vi": "đem đến bao bình an, muôn phước ân.",
        "ko": "한낮같이 찬란하네.",
        "zh": "前方的路多麼清晰。",
        "en": "We walk in the brightness of day.",
        "ja": "強まる確信"
      },
      {
        "vi": "Chúng ta thật vui sướng tạ ơn Chúa, nguồn chân lý,",
        "ko": "진리 주시는 주께 감사하며",
        "zh": "感謝耶和華讓人了解真理，",
        "en": "All thanks to Jehovah, the Source of all truth,",
        "ja": "この期待深い感"
      },
      {
        "vi": "và kiên quyết hằng theo bước đường Cha mãi.",
        "ko": "힘차게 이 길로 걸으리.",
        "zh": "讓我們繼續和他同行。",
        "en": "We most gratefully walk in his way.",
        "ja": "謝神に抱き歩む"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Cha soi đường ta sáng, mỗi ngày thêm rạng;",
        "ko": "우리의 길 점점 밝아져",
        "zh": "我們的道路日益明亮，",
        "en": "Our path now becomes ever brighter;",
        "ja": "真上に昇る日"
      },
      {
        "vi": "ta bước vui mừng trong ánh sáng ngoài.",
        "ko": "온전한 빛에 이르네. ",
        "zh": "像正午照耀的太陽。",
        "en": "We walk in the full light of day.",
        "ja": "が真の道照らす"
      },
      {
        "vi": "Ngài soi mình hiểu bao điều vô giá thay,",
        "ko": "걸음마다 인도하시는",
        "zh": "上帝發出真理的亮光，",
        "en": "Behold what our God is revealing;",
        "ja": "見失いはし"
      },
      {
        "vi": "dẫn lối cho mình đi theo muôn đời.",
        "ko": "주의 빛을 바라보라.",
        "zh": "不斷指引我們方向。",
        "en": "He guides us each step of the way.",
        "ja": "ない神導く道"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Rô 8:22; 1 Cô 2:10; 1 Phi 1:12).",
      "ko": "(로마 8:22; 고린도 전서 2:10; 베드로 전서 1:12 참조)",
      "zh": "（參看羅8：22；林前2：10；彼前1：12）",
      "en": "(See also Rom. 8:22; 1 Cor. 2:10; 1 Pet. 1:12.)",
      "ja": "（ロマ8：22；コリ一2：10；ペテ一1：12も参照。）"
    }
  },
  {
    "number": 96,
    "sourceSheet": "96",
    "labels": {
      "vi": "BÀI HÁT 96",
      "ko": "96번",
      "zh": "詩歌第96首",
      "en": "SONG 96",
      "ja": "96番"
    },
    "title": {
      "vi": "Cuốn sách của Đức Chúa Trời—Kho tàng vô giá",
      "ko": "하느님의 책—보물",
      "zh": "上帝賜給人寶貴的話語",
      "en": "God's Own Book—A Treasure",
      "ja": "神からの貴重な本"
    },
    "scripture": {
      "vi": " (Châm ngôn 2:1)",
      "ko": "(잠언 2:1)",
      "zh": "（箴言2：1）",
      "en": "(Proverbs 2:1)",
      "ja": "（格言2：1）"
    },
    "lines": [
      {
        "vi": "1. Sách của Cha, ôi kho tàng vô giá cho nhân loại;",
        "ko": "1. 평화와 기쁨, 희망의 소식이",
        "zh": "1．古代一群人全心愛耶和華，",
        "en": "1. There is a book that by its many pages,",
        "ja": "1．世界でたった一つ"
      },
      {
        "vi": "sách chứa bao khôn ngoan sâu nhiệm và tri thức;",
        "ko": "한 장 한 장에 가득 담긴 책.",
        "zh": "受上帝啟示寫下他的話。",
        "en": "Brings peace and joy and hope to humankind.",
        "ja": "の神が与えた書物"
      },
      {
        "vi": "quyền lực mạnh mẽ, mọi tư tưởng Cha rất siêu phàm;",
        "ko": "놀라운 힘을 발휘하는 말씀,",
        "zh": "上帝力量推動他們的內心，",
        "en": "Its wondrous thoughts are charged with such great power;",
        "ja": "聖書だけが人々"
      },
      {
        "vi": "mang đến muôn dân an vui, tự do, ân phước.",
        "ko": "저 ‘죽은 자'에 생명을 주네.",
        "zh": "指引這些忠僕完成聖經。",
        "en": "It brings life to the “dead,” sight to the “blind.”",
        "ja": "に真の希望教える"
      },
      {
        "vi": "Cuốn sách xưa nay tên gọi Kinh Thánh, ta yêu chuộng.",
        "ko": "여호와 사랑하는 사람들이",
        "zh": "上帝的話語全是金玉良言，",
        "en": "That precious book is God's own Holy Bible.",
        "ja": "昔の信仰の人"
      },
      {
        "vi": "Chúa hướng dẫn cho tôi trung thời xưa đã viết.",
        "ko": "영감을 받아 기록하였네.",
        "zh": "帶給人生命、平安和喜悅。",
        "en": "Its words were penned by men whom God inspired,",
        "ja": "神の考えを聞き"
      },
      {
        "vi": "Họ luôn yêu mến Cha nên Cha ban phước ghi lại",
        "ko": "주께서 주신 소중한 이 성경,",
        "zh": "聖經的真理給人無窮力量，",
        "en": "By men who truly loved their God Jehovah,",
        "ja": "聖なる力働き"
      },
      {
        "vi": "ý Cha truyền ra, với thần khí luôn soi rọi.",
        "ko": "‘보물'과 같이 소중하다네.",
        "zh": "讓世人重得光明和希望。",
        "en": "And by his holy spirit they were fired.",
        "ja": "忠実に記録した"
      },
      {
        "vi": "2. Sách Thánh Kinh ghi công việc Cha lớn lao vô cùng,",
        "ko": "2. 하느님 만물 창조하신 일과",
        "zh": "2．聖經裡記載上帝施展大能，",
        "en": "2. They wrote a record true of God's creations,",
        "ja": "2．聖書は真理教え"
      },
      {
        "vi": "cách Giê-hô-va khi xưa tạo dựng nên đất;",
        "ko": "우주 탄생의 역사 밝히네.",
        "zh": "創天地萬物，造浩瀚宇宙。",
        "en": "How by his might this universe appeared.",
        "ja": "る人と世界の歴史"
      },
      {
        "vi": "người ban đầu đã được Cha tạo không khiếm khuyết chỉ;",
        "ko": "첫 인간 죄 없이 창조됐지만",
        "zh": "聖經透露人類本受造完美，",
        "en": "They also told how man at first was sinless",
        "ja": "生きるものの始ま"
      },
      {
        "vi": "cho biết nguyên nhân năm xưa vườn Ê-đen mất.",
        "ko": "그 낙원 잃은 이유 알리네.",
        "zh": "卻因反叛失去美好樂園。",
        "en": "But how his Paradise then disappeared.",
        "ja": "りと罪の 道の始まり"
      },
      {
        "vi": "Sách cũng cho hay khi một thiên sứ tham ngôi vị,",
        "ko": "한 천사 주께 반역하였으며",
        "zh": "有一個天使不守他的本分，",
        "en": "They further told about a certain angel",
        "ja": "世界は罪受け継い"
      },
      {
        "vi": "hắn đã vu oan Cha, mưu nghịch và chống đối,",
        "ko": "주의 주권에 도전하였네.",
        "zh": "藐視統治權，竟背叛上帝，",
        "en": "Who challenged God and spurned his sov'reignty.",
        "ja": "で救い求めて嘆く"
      },
      {
        "vi": "làm cho đau khổ, chết chóc bao vây khắp nhân loại.",
        "ko": "그 후로 죄와 슬픔 생겼지만",
        "zh": "挑唆人反叛，令人痛苦受罪。",
        "en": "That challenge led to sin and man's great sorrow,",
        "ja": "神の主権の正しさ"
      },
      {
        "vi": "Thế nhưng ngày Cha đến mang sướng vui, an bình.",
        "ko": "여호와는 곧 승리하시리.",
        "zh": "耶和華快要消滅這仇敵。",
        "en": "But soon will come Jehovah's victory.",
        "ja": "示すべき時が来た"
      },
      {
        "vi": "3. Nước Chúa nay đang cai trị, ta sướng vui vô cùng.",
        "ko": "3. 지금은 크게 기뻐할 때라네.",
        "zh": "3．今天的我們多麼快樂歡欣，",
        "en": "3. The time has come with reason for rejoicing:",
        "ja": "3．希望の光を放"
      },
      {
        "vi": "Chính Chúa Giê-su trên ngôi quyền lực vinh hiển.",
        "ko": "하느님 왕국 다스린다네.",
        "zh": "基督已統治，王國已建立。",
        "en": "Jehovah rules by his anointed King.",
        "ja": "つ慰めの本聖書"
      },
      {
        "vi": "Lòng đầy nhiệt huyết, mình đi truyền rao Nước trên trời",
        "ko": "이 소식 모두에게 전파하여",
        "zh": "我們宣揚上帝王國好消息，",
        "en": "So now we preach the good news of the Kingdom",
        "ja": "神は独り子を与え"
      },
      {
        "vi": "cho khắp muôn dân nghe hy vọng đầy tươi sáng.",
        "ko": "이 소중한 희망 알리리라.",
        "zh": "與人分享未來美好前景。",
        "en": "And share the hope of blessings it will bring.",
        "ja": "罪を全て取り去る"
      },
      {
        "vi": "Sách của Cha đem tin mừng an ủi cho nhân loại,",
        "ko": "기쁨의 소식 가득 담긴 성경,",
        "zh": "若天天研讀這本神聖典籍，",
        "en": "Within his book are found these cheerful tidings;",
        "ja": "世界に平和が戻り"
      },
      {
        "vi": "chứa thức ăn thiêng liêng dư dật Cha ban cấp.",
        "ko": "신성한 연회 베풀어 주네.",
        "zh": "就彷彿享用豐盛的宴席。",
        "en": "A sacred banquet feast on which to feed.",
        "ja": "命に終わりはない"
      },
      {
        "vi": "Lời Cha cao quý giúp tâm ta luôn có an bình.",
        "ko": "성경은 상상 못 할 평화 주니",
        "zh": "聖經篇章裡充滿快樂信息，",
        "en": "It offers peace beyond all human thinking;",
        "ja": "将来思い描いて"
      },
      {
        "vi": "Ấy kho tàng vô giá cho các dân xa gần.",
        "ko": "이 ‘보물' 모두 읽어야 하네.",
        "zh": "帶來無窮的幸福與安寧。",
        "en": "This Living Treasure beckons all to read.",
        "ja": "聖書読み広めよう"
      }
    ],
    "reference": {
      "vi": "(Cũng xem 2 Tỉ 5:16; 2 Phi 1:21).",
      "ko": "(디모데 후서 3:16; 베드로 후서 1:21 참조)",
      "zh": "（參看提後3：16；彼後1：21）",
      "en": "(See also 2 Tim. 3:16; 2 Pet. 1:21.)",
      "ja": "（テモ二3：16；ペテ二1：21も参照。）"
    }
  },
  {
    "number": 97,
    "sourceSheet": "97",
    "labels": {
      "vi": "BÀI HÁT 97",
      "ko": "97번",
      "zh": "詩歌第97首",
      "en": "SONG 97",
      "ja": "97番"
    },
    "title": {
      "vi": "Sự sống tùy thuộc vào Lời Đức Chúa Trời",
      "ko": "하느님의 말씀은 생명의 말씀",
      "zh": "人活著全憑上帝的話",
      "en": "Life Depends on God's Word",
      "ja": "神の言葉によって生きる"
    },
    "scripture": {
      "vi": "(Ma-thi-ơ 4:4)",
      "ko": "(마태복음 4:4)",
      "zh": "（馬太福音4：4）",
      "en": "(Matthew 4:4)",
      "ja": "（マタイ4：4）"
    },
    "lines": [
      {
        "vi": "1. Ta được sống do nghe tiếng Cha dạy,",
        "ko": "1. 여호와 주신",
        "zh": "1．我們要依靠耶和華",
        "en": "1. Life depends on Jehovah's Word,",
        "ja": "1．日々の喜び"
      },
      {
        "vi": "siêng tra xem Lời Cha ban.",
        "ko": "말씀은 생명을 준다네.",
        "zh": "口裡的每句話，",
        "en": "All the things he has said.",
        "ja": "と描く希望"
      },
      {
        "vi": "Không nhờ bánh thôi nuôi dưỡng thân mình",
        "ko": "빵으로만 살지",
        "zh": "活著不能單憑食物，",
        "en": "We must live not on bread alone;",
        "ja": "つづられた"
      },
      {
        "vi": "mà nhờ vâng theo Thánh Kinh.",
        "ko": "않고 말씀으로 살면,",
        "zh": "全憑上帝的話。",
        "en": "Live by his Word instead.",
        "ja": "全て神の恵み"
      },
      {
        "vi": "Trong đời chúng ta vui sướng, thỏa nguyện,",
        "ko": "지금부터 영원토록",
        "zh": "這樣平安就會長久，",
        "en": "Even now we have peace and joy,",
        "ja": "従順でいた"
      },
      {
        "vi": "tương lai bao nhiêu ân phước.",
        "ko": "축복 넘치리라.",
        "zh": "未來福樂無窮。",
        "en": "Future blessings assured.",
        "ja": "い生きる限り"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Chúng ta không chỉ cần bánh trong đời",
        "ko": "하루하루를",
        "zh": "我們必須信賴上帝，",
        "en": "Man must live not on bread alone;",
        "ja": "命を支え"
      },
      {
        "vi": "nên Cha ban ta Kinh Thánh.",
        "ko": "살면서 꼭 필요한 말씀.",
        "zh": "喜愛他的話語。",
        "en": "Life depends on God's Word.",
        "ja": "る神の言葉"
      },
      {
        "vi": "Sách Cha ghi bao điều chúng ta cần,",
        "ko": "생명을 주는 그 말씀,",
        "zh": "按照聖經真理而行，",
        "en": "There we find what we daily need;",
        "ja": "日々の力得"
      },
      {
        "vi": "cho ta sự sống an bình.",
        "ko": "매일 따르리라.",
        "zh": "必定得享生命。",
        "en": "Life depends on God's Word.",
        "ja": "る味わうたび"
      },
      {
        "vi": "2. Trong lời Thánh Kinh cho biết thêm nhiều",
        "ko": "2. 주의 말씀에",
        "zh": "2．聖經訴說古代事跡，",
        "en": "2. True accounts in God's written Word",
        "ja": "2．過去の勇気"
      },
      {
        "vi": "gương xưa kia để noi theo.",
        "ko": "기록된 충실한 증인들,",
        "zh": "記載真實可信。",
        "en": "Tell about those of old.",
        "ja": "ある真の模範"
      },
      {
        "vi": "Nam và nữ, bao tôi tớ trung thành",
        "ko": "충성스럽게",
        "zh": "上帝忠僕表現信心，",
        "en": "Men and women who walked in faith—",
        "ja": "紡がれた記"
      },
      {
        "vi": "mạnh dạn đi trong đức tin.",
        "ko": "섬기며 담대함 보였네.",
        "zh": "行事勇敢堅毅。",
        "en": "They were loyal and bold.",
        "ja": "録神の恵み"
      },
      {
        "vi": "Ta được vững tâm, thêm sức chịu đựng",
        "ko": "그 삶의 기록 읽으며",
        "zh": "我們深思這些經歷，",
        "en": "We're encouraged each time we read",
        "ja": "読んで学びた"
      },
      {
        "vi": "qua gương trung kiên thuở trước.",
        "ko": "인내할 힘 얻네.",
        "zh": "內心受到激勵。",
        "en": "All they did and endured.",
        "ja": "い耐え抜くため"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Chúng ta không chỉ cần bánh trong đời",
        "ko": "하루하루를",
        "zh": "我們必須信賴上帝，",
        "en": "Man must live not on bread alone;",
        "ja": "命を支え"
      },
      {
        "vi": "nên Cha ban ta Kinh Thánh.",
        "ko": "살면서 꼭 필요한 말씀.",
        "zh": "喜愛他的話語。",
        "en": "Life depends on God's Word.",
        "ja": "る神の言葉"
      },
      {
        "vi": "Sách Cha ghi bao điều chúng ta cần,",
        "ko": "생명을 주는 그 말씀,",
        "zh": "按照聖經真理而行，",
        "en": "There we find what we daily need;",
        "ja": "日々の力得"
      },
      {
        "vi": "cho ta sự sống an bình.",
        "ko": "매일 따르리라.",
        "zh": "必定得享生命。",
        "en": "Life depends on God's Word.",
        "ja": "る味わうたび"
      },
      {
        "vi": "3. Khi mình ngẫm suy Kinh Thánh đêm ngày,",
        "ko": "3. 매일 주 말씀 읽으며",
        "zh": "3．天天閱讀上帝話語，",
        "en": "3. Day by day as we read God's Word,",
        "ja": "3．くじけそうな"
      },
      {
        "vi": "Cha ban hy vọng, ủi an.",
        "ko": "희망, 위로 얻네.",
        "zh": "尋得希望、安慰。",
        "en": "He gives comfort and hope.",
        "ja": "時寄り"
      },
      {
        "vi": "Cho dù khó khăn xảy đến trong đời,",
        "ko": "모든 시련에",
        "zh": "聖經予人真正智慧，",
        "en": "When the trials of life arise,",
        "ja": "添う知恵"
      },
      {
        "vi": "mình vượt qua không hãi chỉ.",
        "ko": "대처할 지혜",
        "zh": "應付困境考驗。",
        "en": "He gives wisdom to cope.",
        "ja": "つづられた"
      },
      {
        "vi": "Ta nguyện quý yêu",
        "ko": "얻게 되네.",
        "zh": "願我們能用心體會，",
        "en": "May we treasure within our heart",
        "ja": "全て宝のよう"
      },
      {
        "vi": "Kinh Thánh vô cùng,",
        "ko": "묵상하여 배운",
        "zh": "珍藏所學一切。",
        "en": "All we've read and we've heard.",
        "ja": "小声で読みた"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Chúng ta không chỉ cần bánh trong đời",
        "ko": "하루하루를",
        "zh": "我們必須信賴上帝，",
        "en": "Man must live not on bread alone;",
        "ja": "命を支え"
      },
      {
        "vi": "nên Cha ban ta Kinh Thánh.",
        "ko": "살면서 꼭 필요한 말씀.",
        "zh": "喜愛他的話語。",
        "en": "Life depends on God's Word.",
        "ja": "る神の言葉"
      },
      {
        "vi": "Sách Cha ghi bao điều chúng ta cần,",
        "ko": "생명을 주는 그 말씀,",
        "zh": "按照聖經真理而行，",
        "en": "There we find what we daily need;",
        "ja": "日々の力得"
      },
      {
        "vi": "cho ta sự sống an bình.",
        "ko": "매일 따르리라.",
        "zh": "必定得享生命。",
        "en": "Life depends on God's Word.",
        "ja": "る味わうたび"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Giô-suê 1:8; Rô 15:4).",
      "ko": "(여호수아 1:8; 로마 15:4 참조)",
      "zh": "（參看書1：8；羅15：4）",
      "en": "(See also Josh. 1:8; Rom. 15:4.)",
      "ja": "（ヨシュ1：8；ロマ15：4も参照。）"
    }
  },
  {
    "number": 98,
    "sourceSheet": "98",
    "labels": {
      "vi": "BÀI HÁT 98",
      "ko": "98번",
      "zh": "詩歌第98首",
      "en": "SONG 98",
      "ja": "98番"
    },
    "title": {
      "vi": "Kinh Thánh—Bởi Đức Chúa Trời soi dẫn",
      "ko": "성경—하느님의 영감을 받은 책",
      "zh": "聖經是上帝啟示的話語",
      "en": "The Scriptures—Inspired of God",
      "ja": "聖書は神の言葉"
    },
    "scripture": {
      "vi": "(2 Ti-mô-thê 5:16, 17)",
      "ko": "(디모데 후서 3:16, 17)",
      "zh": "（提摩太後書3：16，17）",
      "en": "(2 Timothy 3:16, 17)",
      "ja": "（テモテ第二3：16，17）"
    },
    "lines": [
      {
        "vi": "1. Chốn nhân gian đầy tăm tối mịt mù,",
        "ko": "1. 어두운 밤길 비추는",
        "zh": "1．上帝的話語是明燈，",
        "en": "1. God's Word shines like a brilliant light,",
        "ja": "1．光のような"
      },
      {
        "vi": "Lời ngài soi chân ta bước đi.",
        "ko": "등불 같은 주 말씀,",
        "zh": "指引人走出黑暗。",
        "en": "Guides our feet through earth's dark night.",
        "ja": "聖書の言葉"
      },
      {
        "vi": "Ấy thật là một ngọn đuốc tự do.",
        "ko": "충실히 그 빛 따르면",
        "zh": "聽教誨並忠心遵守，",
        "en": "If we follow it faithfully,",
        "ja": "歩みを照ら"
      },
      {
        "vi": "Bao lời Cha cho ta thoát vòng nô.",
        "ko": "진리로 자유 얻으리.",
        "zh": "真理會讓人得自由。",
        "en": "Surely its truth will set us free.",
        "ja": "し自由へ導く"
      },
      {
        "vi": "2. Sách Cha ban là quà quý từ ngài,",
        "ko": "2. 옳은 길 알게 해 주는",
        "zh": "2．聖經受耶和華啟示，",
        "en": "2. He provides us with words inspired,",
        "ja": "2．心に響く"
      },
      {
        "vi": "hầu dạy ta vâng theo tiếng Cha,",
        "ko": "영감받은 주 말씀,",
        "zh": "讓人明白他旨意。",
        "en": "Helps us learn what is required.",
        "ja": "聖書の言葉"
      },
      {
        "vi": "giúp rèn luyện và khiển trách, sửa sai,",
        "ko": "마음을 감동시켜서",
        "zh": "教導人明辨是與非，",
        "en": "Holy writings can motivate,",
        "ja": "正しく生き"
      },
      {
        "vi": "nên mình hân hoan, sốt sắng thờ Cha.",
        "ko": "올바른 길 걷게 하네.",
        "zh": "接受勸告，一生獲益。",
        "en": "Show how to teach and set things straight.",
        "ja": "る力を与える"
      },
      {
        "vi": "3. Thánh Kinh cho mình được biết về ngài",
        "ko": "3. 위에서 오는 주 말씀,",
        "zh": "3．聖經從耶和華而來，",
        "en": "3. By these words from our God above,",
        "ja": "3．エホバの愛が"
      },
      {
        "vi": "thật từ nhân, yêu thương biết bao.",
        "ko": "주 사랑 알게 하네.",
        "zh": "助人認識他的愛。",
        "en": "We have come to know his love.",
        "ja": "あふれる手紙"
      },
      {
        "vi": "Nếu hằng ngày tập nghiền ngẫm Lời Cha,",
        "ko": "매일 읽고 또 읽으면",
        "zh": "多研讀，能行事明智，",
        "en": "As we read in it ev'ry day,",
        "ja": "聖書を読もうい"
      },
      {
        "vi": "ta được khôn ngoan, theo sát đường ngay.",
        "ko": "이 길에 머물게 되리.",
        "zh": "行走正路永不偏離。",
        "en": "God's Word will keep us on the way.",
        "ja": "つもいつの日も"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 119:105; Châm 4:15).",
      "ko": "(시 119:105; 잠언 4:13 참조)",
      "zh": "（參看詩119：105；箴4：13）",
      "en": "(See also Ps. 119:105; Prov. 4:13.)",
      "ja": "（詩119：105；格4：13も参照。）"
    }
  },
  {
    "number": 99,
    "sourceSheet": "99",
    "labels": {
      "vi": "BÀI HÁT 99",
      "ko": "99번",
      "zh": "詩歌第99首",
      "en": "SONG 99",
      "ja": "99番"
    },
    "title": {
      "vi": "Hằng hà sa số anh em",
      "ko": "수천수만의 형제",
      "zh": "千千萬萬弟兄姐妹",
      "en": "Myriads of Brothers",
      "ja": "数え尽くせない仲間たち"
    },
    "scripture": {
      "vi": "(Khải huyền 7:9, 10)",
      "ko": "(요한 계시록 7:9, 10)",
      "zh": "（啟示錄7：9，10）",
      "en": "(Revelation 7:9, 10)",
      "ja": "（啓示7：9，10）"
    },
    "lines": [
      {
        "vi": "1. Hằng hà anh em khắp bốn phương trời",
        "ko": "1. 수천-수만의 형제,",
        "zh": "1．千千萬萬弟兄姐妹",
        "en": "1. Myriads on myriads of brothers,",
        "ja": "1．数え尽くせ"
      },
      {
        "vi": "đang vai sánh vai bên nhau.",
        "ko": "거대한 무리네.",
        "zh": "信心堅定不移，",
        "en": "Millions for all to see,",
        "ja": "ない真の仲間"
      },
      {
        "vi": "Mình đều là Nhân Chứng trung thành,",
        "ko": "모두 다 충실하고",
        "zh": "全是忠心見證人，",
        "en": "Each one a faithful witness,",
        "ja": "神を愛す"
      },
      {
        "vi": "giữ lòng trung kiên vững mạnh.",
        "ko": "충절을 지키네.",
        "zh": "天天保持忠義。",
        "en": "Firm in integrity.",
        "ja": "る一人一人"
      },
      {
        "vi": "Ngày càng gia tăng đám đông người,",
        "ko": "우리는 수천수만,",
        "zh": "弟兄姐妹遍各地，",
        "en": "Myriads we are on myriads,",
        "ja": "国や人種や"
      },
      {
        "vi": "thật là một dân anh dũng",
        "ko": "점점 강해지니",
        "zh": "人數不斷增加，",
        "en": "Growing, a mighty crowd,",
        "ja": "言葉を越え"
      },
      {
        "vi": "đến từ muôn phương, khắp nơi trên địa cầu,",
        "ko": "나라와 언어는",
        "zh": "我們來自萬國與萬族，",
        "en": "From ev'ry nation and tribe and tongue,",
        "ja": "大きな群れと"
      },
      {
        "vi": "khen ngợi danh Giê-hô-va.",
        "ko": "달라도 함께 찬양하네.",
        "zh": "歌頌上帝聖名。",
        "en": "We praise our God aloud.",
        "ja": "なる証人たち"
      },
      {
        "vi": "2. Hằng hà anh em khắp bốn phương trời",
        "ko": "2. 수천-수만의 형제,",
        "zh": "2．千千萬萬弟兄姐妹",
        "en": "2. Myriads on myriads of brothers,",
        "ja": "2．数え尽くせ"
      },
      {
        "vi": "vui đi khắp nơi rao tin",
        "ko": "온 땅에 전하네,",
        "zh": "宣揚聖經真理，",
        "en": "We preach both far and near",
        "ja": "ない真の仲間"
      },
      {
        "vi": "về một tương lai sáng huy hoàng",
        "ko": "많은 사람 원하는 그",
        "zh": "許多人期盼聆聽",
        "en": "“Good news of something better,”",
        "ja": "真理を告げ"
      },
      {
        "vi": "cho mọi dân trên đất này.",
        "ko": "“좋은 소식”을.",
        "zh": "王國美好信息。",
        "en": "Which millions long to hear.",
        "ja": "る遠く近く"
      },
      {
        "vi": "Nhiệt thành đi rao giảng không ngừng",
        "ko": "때로는 힘들어도",
        "zh": "儘管會面對壓力，",
        "en": "And as we keep on preaching,",
        "ja": "一歩一歩が"
      },
      {
        "vi": "dù gặp chông gai, gian khó,",
        "ko": "계속 전파하네.",
        "zh": "仍然不畏艱辛，",
        "en": "Though we at times are stressed,",
        "ja": "重いときも"
      },
      {
        "vi": "bởi lòng tin chắc Chúa Giê-su trợ lực,",
        "ko": "그리스도 새 힘",
        "zh": "疲憊的心受耶穌安慰，",
        "en": "Jesus refreshes the weary souls;",
        "ja": "イエスから得ら"
      },
      {
        "vi": "ban bình an cho chúng ta.",
        "ko": "주시니 지치지 않으리.",
        "zh": "必享平靜安寧。",
        "en": "He gives us peace and rest.",
        "ja": "れる爽やかさを"
      },
      {
        "vi": "3. Hằng hà anh em khắp bốn phương trời,",
        "ko": "3. 수천-수만의",
        "zh": "3．千千萬萬弟兄姐妹",
        "en": "3. Myriads on myriads of brothers,",
        "ja": "3．数え尽くせ"
      },
      {
        "vi": "Cha luôn dõi theo, chăm nom.",
        "ko": "형제, 주 보호하시니",
        "zh": "得到天父照顧，",
        "en": "God keeps us in his sight,",
        "ja": "ない真の仲間"
      },
      {
        "vi": "Mình thờ tôn Cha suốt đêm ngày,",
        "ko": "주의 성전 뜰에서",
        "zh": "在全球團結一致，",
        "en": "Safe in his earthly courtyards,",
        "ja": "神と働く"
      },
      {
        "vi": "an toàn trong dân của ngài.",
        "ko": "평온히 섬기네.",
        "zh": "晝夜為他服務。",
        "en": "Serving him day and night.",
        "ja": "昼も夜も"
      },
      {
        "vi": "Hằng hà anh em quyết chung lòng",
        "ko": "우리는 수천수만,",
        "zh": "無數的弟兄姐妹",
        "en": "Myriads we are on myriads,",
        "ja": "種をまきつ"
      },
      {
        "vi": "truyền giảng Lời Cha khắp đất.",
        "ko": "왕국을 전하니",
        "zh": "傳揚王國信息，",
        "en": "With Kingdom news we go,",
        "ja": "つ水を注ぐ"
      },
      {
        "vi": "Với đặc ân lớn chính Cha xem là bạn,",
        "ko": "하느님과 함께",
        "zh": "多榮幸為耶和華付出，",
        "en": "God's fellow workers we have become,",
        "ja": "それぞれの持ち"
      },
      {
        "vi": "ta ngợi khen Cha chẳng thôi.",
        "ko": "일하며 그분을 섬기네.",
        "zh": "崇拜仁愛天父。",
        "en": "Serving him here below.",
        "ja": "場で仲間たちと"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Ê-sai 52:7; Mat 11:29; Khải 7:15).",
      "ko": "(이사야 52:7; 마태 11:29; 계시록 7:15 참조)",
      "zh": "（參看賽52：7；太11：29；啟7：15）",
      "en": "(See also Isa. 52:7; Matt. 11:29; Rev. 7:15.)",
      "ja": "（イザ52：7；マタ11：29；啓7：15も参照。）"
    }
  },
  {
    "number": 100,
    "sourceSheet": "100",
    "labels": {
      "vi": "BÀI HÁT 100",
      "ko": "100번",
      "zh": "詩歌第100首",
      "en": "SONG 100",
      "ja": "100番"
    },
    "title": {
      "vi": "Hãy bày tỏ lòng hiếu khách",
      "ko": "그들을 맞아들여 후대하라",
      "zh": "表現好客精神",
      "en": "ReceiveThem With Hospitality",
      "ja": "人をもてなす"
    },
    "scripture": {
      "vi": "(Công vụ 17:7)",
      "ko": "(사도행전 17:7)",
      "zh": "（使徒行傳17：7）",
      "en": "(Acts 17:7)",
      "ja": "（使徒17：7）"
    },
    "lines": [
      {
        "vi": "1. Cha luôn làm gương tốt về lòng quan tâm, hiếu khách.",
        "ko": "1. 여호와 따뜻이 후대하시고",
        "zh": "1．上帝對人慷慨又樂意施與，",
        "en": "1. Jehovah shows sincere hospitality.",
        "ja": "1．公平な神エホバは"
      },
      {
        "vi": "Cha nhân từ ban phước lành dồi dào không kể xiết;",
        "ko": "차별 없이 모두 보살피시네.",
        "zh": "他關懷所有人，待人不偏心。",
        "en": "He cares for all without partiality.",
        "ja": "恵みの雨も光も"
      },
      {
        "vi": "ban nắng và mưa mỗi ngày,",
        "ko": "누구나 해와",
        "zh": "他賜日光甘露滋潤地上萬物，",
        "en": "He gives both rain and sun,",
        "ja": "心満たす糧も与え"
      },
      {
        "vi": "khắp nơi bội thu sản vật,",
        "ko": "비, 음식과 즐거움",
        "zh": "使人生活歡欣又滿足。",
        "en": "withholding these from none;",
        "ja": "もてなしてくださる"
      },
      {
        "vi": "hết thảy mọi dân đón nhận thật vui sướng.",
        "ko": "마음껏 누리게 하시네.",
        "zh": "我們樂意效法天父的榜樣，",
        "en": "He fills our hearts with food and good cheer.",
        "ja": "エホバのように与えて"
      },
      {
        "vi": "Khi †a làm theo gương ngài là quan tâm, hiếu khách,",
        "ko": "우리도 낮은 자 보살펴 주어",
        "zh": "對待寒微的人無私又大方。",
        "en": "Whenever we show favor to lowly ones,",
        "ja": "人をもてなすあなたの"
      },
      {
        "vi": "†a sẽ rộng tay giúp đỡ người gian nan, khốn khó.",
        "ko": "하느님을 닮은 자녀 되리라.",
        "zh": "衷心善待別人，",
        "en": "We imitate our God as beloved sons.",
        "ja": "その親切その善良"
      },
      {
        "vi": "Chúa thấy việc ta đã làm,",
        "ko": "우리의 아버지 갚아 주시리니",
        "zh": "表現好客精神，",
        "en": "Our Father will repay",
        "ja": "必ず報われる"
      },
      {
        "vi": "khắc ghi vào trong trí ngài,",
        "ko": "진심 어린 친절 보이리.",
        "zh": "上帝必獎賞賜予福分。",
        "en": "the goodness we display,",
        "ja": "2．それが見知らぬ人でも"
      },
      {
        "vi": "báo đáp lại ơn tốt lành, không hề quên.",
        "ko": "2. 어려움 겪는 이 도와준다면",
        "zh": "2．別人生活困苦或需要幫助，",
        "en": "Our kindness that is truly sincere.",
        "ja": "深い気遣い示せば"
      },
      {
        "vi": "2. Ai đang cần ta hỗ trợ, ta chung tay góp sức;",
        "ko": "가슴 벅찬 보람 느끼게 되네.",
        "zh": "我們不怕辛苦，願甘心付出。",
        "en": "2. We never know the good that may come about",
        "ja": "いつの日に"
      },
      {
        "vi": "không mong chờ ai đáp đền mà thành tâm trợ giúp.",
        "ko": "모르는 이라도",
        "zh": "努力開闊心胸，",
        "en": "When we see those in need and we help them out.",
        "ja": "か良い実結び"
      },
      {
        "vi": "Cho dẫu người quen, khách lạ",
        "ko": "후대를 베풀어",
        "zh": "主動伸出援手，",
        "en": "Though strangers they may be,",
        "ja": "喜びを刈り取る"
      },
      {
        "vi": "cũng không ngại chỉ khó nhọc.",
        "ko": "도움의 손길을 건네리.",
        "zh": "多行善帶來美好結果。",
        "en": "in hospitality,",
        "ja": "ルデアのよ"
      },
      {
        "vi": "Kết quả đầy bông trái lành, lòng vui sướng.",
        "ko": "루디아 본받아 집에 맞이해",
        "zh": "願效法呂底亞款待陌生人，",
        "en": "We lend a hand to care for their needs.",
        "ja": "うに与えて"
      },
      {
        "vi": "Như môn đồ Ly-đi từng nhiệt tâm, năng tiếp khách,",
        "ko": "편안히 쉬면서",
        "zh": "邀請別人作客，",
        "en": "Like Lydia of old, we say: ‘Be my guest.'",
        "ja": "人をもてな"
      },
      {
        "vi": "ta đón chào khi khách đến, tạo an vui, thoải mái.",
        "ko": "힘 얻게 하리.",
        "zh": "來一同歡樂。",
        "en": "When they come to our home, they find peace and rest.",
        "ja": "すあなたの"
      },
      {
        "vi": "Tiếp khách mọi khi có dịp,",
        "ko": "우리의 아버지",
        "zh": "我們仁慈待人，",
        "en": "Our Father is aware",
        "ja": "その憐れみ"
      },
      {
        "vi": "tính nhân từ luôn thể hiện,",
        "ko": "알아주시리니",
        "zh": "天父必然嘉許，",
        "en": "of all those ev'rywhere,",
        "ja": "その優しさ"
      },
      {
        "vi": "Chúa sẽ đồ bao phước lành dư tràn thay.",
        "ko": "그 자비로운 본 따르리.",
        "zh": "衷心效法他慷慨施與。",
        "en": "Who imitate his merciful deeds.",
        "ja": "エホバの目に留まる"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Công 16:14, 15; Rô 12:15; 1 Tỉ 5:2; Hê 15:2; 1 Phi 4:9).",
      "ko": "(사도 16:14, 15; 로마 12:13; 디모데 전서 3:2; 히브리 13:2; 베드로 전서 4:9 참조)",
      "zh": "（參看徒16：14，15；羅12：13；提前3：2；來13：2；彼前4：9）",
      "en": "(See also Acts 16:14, 15; Rom. 12:13; 1 Tim. 3:2; Heb. 13:2; 1 Pet. 4:9.)",
      "ja": "（使徒 16:14，15; ロマ 12:13; テモ一 3:2; ヘブ 13:2; ペテ一 4:9も参照。）"
    }
  },
  {
    "number": 101,
    "sourceSheet": "101",
    "labels": {
      "vi": "BÀI HÁT 101",
      "ko": "101번",
      "zh": "詩歌第101首",
      "en": "SONG 101",
      "ja": "101番"
    },
    "title": {
      "vi": "Cùng hợp nhất phụng sự",
      "ko": "연합하여 함께 일하리",
      "zh": "團結和睦，並肩工作",
      "en": "Working Together in Unity",
      "ja": "一致して共に働く"
    },
    "scripture": {
      "vi": "(Ê-phê-sô 4:35)",
      "ko": "(에베소서 4:3)",
      "zh": "（以弗所書4：3）",
      "en": "(Ephesians 4:3)",
      "ja": "（エフェソス4：3）"
    },
    "lines": [
      {
        "vi": "1. Dù người †a chia rẽ hay thù oán,",
        "ko": "1. 평화 없는 세상에서",
        "zh": "1．上帝從冷漠的世界",
        "en": "1. From a world divided and cold,",
        "ja": "1．囲いに集ま"
      },
      {
        "vi": "mình được Cha đưa đến nơi hội thánh,",
        "ko": "주는 우릴 모으시니,",
        "zh": "吸引我們到他身邊。",
        "en": "God has brought us into his fold.",
        "ja": "る羊は楽しむ"
      },
      {
        "vi": "được bình an, liên kết trong hợp nhất,",
        "ko": "우린 연합 즐기면서",
        "zh": "弟兄姐妹合作無間，",
        "en": "Unity and peace we possess,",
        "ja": "一致と平和"
      },
      {
        "vi": "vui sướng, thỏa nguyện sâu xa.",
        "ko": "기쁨에 넘치네.",
        "zh": "令人歡欣雀躍。",
        "en": "Bringing us happiness.",
        "ja": "の満ちる牧場"
      },
      {
        "vi": "Quý sao hợp nhất an bình,",
        "ko": "조화로운 연합,",
        "zh": "大家友愛團結，",
        "en": "Unity we cherish;",
        "ja": "保とう一"
      },
      {
        "vi": "sống chan hòa với nhau.",
        "ko": "아름답다네.",
        "zh": "氣氛多和諧。",
        "en": "Harmony is sweet.",
        "ja": "致この絆"
      },
      {
        "vi": "Việc ngài giao, chung sức ta hoàn tất.",
        "ko": "할 일 많이 맡기시고",
        "zh": "上帝通過愛子基督",
        "en": "In God's work there's much to be done.",
        "ja": "神への奉仕を"
      },
      {
        "vi": "Ngài dùng Giê-su dẫn ta đường đúng,",
        "ko": "아들 통해 이끄시니",
        "zh": "指揮我們完成任務。",
        "en": "He directs us now through his Son.",
        "ja": "仲良く果たそう"
      },
      {
        "vi": "mình nguyện vâng theo chẳng đi chệch lối,",
        "ko": "순종하여 일하면서",
        "zh": "願我們都聽從吩咐，",
        "en": "May we serve obediently,",
        "ja": "エホバの導"
      },
      {
        "vi": "kề vai sát cánh cùng nhau.",
        "ko": "한마음 되리라.",
        "zh": "並肩為他服務。",
        "en": "Working in harmony.",
        "ja": "き願いながら"
      },
      {
        "vi": "2. Cầu nguyện Cha cho chúng ta một ý,",
        "ko": "2. 하나 되길 기도하며",
        "zh": "2．求上帝讓我們同心，",
        "en": "2. As we pray to be of one mind,",
        "ja": "2．一致を求め"
      },
      {
        "vi": "lòng từ nhân, thương xót luôn gìn giữ,",
        "ko": "항상 친절 보인다면",
        "zh": "洋溢溫情，相愛相親，",
        "en": "Always tender, loving, and kind,",
        "ja": "て親切示せば"
      },
      {
        "vi": "làm tình yêu thêm mãi, khen ngợi Chúa,",
        "ko": "사랑, 찬양 가득하니",
        "zh": "齊心協力讚美上帝，",
        "en": "Love will grow and praise will increase,",
        "ja": "喜びあふれ"
      },
      {
        "vi": "ân phước dư tràn không thôi.",
        "ko": "평화를 누리리.",
        "zh": "必得喜樂歡欣。",
        "en": "Giving us joy and peace.",
        "ja": "て愛が育つ"
      },
      {
        "vi": "Có an bình mắt tươi lòng,",
        "ko": "기쁨 주는 평화,",
        "zh": "和平令人嚮往，",
        "en": "Peace is so refreshing,",
        "ja": "楽しい一"
      },
      {
        "vi": "khiến tâm hồn sướng vui.",
        "ko": "새 힘 준다네.",
        "zh": "讓身心舒暢。",
        "en": "Bringing such delight.",
        "ja": "致この平和"
      },
      {
        "vi": "Thật lòng yêu thương thiết tha trìu mến",
        "ko": "서로 진정 사랑하면",
        "zh": "表現真摯弟兄之情，",
        "en": "As we show true brotherly love,",
        "ja": "仲間の幸せ"
      },
      {
        "vi": "thì ngài ban ân phước, an bình xuống.",
        "ko": "주의 평화 누리리라.",
        "zh": "上帝必賜我們安寧。",
        "en": "God will grant us peace from above.",
        "ja": "強く願うなら"
      },
      {
        "vi": "Nhờ ngài, anh em kết dây hợp nhất",
        "ko": "주 힘입어 연합하여",
        "zh": "依靠天父團結一心，",
        "en": "With his help, united we'll be,",
        "ja": "エホバは与"
      },
      {
        "vi": "thờ tôn Cha suốt đời ta.",
        "ko": "영원히 섬기리.",
        "zh": "永遠為他效力。",
        "en": "Serving him endlessly.",
        "ja": "える真の一致"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Mi 2:12; Xô 5:9; 1 Cô 1:10).",
      "ko": "(미가 2:12; 스바냐 3:9; 고린도 전서 1:10 참조)",
      "zh": "（參看彌2：12；番3：9；林前1：10）",
      "en": "(See also Mic. 2:12; Zeph. 3:9; 1 Cor. 1:10.)",
      "ja": "（ミカ2：12；ゼパ3：9；コリ一1：10も参照。）"
    }
  },
  {
    "number": 102,
    "sourceSheet": "102",
    "labels": {
      "vi": "BÀI HÁT 102",
      "ko": "102번",
      "zh": "詩歌第102首",
      "en": "SONG 102",
      "ja": "102番"
    },
    "title": {
      "vi": "“Giúp đỡ những người vếu đuối”",
      "ko": "“약한 사람들을도와주라”",
      "zh": "幫助軟弱的人",
      "en": "“Assist Those Who Are Weak”",
      "ja": "「弱い人たちを援助」する"
    },
    "scripture": {
      "vi": "(Công vụ 20:55)",
      "ko": "(사도행전 20:35)",
      "zh": "（使徒行傳20：35）",
      "en": "(Acts 20:35)",
      "ja": "（使徒20：35）"
    },
    "lines": [
      {
        "vi": "1. Vì con người vốn không hoàn toàn,",
        "ko": "1. 우리 모두",
        "zh": "1．每個人都曾有",
        "en": "1. Many are the weaknesses",
        "ja": "1．誰もが時"
      },
      {
        "vi": "chúng ta đều yếu đuối.",
        "ko": "약하고 부족하지만",
        "zh": "過軟弱的時候，",
        "en": "That we all possess.",
        "ja": "に弱くなる"
      },
      {
        "vi": "Giê-hô-va vẫn luôn trợ lực,",
        "ko": "여호와는",
        "zh": "但耶和華關心我，",
        "en": "Still Jehovah cares for us,",
        "ja": "それでも神"
      },
      {
        "vi": "mến yêu mình nhiều thay.",
        "ko": "우리를 돌봐 주시네.",
        "zh": "他深愛著我。",
        "en": "Loves us nonetheless.",
        "ja": "は見捨てない"
      },
      {
        "vi": "Ngài đầy thương xót, khoan dung;",
        "ko": "그 자비 넘치며",
        "zh": "上帝仁慈和藹，",
        "en": "He is so merciful;",
        "ja": "どんな時"
      },
      {
        "vi": "tình yêu Cha lớn vô biên.",
        "ko": "그 사랑 강하네.",
        "zh": "對人充滿關愛。",
        "en": "His love, so powerful.",
        "ja": "も愛を示す"
      },
      {
        "vi": "Mình luôn nguyện bước theo đường noài,",
        "ko": "우리도 사랑으로",
        "zh": "效法上帝顯真愛，",
        "en": "May we show this kind of love,",
        "ja": "そんなエホ"
      },
      {
        "vi": "giúp những ai buồn đau.",
        "ko": "도움 주리라.",
        "zh": "給彼此溫暖。",
        "en": "Help those in distress.",
        "ja": "バに倣いたい"
      },
      {
        "vi": "2. Dù ai mạnh mẽ theo bề ngoài,",
        "ko": "2. 강한 사람",
        "zh": "2．堅強的也會軟弱，",
        "en": "2. Some at times are weak in faith,",
        "ja": "2．折れそうに"
      },
      {
        "vi": "có khi họ yếu đuối.",
        "ko": "같아도 약할 때 있네.",
        "zh": "灰心又受挫，",
        "en": "Strong though they appear.",
        "ja": "なる心さえ"
      },
      {
        "vi": "Mình ân cần sẻ chia cùng họ,",
        "ko": "평온한 마음",
        "zh": "良言使他們振作，",
        "en": "By our reassuring words,",
        "ja": "愛の言葉"
      },
      {
        "vi": "nói bao lời ủi an.",
        "ko": "갖게 격려해 주리.",
        "zh": "不再有煩憂。",
        "en": "We can calm their fears.",
        "ja": "で強くなる"
      },
      {
        "vi": "Mọi chiên đau yếu thuộc ngài,",
        "ko": "약한 사람들도",
        "zh": "陪在他們身邊，",
        "en": "Weak ones to God belong;",
        "ja": "皆エホバの"
      },
      {
        "vi": "được Cha ban sức thêm lên.",
        "ko": "주께 소중하니",
        "zh": "擦去悲傷眼淚。",
        "en": "His spirit makes them strong.",
        "ja": "家族だから"
      },
      {
        "vi": "Lòng ta cần cảm thông cùng họ,",
        "ko": "눈물을 닦아",
        "zh": "他們屬於耶和華，",
        "en": "May we feel their pain and cares,",
        "ja": "痛みや涙"
      },
      {
        "vi": "giúp lau khô lệ rơi.",
        "ko": "주며 아픔 나누리.",
        "zh": "必得到力量。",
        "en": "Help them dry their tears.",
        "ja": "分け合おう"
      },
      {
        "vi": "3. Mình không chỉ trích hay phàn nàn",
        "ko": "3. 약한 자 비난",
        "zh": "3．要體恤軟弱的人，",
        "en": "3. Rather than condemn the weak,",
        "ja": "3．責めたりせ"
      },
      {
        "vi": "những ai lòng đang nản",
        "ko": "않고 감싸 안으리.",
        "zh": "不批評指責。",
        "en": "We should bear in mind",
        "ja": "ずに慰めて"
      },
      {
        "vi": "mà qua lời trấn an dịu dàng",
        "ko": "친절하게",
        "zh": "說話仁慈又體貼，",
        "en": "How much we can strengthen them",
        "ja": "立ち上がる"
      },
      {
        "vi": "giúp cho họ mạnh lên.",
        "ko": "도우면 강하게 되리.",
        "zh": "多令人安慰。",
        "en": "By our being kind.",
        "ja": "よう助けたい"
      },
      {
        "vi": "Nào ta chung sức đồng lòng,",
        "ko": "부지런히 힘써",
        "zh": "我們竭盡全力，",
        "en": "May we be diligent,",
        "ja": "ためらわずに"
      },
      {
        "vi": "cùng nhau nâng đỡ anh em.",
        "ko": "그들 격려하리.",
        "zh": "互相關懷鼓勵，",
        "en": "Give them encouragement.",
        "ja": "手を差し伸べ"
      },
      {
        "vi": "Lòng nhân từ chúng †a tỏ bày",
        "ko": "사랑으로",
        "zh": "要彼此分憂解難，",
        "en": "As we lend our kind support,",
        "ja": "優しくした"
      },
      {
        "vi": "ủi an ai sâu đau.",
        "ko": "도우면 위안받으리.",
        "zh": "以溫情相伴。",
        "en": "Comfort they will find.",
        "ja": "いいつの日も"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Ê-sai 35:3, 4; 2 Cô 11:29; Ga 6:2).",
      "ko": "(이사야 35:3, 4; 고린도 후서 11:29; 갈라디아 6:2 참조)",
      "zh": "（參看賽35：3，4；林後11：29；加6：2）",
      "en": "(See also Isa. 35:3, 4; 2 Cor. 11:29; Gal. 6:2.)",
      "ja": "（イザ35：3，4；コリ二11：29；ガラ6：2も参照。）"
    }
  },
  {
    "number": 103,
    "sourceSheet": "103",
    "labels": {
      "vi": "BÀI HÁT 103",
      "ko": "103번",
      "zh": "詩歌第103首",
      "en": "SONG 103",
      "ja": "103番"
    },
    "title": {
      "vi": "105 Những anh chăn bầy—Món quà từ Đức Chúa Trời",
      "ko": "목자—사람들로 된 선물",
      "zh": "上帝賜下仁愛的牧人",
      "en": "Shepherds—Gifts in Men",
      "ja": "牧者という贈り物"
    },
    "scripture": {
      "vi": " (Ê-phê-sô 4:8)",
      "ko": "(에베소서 4:8)",
      "zh": "（以弗所書4：8）",
      "en": "(Ephesians 4:8)",
      "ja": "（エフェソス4：8）"
    },
    "lines": [
      {
        "vi": "1. Cha Giê-hô-va đã ban cho bầy chiên ",
        "ko": "1. 여호와 주신 목자들은",
        "zh": "1．上帝賜下忠信的牧人，",
        "en": "1. Help in our lives, Jehovah provides,",
        "ja": "1．会衆の牧者"
      },
      {
        "vi": "có bao người chăn tận tâm.",
        "ko": "우리를 돌보네.",
        "zh": "細心照顧綿羊。",
        "en": "Shepherds to tend his flock.",
        "ja": "は神に倣い"
      },
      {
        "vi": "Gương các anh thật tốt, hướng dẫn khôn ngoan,",
        "ko": "모범을 보여 인도하며",
        "zh": "領我們行走正確方向，",
        "en": "By their example they serve as guides,",
        "ja": "羊たち導"
      },
      {
        "vi": "giúp chúng ta theo đường Cha.",
        "ko": "길 밝혀 준다네.",
        "zh": "立下良好榜樣。",
        "en": "Showing us how to walk.",
        "ja": "く模範示し"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Quà thật vô giá Chúa yêu thương ban cho,",
        "ko": "참되고 충실한 남자들,",
        "zh": "仁愛牧人都信實忠貞，",
        "en": "God gives us men who have earned our trust,",
        "ja": "忠実な長老"
      },
      {
        "vi": "bao người chăn đáng tin cậy thay,",
        "ko": "우리는 신뢰하네.",
        "zh": "配受尊重和信任。",
        "en": "Men who are loyal and true.",
        "ja": "良い贈り物"
      },
      {
        "vi": "tận tình chăm sóc, khuyên dạy chiên ngài quý.",
        "ko": "귀중한 양들을 돌보는",
        "zh": "他們愛護寶貴的綿羊，",
        "en": "They show concern for his precious sheep;",
        "ja": "働きに感謝"
      },
      {
        "vi": "Chúng ta yêu thương, biết ơn họ.",
        "ko": "그들을 사랑하리.",
        "zh": "值得敬愛和讚賞。",
        "en": "Love them for all that they do.",
        "ja": "し愛を示そう"
      },
      {
        "vi": "2. Chiên yếu đau, buồn nản, các anh cảm thông,",
        "ko": "2. 이해심 깊고 사랑",
        "zh": "2．牧人關心綿羊的感受，",
        "en": "2. Shepherds who love us care how we feel;",
        "ja": "2．親切な牧者"
      },
      {
        "vi": "giúp chiên mừng vui, bình an;",
        "ko": "많은 따뜻한 목자들,",
        "zh": "時刻陪伴左右。",
        "en": "Gently they guide the way.",
        "ja": "は常に語る"
      },
      {
        "vi": "luôn nói năng tử tế, cố gắng chăm lo,",
        "ko": "우리의 아픔 친절하게",
        "zh": "他們顯愛心、說話溫柔，",
        "en": "When we are hurt, they help us to heal,",
        "ja": "傷ついた心"
      },
      {
        "vi": "dẫn bước chiên theo đường Cha.",
        "ko": "어루만져 주네.",
        "zh": "醫治我們傷口。",
        "en": "Kind in the words they say.",
        "ja": "を癒やす言葉"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Quà thật vô giá Chúa yêu thương ban cho,",
        "ko": "참되고 충실한 남자들,",
        "zh": "仁愛牧人都信實忠貞，",
        "en": "God gives us men who have earned our trust,",
        "ja": "忠実な長老"
      },
      {
        "vi": "bao người chăn đáng tin cậy thay,",
        "ko": "우리는 신뢰하네.",
        "zh": "配受尊重和信任。",
        "en": "Men who are loyal and true.",
        "ja": "良い贈り物"
      },
      {
        "vi": "tận tình chăm sóc, khuyên dạy chiên ngài quý.",
        "ko": "귀중한 양들을 돌보는",
        "zh": "他們愛護寶貴的綿羊，",
        "en": "They show concern for his precious sheep;",
        "ja": "働きに感謝"
      },
      {
        "vi": "Chúng ta yêu thương, biết ơn họ.",
        "ko": "그들을 사랑하리.",
        "zh": "值得敬愛和讚賞。",
        "en": "Love them for all that they do.",
        "ja": "し愛を示そう"
      },
      {
        "vi": "3. Khi lắng nghe họ giảng khuyên theo Lời Cha,",
        "ko": "3. 목자들 교훈 잘",
        "zh": "3．牧人按聖經親切提醒，",
        "en": "3. Godly advice and counsel they give,",
        "ja": "3．愛がある牧者"
      },
      {
        "vi": "chúng ta chẳng đi dạt trôi,",
        "ko": "따르면 빗나가지 않고",
        "zh": "使綿羊不偏離，",
        "en": "That we may never stray.",
        "ja": "はいつも教え"
      },
      {
        "vi": "luôn bước trong đường lối Chúa Giê-hô-va,",
        "ko": "여호와 항상 섬기는",
        "zh": "助我們聽從上帝話語，",
        "en": "Thus they assist us, God's way to live,",
        "ja": "会衆の羊"
      },
      {
        "vi": "khiến Chúa trên cao mừng vui.",
        "ko": "길 걸어가게 되리.",
        "zh": "天天敬奉上帝。",
        "en": "Serving him ev'ry day.",
        "ja": "の命守る"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Quà thật vô giá Chúa yêu thương ban cho,",
        "ko": "참되고 충실한 남자들,",
        "zh": "仁愛牧人都信實忠貞，",
        "en": "God gives us men who have earned our trust,",
        "ja": "忠実な長老"
      },
      {
        "vi": "bao người chăn đáng tin cậy thay,",
        "ko": "우리는 신뢰하네.",
        "zh": "配受尊重和信任。",
        "en": "Men who are loyal and true.",
        "ja": "良い贈り物"
      },
      {
        "vi": "tận tình chăm sóc, khuyên dạy chiên ngài quý.",
        "ko": "귀중한 양들을 돌보는",
        "zh": "他們愛護寶貴的綿羊，",
        "en": "They show concern for his precious sheep;",
        "ja": "働きに感謝"
      },
      {
        "vi": "Chúng ta yêu thương, biết ơn họ.",
        "ko": "그들을 사랑하리.",
        "zh": "值得敬愛和讚賞。",
        "en": "Love them for all that they do.",
        "ja": "し愛を示そう"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Ê-sai 52:1, 2; Giê 5:15; Giăng 21:15-17; Công 20:28).",
      "ko": "(이사야 32:1, 2; 예레미야 3:15; 요한 21:15-17; 사도 20:28 참조)",
      "zh": "（參看賽32：1，2；耶3：15；約21：15-17；徒20：28）",
      "en": "(See also Isa. 32:1, 2; Jer. 3:15; John 21:15-17; Acts 20:28.)",
      "ja": "（イザ32：1，2；エレ3：15；ヨハ21：15‐17；使徒20：28も参照。）"
    }
  },
  {
    "number": 104,
    "sourceSheet": "104",
    "labels": {
      "vi": "BÀI HÁT 104",
      "ko": "104번",
      "zh": "詩歌第104首",
      "en": "SONG 104",
      "ja": "104番"
    },
    "title": {
      "vi": "Thần khí—Món quà từ Đức Chúa Trời",
      "ko": "성령—하느님의 선물",
      "zh": "上帝賜下他的力量",
      "en": "God's Gift of Holy Spirit",
      "ja": "神の聖なる力は贈り物"
    },
    "scripture": {
      "vi": "(Lu-ca 11:15)",
      "ko": "(누가복음 11:13)",
      "zh": "（路加福音11：13）",
      "en": "(Luke 11:13)",
      "ja": "（ルカ11：13）"
    },
    "lines": [
      {
        "vi": "1. Giê-hô-va cao cả, Cha thương xót vô cùng,",
        "ko": "1. 내 마음보다 크신 하느님,",
        "zh": "1．耶和華上帝，慈愛的天父，",
        "en": "1. Sov'reign, Jehovah, merciful Father,",
        "ja": "1．憐れみの神エホバ"
      },
      {
        "vi": "cảm thông cho con vì Cha soi rõ lòng.",
        "ko": "자비로운 우리 아버지,",
        "zh": "痛悔的心你樂意寬恕。",
        "en": "Greater you are than our sinful hearts.",
        "ja": "傷ついた心を"
      },
      {
        "vi": "Cầu ngài ủi an, làm vơi đi bớt gánh nặng,",
        "ko": "무거운 짐을 덜어 주시고",
        "zh": "你為人分擔煩惱和痛苦，",
        "en": "Lighten our burden, soften our anguish,",
        "ja": "慰めてください"
      },
      {
        "vi": "giúp cho con thêm vững tâm qua thần khí ngài.",
        "ko": "성령으로 위로해 주소서.",
        "zh": "賜下力量使我們得安舒。",
        "en": "Give us the comfort your spirit imparts.",
        "ja": "聖なるその力で"
      },
      {
        "vi": "2. Mọi người sinh ra đều mang khuynh hướng sai phạm",
        "ko": "2. 주의 영광에 이르지 못해",
        "zh": "2．我們不完美，常常會犯錯，",
        "en": "2. Father, we all fall short of your glory;",
        "ja": "2．人は皆弱いから"
      },
      {
        "vi": "thế nên đôi khi làm cho Cha thất vọng.",
        "ko": "길을 잃고 방황할 때도",
        "zh": "正確的方向難以掌握。",
        "en": "Times there have been when we've lost our way.",
        "ja": "時に迷い悩む"
      },
      {
        "vi": "Khẩn cầu Cha trên trời ban thêm thần khí ngài,",
        "ko": "우리의 간청 들어주시어",
        "zh": "願天父細聽我們的呼求，",
        "en": "God, we implore you: Hear our petition.",
        "ja": "導いてください"
      },
      {
        "vi": "dẫn con đi theo lối Cha muôn đời không rời.",
        "ko": "성령으로 인도해 주소서.",
        "zh": "賜下力量指引我們生活。",
        "en": "Give us your spirit to guide us each day.",
        "ja": "聖なるその力で"
      },
      {
        "vi": "3. Cuộc đời gian lao làm con đôi lúc nao sờn,",
        "ko": "3. 약하고 지쳐 낙담할 때에",
        "zh": "3．當灰心沮喪或疲倦軟弱，",
        "en": "3. When we are weary, weak, or discouraged,",
        "ja": "3．疲れ果て弱くなり"
      },
      {
        "vi": "sức Cha ban cho trợ lực con vững vàng,",
        "ko": "일어날 힘 내게 주시고",
        "zh": "你的大能使我們振作。",
        "en": "Your active force will our hearts renew.",
        "ja": "悲しくなるときも"
      },
      {
        "vi": "tựa hồ chim ưng liệng bay cao không mỏi mệt.",
        "ko": "독수리처럼 솟아오르게",
        "zh": "我們仰望你賜所需力量，",
        "en": "Give us the strength to soar like the eagles;",
        "ja": "あなたから力受け"
      },
      {
        "vi": "Cúi xin Cha ban xuống cho con thần khí ngài.",
        "ko": "주의 영을 보내어 주소서.",
        "zh": "讓我們如飛鷹展翅翱翔。",
        "en": "May we receive holy spirit from you.",
        "ja": "舞い上がれる再び"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 51:11; Giăng 14:26; Công 9:51).",
      "ko": "(시 51:11; 요한 14:26; 사도 9:31 참조)",
      "zh": "（參看詩51：11；約14：26；徒9：31）",
      "en": "(See also Ps. 51:11; John 14:26; Acts 9:31.)",
      "ja": "（詩51：11；ヨハ14：26；使徒9：31も参照。）"
    }
  },
  {
    "number": 105,
    "sourceSheet": "105",
    "labels": {
      "vi": "BÀI HÁT 105",
      "ko": "105번",
      "zh": "詩歌第105首",
      "en": "SONG 105",
      "ja": "105番"
    },
    "title": {
      "vi": "“Đức Chúa Trời là tình vêu thương”",
      "ko": "“하느님은 사랑이시다”",
      "zh": "上帝就是愛",
      "en": "“God Is Love”",
      "ja": "「神は愛」"
    },
    "scripture": {
      "vi": "(Giăng4:7, 8)",
      "ko": "(요한 1서 4:7, 8)",
      "zh": "（約翰一書4：7，8）",
      "en": "(1 John 4:7, 8)",
      "ja": "（ヨハネ第一4：7，8）"
    },
    "lines": [
      {
        "vi": "1. Vì mến yêu, Cha mời chúng ta đi",
        "ko": "1. 사랑이신 하느님이",
        "zh": "1．耶和華上帝就是愛，",
        "en": "1. God is love, and he invites us:",
        "ja": "1．愛の源のエ"
      },
      {
        "vi": "theo đường lối yêu thương của ngài.",
        "ko": "‘함께 걷자' 하시네.",
        "zh": "效法他表現真愛。",
        "en": "‘Walk with me and love my way.'",
        "ja": "ホバは願う"
      },
      {
        "vi": "Đời sống ta sinh ra nhiều việc lành",
        "ko": "주와 이웃 사랑하여",
        "zh": "對上帝和別人的愛，",
        "en": "When we love both God and neighbor,",
        "ja": "神と隣人を"
      },
      {
        "vi": "khi yêu Chúa, yêu người xung quanh.",
        "ko": "따뜻함 늘 보이리.",
        "zh": "讓我們努力行善。",
        "en": "Gracious deeds will fill each day.",
        "ja": "愛するように"
      },
      {
        "vi": "Ta hân hoan sống đời bao phước ân ",
        "ko": "우리가 찾는 삶의",
        "zh": "愛心是生活的要訣，",
        "en": "Therein lies the key to living;",
        "ja": "これこそ歩"
      },
      {
        "vi": "do vâng theo Cha Giê-hô-va.",
        "ko": "길 사랑 안에 있으니",
        "zh": "愛心是幸福之源。",
        "en": "Therein lies the life we seek.",
        "ja": "みを導く秘訣"
      },
      {
        "vi": "Tình mến thương Giê-su dạy chúng ta",
        "ko": "그리스도 같은 사랑",
        "zh": "基督徒將愛心散播，",
        "en": "Christlike love will never fail us;",
        "ja": "常に倣いたい"
      },
      {
        "vi": "luôn bên vững, không bao giờ phai.",
        "ko": "말하고 늘 행하리.",
        "zh": "必帶來美好結果。",
        "en": "Christlike love through us will speak.",
        "ja": "イエスの愛に"
      },
      {
        "vi": "2. Vì mến Cha, ta nguyện sống yêu thương",
        "ko": "2. 주와 진리 사랑하면",
        "zh": "2．對真理和上帝的愛，",
        "en": "2. Love of truth moves us to action;",
        "ja": "2．神の後押し"
      },
      {
        "vi": "qua lời nói hay qua việc làm.",
        "ko": "사랑 행하게 되리.",
        "zh": "讓我們彼此相愛。",
        "en": "Love of God moves us to love.",
        "ja": "と真理への愛"
      },
      {
        "vi": "Ngài đỡ nâng khi ta đang nản lòng;",
        "ko": "어려움이 있을 때도",
        "zh": "倚靠上帝克服困難，",
        "en": "When we fail he seeks to help us;",
        "ja": "失意の底か"
      },
      {
        "vi": "nương sức Chúa, ta vượt gian nan.",
        "ko": "주께서 도우시리.",
        "zh": "能繼續表現真愛。",
        "en": "By his strength we rise above.",
        "ja": "ら飛び立つ力"
      },
      {
        "vi": "Do yêu thương, chúng ta không ghét ghen",
        "ko": "사랑이란 질투",
        "zh": "真愛既仁慈又純潔，",
        "en": "Love is pure and never jealous;",
        "ja": "愛は親切で"
      },
      {
        "vi": "nhưng khoan dung, quan tâm lẫn nhau.",
        "ko": "않고 친절하며 참으니",
        "zh": "不嫉妒、包容體貼。",
        "en": "Love is kind and bears all things.",
        "ja": "全てに耐える"
      },
      {
        "vi": "Cùng đắp xây thêm bao tình mến thương,",
        "ko": "형제 더욱 사랑하여",
        "zh": "願我們都培養真愛，",
        "en": "May we grow to love our brother;",
        "ja": "常に示した"
      },
      {
        "vi": "ta nguyện sống chan hòa cùng nhau.",
        "ko": "참된 기쁨 누리리.",
        "zh": "得享真摯的友愛。",
        "en": "May we taste what true love brings.",
        "ja": "い仲間への愛"
      },
      {
        "vi": "3. Mình chớ nên mang hờn oán trong tâm,",
        "ko": "3. 분한 마음 품지",
        "zh": "3．我們不要懷怒在心，",
        "en": "3. Never let resentment lead you;",
        "ja": "3．怒り感じても"
      },
      {
        "vi": "e điều ấy xui ta lâm đường.",
        "ko": "않고 보복하지 않으며",
        "zh": "也不要憤恨不平，",
        "en": "May it never take your hand.",
        "ja": "それを捨て去り"
      },
      {
        "vi": "Nhờ Chúa Giê-hô-va soi đường mình,",
        "ko": "하느님을 바라보면",
        "zh": "尋求天父受他指引，",
        "en": "Look to God, and he will guide you;",
        "ja": "真の愛によ"
      },
      {
        "vi": "ta quyết bước theo điều răn Cha:",
        "ko": "이끌어 주시리라.",
        "zh": "留意他一切提醒。",
        "en": "He will teach you these commands:",
        "ja": "り神に委ねる"
      },
      {
        "vi": "Yêu thương Cha cũng như yêu mến người;",
        "ko": "진정한 사랑의",
        "zh": "愛上帝也要愛別人，",
        "en": "Love of God and love of neighbor,",
        "ja": "これこそ歩み"
      },
      {
        "vi": "yêu anh em như yêu chính ta.",
        "ko": "길을 깨닫게 하시리니",
        "zh": "凡事以愛心相待。",
        "en": "Ev'rything that love should be.",
        "ja": "を導くおきて"
      },
      {
        "vi": "Mình gắng sao vun trồng lòng mến thương,",
        "ko": "하느님과 같은 사랑",
        "zh": "我們要時刻顯真愛，",
        "en": "May we always show to others",
        "ja": "常に倣いたい"
      },
      {
        "vi": "luôn phản chiếu tấm gương của Cha.",
        "ko": "항상 나타내리라.",
        "zh": "願愛心、溫情永在。",
        "en": "Godlike love, yes, tenderly.",
        "ja": "エホバの愛に"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Mác 12:50, 51; 1 Cô 12:51-15:8; 1 Giăng 5:25).",
      "ko": "(마가 12:30, 31; 고린도 전서 12:31–13:8; 요한 1서 3:23 참조)",
      "zh": "（參看可12：30，31；林前12：31–13：8；約一3：23）",
      "en": "(See also Mark 12:30, 31; 1 Cor. 12:31–13:8; 1 John 3:23.)",
      "ja": "（マル12：30，31；コリ一12：31–13：8；ヨハ一3：23も参照。）"
    }
  },
  {
    "number": 106,
    "sourceSheet": "106",
    "labels": {
      "vi": "BÀI HÁT 106",
      "ko": "106번",
      "zh": "詩歌第106首",
      "en": "SONG 106",
      "ja": "106番"
    },
    "title": {
      "vi": "Trau dồi đức tính yêu thương",
      "ko": "사랑을 길러 나가리",
      "zh": "培養愛心",
      "en": "Cultivating the Quality of Love",
      "ja": "愛を育む"
    },
    "scripture": {
      "vi": "(1 Cô-rinh-tô 15:1-8)",
      "ko": "(고린도 전서 13:1-8)",
      "zh": "（哥林多前書13：1-8）",
      "en": "(1 Corinthians 13:1-8)",
      "ja": "（コリント第一13：1‐8）"
    },
    "lines": [
      {
        "vi": "1. Cầu xin Cha giúp chúng ta theo đường ngài,",
        "ko": "1. 아름다운 주의 특성들",
        "zh": "1．我們要謙卑效法上帝，",
        "en": "1. We humbly bow to our God in prayer,",
        "ja": "1．神に倣い示す"
      },
      {
        "vi": "hầu cho đức tính giống Cha ta thể hiện.",
        "ko": "우리도 닮으려 힘쓰네.",
        "zh": "努力培養美好的品行。",
        "en": "That all his qualities we may share.",
        "ja": "その性質全て"
      },
      {
        "vi": "Một đức tính quan trọng nhất ta luôn nhớ",
        "ko": "사랑이 그중 제일 크니,",
        "zh": "上帝的完美品格之中，",
        "en": "But most important of all those things",
        "ja": "特別なのは愛"
      },
      {
        "vi": "là yêu thương do thần khí thánh sinh ra.",
        "ko": "성령 흘러야 맺게 되네.",
        "zh": "最顯著的特質是愛心。",
        "en": "Is love, which having his spirit brings.",
        "ja": "エホバの贈り物"
      },
      {
        "vi": "Dù tài năng nhiều, can đảm với khôn ngoan",
        "ko": "재능, 지혜, 용기 있어도",
        "zh": "人即使擁有才華、能力，",
        "en": "We may be talented, wise, or bold,",
        "ja": "たとえ賢くて"
      },
      {
        "vi": "mà không yêu thương, vô nghĩa chẳng ra chỉ.",
        "ko": "사랑 없으면 다 헛되니,",
        "zh": "沒有愛，一切毫無意義。",
        "en": "But we are nothing if love grows cold.",
        "ja": "も信仰強くても"
      },
      {
        "vi": "Nguyện xin cho yêu thương tha thiết, nồng ấm,",
        "ko": "하느님 도움을 구하여",
        "zh": "願我們彼此以愛相待，",
        "en": "We pray for love that is warm and true,",
        "ja": "愛を失うなら全"
      },
      {
        "vi": "giúp ta bên nhau dài lâu mãi không thôi.",
        "ko": "모든 일에 사랑 보이리.",
        "zh": "態度真誠，帶給人溫暖。",
        "en": "Revealed in all that we say and do.",
        "ja": "ては無駄になる"
      },
      {
        "vi": "2. Tình yêu thôi thúc chúng ta luôn rộng lòng,",
        "ko": "2. 사랑은 이기심 버리고",
        "zh": "2．真愛推動人慷慨施與，",
        "en": "2. Love looks for ways to give graciously",
        "ja": "2．愛があればいつ"
      },
      {
        "vi": "tìm ra bao cách để ban cho mọi người.",
        "ko": "남을 먼저 생각하는 것.",
        "zh": "優先顧及其他人所需。",
        "en": "And thinks of others unselfishly.",
        "ja": "も与えること願う"
      },
      {
        "vi": "Mình sẽ chẳng nuôi thù oán hay ghen ghét",
        "ko": "형제 미워하지 않으며",
        "zh": "愛心促使人放下怨恨，",
        "en": "Love never harbors a hateful thought,",
        "ja": "憎しみを捨て去"
      },
      {
        "vi": "mà luôn khoan dung, tha thứ lỗi cho nhau.",
        "ko": "기꺼이 용서해 주는 것.",
        "zh": "效法耶穌甘心寬恕人。",
        "en": "Forgives our brothers, as Jesus taught.",
        "ja": "り進んで許し合う"
      },
      {
        "vi": "Chịu đựng cho dù muôn sóng gió vây quanh.",
        "ko": "사랑은 잘못을 참으며",
        "zh": "就算遭遇不公與患難，",
        "en": "Love helps us patiently suffer wrong,",
        "ja": "たとえ傷ついても"
      },
      {
        "vi": "Kề bên quan tâm, nâng đỡ các anh em.",
        "ko": "무거운 짐을 나누는 것.",
        "zh": "愛心幫助人保持忍耐。",
        "en": "Bears heavy loads when it's really strong.",
        "ja": "どんな試練来ても"
      },
      {
        "vi": "Vượt bao gian lao, yêu thương vẫn bền vững;",
        "ko": "모든 시련을 이겨 내는",
        "zh": "真愛能跨越一切障礙，",
        "en": "Through ev'ry trial let love prevail;",
        "ja": "全て越えていける"
      },
      {
        "vi": "mối dây yêu thương tồn tại mãi không phai.",
        "ko": "사랑은 영원히 남으리.",
        "zh": "愛，凡事包容，永遠存在。",
        "en": "It bears all things; it will never fail.",
        "ja": "愛は絶えないもの"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Giăng 21:17; 1 Cô 15:15; Ga 6:2).",
      "ko": "(요한 21:17; 고린도 전서 13:13; 갈라디아 6:2 참조)",
      "zh": "（參看約21：17；林前13：13；加6：2）",
      "en": "(See also John 21:17; 1 Cor. 13:13; Gal. 6:2.)",
      "ja": "（ヨハ21：17；コリ一13：13；ガラ6：2も参照。）"
    }
  },
  {
    "number": 107,
    "sourceSheet": "107",
    "labels": {
      "vi": "BÀI HÁT 107",
      "ko": "107번",
      "zh": "詩歌第107首",
      "en": "SONG 107",
      "ja": "107番"
    },
    "title": {
      "vi": "Gương mẫu yêu thương của Đức Chúa Trời",
      "ko": "하느님의 사랑의 본",
      "zh": "效法愛的完美典範",
      "en": "The Divine Pattern of Love",
      "ja": "神の愛の模範"
    },
    "scripture": {
      "vi": "(1Giăng 4:19)",
      "ko": "(요한 1서 4:19)",
      "zh": "（約翰一書4：19）",
      "en": "(1 John 4:19)",
      "ja": "（ヨハネ第一4：19）"
    },
    "lines": [
      {
        "vi": "1. Giê-hô-va là Chúa, gương mẫu yêu thương tuyệt vời",
        "ko": "1. 여호와께서 사랑의 본 보여",
        "zh": "1．耶和華上帝，愛的完美典範，",
        "en": "1. The pattern of love, we learn from Jehovah",
        "ja": "1．心打つエホバ"
      },
      {
        "vi": "cho mọi người bước đi theo.",
        "ko": "가르쳐 주시네. ",
        "zh": "教導人表現愛。",
        "en": "Shows the way, guides our way.",
        "ja": "神の愛の模範"
      },
      {
        "vi": "Thật ngài luôn phản chiếu đức tính yêu thương cao đẹp,",
        "ko": "주께서 하신 모든 일을 보면",
        "zh": "從他的作為我們就能明白，",
        "en": "In all he has done, his dealings have shown us",
        "ja": "その愛を深く学"
      },
      {
        "vi": "qua mọi việc làm hay lời Cha phán.",
        "ko": "알게 되리, 그 사랑을.",
        "zh": "上帝的愛無處不在。",
        "en": "How to display his loving way.",
        "ja": "び身に付け示そう"
      },
      {
        "vi": "Ngài từ nhân dường bao, ban Con yêu xuống thế gian",
        "ko": "가장 소중한 아들 내주시어",
        "zh": "耶和華的愛流傳千秋萬代，",
        "en": "He gave us his Son, his dearest possession",
        "ja": "愛する子イエス与"
      },
      {
        "vi": "chịu đựng bao thử thách, hy sinh cung cấp giá chuộc.",
        "ko": "우리의 죄를 다 덮어 주셨네.",
        "zh": "他寬恕過犯，甚至犧牲最愛，",
        "en": "To cover our sin, forgiving transgression.",
        "ja": "え人々の罪を許す"
      },
      {
        "vi": "Hành động cao thượng ấy, gương yêu thương lớn nhất này,",
        "ko": "말할 수 없이 깊고 깊은 사랑!",
        "zh": "獻出他兒子把人的罪遮蓋，",
        "en": "What proof of his love—its greatest expression!",
        "ja": "限りないエホバの"
      },
      {
        "vi": "soi chiếu cho mình đường yêu thương giống Cha.",
        "ko": "소중하네, 그 사랑의 본.",
        "zh": "這就是愛，上帝的真愛。",
        "en": "His way is love, Yes, God's way is love.",
        "ja": "愛これこそ神の道"
      },
      {
        "vi": "2. Mình nguyện theo đường lối yêu mến anh em đồng đạo,",
        "ko": "2. 하느님의 길 함께 걷는 형제",
        "zh": "2．要效法上帝，表現真摯愛心，",
        "en": "2. When we walk his way, our love for each other",
        "ja": "2．神の道歩むと"
      },
      {
        "vi": "yêu thật lòng, mãi không phai.",
        "ko": "진실로 사랑해.",
        "zh": "對彼此顯溫情。",
        "en": "Will be true, warm and true,",
        "ja": "きに愛は育ち"
      },
      {
        "vi": "Người dù lâu hoặc mới, ta cũng quan tâm ân cần,",
        "ko": "늘 모든 형제 따뜻이 대하리,",
        "zh": "我們要關心所有弟兄姐妹，",
        "en": "Will move us to care for all of our brothers,",
        "ja": "心から仲間全"
      },
      {
        "vi": "luôn mở rộng lòng, chủ động thăm hỏi.",
        "ko": "차별 없이 모든 벗을.",
        "zh": "不分你我，開闊心胸。",
        "en": "Old ones and new, not just a few.",
        "ja": "て気遣い敬う"
      },
      {
        "vi": "Dù là yêu người ta hay yêu Cha hết tấm lòng",
        "ko": "주 여호와를 정말 사랑하면",
        "zh": "我們愛上帝，也愛弟兄團體，",
        "en": "True love for our God and love for our brother,",
        "ja": "もし友が苦しむなら"
      },
      {
        "vi": "đều từ Cha dạy dỗ nên ta vâng giữ mỗi ngày.",
        "ko": "형제 자매도 사랑하게 되네.",
        "zh": "要體現愛心，做得更加徹底，",
        "en": "We can't have the one and not have the other.",
        "ja": "手を伸ばし支えとなり"
      },
      {
        "vi": "Mình chẳng mang hờn oán nhưng mau tha thứ lỗi lầm,",
        "ko": "그 작은 결점 모두 덮어 주며",
        "zh": "別人的過犯，我們包容寬待，",
        "en": "The faults of our friends, we readily cover,",
        "ja": "兄弟の愛を示す"
      },
      {
        "vi": "minh chứng đây là tình anh em thiết tha.",
        "ko": "우리 서로 늘 사랑하리.",
        "zh": "這就是愛，弟兄的真愛。",
        "en": "Proving our love, Our brotherly love.",
        "ja": "これこそ真の愛"
      },
      {
        "vi": "3. Nhờ tình yêu nồng ấm, liên kết ta nên gia đình,",
        "ko": "3. 주의 본 따라 우리 연합하여",
        "zh": "3．用愛心維繫弟兄姐妹友誼，",
        "en": "3. The pattern of love, the bond that unites us",
        "ja": "3．真の愛私たち"
      },
      {
        "vi": "luôn hòa thuận, mến thương nhau.",
        "ko": "가족이 되었네.",
        "zh": "一家人心連心。",
        "en": "Lets us be family.",
        "ja": "を結び付ける"
      },
      {
        "vi": "Ngài mời ta cùng đến thử nếm xem bao ơn lành",
        "ko": "“형제 연합을 맛보아 알아라”",
        "zh": "仁愛的天父親切地邀請人，",
        "en": "Our Father above now warmly invites us:",
        "ja": "父のもと家族と"
      },
      {
        "vi": "khi thờ phượng ngài trong sự hợp nhất.",
        "ko": "따뜻하게 권하시네.",
        "zh": "一同感受團結氣氛。",
        "en": "“Come taste and see real unity.”",
        "ja": "なり幸せ味わおう"
      },
      {
        "vi": "Nào họp nhau lại đây, anh em vui sướng kết hợp;",
        "ko": "우린 모두 다 주의 백성이니",
        "zh": "請加入我們，共享友愛歡樂，",
        "en": "Come share in the love and joy that define us;",
        "ja": "聖書から教えられて"
      },
      {
        "vi": "mình nhận thêm thần khí, nghe Cha khuyên bảo, giảng dạy.",
        "ko": "그 말씀대로 서로 사랑하리.",
        "zh": "讓上帝力量重新塑造我們。",
        "en": "God's spirit and Word, he gives to refine us.",
        "ja": "友たちと手を取り合い"
      },
      {
        "vi": "Và tình huynh đệ ấy cho ta thêm nhớ rõ rằng",
        "ko": "서로를 보며 항상 기억하리,",
        "zh": "願彼此激勵，就不輕易忘記：",
        "en": "Our brothers and friends are here to remind us,",
        "ja": "広げよう一致の輪"
      },
      {
        "vi": "đây chính con đường tình yêu thương của Cha.",
        "ko": "하느님의 그 사랑의 본.",
        "zh": "這就是愛，上帝就是愛。",
        "en": "God's way is love. Jehovah is love.",
        "ja": "をこれこそ神の愛"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Rô 12:10; Ê-phê 4:5; 2 Phi1:7).",
      "ko": "(로마 12:10; 에베소 4:3; 베드로 후서 1:7 참조)",
      "zh": "（參看羅12：10；弗4：3；彼後1：7）",
      "en": "(See also Rom. 12:10; Eph. 4:3; 2 Pet. 1:7.)",
      "ja": "（ロマ12：10；エフェ4：3；ペテ二1：7も参照。）"
    }
  },
  {
    "number": 108,
    "sourceSheet": "108",
    "labels": {
      "vi": "BÀI HÁT 108",
      "ko": "108번",
      "zh": "詩歌第108首",
      "en": "SONG 108",
      "ja": "108番"
    },
    "title": {
      "vi": "Tình yêu thương thành tín của Đức Chúa Trời",
      "ko": "하느님의 충성스러운 사랑",
      "zh": "上帝的忠貞之愛",
      "en": "God's Loyal Love",
      "ja": "神の揺るぎない愛"
    },
    "scripture": {
      "vi": " (Ê-sai 55:1-5)",
      "ko": "(이사야 55:1-3)",
      "zh": "（以賽亞書55：1-3）",
      "en": "(Isaiah 55:1-3)",
      "ja": "（イザヤ55：1‐3）"
    },
    "lines": [
      {
        "vi": "1. Giê-hô-va là yêu thương,",
        "ko": "1. 아들을 내주신",
        "zh": "1．耶和華就是愛，",
        "en": "1. Loyal love! God is love.",
        "ja": "1．愛のエホバ"
      },
      {
        "vi": "thành tín với dân Cha chẳng đổi thay.",
        "ko": "충성스런 주의 사랑!",
        "zh": "忠貞之愛深廣如海，",
        "en": "We can sense his care from above.",
        "ja": "人々助けて"
      },
      {
        "vi": "Ngàn năm xưa Cha từng ban Con quý",
        "ko": "우리 모두를 위하여",
        "zh": "他將寶貴愛子賜下，",
        "en": "God by means of his precious Son",
        "ja": "許しと命の"
      },
      {
        "vi": "chịu đựng đớn đau chuộc lỗi loài người.",
        "ko": "아들의 생명 주시어",
        "zh": "為人付出貴重代價，",
        "en": "Paid the ransom for ev'ryone,",
        "ja": "扉を開いた"
      },
      {
        "vi": "Hầu ta mang hy vọng đầy tươi sáng,",
        "ko": "영원한 생명 누리는",
        "zh": "讓人有希望享永生，",
        "en": "Giving hope that we might possess",
        "ja": "独り子イエス"
      },
      {
        "vi": "ngày sau sống muôn đời trong ân phước.",
        "ko": "벅찬 희망을 주셨네.",
        "zh": "尋得真正幸福快樂。",
        "en": "Life eternal and happiness.",
        "ja": "を世界に与えて"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Hỡi ai hiện đang khát xin nghe,",
        "ko": "목마른 자 다 와서",
        "zh": "乾渴的人，快前來！",
        "en": "Hey there, all you thirsty ones,",
        "ja": "命の水がこ"
      },
      {
        "vi": "mau lại nhận đây nước Cha ban,",
        "ko": "생명수를 마시라.",
        "zh": "盡情來喝生命水。",
        "en": "Come and drink life's water free.",
        "ja": "こにあふれる"
      },
      {
        "vi": "mình được cho không nước sự sống.",
        "ko": "와서 거저 마시고",
        "zh": "願意的人快前來，",
        "en": "Yes, come drink, you thirsty ones;",
        "ja": "渇く人た"
      },
      {
        "vi": "Xem Chúa yêu thương dường bao.",
        "ko": "주 사랑 맛보라.",
        "zh": "飽享忠貞之愛。",
        "en": "God's loyal love you'll see.",
        "ja": "ち潤すため"
      },
      {
        "vi": "2. Giê-hô-va là yêu thương,",
        "ko": "2. 왕국을 세우신",
        "zh": "2．耶和華就是愛，",
        "en": "2. Loyal love! God is love.",
        "ja": "2．愛のエホバ"
      },
      {
        "vi": "mình thấy rõ qua công việc tay Cha.",
        "ko": "충성스런 주의 사랑!",
        "zh": "一切作為盡顯慈愛。",
        "en": "All his works give proof of his love.",
        "ja": "王国を立てて"
      },
      {
        "vi": "Vì yêu thương nên ngài cho Con quý",
        "ko": "우릴 충실히 돌보실",
        "zh": "他任命耶穌作君王，",
        "en": "Love Jehovah has further shown,",
        "ja": "独り子イエス"
      },
      {
        "vi": "nhận ngôi Nước cai trị giữa loài người,",
        "ko": "아들 왕으로 세우고",
        "zh": "展現愛心造福萬民。",
        "en": "Giving Jesus the kingly throne.",
        "ja": "に王座を与えた"
      },
      {
        "vi": "thực thi đúng như lời Cha đã hứa.",
        "ko": "주의 왕국이 마침내",
        "zh": "王國已在天上建立，",
        "en": "God's own purpose has come to pass.",
        "ja": "地球に平和を"
      },
      {
        "vi": "Kìa, xem Nước trên trời nay đã đến!",
        "ko": "탄생하게 해 주셨네.",
        "zh": "即將達成上帝旨意。",
        "en": "See! His Kingdom is here at last!",
        "ja": "取り戻"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Hỡi ai hiện đang khát xin nghe,",
        "ko": "목마른 자 다 와서",
        "zh": "乾渴的人，快前來！",
        "en": "Hey there, all you thirsty ones,",
        "ja": "命の水がこ"
      },
      {
        "vi": "mau lại nhận đây nước Cha ban,",
        "ko": "생명수를 마시라.",
        "zh": "盡情來喝生命水。",
        "en": "Come and drink life's water free.",
        "ja": "こにあふれる"
      },
      {
        "vi": "mình được cho không nước sự sống.",
        "ko": "와서 거저 마시고",
        "zh": "願意的人快前來，",
        "en": "Yes, come drink, you thirsty ones;",
        "ja": "渇く人た"
      },
      {
        "vi": "Xem Chúa yêu thương dường bao.",
        "ko": "주 사랑 맛보라.",
        "zh": "飽享忠貞之愛。",
        "en": "God's loyal love you'll see.",
        "ja": "ち潤すため"
      },
      {
        "vi": "3. Giê-hô-va là yêu thương!",
        "ko": "3. 주의 본 따르리,",
        "zh": "3．耶和華就是愛，",
        "en": "3. Loyal love! God is love.",
        "ja": "3．愛のエホバ"
      },
      {
        "vi": "Mình cố gắng noi gương ngài luôn luôn.",
        "ko": "충성스런 사랑의 본!",
        "zh": "感動我們表現真愛。",
        "en": "May his spirit move us to love.",
        "ja": "人々愛して"
      },
      {
        "vi": "Dạy cho ai khiêm hòa tin nơi Chúa,",
        "ko": "주의 사랑을 본받아",
        "zh": "持續不懈教導別人，",
        "en": "As we loyally help the meek,",
        "ja": "温厚な人の"
      },
      {
        "vi": "họ vâng giữ theo đòi hỏi của ngài.",
        "ko": "온유한 사람 도우며",
        "zh": "幫助他們服從真神。",
        "en": "God's commandments they learn to keep.",
        "ja": "心を動かす"
      },
      {
        "vi": "Mình tôn vinh, ca ngợi danh vinh hiển",
        "ko": "주께 경외심 보이고",
        "zh": "決心一生敬畏上帝，",
        "en": "We are serving with godly fear,",
        "ja": "生き方を変え"
      },
      {
        "vi": "và can đảm đi truyền rao khắp chốn.",
        "ko": "말씀 담대히 전하리.",
        "zh": "勇敢向人傳好消息。",
        "en": "Preaching boldly for all to hear.",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "命の水がこ"
      },
      {
        "vi": "Hỡi ai hiện đang khát xin nghe,",
        "ko": "목마른 자 다 와서",
        "zh": "乾渴的人，快前來！",
        "en": "Hey there, all you thirsty ones,",
        "ja": "こにあふれる"
      },
      {
        "vi": "mau lại nhận đây nước Cha ban,",
        "ko": "생명수를 마시라.",
        "zh": "盡情來喝生命水。",
        "en": "Come and drink life's water free.",
        "ja": "渇く人た"
      },
      {
        "vi": "mình được cho không nước sự sống.",
        "ko": "와서 거저 마시고",
        "zh": "願意的人快前來，",
        "en": "Yes, come drink, you thirsty ones;",
        "ja": "ち潤すため"
      },
      {
        "vi": "Xem Chúa yêu thương dường bao.",
        "ko": "주 사랑 맛보라.",
        "zh": "飽享忠貞之愛。",
        "en": "God's loyal love you'll see.",
        "ja": "る聖なる力で"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 55:5; 57:10; Ê-phê 1:7).",
      "ko": "(시 33:5; 57:10; 에베소 1:7 참조)",
      "zh": "（參看詩33：5；57：10；弗1：7）",
      "en": "(See also Ps. 33:5; 57:10; Eph. 1:7.)",
      "ja": "（詩33：5；57：10；エフェ1：7も参照。）"
    }
  },
  {
    "number": 109,
    "sourceSheet": "109",
    "labels": {
      "vi": "BÀI HÁT 109",
      "ko": "109번",
      "zh": "詩歌第109首",
      "en": "SONG 109",
      "ja": "109番"
    },
    "title": {
      "vi": "Hãy tha thiết vêu thương từ đáy lòng",
      "ko": "마음으로 열렬히 사랑하라",
      "zh": "從心裡熱切相愛",
      "en": "Love Intensely From the Heart",
      "ja": "心から熱烈に愛しましょう"
    },
    "scripture": {
      "vi": "(1 Phi-e-rơ 1:22)",
      "ko": "(베드로 전서 1:22)",
      "zh": "（彼得前書1：22）",
      "en": "(1 Peter 1:22)",
      "ja": "（ペテロ第一1：22）"
    },
    "lines": [
      {
        "vi": "1. Ta làm Cha Giê-hô-va mừng vui",
        "ko": "1. 하느님 사랑이시니,",
        "zh": "1．上帝的愛多麼偉大，",
        "en": "1. When our love is pure and intense,",
        "ja": "熱烈な愛は"
      },
      {
        "vi": "khi thiết tha yêu thương mọi anh em.",
        "ko": "가장 소중한 그 특성.",
        "zh": "我們要努力效法他，",
        "en": "We make Jehovah's heart rejoice.",
        "ja": "強く美しい"
      },
      {
        "vi": "Gương mẫu yêu thương nổi bật nơi Cha,",
        "ko": "여호와 기뻐하시네,",
        "zh": "發自內心熱切相愛，",
        "en": "Love is his greatest quality,",
        "ja": "純粋な愛"
      },
      {
        "vi": "ta muốn thể hiện với nhau.",
        "ko": "마음 다한 사랑.",
        "zh": "必得天父稱讚。",
        "en": "Something that we hold dear.",
        "ja": "を神喜ぶ"
      },
      {
        "vi": "Khi lòng yêu mến thiết tha, đậm sâu,",
        "ko": "따뜻한 그 애정으로",
        "zh": "心中洋溢溫暖之情，",
        "en": "Warm affection glows in our hearts,",
        "ja": "温かな愛で"
      },
      {
        "vi": "ta với anh em nên bạn tâm giao.",
        "ko": "서로에게 다가가서",
        "zh": "友誼更加深厚堅定。",
        "en": "Making a loyal friendship grow.",
        "ja": "絆が強まり"
      },
      {
        "vi": "Ta quyết không lo tìm lợi riêng tư",
        "ko": "나보다 우리",
        "zh": "待人體貼、表現關心，",
        "en": "Love always acts unselfishly,",
        "ja": "友情が芽生"
      },
      {
        "vi": "nhưng mến yêu nhau thành tâm.",
        "ko": "형제들 먼저 사랑하리.",
        "zh": "不會單顧自己。",
        "en": "Proving our love sincere.",
        "ja": "え育まれる"
      },
      {
        "vi": "Mình dang đôi tay ra đỡ nâng",
        "ko": "지치고 낙심한 벗",
        "zh": "朋友若需要幫助，",
        "en": "When we see a friend in need,",
        "ja": "支えになろう助"
      },
      {
        "vi": "những anh em gặp gian khó và đau buồn;",
        "ko": "마음 다해 도와주리라.",
        "zh": "我們隨時都樂意協助。",
        "en": "We'll be there to lend a helping hand.",
        "ja": "けの手差し伸べ"
      },
      {
        "vi": "kề bên quan tâm, luôn ủi an,",
        "ko": "진정한 벗이 되어",
        "zh": "要互相關愛照顧，",
        "en": "Truly we can be a friend,",
        "ja": "力なくした"
      },
      {
        "vi": "cảm thông cho lòng đang khóc than.",
        "ko": "아픔 헤아려 주리.",
        "zh": "真朋友同甘共苦。",
        "en": "Someone who can understand.",
        "ja": "友に寄り添い"
      },
      {
        "vi": "Qua tình yêu Chúa Giê-su tỏ ra,",
        "ko": "예수 통해 알게 됐네,",
        "zh": "耶穌體現天父的愛，",
        "en": "Jesus showed what love really means,",
        "ja": "キリストの愛"
      },
      {
        "vi": "†a thấy Cha yêu thương mình bao la,",
        "ko": "내 마음을 움직이는",
        "zh": "態度仁慈、親切和藹，",
        "en": "Helping us see Jehovah's love,",
        "ja": "に神の愛を見る"
      },
      {
        "vi": "thôi thúc ta theo đường ngài mãi mãi.",
        "ko": "여호와의 깊은 사랑.",
        "zh": "願我們也表現真愛，",
        "en": "Touching our hearts and moving us.",
        "ja": "心が沸き立つ"
      },
      {
        "vi": "Chúng ta yêu thương nhau trìu mến,",
        "ko": "나도 나타내리라,",
        "zh": "以溫情彼此關懷，",
        "en": "Tender feelings are a start.",
        "ja": "仲間気遣い"
      },
      {
        "vi": "giữ mối tương giao thêm đậm sâu.",
        "ko": "마음 다해 열렬히.",
        "zh": "從心裡熱切相愛。",
        "en": "Love intensely from the heart.",
        "ja": "愛するように"
      }
    ],
    "reference": {
      "vi": "(Cũng xem 1 Phi 2:17; 5:8; 4:8; 1 Giăng 5:11).",
      "ko": "(베드로 전서 2:17; 3:8; 4:8; 요한 1서 3:11 참조)",
      "zh": "（參看彼前2：17；3：8；4：8；約一3：11）",
      "en": "(See also 1 Pet. 2:17; 3:8; 4:8; 1 John 3:11.)",
      "ja": "（ペテ一2：17；3：8；4：8；ヨハ一3：11も参照。）"
    }
  },
  {
    "number": 110,
    "sourceSheet": "110",
    "labels": {
      "vi": "BÀI HÁT 110",
      "ko": "110번",
      "zh": "詩歌第110首",
      "en": "SONG 110",
      "ja": "110番"
    },
    "title": {
      "vi": "l10 “Niềm vui của Đức Giê-hô-va”",
      "ko": "“여호와의기쁨”",
      "zh": "耶和華所賜的喜樂",
      "en": "“The Joy of Jehovah”",
      "ja": "「エホバからの喜び」"
    },
    "scripture": {
      "vi": "(Nê-hê-mi 8:10)",
      "ko": "(느헤미야 8:10)",
      "zh": "（尼希米記8：10）",
      "en": "(Nehemiah 8:10)",
      "ja": "（ネヘミヤ8：10）"
    },
    "lines": [
      {
        "vi": "1. Nhiều điểm xảy đến là dấu chứng minh về Nước Cha.",
        "ko": "1. 왕국 통치의 표징 분명하니,",
        "zh": "1．末世徵象表明王國已建立，",
        "en": "1. Signs of the times are pointing to the Kingdom.",
        "ja": "1．救いの足音近"
      },
      {
        "vi": "Truyền mọi người biết lời hứa Cha ban.",
        "ko": "모두 듣게 전하여라.",
        "zh": "向人宣告這好消息。",
        "en": "Good news we tell for all to hear.",
        "ja": "く心は高鳴る"
      },
      {
        "vi": "Nào mình cùng ngước đầu hướng trông Cha giải cứu ta.",
        "ko": "머리 들고 구원을 바라보라.",
        "zh": "熱切期盼耶和華採取行動，",
        "en": "Lift up your heads, and look to your salvation;",
        "ja": "告げよう希望の知らせ"
      },
      {
        "vi": "Chẳng còn lâu nữa ngày Cha sẽ đến!",
        "ko": "구출의 때 가까웠네!",
        "zh": "得救的日子在前頭！",
        "en": "Time for deliverance is near!",
        "ja": "喜び分け合おう"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Vui thích nơi Cha mang lại cho ta sức mạnh.",
        "ko": "여호와의 기쁨 산성이니",
        "zh": "上帝所賜喜樂給我力量，",
        "en": "The joy of Jehovah is our stronghold.",
        "ja": "エホバからの"
      },
      {
        "vi": "Cùng cất tiếng ca reo vang mọi nơi.",
        "ko": "큰 소리로 노래하라.",
        "zh": "向他高聲歡呼歌唱！",
        "en": "Sing loud, and raise a joyful cry.",
        "ja": "喜び力湧く泉"
      },
      {
        "vi": "Vui sướng tạ ơn Cha ban ta tương lai tươi sáng.",
        "ko": "희망 기뻐하고 감사드리며",
        "zh": "衷心感激他賜未來的希望，",
        "en": "Rejoice in the hope, and show a grateful heart,",
        "ja": "ほとばしるような"
      },
      {
        "vi": "Hãy khen ngợi Giê-hô-va đến muôn năm.",
        "ko": "모두 하느님 찬양하라.",
        "zh": "讚美至高上帝耶和華。",
        "en": "All give praise and laud our God on high.",
        "ja": "賛美神に向かい歌う"
      },
      {
        "vi": "Vui thích nơi Cha mang lại cho ta sức mạnh.",
        "ko": "여호와의 기쁨 산성이니",
        "zh": "上帝所賜喜樂給我力量，",
        "en": "The joy of Jehovah is our stronghold.",
        "ja": "エホバからの"
      },
      {
        "vi": "Mọi nước phải nghe danh Cha hiển vinh.",
        "ko": "그 위대하심 알리라.",
        "zh": "將他聖名傳遍天下。",
        "en": "His greatness all must come to know.",
        "ja": "喜び力湧く泉"
      },
      {
        "vi": "Ta quyết hầu Vua trên cao, trung thành đến mãi mãi,",
        "ko": "우리 왕께 항상 정성 다하며",
        "zh": "一同崇拜偉大君王耶和華，",
        "en": "With constant devotion to our God and King,",
        "ja": "熱く輝く崇拝捧"
      },
      {
        "vi": "sướng vui khi làm theo ý Cha đời đời.",
        "ko": "기쁨으로 그분 섬기리.",
        "zh": "永遠喜樂忠貞敬奉他。",
        "en": "Godly joy in service we will show.",
        "ja": "げるいつまでも"
      },
      {
        "vi": "2. Lòng đầy sùng kính, mình hướng trông nơi Giê-hô-va.",
        "ko": "2. 사랑하는 여호와 바라보며",
        "zh": "2．所有全心愛戴耶和華的人，",
        "en": "2. Look to our God, you lovers of Jehovah.",
        "ja": "2．力と喜びの神エ"
      },
      {
        "vi": "Đừng sợ, vì Chúa quyền lớn lao thay.",
        "ko": "떨지 말고 힘을 내라.",
        "zh": "有他作為堅強後盾。",
        "en": "No need to fear, for he is strong.",
        "ja": "ホバをたたえる"
      },
      {
        "vi": "Nào mọi người hãy cùng cất tiếng vang rền khắp nơi,",
        "ko": "일어나서 큰 목소리로 함께",
        "zh": "一同前來向上帝高聲歡唱，",
        "en": "Stand up and shout with voices loud as thunder;",
        "ja": "雷鳴り響くよう"
      },
      {
        "vi": "hòa nhịp ca hát ngợi khen danh Chúa!",
        "ko": "하느님 찬송하여라!",
        "zh": "讚美歌聲響徹四方。",
        "en": "Sing to our God a joyful song!",
        "ja": "に大きな声上げて"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Vui thích nơi Cha mang lại cho ta sức mạnh.",
        "ko": "여호와의 기쁨 산성이니",
        "zh": "上帝所賜喜樂給我力量，",
        "en": "The joy of Jehovah is our stronghold.",
        "ja": "エホバからの"
      },
      {
        "vi": "Cùng cất tiếng ca reo vang mọi nơi.",
        "ko": "큰 소리로 노래하라.",
        "zh": "向他高聲歡呼歌唱！",
        "en": "Sing loud, and raise a joyful cry.",
        "ja": "喜び力湧く泉"
      },
      {
        "vi": "Vui sướng tạ ơn Cha ban ta tương lai tươi sáng.",
        "ko": "희망 기뻐하고 감사드리며",
        "zh": "衷心感激他賜未來的希望，",
        "en": "Rejoice in the hope, and show a grateful heart,",
        "ja": "ほとばしるような"
      },
      {
        "vi": "Hãy khen ngợi Giê-hô-va đến muôn năm.",
        "ko": "모두 하느님 찬양하라.",
        "zh": "讚美至高上帝耶和華。",
        "en": "All give praise and laud our God on high.",
        "ja": "賛美神に向かい歌う"
      },
      {
        "vi": "Vui thích nơi Cha mang lại cho ta sức mạnh.",
        "ko": "여호와의 기쁨 산성이니",
        "zh": "上帝所賜喜樂給我力量，",
        "en": "The joy of Jehovah is our stronghold.",
        "ja": "エホバからの"
      },
      {
        "vi": "Mọi nước phải nghe danh Cha hiển vinh.",
        "ko": "그 위대하심 알리라.",
        "zh": "將他聖名傳遍天下。",
        "en": "His greatness all must come to know.",
        "ja": "喜び力湧く泉"
      },
      {
        "vi": "Ta quyết hầu Vua trên cao, trung thành đến mãi mãi,",
        "ko": "우리 왕께 항상 정성 다하며",
        "zh": "一同崇拜偉大君王耶和華，",
        "en": "With constant devotion to our God and King,",
        "ja": "熱く輝く崇拝捧"
      },
      {
        "vi": "sướng vui khi làm theo ý Cha đời đời.",
        "ko": "기쁨으로 그분 섬기리.",
        "zh": "永遠喜樂忠貞敬奉他。",
        "en": "Godly joy in service we will show.",
        "ja": "げるいつまでも"
      }
    ],
    "reference": {
      "vi": "(Cũng xem 1 Sử 16:27; Thi 112:4; Lu 21:28; Giăng 8:52).",
      "ko": "(역대기상 16:27; 시 112:4; 누가 21:28; 요한 8:32 참조)",
      "zh": "（參看代上16：27；詩112：4；路21：28；約8：32）",
      "en": "(See also 1 Chron. 16:27; Ps. 112:4; Luke 21:28; John 8:32.)",
      "ja": "（代一16：27；詩112：4；ルカ21：28；ヨハ8：32も参照。）"
    }
  },
  {
    "number": 111,
    "sourceSheet": "111",
    "labels": {
      "vi": "BÀI HÁT 111",
      "ko": "111번",
      "zh": "詩歌第111首",
      "en": "SONG 111",
      "ja": "111番"
    },
    "title": {
      "vi": "Những lý do khiến chúng ta vui mừng",
      "ko": "우리를기쁘게 하는 일들",
      "zh": "喜樂的理由",
      "en": "Our Reasons for Joy",
      "ja": "喜びはあふれる"
    },
    "scripture": {
      "vi": "(Ma-thi-ơ 5:12)",
      "ko": "(마태복음 5:12)",
      "zh": "（馬太福音5：12）",
      "en": "(Matthew 5:12)",
      "ja": "（マタイ5：12）"
    },
    "lines": [
      {
        "vi": "1. Tâm ta mừng vui bởi bao nhiêu lý do,",
        "ko": "1. 늘어나는 보물과 같이",
        "zh": "1．天天有數不盡的理由，",
        "en": "1. Our reasons for joy are abundant,",
        "ja": "1．エホバの祝福"
      },
      {
        "vi": "cứ mỗi ngày lớn mãi luôn không ngừng.",
        "ko": "기뻐할 일 넘친다네.",
        "zh": "讓喜樂洋溢在心中。",
        "en": "Like riches increasing in worth.",
        "ja": "に心は高鳴る"
      },
      {
        "vi": "Bao nhiêu người muôn phương yêu chân lý Cha",
        "ko": "모든 나라 보배 몰려와",
        "zh": "我們能與萬國的珍寶，",
        "en": "Those precious to God from all nations",
        "ja": "神を愛する人"
      },
      {
        "vi": "nay đến ca khen Cha với dân ngoài.",
        "ko": "우리 곁에 함께하네.",
        "zh": "一起做上帝的朋友。",
        "en": "Are joining us in all the earth.",
        "ja": "仲間に加わる"
      },
      {
        "vi": "Trong ta niềm vui sâu xa do đắp xây",
        "ko": "마음에서 솟는 이 기쁨,",
        "zh": "要努力在真理中扎根，",
        "en": "The joy in our heart is well-founded,",
        "ja": "神の言葉からの"
      },
      {
        "vi": "nơi bao lời Cha ta xem đêm ngày.",
        "ko": "그 근원은 주의 말씀.",
        "zh": "喜樂的心不會消沉。",
        "en": "With roots reaching deep in God's Word.",
        "ja": "教え日々受けて"
      },
      {
        "vi": "Ta luôn được Cha khuyên răn qua Thánh Kinh,",
        "ko": "주 가르침 매일 들으면",
        "zh": "天天都聽從上帝話語，",
        "en": "We daily partake of its teachings;",
        "ja": "信仰強くな"
      },
      {
        "vi": "vun đắp đức tin khi lắng nghe ngài.",
        "ko": "강한 믿음 생긴다네.",
        "zh": "我們信念不斷加深。",
        "en": "Faith follows the things we have heard.",
        "ja": "り喜び高まる"
      },
      {
        "vi": "Ngập tràn vui sướng vì vô số điều quý,",
        "ko": "마음 깊이 자리한 기쁨,",
        "zh": "我們享有無窮的喜樂，",
        "en": "Our causes for joy are deep-seated,",
        "ja": "喜びの炎は"
      },
      {
        "vi": "như lửa thiêu đốt lòng ta không ngớt.",
        "ko": "타고 있는 불씨 같네.",
        "zh": "像烈火在心裡燃燒。",
        "en": "Like embers that burn in our hearts.",
        "ja": "心に燃え立つ"
      },
      {
        "vi": "Cho dù gian khó bủa vây khắp bao phía,",
        "ko": "역경으로 힘겨울 때도",
        "zh": "雖然歷盡考驗和艱辛，",
        "en": "Though troubles and trials beset us,",
        "ja": "苦難の中でさえ"
      },
      {
        "vi": "Chúa sẽ ban cho ta sức đương đầu.",
        "ko": "주 힘으로 인내하네.",
        "zh": "卻得力量忍受煎熬。",
        "en": "Endurance Jehovah imparts.",
        "ja": "消えることはない"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Đời mình vui khi có Giê-hô-va,",
        "ko": "주 여호와, 우리 기쁨.",
        "zh": "耶和華是我的喜樂，",
        "en": "Jehovah our God is our joy,",
        "ja": "エホバは喜"
      },
      {
        "vi": "lòng sướng vui nhìn ngắm công lao Cha.",
        "ko": "그 하신 일 기쁨 주네.",
        "zh": "我要頌揚他的大能！",
        "en": "The work of his hands our delight.",
        "ja": "び私の喜び"
      },
      {
        "vi": "Việc Chúa ôi thật lớn, ý Chúa sâu khôn cùng.",
        "ko": "주 깊은 생각, 주 놀라운 일,",
        "zh": "他作為奇妙，他意念高深，",
        "en": "How deep are his thoughts, how great are his works,",
        "ja": "心からたたえよう"
      },
      {
        "vi": "Nhân đức Cha bao la không ai bằng!",
        "ko": "선함과 위력 넘치네!",
        "zh": "我要因他歡欣快樂！",
        "en": "Abounding in goodness and might!",
        "ja": "偉大なエホバを"
      },
      {
        "vi": "2. Bao công trình Cha ta xem vui xiết bao,",
        "ko": "2. 저 하늘과 바다와 온 땅",
        "zh": "2．細察上帝所造的一切，",
        "en": "2. We gladly behold his productions,",
        "ja": "2．美しい地球に"
      },
      {
        "vi": "mênh mông trời mây, núi non, muôn loài.",
        "ko": "우리 눈을 사로잡네.",
        "zh": "深思他奇妙的作為，",
        "en": "The heavens, the sea, and the land.",
        "ja": "あふれる命も"
      },
      {
        "vi": "Xem công việc Cha trên cao, dưới đất này,",
        "ko": "창조의 책 살펴보면서,",
        "zh": "日月繁星和大地海洋，",
        "en": "We gaze at the book of creation,",
        "ja": "広大な宇宙もエ"
      },
      {
        "vi": "†a biết ơn sâu xa công lao ngài.",
        "ko": "하신 일에 경탄하네.",
        "zh": "令人驚嘆上帝力量。",
        "en": "Applauding the work of his hands.",
        "ja": "ホバをたたえる"
      },
      {
        "vi": "Ta vui mừng, hân hoan khi đi giảng rao",
        "ko": "소리 높여 증거 행하며",
        "zh": "我們樂於向人作見證，",
        "en": "Triumphantly we now bear witness,",
        "ja": "さあ伝えていこ"
      },
      {
        "vi": "cho bao người ngay lắng nghe tin mừng:",
        "ko": "주 왕국을 선포하네.",
        "zh": "熱心宣揚上帝王國。",
        "en": "Proclaiming the Kingdom of God.",
        "ja": "う明るい未来を"
      },
      {
        "vi": "Nay Vua Giê-su đang trên ngôi Nước Cha,",
        "ko": "왕국 탄생 온 땅에 알려",
        "zh": "唯有王國能造福萬民，",
        "en": "The news of its birth and its blessings,",
        "ja": "王国の祝福世"
      },
      {
        "vi": "mang đến tương lai tươi sáng, huy hoàng.",
        "ko": "우리 기쁨 넘친다네.",
        "zh": "全心參與傳道工作。",
        "en": "We joyously spread all abroad.",
        "ja": "界に告げよう"
      },
      {
        "vi": "Tựa bình minh ló dạng khi đến ngày mới,",
        "ko": "밤 지나고 낮이 곧 오면",
        "zh": "還有片刻邪惡快絕跡，",
        "en": "Eternal rejoicing approaches,",
        "ja": "永遠の喜びい"
      },
      {
        "vi": "bao điều Cha hứa rồi đây sẽ đến.",
        "ko": "영원토록 기뻐하리.",
        "zh": "黑夜過後就是黎明。",
        "en": "Like daylight that follows the night.",
        "ja": "よいよ近づく"
      },
      {
        "vi": "Hy vọng nơi Nước Trời ta vẫn gìn giữ",
        "ko": "약속하신 새 하늘, 새 땅",
        "zh": "上帝將帶來新天新地，",
        "en": "The promised new earth and new heavens",
        "ja": "暗い夜は明けて"
      },
      {
        "vi": "sắp đến mang an vui khắp địa cầu.",
        "ko": "영원한 기쁨 주리라.",
        "zh": "讓人永享喜樂歡欣。",
        "en": "Will bring everlasting delight.",
        "ja": "全てが輝く"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Đời mình vui khi có Giê-hô-va,",
        "ko": "주 여호와, 우리 기쁨.",
        "zh": "耶和華是我的喜樂，",
        "en": "Jehovah our God is our joy,",
        "ja": "エホバは喜"
      },
      {
        "vi": "lòng sướng vui nhìn ngắm công lao Cha.",
        "ko": "그 하신 일 기쁨 주네.",
        "zh": "我要頌揚他的大能！",
        "en": "The work of his hands our delight.",
        "ja": "び私の喜び"
      },
      {
        "vi": "Việc Chúa ôi thật lớn, ý Chúa sâu khôn cùng.",
        "ko": "주 깊은 생각, 주 놀라운 일,",
        "zh": "他作為奇妙，他意念高深，",
        "en": "How deep are his thoughts, how great are his works,",
        "ja": "心からたたえよう"
      },
      {
        "vi": "Nhân đức Cha bao la không ai bằng!",
        "ko": "선함과 위력 넘치네!",
        "zh": "我要因他歡欣快樂！",
        "en": "Abounding in goodness and might!",
        "ja": "偉大なエホバを"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Phục 16:15; Ê-sai 12:6; Giăng 15:11).",
      "ko": "(신명 16:15; 이사야 12:6; 요한 15:11 참조)",
      "zh": "（參看申16：15；賽12：6；約15：11）",
      "en": "(See also Deut. 16:15; Isa. 12:6; John 15:11.)",
      "ja": "（申 16:15; イザ 12:6; ヨハ 15:11も参照。）"
    }
  },
  {
    "number": 112,
    "sourceSheet": "112",
    "labels": {
      "vi": "BÀI HÁT 112",
      "ko": "112번",
      "zh": "詩歌第112首",
      "en": "SONG 112",
      "ja": "112番"
    },
    "title": {
      "vi": "Giê-hô-va là Đức Chúa Trời bình an",
      "ko": "여호와, 평화의 하느님",
      "zh": "賜平安的上帝耶和華",
      "en": "Jehovah,God of Peace",
      "ja": "エホバは平和の神"
    },
    "scripture": {
      "vi": "(Phi-líp 4:9)",
      "ko": "(빌립보서 4:9)",
      "zh": "（腓立比書4：9）",
      "en": "(Philippians 4:9)",
      "ja": "（フィリピ4：9）"
    },
    "lines": [
      {
        "vi": "1. Lạy Cha là Giê-hô-va,",
        "ko": "1. 평화 약속하신",
        "zh": "1．仁愛的耶和華，",
        "en": "1. Jehovah, God of love,",
        "ja": "1．平和の神愛"
      },
      {
        "vi": "ngài đã hứa ban xuống an bình.",
        "ko": "사랑의 주 하느님,",
        "zh": "懇求你賜予力量，",
        "en": "You have promised us your peace.",
        "ja": "するエホバ"
      },
      {
        "vi": "Chúng con xin ngài giúp luôn vun trồng",
        "ko": "당신의 영 청하오니,",
        "zh": "我們渴望享有和平，",
        "en": "So we ask you for your spirit;",
        "ja": "与えてくだ"
      },
      {
        "vi": "thêm bông trái mà Cha yêu mến.",
        "ko": "열매 맺게 하소서.",
        "zh": "培養出美好品行。",
        "en": "May its fruitage yet increase.",
        "ja": "さい聖なる力"
      },
      {
        "vi": "Thuở trước Cha phái Con một",
        "ko": "당신의 아들을",
        "zh": "耶穌多麼忠心，",
        "en": "Our faith in your dear Son,",
        "ja": "イエスにより"
      },
      {
        "vi": "chịu đau đớn đề cứu nhân loại.",
        "ko": "우리 진정 믿으니,",
        "zh": "帶領人與你親近，",
        "en": "Who is loyal, ever true,",
        "ja": "あなたに語る"
      },
      {
        "vi": "Bởi tin nơi ngài, chúng con nay được",
        "ko": "하느님의 벗이 되어",
        "zh": "我們對他滿懷信心，",
        "en": "Gives us access to your friendship;",
        "ja": "心は安らぎ満"
      },
      {
        "vi": "đến với Cha, kết dây hòa thuận.",
        "ko": "평화 누리리이다.",
        "zh": "能與你建立友誼。",
        "en": "We are now at peace with you.",
        "ja": "たされていく"
      },
      {
        "vi": "2. Lời Chúa soi sáng con đường,",
        "ko": "2. 주 말씀 배우면",
        "zh": "2．黑暗的世界裡，",
        "en": "2. Your spirit aids our sight",
        "ja": "2．希望のない"
      },
      {
        "vi": "thần khí thánh đưa dẫn không rời.",
        "ko": "우리 눈 밝아지고",
        "zh": "依靠你保護、指引，",
        "en": "As your Word gives needed light.",
        "ja": "暗い世界で"
      },
      {
        "vi": "Thế nên dân ngài sống trong an bình",
        "ko": "칠흑 같은 세상에서",
        "zh": "你的話語綻放光芒，",
        "en": "We are guided and protected",
        "ja": "あなたの言"
      },
      {
        "vi": "dù muôn lối hiểm nguy, tăm tối.",
        "ko": "보호받게 됩니다.",
        "zh": "為我們照亮前方。",
        "en": "In a world as dark as night.",
        "ja": "葉は光り輝く"
      },
      {
        "vi": "Gần đến giây phút Cha định,",
        "ko": "전쟁과 두려움",
        "zh": "求你賜予力量，",
        "en": "Until the time has come",
        "ja": "争い皆過ぎ去る日"
      },
      {
        "vi": "mọi đau khổ, than khóc không còn.",
        "ko": "사라질 그날까지",
        "zh": "助我們維繫和平，",
        "en": "When all wars and terrors cease,",
        "ja": "まで守っ"
      },
      {
        "vi": "Chúng con nay nguyện giữ dây an bình,",
        "ko": "우리 노력 축복하여",
        "zh": "滿心期盼天下太平，",
        "en": "May your spirit bless our efforts",
        "ja": "てください"
      },
      {
        "vi": "xin Chúa ban phước ân dồi dào.",
        "ko": "평화 지켜 주소서.",
        "zh": "不再有戰爭、罪行。",
        "en": "To maintain our godly peace.",
        "ja": "心の平和"
      },
      {
        "vi": "3. Ngài đã thu nhóm muôn vật,",
        "ko": "3. 주 사랑하는 자",
        "zh": "3．天上地上子民，",
        "en": "3. You've gathered those you love,",
        "ja": "3．平和満ちる"
      },
      {
        "vi": "dù trên đất hay ở trên trời.",
        "ko": "여호와 모으시니,",
        "zh": "都受你的愛吸引，",
        "en": "Both in heaven and on earth,",
        "ja": "天にも地にも"
      },
      {
        "vi": "Quyết rao tin mừng khắp nơi xa gần",
        "ko": "우리 함께 연합하여",
        "zh": "合力宣揚王國建立，",
        "en": "We're united by your spirit",
        "ja": "あなたの統治"
      },
      {
        "vi": "trong vui sướng, bình an, hợp nhất.",
        "ko": "왕국을 알립니다.",
        "zh": "享和平、團結一心。",
        "en": "To proclaim the Kingdom's birth.",
        "ja": "が行き渡る時"
      },
      {
        "vi": "Ngày Nước của Chúa cai trị",
        "ko": "의로운 그 왕국,",
        "zh": "王國正義統治，",
        "en": "Your righteous Kingdom rule",
        "ja": "平和願う人たち"
      },
      {
        "vi": "chẳng còn thấy tranh chiến, đau buồn.",
        "ko": "모든 전쟁 없애고",
        "zh": "將終結一切戰事，",
        "en": "Soon will bring an end to war.",
        "ja": "全て喜び"
      },
      {
        "vi": "Những ai khiêm hòa sướng vui vô vàn",
        "ko": "온유한 자 영원토록",
        "zh": "謙和的人鼓舞歡欣，",
        "en": "Then the meek ones will delight to",
        "ja": "あふれる"
      },
      {
        "vi": "khi sống trong phước ân địa đàng.",
        "ko": "평화 얻게 하소서.",
        "zh": "終看見和平來臨。",
        "en": "Live in peace forevermore.",
        "ja": "いつの日までも"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 4:8; Phi-líp 4:6, 7; 1 Tê 5:25).",
      "ko": "(시 4:8; 빌립보 4:6, 7; 데살로니가 전서 5:23 참조)",
      "zh": "（參看詩4：8；腓4：6，7；帖前5：23）",
      "en": "(See also Ps. 4:8; Phil. 4:6, 7; 1 Thess. 5:23.)",
      "ja": "（詩4：8；フィリ4：6，7；テサ一5：23も参照。）"
    }
  },
  {
    "number": 113,
    "sourceSheet": "113",
    "labels": {
      "vi": "BÀI HÁT 113",
      "ko": "113번",
      "zh": "詩歌第113首",
      "en": "SONG 113",
      "ja": "113番"
    },
    "title": {
      "vi": "ll5 Sự bình an của dân Đức Chúa Trời",
      "ko": "평화—우리의 소유",
      "zh": "我們享有和平",
      "en": "Our Possession of Peace",
      "ja": "私たちの平和"
    },
    "scripture": {
      "vi": "(Giăng 14:27)",
      "ko": "(요한복음 14:27)",
      "zh": "（約翰福音14：27）",
      "en": "(John 14:27)",
      "ja": "（ヨハネ14：27）"
    },
    "lines": [
      {
        "vi": "1. Giê-hô-va là Chúa an bình,",
        "ko": "1. 찬양하라,",
        "zh": "1．讚美耶和華上帝，",
        "en": "1. Praise Jehovah, God of peace,",
        "ja": "1．平和の神と"
      },
      {
        "vi": "đấng ghét sự rẽ chia.",
        "ko": "평화의 우리 하느님.",
        "zh": "他喜愛和平，",
        "en": "God of unity.",
        "ja": "キリストは"
      },
      {
        "vi": "Ngài dẹp yên giặc giã nay mai,",
        "ko": "모든 전쟁",
        "zh": "他將使戰爭平息，",
        "en": "He will make all wars to cease,",
        "ja": "一致の絆"
      },
      {
        "vi": "đem an bình khắp nơi.",
        "ko": "없애고 평화 주시리.",
        "zh": "大地享安寧。",
        "en": "Bring in harmony.",
        "ja": "作り出す"
      },
      {
        "vi": "Hòa bình đến do Vua Giê-su,",
        "ko": "평화의 군왕",
        "zh": "耶穌是和平領袖，",
        "en": "Prince of Peace is Christ his Son,",
        "ja": "ハルマゲド"
      },
      {
        "vi": "ngài trìu mến, yêu thương.",
        "ko": "예수 의를 위하여",
        "zh": "仁愛又賢明，",
        "en": "Tender, calm, and kind.",
        "ja": "ンの戦いで"
      },
      {
        "vi": "Ngày toàn thắng mai đây mang lại",
        "ko": "전쟁에서",
        "zh": "他必定伸張正義，",
        "en": "When the fight for right he's won,",
        "ja": "勝利収め"
      },
      {
        "vi": "bình an mãi không thôi.",
        "ko": "이기고 화합 이루리.",
        "zh": "讓天下太平。",
        "en": "Perfect peace we'll find.",
        "ja": "る日は近い"
      },
      {
        "vi": "2. Mình lìa xa lời nói cay nghiệt,",
        "ko": "2. 더는 화내지",
        "zh": "2．我們以和平代",
        "en": "2. We have left off angry words,",
        "ja": "2．怒り争い"
      },
      {
        "vi": "mối bất hòa với nhau.",
        "ko": "않고 다툼 그치며",
        "zh": "替傷人的武器，",
        "en": "Making quarrels cease.",
        "ja": "捨て去って"
      },
      {
        "vi": "Giờ mình đã rèn giáo với gươm",
        "ko": "창과 칼을",
        "zh": "決心不口出惡言，",
        "en": "We have made from spears and swords,",
        "ja": "もはや戦"
      },
      {
        "vi": "nên lưỡi liềm bấy lâu.",
        "ko": "녹여서 평화 이루네.",
        "zh": "不挑起是非。",
        "en": "Implements of peace.",
        "ja": "い学ばない"
      },
      {
        "vi": "Vậy mình hãy khoan dung cho nhau,",
        "ko": "우린 평화",
        "zh": "我們是基督門徒，",
        "en": "If this peace we want to keep,",
        "ja": "人を許し"
      },
      {
        "vi": "hòa thuận, giữ yên vui.",
        "ko": "배우며 살아가리니,",
        "zh": "聽從他吩咐，",
        "en": "Then we must forgive.",
        "ja": "て愛示し"
      },
      {
        "vi": "Hiền hòa giống như chiên của ngài,",
        "ko": "용서하는",
        "zh": "若彼此甘心寬恕，",
        "en": "Peacefully as Jesus' sheep,",
        "ja": "平和の神"
      },
      {
        "vi": "bình an giữa anh em.",
        "ko": "사람은 평화 누리리.",
        "zh": "必享有和睦。",
        "en": "May we learn and live.",
        "ja": "に栄光を"
      },
      {
        "vi": "3. Sự bình an ngự giữa dân ngài",
        "ko": "3. 하느님의",
        "zh": "3．我們受上帝嘉許，",
        "en": "3. Peace from God gives proof to all;",
        "ja": "3．エホバの知"
      },
      {
        "vi": "bởi chính ngài xuống ơn.",
        "ko": "평화를 계속 구하며",
        "zh": "能享有和平，",
        "en": "He has blessed our way.",
        "ja": "恵に従えば"
      },
      {
        "vi": "Mình nguyện vui mừng bước theo Cha,",
        "ko": "주의 계명",
        "zh": "隨時都甘心樂意，",
        "en": "His commands we gladly keep,",
        "ja": "神の祝福"
      },
      {
        "vi": "luôn vâng lời hết tâm.",
        "ko": "기꺼이 순종하리라.",
        "zh": "服從他命令。",
        "en": "Ready to obey.",
        "ja": "注がれる"
      },
      {
        "vi": "Hằng ngày sống yêu thương bên nhau,",
        "ko": "왕국 평화 온",
        "zh": "我們以言行表",
        "en": "We would recommend our way,",
        "ja": "平和豊かな"
      },
      {
        "vi": "hòa thuận với anh em.",
        "ko": "땅에 넘칠 때까지",
        "zh": "明對人的關心，",
        "en": "Show our peaceful care",
        "ja": "パラダイス"
      },
      {
        "vi": "Chờ ngày Nước trên cao mang lại",
        "ko": "평화로운 이",
        "zh": "直到大日子來臨，",
        "en": "Till the Kingdom's perfect day",
        "ja": "共に生き"
      },
      {
        "vi": "bình an khắp muôn nơi.",
        "ko": "길을 널리 전하리.",
        "zh": "和平遍四境。",
        "en": "Brings peace ev'rywhere.",
        "ja": "よう永遠に"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 46:9; Ê-sai 2:4; Gia 5:17, 18).",
      "ko": "(시 46:9; 이사야 2:4; 야고보 3:17, 18 참조)",
      "zh": "（參看詩46：9；賽2：4；雅3：17，18）",
      "en": "(See also Ps. 46:9; Isa. 2:4; Jas. 3:17, 18.)",
      "ja": "（詩46：9；イザ2：4；ヤコ3：17，18も参照。）"
    }
  },
  {
    "number": 114,
    "sourceSheet": "114",
    "labels": {
      "vi": "BÀI HÁT 114",
      "ko": "114번",
      "zh": "詩歌第114首",
      "en": "SONG 114",
      "ja": "114番"
    },
    "title": {
      "vi": "11A4 “Hãy kiên nhẫn”",
      "ko": "오래 참음",
      "zh": "要有耐心",
      "en": "“Exercise Patience”",
      "ja": "辛抱強さを示しましょう"
    },
    "scripture": {
      "vi": "(Gia-cơ 5:8)",
      "ko": "(야고보서 5:8)",
      "zh": "（雅各書5：8）",
      "en": "(James 5:8)",
      "ja": "（ヤコブ5：8）"
    },
    "lines": [
      {
        "vi": "1. Giê-hô-va, Vua ngự trên cao,",
        "ko": "1. 거룩한 이름 위해",
        "zh": "1．耶和華至高上帝",
        "en": "1. Our Sov'reign Lord Jehovah",
        "ja": "1．遠い過去から"
      },
      {
        "vi": "Cha mong làm sáng danh ngài hiển vinh.",
        "ko": "여호와 참아 오셨네.",
        "zh": "熱心維護他的名聲，",
        "en": "Is zealous for his holy name.",
        "ja": "今日この時まで"
      },
      {
        "vi": "Rồi mai đây ngài sẽ xóa hết",
        "ko": "부당한 모욕들을",
        "zh": "他渴望自己的名",
        "en": "He fervently desires",
        "ja": "多くの人は神"
      },
      {
        "vi": "bao nhiêu sự xúc phạm danh thánh khiết.",
        "ko": "깨끗이 씻어 내려고",
        "zh": "不受污衊彰顯為聖。",
        "en": "To clear it from unrighteous blame.",
        "ja": "に背を向けた"
      },
      {
        "vi": "Nhiều thế kỷ, Cha chẳng mỏi mệt",
        "ko": "긴 세월 오랫동안",
        "zh": "一代又一代過去，",
        "en": "Through many generations,",
        "ja": "それでも神は"
      },
      {
        "vi": "mà kiên nhẫn để ta được cứu.",
        "ko": "참고 인내하셨네.",
        "zh": "他表現無比耐心，",
        "en": "Great endurance he has shown;",
        "ja": "望み捨てない"
      },
      {
        "vi": "Vì yêu thương nên ngài ban ơn",
        "ko": "지치지 않으시고",
        "zh": "他從未感到厭煩，",
        "en": "In loving, kindly patience,",
        "ja": "愛示すこ"
      },
      {
        "vi": "cho muôn người trên khắp đất",
        "ko": "사랑 보이셨네.",
        "zh": "滿懷愛心等待。",
        "en": "Not weary has he grown.",
        "ja": "と諦めない"
      },
      {
        "vi": "được hay tin ngày Cha cứu rỗi,",
        "ko": "주 뜻은 모두에게",
        "zh": "耶和華上帝定意，",
        "en": "His will is that salvation",
        "ja": "命の希望ひた"
      },
      {
        "vi": "đến với dân Cha, chọn theo chân lý.",
        "ko": "구원의 기회 주는 것.",
        "zh": "讓人得永遠的生命，",
        "en": "All sorts of people might attain.",
        "ja": "すら差し伸べ"
      },
      {
        "vi": "Cha chắc chắn thi hành ý định",
        "ko": "하느님 오래 참음",
        "zh": "為拯救各樣的人，",
        "en": "Long-lasting, loving patience",
        "ja": "今日もエホバ"
      },
      {
        "vi": "sau bao ngàn năm kiên nhẫn, từ nhân.",
        "ko": "결코 헛되지 않으리.",
        "zh": "他始終都保持堅忍。",
        "en": "By God will not have been in vain.",
        "ja": "は辛抱している"
      },
      {
        "vi": "2. Nguyện noi gương Cha Giê-hô-va",
        "ko": "2. 참을성 기르면서",
        "zh": "2．要一生敬奉上帝，",
        "en": "2. The quality of patience",
        "ja": "2．時に傷つき"
      },
      {
        "vi": "sao cho được mãi đi trong đường Cha.",
        "ko": "하느님 닮아 간다면",
        "zh": "我們必須表現耐心。",
        "en": "Will help us on our godly path.",
        "ja": "心が乱れて"
      },
      {
        "vi": "Dù ai gây thù hay kết oán,",
        "ko": "마음에 평온 얻고",
        "zh": "忍耐能使人平靜，",
        "en": "It lets our heart be tranquil,",
        "ja": "眠れない夜過"
      },
      {
        "vi": "ta không hề nóng giận nhưng kiên nhẫn.",
        "ko": "성내지 않게 되리라.",
        "zh": "包容錯誤、消除怒氣。",
        "en": "Protects us from unrighteous wrath.",
        "ja": "ごしているとき"
      },
      {
        "vi": "Mọi anh em, ta nhìn tích cực,",
        "ko": "좋은 점 서로 찾고",
        "zh": "要耐心對待別人，",
        "en": "It finds the good in others,",
        "ja": "考えてみる"
      },
      {
        "vi": "chẳng ghi nhớ những chỉ lầm lỗi.",
        "ko": "서로 축복해 주리.",
        "zh": "多稱讚，給予肯定。",
        "en": "Always hoping for the best.",
        "ja": "エホバの辛抱"
      },
      {
        "vi": "Dù gian nan, đau khổ vây quanh",
        "ko": "괴로움 겪을 때도",
        "zh": "縱然會憂傷難過，",
        "en": "It helps us keep our balance",
        "ja": "確かめてみ"
      },
      {
        "vi": "nhưng ta bình tâm, vững chí.",
        "ko": "흔들림 없으리.",
        "zh": "仍舊喜樂等候。",
        "en": "In times when we're distressed.",
        "ja": "る神の思い"
      },
      {
        "vi": "Cùng với rất nhiều đức tính khác",
        "ko": "성령에 힘입어서",
        "zh": "上帝會幫助我們",
        "en": "Along with other virtues",
        "ja": "エホバ私に"
      },
      {
        "vi": "gắng sức trau dồi nhờ thần khí thánh,",
        "ko": "좋은 특성들 기르며",
        "zh": "培養各種美好品德。",
        "en": "That holy spirit can bestow,",
        "ja": "力を下さい"
      },
      {
        "vi": "ta mong sao luôn tập nhẫn nhịn,",
        "ko": "늘 오래 참는다면",
        "zh": "我們要忍耐到底，",
        "en": "Our patience will assist us",
        "ja": "辛抱強さを"
      },
      {
        "vi": "noi gương của Cha trong suốt đời ta.",
        "ko": "하느님 닮게 되리라.",
        "zh": "決心努力效法上帝。",
        "en": "To imitate the God we know.",
        "ja": "表せるように"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Xuất 54:14; Ê-sai 40:28; 1 Cô 15:4, 7; 1 Tỉ 2:4).",
      "ko": "(출애굽 34:14; 이사야 40:28; 고린도 전서 13:4, 7; 디모데 전서 2:4 참조)",
      "zh": "（參看出34：14；賽40：28；林前13：4，7；提前2：4）",
      "en": "(See also Ex. 34:14; Isa. 40:28; 1 Cor. 13:4, 7; 1 Tim. 2:4.)",
      "ja": "（出34：14；イザ40：28；コリ一13：4，7；テモ一2：4も参照。）"
    }
  },
  {
    "number": 115,
    "sourceSheet": "115",
    "labels": {
      "vi": "BÀI HÁT 115",
      "ko": "115번",
      "zh": "詩歌第115首",
      "en": "SONG 115",
      "ja": "115番"
    },
    "title": {
      "vi": "Biết ơn Đức Chúa Trời vì sự kiên nhẫn của ngài ",
      "ko": "하느님의 참으심에감사하리",
      "zh": "感激上帝表現耐心",
      "en": "Gratitude for Divine Patience",
      "ja": "神の辛抱に対する感謝"
    },
    "scripture": {
      "vi": "(2 Phi-e-rơ 35:15)",
      "ko": "(베드로 후서 3:15)",
      "zh": "（彼得後書3：15）",
      "en": "(2 Peter 3:15)",
      "ja": "（ペテロ第二3：15）"
    },
    "lines": [
      {
        "vi": "1. Cha Giê-hô-va quyền năng to lớn thay!",
        "ko": "1. 무한한 위력의 하느님,",
        "zh": "1．偉大上帝，你力量無窮，",
        "en": "1. Great God, Jehovah, boundless in might,",
        "ja": "1．ため息出るよう"
      },
      {
        "vi": "Cha yêu công chính, chúng con đều hay.",
        "ko": "의로운 주 여호와여,",
        "zh": "熱愛正義，痛恨不公。",
        "en": "You have made known your love of right.",
        "ja": "な日々の苦しみを"
      },
      {
        "vi": "Nơi nơi trên đất ác gian tràn lan,",
        "ko": "이 땅에 악이 가득해",
        "zh": "世界充斥罪行暴力，",
        "en": "Badness prevails on earth below,",
        "ja": "誰よりも神が"
      },
      {
        "vi": "Cha đau lòng thấy nhiều người than khóc.",
        "ko": "우리의 아픔 큽니다.",
        "zh": "我們受苦，令你痛心。",
        "en": "Causing us pain, as you well know.",
        "ja": "辛抱している"
      },
      {
        "vi": "Rồi ngày gần đây Cha phán xét muôn dân;",
        "ko": "당신은 늦지 않으시니",
        "zh": "你已決定將禍害終結，",
        "en": "You are not slow, as men may contend;",
        "ja": "エホバの時は来る"
      },
      {
        "vi": "sẽ chẳng trễ như bao nhiêu người tưởng lầm.",
        "ko": "악을 곧 끝내시리이다.",
        "zh": "必執行判決不會遲延。",
        "en": "Your time is near for patience to end.",
        "ja": "遅れることはない"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Lòng chúng con mong chờ đến tương lai,",
        "ko": "되찾은 희망 가지고",
        "zh": "我們瞻望未來前景，",
        "en": "We look ahead with hope renewed,",
        "ja": "未来を見つめて"
      },
      {
        "vi": "quyết khen ngợi ngài, làm danh Chúa tỏa sáng.",
        "ko": "주 이름 찬양하리이다.",
        "zh": "充滿感謝讚美你聖名。",
        "en": "Praising your name in deep gratitude.",
        "ja": "感謝し歩みます"
      },
      {
        "vi": "2. Ôi Giê-hô-va, ngàn năm trong mắt Cha",
        "ko": "2. 천 년의 세월이 흘러도",
        "zh": "2．千年時光在上帝眼前，",
        "en": "2. One thousand years, from your point of view,",
        "ja": "2．１日のように１"
      },
      {
        "vi": "trôi qua như chỉ có một ngày thôi. ",
        "ko": "하루로 보시는 주여,",
        "zh": "日月流轉恍如一天。",
        "en": "Are like a day when they are through.",
        "ja": "０００年を生きる"
      },
      {
        "vi": "Không bao lâu nữa ý Cha thực thị.",
        "ko": "주의 큰 날 다가오니",
        "zh": "世界末日飛快臨近，",
        "en": "Time now proceeds to your great day;",
        "ja": "時を計る方"
      },
      {
        "vi": "Cha không chậm trễ, ngày ngài sẽ đến.",
        "ko": "늦추지 않으십니다.",
        "zh": "必然來到，絕不誤期。",
        "en": "It will arrive without delay.",
        "ja": "約束を守る"
      },
      {
        "vi": "Lòng ngài chẳng vui khi thấy kẻ gian tham,",
        "ko": "당신은 죄를 미워하나",
        "zh": "你雖然憎恨罪惡腐敗，",
        "en": "Though all transgression you do resent,",
        "ja": "悔い改める人"
      },
      {
        "vi": "bởi thế thấy ai ăn năn thì Chúa mừng.",
        "ko": "회개하면 기뻐하시니,",
        "zh": "卻希望惡人真誠悔改。",
        "en": "Your heart is glad when sinners repent.",
        "ja": "神は待ち続ける"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Lòng chúng con mong chờ đến tương lai,",
        "ko": "되찾은 희망 가지고",
        "zh": "我們瞻望未來前景，",
        "en": "We look ahead with hope renewed,",
        "ja": "未来を見つめて"
      },
      {
        "vi": "quyết khen ngợi ngài, làm danh Chúa tỏa sáng.",
        "ko": "주 이름 찬양하리이다.",
        "zh": "充滿感謝讚美你聖名。",
        "en": "Praising your name in deep gratitude.",
        "ja": "感謝し歩みます"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Nê 9:30; Lu 15:7; 2 Phi 5:8, 9).",
      "ko": "(느헤미야 9:30; 누가 15:7; 베드로 후서 3:8, 9 참조)",
      "zh": "（參看尼9：30；路15：7；彼後3：8，9）",
      "en": "(See also Neh. 9:30; Luke 15:7; 2 Pet. 3:8, 9.)",
      "ja": "（ネヘ9：30；ルカ15：7；ペテ二3：8，9も参照。）"
    }
  },
  {
    "number": 116,
    "sourceSheet": "116",
    "labels": {
      "vi": "BÀI HÁT 116",
      "ko": "116번",
      "zh": "詩歌第116首",
      "en": "SONG 116",
      "ja": "116番"
    },
    "title": {
      "vi": "Sức mạnh của lòng nhân từ",
      "ko": "친절의 힘",
      "zh": "仁慈的力量",
      "en": "The Power of Kindness",
      "ja": "親切の力"
    },
    "scripture": {
      "vi": "(Ê-phê-sô 4:52)",
      "ko": "(에베소서 4:32)",
      "zh": "（以弗所書4：32）",
      "en": "(Ephesians 4:32)",
      "ja": "（エフェソス4：32）"
    },
    "lines": [
      {
        "vi": "1. Thành kính hát khen Cha mang danh Giê-hô-va.",
        "ko": "1. 사랑 많으신 주 여호와여,",
        "zh": "1．感謝耶和華，你賜下話語，",
        "en": "1. We praise you, Jehovah, deep from our hearts,",
        "ja": "1．心からたたえます"
      },
      {
        "vi": "Lời ngài soi sáng chúng con.",
        "ko": "찬양받으소서.",
        "zh": "讓我們認識你。",
        "en": "For in your Word we find",
        "ja": "深い知恵と"
      },
      {
        "vi": "Quyền bính Chúa vô song, khôn ngoan không ai bằng,",
        "ko": "지혜, 능력이 무한하셔도",
        "zh": "你力量充沛，有無窮智慧，",
        "en": "Your power supreme, your wisdom so great,",
        "ja": "天と地を包み込"
      },
      {
        "vi": "dù vậy Cha rất thương xót, từ nhân.",
        "ko": "항상 친절하십니다.",
        "zh": "卻顯愛心、仁慈體貼。",
        "en": "And yet you are loving and kind.",
        "ja": "むエホバの親切"
      },
      {
        "vi": "2. Thầy Lớn Chúa Giê-su kêu ai đang nhọc nhằn",
        "ko": "2. 마음 지친 자 모두 오라고",
        "zh": "2．人辛苦勞碌，渴望得安舒，",
        "en": "2. Your Son still invites those bruised by the world",
        "ja": "2．重い荷を共に"
      },
      {
        "vi": "bỏ lại lo lắng phía sau,",
        "ko": "예수 권하시며",
        "zh": "耶穌願意相助。",
        "en": "To leave their cares behind.",
        "ja": "負うイエスの愛"
      },
      {
        "vi": "nhận gánh Chúa Giê-su cho tâm vơi muộn phiền.",
        "ko": "‘함께 멍에를 메자' 하시니",
        "zh": "他性情溫和，他擔子輕省，",
        "en": "How kindly his yoke, how tender his heart,",
        "ja": "心地よく爽やか"
      },
      {
        "vi": "Ngài từ nhân khiến chiên dễ chịu thay.",
        "ko": "늘 새 힘을 얻습니다.",
        "zh": "親切誠懇，仁慈待人。",
        "en": "He's always refreshing and kind.",
        "ja": "で翼を得たよう"
      },
      {
        "vi": "3. Đời sống chúng con nay noi gương Giê-hô-va",
        "ko": "3. 하느님과 예수 바라보며",
        "zh": "3．上帝和耶穌立下好榜樣，",
        "en": "3. We see in our God and Jesus our Lord,",
        "ja": "3．神と子の親"
      },
      {
        "vi": "cùng người Con quý của Cha.",
        "ko": "두 분 닮아 가리.",
        "zh": "顯示仁慈力量。",
        "en": "The persons we should be.",
        "ja": "切が胸に迫る"
      },
      {
        "vi": "Nguyện mãi sống yêu thương, quan tâm, luôn nhân từ.",
        "ko": "그 친절의 힘 매우 강하니",
        "zh": "仁慈的特質能感動別人，",
        "en": "The power of kindness we can possess.",
        "ja": "他の人に届け"
      },
      {
        "vi": "Lòng từ nhân có bao sức mạnh thay!",
        "ko": "우리도 늘 친절하리.",
        "zh": "願天天培養這美德。",
        "en": "With kindness, how strong we can be!",
        "ja": "たい親切の力"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Mi 6:8; Mat 11:28-50; Cô 3:12; 1 Phi 2:5).",
      "ko": "(미가 6:8; 마태 11:28-30; 골로새 3:12; 베드로 전서 2:3 참조)",
      "zh": "（參看彌6：8；太11：28-30；西3：12；彼前2：3）",
      "en": "(See also Mic. 6:8; Matt. 11:28-30; Col. 3:12; 1 Pet. 2:3.)",
      "ja": "（ミカ6：8；マタ11：28‐30；コロ3：12；ペテ一2：3も参照。）"
    }
  },
  {
    "number": 117,
    "sourceSheet": "117",
    "labels": {
      "vi": "BÀI HÁT 117",
      "ko": "117번",
      "zh": "詩歌第117首",
      "en": "SONG 117",
      "ja": "117番"
    },
    "title": {
      "vi": "Hãy tập thể hiện sự tốt lành",
      "ko": "선함",
      "zh": "良善的美德",
      "en": "The Quality of Goodness",
      "ja": "善良さを示す"
    },
    "scripture": {
      "vi": "(2 Sử ký 6:41)",
      "ko": "(역대기하 6:41)",
      "zh": "（歷代志下6：41）",
      "en": "(2 Chronicles 6:41)",
      "ja": "（歴代第二6：41）"
    },
    "lines": [
      {
        "vi": "1. Lạy Giê-hô-va, đãng ban ơn lành,",
        "ko": "1. 선하시고 충실하신",
        "zh": "1．耶和華你多麼良善，",
        "en": "1. O Jehovah, God of goodness,",
        "ja": "1．エホバに感謝の"
      },
      {
        "vi": "ngài là Cha tốt nhất trên đời.",
        "ko": "우리 주 여호와여!",
        "zh": "天天將恩惠賜下。",
        "en": "You have blessed us all our days!",
        "ja": "気持ちを込めて"
      },
      {
        "vi": "Ngài thật thanh khiết, tín trung không dời,",
        "ko": "항상 은혜 베푸시며",
        "zh": "你的作為至善至美，",
        "en": "You are holy, ever loyal,",
        "ja": "豊かな祝福"
      },
      {
        "vi": "mọi đường lối Cha đều tốt lành.",
        "ko": "자비로우십니다.",
        "zh": "你既忠貞又聖潔。",
        "en": "And so good in all your ways.",
        "ja": "数え上げます"
      },
      {
        "vi": "Lòng thương xót ngài lớn lao vô bờ,",
        "ko": "넘치도록 많은 축복",
        "zh": "儘管我們不配蒙恩，",
        "en": "You show favor, granting mercy,",
        "ja": "恵みと憐れみ"
      },
      {
        "vi": "hơn những chỉ nhân loại đáng được.",
        "ko": "과분하게 주시니,",
        "zh": "你卻以仁慈相待。",
        "en": "Far beyond what we deserve.",
        "ja": "身に余るほど示して"
      },
      {
        "vi": "Mình Cha xứng đáng chúng con thờ phượng",
        "ko": "우린 모두 기쁨으로",
        "zh": "能敬奉你多麼愉快，",
        "en": "You're so worthy of our worship,",
        "ja": "くださる神"
      },
      {
        "vi": "và tôn kính, khen ngợi muôn đời.",
        "ko": "주를 섬기렵니다.",
        "zh": "你配受讚美崇拜。",
        "en": "And it's you we gladly serve.",
        "ja": "をあがめる"
      },
      {
        "vi": "2. Lòng Cha thật tốt trải qua bao đời,",
        "ko": "2. 여호와가 보여",
        "zh": "2．你所揀選這一群人",
        "en": "2. Your own goodness is reflected",
        "ja": "2．エホバの教えを"
      },
      {
        "vi": "được tỏ ra bởi dân Cha chọn.",
        "ko": "주신 선한 특성 본받아",
        "zh": "反映出你的美德，",
        "en": "In the people whom you choose;",
        "ja": "当てはめながら"
      },
      {
        "vi": "Họ đi theo sát lối Cha khuyên dạy",
        "ko": "좋은 소식 전파하며",
        "zh": "他們表現良好品行，",
        "en": "And the proof is in their conduct",
        "ja": "善いこと行い"
      },
      {
        "vi": "và loan báo tin mừng xa gần.",
        "ko": "선함 나타냅니다.",
        "zh": "也努力傳講真理。",
        "en": "And the preaching of good news.",
        "ja": "実を結びます"
      },
      {
        "vi": "Ở trên đất này, những anh chăn bầy",
        "ko": "주의 선한 마련들이",
        "zh": "優良教導、",
        "en": "Your good teaching, your good shepherds,",
        "ja": "エホバに倣って"
      },
      {
        "vi": "luôn hết tâm, chuyên lòng giảng dạy.",
        "ko": "선한 열매 맺으니,",
        "zh": "優秀牧人帶來美好的收成。",
        "en": "Bear good fruit in many lands.",
        "ja": "生きていくよう"
      },
      {
        "vi": "Cầu xin thần khí của Cha soi rọi",
        "ko": "우리들도 선한 특성",
        "zh": "求你幫助我們加強",
        "en": "May you grant us holy spirit,",
        "ja": "私を動か"
      },
      {
        "vi": "hầu sinh trái tốt lành trong đời.",
        "ko": "길러 가게 하소서.",
        "zh": "樂意行善的願望。",
        "en": "And may goodness guide our hands.",
        "ja": "す聖なる力"
      },
      {
        "vi": "3. Cầu xin Cha hãy xuống phước ân vì",
        "ko": "3. 모두에게 차별",
        "zh": "3．盡己所能親切待人，",
        "en": "3. May you bless our deeds of goodness",
        "ja": "3．兄弟姉妹"
      },
      {
        "vi": "việc từ nhân chúng con thể hiện.",
        "ko": "없이 항상 선함 보이고",
        "zh": "你必定厚賜福分。",
        "en": "To our brothers, great or small.",
        "ja": "に心を広げ"
      },
      {
        "vi": "Nguyện luôn nâng đỡ anh em đồng đạo",
        "ko": "가족이 된 형제 자매",
        "zh": "我們努力向人行善，",
        "en": "May we show them special favor",
        "ja": "豊かに善良"
      },
      {
        "vi": "và tử tế với người lân cận.",
        "ko": "더욱 아끼렵니다.",
        "zh": "對信徒更要關懷。",
        "en": "As we work at good t'ward all.",
        "ja": "示していこう"
      },
      {
        "vi": "Dù nơi xóm giềng, ở trong gia đình,",
        "ko": "우리 가족, 이웃에게",
        "zh": "對待家人或是鄰人，",
        "en": "In each fam'ly, congregation,",
        "ja": "エホバの祝福"
      },
      {
        "vi": "hội thánh Cha hay là nơi nào,",
        "ko": "선함 나타내리니,",
        "zh": "都表現良善、真誠。",
        "en": "In each town and neighborhood,",
        "ja": "思い起こせば"
      },
      {
        "vi": "nguyện sao cư xử giống Cha tốt lành",
        "ko": "주 힘입어 선함의 힘",
        "zh": "求你幫助我們決心",
        "en": "With your blessing and your spirit,",
        "ja": "善いこと行"
      },
      {
        "vi": "hầu phản chiếu gương ngài mỗi ngày.",
        "ko": "보이게 해 주소서.",
        "zh": "堅持行善不放棄。",
        "en": "May we be a force for good.",
        "ja": "う力みなぎる"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 105:10; Mác 10:18; Ga 5:22; Ê-phê 5:9).",
      "ko": "(시 103:10; 마가 10:18; 갈라디아 5:22; 에베소 5:9 참조)",
      "zh": "（參看詩103：10；可10：18；加5：22；弗5：9）",
      "en": "(See also Ps. 103:10; Mark 10:18; Gal. 5:22; Eph. 5:9.)",
      "ja": "（詩103：10；マル10：18；ガラ5：22；エフェ5：9も参照。）"
    }
  },
  {
    "number": 118,
    "sourceSheet": "118",
    "labels": {
      "vi": "BÀI HÁT 118",
      "ko": "118번",
      "zh": "詩歌第118首",
      "en": "SONG 118",
      "ja": "118番"
    },
    "title": {
      "vi": "“Xin cho chúng con thêm đức tin”",
      "ko": "“우리에게 믿음을더 주십시오”",
      "zh": "求你加強我們的信心",
      "en": "“Give Us More Faith”",
      "ja": "「さらに信仰を与えてください」"
    },
    "scripture": {
      "vi": "(Lu-ca 17:5)",
      "ko": "(누가복음 17:5)",
      "zh": "（路加福音17：5）",
      "en": "(Luke 17:5)",
      "ja": "（ルカ17：5）"
    },
    "lines": [
      {
        "vi": "1. Lạy Giê-hô-va, hằng ngày dân Cha luôn sai sót",
        "ko": "1. 여호와여, 우리 불완전하여",
        "zh": "1．耶和華上帝，我們都不完美，",
        "en": "1. Because we are imperfect, O Jehovah,",
        "ja": "1．受け継いだ罪のゆ"
      },
      {
        "vi": "vì gánh trên vai tội tổ tông khi mới sinh.",
        "ko": "마음의 생각은 흠이 많고,",
        "zh": "作惡的念頭時常會浮現，",
        "en": "The inclination of our heart is flawed.",
        "ja": "えに人の心は弱く"
      },
      {
        "vi": "Một điều nguy khiến chúng con dễ bị sa ngã là",
        "ko": "주를 향한 믿음이 부족한 죄",
        "zh": "常常犯錯，受罪的慾望纏累，",
        "en": "There is a sin that easily ensnares us—",
        "ja": "信仰が欠けてしまう"
      },
      {
        "vi": "lòng tin lay chuyền, chẳng cậy trông Cha như xưa.",
        "ko": "우리를 쉽게 얽매나이다.",
        "zh": "難以對你保持堅強信念。",
        "en": "A lack of faith in you, the living God.",
        "ja": "神のことを忘れて"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Lạy Giê-hô-va, cầu Chúa giúp đức tin thêm vững;",
        "ko": "여호와여, 믿음을 더 주소서.",
        "zh": "慈愛天父，請加強我們信心，",
        "en": "Give us more faith, we beg of you, Jehovah.",
        "ja": "エホバよどうか私に"
      },
      {
        "vi": "vì lòng thương xót mà giúp dân Cha mạnh thêm.",
        "ko": "부족함을 채워 주옵소서.",
        "zh": "求你看顧，使我們更堅定。",
        "en": "Please help us out according to our need.",
        "ja": "もっと強い信仰い"
      },
      {
        "vi": "Chúng con ngày đêm cầu xin lòng tin luôn mãi tăng,",
        "ko": "언행으로 주를 찬양하리니",
        "zh": "所需力量懇求你慷慨賜予，",
        "en": "Give us more faith, according to your mercy,",
        "ja": "つも与えてください"
      },
      {
        "vi": "hầu câu nói hay hành động làm thánh danh ngoài,",
        "ko": "더 강한 믿음 갖게 하소서.",
        "zh": "幫助我們以言行讚美你。",
        "en": "That we may honor you in word and deed.",
        "ja": "あなたをたたえるため"
      },
      {
        "vi": "2. Ngài chẳng vui khi người thờ Cha nhưng không tin chắc.",
        "ko": "2. 우리의 믿음 주께 기쁨 되니",
        "zh": "2．我們信念堅定，深信你存在，",
        "en": "2. Apart from faith, no one can fully please you.",
        "ja": "2．強い信仰があれば"
      },
      {
        "vi": "Lòng chúng con tin ngài thưởng ai luôn tín trung.",
        "ko": "상 주심 굳게 믿으리이다.",
        "zh": "也確信你必定獎賞、恩待。",
        "en": "We must believe our faith will be repaid.",
        "ja": "エホバに喜ばれる"
      },
      {
        "vi": "Ngài cho chiên biết đức tin chính là khiên cứu mạng,",
        "ko": "믿음의 방패 우릴 보호하니",
        "zh": "堅如盾牌，信心能阻擋傷害，",
        "en": "And as a shield, our faith provides a refuge.",
        "ja": "どんな試練が来ようと"
      },
      {
        "vi": "hầu chẳng kinh khiếp chờ ngày Cha trong tương lai.",
        "ko": "앞날을 담대히 맞으리다.",
        "zh": "讓我們能勇敢面對未來。",
        "en": "We face the future firm and unafraid.",
        "ja": "恐れず立ち向かえる"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Lạy Giê-hô-va, cầu Chúa giúp đức tin thêm vững;",
        "ko": "여호와여, 믿음을 더 주소서.",
        "zh": "慈愛天父，請加強我們信心，",
        "en": "Give us more faith, we beg of you, Jehovah.",
        "ja": "エホバよどうか私に"
      },
      {
        "vi": "vì lòng thương xót mà giúp dân Cha mạnh thêm.",
        "ko": "부족함을 채워 주옵소서.",
        "zh": "求你看顧，使我們更堅定。",
        "en": "Please help us out according to our need.",
        "ja": "もっと強い信仰い"
      },
      {
        "vi": "Chúng con ngày đêm cầu xin lòng tin luôn mãi tăng,",
        "ko": "언행으로 주를 찬양하리니",
        "zh": "所需力量懇求你慷慨賜予，",
        "en": "Give us more faith, according to your mercy,",
        "ja": "つも与えてください"
      },
      {
        "vi": "hầu câu nói hay hành động làm thánh danh ngoài,",
        "ko": "더 강한 믿음 갖게 하소서.",
        "zh": "幫助我們以言行讚美你。",
        "en": "That we may honor you in word and deed.",
        "ja": "あなたをたたえるため"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Sáng 8:21; Hê 11:6; 12:1).",
      "ko": "(창세 8:21; 히브리 11:6; 12:1 참조)",
      "zh": "（參看創8：21；來11：6；12：1）",
      "en": "(See also Gen. 8:21; Heb. 11:6; 12:1.)",
      "ja": "（創8：21；ヘブ11：6；12：1も参照。）"
    }
  },
  {
    "number": 119,
    "sourceSheet": "119",
    "labels": {
      "vi": "BÀI HÁT 119",
      "ko": "119번",
      "zh": "詩歌第119首",
      "en": "SONG 119",
      "ja": "119番"
    },
    "title": {
      "vi": "Chúng ta phải có đức tin",
      "ko": "우리는 믿음을가져야 한다",
      "zh": "我們必須有信心",
      "en": "We Must Have Faith",
      "ja": "信仰を持とう"
    },
    "scripture": {
      "vi": "(Hê-bo-rơ 10:58, 359)",
      "ko": "(히브리서 10:38, 39)",
      "zh": "（希伯來書10：38，39）",
      "en": "(Hebrews 10:38, 39)",
      "ja": "（ヘブライ10：38，39）"
    },
    "lines": [
      {
        "vi": "1. Xưa kia Giê-hô-va từng phán cho mọi dân",
        "ko": "1. 고대 예언자들 보내시어",
        "zh": "1．上帝以往通過忠信先知，",
        "en": "1. On many occasions God spoke to men",
        "ja": "1．エホバは今も語る"
      },
      {
        "vi": "qua nhiều nhà tiên kiến tin cậy Cha.",
        "ko": "여러 차례 하신 말씀,",
        "zh": "向人發出警告信息。",
        "en": "By means of his prophets of old.",
        "ja": "キリストによって"
      },
      {
        "vi": "Ngài phán trong thời này bằng chính Con một Cha:",
        "ko": "이제 아들 통해 말하시네.",
        "zh": "今天上帝通過愛子呼籲，",
        "en": "Today he is saying, ‘Let all repent,'",
        "ja": "悔い改めるよう"
      },
      {
        "vi": "“Dân khắp mọi nơi mau thay đồi.",
        "ko": "‘모두 회개하여라.'",
        "zh": "願人悔改行正義。",
        "en": "By God's own Son we are told.",
        "ja": "に呼び掛けている"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Tự hỏi lòng: “Niềm tin mình vững chắc?”.",
        "ko": "확고한 믿음 키우면",
        "zh": "必須培養堅強信心，",
        "en": "Do we have strong faith? Is it real?",
        "ja": "強い信仰持とう"
      },
      {
        "vi": "Nhờ lòng tin như thế được Cha cứu.",
        "ko": "우리 생명 보존하리.",
        "zh": "才能渡過考驗、困境。",
        "en": "We must build such faith to survive.",
        "ja": "生き続けるため"
      },
      {
        "vi": "“Việc làm mình tỏ rõ thật tin Chúa?”",
        "ko": "행함으로 증명하면 그",
        "zh": "以言行表現真信心，",
        "en": "Is our faith proved true by our works?",
        "ja": "行いによって"
      },
      {
        "vi": "Vì đức tin mạnh mang đến tương lai huy hoàng.",
        "ko": "믿음 우릴 구원하리라.",
        "zh": "未來必定享受永遠生命。",
        "en": "By means of faith, we'll be preserved alive.",
        "ja": "真の命を得よう"
      },
      {
        "vi": "2. Ta vui vâng theo chính lệnh của Vua Giê-su,",
        "ko": "2. 마음으로 예수 명령",
        "zh": "2．我們樂意聽從基督命令，",
        "en": "2. We gladly obey Christ Jesus' command",
        "ja": "2．遠く広く伝え"
      },
      {
        "vi": "rao truyền về tin Nước Cha mọi nơi.",
        "ko": "따라 왕국 진리를 전하리.",
        "zh": "將好消息傳遍四境。",
        "en": "To share Kingdom truth far and wide.",
        "ja": "よう王国の真理"
      },
      {
        "vi": "Dạn dĩ ca ngợi ngài, truyền bá thông điệp Cha,",
        "ko": "이 희망의 소식 담대하게",
        "zh": "王國的信息要勇敢宣揚，",
        "en": "We boldly declare God's message of hope;",
        "ja": "エホバからのメ"
      },
      {
        "vi": "không giấu điều chỉ Cha đã hứa.",
        "ko": "모두에게 전하리.",
        "zh": "告訴人美好希望。",
        "en": "His promise we'll never hide.",
        "ja": "ッセージ輝く希望"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Tự hỏi lòng: “Niềm tin mình vững chắc?”.",
        "ko": "확고한 믿음 키우면",
        "zh": "必須培養堅強信心，",
        "en": "Do we have strong faith? Is it real?",
        "ja": "強い信仰持とう"
      },
      {
        "vi": "Nhờ lòng tin như thế được Cha cứu.",
        "ko": "우리 생명 보존하리.",
        "zh": "才能渡過考驗、困境。",
        "en": "We must build such faith to survive.",
        "ja": "生き続けるため"
      },
      {
        "vi": "“Việc làm mình tỏ rõ thật tin Chúa?”",
        "ko": "행함으로 증명하면 그",
        "zh": "以言行表現真信心，",
        "en": "Is our faith proved true by our works?",
        "ja": "行いによって"
      },
      {
        "vi": "Vì đức tin mạnh mang đến tương lai huy hoàng.",
        "ko": "믿음 우릴 구원하리라.",
        "zh": "未來必定享受永遠生命。",
        "en": "By means of faith, we'll be preserved alive.",
        "ja": "真の命を得よう"
      },
      {
        "vi": "3. Ta nay tin nơi Chúa bền chắc như mỏ neo;",
        "ko": "3. 닻과 같은 믿음 확고하니",
        "zh": "3．即使風暴來襲也不恐懼，",
        "en": "3. Our faith is an anchor firm and secure;",
        "ja": "3．いかりのような"
      },
      {
        "vi": "không sợ sệt hay thoái lui, chuyền lay.",
        "ko": "결코 물러서지 않네.",
        "zh": "因信心如船錨堅定。",
        "en": "We never will shrink back in fear.",
        "ja": "信仰心に抱いて"
      },
      {
        "vi": "Điều giúp ta chịu đựng là mãi tin cậy Cha;",
        "ko": "주를 신뢰하며 인내하리.",
        "zh": "全心依賴上帝絕不放棄，",
        "en": "Our trust in Jehovah helps us endure;",
        "ja": "忍耐して進も"
      },
      {
        "vi": "ta biết ngày Cha đang sắp đến.",
        "ko": "구원 가까웠다네.",
        "zh": "得救日子已臨近！",
        "en": "We know salvation is near.",
        "ja": "う救いは近い"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Tự hỏi lòng: “Niềm tin mình vững chắc?”.",
        "ko": "확고한 믿음 키우면",
        "zh": "必須培養堅強信心，",
        "en": "Do we have strong faith? Is it real?",
        "ja": "強い信仰持とう"
      },
      {
        "vi": "Nhờ lòng tin như thế được Cha cứu.",
        "ko": "우리 생명 보존하리.",
        "zh": "才能渡過考驗、困境。",
        "en": "We must build such faith to survive.",
        "ja": "生き続けるため"
      },
      {
        "vi": "“Việc làm mình tỏ rõ thật tin Chúa?”",
        "ko": "행함으로 증명하면 그",
        "zh": "以言行表現真信心，",
        "en": "Is our faith proved true by our works?",
        "ja": "行いによって"
      },
      {
        "vi": "Vì đức tin mạnh mang đến tương lai huy hoàng.",
        "ko": "믿음 우릴 구원하리라.",
        "zh": "未來必定享受永遠生命。",
        "en": "By means of faith, we'll be preserved alive.",
        "ja": "真の命を得よう"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Rô 10:10; Ê-phê 5:12; Hê 11:6; 1 Giăng 5:4).",
      "ko": "(로마 10:10; 에베소 3:12; 히브리 11:6; 요한 1서 5:4 참조)",
      "zh": "（參看羅10：10；弗3：12；來11：6；約一5：4）",
      "en": "(See also Rom. 10:10; Eph. 3:12; Heb. 11:6; 1 John 5:4.)",
      "ja": "（ロマ10：10；エフェ3：12；ヘブ11：6；ヨハ一5：4も参照。）"
    }
  },
  {
    "number": 120,
    "sourceSheet": "120",
    "labels": {
      "vi": "BÀI HÁT 120",
      "ko": "120번",
      "zh": "詩歌第120首",
      "en": "SONG 120",
      "ja": "120番"
    },
    "title": {
      "vi": "Noi theo tính ôn hòa của Đấng Ki-tô",
      "ko": "그리스도의 온화를 본받으라",
      "zh": "效法基督待人溫和",
      "en": "Imitate Christ's Mildness",
      "ja": "キリストの温和さに倣う"
    },
    "scripture": {
      "vi": "(Ma-thi-ơ 11:28-50)",
      "ko": "(마태복음 11:28-30)",
      "zh": "（馬太福音11：28-30）",
      "en": "(Matthew 11:28-30)",
      "ja": "（マタイ11：28‐30）"
    },
    "lines": [
      {
        "vi": "1. Giê-su, Chúa của chúng ta, là Vua vĩ đại thay.",
        "ko": "1. 주 예수는 위대한 분이지만",
        "zh": "1．我們的主耶穌偉大又崇高，",
        "en": "1. The greatest of men was our Lord Jesus Christ;",
        "ja": "1．偉大な人キリストは"
      },
      {
        "vi": "Ngài xem thế gian hay danh vọng khác chỉ phù du.",
        "ko": "교만함도 야심도 없으셨네.",
        "zh": "沒有野心，也從不心高氣傲，",
        "en": "By pride or ambition, he was not enticed.",
        "ja": "重い役目を担った"
      },
      {
        "vi": "Dù ngài có vị thế quan trọng theo như ý Cha",
        "ko": "진심으로 자신을 낮추셨고",
        "zh": "受上帝任命，肩負重大責任，",
        "en": "God's purpose gave Jesus the prominent role;",
        "ja": "それでも誇ることなく"
      },
      {
        "vi": "nhưng vẫn luôn luôn tỏ ra khiêm nhu, ôn hòa thay.",
        "ko": "지극히 큰 일들을 이루셨네.",
        "zh": "卻時刻表現謙卑，忠心耿耿。",
        "en": "Yet, lowly in heart, he was always whole-souled.",
        "ja": "最善尽くし仕えた"
      },
      {
        "vi": "2. Giê-su mến gọi những ai lòng chan chứa sầu lo",
        "ko": "2. ‘무거운 짐 나에게 맡기거라.'",
        "zh": "2．所有辛苦勞碌、負重擔的人，",
        "en": "2. To all who are toiling with troublesome cares,",
        "ja": "2．重荷背負う人たちは"
      },
      {
        "vi": "bỏ đi gánh đang mang, theo ngài đề tâm bình an.",
        "ko": "우릴 모두 위로해 주신다네.",
        "zh": "耶穌願意為他們分憂解困。",
        "en": "He offers to carry the burdens they bear.",
        "ja": "毎日悩み苦しむ"
      },
      {
        "vi": "Đời họ sẽ hạnh phúc khi đặt ưu tiên Nước Cha.",
        "ko": "온화한 자 왕국을 사랑하니",
        "zh": "他性情溫和，喜愛謙和的人，",
        "en": "Refreshment they find as the Kingdom they seek.",
        "ja": "イエスの言葉当てはめ"
      },
      {
        "vi": "Vua quý ai khiêm hòa, sẽ luôn ban ơn chẳng thôi.",
        "ko": "주 은혜와 새 힘을 얻으리라.",
        "zh": "通過王國為他們帶來福分。",
        "en": "With kindness and mildness, he favors the meek.",
        "ja": "爽やかさを味わおう"
      },
      {
        "vi": "3. Giê-su phán dặn chúng ta là thân hữu của nhau.",
        "ko": "3. ‘너희는 다 형제라' 하셨으니",
        "zh": "3．我們要衷心聽從耶穌吩咐，",
        "en": "3. ‘We all are just brothers,' our Lord Jesus said.",
        "ja": "3．温和なイエスに倣い"
      },
      {
        "vi": "Nguyện khiêm tốn vâng theo bao điều bởi Vua truyền ra.",
        "ko": "예수 앞에 겸손히 낮추리라.",
        "zh": "不分彼此，互相關心與愛護。",
        "en": "In humble submission, we look to our Head.",
        "ja": "仕え合おう謙遜に"
      },
      {
        "vi": "Cha yêu quý người sống ôn hòa, khiêm nhu biết bao",
        "ko": "하느님이 아끼는 온유한 자",
        "zh": "上帝向謙卑溫和的人保證，",
        "en": "The mild and the meek ones to God have great worth;",
        "ja": "温和な人はエホバに"
      },
      {
        "vi": "và hứa ban cho họ cơ nghiệp ở trong địa đàng.",
        "ko": "약속대로 이 땅을 상속하리.",
        "zh": "他們必在地上樂園享永生。",
        "en": "He promises they will inherit the earth.",
        "ja": "優しく抱き締められる"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Châm 35:54; Mat 5:5; 25:8; Rô 12:16).",
      "ko": "(잠언 3:34; 마태 5:5; 23:8; 로마 12:16 참조)",
      "zh": "（參看箴3：34；太5：5；23：8；羅12：16）",
      "en": "(See also Prov. 3:34; Matt. 5:5; 23:8; Rom. 12:16.)",
      "ja": "（格3：34；マタ5：5；23：8；ロマ12：16も参照。）"
    }
  },
  {
    "number": 121,
    "sourceSheet": "121",
    "labels": {
      "vi": "BÀI HÁT 121",
      "ko": "121번",
      "zh": "詩歌第121首",
      "en": "SONG 121",
      "ja": "121番"
    },
    "title": {
      "vi": "Chúng ta cần có tính tự chủ",
      "ko": "우리는 자제가 필요하다",
      "zh": "我們必須有自制力",
      "en": "We Need Self-Control",
      "ja": "自制が必要"
    },
    "scripture": {
      "vi": "(Rô-ma 7:14-25)",
      "ko": "(로마서 7:14-25)",
      "zh": "（羅馬書7：14-25）",
      "en": "(Romans 7:14-25)",
      "ja": "（ローマ7：14‐25）"
    },
    "lines": [
      {
        "vi": "1. Yêu mến Giê-hô-va hết mình, hết trí tâm.",
        "ko": "1. 우린 여호와 사랑하지만",
        "zh": "1．我們都全心全意愛上帝，",
        "en": "1. We love Jehovah with heart, mind, and soul;",
        "ja": "1．神の道歩むため"
      },
      {
        "vi": "Vậy ta hãy tự chủ bởi tội lỗi luôn trong ta.",
        "ko": "죄의 힘 강하니 자제 필요해.",
        "zh": "雖身心不完美，仍約束自己。",
        "en": "But since we are sinful, we need self-control.",
        "ja": "どんなときも自制する"
      },
      {
        "vi": "Xác thịt chỉ gieo bao vấn đề, khó khăn",
        "ko": "육을 따르면 근심 얻고",
        "zh": "屈從慾望必招致禍患，",
        "en": "Fleshly desires bring trouble and strife;",
        "ja": "聖なる力受け"
      },
      {
        "vi": "nhưng bước theo thần khí, sống vui, bình an.",
        "ko": "영을 따르면 생명 얻네.",
        "zh": "順從上帝必永享平安。",
        "en": "Living by spirit brings peace and life.",
        "ja": "平和求め生きる"
      },
      {
        "vi": "2. Sa-tan thường gieo rắc mưu hại với hiểm nguy,",
        "ko": "2. 사탄 우리를 늘 유혹하고",
        "zh": "2．每天要抗拒撒但的誘惑，",
        "en": "2. Satan's temptations confront us each day,",
        "ja": "2．誘惑は絶え間なく"
      },
      {
        "vi": "và tội lỗi làm ta dễ lạc lối, cách xa Cha.",
        "ko": "죄의 법 우리를 압도하여도",
        "zh": "而犯罪的傾向導致人犯錯。",
        "en": "And sin's law within us can lead us astray.",
        "ja": "罪の力強くても"
      },
      {
        "vi": "Với lực Chúa ban, ta thắng được bản thân.",
        "ko": "진리의 힘이 더 강하니",
        "zh": "真理力量比私慾更強，",
        "en": "Power of truth is greater than sin.",
        "ja": "エホバの助け得て"
      },
      {
        "vi": "Xin mãi khen ngợi Cha, dâng lời tạ ơn.",
        "ko": "주의 힘 입어 이겨 내리.",
        "zh": "上帝幫助我更新思想。",
        "en": "Thanks to Jehovah, our minds can win.",
        "ja": "日ごと勝利得よう"
      },
      {
        "vi": "3. Ta quyết tạo danh tốt khen ngợi Giê-hô-va.",
        "ko": "3. 우리 언행을 항상 살펴서",
        "zh": "3．我們有榮幸代表耶和華，",
        "en": "3. Each word and action reflects on God's name,",
        "ja": "3．振る舞いに気を配る"
      },
      {
        "vi": "Điều ta nghĩ, làm hay nói, nguyện sẽ tôn vinh Cha.",
        "ko": "여호와 이름을 드높이리라.",
        "zh": "盡力在言行上立下好榜樣。",
        "en": "So we must endeavor to keep free from blame.",
        "ja": "神の名誉守るため"
      },
      {
        "vi": "Ước nguyện của ta mong sống đẹp ý Cha,",
        "ko": "우리는 굳게 결심했네,",
        "zh": "所做一切要尊榮上帝，",
        "en": "In all we do, we make this our goal:",
        "ja": "いつの日も自制を保ち"
      },
      {
        "vi": "kiên quyết luôn tự chủ suốt trong đời ta.",
        "ko": "항상 자제를 나타내리.",
        "zh": "必須學會運用自制力。",
        "en": "Always maintaining our self-control.",
        "ja": "生きていこう"
      }
    ],
    "reference": {
      "vi": "(Cũng xem 1 Cô 9:25; Ga 5:23; 2 Phi 1:6).",
      "ko": "(고린도 전서 9:25; 갈라디아 5:23; 베드로 후서 1:6 참조)",
      "zh": "（參看林前9：25；加5：23；彼後1：6）",
      "en": "(See also 1 Cor. 9:25; Gal. 5:23; 2 Pet. 1:6.)",
      "ja": "（コリ一9：25；ガラ5：23；ペテ二1：6も参照。）"
    }
  },
  {
    "number": 122,
    "sourceSheet": "122",
    "labels": {
      "vi": "BÀI HÁT 122",
      "ko": "122번",
      "zh": "詩歌第122首",
      "en": "SONG 122",
      "ja": "122番"
    },
    "title": {
      "vi": "Hãy kiên định, không lay chuyền!",
      "ko": "확고하고 흔들리지 말라!",
      "zh": "要堅定不移！",
      "en": "Be Steadfast, Immovable!",
      "ja": "揺らぐことなく勝利を得る"
    },
    "scripture": {
      "vi": "(1 Cô-rinh-tô 15:58)",
      "ko": "(고린도 전서 15:58)",
      "zh": "（哥林多前書15：58）",
      "en": "(1 Corinthians 15:58)",
      "ja": "（コリント第一15：58）"
    },
    "lines": [
      {
        "vi": "1. Ngày nay mọi nước đang kêu than, bao khổ đau,",
        "ko": "1. 온 세상 고난에 시달리며",
        "zh": "1．世界動盪不安、充滿難題，",
        "en": "1. Nations are troubled as never before.",
        "ja": "1．闇の中をさまよう"
      },
      {
        "vi": "người ta đều thấy hoang mang, lo cho ngày sau.",
        "ko": "앞날을 두려워할지라도,",
        "zh": "人們難免感到害怕憂慮。",
        "en": "People are fearful of what lies in store.",
        "ja": "希望消えた世界で"
      },
      {
        "vi": "Lòng ta bền vững, không sợ hãi hay chuyển lay",
        "ko": "우리는 충실히 주",
        "zh": "我們必須堅定，忍耐到底，",
        "en": "Firm and immovable we need to be,",
        "ja": "光掲げ続け"
      },
      {
        "vi": "và luôn thành trung, không đồi thay.",
        "ko": "섬기며 흔들림 없으리라.",
        "zh": "忠心地崇拜上帝。",
        "en": "Serving our God faithfully.",
        "ja": "て神に仕える"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Nguyện giữ tâm ta kiên định luôn",
        "ko": "현 세상 멀리하고",
        "zh": "我們要堅定不移，",
        "en": "Steadfast we all need to be;",
        "ja": "揺らぐことなく"
      },
      {
        "vi": "và tách xa thế gian tàn suy.",
        "ko": "확고함 유지하리.",
        "zh": "絕不受世界奴役。",
        "en": "Far from this world we keep free,",
        "ja": "世から離れて"
      },
      {
        "vi": "Bền lòng trung kiên theo Cha,",
        "ko": "우린 누리리라,",
        "zh": "一生忠貞到底，",
        "en": "Standing firm to the end,",
        "ja": "エホバ愛し"
      },
      {
        "vi": "bao phước ân đón đợi ta.",
        "ko": "끝없는 생명을.",
        "zh": "得享永遠生命。",
        "en": "Unending life we'll see.",
        "ja": "勝利得よう"
      },
      {
        "vi": "2. Dù quanh mình dối gian, mưu mô đang bủa vây,",
        "ko": "2. 유혹과 올무가 에워싸도",
        "zh": "2．撒但世界充滿誘惑陷阱，",
        "en": "2. Snares of the world and temptations abound.",
        "ja": "2．正しいこと行い"
      },
      {
        "vi": "Lời Cha rèn trí tâm nên ta không chuyển lay.",
        "ko": "건전한 영으로 이겨 내리.",
        "zh": "培養健全思想才能抗拒。",
        "en": "We can resist if our thinking is sound.",
        "ja": "悪いもの憎むなら"
      },
      {
        "vi": "Mình yêu điều đúng, kiên định tránh xa điều sai",
        "ko": "진리를 진실로 사랑하면",
        "zh": "我們憎恨惡事、熱愛正義，",
        "en": "Hating what's bad while we love what is true",
        "ja": "誘惑に負けない"
      },
      {
        "vi": "và trung thành đi theo lối Cha.",
        "ko": "흔들림 없으리라.",
        "zh": "就能夠堅持到底。",
        "en": "Makes us immovable too.",
        "ja": "で歩んでいける"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Nguyện giữ tâm ta kiên định luôn",
        "ko": "현 세상 멀리하고",
        "zh": "我們要堅定不移，",
        "en": "Steadfast we all need to be;",
        "ja": "揺らぐことなく"
      },
      {
        "vi": "và tách xa thế gian tàn suy.",
        "ko": "확고함 유지하리.",
        "zh": "絕不受世界奴役。",
        "en": "Far from this world we keep free,",
        "ja": "世から離れて"
      },
      {
        "vi": "Bền lòng trung kiên theo Cha,",
        "ko": "우린 누리리라,",
        "zh": "一生忠貞到底，",
        "en": "Standing firm to the end,",
        "ja": "エホバ愛し"
      },
      {
        "vi": "bao phước ân đón đợi ta.",
        "ko": "끝없는 생명을.",
        "zh": "得享永遠生命。",
        "en": "Unending life we'll see.",
        "ja": "勝利得よう"
      },
      {
        "vi": "3. Nào ta cùng hết tâm hăng say phụng sự Cha.",
        "ko": "3. 마음을 다하여 주 섬기며",
        "zh": "3．我們衷心敬拜獨一上帝，",
        "en": "3. Give to God worship that comes from the heart.",
        "ja": "3．神の知らせ伝えよう"
      },
      {
        "vi": "Mình góp phần nhỏ nhoi trong bao công việc Cha.",
        "ko": "말씀에 확고히 고착하리.",
        "zh": "全心為他服務不遺餘力。",
        "en": "In the Lord's service may we have a part.",
        "ja": "喜びに満ちあふれ"
      },
      {
        "vi": "Giờ ta cần khẩn trương truyền giảng tin mừng ra.",
        "ko": "끝까지 이 소식 전파하라.",
        "zh": "加緊腳步向人傳好消息，",
        "en": "Preach the good news, always holding it fast.",
        "ja": "力尽くし励も"
      },
      {
        "vi": "Ngày sau cùng đang mau chóng qua.",
        "ko": "이 세상 곧 끝나리.",
        "zh": "新世界即將來臨。",
        "en": "Soon the last days will have passed.",
        "ja": "う終わりは近い"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Nguyện giữ tâm ta kiên định luôn",
        "ko": "현 세상 멀리하고",
        "zh": "我們要堅定不移，",
        "en": "Steadfast we all need to be;",
        "ja": "揺らぐことなく"
      },
      {
        "vi": "và tách xa thế gian tàn suy.",
        "ko": "확고함 유지하리.",
        "zh": "絕不受世界奴役。",
        "en": "Far from this world we keep free,",
        "ja": "世から離れて"
      },
      {
        "vi": "Bền lòng trung kiên theo Cha,",
        "ko": "우린 누리리라,",
        "zh": "一生忠貞到底，",
        "en": "Standing firm to the end,",
        "ja": "エホバ愛し"
      },
      {
        "vi": "bao phước ân đón đợi ta.",
        "ko": "끝없는 생명을.",
        "zh": "得享永遠生命。",
        "en": "Unending life we'll see.",
        "ja": "勝利得よう"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Lu 21:9; 1 Phi 4:7).",
      "ko": "(누가 21:9; 베드로 전서 4:7 참조)",
      "zh": "（參看路21：9；彼前4：7）",
      "en": "(See also Luke 21:9; 1 Pet. 4:7.)",
      "ja": "（ルカ 21:9; ペテ一 4:7も参照。）"
    }
  },
  {
    "number": 123,
    "sourceSheet": "123",
    "labels": {
      "vi": "BÀI HÁT 123",
      "ko": "123번",
      "zh": "詩歌第123首",
      "en": "SONG 123",
      "ja": "123番"
    },
    "title": {
      "vi": "Trung thành phục tùng sự sắp đặt thần quyền",
      "ko": "신권 질서에 충성스럽게 복종하리",
      "zh": "忠貞順從上帝的安排",
      "en": "Loyally Submitting to Theocratic Order",
      "ja": "神の秩序にいつでも従う"
    },
    "scripture": {
      "vi": " (1 Cô-rinh-tô 14:55)",
      "ko": "(고린도 전서 14:33)",
      "zh": "（哥林多前書14：33）",
      "en": "(1 Corinthians 14:33)",
      "ja": "（コリント第一 14:33）"
    },
    "lines": [
      {
        "vi": "1. Mọi tôi tớ Giê-hô-va truyền rao khắp mọi nơi",
        "ko": "1. 여호와의 백성 왕국 전하며",
        "zh": "1．上帝忠貞子民，願走遍遠近，",
        "en": "1. As Jehovah's people sound throughout the earth",
        "ja": "1. エホバ神の証人は"
      },
      {
        "vi": "Nước Chúa nay đang cai trị, sẽ mang đến an bình.",
        "ko": "소중한 이 진리 널리 알릴 때,",
        "zh": "宣揚王國信息和寶貴真理。",
        "en": "Truths about the Kingdom and its priceless worth,",
        "ja": "一つになる 秩序よく"
      },
      {
        "vi": "Họ luôn sống hợp nhất thay và trung tín cùng Cha,",
        "ko": "신권적인 질서 모두 따르며",
        "zh": "我們樂意順從上帝的命令，",
        "en": "Theocratic order they must all obey",
        "ja": "世界中で王国と"
      },
      {
        "vi": "vững bước đi trong công chính, quyết vâng theo thần quyền.",
        "ko": "연합 유지하고 충성 보이네.",
        "zh": "大家團結一致，對上帝忠心。",
        "en": "And remain united, loyalty display.",
        "ja": "真理の価値告げるため"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Chúng ta thờ kính Cha, quyết phục tùng ý Cha",
        "ko": "충성 다하여 복종을 하리,",
        "zh": "決心盡義務，服從耶和華，",
        "en": "Loyal submission in recognition,",
        "ja": "神のため"
      },
      {
        "vi": "do ngài là Vua Tối Cao. ",
        "ko": "우리의 의무니.",
        "zh": "忠貞地敬奉他。",
        "en": "This to our God we owe.",
        "ja": "一致して秩序守る"
      },
      {
        "vi": "Có Cha Giê-hô-va luôn dịu dàng chở che,",
        "ko": "우리를 항상 사랑하시는",
        "zh": "上帝必愛護、關懷他忠僕，",
        "en": "He gives protection, tender affection,",
        "ja": "心から従えば"
      },
      {
        "vi": "ta nguyện trung kiên mãi chẳng thôi.",
        "ko": "주께 충성하리라.",
        "zh": "我們忠貞擁護他。",
        "en": "Loyalty to him we show.",
        "ja": "神の保護見る"
      },
      {
        "vi": "2. Người đầy tớ thật tín trung và thần khí ngài ban",
        "ko": "2. 관리인과 성령 보내 주시어",
        "zh": "2．上帝賜下力量和忠信管家，",
        "en": "2. God provides his steward and his active force.",
        "ja": "2. どんなときも揺るぎなく"
      },
      {
        "vi": "hướng dẫn †a luôn trung thành theo đường lối Cha dạy.",
        "ko": "예수 따라 걷게 인도하시니,",
        "zh": "幫助他的子民全心崇拜他。",
        "en": "These will ever guide us in our Christian course.",
        "ja": "エホバの知恵語るなら"
      },
      {
        "vi": "Mình theo sắp đặt của Cha, làm vui sướng lòng Cha,",
        "ko": "확고함을 보여 기쁨 드리고",
        "zh": "務要堅定不移，使上帝歡欣，",
        "en": "So may we be steadfast, seeking God to please,",
        "ja": "神の力与えられ"
      },
      {
        "vi": "nhất quyết trung kiên rao báo các dân nghe Lời ngài!",
        "ko": "말씀 선포하며 충성 보이리!",
        "zh": "向人宣揚上帝智慧的話語。",
        "en": "Loyally proclaiming all his wise decrees!",
        "ja": "導かれる 神の道"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Chúng ta thờ kính Cha, quyết phục tùng ý Cha",
        "ko": "충성 다하여 복종을 하리,",
        "zh": "決心盡義務，服從耶和華，",
        "en": "Loyal submission in recognition,",
        "ja": "神のため"
      },
      {
        "vi": "do ngài là Vua Tối Cao. ",
        "ko": "우리의 의무니.",
        "zh": "忠貞地敬奉他。",
        "en": "This to our God we owe.",
        "ja": "一致して秩序守る"
      },
      {
        "vi": "Có Cha Giê-hô-va luôn dịu dàng chở che,",
        "ko": "우리를 항상 사랑하시는",
        "zh": "上帝必愛護、關懷他忠僕，",
        "en": "He gives protection, tender affection,",
        "ja": "心から従えば"
      },
      {
        "vi": "ta nguyện trung kiên mãi chẳng thôi.",
        "ko": "주께 충성하리라.",
        "zh": "我們忠貞擁護他。",
        "en": "Loyalty to him we show.",
        "ja": "神の保護見る"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Lu 12:42; Hê 15:7, 17).",
      "ko": "(누가 12:42; 히브리 13:7, 17 참조)",
      "zh": "（參看路12：42；來13：7，17）",
      "en": "(See also Luke 12:42; Heb. 13:7, 17.)",
      "ja": "（ルカ 12:42; ヘブ 13:7，17も参照。）"
    }
  },
  {
    "number": 124,
    "sourceSheet": "124",
    "labels": {
      "vi": "BÀI HÁT 124",
      "ko": "124번",
      "zh": "詩歌第124首",
      "en": "SONG 124",
      "ja": "124番"
    },
    "title": {
      "vi": "Luôn trung thành",
      "ko": "변함없이 충성하리",
      "zh": "一心忠貞不渝",
      "en": "Ever Loyal",
      "ja": "揺るぎない愛"
    },
    "scripture": {
      "vi": "(Thi thiên 18:25)",
      "ko": "(시편 18:25)",
      "zh": "（詩篇18：25）",
      "en": "(Psalm 18:25)",
      "ja": "（詩編18：25）"
    },
    "lines": [
      {
        "vi": "1. Trung thành luôn cùng Cha Giê-hô-va,",
        "ko": "1. 충성하리, 주",
        "zh": "1．一心忠於偉大上帝，",
        "en": "1. Ever loyal to Jehovah,",
        "ja": "1．エホバに示そ"
      },
      {
        "vi": "nguyện yêu thương, mãi bên cạnh ngoài.",
        "ko": "여호와 깊이 사랑하면서.",
        "zh": "表現出忠貞、愛心。",
        "en": "Loyal love we wish to show.",
        "ja": "う揺るぎない愛"
      },
      {
        "vi": "Do là dân ngài, dâng mình cho ngoài,",
        "ko": "헌신을 한 백성으로",
        "zh": "獻身受浸，遵守命令，",
        "en": "As a people, dedicated,",
        "ja": "愛ある教え"
      },
      {
        "vi": "mình mong sao sống đúng luật Cha.",
        "ko": "주의 계명 배우리.",
        "zh": "決心做上帝子民。",
        "en": "His commands we want to know.",
        "ja": "に信頼置いて"
      },
      {
        "vi": "Chẳng bao giờ ngài dẫn dắt sai đường,",
        "ko": "그 교훈 늘 유익하니",
        "zh": "聽從他，絕不會失望，",
        "en": "His advice will never fail us,",
        "ja": "献身守っ"
      },
      {
        "vi": "lối Cha dạy mình cứ bước theo.",
        "ko": "항상 순종하리라.",
        "zh": "他的話牢記在心。",
        "en": "And his counsel we obey.",
        "ja": "て愛貫いて"
      },
      {
        "vi": "Cậy trông Cha vì lòng trung tín ngài,",
        "ko": "변함없이 신뢰하며",
        "zh": "全心信靠忠貞上帝，",
        "en": "He is loyal; we can trust him.",
        "ja": "エホバの近く"
      },
      {
        "vi": "gần Cha mãi chẳng bao giờ xa.",
        "ko": "그분 곁에 머물리.",
        "zh": "跟隨他，永不離棄。",
        "en": "From his side we'll never stray.",
        "ja": "で安らぎを得る"
      },
      {
        "vi": "2. Trung thành luôn cùng anh chị em mình,",
        "ko": "2. 충성하리, 우리",
        "zh": "2．一心忠於弟兄姐妹，",
        "en": "2. Ever loyal to our brothers,",
        "ja": "2．仲間に示そう"
      },
      {
        "vi": "cạnh bên nâng đỡ khi hoạn nạn.",
        "ko": "형제 힘겨워할 때에도.",
        "zh": "患難中相伴相隨。",
        "en": "Sticking close in times of need.",
        "ja": "揺るぎない愛"
      },
      {
        "vi": "Qua lời ân cần, qua việc nhân từ,",
        "ko": "친절하게 도와주며",
        "zh": "真心關懷，彼此信賴，",
        "en": "Ever caring, always trusting,",
        "ja": "心のこもっ"
      },
      {
        "vi": "cùng chung tay xây đắp tình thân.",
        "ko": "항상 관심 보이리.",
        "zh": "時刻以溫情相待。",
        "en": "Ever kind in word and deed.",
        "ja": "た気遣い示し"
      },
      {
        "vi": "Hãy tôn trọng và quý mến anh chị,",
        "ko": "우리 형제 마음으로",
        "zh": "願我們都表現尊重，",
        "en": "We show honor to our brothers",
        "ja": "どんなときにで"
      },
      {
        "vi": "sống tin cậy, thành tín với nhau.",
        "ko": "깊이 존중하리라.",
        "zh": "從心底彼此包容。",
        "en": "And respect them from the heart.",
        "ja": "も一緒にいよう"
      },
      {
        "vi": "Mình luôn trung thành cùng nhau suốt đời,",
        "ko": "변함없이 충성 다해",
        "zh": "弟兄之情深厚堅定，",
        "en": "Ever loyal, ever closer,",
        "ja": "互いを敬"
      },
      {
        "vi": "gần nhau mãi chẳng bao giờ xa.",
        "ko": "형제 곁에 머물리.",
        "zh": "願友誼始終不渝。",
        "en": "From their side we'll never part.",
        "ja": "い絆強める"
      },
      {
        "vi": "3. Trung thành luôn cùng bao người chăn bầy,",
        "ko": "3. 충성하리, 형제들이",
        "zh": "3．一心忠於仁愛牧人，",
        "en": "3. Ever loyal to their guidance",
        "ja": "3．牧者に示そう"
      },
      {
        "vi": "họ do Giê-hô-va bồ nhiệm.",
        "ko": "우리 인도할 때에.",
        "zh": "要給予尊重信任。",
        "en": "When our brothers lead the way.",
        "ja": "揺るぎない愛"
      },
      {
        "vi": "Khiêm nhường vâng phục khi họ khuyên dạy",
        "ko": "그들 지침 따르면서",
        "zh": "虛心接受明確勸告，",
        "en": "When they give us clear direction,",
        "ja": "感謝の気持ち"
      },
      {
        "vi": "dựa trên bao hướng dẫn từ Cha.",
        "ko": "항상 충성하리라.",
        "zh": "聽指示行走正道。",
        "en": "May we loyally obey.",
        "ja": "で助け受け止め"
      },
      {
        "vi": "Nếu trung thành thì Chúa sẽ vui lòng,",
        "ko": "여호와의 축복으로",
        "zh": "耶和華必賜下力量，",
        "en": "Then the blessing from Jehovah",
        "ja": "愛から生ま"
      },
      {
        "vi": "phước ân ngài đồ xuống chúng ta.",
        "ko": "큰 힘 얻게 되리라.",
        "zh": "讓我們信心堅強。",
        "en": "Will be ours to make us strong.",
        "ja": "れる忠実示す"
      },
      {
        "vi": "Tận tâm trung thành cùng Giê-hô-va",
        "ko": "변함없이 충성하여",
        "zh": "下定決心忠貞不渝，",
        "en": "When we're loyal, ever faithful,",
        "ja": "その時神か"
      },
      {
        "vi": "thì ta mãi thuộc riêng về Cha.",
        "ko": "주의 소유 되리라.",
        "zh": "永遠做上帝子民。",
        "en": "To Jehovah we'll belong.",
        "ja": "ら祝福受ける"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 149:1; 1 Tï 2:8; Hê 15:17).",
      "ko": "(시 149:1; 디모데 전서 2:8; 히브리 13:17 참조)",
      "zh": "（參看詩149：1；提前2：8；來13：17）",
      "en": "(See also Ps. 149:1; 1 Tim. 2:8; Heb. 13:17.)",
      "ja": "（詩149：1；テモ一2：8；ヘブ13：17も参照。）"
    }
  },
  {
    "number": 125,
    "sourceSheet": "125",
    "labels": {
      "vi": "BÀI HÁT 125",
      "ko": "125번",
      "zh": "詩歌第125首",
      "en": "SONG 125",
      "ja": "125番"
    },
    "title": {
      "vi": "“Hạnh phúc cho người có lòng thương xót!”",
      "ko": "“자비로운 사람들은 행복하다!”",
      "zh": "富於憐憫的人有福了！",
      "en": "“Happy Are the Merciful!”",
      "ja": "「憐れみ深い人たちは幸福」"
    },
    "scripture": {
      "vi": "(Ma-thi-ơ 5:7)",
      "ko": "(마태복음 5:7)",
      "zh": "（馬太福音5：7）",
      "en": "(Matthew 5:7)",
      "ja": "（マタイ5：7）"
    },
    "lines": [
      {
        "vi": "1. Giê-hô-va luôn xót thương dường bao.",
        "ko": "1. 자비로우신 하느님,",
        "zh": "1．上帝總是仁慈待人，",
        "en": "1. Our happy God is merciful,",
        "ja": "1．憐れみの神"
      },
      {
        "vi": "Ngài đã từ nhân xuống phước mọi dân,",
        "ko": "행복하신 주 여호와,",
        "zh": "憐恤我們，甘願施恩，",
        "en": "His mercy not just dutiful.",
        "ja": "は親切を愛し"
      },
      {
        "vi": "vui thích ban bao quà vô giá thay,",
        "ko": "진실한 친절 베풀며",
        "zh": "他以向人行善為樂，",
        "en": "He takes delight in kindly deeds",
        "ja": "気遣いにあふれ"
      },
      {
        "vi": "rộng tay đáp ứng nhu cầu của ta.",
        "ko": "따듯이 돌봐 주시네.",
        "zh": "厚賜百物照顧我們。",
        "en": "And freely grants our daily needs.",
        "ja": "惜しまず与える"
      },
      {
        "vi": "Người hối hận đau đớn, Cha cảm thông,",
        "ko": "회개하는 사람들은",
        "zh": "上帝寬恕痛悔的人，",
        "en": "Repentant ones can be assured",
        "ja": "愛に基づいて"
      },
      {
        "vi": "ngài đoái nhìn xem, xóa hết tội cho.",
        "ko": "주의 자비 받으리라.",
        "zh": "樂意垂聽求恩呼聲，",
        "en": "Their plea for mercy will be heard.",
        "ja": "人の願い聞き"
      },
      {
        "vi": "Cha rất công minh, nhân từ, thương xót,",
        "ko": "우리의 약함 아시고",
        "zh": "深知我們塵土之身，",
        "en": "Remembering that we are dust,",
        "ja": "憐れみ示して"
      },
      {
        "vi": "biết con người từ bụi đất sinh ra.",
        "ko": "큰 자비 보여 주시네.",
        "zh": "天父滿懷慈愛、公正。",
        "en": "He's merciful and kind and just.",
        "ja": "許しを与える"
      },
      {
        "vi": "2. Người có lòng đau đớn khi làm sai",
        "ko": "2. 죄를 지어 괴로울 때",
        "zh": "2．我們犯過灰心沮喪，",
        "en": "2. When we have sinned and feel distressed,",
        "ja": "2．間違い犯して"
      },
      {
        "vi": "và muốn cầu xin Chúa thứ tội cho,",
        "ko": "하느님께 간청하리.",
        "zh": "渴望得到上帝原諒，",
        "en": "When God's forgiveness we request,",
        "ja": "苦しいときには"
      },
      {
        "vi": "khi ấy Giê-su dạy cho chúng ta",
        "ko": "‘형제를 용서했으니,",
        "zh": "要聽從耶穌的教導，",
        "en": "Our Lord, Christ Jesus, showed the way",
        "ja": "憐れみと許し"
      },
      {
        "vi": "nài xin Chúa Giê-hô-va xót thương:",
        "ko": "우리를 용서하소서.'",
        "zh": "向仁慈的天父禱告。",
        "en": "To ask for mercy when we pray:",
        "ja": "祈りで求める"
      },
      {
        "vi": "“Cầu Chúa từ nhân thứ tha tội con,",
        "ko": "자비를 간청하도록",
        "zh": "求他寬大赦免我們，",
        "en": "“Forgive our debts, we beg of you,",
        "ja": "自分の弱さを"
      },
      {
        "vi": "vì những lần con thứ lỗi người ta”.",
        "ko": "예수 가르쳐 주셨네.",
        "zh": "我們也要寬恕別人，",
        "en": "As we forgive our debtors too.”",
        "ja": "忘れずにいれば"
      },
      {
        "vi": "Khi xóa đi bao căm giận, cay đắng,",
        "ko": "분한 감정을 지우고",
        "zh": "將心中的怨恨放下，",
        "en": "We then can let resentment go,",
        "ja": "他の人を許し"
      },
      {
        "vi": "chúng ta được bình an mãi không thôi.",
        "ko": "마음의 평화 누리리.",
        "zh": "必定重獲平靜舒暢。",
        "en": "And peace of mind and heart we'll know.",
        "ja": "平和生み出せる"
      },
      {
        "vi": "3. Nguyện hết lòng khi có ai cần ta,",
        "ko": "3. 진심으로 베푸는 이,",
        "zh": "3．我們表現憐憫之情，",
        "en": "3. When gifts of mercy we bestow,",
        "ja": "3．見返り求めず"
      },
      {
        "vi": "rộng rãi sẻ chia, giúp đỡ thành tâm.",
        "ko": "칭찬 바라지 않으니,",
        "zh": "向人行善發自內心。",
        "en": "The giving spirit we should show.",
        "ja": "憐れみ示せば"
      },
      {
        "vi": "Ta chẳng mong nghe ngợi ca, tán dương",
        "ko": "받는 이 좋아한다면",
        "zh": "慷慨施與不求讚許，",
        "en": "We give without desiring praise,",
        "ja": "喜び膨らみ"
      },
      {
        "vi": "mà ao ước thấy bao người sướng vui.",
        "ko": "그것으로 만족하네.",
        "zh": "心中深感滿足歡欣。",
        "en": "Content with joy our gift conveys.",
        "ja": "満足得られる"
      },
      {
        "vi": "Vì Giê-hô-va đoái xem việc ta,",
        "ko": "모든 걸 보신 하느님",
        "zh": "天父留意我們善行，",
        "en": "Then God, who sees all things we do,",
        "ja": "憐れみの人"
      },
      {
        "vi": "ngài sẽ rộng tay xuống phước từ trên.",
        "ko": "반드시 갚아 주시리.",
        "zh": "豐盛獎賞他必賜予。",
        "en": "Will be the One repaying you.",
        "ja": "は真に美しい"
      },
      {
        "vi": "Hạnh phúc cho ai nhân từ, thương xót,",
        "ko": "자비한 자 행복하네.",
        "zh": "表現憐憫必享美福，",
        "en": "Yes, happy are the merciful,",
        "ja": "神から報わ"
      },
      {
        "vi": "bởi nay họ được Cha quý yêu thay.",
        "ko": "하느님께 아름답네!",
        "zh": "天父眼中快樂富足。",
        "en": "In God's eyes they are beautiful.",
        "ja": "れ幸せ味わう"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Mat 6:2-4, 12-14).",
      "ko": "(마태 6:2-4, 12-14 참조)",
      "zh": "（參看太6：2-4，12-14）",
      "en": "(See also Matt. 6:2-4, 12-14.)",
      "ja": "（マタ6：2‐4，12‐14も参照。）"
    }
  },
  {
    "number": 126,
    "sourceSheet": "126",
    "labels": {
      "vi": "BÀI HÁT 126",
      "ko": "126번",
      "zh": "詩歌第126首",
      "en": "SONG 126",
      "ja": "126番"
    },
    "title": {
      "vi": "Hãy luôn tỉnh thức, đứng vững và mạnh mẽ",
      "ko": "깨어 굳게 서서 강하게 되라",
      "zh": "保持警醒，剛強堅毅",
      "en": "Stay Awake, Stand Firm, Grow Mighty",
      "ja": "目を覚ましていて，しっかり立ち，強い人になる"
    },
    "scripture": {
      "vi": "(1 Cô-rinh-tô 16:13)",
      "ko": "(고린도 전서 16:13)",
      "zh": "（哥林多前書16:13）",
      "en": "(1 Corinthians 16:13)",
      "ja": "（コリント第一 16:13）"
    },
    "lines": [
      {
        "vi": "1. Cần tỉnh thức, bền lòng, mạnh dạn lên",
        "ko": "1. 깨어 굳세고 강하라.",
        "zh": "1．保持警醒，剛強堅毅，",
        "en": "1. Stay awake, stand firm, grow mighty,",
        "ja": "1. 目を覚まし耐える"
      },
      {
        "vi": "và kiên quyết mãi không nao sờn.",
        "ko": "끝까지 인내하라.",
        "zh": "下決心忍耐到底。",
        "en": "Be determined to endure.",
        "ja": "どんな試練も"
      },
      {
        "vi": "Mình can đảm làm việc Chúa không sợ,",
        "ko": "우리 승리 확실하니",
        "zh": "滿懷勇氣，堅定不移，",
        "en": "Carry on with manly courage,",
        "ja": "勇敢に進む"
      },
      {
        "vi": "vì nay mai chắc thắng huy hoàng.",
        "ko": "남자답게 행하라.",
        "zh": "我們必戰勝仇敵。",
        "en": "For the victory is sure.",
        "ja": "勝利の道を"
      },
      {
        "vi": "Quyết theo lệnh Giê-su đã ban khi xưa,",
        "ko": "주 예수 명령 순종하여",
        "zh": "要遵守基督明確命令，",
        "en": "We obey Christ Jesus' clear command;",
        "ja": "王として導く"
      },
      {
        "vi": "chúng ta nguyện trung kiên đứng bên ngài luôn.",
        "ko": "그 편에 굳건히 서리라.",
        "zh": "決心服從他英明帶領。",
        "en": "Under him we firmly take our stand.",
        "ja": "イエスの声を聞き"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Cần tỉnh thức, đứng vững đến tận cuối cùng!",
        "ko": "깨어 굳게 서서 강하라!",
        "zh": "保持警醒，意志要堅定！",
        "en": "Stay awake, stand firm, and grow mighty!",
        "ja": "深く根ざして立つ"
      },
      {
        "vi": "Mạnh mẽ tiến bước lên không ngừng!",
        "ko": "끝까지 행하여라!",
        "zh": "願一生堅守使命！",
        "en": "Carry on right to the end!",
        "ja": "最後の日まで"
      },
      {
        "vi": "2. Cần tỉnh thức, Lời ngài mình làm theo",
        "ko": "2. 깨어 정신을 차려서",
        "zh": "2．保持警醒，時刻留意，",
        "en": "2. Stay awake, and keep your senses,",
        "ja": "2. 目を覚まし保つ"
      },
      {
        "vi": "và luôn tỉnh táo không lơ là.",
        "ko": "언제나 순종하라.",
        "zh": "要衷心服從上帝。",
        "en": "Always ready to obey.",
        "ja": "平常心を"
      },
      {
        "vi": "Mình theo sát người đầy tớ trung thành",
        "ko": "충실한 종이 베푸는",
        "zh": "基督委任忠信奴隸，",
        "en": "Stay alert to Christ's direction",
        "ja": "進んで従う"
      },
      {
        "vi": "là vâng theo chính Vua Giê-su.",
        "ko": "주의 지시 살피라.",
        "zh": "要聽從他們指引。",
        "en": "Through his faithful slave today.",
        "ja": "イエスの指示に"
      },
      {
        "vi": "Hãy vâng lời, nghe theo các anh chăn bầy,",
        "ko": "진리와 양 떼를 지키는",
        "zh": "牧人盡全力保護羊群，",
        "en": "Heed the counsel of the older men,",
        "ja": "キリストに仕える"
      },
      {
        "vi": "Chúa giao họ chăm lo, chở che bầy chiên.",
        "ko": "연로자의 교훈 따르라.",
        "zh": "他們勸告要用心聆聽。",
        "en": "Who protect his sheep and truth defend.",
        "ja": "牧者の声を聞き"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Cần tỉnh thức, đứng vững đến tận cuối cùng!",
        "ko": "깨어 굳게 서서 강하라!",
        "zh": "保持警醒，意志要堅定！",
        "en": "Stay awake, stand firm, and grow mighty!",
        "ja": "深く根ざして立つ"
      },
      {
        "vi": "Mạnh mẽ tiến bước lên không ngừng!",
        "ko": "끝까지 행하여라!",
        "zh": "願一生堅守使命！",
        "en": "Carry on right to the end!",
        "ja": "最後の日まで"
      },
      {
        "vi": "3. Cần tỉnh thức và đồng lòng cùng nhau,",
        "ko": "3. 깨어 항상 연합하여",
        "zh": "3．保持警醒，團結一心，",
        "en": "3. Stay awake, remain united",
        "ja": "3. 目を覚まし運ぶ"
      },
      {
        "vi": "mình luôn sốt sắng rao tin mừng.",
        "ko": "좋은 소식 알리라.",
        "zh": "要捍衛上帝話語。",
        "en": "As the good news we defend.",
        "ja": "真理の種を"
      },
      {
        "vi": "Dù ai chống hoặc nhạo báng, chê cười,",
        "ko": "적이 우리 대적해도",
        "zh": "不要害怕敵人攻擊，",
        "en": "Though our enemies will fight it,",
        "ja": "逆風吹いても"
      },
      {
        "vi": "mình không nao núng hay run sợ.",
        "ko": "끝까지 전파하리.",
        "zh": "要繼續宣揚真理。",
        "en": "We will preach until the end.",
        "ja": "一致の下に"
      },
      {
        "vi": "Quyết rao truyền danh Cha đến cho muôn dân.",
        "ko": "온 땅 가득 찬양 외치라.",
        "zh": "一起讚美上帝的聖名，",
        "en": "Join the shout of praise throughout the land.",
        "ja": "全ての兄弟と"
      },
      {
        "vi": "Hãy trông ngày Cha đang đến, không chậm đâu!",
        "ko": "여호와의 날 가까웠네!",
        "zh": "宣告他大日子快來臨！",
        "en": "Look! Jehovah's day is soon at hand!",
        "ja": "賛美の声を上げ"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Cần tỉnh thức, đứng vững đến tận cuối cùng!",
        "ko": "깨어 굳게 서서 강하라!",
        "zh": "保持警醒，意志要堅定！",
        "en": "Stay awake, stand firm, and grow mighty!",
        "ja": "深く根ざして立つ"
      },
      {
        "vi": "Mạnh mẽ tiến bước lên không ngừng!",
        "ko": "끝까지 행하여라!",
        "zh": "願一生堅守使命！",
        "en": "Carry on right to the end!",
        "ja": "最後の日まで"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Mat 24:13; Hê 13:7, 17; 1 Phi 5:8).",
      "ko": "(마태 24:13; 히브리 13:7, 17; 베드로 전서 5:8 참조)",
      "zh": "（參看太24:13；來13:7,17；彼前5:8）",
      "en": "(See also Matt. 24:13; Heb. 13:7, 17; 1 Pet. 5:8.)",
      "ja": "（マタ 24:13; ヘブ 13:7，17; ペテ一 5:8も参照。）"
    }
  },
  {
    "number": 127,
    "sourceSheet": "127",
    "labels": {
      "vi": "BÀI HÁT 127",
      "ko": "127번",
      "zh": "詩歌第127首",
      "en": "SONG 127",
      "ja": "127番"
    },
    "title": {
      "vi": "Tôi xem mình thuộc loại người nào",
      "ko": "나는 어떤 사람이되어야 하는가?",
      "zh": "願我是你喜愛的人",
      "en": "The Sort of Person I Should Be",
      "ja": "私はどんな人になるべきだろうか"
    },
    "scripture": {
      "vi": "(2 Phi-e-rơ 5:11)",
      "ko": "(베드로 후서 3:11)",
      "zh": "（彼得後書3：11）",
      "en": "(2 Peter 3:11)",
      "ja": "（ペテロ第二 3:11）"
    },
    "lines": [
      {
        "vi": "1. Con làm sao báo đáp được sự sống Cha tặng con?",
        "ko": "1. 생명 주신 은혜 감사하오니,",
        "zh": "1．該怎麼感謝你，耶和華上帝，",
        "en": "1. How can I repay you, what gift can I give",
        "ja": "この命を下さった"
      },
      {
        "vi": "Ơn Cha con mang suốt đời, con nguyện luôn cảm tạ Cha.",
        "ko": "주여, 무얼 드려 보답하리이까?",
        "zh": "是你賜我生命，願一生報答你。",
        "en": "To thank you, Jehovah, for the life that I live?",
        "ja": "エホバ神に感謝します"
      },
      {
        "vi": "Lời Chúa như là gương dùng soi xét tấm lòng của con;",
        "ko": "주 말씀으로 마음속 비추리니",
        "zh": "你神聖話語幫助我看清內心，",
        "en": "I look in my heart with your Word as my mirror;",
        "ja": "聖書読み 心を映し"
      },
      {
        "vi": "xin giúp con tra xem lòng con có điều sai trái không.",
        "ko": "환히 보게 해 주소서, 내 모습을.",
        "zh": "我願天天細讀聖經，省察自己。",
        "en": "The person I see, may you help me see clearer.",
        "ja": "本当の自分 調べる"
      },
      {
        "vi": "(ĐOẠN CHUYỂN)",
        "ko": "(브리지)",
        "zh": "（過門）",
        "en": "(BRIDGE)",
        "ja": "(ブリッジ)"
      },
      {
        "vi": "Lời hứa nguyện con ghi nhớ, mãi mãi theo đường Cha,",
        "ko": "내 삶 바치리란 약속 때문에",
        "zh": "我已下定決心一生屬於你，",
        "en": "My life I have promised in service to you,",
        "ja": "エホバ神に喜んで"
      },
      {
        "vi": "làm các việc Cha giao phó hết tâm can, sức lực con.",
        "ko": "마지못해 하는 봉사 아니오니,",
        "zh": "願全心愛戴你，盡力實踐真理。",
        "en": "But not from mere duty will I do what I do.",
        "ja": "この命を捧げたから"
      },
      {
        "vi": "Nguyện sống sao đẹp lòng Cha, đền đáp ơn ngài ban.",
        "ko": "마음 영혼 다해 기꺼이 섬겨",
        "zh": "我已獻出自己天天敬奉你，",
        "en": "Whole-souled and wholehearted I serve you by choice;",
        "ja": "どんな人になるべきか"
      },
      {
        "vi": "Thầm ước con là người hằng làm Cha vui sướng.",
        "ko": "당신을 기쁘게 하리이다.",
        "zh": "但願我一生都使你歡喜。",
        "en": "May I be one more who makes you rejoice.",
        "ja": "教えてほしいのです"
      },
      {
        "vi": "Con cầu xin Cha giúp đề tự xét trong lòng con",
        "ko": "어떤 사람 되길 바라시는지",
        "zh": "求你讓我知道，我真正為人，",
        "en": "Help me to examine, and help me to see",
        "ja": "あなたにもっと近づいて"
      },
      {
        "vi": "và nhận ra con có thuộc loại người Cha chấp nhận không.",
        "ko": "나의 모습 살펴 깨닫게 하소서.",
        "zh": "助我察驗自己，使我合你心意。",
        "en": "Just what sort of person you desire me to be.",
        "ja": "あなたとずっと共に歩む"
      },
      {
        "vi": "Vì những ai thành trung thì Cha trung tín cùng họ luôn.",
        "ko": "충성스런 자 소중히 여기시니",
        "zh": "對忠貞的人，你以忠貞待他們，",
        "en": "Those loyal to you, you will loyally treasure;",
        "ja": "献身の誓いを果たし"
      },
      {
        "vi": "Con quyết tâm trung kiên hầu Cha mãi, làm Cha sướng vui.",
        "ko": "큰 기쁨을 드리리다, 주 마음에.",
        "zh": "願我是你喜愛的人，直到永恆。",
        "en": "May I be among those who bring your heart pleasure.",
        "ja": "揺るぎない愛をあなたに"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 18:25; 116:12; Châm 11:20).",
      "ko": "(시 18:25; 116:12; 잠언 11:20 참조)",
      "zh": "（參看詩18：25；116：12；箴11：20）",
      "en": "(See also Ps. 18:25; 116:12; Prov. 11:20.)",
      "ja": "（詩 18:25; 116:12; 格 11:20も参照。）"
    }
  },
  {
    "number": 128,
    "sourceSheet": "128",
    "labels": {
      "vi": "BÀI HÁT 128",
      "ko": "128번",
      "zh": "詩歌第128首",
      "en": "SONG 128",
      "ja": "128番"
    },
    "title": {
      "vi": "Bền chí chịu đựng cho đến cuối cùng",
      "ko": "끝까지 인내하라",
      "zh": "忍耐到底",
      "en": "Enduring to the End",
      "ja": "終わりまで耐え忍ぶ"
    },
    "scripture": {
      "vi": "(Ma-thi-ơ 24:15)",
      "ko": "(마태복음 24:13)",
      "zh": "（馬太福音24：13）",
      "en": "(Matthew 24:13)",
      "ja": "（マタイ24：13）"
    },
    "lines": [
      {
        "vi": "1. Cậy trông Lời Cha chan chứa hy vọng",
        "ko": "1. 하느님의 모든",
        "zh": "1．我們所學寶貴真理",
        "en": "1. God's Word and all it promises",
        "ja": "1．エホバの言"
      },
      {
        "vi": "giúp ta chịu đựng khó khăn.",
        "ko": "말씀 인내할 힘 주네.",
        "zh": "多麼真實可信。",
        "en": "Give reason to endure.",
        "ja": "葉とその約束"
      },
      {
        "vi": "Điều chỉ mà Giê-hô-va khuyên dạy,",
        "ko": "그 근거 확실한 진리",
        "zh": "信賴上帝一切承諾，",
        "en": "The things you've learned and come to love",
        "ja": "命へつなが"
      },
      {
        "vi": "chúng ta tin cậy, yêu quý thay.",
        "ko": "더없이 소중하네.",
        "zh": "必能堅持到最後。",
        "en": "Are all well-founded and sure.",
        "ja": "る確かな希望"
      },
      {
        "vi": "Mình hãy xây dựng đức tin nơi ngài,",
        "ko": "여호와 날 가까우니",
        "zh": "謹記上帝日子臨近，",
        "en": "Be stabilized in holy faith,",
        "ja": "信仰の強度"
      },
      {
        "vi": "luôn khắc ghi trong tâm ngày Cha.",
        "ko": "강한 믿음 키우라.",
        "zh": "堅守信仰不放棄。",
        "en": "Keeping God's day close in mind.",
        "ja": "試される時"
      },
      {
        "vi": "Dù gian khổ nhưng kiên quyết trung thành,",
        "ko": "시험 통해 단련되니",
        "zh": "考驗之下保持忠義，",
        "en": "Stand firm in your integrity;",
        "ja": "いつも考える"
      },
      {
        "vi": "khó khăn sẽ thêm tinh luyện ta.",
        "ko": "충절 굳게 지키라.",
        "zh": "信心必日益堅定。",
        "en": "By tests you will be refined.",
        "ja": "神の日のこと"
      },
      {
        "vi": "2. Tình yêu dành cho Cha mãi sâu đậm",
        "ko": "2. 처음 사랑 유지하고",
        "zh": "2．緊緊持守最初的愛，",
        "en": "2. Maintain the love you had at first,",
        "ja": "2．人への恐れ"
      },
      {
        "vi": "nếu ta vun bồi, đắp xây.",
        "ko": "버리지 말아라.",
        "zh": "不要冷淡下來。",
        "en": "Which somehow could be lost.",
        "ja": "や揺らぐ心"
      },
      {
        "vi": "Gặp bao buồn đau, thử thách trong đời,",
        "ko": "힘겨운 시련 겪어도",
        "zh": "就算面對各種困難，",
        "en": "Despite the trials you will meet,",
        "ja": "初めに抱い"
      },
      {
        "vi": "quyết tâm chịu đựng, không thoái lui.",
        "ko": "반드시 인내하라.",
        "zh": "都堅決不斷忍耐。",
        "en": "Endure no matter the cost.",
        "ja": "た愛を弱める"
      },
      {
        "vi": "Dù phải đương đầu khó khăn, nguy hại,",
        "ko": "겁내거나 의심 말라,",
        "zh": "縱使經歷恐嚇、威脅，",
        "en": "Whatever test may come your way,",
        "ja": "献身の温度"
      },
      {
        "vi": "ta hãy trung kiên theo đường Cha.",
        "ko": "어떤 시험 만나도.",
        "zh": "也不要懷疑、膽怯，",
        "en": "Never yield to doubt or fear.",
        "ja": "試される時"
      },
      {
        "vi": "Giê-hô-va, nơi nương náu an toàn;",
        "ko": "늘 곁에 계신 여호와",
        "zh": "上帝必守候在身邊，",
        "en": "Jehovah will provide escape,",
        "ja": "いつも温かく"
      },
      {
        "vi": "vững tin Cha luôn bên cạnh †a.",
        "ko": "피할 길을 주시리.",
        "zh": "救我們脫離考驗。",
        "en": "Our God ever will be near.",
        "ja": "神が寄り添う"
      },
      {
        "vi": "3. Giờ ai bền tâm cho đến cuối cùng",
        "ko": "3. 끝까지 인내한다면",
        "zh": "3．忍耐到底，忠於職守，",
        "en": "3. All those enduring to the end",
        "ja": "3．終わりまで耐"
      },
      {
        "vi": "có tên ghi tại sách Cha.",
        "ko": "구원을 받으리.",
        "zh": "上帝必定拯救。",
        "en": "Are those who will be saved.",
        "ja": "える諦めずに"
      },
      {
        "vi": "Ngài lưu lại trong trí nhớ muôn đời,",
        "ko": "생명책에 우리 이름",
        "zh": "美名長存上帝心中，",
        "en": "The book of life will list their names,",
        "ja": "命の書に名を"
      },
      {
        "vi": "hứa ban cho phần thưởng lớn lao.",
        "ko": "선명히 새겨지리.",
        "zh": "忠貞紀錄永存留。",
        "en": "A record clearly engraved.",
        "ja": "残されるため"
      },
      {
        "vi": "Mình hãy trung thành, quyết tâm chịu đựng",
        "ko": "끝까지 인내하기로",
        "zh": "忍耐帶來美好結果，",
        "en": "So let endurance be your aim;",
        "ja": "嵐が過ぎ去"
      },
      {
        "vi": "cho đức tin ta thêm mạnh hơn.",
        "ko": "확고히 결심하라.",
        "zh": "下定決心不退縮。",
        "en": "Let it have its work complete.",
        "ja": "り光差す時"
      },
      {
        "vi": "Giê-hô-va ban ân phước dư tràn",
        "ko": "여호와 은혜 맛보며",
        "zh": "上帝所賜福分豐厚，",
        "en": "Jehovah's favor you will know;",
        "ja": "確かに目にす"
      },
      {
        "vi": "với bao sướng vui trong đời ta.",
        "ko": "큰 기쁨을 누리리.",
        "zh": "喜樂洋溢在心中。",
        "en": "With joy you will be replete.",
        "ja": "る神の救いを"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Hê 6:19; Gia 1:4; 2 Phi 5:12; Khải 2:4).",
      "ko": "(히브리 6:19; 야고보 1:4; 베드로 후서 3:12; 계시록 2:4 참조)",
      "zh": "（參看來6：19；雅1：4；彼後3：12；啟2：4）",
      "en": "(See also Heb. 6:19; Jas. 1:4; 2 Pet. 3:12; Rev. 2:4.)",
      "ja": "（ヘブ6：19；ヤコ1：4；ペテ二3：12；啓2：4も参照。）"
    }
  },
  {
    "number": 129,
    "sourceSheet": "129",
    "labels": {
      "vi": "BÀI HÁT 129",
      "ko": "129번",
      "zh": "詩歌第129首",
      "en": "SONG 129",
      "ja": "129番"
    },
    "title": {
      "vi": "Chúng ta sẽ tiếp tục chịu đựng",
      "ko": "우린계속 인내하리라",
      "zh": "決心忍耐到底",
      "en": "WeWill Keep Enduring",
      "ja": "決して負けない 最後まで"
    },
    "scripture": {
      "vi": "(Ma-thi-ơ 24:13)",
      "ko": "(마태복음 24:13)",
      "zh": "（馬太福音24：13）",
      "en": "(Matthew 24:13)",
      "ja": "（マタイ 24:13）"
    },
    "lines": [
      {
        "vi": "1. Trong thử thách khôn cùng,",
        "ko": "1. 인내하리라,",
        "zh": "1．要效法耶穌，",
        "en": "1. How can we endure",
        "ja": "1. 終わりまで"
      },
      {
        "vi": "Chúa Giê-su chịu đựng với hy vọng,",
        "ko": "예수의 본을 따라서.",
        "zh": "面對考驗絕不屈服。",
        "en": "When trials come, as Jesus said?",
        "ja": "耐え忍ぶために"
      },
      {
        "vi": "do nghiền ngẫm đêm ngày",
        "ko": "시련 중에도",
        "zh": "他忍受折磨，",
        "en": "Through his pain he saw",
        "ja": "思い出す"
      },
      {
        "vi": "về tương lai sáng tươi Cha hứa ban.",
        "ko": "미래의 기쁨 보셨네.",
        "zh": "深信獎賞就在前頭。",
        "en": "The joy of better things ahead.",
        "ja": "イエスの模範を"
      },
      {
        "vi": "Chúng ta theo dấu chân ngài,",
        "ko": "아버지 약속에",
        "zh": "耶和華的承諾",
        "en": "God's promise, God's justice,",
        "ja": "痛み 耐えた"
      },
      {
        "vi": "mừng vui chịu đựng gian nan.",
        "ko": "큰 힘 얻으셨네.",
        "zh": "時刻牢記心中。",
        "en": "Were thoughts on which he fed.",
        "ja": "報い見つめ"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Mình luôn cậy trông Giê-hô-va",
        "ko": "우린 인내해야 해.",
        "zh": "我們要堅定不移，",
        "en": "We need to have endurance.",
        "ja": "決して負けない"
      },
      {
        "vi": "và giữ niềm tin vững mạnh.",
        "ko": "믿음 지켜야 해.",
        "zh": "全力擁護真理。",
        "en": "Our faith we must defend.",
        "ja": "耐えていける"
      },
      {
        "vi": "Vì có tình yêu thương của ngài,",
        "ko": "여호와 힘 주시니",
        "zh": "仰賴上帝賜勇氣，",
        "en": "His love is our assurance.",
        "ja": "エホバの愛に"
      },
      {
        "vi": "nguyện luôn trung kiên, quyết tâm chịu đựng không thôi.",
        "ko": "우린 끝까지 인내하리라.",
        "zh": "決心滿懷希望忍耐到底。",
        "en": "So we will keep enduring to the end.",
        "ja": "包まれて最後まで"
      },
      {
        "vi": "2. Bao ngày tháng đau buồn,",
        "ko": "2. 세월 가면서",
        "zh": "2．若回顧以往，",
        "en": "2. Though the passing years",
        "ja": "2. たくさんの涙を"
      },
      {
        "vi": "những năm nhọc nhằn rồi sẽ không còn.",
        "ko": "슬픔과 아픔 많지만",
        "zh": "難免感覺憂愁哀傷，",
        "en": "May bring us sorrow, bring us pain;",
        "ja": "流した"
      },
      {
        "vi": "Ta nhìn thấy hy vọng",
        "ko": "그 눈물 너머",
        "zh": "但展望未來，",
        "en": "There beyond the tears,",
        "ja": "つらい日々やがて"
      },
      {
        "vi": "ngày mai tươi sáng, hân hoan biết bao.",
        "ko": "보이는 새로운 세상.",
        "zh": "樂園幸福指日可待。",
        "en": "We see the life that we can gain.",
        "ja": "過去になる"
      },
      {
        "vi": "Sống yên vui, phước dư tràn,",
        "ko": "그곳에 있으리",
        "zh": "要堅持到最後，",
        "en": "To be there, feel free there,",
        "ja": "未来見つめ"
      },
      {
        "vi": "tự do làm theo ý Chúa.",
        "ko": "굳게 다짐하네.",
        "zh": "決心永不退縮。",
        "en": "Determined we remain.",
        "ja": "さあ進もう"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Mình luôn cậy trông Giê-hô-va",
        "ko": "우린 인내해야 해.",
        "zh": "我們要堅定不移，",
        "en": "We need to have endurance.",
        "ja": "決して負けない"
      },
      {
        "vi": "và giữ niềm tin vững mạnh.",
        "ko": "믿음 지켜야 해.",
        "zh": "全力擁護真理。",
        "en": "Our faith we must defend.",
        "ja": "耐えていける"
      },
      {
        "vi": "Vì có tình yêu thương của ngài,",
        "ko": "여호와 힘 주시니",
        "zh": "仰賴上帝賜勇氣，",
        "en": "His love is our assurance.",
        "ja": "エホバの愛に"
      },
      {
        "vi": "nguyện luôn trung kiên, quyết tâm chịu đựng không thôi.",
        "ko": "우린 끝까지 인내하리라.",
        "zh": "決心滿懷希望忍耐到底。",
        "en": "So we will keep enduring to the end.",
        "ja": "包まれて最後まで"
      },
      {
        "vi": "3. Không sợ hãi, nghi ngờ,",
        "ko": "3. 충실하리라,",
        "zh": "3．絕不要放棄，",
        "en": "3. We will not give up",
        "ja": "3. 恐れない"
      },
      {
        "vi": "chúng ta chịu đựng cho đến sau cùng.",
        "ko": "주의 날 가까워 오니.",
        "zh": "拋開所有恐懼懷疑。",
        "en": "Nor see the need for doubt or fear.",
        "ja": "諦めもしない"
      },
      {
        "vi": "Trung thành suốt trong đời,",
        "ko": "의심하거나",
        "zh": "要忠於上帝，",
        "en": "Faithfully we'll serve",
        "ja": "エホバの日"
      },
      {
        "vi": "dù bao gian khó, ta không quản ngại.",
        "ko": "두려워 포기 않으리.",
        "zh": "等候他大日子來臨。",
        "en": "Until Jehovah's day is here.",
        "ja": "来るその時まで"
      },
      {
        "vi": "Hãy hăng say báo tin mừng.",
        "ko": "끝까지 인내해!",
        "zh": "新世界已不遠，",
        "en": "Let's keep on enduring.",
        "ja": "耐えていこう"
      },
      {
        "vi": "Ngày Cha gần rồi, không xa.",
        "ko": "그날 올 때까지.",
        "zh": "拯救近在眼前。",
        "en": "That time is very near.",
        "ja": "その日 近い"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Mình luôn cậy trông Giê-hô-va",
        "ko": "우린 인내해야 해.",
        "zh": "我們要堅定不移，",
        "en": "We need to have endurance.",
        "ja": "決して負けない"
      },
      {
        "vi": "và giữ niềm tin vững mạnh.",
        "ko": "믿음 지켜야 해.",
        "zh": "全力擁護真理。",
        "en": "Our faith we must defend.",
        "ja": "耐えていける"
      },
      {
        "vi": "Vì có tình yêu thương của ngài,",
        "ko": "여호와 힘 주시니",
        "zh": "仰賴上帝賜勇氣，",
        "en": "His love is our assurance.",
        "ja": "エホバの愛に"
      },
      {
        "vi": "nguyện luôn trung kiên, quyết tâm chịu đựng không thôi.",
        "ko": "우린 끝까지 인내하리라.",
        "zh": "決心滿懷希望忍耐到底。",
        "en": "So we will keep enduring to the end.",
        "ja": "包まれて最後まで"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Công 20:19, 20; Gia 1:12; 1 Phi 4:12-14).",
      "ko": "(사도 20:19, 20; 야고보 1:12; 베드로 전서 4:12-14 참조)",
      "zh": "（參看徒20：19，20；雅1：12；彼前4：12-14）",
      "en": "(See also Acts 20:19, 20; Jas. 1:12; 1 Pet. 4:12-14.)",
      "ja": "（使徒 20:19，20; ヤコ 1:12; ペテ一 4:12-14も参照。）"
    }
  },
  {
    "number": 130,
    "sourceSheet": "130",
    "labels": {
      "vi": "BÀI HÁT 130",
      "ko": "130번",
      "zh": "詩歌第130首",
      "en": "SONG 130",
      "ja": "130番"
    },
    "title": {
      "vi": "150 Hãy tha thứ",
      "ko": "용서하는 사람이되리",
      "zh": "樂意寬恕",
      "en": "Be Forgiving",
      "ja": "進んで許す"
    },
    "scripture": {
      "vi": "(Thi thiên 86:5)",
      "ko": "(시편 86:5)",
      "zh": "（詩篇86：5）",
      "en": "(Psalm 86:5)",
      "ja": "（詩編86：5）"
    },
    "lines": [
      {
        "vi": "1. Giê-hô-va thật cao cả,",
        "ko": "1. 아들을 보내신",
        "zh": "1．仁愛的耶和華",
        "en": "1. Lovingly Jehovah",
        "ja": "1．エホバ神"
      },
      {
        "vi": "ngài hy sinh chính Con một yêu",
        "ko": "사랑 많은 여호와",
        "zh": "賜下愛子作贖價，",
        "en": "Made provision through his Son",
        "ja": "は人々愛し"
      },
      {
        "vi": "cho chúng ta hôm nay được cứu chuộc,",
        "ko": "우릴 죄와 죽음에서",
        "zh": "赦免我們一切罪過，",
        "en": "For our sins to be forgiven",
        "ja": "その罪を許し"
      },
      {
        "vi": "bao khóc than mai này chẳng còn.",
        "ko": "자유롭게 하셨네.",
        "zh": "解開死亡的枷鎖。",
        "en": "And for death to be undone.",
        "ja": "死を取り除く"
      },
      {
        "vi": "Người ăn năn thật lòng đến với Cha",
        "ko": "진심으로 회개하고",
        "zh": "只要我們衷心悔改，",
        "en": "If we truly are repentant,",
        "ja": "贖いの犠牲"
      },
      {
        "vi": "cầu xin Cha rộng lượng thứ tha",
        "ko": "용서 구하는 사람,",
        "zh": "懇求他仁慈寬待，",
        "en": "His forgiveness we can claim",
        "ja": "許しの土台"
      },
      {
        "vi": "thì trên cao ngài trìu mến lắng nghe,",
        "ko": "그리스도 이름으로",
        "zh": "他必顯出恩情厚愛，",
        "en": "On the basis of Christ's ransom,",
        "ja": "イエスを通し"
      },
      {
        "vi": "xót thương và xóa tội lỗi mình.",
        "ko": "용서받게 되리라.",
        "zh": "不追想我們過犯。",
        "en": "Asking pardon in his name.",
        "ja": "て許し与える"
      },
      {
        "vi": "2. Ta chắc chắn được thương xót",
        "ko": "2. 자비받으려면",
        "zh": "2．表現憐恤之心，",
        "en": "2. We receive such mercy",
        "ja": "2．神に倣い"
      },
      {
        "vi": "một khi theo tấm gương của Cha.",
        "ko": "하느님 본받아서",
        "zh": "必蒙耶和華憐恤。",
        "en": "When we act like God above",
        "ja": "進んで許す"
      },
      {
        "vi": "Luôn cảm thông, bao dung ngày mỗi ngày,",
        "ko": "사랑과 동정심 보여",
        "zh": "弟兄姐妹互相關懷，",
        "en": "And forgive each other freely,",
        "ja": "その時神から"
      },
      {
        "vi": "mau thứ tha cho người lỗi lầm.",
        "ko": "서로 용서해야 해.",
        "zh": "時刻以仁慈相待，",
        "en": "Showing empathy and love.",
        "ja": "憐れみ受ける"
      },
      {
        "vi": "Chẳng cưu mang hờn giận, oán trách ai",
        "ko": "참을성을 보이면서",
        "zh": "心甘情願彼此包容，",
        "en": "Putting up with one another,",
        "ja": "仲間傷つけ"
      },
      {
        "vi": "mà yêu thương, rộng lượng bỏ qua.",
        "ko": "상처 주지 않으리.",
        "zh": "不追究別人過錯，",
        "en": "Putting hurtfulness away;",
        "ja": "ず辛抱示し"
      },
      {
        "vi": "Và ta hãy thật lòng quý mến nhau,",
        "ko": "탁월한 이 사랑의 길",
        "zh": "效法上帝樂意寬容，",
        "en": "Showing honor to our brother,",
        "ja": "互い敬えば"
      },
      {
        "vi": "giữ ân tình thắm nồng mãi còn.",
        "ko": "모두에게 보이리.",
        "zh": "以愛心互相尊重。",
        "en": "Showing love's surpassing way.",
        "ja": "愛を示せる"
      },
      {
        "vi": "3. Thương xót, tính thật cao quý,",
        "ko": "3. 자비로운 사람",
        "zh": "3．樂意原諒別人，",
        "en": "3. Mercy is a virtue",
        "ja": "3．神と同じ"
      },
      {
        "vi": "vậy nên ta gắng trau dồi thêm.",
        "ko": "정말 아름답다네.",
        "zh": "培養憐恤的美德。",
        "en": "That we all should cultivate.",
        "ja": "愛育めば"
      },
      {
        "vi": "Khi xót thương, xua tan mọi oán giận,",
        "ko": "마음속 증오와 분노",
        "zh": "消除怒氣，放下怨恨，",
        "en": "It will keep us from resentment,",
        "ja": "怒りと憎しみ"
      },
      {
        "vi": "bao đắng cay trong lòng chẳng còn.",
        "ko": "모두 지워 버리네.",
        "zh": "化解彼此的糾紛。",
        "en": "From the bitterness of hate.",
        "ja": "乗り越えられる"
      },
      {
        "vi": "Cùng noi gương tuyệt vời Đấng Chí Cao,",
        "ko": "사랑 많은 여호와를",
        "zh": "上帝愛心無與倫比，",
        "en": "When we imitate Jehovah,",
        "ja": "エホバに倣っ"
      },
      {
        "vi": "ngài yêu thương hoàn hảo biết bao,",
        "ko": "우리 모두 본받아",
        "zh": "我們願向他學習，",
        "en": "Who is unsurpassed in love,",
        "ja": "て憐れみ抱き"
      },
      {
        "vi": "thì ta sẽ thật sự biết thứ tha,",
        "ko": "진심으로 용서하여",
        "zh": "甘心寬恕，追求和睦，",
        "en": "We will truly be forgiving;",
        "ja": "愛があふれれ"
      },
      {
        "vi": "khiến vui lòng Chúa và thỏa nguyện.",
        "ko": "하느님 닮으리라.",
        "zh": "贏得上帝的嘉許。",
        "en": "We will be like God above.",
        "ja": "ば人を許せる"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Mat 6:12; Ê-phê 4:32; Cô 5:15).",
      "ko": "(마태 6:12; 에베소 4:32; 골로새 3:13 참조)",
      "zh": "（參看太6：12；弗4：32；西3：13）",
      "en": "(See also Matt. 6:12; Eph. 4:32; Col. 3:13.)",
      "ja": "（マタ6：12；エフェ4：32；コロ3：13も参照。）"
    }
  },
  {
    "number": 131,
    "sourceSheet": "131",
    "labels": {
      "vi": "BÀI HÁT 131",
      "ko": "131번",
      "zh": "詩歌第131首",
      "en": "SONG 131",
      "ja": "131番"
    },
    "title": {
      "vi": "l51... Cuộc hôn nhân do Chúa tác hợp",
      "ko": "‘하느님께서 멍에를 함께 메게 하셨네'",
      "zh": "上帝使他們結合",
      "en": "“What God Has Yoked Together”",
      "ja": "「神が結び合わせたもの」"
    },
    "scripture": {
      "vi": "(Ma-thi-ơ 19:5, 6)",
      "ko": "(마태복음 19:5, 6)",
      "zh": "（馬太福音19:5,6）",
      "en": "(Matthew 19:5, 6)",
      "ja": "（マタイ 19:5，6）"
    },
    "lines": [
      {
        "vi": "1. Hôm nay không khí mừng vui,",
        "ko": "1. 삼겹줄 맺어져",
        "zh": "1．三股繩同結合，",
        "en": "1. With dignity and joy,",
        "ja": "1. 喜びの日 "
      },
      {
        "vi": "kết ước hôn nhân trang trọng.",
        "ko": "기쁨이 넘치네.",
        "zh": "多莊嚴、多歡樂。",
        "en": "A threefold cord is bound.",
        "ja": "神の前で"
      },
      {
        "vi": "Xin Chúa ghi nhận câu hứa nguyện:",
        "ko": "주와 사람들 앞에",
        "zh": "天父、眾人同見證，",
        "en": "With God and men to witness,",
        "ja": "2人は誓う "
      },
      {
        "vi": "“Chung thủy muôn đời không thay”. ",
        "ko": "울려 퍼진 서약,",
        "zh": "這誓言多神聖。",
        "en": "These sacred vows resound.",
        "ja": "強い絆"
      },
      {
        "vi": "(ĐIỆP KHÚC 1)",
        "ko": "(후렴 1)",
        "zh": "（副歌1）",
        "en": "(CHORUS 1)",
        "ja": "変わらぬ愛を"
      },
      {
        "vi": "Thành tâm chàng hứa mãi yêu nàng.",
        "ko": "아내를 진심으로",
        "zh": "天父面前他起誓，",
        "en": "He vowed before Jehovah",
        "ja": "妻に誓う"
      },
      {
        "vi": "Sợi dây liên kết vững bền.",
        "ko": "사랑하겠노라.",
        "zh": "愛她永不離棄：",
        "en": "To love her from the heart.",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Cuộc hôn nhân Chúa đã tác hợp,",
        "ko": "‘주 메어 주신 멍에",
        "zh": "「上帝讓我倆結合，",
        "en": "“What God has yoked together,",
        "ja": "聖なる絆"
      },
      {
        "vi": "vậy đừng rẽ chia vợ chồng.",
        "ko": "나누지 못하리.'",
        "zh": "彼此永不分離。」",
        "en": "Let no man put apart.”",
        "ja": "守り抜くと"
      },
      {
        "vi": "2. Chuyên tâm xem xét Lời Cha,",
        "ko": "2. 이 두 사람 모두",
        "zh": "2．他們尋求真理，",
        "en": "2. They both have searched God's Word",
        "ja": "2. この約束 "
      },
      {
        "vi": "sốt sắng vâng theo trong đời,",
        "ko": "주 뜻을 배웠네.",
        "zh": "遵行天父旨意，",
        "en": "To learn to do his will,",
        "ja": "果たせるよう"
      },
      {
        "vi": "họ xin Cha rộng ban phước lành",
        "ko": "이제 축복 구하며",
        "zh": "渴望贏得他喜悅，",
        "en": "And now they seek his blessing,",
        "ja": "祈り求める "
      },
      {
        "vi": "cho lứa đôi tình bền lâu.",
        "ko": "지켜 나갈 약속,",
        "zh": "謹守婚姻誓言。",
        "en": "Their promise to fulfill.",
        "ja": "神の恵み"
      },
      {
        "vi": " (ĐIỆP KHÚC 2)",
        "ko": "(후렴 2)",
        "zh": "（副歌2）",
        "en": "(CHORUS 2)",
        "ja": "変わらぬ愛を"
      },
      {
        "vi": "Thành tâm nàng hứa mãi yêu chàng.",
        "ko": "남편을 진심으로",
        "zh": "天父面前她起誓，",
        "en": "She vowed before Jehovah",
        "ja": "夫に誓う"
      },
      {
        "vi": "Sợi dây liên kết vững bền.",
        "ko": "사랑하겠노라.",
        "zh": "愛他永不離棄：",
        "en": "To love him from the heart.",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Cuộc hôn nhân Chúa đã tác hợp,",
        "ko": "‘주 메어 주신 멍에",
        "zh": "「上帝讓我倆結合，",
        "en": "“What God has yoked together,",
        "ja": "聖なる絆"
      },
      {
        "vi": "vậy đừng rẽ chia vợ chồng.",
        "ko": "나누지 못하리.'",
        "zh": "彼此永不分離。」",
        "en": "Let no man put apart.”",
        "ja": "守り抜くと"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Sáng 2:24; Truyền 4:12; Ê-phê 5:22-33).",
      "ko": "(창세 2:24; 전도 4:12; 에베소 5:22-33 참조)",
      "zh": "（參看創2:24；傳4:12；弗5:22-33）",
      "en": "(See also Gen. 2:24; Eccl. 4:12; Eph. 5:22-33.)",
      "ja": "（創 2:24; 伝 4:12; エフェ 5:22-33も参照。）"
    }
  },
  {
    "number": 132,
    "sourceSheet": "132",
    "labels": {
      "vi": "BÀI HÁT 132",
      "ko": "132번",
      "zh": "詩歌第132首",
      "en": "SONG 132",
      "ja": "132番"
    },
    "title": {
      "vi": "152 Từ nay chúng ta là một",
      "ko": "이제 우리는 한 몸",
      "zh": "現在我們成為一體",
      "en": "Now We Are One",
      "ja": "私たちは一つになる"
    },
    "scripture": {
      "vi": "(Sáng thế 2:25, 24)",
      "ko": "(창세기 2:23, 24)",
      "zh": "（創世記2：23，24）",
      "en": "(Genesis 2:23, 24)",
      "ja": "（創世2：23，24）"
    },
    "lines": [
      {
        "vi": "1. Từ hôm nay đây, đời tôi sẽ có",
        "ko": "1. 내 뼈 같고, 내 살 같은",
        "zh": "1．我的至親，我的摯愛，",
        "en": "1. This is at last bone of my bone,",
        "ja": "世界で１人"
      },
      {
        "vi": "người mà Chúa khiến ra từ thịt xương tôi.",
        "ko": "당신 있어 외롭지 않네.",
        "zh": "你的出現讓我不孤單。",
        "en": "Flesh of my flesh; now I'm not alone.",
        "ja": "の最愛の存在"
      },
      {
        "vi": "Người hiền thê chính Chúa đã ban tặng,",
        "ko": "주께서 맺어 준 사람,",
        "zh": "上帝賜我親密同伴，",
        "en": "God has provided a partner,",
        "ja": "私はあなた"
      },
      {
        "vi": "kết nên tổ ấm gia đình.",
        "ko": "내 사람이라네.",
        "zh": "我們相識相愛。",
        "en": "Someone to call my own.",
        "ja": "に愛を誓う"
      },
      {
        "vi": "Giờ đây đôi ta hiệp một thân thôi,",
        "ko": "이제 우리 한 몸이니",
        "zh": "現在我們成為一體，",
        "en": "Now we are one; now there can be",
        "ja": "あなたはエホ"
      },
      {
        "vi": "cùng nhau đón những ơn lành từ nơi Cha.",
        "ko": "주의 축복 함께 누리리.",
        "zh": "共享生活中點點滴滴。",
        "en": "Blessings to share for you and for me.",
        "ja": "バの尊い贈り物"
      },
      {
        "vi": "Một khi đã gắn kết nên vợ chồng,",
        "ko": "남녀로 하나가",
        "zh": "同甘共苦，永不分離，",
        "en": "As man and woman together,",
        "ja": "命ある限りあ"
      },
      {
        "vi": "chúng ta cùng chung một lối.",
        "ko": "되어 가족이 되었네.",
        "zh": "締造幸福家庭。",
        "en": "We are a family.",
        "ja": "なた愛し守る"
      },
      {
        "vi": "Đôi mình sẽ thờ Cha sốt sắng mỗi ngày.",
        "ko": "늘 함께 하느님 섬기리.",
        "zh": "每一天攜手崇拜上帝，",
        "en": "Ev'ry day we'll serve our God above.",
        "ja": "家族になる今日か"
      },
      {
        "vi": "Nhờ Cha dẫn đưa bước,",
        "ko": "배운 길 따라",
        "zh": "接受他帶領，",
        "en": "As he shows the way,",
        "ja": "らは一つ"
      },
      {
        "vi": "tình yêu thắm thiết, chẳng phai nhạt.",
        "ko": "항상 사랑하리라.",
        "zh": "真愛長存永不息。",
        "en": "Unfailing love we'll display.",
        "ja": "になって"
      },
      {
        "vi": "Lời ta kết ước, thành tâm giữ mãi,",
        "ko": "우리 서약 이행하여",
        "zh": "許下承諾，天長地久，",
        "en": "As we have vowed, so may it be.",
        "ja": "２人の間に神"
      },
      {
        "vi": "từ nay sẽ sống vui mừng ở bên nhau.",
        "ko": "행복한 날 누리게 되리.",
        "zh": "共度每一個春夏秋冬。",
        "en": "Seasons of joy, may we come to see.",
        "ja": "がいてくださる"
      },
      {
        "vi": "Nguyện ta tôn kính Chúa suốt trong đời;",
        "ko": "여호와 함께 섬기며",
        "zh": "我願和你榮耀上帝，",
        "en": "Oh, may we honor Jehovah,",
        "ja": "あなたへの愛は"
      },
      {
        "vi": "lứa đôi nồng thắm, hạnh phúc dài lâu.",
        "ko": "당신을 늘 사랑하리.",
        "zh": "我會一生一世愛你。",
        "en": "And may you always be my love.",
        "ja": "終わりのない愛"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Sáng 29:18; Truyền 4:9, 10; 1 Cô 15:8).",
      "ko": "(창세 29:18; 전도 4:9, 10; 고린도 전서 13:8 참조)",
      "zh": "（參看創29：18；傳4：9，10；林前13：8）",
      "en": "(See also Gen. 29:18; Eccl. 4:9, 10; 1 Cor. 13:8.)",
      "ja": "（創29：18；伝4：9，10；コリ一13：8も参照。）"
    }
  },
  {
    "number": 133,
    "sourceSheet": "133",
    "labels": {
      "vi": "BÀI HÁT 133",
      "ko": "133번",
      "zh": "詩歌第133首",
      "en": "SONG 133",
      "ja": "133番"
    },
    "title": {
      "vi": "l55 Thờ phượng Đức Giê-hô-va trong thời thanh xuân",
      "ko": "청소년 때 여호와를 숭배하라",
      "zh": "善用青春崇拜耶和華",
      "en": "Worship Jehovah During Youth",
      "ja": "若い時にエホバを崇拝する"
    },
    "scripture": {
      "vi": "(Truyền đạo 12:1)",
      "ko": "(전도서 12:1)",
      "zh": "（傳道書12：1）",
      "en": "(Ecclesiastes 12:1)",
      "ja": "（伝道12：1）"
    },
    "lines": [
      {
        "vi": "1. Giê-hô-va quý vô cùng bao thanh thiếu niên",
        "ko": "1. 우리는 하느님 아들딸들,",
        "zh": "1．我們是上帝珍愛的兒女，",
        "en": "1. Precious to God, we are daughters and sons,",
        "ja": "1．若い力エホバに"
      },
      {
        "vi": "dành tuổi xuân tôn thờ Cha, bước đi trung thành.",
        "ko": "젊음의 활력을 드리리라.",
        "zh": "善用青春活力，忠貞不渝。",
        "en": "Giving our strength as his faithful young ones.",
        "ja": "捧げ賛美奏でる"
      },
      {
        "vi": "Ngài chăm sóc ta ân cần qua bao tháng năm, ",
        "ko": "여호와 우리를 돌보시며",
        "zh": "受上帝關愛和悉心照顧，",
        "en": "Loving attention to us he will give,",
        "ja": "真理語るあなたの笑顔"
      },
      {
        "vi": "xuống vô vàn phước ân và chở che trong đời.",
        "ko": "언제나 축복해 주시리라.",
        "zh": "一生的歲月都蒙他賜福。",
        "en": "Blessing our days for as long as we live.",
        "ja": "なんて眩しい"
      },
      {
        "vi": "2. Hãy luôn hiếu kính cha mẹ như Kinh Thánh khuyên,",
        "ko": "2. 우리를 정성껏 돌봐 오신",
        "zh": "2．感謝父母細心關懷呵護，",
        "en": "2. Honoring parents who care for our lives",
        "ja": "2．あなた深く気遣"
      },
      {
        "vi": "họ yêu thương nuôi dạy ta lớn khôn nên người,",
        "ko": "부모님 진실로 공경하면,",
        "zh": "願孝敬他們並衷心順服。",
        "en": "Helps us express what we're feeling inside.",
        "ja": "う親に感謝示せば"
      },
      {
        "vi": "thì Cha quý yêu, bao người xung quanh mến thương,",
        "ko": "하느님 사랑을 받게 되고",
        "zh": "聽從父母必能贏得嘉許，",
        "en": "Then we find favor with God and with men,",
        "ja": "神と人に愛され"
      },
      {
        "vi": "suốt trong đời của ta gần gũi Cha trên trời.",
        "ko": "모두의 사랑도 받으리라.",
        "zh": "加深與上帝的珍貴友誼。",
        "en": "Drawing us close to Jehovah, our Friend.",
        "ja": "その瞳は輝く"
      },
      {
        "vi": "3. Nguyện luôn nhớ Chúa trong thời thanh xuân thắm tươi,",
        "ko": "3. 젊을 때 여호와 기억하고",
        "zh": "3．趁年輕將上帝牢記在心，",
        "en": "3. May we remember our God in our youth,",
        "ja": "3．真理根ざす心に"
      },
      {
        "vi": "lòng ta thêm yêu chuộng chân lý qua bao ngày.",
        "ko": "진리를 매일 더 사랑하리.",
        "zh": "每一天都更加熱愛真理。",
        "en": "Growing each day in our love of the truth.",
        "ja": "神の愛が花咲く"
      },
      {
        "vi": "Điều tốt nhất hiến dâng trọn lên Cha kính yêu",
        "ko": "정성을 다하여 섬긴다면",
        "zh": "把一切最好的獻給上帝，",
        "en": "Giving our best to our God, we will bring",
        "ja": "真理の道それずに歩く"
      },
      {
        "vi": "sẽ mang lại biết bao niềm sướng vui cho ngài.",
        "ko": "여호와 마음에 기쁨 되리.",
        "zh": "讓天父耶和華滿心歡喜。",
        "en": "Joy to the heart of Jehovah, our King.",
        "ja": "あなたいとしい"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 71:17; Ai 3:27; Ê-phê 6:1-5).",
      "ko": "(시 71:17; 애가 3:27; 에베소 6:1-3 참조)",
      "zh": "（參看詩71：17；哀3：27；弗6：1-3）",
      "en": "(See also Ps. 71:17; Lam. 3:27; Eph. 6:1-3.)",
      "ja": "（詩71：17；哀3：27；エフェ6：1‐3も参照。）"
    }
  },
  {
    "number": 134,
    "sourceSheet": "134",
    "labels": {
      "vi": "BÀI HÁT 134",
      "ko": "134번",
      "zh": "詩歌第134首",
      "en": "SONG 134",
      "ja": "134番"
    },
    "title": {
      "vi": "154 Con cái là sản nghiệp từ Đức Chúa Trời",
      "ko": "자녀—하느님이 맡기신 재산",
      "zh": "兒女是上帝所託付的",
      "en": "Children Are a Trust From God",
      "ja": "子供たちは神からの財産"
    },
    "scripture": {
      "vi": "(Thi thiên 127:5-5)",
      "ko": "(시편 127:3-5)",
      "zh": "（詩篇127：3-5）",
      "en": "(Psalm 127:3-5)",
      "ja": "（詩編127：3‐5）"
    },
    "lines": [
      {
        "vi": "1. Trẻ thơ là một sản nghiệp vô giá,",
        "ko": "1. 누구나 부모가 되면",
        "zh": "1．每一個小寶寶誕生，",
        "en": "1. When a man becomes a father",
        "ja": "1．親になったなら"
      },
      {
        "vi": "chính cha mẹ nhận quà này từ Giê-hô-va.",
        "ko": "항상 깊이 새겨야 한다네.",
        "zh": "都是父母親甜蜜的負荷。",
        "en": "And a woman has a child of her own,",
        "ja": "心に刻み込もう"
      },
      {
        "vi": "Hỡi bao mẹ cha, hãy nhớ và chớ quên",
        "ko": "그 아이는 맡겨진 재산,",
        "zh": "要記得這份寶貴禮物",
        "en": "They share a trust, they must remember,",
        "ja": "子供は親だけの"
      },
      {
        "vi": "chăm lo, hướng dẫn, chở che người con.",
        "ko": "부모만의 것 아니네.",
        "zh": "是耶和華親自託付。",
        "en": "That is not theirs, not theirs alone.",
        "ja": "ものではないこと"
      },
      {
        "vi": "Biết rõ con là phần thưởng từ Cha xuống.",
        "ko": "그 선물 주신 여호와는",
        "zh": "奇妙的恩賜來自上帝，",
        "en": "The gift they share is from Jehovah;",
        "ja": "命は神からの"
      },
      {
        "vi": "Giê-hô-va là nguồn của sự sống, yêu thương,",
        "ko": "생명, 사랑의 유일한 근원.",
        "zh": "他賜生命，也賦予人愛心，",
        "en": "Of life and love he is the one true Source.",
        "ja": "大切な贈り物"
      },
      {
        "vi": "đấng ban cha mẹ cách dạy con khôn lớn.",
        "ko": "확실한 주의 교훈들은",
        "zh": "提供指引幫助父母親",
        "en": "To parents he gives sure direction",
        "ja": "エホバの導きを"
      },
      {
        "vi": "Hãy theo đường ngài khôn sáng không gì bằng.",
        "ko": "현명한 지침을 준다네.",
        "zh": "建立幸福美滿的家庭。",
        "en": "That they may follow the wisest course.",
        "ja": "求めて育てよう"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Chúa giao trách nhiệm, hỡi ai làm mẹ cha,",
        "ko": "값진 생명, 신성한 재산",
        "zh": "小小生命，上帝的禮物，",
        "en": "A sacred trust you have been given;",
        "ja": "神から託さ"
      },
      {
        "vi": "bạn được chăm sóc con quý Cha ban.",
        "ko": "부모 손에 맡겨졌네.",
        "zh": "捧在手心好好呵護。",
        "en": "A precious life is in your hands.",
        "ja": "れた大切な命"
      },
      {
        "vi": "Hãy luôn gắng dạy trẻ thơ học theo Chúa,",
        "ko": "주의 축복 늘 넘치도록",
        "zh": "教導兒女真心愛天父，",
        "en": "You can bestow the greatest favor;",
        "ja": "その子に教えよう"
      },
      {
        "vi": "quà cao quỹ nhất với con đời đời.",
        "ko": "주의 계명 가르치세.",
        "zh": "選擇人生最佳道路。",
        "en": "Instruct your child in God's commands.",
        "ja": "エホバのおきてを"
      },
      {
        "vi": "2. Hỡi cha mẹ, lòng bạn cần ghi khắc",
        "ko": "2. 하느님의 모든 명령",
        "zh": "2．父母親要付出努力，",
        "en": "2. All the words God has commanded—",
        "ja": "2．エホバの言葉を"
      },
      {
        "vi": "những chỉ mà Lời Giê-hô-va đã hướng dẫn.",
        "ko": "먼저 자신 마음에 새기고",
        "zh": "將上帝的話語牢記在心，",
        "en": "They must always prove to be on your heart.",
        "ja": "心にいつも入れて"
      },
      {
        "vi": "Hãy ân cần khuyên, uốn nắn, dạy dỗ con,",
        "ko": "자녀에게 가르쳐 주세. ",
        "zh": "反覆將真理教導兒女，",
        "en": "These words you'll speak to sons and daughters;",
        "ja": "子供に語るのは"
      },
      {
        "vi": "cho con biết cách sống theo luật Cha.",
        "ko": "맡겨진 책임이라네.",
        "zh": "才不辜負上帝美意。",
        "en": "This is your trust, this is your part.",
        "ja": "果たすべき務め"
      },
      {
        "vi": "Nhắc nhở con vào mọi dịp, mọi nơi chốn,",
        "ko": "일어날 때도 누울 때도",
        "zh": "無論在路上或是家裡，",
        "en": "To them you'll speak along your roadway,",
        "ja": "道を歩くときも寝"
      },
      {
        "vi": "cả khi đi đường, ở nhà hay lúc vui chơi,",
        "ko": "걸을 때도 늘 가르친다면",
        "zh": "不分晝夜，都要再三叮嚀。",
        "en": "When you rise up and when you are at rest.",
        "ja": "るとき起きるときも"
      },
      {
        "vi": "đề con sau này nhớ lời khuyên Kinh Thánh,",
        "ko": "자녀들 항상 기억하고",
        "zh": "願兒女一生愛戴天父，",
        "en": "In years to come, may they remember,",
        "ja": "教えよう聖書"
      },
      {
        "vi": "bước đi trung kiên, bao phước ân, thỏa nguyện.",
        "ko": "충실하여 축복 누리리.",
        "zh": "忠貞不渝，得上帝賜福。",
        "en": "May they be faithful, may they be blessed.",
        "ja": "を幸せ願いつつ"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Chúa giao trách nhiệm, hỡi ai làm mẹ cha,",
        "ko": "값진 생명, 신성한 재산",
        "zh": "小小生命，上帝的禮物，",
        "en": "A sacred trust you have been given;",
        "ja": "神から託さ"
      },
      {
        "vi": "bạn được chăm sóc con quý Cha ban.",
        "ko": "부모 손에 맡겨졌네.",
        "zh": "捧在手心好好呵護。",
        "en": "A precious life is in your hands.",
        "ja": "れた大切な命"
      },
      {
        "vi": "Hãy luôn gắng dạy trẻ thơ học theo Chúa,",
        "ko": "주의 축복 늘 넘치도록",
        "zh": "教導兒女真心愛天父，",
        "en": "You can bestow the greatest favor;",
        "ja": "その子に教えよう"
      },
      {
        "vi": "quà cao quỹ nhất với con đời đời.",
        "ko": "주의 계명 가르치세.",
        "zh": "選擇人生最佳道路。",
        "en": "Instruct your child in God's commands.",
        "ja": "エホバのおきてを"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Phục 6:6, 7; Ê-phê 6:A;17Ti4:16).",
      "ko": "(신명 6:6, 7; 에베소 6:4; 디모데 전서 4:16 참조)",
      "zh": "（參看申6：6，7；弗6：4；提前4：16）",
      "en": "(See also Deut. 6:6, 7; Eph. 6:4; 1 Tim. 4:16.)",
      "ja": "（申6：6，7；エフェ6：4；テモ一4：16も参照。）"
    }
  },
  {
    "number": 135,
    "sourceSheet": "135",
    "labels": {
      "vi": "BÀI HÁT 135",
      "ko": "135번",
      "zh": "詩歌第135首",
      "en": "SONG 135",
      "ja": "135番"
    },
    "title": {
      "vi": "Đức Giê-hô-va mến gọi: ‘Hỡi con, hãy khôn ngoan!'",
      "ko": "여호와께서 호소하시네, “내 아들아, 지혜롭게 되어라”",
      "zh": "耶和華親切地說：「寶貝，你要有智慧！」",
      "en": "Jehovah's Warm Appeal: “Be Wise, My Son”",
      "ja": "エホバの温かな呼び掛け 「わが子よ，賢く」ありなさい"
    },
    "scripture": {
      "vi": "(Châm ngôn 27:11)",
      "ko": "(잠언 27:11)",
      "zh": "（箴言27:11）",
      "en": "(Proverbs 27:11)",
      "ja": "（格言 27:11）"
    },
    "lines": [
      {
        "vi": "1. Nam thanh và nữ tú,",
        "ko": "1. 청년아, 네 마음을",
        "zh": "1．你善用青春",
        "en": "1. Young man and young woman,",
        "ja": "1. 愛する子よ"
      },
      {
        "vi": "hãy trao dâng trọn lòng cho Cha;",
        "ko": "나에게 다오.",
        "zh": "並將我牢記在心，",
        "en": "do give your heart to me.",
        "ja": "その歩みで"
      },
      {
        "vi": "kẻ thù hiện đang bêu xấu danh Cha",
        "ko": "날 비웃는 적이",
        "zh": "使我可以回答",
        "en": "My foe who now taunts me",
        "ja": "敵に答え"
      },
      {
        "vi": "rồi phải nhận ra.",
        "ko": "보고 알게 되리.",
        "zh": "那譏嘲的仇敵，",
        "en": "will then be made to see.",
        "ja": "出してほしい"
      },
      {
        "vi": "Con dâng trọn cho Cha tuổi thanh xuân,",
        "ko": "네 젊음, 네 정성",
        "zh": "甘心獻出自己，",
        "en": "Your youth and devotion",
        "ja": "あなたは若さ"
      },
      {
        "vi": "trung tín đến cùng;",
        "ko": "기꺼이 준다면",
        "zh": "每天為我而活，",
        "en": "to me you freely give;",
        "ja": "差し出して"
      },
      {
        "vi": "cả thế gian sẽ biết con muốn sống",
        "ko": "온 세상 보리라,",
        "zh": "向全世界證明",
        "en": "You show all the world",
        "ja": "私のために"
      },
      {
        "vi": "làm đẹp lòng Cha.",
        "ko": "날 위해 사는 너.",
        "zh": "你有多麼愛我。",
        "en": "that for me you really live.",
        "ja": "生きている"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Hãy khôn ngoan con, làm cho Cha vui lòng",
        "ko": "사랑하는 내 아들딸아,",
        "zh": "我的寶貝，你要有智慧，",
        "en": "Beloved son and precious daughter,",
        "ja": "息子よ 娘よ"
      },
      {
        "vi": "và quyết trung kiên cùng Cha suốt đời.",
        "ko": "지혜롭게 되어 다오.",
        "zh": "一生令我的心歡悅。",
        "en": "Be wise and make my heart rejoice,",
        "ja": "賢く歩んで"
      },
      {
        "vi": "Con hãy tôn vinh Cha với cả tấm lòng,",
        "ko": "마음으로 원해 섬기며",
        "zh": "希望你將我的手緊握，",
        "en": "That out of your own heart you serve me,",
        "ja": "喜ばせてほしい"
      },
      {
        "vi": "ngợi khen Cha mãi bởi đường con chọn.",
        "ko": "나를 기쁘게 해 다오.",
        "zh": "與我同行，與我為友。",
        "en": "And offer praise by your own choice.",
        "ja": "私の心を"
      },
      {
        "vi": "2. Mong con mừng vui bước mãi theo Cha,",
        "ko": "2. 네 모든 것 기쁨으로",
        "zh": "2．好好享受",
        "en": "2. Rejoice and take pleasure",
        "ja": "2. 愛する子よ"
      },
      {
        "vi": "chọn thờ tôn Cha.",
        "ko": "내게 주면",
        "zh": "你為我付出的時光，",
        "en": "in giving me your all,",
        "ja": "力尽くせ"
      },
      {
        "vi": "Dẫu đường đời con vấp ngã,",
        "ko": "너 넘어질 때도",
        "zh": "就算失足跌倒，",
        "en": "And though you may stumble,",
        "ja": "つまずくなら"
      },
      {
        "vi": "tay Cha liền dìu con lên.",
        "ko": "세워 일으키리.",
        "zh": "我會在你身旁。",
        "en": "I'll raise you if you fall.",
        "ja": "抱き起こそう"
      },
      {
        "vi": "Xung quanh người quay lưng,",
        "ko": "누가 너를 속이고",
        "zh": "即使有人令你害怕、",
        "en": "No matter who fails you",
        "ja": "私は決して"
      },
      {
        "vi": "kẻ mưu gian, con chớ lo sợ",
        "ko": "실망시켜도",
        "zh": "灰心失望，",
        "en": "or proves to be untrue,",
        "ja": "見捨てない"
      },
      {
        "vi": "mà hãy tin chắc chắn Cha quý mến",
        "ko": "넌 내게 소중하니",
        "zh": "我會永遠守護著你，",
        "en": "Take comfort in knowing",
        "ja": "あなたは"
      },
      {
        "vi": "và trợ lực con.",
        "ko": "힘을 내어라.",
        "zh": "絕不遺忘。",
        "en": "I'll always cherish you.",
        "ja": "大切な宝"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Hãy khôn ngoan con, làm cho Cha vui lòng",
        "ko": "사랑하는 내 아들딸아,",
        "zh": "我的寶貝，你要有智慧，",
        "en": "Beloved son and precious daughter,",
        "ja": "息子よ 娘よ"
      },
      {
        "vi": "và quyết trung kiên cùng Cha suốt đời.",
        "ko": "지혜롭게 되어 다오.",
        "zh": "一生令我的心歡悅。",
        "en": "Be wise and make my heart rejoice,",
        "ja": "賢く歩んで"
      },
      {
        "vi": "Con hãy tôn vinh Cha với cả tấm lòng,",
        "ko": "마음으로 원해 섬기며",
        "zh": "希望你將我的手緊握，",
        "en": "That out of your own heart you serve me,",
        "ja": "喜ばせてほしい"
      },
      {
        "vi": "ngợi khen Cha mãi bởi đường con chọn.",
        "ko": "나를 기쁘게 해 다오.",
        "zh": "與我同行，與我為友。",
        "en": "And offer praise by your own choice.",
        "ja": "私の心を"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Phục 6:5; Truyền 11:9; Ê-sai 41:13).",
      "ko": "(신명 6:5; 전도 11:9; 이사야 41:13 참조)",
      "zh": "（參看申6:5；傳11:9；賽41:13）",
      "en": "(See also Deut. 6:5; Eccl. 11:9; Isa. 41:13.)",
      "ja": "（申 6:5; 伝 11:9; イザ 41:13も参照。）"
    }
  },
  {
    "number": 136,
    "sourceSheet": "136",
    "labels": {
      "vi": "BÀI HÁT 136",
      "ko": "136번",
      "zh": "詩歌第136首",
      "en": "SONG 136",
      "ja": "136番"
    },
    "title": {
      "vi": "“Phần thưởng trọn vẹn” từ Đức Giê-hô-va",
      "ko": "여호와께서 주시는 온전한 상",
      "zh": "耶和華必賜你十足賞賜",
      "en": "“A Perfect Wage” From Jehovah",
      "ja": "エホバは「十分に報いて」くださる"
    },
    "scripture": {
      "vi": "(Ru-tơ 2:12)",
      "ko": "(룻기 2:12)",
      "zh": "（路得記2:12）",
      "en": "(Ruth 2:12)",
      "ja": "（ルツ 2:12）"
    },
    "lines": [
      {
        "vi": "1. Thật Cha Giê-hô-va hằng trung tín với bao người",
        "ko": "1. 영혼 다하여 섬기는 모든 이,",
        "zh": "1．耶和華是忠貞信實的上帝，",
        "en": "1. Jehovah is faithful and fully aware",
        "ja": "1. 神に自分差し出して"
      },
      {
        "vi": "trọn tâm thờ tôn Cha, không chuyển lay.",
        "ko": "주 여호와 잘 아시네.",
        "zh": "你的犧牲他不忘記。",
        "en": "Of all those who serve him whole-souled.",
        "ja": "仕える兄弟"
      },
      {
        "vi": "Chúa biết những anh chị vì kiên quyết bước theo ngài,",
        "ko": "정성 다하며 열심을 보여 온",
        "zh": "如經上所記，人為了好消息，",
        "en": "He knows there are times their devotion and zeal",
        "ja": "多くの大切なもの"
      },
      {
        "vi": "chịu nhiều điều mất mát hay khó nhọc.",
        "ko": "그 희생도 다 아시네.",
        "zh": "難免經歷迫害艱辛。",
        "en": "Result in their loss as foretold.",
        "ja": "手放した姉妹"
      },
      {
        "vi": "Hỡi các anh chị em xưa giờ hy sinh thì luôn",
        "ko": "집과 가족, 친구를 잃은 이들",
        "zh": "受家人反對，朋友冷眼以對，",
        "en": "If you have left houses or fam'ly or friends,",
        "ja": "神を選んだあなたを"
      },
      {
        "vi": "tin chắc Chúa trên cao biết mọi điều.",
        "ko": "하느님 분명 아시니,",
        "zh": "你的痛苦上帝了解，",
        "en": "Be sure that our God knows the sum.",
        "ja": "神は見捨てない"
      },
      {
        "vi": "Ngài sẽ xoa dịu ta và ban gấp bội phần hơn,",
        "ko": "이미 소중한 형제들 주셨고",
        "zh": "他已賜給你百倍弟兄姐妹，",
        "en": "He makes it up now with our dear brotherhood",
        "ja": "家族も家も幸福も"
      },
      {
        "vi": "phần thưởng trong tương lai sống muôn đời.",
        "ko": "영원한 삶도 주시리.",
        "zh": "也會讓你永居樂園。",
        "en": "And life in the new world to come.",
        "ja": "必ず与える"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Cầu xin Cha ban trọn vẹn phần thưởng anh chị",
        "ko": "여호와께서 기억하시고",
        "zh": "你決心投靠上帝翅膀下，",
        "en": "May Jehovah reward what you have done.",
        "ja": "愛の神はあなたに"
      },
      {
        "vi": "vì Cha yêu thương, hiền từ, thương xót vô cùng.",
        "ko": "온전한 상을 베푸시리니,",
        "zh": "甘願付出一切來榮耀他，",
        "en": "May he provide a perfect wage for you.",
        "ja": "十分報い与え"
      },
      {
        "vi": "Giê-hô-va vẫn luôn thành tín, chân thật.",
        "ko": "그 날개 아래서 쉬리라.",
        "zh": "他樂意賜你豐厚獎賞，",
        "en": "May you find refuge beneath his wings.",
        "ja": "その翼広げて"
      },
      {
        "vi": "Mình náu thân nơi Cha là trọn đời có bình an.",
        "ko": "주는 참되시고 충실하시네.",
        "zh": "上帝可靠、忠貞，必賜你福分。",
        "en": "Jehovah is faithful; Jehovah is true.",
        "ja": "守ってくれる これからも"
      },
      {
        "vi": "2. Đời ta nhiều lo toan tựa như những gánh mang nặng,",
        "ko": "2. 이 거친 세상, 무거운 짐으로",
        "zh": "2．生活的壓力讓你喘不過氣，",
        "en": "2. At times we may feel that our lot in this life",
        "ja": "2. 押しつぶされそうになる"
      },
      {
        "vi": "dường như đè trên vai muôn khó khăn.",
        "ko": "하루하루 힘겨울 때",
        "zh": "承受重擔精疲力盡，",
        "en": "Has burdened us more than our share.",
        "ja": "抱える重荷で"
      },
      {
        "vi": "Có lúc những ưu phiền bủa vây lấy trí tâm mình,",
        "ko": "나의 어려움 모두 다 아시는",
        "zh": "但你不放棄，勇敢堅持到底，",
        "en": "And sometimes it seems that the cares of the day",
        "ja": "全て諦めたくなる"
      },
      {
        "vi": "chịu đựng làm cho sức ta mỏi mệt.",
        "ko": "여호와께 기도하리.",
        "zh": "你的努力上帝珍惜。",
        "en": "Are more than we're able to bear.",
        "ja": "自分見失い"
      },
      {
        "vi": "Dẫu thế Cha từ nhân luôn kề bên an ủi ta,",
        "ko": "늘 내 곁에서 위로해 주시며",
        "zh": "他樂意聽你向他傾訴心意，",
        "en": "The God of all comfort takes note of your need;",
        "ja": "慰めの神エホバは"
      },
      {
        "vi": "kiên nhẫn lắng nghe bao tiếng cầu xin.",
        "ko": "반드시 응답하시리.",
        "zh": "明白你的一切憂慮，",
        "en": "You know he's the Hearer of prayer.",
        "ja": "あなたを支える"
      },
      {
        "vi": "Thần khí Cha rộng ban, Lời Cha với anh chị em",
        "ko": "주의 말씀과 충실한 벗들로",
        "zh": "他賜力量、真理和弟兄情誼，",
        "en": "His Word and his spirit and true, loving friends",
        "ja": "祈り聞いて力づけ"
      },
      {
        "vi": "trợ sức cho ta luôn bước theo ngài.",
        "ko": "이겨 낼 힘을 주시리.",
        "zh": "陪伴你一路走下去。",
        "en": "Will bring to you comfort and care.",
        "ja": "必ず助ける"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Cầu xin Cha ban trọn vẹn phần thưởng anh chị",
        "ko": "여호와께서 기억하시고",
        "zh": "你決心投靠上帝翅膀下，",
        "en": "May Jehovah reward what you have done.",
        "ja": "愛の神はあなたに"
      },
      {
        "vi": "vì Cha yêu thương, hiền từ, thương xót vô cùng.",
        "ko": "온전한 상을 베푸시리니,",
        "zh": "甘願付出一切來榮耀他，",
        "en": "May he provide a perfect wage for you.",
        "ja": "十分報い与え"
      },
      {
        "vi": "Giê-hô-va vẫn luôn thành tín, chân thật.",
        "ko": "그 날개 아래서 쉬리라.",
        "zh": "他樂意賜你豐厚獎賞，",
        "en": "May you find refuge beneath his wings.",
        "ja": "その翼広げて"
      },
      {
        "vi": "Mình náu thân nơi Cha là trọn đời có bình an.",
        "ko": "주는 참되시고 충실하시네.",
        "zh": "上帝可靠、忠貞，必賜你福分。",
        "en": "Jehovah is faithful; Jehovah is true.",
        "ja": "守ってくれる これからも"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Quan 11:38-40; Ê-sai 41:10).",
      "ko": "(사사 11:38-40; 이사야 41:10 참조)",
      "zh": "（參看士11:38-40；賽41:10）",
      "en": "(See also Judg. 11:38-40; Isa. 41:10.)",
      "ja": "（裁 11:38-40; イザ 41:10も参照。）"
    }
  },
  {
    "number": 137,
    "sourceSheet": "137",
    "labels": {
      "vi": "BÀI HÁT 137",
      "ko": "137번",
      "zh": "詩歌第137首",
      "en": "SONG 137",
      "ja": "137番"
    },
    "title": {
      "vi": "157... Những người nữ trung thành",
      "ko": "충실한 여인들, 그리스도인 자매들",
      "zh": "忠心的女子，基督徒姐妹",
      "en": "Faithful Women, Christian Sisters",
      "ja": "忠実な女性たち"
    },
    "scripture": {
      "vi": "(Rô-ma 16:2)",
      "ko": "(로마서 16:2)",
      "zh": "（羅馬書16：2）",
      "en": "(Romans 16:2)",
      "ja": "（ローマ16：2）"
    },
    "lines": [
      {
        "vi": "1. Sa-ra, Ê-xơ-tê, Ru-tơ, Ma-ri, nhiều nữa,",
        "ko": "1. 사라, 에스더, 마리아와 룻은",
        "zh": "1．以斯帖、撒拉、路得和馬利亞",
        "en": "1. Sarah and Esther, Mary, Ruth, and others—",
        "ja": "1．マリアルツサラエステル"
      },
      {
        "vi": "tất cả là người tài đức, suốt đời luôn thủy chung;",
        "ko": "유능하면서도 충실한 아내.",
        "zh": "都是古代賢慧忠貞的榜樣，",
        "en": "All these were capable women, loyal wives.",
        "ja": "強い信仰貫いた"
      },
      {
        "vi": "hết tâm thờ Giê-hô-va, quyết trung thành tôn kính;",
        "ko": "정성을 다하여 주 섬겼다네.",
        "zh": "她們樂意遵行上帝的旨意，",
        "en": "Godly devotion was foremost in their lives.",
        "ja": "エホバ神に専心し"
      },
      {
        "vi": "tạo danh tiếng thơm lừng, Thánh Kinh lưu lại đời sau.",
        "ko": "충실한 그 이름 모두 다 아네.",
        "zh": "表現堅強信心，留下了美名。",
        "en": "They were faithful women, ones we know by name.",
        "ja": "示した愛揺るぎない"
      },
      {
        "vi": "Nhiều hơn nữa, biết bao người dù không ghi rõ,",
        "ko": "믿음 보여 은총받았으나",
        "zh": "許多女子雖然不見經傳，",
        "en": "There were others favored by Jehovah;",
        "ja": "女性たちの忠誠神"
      },
      {
        "vi": "Chúa yêu thương họ vô cùng, đội nữ trung thành của Cha.",
        "ko": "알려지지 않은 여인도 많다네.",
        "zh": "卻都忠貞不渝，蒙耶和華眷愛。",
        "en": "Nameless in the record, their faith was just the same.",
        "ja": "は全て覚えている"
      },
      {
        "vi": "2. Tính trung thành, nhân đức, can đảm, yêu thương, thành tín,",
        "ko": "2. 충성과 사랑, 친절, 용기, 선함,",
        "zh": "2．和藹又仁慈、良善、勇敢、忠貞，",
        "en": "2. Goodness and courage, loyal love and kindness—",
        "ja": "2．神の書は教えている"
      },
      {
        "vi": "hết thảy đều là phẩm chất đáng được quỹ trọng thay,",
        "ko": "사랑스러우며 훌륭한 특성,",
        "zh": "都是這些古代女子的美德，",
        "en": "Lovable qualities in all humankind,",
        "ja": "模範的な女性たち"
      },
      {
        "vi": "nhắc cho mình luôn nhớ đến biết bao chị thuở trước.",
        "ko": "충실한 여인들 나타냈다네.",
        "zh": "她們的好品行深得人喜愛，",
        "en": "Virtues these excellent women bring to mind.",
        "ja": "勇気と愛善良さ真"
      },
      {
        "vi": "Họ tài đức vô cùng, những gương cho mình theo bước.",
        "ko": "모두 따라야 할 모범이라네.",
        "zh": "這些優秀婦女都堪作模範。",
        "en": "They were fine examples we appreciate.",
        "ja": "の魅力持っていた"
      },
      {
        "vi": "Ngày nay có thêm gương nhiều chị trên khắp đất",
        "ko": "곁에 있는 우리 자매들도",
        "zh": "現代忠心的基督徒姐妹，",
        "en": "In the same way now our Christian sisters",
        "ja": "私たちの姉妹も手"
      },
      {
        "vi": "vẫn luôn theo đường trung thành, được Chúa trân trọng, mến yêu.",
        "ko": "충실히 섬기며 좋은 본 보이네.",
        "zh": "也立下好榜樣，值得效法、稱讚。",
        "en": "Show a faithful spirit we all can imitate.",
        "ja": "本となり励んでいる"
      },
      {
        "vi": "3. Những mẹ, chị, em gái, bao vợ hay bao chị góa",
        "ko": "3. 어머니, 과부, 아내, 자매, 딸들",
        "zh": "3．無論是身為妻子、母親、女兒，",
        "en": "3. Mothers and daughters, sisters, wives, and widows,",
        "ja": "3．忠実な女性全て"
      },
      {
        "vi": "đáng khen vì làm gương tốt, trách nhiệm luôn đảm đương.",
        "ko": "기쁜 마음으로 맡은 일 하네.",
        "zh": "你都辛勤工作，努力盡本分。",
        "en": "Willingly laboring, glad to do your part.",
        "ja": "心込めて奉仕する"
      },
      {
        "vi": "Với tinh thần luôn khiêm tốn, vâng phục và tin kính,",
        "ko": "겸허함 보이며 순종을 하니",
        "zh": "心甘情願服從，謙卑又溫和，",
        "en": "Modest your bearing, submissive is your heart,",
        "ja": "神に自分差し出し"
      },
      {
        "vi": "chị em hãy vui mừng bởi Giê-hô-va ban phước.",
        "ko": "우리의 하느님 좋아하시리.",
        "zh": "不用擔心，你必得天父認可。",
        "en": "Having God's approval, may you never fear.",
        "ja": "て神の愛に守られる"
      },
      {
        "vi": "Cầu xin Chúa ở bên cạnh dịu dàng chăm sóc,",
        "ko": "여호와께 소중한 자매들,",
        "zh": "你是耶和華所關愛的人，",
        "en": "Christian sisters, may Jehovah keep you",
        "ja": "強く信じてほしい報"
      },
      {
        "vi": "giúp đức tin càng vững mạnh, chờ đón muôn vàn phước ân.",
        "ko": "확신 잃지 않아 상을 곧 받으리.",
        "zh": "他必定幫助你，賜你未來福樂。",
        "en": "Firm in your conviction, your prize is drawing near.",
        "ja": "いを得る日が近いと"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Phi-líp 4:5; 1 Tỉ 2:9, 10; 1 Phi 5:4, 5).",
      "ko": "(빌립보 4:3; 디모데 전서 2:9, 10; 베드로 전서 3:4, 5 참조)",
      "zh": "（參看腓4：3；提前2：9，10；彼前3：4，5）",
      "en": "(See also Phil. 4:3; 1 Tim. 2:9, 10; 1 Pet. 3:4, 5.)",
      "ja": "（フィリ4：3；テモ一2：9，10；ペテ一3：4，5も参照。）"
    }
  },
  {
    "number": 138,
    "sourceSheet": "138",
    "labels": {
      "vi": "BÀI HÁT 138",
      "ko": "138번",
      "zh": "詩歌第138首",
      "en": "SONG 138",
      "ja": "138番"
    },
    "title": {
      "vi": "158 Tóc bạc là sự vinh hiển",
      "ko": "백발이되어도 아름답다",
      "zh": "白髮是美麗的冠冕",
      "en": "Beauty in Gray-Headedness",
      "ja": "白髪の美しさ"
    },
    "scripture": {
      "vi": "(Châm ngôn 16:51)",
      "ko": "(잠언 16:31)",
      "zh": "（箴言16：31）",
      "en": "(Proverbs 16:31)",
      "ja": "（格言16：31）"
    },
    "lines": [
      {
        "vi": "1. Quanh mình bao tôi tớ cao niên",
        "ko": "1. 이제 젊음은",
        "zh": "1．轉眼間青春不再，",
        "en": "1. Here with us are aged ones,",
        "ja": "1．年を重ね"
      },
      {
        "vi": "đã qua đi xuân thì.",
        "ko": "가고 백발이지만,",
        "zh": "黑髮已斑白，",
        "en": "Those whose youth has passed.",
        "ja": "た人たち"
      },
      {
        "vi": "Họ chịu đựng bao nỗi gian truân,",
        "ko": "여전히 인내하며",
        "zh": "心中無奈又感慨，",
        "en": "Here among us they endure;",
        "ja": "の深い信"
      },
      {
        "vi": "vẫn trung kiên cùng Cha.",
        "ko": "확고한 이들.",
        "zh": "喚不回摯愛。",
        "en": "Still they're holding fast.",
        "ja": "仰美しい"
      },
      {
        "vi": "Do tuổi cao nên sức tiêu hao,",
        "ko": "사별 아픔",
        "zh": "雖經歷無數悲歡，",
        "en": "Loss of strength besets them all;",
        "ja": "不安や変化"
      },
      {
        "vi": "có khi đơn lẻ bóng.",
        "ko": "겪었고 기력 쇠하니,",
        "zh": "信念依然在，",
        "en": "Loss of mates for some.",
        "ja": "耐えるため"
      },
      {
        "vi": "Cúi xin Cha quan tâm, yêu thương,",
        "ko": "생명의 희망",
        "zh": "天父必顧念關懷，",
        "en": "Father, please confirm their faith",
        "ja": "どうか支え"
      },
      {
        "vi": "vững tin Cha họ theo.",
        "ko": "굳게 지켜 주소서.",
        "zh": "賜美好未來。",
        "en": "In the life to come.",
        "ja": "を父エホバ"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Chúa ghi nhớ gương thành trung,",
        "ko": "아버지, 그　믿음",
        "zh": "天父必不忘記",
        "en": "Father, you remember",
        "ja": "エホバどう"
      },
      {
        "vi": "đức tin của anh chị.",
        "ko": "잘 아시오니,",
        "zh": "你多麼忠心，",
        "en": "How in faith they've run.",
        "ja": "か抱き寄せて"
      },
      {
        "vi": "Chúa ban phước ân đầy dư",
        "ko": "‘참 충실했다!'고 ",
        "zh": "他會以你為傲，",
        "en": "Give them your assurance;",
        "ja": "「よくやっ"
      },
      {
        "vi": "cùng nhiều lời ngợi khen.",
        "ko": "위안하소서.",
        "zh": "說：「你做得好！」",
        "en": "May they hear, “Well done!”",
        "ja": "た」の一言を"
      },
      {
        "vi": "2. Giê-hô-va thương những cao niên",
        "ko": "2. 의의 길에",
        "zh": "2．忠僕白髮是冠冕，",
        "en": "2. Splendid is gray-headedness",
        "ja": "2．正しく生"
      },
      {
        "vi": "sống lâu năm trung thành.",
        "ko": "머무는 그 고운 백발,",
        "zh": "美麗又耀眼，",
        "en": "Found in ways of right.",
        "ja": "きる人た"
      },
      {
        "vi": "Họ đều là hoa ngát hương thơm",
        "ko": "주께 그 충실함은",
        "zh": "在仁愛天父眼中，",
        "en": "Beautiful are faithful ones",
        "ja": "ちの輝く"
      },
      {
        "vi": "với Cha trên trời cao.",
        "ko": "아름답다네.",
        "zh": "你們多珍貴。",
        "en": "In Jehovah's sight.",
        "ja": "白髪美しい"
      },
      {
        "vi": "Một thời họ nhiệt huyết, hăng say,",
        "ko": "우리처럼 젊은",
        "zh": "奉獻出青春歲月，",
        "en": "May we always recognize",
        "ja": "力尽くした若い"
      },
      {
        "vi": "sức thanh niên mạnh mẽ;",
        "ko": "날 있었으리니,",
        "zh": "一生不後悔，",
        "en": "They were once young too.",
        "ja": "日のいち"
      },
      {
        "vi": "trải qua bao gian lao, hy sinh",
        "ko": "가장 좋은",
        "zh": "為天父盡力而為，",
        "en": "Loyally they gave their best",
        "ja": "ずな手本"
      },
      {
        "vi": "đề đi theo hầu Cha.",
        "ko": "시절을 주께 바쳤네.",
        "zh": "忠貞從未變。",
        "en": "When their strength was new.",
        "ja": "胸を打つ"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Chúa ghi nhớ gương thành trung,",
        "ko": "아버지, 그　믿음",
        "zh": "天父必不忘記",
        "en": "Father, you remember",
        "ja": "エホバどう"
      },
      {
        "vi": "đức tin của anh chị.",
        "ko": "잘 아시오니,",
        "zh": "你多麼忠心，",
        "en": "How in faith they've run.",
        "ja": "か抱き寄せて"
      },
      {
        "vi": "Chúa ban phước ân đầy dư",
        "ko": "‘참 충실했다!'고 ",
        "zh": "他會以你為傲，",
        "en": "Give them your assurance;",
        "ja": "「よくやっ"
      },
      {
        "vi": "cùng nhiều lời ngợi khen.",
        "ko": "위안하소서.",
        "zh": "說：「你做得好！」",
        "en": "May they hear, “Well done!”",
        "ja": "た」の一言を"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 71:9, 18; Châm 20:29; Mat 25:21, 23; Lu 22:28; 1Ti 5:1).",
      "ko": "(시 71:9, 18; 잠언 20:29; 마태 25:21, 23; 누가 22:28; 디모데 전서 5:1 참조)",
      "zh": "（參看詩71：9，18；箴20：29；太25：21，23；路22：28；提前5：1）",
      "en": "(See also Ps. 71:9, 18; Prov. 20:29; Matt. 25:21, 23; Luke 22:28; 1 Tim. 5:1.)",
      "ja": "（詩71：9，18；格20：29；マタ25：21，23；ルカ22：28；テモ一5：1も参照。）"
    }
  },
  {
    "number": 139,
    "sourceSheet": "139",
    "labels": {
      "vi": "BÀI HÁT 139",
      "ko": "139번",
      "zh": "詩歌第139首",
      "en": "SONG 139",
      "ja": "139番"
    },
    "title": {
      "vi": "Hình dung cuộc sống bạn trong thế giới mới",
      "ko": "우리 함께 새로운 세상에 살게 될 때",
      "zh": "迎接嶄新的世界",
      "en": "See Yourself When All Is New",
      "ja": "新しい世界を見つめて"
    },
    "scripture": {
      "vi": "(Khải huyền 21:1-5)",
      "ko": "(요한 계시록 21:1-5)",
      "zh": "（啟示錄21:1-5）",
      "en": "(Revelation 21:1-5)",
      "ja": "（啓示 21:1-5）"
    },
    "lines": [
      {
        "vi": "1. Nhìn đến tương lai bạn với tôi đây,",
        "ko": "1. 당신과 나, 우리 모두",
        "zh": "1．來看看吧，",
        "en": "1. Just see yourself, just see me too;",
        "ja": "1. 心に描こう"
      },
      {
        "vi": "mặt đất nên mới, ta cùng nhau chung niềm vui.",
        "ko": "새로운 세상에 사는 모습",
        "zh": "眼前美景，",
        "en": "Just see us all in a world that is new.",
        "ja": "楽園での私を"
      },
      {
        "vi": "Hình dung đến ngày Chúa ban tự do,",
        "ko": "그려 보고 느껴 보라,",
        "zh": "擁抱這煥然一新的天地。",
        "en": "Think how you'll feel, how it will be,",
        "ja": "自由と平和が"
      },
      {
        "vi": "thỏa lòng, vui sướng, kẻ gian tham chẳng còn.",
        "ko": "평화롭고 자유로운 곳.",
        "zh": "無憂無慮，天下太平，",
        "en": "To live in peace, to be truly free.",
        "ja": "満ちた世界にいる"
      },
      {
        "vi": "Bạn thấy ra sao? Hạnh phúc hay chăng?",
        "ko": "악한 자도 없으리라.",
        "zh": "滿心期盼的樂園來臨。",
        "en": "No evil one will then prevail;",
        "ja": "恐れや苦しみ"
      },
      {
        "vi": "Một thế giới mới mà Cha hứa nay thành.",
        "ko": "하느님 통치 다 이루리.",
        "zh": "惡人暴行都已絕跡，",
        "en": "Rule by our God cannot ever fail.",
        "ja": "涙も もはやない"
      },
      {
        "vi": "Ngôi Cha lập nên vững và ban phước khắp nhân loại.",
        "ko": "이 땅 새롭게 시작하는 때에",
        "zh": "上帝的統治永無窮盡。",
        "en": "The time will have come for a new earthly start,",
        "ja": "輝く時代"
      },
      {
        "vi": "Nào ta đồng ca khen",
        "ko": "마음 다하여",
        "zh": "一同來迎接這嶄新的世界，",
        "en": "The song of our praises",
        "ja": "始まる"
      },
      {
        "vi": "Giê-hô-va hết tấm lòng ta:",
        "ko": "찬양 노래하리라.",
        "zh": "止不住熱淚，歡唱滿心的喜悅！",
        "en": "will pour out from our heart:",
        "ja": "感謝の思いあふれ出す"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "“Lạy Chúa Giê-hô-va, việc Chúa ôi tuyệt thay.",
        "ko": "“주 여호와여, 감사합니다.",
        "zh": "耶和華上帝，多麼感謝你！",
        "en": "“We thank you, our God, for all you have done.",
        "ja": "ありがとう 父エホバ"
      },
      {
        "vi": "Hiển vinh, oai nghi thuộc riêng Cha đến muôn đời.",
        "ko": "만물을 새롭게 하셨으니,",
        "zh": "你的愛子已把一切更新。",
        "en": "All things are new by the rule of your Son.",
        "ja": "新しいこの世界"
      },
      {
        "vi": "Cha ban mọi vật nên mới nhờ ngôi Nước Vua Giê-su.",
        "ko": "가슴 벅차올라 노래 부릅니다.",
        "zh": "我們衷心感激，願高歌稱頌你，",
        "en": "The fullness of our heart overflows in our song;",
        "ja": "声響かせ さあ歌おう"
      },
      {
        "vi": "Chúng con nguyện ca khen, tôn kính Chúa Tối Cao muôn năm”.",
        "ko": "모든 영광, 찬양, 홀로 받으소서.”",
        "zh": "一切榮耀讚美永遠屬於上帝！",
        "en": "All glory and honor and praise to you belong.”",
        "ja": "この賛美を今あなたに"
      },
      {
        "vi": "2. Nhìn thấy tương lai bạn với tôi đang",
        "ko": "2. 당신과 나, 함께 누릴",
        "zh": "2．你我腳下",
        "en": "2. Now see yourself, and see me too;",
        "ja": "2. 心を向けよう"
      },
      {
        "vi": "cùng sống trên đất, không buồn lo hay sầu đau.",
        "ko": "새로운 세상을 바라보라.",
        "zh": "這片大地",
        "en": "And look ahead to a world that is new.",
        "ja": "楽園での自分に"
      },
      {
        "vi": "Điều gây khiếp sợ biến tan từ đây.",
        "ko": "둘러봐도 들어 봐도",
        "zh": "綠草如茵，萬物重現生機。",
        "en": "No sight we see, no sound we hear",
        "ja": "静けさ 安らぎ"
      },
      {
        "vi": "Mọi vật nên mới đúng như Cha đã định.",
        "ko": "두려워할 일이 없다네.",
        "zh": "不再傷心，揮別恐懼，",
        "en": "Will cause alarm or give rise to fear.",
        "ja": "満ちた世界にいる"
      },
      {
        "vi": "Lều Giê-hô-va ngự giữa muôn dân.",
        "ko": "모든 약속 이뤄졌네.",
        "zh": "痛苦回憶都已成過去。",
        "en": "All has come true, just as he said;",
        "ja": "エホバの約束"
      },
      {
        "vi": "Người khắp trên đất giờ vui hưởng an bình.",
        "ko": "하느님 천막 펼치셨네.",
        "zh": "上帝諾言全都實現，",
        "en": "Now over mankind, his tent is spread.",
        "ja": "全てが果たされた"
      },
      {
        "vi": "Bao nhiêu người an giấc từ muôn thuở, Chúa kêu gọi.",
        "ko": "이제 죽어 잠든 자 깨우시면",
        "zh": "仁愛的眷顧無邊無界。",
        "en": "He now will awaken those sleeping in death;",
        "ja": "愛する人と"
      },
      {
        "vi": "Họ vui gặp thân nhân,",
        "ko": "그들 목청껏",
        "zh": "上帝呼喚下，死者不再沉睡，",
        "en": "Their voices will join ours with",
        "ja": "再び会える喜び"
      },
      {
        "vi": "cùng ta vang tiếng cảm tạ Cha:",
        "ko": "함께 감사하리라.",
        "zh": "歡欣又雀躍，歌頌上帝的作為！",
        "en": "ev'ry grateful breath:",
        "ja": "すぐそこに"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "“Lạy Chúa Giê-hô-va, việc Chúa ôi tuyệt thay.",
        "ko": "“주 여호와여, 감사합니다.",
        "zh": "耶和華上帝，多麼感謝你！",
        "en": "“We thank you, our God, for all you have done.",
        "ja": "ありがとう 父エホバ"
      },
      {
        "vi": "Hiển vinh, oai nghi thuộc riêng Cha đến muôn đời.",
        "ko": "만물을 새롭게 하셨으니,",
        "zh": "你的愛子已把一切更新。",
        "en": "All things are new by the rule of your Son.",
        "ja": "新しいこの世界"
      },
      {
        "vi": "Cha ban mọi vật nên mới nhờ ngôi Nước Vua Giê-su.",
        "ko": "가슴 벅차올라 노래 부릅니다.",
        "zh": "我們衷心感激，願高歌稱頌你，",
        "en": "The fullness of our heart overflows in our song;",
        "ja": "声響かせ さあ歌おう"
      },
      {
        "vi": "Chúng con nguyện ca khen, tôn kính Chúa Tối Cao muôn năm”.",
        "ko": "모든 영광, 찬양, 홀로 받으소서.”",
        "zh": "一切榮耀讚美永遠屬於上帝！",
        "en": "All glory and honor and praise to you belong.”",
        "ja": "この賛美を今あなたに"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 37:10, 11; Ê-sai 65:17; Giăng 5:28; 2 Phi 3:13).",
      "ko": "(시 37:10, 11; 이사야 65:17; 요한 5:28; 베드로 후서 3:13 참조)",
      "zh": "（參看詩37:10,11；賽65:17；約5:28；彼後3:13）",
      "en": "(See also Ps. 37:10, 11; Isa. 65:17; John 5:28; 2 Pet. 3:13.)",
      "ja": "（詩 37:10，11; イザ 65:17; ヨハ 5:28; ペテ二 3:13も参照。）"
    }
  },
  {
    "number": 140,
    "sourceSheet": "140",
    "labels": {
      "vi": "BÀI HÁT 140",
      "ko": "140번",
      "zh": "詩歌第140首",
      "en": "SONG 140",
      "ja": "140番"
    },
    "title": {
      "vi": "Sự sống vĩnh cửu là đây!",
      "ko": "마침내 끝없는 생명!",
      "zh": "永生終於實現！",
      "en": "LifeWithout End—At Last!",
      "ja": "終わりのない命，ついに！"
    },
    "scripture": {
      "vi": "(Giăng 5:16)",
      "ko": "(요한복음 3:16)",
      "zh": "（約翰福音3：16）",
      "en": "(John 3:16)",
      "ja": "（ヨハネ3：16）"
    },
    "lines": [
      {
        "vi": "1. Bằng đức tin, bạn có thấy chăng?",
        "ko": "1. 마음에 그려 보라,",
        "zh": "1．請想像，終有一天，",
        "en": "1. Can you see with your mind's eye,",
        "ja": "1．思い描こ"
      },
      {
        "vi": "Người khắp nơi chung sống hiền hòa.",
        "ko": "평화로운 낙원을.",
        "zh": "人人團結又和諧，",
        "en": "Peoples dwelling together?",
        "ja": "う神の約束"
      },
      {
        "vi": "Buồn than, đau đớn biến tan luôn.",
        "ko": "슬픔, 고통,",
        "zh": "痛苦、悲傷都消逝，",
        "en": "Sorrow has passed. Peace at last!",
        "ja": "平和な日々が"
      },
      {
        "vi": "Xóa đi kỷ niệm đau buồn.",
        "ko": "눈물도 사라진 낙원을.",
        "zh": "和平之日將至。",
        "en": "Life without tears or pain.",
        "ja": "そこにはある"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Hát xướng, reo vui trong lòng!",
        "ko": "외치라 즐겁게!",
        "zh": "高聲歡呼歌唱！",
        "en": "Sing out with joy of heart!",
        "ja": "終わりのな"
      },
      {
        "vi": "Hướng đến tương lai Cha ban,",
        "ko": "끝없는 생명을.",
        "zh": "要讚美耶和華！",
        "en": "You too can have a part.",
        "ja": "い命受けて"
      },
      {
        "vi": "ngày ta hân hoan nói trong tâm:",
        "ko": "그날 위해 살아라.",
        "zh": "上帝忠僕必看見，",
        "en": "Live for the day when you'll say,",
        "ja": "あなたも生き"
      },
      {
        "vi": "“Sống vui bất tận nay thành!”",
        "ko": "마침내 얻으리.",
        "zh": "永生終於實現！",
        "en": "“Life without end, at last!”",
        "ja": "るパラダイスで"
      },
      {
        "vi": "2. Người khắp nơi hòa thuận với Cha",
        "ko": "2. 모두가 젊어지고",
        "zh": "2．樂園裡，恢復活力，",
        "en": "2. In those days all will be young,",
        "ja": "2．もはや悲しみ"
      },
      {
        "vi": "và trở nên tươi trẻ rạng ngời.",
        "ko": "여호와 벗이 되리.",
        "zh": "成為天父的兒女。",
        "en": "All at peace with Jehovah.",
        "ja": "苦しみもない"
      },
      {
        "vi": "Còn đâu than khóc với lo âu.",
        "ko": "어려움과 두려움",
        "zh": "淚水、恐懼成過去，",
        "en": "Troubles are gone, from now on,",
        "ja": "全ての人"
      },
      {
        "vi": "Chúa ban phước lành dư tràn.",
        "ko": "울 일도 없으리.",
        "zh": "生活充滿意義。",
        "en": "No need to weep or fear.",
        "ja": "に若さ戻る"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Hát xướng, reo vui trong lòng!",
        "ko": "외치라 즐겁게!",
        "zh": "高聲歡呼歌唱！",
        "en": "Sing out with joy of heart!",
        "ja": "終わりのな"
      },
      {
        "vi": "Hướng đến tương lai Cha ban,",
        "ko": "끝없는 생명을.",
        "zh": "要讚美耶和華！",
        "en": "You too can have a part.",
        "ja": "い命受けて"
      },
      {
        "vi": "ngày ta hân hoan nói trong tâm:",
        "ko": "그날 위해 살아라.",
        "zh": "上帝忠僕必看見，",
        "en": "Live for the day when you'll say,",
        "ja": "あなたも生き"
      },
      {
        "vi": "“Sống vui bất tận nay thành!”",
        "ko": "마침내 얻으리.",
        "zh": "永生終於實現！",
        "en": "“Life without end, at last!”",
        "ja": "るパラダイスで"
      },
      {
        "vi": "3. Mừng biết bao người trên đất nay",
        "ko": "3. 낙원을 즐기면서",
        "zh": "3．新世界幸福洋溢，",
        "en": "3. Paradise all will enjoy",
        "ja": "3．賛美歌おう"
      },
      {
        "vi": "cùng sống vui trong cảnh địa đàng;",
        "ko": "주께 영광 돌리리.",
        "zh": "人人都歌頌上帝，",
        "en": "As we sing of God's glory.",
        "ja": "喜びあふれ"
      },
      {
        "vi": "ngày đêm không ngớt hát khen Cha,",
        "ko": "하느님께 영원히",
        "zh": "日復一日不止息，",
        "en": "Long as we live, we will give",
        "ja": "心を込めて"
      },
      {
        "vi": "cám ơn đấng tạo muôn loài.",
        "ko": "감사를 드리리.",
        "zh": "獻上無限感激。",
        "en": "Honor and praise to God.",
        "ja": "エホバ神に"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Hát xướng, reo vui trong lòng!",
        "ko": "외치라 즐겁게!",
        "zh": "高聲歡呼歌唱！",
        "en": "Sing out with joy of heart!",
        "ja": "終わりのな"
      },
      {
        "vi": "Hướng đến tương lai Cha ban,",
        "ko": "끝없는 생명을.",
        "zh": "要讚美耶和華！",
        "en": "You too can have a part.",
        "ja": "い命受けて"
      },
      {
        "vi": "ngày ta hân hoan nói trong tâm:",
        "ko": "그날 위해 살아라.",
        "zh": "上帝忠僕必看見，",
        "en": "Live for the day when you'll say,",
        "ja": "あなたも生き"
      },
      {
        "vi": "“Sống vui bất tận nay thành!”",
        "ko": "마침내 얻으리.",
        "zh": "永生終於實現！",
        "en": "“Life without end, at last!”",
        "ja": "るパラダイスで"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Gióp 55:25; Thi 72:7; Khải 21:4).",
      "ko": "(욥 33:25; 시 72:7; 계시록 21:4 참조)",
      "zh": "（參看伯33：25；詩72：7；啟21：4）",
      "en": "(See also Job 33:25; Ps. 72:7; Rev. 21:4.)",
      "ja": "（ヨブ33：25；詩72：7；啓21：4も参照。）"
    }
  },
  {
    "number": 141,
    "sourceSheet": "141",
    "labels": {
      "vi": "BÀI HÁT 141",
      "ko": "141번",
      "zh": "詩歌第141首",
      "en": "SONG 141",
      "ja": "141番"
    },
    "title": {
      "vi": "l41 Điều kỳ diệu của sự sống",
      "ko": "생명—하느님이 주신 선물",
      "zh": "生命是奇妙恩賜",
      "en": "The Miracle of Life",
      "ja": "命という奇跡"
    },
    "scripture": {
      "vi": "(Thi thiên 56:9)",
      "ko": "(시편 36:9)",
      "zh": "（詩篇36：9）",
      "en": "(Psalm 36:9)",
      "ja": "（詩編36：9）"
    },
    "lines": [
      {
        "vi": "1. Giọt mưa nhẹ rơi xuống, kìa bao hạt nảy mầm,",
        "ko": "1. 갓 난 새 생명, 영근 곡식알,",
        "zh": "1．窗外的雨點、懷裡的寶貝，",
        "en": "1. Ev'ry newborn child, Ev'ry drop of rain,",
        "ja": "1．降り注ぐ日の光"
      },
      {
        "vi": "bình minh rọi chiếu ngày qua ngày, trẻ thơ cười vui",
        "ko": "떨어지는 빗방울, 금빛 햇살.",
        "zh": "都是天父的恩典，奇妙珍貴。",
        "en": "Ev'ry golden ray of sun, Each head of grain—",
        "ja": "きらめく雨の滴も"
      },
      {
        "vi": "là bao quà nơi Chúa, tỏ ra bản tính ngài,",
        "ko": "이 모든 선물 주신 하느님,",
        "zh": "朝陽的光輝、澄黃的稻穗，",
        "en": "All are gifts from God; They reveal his way.",
        "ja": "この命支えてる全"
      },
      {
        "vi": "tạo nên sự sống, hằng muôn tuyệt tác, ôi quý vô cùng!",
        "ko": "기적으로 매일 우릴 돌보시네.",
        "zh": "上帝賜下豐盛恩惠，天天伴隨。",
        "en": "Miracles performed by him sustain us each day.",
        "ja": "てはエホバの祝福"
      },
      {
        "vi": "Chúng ta luôn biết ơn ngài đã ban cho món quà.",
        "ko": "이 고귀한 선물 받게 된 우리,",
        "zh": "多麼感激上帝賜寶貴生命，",
        "en": "So, what are we to do with a gift so rare",
        "ja": "神の愛に応えたい"
      },
      {
        "vi": "Quý cao thay, ta quyết luôn trân trọng, sống sao vui lòng Cha.",
        "ko": "하느님 늘 사랑하고 정성 다하리.",
        "zh": "用行動證明我們真心愛戴上帝。",
        "en": "But to love the One who gave it and show him we care.",
        "ja": "心から神に愛示し"
      },
      {
        "vi": "Chẳng chỉ so sánh cho bằng bởi đây quà vô giá thay.",
        "ko": "어떤 수고로도 받기에 과분한",
        "zh": "單憑自己努力，無法賺得生命，",
        "en": "No matter what we do, We never can earn it.",
        "ja": "この命は神の奇跡"
      },
      {
        "vi": "Sự sống là do phép lạ mà Giê-hô-va ban cho.",
        "ko": "이 생명의 선물, 이 생명의 기적.",
        "zh": "感激天父賜予奇妙生命厚禮。",
        "en": "This gift is still a gift—The miracle of life.",
        "ja": "輝かしく貴いもの"
      },
      {
        "vi": "2. Dù ai sợ gian khó và không còn vững vàng,",
        "ko": "2. 낙심한 이들, 욥의 처같이,",
        "zh": "2．世人若灰心，思想變消極，",
        "en": "2. Others may give up, Lose their will to try,",
        "ja": "2．これ以上歩けないそ"
      },
      {
        "vi": "tựa như vợ Gióp, họ thay lòng, cách xa đường Cha,",
        "ko": "‘죽는 것이 낫겠다' 할지라도,",
        "zh": "也許像約伯之妻輕看生命。",
        "en": "Echoing the wife of Job: “Curse God and die.”",
        "ja": "んな気持ち"
      },
      {
        "vi": "mình theo đường Cha mãi, ngợi khen ngài suốt đời,",
        "ko": "살아 숨 쉬는 이 모든 순간",
        "zh": "上帝讓我們活得有意義，",
        "en": "We are not that way; Praise to God we give,",
        "ja": "になっても"
      },
      {
        "vi": "từng giây mình sống, tạ ơn ngài đã chăm sóc ân cần.",
        "ko": "우리에겐 소중하니, 감사하리.",
        "zh": "要更努力善用一生讚美上帝。",
        "en": "Thanking him for ev'ry precious moment we live.",
        "ja": "今日という一日をエ"
      },
      {
        "vi": "Chúng ta luôn biết ơn ngài đã ban cho món quà.",
        "ko": "이 고귀한 선물 받게 된 우리,",
        "zh": "多麼感激上帝賜寶貴生命，",
        "en": "So, what are we to do with a gift so rare",
        "ja": "ホバに感謝"
      },
      {
        "vi": "Thế nên ta yêu quý, quan tâm người sống ngay bên cạnh ta.",
        "ko": "동료들 늘 사랑하고 정성 보이리.",
        "zh": "用行動證明我們真心愛人如己。",
        "en": "But to love the ones around us and show them we care.",
        "ja": "し生きよう"
      },
      {
        "vi": "Chẳng chỉ so sánh cho bằng bởi đây quà vô giá thay.",
        "ko": "어떤 수고로도 받기에 과분한",
        "zh": "單憑自己努力，無法賺得生命，",
        "en": "No matter what we do, We never can earn it.",
        "ja": "神の愛に応えたい"
      },
      {
        "vi": "Sự sống là do phép lạ mà Giê-hô-va ban cho.",
        "ko": "이 생명의 선물, 이 생명의 기적.",
        "zh": "感激天父賜予奇妙生命厚禮。",
        "en": "This gift is still a gift—The miracle of life.",
        "ja": "心から人に愛示し"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Gióp 2:9; Thi 34:12; Truyền 8:15; Mat 22:57-40; Rô 6:25).",
      "ko": "(욥 2:9; 시 34:12; 전도 8:15; 마태 22:37-40; 로마 6:23 참조)",
      "zh": "（參看伯2：9；詩34：12；傳8：15；太22：37-40；羅6：23）",
      "en": "(See also Job 2:9; Ps. 34:12; Eccl. 8:15; Matt. 22:37-40; Rom. 6:23.)",
      "ja": "（ヨブ2：9；詩34：12；伝8：15；マタ22：37‐40；ロマ6：23も参照。）"
    }
  },
  {
    "number": 142,
    "sourceSheet": "142",
    "labels": {
      "vi": "BÀI HÁT 142",
      "ko": "142번",
      "zh": "詩歌第142首",
      "en": "SONG 142",
      "ja": "142番"
    },
    "title": {
      "vi": "Nắm chặt hy vọng của chúng ta",
      "ko": "희망을굳게 잡으라",
      "zh": "抓緊美好的希望",
      "en": "Holding Fast to Our Hope",
      "ja": "希望をしっかり持ち続ける"
    },
    "scripture": {
      "vi": "(Hê-bơ-rơ 6:18, 19)",
      "ko": "(히브리서 6:18, 19)",
      "zh": "（希伯來書6：18，19）",
      "en": "(Hebrews 6:18, 19)",
      "ja": "（ヘブライ6：18，19）"
    },
    "lines": [
      {
        "vi": "1. Trong bao nhiêu năm con người tự đưa bước đường riêng mình",
        "ko": "1. 수천 년 어둠 속 갇혀 있는 인류,",
        "zh": "1．自古以來，世人在黑暗中徘徊，",
        "en": "1. Mankind has stumbled for centuries in darkness.",
        "ja": "1．人は絶えず道に迷い"
      },
      {
        "vi": "nên bao công lao hư không, tựa mây khói tan tành.",
        "ko": "그 어떤 노력도 모두 헛되네.",
        "zh": "一切努力轉眼竟如風消散。",
        "en": "Vain is their quest as they try to catch the wind.",
        "ja": "救い求め風を追う"
      },
      {
        "vi": "Nhân gian ai nấy di truyền tội từ nơi A-đam,",
        "ko": "우리는 모두 다 비참한 죄인,",
        "zh": "人性弱點已經赤裸裸呈現，",
        "en": "Man's tragic flaw is revealed in its starkness;",
        "ja": "罪の力逆らえず"
      },
      {
        "vi": "cuộc đời tăm tối, đớn đau và vô vọng.",
        "ko": "구원할 능력이 없다네.",
        "zh": "無力改變因受罪纏累。",
        "en": "None can they save, for they all have sinned.",
        "ja": "力希望なくす"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Ta vui ca hát, Nước Cha trị vì trên caol",
        "ko": "기뻐하라, 왕국 탄생했네!",
        "zh": "歡欣高歌，迎接上帝王國，",
        "en": "Sing with good cheer, for God's Kingdom is here!",
        "ja": "元気出してさあ歌おう"
      },
      {
        "vi": "Vua đầy quyền lực sẽ xóa âu lo và than khóc.",
        "ko": "예수 통치 두려움 없애 주네.",
        "zh": "基督的統治帶來真正自由。",
        "en": "His Son's mighty reign brings us freedom from fear.",
        "ja": "王国救いもたらす"
      },
      {
        "vi": "Bao nhiêu gian ác sẽ không còn trên đất mới.",
        "ko": "마침내 모든 악 멸하시리.",
        "zh": "還有片刻，邪惡不再存留，",
        "en": "Through him, at last, evil soon will be past;",
        "ja": "希望つかみ離さず"
      },
      {
        "vi": "Hy vọng về ngày ấy giống như neo giữ gìn ta.",
        "ko": "이 희망의 닻, 우릴 지켜 주리.",
        "zh": "抓緊美好的希望，永不放手。",
        "en": "This hope, like an anchor, is holding us fast.",
        "ja": "命のいかり頼ろう"
      },
      {
        "vi": "2. Nay muôn dân nghe tin mừng: “Ngày Cha đến gần đây rồi!”.",
        "ko": "2. ‘여호와의 날이 정말 가까웠네!'",
        "zh": "2．向人宣告上帝的大日子已近，",
        "en": "2. “God's day is near!” rings the Kingdom proclamation;",
        "ja": "2．エホバの日は近づいたと"
      },
      {
        "vi": "Mai sau không ai kêu than rằng: “Cho đến bao giờ?”.",
        "ko": "마침내 죄에서 해방되리라.",
        "zh": "他將拯救悲傷嘆息的子民。",
        "en": "Men will no longer cry out to God: “How long?”",
        "ja": "告げる声が鳴り響く"
      },
      {
        "vi": "Cha ra tay cứu nhân loại hiện nay đang khóc than.",
        "ko": "눈물과 탄식이 더는 없으리.",
        "zh": "不再聽見受苦的人們哭泣，",
        "en": "Soon he will free all his groaning creation.",
        "ja": "神は悪を終わらせて"
      },
      {
        "vi": "Nào mọi dân hãy đến khen ngợi danh noài.",
        "ko": "전능한 하느님 찬양해.",
        "zh": "歌頌讚美全能的上帝。",
        "en": "Praise God Almighty, and join our song.",
        "ja": "皆の希望かなう"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Ta vui ca hát, Nước Cha trị vì trên caol",
        "ko": "기뻐하라, 왕국 탄생했네!",
        "zh": "歡欣高歌，迎接上帝王國，",
        "en": "Sing with good cheer, for God's Kingdom is here!",
        "ja": "元気出してさあ歌おう"
      },
      {
        "vi": "Vua đầy quyền lực sẽ xóa âu lo và than khóc.",
        "ko": "예수 통치 두려움 없애 주네.",
        "zh": "基督的統治帶來真正自由。",
        "en": "His Son's mighty reign brings us freedom from fear.",
        "ja": "王国救いもたらす"
      },
      {
        "vi": "Bao nhiêu gian ác sẽ không còn trên đất mới.",
        "ko": "마침내 모든 악 멸하시리.",
        "zh": "還有片刻，邪惡不再存留，",
        "en": "Through him, at last, evil soon will be past;",
        "ja": "希望つかみ離さず"
      },
      {
        "vi": "Hy vọng về ngày ấy giống như neo giữ gìn ta.",
        "ko": "이 희망의 닻, 우릴 지켜 주리.",
        "zh": "抓緊美好的希望，永不放手。",
        "en": "This hope, like an anchor, is holding us fast.",
        "ja": "命のいかり頼ろう"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 27:14; Truyền 1:14; Giô-ên 2:1; Ha-ba 1:2, 5; Rô 8:22).",
      "ko": "(시 27:14; 전도 1:14; 요엘 2:1; 하박국 1:2, 3; 로마 8:22 참조)",
      "zh": "（參看詩27：14；傳1：14；珥2：1；哈1：2，3；羅8：22）",
      "en": "(See also Ps. 27:14; Eccl. 1:14; Joel 2:1; Hab. 1:2, 3; Rom. 8:22.)",
      "ja": "（詩27：14；伝1：14；ヨエ2：1；ハバ1：2，3；ロマ8：22も参照。）"
    }
  },
  {
    "number": 143,
    "sourceSheet": "143",
    "labels": {
      "vi": "BÀI HÁT 143",
      "ko": "143번",
      "zh": "詩歌第143首",
      "en": "SONG 143",
      "ja": "143番"
    },
    "title": {
      "vi": "Hãy luôn bận rộn, thức canh và trông đợi",
      "ko": "계속 깨어서 섬기며 기다리라",
      "zh": "不斷工作、守望、等候",
      "en": "KeepWorking, Watching, and Waiting",
      "ja": "諦めずにエホバの日を"
    },
    "scripture": {
      "vi": "(Rô-ma 8:20-25)",
      "ko": "(로마서 8:20-25)",
      "zh": "（羅馬書8：20-25）",
      "en": "(Romans 8:20-25)",
      "ja": "（ローマ8：20‐25）"
    },
    "lines": [
      {
        "vi": "1. Ôi Cha Giê-hô-va trung tín thay,",
        "ko": "1. 때와 시기 정하시는",
        "zh": "1．是誰掌管時代、時期？",
        "en": "1. The God of times and of seasons,",
        "ja": "待ち続ける"
      },
      {
        "vi": "chẳng sai trong bao lời Cha phán ra.",
        "ko": "유일하신 주 여호와,",
        "zh": "是偉大耶和華上帝。",
        "en": "Whose name alone is Jehovah—",
        "ja": "1．エホバ知って"
      },
      {
        "vi": "Những chi Cha toan định đang đến nhanh,",
        "ko": "그 주권 입증될 날이",
        "zh": "他的權柄將受彰顯，",
        "en": "The time for his vindication",
        "ja": "いる一番良い時"
      },
      {
        "vi": "hầu ngài được mọi dân tôn kính.",
        "ko": "참으로 가까웠네.",
        "zh": "徵象已清楚可見。",
        "en": "Is near by signs we can see.",
        "ja": "主権の正しさ"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Thức canh và bận rộn trong bao công tác ngài.",
        "ko": "그날, 참된 생명 얻을 그날,",
        "zh": "一同不斷工作、守望、等候，",
        "en": "Keep on working and watching and waiting,",
        "ja": "明らかにする"
      },
      {
        "vi": "Ta trông đợi và hân hoan mừng rỡ",
        "ko": "깨어서 계속 섬기며",
        "zh": "熱切期盼在樂園中",
        "en": "Joyfully anticipating,",
        "ja": "さあ喜び忘れず"
      },
      {
        "vi": "về tương lai sáng tươi ngày mai.",
        "ko": "간절히 기다리리.",
        "zh": "享受幸福的生活。",
        "en": "Life as God meant it to be.",
        "ja": "楽しみに待とう"
      },
      {
        "vi": "2. Mai đây Giê-su thực thi ý Cha,",
        "ko": "2. 주 아들 승리할 날이",
        "zh": "2．在上帝預定的日期，",
        "en": "2. The time has long been appointed;",
        "ja": "神の約束"
      },
      {
        "vi": "xuất quân đi chinh phục cả thế gian,",
        "ko": "오래전 정해졌다네.",
        "zh": "君王耶穌準備出擊，",
        "en": "His Son is ready to conquer,",
        "ja": "2．イエス待って"
      },
      {
        "vi": "đánh tan bao nhiêu kẻ chống đối Cha",
        "ko": "예수는 적들 멸하고",
        "zh": "戰勝所有反對勢力，",
        "en": "Defeating all who oppose him.",
        "ja": "いる征服する時"
      },
      {
        "vi": "và rồi được thành công vinh hiển.",
        "ko": "승리를 거두시리.",
        "zh": "他的劍所向無敵。",
        "en": "His sword will bring victory.",
        "ja": "勝利の剣で敵打ち負かす"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Thức canh và bận rộn trong bao công tác ngài.",
        "ko": "그날, 참된 생명 얻을 그날,",
        "zh": "一同不斷工作、守望、等候，",
        "en": "Keep on working and watching and waiting,",
        "ja": "明らかにする"
      },
      {
        "vi": "Ta trông đợi và hân hoan mừng rỡ",
        "ko": "깨어서 계속 섬기며",
        "zh": "熱切期盼在樂園中",
        "en": "Joyfully anticipating,",
        "ja": "さあ喜び忘れず"
      },
      {
        "vi": "về tương lai sáng tươi ngày mai.",
        "ko": "간절히 기다리리.",
        "zh": "享受幸福的生活。",
        "en": "Life as God meant it to be.",
        "ja": "楽しみに待とう"
      },
      {
        "vi": "3. Nhân gian nay đang buồn đau, thở than,",
        "ko": "3. 온 세상 신음하여도",
        "zh": "3．儘管世人痛苦呻吟，",
        "en": "3. Though all creation is groaning,",
        "ja": "3．みんな待ってい"
      },
      {
        "vi": "thế nhưng ta vui mừng trong đức tin,",
        "ko": "우리는 기다린다네.",
        "zh": "我們卻有堅定信心，",
        "en": "In faith we're eagerly waiting.",
        "ja": "る自由になる時"
      },
      {
        "vi": "hướng trông nơi hy vọng Cha đã ban,",
        "ko": "주의 날 가까웠으니",
        "zh": "等待上帝日子來臨，",
        "en": "Jehovah's day is approaching,",
        "ja": "エホバが定め"
      },
      {
        "vi": "chờ đợi ngày được Cha cứu rỗi.",
        "ko": "우리는 해방되리.",
        "zh": "真正的自由已近。",
        "en": "The time for setting us free.",
        "ja": "たその日信じて"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Thức canh và bận rộn trong bao công tác ngài.",
        "ko": "그날, 참된 생명 얻을 그날,",
        "zh": "一同不斷工作、守望、等候，",
        "en": "Keep on working and watching and waiting,",
        "ja": "明らかにする"
      },
      {
        "vi": "Ta trông đợi và hân hoan mừng rỡ",
        "ko": "깨어서 계속 섬기며",
        "zh": "熱切期盼在樂園中",
        "en": "Joyfully anticipating,",
        "ja": "さあ喜び忘れず"
      },
      {
        "vi": "về tương lai sáng tươi ngày mai.",
        "ko": "간절히 기다리리.",
        "zh": "享受幸福的生活。",
        "en": "Life as God meant it to be.",
        "ja": "楽しみに待とう"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Mat 25:13; Lu 12:36).",
      "ko": "(마태 25:13; 누가 12:36 참조)",
      "zh": "（參看太25：13；路12：36）",
      "en": "(See also Matt. 25:13; Luke 12:36.)",
      "ja": "（マタ 25:13; ルカ 12:36も参照。）"
    }
  },
  {
    "number": 144,
    "sourceSheet": "144",
    "labels": {
      "vi": "BÀI HÁT 144",
      "ko": "144번",
      "zh": "詩歌第144首",
      "en": "SONG 144",
      "ja": "144番"
    },
    "title": {
      "vi": "Hãy đặt phần thưởng trước mặt luôn!",
      "ko": "상을계속 바라보라!",
      "zh": "注視未來美好獎賞！",
      "en": "KeepYour Eyes on the Prize!",
      "ja": "報いを見つめて"
    },
    "scripture": {
      "vi": "(2 Cô-rinh-tô 4:18)",
      "ko": "(고린도 후서 4:18)",
      "zh": "（哥林多後書4：18）",
      "en": "(2 Corinthians 4:18)",
      "ja": "（コリント第二4：18）"
    },
    "lines": [
      {
        "vi": "1. Mọi người điếc mừng rỡ nay nghe trở lại.",
        "ko": "1. 눈먼 사람 다시 앞 보며",
        "zh": "1．新世界映入盲人眼簾，",
        "en": "1. When the eyes of blind ones see again",
        "ja": "1．光失くした人"
      },
      {
        "vi": "Người mù sẽ nhìn thấy ngàn ánh ban mai.",
        "ko": "듣지 못하던 귀 열리고,",
        "zh": "歡笑聲迴盪聾人耳邊，",
        "en": "And the ears of deaf ones hear again,",
        "ja": "豊かな色を見る"
      },
      {
        "vi": "Bao tiếng hát trẻ thơ rộn vang đây đó.",
        "ko": "아이들의 노랫소리와",
        "zh": "聽孩童歌聲飄揚原野，",
        "en": "When the songs of children fill the air",
        "ja": "音を失くした"
      },
      {
        "vi": "Khắp chốn an vui, điệu nhạc hân hoan.",
        "ko": "평화와 기쁨 넘칠 때,",
        "zh": "瀰漫歡樂幸福滋味。",
        "en": "And joy and peace are ev'rywhere,",
        "ja": "人歌声聞こえる"
      },
      {
        "vi": "Địa cầu chẳng còn cảnh đau thương, lệ nhòa.",
        "ko": "사랑하는 사람 되찾고",
        "zh": "看去世至親重回身邊，",
        "en": "When our loved ones will return to life,",
        "ja": "再び命得た家"
      },
      {
        "vi": "Người đã khuất được sống lại với thân nhân.",
        "ko": "죄와 죽음 다 사라지리.",
        "zh": "生活在平安美麗家園。",
        "en": "To an earth that's free from sin and strife,",
        "ja": "族を抱き締める"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Ta sẽ thấy tương lai huy hoàng trên đất,",
        "ko": "이 모든 일 성취되리니,",
        "zh": "要注視未來美好獎賞，",
        "en": "You will see how God these things supplies,",
        "ja": "そこにあなたもいる"
      },
      {
        "vi": "nếu ta đặt phần thưởng trước mặt luôn.",
        "ko": "계속 상을 바라보라.",
        "zh": "上帝必實現這希望。",
        "en": "If you keep your eyes on the prize.",
        "ja": "報い見つめれば"
      },
      {
        "vi": "2. Kìa bầy gấu sưởi nắng bên cạnh đàn bò,",
        "ko": "2. 양과 이리 함께 먹으며",
        "zh": "2．陽光下母熊陪伴小牛，",
        "en": "2. When the wolves and lambs will feed as one,",
        "ja": "2．羊とライオン"
      },
      {
        "vi": "và cừu sẽ cùng sói đùa giỡn, ăn chung.",
        "ko": "소와 곰이 햇살 즐기고,",
        "zh": "草原上野狼小羊同臥。",
        "en": "When the bears and calves bask in the sun,",
        "ja": "が草の上で遊ぶ"
      },
      {
        "vi": "Khi đứa bé tung tăng chạy chơi với chúng,",
        "ko": "어린아이의 목소리에",
        "zh": "在孩童呼喚帶領之下，",
        "en": "Then a mere young boy will lead them all,",
        "ja": "痛みも傷もな"
      },
      {
        "vi": "chúng bước đi theo lời gọi thơ ngây.",
        "ko": "모든 동물이 따를 때,",
        "zh": "野獸既溫馴又聽話。",
        "en": "And they will heed his childish call.",
        "ja": "い悩みも病も"
      },
      {
        "vi": "Vào ngày ấy nào thấy than van, buồn rầu;",
        "ko": "눈물은 다 어제 일 되며",
        "zh": "將悲傷眼淚留給昨天，",
        "en": "When our tears belong to yesterday,",
        "ja": "悲しみの涙が"
      },
      {
        "vi": "mọi sợ hãi, đau đớn thuộc thuở xa xưa.",
        "ko": "근심 고통 다 사라지리.",
        "zh": "用歡笑喜悅迎接明天。",
        "en": "When our fears and pain have passed away,",
        "ja": "笑顔に変わる時"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Ta sẽ thấy tương lai huy hoàng trên đất,",
        "ko": "이 모든 일 성취되리니,",
        "zh": "要注視未來美好獎賞，",
        "en": "You will see how God these things supplies,",
        "ja": "そこにあなたもいる"
      },
      {
        "vi": "nếu ta đặt phần thưởng trước mặt luôn.",
        "ko": "계속 상을 바라보라.",
        "zh": "上帝必實現這希望。",
        "en": "If you keep your eyes on the prize.",
        "ja": "報い見つめれば"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Ê-sai 11:6-9; 55:5-7; Giăng 11:24).",
      "ko": "(이사야 11:6-9; 35:5-7; 요한 11:24 참조)",
      "zh": "（參看賽11：6-9；35：5-7；約11：24）",
      "en": "(See also Isa. 11:6-9; 35:5-7; John 11:24.)",
      "ja": "（イザ11：6‐9；35：5‐7；ヨハ11：24も参照。）"
    }
  },
  {
    "number": 145,
    "sourceSheet": "145",
    "labels": {
      "vi": "BÀI HÁT 145",
      "ko": "145번",
      "zh": "詩歌第145首",
      "en": "SONG 145",
      "ja": "145番"
    },
    "title": {
      "vi": "Lời hứa của Đức Chúa Trời về địa đàng",
      "ko": "하느님께서 약속하신낙원",
      "zh": "上帝承諾帶來樂園",
      "en": "God's Promise of Paradise",
      "ja": "パラダイスについての神の約束"
    },
    "scripture": {
      "vi": "(Lu-ca 25:45)",
      "ko": "(누가복음 23:43)",
      "zh": "（路加福音23：43）",
      "en": "(Luke 23:43)",
      "ja": "（ルカ23：43）"
    },
    "lines": [
      {
        "vi": "1. Cha Giê-hô-va đã hứa làm đất nên",
        "ko": "1. 하느님이 약속한 낙원,",
        "zh": "1．上帝承諾將帶來樂園，",
        "en": "1. A paradise our God has promised,",
        "ja": "1．エホバの愛情が"
      },
      {
        "vi": "như vườn Ê-đen nhờ Nước của Cha.",
        "ko": "예수 통해 이루실 때",
        "zh": "人人恢復身心完美。",
        "en": "By means of Christ's Millennial Reign,",
        "ja": "世界にあふれる"
      },
      {
        "vi": "Trong một ngàn năm, tội lỗi, chết chóc hay",
        "ko": "모든 죄와 그 눈물, 고통,",
        "zh": "通過基督千年的統治，",
        "en": "When he'll blot out all sin and error,",
        "ja": "罪と死苦しみを"
      },
      {
        "vi": "đau đớn, đắng cay ngài xóa muôn đời.",
        "ko": "죽음마저 없애시리.",
        "zh": "死亡、悲痛盡都消失。",
        "en": "Removing death and tears and pain.",
        "ja": "イエスは消し去る"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Địa đàng Cha hứa nay đã đến gần;",
        "ko": "이 온 땅이 낙원 될 일,",
        "zh": "美麗樂園近在眼前，",
        "en": "A paradise, the earth will be.",
        "ja": "キリスト間もな"
      },
      {
        "vi": "bằng đức tin mạnh, mình thấy rõ ràng.",
        "ko": "믿음으로 볼 수 있네.",
        "zh": "信心之眼清楚看見。",
        "en": "With eyes of faith, this we can see.",
        "ja": "く地球を治める"
      },
      {
        "vi": "Lời xưa Cha phán, Con chắc sẽ làm;",
        "ko": "그 약속을 기쁨으로",
        "zh": "基督實現上帝諾言，",
        "en": "This promise Christ will soon fulfill,",
        "ja": "世界に輝く"
      },
      {
        "vi": "ngài thích thị hành ý Giê-hô-va.",
        "ko": "이루실 날 가까웠네.",
        "zh": "地上樂園必定重建！",
        "en": "For he delights to do God's will.",
        "ja": "エホバの栄光"
      },
      {
        "vi": "2. Theo lệnh của Cha, người mất từ bấy lâu",
        "ko": "2. ‘나와 함께 낙원에 살리'",
        "zh": "2．上帝承諾讓死者復生，",
        "en": "2. Soon here on earth, as God has purposed,",
        "ja": "2．イエスは罪人"
      },
      {
        "vi": "sống lại nay mai cùng với thân nhân.",
        "ko": "그 약속을 지키시리.",
        "zh": "通過基督施展大能。",
        "en": "His Son will cause the dead to rise.",
        "ja": "と約束交わした"
      },
      {
        "vi": "Như lời Giê-su thuở trước đã hứa ban:",
        "ko": "하느님 뜻 곧 이루어져",
        "zh": "耶穌基督曾向人保證：",
        "en": "Then it will be as Jesus promised:",
        "ja": "地上のパラダイ"
      },
      {
        "vi": "“Anh ở với tôi tại chốn địa đàng”.",
        "ko": "죽은 자들 부활되리.",
        "zh": "「你必和我在樂園裡。」",
        "en": "‘You'll be with me in Paradise.'",
        "ja": "スそこでの命を"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Địa đàng Cha hứa nay đã đến gần;",
        "ko": "이 온 땅이 낙원 될 일,",
        "zh": "美麗樂園近在眼前，",
        "en": "A paradise, the earth will be.",
        "ja": "キリスト間もな"
      },
      {
        "vi": "bằng đức tin mạnh, mình thấy rõ ràng.",
        "ko": "믿음으로 볼 수 있네.",
        "zh": "信心之眼清楚看見。",
        "en": "With eyes of faith, this we can see.",
        "ja": "く地球を治める"
      },
      {
        "vi": "Lời xưa Cha phán, Con chắc sẽ làm;",
        "ko": "그 약속을 기쁨으로",
        "zh": "基督實現上帝諾言，",
        "en": "This promise Christ will soon fulfill,",
        "ja": "世界に輝く"
      },
      {
        "vi": "ngài thích thị hành ý Giê-hô-va.",
        "ko": "이루실 날 가까웠네.",
        "zh": "地上樂園必定重建！",
        "en": "For he delights to do God's will.",
        "ja": "エホバの栄光"
      },
      {
        "vi": "3. Vâng, địa đàng đây! Lời hứa thật đúng thay!",
        "ko": "3. 예수께서 왕 되셨으니",
        "zh": "3．基督已經在天上作王，",
        "en": "3. The Paradise, our Lord has promised,",
        "ja": "3．エホバの目的を"
      },
      {
        "vi": "Vua trị vì trong quyền thế hiền vinh.",
        "ko": "곧 온 땅이 낙원 되리.",
        "zh": "即將實現樂園希望。",
        "en": "And he is now our reigning King.",
        "ja": "イエスは成し遂げ"
      },
      {
        "vi": "Ta tạ ơn Cha vì quá đỗi xót thương,",
        "ko": "여호와께 늘 감사하며",
        "zh": "多麼感謝仁愛耶和華，",
        "en": "We daily thank our loving Father,",
        "ja": "天地は高らかに"
      },
      {
        "vi": "dâng tiếng hát khen bằng hết tâm mình.",
        "ko": "마음 다해 찬양하리.",
        "zh": "衷心讚美，天天頌揚。",
        "en": "And from our hearts, his praises sing.",
        "ja": "エホバをたたえる"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Địa đàng Cha hứa nay đã đến gần;",
        "ko": "이 온 땅이 낙원 될 일,",
        "zh": "美麗樂園近在眼前，",
        "en": "A paradise, the earth will be.",
        "ja": "キリスト間もな"
      },
      {
        "vi": "bằng đức tin mạnh, mình thấy rõ ràng.",
        "ko": "믿음으로 볼 수 있네.",
        "zh": "信心之眼清楚看見。",
        "en": "With eyes of faith, this we can see.",
        "ja": "く地球を治める"
      },
      {
        "vi": "Lời xưa Cha phán, Con chắc sẽ làm;",
        "ko": "그 약속을 기쁨으로",
        "zh": "基督實現上帝諾言，",
        "en": "This promise Christ will soon fulfill,",
        "ja": "世界に輝く"
      },
      {
        "vi": "ngài thích thị hành ý Giê-hô-va.",
        "ko": "이루실 날 가까웠네.",
        "zh": "地上樂園必定重建！",
        "en": "For he delights to do God's will.",
        "ja": "エホバの栄光"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Mat 5:5; 6:10; Giăng 5:28, 29).",
      "ko": "(마태 5:5; 6:10; 요한 5:28, 29 참조)",
      "zh": "（參看太5：5；6：10；約5：28，29）",
      "en": "(See also Matt. 5:5; 6:10; John 5:28, 29.)",
      "ja": "（マタ5：5；6：10；ヨハ5：28，29も参照。）"
    }
  },
  {
    "number": 146,
    "sourceSheet": "146",
    "labels": {
      "vi": "BÀI HÁT 146",
      "ko": "146번",
      "zh": "詩歌第146首",
      "en": "SONG 146",
      "ja": "146番"
    },
    "title": {
      "vi": "“Làm mọi vật nên mới”",
      "ko": "“모든 것을 새롭게 하리라”",
      "zh": "上帝會更新一切",
      "en": "“Making All Things New”",
      "ja": "「全てのものを新しくしている」"
    },
    "scripture": {
      "vi": "(Khải huyền 21:1-5)",
      "ko": "(요한 계시록 21:1-5)",
      "zh": "（啟示錄21：1-5）",
      "en": "(Revelation 21:1-5)",
      "ja": "（啓示21：1‐5）"
    },
    "lines": [
      {
        "vi": "1. Nhiều dấu cho hay rằng nay Vua đã cai trị rồi,",
        "ko": "1. 때의 표징은 분명히 알리네.",
        "zh": "1．末世徵象顯示王國已建立，",
        "en": "1. “The signs of the times” prove God's rule has begun.",
        "ja": "1．始まった神の統治"
      },
      {
        "vi": "do được Cha ban ngôi trong vương quốc Nước Trời.",
        "ko": "여호와 아들 왕이 되셨네.",
        "zh": "基督在榮耀寶座上登基。",
        "en": "In glory enthroned sits Jehovah's Son.",
        "ja": "「しるし」がそれを示す"
      },
      {
        "vi": "Ngài đã quăng kẻ thù ra xa khỏi tầng trời",
        "ko": "하늘에서 사탄을 없앴고",
        "zh": "撒但被驅逐，天上已潔淨，",
        "en": "The heavens are cleansed, Satan's now debased,",
        "ja": "天で王敵倒し"
      },
      {
        "vi": "không còn bao lâu nữa mặt đất sẽ thái bình.",
        "ko": "곧 땅에도 주 뜻을 이루리.",
        "zh": "上帝旨意將在地上實行。",
        "en": "And soon on the earth let God's will take place.",
        "ja": "地球に統治及ぶ"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Vui thay! Lều Chúa giữa nơi loài người,",
        "ko": "하느님 천막을 치사,",
        "zh": "上帝的帳幕在人間，",
        "en": "Rejoice! For God's tent is with men,",
        "ja": "エホバの天幕"
      },
      {
        "vi": "Cha vui ngự với muôn dân đời đời.",
        "ko": "사람과 함께 계시네.",
        "zh": "他要親自與人同住。",
        "en": "And he himself resides with them.",
        "ja": "人と共にある"
      },
      {
        "vi": "Sự chết, khóc lóc, Chúa xóa tan đi thật mau.",
        "ko": "고통과 눈물 더는 없으며",
        "zh": "世上不會再有死亡、痛苦，",
        "en": "No more will there be pain or worrying,",
        "ja": "死も苦しみも消え"
      },
      {
        "vi": "Không ai còn than van hay đớn đau, sầu lo.",
        "ko": "슬픔과 죽음마저 없으리.",
        "zh": "人人歡欣快樂，不再哀哭。",
        "en": "No sting of death nor any sorrowing.",
        "ja": "て全て新しくなる"
      },
      {
        "vi": "Ngài phán: “Mọi vật nay ta thay mới tốt tươi\".",
        "ko": "“모든 것을 새롭게",
        "zh": "上帝說：「現在我更新一切！」",
        "en": "For God has said: ‘I'm making all things new.'",
        "ja": "約束思い描き"
      },
      {
        "vi": "Lời ngài thật trung tín không sai.",
        "ko": "하리라” 하신 말씀 참되네.",
        "zh": "他的承諾必實現！",
        "en": "These words faithful are and true.",
        "ja": "歓喜あふれる"
      },
      {
        "vi": "2. Người hỡi, xem Giê-ru-sa-lem Mới ôi yêu kiều!",
        "ko": "2. 보라, 순결한 새 예루살렘을,",
        "zh": "2．聖城新耶路撒冷萬眾仰望，",
        "en": "2. Let all men the pure New Jerusalem see,",
        "ja": "2．新しいエルサレム"
      },
      {
        "vi": "Đây là vợ Chiên Con, tỏa ánh sáng huy hoàng.",
        "ko": "어린양의 빛나는 신부를.",
        "zh": "基督新娘發出萬丈光芒。",
        "en": "The bride of the Lamb shining radiantly.",
        "ja": "が花嫁として下る"
      },
      {
        "vi": "Lộng lẫy trang điểm toàn bằng vàng bạc, ngọc ngà,",
        "ko": "보석으로 단장한 그 신부,",
        "zh": "她披金戴玉來迎接新郎，",
        "en": "Adorned for her husband in gems so bright,",
        "ja": "子羊のため飾り"
      },
      {
        "vi": "nàng được Giê-hô-va rọi ánh sáng chói lòa.",
        "ko": "주 여호와만 그 빛 되시리.",
        "zh": "她的榮光全來自耶和華。",
        "en": "And only Jehovah will be her light.",
        "ja": "神の光をまとう"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Vui thay! Lều Chúa giữa nơi loài người,",
        "ko": "하느님 천막을 치사,",
        "zh": "上帝的帳幕在人間，",
        "en": "Rejoice! For God's tent is with men,",
        "ja": "エホバの天幕"
      },
      {
        "vi": "Cha vui ngự với muôn dân đời đời.",
        "ko": "사람과 함께 계시네.",
        "zh": "他要親自與人同住。",
        "en": "And he himself resides with them.",
        "ja": "人と共にある"
      },
      {
        "vi": "Sự chết, khóc lóc, Chúa xóa tan đi thật mau.",
        "ko": "고통과 눈물 더는 없으며",
        "zh": "世上不會再有死亡、痛苦，",
        "en": "No more will there be pain or worrying,",
        "ja": "死も苦しみも消え"
      },
      {
        "vi": "Không ai còn than van hay đớn đau, sầu lo.",
        "ko": "슬픔과 죽음마저 없으리.",
        "zh": "人人歡欣快樂，不再哀哭。",
        "en": "No sting of death nor any sorrowing.",
        "ja": "て全て新しくなる"
      },
      {
        "vi": "Ngài phán: “Mọi vật nay ta thay mới tốt tươi\".",
        "ko": "“모든 것을 새롭게",
        "zh": "上帝說：「現在我更新一切！」",
        "en": "For God has said: ‘I'm making all things new.'",
        "ja": "約束思い描き"
      },
      {
        "vi": "Lời ngài thật trung tín không sai.",
        "ko": "하리라” 하신 말씀 참되네.",
        "zh": "他的承諾必實現！",
        "en": "These words faithful are and true.",
        "ja": "歓喜あふれる"
      },
      {
        "vi": "3. Thành thánh đem công bằng, an vui đến cho muôn người.",
        "ko": "3. 웅장하면서 기쁨 주는 도시,",
        "zh": "3．偉大的聖城多麼令人喜愛，",
        "en": "3. This city so grand will become a delight.",
        "ja": "3．子羊は都市の明かり"
      },
      {
        "vi": "Nơi cửa thành ngày đêm luôn mở lớn đón mời.",
        "ko": "성문들 항상 열려 있는 곳.",
        "zh": "城門不分晝夜永遠敞開。",
        "en": "Its gates will be open both day and night.",
        "ja": "門に鍵は要らない"
      },
      {
        "vi": "Mọi nước đi trong vinh quang rạng ngời của thành;",
        "ko": "사람들 그 빛 따라 걷도록",
        "zh": "上帝忠僕反映聖城榮光，",
        "en": "The nations will walk in her glory bright;",
        "ja": "人は輝き浴びて"
      },
      {
        "vi": "ai thờ phượng Cha hãy phản chiếu ánh sáng này.",
        "ko": "주의 종들 빛 밝게 비추네.",
        "zh": "萬國將歸向這燦爛光芒。",
        "en": "The servants of God now reflect that light.",
        "ja": "歓喜の声を上げる"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Vui thay! Lều Chúa giữa nơi loài người,",
        "ko": "하느님 천막을 치사,",
        "zh": "上帝的帳幕在人間，",
        "en": "Rejoice! For God's tent is with men,",
        "ja": "エホバの天幕"
      },
      {
        "vi": "Cha vui ngự với muôn dân đời đời.",
        "ko": "사람과 함께 계시네.",
        "zh": "他要親自與人同住。",
        "en": "And he himself resides with them.",
        "ja": "人と共にある"
      },
      {
        "vi": "Sự chết, khóc lóc, Chúa xóa tan đi thật mau.",
        "ko": "고통과 눈물 더는 없으며",
        "zh": "世上不會再有死亡、痛苦，",
        "en": "No more will there be pain or worrying,",
        "ja": "死も苦しみも消え"
      },
      {
        "vi": "Không ai còn than van hay đớn đau, sầu lo.",
        "ko": "슬픔과 죽음마저 없으리.",
        "zh": "人人歡欣快樂，不再哀哭。",
        "en": "No sting of death nor any sorrowing.",
        "ja": "て全て新しくなる"
      },
      {
        "vi": "Ngài phán: “Mọi vật nay ta thay mới tốt tươi\".",
        "ko": "“모든 것을 새롭게",
        "zh": "上帝說：「現在我更新一切！」",
        "en": "For God has said: ‘I'm making all things new.'",
        "ja": "約束思い描き"
      },
      {
        "vi": "Lời ngài thật trung tín không sai.",
        "ko": "하리라” 하신 말씀 참되네.",
        "zh": "他的承諾必實現！",
        "en": "These words faithful are and true.",
        "ja": "歓喜あふれる"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Mat 16:5; Khải 12:7-9; 21:25-25).",
      "ko": "(마태 16:3; 계시록 12:7-9; 21:23-25 참조)",
      "zh": "（參看太16：3；啟12：7-9；21：23-25）",
      "en": "(See also Matt. 16:3; Rev. 12:7-9; 21:23-25.)",
      "ja": "（マタ16：3；啓12：7‐9；21：23‐25も参照。）"
    }
  },
  {
    "number": 147,
    "sourceSheet": "147",
    "labels": {
      "vi": "BÀI HÁT 147",
      "ko": "147번",
      "zh": "詩歌第147首",
      "en": "SONG 147",
      "ja": "147番"
    },
    "title": {
      "vi": "Sự sống vĩnh cửu được hứa trước",
      "ko": "영원한 생명의 약속",
      "zh": "上帝承諾賜人永生",
      "en": "Life Everlasting Is Promised",
      "ja": "約束された永遠の命"
    },
    "scripture": {
      "vi": "(Thi thiên 57:29)",
      "ko": "(시편 37:29)",
      "zh": "（詩篇37：29）",
      "en": "(Psalm 37:29)",
      "ja": "（詩編37：29）"
    },
    "lines": [
      {
        "vi": "1. Sống đời đời Cha đã hứa ban cho,",
        "ko": "1. 하느님 약속하셨네,",
        "zh": "1．仁愛上帝承諾讓人",
        "en": "1. Life everlasting is promised.",
        "ja": "1．エホバの約"
      },
      {
        "vi": "trên địa cầu không sao chuyển lay.",
        "ko": "온유한 자들에게.",
        "zh": "在地上享受永生。",
        "en": "Our earthly home will endure.",
        "ja": "束信頼できる"
      },
      {
        "vi": "Dân hiền từ thêm lên mãi không thôi.",
        "ko": "‘땅에서 영원히",
        "zh": "謙和人必繁榮興旺，",
        "en": "‘Meek ones will thrive,' said the psalmist.",
        "ja": "永遠に生き"
      },
      {
        "vi": "Ta trông mong tương lai ấy.",
        "ko": "살며 축복 누리리라.'",
        "zh": "光明前途在望。",
        "en": "This grand future is sure.",
        "ja": "るこの地球で"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Lời Cha thật sẽ ứng nghiệm.",
        "ko": "영원한 삶 위해",
        "zh": "未來美好生活",
        "en": "We can live forever.",
        "ja": "命目指し"
      },
      {
        "vi": "Mình sẽ được như ước nguyện,",
        "ko": "온 힘을 다하리.",
        "zh": "值得努力追求，",
        "en": "It's worth all endeavor.",
        "ja": "力尽くす"
      },
      {
        "vi": "sẽ sống muôn đời hạnh phúc.",
        "ko": "여호와의 약속",
        "zh": "上帝信守諾言，",
        "en": "God's promise is faithful.",
        "ja": "希望かな"
      },
      {
        "vi": "Thật đáng mọi công sức!",
        "ko": "꼭 성취되리.",
        "zh": "永生必實現。",
        "en": "His Word will come true.",
        "ja": "う時見つめ"
      },
      {
        "vi": "2. Chúa làm lại nên mới khắp muôn nơi.",
        "ko": "2. 우리는 완전해지고",
        "zh": "2．上帝兒女置身樂園，",
        "en": "2. Paradise brought to perfection;",
        "ja": "2．イエスが話した"
      },
      {
        "vi": "Nhân loại rồi đây thoát ách nô.",
        "ko": "낙원을 즐기리라.",
        "zh": "享自由，恢復完美。",
        "en": "All of God's children set free.",
        "ja": "パラダイスでは"
      },
      {
        "vi": "Con người trên trái đất sống yên vui",
        "ko": "여호와 인도",
        "zh": "上帝王國仁愛治下，",
        "en": "Under Jehovah's direction,",
        "ja": "自由な人た"
      },
      {
        "vi": "khi Giê-hô-va dẫn dắt.",
        "ko": "따르며 평화 누리리라.",
        "zh": "四海親如一家。",
        "en": "Peace on earth we will see.",
        "ja": "ち平和を見る"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Lời Cha thật sẽ ứng nghiệm.",
        "ko": "영원한 삶 위해",
        "zh": "未來美好生活",
        "en": "We can live forever.",
        "ja": "命目指し"
      },
      {
        "vi": "Mình sẽ được như ước nguyện,",
        "ko": "온 힘을 다하리.",
        "zh": "值得努力追求，",
        "en": "It's worth all endeavor.",
        "ja": "力尽くす"
      },
      {
        "vi": "sẽ sống muôn đời hạnh phúc.",
        "ko": "여호와의 약속",
        "zh": "上帝信守諾言，",
        "en": "God's promise is faithful.",
        "ja": "希望かな"
      },
      {
        "vi": "Thật đáng mọi công sức!",
        "ko": "꼭 성취되리.",
        "zh": "永生必實現。",
        "en": "His Word will come true.",
        "ja": "う時見つめ"
      },
      {
        "vi": "3. Sống lại là điều Cha sắp ban cho,",
        "ko": "3. 부활이 곧 있으리니",
        "zh": "3．長眠的人即將復活，",
        "en": "3. Soon in the grand resurrection,",
        "ja": "3．再び目覚め"
      },
      {
        "vi": "khổ sầu, than van sẽ biến tan.",
        "ko": "슬픔은 잊혀지리.",
        "zh": "人不再悲傷、哀慟。",
        "en": "Sorrow will all disappear.",
        "ja": "る愛する家族"
      },
      {
        "vi": "Với lòng quan tâm, trìu mến yêu thương,",
        "ko": "하느님 따뜻한",
        "zh": "天父給予親切安慰，",
        "en": "Showering tender affection,",
        "ja": "神の深い愛"
      },
      {
        "vi": "Cha lau khô hết nước mắt.",
        "ko": "손길 눈물 닦아 주리.",
        "zh": "擦去每滴眼淚。",
        "en": "God will dry ev'ry tear.",
        "ja": "悲しみ消す"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Lời Cha thật sẽ ứng nghiệm.",
        "ko": "영원한 삶 위해",
        "zh": "未來美好生活",
        "en": "We can live forever.",
        "ja": "命目指し"
      },
      {
        "vi": "Mình sẽ được như ước nguyện,",
        "ko": "온 힘을 다하리.",
        "zh": "值得努力追求，",
        "en": "It's worth all endeavor.",
        "ja": "力尽くす"
      },
      {
        "vi": "sẽ sống muôn đời hạnh phúc.",
        "ko": "여호와의 약속",
        "zh": "上帝信守諾言，",
        "en": "God's promise is faithful.",
        "ja": "希望かな"
      },
      {
        "vi": "Thật đáng mọi công sức!",
        "ko": "꼭 성취되리.",
        "zh": "永生必實現。",
        "en": "His Word will come true.",
        "ja": "う時見つめ"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Ê-sai 25:8; Lu 25:45; Giăng 11:25; Khải 21:4).",
      "ko": "(이사야 25:8; 누가 23:43; 요한 11:25; 계시록 21:4 참조)",
      "zh": "（參看賽25：8；路23：43；約11：25；啟21：4）",
      "en": "(See also Isa. 25:8; Luke 23:43; John 11:25; Rev. 21:4.)",
      "ja": "（イザ25：8；ルカ23：43；ヨハ11：25；啓21：4も参照。）"
    }
  },
  {
    "number": 148,
    "sourceSheet": "148",
    "labels": {
      "vi": "BÀI HÁT 148",
      "ko": "148번",
      "zh": "詩歌第148首",
      "en": "SONG 148",
      "ja": "148番"
    },
    "title": {
      "vi": "Đức Giê-hô-va cung cấp sự giải cứu",
      "ko": "여호와, 피할 길을 주시는 분",
      "zh": "耶和華拯救他的子民",
      "en": "Jehovah Provides Escape",
      "ja": "エホバは救い出してくださる"
    },
    "scripture": {
      "vi": "(2 Sa-mu-ên 22:1-8)",
      "ko": "(사무엘하 22:1-8)",
      "zh": "（撒母耳記下22:1-8）",
      "en": "(2 Samuel 22:1-8)",
      "ja": "（サムエル第二 22:1-8）"
    },
    "lines": [
      {
        "vi": "1. Hỡi Giê-hô-va Tối Cao, uy quyền Cha thật vô biên.",
        "ko": "1. 여호와, 살아 계신",
        "zh": "1．至高上帝",
        "en": "1. The living God, Jehovah, you have proved to be;",
        "ja": "1. 力と知恵の"
      },
      {
        "vi": "Trên khắp núi cao, sông dài,",
        "ko": "우리 하느님.",
        "zh": "耶和華是永活真神，",
        "en": "Your mighty works abound",
        "ja": "神エホバ"
      },
      {
        "vi": "việc tay Cha muôn dân thấy.",
        "ko": "만물에 나타난",
        "zh": "天地盡都彰顯",
        "en": "in earth and sky and sea.",
        "ja": "その威光は"
      },
      {
        "vi": "Thần gian tà bao kẻ tôn vinh không thể so sánh",
        "ko": "주 크신 능력에",
        "zh": "他的智慧大能，",
        "en": "No rival god can equal what you have done",
        "ja": "満ちあふれる"
      },
      {
        "vi": "và mai mốt",
        "ko": "그 어떤 신도 맞설 수 없으니,",
        "zh": "世上再沒有別神與他相比，",
        "en": "—there is none.",
        "ja": "怒り狂った敵たち"
      },
      {
        "vi": "Chúa sẽ ra tay diệt hết.",
        "ko": "적들은 소멸되리이다.",
        "zh": "他即將吞滅所有仇敵。",
        "en": "Our foes will be consumed.",
        "ja": "全て滅ぼされる"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Giê-hô-va cung cấp cứu rỗi ai trung tín thật.",
        "ko": "여호와 피할 길을 내주시니",
        "zh": "耶和華必定搭救忠貞子民，",
        "en": "Jehovah provides escape for the loyal.",
        "ja": "エホバ 私の大岩"
      },
      {
        "vi": "Nếu trung kiên, mai này ta thấy uy quyền nơi Vầng Đá.",
        "ko": "그 종은 알리,",
        "zh": "他堅如磐石，",
        "en": "His servants will see what a mighty Crag is he.",
        "ja": "揺るぎない愛"
      },
      {
        "vi": "Ta can đảm và quyết vững tin nơi ngài,",
        "ko": "강한 반석이심을.",
        "zh": "彷彿屹立的山嶺。",
        "en": "So with courage and faith in our God,",
        "ja": "示す方"
      },
      {
        "vi": "hết lòng hát khen danh Cha,",
        "ko": "피할 길을 마련하시니 굳게 믿고",
        "zh": "他的忠僕，要鼓起勇氣，滿懷信心，",
        "en": "we spread the fame",
        "ja": "賛美を捧げよう"
      },
      {
        "vi": "đấng giải cứu ta, Giê-hô-va",
        "ko": "담대하게 주 이름",
        "zh": "全力宣揚、讚美",
        "en": "Of Jehovah, our Source of escape,",
        "ja": "エホバに 今こそ"
      },
      {
        "vi": "thật vĩ đại thay.",
        "ko": "널리 찬양하리.",
        "zh": "耶和華偉大聖名。",
        "en": "and praise his name.",
        "ja": "たたえよう その名を"
      },
      {
        "vi": "2. Lúc hoạn nạn, dây chết vây quanh thì con cầu xin Cha:",
        "ko": "2. 죽음의 밧줄",
        "zh": "2．當死亡如繩索",
        "en": "2. Though ropes of death encircle me, I call to you,",
        "ja": "2. 死の波が"
      },
      {
        "vi": "“Xin hãy giúp con thêm mạnh,",
        "ko": "나를 옭아매어도",
        "zh": "緊緊纏繞著我，",
        "en": "“Jehovah, give me strength,",
        "ja": "押し寄せるとき"
      },
      {
        "vi": "và cho con thêm can đảm”.",
        "ko": "‘여호와여, 내게 힘,",
        "zh": "求上帝賜力量，",
        "en": "and give me courage too.”",
        "ja": "ただひたすら"
      },
      {
        "vi": "Từ nơi đền, Cha lắng nghe con kêu cầu tha thiết:",
        "ko": "용기 주소서.",
        "zh": "使我勇敢剛強，",
        "en": "From your own temple dwelling, you hear my plea,",
        "ja": "あなたを呼ぶ"
      },
      {
        "vi": "“Lạy Cha thánh,",
        "ko": "나의 간청을, 주여, 들으시고",
        "zh": "耶和華我的上帝，請保護我、",
        "en": "“Shelter me;",
        "ja": "人に勇気と強さを与え"
      },
      {
        "vi": "cúi xin Cha ban giải cứu”.",
        "ko": "오, 나를 구출해 주소서.'",
        "zh": "拯救我，請垂聽我呼求。",
        "en": "Rescue me, O my God.”",
        "ja": "救う神に"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Giê-hô-va cung cấp cứu rỗi ai trung tín thật.",
        "ko": "여호와 피할 길을 내주시니",
        "zh": "耶和華必定搭救忠貞子民，",
        "en": "Jehovah provides escape for the loyal.",
        "ja": "エホバ 私の大岩"
      },
      {
        "vi": "Nếu trung kiên, mai này ta thấy uy quyền nơi Vầng Đá.",
        "ko": "그 종은 알리,",
        "zh": "他堅如磐石，",
        "en": "His servants will see what a mighty Crag is he.",
        "ja": "揺るぎない愛"
      },
      {
        "vi": "Ta can đảm và quyết vững tin nơi ngài,",
        "ko": "강한 반석이심을.",
        "zh": "彷彿屹立的山嶺。",
        "en": "So with courage and faith in our God,",
        "ja": "示す方"
      },
      {
        "vi": "hết lòng hát khen danh Cha,",
        "ko": "피할 길을 마련하시니 굳게 믿고",
        "zh": "他的忠僕，要鼓起勇氣，滿懷信心，",
        "en": "we spread the fame",
        "ja": "賛美を捧げよう"
      },
      {
        "vi": "đấng giải cứu ta, Giê-hô-va",
        "ko": "담대하게 주 이름",
        "zh": "全力宣揚、讚美",
        "en": "Of Jehovah, our Source of escape,",
        "ja": "エホバに 今こそ"
      },
      {
        "vi": "thật vĩ đại thay.",
        "ko": "널리 찬양하리.",
        "zh": "耶和華偉大聖名。",
        "en": "and praise his name.",
        "ja": "たたえよう その名を"
      },
      {
        "vi": "3. Với giọng tựa như sấm của Giê-hô-va",
        "ko": "3. 우렁찬 음성",
        "zh": "3．耶和華發出",
        "en": "3. From heaven you will thunder",
        "ja": "3. 敵はおびえて"
      },
      {
        "vi": "từ trên cao,",
        "ko": "하늘에서 내시면",
        "zh": "雷霆萬鈞的怒氣，",
        "en": "and give forth your voice.",
        "ja": "震えだす"
      },
      {
        "vi": "gây khiếp hãi cho quân thù,",
        "ko": "적들은 떨지만",
        "zh": "仇敵膽戰心驚，",
        "en": "Your enemies will quake;",
        "ja": "あなたの声"
      },
      {
        "vi": "người thờ phượng Cha vui sướng.",
        "ko": "우린 기뻐하니,",
        "zh": "他忠僕卻歡欣。",
        "en": "your servants will rejoice.",
        "ja": "とどろく時"
      },
      {
        "vi": "Thật Cha quyền năng, trở nên bao vai trò Cha muốn,",
        "ko": "당신은 되실 분이",
        "zh": "他將在人前",
        "en": "You prove to be whatever you need to be;",
        "ja": "人々は見る"
      },
      {
        "vi": "rồi muôn nước",
        "ko": "돼 주시어,",
        "zh": "施展拯救大能，",
        "en": "all will see",
        "ja": "力に満ちた"
      },
      {
        "vi": "sẽ xem tay Cha giải cứu.",
        "ko": "피할 길 보여 주시리다.",
        "zh": "證明他就是獨一真神。",
        "en": "How you provide escape.",
        "ja": "あなたの手を"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Giê-hô-va cung cấp cứu rỗi ai trung tín thật.",
        "ko": "여호와 피할 길을 내주시니",
        "zh": "耶和華必定搭救忠貞子民，",
        "en": "Jehovah provides escape for the loyal.",
        "ja": "エホバ 私の大岩"
      },
      {
        "vi": "Nếu trung kiên, mai này ta thấy uy quyền nơi Vầng Đá.",
        "ko": "그 종은 알리,",
        "zh": "他堅如磐石，",
        "en": "His servants will see what a mighty Crag is he.",
        "ja": "揺るぎない愛"
      },
      {
        "vi": "Ta can đảm và quyết vững tin nơi ngài,",
        "ko": "강한 반석이심을.",
        "zh": "彷彿屹立的山嶺。",
        "en": "So with courage and faith in our God,",
        "ja": "示す方"
      },
      {
        "vi": "hết lòng hát khen danh Cha,",
        "ko": "피할 길을 마련하시니 굳게 믿고",
        "zh": "他的忠僕，要鼓起勇氣，滿懷信心，",
        "en": "we spread the fame",
        "ja": "賛美を捧げよう"
      },
      {
        "vi": "đấng giải cứu ta, Giê-hô-va",
        "ko": "담대하게 주 이름",
        "zh": "全力宣揚、讚美",
        "en": "Of Jehovah, our Source of escape,",
        "ja": "エホバに 今こそ"
      },
      {
        "vi": "thật vĩ đại thay.",
        "ko": "널리 찬양하��.",
        "zh": "耶和華偉大聖名。",
        "en": "and praise his name.",
        "ja": "たたえよう その名を"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 18:1, 2; 144:1, 2).",
      "ko": "(시 18:1, 2; 144:1, 2 참조)",
      "zh": "（參看詩18:1,2；144:1,2）",
      "en": "(See also Ps. 18:1, 2; 144:1, 2.)",
      "ja": "（詩 18:1，2; 144:1，2も参照。）"
    }
  },
  {
    "number": 149,
    "sourceSheet": "149",
    "labels": {
      "vi": "BÀI HÁT 149",
      "ko": "149번",
      "zh": "詩歌第149首",
      "en": "SONG 149",
      "ja": "149番"
    },
    "title": {
      "vi": "Bài ca chiến thắng",
      "ko": "승리의노래",
      "zh": "勝利之歌",
      "en": "AVictory Song",
      "ja": "勝利の歌"
    },
    "scripture": {
      "vi": "(Xuất Ai Cập 15:1)",
      "ko": "(출애굽기 15:1)",
      "zh": "（出埃及記15：1）",
      "en": "(Exodus 15:1)",
      "ja": "（出エジプト15：1）"
    },
    "lines": [
      {
        "vi": "1. Ca tụng Giê-hô-va vì danh Cha nay tỏ ra là cao trọng.",
        "ko": "1. 찬송하여라,",
        "zh": "1．歌頌耶和華，",
        "en": "1. Sing to Jehovah. His great name is highly exalted.",
        "ja": "1．さあ歌おう声"
      },
      {
        "vi": "Ngài đã ném bao quân binh",
        "ko": "영화로운 주 여호와를.",
        "zh": "他聖名已經大受顯揚。",
        "en": "His proud Egyptian foes, He has cast into the sea.",
        "ja": "を上げエホバに"
      },
      {
        "vi": "Ai Cập xuống sóng xô kinh hoàng. Ta cùng hát khen ngài,",
        "ko": "저 이집트의 군대 바다에 던졌네.",
        "zh": "他將埃及大軍全投進大海中央。",
        "en": "Praise Jah Almighty;",
        "ja": "敵を海に沈めた方に"
      },
      {
        "vi": "quyền năng Cha luôn tối cao và muôn đời.",
        "ko": "전능하시니, 그",
        "zh": "讚美耶和華，",
        "en": "Besides him there can be no other.",
        "ja": "たたえよう全"
      },
      {
        "vi": "Ngài đã chiến thắng vinh quang,",
        "ko": "누구도 맞설 수 없네.",
        "zh": "他偉大全能，力量最強。",
        "en": "Jehovah is his name;",
        "ja": "能のエホバを"
      },
      {
        "vi": "xua màn đêm âm u, tăm tối.",
        "ko": "그 이름 여호와,",
        "zh": "獨一的耶和華，勝利唯獨屬於他。",
        "en": "He has gained the victory.",
        "ja": "勝利を得た"
      },
      {
        "vi": "Thật Giê-hô-va quyền lớn nhất vũ trụ.",
        "ko": "큰 승리 거두셨네.",
        "zh": "至高耶和華主宰天地，",
        "en": "Jehovah God, Most High over all,",
        "ja": "偉大な神を"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Là Đấng Tối Thượng, ngài đời đời không thay đồi.",
        "ko": "지극히 크신 주 여호와,",
        "zh": "你萬世長存，永遠不改變。",
        "en": "The one who is forevermore the same,",
        "ja": "真の神エホバはい"
      },
      {
        "vi": "Ngày Chúa hủy diệt mọi kẻ chống đối đến gần",
        "ko": "늘 승리하는 우리 하느님,",
        "zh": "你即將滅盡邪惡的仇敵，",
        "en": "You soon will cause your enemies to fall",
        "ja": "つの日も変わらない"
      },
      {
        "vi": "và thánh danh Cha muôn năm hiền vinh.",
        "ko": "곧 모든 적을 멸망시키고",
        "zh": "彰顯你的偉大聖名。",
        "en": "And sanctify your holy name.",
        "ja": "敵は皆滅び去"
      },
      {
        "vi": "2. Vua của thế gian này",
        "ko": "이름 거룩게 하소서.",
        "zh": "2．高傲的列王對抗",
        "en": "2. See now all nations Opposing the Sov'reign, Jehovah.",
        "ja": "るその時は近い"
      },
      {
        "vi": "cùng nhau liên minh chống Cha Giê-hô-va.",
        "ko": "2. 모든 나라가 주 여호와 대적하지만",
        "zh": "耶和華正義統治，",
        "en": "Though mightier than Pharaoh,",
        "ja": "2．今神に敵する国々が"
      },
      {
        "vi": "Quyền lớn mấy nhưng nay mai",
        "ko": "아무리 강한 적도 큰 수치 겪으리.",
        "zh": "儘管勢力強大，",
        "en": "They too will suffer shame.",
        "ja": "その強さを"
      },
      {
        "vi": "mang nhục nhã giống Pha-ra-ôn. Trong ngày lớn Cha định,",
        "ko": "아마겟돈 때 그들",
        "zh": "卻必定永遠消逝。",
        "en": "Judgment awaits them;",
        "ja": "誇るとしても"
      },
      {
        "vi": "họ tan như mây khói, không một hy vọng.",
        "ko": "모두 멸하시리라.",
        "zh": "哈米吉多頓，",
        "en": "They cannot escape Armageddon.",
        "ja": "迫りくるハルマゲド"
      },
      {
        "vi": "Mọi nước sẽ biết danh Cha,",
        "ko": "그 이름 여호와,",
        "zh": "審判惡人的日子已近，",
        "en": "Soon ev'ryone will know",
        "ja": "ンの日に彼らは知る"
      },
      {
        "vi": "công nhận Cha là Vua cao quý.",
        "ko": "반드시 알게 되리.",
        "zh": "人人終將知道耶和華才是上帝。",
        "en": "That Jehovah is God's name.",
        "ja": "エホバが神と"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Là Đấng Tối Thượng, ngài đời đời không thay đồi.",
        "ko": "지극히 크신 주 여호와,",
        "zh": "你萬世長存，永遠不改變。",
        "en": "The one who is forevermore the same,",
        "ja": "真の神エホバはい"
      },
      {
        "vi": "Ngày Chúa hủy diệt mọi kẻ chống đối đến gần",
        "ko": "늘 승리하는 우리 하느님,",
        "zh": "你即將滅盡邪惡的仇敵，",
        "en": "You soon will cause your enemies to fall",
        "ja": "つの日も変わらない"
      },
      {
        "vi": "và thánh danh Cha muôn năm hiền vinh.",
        "ko": "곧 모든 적을 멸망시키고",
        "zh": "彰顯你的偉大聖名。",
        "en": "And sanctify your holy name.",
        "ja": "敵は皆滅び去"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 2:2, 9; 92:8; Mai 5:6; Khải 16:16).",
      "ko": "(시 2:2, 9; 92:8; 말라기 3:6; 계시록 16:16 참조)",
      "zh": "（參看詩2：2，9；92：8；瑪3：6；啟16：16）",
      "en": "(See also Ps. 2:2, 9; 92:8; Mal. 3:6; Rev. 16:16.)",
      "ja": "（詩2：2，9；92：8；マラ3：6；啓16：16も参照。）"
    }
  },
  {
    "number": 150,
    "sourceSheet": "150",
    "labels": {
      "vi": "BÀI HÁT 150",
      "ko": "150번",
      "zh": "詩歌第150首",
      "en": "SONG 150",
      "ja": "150番"
    },
    "title": {
      "vi": "Hãy tìm kiếm Đức Chúa Trời để được cứu rỗi",
      "ko": "구출자이신 하느님을 찾으라",
      "zh": "尋求上帝必定獲救",
      "en": "Seek God for Your Deliverance",
      "ja": "救いのために神に頼る"
    },
    "scripture": {
      "vi": "(Xô-phô-ni 2:3)",
      "ko": "(스바냐 2:3)",
      "zh": "（西番雅書2:3）",
      "en": "(Zephaniah 2:3)",
      "ja": "（ゼパニヤ 2:3）"
    },
    "lines": [
      {
        "vi": "1. Mọi vua hiệp nhau mưu đồ",
        "ko": "1. 나라들 뭉쳐서",
        "zh": "1．列國聯手對抗",
        "en": "1. Nations align as one,",
        "ja": "1. 神の主権"
      },
      {
        "vi": "nghịch lại Con của Giê-hô-va.",
        "ko": "주 아들과 맞서네.",
        "zh": "上帝王國的君王，",
        "en": "Opposing Jehovah's Son.",
        "ja": "退けてきた"
      },
      {
        "vi": "Bao kẻ cai trị vẫn không tin rằng",
        "ko": "주의 포고령 울리니",
        "zh": "上帝卻已定下時限，",
        "en": "Their time of human rulership",
        "ja": "人々の支配"
      },
      {
        "vi": "thế gian đang trên đà diệt vong.",
        "ko": "인간 통치 끝나네.",
        "zh": "列國統治將終結。",
        "en": "By God's decree now is done.",
        "ja": "終わりを告げた"
      },
      {
        "vi": "Giờ Con ngài đang cai trị,",
        "ko": "왕들의 날 찼네.",
        "zh": "基督即將除去",
        "en": "Rulers have had their day;",
        "ja": "この世界の敵たち"
      },
      {
        "vi": "ngày Cha toan định nay sắp đến,",
        "ko": "왕국 굳게 서리라.",
        "zh": "上帝王國的仇敵，",
        "en": "God's Kingdom is here to stay.",
        "ja": "全て"
      },
      {
        "vi": "đánh tan quân thù đầy bạo tàn trên đất.",
        "ko": "그리스도 적들 멸하실",
        "zh": "判決執行絕不會延期，",
        "en": "Soon Christ will crush earthly enemies.",
        "ja": "イエスが打ち砕く"
      },
      {
        "vi": "Nước Chúa đời đời luôn vững chắc.",
        "ko": "그날 늦지 않으리.",
        "zh": "王國必獲得勝利。",
        "en": "No more will there be delay.",
        "ja": "その日は近い"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Hãy kiếm Cha mau để được Cha cứu.",
        "ko": "구출자인 주 하느님",
        "zh": "尋求上帝必定獲救，",
        "en": "Seek God for your deliverance,",
        "ja": "救いを求めて"
      },
      {
        "vi": "Tin chắc nơi Cha quyền lớn lao thay!",
        "ko": "굳게 믿고 의지하라.",
        "zh": "信靠上帝不必擔憂。",
        "en": "Yes, look to him with confidence.",
        "ja": "エホバに頼ろう"
      },
      {
        "vi": "Tìm công chính nơi ngài,",
        "ko": "의를 구하고",
        "zh": "要追求正義，",
        "en": "Seek his righteousness,",
        "ja": "いつの日も"
      },
      {
        "vi": "chọn theo Chúa muôn đời,",
        "ko": "충실히 섬겨",
        "zh": "要保持忠心，",
        "en": "Show your faithfulness,",
        "ja": "信仰と忠誠を"
      },
      {
        "vi": "lòng kiên quyết trung thành, ngợi khen Chúa.",
        "ko": "하느님 주권 받들라.",
        "zh": "要擁護至高的上帝。",
        "en": "For his sov'reignty, take your stand.",
        "ja": "保ち"
      },
      {
        "vi": "Vui sướng trông mong ngày ngài mau đến,",
        "ko": "강한 손으로 이루실",
        "zh": "上帝伸出大能之手，",
        "en": "Then see our God deliver you",
        "ja": "エホバに救いを"
      },
      {
        "vi": "thấy tay Cha uy quyền.",
        "ko": "구출 보리라.",
        "zh": "必施行拯救。",
        "en": "By his mighty hand.",
        "ja": "求めよう"
      },
      {
        "vi": "2. Ngài cho mọi dân cơ hội",
        "ko": "2. 모든 사람에게",
        "zh": "2．世人都要聽見",
        "en": "2. People on earth now choose,",
        "ja": "2. 真理の側"
      },
      {
        "vi": "chọn nhận thông điệp Cha hay chối.",
        "ko": "좋은 소식 알려서",
        "zh": "上帝王國好消息，",
        "en": "Responding to this good news.",
        "ja": "選べるように"
      },
      {
        "vi": "Ta vẫn rao truyền Nước Cha cai trị",
        "ko": "순응할지 거부할지",
        "zh": "是接受或一口拒絕，",
        "en": "We offer to all men the choice",
        "ja": "知らせを伝える"
      },
      {
        "vi": "dẫu ai khinh chê, cười nhạo ta.",
        "ko": "택할 기회 주리라.",
        "zh": "現在就必須決定。",
        "en": "To hear or proudly refuse.",
        "ja": "あらゆる人に"
      },
      {
        "vi": "Dù bao điều gây gian khổ,",
        "ko": "극심한 시련도",
        "zh": "我們面對考驗，",
        "en": "Trials, although severe,",
        "ja": "試練来ても"
      },
      {
        "vi": "lòng ta không sợ run, lui bước.",
        "ko": "전혀 두렵지 않네.",
        "zh": "卻不必恐懼膽怯。",
        "en": "Need not fill our hearts with fear.",
        "ja": "恐れはしない"
      },
      {
        "vi": "Chúng ta tin cậy Giê-hô-va chăm sóc,",
        "ko": "주 여호와 들어 주시니,",
        "zh": "上帝顧念忠貞的子民，",
        "en": "Jehovah cares for his loyal ones;",
        "ja": "愛の神エホバの"
      },
      {
        "vi": "bao tiếng nguyện cầu vang lên Chúa.",
        "ko": "도움 간청하리라.",
        "zh": "垂聽呼求的聲音。",
        "en": "Our cries for help he will hear.",
        "ja": "助けを信じ"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Hãy kiếm Cha mau để được Cha cứu.",
        "ko": "구출자인 주 하느님",
        "zh": "尋求上帝必定獲救，",
        "en": "Seek God for your deliverance,",
        "ja": "救いを求めて"
      },
      {
        "vi": "Tin chắc nơi Cha quyền lớn lao thay!",
        "ko": "굳게 믿고 의지하라.",
        "zh": "信靠上帝不必擔憂。",
        "en": "Yes, look to him with confidence.",
        "ja": "エホバに頼ろう"
      },
      {
        "vi": "Tìm công chính nơi ngài,",
        "ko": "의를 구하고",
        "zh": "要追求正義，",
        "en": "Seek his righteousness,",
        "ja": "いつの日も"
      },
      {
        "vi": "chọn theo Chúa muôn đời,",
        "ko": "충실히 섬겨",
        "zh": "要保持忠心，",
        "en": "Show your faithfulness,",
        "ja": "信仰と忠誠を"
      },
      {
        "vi": "lòng kiên quyết trung thành, ngợi khen Chúa.",
        "ko": "하느님 주권 받들라.",
        "zh": "要擁護至高的上帝。",
        "en": "For his sov'reignty, take your stand.",
        "ja": "保ち"
      },
      {
        "vi": "Vui sướng trông mong ngày ngài mau đến,",
        "ko": "강한 손으로 이루실",
        "zh": "上帝伸出大能之手，",
        "en": "Then see our God deliver you",
        "ja": "エホバに救いを"
      },
      {
        "vi": "thấy tay Cha uy quyền.",
        "ko": "구출 보리라.",
        "zh": "必施行拯救。",
        "en": "By his mighty hand.",
        "ja": "求めよう"
      }
    ],
    "reference": {
      "vi": "(Cũng xem 1 Sa 2:9; Thi 2:2, 3, 9; Châm 2:8; Mat 6:33).",
      "ko": "(사무엘상 2:9; 시 2:2, 3, 9; 잠언 2:8; 마태 6:33 참조)",
      "zh": "（參看撒上2:9；詩2:2,3,9；箴2:8；太6:33）",
      "en": "(See also 1 Sam. 2:9; Ps. 2:2, 3, 9; Prov. 2:8; Matt. 6:33.)",
      "ja": "（サム一 2:9; 詩 2:2，3，9; 格 2:8; マタ 6:33も参照。）"
    }
  },
  {
    "number": 151,
    "sourceSheet": "151",
    "labels": {
      "vi": "BÀI HÁT 151",
      "ko": "151번",
      "zh": "詩歌第151首",
      "en": "SONG 151",
      "ja": "151番"
    },
    "title": {
      "vi": "Chúa sẽ gọi",
      "ko": "그분은 부르실 것이다",
      "zh": "上帝必呼喚",
      "en": "He Will Call",
      "ja": "神は呼んでくださる"
    },
    "scripture": {
      "vi": "(Gióp 14:13-15)",
      "ko": "(욥기 14:13-15)",
      "zh": "（約伯記14:13-15）",
      "en": "(Job 14:13-15)",
      "ja": "（ヨブ14：13‐15）"
    },
    "lines": [
      {
        "vi": "1. Như màn sương sớm hiện rồi tan trong phút chốc,",
        "ko": "1. 인생이란 잠시 보이다가",
        "zh": "1．一生匆匆，轉眼流逝無蹤，",
        "en": "1. Life, like a mist, appears for just a day,",
        "ja": "1．命は霧のように"
      },
      {
        "vi": "cuộc sống qua nhanh đến không ngờ.",
        "ko": "곧 사라지는 안개.",
        "zh": "如霧氣消散空中。",
        "en": "Then disappears tomorrow.",
        "ja": "はかなく消える"
      },
      {
        "vi": "Năng lực, tri thức tiêu tan, chẳng còn đâu nữa,",
        "ko": "우리의 자취 속히 지워져",
        "zh": "生命脆弱，無奈走到盡頭，",
        "en": "All that we are can quickly fade away,",
        "ja": "残るのは悲し"
      },
      {
        "vi": "khiến thân nhân đau khổ, buồn khóc.",
        "ko": "눈물만 가득하네.",
        "zh": "徒留淚水與傷痛。",
        "en": "Replaced with tears and sorrow.",
        "ja": "みとあふれる涙"
      },
      {
        "vi": "Nếu một người đã khuất, sống lại được hay chăng?",
        "ko": "죽은 자 다시 살 수 있을까?",
        "zh": "是否有一天能夠再重逢？",
        "en": "If a man should die, can he live again?",
        "ja": "もう一度あの人"
      },
      {
        "vi": "Chúa yêu thương cho ta hy vọng:",
        "ko": "주 약속 들어 보라.",
        "zh": "耶和華親口承諾：",
        "en": "Hear the promise God has made:",
        "ja": "に会えるだろうか"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Ngài lên tiếng kêu bao người dưới mồ,",
        "ko": "그분이 부르시리니",
        "zh": "他們會聽上帝呼喚，",
        "en": "He will call; The dead will answer.",
        "ja": "神の呼び掛け"
      },
      {
        "vi": "họ nghe thấy, bước ra mừng vui.",
        "ko": "죽은 자 살아나리.",
        "zh": "長眠中一一醒來。",
        "en": "They will live at his command.",
        "ja": "に死者は答える"
      },
      {
        "vi": "Bởi Cha luôn mong nhớ tôi trung,",
        "ko": "손수 지으신 것을",
        "zh": "上帝也深深期盼",
        "en": "For he will have a longing",
        "ja": "神忘れない"
      },
      {
        "vi": "lời Cha hứa sẽ nhanh thi hành.",
        "ko": "그리워하시리라.",
        "zh": "復活他所造所愛。",
        "en": "For the work of his own hand.",
        "ja": "愛する人を"
      },
      {
        "vi": "Mình tin chắc Cha ban sự sống lại,",
        "ko": "믿으라, 놀라워 말고.",
        "zh": "要相信全能的上帝，",
        "en": "So have faith, and do not wonder,",
        "ja": "信じ続けよ"
      },
      {
        "vi": "quyền năng Chúa lớn lao dường bao.",
        "ko": "주는 하실 수 있네.",
        "zh": "他能夠賜人生命，",
        "en": "For our God can make us stand.",
        "ja": "う神の奇跡を"
      },
      {
        "vi": "Chúng ta mai đây sống muôn năm,",
        "ko": "손수 지으신 우리",
        "zh": "未來必再次相見，",
        "en": "And we will live forever,",
        "ja": "また生きら"
      },
      {
        "vi": "thật vui sướng, đúng như Cha định.",
        "ko": "영원히 살게 되리.",
        "zh": "共歡聚直到永遠。",
        "en": "As the work of his own hand.",
        "ja": "れる共に必ず"
      },
      {
        "vi": "2. Bao người trung tín được ngài ghi trong trí nhớ",
        "ko": "2. 하느님 벗, 생명 잃더라도",
        "zh": "2．縱然不捨他們已經離去，",
        "en": "2. Friends of our God, though they may pass away,",
        "ja": "2．エホバは友を"
      },
      {
        "vi": "dù bấy lâu nay đã qua đời,",
        "ko": "버림받지 않으리.",
        "zh": "也只是短暫別離。",
        "en": "Will never be forsaken.",
        "ja": "守る記憶の中で"
      },
      {
        "vi": "không bị quên lãng, nhưng mai này được đánh thức,",
        "ko": "하느님 기억 속에 잠든 자",
        "zh": "他們活在上帝的記憶裡，",
        "en": "All those asleep who in God's mem'ry stay,",
        "ja": "再び目覚めさせ"
      },
      {
        "vi": "thấy thân nhân vui sướng chào đón.",
        "ko": "모두 깨워 주시리.",
        "zh": "必恢復生命氣息。",
        "en": "From death he will awaken.",
        "ja": "る死の眠りから"
      },
      {
        "vi": "Ứng nghiệm lời ngài hứa, sống đời đời là đây.",
        "ko": "그때 영원히 낙원에 살며",
        "zh": "盼望有一天在美麗樂園，",
        "en": "Then we'll come to see all that life can be:",
        "ja": "楽園に住まわせ"
      },
      {
        "vi": "Khắp muôn nơi an vui, thái bình.",
        "ko": "진정한 삶 누리리.",
        "zh": "他們將長伴身邊。",
        "en": "Paradise eternally.",
        "ja": "るいつの日までも"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(후렴)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Ngài lên tiếng kêu bao người dưới mồ,",
        "ko": "그분이 부르시리니",
        "zh": "他們會聽上帝呼喚，",
        "en": "He will call; The dead will answer.",
        "ja": "神の呼び掛け"
      },
      {
        "vi": "họ nghe thấy, bước ra mừng vui.",
        "ko": "죽은 자 살아나리.",
        "zh": "長眠中一一醒來。",
        "en": "They will live at his command.",
        "ja": "に死者は答える"
      },
      {
        "vi": "Bởi Cha luôn mong nhớ tôi trung,",
        "ko": "손수 지으신 것을",
        "zh": "上帝也深深期盼",
        "en": "For he will have a longing",
        "ja": "神忘れない"
      },
      {
        "vi": "lời Cha hứa sẽ nhanh thi hành.",
        "ko": "그리워하시리라.",
        "zh": "復活他所造所愛。",
        "en": "For the work of his own hand.",
        "ja": "愛する人を"
      },
      {
        "vi": "Mình tin chắc Cha ban sự sống lại,",
        "ko": "믿으라, 놀라워 말고.",
        "zh": "要相信全能的上帝，",
        "en": "So have faith, and do not wonder,",
        "ja": "信じ続けよ"
      },
      {
        "vi": "quyền năng Chúa lớn lao dường bao.",
        "ko": "주는 하실 수 있네.",
        "zh": "他能夠賜人生命，",
        "en": "For our God can make us stand.",
        "ja": "う神の奇跡を"
      },
      {
        "vi": "Chúng ta mai đây sống muôn năm,",
        "ko": "손수 지으신 우리",
        "zh": "未來必再次相見，",
        "en": "And we will live forever,",
        "ja": "また生きら"
      },
      {
        "vi": "thật vui sướng, đúng như Cha định.",
        "ko": "영원히 살게 되리.",
        "zh": "共歡聚直到永遠。",
        "en": "As the work of his own hand.",
        "ja": "れる共に必ず"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Giăng 6:40; 11:11, 43; Gia 4:14).",
      "ko": "(요한 6:40; 11:11, 43; 야고보 4:14 참조)",
      "zh": "（參看約6:40；11:11,43；雅4:14）",
      "en": "(See also John 6:40; 11:11, 43; Jas. 4:14.)",
      "ja": "（ヨハ6：40；11：11，43；ヤコ4：14も参照。）"
    }
  },
  {
    "number": 152,
    "sourceSheet": "152",
    "labels": {
      "vi": "BÀI HÁT 152",
      "ko": "152번",
      "zh": "詩歌第152首",
      "en": "SONG 152",
      "ja": "152番"
    },
    "title": {
      "vi": "Một nơi mang lại ngợi khen cho Cha",
      "ko": "주를 찬양하는 이곳",
      "zh": "你的榮耀之家",
      "en": "A Place That Will Bring You Praise",
      "ja": "あなたへの賛美あふれる場所"
    },
    "scripture": {
      "vi": "(1 Các vua 8:27; 1 Sử ký 29:14)",
      "ko": "(열왕기상 8:27; 역대기상 29:14)",
      "zh": "（列王紀上8:27；歷代志上29:14）",
      "en": "(1 Kings 8:27; 1 Chronicles 29:14)",
      "ja": "（列王第一 8:27; 歴代第一 29:14）"
    },
    "lines": [
      {
        "vi": "1. Lạy Cha, ngự ngôi thánh cao trọng trên trời,",
        "ko": "1. 저 하늘도 모실 수 없는",
        "zh": "1． 耶和華用大能造天地，",
        "en": "1.  Jehovah, the Maker of heaven,",
        "ja": "1. 壮大な天より"
      },
      {
        "vi": "thần dân ngài trên đất đang hết tâm",
        "ko": "크고 크신 여호와여,",
        "zh": "你的榮耀無可比擬。",
        "en": "By heaven you can't be contained,",
        "ja": "偉大なエホバよ"
      },
      {
        "vi": "dựng xây các công trình ngợi khen danh thánh,",
        "ko": "주를 숭배하는 이곳에",
        "zh": "小小地球如何能承載",
        "en": "Even less an earthly dwelling place.",
        "ja": "聖なる力 今"
      },
      {
        "vi": "cúi xin Cha rộng ban bao phước ân.",
        "ko": "부디 머물러 주소서.",
        "zh": "你的力量、你的厚愛？",
        "en": "But your spirit can here remain.",
        "ja": "ここに満ちている"
      },
      {
        "vi": "Mọi dân cùng nhau đến nơi này bao ngày",
        "ko": "여호와께 헌신한 우린",
        "zh": "一群人沐浴真理之光，",
        "en": "Adorning this center of worship",
        "ja": "輝く この場所に"
      },
      {
        "vi": "hầu nghe lời khôn ngoan, thông sáng thay.",
        "ko": "매일 주의 기쁨되고",
        "zh": "聚在崇拜你的地方，",
        "en": "Are people who walk in your light.",
        "ja": "集う わたしたち"
      },
      {
        "vi": "Cùng hợp nhất ca tụng, thờ tôn Cha mãi,",
        "ko": "주의 밝은 빛을 따라서",
        "zh": "渴望團結一致敬奉你，",
        "en": "We rejoice to serve in unity;",
        "ja": "喜びにあふれて"
      },
      {
        "vi": "chúng con mong luôn làm Cha mừng vui.",
        "ko": "함께 연합하리이다.",
        "zh": "獻出一生令你歡喜。",
        "en": "Our devotion is your delight.",
        "ja": "あなたをたたえる"
      },
      {
        "vi": "(ĐOẠN CHUYỂN)",
        "ko": "(브리지)",
        "zh": "（過門）",
        "en": "(BRIDGE)",
        "ja": "(ブリッジ)"
      },
      {
        "vi": "Điều Cha đã nhân từ ban",
        "ko": "여호와 하느님,",
        "zh": "你賜下了一切，",
        "en": "There is nothing we have",
        "ja": "与えられた"
      },
      {
        "vi": "nhiều vô số không gì so sánh.",
        "ko": "모든 걸 주셨으니",
        "zh": "讓我們一無所缺。",
        "en": "That you haven't provided.",
        "ja": "良いものすべて"
      },
      {
        "vi": "Giờ dâng hiến cho ngài bao điều",
        "ko": "우린 기꺼이 주께",
        "zh": "我們呈獻的薄禮，",
        "en": "From your own hand, we've given",
        "ja": "ささげていこう"
      },
      {
        "vi": "cũng do tay ngài cung cấp.",
        "ko": "바칠 뿐입니다.",
        "zh": "原本就屬於你。",
        "en": "All that we offer you.",
        "ja": "愛をこめて"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Thành tâm tạ ơn đấng ban mọi ơn lành,",
        "ko": "마침내 하느님의 집이",
        "zh": "感謝你仁愛的耶和華，",
        "en": "For all you have done, we are grateful;",
        "ja": "エホバよ 心から"
      },
      {
        "vi": "dội vang lời ca hát dâng đến Cha.",
        "ko": "눈 앞에 세워졌으니",
        "zh": "高聲讚美你的偉大。",
        "en": "Our voices in song we now raise.",
        "ja": "感謝 歌います"
      },
      {
        "vi": "Điều ao ước bấy lâu giờ ngay trước mắt.",
        "ko": "소리 높여 감사합니다,",
        "zh": "你實現我們心底願望，",
        "en": "For you've made our hope reality",
        "ja": "この麗しい場所"
      },
      {
        "vi": "Chính nơi đây mang lại bao ngợi khen.",
        "ko": "우리의 찬양 노래로.",
        "zh": "為你建造榮耀之家。",
        "en": "With this place that will bring you praise.",
        "ja": "賛美があふれる"
      },
      {
        "vi": "2. Mừng vui vì mong ước bao ngày nay thành,",
        "ko": "2. 여호와의 길 함께 걷고",
        "zh": "2． 我們都深愛你耶和華，",
        "en": "2.  Jehovah, you knew that we wanted",
        "ja": "2. わたしたちの望み"
      },
      {
        "vi": "một nơi làm danh thánh thêm hiển vinh.",
        "ko": "주의 백성 돌보려는",
        "zh": "期待建造上帝之家，",
        "en": "A place that will bring to you praise",
        "ja": "かなえられました"
      },
      {
        "vi": "Nhà Cha giúp bao người thờ phượng chân chính",
        "ko": "우리 마음 헤아리시어",
        "zh": "吸引人行走正確方向，",
        "en": "And will serve the needs of worshippers,",
        "ja": "あなたへの賛美が"
      },
      {
        "vi": "đến tôn vinh và học theo lối Cha.",
        "ko": "이곳을 주셨습니다.",
        "zh": "為純正崇拜添光芒。",
        "en": "Helping others to walk your ways.",
        "ja": "あふれるこの場所"
      },
      {
        "vi": "Giờ đây nguyện dâng hiến nơi này cho ngài.",
        "ko": "이제 아름다운 이곳이",
        "zh": "願這個地方合你心意，",
        "en": "And now may this place serve your purpose.",
        "ja": "素晴らしいご意志を"
      },
      {
        "vi": "Hằng mong ngài ban phước cho chúng con",
        "ko": "주 뜻 이루길 바라며",
        "zh": "我們也會加倍努力，",
        "en": "There's work needing yet to be done,",
        "ja": "人々に知らせ"
      },
      {
        "vi": "hầu hăng hái thi hành mọi việc nhanh chóng",
        "ko": "예수 명령 따라 끝까지",
        "zh": "聽從耶穌基督的誡命，",
        "en": "To pick up the pace and carry on",
        "ja": "あなたと歩むよう"
      },
      {
        "vi": "đúng theo như Con ngài giao thuở xưa.",
        "ko": "주의 일 행하리이다.",
        "zh": "腳步堅定地向前行。",
        "en": "In the work given by your Son.",
        "ja": "助けていきます"
      },
      {
        "vi": "(ĐOẠN CHUYỂN)",
        "ko": "(브리지)",
        "zh": "（過門）",
        "en": "(BRIDGE)",
        "ja": "(ブリッジ)"
      },
      {
        "vi": "Nguyện dâng Chúa bao thời gian",
        "ko": "우리의 정성과",
        "zh": "情願付出一切，",
        "en": "So we offer the best",
        "ja": "わたしたちの"
      },
      {
        "vi": "hoặc vật chất, năng lực, tri thức.",
        "ko": "가장 좋은 것들을",
        "zh": "每天都為你而活。",
        "en": "Of our time and possessions.",
        "ja": "最良のもの"
      },
      {
        "vi": "Vật chi tốt dâng trọn cho ngài,",
        "ko": "받아야 하실 분은",
        "zh": "你創造浩瀚宇宙，",
        "en": "You alone are deserving—",
        "ja": "今ささげたい"
      },
      {
        "vi": "đấng ban muôn điều cao quý.",
        "ko": "당신이십니다.",
        "zh": "是美善的源頭。",
        "en": "Giver of all good things.",
        "ja": "あなただけに"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Thành tâm tạ ơn đấng ban mọi ơn lành,",
        "ko": "마침내 하느님의 집이",
        "zh": "感謝你仁愛的耶和華，",
        "en": "For all you have done, we are grateful;",
        "ja": "エホバよ 心から"
      },
      {
        "vi": "dội vang lời ca hát dâng đến Cha.",
        "ko": "눈 앞에 세워졌으니",
        "zh": "高聲讚美你的偉大。",
        "en": "Our voices in song we now raise.",
        "ja": "感謝 歌います"
      },
      {
        "vi": "Điều ao ước bấy lâu giờ ngay trước mắt.",
        "ko": "소리 높여 감사합니다,",
        "zh": "你實現我們心底願望，",
        "en": "For you've made our hope reality",
        "ja": "この麗しい場所"
      }
    ],
    "reference": {
      "vi": "Chính nơi đây mang lại bao ngợi khen.",
      "ko": "우리의 찬양 노래로.",
      "zh": "為你建造榮耀之家。",
      "en": "With this place that will bring you praise.",
      "ja": "賛美があふれる"
    }
  },
  {
    "number": 153,
    "sourceSheet": "153",
    "labels": {
      "vi": "BÀI HÁT 153",
      "ko": "153번",
      "zh": "詩歌第153首",
      "en": "SONG 153",
      "ja": "153番"
    },
    "title": {
      "vi": "Xin ban cho con lòng can đảm",
      "ko": "용기를 주소서",
      "zh": "請賜我勇氣",
      "en": "Give Me Courage",
      "ja": "勇気をください"
    },
    "scripture": {
      "vi": "(2 Các vua 6:16)",
      "ko": "(열왕기하 6:16)",
      "zh": "（列王紀下6:16）",
      "en": "(2 Kings 6:16)",
      "ja": "（列王第二 6:16）"
    },
    "lines": [
      {
        "vi": "1. Dẫu quanh con đầy tăm tối,",
        "ko": "1. 마음 불안하고",
        "zh": "1. 黑暗籠罩大地，",
        "en": "1. Doubt and fear surround me—",
        "ja": "1. 立ちはだか"
      },
      {
        "vi": "kinh hãi, hoang mang bủa vây,",
        "ko": "두려울 때에도",
        "zh": "前路難以看清。",
        "en": "The way ahead not clear.",
        "ja": "る恐れの壁"
      },
      {
        "vi": "vẫn tin Cha bên con rọi soi lối,",
        "ko": "여호와, 내 곁에 서서",
        "zh": "你用正義右手引領，",
        "en": "Through uncertainty you guide me;",
        "ja": "神が共に"
      },
      {
        "vi": "dẫn bước con đi bình an.",
        "ko": "날 이끄십니다.",
        "zh": "帶我走出困境。",
        "en": "I know you're always near.",
        "ja": "いて道を拓く"
      },
      {
        "vi": "Dẫu cho muôn vàn gian khó,",
        "ko": "삶이 힘겨워도",
        "zh": "生活諸多不易，",
        "en": "Life may not be easy,",
        "ja": "敵の軍が"
      },
      {
        "vi": "tin chắc Cha luôn kề bên.",
        "ko": "난 확신합니다.",
        "zh": "而我從未懷疑：",
        "en": "But this I know is true:",
        "ja": "押し寄せても"
      },
      {
        "vi": "Giê-hô-va yêu thương và trung tín,",
        "ko": "‘충성스런 내 하느님,",
        "zh": "你是偉大忠貞上帝，",
        "en": "You're the God who's ever loyal;",
        "ja": "わたしの"
      },
      {
        "vi": "chở che cho con mãi mãi.",
        "ko": "날 지켜 주시리.'",
        "zh": "永遠不會遠離。",
        "en": "My life is safe with you.",
        "ja": "命は神が守る"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Con xin ngài làm cho con mạnh dạn,",
        "ko": "하느님, 내 눈 여시어",
        "zh": "耶和華，請賜我勇氣，",
        "en": "Jehovah, give me eyes of faith",
        "ja": "エホバ すぐそばに"
      },
      {
        "vi": "tiến bước đi lên không thôi.",
        "ko": "보게 해 주소서,",
        "zh": "讓我信心堅定！",
        "en": "And help me always see",
        "ja": "いてください"
      },
      {
        "vi": "Đội quân ở bên con nhiều hơn kẻ thù,",
        "ko": "그들보다 우리의 편이",
        "zh": "既然身邊有天使安營，",
        "en": "There are more with us than against us.",
        "ja": "敵より強い軍"
      },
      {
        "vi": "vậy nên con không thoái chí.",
        "ko": "더 많다는 것을.",
        "zh": "我又何必擔心？",
        "en": "Courageous let me be.",
        "ja": "見えるように"
      },
      {
        "vi": "Can trường và luôn kiên cường,",
        "ko": "승리 바라보며",
        "zh": "勇氣，賜我勇氣，",
        "en": "Courage, give me courage;",
        "ja": "今ください"
      },
      {
        "vi": "vững bước qua bao nguy nan.",
        "ko": "용기 내리이다.",
        "zh": "我決不會放棄！",
        "en": "With courage, I'll endure.",
        "ja": "耐えるために"
      },
      {
        "vi": "Con khẩn cầu Cha ban can đảm,",
        "ko": "아버지, 우리에게",
        "zh": "耶和華，賜我勇氣，",
        "en": "Jehovah, give me courage;",
        "ja": "勇気ください"
      },
      {
        "vi": "hướng trông tương lai vinh quang.",
        "ko": "용기를 주소서.",
        "zh": "迎接最終勝利！",
        "en": "Your victory is sure.",
        "ja": "勝利近い"
      },
      {
        "vi": "2. Có đôi khi lòng kinh hãi,",
        "ko": "2. 너무 힘에 겨워",
        "zh": "2. 恐懼充滿內心，",
        "en": "2. Feeling fear is human.",
        "ja": "2. 不意に"
      },
      {
        "vi": "nhưng nhớ tay Cha toàn năng.",
        "ko": "약해질 때에도",
        "zh": "怎能信賴自己？",
        "en": "In my own strength, I'm frail.",
        "ja": "襲う不安の波"
      },
      {
        "vi": "Giê-hô-va, nơi con hằng nương náu,",
        "ko": "나의 반석이 돼 주신",
        "zh": "你是磐石、牧人、盾牌，",
        "en": "You have been my rock and refuge;",
        "ja": "自分の力の"
      },
      {
        "vi": "vách đá nơi con cậy trông.",
        "ko": "여호와 하느님.",
        "zh": "大有忠貞之愛。",
        "en": "Your power never fails.",
        "ja": "弱さを知る"
      },
      {
        "vi": "Hãy cho con lòng can đảm,",
        "ko": "그 어떤 시련도",
        "zh": "求你賜我勇氣，",
        "en": "Help me be courageous,",
        "ja": "神に"
      },
      {
        "vi": "kiên quyết đi trong đường Cha.",
        "ko": "죽음도 감옥도",
        "zh": "賜我勇敢的心。",
        "en": "And let my heart be brave.",
        "ja": "勇気求めるなら"
      },
      {
        "vi": "Chốn gian lao hay nơi mồ chết chóc",
        "ko": "나를 꺾을 수 없으니",
        "zh": "失去自由，失去生命，",
        "en": "Lasting harm can never hold me—",
        "ja": "だれもその"
      },
      {
        "vi": "chẳng gây cho con vấp ngã.",
        "ko": "용기를 주소서.",
        "zh": "我也不會戰兢！",
        "en": "No prison, gate, or grave.",
        "ja": "勇気取り去れない"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Con xin ngài làm cho con mạnh dạn,",
        "ko": "하느님, 내 눈 여시어",
        "zh": "耶和華，請賜我勇氣，",
        "en": "Jehovah, give me eyes of faith",
        "ja": "エホバ すぐそばに"
      },
      {
        "vi": "tiến bước đi lên không thôi.",
        "ko": "보게 해 주소서,",
        "zh": "讓我信心堅定！",
        "en": "And help me always see",
        "ja": "いてください"
      },
      {
        "vi": "Đội quân ở bên con nhiều hơn kẻ thù,",
        "ko": "그들보다 우리의 편이",
        "zh": "既然身邊有天使安營，",
        "en": "There are more with us than against us.",
        "ja": "敵より強い軍"
      },
      {
        "vi": "vậy nên con không thoái chí.",
        "ko": "더 많다는 것을.",
        "zh": "我又何必擔心？",
        "en": "Courageous let me be.",
        "ja": "見えるように"
      },
      {
        "vi": "Can trường và luôn kiên cường,",
        "ko": "승리 바라보며",
        "zh": "勇氣，賜我勇氣，",
        "en": "Courage, give me courage;",
        "ja": "今ください"
      },
      {
        "vi": "vững bước qua bao nguy nan.",
        "ko": "용기 내리이다.",
        "zh": "我決不會放棄！",
        "en": "With courage, I'll endure.",
        "ja": "耐えるために"
      },
      {
        "vi": "Con khẩn cầu Cha ban can đảm,",
        "ko": "아버지, 우리에게",
        "zh": "耶和華，賜我勇氣，",
        "en": "Jehovah, give me courage;",
        "ja": "勇気ください"
      },
      {
        "vi": "hướng trông tương lai vinh quang.",
        "ko": "용기를 주소서.",
        "zh": "迎接最終勝利！",
        "en": "Your victory is sure.",
        "ja": "勝利近い"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Con xin ngài làm cho con mạnh dạn,",
        "ko": "하느님, 내 눈 여시어",
        "zh": "耶和華，請賜我勇氣，",
        "en": "Jehovah, give me eyes of faith",
        "ja": "エホバ すぐそばに"
      },
      {
        "vi": "tiến bước đi lên không thôi.",
        "ko": "보게 해 주소서,",
        "zh": "讓我信心堅定！",
        "en": "And help me always see",
        "ja": "いてください"
      },
      {
        "vi": "Đội quân ở bên con nhiều hơn kẻ thù,",
        "ko": "그들보다 우리의 편이",
        "zh": "既然身邊有天使安營，",
        "en": "There are more with us than against us.",
        "ja": "敵より強い軍"
      },
      {
        "vi": "vậy nên con không thoái chí.",
        "ko": "더 많다는 것을.",
        "zh": "我又何必擔心？",
        "en": "Courageous let me be.",
        "ja": "見えるように"
      },
      {
        "vi": "Can trường và luôn kiên cường,",
        "ko": "승리 바라보며",
        "zh": "勇氣，賜我勇氣，",
        "en": "Courage, give me courage;",
        "ja": "今ください"
      },
      {
        "vi": "vững bước qua bao nguy nan.",
        "ko": "용기 내리이다.",
        "zh": "我決不會放棄！",
        "en": "With courage, I'll endure.",
        "ja": "耐えるために"
      },
      {
        "vi": "Con khẩn cầu Cha ban can đảm,",
        "ko": "아버지, 우리에게",
        "zh": "耶和華，賜我勇氣，",
        "en": "Jehovah, give me courage;",
        "ja": "勇気ください"
      },
      {
        "vi": "hướng trông tương lai vinh quang.",
        "ko": "용기를 주소서.",
        "zh": "迎接最終勝利！",
        "en": "Your victory is sure.",
        "ja": "勝利近い"
      },
      {
        "vi": "Con khẩn cầu Cha ban can đảm,",
        "ko": "아버지, 우리에게",
        "zh": "耶和華，賜我勇氣，",
        "en": "Jehovah, give me courage;",
        "ja": "勇気ください"
      }
    ],
    "reference": {
      "vi": "hướng trông tương lai vinh quang.",
      "ko": "용기를 주소서.",
      "zh": "迎接最終勝利！",
      "en": "Your victory is sure.",
      "ja": "勝利近い"
    }
  },
  {
    "number": 154,
    "sourceSheet": "154",
    "labels": {
      "vi": "BÀI HÁT 154",
      "ko": "154번",
      "zh": "詩歌第154首",
      "en": "SONG 154",
      "ja": "154番"
    },
    "title": {
      "vi": "Tình yêu thương tồn tại mãi",
      "ko": "결코 없어지지 않는 사랑",
      "zh": "永恆的愛",
      "en": "Unfailing Love",
      "ja": "愛は決して絶えない"
    },
    "scripture": {
      "vi": "(1 Cô-rinh-tô 13:8)",
      "ko": "(고린도 전서 13:8)",
      "zh": "（哥林多前書13:8）",
      "en": "(1 Corinthians 13:8)",
      "ja": "（コリント第一 13:8）"
    },
    "lines": [
      {
        "vi": "1. Tình yêu thương tha thiết",
        "ko": "1. 주윌 둘러봐,",
        "zh": "1．看，你我身邊，",
        "en": "1. Look around us now;",
        "ja": "1. 見渡せば"
      },
      {
        "vi": "giờ lan tỏa xung quanh mình,",
        "ko": "우리 형제들의",
        "zh": "親愛弟兄姐妹，",
        "en": "See the love on each face—",
        "ja": "あふれる愛"
      },
      {
        "vi": "tìm nơi đâu trong thế gian vô tình.",
        "ko": "사랑 가득한 모습을.",
        "zh": "歷經多少風霜雨雪。",
        "en": "Out there in the world, hard to find.",
        "ja": "大切な仲間"
      },
      {
        "vi": "Cạnh bên ta vô số",
        "ko": "이 세상에선",
        "zh": "人生的希望，",
        "en": "All these faithful friends",
        "ja": "あとにし"
      },
      {
        "vi": "bạn trung tín không xa rời,",
        "ko": "결코 찾지 못할,",
        "zh": "被愛重新點燃，",
        "en": "With the love they all show,",
        "ja": "た今の世では"
      },
      {
        "vi": "làm tim ta reo khúc ca vui mừng.",
        "ko": "세상을 이긴 사랑을.",
        "zh": "遠離這世界的黑暗。",
        "en": "Glad to leave that old world behind.",
        "ja": "見られない景色"
      },
      {
        "vi": "(TIỀN ĐIỆP KHÚC)",
        "ko": "(프리코러스)",
        "zh": "（導歌）",
        "en": "(PRE-CHORUS)",
        "ja": "(プレコーラス)"
      },
      {
        "vi": "Chúa hứa ban điều chẳng nhạt phai:",
        "ko": "사랑은 인내하며",
        "zh": "深信上帝的諾言，",
        "en": "Love never fails; that's promised.",
        "ja": "試みを越え"
      },
      {
        "vi": "Ấy yêu thương tồn tại mãi.",
        "ko": "없어지지 않네.",
        "zh": "他的愛永不變！",
        "en": "It always will endure.",
        "ja": "愛は残る"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Yêu, mãi không chuyển lay,",
        "ko": "이 깊은 사랑,",
        "zh": "愛，永恆的愛——",
        "en": "Love—unfailing love—",
        "ja": "さあ 進もう"
      },
      {
        "vi": "sẽ luôn thắm thiết, tràn đầy",
        "ko": "바로 여호와의",
        "zh": "是耶和華的愛，",
        "en": "That's what Jehovah gives.",
        "ja": "神と"
      },
      {
        "vi": "giống Giê-hô-va.",
        "ko": "사랑이네.",
        "zh": "深廣如海。",
        "en": "That's what he is.",
        "ja": "歩む愛の道を"
      },
      {
        "vi": "Yêu, mãi không chuyển lay",
        "ko": "끝없는 사랑,",
        "zh": "愛，永恆的愛——",
        "en": "Love—unfailing love—",
        "ja": "今日 確か"
      },
      {
        "vi": "dẫu qua tháng tháng ngày ngày.",
        "ko": "오늘 이 마음을",
        "zh": "跨越一切障礙，",
        "en": "That's what we need to live.",
        "ja": "に 心にある"
      },
      {
        "vi": "Tình yêu thương có trong ta,",
        "ko": "잊지 않으리라.",
        "zh": "把愛珍藏心間，",
        "en": "And the love here today,",
        "ja": "私たちの愛は"
      },
      {
        "vi": "nguyện luôn xây đắp bền vững,",
        "ko": "우린 영원토록",
        "zh": "相愛直到永遠——",
        "en": "In our heart may it stay—",
        "ja": "決して"
      },
      {
        "vi": "không sao chuyển lay.",
        "ko": "사랑하리.",
        "zh": "永恆的愛。",
        "en": "Unfailing love.",
        "ja": "絶えない"
      },
      {
        "vi": "2. Dù đôi khi gian khó",
        "ko": "2. 힘겨울 때에",
        "zh": "2．生活的憂慮",
        "en": "2. Though sometimes it seems",
        "ja": "2. うつむいて"
      },
      {
        "vi": "cùng bao mối lo trong đời",
        "ko": "위로의 하느님",
        "zh": "彷彿重擔千斤，",
        "en": "Like the cares of this life",
        "ja": "沈む心"
      },
      {
        "vi": "nặng trên hai vai khiến ta nao sờn,",
        "ko": "지친 내게 힘 주시네.",
        "zh": "難免感到精疲力盡。",
        "en": "Weigh us down and feel hard to bear,",
        "ja": "神が"
      },
      {
        "vi": "vậy nhưng khi hăng hái",
        "ko": "서로 힘 주고",
        "zh": "但永不放棄，",
        "en": "Giving brings us joy",
        "ja": "抱き上げる"
      },
      {
        "vi": "truyền tin Chúa đến muôn người",
        "ko": "희망 전해 줄 때,",
        "zh": "甘心獻出自己，",
        "en": "When we share faith and hope,",
        "ja": "喜びで弾む心"
      },
      {
        "vi": "và cho đi, ta sẽ thêm vui mừng.",
        "ko": "주는 기쁨 알게 되네.",
        "zh": "這份愛他必不忘記。",
        "en": "Comforted by God's loving care.",
        "ja": "愛を与えれば"
      },
      {
        "vi": "(TIỀN ĐIỆP KHÚC)",
        "ko": "(프리코러스)",
        "zh": "（導歌）",
        "en": "(PRE-CHORUS)",
        "ja": "(プレコーラス)"
      },
      {
        "vi": "Chúa hứa ban điều chẳng nhạt phai:",
        "ko": "영원한 이 사랑은",
        "zh": "深信上帝的諾言，",
        "en": "Love will remain; that's promised.",
        "ja": "試みを越え"
      },
      {
        "vi": "Ấy yêu thương tồn tại mãi.",
        "ko": "없어지지 않네.",
        "zh": "他的愛永不變！",
        "en": "It always will endure.",
        "ja": "愛は残る"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Yêu, mãi không chuyển lay,",
        "ko": "이 깊은 사랑,",
        "zh": "愛，永恆的愛——",
        "en": "Love—unfailing love—",
        "ja": "さあ 進もう"
      },
      {
        "vi": "sẽ luôn thắm thiết, tràn đầy",
        "ko": "바로 여호와의",
        "zh": "是耶和華的愛，",
        "en": "That's what Jehovah gives.",
        "ja": "神と"
      },
      {
        "vi": "giống Giê-hô-va.",
        "ko": "사랑이네.",
        "zh": "深廣如海。",
        "en": "That's what he is.",
        "ja": "歩む愛の道を"
      },
      {
        "vi": "Yêu, mãi không chuyển lay",
        "ko": "끝없는 사랑,",
        "zh": "愛，永恆的愛——",
        "en": "Love—unfailing love—",
        "ja": "今日 確か"
      },
      {
        "vi": "dẫu qua tháng tháng ngày ngày.",
        "ko": "오늘 이 마음을",
        "zh": "跨越一切障礙，",
        "en": "That's what we need to live.",
        "ja": "に 心に"
      },
      {
        "vi": "Tình yêu thương có trong ta,",
        "ko": "잊지 않으리라,",
        "zh": "把愛珍藏心間，",
        "en": "And the love here today,",
        "ja": "ある 私たちの"
      },
      {
        "vi": "nguyện luôn xây đắp bền vững.",
        "ko": "우린 영원토록.",
        "zh": "相愛直到永遠！",
        "en": "In our heart may it stay.",
        "ja": "愛は決して"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Yêu, mãi không chuyển lay,",
        "ko": "이 깊은 사랑,",
        "zh": "愛，永恆的愛——",
        "en": "Love—unfailing love—",
        "ja": "さあ 進もう"
      },
      {
        "vi": "sẽ luôn thắm thiết, tràn đầy",
        "ko": "바로 여호와의",
        "zh": "是耶和華的愛，",
        "en": "That’s what Jehovah gives.",
        "ja": "神と"
      },
      {
        "vi": "giống Giê-hô-va.",
        "ko": "사랑이네.",
        "zh": "深廣如海。",
        "en": "That's what he is.",
        "ja": "歩む愛の道を"
      },
      {
        "vi": "Yêu, mãi không chuyển lay",
        "ko": "끝없는 사랑,",
        "zh": "愛，永恆的愛——",
        "en": "Love—unfailing love—",
        "ja": "今日 確か"
      },
      {
        "vi": "dẫu qua tháng tháng ngày ngày.",
        "ko": "오늘 이 마음을",
        "zh": "跨越一切障礙，",
        "en": "That's what we need to live.",
        "ja": "に 心にある"
      },
      {
        "vi": "Tình yêu thương có trong ta,",
        "ko": "잊지 않으리라.",
        "zh": "把愛珍藏心間，",
        "en": "And the love here today,",
        "ja": "私たちの愛は"
      },
      {
        "vi": "nguyện luôn xây đắp bền vững,",
        "ko": "우린 영원토록",
        "zh": "相愛直到永遠——",
        "en": "In our heart may it stay—",
        "ja": "決して"
      },
      {
        "vi": "không sao chuyển lay.",
        "ko": "사랑하리.",
        "zh": "永恆的愛，",
        "en": "Unfailing love,",
        "ja": "絶えない"
      },
      {
        "vi": "Yêu thương bền lâu,",
        "ko": "사랑하리.",
        "zh": "永恆的愛，",
        "en": "Unfailing love,",
        "ja": "この愛"
      }
    ],
    "reference": {
      "vi": "không sao chuyển lay.",
      "ko": "사랑하리.",
      "zh": "永恆的愛……",
      "en": "Unfailing love.",
      "ja": "絶えない"
    }
  },
  {
    "number": 155,
    "sourceSheet": "155",
    "labels": {
      "vi": "BÀI HÁT 155",
      "ko": "155번",
      "zh": "詩歌第155首",
      "en": "SONG 155",
      "ja": "155番"
    },
    "title": {
      "vi": "Nguồn sướng vui đến muôn đời",
      "ko": "이 기쁨 영원히",
      "zh": "讓我永遠歡欣",
      "en": "Our Joy Eternally",
      "ja": "喜びは永遠に"
    },
    "scripture": {
      "vi": "(Thi thiên 16:11)",
      "ko": "(시편 16:11)",
      "zh": "（詩篇16:11）",
      "en": "(Psalm 16:11)",
      "ja": "（詩編 16:11）"
    },
    "lines": [
      {
        "vi": "1. Bầu trời huyền diệu muôn sao chiếu sáng",
        "ko": "1. 깊은 밤 하늘 가득한",
        "zh": "1．夜幕降臨，繁星閃耀，",
        "en": "1. The stars that fill the summer night",
        "ja": "1. 星たちまたたく"
      },
      {
        "vi": "hòa với ánh trăng vàng.",
        "ko": "눈부신 별들.",
        "zh": "迷人的光彩。",
        "en": "Look down from above.",
        "ja": "夜の空"
      },
      {
        "vi": "Rồi ngày lại về mang tia nắng mới",
        "ko": "저 밝은 태양 당신의",
        "zh": "絢麗風光向人訴說",
        "en": "The beauty of the day and night",
        "ja": "木陰に差し"
      },
      {
        "vi": "cùng múa ca rộn vang.",
        "ko": "사랑 비추죠.",
        "zh": "你深廣的愛。",
        "en": "You fashioned with love.",
        "ja": "込む 陽の光"
      },
      {
        "vi": "Tay Giê-hô-va tràn đầy yêu thương",
        "ko": "이 땅의 모든 선물을",
        "zh": "是你創造了天和地，",
        "en": "Your hands prepared the land and sea,",
        "ja": "エホバがその"
      },
      {
        "vi": "đã điểm tô cho địa cầu xanh tươi,",
        "ko": "우릴 위해 준비하며",
        "zh": "讓地球充滿了生機，",
        "en": "And ev'rything that came to be",
        "ja": "手ですべてを造った"
      },
      {
        "vi": "Cha sướng vui vô ngần.",
        "ko": "기뻐하셨죠.",
        "zh": "你滿心歡喜。",
        "en": "Brought joy to your heart.",
        "ja": "愛込めて"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Lòng vui sướng khi xem việc của Cha,",
        "ko": "주의 모든 창조물에,",
        "zh": "奇妙萬物帶來歡樂，",
        "en": "There is joy in your creation,",
        "ja": "あなたの"
      },
      {
        "vi": "hình dung cảnh mai sau đời sáng tươi",
        "ko": "다가올 낙원 희망에",
        "zh": "拯救信息讓人高歌，",
        "en": "In the message of salvation,",
        "ja": "創造 あなたの"
      },
      {
        "vi": "trong địa đàng do Cha hứa ban.",
        "ko": "기쁨이 가득하죠.",
        "zh": "新世界就在前頭。",
        "en": "And the Paradise to come.",
        "ja": "約束 心が躍る"
      },
      {
        "vi": "Được Cha mãi yêu thương chẳng đổi thay",
        "ko": "하지만 주 여호와여,",
        "zh": "你的愛勝過了一切，",
        "en": "But to have your love forever",
        "ja": "あなたからの愛"
      },
      {
        "vi": "là kho báu ôi không gì quý hơn.",
        "ko": "내겐 당신의 사랑이",
        "zh": "令我心中無比歡躍，",
        "en": "Is a real and lasting treasure.",
        "ja": "永遠にあふれ"
      },
      {
        "vi": "Nơi Cha nguồn an vui, thư thái,",
        "ko": "가장 큰 기쁨이죠.",
        "zh": "你是唯一的上帝，",
        "en": "You alone will prove to be",
        "ja": "この喜びに"
      },
      {
        "vi": "nguồn sướng vui đến muôn đời.",
        "ko": "이 기쁨 영원히.",
        "zh": "讓我永遠歡欣！",
        "en": "Our joy eternally.",
        "ja": "終わりはない"
      },
      {
        "vi": "2. Mọi quà tuyệt vời Cha ban khắp đất",
        "ko": "2. 우리의 기쁨 위해서",
        "zh": "2．耶和華我要感謝你",
        "en": "2. Jehovah, we have all we need",
        "ja": "2. 喜びの理由"
      },
      {
        "vi": "làm chúng con vui mừng.",
        "ko": "모두 주셨죠.",
        "zh": "賜予的厚愛。",
        "en": "To bring us delight—",
        "ja": "数え上げ"
      },
      {
        "vi": "Vạn vật diệu kỳ tay Cha thiết kế",
        "ko": "보고 듣는 이 모든 것,",
        "zh": "眼前美景、耳邊旋律，",
        "en": "The things we hear and touch and see",
        "ja": "心に感じる"
      },
      {
        "vi": "đều chứa chan niềm vui.",
        "ko": "깊은 감정도.",
        "zh": "生命多精彩！",
        "en": "And feel deep inside.",
        "ja": "生きる意味"
      },
      {
        "vi": "Cha hứa ban cho loài người tương lai ",
        "ko": "우리의 삶에 기쁨을,",
        "zh": "你創造美麗的家園，",
        "en": "You gave us such a perfect start,",
        "ja": "永遠を思い"
      },
      {
        "vi": "sống mãi muôn năm cùng người thân yêu",
        "ko": "우리 마음에 영원을",
        "zh": "讓我們渴望能永遠",
        "en": "Eternity in ev'ry heart,",
        "ja": "希望が広がる"
      },
      {
        "vi": "trong sướng vui vô tận.",
        "ko": "선물하셨죠.",
        "zh": "快樂每一天。",
        "en": "And joy in our lives.",
        "ja": "その先に"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Lòng vui sướng khi xem việc của Cha,",
        "ko": "주의 모든 창조물에,",
        "zh": "奇妙萬物帶來歡樂，",
        "en": "There is joy in your creation,",
        "ja": "あなたの"
      },
      {
        "vi": "hình dung cảnh mai sau đời sáng tươi",
        "ko": "다가올 낙원 희망에",
        "zh": "拯救信息讓人高歌，",
        "en": "In the message of salvation,",
        "ja": "創造 あなたの"
      },
      {
        "vi": "trong địa đàng do Cha hứa ban.",
        "ko": "기쁨이 가득하죠.",
        "zh": "新世界就在前頭。",
        "en": "And the Paradise to come.",
        "ja": "約束 心が躍る"
      },
      {
        "vi": "Được Cha mãi yêu thương chẳng đổi thay",
        "ko": "하지만 주 여호와여,",
        "zh": "你的愛勝過了一切，",
        "en": "But to have your love forever",
        "ja": "あなたからの愛"
      },
      {
        "vi": "là kho báu ôi không gì quý hơn.",
        "ko": "내겐 당신의 사랑이",
        "zh": "令我心中無比歡躍，",
        "en": "Is a real and lasting treasure.",
        "ja": "永遠にあふれ"
      },
      {
        "vi": "Nơi Cha nguồn an vui, thư thái,",
        "ko": "가장 큰 기쁨이죠.",
        "zh": "你是唯一的上帝，",
        "en": "You alone will prove to be",
        "ja": "この喜びに"
      },
      {
        "vi": "nguồn sướng vui đến muôn đời.",
        "ko": "이 기쁨 영원히.",
        "zh": "讓我永遠歡欣！",
        "en": "Our joy eternally.",
        "ja": "終わりはない"
      },
      {
        "vi": "(ĐOẠN CHUYỂN)",
        "ko": "(브리지)",
        "zh": "（過門）",
        "en": "(BRIDGE)",
        "ja": "(ブリッジ)"
      },
      {
        "vi": "Nhờ ngài hy sinh con yêu",
        "ko": "소중한 아들 보내셨죠,",
        "zh": "你偉大無私，",
        "en": "This joy could not be ours",
        "ja": "独り子が"
      },
      {
        "vi": "Giê-su chết thay cho nhân loại,",
        "ko": "우릴 위해.",
        "zh": "甘願犧牲兒子生命。",
        "en": "Without the gift of your Son.",
        "ja": "命を差し出し"
      },
      {
        "vi": "người người vâng theo Cha Giê-hô-va",
        "ko": "값진 희생을 치르셨죠,",
        "zh": "為全人類帶來拯救，",
        "en": "His sacrifice has paid the price",
        "ja": "永遠の歓喜を"
      },
      {
        "vi": "sẽ sống đời yên vui dài lâu mãi.",
        "ko": "우리의 기쁨 위해.",
        "zh": "讓歡樂幸福到永久！",
        "en": "So joy could be ours for all time.",
        "ja": "実現させた"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Lòng vui sướng khi xem việc của Cha,",
        "ko": "주의 모든 창조물에,",
        "zh": "奇妙萬物帶來歡樂，",
        "en": "There is joy in your creation,",
        "ja": "あなたの"
      },
      {
        "vi": "hình dung cảnh mai sau đời sáng tươi",
        "ko": "다가올 낙원 희망에",
        "zh": "拯救信息讓人高歌，",
        "en": "In the message of salvation,",
        "ja": "創造 あなたの"
      },
      {
        "vi": "trong địa đàng do Cha hứa ban.",
        "ko": "기쁨이 가득하죠.",
        "zh": "新世界就在前頭。",
        "en": "And the Paradise to come.",
        "ja": "約束 心が躍る"
      },
      {
        "vi": "Được Cha mãi yêu thương chẳng đổi thay",
        "ko": "하지만 주 여호와여,",
        "zh": "你的愛勝過了一切，",
        "en": "But to have your love forever",
        "ja": "あなたからの愛"
      },
      {
        "vi": "là kho báu ôi không gì quý hơn.",
        "ko": "내겐 당신의 사랑이",
        "zh": "令我心中無比歡躍，",
        "en": "Is a real and lasting treasure.",
        "ja": "永遠にあふれ"
      },
      {
        "vi": "Nơi Cha nguồn an vui, thư thái,",
        "ko": "가장 큰 기쁨이죠.",
        "zh": "你是唯一的上帝，",
        "en": "You alone will prove to be",
        "ja": "この喜びに"
      },
      {
        "vi": "nguồn sướng vui đến muôn đời.",
        "ko": "이 기쁨 영원히.",
        "zh": "讓我永遠歡欣！",
        "en": "Our joy eternally.",
        "ja": "終わりはない"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Lòng vui sướng khi xem việc của Cha,",
        "ko": "주의 모든 창조물에,",
        "zh": "奇妙萬物帶來歡樂，",
        "en": "There is joy in your creation,",
        "ja": "あなたの"
      },
      {
        "vi": "hình dung cảnh mai sau đời sáng tươi",
        "ko": "다가올 낙원 희망에",
        "zh": "拯救信息讓人高歌，",
        "en": "In the message of salvation,",
        "ja": "創造 あなたの"
      },
      {
        "vi": "trong địa đàng do Cha hứa ban.",
        "ko": "기쁨이 가득하죠.",
        "zh": "新世界就在前頭。",
        "en": "And the Paradise to come.",
        "ja": "約束 心が躍る"
      },
      {
        "vi": "Được Cha mãi yêu thương chẳng đổi thay",
        "ko": "하지만 주 여호와여,",
        "zh": "你的愛勝過了一切，",
        "en": "But to have your love forever",
        "ja": "あなたからの愛"
      },
      {
        "vi": "là kho báu ôi không gì quý hơn.",
        "ko": "내겐 당신의 사랑이",
        "zh": "令我心中無比歡躍，",
        "en": "Is a real and lasting treasure.",
        "ja": "永遠にあふれ"
      },
      {
        "vi": "Nơi Cha nguồn an vui, thư thái,",
        "ko": "가장 큰 기쁨이죠.",
        "zh": "你是唯一的上帝，",
        "en": "You alone will prove to be",
        "ja": "この喜びに"
      },
      {
        "vi": "nguồn sướng vui đến muôn đời.",
        "ko": "이 기쁨 영원히.",
        "zh": "讓我永遠歡欣！",
        "en": "Our joy eternally.",
        "ja": "終わりはない"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 37:4; 1 Cô 15:28).",
      "ko": "(시 37:4; 고전 15:28 참조)",
      "zh": "（參看詩篇37:4；哥林多前書15:28）",
      "en": "(See also Ps. 37:4; 1 Cor. 15:28.)",
      "ja": "（詩 37:4; コリ一 15:28も参照。）"
    }
  },
  {
    "number": 156,
    "sourceSheet": "156",
    "labels": {
      "vi": "BÀI HÁT 156",
      "ko": "156번",
      "zh": "詩歌第156首",
      "en": "SONG 156",
      "ja": "156番"
    },
    "title": {
      "vi": "Mắt đức tin",
      "ko": "믿음의 눈으로",
      "zh": "我有信心",
      "en": "With Eyes of Faith",
      "ja": "信仰を抱いて"
    },
    "scripture": {
      "vi": "(Thi thiên 27:13)",
      "ko": "(시편 27:13)",
      "zh": "（詩篇27:13）",
      "en": "(Psalm 27:13)",
      "ja": "（詩編 27:13）"
    },
    "lines": [
      {
        "vi": "1. Dẫu kẻ thù kia có mưu hại,",
        "ko": "1. 사자와 맞선대도",
        "zh": "1． 縱使我陷入絕境，",
        "en": "1. Why should I fear the lion?",
        "ja": "1. 炎のように迫る"
      },
      {
        "vi": "tôi không kinh hãi, chẳng run sợ.",
        "ko": "적들이 많다 해도",
        "zh": "腳下的路很艱辛，",
        "en": "Why should I fear any foe?",
        "ja": "敵たち"
      },
      {
        "vi": "Nhờ Cha Giê-hô-va kề bên,",
        "ko": "여호와 내 편이니",
        "zh": "我不是孤身一人",
        "en": "With Jehovah by my side,",
        "ja": "恐れはしない"
      },
      {
        "vi": "chân tôi sẽ đứng vững vàng.",
        "ko": "물러나지 않죠,",
        "zh": "面對人生曲折，",
        "en": "I will not run and hide.",
        "ja": "いつもそばに"
      },
      {
        "vi": "Cha vẫn mãi ở gần ngay bên tôi.",
        "ko": "그분 내 곁에 계시니.",
        "zh": "上帝是我堅強後盾。",
        "en": "My God is with me; this I know.",
        "ja": "エホバがいるから"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Mắt đức tin giúp",
        "ko": "믿음의 눈,",
        "zh": "我有信心",
        "en": "With eyes of faith,",
        "ja": "あなたの助けを"
      },
      {
        "vi": "tôi thấy tương lai tuyệt vời thay.",
        "ko": "어둠 너멀 봅니다.",
        "zh": "衝破黑暗的困境，",
        "en": "I see beyond the darkness.",
        "ja": "信じ"
      },
      {
        "vi": "Mắt đức tin giúp",
        "ko": "믿음의 눈,",
        "zh": "我能看見",
        "en": "With eyes of faith,",
        "ja": "あなたから"
      },
      {
        "vi": "tôi bước qua bao nguy nan.",
        "ko": "두려움 떨치죠.",
        "zh": "曙光照亮天際。",
        "en": "there's nothing more to fear.",
        "ja": "離れない"
      },
      {
        "vi": "Nhờ đôi mắt với đức tin ấy,",
        "ko": "끝까지 확신하며",
        "zh": "耶和華必賜力量，",
        "en": "With Jehovah, I am strong,",
        "ja": "力もらって"
      },
      {
        "vi": "quyết tín trung không chuyển lay.",
        "ko": "나아가렵니다,",
        "zh": "不用擔心害怕。",
        "en": "Determined to go on,",
        "ja": "強くなろう"
      },
      {
        "vi": "Vì Cha luôn kề bên và hằng thêm sức,",
        "ko": "여호와 내 곁에 계시니.",
        "zh": "耶和華總在我的身旁。",
        "en": "Knowing that my God is always near—",
        "ja": "進みつづけていこう"
      },
      {
        "vi": "tôi tin cậy Cha.",
        "ko": "믿음으로.",
        "zh": "我有信心！",
        "en": "With eyes of faith.",
        "ja": "あなたと"
      },
      {
        "vi": "2. Thuở trước nhiều gương đức tin mạnh",
        "ko": "2. 끝까지 믿음으로",
        "zh": "2． 那些忠貞的榜樣，",
        "en": "2. Those faithful ones before us",
        "ja": "2. エホバは友を"
      },
      {
        "vi": "theo Cha Giê-hô-va trung thành.",
        "ko": "충성을 지킨 이들.",
        "zh": "一生都信心堅強。",
        "en": "Lived their lives in loyalty.",
        "ja": "忘れることなく"
      },
      {
        "vi": "Dù thử thách lớn dường bao",
        "ko": "이제 가까웠죠,",
        "zh": "耶和華不忘記，",
        "en": "By their faith they endured.",
        "ja": "また再び"
      },
      {
        "vi": "họ luôn đứng vững kiên cường,",
        "ko": "곧 다시 일어나",
        "zh": "必賜他們生命，",
        "en": "Their future is assured.",
        "ja": "目覚めさせる"
      },
      {
        "vi": "tin chắc sẽ sống lại trong địa đàng.",
        "ko": "우리 앞에 설 그날이.",
        "zh": "忠心事跡將會延續。",
        "en": "They'll stand again for all to see.",
        "ja": "新しい世界で"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Mắt đức tin giúp",
        "ko": "믿음의 눈,",
        "zh": "我有信心",
        "en": "With eyes of faith,",
        "ja": "あなたの助けを"
      },
      {
        "vi": "tôi thấy tương lai tuyệt vời thay.",
        "ko": "어둠 너멀 봅니다.",
        "zh": "衝破黑暗的困境，",
        "en": "I see beyond the darkness.",
        "ja": "信じ"
      },
      {
        "vi": "Mắt đức tin giúp",
        "ko": "믿음의 눈,",
        "zh": "我能看見",
        "en": "With eyes of faith,",
        "ja": "あなたから"
      },
      {
        "vi": "tôi bước qua bao nguy nan.",
        "ko": "두려움 떨치죠.",
        "zh": "曙光照亮天際。",
        "en": "there's nothing more to fear.",
        "ja": "離れない"
      },
      {
        "vi": "Nhờ đôi mắt với đức tin ấy,",
        "ko": "끝까지 확신하며",
        "zh": "耶和華必賜力量，",
        "en": "With Jehovah, I am strong,",
        "ja": "力もらって"
      },
      {
        "vi": "quyết tín trung không chuyển lay.",
        "ko": "나아가렵니다,",
        "zh": "不用擔心害怕。",
        "en": "Determined to go on,",
        "ja": "強くなろう"
      },
      {
        "vi": "Vì Cha luôn kề bên và hằng thêm sức,",
        "ko": "여호와 내 곁에 계시니.",
        "zh": "耶和華總在我的身旁。",
        "en": "Knowing that my God is always near—",
        "ja": "進みつづけていこう"
      },
      {
        "vi": "tôi tin cậy Cha.",
        "ko": "믿음으로.",
        "zh": "我有信心！",
        "en": "With eyes of faith.",
        "ja": "あなたと"
      },
      {
        "vi": "(ĐOẠN CHUYỂN)",
        "ko": "(브리지)",
        "zh": "（過門）",
        "en": "(BRIDGE)",
        "ja": "(ブリッジ)"
      },
      {
        "vi": "Vững bước vượt qua",
        "ko": "믿음으로",
        "zh": "我有信心",
        "en": "With eyes of faith,",
        "ja": "確かな希望がある"
      },
      {
        "vi": "bao chông gai tựa như núi",
        "ko": "희망 굳세지고",
        "zh": "跨越重重障礙，",
        "en": "I can move a mountain.",
        "ja": "試練の向こうに"
      },
      {
        "vi": "nhờ có đôi mắt đức tin rạng ngời.",
        "ko": "큰 산도 옮길 수 있죠.",
        "zh": "我能看見光明未來。",
        "en": "With eyes of faith, my hope is sure.",
        "ja": "揺るがず"
      },
      {
        "vi": "Qua đôi mắt ấy, tôi hằng trông thấy phía sau mây mù",
        "ko": "그 어떤 시련 모두 이겨 낼 믿음",
        "zh": "堅強的信心幫助我堅持到底，",
        "en": "Where would I be Without the faith",
        "ja": "立ちつづけていく"
      },
      {
        "vi": "lối đi mang hy vọng đầy tươi sáng.",
        "ko": "끝까지 지키렵니다.",
        "zh": "捍衛真理、臨危不懼。",
        "en": "that helps me see Beyond the trials I endure?",
        "ja": "信仰抱いて"
      },
      {
        "vi": "3. Thấy trước ngày mai sáng huy hoàng",
        "ko": "3. 나에게 약속하신",
        "zh": "3． 幸福生活已不遠，",
        "en": "3. I see the wondrous future",
        "ja": "3. 未来が見える"
      },
      {
        "vi": "do Cha đã hứa ban tặng.",
        "ko": "그날이 보이죠.",
        "zh": "希望近在眼前。",
        "en": "God has in store for me.",
        "ja": "もう目の前に"
      },
      {
        "vi": "Ngày ấy chẳng còn xa,",
        "ko": "용기 낼게요,",
        "zh": "我下定決心，",
        "en": "I need to be strong.",
        "ja": "守り抜く"
      },
      {
        "vi": "lòng tôi quyết giữ trung thành,",
        "ko": "여호와의 승리",
        "zh": "一刻都不放棄，",
        "en": "I know it won’t be long",
        "ja": "この信仰"
      },
      {
        "vi": "chờ mong Giê-hô-va toàn thắng vinh quang.",
        "ko": "바로 우리 앞에 있으니.",
        "zh": "等待耶和華伸張正義。",
        "en": "Till Jehovah claims his victory.",
        "ja": "エホバの勝利まで"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Mắt đức tin giúp",
        "ko": "믿음의 눈,",
        "zh": "我有信心",
        "en": "With eyes of faith,",
        "ja": "あなたの助けを"
      },
      {
        "vi": "tôi thấy tương lai tuyệt vời thay.",
        "ko": "어둠 너멀 봅니다.",
        "zh": "衝破黑暗的困境，",
        "en": "I see beyond the darkness.",
        "ja": "信じ"
      },
      {
        "vi": "Mắt đức tin giúp",
        "ko": "믿음의 눈,",
        "zh": "我能看見",
        "en": "With eyes of faith,",
        "ja": "あなたから"
      },
      {
        "vi": "tôi bước qua bao nguy nan.",
        "ko": "두려움 떨치죠.",
        "zh": "曙光照亮天際。",
        "en": "there's nothing more to fear.",
        "ja": "離れない"
      },
      {
        "vi": "Nhờ đôi mắt với đức tin ấy,",
        "ko": "끝까지 확신하며",
        "zh": "耶和華必賜力量，",
        "en": "With Jehovah, I am strong,",
        "ja": "力もらって"
      },
      {
        "vi": "quyết tín trung không chuyển lay.",
        "ko": "나아가렵니다,",
        "zh": "不用擔心害怕。",
        "en": "Determined to go on,",
        "ja": "強くなろう"
      },
      {
        "vi": "Vì Cha luôn kề bên và hằng thêm sức,",
        "ko": "여호와 내 곁에 계시니.",
        "zh": "耶和華總在我的身旁。",
        "en": "Knowing that my God is always near—",
        "ja": "進みつづけていこう"
      },
      {
        "vi": "tôi tin cậy Cha.",
        "ko": "믿음으로.",
        "zh": "我有信心！",
        "en": "With eyes of faith,",
        "ja": "あなたと"
      },
      {
        "vi": "Tôi tin cậy Cha.",
        "ko": "믿음으로.",
        "zh": "我有信心！",
        "en": "With eyes of faith.",
        "ja": "未来へ エホバと"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Hê 11:1-40).",
      "ko": "(히브리 11:1-40 참조)",
      "zh": "（參看希伯來書11:1-40）",
      "en": "(See also Heb. 11:1-40.)",
      "ja": "（ヘブ 11:1-40も参照。）"
    }
  },
  {
    "number": 157,
    "sourceSheet": "157",
    "labels": {
      "vi": "BÀI HÁT 157",
      "ko": "157번",
      "zh": "詩歌第157首",
      "en": "SONG 157",
      "ja": "157番"
    },
    "title": {
      "vi": "Bình an mãi mãi!",
      "ko": "마침내 평화!",
      "zh": "和平安寧終於實現",
      "en": "Peace at Last!",
      "ja": "平和が満ちる時"
    },
    "scripture": {
      "vi": "(Thi thiên 29:11)",
      "ko": "(시편 29:11)",
      "zh": "（詩篇29:11）",
      "en": "(Psalm 29:11)",
      "ja": "（詩編 29:11）"
    },
    "lines": [
      {
        "vi": "1. Dù cuồng phong đang vây quanh",
        "ko": "1. 거친 폭풍에도",
        "zh": "1.黑夜風暴突襲，",
        "en": "1. Like an island of calm",
        "ja": "1. この世界が"
      },
      {
        "vi": "với mây đen tối tăm,",
        "ko": "평온한 섬처럼",
        "zh": "這寧靜島嶼，",
        "en": "In dark stormy seas,",
        "ja": "どんよりと暗く"
      },
      {
        "vi": "bình an trong dân Chúa vẫn đong đầy.",
        "ko": "우린 평화를 누리네.",
        "zh": "昂然屹立，無所畏懼。",
        "en": "God's people are living in peace.",
        "ja": "沈んでも"
      },
      {
        "vi": "Cậy trông Giê-hô-va",
        "ko": "믿음의 두 눈",
        "zh": "烏雲會過境，",
        "en": "With our eyes of faith,",
        "ja": "信仰の目には"
      },
      {
        "vi": "chúng ta vượt qua bão giông,",
        "ko": "환히 비춰 주네,",
        "zh": "信心之眼望去，",
        "en": "We see beyond the clouds",
        "ja": "見える"
      },
      {
        "vi": "chờ mong ngày tươi sáng mà Cha hứa.",
        "ko": "곧 폭풍 걷힐 그날을.",
        "zh": "狂風暴雨終必平息。",
        "en": "And know that the storm soon will cease.",
        "ja": "明るい未来が"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Khắp muôn nơi trên địa cầu",
        "ko": "온 땅에 가득히",
        "zh": "亂世重歸平靜，",
        "en": "To the ends of the earth,",
        "ja": "川を越えて山も"
      },
      {
        "vi": "thái an cho nhân loại,",
        "ko": "마침내 평화,",
        "zh": "雨過天將晴，",
        "en": "There'll be peace at last",
        "ja": "越え その"
      },
      {
        "vi": "người người vui sống bên nhau.",
        "ko": "끝없이 누리리.",
        "zh": "和平永世延續。",
        "en": "For all eternity.",
        "ja": "向こうまで"
      },
      {
        "vi": "Chốn non cao nơi đồng bằng,",
        "ko": "깊은 바다에서",
        "zh": "從大海的疆界，",
        "en": "From the valleys below",
        "ja": "この地球の果てに"
      },
      {
        "vi": "bình an mãi trường tồn",
        "ko": "높은 산까지",
        "zh": "到群山之巔，",
        "en": "To the mountaintops,",
        "ja": "まで 平和"
      },
      {
        "vi": "giữa muôn vật Cha dựng nên.",
        "ko": "모두 보게 되리,",
        "zh": "安寧綿延不絕，",
        "en": "All creation will see",
        "ja": "満ちる"
      },
      {
        "vi": "Mãi an bình.",
        "ko": "평화를.",
        "zh": "到永遠。",
        "en": "Peace at last.",
        "ja": "ついに"
      },
      {
        "vi": "2. Ngày gần đây trong tương lai,",
        "ko": "2. 하늘과 온 땅의",
        "zh": "2.迎來新天新地，",
        "en": "2. When the new world is here,",
        "ja": "2. 一つになる"
      },
      {
        "vi": "theo như ý Cha",
        "ko": "모든 가족",
        "zh": "天上地上，",
        "en": "All will be one",
        "ja": "天地が"
      },
      {
        "vi": "hoàn vũ cùng hợp nhất tôn vinh ngài.",
        "ko": "마침내 하나 될 그날.",
        "zh": "團結一致，同心合意。",
        "en": "On earth and in heaven above.",
        "ja": "新しくなって"
      },
      {
        "vi": "Sự bình an như sông,",
        "ko": "전엔 몰랐던",
        "zh": "曾用心尋覓，",
        "en": "And the peace we'll know",
        "ja": "誰もまだ見たこと"
      },
      {
        "vi": "lối công bình như sóng tràn",
        "ko": "평화로운 세상.",
        "zh": "這份幸福安寧，",
        "en": "We've never known before—",
        "ja": "ない 平和"
      },
      {
        "vi": "cùng vô vàn yêu thương từ Cha xuống.",
        "ko": "공의와 사랑 넘치리.",
        "zh": "如今終見正義降臨。",
        "en": "A world ruled by justice and love.",
        "ja": "訪れる"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Khắp muôn nơi trên địa cầu",
        "ko": "온 땅에 가득히",
        "zh": "亂世重歸平靜，",
        "en": "To the ends of the earth,",
        "ja": "川を越えて山も"
      },
      {
        "vi": "thái an cho nhân loại,",
        "ko": "마침내 평화,",
        "zh": "雨過天將晴，",
        "en": "There'll be peace at last",
        "ja": "越え その"
      },
      {
        "vi": "người người vui sống bên nhau.",
        "ko": "끝없이 누리리.",
        "zh": "和平永世延續。",
        "en": "For all eternity.",
        "ja": "向こうまで"
      },
      {
        "vi": "Chốn non cao nơi đồng bằng,",
        "ko": "깊은 바다에서",
        "zh": "從大海的疆界，",
        "en": "From the valleys below",
        "ja": "この地球の果てに"
      },
      {
        "vi": "bình an mãi trường tồn",
        "ko": "높은 산까지",
        "zh": "到群山之巔，",
        "en": "To the mountaintops,",
        "ja": "まで 平和"
      },
      {
        "vi": "giữa muôn vật Cha dựng nên.",
        "ko": "모두 보게 되리,",
        "zh": "安寧綿延不絕，",
        "en": "All creation will see",
        "ja": "満ちる"
      },
      {
        "vi": "Mãi an bình.",
        "ko": "평화를.",
        "zh": "到永遠。",
        "en": "Peace at last.",
        "ja": "ついに"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Khắp muôn nơi trên địa cầu",
        "ko": "온 땅에 가득히",
        "zh": "亂世重歸平靜，",
        "en": "To the ends of the earth,",
        "ja": "川を越えて山も"
      },
      {
        "vi": "thái an cho nhân loại,",
        "ko": "마침내 평화,",
        "zh": "雨過天將晴，",
        "en": "There'll be peace at last",
        "ja": "越え その"
      },
      {
        "vi": "người người vui sống bên nhau.",
        "ko": "끝없이 누리리.",
        "zh": "和平永世延續。",
        "en": "For all eternity.",
        "ja": "向こうまで"
      },
      {
        "vi": "Chốn non cao nơi đồng bằng,",
        "ko": "깊은 바다에서",
        "zh": "從大海的疆界，",
        "en": "From the valleys below",
        "ja": "この地球の果てに"
      },
      {
        "vi": "bình an mãi trường tồn",
        "ko": "높은 산까지",
        "zh": "到群山之巔，",
        "en": "To the mountaintops,",
        "ja": "まで 平和"
      },
      {
        "vi": "giữa muôn vật Cha dựng nên.",
        "ko": "모두 보게 되리.",
        "zh": "安寧綿延不絕。",
        "en": "All creation will see.",
        "ja": "満ちる"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Khắp muôn nơi trên địa cầu",
        "ko": "온 땅에 가득히",
        "zh": "亂世重歸平靜，",
        "en": "To the ends of the earth,",
        "ja": "川を越えて山も"
      },
      {
        "vi": "thái an cho nhân loại,",
        "ko": "마침내 평화,",
        "zh": "雨過天將晴，",
        "en": "To the ends of the earth,",
        "ja": "越え その"
      },
      {
        "vi": "người người vui sống bên nhau.",
        "ko": "끝없이 누리리.",
        "zh": "和平永世延續。",
        "en": "For all eternity.",
        "ja": "向こうまで"
      },
      {
        "vi": "Chốn non cao nơi đồng bằng,",
        "ko": "깊은 바다에서",
        "zh": "從大海的疆界，",
        "en": "From the valleys below",
        "ja": "この地球の果てに"
      },
      {
        "vi": "bình an mãi trường tồn",
        "ko": "높은 산까지",
        "zh": "到群山之巔，",
        "en": "To the mountaintops,",
        "ja": "まで 平和"
      },
      {
        "vi": "giữa muôn vật Cha dựng nên.",
        "ko": "모두 보게 되리,",
        "zh": "安寧綿延不絕，",
        "en": "All creation will see",
        "ja": "満ちる"
      },
      {
        "vi": "Mãi an bình.",
        "ko": "평화를.",
        "zh": "到永遠，",
        "en": "Peace at last.",
        "ja": "ついに"
      },
      {
        "vi": "Mãi an bình!",
        "ko": "평화를!",
        "zh": "到永遠！",
        "en": "Peace at last!",
        "ja": "ついに"
      }
    ],
    "reference": {
      "vi": "(See also Thi 72:1-7; Ês 2:4; Rô 16:20)",
      "ko": "(시 72:1-7; 이사야 2:4; 로마 16:20 참조)",
      "zh": "（參看詩篇72:1-7；以賽亞書2:4；羅馬書16:20）",
      "en": "(See also Ps. 72:1-7; Isa. 2:4; Rom. 16:20)",
      "ja": "（詩 72:1-7; イザ 2:4; ロマ 16:20も参照。）"
    }
  },
  {
    "number": 158,
    "sourceSheet": "158",
    "labels": {
      "vi": "BÀI HÁT 158",
      "ko": "158번",
      "zh": "詩歌第158首",
      "en": "SONG 158",
      "ja": "158番"
    },
    "title": {
      "vi": "Sẽ không chậm trễ!",
      "ko": "“늦지 않으리!”",
      "zh": "絕不會延後",
      "en": "“It Will Not Be Late!”",
      "ja": "「遅くなることはない！」"
    },
    "scripture": {
      "vi": "(Ha-ba-cúc 2:3)",
      "ko": "(하박국 2:3)",
      "zh": "（哈巴谷書2:3）",
      "en": "(Habakkuk 2:3)",
      "ja": "（ハバクク 2:3）"
    },
    "lines": [
      {
        "vi": "1. Kỳ công trên khắp đất",
        "ko": "1. 눈이 부시게",
        "zh": "1．點璀璨星空，",
        "en": "1. Beauty fills the earth,",
        "ja": "1. 美しいこの星に"
      },
      {
        "vi": "được tay Cha thiết kế,",
        "ko": "아름다운 땅,",
        "zh": "畫美麗日落，",
        "en": "wonder fills our mind—",
        "ja": "パラダイ"
      },
      {
        "vi": "kiên nhẫn Cha điểm tô",
        "ko": "그 오랜 시간",
        "zh": "你耐心創作，",
        "en": "The work of your hands",
        "ja": "ス戻って"
      },
      {
        "vi": "muôn vật xinh tươi đến thế.",
        "ko": "준비한 아버지.",
        "zh": "獨一無二傑作。",
        "en": "so patiently designed.",
        "ja": "くる"
      },
      {
        "vi": "Chẳng chi ngăn ý muốn",
        "ko": "수많은 세월",
        "zh": "任潮起潮落，",
        "en": "Though the world may change,",
        "ja": "神は今"
      },
      {
        "vi": "là địa đàng khắp chốn,",
        "ko": "참아오셨죠,",
        "zh": "你有始有終，",
        "en": "you remain the same.",
        "ja": "待っている"
      },
      {
        "vi": "Cha vẫn kiên trì giúp",
        "ko": "다시 낙원을",
        "zh": "耐心地等候，",
        "en": "You patiently wait",
        "ja": "この"
      },
      {
        "vi": "khôi phục mọi vật như trước.",
        "ko": "안겨 주기 위해.",
        "zh": "只為兌現承諾。",
        "en": "to make it new again.",
        "ja": "世界変える時を"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Địa đàng xinh tươi tuyệt vời",
        "ko": "아버지 약속을",
        "zh": "新天新地輪廓，",
        "en": "Father, we long to see",
        "ja": "エホバ どうか"
      },
      {
        "vi": "người người hân hoan chờ đợi",
        "ko": "이루실 날까지",
        "zh": "一遍一遍重播，",
        "en": "Paradise come to be.",
        "ja": "待てるように"
      },
      {
        "vi": "chẳng còn bao lâu sẽ đến mau.",
        "ko": "기쁘게 참으리다.",
        "zh": "請讓我耐心等候。",
        "en": "Give us the patience to wait.",
        "ja": "力ください"
      },
      {
        "vi": "Tựa vầng dương không đổi dời,",
        "ko": "그 모든 눈물을",
        "zh": "無論還要多久，",
        "en": "We know your day will come,",
        "ja": "その日は来る"
      },
      {
        "vi": "Lời Cha hứa sẽ chẳng sai.",
        "ko": "닦아 주실 그날,",
        "zh": "那個指定時候，",
        "en": "sure as the rising sun.",
        "ja": "夜は明ける"
      },
      {
        "vi": "Cầu Giê-hô-va giúp chúng con",
        "ko": "그날은 단 하루도",
        "zh": "全在你掌握之中，",
        "en": "No matter how long it takes,",
        "ja": "遅れること"
      },
      {
        "vi": "kiên nhẫn trông đợi ngài.",
        "ko": "“늦지 않으리!”",
        "zh": "絕不會延後。",
        "en": "“It will not be late!”",
        "ja": "は決してない"
      },
      {
        "vi": "2. Người lâu nay đã khuất",
        "ko": "2. 잠들어 있는",
        "zh": "2．那熟悉眼眸，",
        "en": "2. Faithfully we wait",
        "ja": "2. いつだって"
      },
      {
        "vi": "rồi mai đây thức giấc.",
        "ko": "충실한 벗들",
        "zh": "深藏記憶中，",
        "en": "for the dead to rise.",
        "ja": "忘れない"
      },
      {
        "vi": "Cha mỏi mong nhìn thấy",
        "ko": "그 누구보다",
        "zh": "你也會難受，",
        "en": "Jehovah, you yearn",
        "ja": "亡くなっ"
      },
      {
        "vi": "công việc tay Cha khi xưa.",
        "ko": "그리워하시죠.",
        "zh": "依然靜心等候。",
        "en": "to bring them back to life.",
        "ja": "た愛する人"
      },
      {
        "vi": "Ngày Cha đang sắp đến,",
        "ko": "우리도 함께",
        "zh": "天父你說過，",
        "en": "Father, we well know",
        "ja": "神が"
      },
      {
        "vi": "cầu xin Cha hãy giúp",
        "ko": "기다립니다,",
        "zh": "重逢不是夢，",
        "en": "how you loved them so.",
        "ja": "また楽園で"
      },
      {
        "vi": "cho chúng con kiên nhẫn",
        "ko": "다시 그 이름",
        "zh": "求你堅定我，",
        "en": "Instill in our hearts",
        "ja": "抱き起こし"
      },
      {
        "vi": "trông đợi tương lai tươi sáng.",
        "ko": "부르실 그날을.",
        "zh": "忍耐直到最終。",
        "en": "the patience you have shown.",
        "ja": "息吹き込む"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Địa đàng xinh tươi tuyệt vời",
        "ko": "아버지 약속을",
        "zh": "新天新地輪廓，",
        "en": "Father, we long to see",
        "ja": "エホバ どうか"
      },
      {
        "vi": "người người hân hoan chờ đợi",
        "ko": "이루실 날까지",
        "zh": "一遍一遍重播，",
        "en": "Paradise come to be.",
        "ja": "待てるように"
      },
      {
        "vi": "chẳng còn bao lâu sẽ đến mau.",
        "ko": "기쁘게 참으리다.",
        "zh": "請讓我耐心等候。",
        "en": "Give us the patience to wait.",
        "ja": "力ください"
      },
      {
        "vi": "Tựa vầng dương không đổi dời,",
        "ko": "그 모든 눈물을",
        "zh": "無論還要多久，",
        "en": "We know your day will come,",
        "ja": "その日は来る"
      },
      {
        "vi": "Lời Cha hứa sẽ chẳng sai.",
        "ko": "닦아 주실 그날,",
        "zh": "那個指定時候，",
        "en": "sure as the rising sun.",
        "ja": "夜は明ける"
      },
      {
        "vi": "Cầu Giê-hô-va giúp chúng con",
        "ko": "그날은 단 하루도",
        "zh": "全在你掌握之中，",
        "en": "No matter how long it takes,",
        "ja": "遅れること"
      },
      {
        "vi": "kiên nhẫn trông đợi ngài.",
        "ko": "“늦지 않으리!”",
        "zh": "絕不會延後。",
        "en": "“It will not be late!”",
        "ja": "は決してない"
      },
      {
        "vi": "3. Người khiêm nhu khắp chốn",
        "ko": "3. 한 사람이라도",
        "zh": "3．你用心搜索，",
        "en": "3. Patiently you search;",
        "ja": "3. 最後まで"
      },
      {
        "vi": "cần tương lai Cha ban;",
        "ko": "더 찾으시려고",
        "zh": "到天涯盡頭，",
        "en": "honest hearts you find.",
        "ja": "探したい"
      },
      {
        "vi": "kiên nhẫn Cha tìm kiếm,",
        "ko": "참아오셨죠,",
        "zh": "正直心田中，",
        "en": "You heal them with hope",
        "ja": "神の愛"
      },
      {
        "vi": "xoa dịu lòng người than van.",
        "ko": "생명 주기 위해.",
        "zh": "真理開花結果。",
        "en": "and long to give them life.",
        "ja": "求める人"
      },
      {
        "vi": "Tận tâm trong thánh chức,",
        "ko": "아버지 따라",
        "zh": "救生的重託，",
        "en": "Working by your side,",
        "ja": "神は"
      },
      {
        "vi": "lòng hăng say háo hức,",
        "ko": "온 마음 다해",
        "zh": "有你引領我，",
        "en": "sharing what is true,",
        "ja": "まだ待っている"
      },
      {
        "vi": "cho chúng con đời sống",
        "ko": "소중한 양들",
        "zh": "陪伴我左右，",
        "en": "We use our time well.",
        "ja": "真の"
      },
      {
        "vi": "thỏa nguyện và gần Cha hơn.",
        "ko": "함께 찾을게요.",
        "zh": "帶著讚許笑容。",
        "en": "It draws us close to you.",
        "ja": "希望与えるため"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Địa đàng xinh tươi tuyệt vời",
        "ko": "아버지 약속을",
        "zh": "新天新地輪廓，",
        "en": "Father, we long to see",
        "ja": "エホバ どうか"
      },
      {
        "vi": "người người hân hoan chờ đợi",
        "ko": "이루실 날까지",
        "zh": "一遍一遍重播，",
        "en": "Paradise come to be.",
        "ja": "待てるように"
      },
      {
        "vi": "chẳng còn bao lâu sẽ đến mau.",
        "ko": "기쁘게 참으리다.",
        "zh": "請讓我耐心等候。",
        "en": "Give us the patience to wait.",
        "ja": "力ください"
      },
      {
        "vi": "Tựa vầng dương không đổi dời,",
        "ko": "그 모든 눈물을",
        "zh": "無論還要多久，",
        "en": "We know your day will come,",
        "ja": "その日は来る"
      },
      {
        "vi": "Lời Cha hứa sẽ chẳng sai.",
        "ko": "닦아 주실 그날,",
        "zh": "那個指定時候，",
        "en": "sure as the rising sun.",
        "ja": "夜は明ける"
      },
      {
        "vi": "Cầu Giê-hô-va giúp chúng con",
        "ko": "그날은 단 하루도",
        "zh": "全在你掌握之中，",
        "en": "No matter how long it takes,",
        "ja": "遅れること"
      },
      {
        "vi": "kiên nhẫn trông đợi ngài.",
        "ko": "“늦지 않으리!”",
        "zh": "絕不會延後。",
        "en": "“It will not be late!”",
        "ja": "は決してない"
      },
      {
        "vi": "Chờ trông Giê-hô-va chẳng thôi!",
        "ko": "결코 늦지 않으리!",
        "zh": "我們願耐心等候！",
        "en": "Father, please help us to wait!",
        "ja": "力ください"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Cô 1:11).",
      "ko": "(골로새 1:11 참조)",
      "zh": "（參看歌羅西書1:11）",
      "en": "(See also Col. 1:11.)",
      "ja": "（コロ 1:11も参照。）"
    }
  },
  {
    "number": 159,
    "sourceSheet": "159",
    "labels": {
      "vi": "BÀI HÁT 159",
      "ko": "159번",
      "zh": "詩歌第159首",
      "en": "SONG 159",
      "ja": "159番"
    },
    "title": {
      "vi": "Hãy tôn vinh Đức Giê-hô-va",
      "ko": "여호와께 영광을!",
      "zh": "榮耀歸給耶和華",
      "en": "Give Jehovah Glory",
      "ja": "エホバをたたえる"
    },
    "scripture": {
      "vi": "(Thi thiên 96:8)",
      "ko": "(시편 96:8)",
      "zh": "（詩篇96:8）",
      "en": "(Psalm 96:8)",
      "ja": "（詩編 96:8）"
    },
    "lines": [
      {
        "vi": "1. Chúa Giê-hô-va, Vua đầy quyền năng,",
        "ko": "1. 저 높은 하늘에 계신",
        "zh": "1． 至高的上帝耶和華，",
        "en": "1. Who is like you, O Jehovah,",
        "ja": "1. 天の父エホバ"
      },
      {
        "vi": "có ai được giống như ngài chăng?",
        "ko": "위대한 여호와여,",
        "zh": "你多麼尊貴、偉大。",
        "en": "High on your heavenly throne?",
        "ja": "永遠の王"
      },
      {
        "vi": "Chúa nhân từ với con thật nhiều thay,",
        "ko": "당신의 크신 사랑에",
        "zh": "抬頭望天我能看見，",
        "en": "How could I ever repay you",
        "ja": "賛美と栄光は"
      },
      {
        "vi": "báo đáp ân huệ ấy sao được đây?",
        "ko": "제 마음이 벅찹니다.",
        "zh": "你充滿力量和榮美。",
        "en": "For all of the love you have shown?",
        "ja": "あなただけのもの"
      },
      {
        "vi": "Mỗi khi nhìn ngắm các tầng trời cao,",
        "ko": "사람이 무엇이기에",
        "zh": "你坐在聖潔的寶座，",
        "en": "When I look up to the heavens,",
        "ja": "惜しみなく愛を"
      },
      {
        "vi": "thấy sức mạnh Chúa giữa ngàn sao.",
        "ko": "염두에 두십니까?",
        "zh": "卻顧念地上的我。",
        "en": "Power and glory I see.",
        "ja": "注いでくれる"
      },
      {
        "vi": "Hỡi Giê-hô-va, con là phàm nhân,",
        "ko": "오, 제가 무엇이기에",
        "zh": "時刻受到天父恩待，",
        "en": "Who then am I, O Jehovah,",
        "ja": "あなたに私は"
      },
      {
        "vi": "mà sao Cha đã ban bao đặc ân?",
        "ko": "이토록 돌보십니까?",
        "zh": "該怎樣報答你的愛？",
        "en": "That you would show favor to me?",
        "ja": "なにができますか"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Lòng đầy hân hoan, một bài hát mới ca vang.",
        "ko": "여호와여, 이 찬양 노래를",
        "zh": "我要歌頌偉大的耶和華，",
        "en": "Jehovah God, please hear the song I sing.",
        "ja": "エホバよ 私の歌"
      },
      {
        "vi": "Bài ca ấy con dâng tặng Chúa.",
        "ko": "부디 받아 주소서.",
        "zh": "將你名向人宣揚。",
        "en": "It's a song of praise to you.",
        "ja": "聴いてください"
      },
      {
        "vi": "Ngài là ánh sáng, là Vầng Đá đến muôn đời.",
        "ko": "영원하신 오 나의 하느님,",
        "zh": "一生讚美永恆至尊君王，",
        "en": "You are my God and the Eternal King,",
        "ja": "あなたを"
      },
      {
        "vi": "Mọi vinh hiển, con quy về Cha;",
        "ko": "홀로 받으옵소서.",
        "zh": "只有你配受顯揚。",
        "en": "So I give you what is due;",
        "ja": "賛美します"
      },
      {
        "vi": "ngợi khen thánh danh Giê-hô-va.",
        "ko": "모든 찬양, 영광을!",
        "zh": "榮耀歸給耶和華！",
        "en": "All the glory goes to you.",
        "ja": "熱い心で 命の限り"
      },
      {
        "vi": "2. Chúa ban sự sống, con thuộc về Cha.",
        "ko": "2. 당신의 능력과 선함",
        "zh": "2． 你是創造我的上帝，",
        "en": "2. My life is yours, O Jehovah.",
        "ja": "2. あなたに仕える"
      },
      {
        "vi": "Suốt trong đời, mãi khen ngợi Gia,",
        "ko": "온 땅에 전하리다.",
        "zh": "我的生命屬於你。",
        "en": "May all I do bring you praise.",
        "ja": "栄誉と誇り"
      },
      {
        "vi": "quyết rao lời Chúa cho người gần xa,",
        "ko": "내 모든 생각, 내 삶이",
        "zh": "我願天天受你指引，",
        "en": "Gladly I'll speak of your goodness",
        "ja": "胸に抱きしめて"
      },
      {
        "vi": "nhắc đến bao đường lối vĩ đại Cha.",
        "ko": "늘 당신께 찬양되길.",
        "zh": "一切言行讓你歡喜。",
        "en": "And tell of your glorious ways.",
        "ja": "語りつづけたい"
      },
      {
        "vi": "Sướng vui mừng rỡ, con tự hào thay,",
        "ko": "영예와 큰 영광으로",
        "zh": "我要稱頌你的智慧，",
        "en": "Serving you, Great God, Jehovah,",
        "ja": "あなたの導き"
      },
      {
        "vi": "có Cha dìu dắt theo đường ngay.",
        "ko": "우리를 높이시니",
        "zh": "你配得榮耀、敬畏。",
        "en": "Fills me with honor and pride.",
        "ja": "あなたの力"
      },
      {
        "vi": "Chúa vinh hiển của con, Giê-hô-va,",
        "ko": "오 나의 힘, 여호와여",
        "zh": "崇拜上帝是我榮幸，",
        "en": "You are my strength and my glory.",
        "ja": "与えてください"
      },
      {
        "vi": "nguyện dâng bao tiếng ca, khen ngợi Cha.",
        "ko": "내 모든 걸 드리리다.",
        "zh": "願一生做你的子民。",
        "en": "Forever may you be my Guide.",
        "ja": "どうか永遠に"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Lòng đầy hân hoan, một bài hát mới ca vang.",
        "ko": "여호와여, 이 찬양 노래를",
        "zh": "我要歌頌偉大的耶和華，",
        "en": "Jehovah God, please hear the song I sing.",
        "ja": "エホバよ 私の歌"
      },
      {
        "vi": "Bài ca ấy con dâng tặng Chúa.",
        "ko": "부디 받아 주소서.",
        "zh": "將你名向人宣揚。",
        "en": "It's a song of praise to you.",
        "ja": "聴いてください"
      },
      {
        "vi": "Ngài là ánh sáng, là Vầng Đá đến muôn đời.",
        "ko": "영원하신 오 나의 하느님,",
        "zh": "一生讚美永恆至尊君王，",
        "en": "You are my God and the Eternal King,",
        "ja": "あなたを"
      },
      {
        "vi": "Mọi vinh hiển, con quy về Cha;",
        "ko": "홀로 받으옵소서.",
        "zh": "只有你配受顯揚。",
        "en": "So I give you what is due;",
        "ja": "賛美します"
      },
      {
        "vi": "ngợi khen thánh danh Giê-hô-va.",
        "ko": "모든 찬양, 영광을!",
        "zh": "榮耀歸給耶和華！",
        "en": "All the glory goes to you.",
        "ja": "熱い心で 命の限り"
      },
      {
        "vi": "3. Dưới chân là biển sâu và thảo nguyên,",
        "ko": "3. 바다와 온 땅의 생명,",
        "zh": "3． 山岳連綿，海洋無邊，",
        "en": "3. Oceans and valleys below me,",
        "ja": "3. 美しい地球"
      },
      {
        "vi": "ngước lên nhìn ánh trăng bình yên.",
        "ko": "하늘을 채우는 빛,",
        "zh": "日月星辰掛天邊。",
        "en": "Sun, moon, and stars up above",
        "ja": "輝く星も"
      },
      {
        "vi": "Núi non hùng vĩ đón chào bình minh,",
        "ko": "만물이 찬양합니다.",
        "zh": "你的成就令我讚嘆，",
        "en": "Fill me with joy and with wonder",
        "ja": "息をのむほどの"
      },
      {
        "vi": "trái đất muôn tuyệt tác, ôi đẹp xinh.",
        "ko": "주 사랑을 말합니다.",
        "zh": "感受天父永恆的愛。",
        "en": "And show me your unending love.",
        "ja": "驚きに満ちて"
      },
      {
        "vi": "Thấy công việc Chúa tuôn trào tình thương,",
        "ko": "장엄한 아름다움 속",
        "zh": "你的威嚴超越天地，",
        "en": "Majesty, wisdom, and beauty:",
        "ja": "すべてはあなたが"
      },
      {
        "vi": "tính nhân từ Chúa như đại dương.",
        "ko": "주 지혜 빛납니다.",
        "zh": "卻對我真摯關心。",
        "en": "These are the things that I see.",
        "ja": "生み出したもの"
      },
      {
        "vi": "Ngắm xem thiện mỹ, oai hùng của Cha,",
        "ko": "숨 쉬는 이 모든 순간",
        "zh": "你的作為無與倫比，",
        "en": "How could I not give you glory",
        "ja": "その愛と知恵に"
      },
      {
        "vi": "lòng con vui hát khen Giê-hô-va.",
        "ko": "주 영광을 외치리다.",
        "zh": "我要把榮耀歸給你！",
        "en": "For making it all come to be?",
        "ja": "賛美があふれる"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Lòng đầy hân hoan, một bài hát mới ca vang.",
        "ko": "여호와여, 이 찬양 노래를",
        "zh": "我要歌頌偉大的耶和華，",
        "en": "Jehovah God, please hear the song I sing.",
        "ja": "エホバよ 私の歌"
      },
      {
        "vi": "Bài ca ấy con dâng tặng Chúa.",
        "ko": "부디 받아 주소서.",
        "zh": "將你名向人宣揚。",
        "en": "It's a song of praise to you.",
        "ja": "聴いてください"
      },
      {
        "vi": "Ngài là ánh sáng, là Vầng Đá đến muôn đời.",
        "ko": "영원하신 오 나의 하느님,",
        "zh": "一生讚美永恆至尊君王，",
        "en": "You are my God and the Eternal King,",
        "ja": "あなたを"
      },
      {
        "vi": "Mọi vinh hiển, con quy về Cha;",
        "ko": "홀로 받으옵소서.",
        "zh": "只有你配受顯揚。",
        "en": "So I give you what is due;",
        "ja": "賛美します"
      },
      {
        "vi": "ngợi khen thánh danh Giê-hô-va.",
        "ko": "모든 찬양, 영광을!",
        "zh": "榮耀歸給耶和華！",
        "en": "All the glory goes to you.",
        "ja": "熱い心で 命の限り"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 96:1-10; 148:3, 7).",
      "ko": "(시 96:1-10; 148:3, 7 참조)",
      "zh": "（參看詩96:1-10；148:3,7）",
      "en": "(See also Ps. 96:1-10; 148:3, 7.)",
      "ja": "（詩 96:1-10; 148:3，7も参照。）"
    }
  },
  {
    "number": 160,
    "sourceSheet": "160",
    "labels": {
      "vi": "BÀI HÁT 160",
      "ko": "160번",
      "zh": "詩歌第160首",
      "en": "SONG 160",
      "ja": "160番"
    },
    "title": {
      "vi": "“Tin mừng”!",
      "ko": "‘좋은 소식!'",
      "zh": "好消息！",
      "en": "“Good News”!",
      "ja": "良い知らせ！"
    },
    "scripture": {
      "vi": "(Lu-ca 2:10)",
      "ko": "(누가복음 2:10)",
      "zh": "（路加福音2:10）",
      "en": "(Luke 2:10)",
      "ja": "（ルカ 2:10）"
    },
    "lines": [
      {
        "vi": "1. Kìa thiên binh hòa giọng tôn vinh",
        "ko": "1. “하느님께 영광이,",
        "zh": "1．「榮耀歸至高上帝！」",
        "en": "1. “Glory in the heights above”—",
        "ja": "1. 賛美が響く 星空に"
      },
      {
        "vi": "Giê-hô-va Tối Cao.",
        "ko": "온 땅엔 평화.”",
        "zh": "晨星都高歌。",
        "en": "Good news for all men—",
        "ja": "「神の子が"
      },
      {
        "vi": "Cha đã phái Người Con xuống Bết-lê-hem.",
        "ko": "천사들이 기뻐 외쳤네.",
        "zh": "寂靜曠野好消息沸騰：",
        "en": "When God's Son arrived in Bethlehem.",
        "ja": "生まれた」"
      },
      {
        "vi": "Niềm vui quá lớn lao",
        "ko": "약속되신 왕,",
        "zh": "「就在大衛城，",
        "en": "Hope for those who mourn,",
        "ja": "たたえよう"
      },
      {
        "vi": "cho người được ơn cứu rỗi!",
        "ko": "이 땅에 오셨네!",
        "zh": "救主耶穌誕生！」",
        "en": "A Savior has been born!",
        "ja": "父エホバを"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Tin mừng, báo tin mừng",
        "ko": "좋은 소식을",
        "zh": "聽見好消息，",
        "en": "Good news, this good news—",
        "ja": "伝えよう"
      },
      {
        "vi": "về tương lai ngời sáng.",
        "ko": "기뻐 외치세!",
        "zh": "傳黑夜喜訊，",
        "en": "Joy for all mankind—",
        "ja": "この知らせ"
      },
      {
        "vi": "Biết ơn Cha vô vàn.",
        "ko": "주를 찬양해!",
        "zh": "真光已來臨！",
        "en": "Praise Jah for his light!",
        "ja": "良い知らせ"
      },
      {
        "vi": "Tin mừng, báo tin mừng",
        "ko": "아들 보내신",
        "zh": "宣告好消息，",
        "en": "Good news, this good news—",
        "ja": "力込め"
      },
      {
        "vi": "một mai Vua toàn thắng.",
        "ko": "사랑 알리세.",
        "zh": "願竭盡全力。",
        "en": "Preach with all your might.",
        "ja": "伝えよう"
      },
      {
        "vi": "Tốt thay vị Vua mới!",
        "ko": "예수 우리의 길,",
        "zh": "基督是唯一",
        "en": "Good news, Christ is born—",
        "ja": "キリストは"
      },
      {
        "vi": "Ngài ban thái an đầy tràn.",
        "ko": "참된 진리, 생명.",
        "zh": "道路、真理、生命。",
        "en": "The way, the truth, the life.",
        "ja": "この地に来た"
      },
      {
        "vi": "2. Vua lấy lẽ thẳng ngay xét đoán,",
        "ko": "2. 의의 길로 인도할",
        "zh": "2．當正義閃耀天際，",
        "en": "2. He will reign for righteousness.",
        "ja": "2. 真理を"
      },
      {
        "vi": "bình an khắp chúng dân.",
        "ko": "평화의 군왕.",
        "zh": "譜和平旋律，",
        "en": "Peace he will provide.",
        "ja": "教え 道示し"
      },
      {
        "vi": "Sự chết sẽ thành ra dĩ vãng lùi xa.",
        "ko": "모든 아픔 없애 주시리.",
        "zh": "青春會像河奔流不息。",
        "en": "Jesus is the way to endless life.",
        "ja": "命へと導く"
      },
      {
        "vi": "Dẹp tan kẻ ác gian,",
        "ko": "그분의 왕국",
        "zh": "他捍衛真理，",
        "en": "Truth he will defend.",
        "ja": "キリストは"
      },
      {
        "vi": "Nước ngài muôn năm đứng vững.",
        "ko": "영원히 서리라!",
        "zh": "權柄永無窮盡。",
        "en": "His Kingdom will not end.",
        "ja": "王国の王"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Tin mừng, báo tin mừng",
        "ko": "좋은 소식을",
        "zh": "聽見好消息，",
        "en": "Good news, this good news—",
        "ja": "伝えよう"
      },
      {
        "vi": "về tương lai ngời sáng.",
        "ko": "기뻐 외치세!",
        "zh": "傳黑夜喜訊，",
        "en": "Joy for all mankind—",
        "ja": "この知らせ"
      },
      {
        "vi": "Biết ơn Cha vô vàn.",
        "ko": "주를 찬양해!",
        "zh": "真光已來臨！",
        "en": "Praise Jah for his light!",
        "ja": "良い知らせ"
      },
      {
        "vi": "Tin mừng, báo tin mừng",
        "ko": "아들 보내신",
        "zh": "宣告好消息，",
        "en": "Good news, this good news—",
        "ja": "力込め"
      },
      {
        "vi": "một mai Vua toàn thắng.",
        "ko": "사랑 알리세.",
        "zh": "願竭盡全力。",
        "en": "Preach with all your might.",
        "ja": "伝えよう"
      },
      {
        "vi": "Tốt thay vị Vua mới!",
        "ko": "예수 우리의 길,",
        "zh": "基督是唯一",
        "en": "Good news, Christ is born—",
        "ja": "キリストは"
      },
      {
        "vi": "Ngài ban thái an đầy tràn.",
        "ko": "참된 진리, 생명.",
        "zh": "道路、真理、生命。",
        "en": "The way, the truth, the life.",
        "ja": "この地に来た"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Tin mừng, báo tin mừng",
        "ko": "좋은 소식을",
        "zh": "聽見好消息，",
        "en": "Good news, this good news—",
        "ja": "伝えよう"
      },
      {
        "vi": "về tương lai ngời sáng.",
        "ko": "기뻐 외치세!",
        "zh": "傳黑夜喜訊，",
        "en": "Joy for all mankind—",
        "ja": "この知らせ"
      },
      {
        "vi": "Biết ơn Cha vô vàn.",
        "ko": "주를 찬양해!",
        "zh": "真光已來臨！",
        "en": "Praise Jah for his light!",
        "ja": "良い知らせ"
      },
      {
        "vi": "Tin mừng, báo tin mừng",
        "ko": "아들 보내신",
        "zh": "宣告好消息，",
        "en": "Good news, this good news—",
        "ja": "力込め"
      },
      {
        "vi": "một mai Vua toàn thắng.",
        "ko": "사랑 알리세.",
        "zh": "願竭盡全力。",
        "en": "Preach with all your might.",
        "ja": "伝えよう"
      },
      {
        "vi": "Tốt thay vị Vua mới!",
        "ko": "예수 우리의 길,",
        "zh": "基督是唯一",
        "en": "Good news, Christ is born—",
        "ja": "キリストは"
      },
      {
        "vi": "Đường đi, chân lý, sự sống!",
        "ko": "참된 진리, 생명.",
        "zh": "道路、真理、生命。",
        "en": "The way, the truth, the life.",
        "ja": "この地に来た"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Mat 24:14; Giăng 8:12; 14:6; Ê-sai 32:1; 61:2).",
      "ko": "(마태 24:14; 요한 8:12; 14:6; 이사야 32:1; 61:2 참조)",
      "zh": "（參看馬太福音24:14；約翰福音8:12；14:6；以賽亞書32:1；61:2）",
      "en": "(See also Matt. 24:14; John 8:12; 14:6; Isa. 32:1; 61:2.)",
      "ja": "（マタ 24:14，ヨハ 8:12; 14:6，イザ 32:1; 61:2も参照。）"
    }
  },
  {
    "number": 161,
    "sourceSheet": "161",
    "labels": {
      "vi": "BÀI HÁT 161",
      "ko": "161번",
      "zh": "詩歌第161首",
      "en": "SONG 161",
      "ja": "161番"
    },
    "title": {
      "vi": "Làm theo ý ngài là niềm vui con",
      "ko": "당신의 뜻 행하리다",
      "zh": "我樂於遵行你的旨意",
      "en": "To Do Your Will Is My Delight",
      "ja": "あなたの望まれることを喜んで行います"
    },
    "scripture": {
      "vi": "(Thi thiên 40:8)",
      "ko": "(시편 40:8)",
      "zh": "（詩篇40:8）",
      "en": "(Psalm 40:8)",
      "ja": "（詩編 40:8）"
    },
    "lines": [
      {
        "vi": "1. Trình diện Cha, Con yêu đến sông Giô-đanh.",
        "ko": "1. “이는 사랑하는 내 아들.”",
        "zh": "1．你見證愛子出約旦河，",
        "en": "1. As your Son rose up from the Jordan",
        "ja": "1. バプテスマを"
      },
      {
        "vi": "Lời Cha ban, Con ghi khắc tâm can.",
        "ko": "울려 퍼진 주의 말씀.",
        "zh": "他記憶湧現那時刻。",
        "en": "And your precious words filled his heart,",
        "ja": "受けたイエスは悟った"
      },
      {
        "vi": "Người hằng trông mong cho ý Cha sẽ thành,",
        "ko": "예수 마음 깊이 새겼죠,",
        "zh": "你的話讓他心中快樂，",
        "en": "He was deeply moved by your purpose,",
        "ja": "エホバ あなたの"
      },
      {
        "vi": "và sốt sắng thi hành việc Cha.",
        "ko": "당신의 오랜 뜻을.",
        "zh": "你旨意他惦記著。",
        "en": "And he longed to play his part.",
        "ja": "意志 その目的を"
      },
      {
        "vi": "Dù Sa-tan giăng bao cám dỗ không thôi,",
        "ko": "주를 향한 그 사랑으로",
        "zh": "他面對試探毫無懼色，",
        "en": "He refused to yield to temptation.",
        "ja": "あなたの温か"
      },
      {
        "vi": "người yêu thương Cha nên từ chối.",
        "ko": "유혹 이겨 내셨죠.",
        "zh": "為你的名心火熱。",
        "en": "He was zealous for your name.",
        "ja": "い言葉 響いて"
      },
      {
        "vi": "Vì danh Cha, Giê-su tín trung suốt đời.",
        "ko": "당신의 뜻을 사랑하신",
        "zh": "他義無反顧肩負重任，",
        "en": "He gave ev'rything he could give you,",
        "ja": "愛に動か"
      },
      {
        "vi": "Người nêu gương tuyệt vời cho con.",
        "ko": "그분 따르리이다.",
        "zh": "獻出生命都捨得。",
        "en": "And I long to do the same.",
        "ja": "されたイエスは決めた"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Làm theo ý Chúa, con vui mừng thay.",
        "ko": "당신의 뜻 행하리다.",
        "zh": "「我樂於遵行你旨意！」",
        "en": "To do your will is my delight.",
        "ja": "あなたの望みが"
      },
      {
        "vi": "Ngài ban ánh sáng, con đi đường ngay.",
        "ko": "가장 큰 기쁨입니다.",
        "zh": "持守真理，寸步不離，",
        "en": "I give you all my strength and might.",
        "ja": "果たされ"
      },
      {
        "vi": "Có Cha, bình an; có Cha, mừng vui.",
        "ko": "내 온 마음, 내 정성을",
        "zh": "甘心樂意，無畏艱辛，",
        "en": "This joy I feel; this joy is real.",
        "ja": "るために"
      },
      {
        "vi": "Nguyện trung kiên cùng Cha không lui.",
        "ko": "영원히 드리리다.",
        "zh": "盡全力，在所不惜。",
        "en": "I will walk on in your light.",
        "ja": "私はすべてを"
      },
      {
        "vi": "Làm theo ý Chúa, con vui mừng thay.",
        "ko": "당신의 뜻 행하리다.",
        "zh": "「我樂於遵行你旨意！」",
        "en": "To do your will is my delight.",
        "ja": "尽くして歩む"
      },
      {
        "vi": "Lời Cha đã hứa không sao chuyển lay.",
        "ko": "가장 큰 영예입니다.",
        "zh": "希望曙光明亮清晰，",
        "en": "I have a hope so clear and bright.",
        "ja": "確かな希望と"
      },
      {
        "vi": "Có Cha kề bên, mãi luôn bình yên.",
        "ko": "내 아버지, 내 하느님",
        "zh": "你的慈愛朝朝如新，",
        "en": "Your love I feel; your love is real.",
        "ja": "愛をくれるから"
      },
      {
        "vi": "Ngợi khen Cha là niềm vui con,",
        "ko": "주의 기쁨이 나의",
        "zh": "讚美聲晝夜不息，",
        "en": "I will praise you day and night.",
        "ja": "あなたの望みを"
      },
      {
        "vi": "là niềm vui con.",
        "ko": "기쁨이죠.",
        "zh": "因你歡欣！",
        "en": "It's my delight.",
        "ja": "行うことは喜び"
      },
      {
        "vi": "2. Lòng hân hoan khi con biết Giê-hô-va.",
        "ko": "2. 나를 당신께 이끄시니",
        "zh": "2．天父，能與你親近交心，",
        "en": "2. As I've come to know you, Jehovah,",
        "ja": "2. エホバを知った時"
      },
      {
        "vi": "Nhờ Lời Cha, con hạnh phúc sâu xa.",
        "ko": "내 맘 벅차오릅니다.",
        "zh": "讓我又感動又驚喜。",
        "en": "I've found happiness deep inside.",
        "ja": "幸せ見つけた"
      },
      {
        "vi": "Mừng vui con rao ra ý Cha đã truyền,",
        "ko": "큰 목소리로 외칩니다,",
        "zh": "我怎能掩藏你的話語？",
        "en": "I will gladly speak as your witness,",
        "ja": "あなたの真実さ"
      },
      {
        "vi": "chẳng giấu kín cho riêng mình con.",
        "ko": "당신의 선하심을.",
        "zh": "決心宣揚你聖名！",
        "en": "And your truth I will not hide.",
        "ja": "隠さず語る"
      },
      {
        "vi": "Cùng anh em chung vai, mãi yêu thương nhau.",
        "ko": "크고 놀라운 주의 이름",
        "zh": "為你作見證深感榮幸，",
        "en": "Serving side by side with my brothers,",
        "ja": "輝く名を担う"
      },
      {
        "vi": "Dù phong ba, nơi Cha, ẩn náu.",
        "ko": "모두 알게 하리다.",
        "zh": "與弟兄姐妹同心。",
        "en": "There's no better way to live.",
        "ja": "誇り抱いて"
      },
      {
        "vi": "Phụng sự Giê-hô-va hết tâm trong đời,",
        "ko": "내게 이보다 영예로운",
        "zh": "我渴望長留在你家裡，",
        "en": "I will bear your name, oh, so proudly.",
        "ja": "友と肩並べて"
      },
      {
        "vi": "bình an đến ngàn năm không vơi.",
        "ko": "삶이 있겠습니까?",
        "zh": "把一生都獻給你！",
        "en": "I'll give all that I can give.",
        "ja": "賛美捧げる"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Làm theo ý Chúa, con vui mừng thay.",
        "ko": "당신의 뜻 행하리다.",
        "zh": "「我樂於遵行你旨意！」",
        "en": "To do your will is my delight.",
        "ja": "あなたの望みが"
      },
      {
        "vi": "Ngài ban ánh sáng, con đi đường ngay.",
        "ko": "가장 큰 기쁨입니다.",
        "zh": "持守真理，寸步不離，",
        "en": "I give you all my strength and might.",
        "ja": "果たされ"
      },
      {
        "vi": "Có Cha, bình an; có Cha, mừng vui.",
        "ko": "내 온 마음, 내 정성을",
        "zh": "甘心樂意，無畏艱辛，",
        "en": "This joy I feel; this joy is real.",
        "ja": "るために"
      },
      {
        "vi": "Nguyện trung kiên cùng Cha không lui.",
        "ko": "영원히 드리리다.",
        "zh": "盡全力，在所不惜。",
        "en": "I will walk on in your light.",
        "ja": "私はすべてを"
      },
      {
        "vi": "Làm theo ý Chúa, con vui mừng thay.",
        "ko": "당신의 뜻 행하리다.",
        "zh": "「我樂於遵行你旨意！」",
        "en": "To do your will is my delight.",
        "ja": "尽くして歩む"
      },
      {
        "vi": "Lời Cha đã hứa không sao chuyển lay.",
        "ko": "가장 큰 영예입니다.",
        "zh": "希望曙光明亮清晰，",
        "en": "I have a hope so clear and bright.",
        "ja": "確かな希望と"
      },
      {
        "vi": "Có Cha kề bên, mãi luôn bình yên.",
        "ko": "내 아버지, 내 하느님",
        "zh": "你的慈愛朝朝如新，",
        "en": "Your love I feel; your love is real.",
        "ja": "愛をくれるから"
      },
      {
        "vi": "Ngợi khen Cha là niềm vui con,",
        "ko": "주의 기쁨이 나의",
        "zh": "讚美聲晝夜不息，",
        "en": "I will praise you day and night.",
        "ja": "あなたの望みを"
      },
      {
        "vi": "là niềm vui con.",
        "ko": "기쁨이죠.",
        "zh": "因你歡欣！",
        "en": "It's my delight.",
        "ja": "行うことは喜び"
      },
      {
        "vi": "Lời Cha là niềm vui con.",
        "ko": "주 뜻 행하리다.",
        "zh": "永遠因你歡欣！",
        "en": "Your will is my delight.",
        "ja": "永遠まで"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 40:3, 10).",
      "ko": "(시 40:3, 10 참조)",
      "zh": "（參看詩篇40:3,10）",
      "en": "(See also Ps. 40:3, 10.)",
      "ja": "（詩編 40:3，10も参照。）"
    }
  },
  {
    "number": 162,
    "sourceSheet": "162",
    "labels": {
      "vi": "BÀI HÁT 162",
      "ko": "162번",
      "zh": "詩歌第162首",
      "en": "SONG 162",
      "ja": "162番"
    },
    "title": {
      "vi": "Đáp ứng nhu cầu tâm linh",
      "ko": "나의 영적 필요",
      "zh": "我要認識上帝",
      "en": "My Spiritual Need",
      "ja": "神の導きをいつも愛する"
    },
    "scripture": {
      "vi": "(Ma-thi-ơ 5:3)",
      "ko": "(마태복음 5:3)",
      "zh": "（馬太福音5:3）",
      "en": "(Matthew 5:3)",
      "ja": "（マタイ 5:3）"
    },
    "lines": [
      {
        "vi": "1. Ngài đặt vào lòng cho mỗi người",
        "ko": "1. 누구나 갖고 있네,",
        "zh": "1．從出生的那天起，",
        "en": "1. There is a need in each heart",
        "ja": "1. 人は誰でも"
      },
      {
        "vi": "một điều mình hoài mong trả lời:",
        "ko": "그분이 주신 마음.",
        "zh": "有種需要在心底，",
        "en": "God put within from the start:",
        "ja": "尋ねたくなる"
      },
      {
        "vi": "Nhân gian bao la, liệu ta có Cha?",
        "ko": "삶의 의미 알고 싶은",
        "zh": "人生意義，尋尋覓覓，",
        "en": "Yearning to know what life is for,",
        "ja": "「自分はどうして"
      },
      {
        "vi": "Tìm đâu ý nghĩa cuộc đời?",
        "ko": "영적인 그 마음.",
        "zh": "幸福，它在哪裡？",
        "en": "Thirsting for something more.",
        "ja": "生きているの？」"
      },
      {
        "vi": "Nhiều người mệt nhoài, ngưng kiếm tìm.",
        "ko": "세상은 미로처럼",
        "zh": "答案就在聖經裡，",
        "en": "Though some may search in despair,",
        "ja": "すぐそこに"
      },
      {
        "vi": "Còn mình miệt mài mong biết ngài,",
        "ko": "헤매게 만들지만",
        "zh": "我已經深信不疑，",
        "en": "God's Word has always been there—",
        "ja": "ある神の言葉が"
      },
      {
        "vi": "nên Giê-hô-va rộng ban xuống cho",
        "ko": "여호와 날 이끄시니",
        "zh": "給人希望，予人力量，",
        "en": "Words that bring hope, joy that is real,",
        "ja": "答えを与えて"
      },
      {
        "vi": "Lời chân lý mang tự do.",
        "ko": "답을 난 찾았네.",
        "zh": "讓我心花怒放。",
        "en": "Happiness I can feel.",
        "ja": "心満たす"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Lạy Gia, nguyện mãi kính mến Chúa,",
        "ko": "난 늘 주 찬양하며",
        "zh": "我要讚美耶和華，",
        "en": "I'll praise Jehovah each day,",
        "ja": "今 心か"
      },
      {
        "vi": "tín trung suốt đời, lối Cha không rời.",
        "ko": "주 벗 되어 걸으리라,",
        "zh": "走在光裡，不斷學習；",
        "en": "Walk in his light, follow his way.",
        "ja": "らエホバを"
      },
      {
        "vi": "Ngài sẽ là ánh sáng dẫn bước,",
        "ko": "나의 영적 필요를",
        "zh": "我願獻出我一生，",
        "en": "I'll give Jehovah my life,",
        "ja": "讃える"
      },
      {
        "vi": "xuống ban dư tràn bình an.",
        "ko": "채워 주시리니.",
        "zh": "信賴他，不放棄。",
        "en": "Trusting that he'll provide.",
        "ja": "その導きを"
      },
      {
        "vi": "Ngày đêm con nghiền ngẫm",
        "ko": "내 맘 가득히",
        "zh": "我傾盡全力",
        "en": "I will always feed",
        "ja": "いつも愛し"
      },
      {
        "vi": "Lời Chúa trong lòng mình.",
        "ko": "주 말씀으로.",
        "zh": "要認識上帝。",
        "en": "My spiritual need.",
        "ja": "幸せに生きていく"
      },
      {
        "vi": "2. Mình cần dành thời gian mỗi ngày",
        "ko": "2. 소중한 진리 위해",
        "zh": "2．我已經找到真理，",
        "en": "2. I know I need to make time",
        "ja": "2. 時間を取って"
      },
      {
        "vi": "đọc Lời ngài, bình an lấp đầy.",
        "ko": "더 시간을 내야 해,",
        "zh": "現在要好好珍惜。",
        "en": "Thinking on truths that I find,",
        "ja": "神の言葉を"
      },
      {
        "vi": "Yêu thương sâu xa, làm theo ý Cha,",
        "ko": "밤낮으로 내 맘 깊이",
        "zh": "細細品味，用心體會，",
        "en": "Feeding my faith, helping me see",
        "ja": "よく読み 考え"
      },
      {
        "vi": "cậy trông Chúa Giê-hô-va.",
        "ko": "뿌릴 내리도록.",
        "zh": "你的話多寶貴。",
        "en": "How to be truly free.",
        "ja": "理解したい"
      },
      {
        "vi": "Dù vài người thờ ơ chối ngài,",
        "ko": "진정한 이 행복을",
        "zh": "有些人不願意聽，",
        "en": "Though some may choose to ignore,",
        "ja": "他の人にも"
      },
      {
        "vi": "nguyện cầu rằng họ suy nghĩ lại,",
        "ko": "모두가 알아야 해.",
        "zh": "我卻依然不灰心。",
        "en": "I'll pray they open the door.",
        "ja": "真理伝えて"
      },
      {
        "vi": "tẩy sạch lòng mình, thành tâm theo Cha,",
        "ko": "그들 위해 기도하리,",
        "zh": "期待他們敞開心扉，",
        "en": "Then they can feel true peace of mind,",
        "ja": "希望と喜び"
      },
      {
        "vi": "cùng tôi sướng vui hòa ca:",
        "ko": "이 자유 얻도록.",
        "zh": "感受幸福滋味。",
        "en": "Happiness just like mine.",
        "ja": "届けるため"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Lạy Gia, nguyện mãi kính mến Chúa,",
        "ko": "난 늘 주 찬양하며",
        "zh": "我要讚美耶和華，",
        "en": "I'll praise Jehovah each day,",
        "ja": "今 心か"
      },
      {
        "vi": "tín trung suốt đời, lối Cha không rời.",
        "ko": "주 벗 되어 걸으리라,",
        "zh": "走在光裡，不斷學習；",
        "en": "Walk in his light, follow his way.",
        "ja": "らエホバを"
      },
      {
        "vi": "Ngài sẽ là ánh sáng dẫn bước,",
        "ko": "나의 영적 필요를",
        "zh": "我願獻出我一生，",
        "en": "I'll give Jehovah my life,",
        "ja": "讃える"
      },
      {
        "vi": "xuống ban dư tràn bình an.",
        "ko": "채워 주시리니.",
        "zh": "信賴他，不放棄。",
        "en": "Trusting that he'll provide.",
        "ja": "その導きを"
      },
      {
        "vi": "Ngày đêm con nghiền ngẫm",
        "ko": "내 맘 가득히",
        "zh": "我傾盡全力",
        "en": "I will always feed",
        "ja": "いつも愛し"
      },
      {
        "vi": "Lời Chúa trong lòng mình.",
        "ko": "주 말씀으로.",
        "zh": "要認識上帝。",
        "en": "My spiritual need.",
        "ja": "幸せに"
      },
      {
        "vi": "Lạy Gia, nguyện mãi kính mến Chúa,",
        "ko": "난 늘 주 찬양하며",
        "zh": "我要讚美耶和華，",
        "en": "I'll praise Jehovah each day,",
        "ja": "生きていく"
      },
      {
        "vi": "tín trung suốt đời, lối Cha không rời.",
        "ko": "주 벗 되어 걸으리라,",
        "zh": "走在光裡，不斷學習；",
        "en": "Walk in his light, follow his way.",
        "ja": "今 心か"
      },
      {
        "vi": "Ngài sẽ là ánh sáng dẫn bước,",
        "ko": "나의 영적 필요를",
        "zh": "我願獻出我一生，",
        "en": "I'll give Jehovah my life,",
        "ja": "らエホバを"
      },
      {
        "vi": "xuống ban dư tràn bình an.",
        "ko": "채워 주시리니.",
        "zh": "信賴他，不放棄。",
        "en": "Trusting that he'll provide.",
        "ja": "讃える"
      },
      {
        "vi": "Ngày đêm con nghiền ngẫm",
        "ko": "내 맘 가득히",
        "zh": "我傾盡全力",
        "en": "I will always feed",
        "ja": "その導きを"
      },
      {
        "vi": "Lời Chúa trong lòng mình.",
        "ko": "주 말씀으로.",
        "zh": "要認識上帝。",
        "en": "My spiritual need.",
        "ja": "いつも愛し"
      },
      {
        "vi": "Lạy Gia, nguyện mãi kính mến Chúa,",
        "ko": "난 늘 주 찬양하며",
        "zh": "我要讚美耶和華，",
        "en": "I'll praise Jehovah each day,",
        "ja": "幸せに生きていく"
      },
      {
        "vi": "tín trung suốt đời, lối Cha không rời.",
        "ko": "주 벗 되어 걸으리라,",
        "zh": "走在光裡，不斷學習；",
        "en": "Walk in his light, follow his way.",
        "ja": "今 心か"
      },
      {
        "vi": "Ngài sẽ là ánh sáng dẫn bước,",
        "ko": "나의 영적 필요를",
        "zh": "我願獻出我一生，",
        "en": "I'll give Jehovah my life,",
        "ja": "らエホバを讃える"
      },
      {
        "vi": "xuống ban dư tràn bình an.",
        "ko": "채워 주시리니.",
        "zh": "信賴他，不放棄。",
        "en": "Trusting that he'll provide.",
        "ja": "その導きを"
      },
      {
        "vi": "Ngày đêm con nghiền ngẫm",
        "ko": "내 맘 가득히",
        "zh": "我傾盡全力",
        "en": "I will always feed",
        "ja": "いつも愛し"
      },
      {
        "vi": "Lời Chúa trong lòng mình.",
        "ko": "주 말씀으로.",
        "zh": "要認識上帝。",
        "en": "My spiritual need.",
        "ja": "幸せに生きていく"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Thi 1:1, 2; 112:1; 119:97; Ê-sai 40:8; Mat 5:6; 16:24; 2 Ti 4:4).",
      "ko": "(시 1:1, 2; 112:1; 119:97; 이사야 40:8; 마태 5:6; 16:24; 딤후 4:4 참조)",
      "zh": "（參看詩1:1,2；112:1；119:97；賽40:8；太5:6；16:24；提後4:4）",
      "en": "(See also Ps. 1:1, 2; 112:1; 119:97; Isa. 40:8; Matt. 5:6; 16:24; 2 Tim. 4:4.)",
      "ja": "（詩 1:1，2; 112:1; 119:97，イザ 40:8，マタ 5:6; 16:24，テモ二 4:4も参照。）"
    }
  },
  {
    "number": 163,
    "sourceSheet": "163",
    "labels": {
      "vi": "BÀI HÁT 163",
      "ko": "163번",
      "zh": "詩歌第163首",
      "en": "SONG 163",
      "ja": "163番"
    },
    "title": {
      "vi": "Hạnh phúc vì mắt thấy",
      "ko": "그 빛을 봅니다",
      "zh": "我的眼睛多麼有福！",
      "en": "Happy Are These Eyes",
      "ja": "あなたたちの目は見るので幸せです"
    },
    "scripture": {
      "vi": "(Ma-thi-ơ 13:16)",
      "ko": "(마태복음 13:16)",
      "zh": "（馬太福音13:16）",
      "en": "(Matthew 13:16)",
      "ja": "（マタイ 13:16）"
    },
    "lines": [
      {
        "vi": "1. Đoàn dân đông đến với Chúa Giê-su,",
        "ko": "1. 산을 가득히 채우던",
        "zh": "1. 耶穌是真理和道路，",
        "en": "1. Jesus loved to share truth and light,",
        "ja": "1. 山の上 響く"
      },
      {
        "vi": "lời ngài dạy không phai, dẫu thiên thu.",
        "ko": "예수 따뜻한 그 말씀,",
        "zh": "他教我如何才幸福，",
        "en": "Bringing happiness to our life.",
        "ja": "温かな声が"
      },
      {
        "vi": "Ngài cho biết con đường hạnh phúc nhất cho đời ta:",
        "ko": "진리의 빛이 찬란히 빛났죠.",
        "zh": "來聽聽他說該怎樣去生活:",
        "en": "On a mountainside, he taught us how to live.",
        "ja": "イエスは"
      },
      {
        "vi": "Đặt ưu tiên ý muốn Giê-hô-va,",
        "ko": "왕국 첫째로 구하고,",
        "zh": "先考慮上帝的旨意；",
        "en": "Seeking God's will first ev'ry day,",
        "ja": "教えてくれた"
      },
      {
        "vi": "lòng thành thật, khiêm nhu cúi xin Cha,",
        "ko": "용서해 줄 수 있다고",
        "zh": "禱告要謙卑要真心；",
        "en": "With a humble heart, he would pray.",
        "ja": "心から祈り 快く許す"
      },
      {
        "vi": "và thương xót như ngài, từ nhân, thứ tha mọi người.",
        "ko": "그분 따뜻이 날 위로하셨죠.",
        "zh": "樂意原諒人，努力將心比心。",
        "en": "He was kind to all and ready to forgive.",
        "ja": "幸せに生きる道を"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Tạ ơn Cha giúp con nay",
        "ko": "여호와, 당신을",
        "zh": "能明白，多幸福，",
        "en": "By God's light, I can see",
        "ja": "探していた"
      },
      {
        "vi": "mừng vui trên lối đi ngay.",
        "ko": "선명히 봅니다.",
        "zh": "真開心走正路。",
        "en": "How to live happily.",
        "ja": "この幸せ"
      },
      {
        "vi": "Tự do thay nhờ theo ánh sáng ngài.",
        "ko": "주의 빛 따라 걸으니",
        "zh": "我看見光明和希望，",
        "en": "By God's light, I am truly free.",
        "ja": "私たちは見る"
      },
      {
        "vi": "Thật hạnh phúc cho ai được mở mắt thấy!",
        "ko": "행복합니다, 여호와여.",
        "zh": "我的眼睛啊，多麼有福！",
        "en": "Happy are these eyes because they see!",
        "ja": "神からの光で"
      },
      {
        "vi": "2. Đừng lo âu, nghĩ mãi đến mai sau.",
        "ko": "2. 삶이 지치고 힘들 때",
        "zh": "2. 生活免不了有難題，",
        "en": "2. When anxieties come our way,",
        "ja": "2. 草原の風に"
      },
      {
        "vi": "Muộn phiền của hôm nay đã qua đâu?",
        "ko": "내 맘속 빛이 꺼질 때",
        "zh": "不用為明天而憂慮，",
        "en": "We will live our lives day by day,",
        "ja": "揺れているユリも"
      },
      {
        "vi": "Mình đối phó mỗi ngày vì Cha vẫn dang bàn tay.",
        "ko": "여호와 내 손 꼭 잡아 주시죠.",
        "zh": "耶和華知道我們需要什麼。",
        "en": "For Jehovah's hand provides our daily needs.",
        "ja": "神の愛を受けて咲く"
      },
      {
        "vi": "Nhìn hoa khoe sắc thắm dưới ban mai,",
        "ko": "작은 꽃들도 입히고",
        "zh": "百合花盛開在野地，",
        "en": "As the lilies grow in the field,",
        "ja": "毎日の不安"
      },
      {
        "vi": "đẹp rạng ngời, kiêu sa, có thua ai?",
        "ko": "작은 새들도 아시죠.",
        "zh": "上帝讓它們多美麗，",
        "en": "How the love God shows is revealed!",
        "ja": "知っている神は"
      },
      {
        "vi": "Vậy lo lắng chi hoài? Ngài không muốn ta mệt nhoài.",
        "ko": "나는 얼마나 잘 돌보실까요!",
        "zh": "他愛護花朵，一定會更愛我。",
        "en": "If he cares for them, I know he'll care for me.",
        "ja": "助けてくれる 必ず"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Tạ ơn Cha giúp con nay",
        "ko": "여호와, 당신을",
        "zh": "能明白，多幸福，",
        "en": "By God's light, I can see",
        "ja": "探していた"
      },
      {
        "vi": "mừng vui trên lối đi ngay.",
        "ko": "선명히 봅니다.",
        "zh": "真開心走正路。",
        "en": "How to live happily.",
        "ja": "この幸せ"
      },
      {
        "vi": "Tự do thay nhờ theo ánh sáng ngài.",
        "ko": "주의 빛 따라 걸으니",
        "zh": "我看見光明和希望，",
        "en": "By God's light, I am truly free.",
        "ja": "私たちは見る"
      },
      {
        "vi": "Thật hạnh phúc cho ai được mở mắt thấy!",
        "ko": "행복합니다, 여호와여.",
        "zh": "我的眼睛啊，多麼有福！",
        "en": "Happy are these eyes because they see!",
        "ja": "神からの光で"
      },
      {
        "vi": "3. Nhà xây trên đá cứng chẳng lung lay,",
        "ko": "3. 반석 위 지은 믿음은",
        "zh": "3. 耶穌說聽從他的話，",
        "en": "3. We will build on rock, not on sand.",
        "ja": "3. 狭い道選び"
      },
      {
        "vi": "dù phong ba bão tố quét qua đây.",
        "ko": "거친 폭풍도 견디죠.",
        "zh": "暴風雨來臨也不怕，",
        "en": "If a storm should come, we will stand.",
        "ja": "諦めず進む"
      },
      {
        "vi": "Mình đứng vững kiên cường, nhờ luôn khắc ghi lời Cha.",
        "ko": "아버지 말씀, 오 나의 힘이죠.",
        "zh": "如同一間房，建造在岩石上。",
        "en": "Yes, Jehovah's Word will live in all we do.",
        "ja": "嵐の日が来ようとも"
      },
      {
        "vi": "Đường thênh thang dẫn đến chốn hư không.",
        "ko": "좁은 문으로 들어와",
        "zh": "他帶領我們進窄門，",
        "en": "Through the narrow gate, we will go.",
        "ja": "神からの言葉"
      },
      {
        "vi": "Vào cổng hẹp, Cha ban phước như sông,",
        "ko": "생명의 길로 걸어요.",
        "zh": "給我們安慰和福分，",
        "en": "As he guides our way, blessings flow,",
        "ja": "神からの恵み"
      },
      {
        "vi": "cùng sự sống muôn đời, bình an đến trên mọi người.",
        "ko": "어느새 우린 낙원에 있겠죠.",
        "zh": "美好的生命，從現在到永恆。",
        "en": "And it leads to life, where all will be made new.",
        "ja": "味わい歩き続ける"
      },
      {
        "vi": "(ĐIỆP KHÚC)",
        "ko": "(코러스)",
        "zh": "（副歌）",
        "en": "(CHORUS)",
        "ja": "（※ 繰り返し）"
      },
      {
        "vi": "Tạ ơn Cha giúp con nay",
        "ko": "여호와, 당신을",
        "zh": "能明白，多幸福，",
        "en": "By God's light, I can see",
        "ja": "探していた"
      },
      {
        "vi": "mừng vui trên lối đi ngay.",
        "ko": "선명히 봅니다.",
        "zh": "真開心走正路。",
        "en": "How to live happily.",
        "ja": "この幸せ"
      },
      {
        "vi": "Tự do thay nhờ theo ánh sáng ngài.",
        "ko": "주의 빛 따라 걸으니",
        "zh": "我看見光明和希望，",
        "en": "By God's light, I am truly free.",
        "ja": "私たちは見る"
      },
      {
        "vi": "Thật hạnh phúc cho ai được mở mắt thấy!",
        "ko": "행복합니다, 여호와여.",
        "zh": "我的眼睛啊，多麼有福！",
        "en": "Happy are these eyes because they see!",
        "ja": "神からの光で"
      }
    ],
    "reference": {
      "vi": "(Cũng xem Mat 7:24.)",
      "ko": "(마태 7:24 참조)",
      "zh": "（參看馬太福音7:24）",
      "en": "(See also Matt. 7:24.)",
      "ja": "（マタイ 7:24も参照。）"
    }
  }
];

if (typeof window !== "undefined") window.SONGS_DATA = SONGS_DATA;
if (typeof module !== "undefined" && module.exports) module.exports = SONGS_DATA;
