# Job Tracker - Job Search Management System

A comprehensive web application for managing your job search pipeline, interview preparation, and application tracking. Built with Next.js, TypeScript, and Tailwind CSS.

## Overview

Job Tracker helps you stay organized throughout your job search by providing:
- **Application Tracking** - Google Sheets-style table to track all your job applications
- **Company Prep Documents** - Create and manage company-specific interview preparation materials
- **STAR Stories Library** - Build and organize your behavioral interview stories
- **Analytics Dashboard** - Track your application pipeline, response rates, and interview progress
- **Master Prep Hub** - Centralized location for general interview preparation materials

## Features

### 📊 Job Tracker
- **Sheets-style table** with filters, search, and status tracking
- **CSV import** - Import jobs from Google Sheets or CSV files
- **Inline editing** - Edit job information directly in the table
- **Timeline view** - See all application activity in chronological order
- **Quick prep links** - Jump directly to company-specific prep documents

### 📝 Company Prep Documents
- **Sidebar navigation** - Quick access to all sections during interviews
- **Inline editing** - Edit any section directly on the page
- **Structured sections**:
  - Company Summary
  - Why This Company
  - Product Pillars
  - Customer Profiles
  - Interview Questions
  - Tailored STAR Stories
  - Questions For Them
  - Prep Checklist

### ⭐ STAR Stories Builder
- **Create and edit** STAR stories with full Situation-Task-Action-Result format
- **Tagging system** - Organize stories by industry, category, and theme
- **Grid and list views** - Toggle between viewing modes
- **Quick copy** - Copy story summaries for easy pasting into prep docs
- **Attach to jobs** - Link relevant stories to specific company prep documents

### 📈 Analytics Dashboard
- **Pipeline metrics** - Track applications, responses, interviews, and offers
- **Visual charts** - Weekly pipeline trends, status breakdown, and conversion rates
- **Timeline velocity** - See how long each stage takes
- **Upcoming actions** - Never miss a follow-up

### 🎯 Master Prep Library
- **Personal narrative** - Your elevator pitch and background
- **Question banks** - Common interview questions and your prepared answers
- **STAR story shelf** - Quick access to all your stories
- **Reusable content** - Pull content into company-specific prep docs

### 🏠 Home Dashboard
- **Quick metrics** - Applications, response rate, active interviews, follow-ups due
- **Recent applications** - See your latest job applications at a glance
- **Upcoming actions** - Timeline of tasks and follow-ups
- **Quick links** - Fast access to all major sections

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **Chart.js** - Data visualization
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Connor-Tluck/Job_Tracker.git
cd Job_Tracker
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── page.tsx              # Home dashboard
│   ├── jobs/                  # Job tracker pages
│   │   ├── page.tsx          # Jobs table view
│   │   └── [jobId]/          # Individual job detail
│   ├── prep/                  # Prep document pages
│   │   ├── page.tsx          # Master prep library
│   │   └── companies/        # Company prep docs
│   ├── star-stories/          # STAR stories builder
│   └── analytics/             # Analytics dashboard
├── components/
│   ├── jobs/                  # Job-related components
│   │   ├── CSVImportModal.tsx
│   │   ├── EditableJobRow.tsx
│   │   └── JobStatusBadge.tsx
│   ├── prep/                  # Prep document components
│   │   └── PrepDocModal.tsx
│   ├── star-stories/          # STAR story components
│   │   └── StarStoryModal.tsx
│   ├── analytics/             # Analytics components
│   │   └── AnalyticsPanel.tsx
│   └── layout/                # Layout components
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       └── MainLayout.tsx
├── lib/
│   └── mock-data.ts          # Data models and mock data
└── components/ui/            # Reusable UI components
```

## Usage

### Adding Jobs

1. **Manual Entry**: Click "Import CSV" to upload a CSV file with your job applications
2. **CSV Format**: Include columns like Company, Job Title, Application Date, Contact Name, etc.
3. **Inline Editing**: Click the edit icon on any cell to modify job information

### Creating Company Prep Docs

1. Navigate to "Company Prep" in the sidebar
2. Click "New Prep Doc"
3. Fill in company information, product pillars, interview questions, etc.
4. Use the sidebar navigation to quickly jump between sections during interviews

### Building STAR Stories

1. Go to "STAR Stories" in the sidebar
2. Click "New Story"
3. Fill in Situation, Task, Action, and Result
4. Add tags and industries for easy filtering
5. Attach stories to specific company prep docs

### Tracking Analytics

- View your pipeline metrics on the Analytics page
- See weekly trends and conversion rates
- Track upcoming actions and follow-ups

## Features in Detail

### CSV Import
- Flexible column mapping (automatically detects common column names)
- Preview before importing
- Supports multiple job entries at once

### Inline Editing
- Hover over any cell to see the edit icon
- Click to edit directly in place
- Press Enter to save, Escape to cancel
- Dropdown menus for status and response fields

### Company Prep Documents
- Clean, document-style layout optimized for quick reference
- Sidebar navigation for fast section jumping
- Inline editing for each section
- Numbered lists for easy scanning during interviews

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Future Enhancements

- Google Sheets integration for automatic syncing
- Google Drive integration for document linking
- Database persistence (currently uses local state)
- Export prep documents to PDF
- Email reminders for follow-ups
- Mobile app version

## License

This project is free to use for personal and commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built to help you stay organized and prepared throughout your job search journey.
