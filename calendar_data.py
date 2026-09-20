# -*- coding: utf-8 -*-
MONTHS = [{'vi': 'Tháng Một',
  'kr': {'ko': '1월', 'zh': '1月', 'en': 'January', 'ja': '1月', 'de': 'Januar', 'fr': 'janvier', 'pl': 'styczeń'}},
 {'vi': 'Tháng Hai',
  'kr': {'ko': '2월', 'zh': '2月', 'en': 'February', 'ja': '2月', 'de': 'Februar', 'fr': 'février', 'pl': 'luty'}},
 {'vi': 'Tháng Ba',
  'kr': {'ko': '3월', 'zh': '3月', 'en': 'March', 'ja': '3月', 'de': 'März', 'fr': 'mars', 'pl': 'marzec'}},
 {'vi': 'Tháng Tư',
  'kr': {'ko': '4월', 'zh': '4月', 'en': 'April', 'ja': '4月', 'de': 'April', 'fr': 'avril', 'pl': 'kwiecień'}},
 {'vi': 'Tháng Năm', 'kr': {'ko': '5월', 'zh': '5月', 'en': 'May', 'ja': '5月', 'de': 'Mai', 'fr': 'mai', 'pl': 'maj'}},
 {'vi': 'Tháng Sáu',
  'kr': {'ko': '6월', 'zh': '6月', 'en': 'June', 'ja': '6月', 'de': 'Juni', 'fr': 'juin', 'pl': 'czerwiec'}},
 {'vi': 'Tháng Bảy',
  'kr': {'ko': '7월', 'zh': '7月', 'en': 'July', 'ja': '7月', 'de': 'Juli', 'fr': 'juillet', 'pl': 'lipiec'}},
 {'vi': 'Tháng Tám',
  'kr': {'ko': '8월', 'zh': '8月', 'en': 'August', 'ja': '8月', 'de': 'August', 'fr': 'août', 'pl': 'sierpień'}},
 {'vi': 'Tháng Chín',
  'kr': {'ko': '9월',
         'zh': '9月',
         'en': 'September',
         'ja': '9月',
         'de': 'September',
         'fr': 'septembre',
         'pl': 'wrzesień'}},
 {'vi': 'Tháng Mười',
  'kr': {'ko': '10월',
         'zh': '10月',
         'en': 'October',
         'ja': '10月',
         'de': 'Oktober',
         'fr': 'octobre',
         'pl': 'październik'}},
 {'vi': 'Tháng Mười Một',
  'kr': {'ko': '11월',
         'zh': '11月',
         'en': 'November',
         'ja': '11月',
         'de': 'November',
         'fr': 'novembre',
         'pl': 'listopad'}},
 {'vi': 'Tháng Mười Hai',
  'kr': {'ko': '12월',
         'zh': '12月',
         'en': 'December',
         'ja': '12月',
         'de': 'Dezember',
         'fr': 'décembre',
         'pl': 'grudzień'}}]

DAYS = [{'vi': 'Chủ Nhật',
  'kr': {'ko': '일요일', 'zh': '星期日', 'en': 'Sunday', 'ja': '日曜日', 'de': 'Sonntag', 'fr': 'dimanche', 'pl': 'niedziela'}},
 {'vi': 'Thứ Hai',
  'kr': {'ko': '월요일', 'zh': '星期一', 'en': 'Monday', 'ja': '月曜日', 'de': 'Montag', 'fr': 'lundi', 'pl': 'poniedziałek'}},
 {'vi': 'Thứ Ba',
  'kr': {'ko': '화요일', 'zh': '星期二', 'en': 'Tuesday', 'ja': '火曜日', 'de': 'Dienstag', 'fr': 'mardi', 'pl': 'wtorek'}},
 {'vi': 'Thứ Tư',
  'kr': {'ko': '수요일', 'zh': '星期三', 'en': 'Wednesday', 'ja': '水曜日', 'de': 'Mittwoch', 'fr': 'mercredi', 'pl': 'środa'}},
 {'vi': 'Thứ Năm',
  'kr': {'ko': '목요일', 'zh': '星期四', 'en': 'Thursday', 'ja': '木曜日', 'de': 'Donnerstag', 'fr': 'jeudi', 'pl': 'czwartek'}},
 {'vi': 'Thứ Sáu',
  'kr': {'ko': '금요일', 'zh': '星期五', 'en': 'Friday', 'ja': '金曜日', 'de': 'Freitag', 'fr': 'vendredi', 'pl': 'piątek'}},
 {'vi': 'Thứ Bảy',
  'kr': {'ko': '토요일', 'zh': '星期六', 'en': 'Saturday', 'ja': '土曜日', 'de': 'Samstag', 'fr': 'samedi', 'pl': 'sobota'}}]

SEASONS = [{'vi': 'Mùa Xuân',
  'kr': {'ko': '봄', 'zh': '春天', 'en': 'spring', 'ja': '春', 'de': 'Frühling', 'fr': 'printemps', 'pl': 'wiosna'}},
 {'vi': 'Mùa Hạ', 'kr': {'ko': '여름', 'zh': '夏天', 'en': 'summer', 'ja': '夏', 'de': 'Sommer', 'fr': 'été', 'pl': 'lato'}},
 {'vi': 'Mùa Thu',
  'kr': {'ko': '가을', 'zh': '秋天', 'en': 'autumn', 'ja': '秋', 'de': 'Herbst', 'fr': 'automne', 'pl': 'jesień'}},
 {'vi': 'Mùa Đông',
  'kr': {'ko': '겨울', 'zh': '冬天', 'en': 'winter', 'ja': '冬', 'de': 'Winter', 'fr': 'hiver', 'pl': 'zima'}}]

DATES = [{'vi': 'ngày mồng một', 'kr': {'ko': '1일', 'zh': '1日', 'en': '1st', 'ja': '1日', 'de': '1.', 'fr': '1er', 'pl': '1.'}},
 {'vi': 'ngày mồng hai', 'kr': {'ko': '2일', 'zh': '2日', 'en': '2nd', 'ja': '2日', 'de': '2.', 'fr': '2', 'pl': '2.'}},
 {'vi': 'ngày mồng ba', 'kr': {'ko': '3일', 'zh': '3日', 'en': '3rd', 'ja': '3日', 'de': '3.', 'fr': '3', 'pl': '3.'}},
 {'vi': 'ngày mồng bốn', 'kr': {'ko': '4일', 'zh': '4日', 'en': '4th', 'ja': '4日', 'de': '4.', 'fr': '4', 'pl': '4.'}},
 {'vi': 'ngày mồng năm', 'kr': {'ko': '5일', 'zh': '5日', 'en': '5th', 'ja': '5日', 'de': '5.', 'fr': '5', 'pl': '5.'}},
 {'vi': 'ngày mồng sáu', 'kr': {'ko': '6일', 'zh': '6日', 'en': '6th', 'ja': '6日', 'de': '6.', 'fr': '6', 'pl': '6.'}},
 {'vi': 'ngày mồng bảy', 'kr': {'ko': '7일', 'zh': '7日', 'en': '7th', 'ja': '7日', 'de': '7.', 'fr': '7', 'pl': '7.'}},
 {'vi': 'ngày mồng tám', 'kr': {'ko': '8일', 'zh': '8日', 'en': '8th', 'ja': '8日', 'de': '8.', 'fr': '8', 'pl': '8.'}},
 {'vi': 'ngày mồng chín', 'kr': {'ko': '9일', 'zh': '9日', 'en': '9th', 'ja': '9日', 'de': '9.', 'fr': '9', 'pl': '9.'}},
 {'vi': 'ngày mồng mười',
  'kr': {'ko': '10일', 'zh': '10日', 'en': '10th', 'ja': '10日', 'de': '10.', 'fr': '10', 'pl': '10.'}},
 {'vi': 'ngày mười một',
  'kr': {'ko': '11일', 'zh': '11日', 'en': '11th', 'ja': '11日', 'de': '11.', 'fr': '11', 'pl': '11.'}},
 {'vi': 'ngày mười hai',
  'kr': {'ko': '12일', 'zh': '12日', 'en': '12th', 'ja': '12日', 'de': '12.', 'fr': '12', 'pl': '12.'}},
 {'vi': 'ngày mười ba',
  'kr': {'ko': '13일', 'zh': '13日', 'en': '13th', 'ja': '13日', 'de': '13.', 'fr': '13', 'pl': '13.'}},
 {'vi': 'ngày mười bốn',
  'kr': {'ko': '14일', 'zh': '14日', 'en': '14th', 'ja': '14日', 'de': '14.', 'fr': '14', 'pl': '14.'}},
 {'vi': 'ngày mười lăm',
  'kr': {'ko': '15일', 'zh': '15日', 'en': '15th', 'ja': '15日', 'de': '15.', 'fr': '15', 'pl': '15.'}},
 {'vi': 'ngày mười sáu',
  'kr': {'ko': '16일', 'zh': '16日', 'en': '16th', 'ja': '16日', 'de': '16.', 'fr': '16', 'pl': '16.'}},
 {'vi': 'ngày mười bảy',
  'kr': {'ko': '17일', 'zh': '17日', 'en': '17th', 'ja': '17日', 'de': '17.', 'fr': '17', 'pl': '17.'}},
 {'vi': 'ngày mười tám',
  'kr': {'ko': '18일', 'zh': '18日', 'en': '18th', 'ja': '18日', 'de': '18.', 'fr': '18', 'pl': '18.'}},
 {'vi': 'ngày mười chín',
  'kr': {'ko': '19일', 'zh': '19日', 'en': '19th', 'ja': '19日', 'de': '19.', 'fr': '19', 'pl': '19.'}},
 {'vi': 'ngày hai mươi',
  'kr': {'ko': '20일', 'zh': '20日', 'en': '20th', 'ja': '20日', 'de': '20.', 'fr': '20', 'pl': '20.'}},
 {'vi': 'ngày hai mươi mốt',
  'kr': {'ko': '21일', 'zh': '21日', 'en': '21st', 'ja': '21日', 'de': '21.', 'fr': '21', 'pl': '21.'}},
 {'vi': 'ngày hai mươi hai',
  'kr': {'ko': '22일', 'zh': '22日', 'en': '22nd', 'ja': '22日', 'de': '22.', 'fr': '22', 'pl': '22.'}},
 {'vi': 'ngày hai mươi ba',
  'kr': {'ko': '23일', 'zh': '23日', 'en': '23rd', 'ja': '23日', 'de': '23.', 'fr': '23', 'pl': '23.'}},
 {'vi': 'ngày hai mươi tư',
  'kr': {'ko': '24일', 'zh': '24日', 'en': '24th', 'ja': '24日', 'de': '24.', 'fr': '24', 'pl': '24.'}},
 {'vi': 'ngày hai mươi lăm',
  'kr': {'ko': '25일', 'zh': '25日', 'en': '25th', 'ja': '25日', 'de': '25.', 'fr': '25', 'pl': '25.'}},
 {'vi': 'ngày hai mươi sáu',
  'kr': {'ko': '26일', 'zh': '26日', 'en': '26th', 'ja': '26日', 'de': '26.', 'fr': '26', 'pl': '26.'}},
 {'vi': 'ngày hai mươi bảy',
  'kr': {'ko': '27일', 'zh': '27日', 'en': '27th', 'ja': '27日', 'de': '27.', 'fr': '27', 'pl': '27.'}},
 {'vi': 'ngày hai mươi tám',
  'kr': {'ko': '28일', 'zh': '28日', 'en': '28th', 'ja': '28日', 'de': '28.', 'fr': '28', 'pl': '28.'}},
 {'vi': 'ngày hai mươi chín',
  'kr': {'ko': '29일', 'zh': '29日', 'en': '29th', 'ja': '29日', 'de': '29.', 'fr': '29', 'pl': '29.'}},
 {'vi': 'ngày ba mươi',
  'kr': {'ko': '30일', 'zh': '30日', 'en': '30th', 'ja': '30日', 'de': '30.', 'fr': '30', 'pl': '30.'}},
 {'vi': 'ngày ba mươi mốt',
  'kr': {'ko': '31일', 'zh': '31日', 'en': '31st', 'ja': '31日', 'de': '31.', 'fr': '31', 'pl': '31.'}}]

DATE_ORDER_NOTE = {'ko': '베트남어는 날짜를 말할 때 요일, 날짜, 달, 연도 순서로 말해요 (예: Thứ Năm, ngày 15, tháng 3, năm 2024 — 목요일, 15일, 3월, 2024년). 이는 연도, 달, '
       '날짜, 요일 순서로 말하는 한국어·중국어·일본어와 정반대의 순서예요.',
 'zh': '越南語說日期時，是按照星期、日期、月份、年份的順序（例如：Thứ Năm, ngày 15, tháng 3, năm '
       '2024——星期四、15日、3月、2024年）。這正好與韓文、中文、日文按照年、月、日、星期順序來說的方式相反。',
 'en': 'When Vietnamese states a date, it goes day of the week → date → month → year (e.g., Thứ Năm, ngày 15, tháng 3, '
       'năm 2024 — Thursday, the 15th, March, 2024). This is the exact reverse of the year → month → date → '
       'day-of-week order used in Korean, Chinese, and Japanese.',
 'ja': 'ベトナム語で日付を言うときは、曜日→日にち→月→年の順に言います(例:Thứ Năm, ngày 15, tháng 3, năm 2024 —— '
       '木曜日、15日、3월、2024年)。これは韓国語・中国語・日本語で年→月→日→曜日の順に言うのとちょうど反対の順序です。',
 'de': 'Im Vietnamesischen nennt man bei einem Datum Wochentag, Tag, Monat und Jahr in dieser Reihenfolge (z. B. Thứ '
       'Năm, ngày 15, tháng 3, năm 2024 – Donnerstag, 15. März 2024). Dies entspricht der im Deutschen üblichen '
       'Reihenfolge, ist jedoch genau umgekehrt zur Reihenfolge Jahr → Monat → Tag → Wochentag im Koreanischen, '
       'Chinesischen und Japanischen.',
 'fr': "En vietnamien, la date s'exprime dans l'ordre suivant : jour de la semaine, jour du mois, mois et année (ex. : "
       "Thứ Năm, ngày 15, tháng 3, năm 2024 – jeudi 15 mars 2024). Cet ordre correspond à l'usage français, mais est "
       "exactement l'inverse de l'ordre année → mois → jour → jour de la semaine utilisé en coréen, chinois et "
       'japonais.',
 'pl': 'W języku wietnamskim przy podawaniu daty stosuje się kolejność: dzień tygodnia, dzień miesiąca, miesiąc i rok '
       '(np. Thứ Năm, ngày 15, tháng 3, năm 2024 – czwartek, 15 marca 2024 r.). Odpowiada to kolejności używanej w '
       'języku polskim, ale jest dokładnie odwrotne do kolejności rok → miesiąc → dzień → dzień tygodnia stosowanej w '
       'językach koreańskim, chińskim i japońskim.'}

DATE_MONG_NOTE = {'ko': '1일부터 10일까지는 ngày와 숫자 사이에 mồng이라는 단어를 넣어서 읽어요 (예: ngày mồng một 1일, ngày mồng năm 5일, ngày mồng mười 10일). 이는 '
       '한국어·중국어·일본어에서 1일부터 10일까지만 초하루, 초이틀, 초사흘, …, 초열흘처럼 "초"를 붙여 부르는 것과 같은 원리예요. 11일부터는 mồng 없이 그냥 ngày + 숫자로 읽어요 (예: '
       'ngày mười một 11일).',
 'zh': '1日到10日之間，會在ngày和數字之間加入mồng這個字來唸（例如：ngày mồng một 1日、ngày mồng năm 5日、ngày mồng mười '
       '10日）。這和韓文、中文、日文中只有1日到10日才會加上「初」字，唸成初一、初二、初三……初十的道理是一樣的。從11日開始，就不加mồng，直接用ngày+數字來唸（例如：ngày mười một 11日）。',
 'en': 'For the 1st through the 10th, the word mồng is inserted between ngày and the number (e.g., ngày mồng một for '
       'the 1st, ngày mồng năm for the 5th, ngày mồng mười for the 10th). This works the same way as how Korean, '
       'Chinese, and Japanese only add "초" to dates from the 1st through the 10th — 초하루, 초이틀, 초사흘, …, 초열흘. From the '
       "11th onward, mồng is dropped and it's simply ngày + the number (e.g., ngày mười một for the 11th).",
 'ja': '1日から10日までは、ngàyと数字の間にmồngという言葉を入れて読みます（例:ngày mồng một 1日、ngày mồng năm 5日、ngày mồng mười '
       '10日）。これは韓国語・中国語・日本語で1日から10日までだけに「初」を付けて、ついたち、ふつか、みっか、…、とおかのように呼ぶのと同じ原理です。11日からはmồngなしで、そのままngày+数字で読みます（例:ngày '
       'mười một 11日）。',
 'de': 'Vom 1. bis zum 10. Tag wird das Wort „mồng“ zwischen „ngày“ und die Zahl eingefügt (z. B. ngày mồng một für '
       'den 1., ngày mồng năm für den 5., ngày mồng mười für den 10.). Ab dem 11. Tag entfällt „mồng“ und man sagt '
       'einfach ngày + Zahl (z. B. ngày mười một für den 11.).',
 'fr': "Du 1er au 10 du mois, le mot « mồng » s'insère entre « ngày » et le nombre (ex. : ngày mồng một pour le 1er, "
       'ngày mồng năm pour le 5, ngày mồng mười pour le 10). Cela rappelle les appellations traditionnelles des dix '
       "premiers jours dans certaines langues d'Asie. À partir du 11, « mồng » disparaît et l'on dit simplement ngày + "
       'nombre (ex. : ngày mười một pour le 11).',
 'pl': 'Od 1. do 10. dnia miesiąca między słowem „ngày” a liczbą wstawia się słowo „mồng” (np. ngày mồng một – 1., '
       'ngày mồng năm – 5., ngày mồng mười – 10.). Przypomina to tradycyjne określenia pierwszych dni miesiąca w '
       'niektórych językach azjatyckich. Od 11. dnia słowo „mồng” znika i mówi się po prostu ngày + liczba (np. ngày '
       'mười một – 11.).'}

YEAR_LE_NOTE = {'ko': '연도(년)를 읽을 때, 백의 자리가 0이면 그 자리를 생략하지 않고 không trăm(영 백)이라고 그대로 읽어요. 반면 십의 자리가 0이면(그리고 일의 자리가 0이 아니면) lẻ(=0을 나타내는 '
       '말, 북부에서는 linh)라는 말을 마지막 숫자 앞에 넣어서 읽어요. 예를 들어 1990년은 백의 자리(9)도 십의 자리(9)도 0이 아니므로 một nghìn chín trăm chín '
       'mươi라고 읽지만, 1905년은 십의 자리가 0이라서 một nghìn chín trăm lẻ năm(1천9백 lẻ 5)이라고 읽고, 2008년은 백의 자리와 십의 자리가 모두 0이라서 không '
       'trăm과 lẻ를 함께 써서 hai nghìn không trăm lẻ tám(2천 0백 lẻ 8)이라고 읽어요.',
 'zh': '唸年份時，如果百位是0，不會省略，而是照樣唸成không '
       'trăm（零百）。相反地，如果十位是0（且個位不是0），就要在最後一個數字前加上表示0的字lẻ（北部用linh）。舉例來說，1990年百位（9）和十位（9）都不是0，所以唸成một nghìn chín trăm '
       'chín mươi；1905年因為十位是0，所以唸成một nghìn chín trăm lẻ năm（1千9百 lẻ 5）；2008年因為百位和十位都是0，所以要同時使用không trăm和lẻ，唸成hai '
       'nghìn không trăm lẻ tám（2千0百 lẻ 8）。',
 'en': "When reading a year, if the hundreds digit is 0, it isn't dropped — it's read out as không trăm (zero "
       'hundred). If the tens digit is 0 (and the units digit isn\'t), the word lẻ (meaning "zero" in this position; '
       'linh in the North) is inserted right before the last digit. For example, 1990 has neither the hundreds digit '
       "(9) nor the tens digit (9) as zero, so it's read một nghìn chín trăm chín mươi. But 1905 has a zero tens "
       "digit, so it's read một nghìn chín trăm lẻ năm (1900 + lẻ + 5). And 2008 has both the hundreds and tens digits "
       'as zero, so both không trăm and lẻ are used together: hai nghìn không trăm lẻ tám (2000 + 0 hundred + lẻ + 8).',
 'ja': '年を読むとき、百の位が0であれば省略せず、không '
       'trăm（ゼロ百）とそのまま読みます。一方、十の位が0で（一の位が0でない）場合は、最後の数字の前に0を表す言葉lẻ（北部ではlinh）を入れて読みます。例えば1990年は百の位（9）も十の位（9）も0ではないのでmột '
       'nghìn chín trăm chín mươiと読みますが、1905年は十の位が0なのでmột nghìn chín trăm lẻ năm（1900+lẻ+5）と読み、2008年は百の位も十の位も0なのでkhông '
       'trămとlẻを両方使ってhai nghìn không trăm lẻ tám（2000+0百+lẻ+8）と読みます。',
 'de': 'Beim Lesen einer Jahreszahl wird eine 0 an der Hunderterstelle nicht weggelassen, sondern als „không trăm“ '
       '(null Hundert) ausgesprochen. Ist die Zehnerstelle eine 0 (und die Einerstelle nicht), wird das Wort „lẻ“ (im '
       'Norden „linh“) unmittelbar vor die letzte Ziffer gesetzt. Beispielsweise ist bei 1990 weder die Hunderter- (9) '
       'noch die Zehnerstelle (9) eine Null, also liest man „một nghìn chín trăm chín mươi“. Bei 1905 ist jedoch die '
       'Zehnerstelle 0, daher liest man „một nghìn chín trăm lẻ năm“ (1900 + lẻ + 5). Und bei 2008 sind sowohl '
       'Hunderter- als auch Zehnerstelle 0, sodass beide Wörter verwendet werden: „hai nghìn không trăm lẻ tám“ (2000 '
       '+ 0 Hundert + lẻ + 8).',
 'fr': "Pour lire une année, si le chiffre des centaines est 0, on ne l'omet pas : on le lit « không trăm » (zéro "
       "cent). Si le chiffre des dizaines est 0 (et que celui des unités ne l'est pas), on insère le mot « lẻ » (au "
       'nord « linh ») juste avant le dernier chiffre. Par exemple, dans 1990, ni les centaines (9) ni les dizaines '
       '(9) ne sont nulles, donc on lit « một nghìn chín trăm chín mươi ». Mais dans 1905, les dizaines sont 0, donc '
       'on lit « một nghìn chín trăm lẻ năm » (1900 + lẻ + 5). Et dans 2008, les centaines et les dizaines sont toutes '
       'deux 0, on utilise donc les deux : « hai nghìn không trăm lẻ tám » (2000 + 0 cent + lẻ + 8).',
 'pl': 'Podczas czytania roku, jeśli cyfra setek to 0, nie pomija się jej, lecz czyta jako „không trăm” (zero setek). '
       'Jeśli cyfra dziesiątek to 0 (a cyfra jedności nie jest zerem), bezpośrednio przed ostatnią cyfrą wstawia się '
       'słowo „lẻ” (na północy „linh”). Na przykład w roku 1990 ani setki (9), ani dziesiątki (9) nie są zerem, więc '
       'czyta się „một nghìn chín trăm chín mươi”. Jednak w 1905 roku dziesiątki to 0, więc czyta się „một nghìn chín '
       'trăm lẻ năm” (1900 + lẻ + 5). W roku 2008 zarówno setki, jak i dziesiątki to 0, więc używa się obu form: „hai '
       'nghìn không trăm lẻ tám” (2000 + 0 setek + lẻ + 8).'}
