import { RED_FLAGS, DONT_KNOW } from "@/data/spoken";
import { Card, H, Label } from "@/components/ui/primitives";
import { QuestionList } from "@/components/QuestionList";
import { priorityOf } from "@/data/bank";
import { useProgress } from "@/store/progress";
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from "@/components/ui/primitives";

export function RedFlags() {
  return (
    <div className="space-y-4">
      <H sub="Statements that can hurt you, with the better answer — and the exact phrases to use when you don't know.">Answers that can hurt me · If I don't know</H>
      <TabsRoot defaultValue="rf"><TabsList><TabsTrigger value="rf">Red flags ({RED_FLAGS.length})</TabsTrigger><TabsTrigger value="dk">If I don't know ({DONT_KNOW.length})</TabsTrigger></TabsList>
        <TabsContent value="rf"><div className="space-y-2">{RED_FLAGS.map((r) => <Card key={r.bad} className="p-4 text-sm"><p className="font-medium text-hi">✗ {r.bad}</p><p className="text-muted">{r.why}</p><p className="mt-1 text-ok"><b>Better:</b> {r.better}</p></Card>)}</div></TabsContent>
        <TabsContent value="dk"><div className="space-y-2">{DONT_KNOW.map((d) => <Card key={d.when} className="p-4 text-sm"><Label>{d.when}</Label><p className="leading-relaxed">“{d.say}”</p></Card>)}</div></TabsContent></TabsRoot>
    </div>
  );
}
export function Weak() {
  const weak = useProgress((s) => s.weak); const status = useProgress((s) => s.status);
  return (
    <div className="space-y-4">
      <H sub="Questions you flagged, plus high-priority ones you haven't reached 'Confident' on yet.">Weak areas</H>
      <QuestionList filter={(q) => !!weak[q.id] || (priorityOf(q) === "high" && (status[q.id] ?? "not-started") !== "confident")} />
    </div>
  );
}
