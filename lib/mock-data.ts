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
    id: "hex",
    company: "Hex",
    title: "Solutions Engineer",
    applicationDate: "2025-10-29",
    contactName: "Angela Meyer",
    contactType: "Warm",
    messaged: "Yes",
    response: "Pending",
    phase: "Applied",
    nextStep: "Follow-up email 11/25",
    timeline: [
      { date: "2025-10-29", label: "Applied" },
      { date: "2025-10-30", label: "Messaged Angela on LinkedIn" },
      { date: "2025-11-05", label: "Prep doc drafted" },
    ],
    prepDocId: "prep-hex",
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
];

export const prepDocs: Record<string, PrepDoc> = {
  "prep-hex": {
    id: "prep-hex",
    overview:
      "Collaborative analytics + AI workspace. Focus on data workflows, Magic AI, and customer collaboration.",
    companySummary:
      "Hex unifies SQL, Python, AI cells, and interactive apps in a single workspace for analytics teams. It emphasizes rapid iteration, collaboration, and governed publishing.",
    whyCompany:
      "Combines my background in data pipelines, customer-facing storytelling, and AI workflow design. Aligns with my work at Mach9 and Nearmap driving clarity with data.",
    productPillars: [
      "Reactive workspace mixing SQL + Python + UI cells",
      "Magic AI for query/code/doc generation",
      "Publishing to apps, docs, dashboards",
      "Enterprise governance, semantic layer, RBAC",
    ],
    customerProfiles: [
      "Analytics/BI teams needing faster iteration",
      "Data scientists collaborating with GTM teams",
      "Ops teams running repeatable insights workflows",
    ],
    interviewQuestions: [
      "How do SEs influence product roadmap?",
      "What does 90-day success look like?",
      "Where is Magic AI headed in 2025?",
    ],
    tailoredStories: [
      "Mach9 validation workflow",
      "Nearmap usage reporting upsell",
      "Digital SE automation proof",
    ],
    questionsForThem: [
      "How do they translate 'everyone is a data person' into GTM motions?",
      "How tightly do SEs pair with AEs during technical evaluations?",
    ],
    prepChecklist: [
      "Review demo notebooks",
      "Map Hex pillars to STAR stories",
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

export const analyticsSummary = {
  totals: {
    applied: 24,
    responses: 9,
    interviews: 4,
    offers: 0,
  },
  velocity: [
    { week: "Oct 14", applied: 3, responses: 0, interviews: 0 },
    { week: "Oct 21", applied: 6, responses: 1, interviews: 1 },
    { week: "Oct 28", applied: 7, responses: 2, interviews: 1 },
    { week: "Nov 4", applied: 5, responses: 3, interviews: 1 },
    { week: "Nov 11", applied: 3, responses: 2, interviews: 1 },
  ],
  pipeline: [
    { label: "Applied", value: 18 },
    { label: "Responded", value: 9 },
    { label: "Interviewing", value: 4 },
    { label: "Rejected", value: 3 },
  ],
  upcomingActions: [
    { date: "2025-11-25", label: "Hex follow-up", jobId: "hex" },
    { date: "2025-11-26", label: "Nearmap pre-call prep", jobId: "near-map" },
    { date: "2025-11-28", label: "Mach9 outbound push", jobId: "mach9" },
  ],
};

export type AnalyticsSummary = typeof analyticsSummary;


