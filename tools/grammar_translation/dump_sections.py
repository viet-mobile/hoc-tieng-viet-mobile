import sys, os, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gram_sections import all_sections

a, b = int(sys.argv[1]), int(sys.argv[2])
secs = all_sections()
for i, (key, sec) in enumerate(secs[a:b], a):
    print("##", i, key, "| TITLE:", sec["title"])
    for l in sec["lines"]:
        s = re.sub(r"\s{3,}", "   ", l.strip())
        if s:
            print("  " + s)
