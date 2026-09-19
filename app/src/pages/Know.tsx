import { useState } from "react";
import { OWNERSHIP, SUMMARY } from "@/data/profile";
import { OWN_LABEL, EVIDENCE_LABEL, type Evidence } from "@/data/types";
import { IV_FACTS, IV_SKILLS, IV_SOURCE_CONFLICTS, FOCUS, IV_QUESTIONS } from "@/data/interviewer";
import { JD } from "@/data/jd";
import { CONFLICTS } from "@/data/conflicts";
import { Badge, Card, H, Label, Bullets, Section, TabsRoot, TabsList, TabsTrigger, TabsContent, Input } from "@/components/ui/primitives";
import { useProgress } from "@/store/progress";
import { cn } from "@/lib/utils";

export function Profile() {
  return (
    <div className="space-y-6">
      <H sub="Built on your resume (Uber · BluSapphire · Freelance). Nothing here turns team work into personal work.">My profile & ownership</H>
      <Card className="p-4 text-sm leading-relaxed"><Label>Resume snapshot</Label><Bullets items={["Mantha Yashwanth Bharadwaj — Application Engineer; Hyderabad; B.Tech CS, Andhra University, GPA 8.57 (2019–2023).", "Automation Engineer, Uber — 21 May 2026 → present (confirmed) (JS automation, REST/GraphQL integration, data hydration, config-driven tooling).", "Application Engineer, BluSapphire Cyber Systems — Mar 2024 → 21 May 2026 (confirmed) (EDR/NDR platform, 500+ endpoints; EDR OneAgent + Rule Builder).", "Freelance Full Stack Developer — Jul 2023 → Feb 2024 (India, UAE, UK, US; akemsgroup.com, globalindiagateway.com, manshispeaks.com, nehadixit.com); co-founder, Earn While You Learn Club (mentored 13 students).", "AWS Certified Developer Associate · Cloud Practitioner · Smart India Hackathon finalist 2022 · NCC A, B & C."]} /></Card>
      <div>
        <h2 className="mb-2 text-sm font-semibold">Ownership matrix (A–E)</h2>
        <p className="mb-2 text-xs text-muted">{Object.values(OWN_LABEL).join("  ·  ")}</p>
        <div className="space-y-2">{OWNERSHIP.map((o) => (
          <Card key={o.area} className="p-3 text-sm"><div className="mb-1 flex flex-wrap items-center gap-1.5"><span className="font-medium">{o.area}</span>{o.own.map((x) => <Badge key={x} tone={x === "A" ? "ok" : x === "D" || x === "E" ? "neutral" : "med"}>{x}</Badge>)}{o.verify && <Badge tone="warn">Needs verification</Badge>}</div><p className="text-muted">Say: “{o.safe}”</p></Card>
        ))}</div>
        <p className="mt-2 text-xs text-muted">These letters are my inference from your resume and the code-derived answers in your bank. Correct them to your true split — then use identical wording every time.</p>
      </div>
      <Card className="p-4"><Label tone="warn">Careful not to overclaim</Label><Bullets items={SUMMARY.careful} /></Card>
    </div>
  );
}

export function Interviewer() {
  return (
    <div className="space-y-6">
      <H sub="Transcribed from the profile image you supplied. Everything on this page about what he may ask is an inference from his documented technical background — never a certainty.">Interviewer technical profile</H>
      <Card className="p-4 text-sm"><div className="font-medium">{IV_FACTS.name}</div><p className="text-muted">{IV_FACTS.headline}</p><p className="mt-1 text-xs text-warn">Title on the profile: {IV_FACTS.shownTitle}</p><div className="mt-2 flex flex-wrap gap-1">{IV_FACTS.skillsShown.map((s) => <Badge key={s}>{s}</Badge>)}</div></Card>
      <Card className="border-warn/40 p-4"><Label tone="warn">Source conflicts in his profile (not reconciled)</Label><Bullets items={IV_SOURCE_CONFLICTS} /></Card>
      <TabsRoot defaultValue="focus">
        <TabsList><TabsTrigger value="focus">Likely focus areas</TabsTrigger><TabsTrigger value="skills">His skills ↔ yours ↔ JD</TabsTrigger><TabsTrigger value="qs">Questions worth preparing</TabsTrigger></TabsList>
        <TabsContent value="focus"><div className="space-y-3">{FOCUS.map((f, i) => <Card key={f.area} className="p-4 text-sm"><div className="mb-1 flex items-center gap-2"><span className="text-muted">{i + 1}</span><span className="font-medium">{f.area}</span><Badge tone={f.priority === "Very high" ? "hi" : f.priority === "High" ? "med" : "neutral"}>{f.priority} preparation priority</Badge></div><p className="text-muted">{f.why}</p><Bullets items={f.prep} /></Card>)}</div></TabsContent>
        <TabsContent value="skills"><div className="space-y-3">{IV_SKILLS.map((s) => <Card key={s.skill} className="p-4 text-sm"><div className="mb-1 flex flex-wrap items-center gap-2"><span className="font-medium">{s.skill}</span><Badge tone={s.level === "core" ? "solid" : "neutral"}>{s.level}</Badge></div><p><b>On his profile:</b> {s.evidence}</p><p><b>Yours:</b> {s.mine}</p><p><b>JD:</b> {s.jd}</p></Card>)}</div></TabsContent>
        <TabsContent value="qs"><p className="mb-2 text-xs text-muted">Not guaranteed. Each links a plausible question to your real experience.</p><div className="space-y-2">{IV_QUESTIONS.map((q) => <Card key={q.q} className="p-3 text-sm"><div className="font-medium">{q.q}</div><Badge className="my-1">{q.area}</Badge><p><b>Connect it to:</b> {q.connect}</p>{q.honest && <p className="text-warn"><b>Honesty:</b> {q.honest}</p>}</Card>)}</div></TabsContent>
      </TabsRoot>
    </div>
  );
}

const evTone = (e: Evidence) => (e === "strong" ? "ok" : e === "moderate" ? "solid" : e === "transferable" ? "neutral" : e === "gap" ? "warn" : "hi") as "ok" | "solid" | "neutral" | "warn" | "hi";
export function JdPage() {
  const [q, setQ] = useState(""); const [g, setG] = useState("all");
  const list = JD.filter((j) => (g === "all" || j.group === g) && `${j.req} ${j.evidence} ${j.answer}`.toLowerCase().includes(q.toLowerCase()));
  const counts = (Object.keys(EVIDENCE_LABEL) as Evidence[]).map((e) => [e, JD.filter((j) => j.ev === e).length] as const);
  return (
    <div className="space-y-4">
      <H sub="Every requirement classified against your actual resume, with how to answer if he asks.">Vanguard Application Engineer II — requirements map</H>
      <div className="flex flex-wrap gap-1.5">{counts.map(([e, n]) => <Badge key={e} tone={evTone(e)}>{EVIDENCE_LABEL[e]}: {n}</Badge>)}</div>
      <div className="flex gap-2"><Input placeholder="Filter requirements…" value={q} onChange={(e) => setQ(e.target.value)} /><select className="h-9 rounded-md border border-line bg-card px-2 text-sm" value={g} onChange={(e) => setG(e.target.value)}><option value="all">All</option><option value="core">Core</option><option value="standout">Standout</option></select></div>
      <div className="space-y-2">{list.map((j) => <Section key={j.id} title={j.req} badge={<Badge tone={evTone(j.ev)}>{EVIDENCE_LABEL[j.ev]}</Badge>}><p><b>My evidence:</b> {j.evidence}</p><p className="mt-1"><b>How to answer:</b> {j.answer}</p></Section>)}</div>
      <Card className="p-4 text-sm"><Label>Gaps to answer honestly</Label><Bullets items={JD.filter((j) => j.ev === "gap" || j.ev === "not-demonstrated").map((j) => `${j.req} — ${j.answer}`)} /></Card>
    </div>
  );
}

export function Verify() {
  const ver = useProgress((s) => s.verified); const toggle = useProgress((s) => s.toggleVerified);
  const done = CONFLICTS.filter((c) => ver[c.id]).length;
  return (
    <div className="space-y-4">
      <H sub="Two of your sources disagree in each case below. I did not pick a winner silently — I show both, the risk, and the safest wording. Tick each one once you've decided.">SOURCE CONFLICTS — verify before you memorise</H>
      <Badge tone={done === CONFLICTS.length ? "ok" : "warn"}>{done} of {CONFLICTS.length} resolved</Badge>
      <div className="space-y-3">{CONFLICTS.map((c) => (
        <Card key={c.id} className={cn("p-4 text-sm", ver[c.id] && "opacity-60")}>
          <div className="mb-2 flex items-start gap-2"><input type="checkbox" className="mt-1" checked={!!ver[c.id]} onChange={() => toggle(c.id)} aria-label={`Resolved: ${c.title}`} /><div><div className="font-medium">{c.title}</div><Badge tone={c.severity === "high" ? "hi" : c.severity === "medium" ? "med" : "neutral"}>{c.severity} risk</Badge> <span className="text-xs text-muted">{c.id}</span></div></div>
          <p className="mb-1"><b>Source A</b> — {c.a}</p><p className="mb-1"><b>Source B</b> — {c.b}</p><p className="mb-1 text-warn"><b>Risk</b> — {c.risk}</p><p className="mb-1 text-ok"><b>Safest wording</b> — {c.say}</p><p><b>You must confirm</b> — {c.verify}</p>
        </Card>
      ))}</div>
    </div>
  );
}
