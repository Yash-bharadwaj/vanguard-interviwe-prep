import raw from "./bank.json";
import type { Q, Cat } from "./types";
import { KITS_A } from "./kits-a";
import { KITS_B } from "./kits-b";
import { KITS_C } from "./kits-c";
import type { Kit } from "./kit-types";
import { ONE_DAY } from "./plan45";
import { WHY } from "./why";
import { AWS } from "./study";

export const BANK = raw as unknown as Q[];
export const KITS: Record<number, Kit> = Object.fromEntries([...KITS_A, ...KITS_B, ...KITS_C].map((k) => [k.n, k]));
export const TOP_SET = new Set<number>(ONE_DAY.questions);
export const byN = new Map(BANK.map((q) => [q.n, q]));

export type Pri = "high" | "medium" | "low";
export const priorityOf = (q: Q): Pri => (TOP_SET.has(q.n) || q.score >= 17 ? "high" : q.score >= 13 ? "medium" : "low");

export const STAGES: Record<number, string> = { 1: "Intro (0–5 min)", 2: "Resume & current role (5–10)", 3: "Project deep dive (10–20)", 4: "Technical (20–32)", 5: "Architecture · troubleshooting · behavioral (32–40)" };

export const CAT_LABEL: Record<Cat, string> = { behavioral: "Behavioral", "project-edr": "EDR project", "project-rulebuilder": "Rule Builder", spring: "Spring Boot", java: "Java", typescript: "TypeScript", graphql: "GraphQL", aws: "AWS", "docker-devops": "Docker / CI-CD", database: "Databases", security: "Security", observability: "Observability", "testing-agile": "Testing / Agile", rest: "REST / API", "system-design": "System design", react: "React", general: "General" };

/** Section membership for sidebar pages / progress buckets (tags are multi-valued, so a question can belong to several). */
export const SECTION_FILTER: Record<string, (q: Q) => boolean> = {
  java: (q) => q.cat === "java" || q.tags.includes("java"),
  spring: (q) => q.cat === "spring" || q.tags.includes("spring"),
  react: (q) => q.cat === "react" || q.tags.includes("react"),
  typescript: (q) => q.cat === "typescript" || q.tags.includes("typescript"),
  aws: (q) => q.cat === "aws" || q.tags.includes("aws") || q.tags.includes("event"),
  graphql: (q) => q.cat === "graphql" || q.tags.includes("graphql"),
  rest: (q) => q.cat === "rest" || q.tags.includes("rest"),
  database: (q) => q.cat === "database" || q.tags.includes("database") || q.tags.includes("dynamodb"),
  docker: (q) => q.tags.includes("docker") || q.tags.includes("k8s") || q.cat === "docker-devops",
  cicd: (q) => q.tags.includes("cicd"),
  design: (q) => q.cat === "system-design" || q.tags.includes("system-design"),
  behavioral: (q) => q.cat === "behavioral",
  project: (q) => q.cat === "project-edr" || q.cat === "project-rulebuilder",
  technical: (q) => q.cat !== "behavioral",
  security: (q) => q.cat === "security" || q.tags.includes("security"),
};

export const whyFor = (q: Q) => WHY.filter((w) => q.tags.includes(w.tag)).slice(0, 4);
const svcByTag: Record<string, string> = { dynamodb: "DynamoDB", event: "SNS", graphql: "AppSync", aws: "Lambda", security: "IAM", observability: "CloudWatch" };
export const drillFor = (q: Q) => {
  const names = [...new Set(q.tags.map((t) => svcByTag[t]).filter(Boolean))].slice(0, 2);
  return AWS.filter((s) => names.includes(s.name));
};
