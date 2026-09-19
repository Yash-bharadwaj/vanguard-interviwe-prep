import { BEHAVIORAL } from "@/data/spoken";
import { H, Section, Badge } from "@/components/ui/primitives";
import { QuestionList } from "@/components/QuestionList";
import { SECTION_FILTER } from "@/data/bank";
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from "@/components/ui/primitives";

export default function Behavioral() {
  return (
    <div className="space-y-4">
      <H sub="Written as you'd actually say them: short sentences, contractions, no textbook language. Bracketed [VERIFY] / [YOUR REAL REASON] parts are for you to fill with the truth.">Behavioral — spoken answers</H>
      <TabsRoot defaultValue="say"><TabsList><TabsTrigger value="say">Spoken answers ({BEHAVIORAL.length})</TabsTrigger><TabsTrigger value="qs">Your bank (behavioral)</TabsTrigger></TabsList>
        <TabsContent value="say"><div className="space-y-2">{BEHAVIORAL.map((b) => (
          <Section key={b.id} title={b.q} badge={b.note ? <Badge tone="warn">note</Badge> : undefined}><p className="whitespace-pre-line leading-relaxed">{b.say}</p>{b.note && <p className="mt-2 text-xs text-warn">{b.note}</p>}</Section>))}</div></TabsContent>
        <TabsContent value="qs"><QuestionList filter={SECTION_FILTER.behavioral} /></TabsContent></TabsRoot>
    </div>
  );
}
