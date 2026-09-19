import { BANK, SECTION_FILTER } from "@/data/bank";
import { STATUS_WEIGHT, useProgress, type Status } from "@/store/progress";
import type { Q } from "@/data/types";
export function pct(status: Record<string, Status>, f: (q: Q) => boolean) {
  const qs = BANK.filter(f); if (!qs.length) return 0;
  return Math.round((100 * qs.reduce((s, q) => s + STATUS_WEIGHT[status[q.id] ?? "not-started"], 0)) / qs.length);
}
export const AREAS: [string, string][] = [["Overall", "all"], ["Technical", "technical"], ["Project", "project"], ["Behavioral", "behavioral"], ["System design", "design"], ["AWS", "aws"], ["Java", "java"], ["React", "react"], ["API", "rest"], ["Database", "database"]];
export const useAreaPct = () => { const status = useProgress((s) => s.status); return (k: string) => pct(status, k === "all" ? () => true : SECTION_FILTER[k]); };
