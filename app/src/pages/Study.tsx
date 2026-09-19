import type { Q } from "@/data/types";
import { JAVA, SPRING, AWS, FRONTEND, DB, API, DEVOPS, TS, type Concept, type Lvl } from "@/data/study";
import { COMPARE } from "@/data/why";
import { SECTION_FILTER } from "@/data/bank";
import { Badge, Card, H, Section, TabsRoot, TabsList, TabsTrigger, TabsContent, Label } from "@/components/ui/primitives";
import { QuestionList } from "@/components/QuestionList";
import { useAreaPct } from "@/lib/progress";
import { ProgressBar } from "@/components/ui/primitives";

const LVL: Record<Lvl, [string, "ok" | "med" | "neutral"]> = { built: ["I built it", "ok"], integrated: ["I integrated / worked with it", "med"], conceptual: ["Conceptual — say so", "neutral"] };
const Concepts = ({ list }: { list: Concept[] }) => (
  <div className="space-y-2">{list.map((c) => (
    <Section key={c.t} title={c.t} badge={<Badge tone={LVL[c.lvl][1]}>{LVL[c.lvl][0]}</Badge>}><p className="leading-relaxed">{c.say}</p>{c.fu && <p className="mt-2 text-xs text-muted">Likely follow-up: {c.fu}</p>}</Section>
  ))}</div>
);
const AwsCards = () => (
  <div className="space-y-2">{AWS.map((s) => (
    <Section key={s.name} title={s.name} badge={<Badge tone={LVL[s.lvl][1]}>{LVL[s.lvl][0]}</Badge>}>
      <div className="grid gap-2 text-sm sm:grid-cols-2">{([["What is it", s.what], ["Why use it", s.why], ["How I used it", s.how], ["Alternative", s.alt], ["Trade-offs", s.trade], ["Scaling", s.scale], ["Cost", s.cost], ["Security", s.sec], ["Failure modes", s.fail], ["Monitoring", s.mon], ["Interview follow-up", s.fu]] as const).map(([k, v]) => <div key={k}><Label>{k}</Label><p>{v}</p></div>)}</div>
    </Section>
  ))}</div>
);

const PAGES: Record<string, { title: string; sub: string; concepts?: Concept[]; extra?: "aws" | "compare"; filter: (q: Q) => boolean }> = {
  java: { title: "Java", sub: "Fundamentals a Java lead will test. Your honest level: conceptual + personal projects.", concepts: JAVA, filter: SECTION_FILTER.java },
  spring: { title: "Spring Boot", sub: "Layers, DI, security, transactions. Say 'personal projects + integration', not 'production owner'.", concepts: SPRING, filter: SECTION_FILTER.spring },
  react: { title: "React & frontend", sub: "Your strongest area. Includes React vs Angular.", concepts: FRONTEND, filter: SECTION_FILTER.react },
  typescript: { title: "TypeScript", sub: "Types, unions, generics, runtime validation.", concepts: TS, filter: SECTION_FILTER.typescript },
  aws: { title: "AWS", sub: "All 17 services with why, alternative, trade-offs, scale, cost, security, failure, monitoring and follow-ups.", extra: "aws", filter: SECTION_FILTER.aws },
  graphql: { title: "GraphQL", sub: "JD standout. Schema, queries, mutations, subscriptions, N+1, caching.", concepts: API.filter((c) => /graphql|n\+1|error/i.test(c.t)), filter: SECTION_FILTER.graphql },
  rest: { title: "REST APIs & integration", sub: "Contracts, idempotency, pagination, auth, retries.", concepts: API, filter: SECTION_FILTER.rest },
  database: { title: "Databases", sub: "SQL and DynamoDB; be ready to defend the DynamoDB choice.", concepts: DB, filter: SECTION_FILTER.database },
  docker: { title: "Docker & containers", sub: "Docker yes; Kubernetes conceptual — say so.", concepts: DEVOPS.filter((c) => /docker|kubernetes|ecs/i.test(c.t)), filter: SECTION_FILTER.docker },
  cicd: { title: "CI/CD & DevOps", sub: "Git, pipelines, deployment strategies, rollback, config.", concepts: DEVOPS, extra: "compare", filter: SECTION_FILTER.cicd },
};
export default function Study({ id }: { id: string }) {
  const p = PAGES[id]; const area = useAreaPct(); const k = id === "docker" ? "docker" : id === "cicd" ? "cicd" : id;
  const pc = ["java", "react", "aws", "rest", "database"].includes(k) ? area(k === "rest" ? "rest" : k) : null;
  return (
    <div className="space-y-4">
      <H sub={p.sub}>{p.title}</H>
      {pc !== null && <div className="max-w-sm"><div className="mb-1 flex justify-between text-xs text-muted"><span>Question progress</span><span>{pc}%</span></div><ProgressBar value={pc} /></div>}
      <TabsRoot defaultValue={p.concepts || p.extra ? "learn" : "qs"}>
        <TabsList>{(p.concepts || p.extra) && <TabsTrigger value="learn">Concepts</TabsTrigger>}<TabsTrigger value="qs">Your bank questions</TabsTrigger>{p.extra === "compare" && <TabsTrigger value="cmp">Why-not comparisons</TabsTrigger>}</TabsList>
        {(p.concepts || p.extra) && <TabsContent value="learn">{p.extra === "aws" ? <AwsCards /> : <Concepts list={p.concepts ?? []} />}</TabsContent>}
        <TabsContent value="qs"><QuestionList filter={p.filter} /></TabsContent>
        {p.extra === "compare" && <TabsContent value="cmp"><div className="space-y-2">{COMPARE.filter((c) => /docker|k8s|ecs/i.test(c.id)).map((c) => <Card key={c.id} className="p-4 text-sm"><div className="font-medium">{c.title}</div><p><b>When:</b> {c.when}</p><p><b>Ours:</b> {c.ours}</p><p><b>Trade-offs:</b> {c.tradeoffs}</p><p><b>Challenge:</b> {c.challenge}</p></Card>)}</div></TabsContent>}
      </TabsRoot>
    </div>
  );
}
