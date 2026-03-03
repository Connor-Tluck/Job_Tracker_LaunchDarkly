/**
 * LaunchDarkly Feature Flag Keys
 * 
 * This file contains all feature flag keys used throughout the application.
 * Use these constants to avoid typos and ensure consistency.
 * 
 * All flags default to true (ON) - they can be toggled OFF in LaunchDarkly dashboard.
 */

export const FLAG_KEYS = {
  // Page Access Flags
  SHOW_DASHBOARD_PAGE: 'show-dashboard-page',
  SHOW_JOBS_PAGE: 'show-jobs-page',
  SHOW_JOB_DETAIL_PAGE: 'show-job-detail-page',
  SHOW_ANALYTICS_PAGE: 'show-analytics-page',
  SHOW_PREP_PAGE: 'show-prep-page',
  SHOW_COMPANY_PREP_PAGE: 'show-company-prep-page',
  SHOW_COMPANY_DETAIL_PAGE: 'show-company-detail-page',
  SHOW_STAR_STORIES_PAGE: 'show-star-stories-page',
  SHOW_LANDING_PAGE: 'show-landing-page',
  SHOW_LANDING_JOB_TRACKER: 'show-landing-job-tracker',
  SHOW_LANDING_PREP_HUB: 'show-landing-prep-hub',
  SHOW_LANDING_ANALYTICS: 'show-landing-analytics',
  SHOW_CHATBOT: 'show-chatbot',

  // Admin & System Flags
  SHOW_ADMIN_PAGE: 'show-admin-page',
  SHOW_ASSIGNMENT_SATISFACTION_PAGE: 'show-assignment-satisfaction-page',
  SHOW_ADMIN_QUICK_REFERENCE_PAGE: 'show-admin-quick-reference-page',
  SHOW_ADMIN_EXAMPLES_PAGE: 'show-admin-examples-page',

  // Business User Flags
  SHOW_BUSINESS_USER_MODE: 'show-business-user-mode',
  SHOW_CANDIDATES_PAGE: 'show-candidates-page',
  SHOW_APPLICANT_TRACKER_PAGE: 'show-applicant-tracker-page',
} as const;

export type FlagKey = typeof FLAG_KEYS[keyof typeof FLAG_KEYS];

/**
 * Flag metadata for documentation and admin page
 */
export const FLAG_METADATA = {
  [FLAG_KEYS.SHOW_DASHBOARD_PAGE]: {
    name: 'Show Dashboard Page',
    description: 'Controls access to the main dashboard page (/)',
    category: 'Page Access',
    default: true,
  },
  [FLAG_KEYS.SHOW_JOBS_PAGE]: {
    name: 'Show Jobs Page',
    description: 'Controls access to the jobs table page (/jobs)',
    category: 'Page Access',
    default: true,
  },
  [FLAG_KEYS.SHOW_JOB_DETAIL_PAGE]: {
    name: 'Show Job Detail Page',
    description: 'Controls access to individual job detail pages (/jobs/[jobId])',
    category: 'Page Access',
    default: true,
  },
  [FLAG_KEYS.SHOW_ANALYTICS_PAGE]: {
    name: 'Show Analytics Page',
    description: 'Controls access to the analytics dashboard (/analytics)',
    category: 'Page Access',
    default: true,
  },
  [FLAG_KEYS.SHOW_PREP_PAGE]: {
    name: 'Show Prep Page',
    description: 'Controls access to the master prep page (/prep)',
    category: 'Page Access',
    default: true,
  },
  [FLAG_KEYS.SHOW_COMPANY_PREP_PAGE]: {
    name: 'Show Company Prep Page',
    description: 'Controls access to the company prep list page (/prep/companies)',
    category: 'Page Access',
    default: true,
  },
  [FLAG_KEYS.SHOW_COMPANY_DETAIL_PAGE]: {
    name: 'Show Company Detail Page',
    description: 'Controls access to individual company prep pages (/prep/companies/[companyId])',
    category: 'Page Access',
    default: true,
  },
  [FLAG_KEYS.SHOW_STAR_STORIES_PAGE]: {
    name: 'Show STAR Stories Page',
    description: 'Controls access to the STAR stories page (/star-stories)',
    category: 'Page Access',
    default: true,
  },
  [FLAG_KEYS.SHOW_LANDING_PAGE]: {
    name: 'Show Landing Page',
    description: 'Controls access to the main landing page (/landing)',
    category: 'Page Access',
    default: true,
  },
  [FLAG_KEYS.SHOW_LANDING_JOB_TRACKER]: {
    name: 'Show Landing Job Tracker',
    description: 'Controls access to the job tracker marketing page (/landing/job-tracker)',
    category: 'Page Access',
    default: true,
  },
  [FLAG_KEYS.SHOW_LANDING_PREP_HUB]: {
    name: 'Show Landing Prep Hub',
    description: 'Controls access to the prep hub marketing page (/landing/prep-hub)',
    category: 'Page Access',
    default: true,
  },
  [FLAG_KEYS.SHOW_LANDING_ANALYTICS]: {
    name: 'Show Landing Analytics',
    description: 'Controls access to the analytics marketing page (/landing/analytics)',
    category: 'Page Access',
    default: true,
  },
  [FLAG_KEYS.SHOW_CHATBOT]: {
    name: 'Show Chatbot',
    description: 'Controls access to the Support Bot page (/landing/support-bot) and its navigation link',
    category: 'Page Access',
    default: false,
  },
  [FLAG_KEYS.SHOW_ADMIN_PAGE]: {
    name: 'Show Admin Page',
    description: 'Controls access to the admin/feature flag dashboard. When enabled, shows a red admin button in the sidebar.',
    category: 'Admin & System',
    default: true,
  },
  [FLAG_KEYS.SHOW_ASSIGNMENT_SATISFACTION_PAGE]: {
    name: 'Show Assignment Satisfaction Page',
    description: 'Controls access to the assignment satisfaction documentation page (/admin/assignment-satisfaction)',
    category: 'Admin & System',
    default: true,
  },
  [FLAG_KEYS.SHOW_ADMIN_QUICK_REFERENCE_PAGE]: {
    name: 'Show Admin Quick Reference Page',
    description: 'Controls access to the admin quick reference page (/admin/quick-reference) for interview prep and codebase pointers.',
    category: 'Admin & System',
    default: true,
  },
  [FLAG_KEYS.SHOW_ADMIN_EXAMPLES_PAGE]: {
    name: 'Show Admin Examples Page',
    description: 'Controls access to the admin examples page (/admin/examples) with visual walkthroughs.',
    category: 'Admin & System',
    default: true,
  },
  [FLAG_KEYS.SHOW_BUSINESS_USER_MODE]: {
    name: 'Show Business User Mode',
    description: 'Enables Business/Recruiter mode for candidate sourcing and applicant tracking. When enabled, users see a recruiting-focused interface instead of job seeker interface.',
    category: 'Business User',
    default: false,
  },
  [FLAG_KEYS.SHOW_CANDIDATES_PAGE]: {
    name: 'Show Candidates Page',
    description: 'Controls access to the candidate search and sourcing page (/business/candidates). Only visible to Business tier users.',
    category: 'Business User',
    default: true,
  },
  [FLAG_KEYS.SHOW_APPLICANT_TRACKER_PAGE]: {
    name: 'Show Applicant Tracker Page',
    description: 'Controls access to the applicant tracking pipeline page (/business/applicants). Only visible to Business tier users.',
    category: 'Business User',
    default: true,
  },
} as const;

