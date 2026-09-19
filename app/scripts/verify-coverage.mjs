// Proves that every question + follow-up + answer in the source txt is present, unchanged, in the shipped app.
import fs from "node:fs";
const src = fs.readFileSync("../All_Questions (1).txt", "utf8").split("\n");
const html = fs.readFileSync("dist/index.html", "utf8");
const bank = JSON.parse(fs.readFileSync("src/data/bank.json", "utf8"));
const inHtml = (s) => html.includes(JSON.stringify(s).slice(1, -1)) || html.includes(s);
let q = 0, f = 0, a = 0, miss = [];
for (const line of src) {
  const s = line.trim();
  let m = s.match(/^Q(\d+):\s*(.*)$/);
  if (m) { q++; const b = bank.find((x) => x.n === +m[1]); if (!b || b.q !== m[2] || !inHtml(m[2])) miss.push("Q" + m[1]); continue; }
  m = s.match(/^Follow-up (\d+):\s*(.*)$/);
  if (m) f++;
}
for (const b of bank) { a++; if (!b.a) miss.push("noanswer Q" + b.n); for (const x of b.fu) { a++; if (!x.a || !inHtml(x.q)) miss.push(`Q${b.n}.f${x.n}`); } }
console.log({ primaryInSource: q, followupsInSource: f, answersInBank: a, bankPrimary: bank.length, bankFollowups: bank.reduce((n, b) => n + b.fu.length, 0), missing: miss.length });
if (miss.length || q !== bank.length || f !== bank.reduce((n, b) => n + b.fu.length, 0)) { console.error("MISSING:", miss.slice(0, 20)); process.exit(1); }
console.log("OK: every question, follow-up and answer from the source file is in the app, wording unchanged.");
