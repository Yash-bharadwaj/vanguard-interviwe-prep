/** Heuristic (rule-based) mock feedback. It is NOT an AI judge: it checks coverage of key points and speaking habits. */
export interface Feedback { score: number; good: string[]; missing: string[]; accuracy: string; why: boolean; tradeoffs: boolean; ownership: string; words: number; length: string }
const has = (t: string, rx: RegExp) => rx.test(t);
export function grade(answer: string, key: string[]): Feedback {
  const t = answer.toLowerCase();
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  const hit = key.filter((k) => t.includes(k.toLowerCase()));
  const miss = key.filter((k) => !t.includes(k.toLowerCase()));
  const why = has(t, /\b(because|the reason|so that|we chose|we picked|that's why|which is why|in order to)\b/);
  const trade = has(t, /trade-?off|downside|the cost|drawback|however|whereas|on the other hand|alternative|would also work|limitation/);
  const over = has(t, /i (built|wrote|designed) (the )?(entire|whole|complete|all of the) (backend|back-end|lambda|infrastructure)|i did everything|sole (developer|owner)/);
  const owns = has(t, /what i (personally )?(handled|owned|built)|i personally|my part|the (backend|platform) team|worked with (the )?backend|i integrated|i contributed/);
  const good: string[] = [];
  if (hit.length) good.push(`Covered key points: ${hit.join(", ")}.`);
  if (why) good.push("You explained WHY (reasoning words present).");
  if (trade) good.push("You mentioned trade-offs or alternatives.");
  if (owns) good.push("You separated your ownership from the team's.");
  if (words >= 60 && words <= 260) good.push("Good spoken length (about 30–120 seconds).");
  const missing: string[] = [];
  if (miss.length) missing.push(`Not mentioned: ${miss.join(", ")}.`);
  if (!why) missing.push("Say WHY: 'Because…', 'The reason we chose that was…'.");
  if (!trade) missing.push("Add a trade-off or the alternative you didn't pick.");
  if (!owns && !over) missing.push("State what YOU handled versus the team.");
  if (words < 40) missing.push("Too short — add an example from your work.");
  const length = words < 40 ? "Too short" : words > 300 ? "Too long — give a headline first, then offer to go deeper" : "Good";
  const cov = key.length ? hit.length / key.length : 0.5;
  const score = Math.round(100 * (0.5 * cov + 0.15 * +why + 0.15 * +trade + 0.1 * +(owns && !over) + 0.1 * +(words >= 40 && words <= 300)));
  return { score, good, missing, accuracy: key.length ? `${hit.length}/${key.length} key points` : "No key-point list for this question — compare against the ideal answer", why, tradeoffs: trade, ownership: over ? "⚠ Possible over-claim of backend ownership" : owns ? "✓ Ownership stated clearly" : "Not stated", words, length };
}
