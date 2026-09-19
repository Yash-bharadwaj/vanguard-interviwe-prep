export type Cat = "behavioral" | "project-edr" | "project-rulebuilder" | "spring" | "java" | "typescript" | "graphql" | "aws" | "docker-devops" | "database" | "security" | "observability" | "testing-agile" | "rest" | "system-design" | "react" | "general";
export interface FU { n: number; id: string; q: string; a: string; cat: Cat; tags: string[]; short30: string; conflicts: string[]; claims: string[]; ey: boolean }
export interface Rel { n: number; kind: "identical" | "near-identical" | "same-topic" }
export interface Q {
  n: number; id: string; q: string; a: string; cat: Cat; tags: string[]; layer: "A" | "B"; score: number;
  difficulty: "easy" | "medium" | "hard"; short30: string; jd: string[]; iv: string[]; resumeTrigger: string[];
  whyAsk: string; testing: string; conflicts: string[]; claims: string[]; ey: boolean; conflictsInFollowups: string[];
  fu: FU[]; related: Rel[]; preferred?: number; stage: number; seq: number;
}
export type Own = "A" | "B" | "C" | "D" | "E";
export const OWN_LABEL: Record<Own, string> = {
  A: "A · I personally built", B: "B · I integrated with", C: "C · I collaborated on with backend/DevOps", D: "D · I understand conceptually", E: "E · The team built",
};
export type Evidence = "strong" | "moderate" | "transferable" | "gap" | "not-demonstrated";
export const EVIDENCE_LABEL: Record<Evidence, string> = { strong: "1 · Strong evidence", moderate: "2 · Moderate evidence", transferable: "3 · Transferable", gap: "4 · Potential gap", "not-demonstrated": "5 · Not demonstrated" };
