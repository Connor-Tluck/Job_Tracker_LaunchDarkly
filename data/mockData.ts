export type JobStatus = "Applied" | "Interviewing" | "Offer" | "Rejected";

export type ResponseStatus = "Yes" | "No" | "N/A";

export interface TimelineEntry {
  id: string;
  label: string;
  date: string;
  status: "completed" | "upcoming" | "blocked";
  notes?: string;
}

export interface Job {
  id: string;
  company: string;
  title: string;
  applicationDate: string;
  contactName?: string;
  contactType: "Cold Outbound" | "Warm Intro" | "Referral" | "Inbound";
  messaged: boolean;
  response: ResponseStatus;
  nextStep?: string;
  nextStepDate?: string;
  status: JobStatus;
  phase: string;
  impression?: string;
  jobPostingUrl?: string;
  prepDocId: string;
  tags: string[];
  lastActivity: string;
  timeline: TimelineEntry[];
}

export interface PrepDocSection {
  title: string;
  content: string;
}

export interface PrepDocument {
  id: string;
  companyOverview: string;
  whyExcitesMe: string;
  productPillars: string[];
  customerProfiles: string;
  relevantExperience: string[];
  expectedQuestions: string[];
  tailoredStories: string[];
  questionsForThem: string[];
  peopleToMeet: string[];
  preparationNotes: string[];
  prepSections: PrepDocSection[];
}

export interface MasterPrepDocument {
  id: string;
  personalNarrative: string;
  whatIDoWell: string[];
  howIThrive: string[];
  strengths: string[];
  growthAreas: string[];
  foundations: string[];
  commonQuestions: string[];
  starStoryIds: string[];
  extraNotes: string[];
}

export interface StarStory {
  id: string;
  title: string;
  customer: string;
  category: "Sales" | "Solutions" | "Technical Delivery" | "Personal";
  situation: string;
  task: string;
  action: string;
  result: string;
  metrics: string;
  tags: string[];
}

export interface AnalyticsSnapshot {
  applied: number;
  responses: number;
  interviews: number;
  offers: number;
  responseRate: number;
  interviewRate: number;
  followUpsDue: number;
  timeline: {
    date: string;
    applied: number;
    responses: number;
    interviews: number;
  }[];
  statusBreakdown: { label: string; value: number; color: string }[];
  pipelineVelocity: { stage: string; days: number }[];
}

export const jobs: Job[] = [
  {
    id: "bex",
    company: "Bex",
    title: "Solutions Engineer",
    applicationDate: "2024-10-29",
    contactType: "Cold Outbound",
    messaged: true,
    response: "No",
    nextStep: "Pre-call prep focus",
    status: "Applied",
    phase: "Applied",
    impression: "High fit: AI + analytics",
    jobPostingUrl: "https://bex.tech",
    prepDocId: "bex-doc",
    tags: ["AI", "Analytics", "Technical SE"],
    lastActivity: "2024-11-15",
    timeline: [
      {
        id: "bex-1",
        label: "Application Submitted",
        date: "2024-10-29",
        status: "completed",
      },
      {
        id: "bex-2",
        label: "Outbound Message",
        date: "2024-10-30",
        status: "completed",
        notes: "Sent LinkedIn note to recruiter",
      },
      {
        id: "bex-3",
        label: "Follow-up",
        date: "2024-11-18",
        status: "upcoming",
        notes: "Share tailored analytics deck",
      },
    ],
  },
  {
    id: "oracle-se",
    company: "Oracle",
    title: "Solutions Engineer - Cloud",
    applicationDate: "2024-11-04",
    contactName: "Jacob Hurst",
    contactType: "Cold Outbound",
    messaged: true,
    response: "Yes",
    nextStep: "Hiring Manager Screen",
    nextStepDate: "2024-11-26",
    status: "Interviewing",
    phase: "Phone Screen",
    impression: "Process heavy but valuable brand signal",
    jobPostingUrl: "https://careers.oracle.com",
    prepDocId: "oracle-se-doc",
    tags: ["Enterprise", "Cloud", "Platform"],
    lastActivity: "2024-11-12",
    timeline: [
      {
        id: "oracle-1",
        label: "Application Submitted",
        date: "2024-11-04",
        status: "completed",
      },
      {
        id: "oracle-2",
        label: "Recruiter Response",
        date: "2024-11-08",
        status: "completed",
        notes: "Attached case study prompt",
      },
      {
        id: "oracle-3",
        label: "Hiring Manager Screen",
        date: "2024-11-26",
        status: "upcoming",
        notes: "Need cloud transformation STAR story",
      },
    ],
  },
  {
    id: "statista",
    company: "Statista",
    title: "Solutions Engineer",
    applicationDate: "2024-11-04",
    contactName: "Kalina Pleil",
    contactType: "Cold Outbound",
    messaged: true,
    response: "Yes",
    nextStep: "Reviewing Application",
    status: "Interviewing",
    phase: "Applied",
    impression: "Strong storytelling and data alignment",
    jobPostingUrl: "https://www.statista.com/",
    prepDocId: "statista-doc",
    tags: ["Data", "Storytelling"],
    lastActivity: "2024-11-10",
    timeline: [
      {
        id: "statista-1",
        label: "Application Submitted",
        date: "2024-11-04",
        status: "completed",
      },
      {
        id: "statista-2",
        label: "Recruiter Reply",
        date: "2024-11-07",
        status: "completed",
        notes: "Requested samples of analytics storytelling",
      },
      {
        id: "statista-3",
        label: "Prep Refresh",
        date: "2024-11-22",
        status: "upcoming",
        notes: "Add Bex vs Statista comparison blurb",
      },
    ],
  },
  {
    id: "tiktok",
    company: "TikTok",
    title: "Solutions Engineer",
    applicationDate: "2024-10-30",
    contactType: "Inbound",
    messaged: false,
    response: "N/A",
    status: "Applied",
    phase: "Applied",
    impression: "Need warm intro",
    prepDocId: "tiktok-doc",
    tags: ["Social", "Realtime"],
    lastActivity: "2024-11-05",
    timeline: [
      {
        id: "tt-1",
        label: "Application Submitted",
        date: "2024-10-30",
        status: "completed",
      },
      {
        id: "tt-2",
        label: "Networking outreach",
        date: "2024-11-25",
        status: "upcoming",
        notes: "Ask Mach9 alum for intro",
      },
    ],
  },
  {
    id: "mach9",
    company: "Mach9",
    title: "Account Manager",
    applicationDate: "2024-10-29",
    contactType: "Warm Intro",
    messaged: true,
    response: "Yes",
    nextStep: "Working Session",
    status: "Interviewing",
    phase: "Working Session",
    impression: "Deep product familiarity",
    prepDocId: "mach9-doc",
    tags: ["AI", "Geospatial"],
    lastActivity: "2024-11-16",
    timeline: [
      {
        id: "mach9-1",
        label: "Reconnect with leadership",
        date: "2024-11-12",
        status: "completed",
      },
      {
        id: "mach9-2",
        label: "Working session prep",
        date: "2024-11-20",
        status: "upcoming",
        notes: "Highlight product roadmap influence",
      },
    ],
  },
];

export const prepDocuments: Record<string, PrepDocument> = {
  "bex-doc": {
    id: "bex-doc",
    companyOverview:
      "Bex is an enterprise data analytics platform that helps teams collaborate on data insights, build interactive dashboards, and share analytics workflows across organizations.",
    whyExcitesMe:
      "Combines my SE background with data storytelling. Focus on clarity, collaboration, and technical solution design aligns with my experience solving customer problems.",
    productPillars: [
      "Unified analytics workspace for data teams",
      "Collaborative data workflows and sharing",
      "Enterprise governance and security controls",
      "API integrations and automation capabilities",
    ],
    customerProfiles:
      "Data teams, analytics engineers, and business operators who need fast collaborative analysis and the ability to package insights as internal tools.",
    relevantExperience: [
      "Built data workflows and GTM alignment",
      "Developed APIs and automation for enterprise accounts",
      "Structured storytelling for technical and business stakeholders",
    ],
    expectedQuestions: [
      "Explain Bex's value differently for data teams vs executives.",
      "Walk through a time you guided a customer through a technical evaluation.",
      "Describe how you uncover the real problem behind a vague request.",
    ],
    tailoredStories: [
      "Technical validation for workflow guidance",
      "Data consumption clarity for enterprise upsell",
      "Automation and integration project",
    ],
    questionsForThem: [
      "How does Bex help companies democratize data access?",
      "Where do SEs influence product roadmap and platform strategy?",
      "What defines a successful 90-day ramp for this team?",
    ],
    peopleToMeet: ["Sarah Chen"],
    preparationNotes: [
      "Bring examples of data workflows and integrations",
      "Highlight operator mindset and structured discovery approach",
      "Emphasize experience bridging technical teams and exec stakeholders",
    ],
    prepSections: [
      {
        title: "Call Narrative Outline",
        content:
          "1. Re-intro + why Bex\n2. Customer problem framing\n3. Demo storyline: data workflows, collaboration, governance\n4. Proof of rigor examples",
      },
      {
        title: "Follow-up Assets",
        content:
          "- Send Bex vs legacy tools comparison\n- Include link to analytics storytelling deck\n- Offer tailored workshop outline",
      },
    ],
  },
  "oracle-se-doc": {
    id: "oracle-se-doc",
    companyOverview:
      "Oracle SE Cloud focuses on driving adoption of OCI and SaaS platforms through technical validation and transformation programs.",
    whyExcitesMe:
      "Opportunity to pair enterprise rigor with my experience packaging data and AI workflows for large customers.",
    productPillars: [
      "OCI infrastructure, database, networking",
      "Cloud applications and automation tooling",
      "Migration frameworks & customer engineering programs",
    ],
    customerProfiles:
      "Fortune 500 organizations undergoing multi-cloud modernization.",
    relevantExperience: [
      "Nearmap strategic account management with enterprise procurement cycles",
      "Mach9 roadmap influence and AI workflow integration",
    ],
    expectedQuestions: [
      "How do you run discovery with a technical buyer?",
      "Describe a time you pushed back on a feature request.",
    ],
    tailoredStories: [
      "Bexar County GIS integration",
      "Farmers offline data delivery",
    ],
    questionsForThem: [
      "How do SEs partner with AEs on complex RFPs?",
      "What is the balance of net-new vs expansion work?",
    ],
    peopleToMeet: ["Jacob Hurst"],
    preparationNotes: [
      "Prep cloud transformation narrative + ROI framing",
      "Bring up Grafana monitoring story for reliability questions",
    ],
    prepSections: [
      {
        title: "Case Study to Highlight",
        content:
          "Burns & McDonnell upsell showcasing data clarity + cross-functional alignment.",
      },
    ],
  },
  "statista-doc": {
    id: "statista-doc",
    companyOverview:
      "Statista delivers data storytelling platforms powering market intelligence for GTM, research, and analyst teams.",
    whyExcitesMe:
      "Blend of storytelling, data viz, and enablement matches my background.",
    productPillars: [
      "Market and consumer data warehouse",
      "Visualization and storytelling tooling",
      "Expert research services",
    ],
    customerProfiles:
      "GTM, strategy, analyst teams that need quick packaging of data narratives.",
    relevantExperience: [
      "Developed Looker reports for upsell identification (Nearmap)",
      "Created Mach9 usage dashboards for ROI storytelling",
    ],
    expectedQuestions: [
      "Describe a time you simplified a technical concept for mixed audience.",
    ],
    tailoredStories: ["Mach9 usage dashboards", "VHB contract restructuring"],
    questionsForThem: [
      "How do SEs enable customers to build narratives internally?",
    ],
    peopleToMeet: ["Kalina Pleil"],
    preparationNotes: [
      "Refresh STAR stories focused on storytelling and ROI.",
    ],
    prepSections: [
      {
        title: "Narrative Angle",
        content:
          "Focus on clarity + trust. Tie data back to decision making speed.",
      },
    ],
  },
  "tiktok-doc": {
    id: "tiktok-doc",
    companyOverview:
      "TikTok infrastructure teams focus on real-time, large-scale consumer experiences.",
    whyExcitesMe:
      "Chance to demonstrate realtime APIs + data workflows from Mach9.",
    productPillars: ["Realtime content infra", "Monetization platforms"],
    customerProfiles: "Internal product stakeholders",
    relevantExperience: ["Snap bulk delivery project"],
    expectedQuestions: ["How to scale technical pilots quickly?"],
    tailoredStories: ["Snap imagery delivery"],
    questionsForThem: ["Org structure for infra SEs?"],
    peopleToMeet: [],
    preparationNotes: ["Need warm intro"],
    prepSections: [
      {
        title: "Next Steps",
        content: "- Identify warm intro\n- Collect realtime SE stories",
      },
    ],
  },
  "mach9-doc": {
    id: "mach9-doc",
    companyOverview:
      "Mach9 builds LiDAR feature extraction and annotation tooling for geospatial teams.",
    whyExcitesMe: "I helped build it—deep context and unfinished roadmap items.",
    productPillars: [
      "Digital Surveyor platform",
      "AI-driven extraction pipeline",
      "Annotation ops + analytics",
    ],
    customerProfiles:
      "Survey firms, utilities, and mapping teams needing automation.",
    relevantExperience: ["Internal leadership across AI, product, GTM"],
    expectedQuestions: ["How would you ramp quickly as a boomerang hire?"],
    tailoredStories: ["Annotation usage dashboards"],
    questionsForThem: [
      "Where is the product headed in next 12 months?",
      "What GTM motions need reinforcing?",
    ],
    peopleToMeet: [],
    preparationNotes: ["Have POV on AI roadmap gaps."],
    prepSections: [
      {
        title: "Relationship Map",
        content:
          "- Exec sponsor\n- Product counterpart\n- Key customers to reference",
      },
    ],
  },
};

export const masterPrepDocument: MasterPrepDocument = {
  id: "master-prep",
  personalNarrative:
    "I am a solutions-focused engineer and product-minded operator across civil engineering, aerial imagery, AI-driven geospatial workflows, and technical customer roles. Most recently at Mach9 I bridged product, AI, and GTM to ship LiDAR workflows. Before that I partnered with enterprise customers at Nearmap building Python/JS tooling, APIs, and automation pipelines.",
  whatIDoWell: [
    "Communicate technical concepts simply",
    "Run structured discovery",
    "Build POCs that make ideas tangible",
    "Organize teams around outcomes",
  ],
  howIThrive: [
    "Solve ambiguous engineering problems",
    "Prototype quickly to test direction",
    "Explain the 'why' so customers make informed decisions",
  ],
  strengths: ["Technical communication", "Operator mindset", "Customer leadership"],
  growthAreas: [
    "Delegation – build shared ownership earlier",
    "Balance speed vs thoroughness by defining success upfront",
  ],
  foundations: [
    "Modern platforms integrate via APIs, SDKs, event-driven workflows.",
    "Tailor architectural depth to the audience, layering details gradually.",
    "DevOps flow: git → CI → CD → rollout → observability → rollback.",
  ],
  commonQuestions: [
    "Tell me about yourself.",
    "Why this role / what next?",
    "How do you handle ambiguity?",
    "Describe a time you guided a customer through a technical evaluation.",
    "Walk me through how you run discovery with a technical buyer.",
    "Tell me about a failure and what you learned.",
  ],
  starStoryIds: ["burns-mcd", "vhb", "hdr", "farmers", "snap", "mach9-usage"],
  extraNotes: [
    "Keep STAR stories tagged by industry.",
    "Prep questions to ask each interviewer and capture answers.",
  ],
};

export const starStories: StarStory[] = [
  {
    id: "burns-mcd",
    title: "Data-Driven Upsell Clarity",
    customer: "Burns & McDonnell",
    category: "Sales",
    situation:
      "Top-5 Nearmap account over-consuming imagery with unclear ROI alignment.",
    task: "Right-size renewal and drive upsell without unlimited data pricing.",
    action:
      "Built usage reporting (by user, group, project). Coordinated product, engineering, and marketing for tracking + shared presentations.",
    result:
      "Closed $530k upsell; largest enterprise AEC deal, avoided unlimited contract.",
    metrics: "$530k upsell | 800k ACV | repeatable model reused at HDR/VHB",
    tags: ["Enterprise", "Data Storytelling", "Renewal"],
  },
  {
    id: "vhb",
    title: "Hybrid Pricing Reframe",
    customer: "VHB",
    category: "Sales",
    situation:
      "Customer on complex hybrid contract resisting price increase despite usage growth.",
    task: "Justify increase without changing unlimited state model.",
    action:
      "Produced retroactive usage + sq/mi value framing, coordinated data + product teams.",
    result: "$240k upsell, ACV > $400k with multi-year stability.",
    metrics: "$240k upsell | 3-year term",
    tags: ["Pricing", "Negotiation"],
  },
  {
    id: "hdr",
    title: "Reactivating Legacy Account",
    customer: "HDR",
    category: "Sales",
    situation: "Former customer churned due to misaligned pricing visibility.",
    task: "Reopen conversation and provide clarity.",
    action:
      "Defined cost-center reporting + automation with CSM + Looker insights.",
    result: "$50k pilot signed, set stage for expansion.",
    metrics: "$50k pilot | reactivation",
    tags: ["Churn Winback", "Reporting"],
  },
  {
    id: "farmers",
    title: "Insurance Data Delivery MVP",
    customer: "Farmers / State Farm",
    category: "Technical Delivery",
    situation:
      "Insurance customers needed millions of property clips + AI data offline.",
    task: "Scope architecture, deliver MVP scripts, ensure scale + tracking.",
    action:
      "Built EC2-based workflow hitting coverage/tile/AI APIs, coordinated across exec, eng, and CS for delivery + tracking.",
    result:
      "Closed first 7-figure insurance deal, demonstrated SA team value.",
    metrics: "1M+ properties delivered",
    tags: ["Architecture", "APIs", "Cross-functional"],
  },
  {
    id: "snap",
    title: "Snapmaps Bulk Delivery",
    customer: "Snap",
    category: "Technical Delivery",
    situation:
      "Needed full US imagery footprint offline; first-of-its-kind bulk deal.",
    task: "Scope delivery, estimate scale, handoff cleanly.",
    action:
      "Created coverage assessment, tiling scripts, packaged zipped downloads, aligned contract details.",
    result: "Closed ~$800k deal; customer satisfied with quality + control.",
    metrics: "$800k | full-US delivery",
    tags: ["Bulk Data", "APIs"],
  },
  {
    id: "mach9-usage",
    title: "Usage Visibility for AI Platform",
    customer: "Mach9",
    category: "Solutions",
    situation:
      "Limited insight into AI extraction results, hindering upsells + annotation ops.",
    task: "Improve usage reporting + ROI storytelling.",
    action:
      "Built dashboards for features extracted, QA effort, manual edits, drafting time; aligned data team + annotation ops.",
    result:
      "Enabled ROI conversations, annotation routing, and customer adoption proof.",
    metrics: "Full usage inventory dashboards",
    tags: ["Analytics", "AI Ops"],
  },
];

export const analyticsSnapshot: AnalyticsSnapshot = {
  applied: 24,
  responses: 9,
  interviews: 5,
  offers: 0,
  responseRate: 0.38,
  interviewRate: 0.21,
  followUpsDue: 4,
  timeline: [
    { date: "Oct 15", applied: 2, responses: 0, interviews: 0 },
    { date: "Oct 22", applied: 6, responses: 1, interviews: 0 },
    { date: "Oct 29", applied: 8, responses: 3, interviews: 1 },
    { date: "Nov 5", applied: 4, responses: 2, interviews: 2 },
    { date: "Nov 12", applied: 3, responses: 2, interviews: 1 },
    { date: "Nov 19", applied: 1, responses: 1, interviews: 1 },
  ],
  statusBreakdown: [
    { label: "Applied", value: 12, color: "#60A5FA" },
    { label: "Interviewing", value: 7, color: "#34D399" },
    { label: "Offer", value: 0, color: "#FBBF24" },
    { label: "Rejected", value: 5, color: "#F87171" },
  ],
  pipelineVelocity: [
    { stage: "Application → Response", days: 5 },
    { stage: "Response → Interview", days: 7 },
    { stage: "Interview → Decision", days: 9 },
  ],
};


