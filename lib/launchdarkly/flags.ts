/**
 * LaunchDarkly Feature Flag Keys
 * 
 * This file contains all feature flag keys used throughout the application.
 * Use these constants to avoid typos and ensure consistency.
 * 
 * All flags default to true (ON) - they can be toggled OFF in LaunchDarkly dashboard.
 */

export const FLAG_KEYS = {
  // Page Access Flags (12 flags)
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

  // Dashboard Component Flags (6 flags)
  SHOW_DASHBOARD_HERO: 'show-dashboard-hero',
  SHOW_DASHBOARD_METRICS: 'show-dashboard-metrics',
  SHOW_DASHBOARD_RECENT_JOBS: 'show-dashboard-recent-jobs',
  SHOW_DASHBOARD_UPCOMING_ACTIONS: 'show-dashboard-upcoming-actions',
  SHOW_DASHBOARD_QUICK_LINKS: 'show-dashboard-quick-links',
  SHOW_DASHBOARD_FOLLOW_UPS_ALERT: 'show-dashboard-follow-ups-alert',

  // Feature Toggle Flags (7 flags)
  ENABLE_CSV_IMPORT: 'enable-csv-import',
  ENABLE_TIMELINE_VIEW: 'enable-timeline-view',
  ENABLE_INLINE_EDITING: 'enable-inline-editing',
  ENABLE_EXPORT_FUNCTIONALITY: 'enable-export-functionality',
  ENABLE_ADVANCED_FILTERS: 'enable-advanced-filters',
  ENABLE_BULK_ACTIONS: 'enable-bulk-actions',
  SHOW_PREMIUM_FEATURE_DEMO: 'show-premium-feature-demo',

  // Job Detail Page Flags (4 flags)
  SHOW_JOB_TIMELINE_SECTION: 'show-job-timeline-section',
  SHOW_JOB_PREP_CHECKLIST: 'show-job-prep-checklist',
  SHOW_JOB_STAR_STORIES: 'show-job-star-stories',
  SHOW_JOB_METRICS_CARDS: 'show-job-metrics-cards',

  // Admin & System Flags (2 flags)
  SHOW_ADMIN_PAGE: 'show-admin-page',
  SHOW_ASSIGNMENT_SATISFACTION_PAGE: 'show-assignment-satisfaction-page',
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
  [FLAG_KEYS.SHOW_DASHBOARD_HERO]: {
    name: 'Show Dashboard Hero',
    description: 'Controls visibility of the hero section on the dashboard',
    category: 'Dashboard Components',
    default: true,
  },
  [FLAG_KEYS.SHOW_DASHBOARD_METRICS]: {
    name: 'Show Dashboard Metrics',
    description: 'Controls visibility of the metric cards section on the dashboard',
    category: 'Dashboard Components',
    default: true,
  },
  [FLAG_KEYS.SHOW_DASHBOARD_RECENT_JOBS]: {
    name: 'Show Dashboard Recent Jobs',
    description: 'Controls visibility of the recent applications section on the dashboard',
    category: 'Dashboard Components',
    default: true,
  },
  [FLAG_KEYS.SHOW_DASHBOARD_UPCOMING_ACTIONS]: {
    name: 'Show Dashboard Upcoming Actions',
    description: 'Controls visibility of the upcoming actions section on the dashboard',
    category: 'Dashboard Components',
    default: true,
  },
  [FLAG_KEYS.SHOW_DASHBOARD_QUICK_LINKS]: {
    name: 'Show Dashboard Quick Links',
    description: 'Controls visibility of the quick links section on the dashboard',
    category: 'Dashboard Components',
    default: true,
  },
  [FLAG_KEYS.SHOW_DASHBOARD_FOLLOW_UPS_ALERT]: {
    name: 'Show Dashboard Follow-ups Alert',
    description: 'Controls visibility of the follow-ups due alert on the dashboard',
    category: 'Dashboard Components',
    default: true,
  },
  [FLAG_KEYS.ENABLE_CSV_IMPORT]: {
    name: 'Enable CSV Import',
    description: 'Enables the CSV import functionality for jobs',
    category: 'Feature Toggles',
    default: true,
  },
  [FLAG_KEYS.ENABLE_TIMELINE_VIEW]: {
    name: 'Enable Timeline View',
    description: 'Enables the timeline view option in the jobs table',
    category: 'Feature Toggles',
    default: true,
  },
  [FLAG_KEYS.ENABLE_INLINE_EDITING]: {
    name: 'Enable Inline Editing',
    description: 'Enables inline editing functionality on the job detail page',
    category: 'Feature Toggles',
    default: true,
  },
  [FLAG_KEYS.ENABLE_EXPORT_FUNCTIONALITY]: {
    name: 'Enable Export Functionality',
    description: 'Enables export to CSV/PDF functionality',
    category: 'Feature Toggles',
    default: true,
  },
  [FLAG_KEYS.ENABLE_ADVANCED_FILTERS]: {
    name: 'Enable Advanced Filters',
    description: 'Enables advanced filtering options in the jobs table',
    category: 'Feature Toggles',
    default: true,
  },
  [FLAG_KEYS.ENABLE_BULK_ACTIONS]: {
    name: 'Enable Bulk Actions',
    description: 'Enables bulk job actions functionality',
    category: 'Feature Toggles',
    default: true,
  },
  [FLAG_KEYS.SHOW_PREMIUM_FEATURE_DEMO]: {
    name: 'Show Premium Feature Demo',
    description: 'Demonstrates targeting - shows premium feature section on job tracker landing page. Configure targeting rules in LaunchDarkly dashboard.',
    category: 'Feature Toggles',
    default: false,
  },
  [FLAG_KEYS.SHOW_JOB_TIMELINE_SECTION]: {
    name: 'Show Job Timeline Section',
    description: 'Controls visibility of the timeline section on job detail pages',
    category: 'Job Detail Components',
    default: true,
  },
  [FLAG_KEYS.SHOW_JOB_PREP_CHECKLIST]: {
    name: 'Show Job Prep Checklist',
    description: 'Controls visibility of the prep checklist sidebar on job detail pages',
    category: 'Job Detail Components',
    default: true,
  },
  [FLAG_KEYS.SHOW_JOB_STAR_STORIES]: {
    name: 'Show Job STAR Stories',
    description: 'Controls visibility of the STAR stories panel on job detail pages',
    category: 'Job Detail Components',
    default: true,
  },
  [FLAG_KEYS.SHOW_JOB_METRICS_CARDS]: {
    name: 'Show Job Metrics Cards',
    description: 'Controls visibility of the metric cards at the top of job detail pages',
    category: 'Job Detail Components',
    default: true,
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
} as const;

