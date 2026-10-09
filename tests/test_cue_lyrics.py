"""The Vietnamese lyric lines that the official JW video subtitle (VT WebVTT) sings differently from the book text
(scripts/apply_cue_lyrics.py): each is exactly the official words, the line structure of the song did not move, nothing else of
a song changed. EXPECTED = {song: {index of the line in vi.lines: [the line before, the line now]}}."""
import json, sys
EXPECTED = {
 "osg-96": {
  "38": [
   "Sống giản đơn mỗi ngày.",
   "Sống giản đơn mỗi ngày, sống giản đơn mỗi ngày."
  ]
 },
 "osg-98": {
  "7": [
   "2.Hằng ngày gắng tử tế, ôn hòa với tất cả, dẫu nơi công ty hay trường lớp,",
   "2.Hàng ngày gắng tử tế, ôn hòa với tất cả, dẫu nơi công ty hay trường lớp,"
  ]
 },
 "osg-99": {
  "34": [
   "Chẳng phải bởi sức riêng của tôi.",
   "Chẳng phải bằng sức riêng của tôi."
  ]
 },
 "osg-110": {
  "23": [
   "nỗi niềm ấy chắng gánh riêng ta, vì ngài từng hứa ngài gánh thay.",
   "nỗi niềm ấy chẳng gánh riêng ta, vì ngài từng hứa ngài gánh thay."
  ]
 },
 "osg-113": {
  "47": [
   "Lòng muốn noi theo đường ấy.",
   "Lòng muốn noi theo đường ngài."
  ]
 },
 "pk-special-0": {
  "3": [
   "dành thời gian cảm ơn Chúa đã ban hôm nay.",
   "dành thời gian cảm ơn Chúa đã cho hôm nay."
  ]
 },
 "pkon-14": {
  "7": [
   "Xây đắp đức tin đông đầy nơi Cha chẳng lay.",
   "Xây đắp đức tin đong đầy nơi Cha chẳng lay."
  ],
  "10": [
   "Cả nhà cùng tôn cinh Cha, ngày càng thêm hợp nhất.",
   "Cả nhà cùng tôn vinh Cha, ngày càng thêm hợp nhất."
  ]
 },
 "pkon-17": {
  "2": [
   "vì thế cố gắng hết sức em vâng lời và khính trọng.",
   "vì thế cố gắng hết sức em vâng lời và kính trọng."
  ],
  "9": [
   "Cháu sẽ thành tín cùng em.",
   "Chúa sẽ thành tín cùng em."
  ]
 },
 "pkon-18": {
  "15": [
   "Làm theo những điều răn Ngài, Cháu xem em là bạn.",
   "Làm theo những điều răn Ngài, Chúa xem em là bạn."
  ]
 },
 "pkon-20": {
  "1": [
   "Khi đến với người khác ta biết rằng đó là tình thương chân thành",
   "Khi mềm mại với người khác, ta biết rằng đó là tình thương chân thành."
  ],
  "7": [
   "Mến thương thiết thân, xót người xa gần, ấy là bí quyết trong đời",
   "Mến thương thiết thực, giúp người xa gần, ấy là bí quyết trong đời."
  ]
 },
 "pkon-27": {
  "14": [
   "Như Ti-mô-thê em đây, điều em muốn,",
   "Như Ti-mô-thê, em đầy điều em muốn."
  ],
  "16": [
   "Em phải làm gì với món quà tuyệt thế? Em sẽ lắng nghe thật cẩn thận.",
   "Em phải làm gì với món quà tuyệt thế? Em sẽ lắng nghe cách cẩn thận."
  ]
 },
 "pkon-35": {
  "2": [
   "Giê-hô-va đang có thật, liệu con có hoài nghi?",
   "Giê-hô-va Đấng có thật! Liệu con có hoài nghi?"
  ],
  "4": [
   "Ngài khuyên dạy như người thợ gốm và uốn con theo đường ngài.",
   "Ngài khuyên dạy như người thợ gốm và uốn con theo đường ngay."
  ],
  "10": [
   "Giê-hô-va đây, dù rằng con không thấy,",
   "Giê-hô-va ở đấy! Dù rằng con không thấy,"
  ],
  "18": [
   "Đôi khi cô đơn mê lối, con thấy bối rối ưu phiền.",
   "Đôi khi cô đơn, lẻ loi. Con thấy bối rối, ưu phiền."
  ],
  "21": [
   "Giê-hô-va đây, dù rằng con không thấy,",
   "Giê-hô-va ở đấy! Dù rằng con không thấy,"
  ]
 }
}
COUNTS = {"osg-96": 46, "osg-98": 29, "osg-99": 35, "osg-110": 45, "osg-113": 49, "pk-special-0": 12, "pkon-14": 16, "pkon-17": 22, "pkon-18": 16, "pkon-20": 13, "pkon-27": 19, "pkon-35": 26}
PATHS = ("jw_original_songs_ko_vi.json", "jw_childrens_songs_ko_vi.json")
songs = {}
for p in PATHS:
    for s in json.load(open(p, encoding="utf-8"))["songs"]: songs[s["id"]] = s
checks = 0; bad = []
def ok(c, m):
    global checks; checks += 1
    if not c: bad.append(m)
n = 0
for k, lines in EXPECTED.items():
    vi = songs[k]["vi"]
    ok(len(vi["lines"]) == COUNTS[k], "%s: the number of lyric lines changed (%d)" % (k, len(vi["lines"])))
    ok(vi["lyrics"] == "\n".join(vi["lines"]), "%s: lyrics != lines" % k)
    ok(("displayLines" not in vi) or vi["displayLines"] == vi["lines"], "%s: displayLines != lines" % k)
    for i, (before, now) in lines.items():
        n += 1
        ok(vi["lines"][int(i)] == now, "%s line %s: %r (want the official %r)" % (k, i, vi["lines"][int(i)], now))
        ok(before not in vi["lines"][int(i):int(i) + 1], "%s line %s still the book text" % (k, i))
ok(n == 20, "20 lines expected, %d" % n)
# pkon-35: the five lines the user listed, exactly
five = {2: "Giê-hô-va Đấng có thật! Liệu con có hoài nghi?", 4: "Ngài khuyên dạy như người thợ gốm và uốn con theo đường ngay.", 8: "Giê-hô-va ở đấy! Dù rằng con không thấy,", 15: "Đôi khi cô đơn, lẻ loi. Con thấy bối rối, ưu phiền.", 17: "Giê-hô-va ở đấy! Dù rằng con không thấy,"}
sing = [l for l in songs["pkon-35"]["vi"]["lines"] if not l.startswith("(")]
for i, t in five.items(): ok(sing[i] == t, "pkon-35 sung line %d: %r" % (i + 1, sing[i]))
print("checks run: %d" % checks)
if bad:
    [print("  [FAIL]", b) for b in bad]; print("--- CUE LYRICS TEST FAILED ---"); sys.exit(1)
print("--- CUE LYRICS TEST PASSED ---")
