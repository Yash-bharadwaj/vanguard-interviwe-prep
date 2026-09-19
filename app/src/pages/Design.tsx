import { SYSTEM_DESIGNS, SD_ORDER } from "@/data/sysdesign";
import { H, Section, Label, Card } from "@/components/ui/primitives";
import { QuestionList } from "@/components/QuestionList";
import { SECTION_FILTER } from "@/data/bank";
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from "@/components/ui/primitives";

export default function Design() {
  return (
    <div className="space-y-4">
      <H sub="12 designs in simple English. Always walk the same order: requirements → capacity → API → data → architecture → deep dive → failure → observability → security → trade-offs.">System design crash prep</H>
      <Card className="p-4 text-sm"><Label>Say this at the start</Label><p className="leading-relaxed">“Before I design anything, let me clarify the requirements and the scale. I'll cover the API, the data model and the main components, then go deeper on the riskiest part, and finish with failure handling, observability, security and trade-offs.”</p></Card>
      <TabsRoot defaultValue="d"><TabsList><TabsTrigger value="d">12 designs</TabsTrigger><TabsTrigger value="q">Your bank questions</TabsTrigger></TabsList>
        <TabsContent value="d"><div className="space-y-2">{SYSTEM_DESIGNS.map((s) => (
          <Section key={s.id} title={s.title}><div className="grid gap-3 text-sm sm:grid-cols-2">{SD_ORDER.map((k) => <div key={k}><Label>{k}</Label><p>{s.f[k]}</p></div>)}</div></Section>))}</div></TabsContent>
        <TabsContent value="q"><QuestionList filter={SECTION_FILTER.design} /></TabsContent></TabsRoot>
    </div>
  );
}
