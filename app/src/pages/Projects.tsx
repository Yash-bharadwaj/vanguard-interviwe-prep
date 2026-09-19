import { EDR_TREE, RB_TREE, type Level } from "@/data/deepdive";
import { ANCHORS } from "@/data/anchors";
import { Badge, Card, H, Label, Section, TabsRoot, TabsList, TabsTrigger, TabsContent } from "@/components/ui/primitives";
import { QuestionList } from "@/components/QuestionList";
import { SECTION_FILTER } from "@/data/bank";
import { OWN_LABEL } from "@/data/types";

const Tree = ({ levels }: { levels: Level[] }) => (
  <ol className="space-y-2">{levels.map((l, i) => (
    <li key={l.level}><Section title={<span><span className="mr-2 text-muted">{i + 1}</span>{l.level}</span>} badge={l.flag ? <Badge tone="warn">Ownership / verify</Badge> : undefined} tone={l.flag ? "warn" : undefined}>
      <div className="space-y-2"><div><Label>Simple answer</Label><p>{l.simple}</p></div><div><Label>Technical answer</Label><p>{l.tech}</p></div><div><Label>Likely follow-up</Label><p>{l.follow}</p></div><div><Label tone="ok">Best response</Label><p>{l.best}</p></div>{l.flag && <p className="text-xs text-warn">{l.flag}</p>}</div>
    </Section></li>
  ))}</ol>
);
export function Projects() {
  return (
    <div className="space-y-4">
      <H sub="Go level by level. At each level: simple answer → technical answer → follow-up → best response. Flags show where ownership belongs to the team.">Project deep dive</H>
      <p className="text-xs text-muted">Ownership key: {Object.values(OWN_LABEL).join(" · ")}</p>
      <TabsRoot defaultValue="edr"><TabsList><TabsTrigger value="edr">EDR OneAgent ({EDR_TREE.length} levels)</TabsTrigger><TabsTrigger value="rb">Rule Builder ({RB_TREE.length} levels)</TabsTrigger><TabsTrigger value="qs">Project questions</TabsTrigger></TabsList>
        <TabsContent value="edr"><Tree levels={EDR_TREE} /></TabsContent><TabsContent value="rb"><Tree levels={RB_TREE} /></TabsContent>
        <TabsContent value="qs"><QuestionList filter={SECTION_FILTER.project} /></TabsContent></TabsRoot>
    </div>
  );
}
export function Anchors() {
  return (
    <div className="space-y-4">
      <H sub="Eight genuine experiences that answer most questions. Each is built only from your resume and the code-derived parts of your bank.">Interview anchors</H>
      <div className="space-y-3">{ANCHORS.map((a) => (
        <Section key={a.id} title={a.name} badge={a.verify ? <Badge tone="warn">Verify</Badge> : undefined} tone={a.verify ? "warn" : undefined}>
          <p className="mb-2 text-xs text-muted">Source: {a.source}</p>{a.verify && <p className="mb-2 text-xs text-warn">Needs verification: {a.verify}</p>}
          <div className="grid gap-3 sm:grid-cols-2">{([["Situation", a.situation], ["Problem", a.problem], ["My responsibility", a.responsibility], ["Technical decisions", a.decisions], ["Why I chose them", a.why], ["Implementation", a.implementation], ["Challenges", a.challenges], ["Trade-offs", a.tradeoffs], ["Result", a.result], ["What I learned", a.learned]] as const).map(([k, v]) => <div key={k}><Label>{k}</Label><p className="text-sm leading-relaxed">{v}</p></div>)}</div>
          <div className="mt-3"><Label>Questions this anchor answers</Label><div className="flex flex-wrap gap-1">{a.answers.map((x) => <Badge key={x}>{x}</Badge>)}</div></div>
          <div className="mt-3"><Label>Possible follow-ups</Label><ul className="list-disc pl-5 text-sm">{a.followups.map((x) => <li key={x}>{x}</li>)}</ul></div>
        </Section>
      ))}</div>
    </div>
  );
}
export const _u = Card;
