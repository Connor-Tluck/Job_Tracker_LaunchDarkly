# Front End Template

A modern, modular UI/UX template built with Next.js, TypeScript, Tailwind CSS, and Supabase. This template is designed to be a starting point for building dashboards, task tracking apps, mapping applications, user management systems, and more.

## Features

- 🎨 **Modern Dark Theme UI** - Clean, professional dark theme design
- 🧩 **Modular Components** - Reusable, well-organized component library
- 📱 **Responsive Layout** - Works seamlessly on all device sizes
- 🔐 **Optional Authentication** - Google OAuth integration (can be disabled)
- 🗄️ **Supabase Integration** - Ready-to-use database setup with SQL schema
- 🚀 **Frontend-Only Mode** - Run without database access for frontend development
- 📄 **Example Pages** - Multiple layout patterns and use cases
- 🎯 **TypeScript** - Full type safety throughout
- ⚡ **Next.js 14** - Latest App Router with server components

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the environment template file:

```bash
cp env.template .env.local
```

Edit `.env.local` and configure:

- **For frontend-only mode**: Leave `NEXT_PUBLIC_ENABLE_AUTH=false` (or don't set Supabase variables)
- **For full functionality**: Add your Supabase credentials

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── examples/           # Example pages showing different layouts
│   ├── components/         # Component library showcase
│   └── auth/              # Authentication routes
├── components/            # Reusable UI components
│   ├── layout/            # Layout components (Sidebar, Header, etc.)
│   ├── ui/                # UI primitives (Button, Card, Table, etc.)
│   └── auth/              # Authentication components
├── lib/                   # Utility functions and configurations
│   ├── supabase/          # Supabase client setup
│   └── utils.ts           # Helper functions
├── supabase/              # Database schema
│   └── schema.sql         # SQL schema for Supabase
└── public/                # Static assets
```

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key from Settings > API

### 2. Run the SQL Schema

1. In your Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `supabase/schema.sql`
3. Run the SQL to create tables and policies

### 3. Configure Authentication (Optional)

If you want to enable Google OAuth:

1. In Supabase dashboard, go to Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials
4. Set `NEXT_PUBLIC_ENABLE_AUTH=true` in your `.env.local`

## Component Library

Visit `/components` to see all available UI components:

- **Buttons** - Multiple variants and sizes
- **Dropdowns** - Context menus with icons
- **Cards** - Container components with hover effects
- **Tables** - Data tables with sorting and actions
- **Pagination** - Page navigation component

## Example Pages

Browse different layout patterns at `/examples`:

- **Dashboard** - Metrics and overview cards
- **Chat Interface** - Real-time messaging UI
- **User Management** - CRUD operations with tables
- **Task Tracking** - Kanban-style task management
- **Mapping App** - Geographic interface layout
- **Media Gallery** - Grid-based media browser
- **Analytics** - Data visualization layouts
- **Documents** - File management interface
- **Storage** - File storage with details panel
- **Settings** - Configuration forms
- **Performance** - Monitoring dashboards
- **Evaluation** - Testing interfaces
- **Configuration** - System config management

## Customization

### Styling

The theme is configured in `tailwind.config.ts`. Key color variables:

- `background` - Main background colors
- `foreground` - Text colors
- `primary` - Primary brand color
- `accent` - Accent color
- `border` - Border colors

### Adding New Pages

1. Create a new file in `app/your-page/page.tsx`
2. Add a navigation item in `components/layout/Sidebar.tsx`
3. Use the existing components from `components/ui/`

### Adding New Components

1. Create component in `components/ui/YourComponent.tsx`
2. Export from the component file
3. Add examples to `app/components/page.tsx` for testing

## Database Schema

The template includes example tables:

- **profiles** - User profile information
- **tasks** - Task management with priorities
- **documents** - File metadata storage

All tables include:
- Row Level Security (RLS) policies
- Automatic `created_at` and `updated_at` timestamps
- User-scoped data access

## Authentication

Authentication is **optional** and can be enabled/disabled via environment variables:

- Set `NEXT_PUBLIC_ENABLE_AUTH=true` to enable
- Set `NEXT_PUBLIC_ENABLE_AUTH=false` or leave unset to disable

When disabled, the app runs in frontend-only mode, perfect for UI development.

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

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Supabase** - Backend as a service
- **Lucide React** - Icon library

## License

This template is free to use for personal and commercial projects.

## Support

For issues, questions, or contributions, please open an issue on the repository.

---

Built with ❤️ for rapid application development

