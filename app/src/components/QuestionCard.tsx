import { useState } from "react";
import { AlertTriangle, Bookmark, Check, Flag, PenLine, StickyNote } from "lucide-react";
import type { Q } from "@/data/types";
import { KITS, byN, priorityOf, whyFor, drillFor, CAT_LABEL, STAGES } from "@/data/bank";
import { WHY_SAY } from "@/data/spoken";
import { JD } from "@/data/jd";
import { conflictById } from "@/data/conflicts";
import { Badge, Button, Section, Label, Textarea } from "@/components/ui/primitives";
import { useProgress, STATUS_LABEL, STATUS_ORDER, type Status } from "@/store/progress";
import { grade } from "@/lib/grade";
import { cn } from "@/lib/utils";

const jdName = Object.fromEntries(JD.map((j) => [j.id, j.req]));
export const PriBadge = ({ q }: { q: Q }) => {
  const p = priorityOf(q);
  return <Badge tone={p === "high" ? "hi" : p === "medium" ? "med" : "lo"}>{p.toUpperCase()} PRIORITY</Badge>;
};
export const StatusPill = ({ id }: { id: string }) => {
  const s = useProgress((x) => x.status[id] ?? "not-started"); const cycle = useProgress((x) => x.cycle);
  return <button onClick={(e) => { e.stopPropagation(); cycle(id); }} className="cursor-pointer"><Badge tone={s === "confident" ? "ok" : s === "practiced" ? "solid" : s === "learning" ? "med" : "neutral"}>{STATUS_LABEL[s]}</Badge></button>;
};
const Para = ({ children }: { children: React.ReactNode }) => <p className="whitespace-pre-line leading-relaxed">{children}</p>;

export function ConflictChips({ ids, go }: { ids: string[]; go?: () => void }) {
  if (!ids.length) return null;
  return <>{ids.map((id) => <Badge key={id} tone={conflictById[id]?.severity === "high" ? "warn" : "neutral"} title={conflictById[id]?.title} onClick={go} className={go ? "cursor-pointer" : ""}><AlertTriangle className="h-3 w-3" />SOURCE CONFLICT · {id.replace("C-", "")}</Badge>)}</>;
}

function PracticeBox({ q, key30 }: { q: Q; key30: string[] }) {
  const text = useProgress((s) => s.practice[q.id] ?? ""); const set = useProgress((s) => s.setPractice);
  const [fb, setFb] = useState<ReturnType<typeof grade> | null>(null);
  return (
    <div className="space-y-2">
      <Textarea rows={6} value={text} onChange={(e) => set(q.id, e.target.value)} placeholder="Say it out loud first, then type your answer as you'd speak it…" />
      <div className="flex flex-wrap gap-2"><Button size="sm" onClick={() => setFb(grade(text, key30))} disabled={text.trim().length < 10}>Check my answer</Button><span className="self-center text-xs text-muted">Rule-based check (key points, why, trade-offs, ownership) — not an AI judge.</span></div>
      {fb && (
        <div className="space-y-1 rounded-md border border-line bg-soft p-3 text-sm">
          <div className="font-medium">Score {fb.score}/100 · {fb.accuracy} · {fb.words} words · {fb.length}</div>
          {fb.good.map((g, i) => <div key={i} className="text-ok">✓ {g}</div>)}
          {fb.missing.map((g, i) => <div key={i} className="text-warn">• {g}</div>)}
          <div className={cn(fb.ownership.startsWith("⚠") && "text-hi")}>{fb.ownership}</div>
        </div>
      )}
    </div>
  );
}

export function QuestionCard({ q, onOpen }: { q: Q; onOpen?: (n: number) => void }) {
  const kit = KITS[q.n];
  const st = useProgress((s) => s.status[q.id] ?? "not-started"); const setStatus = useProgress((s) => s.setStatus);
  const note = useProgress((s) => s.notes[q.id] ?? ""); const setNote = useProgress((s) => s.setNote);
  const bm = useProgress((s) => !!s.bookmarks[q.id]); const toggleBm = useProgress((s) => s.toggleBookmark);
  const weak = useProgress((s) => !!s.weak[q.id]); const toggleWeak = useProgress((s) => s.toggleWeak);
  const [practice, setPractice] = useState(false); const [noteOpen, setNoteOpen] = useState(!!note);
  const whys = whyFor(q); const drill = drillFor(q);
  const allConflicts = [...new Set([...q.conflicts, ...q.conflictsInFollowups])];
  const key = kit?.key ?? q.tags.filter((t) => t !== "trivia");

  return (
    <article className="space-y-3 px-4 py-4 pb-28 md:pb-6">
      <div className="flex flex-wrap items-center gap-1.5">
        <PriBadge q={q} /><Badge>{q.difficulty}</Badge><Badge>{CAT_LABEL[q.cat]}</Badge><Badge>Stage {q.stage} · {STAGES[q.stage]?.split(" (")[0]}</Badge>
        {kit ? <Badge tone="ok">Spoken answer written</Badge> : <Badge tone="warn">Original bank answer only</Badge>}
        {q.ey && <Badge tone="warn"><AlertTriangle className="h-3 w-3" />EY WORDING — don't say it</Badge>}
        <ConflictChips ids={q.conflicts} />
      </div>
      <div className="flex items-start gap-2"><h2 className="min-w-0 flex-1 text-lg font-semibold leading-snug">Q{q.n}: {q.q}</h2><div className="flex shrink-0 items-center"><StatusPill id={q.id} /><Button variant="ghost" size="icon" aria-label="Bookmark" onClick={() => toggleBm(q.id)}><Bookmark className={cn("h-4 w-4", bm && "fill-current")} /></Button><Button variant="ghost" size="icon" aria-label="Flag as weak area" onClick={() => toggleWeak(q.id)}><Flag className={cn("h-4 w-4", weak && "fill-current text-hi")} /></Button></div></div>

      <Section defaultOpen title="Why they ask · what they're testing"><Label>Why the interviewer may ask it (inference)</Label><Para>{q.whyAsk}</Para><div className="h-2" /><Label>What they're actually testing</Label><Para>{q.testing}</Para></Section>
      <Section title="What in my resume triggers it · JD · interviewer">
        <Label>Resume triggers</Label>{q.resumeTrigger.length ? <ul className="list-disc space-y-1 pl-5">{q.resumeTrigger.map((r) => <li key={r}>{r}</li>)}</ul> : <p className="text-muted">General question.</p>}
        <div className="h-2" /><Label>Vanguard JD relevance</Label><div className="flex flex-wrap gap-1">{q.jd.length ? q.jd.map((j) => <Badge key={j}>{jdName[j] ?? j}</Badge>) : <span className="text-muted">—</span>}</div>
        <div className="h-2" /><Label>Interviewer background (inferred from his profile — not certain)</Label><div className="flex flex-wrap gap-1">{q.iv.length ? q.iv.map((j) => <Badge key={j}>{j}</Badge>) : <span className="text-muted">—</span>}</div>
      </Section>

      <Section defaultOpen title="My 30-second answer" tone="ok">
        {kit ? <Para>{kit.s30}</Para> : <><Para>{q.short30}</Para><p className="mt-2 text-xs text-warn">Auto-extracted opening of your original bank answer. Re-say it in your own words, in short spoken sentences.</p></>}
      </Section>
      <Section defaultOpen={!!kit} title="My 2-minute answer">
        {kit ? <Para>{kit.s120}</Para> : <p className="text-muted">No separate script yet — use the original bank answer below as the deeper answer.</p>}
      </Section>
      {kit && <Section title="Simple-English version"><Para>{kit.simple}</Para></Section>}
      <Section title="Deeper technical answer — your original bank answer (verbatim)" badge={q.claims.length ? <Badge tone="warn">Needs verification: {q.claims.slice(0, 3).join(" · ")}</Badge> : undefined} tone={q.claims.length ? "warn" : undefined}>
        <Para>{q.a}</Para>
        {q.claims.length > 0 && <p className="mt-2 text-xs text-warn">These claims are not on your resume: {q.claims.join(", ")}. Say them only if you can defend them.</p>}
      </Section>
      <Section defaultOpen title="My real experience · ownership (A–E)">
        <Para>{kit?.mine ?? "Decide which of A (I built) / B (I integrated) / C (collaborated) / D (understand conceptually) / E (team built) applies before you answer. See Profile → Ownership matrix."}</Para>
        {kit?.verify && <p className="mt-2 text-xs text-warn">Verify: {kit.verify.split(",").map((s) => s.trim()).join(", ")}</p>}
      </Section>

      {whys.length > 0 && <Section title="WHY · WHY NOT · TRADE-OFFS · REDESIGN (spoken)">
        <div className="space-y-3">{whys.map((w) => <div key={w.id}><Label>{w.q}</Label><Para>{WHY_SAY[w.id] ?? `Because ${w.because} The trade-off is ${w.tradeoff} If I were redesigning it: ${w.redesign}`}</Para>{w.honest && <p className="mt-1 text-xs text-warn">Honesty note: {w.honest}</p>}</div>)}</div>
      </Section>}
      {drill.length > 0 && <Section title="Deep-dive prompts: what happens if it fails · scale · secure · monitor (topic-level)">
        <div className="space-y-3">{drill.map((s) => <div key={s.name}><Label>{s.name}</Label><ul className="list-disc space-y-0.5 pl-5"><li><b>Alternative:</b> {s.alt}</li><li><b>Trade-offs:</b> {s.trade}</li><li><b>Scale it:</b> {s.scale}</li><li><b>Secure it:</b> {s.sec}</li><li><b>If it fails:</b> {s.fail}</li><li><b>Monitor it:</b> {s.mon}</li></ul></div>)}</div>
      </Section>}

      <Section defaultOpen title={`Follow-ups (${q.fu.length} from your bank${kit?.follows.length ? ` + ${kit.follows.length} scripted` : ""})`}>
        <div className="space-y-2">
          {kit?.follows.map((f, i) => <div key={"k" + i} className="rounded-md border border-ok/30 bg-ok/5 p-3"><div className="font-medium">↳ {f.q}</div><Para>{f.a}</Para></div>)}
          {q.fu.map((f) => (
            <Section key={f.id} title={<span>Follow-up {f.n}: {f.q}</span>} badge={<>{f.ey && <Badge tone="warn">EY</Badge>}<ConflictChips ids={f.conflicts.slice(0, 1)} /></>}>
              <Para>{f.a}</Para>{f.claims.length > 0 && <p className="mt-2 text-xs text-warn">Needs verification: {f.claims.join(", ")}</p>}
            </Section>
          ))}
        </div>
      </Section>
      <Section title="Dangerous / weak answer to avoid" tone="warn"><Para>{kit?.danger ?? "Memorised textbook definitions; claiming ownership you don't have; skipping the trade-off; quoting numbers not on your resume."}</Para></Section>
      <Section title="If I don't know" tone="ok"><Para>{kit?.dk && kit.dk !== "N/A" ? kit.dk : "I haven't implemented that directly in production, but I understand the concept. My understanding is… and here's how I'd approach it / close the gap."}</Para></Section>
      {allConflicts.length > 0 && <Section title="Source conflicts on this question" tone="warn"><div className="space-y-3">{allConflicts.map((id) => { const c = conflictById[id]; return c ? <div key={id}><div className="font-medium">{c.title}</div><p className="text-xs text-muted">{c.a}</p><p className="text-xs text-muted">{c.b}</p><p className="mt-1"><b>Say:</b> {c.say}</p></div> : null; })}</div></Section>}
      {q.related.length > 0 && <Section title={`Related / repeated questions (${q.related.length})`}>
        <div className="flex flex-wrap gap-1.5">{q.related.map((r) => <button key={r.n} className="cursor-pointer" onClick={() => onOpen?.(r.n)}><Badge tone={r.n === q.preferred ? "ok" : "neutral"}>Q{r.n} · {r.kind}{r.n === q.preferred ? " · likely more relevant" : ""}</Badge></button>)}</div>
        <p className="mt-2 text-xs text-muted">Kept separate (nothing was merged). "Likely more relevant" is an inference: the project-specific wording is closest to what he will read off your resume.</p>
      </Section>}

      {noteOpen && <div><Label>My note</Label><Textarea rows={3} value={note} onChange={(e) => setNote(q.id, e.target.value)} placeholder="Your own wording, real numbers, reminders…" /></div>}
      {practice && <div><Label>Practice</Label><PracticeBox q={q} key30={key} /></div>}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:static md:z-auto md:border-0 md:bg-transparent md:p-0">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-2">
          <Button variant={st === "confident" ? "ok" : "default"} onClick={() => setStatus(q.id, st === "confident" ? "not-started" : "confident")}><Check className="h-4 w-4" />{st === "confident" ? "Prepared ✓" : "Mark Prepared"}</Button>
          <Button variant="outline" onClick={() => setPractice((p) => !p)}><PenLine className="h-4 w-4" />Practice</Button>
          <Button variant="outline" onClick={() => setNoteOpen((p) => !p)}><StickyNote className="h-4 w-4" />Note</Button>
          <select aria-label="Status" value={st} onChange={(e) => setStatus(q.id, e.target.value as Status)} className="hidden h-9 rounded-md border border-line bg-card px-2 text-sm md:block">{STATUS_ORDER.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}</select>
        </div>
      </div>
    </article>
  );
}
export { byN };
