import { PLAYBOOK } from "@/data/playbook";
import { Card, H, Label, Bullets } from "@/components/ui/primitives";

export default function Playbook() {
  const p = PLAYBOOK;
  return (
    <div className="space-y-5">
      <H sub="How to lead a 45-minute technical conversation with confidence and honesty. This is about clarity and control of depth — not manipulating him.">Interviewer playbook</H>
      <Card className="p-4"><Label>Mindset</Label><Bullets items={p.mindset} /></Card>
      <Card className="p-4"><Label>Answer structure (≈ 90 seconds)</Label><ol className="space-y-2 text-sm">{p.structure.map((s, i) => <li key={s.step}><b>{i + 1}. {s.step}</b> — {s.text}</li>)}</ol></Card>
      <Card className="p-4"><Label>Your first minute — say this aloud</Label><p className="text-sm leading-relaxed">{p.firstMinute}</p></Card>
      <Card className="p-4"><Label>Lead the conversation — phrases</Label><div className="space-y-2 text-sm">{p.control.map((c) => <div key={c.situation}><b>{c.situation}:</b> <span className="text-muted">{c.say}</span></div>)}</div></Card>
      <Card className="p-4"><Label>Reading him (inferred from his documented background)</Label><Bullets items={p.readHim} /></Card>
      <Card className="p-4"><Label tone="warn">Don't</Label><Bullets items={p.donts} /></Card>
      <Card className="p-4"><Label>Your questions for him (pick 3)</Label><Bullets items={p.ask} /></Card>
      <Card className="p-4"><Label>Closing statement</Label><p className="text-sm leading-relaxed">{p.closing}</p></Card>
      <Card className="p-4"><Label tone="ok">Before the call — checklist</Label><Bullets items={p.checklist} /></Card>
    </div>
  );
}
