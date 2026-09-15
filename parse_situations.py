import re, sys, json

def parse(path):
    with open(path, encoding="utf-8") as f:
        content = f.read()
    slides = content.split("===== SLIDE")[1:]
    situations = {}  # sit_num -> stage_name -> list of dict
    cur_sit = None
    cur_stage = None
    for s in slides:
        lines = [l for l in s.split("\n") if l.strip() != ""]
        if not lines:
            continue
        # first line is like " 5 =====" -> skip
        body = lines[1:]
        if not body:
            continue
        header = body[0]
        m = re.match(r"상황 (\d+) · (\d+)\. ([^\n]+)", header)
        if not m:
            continue
        sit_num = int(m.group(1))
        stage_num = int(m.group(2))
        stage_name = m.group(3).strip()
        # strip trailing " · substep" if present in stage_name after ' · '
        if " · " in stage_name:
            stage_name = stage_name.split(" · ")[0].strip()
        cur_sit = sit_num
        cur_stage = (stage_num, stage_name)
        # find the "나:" line
        speaker_line = next((l for l in body if l.startswith("나:")), None)
        # find fraction line n / m
        frac_idx = None
        for i,l in enumerate(body):
            if re.match(r"^\d+\s*/\s*\d+$", l.strip()):
                frac_idx = i
                frac = l.strip()
                break
        if frac_idx is None:
            continue
        n, m2 = [int(x) for x in re.split(r"\s*/\s*", frac)]
        if n != m2:
            continue  # not final in sequence
        # the vietnamese sentence is the line right before the gloss line, gloss line is right before fraction
        # structure: ... [viet_line] [gloss_line] [fraction_line] [translation?] [reply?]
        viet_line = body[frac_idx-2] if frac_idx-2 >= 0 else None
        gloss_line = body[frac_idx-1] if frac_idx-1 >= 0 else None
        rest = body[frac_idx+1:]
        translation = rest[0] if len(rest) > 0 else None
        reply = rest[1] if len(rest) > 1 else None
        situations.setdefault(cur_sit, {}).setdefault(cur_stage, []).append({
            "viet": viet_line,
            "gloss": gloss_line,
            "translation": translation,
            "reply": reply,
            "speaker": speaker_line,
        })
    return situations

if __name__ == "__main__":
    path = sys.argv[1]
    out = parse(path)
    # convert stage tuple keys to string
    out2 = {}
    for sit, stages in out.items():
        out2[sit] = {}
        for (snum, sname), items in stages.items():
            out2[sit][f"{snum}. {sname}"] = items
    print(json.dumps(out2, ensure_ascii=False, indent=1))
