# LaunchDarkly Feature Flags Documentation

This document describes all feature flags used in the Job Tracker application. All flags default to `true` (ON) and can be toggled in the LaunchDarkly dashboard.

## Overview

The application uses **30 feature flags** organized into the following categories:

- **Page Access Flags** (12 flags) - Control access to entire pages
- **Dashboard Component Flags** (6 flags) - Control visibility of dashboard sections
- **Feature Toggle Flags** (6 flags) - Enable/disable specific features
- **Job Detail Page Flags** (4 flags) - Control visibility of job detail sections
- **Admin & System Flags** (1 flag) - Control admin access

## Page Access Flags

### `show-dashboard-page`
- **Description**: Controls access to the main dashboard page (`/`)
- **Default**: `true`
- **Category**: Page Access

### `show-jobs-page`
- **Description**: Controls access to the jobs table page (`/jobs`)
- **Default**: `true`
- **Category**: Page Access

### `show-job-detail-page`
- **Description**: Controls access to individual job detail pages (`/jobs/[jobId]`)
- **Default**: `true`
- **Category**: Page Access

### `show-analytics-page`
- **Description**: Controls access to the analytics dashboard (`/analytics`)
- **Default**: `true`
- **Category**: Page Access

### `show-prep-page`
- **Description**: Controls access to the master prep page (`/prep`)
- **Default**: `true`
- **Category**: Page Access

### `show-company-prep-page`
- **Description**: Controls access to the company prep list page (`/prep/companies`)
- **Default**: `true`
- **Category**: Page Access

### `show-company-detail-page`
- **Description**: Controls access to individual company prep pages (`/prep/companies/[companyId]`)
- **Default**: `true`
- **Category**: Page Access

### `show-star-stories-page`
- **Description**: Controls access to the STAR stories page (`/star-stories`)
- **Default**: `true`
- **Category**: Page Access

### `show-landing-page`
- **Description**: Controls access to the main landing page (`/landing`)
- **Default**: `true`
- **Category**: Page Access

### `show-landing-job-tracker`
- **Description**: Controls access to the job tracker marketing page (`/landing/job-tracker`)
- **Default**: `true`
- **Category**: Page Access

### `show-landing-prep-hub`
- **Description**: Controls access to the prep hub marketing page (`/landing/prep-hub`)
- **Default**: `true`
- **Category**: Page Access

### `show-landing-analytics`
- **Description**: Controls access to the analytics marketing page (`/landing/analytics`)
- **Default**: `true`
- **Category**: Page Access

## Dashboard Component Flags

### `show-dashboard-hero`
- **Description**: Controls visibility of the hero section on the dashboard
- **Default**: `true`
- **Category**: Dashboard Components

### `show-dashboard-metrics`
- **Description**: Controls visibility of the metric cards section on the dashboard
- **Default**: `true`
- **Category**: Dashboard Components

### `show-dashboard-recent-jobs`
- **Description**: Controls visibility of the recent applications section on the dashboard
- **Default**: `true`
- **Category**: Dashboard Components

### `show-dashboard-upcoming-actions`
- **Description**: Controls visibility of the upcoming actions section on the dashboard
- **Default**: `true`
- **Category**: Dashboard Components

### `show-dashboard-quick-links`
- **Description**: Controls visibility of the quick links section on the dashboard
- **Default**: `true`
- **Category**: Dashboard Components

### `show-dashboard-follow-ups-alert`
- **Description**: Controls visibility of the follow-ups due alert on the dashboard
- **Default**: `true`
- **Category**: Dashboard Components

## Feature Toggle Flags

### `enable-csv-import`
- **Description**: Enables the CSV import functionality for jobs
- **Default**: `true`
- **Category**: Feature Toggles

### `enable-timeline-view`
- **Description**: Enables the timeline view option in the jobs table
- **Default**: `true`
- **Category**: Feature Toggles

### `enable-inline-editing`
- **Description**: Enables inline editing functionality on the job detail page
- **Default**: `true`
- **Category**: Feature Toggles

### `enable-export-functionality`
- **Description**: Enables export to CSV/PDF functionality
- **Default**: `true`
- **Category**: Feature Toggles

### `enable-advanced-filters`
- **Description**: Enables advanced filtering options in the jobs table
- **Default**: `true`
- **Category**: Feature Toggles

### `enable-bulk-actions`
- **Description**: Enables bulk job actions functionality
- **Default**: `true`
- **Category**: Feature Toggles

## Job Detail Page Flags

### `show-job-timeline-section`
- **Description**: Controls visibility of the timeline section on job detail pages
- **Default**: `true`
- **Category**: Job Detail Components

### `show-job-prep-checklist`
- **Description**: Controls visibility of the prep checklist sidebar on job detail pages
- **Default**: `true`
- **Category**: Job Detail Components

### `show-job-star-stories`
- **Description**: Controls visibility of the STAR stories panel on job detail pages
- **Default**: `true`
- **Category**: Job Detail Components

### `show-job-metrics-cards`
- **Description**: Controls visibility of the metric cards at the top of job detail pages
- **Default**: `true`
- **Category**: Job Detail Components

## Admin & System Flags

### `show-admin-page`
- **Description**: Controls access to the admin/feature flag dashboard. When enabled, shows a red admin button in the sidebar.
- **Default**: `true`
- **Category**: Admin & System

## Usage

### In Components

```typescript
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";

function MyComponent() {
  const showAnalytics = useFeatureFlag(FLAG_KEYS.SHOW_ANALYTICS_PAGE, true);
  
  if (!showAnalytics) {
    return null;
  }
  
  return <AnalyticsPanel />;
}
```

### In Pages

```typescript
"use client";

import { notFound } from "next/navigation";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";

export default function AnalyticsPage() {
  const canAccess = useFeatureFlag(FLAG_KEYS.SHOW_ANALYTICS_PAGE, true);
  if (!canAccess) {
    return notFound();
  }
  
  return <div>Analytics Content</div>;
}
```

## Configuration

All flags are configured in LaunchDarkly and can be toggled per environment, user, or custom targeting rules. The application uses the LaunchDarkly React Client SDK to fetch flag values in real-time.

## Admin Dashboard

Access the admin dashboard at `/admin` (if `show-admin-page` is enabled) to view all flags, their current status, and metadata in real-time.

