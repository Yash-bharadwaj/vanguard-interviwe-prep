"""Enrich the parsed question bank. NEVER edits q/a text; only adds analysis fields.
Everything here is rule-based inference and is labelled as such in the UI."""
import json, re, difflib, pathlib, collections
ROOT = pathlib.Path(__file__).resolve().parent.parent
raw = json.loads((ROOT/"src/data/bank.raw.json").read_text(encoding="utf-8"))

# tag -> (keywords regex, weight, JD reqs, interviewer skills, resume trigger text)
T = {
 "java":      (r"\bjava\b|jvm|garbage collect|\bsolid\b|\boop\b|maven|log4j", 9, ["java","oop","design-principles"], ["Core Java","Java SE/EE","Back End Design"], "Resume headline lists Java; Skills: Java, Maven, Log4j2"),
 "spring":    (r"spring|dependency injection|\bdtos?\b|jpa|hibernate|controller.service", 9, ["java","api"], ["Spring Boot","Back End Design"], "Resume headline lists Spring Boot; Skills: Spring Boot, Spring Framework"),
 "kafka":     (r"kafka|confluent", 9, ["kafka","event-driven"], ["Apache Kafka","JMS"], "Resume lists SNS/Kinesis Firehose (event-driven) but not Kafka"),
 "event":     (r"event-driven|\bsns\b|\bsqs\b|kinesis|firehose|pub/sub|async|dead letter|\bdlq\b|publish", 8, ["event-driven","aws"], ["Apache Kafka","Serverless"], "EDR OneAgent: startEdrAsyncQuery -> SNS -> subscription flow"),
 "aws":       (r"\baws\b|lambda|s3\b|cloudfront|api gateway|athena|\brds\b|\becs\b|\biam\b|\bvpc\b|cloudwatch|cognito|presigned|cdk|appsync|serverless|roles anywhere", 8, ["aws","infra"], ["Cloud Computing","AWS Lambda/EC2","Serverless","AWS Migration"], "Resume Skills: Lambda, API Gateway, S3, DynamoDB, AppSync, CloudFront, Firehose, SNS, IAM, CDK; AWS Developer Associate"),
 "iac":       (r"cloudformation|infrastructure as code|\bcdk\b|terraform", 8, ["infra","aws"], ["AWS CloudFormation","Terraform"], "Resume Skills: CDK (no CloudFormation/Terraform ownership claimed)"),
 "rest":      (r"\brest\b|restful|axios|swagger|openapi|payload|api contract|endpoint selection|status code|idempot", 8, ["api","rest-graphql"], ["API Development","REST/SOAP","Kong / Swagger"], "Resume: Built and integrated REST and GraphQL APIs; Rule Builder calls REST for create/edit/clone"),
 "graphql":   (r"graphql|appsync|apollo|subscription", 8, ["graphql","rest-graphql"], ["API Development"], "Resume: GraphQL (AppSync, GraphQL Java); async query subscription flow"),
 "database":  (r"\bsql\b|database|duckdb|parquet|data lake|athena|\brds\b|index|query optimi", 8, ["db-rel","data-model"], ["Oracle SQL / PL/SQL","MySQL / SQL Server","Data Integration"], "Resume Skills: SQL Query Design & Optimization, Schema & Index Design"),
 "dynamodb":  (r"dynamodb|single-table|partition key|nosql", 7, ["db-nosql","data-model"], ["Serverless","Data Integration"], "Resume: DynamoDB (EDR OneAgent; AWS-backed databases)"),
 "docker":    (r"docker|container|nsis", 7, ["docker-k8s"], ["Docker","Kubernetes"], "Resume Tools: Docker (no Kubernetes listed)"),
 "k8s":       (r"kubernetes|\beks\b|\bk8s\b|helm", 8, ["docker-k8s"], ["Kubernetes / K8S","EC2/Lambda/K8S"], "Not on resume - potential gap"),
 "cicd":      (r"ci/cd|github actions|bitbucket|bamboo|pipeline|deploy|jenkins|version control|\bgit\b|branching", 8, ["cicd"], ["Jenkins / CodePipeline","CI/CD pipelines","Ansible"], "Resume Tools: Git, GitHub, Azure DevOps, CI/CD Pipelines"),
 "observability":(r"monitor|logging|splunk|cloudwatch|observab|debug|root cause|production issue|slo", 8, ["monitoring","troubleshooting"], ["CloudWatch / New Relic / Prometheus","Performance troubleshooting"], "Resume: SLO & Dashboard Monitoring, Splunk, Log4j2, Playbook-Based Resolution"),
 "security":  (r"security|auth|jwt|mtls|mutual tls|keycloak|stytch|encryption|\btoken|\bsso\b|tenant isolation|authorizer|\bcors\b|oauth", 8, ["security"], ["WS-Security","Kong API management","Secure SFTP"], "Resume: org-based auth + tenant isolation; SSO/SAML/OIDC; Information Security best practices"),
 "multitenant":(r"multi-tenan|tenant|organi[sz]ation", 7, ["security","design-principles"], ["Back End Design"], "Resume: Implemented org-based authentication and tenant isolation"),
 "testing":   (r"\btest|tdd|bdd|vitest|playwright|jest|unit and integration", 7, ["testing"], ["Code reviews / debugging"], "Resume Skills: Unit & Integration Testing, Code Reviews"),
 "agile":     (r"agile|scrum|sprint|jira|confluence|standup|retro", 6, ["agile","collab"], ["Cross-functional collaboration"], "Resume: Agile/Scrum, JIRA, Confluence, change control"),
 "system-design":(r"architect|from scratch|scal|design a|system design|data flow|end-to-end|distributed|fault|high availab", 9, ["design-principles","analysis","event-driven"], ["Back End Design","Microservices","Cloud Migration"], "Resume: System Analysis & Design; EDR OneAgent end-to-end flows"),
 "microservices":(r"microservice|monolith|service-oriented|soa\b", 8, ["design-principles","docker-k8s"], ["Microservices on Docker/K8s","SOA governance"], "Resume Skills: Microservices, Serverless"),
 "angular":   (r"angular|rxjs|ngmodule", 7, ["frontend"], ["AngularJS","Angular CLI"], "Resume is React-only; Angular is a JD-preferred gap"),
 "react":     (r"react|hook|jsx|virtual dom|useeffect|usememo|redux|context|component|vite|mui|material ui|emotion|toastify|router|virtuali|render|state management|memo", 6, ["frontend"], ["React","AngularJS"], "Resume Skills: React.js, Next.js, TypeScript, Component Architecture; EDR console + Rule Builder"),
 "typescript":(r"typescript|discriminated|generics|interface", 5, ["frontend"], [], "Resume Skills: TypeScript"),
 "node":      (r"node\.js|\bnode\b|express|event loop", 6, ["node"], ["Node-adjacent (Python/Bash scripting)"], "Resume Skills: Node.js listed; Uber JS automation scripts"),
 "python":    (r"python|fastapi|flask", 3, ["node"], ["Python","Bash"], "Resume: Python (Lambda handlers); FastAPI appears in the bank"),
 "rulebuilder":(r"rule builder|lookup|wizard|query builder|flink|cardinality|observable|whitelist|step gating|schema-driven|rulegroup", 7, ["frontend","api"], ["ETL / data integration"], "Resume project: Rule Builder (six-step wizard, visual query builder, Lookup Lists)"),
 "edr":       (r"\bedr\b|onagent|endpoint|agent|mitre|heartbeat|\bzones?\b|polic(y|ies)|alert|threat|hunt|investigat", 7, ["full-stack","aws"], ["Cloud monitoring","Real-time transactions"], "Resume project: EDR OneAgent (500+ endpoints, async investigate flow, presigned URLs)"),
 "perf":      (r"performance|optimi|virtuali|memo|code splitting|lazy|cach|latency|load time", 6, ["troubleshooting","frontend"], ["30% DB/perf tuning + caching","Performance tuning"], "Resume: sub-2s loads on large datasets; performance monitoring"),
 "behavioral":(r"tell me about|yourself|weakness|strength|hire|right fit|pressure|deadline|disagree|feedback|failed|freelance|ideal work|where do you see|leaving|hackathon|\bncc\b|cross-functional|questions for us|walk me through your|career|mentor", 6, ["collab","agile","problem-solving"], ["Leading team of 3","Mentoring juniors"], "Resume: Freelance (client comms), Earn While You Learn Club (13 students), SIH finalist, NCC"),
 "trivia":    (r"emotion|toastify|nsis|bloom|gzip|valkey|dragonfly|jwt-decode|react-router|vite dev server|proxy|env(ironment)? variables?", 2, [], [], "Detail-level trivia from the codebase"),
}
CATEGORIES = [
 ("behavioral", r"tell me about|yourself|weakness|strength|hire you|right fit|pressure|disagree|feedback|failed|freelance|ideal work|where do you see|why are you leaving|hackathon|\bncc\b|cross-functional|questions for us|walk me through your resume|career journey|motivated you|projects you've worked|continuous learning|stay(ing)? current|priorit"),
 ("project-rulebuilder", r"rule builder|lookup|wizard|query builder|flink|cardinality|observable|whitelist|step gating|keycloak|fastapi|discover service|isinpredefined|rule json|csv upload|generateflinkquery|getcolumns|save & deploy|\bsave vs|schema-driven|token exchange"),
 ("project-edr", r"\bedr\b|onagent|heartbeat|\bzones?\b|mitre|threat hunt|raw event|agent (install|download|package)|presigned|dragonfly|valkey|iam roles anywhere|bloom|nsis|multi-tenan|tenant isolation|alerts? (and|dashboard)|alert dashboards|endpoint monitoring|investigat|\b500\+|sub-2s"),
 ("spring", r"spring|dependency injection|\bdtos?\b"),
 ("java", r"\bjava\b|jvm"),
 ("typescript", r"typescript"),
 ("graphql", r"graphql|appsync|apollo|subscription"),
 ("aws", r"\baws\b|lambda|\bs3\b|cloudfront|api gateway|athena|\brds\b|\becs\b|\biam\b|\bvpc\b|cloudwatch|cognito|cdk|cloudformation|kinesis|firehose|\bsns\b|serverless|dynamodb|custom authorizer|dead letter|encryption at rest|data lake|duckdb"),
 ("docker-devops", r"docker|container|git\b|github|bitbucket|bamboo|ci/cd|deploy"),
 ("database", r"\bsql\b|database|query|dynamodb"),
 ("security", r"security|auth|jwt|mtls|mutual tls|sso|token|data protection"),
 ("observability", r"monitor|logging|splunk|debug|root cause|production issue|performance"),
 ("testing-agile", r"\btest|tdd|bdd|agile|scrum|jira|documentation"),
 ("rest", r"\brest\b|\bapi\b|axios|payload|serializ|contract|data flow"),
 ("system-design", r"architect|design|scal|from scratch|event-driven|synchronous|sync"),
 ("react", r"react|responsive|component|state|vite|mui|material|emotion|toastify|router|form|hook|redux|context|css"),
]
CAT_FALLBACK = "general"

def score_tags(text):
    out=[]
    for k,(rx,w,*_) in T.items():
        if re.search(rx, text, re.I): out.append(k)
    return out

def classify(text, fallback=CAT_FALLBACK):
    for c,rx in CATEGORIES:
        if re.search(rx, text, re.I): return c
    return fallback

CONFLICT_RULES = [
 ("C-EY",      r"\bEY\b|Ernst"),
 ("C-CURRENT", r"leaving your current|current company|my current (role|employer|project)|currently at BluSapphire|Currently at BluSapphire|At BluSapphire, I work"),
 ("C-TITLE",   r"Software Engineer|over 2 years|2\+ years|2 years of"),
 ("C-FREELANCE", r"18 Lakh|20\+ projects|over 20 projects|Ireland|Cameron|YoutubeMagic|2022 to 2024|₹|Redis caching layer"),
 ("C-AUTH",    r"Cognito|Stytch|Keycloak"),
 ("C-STATE",   r"React Query|useReducer|introduced React Query"),
 ("C-RT",      r"event batching|500 ?ms|500 milliseconds|hundreds of (security )?events per second|thousands of events|graceful degradation|exponential backoff|WebSocket manager"),
 ("C-METRICS", r"60 ?fps|60fps|4 seconds|200 milliseconds|97%|30-40%|16 ?ms|1\.8 ?MB|400 ?KB|12-15|under 2 seconds|60\+ seconds|reduced development time"),
 ("C-DDBSTREAM", r"DynamoDB Stream"),
 ("C-KINESIS", r"Kinesis Data Streams|shards|through Kinesis|thousands of events per second"),
 ("C-OWN",     r"sole frontend|I personally own|owned the entire|end to end means|didn't write the Lambda|contributed to resolver|I built (the )?(entire|whole)"),
 ("C-SPRING",  r"(work with|working with) Java and Spring Boot daily|daily.{0,40}(Spring|Java)|personal projects.{0,60}Spring"),
]
def rb_backend(text):
    return bool(re.search(r"Rule Builder", text, re.I) and re.search(r"Lambda|DynamoDB", text) and not re.search(r"FastAPI|Keycloak|One Platform|Flink", text))
def conflicts(text):
    c=[cid for cid,rx in CONFLICT_RULES if re.search(rx,text)]
    if rb_backend(text): c.append("C-RB-BACKEND")
    return c

CLAIMS = [(r"60 ?fps","60fps render claim"),(r"4 seconds|200 milliseconds","4s→200ms prototype benchmark"),(r"97%","97% latency improvement"),(r"30-40%","30–40% dev-time saving"),(r"16 ?ms","<16ms render time"),(r"1\.8 ?MB|400 ?KB","1.8MB→400KB bundle"),(r"12-15|3-4 frontend|5-6 backend","team-size breakdown"),(r"18 Lakh","₹18 Lakh freelance revenue"),(r"20\+ projects|over 20 projects","20+ freelance projects"),(r"react-window","react-window virtualization"),(r"DynamoDB Stream","DynamoDB Streams incident"),(r"Cognito","AWS Cognito"),(r"React Query","React Query"),(r"500 ?ms|500 milliseconds","500ms event batching")]
def claims(text): return [lab for rx,lab in CLAIMS if re.search(rx,text)]

def sentences(t): return re.split(r"(?<=[.!?])\s+(?=[A-Z\"'(])", t.strip())
def short30(a, n=2, cap=330):
    s=sentences(a); out=" ".join(s[:n]); 
    return out if len(out)<=cap else out[:cap].rsplit(" ",1)[0]+"…"

def difficulty(q, cat):
    if re.search(r"why not|trade-?off|design|architect|from scratch|scale|explain the .*flow|end-to-end|concurrent|simultaneous|walk me through the complete", q, re.I): return "hard"
    if re.match(r"(What is|What are|What does|What's|How would you explain)", q) and cat not in ("project-edr","project-rulebuilder"): return "easy"
    return "medium"

BOOST = {1:5,2:4,3:4,4:3,5:2,206:4,207:3,211:3,224:3,59:3,53:3,55:3,185:3,159:2,209:2,212:2,213:2,52:2,49:2,56:2,57:2,58:2,60:2,62:2,65:1,66:2,69:2,45:2,40:2,41:2,43:2,47:2,48:2,98:2,96:2,203:2,189:2,220:2}
def priority(n, tags, cat, layer):
    ws=sorted([T[t][1] for t in tags], reverse=True)
    s=(ws[0] if ws else 3)+0.3*sum(ws[1:4])+BOOST.get(n,0)
    if "trivia" in tags and len(tags)<=2: s-=3
    if layer=="B" and cat in ("project-edr","project-rulebuilder") and s<11: s+=0.5
    return round(s,1)

CAT_WHY = {
 "behavioral":("Opening/closing rapport question; also cross-checks your story against the resume.","Communication, honesty, self-awareness, ownership boundaries."),
 "project-edr":("Resume headline project; interviewers pick a bullet and drill down until they find your real depth.","Whether you understand the whole flow and can separate what YOU built from what the team built."),
 "project-rulebuilder":("Second resume project with concrete, checkable claims (six steps, REST create/edit/clone, Lookup Lists).","Design thinking on schema-driven UI, validation, API contracts and trade-offs."),
 "spring":("JD requires Java/backend and the interviewer has deep Spring Boot history; your resume lists Spring Boot.","Whether your Spring understanding is real (DI, layers, security, transactions) and whether you are honest about ownership."),
 "java":("JD requires Java or Node backend; the interviewer is a Java full-stack lead.","Core Java fundamentals and whether the headline 'Java' is credible."),
 "typescript":("Your primary language on the frontend; easy to verify depth.","Type-system fluency: unions, generics, narrowing, runtime vs compile-time safety."),
 "graphql":("JD lists GraphQL as a standout skill and your resume shows AppSync subscriptions.","Trade-offs vs REST, subscriptions, N+1, caching, error handling."),
 "aws":("JD requires AWS; the interviewer has CloudFormation/Lambda/serverless/migration background.","Service selection reasoning, failure modes, cost, IAM/security."),
 "docker-devops":("JD requires CI/CD + Docker/Kubernetes; interviewer has Jenkins/CodePipeline/K8s background.","Delivery pipeline understanding and honest depth on containers/orchestration."),
 "database":("JD requires relational + NoSQL and data modelling.","Modelling access patterns, indexing, consistency, when SQL vs NoSQL."),
 "security":("JD requires security best practices; your resume claims tenant isolation.","AuthN vs AuthZ, token handling, least privilege, multi-tenant safety."),
 "observability":("JD requires monitoring/logging/observability and production troubleshooting.","Systematic debugging process and signals you use (logs, metrics, traces, dashboards)."),
 "testing-agile":("JD requires automated testing and Agile/Scrum.","Practical testing strategy and real team-process experience."),
 "rest":("JD requires API design and integration; interviewer has REST/SOAP/Kong/Swagger background.","Contract design, error handling, versioning, idempotency, integration failure handling."),
 "system-design":("JD explicitly mentions software design principles/system design.","Structured thinking: requirements → design → trade-offs → failure handling."),
 "react":("Your strongest area and the JD's frontend stack (Angular preferred, React acceptable).","Rendering model, state design, performance; also willingness to move to Angular."),
 "general":("General technical/behavioural screening.","Clarity and honesty."),
}

# layer heuristic: Q1-71 & 206-224 are the earlier generic answers ("A"); 72-205 are codebase-derived ("B")
def layer(n): return "B" if 72<=n<=205 else "A"

def norm(s): return re.sub(r"[^a-z0-9 ]","",s.lower())
items=[]
for it in raw:
    n=it["n"]; text=it["q"]+" "+it["a"]
    tags=score_tags(it["q"]+" "+it["a"][:400])
    cat=classify(it["q"]) if classify(it["q"])!=CAT_FALLBACK else classify(it["q"]+" "+it["a"][:300])
    if n<=5 or n in (65,71,209,218,219,223,224): cat="behavioral"
    L=layer(n)
    alltext=it["q"]+" "+it["a"]+" "+" ".join(f["q"]+" "+f["a"] for f in it["fu"])
    fus=[]
    for f in it["fu"]:
        ft=f["q"]+" "+f["a"]
        fc=classify(f["q"], cat)
        fus.append({"n":f["n"],"id":f"q{n}f{f['n']}","q":f["q"],"a":f["a"],"cat":fc,"tags":score_tags(f["q"]+" "+f["a"][:300]),"short30":short30(f["a"]),"conflicts":conflicts(ft),"claims":claims(ft),"ey":bool(re.search(r"\bEY\b|Ernst",ft))})
    pri=priority(n,tags,cat,L)
    jd=sorted({j for t in tags for j in T[t][2]})
    iv=sorted({j for t in tags for j in T[t][3]})
    rt=[T[t][4] for t in tags if t not in ("trivia",)][:3]
    why,test=CAT_WHY.get(cat,CAT_WHY["general"])
    items.append({"n":n,"id":f"q{n}","q":it["q"],"a":it["a"],"cat":cat,"tags":tags,"layer":L,"score":pri,
      "difficulty":difficulty(it["q"],cat),"short30":short30(it["a"]),"jd":jd,"iv":iv,"resumeTrigger":rt,
      "whyAsk":why,"testing":test,"conflicts":conflicts(text),"claims":claims(text),"ey":bool(re.search(r"\bEY\b|Ernst",text)),
      "conflictsInFollowups":sorted({c for f in fus for c in f["conflicts"]}),"fu":fus,"related":[]})

# related / duplicates
ns=[norm(i["q"]) for i in items]
for i in range(len(items)):
    for j in range(i+1,len(items)):
        r=difflib.SequenceMatcher(None,ns[i],ns[j]).ratio()
        if r>=0.86:
            kind="identical" if r>=0.98 else "near-identical"
            items[i]["related"].append({"n":items[j]["n"],"kind":kind}); items[j]["related"].append({"n":items[i]["n"],"kind":kind})
# topic-level near-duplicates (same headline topic, different wording) - curated from a manual read of the titles
GROUPS=[[12,111,150,86],[11,85],[116,216],[17,215],[58,110],[53,73],[1,72],[124,129],[203,98],[204,108],[195,139],[196,171],[197,140],[202,174],[222,173],[189,96,220],[8,41],[35,124,129],[102,125,190],[143,169,198],[172,200],[199,143],[209,68,2],[207,3],[94,82,22],[106,22],[13,28]]
by={i["n"]:i for i in items}
for g in GROUPS:
    for a in g:
        for b in g:
            if a!=b and not any(r["n"]==b for r in by[a]["related"]): by[a]["related"].append({"n":b,"kind":"same-topic"})
for it in items:
    if it["related"]:
        cands=[it["n"]]+[r["n"] for r in it["related"]]
        pref=max((c for c in cands if by[c]["layer"]=="B"), default=min(cands)) if any(by[c]["layer"]=="B" for c in cands) else min(cands)
        it["preferred"]=pref
        it["related"]=sorted(it["related"],key=lambda r:r["n"])


# ---- interview sequence: stage 1..6 follows the real 45-minute flow ----
STAGE_NAMES={1:"Intro (0–5 min)",2:"Resume & current role (5–10)",3:"Project deep dive (10–20)",4:"Technical questions (20–32)",5:"Architecture · troubleshooting · behavioral (32–40)",6:"Your questions (40–45)"}
S1={1,2,3,5,72}
S2={4,68,209,218,73,53,124,129,185,224,160,159,206,207,208,211,219}
S5_CATS={"system-design","observability","behavioral"}
def stage(it):
    n=it["n"]
    if n in S1: return 1
    if n in S2: return 2
    if it["cat"] in ("project-edr","project-rulebuilder"): return 3
    if it["cat"] in S5_CATS or n in (210,212,213,214,220,221): return 5
    return 4
for it in items: it["stage"]=stage(it)
MANUAL=[1,2,72,3,5,4,73,185,224,206,207,211,53,124,129,159,160,68,209,208,218,219]
mi={n:k for k,n in enumerate(MANUAL)}
order=sorted(items,key=lambda i:(i["stage"],mi.get(i["n"],999),-i["score"],i["n"]))
for k,it in enumerate(order,1): it["seq"]=k
print("stages",dict(collections.Counter(i["stage"] for i in items)))

(ROOT/"src/data/bank.json").write_text(json.dumps(items,ensure_ascii=False),encoding="utf-8")
c=collections.Counter(i["cat"] for i in items); print("categories",dict(c))
sc=sorted(i["score"] for i in items); print("score quartiles",sc[len(sc)//4],sc[len(sc)//2],sc[3*len(sc)//4],sc[-1])
print("EY items",sum(i["ey"] for i in items),"with conflicts",sum(bool(i["conflicts"]) for i in items))
print("with related",sum(bool(i["related"]) for i in items))
