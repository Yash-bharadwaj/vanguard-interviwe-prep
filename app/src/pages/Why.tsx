import { useState } from "react";
import { WHY, COMPARE } from "@/data/why";
import { WHY_SAY } from "@/data/spoken";
import { CHAINS } from "@/data/attack";
import { Badge, Card, H, Input, Label, Section, TabsRoot, TabsList, TabsTrigger, TabsContent } from "@/components/ui/primitives";

export function WhyPage() {
  const [q, setQ] = useState("");
  const w = WHY.filter((x) => `${x.q} ${x.because}`.toLowerCase().includes(q.toLowerCase()));
  const c = COMPARE.filter((x) => `${x.title} ${x.when}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <H sub="'Because… The trade-off is… If I were redesigning it today…' — so your answers sound experienced, not memorised.">Why · Why-not</H>
      <Input placeholder="Filter (dynamodb, graphql, lambda, jwt…)" value={q} onChange={(e) => setQ(e.target.value)} />
      <TabsRoot defaultValue="why"><TabsList><TabsTrigger value="why">WHY ({w.length})</TabsTrigger><TabsTrigger value="not">WHY NOT ({c.length})</TabsTrigger></TabsList>
        <TabsContent value="why"><div className="space-y-2">{w.map((x) => (
          <Section key={x.id} title={x.q} badge={x.honest ? <Badge tone="warn">honesty note</Badge> : undefined}>
            <p className="leading-relaxed">{WHY_SAY[x.id]}</p>
            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3"><div><Label>Because…</Label><p>{x.because}</p></div><div><Label>The trade-off is…</Label><p>{x.tradeoff}</p></div><div><Label>If I redesigned it today…</Label><p>{x.redesign}</p></div></div>
            {x.honest && <p className="mt-2 text-xs text-warn">{x.honest}</p>}
          </Section>))}</div></TabsContent>
        <TabsContent value="not"><div className="space-y-2">{c.map((x) => (
          <Section key={x.id} title={x.title}><div className="grid gap-3 text-sm sm:grid-cols-2">{([["When I'd use each", x.when], ["Why our architecture used ours", x.ours], ["Trade-offs", x.tradeoffs], ["Scaling", x.scaling], ["Operational complexity", x.ops], ["Cost", x.cost], ["Consistency", x.consistency], ["Security", x.security], ["What he may challenge", x.challenge]] as const).map(([k, v]) => <div key={k}><Label>{k}</Label><p>{v}</p></div>)}</div></Section>))}</div></TabsContent>
      </TabsRoot>
    </div>
  );
}
export function Attack() {
  return (
    <div className="space-y-4">
      <H sub="A simulated interviewer who keeps digging. Cover the right side, answer aloud, then compare.">Follow-up attack mode</H>
      <div className="space-y-3">{CHAINS.map((c) => (
        <Section key={c.id} title={c.topic} badge={<Badge>{c.anchor}</Badge>}>
          <ol className="space-y-3">{c.turns.map((t, i) => (
            <li key={i}><div className="font-medium">Avinash: “{t.ask}”</div><details className="mt-1"><summary className="cursor-pointer text-xs text-muted">Show my answer</summary><p className="mt-1 rounded-md bg-soft p-3 leading-relaxed">{t.say}</p></details></li>
          ))}</ol>
        </Section>))}</div>
    </div>
  );
}
export const _c = Card;
