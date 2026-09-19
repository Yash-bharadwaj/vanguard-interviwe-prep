import { useMemo, useState } from "react";
import { CARDS } from "@/lib/cards";
import { Button, Card, H, Label, Badge } from "@/components/ui/primitives";
import { useProgress } from "@/store/progress";

export default function Flashcards() {
  const [group, setGroup] = useState("all"); const [i, setI] = useState(0); const [step, setStep] = useState(0);
  const status = useProgress((s) => s.status); const setStatus = useProgress((s) => s.setStatus);
  const groups = useMemo(() => ["all", ...new Set(CARDS.map((c) => c.group))], []);
  const list = useMemo(() => CARDS.filter((c) => group === "all" || c.group === group), [group]);
  const c = list[Math.min(i, list.length - 1)];
  const move = (d: number) => { setI((p) => Math.max(0, Math.min(list.length - 1, p + d))); setStep(0); };
  if (!c) return null;
  const mastered = list.filter((x) => status[x.id] === "confident").length;
  return (
    <div className="space-y-4">
      <H sub="Front: question. Back: 30-second answer. Deeper: 2-minute answer. Follow-up: the likely challenge.">Flashcards</H>
      <div className="flex flex-wrap items-center gap-2"><select className="h-9 rounded-md border border-line bg-card px-2 text-sm" value={group} onChange={(e) => { setGroup(e.target.value); setI(0); setStep(0); }}>{groups.map((g) => <option key={g} value={g}>{g}</option>)}</select><Badge>{i + 1}/{list.length}</Badge><Badge tone="ok">{mastered} mastered</Badge></div>
      <Card className="min-h-64 space-y-3 p-5">
        <Label>FRONT</Label><p className="text-lg font-medium leading-snug">{c.front}</p>
        {step >= 1 && <><Label tone="ok">BACK · 30 seconds</Label><p className="leading-relaxed">{c.back}</p></>}
        {step >= 2 && <><Label>DEEPER · 2 minutes</Label><p className="whitespace-pre-line leading-relaxed">{c.deeper}</p></>}
        {step >= 3 && <><Label tone="warn">FOLLOW-UP · likely challenge</Label><p className="leading-relaxed">{c.follow}</p></>}
      </Card>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => move(-1)} disabled={i === 0}>Prev</Button>
        <Button onClick={() => setStep((s) => Math.min(3, s + 1))} disabled={step >= 3}>{["Show 30-second answer", "Show deeper", "Show follow-up", ""][step]}</Button>
        <Button variant="ok" onClick={() => { setStatus(c.id, "confident"); move(1); }}>Got it</Button>
        <Button variant="outline" onClick={() => { setStatus(c.id, "learning"); move(1); }}>Again</Button>
        <Button variant="outline" onClick={() => move(1)} disabled={i >= list.length - 1}>Next</Button>
      </div>
    </div>
  );
}
