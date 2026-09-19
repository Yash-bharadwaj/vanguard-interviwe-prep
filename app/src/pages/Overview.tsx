import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { BANK, STAGES, priorityOf } from "@/data/bank";
import { INTERVIEW, SUMMARY } from "@/data/profile";
import { Card, H, Label, ProgressBar, Bullets, Button, Badge } from "@/components/ui/primitives";
import { AREAS, useAreaPct } from "@/lib/progress";
import { DOC_COUNT } from "@/lib/search";
import { CONFLICTS } from "@/data/conflicts";
import { useProgress } from "@/store/progress";

export const PATH: { step: string; title: string; to: string; why: string }[] = [
  { step: "0", title: "Verify the source conflicts", to: "verify", why: "Resolve Uber, Rule Builder backend, auth story, and metrics first — everything else depends on them." },
  { step: "1", title: "Playbook: how to lead the conversation", to: "playbook", why: "Answer structure, control phrases, first minute, closing." },
  { step: "2", title: "Know the room: profile · interviewer · JD", to: "profile", why: "Where you're strong, where he'll probe, what the JD needs." },
  { step: "3", title: "Intro & resume (0–10 min)", to: "bank:1", why: "Q1, Q2, Q72, Q3, Q5, Q4 — the opening every interview has." },
  { step: "4", title: "Anchors: your 8 reusable stories", to: "anchors", why: "One story answers many questions." },
  { step: "5", title: "Project deep dive (10–20 min)", to: "projects", why: "EDR and Rule Builder trees, level by level." },
  { step: "6", title: "Technical (20–32 min)", to: "java", why: "Java → Spring → React → TypeScript → AWS → GraphQL → REST → DB → Docker → CI/CD." },
  { step: "7", title: "Why / Why-not and follow-up attacks", to: "why", why: "Sound experienced, not memorised." },
  { step: "8", title: "Architecture · troubleshooting · behavioral (32–40)", to: "design", why: "System design crash prep, debugging, spoken behavioral answers." },
  { step: "9", title: "Safety net: red flags and 'if I don't know'", to: "redflags", why: "What to avoid and exact rescue phrases." },
  { step: "10", title: "Mock interview", to: "mock", why: "One question at a time with feedback." },
  { step: "11", title: "Last hour: one-day mode + 45-minute plan", to: "plan", why: "Condensed revision before the call." },
];

export default function Overview({ go }: { go: (r: string) => void }) {
  const area = useAreaPct(); const status = useProgress((s) => s.status);
  const days = Math.max(0, Math.ceil((new Date(INTERVIEW.date).getTime() - Date.now()) / 86400000));
  const stats = useMemo(() => ({ high: BANK.filter((q) => priorityOf(q) === "high").length, fu: BANK.reduce((a, q) => a + q.fu.length, 0) }), []);
  const done = Object.values(status).filter((s) => s === "confident").length;
  return (
    <div className="space-y-6">
      <H sub={`${INTERVIEW.company} · ${INTERVIEW.city} · ${INTERVIEW.duration} · interviewer: ${INTERVIEW.interviewer}`}>{INTERVIEW.role} — {INTERVIEW.dateLabel}</H>
      <div className="grid gap-3 sm:grid-cols-4">
        {[[`${days}`, "days to go"], [`${BANK.length}`, "primary questions (all kept)"], [`${stats.fu}`, "follow-ups (all kept)"], [`${done}`, "marked confident"]].map(([n, l]) => <Card key={l} className="p-4"><div className="text-2xl font-semibold">{n}</div><div className="text-xs text-muted">{l}</div></Card>)}
      </div>
      <Card className="p-4">
        <Label tone="warn">Read this first</Label>
        <p className="text-sm leading-relaxed">Your sources disagree with each other in <b>{CONFLICTS.length} places</b> (for example: the resume says you're at Uber now, and the question bank says BluSapphire; three different auth stories; Rule Builder's backend). Nothing was silently reconciled. Go through the <button className="cursor-pointer underline" onClick={() => go("verify")}>Verify page</button> before you memorise any answer.</p>
      </Card>

      <section>
        <h2 className="mb-2 text-sm font-semibold">Study path — in the order the interview will run</h2>
        <ol className="space-y-2">
          {PATH.map((p) => (
            <li key={p.step}><button onClick={() => go(p.to)} className="flex w-full cursor-pointer items-start gap-3 rounded-lg border border-line bg-card p-3 text-left hover:bg-soft">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-fg">{p.step}</span>
              <span className="min-w-0 flex-1"><span className="block text-sm font-medium">{p.title}</span><span className="block text-xs text-muted">{p.why}</span></span><ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted" />
            </button></li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold">Preparation progress</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {AREAS.map(([l, k]) => <Card key={k} className="p-3"><div className="mb-1.5 flex justify-between text-sm"><span>{l}</span><span className="text-muted">{area(k)}%</span></div><ProgressBar value={area(k)} /></Card>)}
        </div>
        <p className="mt-2 text-xs text-muted">Not started 0 · Learning ⅓ · Practiced ⅔ · Confident 1. Saved in this browser only. Searchable items: {DOC_COUNT}.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="p-4"><Label tone="ok">1 · Strongest interview areas</Label><Bullets items={SUMMARY.strongest} /></Card>
        <Card className="p-4"><Label tone="warn">2 · Biggest technical risks</Label><Bullets items={SUMMARY.risks} /></Card>
        <Card className="p-4"><Label>3 · Interviewer ↔ JD overlap (inferred from his profile)</Label><Bullets items={SUMMARY.overlap} /></Card>
        <Card className="p-4"><Label>4 · Questions most worth preparing</Label><p className="text-sm leading-relaxed">{stats.high} questions are flagged high priority — where the JD, his documented background, and your resume all overlap. Start with the <button className="cursor-pointer underline" onClick={() => go("top")}>Top Questions</button> page. <span className="text-muted">Priority is an inference, not a prediction of what he'll ask.</span></p></Card>
        <Card className="p-4"><Label>5 · How to structure the 45 minutes</Label><Bullets items={Object.values(STAGES).map((s) => s)} /><Button className="mt-3" size="sm" variant="outline" onClick={() => go("plan")}>Open the plan</Button></Card>
        <Card className="p-4"><Label tone="ok">6 · Emphasise</Label><Bullets items={SUMMARY.emphasise} /></Card>
        <Card className="p-4 md:col-span-2"><Label tone="warn">7 · Be careful not to overclaim</Label><Bullets items={SUMMARY.careful} /></Card>
      </section>
      <p className="text-xs text-muted"><Badge>Labels</Badge> "Inference" = reasoned from documents, not a fact. "Needs verification" = only you can confirm. "SOURCE CONFLICT" = two sources disagree.</p>
    </div>
  );
}
