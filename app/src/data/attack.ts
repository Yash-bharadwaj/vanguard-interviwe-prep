export interface Turn { ask: string; say: string }
export interface Chain { id: string; topic: string; anchor: string; turns: Turn[] }
export const CHAINS: Chain[] = [
  { id: "dynamodb", topic: "DynamoDB choice", anchor: "EDR OneAgent", turns: [
    { ask: "Why did you use DynamoDB?", say: "We chose it because our data was naturally key-based: agents, zones and policies fetched by organisation. It gave us fast lookups and no servers to manage." },
    { ask: "Why not PostgreSQL?", say: "PostgreSQL would also work. We preferred DynamoDB because the access patterns were known and partitioned by tenant, and we wanted serverless scaling with low operations. If we needed joins or ad-hoc queries, I'd use Postgres." },
    { ask: "What if traffic became 10×?", say: "DynamoDB scales by partition, so I'd check for hot partitions and throttling, and review capacity mode. I'd also add caching for repeated reads and make sure Lambda concurrency keeps up." },
    { ask: "How would you redesign it?", say: "Keep DynamoDB for operational lookups, and stream changes to S3 with a query engine for reporting, so we don't force analytics onto the operational table." },
    { ask: "What was YOUR contribution?", say: "The table design was the backend team's. What I did was work with them on the access patterns the console needed, and build the UI and GraphQL operations on top." },
    { ask: "What was the biggest problem?", say: "New access patterns. If the console needed a new way to query, it could mean a new index or a redesign, so we planned queries with the backend early." },
    { ask: "What did you learn?", say: "Design from the questions you'll ask, not from the entities you have. Also, always know where analytics will live." } ] },
  { id: "graphql", topic: "GraphQL", anchor: "EDR console", turns: [
    { ask: "Why GraphQL?", say: "The console's screens combine related data, and we needed subscriptions. AppSync gave us both as a managed service." },
    { ask: "Why not REST?", say: "REST would work for simple resources, and we used it that way in Rule Builder. For aggregated views, GraphQL avoided multiple round trips and over-fetching." },
    { ask: "What about caching?", say: "It's harder than REST, since everything is a POST to one endpoint. On the client, Apollo's normalised cache helps. Server-side, I'd consider persisted queries and a CDN cache for public data." },
    { ask: "What about N+1?", say: "It happens when a list resolver queries per item. The fix is batching, like DataLoader-style resolvers, or direct DynamoDB batch reads." },
    { ask: "How do subscriptions work?", say: "The client opens a WebSocket and registers a subscription. When a mutation publishes a matching event, AppSync pushes it. We filter by request ID." },
    { ask: "What happens if the WebSocket dies?", say: "The client reconnects with backoff and resubscribes. Since messages can be missed during the gap, we re-query the state by request ID." },
    { ask: "How would you scale it?", say: "AppSync scales for us, so I'd watch limits: connection counts, resolver latency, and the cost of subscriptions. I'd limit query depth and use pagination." },
    { ask: "How would you monitor it?", say: "Resolver errors and latency, subscription connect failures, throttles, and — because GraphQL returns 200 with errors — alert on the errors field, not just HTTP status." },
    { ask: "What exactly did YOU build?", say: "The client operations and Apollo setup, and the console screens. The schema and resolvers were with the backend team; I contributed to and reviewed resolver logic." } ] },
  { id: "async", topic: "Async investigate flow", anchor: "Anchor 1", turns: [
    { ask: "Walk me through it.", say: "Mutation returns a request ID, SNS carries the work, a worker queries Parquet with DuckDB, and results come back over a subscription." },
    { ask: "Why SNS and not SQS?", say: "SNS was enough for decoupling and fan-out. If we needed buffering and back-pressure for workers, I'd put SQS behind it." },
    { ask: "What if the worker crashes?", say: "SNS retries, then a dead-letter queue. The worker should be idempotent by request ID, and the UI shows a failure state with a re-run option." },
    { ask: "How do you avoid duplicate results?", say: "Idempotency by request ID, and the client ignores messages it has already applied." },
    { ask: "How do you secure it?", say: "The request carries the caller's organisation, the worker only reads that organisation's partitions, and the subscription filter is scoped to the request." },
    { ask: "What would you change?", say: "Add tracing across every hop, a DLQ with alarms, and a status query so a reconnecting client can recover results." } ] },
  { id: "spring", topic: "Spring Boot", anchor: "Personal projects + integration", turns: [
    { ask: "How familiar are you with Spring Boot?", say: "I know the layers and the core ideas well, from personal projects and from working alongside Java services. I haven't owned a large Spring service in production." },
    { ask: "Walk me through a request.", say: "The controller receives the request and validates it; the service applies business logic and manages the transaction; the repository talks to the database with Spring Data JPA; exceptions are handled centrally with @ControllerAdvice." },
    { ask: "How does dependency injection help?", say: "Spring creates and injects the dependencies, so classes are loosely coupled and easy to test with mocks. I prefer constructor injection." },
    { ask: "How would you secure it?", say: "Spring Security with a filter that validates the JWT and sets the security context, then role checks on endpoints. Validate input, and keep secrets out of code." },
    { ask: "What's @Transactional's gotcha?", say: "It works through a proxy, so calling a transactional method from within the same class bypasses it. Also, by default it rolls back only on runtime exceptions." },
    { ask: "What did you actually build?", say: "REST APIs with JPA and Spring Security in personal projects. At work I've integrated with and reviewed Spring services." } ] },
  { id: "event", topic: "Kafka / event-driven", anchor: "SNS + Firehose", turns: [
    { ask: "Have you used Kafka?", say: "Not in production. I've worked with event-driven patterns using SNS, Firehose and subscriptions, so I know the concepts." },
    { ask: "SNS vs SQS vs Kafka?", say: "SNS fans out, SQS buffers work for consumers, and Kafka keeps a durable, ordered, replayable log. I'd pick Kafka for replay, ordering per key, or multiple independent readers." },
    { ask: "What's a consumer group?", say: "A set of consumers that share the partitions of a topic, so each message is processed by one consumer in the group, while other groups can read the same topic independently." },
    { ask: "How do you get exactly-once?", say: "In practice you design for at-least-once with idempotent consumers. Kafka offers transactions and idempotent producers, but end to end you still need idempotent handling." },
    { ask: "How would you handle ordering?", say: "Use a partition key, so events for the same entity land on the same partition and stay in order." } ] },
  { id: "aws", topic: "Lambda vs ECS", anchor: "EDR + serverless", turns: [
    { ask: "Why Lambda?", say: "Our workloads were bursty and event-driven, and Lambda scales per request with no server management." },
    { ask: "Why not ECS or EC2?", say: "They'd also work. For steady, long-running or special workloads, containers make more sense. We paid an operational cost for that we didn't need." },
    { ask: "What about cold starts?", say: "They matter for latency-sensitive paths. I'd use provisioned concurrency there, keep packages small, and keep long work in async workers." },
    { ask: "What if it becomes very expensive?", say: "At steady, high throughput, containers can be cheaper, so I'd measure cost per request and move the hot path to ECS." },
    { ask: "How would you monitor it?", say: "Errors, throttles, duration at p95 and p99, concurrency, DLQ depth, and alarms tied to SLOs." } ] },
  { id: "tenant", topic: "Tenant isolation", anchor: "Anchor 3", turns: [
    { ask: "How did you isolate tenants?", say: "Three layers: the organisation in the token, data partitioned by organisation, and scope checks in the application." },
    { ask: "What if there's a bug in one resolver?", say: "That's the risk of pooled tenancy. That's why I'd add automated cross-tenant tests for every operation, and consider per-tenant encryption." },
    { ask: "Pool vs silo?", say: "Pool is cheaper and simpler to operate; silo gives stronger isolation and blast-radius control. For high-sensitivity customers, silo or a hybrid." },
    { ask: "What did you personally do?", say: "The console-side org scoping and the login flow integration. The identity provider and table design were the platform team's." } ] },
  { id: "rulebuilder", topic: "Rule Builder", anchor: "Anchor 2", turns: [
    { ask: "Why schema-driven?", say: "So new fields appear without a frontend release. The cost is upfront abstraction." },
    { ask: "How do you keep validation in sync with the server?", say: "The server is the authority. Client validation is for user experience; I'd share one schema to avoid drift." },
    { ask: "What about two analysts editing the same rule?", say: "Today it's last-write-wins. I'd add a version or ETag, so the second save gets a conflict message." },
    { ask: "How did you test it?", say: "Unit tests on the JSON and SQL generators with known rules, and flow tests on the wizard." },
    { ask: "What would you change?", say: "Cap nesting depth, share a validation schema, and version the contract." } ] },
  { id: "cicd", topic: "CI/CD", anchor: "Frontend pipeline", turns: [
    { ask: "Describe your pipeline.", say: "Lint, type-check, test and build on each pull request; deploy to staging on merge; promote to production; sync to S3 and invalidate CloudFront." },
    { ask: "How do you roll back?", say: "Redeploy the previous build artifact and invalidate the cache. For backends, blue-green or a canary makes rollback quick." },
    { ask: "Blue-green vs canary?", say: "Blue-green flips all traffic between two environments; canary shifts a small percentage first to catch problems early." },
    { ask: "What did you own?", say: "The frontend build steps. DevOps owned the pipeline infrastructure." } ] },
  { id: "debug", topic: "Production debugging", anchor: "Anchor 5", turns: [
    { ask: "Tell me about a production issue.", say: "A typical one: an automation job starts failing. I check the impact, what changed, then follow one failing run through logs and dashboards to the root cause, fix it, and add a check and an alert so it's caught earlier." },
    { ask: "How did you find the root cause?", say: "I followed one failing request through the browser, the API, the function logs and the data, using a request ID." },
    { ask: "How did you make sure it wouldn't happen again?", say: "A test or alert, and an update to the playbook." },
    { ask: "Rollback or fix-forward?", say: "Rollback first if the last release is the likely cause and impact is high." } ] },
];
