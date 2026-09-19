import type { Own } from "./types";
export const INTERVIEW = { company: "Vanguard India", city: "Hyderabad, Telangana", role: "Application Engineer II", date: "2026-09-22T00:00:00+05:30", dateLabel: "22 September 2026", duration: "≈45 minutes", interviewer: "Chinnam Avinash" };

export const SUMMARY = {
  strongest: [
    "EDR OneAgent console: async investigate flow (startEdrAsyncQuery → SNS → onEdrAsyncQueryResponse subscription, DuckDB over S3 Parquet) — a real, specific, checkable event-driven story.",
    "Rule Builder: six-step wizard, step gating, visual query builder generating SQL + JSON, REST create/edit/clone, Lookup Lists with CRUD + CSV.",
    "Secure presigned-S3 agent download for org-specific installers (multi-tenant distribution).",
    "AWS breadth with certification: Lambda, API Gateway, AppSync, DynamoDB, S3, CloudFront, SNS, Firehose, IAM, CDK.",
    "Integration mindset: contracts, validation, retries, pagination, reconciliation (BluSapphire + Uber data-hydration work).",
    "Requirement analysis + client communication from freelance work.",
  ],
  risks: [
    "Java / Spring Boot depth: resume headline says Java | Spring Boot, but your real production work is React/TS + AWS serverless. The interviewer is a 12+ year Java full-stack lead.",
    "Kafka and Kubernetes: both JD standouts AND on the interviewer's resume — neither is on yours.",
    "Angular: JD prefers it; your resume is React-only.",
    "Uber (May 2026 – present) is 4 months old and absent from the question bank: 'why leaving so soon?'.",
    "Bank contradictions (auth story, Rule Builder backend, metrics) — see Verify page. One inconsistency in the room costs more than one 'I don't know'.",
    "Ownership: 'built' vs 'integrated' on Lambda/DynamoDB/AppSync backends.",
  ],
  overlap: [
    "Java + Spring Boot + Angular/React full-stack (his headline) ↔ JD backend + frontend.",
    "AWS Lambda/serverless/CloudWatch/CloudFormation/Terraform/migration (his) ↔ your AWS certs + CDK + serverless.",
    "REST/SOAP/Swagger/Kong API management (his) ↔ JD API design + your REST/GraphQL contracts.",
    "Kafka + JMS + ETL/data integration (his) ↔ JD event-driven + your SNS/Firehose/Parquet pipeline.",
    "Oracle SQL / PL-SQL and 30% DB tuning with caching (his) ↔ JD relational + your SQL/index design and DuckDB.",
    "CI/CD, Docker, Kubernetes, Jenkins/CodePipeline (his) ↔ JD CI/CD + Docker/K8s.",
    "Monitoring/troubleshooting: CloudWatch, New Relic, Prometheus (his) ↔ JD observability + your SLO/dashboard/Splunk work.",
  ],
  emphasise: [
    "Async investigate flow (event-driven, GraphQL subscription, S3 Parquet, DuckDB).",
    "Rule Builder as a contract-driven design (schema → validated JSON → REST) with clear trade-offs.",
    "Multi-tenant isolation + presigned URLs (security with concrete mechanisms).",
    "AWS certified + hands-on with 10+ services; CDK for IaC.",
    "Debugging across AWS/legacy from logs + dashboards + playbooks (Uber + BluSapphire).",
    "Config-driven tooling at Uber (JSON/YAML configs, retries, alerting).",
  ],
  careful: [
    "Any number not on the resume (60fps, 97%, 1.8MB→400KB, ₹18 Lakhs, 12–15 team).",
    "Cognito (never supported in code-derived answers). Kafka. Kubernetes. Terraform. Angular production use.",
    "'I built the backend' — say 'I integrated with / contributed to' unless it is truly yours.",
    "Rule Builder → Lambda → DynamoDB. Use the REST/FastAPI/Keycloak version unless you verify otherwise.",
    "Everything with 'EY' in it.",
  ],
};

export const OWNERSHIP: { area: string; own: Own[]; safe: string; verify?: boolean }[] = [
  { area: "EDR console UI (agents, zones, policies, alerts, MITRE page, raw events)", own: ["A"], safe: "I built the console UI and the data-fetching layer behind it." },
  { area: "GraphQL queries/mutations + Apollo Client config", own: ["A", "B"], safe: "I designed the operations the console used and wired them through Apollo; the schema/resolvers sat with the backend team." },
  { area: "AppSync resolvers / Lambda handlers", own: ["C"], safe: "I worked with backend engineers on resolver logic and reviewed the Lambda code; they owned the handlers.", verify: true },
  { area: "Async investigate flow (mutation → SNS → subscription)", own: ["A", "C"], safe: "I implemented the client side and flow integration (mutation, requestId subscription, progressive results); the worker Lambda + DuckDB were backend-owned.", verify: true },
  { area: "DuckDB / Parquet / Dragonfly file index", own: ["E", "D"], safe: "I understand the pipeline and consumed its results; the data platform team built it." },
  { area: "Presigned S3 agent-download workflow", own: ["A", "C"], safe: "I designed the download workflow with the backend (Lambda issues the URL; console redirects).", verify: true },
  { area: "S3 + CloudFront static deployment, code splitting, virtualized rendering", own: ["A", "C"], safe: "I owned the frontend build and deploy; infra was shared with DevOps." },
  { area: "Auth: Stytch / Keycloak / Lambda authorizer / tenant isolation", own: ["C", "E"], safe: "I integrated the login/session flow and enforced org scoping in the UI; the identity provider setup and authorizer were platform-owned.", verify: true },
  { area: "DynamoDB single-table schema", own: ["E", "D"], safe: "I understand the design and the access patterns; the backend team designed the table." },
  { area: "Rule Builder wizard, step gating, validation, query builder, payloads", own: ["A"], safe: "I built the whole UI: wizard, validation, visual query builder, and the REST integration." },
  { area: "Rule Builder REST backend / FastAPI Flink-query generation", own: ["B", "E"], safe: "I consumed those APIs and agreed the contracts; the backend team owned them.", verify: true },
  { area: "Lookup Lists CRUD + CSV upload UI", own: ["A"], safe: "I delivered the module end to end on the UI/integration side." },
  { area: "CI/CD pipelines", own: ["C"], safe: "I worked within the pipeline and maintained the frontend build steps; DevOps owned pipeline infra." },
  { area: "Uber: JS automation scripts, API/data hydration, config-driven tooling", own: ["A"], safe: "This is mine day-to-day: scripts, integrations, retries, validation and configs." },
  { area: "Java / Spring Boot services", own: ["D", "B"], safe: "Read/reviewed and integrated with them; built REST + JPA + Security in personal projects; not owned in production.", verify: true },
  { area: "Kafka, Kubernetes, Terraform/CloudFormation, Angular (production)", own: ["D"], safe: "Conceptual only — say so, then bridge to SNS/Firehose, Docker/ECS, CDK and React." },
];
