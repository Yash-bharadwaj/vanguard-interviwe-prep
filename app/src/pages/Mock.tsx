import { useEffect, useMemo, useState } from "react";
import { BANK, KITS, SECTION_FILTER, byN } from "@/data/bank";
import { BEHAVIORAL } from "@/data/spoken";
import { IV_QUESTIONS } from "@/data/interviewer";
import { SYSTEM_DESIGNS } from "@/data/sysdesign";
import { JAVA, SPRING } from "@/data/study";
import { Badge, Button, Card, H, Label, Textarea } from "@/components/ui/primitives";
import { grade, type Feedback } from "@/lib/grade";
import { useProgress } from "@/store/progress";

interface MQ { id: string; q: string; key: string[]; ideal: string; follow: string; note?: string }
const fromN = (n: number): MQ | null => {
  const q = byN.get(n); if (!q) return null; const k = KITS[n];
  return { id: q.id, q: q.q, key: k?.key ?? q.tags.filter((t) => t !== "trivia"), ideal: k ? k.s120 : q.a, follow: k?.follows[0]?.q ?? q.fu[0]?.q ?? "What would you change?", note: k?.verify ? `Verify: ${k.verify}` : undefined };
};
const kw = (t: string) => t.split(/[^A-Za-z]+/).filter((w) => w.length > 3);
const FULL = [1, 2, 72, 185, 206, 98, 124, 96, 108, 12, 10, 22, 91, 66, 48, 55, 59];
const SETS: Record<string, { label: string; build: () => MQ[]; ordered?: boolean }> = {
  full: { label: "Full 45-minute interview", ordered: true, build: () => [...FULL.map(fromN).filter(Boolean) as MQ[], ...["weakness", "conflict"].map((id) => BEHAVIORAL.find((b) => b.id === id)!).map((b) => ({ id: "b-" + b.id, q: b.q, key: ["example", "learn", "result"], ideal: b.say, follow: "What did you learn from it?" }))] },
  technical: { label: "Technical", build: () => BANK.filter((q) => KITS[q.n] && q.cat !== "behavioral").map((q) => fromN(q.n)!) },
  java: { label: "Java / Spring", build: () => [...JAVA, ...SPRING].map((c, i) => ({ id: "j" + i, q: `Explain: ${c.t}`, key: kw(c.t), ideal: c.say, follow: c.fu ?? "Can you show a small example?" })) },
  react: { label: "React / TypeScript", build: () => [6, 7].map((n) => fromN(n)!) },
  aws: { label: "AWS", build: () => [11, 22, 23, 47, 48, 91, 108, 122].map((n) => fromN(n)!) },
  gql: { label: "GraphQL / API", build: () => [8, 12, 43, 98, 130].map((n) => fromN(n)!) },
  design: { label: "System design", build: () => SYSTEM_DESIGNS.map((s) => ({ id: "sd-" + s.id, q: `Design: ${s.title}`, key: ["requirements", "scale", "API", "data model", "cache", "queue", "partition", "consistency", "failure", "monitor", "security", "trade-off"], ideal: Object.entries(s.f).map(([k, v]) => `${k}: ${v}`).join("\n"), follow: "What breaks first at 10× load?" })) },
  behavioral: { label: "Behavioral", build: () => BEHAVIORAL.map((b) => ({ id: "b-" + b.id, q: b.q, key: ["example", "learn", "result"], ideal: b.say, follow: "What would you do differently?", note: b.note })) },
  project: { label: "Project deep dive", build: () => [73, 98, 124, 130, 185, 96, 108, 205].map((n) => fromN(n)!) },
  interviewer: { label: "Interviewer-specific (inferred)", build: () => IV_QUESTIONS.map((s, i) => ({ id: "iv" + i, q: s.q, key: kw(s.connect).slice(0, 5), ideal: `${s.connect}${s.honest ? " — " + s.honest : ""}`, follow: "Why that choice? What are the trade-offs?" })) },
};
const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

export default function Mock() {
  const [mode, setMode] = useState<string | null>(null); const [qs, setQs] = useState<MQ[]>([]); const [i, setI] = useState(0);
  const [ans, setAns] = useState(""); const [fb, setFb] = useState<Feedback | null>(null); const [start, setStart] = useState(0); const [now, setNow] = useState(0);
  const addMock = useProgress((s) => s.addMock); const history = useProgress((s) => s.mock);
  useEffect(() => { if (mode !== "full") return; const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, [mode]);
  const begin = (m: string) => { const s = SETS[m]; const list = s.build().filter(Boolean); setQs(s.ordered ? list : shuffle(list)); setMode(m); setI(0); setAns(""); setFb(null); setStart(Date.now()); setNow(Date.now()); };
  const cur = qs[i];
  const el = Math.max(0, Math.floor((now - start) / 1000)); const mm = String(Math.floor(el / 60)).padStart(2, "0"); const ss = String(el % 60).padStart(2, "0");
  const avg = useMemo(() => (history.length ? Math.round(history.slice(0, 20).reduce((a, r) => a + r.score, 0) / Math.min(20, history.length)) : null), [history]);
  if (!mode) return (
    <div className="space-y-4">
      <H sub="One question at a time. Answer out loud first, then type it as you'd say it. Feedback is rule-based (key points, why, trade-offs, ownership) — not an AI judge — and you always see the ideal answer.">Mock interview</H>
      {avg !== null && <Badge>Average of your last {Math.min(20, history.length)} answers: {avg}/100</Badge>}
      <div className="grid gap-2 sm:grid-cols-2">{Object.entries(SETS).map(([k, s]) => <button key={k} onClick={() => begin(k)} className="cursor-pointer rounded-lg border border-line bg-card p-4 text-left hover:bg-soft"><div className="font-medium">{s.label}</div><div className="text-xs text-muted">{s.build().length} questions{s.ordered ? " · in interview order · timer" : " · shuffled"}</div></button>)}</div>
    </div>
  );
  if (!cur) return <div className="space-y-3"><H>Finished</H><Button onClick={() => setMode(null)}>Back to modes</Button></div>;
  const submit = () => { const f = grade(ans, cur.key); setFb(f); addMock({ at: Date.now(), id: cur.id, q: cur.q, answer: ans, score: f.score }); };
  const next = () => { setI(i + 1); setAns(""); setFb(null); };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><Badge>{SETS[mode].label} · {i + 1}/{qs.length}</Badge>{mode === "full" && <Badge tone={el > 2700 ? "hi" : "neutral"}>⏱ {mm}:{ss} / 45:00</Badge>}<Button size="sm" variant="ghost" onClick={() => setMode(null)}>End</Button></div>
      <Card className="p-4"><Label>Avinash asks</Label><p className="text-lg font-medium leading-snug">{cur.q}</p>{cur.note && <p className="mt-1 text-xs text-warn">{cur.note}</p>}</Card>
      <Textarea rows={8} value={ans} onChange={(e) => setAns(e.target.value)} placeholder="Answer as you would speak it. Headline → why → proof → boundary." disabled={!!fb} />
      {!fb ? <div className="flex gap-2"><Button onClick={submit} disabled={ans.trim().length < 10}>Submit answer</Button><Button variant="outline" onClick={next}>Skip</Button></div> : (
        <div className="space-y-3">
          <Card className="space-y-1 p-4 text-sm"><div className="font-medium">Score {fb.score}/100 · {fb.accuracy} · {fb.words} words · {fb.length}</div>
            <Label tone="ok">What was good</Label>{fb.good.length ? fb.good.map((g, k) => <div key={k}>✓ {g}</div>) : <div className="text-muted">Nothing detected yet.</div>}
            <Label tone="warn">What was missing</Label>{fb.missing.length ? fb.missing.map((g, k) => <div key={k}>• {g}</div>) : <div className="text-muted">Nothing obvious.</div>}
            <Label>Did you explain WHY? · trade-offs? · ownership?</Label><div>{fb.why ? "✓ WHY" : "✗ WHY"} · {fb.tradeoffs ? "✓ trade-offs" : "✗ trade-offs"} · {fb.ownership}</div></Card>
          <Card className="p-4 text-sm"><Label>Follow-up he might ask</Label><p className="font-medium">{cur.follow}</p></Card>
          <Card className="p-4 text-sm"><Label tone="ok">Ideal answer</Label><p className="whitespace-pre-line leading-relaxed">{cur.ideal}</p></Card>
          <Button onClick={next}>Next question</Button>
        </div>)}
    </div>
  );
}
export const _s = SECTION_FILTER;
