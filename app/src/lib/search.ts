import MiniSearch from "minisearch";
import { BANK } from "@/data/bank";
import { JD } from "@/data/jd";
import { IV_SKILLS, IV_QUESTIONS, FOCUS } from "@/data/interviewer";
import { WHY, COMPARE } from "@/data/why";
import { ANCHORS } from "@/data/anchors";
import { SYSTEM_DESIGNS } from "@/data/sysdesign";
import { CONFLICTS } from "@/data/conflicts";
import { BEHAVIORAL } from "@/data/spoken";
import { AWS, JAVA, SPRING, FRONTEND, DB, API, DEVOPS } from "@/data/study";

export interface Doc { id: string; kind: string; title: string; body: string; route: string; qn?: number }
const docs: Doc[] = [];
BANK.forEach((q) => {
  docs.push({ id: q.id, kind: "Question", title: `Q${q.n}: ${q.q}`, body: `${q.a} ${q.tags.join(" ")} ${q.cat}`, route: "bank", qn: q.n });
  q.fu.forEach((f) => docs.push({ id: f.id, kind: "Follow-up", title: `Q${q.n}.${f.n}: ${f.q}`, body: `${f.a} ${f.tags.join(" ")}`, route: "bank", qn: q.n }));
});
JD.forEach((j) => docs.push({ id: "jd-" + j.id, kind: "Vanguard requirement", title: j.req, body: `${j.evidence} ${j.answer}`, route: "jd" }));
IV_SKILLS.forEach((s, i) => docs.push({ id: "ivs" + i, kind: "Interviewer skill", title: s.skill + " (Avinash)", body: `${s.evidence} ${s.mine} ${s.jd}`, route: "interviewer" }));
IV_QUESTIONS.forEach((s, i) => docs.push({ id: "ivq" + i, kind: "Interviewer-profile question", title: s.q, body: `${s.area} ${s.connect}`, route: "interviewer" }));
FOCUS.forEach((f, i) => docs.push({ id: "foc" + i, kind: "Interviewer focus", title: f.area, body: f.why + " " + f.prep.join(" "), route: "interviewer" }));
WHY.forEach((w) => docs.push({ id: "why-" + w.id, kind: "Why", title: w.q, body: `${w.because} ${w.tradeoff} ${w.redesign}`, route: "why" }));
COMPARE.forEach((w) => docs.push({ id: "cmp-" + w.id, kind: "Why not", title: w.title, body: `${w.when} ${w.ours} ${w.tradeoffs} ${w.challenge}`, route: "why" }));
ANCHORS.forEach((a) => docs.push({ id: "anc-" + a.id, kind: "Anchor project", title: a.name, body: `${a.situation} ${a.problem} ${a.decisions} ${a.implementation}`, route: "anchors" }));
SYSTEM_DESIGNS.forEach((s) => docs.push({ id: "sd-" + s.id, kind: "System design", title: s.title, body: Object.values(s.f).join(" "), route: "design" }));
CONFLICTS.forEach((c) => docs.push({ id: "cf-" + c.id, kind: "Source conflict", title: c.title, body: `${c.a} ${c.b} ${c.say}`, route: "verify" }));
BEHAVIORAL.forEach((b) => docs.push({ id: "beh-" + b.id, kind: "Behavioral", title: b.q, body: b.say, route: "behavioral" }));
AWS.forEach((s) => docs.push({ id: "svc-" + s.name, kind: "AWS", title: s.name, body: Object.values(s).join(" "), route: "aws" }));
([["java", JAVA], ["spring", SPRING], ["react", FRONTEND], ["database", DB], ["rest", API], ["cicd", DEVOPS]] as const).forEach(([r, list]) => list.forEach((c, i) => docs.push({ id: `${r}-${i}`, kind: "Concept", title: c.t, body: c.say, route: r })));

export const ms = new MiniSearch<Doc>({ fields: ["title", "body"], storeFields: ["kind", "title", "route", "qn", "body"], searchOptions: { prefix: true, fuzzy: 0.15, boost: { title: 3 } } });
ms.addAll(docs);
export const search = (q: string, limit = 40) => (q.trim().length < 2 ? [] : ms.search(q.trim()).slice(0, limit));
export const DOC_COUNT = docs.length;
