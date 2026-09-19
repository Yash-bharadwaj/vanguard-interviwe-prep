import { useEffect, useMemo, useState } from "react";
import { BookOpen, Home, Layers, Menu, Moon, Search, Sun, Swords } from "lucide-react";
import { useProgress } from "@/store/progress";
import { search, DOC_COUNT } from "@/lib/search";
import { byN, TOP_SET, SECTION_FILTER } from "@/data/bank";
import { Badge, Button, Input, Sheet } from "@/components/ui/primitives";
import { QuestionCard } from "@/components/QuestionCard";
import { QuestionList } from "@/components/QuestionList";
import Overview from "@/pages/Overview";
import { Profile, Interviewer, JdPage, Verify } from "@/pages/Know";
import Playbook from "@/pages/Playbook";
import Study from "@/pages/Study";
import { Projects, Anchors } from "@/pages/Projects";
import { WhyPage, Attack } from "@/pages/Why";
import Design from "@/pages/Design";
import Behavioral from "@/pages/Behavioral";
import Mock from "@/pages/Mock";
import Flashcards from "@/pages/Flashcards";
import { Plan, OneDay } from "@/pages/Plan";
import { RedFlags, Weak } from "@/pages/Safety";
import { H } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const GROUPS: { title: string; items: [string, string][] }[] = [
  { title: "Start here", items: [["overview", "Interview Overview"], ["verify", "Verify · source conflicts"], ["playbook", "Interviewer playbook"]] },
  { title: "Know the room", items: [["profile", "My Profile"], ["interviewer", "Interviewer"], ["jd", "Vanguard JD"]] },
  { title: "Interview flow — in order", items: [["bank", "Question Bank"], ["top", "Top Questions"], ["anchors", "Anchor stories"], ["projects", "Project Deep Dive"], ["java", "Java"], ["spring", "Spring Boot"], ["react", "React"], ["typescript", "TypeScript"], ["aws", "AWS"], ["graphql", "GraphQL"], ["rest", "REST APIs"], ["database", "Databases"], ["docker", "Docker"], ["cicd", "CI/CD"], ["design", "System Design"], ["behavioral", "Behavioral"]] },
  { title: "Sound experienced", items: [["why", "Why · Why-not"], ["attack", "Follow-up attack"], ["redflags", "Red flags · If I don't know"]] },
  { title: "Practice & revise", items: [["mock", "Mock Interview"], ["flashcards", "Flashcards"], ["plan", "45-Minute Plan"], ["oneday", "One-day mode"], ["weak", "Weak Areas"]] },
];
const LABEL = Object.fromEntries(GROUPS.flatMap((g) => g.items));

function Page({ route, go }: { route: string; go: (r: string) => void }) {
  const [base, arg] = route.split(":");
  switch (base) {
    case "overview": return <Overview go={go} />;
    case "verify": return <Verify />;
    case "playbook": return <Playbook />;
    case "profile": return <Profile />;
    case "interviewer": return <Interviewer />;
    case "jd": return <JdPage />;
    case "bank": return <div><H sub="All 224 questions and 644 follow-ups, in the order the interview will run. Original wording preserved; nothing merged.">Question Bank</H><QuestionList initial={arg ? { stage: arg } : undefined} /></div>;
    case "top": return <div><H sub="High-priority because the JD, his documented background and your resume overlap. Priority is an inference, not a prediction.">Top Questions</H><QuestionList filter={(q) => TOP_SET.has(q.n)} showStageFilter={false} /></div>;
    case "anchors": return <Anchors />;
    case "projects": return <Projects />;
    case "java": case "spring": case "react": case "typescript": case "aws": case "graphql": case "rest": case "database": case "docker": case "cicd": return <Study id={base} />;
    case "design": return <Design />;
    case "behavioral": return <Behavioral />;
    case "why": return <WhyPage />;
    case "attack": return <Attack />;
    case "redflags": return <RedFlags />;
    case "mock": return <Mock />;
    case "flashcards": return <Flashcards />;
    case "plan": return <Plan />;
    case "oneday": return <OneDay />;
    case "weak": return <Weak />;
    default: return <Overview go={go} />;
  }
}

export default function App() {
  const [route, setRoute] = useState(() => location.hash.slice(1) || "overview");
  const [menu, setMenu] = useState(false); const [sq, setSq] = useState(""); const [openQ, setOpenQ] = useState<number | null>(null);
  const dark = useProgress((s) => s.dark); const toggleDark = useProgress((s) => s.toggleDark);
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  useEffect(() => { const h = () => setRoute(location.hash.slice(1) || "overview"); addEventListener("hashchange", h); return () => removeEventListener("hashchange", h); }, []);
  useEffect(() => { const k = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); document.getElementById("gsearch")?.focus(); } }; addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, []);
  const go = (r: string) => { location.hash = r; setMenu(false); setSq(""); scrollTo(0, 0); document.getElementById("main")?.scrollTo(0, 0); };
  const hits = useMemo(() => search(sq), [sq]);
  const base = route.split(":")[0];
  const nav = (mobile = false) => GROUPS.map((g) => (
    <div key={g.title} className="mb-4">
      <div className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted">{g.title}</div>
      {g.items.map(([id, label]) => <button key={id} onClick={() => go(id)} className={cn("block w-full cursor-pointer rounded-md px-2 py-1.5 text-left text-sm hover:bg-soft", base === id && "bg-soft font-medium", mobile && "py-2.5")}>{label}</button>)}
    </div>
  ));
  return (
    <div className="flex h-full">
      <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-line bg-card px-3 py-4 md:block">
        <div className="mb-4 px-2"><div className="text-sm font-semibold">Vanguard AE-II · Interview OS</div><div className="text-xs text-muted">22 Sep 2026 · Avinash</div></div>{nav()}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="z-30 flex items-center gap-2 border-b border-line bg-bg/95 px-4 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] backdrop-blur">
          <Search className="h-4 w-4 shrink-0 text-muted" />
          <Input id="gsearch" className="border-0 bg-transparent px-1 focus:border-0" placeholder={`Search all ${DOC_COUNT} items — dynamodb, graphql, Avinash, Kafka, Rule Builder…  (Ctrl/⌘-K)`} value={sq} onChange={(e) => setSq(e.target.value)} />
          <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggleDark}>{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</Button>
        </header>
        {sq.trim().length >= 2 && (
          <div className="absolute inset-x-0 top-[57px] z-40 mx-auto max-h-[70vh] max-w-3xl overflow-y-auto rounded-b-lg border border-line bg-card p-2 shadow-lg md:left-64 md:right-0">
            {hits.length === 0 && <div className="p-4 text-sm text-muted">No results.</div>}
            {hits.map((h) => (
              <button key={h.id} className="block w-full cursor-pointer rounded-md p-2 text-left hover:bg-soft" onClick={() => { if (h.qn && byN.get(h.qn)) { setOpenQ(h.qn); setSq(""); } else go(String(h.route)); }}>
                <div className="flex items-center gap-2"><Badge>{String(h.kind)}</Badge><span className="truncate text-sm font-medium">{String(h.title)}</span></div>
                <div className="line-clamp-1 text-xs text-muted">{String(h.body).slice(0, 160)}</div>
              </button>
            ))}
          </div>
        )}
        <main id="main" className="min-w-0 flex-1 overflow-y-auto px-4 pb-24 pt-5 md:px-8 md:pb-10">
          <div className="mx-auto max-w-4xl"><Page route={route} go={go} /></div>
        </main>
        <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
          {([["overview", Home, "Home"], ["bank", BookOpen, "Bank"], ["mock", Swords, "Mock"], ["flashcards", Layers, "Cards"]] as const).map(([id, Icon, l]) => (
            <button key={id} onClick={() => go(id)} className={cn("flex flex-1 cursor-pointer flex-col items-center gap-0.5 py-2 text-[11px] text-muted", base === id && "text-fg")}><Icon className="h-5 w-5" />{l}</button>
          ))}
          <button onClick={() => setMenu(true)} className="flex flex-1 cursor-pointer flex-col items-center gap-0.5 py-2 text-[11px] text-muted"><Menu className="h-5 w-5" />Menu</button>
        </nav>
      </div>
      <Sheet open={menu} onOpenChange={setMenu} title="Menu"><div className="p-3">{nav(true)}</div></Sheet>
      <Sheet open={openQ !== null} onOpenChange={(o) => !o && setOpenQ(null)} title={openQ ? `Q${openQ}` : ""}>{openQ && byN.get(openQ) && <QuestionCard q={byN.get(openQ)!} onOpen={(n) => setOpenQ(n)} />}</Sheet>
    </div>
  );
}
export const _sf = SECTION_FILTER; export const _lbl = LABEL;
