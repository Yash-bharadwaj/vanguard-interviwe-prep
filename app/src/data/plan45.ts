export const FLOW = [
  { at: "0–5", name: "Intro", goal: "Set the frame: who you are + 2 threads he can pull (EDR async flow, Rule Builder).", do: ["60-second intro (Playbook)", "Mention AWS Developer Associate briefly", "End with 'Where would you like to start?'"], qs: [1, 72, 3, 5] },
  { at: "5–10", name: "Resume walkthrough & current role", goal: "Own the timeline (Uber → BluSapphire → freelance) calmly, including why you moved.", do: ["Uber in one breath, then BluSapphire as your depth", "Have the 'why Uber → now' answer ready", "Separate A–E ownership"], qs: [2, 4, 68, 185, 224, 206] },
  { at: "10–20", name: "Project deep dive", goal: "Show real depth in 1–2 projects with trade-offs and honest ownership.", do: ["Business problem → architecture → your part → trade-offs → lessons", "Offer to go deeper"], qs: [73, 98, 124, 130, 108, 96, 205] },
  { at: "20–32", name: "Technical questions", goal: "Java/Spring, AWS, API, SQL, event-driven, CI/CD — answer with why/why-not.", do: ["Use the answer structure", "Bridge from your experience to the unfamiliar (Kafka/K8s/Java)"], qs: [10, 12, 22, 27, 47, 48, 66] },
  { at: "32–40", name: "Architecture · troubleshooting · behavioral", goal: "Structured design + calm debugging + stories.", do: ["System-design framework", "Debugging method", "Anchors for behavioral"], qs: [55, 59, 62, 45, 213] },
  { at: "40–45", name: "Your questions", goal: "Signal curiosity and fit.", do: ["Ask 3 tailored questions", "Close with the summary"], qs: [] },
];
export interface Drive { start: string; path: string[]; note: string }
export const DRIVE: Drive[] = [
  { start: "He asks about EDR", path: ["Business problem (1 line)", "Architecture: two stacks", "MY ownership (console + integration)", "GraphQL/AppSync + subscription", "AWS choices & why", "Performance (sub-2s)", "Security/tenant isolation", "Trade-offs", "Lessons"], note: "Then offer: 'Want the async flow in detail?'" },
  { start: "He asks about Rule Builder", path: ["Requirements", "Architecture (wizard/Context)", "Schema-driven UI", "Recursive groups", "Validation + step gating", "JSON/SQL + REST create/edit/clone", "Auth/tenant", "Testing", "Trade-offs/what I'd change"], note: "Keep persistence answer to the verified version (C-RB-BACKEND)." },
  { start: "He asks about Spring Boot", path: ["State honest level in one sentence", "Explain layers/DI/transactions correctly", "Connect to REST contracts you consumed", "Bridge: security/JWT you integrated", "Say what you'd build first to deepen"], note: "Do not exaggerate; correctness + honesty wins." },
  { start: "He asks about Kafka", path: ["Honest: not in production", "Concepts: topics/partitions/consumer groups/offsets", "Compare to SNS/SQS/Firehose you used", "Delivery guarantees + idempotency", "Where you'd use it"], note: "Turn it into a design conversation." },
  { start: "He asks about Kubernetes/Docker", path: ["Docker: what you've done", "K8s concepts: pod/deployment/service/ingress/HPA", "Why you used Lambda/ECS-style alternatives", "Trade-offs"], note: "Never imply operating a cluster." },
  { start: "He asks about AWS", path: ["Pick a service you used", "Why + alternative", "Failure mode", "Cost/security", "How you'd monitor"], note: "This is your home ground — slow down and go deep." },
  { start: "He asks about REST/GraphQL/API design", path: ["Principles", "Your contracts (Rule Builder)", "Errors/idempotency/pagination/versioning", "GraphQL trade-offs", "Security"], note: "Use Uber integration details (auth, pagination, rate limits)." },
  { start: "He asks system design", path: ["Clarify requirements", "Estimates", "API", "Data model", "HLD", "Deep dive", "Failure", "Observability", "Security/tenancy", "Trade-offs"], note: "Think aloud; checkpoints every 2 minutes." },
  { start: "He asks about production issues", path: ["Situation & impact", "Method (scope→hypothesis→evidence)", "Root cause", "Fix + prevention", "Monitoring added"], note: "Use only a verified incident." },
  { start: "He asks 'why leaving Uber so soon?'", path: ["Calm, short, forward-looking", "No criticism", "Tie to role's scope", "Return to what you want to build"], note: "Write your real reason first." },
  { start: "He asks about AI tools", path: ["Your actual workflow", "Where they help", "Review discipline & tests", "Where they fail", "Security/privacy of code"], note: "JD standout — be concrete." },
];
export const ONE_DAY = {
  concepts: ["Async flow (SNS + AppSync subscription)", "REST vs GraphQL", "SNS vs SQS vs Kafka", "Lambda vs ECS vs EC2", "DynamoDB vs PostgreSQL", "JWT/AuthN vs AuthZ", "Idempotency", "Multi-tenancy layers", "CI/CD + deployment strategies", "Spring layers + DI"],
  stories: ["Async investigate flow", "Rule Builder", "Tenant isolation + presigned URLs", "Uber config-driven automation", "Debugging method", "Freelance lesson"],
  questions: [1, 2, 3, 4, 5, 72, 73, 98, 124, 130, 185, 206, 207, 211, 224, 96, 108, 205, 48, 55, 59, 12, 22],
  followups: ["Why not X?", "What if it fails?", "How would you scale 10×?", "How would you secure it?", "What exactly did YOU build?"],
  behavioral: ["Tell me about yourself", "Why Vanguard / why this role", "Why leaving Uber", "Failure/mistake", "Conflict", "Production issue"],
  architecture: ["Requirements→API→data→HLD→deep dive→failure→observability→security", "Sync vs async", "Caching", "Idempotency + retries", "Multi-tenancy"],
  interviewer: ["Spring Boot layers/DI/JWT", "Kafka honest bridge", "Docker/K8s honest", "CloudFormation/CDK/Terraform", "SQL indexing/N+1"],
};
