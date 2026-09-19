import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useProgress } from "@/store/progress";
import Questions from "@/pages/Questions";
import Mock from "@/pages/Mock";
import Flashcards from "@/pages/Flashcards";
import { WhyPage } from "@/pages/Why";
import Design from "@/pages/Design";
import { cn } from "@/lib/utils";

const TABS: [string, string][] = [["questions", "Questions"], ["mock", "Mock"], ["cards", "Flashcards"], ["why", "Why / Why-not"], ["design", "System design"]];

export default function App() {
  const [tab, setTab] = useState(() => (TABS.some(([k]) => k === location.hash.slice(1)) ? location.hash.slice(1) : "questions"));
  const dark = useProgress((s) => s.dark); const toggleDark = useProgress((s) => s.toggleDark);
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  const go = (k: string) => { setTab(k); location.hash = k; document.getElementById("main")?.scrollTo(0, 0); };
  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-line bg-bg px-4 pt-[max(0.5rem,env(safe-area-inset-top))] md:px-8">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <nav className="flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none]">
            {TABS.map(([k, l]) => <button key={k} onClick={() => go(k)} className={cn("shrink-0 cursor-pointer border-b-2 px-3 py-3 text-sm", tab === k ? "border-fg font-medium" : "border-transparent text-muted hover:text-fg")}>{l}</button>)}
          </nav>
          <button onClick={toggleDark} aria-label="Toggle theme" className="cursor-pointer rounded-md p-2 hover:bg-soft">{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
        </div>
      </header>
      <main id="main" className="min-w-0 flex-1 overflow-y-auto px-4 pb-10 pt-0 md:px-8">
        <div className="mx-auto max-w-3xl py-4">
          {tab === "questions" && <Questions />}
          {tab === "mock" && <Mock />}
          {tab === "cards" && <Flashcards />}
          {tab === "why" && <WhyPage />}
          {tab === "design" && <Design />}
        </div>
      </main>
    </div>
  );
}
