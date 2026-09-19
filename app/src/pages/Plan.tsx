import { FLOW, DRIVE, ONE_DAY } from "@/data/plan45";
import { byN } from "@/data/bank";
import { Badge, Card, H, Label, Section, Bullets, TabsRoot, TabsList, TabsTrigger, TabsContent } from "@/components/ui/primitives";
import { QuestionList } from "@/components/QuestionList";

const ONE = new Set(ONE_DAY.questions);
export function Plan() {
  return (
    <div className="space-y-4">
      <H sub="Adjusted to the JD, his documented background, your resume and your bank.">45-minute plan</H>
      <TabsRoot defaultValue="flow"><TabsList><TabsTrigger value="flow">Timeline</TabsTrigger><TabsTrigger value="drive">If he starts here → drive here</TabsTrigger></TabsList>
        <TabsContent value="flow"><div className="space-y-3">{FLOW.map((f) => (
          <Card key={f.at} className="p-4 text-sm"><div className="mb-1 flex items-center gap-2"><Badge tone="solid">{f.at} min</Badge><span className="font-medium">{f.name}</span></div><p className="text-muted">{f.goal}</p><Bullets items={f.do} />{f.qs.length > 0 && <p className="mt-2 text-xs text-muted">Questions: {f.qs.map((n) => `Q${n}`).join(", ")} — {f.qs.map((n) => byN.get(n)?.q.slice(0, 32)).join(" · ")}</p>}</Card>))}</div></TabsContent>
        <TabsContent value="drive"><p className="mb-3 text-xs text-muted">The goal is to communicate your strongest genuine experience clearly — not to manipulate him. Offer depth; let him choose.</p><div className="space-y-2">{DRIVE.map((d) => (
          <Section key={d.start} title={d.start}><ol className="list-decimal space-y-1 pl-5">{d.path.map((p) => <li key={p}>{p}</li>)}</ol><p className="mt-2 text-xs text-muted">{d.note}</p></Section>))}</div></TabsContent>
      </TabsRoot>
    </div>
  );
}
export function OneDay() {
  const o = ONE_DAY;
  return (
    <div className="space-y-4">
      <H sub="Condensed revision mode. The full material is untouched in the other pages.">If I only have one day</H>
      <div className="grid gap-3 md:grid-cols-2">
        {([["Top concepts", o.concepts], ["Top project stories", o.stories], ["Top follow-ups", o.followups], ["Top behavioral", o.behavioral], ["Top architecture concepts", o.architecture], ["Top interviewer-specific topics", o.interviewer]] as const).map(([t, l]) => <Card key={t} className="p-4"><Label>{t}</Label><Bullets items={[...l]} /></Card>)}
      </div>
      <h2 className="text-sm font-semibold">Top technical + intro questions ({o.questions.length}, in interview order)</h2>
      <QuestionList filter={(q) => ONE.has(q.n)} showStageFilter={false} />
    </div>
  );
}
