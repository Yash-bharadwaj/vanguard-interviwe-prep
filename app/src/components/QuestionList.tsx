import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Q } from "@/data/types";
import { BANK, byN, priorityOf, CAT_LABEL, STAGES, KITS } from "@/data/bank";
import { Badge, Input, Sheet, Button } from "@/components/ui/primitives";
import { QuestionCard, PriBadge, StatusPill, ConflictChips } from "@/components/QuestionCard";
import { useProgress } from "@/store/progress";
import { cn } from "@/lib/utils";

export function QuestionList({ filter, showStageFilter = true, initial }: { filter?: (q: Q) => boolean; showStageFilter?: boolean; initial?: Partial<{ pri: string; stage: string }> }) {
  const [text, setText] = useState(""); const [pri, setPri] = useState(initial?.pri ?? "all"); const [stage, setStage] = useState(initial?.stage ?? "all"); const [st, setSt] = useState("all"); const [scripted, setScripted] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const status = useProgress((s) => s.status); const weak = useProgress((s) => s.weak); const bm = useProgress((s) => s.bookmarks);
  const list = useMemo(() => {
    const t = text.trim().toLowerCase();
    return BANK.filter((q) => (!filter || filter(q)) &&
      (pri === "all" || priorityOf(q) === pri) && (stage === "all" || String(q.stage) === stage) &&
      (st === "all" || (st === "weak" ? weak[q.id] : st === "bookmarked" ? bm[q.id] : (status[q.id] ?? "not-started") === st)) &&
      (!scripted || KITS[q.n]) &&
      (!t || `Q${q.n} ${q.q} ${q.a} ${q.tags.join(" ")} ${q.fu.map((f) => f.q + " " + f.a).join(" ")}`.toLowerCase().includes(t))
    ).sort((a, b) => a.seq - b.seq);
  }, [filter, text, pri, stage, st, scripted, status, weak, bm]);
  const idx = open === null ? -1 : list.findIndex((q) => q.n === open);
  const cur = open === null ? undefined : byN.get(open);
  const touch = useRef<number | null>(null);
  const go = (d: number) => { const n = list[idx + d]; if (n) setOpen(n.n); };
  const sel = "h-9 max-w-full min-w-0 rounded-md border border-line bg-card px-2 text-sm";
  return (
    <div>
      <div className="sticky top-0 z-20 -mx-4 space-y-2 border-b border-line bg-bg/95 px-4 py-2 backdrop-blur md:-mx-8 md:px-8">
        <Input placeholder="Search questions, answers, follow-ups, tech…" value={text} onChange={(e) => setText(e.target.value)} />
        <div className="flex flex-wrap gap-2">
          <select className={sel} value={pri} onChange={(e) => setPri(e.target.value)} aria-label="Priority"><option value="all">Any priority</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select>
          {showStageFilter && <select className={sel} value={stage} onChange={(e) => setStage(e.target.value)} aria-label="Interview stage"><option value="all">All stages</option>{Object.entries(STAGES).map(([k, v]) => <option key={k} value={k}>{k} · {v}</option>)}</select>}
          <select className={sel} value={st} onChange={(e) => setSt(e.target.value)} aria-label="Status"><option value="all">Any status</option><option value="not-started">Not started</option><option value="learning">Learning</option><option value="practiced">Practiced</option><option value="confident">Confident</option><option value="weak">Flagged weak</option><option value="bookmarked">Bookmarked</option></select>
          <label className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={scripted} onChange={(e) => setScripted(e.target.checked)} />Spoken answer written</label>
          <span className="self-center text-xs text-muted">{list.length} shown · interview order</span>
        </div>
      </div>
      <ul className="mt-3 space-y-2">
        {list.map((q) => (
          <li key={q.id}>
            <button onClick={() => setOpen(q.n)} className="w-full cursor-pointer rounded-lg border border-line bg-card p-3 text-left hover:bg-soft">
              <div className="mb-1 flex flex-wrap items-center gap-1.5"><PriBadge q={q} /><Badge>{CAT_LABEL[q.cat]}</Badge>{KITS[q.n] && <Badge tone="ok">scripted</Badge>}{q.ey && <Badge tone="warn">EY</Badge>}<ConflictChips ids={q.conflicts.slice(0, 1)} /><span className="ml-auto"><StatusPill id={q.id} /></span></div>
              <div className="text-sm font-medium">Q{q.n}: {q.q}</div>
              <div className="mt-0.5 line-clamp-2 text-xs text-muted">{q.short30}</div>
            </button>
          </li>
        ))}
        {!list.length && <li className="py-10 text-center text-sm text-muted">Nothing matches these filters.</li>}
      </ul>
      <Sheet open={open !== null} onOpenChange={(o) => !o && setOpen(null)} title={cur ? `Q${cur.n} · ${idx + 1} of ${list.length}` : ""} actions={<><Button size="icon" variant="outline" disabled={idx <= 0} onClick={() => go(-1)} aria-label="Previous question"><ChevronLeft className="h-4 w-4" /></Button><Button size="icon" variant="outline" disabled={idx >= list.length - 1} onClick={() => go(1)} aria-label="Next question"><ChevronRight className="h-4 w-4" /></Button></>}>
        {cur && (
          <div onTouchStart={(e) => (touch.current = e.touches[0].clientX)} onTouchEnd={(e) => { if (touch.current === null) return; const dx = e.changedTouches[0].clientX - touch.current; if (Math.abs(dx) > 90) go(dx < 0 ? 1 : -1); touch.current = null; }}>
            <QuestionCard q={cur} onOpen={(n) => setOpen(n)} />
          </div>
        )}
      </Sheet>
    </div>
  );
}
