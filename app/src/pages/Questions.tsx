import { memo, useMemo, useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { Check, ChevronDown, Star, TriangleAlert } from "lucide-react";
import type { Q } from "@/data/types";
import { BANK, KITS, SECTION_FILTER, priorityOf } from "@/data/bank";
import { UPDATED } from "@/data/updated";
import { conflictById } from "@/data/conflicts";
import { useProgress } from "@/store/progress";
import { cn } from "@/lib/utils";

/** One short, plain reason — shown only when it really matters. */
const SHORT: Record<string, string> = {
  "C-AUTH": "This answer's login story differs from your other answers (Stytch / Keycloak). Don't say Cognito.",
  "C-RB-BACKEND": "Rule Builder saving: your resume says REST endpoints (not Lambda + DynamoDB).",
  "C-RT": "Real-time/batching details here aren't on your resume — say them only if you built them.",
  "C-METRICS": "Some numbers here aren't on your resume — skip them or say 'roughly'.",
  "C-OWN": "Be careful how you word who built what (you built the UI/integration; backend team built the rest).",
  "C-SPRING": "Be honest about your Java/Spring level (personal projects + integration).",
  "C-DDBSTREAM": "This incident isn't on your resume — use it only if it really happened.",
  "C-CURRENT": "You're at Uber now (since 21 May); BluSapphire is past.",
};
/** Read-only heads-up, only when the text shown is a raw original with a known issue. No action needed to prepare. */
const flagOf = (q: Q): string | null => {
  if (UPDATED[q.id] || KITS[q.n]) return null;
  if (q.ey) return "This original answer mentions EY — say Vanguard instead.";
  const c = q.conflicts.find((x) => SHORT[x]);
  if (c) return SHORT[c];
  if (q.claims.length) return `These details aren't on your resume: ${q.claims.slice(0, 3).join(", ")}.`;
  return null;
};

const Text = ({ children }: { children: React.ReactNode }) => <p className="whitespace-pre-line text-[15px] leading-relaxed">{children}</p>;

function Acc({ title, right, children, small, defaultOpen }: { title: React.ReactNode; right?: React.ReactNode; children: () => React.ReactNode; small?: boolean; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className={cn("rounded-lg border border-line bg-card", small && "bg-transparent")}>
      <Collapsible.Trigger className="flex w-full cursor-pointer items-start gap-2 px-3 py-3 text-left">
        <span className={cn("min-w-0 flex-1", small ? "text-sm" : "text-[15px] font-medium")}>{title}</span>
        {right}
        <ChevronDown className={cn("mt-0.5 h-4 w-4 shrink-0 text-muted transition-transform", open && "rotate-180")} />
      </Collapsible.Trigger>
      {open && <Collapsible.Content className="space-y-3 border-t border-line px-3 py-3">{children()}</Collapsible.Content>}
    </Collapsible.Root>
  );
}

const Row = memo(function Row({ q }: { q: Q }) {
  const done = useProgress((s) => s.status[q.id] === "confident");
  const setStatus = useProgress((s) => s.setStatus);
  const kit = KITS[q.n];
  const star = priorityOf(q) === "high";
  const flag = flagOf(q);
  const upd = UPDATED[q.id];
  const answer = upd?.say ?? kit?.s120 ?? q.a;
  return (
    <Acc
      title={<><span className="mr-1.5 text-muted">{q.n}.</span>{q.q}</>}
      right={<span className="flex shrink-0 items-center gap-1.5 pt-0.5">{flag && <TriangleAlert className="h-4 w-4 text-warn" aria-label="check this answer" />}{star && <Star className="h-4 w-4 fill-current text-med" aria-label="important" />}{done && <Check className="h-4 w-4 text-ok" aria-label="prepared" />}</span>}
    >
      {() => (
        <>
          {flag && <p className="rounded-md bg-warn/10 px-3 py-2 text-sm text-warn">⚠ {flag}</p>}
          {(upd || kit) && !upd && <div><div className="mb-1 text-xs font-medium text-muted">Short (30 seconds)</div><Text>{kit.s30}</Text></div>}
          <div>
            <div className="mb-1 text-xs font-medium text-muted">{upd || kit ? "Full answer" : "Answer"}</div>
            <Text>{answer}</Text>
          </div>
          {(upd || kit) && !q.ey && <Acc small title={<span className="text-muted">Original answer from your file</span>}>{() => <Text>{q.a}</Text>}</Acc>}

          {(kit?.follows.length || q.fu.length) ? (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted">Follow-ups ({q.fu.length}{kit?.follows.length ? ` + ${kit.follows.length} extra` : ""})</div>
              {kit?.follows.map((f, i) => <Acc key={"k" + i} small title={<>{f.q}</>}>{() => <Text>{f.a}</Text>}</Acc>)}
              {q.fu.map((f) => {
                const u = UPDATED[f.id];
                return (
                  <Acc key={f.id} small title={<>{f.q}</>} right={u ? <span className="text-[11px] text-ok">updated</span> : undefined}>
                    {() => (
                      <>
                        {u ? <><Text>{u.say}</Text>{!f.ey && <Acc small title={<span className="text-muted">Original answer from your file</span>}>{() => <Text>{f.a}</Text>}</Acc>}</> : <Text>{f.a}</Text>}
                      </>
                    )}
                  </Acc>
                );
              })}
            </div>
          ) : null}

          <button onClick={() => setStatus(q.id, done ? "not-started" : "confident")} className={cn("flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm", done ? "border-ok/50 bg-ok/10 text-ok" : "border-line hover:bg-soft")}>
            <Check className="h-4 w-4" />{done ? "Prepared" : "Mark as prepared"}
          </button>
        </>
      )}
    </Acc>
  );
});

const CHIPS: [string, (q: Q) => boolean][] = [
  ["All", () => true],
  ["★ Important", (q) => priorityOf(q) === "high"],
  ["Intro & resume", (q) => q.stage <= 2],
  ["Projects", SECTION_FILTER.project],
  ["Java / Spring", (q) => SECTION_FILTER.java(q) || SECTION_FILTER.spring(q)],
  ["React / TypeScript", (q) => SECTION_FILTER.react(q) || SECTION_FILTER.typescript(q)],
  ["AWS", SECTION_FILTER.aws],
  ["GraphQL / REST", (q) => SECTION_FILTER.graphql(q) || SECTION_FILTER.rest(q)],
  ["Database", SECTION_FILTER.database],
  ["Docker / CI-CD", (q) => SECTION_FILTER.docker(q) || SECTION_FILTER.cicd(q)],
  ["Design", SECTION_FILTER.design],
  ["Behavioral", SECTION_FILTER.behavioral],
  ["Not prepared", () => true],
];

export default function Questions() {
  const [chip, setChip] = useState(0); const [text, setText] = useState("");
  const status = useProgress((s) => s.status);
  const doneCount = BANK.filter((q) => status[q.id] === "confident").length;
  const list = useMemo(() => {
    const t = text.trim().toLowerCase(); const [label, f] = CHIPS[chip];
    return BANK.filter((q) => f(q) && (label !== "Not prepared" || status[q.id] !== "confident") &&
      (!t || `${q.n} ${q.q} ${q.a} ${q.fu.map((x) => x.q + " " + x.a).join(" ")}`.toLowerCase().includes(t))).sort((a, b) => a.seq - b.seq);
  }, [chip, text, status]);
  return (
    <div>
      <div className="sticky top-0 z-20 -mx-4 space-y-2 border-b border-line bg-bg/95 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        <div className="flex items-center gap-3">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Search questions and answers…" className="h-10 min-w-0 flex-1 rounded-md border border-line bg-card px-3 text-sm outline-none focus:border-fg" />
          <span className="shrink-0 text-xs text-muted">{doneCount}/{BANK.length} prepared</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
          {CHIPS.map(([l], i) => <button key={l} onClick={() => setChip(i)} className={cn("shrink-0 cursor-pointer rounded-full border px-3 py-1 text-xs", i === chip ? "border-transparent bg-accent text-accent-fg" : "border-line text-muted hover:bg-soft")}>{l}</button>)}
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">{list.length} questions · in the order the interview will run · <Star className="inline h-3 w-3 fill-current text-med" /> important · <TriangleAlert className="inline h-3 w-3 text-warn" /> check before saying</p>
      <ul className="mt-3 space-y-2 pb-16">{list.map((q) => <li key={q.id}><Row q={q} /></li>)}{!list.length && <li className="py-10 text-center text-sm text-muted">Nothing here.</li>}</ul>
    </div>
  );
}
