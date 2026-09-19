import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Status = "not-started" | "learning" | "practiced" | "confident";
export const STATUS_ORDER: Status[] = ["not-started", "learning", "practiced", "confident"];
export const STATUS_LABEL: Record<Status, string> = { "not-started": "Not started", learning: "Learning", practiced: "Practiced", confident: "Confident" };
export const STATUS_WEIGHT: Record<Status, number> = { "not-started": 0, learning: 0.33, practiced: 0.66, confident: 1 };

interface MockRecord { at: number; id: string; q: string; answer: string; score: number }
interface State {
  status: Record<string, Status>;
  notes: Record<string, string>;
  practice: Record<string, string>;
  bookmarks: Record<string, boolean>;
  weak: Record<string, boolean>;
  mock: MockRecord[];
  dark: boolean;
  verified: Record<string, boolean>;
  setStatus: (id: string, s: Status) => void;
  cycle: (id: string) => void;
  setNote: (id: string, t: string) => void;
  setPractice: (id: string, t: string) => void;
  toggleBookmark: (id: string) => void;
  toggleWeak: (id: string) => void;
  addMock: (r: MockRecord) => void;
  toggleDark: () => void;
  toggleVerified: (id: string) => void;
  reset: () => void;
}
export const useProgress = create<State>()(
  persist(
    (set, get) => ({
      status: {}, notes: {}, practice: {}, bookmarks: {}, weak: {}, mock: [], verified: {},
      dark: typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches,
      setStatus: (id, s) => set((st) => ({ status: { ...st.status, [id]: s } })),
      cycle: (id) => { const cur = get().status[id] ?? "not-started"; const nx = STATUS_ORDER[(STATUS_ORDER.indexOf(cur) + 1) % 4]; set((st) => ({ status: { ...st.status, [id]: nx } })); },
      setNote: (id, t) => set((st) => ({ notes: { ...st.notes, [id]: t } })),
      setPractice: (id, t) => set((st) => ({ practice: { ...st.practice, [id]: t } })),
      toggleBookmark: (id) => set((st) => ({ bookmarks: { ...st.bookmarks, [id]: !st.bookmarks[id] } })),
      toggleWeak: (id) => set((st) => ({ weak: { ...st.weak, [id]: !st.weak[id] } })),
      addMock: (r) => set((st) => ({ mock: [r, ...st.mock].slice(0, 200) })),
      toggleDark: () => set((st) => ({ dark: !st.dark })),
      toggleVerified: (id) => set((st) => ({ verified: { ...st.verified, [id]: !st.verified[id] } })),
      reset: () => set({ status: {}, notes: {}, practice: {}, bookmarks: {}, weak: {}, mock: [], verified: {} }),
    }),
    { name: "vanguard-interview-os-v1" }
  )
);
