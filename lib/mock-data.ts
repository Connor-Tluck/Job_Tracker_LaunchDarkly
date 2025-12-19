export type TimelineEntry = {
  date: string;
  label: string;
  notes?: string;
};

export type Job = {
  id: string;
  company: string;
  title: string;
  applicationDate: string;
  contactName?: string;
  contactType?: string;
  messaged: "Yes" | "No";
  response: "Yes" | "No" | "Pending";
  phase: "Applied" | "Phone Screen" | "Interview" | "Offer" | "Rejected";
  nextStep?: string;
  timeline: TimelineEntry[];
  prepDocId: string;
  metrics: {
    touchpoints: number;
    daysSinceApply: number;
    confidence: number;
  };
  tags: string[];
};

export type JobPhase = Job["phase"];

export type PrepDoc = {
  id: string;
  overview: string;
  companySummary: string;
  whyCompany: string;
  productPillars: string[];
  customerProfiles: string[];
  interviewQuestions: string[];
  tailoredStories: string[];
  questionsForThem: string[];
  prepChecklist: string[];
};

export type GeneralDoc = {
  id: string;
  title: string;
  summary: string;
  content: string;
  tags?: string[];
};

export type StarStory = {
  id: string;
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  metrics: string;
  tags: string[];
  industries: string[];
};

export const jobs: Job[] = [
  {
    id: "bex",
    company: "Bex",
    title: "Solutions Engineer",
    applicationDate: "2025-10-29",
    contactName: "Sarah Chen",
    contactType: "Warm",
    messaged: "Yes",
    response: "Pending",
    phase: "Applied",
    nextStep: "Follow-up email 11/25",
    timeline: [
      { date: "2025-10-29", label: "Applied" },
      { date: "2025-10-30", label: "Messaged Sarah on LinkedIn" },
      { date: "2025-11-05", label: "Prep doc drafted" },
    ],
    prepDocId: "prep-bex",
    metrics: {
      touchpoints: 3,
      daysSinceApply: 27,
      confidence: 82,
    },
    tags: ["AI", "Analytics", "SE"],
  },
  {
    id: "near-map",
    company: "Nearmap",
    title: "Strategic Account Manager",
    applicationDate: "2025-10-29",
    contactName: "Noah",
    contactType: "Warm",
    messaged: "Yes",
    response: "Yes",
    phase: "Phone Screen",
    nextStep: "Pre-call prep 11/26",
    timeline: [
      { date: "2025-10-29", label: "Applied" },
      { date: "2025-11-01", label: "Phone screen scheduled" },
    ],
    prepDocId: "prep-nearmap",
    metrics: {
      touchpoints: 4,
      daysSinceApply: 27,
      confidence: 76,
    },
    tags: ["Geo", "Account Management"],
  },
  {
    id: "mach9",
    company: "Mach9",
    title: "Solutions Engineer",
    applicationDate: "2025-10-30",
    contactName: "N/A",
    contactType: "Cold Outbound",
    messaged: "No",
    response: "No",
    phase: "Applied",
    nextStep: "Message hiring manager",
    timeline: [
      { date: "2025-10-30", label: "Applied" },
      { date: "2025-11-12", label: "Reminder to follow up" },
    ],
    prepDocId: "prep-mach9",
    metrics: {
      touchpoints: 1,
      daysSinceApply: 26,
      confidence: 68,
    },
    tags: ["AI", "Geospatial"],
  },
  {
    id: "oracle-se",
    company: "Oracle",
    title: "Solutions Engineer - Cloud",
    applicationDate: "2025-11-04",
    contactName: "Jacob Hurst",
    contactType: "Cold Outbound",
    messaged: "Yes",
    response: "Yes",
    phase: "Rejected",
    nextStep: "Archive learnings",
    timeline: [
      { date: "2025-11-04", label: "Applied" },
      { date: "2025-11-06", label: "Recruiter reply" },
      { date: "2025-11-10", label: "Rejected" },
    ],
    prepDocId: "prep-oracle",
    metrics: {
      touchpoints: 2,
      daysSinceApply: 21,
      confidence: 20,
    },
    tags: ["Cloud", "Enterprise"],
  },
  {
    id: "figma-se",
    company: "Figma",
    title: "Solutions Engineer",
    applicationDate: "2025-11-12",
    contactName: "Amanda Lee",
    contactType: "Referral",
    messaged: "Yes",
    response: "Yes",
    phase: "Phone Screen",
    nextStep: "Prep for recruiter call 12/20",
    timeline: [
      { date: "2025-11-12", label: "Applied" },
      { date: "2025-11-13", label: "Referral submitted" },
      { date: "2025-11-18", label: "Recruiter screen scheduled" },
    ],
    prepDocId: "prep-figma",
    metrics: {
      touchpoints: 4,
      daysSinceApply: 37,
      confidence: 78,
    },
    tags: ["Product", "Design", "Enterprise", "SE"],
  },
  {
    id: "datadog-se",
    company: "Datadog",
    title: "Sales Engineer (Enterprise)",
    applicationDate: "2025-11-08",
    contactName: "Michael Park",
    contactType: "Warm",
    messaged: "Yes",
    response: "Yes",
    phase: "Interview",
    nextStep: "Technical demo loop 12/23",
    timeline: [
      { date: "2025-11-08", label: "Applied" },
      { date: "2025-11-10", label: "Recruiter intro call" },
      { date: "2025-11-15", label: "Hiring manager interview" },
      { date: "2025-12-03", label: "Demo topic confirmed", notes: "Observability + ROI narrative" },
    ],
    prepDocId: "prep-datadog",
    metrics: {
      touchpoints: 6,
      daysSinceApply: 41,
      confidence: 74,
    },
    tags: ["Observability", "Enterprise", "Architecture", "Demo"],
  },
  {
    id: "stripe-tam",
    company: "Stripe",
    title: "Technical Account Manager",
    applicationDate: "2025-11-25",
    contactName: "Priya Nair",
    contactType: "Inbound",
    messaged: "No",
    response: "Pending",
    phase: "Applied",
    nextStep: "Find warm intro + send note 12/20",
    timeline: [
      { date: "2025-11-25", label: "Applied" },
      { date: "2025-12-02", label: "Researched team + role scope" },
      { date: "2025-12-10", label: "Drafted outreach message" },
    ],
    prepDocId: "prep-stripe",
    metrics: {
      touchpoints: 2,
      daysSinceApply: 24,
      confidence: 70,
    },
    tags: ["Payments", "Platform", "API", "Enterprise"],
  },
  {
    id: "cloudflare-se",
    company: "Cloudflare",
    title: "Solutions Engineer",
    applicationDate: "2025-10-21",
    contactName: "Diego Alvarez",
    contactType: "Warm",
    messaged: "Yes",
    response: "Yes",
    phase: "Offer",
    nextStep: "Review offer + comp questions 12/20",
    timeline: [
      { date: "2025-10-21", label: "Applied" },
      { date: "2025-10-28", label: "Recruiter screen" },
      { date: "2025-11-06", label: "Technical interview" },
      { date: "2025-11-18", label: "Panel presentation" },
      { date: "2025-12-12", label: "Offer received" },
    ],
    prepDocId: "prep-cloudflare",
    metrics: {
      touchpoints: 9,
      daysSinceApply: 59,
      confidence: 86,
    },
    tags: ["Security", "Network", "Architecture", "Enterprise"],
  },
  {
    id: "notion-se",
    company: "Notion",
    title: "Solutions Consultant",
    applicationDate: "2025-11-19",
    contactName: "Hannah Kim",
    contactType: "Cold Outbound",
    messaged: "Yes",
    response: "Pending",
    phase: "Phone Screen",
    nextStep: "Case study prep 12/22",
    timeline: [
      { date: "2025-11-19", label: "Applied" },
      { date: "2025-11-20", label: "Outbound message to recruiter" },
      { date: "2025-12-04", label: "Recruiter screen completed" },
    ],
    prepDocId: "prep-notion",
    metrics: {
      touchpoints: 3,
      daysSinceApply: 30,
      confidence: 73,
    },
    tags: ["Productivity", "Workflow", "Storytelling", "Demo"],
  },
  {
    id: "shopify-se",
    company: "Shopify",
    title: "Partner Solutions Engineer",
    applicationDate: "2025-11-02",
    contactName: "Ethan Brooks",
    contactType: "Warm Intro",
    messaged: "Yes",
    response: "Yes",
    phase: "Interview",
    nextStep: "Partner scenario walkthrough 12/27",
    timeline: [
      { date: "2025-11-02", label: "Applied" },
      { date: "2025-11-05", label: "Intro via partner lead" },
      { date: "2025-11-14", label: "Recruiter screen" },
      { date: "2025-11-29", label: "Round 1 interview" },
    ],
    prepDocId: "prep-shopify",
    metrics: {
      touchpoints: 5,
      daysSinceApply: 47,
      confidence: 77,
    },
    tags: ["Ecommerce", "Platform", "Integration", "Architecture"],
  },
  {
    id: "snowflake-se",
    company: "Snowflake",
    title: "Sales Engineer",
    applicationDate: "2025-12-01",
    contactName: "N/A",
    contactType: "Inbound",
    messaged: "No",
    response: "Pending",
    phase: "Applied",
    nextStep: "Tailor pitch deck + follow up 12/21",
    timeline: [
      { date: "2025-12-01", label: "Applied" },
      { date: "2025-12-06", label: "Built target account notes" },
    ],
    prepDocId: "prep-snowflake",
    metrics: {
      touchpoints: 1,
      daysSinceApply: 18,
      confidence: 66,
    },
    tags: ["Data", "Analytics", "Enterprise", "SE"],
  },
  {
    id: "hubspot-se",
    company: "HubSpot",
    title: "Solutions Engineer",
    applicationDate: "2025-10-24",
    contactName: "Rachel Stone",
    contactType: "Referral",
    messaged: "Yes",
    response: "No",
    phase: "Rejected",
    nextStep: "Request feedback + keep warm 12/20",
    timeline: [
      { date: "2025-10-24", label: "Applied" },
      { date: "2025-10-29", label: "Recruiter screen" },
      { date: "2025-11-07", label: "Hiring manager interview" },
      { date: "2025-11-14", label: "Rejected" },
    ],
    prepDocId: "prep-hubspot",
    metrics: {
      touchpoints: 4,
      daysSinceApply: 56,
      confidence: 30,
    },
    tags: ["CRM", "GTM", "Storytelling"],
  },
  {
    id: "atlassian-am",
    company: "Atlassian",
    title: "Strategic Account Manager",
    applicationDate: "2025-12-05",
    contactName: "Jordan Wells",
    contactType: "Cold Outbound",
    messaged: "Yes",
    response: "Pending",
    phase: "Applied",
    nextStep: "Follow-up note 12/26",
    timeline: [
      { date: "2025-12-05", label: "Applied" },
      { date: "2025-12-06", label: "Outbound email sent" },
    ],
    prepDocId: "prep-atlassian",
    metrics: {
      touchpoints: 2,
      daysSinceApply: 14,
      confidence: 63,
    },
    tags: ["SaaS", "Enterprise", "Account Management"],
  },
  {
    id: "mongodb-sa",
    company: "MongoDB",
    title: "Senior Solutions Architect",
    applicationDate: "2025-11-06",
    contactName: "Chris Nguyen",
    contactType: "Warm",
    messaged: "Yes",
    response: "Yes",
    phase: "Interview",
    nextStep: "Architecture deep-dive 12/30",
    timeline: [
      { date: "2025-11-06", label: "Applied" },
      { date: "2025-11-12", label: "Recruiter screen" },
      { date: "2025-11-21", label: "Technical screen" },
      { date: "2025-12-09", label: "Panel scheduled" },
    ],
    prepDocId: "prep-mongodb",
    metrics: {
      touchpoints: 6,
      daysSinceApply: 43,
      confidence: 75,
    },
    tags: ["Database", "Architecture", "Enterprise", "Delivery"],
  },
  {
    id: "airtable-se",
    company: "Airtable",
    title: "Solutions Engineer",
    applicationDate: "2025-12-03",
    contactName: "N/A",
    contactType: "Inbound",
    messaged: "No",
    response: "Pending",
    phase: "Applied",
    nextStep: "Build demo workspace + follow-up 12/22",
    timeline: [
      { date: "2025-12-03", label: "Applied" },
      { date: "2025-12-08", label: "Drafted demo outline", notes: "Ops workflow + automation" },
    ],
    prepDocId: "prep-airtable",
    metrics: {
      touchpoints: 2,
      daysSinceApply: 16,
      confidence: 69,
    },
    tags: ["Workflow", "Automation", "Demo", "SMB"],
  },
  {
    id: "canva-am",
    company: "Canva",
    title: "Account Executive (Mid-Market)",
    applicationDate: "2025-11-28",
    contactName: "Sophia Martinez",
    contactType: "Warm Intro",
    messaged: "Yes",
    response: "Yes",
    phase: "Phone Screen",
    nextStep: "Discovery roleplay 12/24",
    timeline: [
      { date: "2025-11-28", label: "Applied" },
      { date: "2025-12-02", label: "Intro call completed" },
      { date: "2025-12-11", label: "Roleplay scheduled" },
    ],
    prepDocId: "prep-canva",
    metrics: {
      touchpoints: 4,
      daysSinceApply: 21,
      confidence: 72,
    },
    tags: ["Design", "GTM", "Sales", "Storytelling"],
  },
  {
    id: "twilio-se",
    company: "Twilio",
    title: "Solutions Engineer",
    applicationDate: "2025-10-27",
    contactName: "N/A",
    contactType: "Cold Outbound",
    messaged: "Yes",
    response: "No",
    phase: "Rejected",
    nextStep: "Log learnings + revisit in 6 months",
    timeline: [
      { date: "2025-10-27", label: "Applied" },
      { date: "2025-10-30", label: "Recruiter screen" },
      { date: "2025-11-08", label: "Rejected" },
    ],
    prepDocId: "prep-twilio",
    metrics: {
      touchpoints: 3,
      daysSinceApply: 53,
      confidence: 28,
    },
    tags: ["API", "Messaging", "Platform"],
  },
  {
    id: "github-se",
    company: "GitHub",
    title: "Solutions Engineer (Enterprise)",
    applicationDate: "2025-11-14",
    contactName: "Olivia Chen",
    contactType: "Referral",
    messaged: "Yes",
    response: "Yes",
    phase: "Interview",
    nextStep: "System design + story bank 12/29",
    timeline: [
      { date: "2025-11-14", label: "Applied" },
      { date: "2025-11-18", label: "Recruiter screen" },
      { date: "2025-11-27", label: "Technical interview" },
      { date: "2025-12-06", label: "Loop scheduled" },
    ],
    prepDocId: "prep-github",
    metrics: {
      touchpoints: 6,
      daysSinceApply: 35,
      confidence: 79,
    },
    tags: ["Developer Tools", "Enterprise", "Architecture", "Demo"],
  },
  {
    id: "openai-se",
    company: "OpenAI",
    title: "Solutions Engineer",
    applicationDate: "2025-12-10",
    contactName: "N/A",
    contactType: "Inbound",
    messaged: "No",
    response: "Pending",
    phase: "Applied",
    nextStep: "Draft customer story + follow up 12/27",
    timeline: [
      { date: "2025-12-10", label: "Applied" },
      { date: "2025-12-12", label: "Wrote role narrative", notes: "AI + customer workflow focus" },
    ],
    prepDocId: "prep-openai",
    metrics: {
      touchpoints: 1,
      daysSinceApply: 9,
      confidence: 71,
    },
    tags: ["AI", "Enterprise", "Platform", "Storytelling"],
  },
  {
    id: "coinbase-csm",
    company: "Coinbase",
    title: "Customer Success Manager",
    applicationDate: "2025-11-22",
    contactName: "Ben Carter",
    contactType: "Warm",
    messaged: "Yes",
    response: "Pending",
    phase: "Phone Screen",
    nextStep: "Prep for CSM screen 12/21",
    timeline: [
      { date: "2025-11-22", label: "Applied" },
      { date: "2025-11-23", label: "Intro note sent" },
      { date: "2025-12-05", label: "Recruiter screen completed" },
    ],
    prepDocId: "prep-coinbase",
    metrics: {
      touchpoints: 4,
      daysSinceApply: 27,
      confidence: 68,
    },
    tags: ["Fintech", "Enterprise", "Customer Success", "GTM"],
  },
  {
    id: "asana-se",
    company: "Asana",
    title: "Solutions Consultant (Enterprise)",
    applicationDate: "2025-11-09",
    contactName: "N/A",
    contactType: "Cold Outbound",
    messaged: "Yes",
    response: "Yes",
    phase: "Interview",
    nextStep: "Presentation prep 12/28",
    timeline: [
      { date: "2025-11-09", label: "Applied" },
      { date: "2025-11-12", label: "Outbound message" },
      { date: "2025-11-20", label: "Recruiter screen" },
      { date: "2025-12-07", label: "Case prompt received" },
    ],
    prepDocId: "prep-asana",
    metrics: {
      touchpoints: 5,
      daysSinceApply: 40,
      confidence: 73,
    },
    tags: ["Productivity", "Workflow", "Enterprise", "Storytelling"],
  },
  {
    id: "salesforce-se",
    company: "Salesforce",
    title: "Solutions Engineer (Data Cloud)",
    applicationDate: "2025-10-18",
    contactName: "Keisha Brown",
    contactType: "Warm Intro",
    messaged: "Yes",
    response: "Yes",
    phase: "Interview",
    nextStep: "Panel prep + demo narrative 12/26",
    timeline: [
      { date: "2025-10-18", label: "Applied" },
      { date: "2025-10-23", label: "Recruiter screen" },
      { date: "2025-11-02", label: "Hiring manager interview" },
      { date: "2025-11-19", label: "Technical presentation scheduled" },
    ],
    prepDocId: "prep-salesforce",
    metrics: {
      touchpoints: 7,
      daysSinceApply: 62,
      confidence: 76,
    },
    tags: ["Data", "Enterprise", "Architecture", "Demo"],
  },
  {
    id: "zendesk-am",
    company: "Zendesk",
    title: "Enterprise Account Manager",
    applicationDate: "2025-12-08",
    contactName: "N/A",
    contactType: "Inbound",
    messaged: "No",
    response: "Pending",
    phase: "Applied",
    nextStep: "Reach out to hiring manager 12/23",
    timeline: [
      { date: "2025-12-08", label: "Applied" },
      { date: "2025-12-12", label: "Researched customer support motion" },
    ],
    prepDocId: "prep-zendesk",
    metrics: {
      touchpoints: 1,
      daysSinceApply: 11,
      confidence: 62,
    },
    tags: ["Support", "SaaS", "Enterprise", "Account Management"],
  },
];

export const prepDocs: Record<string, PrepDoc> = {
  "prep-bex": {
    id: "prep-bex",
    overview:
      "Enterprise data platform focused on analytics workflows and customer collaboration.",
    companySummary:
      "Bex provides a unified data analytics platform that helps teams collaborate on data insights, build dashboards, and share analytics workflows across organizations.",
    whyCompany:
      "Combines my background in data pipelines, customer-facing storytelling, and technical solution design. Aligns with my experience driving clarity with data.",
    productPillars: [
      "Unified analytics workspace",
      "Collaborative data workflows",
      "Enterprise governance and security",
      "API integrations and automation",
    ],
    customerProfiles: [
      "Analytics teams needing faster iteration",
      "Data engineers collaborating with business teams",
      "Operations teams running repeatable analytics workflows",
    ],
    interviewQuestions: [
      "How do SEs influence product roadmap?",
      "What does 90-day success look like?",
      "Where is the platform headed in 2025?",
    ],
    tailoredStories: [
      "Technical validation workflow",
      "Usage reporting and upsell",
      "Automation and integration proof",
    ],
    questionsForThem: [
      "How do they translate data insights into business outcomes?",
      "How tightly do SEs pair with AEs during technical evaluations?",
    ],
    prepChecklist: [
      "Review platform demos",
      "Map Bex pillars to STAR stories",
      "Outline discovery questions by persona",
    ],
  },
  "prep-nearmap": {
    id: "prep-nearmap",
    overview: "Return to Nearmap with strategic focus on enterprise accounts.",
    companySummary:
      "Nearmap delivers high-res aerial imagery and AI-derived data to AEC, insurance, and public sector.",
    whyCompany:
      "Deep domain experience, relationships, and proven track record upselling analytics-driven contracts.",
    productPillars: [
      "Aerial capture + data freshness",
      "AI-derived features",
      "Delivery via APIs, WMS, custom apps",
    ],
    customerProfiles: ["AEC firms", "Insurance carriers", "Public sector agencies"],
    interviewQuestions: ["What has changed since 2023 in GTM motion?", "SE vs AE responsibilities?"],
    tailoredStories: ["Burns & McDonnell upsell", "Farmers/State Farm offline delivery"],
    questionsForThem: ["Where do they see biggest upsell opportunities now?", "How is AI product adoption going?"],
    prepChecklist: ["Refresh account notes", "Update ROI calculators", "Review offline delivery scripts"],
  },
  "prep-mach9": {
    id: "prep-mach9",
    overview: "Follow-up application for AI-driven geospatial workflows.",
    companySummary:
      "Mach9 builds LiDAR feature extraction and analytics pipelines for infrastructure and utilities.",
    whyCompany: "Aligned with prior experience in product + AI collaboration.",
    productPillars: ["LiDAR ingestion", "AI vector extraction", "Dashboards + reporting"],
    customerProfiles: ["Utilities", "Engineering firms", "Annotation teams"],
    interviewQuestions: ["How are they scaling annotation ops?", "What’s roadmap for customer analytics?"],
    tailoredStories: ["Mach9 usage reporting", "Potree rendering initiative"],
    questionsForThem: ["Where do they need GTM automation most?", "How do SEs balance AI + product work?"],
    prepChecklist: ["Draft outbound message", "Highlight cross-functional wins", "Prep annotation metrics showcase"],
  },
  "prep-oracle": {
    id: "prep-oracle",
    overview: "Learnings from Oracle cloud SE loop to reuse later.",
    companySummary: "Enterprise-grade cloud platform with AI + data services.",
    whyCompany: "Large scale customers, complex solutions, strong SE org.",
    productPillars: ["OCI infrastructure", "Database + data services", "AI/ML platform"],
    customerProfiles: ["Global enterprises", "Public sector"],
    interviewQuestions: ["What do they prioritize in SE storytelling?", "How do they measure impact?"],
    tailoredStories: ["Mach9 digital surveyor", "Nearmap insurance delivery"],
    questionsForThem: ["Where did gaps occur this time?", "What skills to sharpen?"],
    prepChecklist: ["Retro doc", "Flag questions for mentors"],
  },
  "prep-figma": {
    id: "prep-figma",
    overview: "Design and collaboration platform used by product teams across the enterprise.",
    companySummary:
      "Figma provides browser-based design, prototyping, and collaboration tools that unify designers and engineers in a single workflow.",
    whyCompany:
      "Strong fit for a technical storyteller role: cross-functional workflows, enterprise rollouts, and demo-driven evaluation. I can bridge product, security, and engineering stakeholders.",
    productPillars: ["Real-time collaboration", "Design-to-dev workflows", "Enterprise governance", "Platform + integrations"],
    customerProfiles: ["Design org leaders", "Engineering managers", "Security/IT admins", "Product teams at scale"],
    interviewQuestions: ["How does the SE team support enterprise rollouts?", "What makes a great Figma technical demo?"],
    tailoredStories: ["Technical validation workflow", "Usage reporting and upsell"],
    questionsForThem: ["How do you measure demo impact?", "Where are the biggest expansion levers today?"],
    prepChecklist: ["Review enterprise admin features", "Build demo storyboard", "Map stakeholders + risks"],
  },
  "prep-datadog": {
    id: "prep-datadog",
    overview: "Cloud observability platform spanning metrics, logs, traces, and security signals.",
    companySummary:
      "Datadog helps engineering teams monitor infrastructure and applications with unified dashboards, alerting, APM, and security monitoring.",
    whyCompany:
      "High-leverage SE work: architecture depth, real ROI storytelling, and enterprise-scale rollouts. Strong overlap with analytics + automation experience.",
    productPillars: ["Unified observability", "APM + tracing", "Log management", "Security monitoring"],
    customerProfiles: ["Platform engineering", "SRE teams", "Security teams", "CTO org at enterprise accounts"],
    interviewQuestions: ["What does the best demo look like for enterprise buyers?", "How do SEs partner with AEs?"],
    tailoredStories: ["Technical validation workflow", "Usage reporting and upsell"],
    questionsForThem: ["How do you handle bake-off comparisons?", "How do you quantify time-to-value in pilots?"],
    prepChecklist: ["Draft demo narrative", "Prepare architecture diagram", "Collect 2-3 incident response stories"],
  },
  "prep-stripe": {
    id: "prep-stripe",
    overview: "Payments and financial infrastructure powering online businesses.",
    companySummary:
      "Stripe provides APIs and tooling for payments, billing, fraud prevention, and revenue operations across global markets.",
    whyCompany:
      "I enjoy API-first platforms with complex customer environments. Strong opportunity to translate technical constraints into adoption plans and outcomes.",
    productPillars: ["Payments APIs", "Billing + subscriptions", "Fraud + risk", "Enterprise integrations"],
    customerProfiles: ["Fintech teams", "Ecommerce companies", "Enterprise platforms", "Operations + finance stakeholders"],
    interviewQuestions: ["How do TAMs influence adoption plans?", "What does success look like in the first 90 days?"],
    tailoredStories: ["Automation and integration proof", "Customer enablement playbook"],
    questionsForThem: ["What are common failure modes in integration projects?", "How do you align technical + business stakeholders?"],
    prepChecklist: ["Review TAM expectations", "Prepare integration troubleshooting story", "Outline adoption plan template"],
  },
  "prep-cloudflare": {
    id: "prep-cloudflare",
    overview: "Network and security platform with performance, DNS, WAF, and zero trust offerings.",
    companySummary:
      "Cloudflare delivers edge network services for security and performance, helping companies protect apps, accelerate sites, and manage network traffic.",
    whyCompany:
      "Great fit for architecture-heavy demos and technical evaluation leadership. Strong alignment with security + systems thinking.",
    productPillars: ["Edge network", "Zero Trust", "Application security", "Developer platform"],
    customerProfiles: ["Security teams", "Network teams", "Platform engineering", "Digital transformation leaders"],
    interviewQuestions: ["How do SEs run POCs with security buyers?", "What technical depth is expected for enterprise accounts?"],
    tailoredStories: ["Architecture + delivery frameworks", "Cross-functional pilot execution"],
    questionsForThem: ["Where do POCs most commonly stall?", "How do you measure SE effectiveness?"],
    prepChecklist: ["Draft POC plan", "Prepare security narrative", "Identify 3 common objections + answers"],
  },
  "prep-notion": {
    id: "prep-notion",
    overview: "Workspace platform for docs, wikis, and project tracking with customizable workflows.",
    companySummary:
      "Notion helps teams centralize knowledge and operations using flexible databases, docs, and integrations to replace fragmented tooling.",
    whyCompany:
      "I like workflow products where value is demonstrated through concrete examples. Strong opportunity for consultative discovery and tailored solutions.",
    productPillars: ["Docs + wiki", "Database workflows", "Integrations", "Enterprise admin + security"],
    customerProfiles: ["Operations teams", "Product teams", "IT admins", "Knowledge management leaders"],
    interviewQuestions: ["How do you tailor a Notion demo by persona?", "What are common enterprise blockers?"],
    tailoredStories: ["Technical validation workflow", "Automation and integration proof"],
    questionsForThem: ["How do you quantify ROI in knowledge/workflow tooling?", "What’s the most common migration path?"],
    prepChecklist: ["Build demo workspace", "Outline discovery questions", "Prep migration and governance talking points"],
  },
  "prep-shopify": {
    id: "prep-shopify",
    overview: "Commerce platform enabling merchants and partners to build, sell, and scale online.",
    companySummary:
      "Shopify provides a commerce operating system with APIs, apps, and partner tooling for storefronts, payments, and fulfillment.",
    whyCompany:
      "Partner-facing technical work is a strong match: discovery, integration design, and demos that prove value with real workflows.",
    productPillars: ["Partner ecosystem", "Commerce APIs", "Payments + checkout", "Operational tooling"],
    customerProfiles: ["Agencies", "App partners", "Mid-market merchants", "Enterprise commerce teams"],
    interviewQuestions: ["How does partner SE work differ from direct enterprise SE?", "What makes a great partner technical workshop?"],
    tailoredStories: ["Automation and integration proof", "Delivery frameworks"],
    questionsForThem: ["What integrations are most in-demand?", "How do you evaluate partner technical quality?"],
    prepChecklist: ["Map partner personas", "Prepare integration diagram", "Draft workshop agenda"],
  },
  "prep-snowflake": {
    id: "prep-snowflake",
    overview: "Cloud data platform for warehousing, data sharing, and governance.",
    companySummary:
      "Snowflake enables organizations to consolidate data workloads and share governed datasets across teams and partners.",
    whyCompany:
      "Data + analytics storytelling is a core strength; I can translate technical architecture into measurable outcomes for buyers.",
    productPillars: ["Data warehousing", "Data sharing + marketplace", "Governance", "Workload performance"],
    customerProfiles: ["Data engineering", "Analytics teams", "BI leadership", "CIO org"],
    interviewQuestions: ["What are the most common pilot success criteria?", "How do SEs handle competitive bake-offs?"],
    tailoredStories: ["Usage reporting and upsell", "Technical validation workflow"],
    questionsForThem: ["Where do pilots fail?", "How do you quantify time-to-value?"],
    prepChecklist: ["Draft pilot success metrics", "Prepare architecture narrative", "Collect 2 data ROI stories"],
  },
  "prep-hubspot": {
    id: "prep-hubspot",
    overview: "CRM and GTM platform across marketing, sales, and customer success.",
    companySummary:
      "HubSpot helps businesses manage the full customer lifecycle with integrated CRM, automation, and reporting.",
    whyCompany:
      "Strong GTM alignment and storytelling. Opportunity to drive clear outcomes in adoption and expansion motions.",
    productPillars: ["CRM foundation", "Automation + workflows", "Reporting + analytics", "Ecosystem integrations"],
    customerProfiles: ["Sales ops", "Marketing ops", "RevOps", "Customer success leaders"],
    interviewQuestions: ["How do you handle multi-stakeholder discovery?", "What are top objections in enterprise deals?"],
    tailoredStories: ["Usage reporting and upsell", "Cross-functional alignment"],
    questionsForThem: ["How are SEs measured?", "What does 'great discovery' look like here?"],
    prepChecklist: ["Prep discovery script", "Outline value prop by persona", "Collect 2 adoption stories"],
  },
  "prep-atlassian": {
    id: "prep-atlassian",
    overview: "Work management and developer tools powering enterprise teams.",
    companySummary:
      "Atlassian builds Jira, Confluence, and related tooling that helps teams plan, build, and ship software and operations workflows.",
    whyCompany:
      "Enterprise account work plus workflow tooling fits well. I can drive structured discovery and connect outcomes to adoption milestones.",
    productPillars: ["Work management", "Knowledge + collaboration", "Developer platform", "Enterprise governance"],
    customerProfiles: ["Engineering leadership", "IT service management", "PMO/ops teams", "Security/IT admins"],
    interviewQuestions: ["How do you position cloud migration vs data center?", "What’s the account expansion motion?"],
    tailoredStories: ["Usage reporting and upsell", "Workflow enablement"],
    questionsForThem: ["Where do accounts struggle with adoption?", "How do you partner across product + support?"],
    prepChecklist: ["Review product suite", "Prepare adoption plan outline", "Map objections + mitigation"],
  },
  "prep-mongodb": {
    id: "prep-mongodb",
    overview: "Developer data platform with document databases and search/vector capabilities.",
    companySummary:
      "MongoDB helps teams build applications with flexible data models, managed services, and tooling for performance and scale.",
    whyCompany:
      "Architecture-heavy customer conversations and hands-on technical delivery are a great match. Strong overlap with building scalable workflows.",
    productPillars: ["Managed database", "Performance + scale", "Developer tooling", "Security + governance"],
    customerProfiles: ["Backend engineering teams", "Platform teams", "CTO org", "Data platform leaders"],
    interviewQuestions: ["What technical depth is expected in SA role?", "What are the biggest deal blockers?"],
    tailoredStories: ["Architecture + delivery frameworks", "Technical validation workflow"],
    questionsForThem: ["How do you run POCs and success criteria?", "How do you handle migration narratives?"],
    prepChecklist: ["Draft migration story", "Prepare architecture diagrams", "List 3 performance war stories"],
  },
  "prep-airtable": {
    id: "prep-airtable",
    overview: "No-code/low-code platform for building operational workflows and automations.",
    companySummary:
      "Airtable enables teams to build flexible databases, automation, and apps to run business processes without heavy engineering.",
    whyCompany:
      "Consultative discovery and demo building are core strengths. Great space for rapid prototyping and stakeholder alignment.",
    productPillars: ["Workflow apps", "Automation", "Data modeling", "Integrations"],
    customerProfiles: ["Ops teams", "RevOps", "Marketing ops", "Program managers"],
    interviewQuestions: ["How do you scope an Airtable build quickly?", "What makes a high-impact demo?"],
    tailoredStories: ["Automation and integration proof", "Workflow enablement"],
    questionsForThem: ["How do you measure adoption?", "What are the common expansion triggers?"],
    prepChecklist: ["Build sample base", "Draft demo storyboard", "Prepare discovery prompts by persona"],
  },
  "prep-canva": {
    id: "prep-canva",
    overview: "Design platform enabling teams to create content quickly and consistently.",
    companySummary:
      "Canva provides collaborative content creation with brand controls and templates for marketing and business teams.",
    whyCompany:
      "Strong overlap with storytelling and consultative selling. Great environment for structured discovery and value-based messaging.",
    productPillars: ["Content creation", "Brand governance", "Collaboration", "Enterprise admin"],
    customerProfiles: ["Marketing leaders", "Brand teams", "Enablement teams", "IT admins"],
    interviewQuestions: ["How do you handle brand/security objections?", "What does a great discovery call look like?"],
    tailoredStories: ["Data storytelling", "Cross-functional alignment"],
    questionsForThem: ["What drives enterprise expansions?", "How do you measure AE success beyond revenue?"],
    prepChecklist: ["Prep discovery roleplay", "Map outcomes by persona", "Collect 2 value stories"],
  },
  "prep-twilio": {
    id: "prep-twilio",
    overview: "Communications APIs for messaging, voice, and customer engagement.",
    companySummary:
      "Twilio provides programmable communication services and tools to build customer engagement workflows.",
    whyCompany:
      "API-driven technical conversations and implementation planning fit well. Opportunity to lead discovery and translate requirements into architecture.",
    productPillars: ["Messaging + voice APIs", "Customer engagement", "Deliverability", "Integrations"],
    customerProfiles: ["Product engineering", "Support ops", "RevOps", "Customer engagement teams"],
    interviewQuestions: ["How do you scope communication architecture quickly?", "What are top reliability concerns?"],
    tailoredStories: ["Automation and integration proof", "Delivery frameworks"],
    questionsForThem: ["What are top deal blockers?", "How do you handle compliance/security questions?"],
    prepChecklist: ["Prepare architecture diagram", "Draft discovery questions", "Collect 2 reliability stories"],
  },
  "prep-github": {
    id: "prep-github",
    overview: "Developer platform for source control, CI/CD, security, and collaboration.",
    companySummary:
      "GitHub supports software teams with repositories, automation, security scanning, and enterprise collaboration features.",
    whyCompany:
      "Enterprise technical storytelling plus platform architecture aligns closely with how I operate—structured discovery, demo narrative, and measurable outcomes.",
    productPillars: ["Developer workflows", "CI/CD automation", "Security + compliance", "Enterprise administration"],
    customerProfiles: ["Engineering leadership", "Platform engineering", "Security teams", "DevOps teams"],
    interviewQuestions: ["How do you tailor platform demos by persona?", "What does success look like in enterprise rollouts?"],
    tailoredStories: ["Technical validation workflow", "Cross-functional pilot execution"],
    questionsForThem: ["What’s the biggest adoption hurdle?", "How do you partner with security stakeholders?"],
    prepChecklist: ["Build demo narrative", "Map stakeholders", "Prepare 2 platform adoption stories"],
  },
  "prep-openai": {
    id: "prep-openai",
    overview: "AI platform enabling companies to build and deploy LLM-powered experiences.",
    companySummary:
      "OpenAI provides models and tooling that help teams embed AI capabilities into products and workflows with safety and reliability considerations.",
    whyCompany:
      "The work sits at the intersection of technical depth and customer outcomes. I can translate ambiguity into plans, prototypes, and measurable business value.",
    productPillars: ["Model APIs", "Safety + policy", "Developer tooling", "Enterprise deployments"],
    customerProfiles: ["Product teams", "Platform engineering", "Data/AI teams", "Security/compliance stakeholders"],
    interviewQuestions: ["How do you define success for an AI pilot?", "What’s the approach to safety + governance?"],
    tailoredStories: ["Technical validation workflow", "Automation and integration proof"],
    questionsForThem: ["How do teams avoid 'toy demo' traps?", "What common blockers appear in productionization?"],
    prepChecklist: ["Draft pilot success criteria", "Prepare safety/governance talking points", "Outline 2 customer value narratives"],
  },
  "prep-coinbase": {
    id: "prep-coinbase",
    overview: "Crypto and financial services platform with enterprise and institutional products.",
    companySummary:
      "Coinbase provides products for consumers and institutional customers, spanning trading, custody, and platform services.",
    whyCompany:
      "Customer success work in fintech benefits from structured plans, stakeholder alignment, and clear ROI narratives—areas where I’m strong.",
    productPillars: ["Platform services", "Institutional products", "Security + compliance", "Integrations"],
    customerProfiles: ["Institutional customers", "Fintech partners", "Ops + risk teams", "Engineering stakeholders"],
    interviewQuestions: ["How do you manage adoption + risk concerns?", "How is success measured for CSMs?"],
    tailoredStories: ["Cross-functional alignment", "Adoption planning"],
    questionsForThem: ["What are the biggest churn drivers?", "How do teams build executive sponsor alignment?"],
    prepChecklist: ["Draft success plan template", "Prepare stakeholder map", "Collect 2 retention/expansion stories"],
  },
  "prep-asana": {
    id: "prep-asana",
    overview: "Work management platform for enterprise collaboration and operational clarity.",
    companySummary:
      "Asana helps teams plan and track work with dashboards, automation, and integrations to align on outcomes and execution.",
    whyCompany:
      "Strong match for consultative storytelling and building concrete workflows that demonstrate value quickly.",
    productPillars: ["Work tracking", "Automation", "Reporting", "Integrations"],
    customerProfiles: ["Operations leaders", "PMO teams", "IT admins", "Enterprise program teams"],
    interviewQuestions: ["How do you tailor demos for ops vs engineering?", "What’s the enterprise rollout motion?"],
    tailoredStories: ["Workflow enablement", "Cross-functional pilot execution"],
    questionsForThem: ["Where do enterprise rollouts stall?", "How do you measure time-to-value?"],
    prepChecklist: ["Build demo storyboard", "Draft discovery prompts", "Map 3 objection responses"],
  },
  "prep-salesforce": {
    id: "prep-salesforce",
    overview: "Enterprise CRM platform with data and automation products.",
    companySummary:
      "Salesforce provides CRM capabilities and enterprise data solutions, helping organizations unify customer data and run GTM operations.",
    whyCompany:
      "High-impact enterprise conversations where clear architecture and ROI storytelling matter. Strong alignment with data and customer leadership experience.",
    productPillars: ["CRM platform", "Data + analytics", "Automation", "Ecosystem integrations"],
    customerProfiles: ["RevOps", "IT admins", "Data teams", "Enterprise GTM leadership"],
    interviewQuestions: ["How do SEs run complex demos with multiple stakeholders?", "What defines a successful pilot?"],
    tailoredStories: ["Data storytelling", "Architecture + delivery frameworks"],
    questionsForThem: ["How is SE success measured?", "What’s the competitive landscape right now?"],
    prepChecklist: ["Draft demo narrative", "Prepare architecture diagram", "Collect 2 enterprise ROI stories"],
  },
  "prep-zendesk": {
    id: "prep-zendesk",
    overview: "Customer service platform for ticketing, messaging, and support operations.",
    companySummary:
      "Zendesk helps organizations run customer support and engagement workflows with automation, reporting, and integrations.",
    whyCompany:
      "Clear alignment with operational storytelling and driving adoption outcomes with measurable metrics.",
    productPillars: ["Support workflows", "Automation", "Reporting", "Integrations"],
    customerProfiles: ["Support leadership", "CX ops teams", "IT admins", "RevOps stakeholders"],
    interviewQuestions: ["What are top enterprise concerns in support tooling?", "How do AMs drive expansions?"],
    tailoredStories: ["Usage reporting and upsell", "Cross-functional alignment"],
    questionsForThem: ["What causes churn?", "What expands accounts fastest?"],
    prepChecklist: ["Prepare discovery questions", "Map outcomes + metrics", "Collect 2 expansion stories"],
  },
};

export const generalDocs: GeneralDoc[] = [
  {
    id: "master-prep",
    title: "Master Prep Narrative",
    summary: "Personal narrative, strengths, and how I operate as a technical storyteller.",
    content:
      "I am a solutions-focused engineer and operator with experience across civil engineering, aerial imagery, AI-driven geospatial workflows, and technical customer leadership. I run structured discovery, translate ambiguity into plans, and build prototypes that clarify value.",
    tags: ["Narrative", "Intro"],
  },
  {
    id: "strengths",
    title: "Strengths & Growth Areas",
    summary: "Quick reference for interviews.",
    content:
      "Strengths: Technical communication, operator mindset, customer leadership. Growth: delegating earlier; fix by defining ownership at kickoff.",
    tags: ["Self-awareness"],
  },
  {
    id: "common-questions",
    title: "Common Questions & Short Answers",
    summary: "Prep bank for frequently asked prompts.",
    content:
      "Tell me about yourself – highlight Mach9 + Nearmap blend. How do you learn – structured experiments, fast prototypes, writing docs. Why this role – love intersection of technical depth and storytelling.",
    tags: ["Q&A"],
  },
];

export const starStories: StarStory[] = [
  {
    id: "burns-mcd",
    title: "Burns & McDonnell Data Upsell",
    situation:
      "Top 5 account consuming 2x contracted data with little transparency tied to ROI, renewal pending.",
    task: "Right-size pricing and justify increase without moving to unlimited plan.",
    action:
      "Built detailed reporting by user, group, area, and project; partnered with product to track WMS usage; coordinated CSM cadence; delivered sample reports pre-renewal.",
    result:
      "Closed $530k upsell (largest AEC deal) while keeping scalable pricing. Created repeatable playbook for HDR/VHB.",
    metrics: "Upsell +$310k, 2x reporting adoption, future-proofed pricing model.",
    tags: ["Enterprise", "Data storytelling", "Upsell"],
    industries: ["AEC", "Infrastructure"],
  },
  {
    id: "farmers",
    title: "Farmers & State Farm Offline Delivery",
    situation: "Insurance teams needed API-scale data delivery with tight tracking.",
    task: "Design architecture for clipped imagery + AI data, ensure handoff clarity.",
    action:
      "Built MVP scripts leveraging coverage/tile/AI APIs, deployed on EC2 for reliability, coordinated cross-functionally for tracking + support.",
    result: "Enabled first large insurance close (~$1M) and established repeatable delivery framework.",
    metrics: "Reduced delivery time 60%, unlocked tracking for upsells.",
    tags: ["Architecture", "Delivery", "Insurance"],
    industries: ["Insurance"],
  },
  {
    id: "mach9-usage",
    title: "Mach9 Usage Reporting",
    situation: "No visibility into AI extraction outputs or annotation throughput.",
    task: "Instrument platform to drive ROI conversations and internal planning.",
    action:
      "Instrumented database + Grafana dashboards for features extracted, QA time, edited features; funneled insights into customer reports.",
    result: "Improved upsell conversations, guided annotation resourcing, and increased confidence.",
    metrics: "Cut renewal cycle by 2 weeks, increased upsell hit rate 30%.",
    tags: ["Analytics", "Product", "AI"],
    industries: ["AI", "Geospatial"],
  },
];

function startOfWeekISO(date: Date) {
  // Monday-start week
  const d = new Date(date);
  const day = d.getDay(); // 0 Sun ... 6 Sat
  const diffToMonday = (day + 6) % 7;
  d.setDate(d.getDate() - diffToMonday);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatWeekLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

function buildAnalyticsSummary(sourceJobs: Job[]) {
  const interviewPhases = new Set<JobPhase>(["Phone Screen", "Interview"]);

  const totals = {
    applied: sourceJobs.length,
    responses: sourceJobs.filter((j) => j.response === "Yes").length,
    interviews: sourceJobs.filter((j) => interviewPhases.has(j.phase)).length,
    offers: sourceJobs.filter((j) => j.phase === "Offer").length,
  };

  // Bucket by application week so charts are consistent with the table/dashboard
  const weekBuckets = new Map<number, { applied: number; responses: number; interviews: number }>();
  for (const job of sourceJobs) {
    const appliedDate = new Date(job.applicationDate);
    const weekStart = startOfWeekISO(appliedDate);
    const key = weekStart.getTime();
    const bucket = weekBuckets.get(key) ?? { applied: 0, responses: 0, interviews: 0 };
    bucket.applied += 1;
    bucket.responses += job.response === "Yes" ? 1 : 0;
    bucket.interviews += interviewPhases.has(job.phase) ? 1 : 0;
    weekBuckets.set(key, bucket);
  }

  const velocity = Array.from(weekBuckets.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([weekStartMs, bucket]) => ({
      week: formatWeekLabel(new Date(weekStartMs)),
      applied: bucket.applied,
      responses: bucket.responses,
      interviews: bucket.interviews,
    }));

  // Mutually exclusive pipeline stages (sum == total applications)
  const pipeline = [
    { label: "Applied", value: sourceJobs.filter((j) => j.phase === "Applied").length },
    { label: "Interviewing", value: sourceJobs.filter((j) => interviewPhases.has(j.phase)).length },
    { label: "Offer", value: sourceJobs.filter((j) => j.phase === "Offer").length },
    { label: "Rejected", value: sourceJobs.filter((j) => j.phase === "Rejected").length },
  ];

  // Keep upcoming actions stable for the demo (ties into job detail routes)
  const upcomingActions = [
    { date: "2025-11-25", label: "Bex follow-up", jobId: "bex" },
    { date: "2025-11-26", label: "Nearmap pre-call prep", jobId: "near-map" },
    { date: "2025-11-28", label: "Mach9 outbound push", jobId: "mach9" },
  ];

  return { totals, velocity, pipeline, upcomingActions };
}

export const analyticsSummary = buildAnalyticsSummary(jobs);
export type AnalyticsSummary = ReturnType<typeof buildAnalyticsSummary>;


