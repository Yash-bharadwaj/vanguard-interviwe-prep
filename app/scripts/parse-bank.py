"""Parse All_Questions (1).txt into JSON without altering any question/answer wording."""
import re, json, sys, pathlib
src = pathlib.Path(sys.argv[1]); dst = pathlib.Path(sys.argv[2])
lines = src.read_text(encoding="utf-8").split("\n")
items, cur, target, buf = [], None, None, []
def flush():
    global buf, target
    if target is not None:
        target["a"] = " ".join(x.strip() for x in buf).strip()
    buf = []
for l in lines:
    s = l.strip()
    m = re.match(r'^Q(\d+):\s*(.*)', s)
    f = re.match(r'^Follow-up (\d+):\s*(.*)', s)
    if m:
        flush(); cur = {"n": int(m.group(1)), "q": m.group(2), "a": "", "fu": []}; items.append(cur); target = cur; continue
    if f:
        flush(); fu = {"n": int(f.group(1)), "q": f.group(2), "a": ""}; cur["fu"].append(fu); target = fu; continue
    if re.match(r'^=+$', s): flush(); target = None; continue
    if s.startswith("Answer:"): buf.append(s[len("Answer:"):].strip()); continue
    if s and target is not None: buf.append(s)
flush()
dst.write_text(json.dumps(items, ensure_ascii=False, indent=0), encoding="utf-8")
print(len(items), sum(len(i["fu"]) for i in items), sum(1 for i in items if not i["a"]), sum(1 for i in items for f in i["fu"] if not f["a"]))
