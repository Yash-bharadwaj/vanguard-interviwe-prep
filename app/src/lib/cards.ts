import { BANK, KITS, priorityOf } from "@/data/bank";
import { WHY } from "@/data/why";
import { WHY_SAY } from "@/data/spoken";
import { AWS, JAVA, SPRING } from "@/data/study";

export interface Card { id: string; group: string; front: string; back: string; deeper: string; follow: string }
/** Flashcards: front = question, back = 30-second answer, deeper = 2-minute answer, follow = likely challenge. */
export const CARDS: Card[] = [];
Object.values(KITS).forEach((k) => {
  const q = BANK.find((x) => x.n === k.n)!;
  CARDS.push({ id: `k${k.n}`, group: q.cat, front: q.q, back: k.s30, deeper: k.s120, follow: k.follows[0] ? `${k.follows[0].q} — ${k.follows[0].a}` : q.fu[0] ? q.fu[0].q : "—" });
});
WHY.forEach((w) => CARDS.push({ id: `w-${w.id}`, group: "why", front: w.q, back: WHY_SAY[w.id]?.split(" The trade-off")[0] ?? w.because, deeper: WHY_SAY[w.id] ?? `${w.because} ${w.tradeoff} ${w.redesign}`, follow: "Why not the alternative? What would you change today?" }));
AWS.forEach((s) => CARDS.push({ id: `a-${s.name}`, group: "aws", front: `${s.name}: why use it, and what can go wrong?`, back: `${s.why} ${s.trade}`, deeper: `How I used it: ${s.how} Scaling: ${s.scale} Security: ${s.sec} Failure modes: ${s.fail} Monitoring: ${s.mon}`, follow: s.fu }));
[...JAVA, ...SPRING].forEach((c, i) => CARDS.push({ id: `j${i}`, group: i < JAVA.length ? "java" : "spring", front: c.t, back: c.say, deeper: c.say, follow: c.fu ?? "Can you give a small code example?" }));
export const priCount = () => BANK.filter((q) => priorityOf(q) === "high").length;
