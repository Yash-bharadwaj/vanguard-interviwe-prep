export const IV_FACTS = {
  name: "Chinnam Avinash",
  headline: "Seasoned Java Fullstack technical lead and Technical manager with 12+ years of experience working in Italy and India (as printed).",
  shownTitle: "Manager (EY heading on the profile — NOT confirmed as his current Vanguard role)",
  skillsShown: ["API Development", "AWS CloudFormation", "Angular CLI", "Apache Kafka", "Back End Design", "Business Operations", "Cloud Computing", "Core Java", "Data Integration", "Deployment"],
};

export interface IvSkill { skill: string; evidence: string; level: "core" | "strong" | "supporting"; mine: string; jd: string }
export const IV_SKILLS: IvSkill[] = [
  { skill: "Java / Core Java / Spring Boot", level: "core", evidence: "Headline 'Java Fullstack technical lead'; 'Java, Spring Boot, AngularJS, React'; Java SE/EE, JMS; Java Developer at Amazon Development Centre.", mine: "Read/reviewed/integrated; personal Spring projects. Weakest match to his depth.", jd: "Java and/or Node.js backend" },
  { skill: "Full-stack: AngularJS / Angular CLI / React / jQuery+Ajax", level: "core", evidence: "'AngularJS, React'; 'Angular CLI'; 'JQuery & Ajax are used intensely'.", mine: "React/TS strong; Angular = ramp-up story.", jd: "Angular preferred, or React" },
  { skill: "API development & management (REST, SOAP, Kong, Swagger/OpenAPI, WS-Security, UDDI, SOA governance)", level: "core", evidence: "'Hands-on with API management tools such as Kong and Swagger/OpenAPI'; 'REST, SOAP, UDDI, WS-Security, SOA Governance'.", mine: "REST + GraphQL contracts, validation, payload alignment; Uber API integration (auth, pagination, rate limits).", jd: "API design and integration, REST/GraphQL" },
  { skill: "Apache Kafka / JMS / messaging", level: "strong", evidence: "'Apache Kafka' in Other Skills; JMS in experience.", mine: "SNS, Firehose, async patterns (real); Kafka not used.", jd: "Confluent Kafka / event-driven (standout)" },
  { skill: "AWS: EC2, Lambda, serverless, CloudWatch, migration on-prem→AWS", level: "core", evidence: "'DevOps engineer with almost 5 years … AWS, EC2, Lambda, K8S'; 'serverless architecture … data tools'; 'migrations from on-premise to AWS'.", mine: "Lambda/API GW/AppSync/S3/DynamoDB/SNS + 2 AWS certs; no migration lead.", jd: "AWS" },
  { skill: "IaC: CloudFormation, Terraform, Ansible", level: "strong", evidence: "'Strong at handling IaC with CloudFormation and Terraform'; 'Jenkins, CodePipeline, and Ansible'.", mine: "CDK on resume (concept transfer); no Terraform claim.", jd: "CI/CD, infrastructure fundamentals" },
  { skill: "CI/CD: Jenkins, CodePipeline", level: "strong", evidence: "'automation tools like Jenkins, Codepipeline, and Ansible'; 'solid knowledge of CI/CD pipelines'.", mine: "GitHub/Azure DevOps pipelines; frontend build/deploy.", jd: "CI/CD" },
  { skill: "Docker / Kubernetes / microservices", level: "strong", evidence: "'Led a team of 3 developers … cloud-based microservices architecture using Java, Docker, and Kubernetes'.", mine: "Docker (basic-to-good); Kubernetes = gap.", jd: "Docker/Kubernetes" },
  { skill: "Databases: Oracle SQL/PL-SQL, MySQL, SQL Server; query tuning + caching (30%)", level: "strong", evidence: "'Optimized database queries … improved performance by 30% … caching mechanisms'; 'PL/SQL stored procedures'.", mine: "SQL design/indexing, DynamoDB, DuckDB; no PL/SQL.", jd: "Relational and NoSQL; data modelling" },
  { skill: "Data integration / ETL / middleware (Talend, MuleSoft, Salesforce, SFTP, batch)", level: "supporting", evidence: "'Talend Cloud ESB, Talend ETL … Batch jobs, Real time transactions'; 'SFTP servers'; 'MuleSoft'; 'ETL workflows'.", mine: "Firehose→Parquet pipeline exposure; Uber data hydration + reconciliation; CSV upload.", jd: "Data pipelines / integration" },
  { skill: "Monitoring & troubleshooting: CloudWatch, New Relic, Prometheus", level: "strong", evidence: "'monitoring performance and troubleshooting issues in real-time environments'; 'CloudWatch, New Relic, and Prometheus'.", mine: "Dashboards/SLOs, Splunk, Log4j2, playbooks; CloudWatch usage.", jd: "Monitoring, logging, observability, production troubleshooting" },
  { skill: "Team leadership, mentoring, code reviews, requirements", level: "supporting", evidence: "'Led a team of 3'; 'Mentored junior developers'; 'thorough code reviews'; 'analyse and define project requirements'.", mine: "Mentored 13 students; code reviews; freelance requirements.", jd: "Collaboration, requirement analysis" },
  { skill: "Python & Bash scripting", level: "supporting", evidence: "'scripting languages like Python and Bash'.", mine: "Python (Lambda), JS automation at Uber.", jd: "Automation" },
];

export const IV_SOURCE_CONFLICTS = [
  "Duplicated employer: 'Amazon Development Centre — Java Developer' appears twice with different start dates (01 Nov 2014 vs 01 May 2014), both ending 01 Sep 2017. Not reconciled here.",
  "Timeline gap: no employment shown between Sep 2017 and Jun 2020, yet the headline says 12+ years. Not explained by the document.",
  "Heading says EY / Manager, but the visible experience list is Consoft Informatica SRL (Full Stack Developer, Jun 2020–Dec 2023) and Amazon Development Centre. His EY tenure/dates are not shown.",
  "Claims 'almost 5 years of DevOps' and 'Java Fullstack' — both may be true in different periods; do not assume which is current.",
  "Frontend is 'AngularJS' (v1) plus React and 'Angular CLI' (modern) — versions unclear.",
  "The image is a photo of a screen and is cropped at the bottom (last Amazon bullet cut off mid-sentence).",
  "Nothing in the supplied material shows his Vanguard role. Do not assume it.",
];

export interface Focus { area: string; priority: "Very high" | "High" | "Medium"; why: string; prep: string[] }
/** Ranked, wording deliberately non-certain. */
export const FOCUS: Focus[] = [
  { area: "Java & Spring Boot fundamentals", priority: "Very high", why: "High-priority preparation because it overlaps strongly with his documented Java lead background, the JD's backend requirement, AND the Java/Spring Boot line on your resume headline.", prep: ["OOP/SOLID, collections, exceptions, equals/hashCode", "Spring DI/IoC, Controller-Service-Repository, @Transactional, Spring Security + JWT", "Honest ownership line (see Verify page)"] },
  { area: "AWS serverless architecture + IaC", priority: "Very high", why: "Based on his documented technical background (Lambda, serverless, CloudFormation/Terraform, migration), this is an area worth preparing deeply; it is also your strongest evidence.", prep: ["Why Lambda/AppSync/SNS/S3/CloudFront/DynamoDB and the alternatives", "Failure modes: retries, DLQ, idempotency, cold starts, timeouts", "CDK vs CloudFormation vs Terraform"] },
  { area: "API design, integration & security", priority: "Very high", why: "Overlaps his Kong/Swagger/REST/SOAP/WS-Security history with the JD's API design + security requirements.", prep: ["REST vs GraphQL, idempotency, pagination, versioning, error model", "AuthN/AuthZ, JWT vs sessions, OAuth/OIDC basics, tenant isolation", "Third-party/vendor integration failure handling (timeouts, retries, circuit breaker)"] },
  { area: "Event-driven / Kafka", priority: "High", why: "Kafka appears in his skills and in the JD standouts. It is your biggest honest gap, so prepare the bridge from SNS/Firehose.", prep: ["SNS vs SQS vs Kafka vs Kinesis", "At-least-once, ordering, partitions, consumer groups, replay, idempotent consumers", "'I haven't run Kafka in production, but…' script"] },
  { area: "SQL, data modelling & performance", priority: "High", why: "His profile highlights Oracle/PL-SQL and a 30% DB-tuning win with caching; the JD asks for relational + NoSQL modelling.", prep: ["Joins, indexes, EXPLAIN mindset, transactions/isolation, N+1", "DynamoDB access-pattern design vs relational", "Caching layers + invalidation"] },
  { area: "System design (backend-leaning)", priority: "High", why: "JD lists design principles; a backend/cloud lead is comfortable running a design conversation.", prep: ["Framework: requirements → API → data → HLD → deep dive → failure → observability → security", "12 designs in System Design page"] },
  { area: "CI/CD, Docker, Kubernetes", priority: "High", why: "Jenkins/CodePipeline/Docker/K8s all appear on his profile and in the JD.", prep: ["Pipeline stages, blue-green/rolling/canary, rollback", "Docker fundamentals; Kubernetes concepts honestly labelled conceptual"] },
  { area: "Monitoring, logging & production troubleshooting", priority: "High", why: "CloudWatch/New Relic/Prometheus history + JD observability/troubleshooting.", prep: ["A calm debugging method (symptom → scope → hypothesis → evidence → fix → prevent)", "Logs vs metrics vs traces; SLO/alert design", "Your playbook-based resolution at Uber/BluSapphire"] },
  { area: "React vs Angular (and frontend depth)", priority: "Medium", why: "He lists AngularJS/Angular CLI/React; the JD prefers Angular.", prep: ["Honest ramp-up plan", "Concept mapping: components/DI/RxJS vs hooks/context/Apollo"] },
  { area: "Data integration / ETL / batch / files", priority: "Medium", why: "Talend/MuleSoft/SFTP/batch on his profile; your CSV upload, Firehose→Parquet, Uber hydration are transferable.", prep: ["Idempotent loads, reconciliation, schema validation, dedup", "Secure file transfer concepts (presigned URLs ≈ controlled transfer)"] },
  { area: "Leadership / mentoring / requirement analysis", priority: "Medium", why: "He led a team of 3 and mentored juniors; the JD lists requirement analysis and collaboration.", prep: ["Earn While You Learn Club (13 students)", "Freelance requirement → design → delivery story"] },
];

export interface IvQ { q: string; area: string; connect: string; honest?: string }
export const IV_QUESTIONS: IvQ[] = [
  { q: "You list Spring Boot — walk me through how a request flows from controller to database.", area: "Java + Spring", connect: "Controller → Service (@Transactional) → Repository/JPA; you have read/reviewed this and built it in personal projects.", honest: "Say clearly it is your integration/personal-project experience." },
  { q: "How does Spring's dependency injection work and why prefer constructor injection?", area: "Spring", connect: "Explain IoC container, beans, testability; then relate to how you'd inject an API client in React via context.", honest: "Conceptual + personal projects." },
  { q: "How would you secure a Spring Boot REST API with JWT?", area: "Spring + security", connect: "Filter validates JWT signature/expiry, sets SecurityContext, method-level roles; you consumed JWTs from Stytch/Keycloak.", honest: "Consumed, not implemented in production." },
  { q: "You built a React console over a Java-ish backend — how did you agree API contracts?", area: "Java + React", connect: "Rule Builder payload contracts; schema-first, validation before persistence; 'regular code reviews' on resume." },
  { q: "React vs Angular — which would you pick for an enterprise app and why?", area: "Angular + React", connect: "Opinionated structure/DI/RxJS vs flexibility; you'd ramp on Angular." },
  { q: "Why AppSync/Lambda instead of a Spring Boot service on ECS?", area: "AWS + backend", connect: "Managed GraphQL + subscriptions, per-request scaling, less ops; trade-offs: cold starts, vendor lock-in, debugging, long-running work." },
  { q: "Explain your async investigate flow. What if the worker fails or the client disconnects?", area: "Event-driven", connect: "requestId correlation, SNS retries/DLQ, client re-subscribe, idempotent worker." },
  { q: "SNS vs SQS vs Kafka — which would you use and why?", area: "Kafka + events", connect: "SNS fan-out (used), SQS buffering, Kafka log/replay/ordering (not used).", honest: "State Kafka is conceptual." },
  { q: "How would you design idempotent APIs / consumers?", area: "API + events", connect: "Idempotency keys, dedup tables, natural keys; Uber de-duplication + reconciliation work." },
  { q: "How would you version and document an API? (Swagger/OpenAPI)", area: "API", connect: "OpenAPI-first contracts, semantic versioning, deprecation; typed clients." },
  { q: "REST vs GraphQL — when would you not use GraphQL?", area: "API", connect: "Simple CRUD, caching at HTTP level, file upload, rate limiting complexity; you used both." },
  { q: "How do you design a DynamoDB table? Where would you choose SQL instead?", area: "SQL/NoSQL", connect: "Access-pattern-first single-table (AGENT##org); SQL for ad-hoc joins/reporting/transactions." },
  { q: "How would you debug a slow query / slow endpoint?", area: "SQL + perf", connect: "Measure → EXPLAIN/indexes → N+1 → caching; 'SQL Query Design & Optimization' on resume." },
  { q: "How would you handle a caching layer and invalidation?", area: "Perf", connect: "Apollo cache / CloudFront / (Dragonfly index). TTL vs event-based invalidation." },
  { q: "Walk me through a CI/CD pipeline you'd build for a Java + React app.", area: "CI/CD", connect: "Lint/test/build → artifact → scan → deploy → smoke → rollback; frontend S3+CloudFront invalidation." },
  { q: "Docker vs VM? What's in your Dockerfile and how do you keep images small?", area: "Docker", connect: "Multi-stage builds, non-root, pinned base, .dockerignore." },
  { q: "What is Kubernetes solving that ECS/Lambda don't?", area: "K8s", connect: "Portability, rich scheduling; higher ops cost. Honest conceptual." },
  { q: "CloudFormation vs Terraform vs CDK?", area: "IaC", connect: "You listed CDK: synthesises CloudFormation; Terraform multi-cloud state." },
  { q: "How do you monitor a Lambda-based system? What alerts would you set?", area: "Monitoring", connect: "Errors, throttles, duration p95, DLQ depth, iterator age; SLO burn rate; Splunk/CloudWatch." },
  { q: "Tell me about a production issue and how you found the root cause.", area: "Troubleshooting", connect: "Use a verified story only (see Anchors)." },
  { q: "How would you move an on-prem app to AWS?", area: "Migration", connect: "6 Rs (rehost/replatform/refactor…), strangler pattern; conceptual + AWS certs.", honest: "Conceptual — no migration lead claimed." },
  { q: "How would you design a file upload/transfer service (SFTP-like)?", area: "Data integration", connect: "Presigned URLs, virus scan, checksums, audit logs; your agent-download workflow." },
  { q: "REST vs SOAP — when does SOAP still make sense?", area: "REST/SOAP", connect: "WS-Security, formal contracts, legacy B2B; you know REST/GraphQL." },
  { q: "How do you handle a third-party API that is slow or flaky?", area: "Integration", connect: "Timeouts, retries with backoff+jitter, circuit breaker, fallbacks; Uber/freelance integrations." },
  { q: "How do you ensure data accuracy between two systems?", area: "Data integration", connect: "Schema validation, de-dup, reconciliation jobs — literally your Uber bullet." },
  { q: "How would you mentor a junior on your team?", area: "Leadership", connect: "13 students, code reviews, pairing." },
  { q: "How are you using AI tools (Copilot/Claude/Cursor) in your workflow — and where do you not trust them?", area: "AI engineering", connect: "JD standout; give a real workflow + review discipline (tests, diff review)." },
];
