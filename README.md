# CRM - AI-Powered Product Management Platform

A modern, responsive frontend for an AI-powered product management workspace built with Next.js, React, TypeScript, and Tailwind CSS.

## Project Overview

This is a comprehensive SaaS product management platform featuring:

- **Dashboard**: Overview with KPI cards, activity feed, charts, and deadlines
- **Backlog Management**: Feature list with multiple views (List, Grid, Kanban)
- **Sprint Management**: Sprint planning, board, and analytics
- **Goals & OKRs**: Goal tracking with key results and progress indicators
- **Release Management**: Release planning and health tracking
- **Documents**: Collaborative document library with templates
- **Stakeholder Management**: Stakeholder tracking with interest/influence matrix
- **Requirements Management**: Requirement tracking with traceability
- **Reports**: Comprehensive analytics and reporting
- **Settings**: User, workspace, and team management

## Tech Stack

- **Frontend Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **Charts**: Recharts
- **UI Components**: Custom built with Tailwind CSS
- **State Management**: React Hooks + Local State
- **Mock Data**: In-memory mock data (no backend required)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── login/page.tsx           # Login page
│   ├── dashboard/page.tsx       # Main dashboard
│   ├── backlog/page.tsx         # Feature backlog
│   ├── sprints/page.tsx         # Sprint management
│   ├── goals/page.tsx           # Goals & OKRs
│   ├── releases/page.tsx        # Release management
│   ├── documents/page.tsx       # Document library
│   ├── stakeholders/page.tsx    # Stakeholder management
│   ├── requirements/page.tsx    # Requirements tracking
│   ├── reports/page.tsx         # Analytics & Reports
│   └── settings/page.tsx        # Settings
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx           # Top navigation
│   │   ├── Sidebar.tsx          # Side navigation
│   │   └── AppLayout.tsx        # Main app wrapper
│   └── ui/
│       ├── Button.tsx           # Button component
│       ├── Input.tsx            # Input component
│       ├── Card.tsx             # Card component
│       ├── Badge.tsx            # Badge component
│       └── Modal.tsx            # Modal component
├── lib/
│   └── mockData.ts              # Mock data for development
├── types/
│   └── index.ts                 # TypeScript type definitions
└── globals.css                  # Global styles

```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd crm-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm run start
```

## Features

### 1. Dashboard
- Summary cards with KPIs
- Recent activity feed
- Velocity trend charts
- Upcoming deadlines table
- Team capacity metrics

### 2. Backlog
- Multi-view support (List, Grid, Kanban)
- Advanced filtering (Status, Priority, Owner, Tags)
- Grouping and sorting options
- Feature cards with full details
- Create new features

### 3. Sprints
- Sprint list with progress indicators
- Sprint planning tools
- Sprint board with drag-and-drop
- Sprint analytics and metrics
- Velocity tracking

### 4. Goals & OKRs
- OKR and KPI management
- Progress tracking with circular gauges
- Key results with individual progress
- Status indicators (on-track, at-risk, off-track)
- Timeline visualization

### 5. Releases
- Release cards with health indicators
- Release timeline view
- Feature mapping to releases
- Release readiness checklist
- Deployment planning

### 6. Documents
- Document library with folder navigation
- Multiple document types (PRD, Retro, Meeting Notes, etc.)
- Collaborative features
- Version history
- Full-text search

### 7. Stakeholders
- Stakeholder directory
- Interest/Influence matrix visualization
- Communication tracking
- Sentiment analysis
- Engagement metrics

### 8. Requirements
- Requirement tracking with full lifecycle
- Traceability matrix
- Acceptance criteria management
- Test case integration
- Status workflows

## Styling Architecture

The application follows a comprehensive design system with:

### Color Palette
- **Primary**: Blue (#0ea5e9, #0369a1)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)
- **Info**: Cyan (#3b82f6)

### Typography
- **Font Family**: Inter (sans-serif), JetBrains Mono (monospace)
- **Font Sizes**: xs (12px) to 3xl (30px)
- **Font Weights**: 400, 500, 600, 700

### Components

#### Button
- Variants: primary, secondary, ghost, danger, success
- Sizes: sm, md, lg
- States: default, hover, active, disabled, loading

#### Input
- Text inputs with validation
- Error and helper text support
- Full width support
- Label associations

#### Card
- Variants: default, outlined, elevated
- Padding options: sm, md, lg
- Shadow effects

#### Badge
- Status indicators
- Variants for all statuses
- Multiple sizes

#### Modal
- Full-featured modal dialogs
- Backdrop click handling
- Size options
- Header and footer support

## Mock Data

The application uses mock data throughout for demonstration. Mock data is organized by entity type:

- Users (4 mock users)
- Features (5 mock features)
- Sprints (2 mock sprints)
- Goals (2 mock OKRs)
- Releases (2 mock releases)
- Documents (2 mock documents)
- Stakeholders (3 mock stakeholders)
- Requirements (2 mock requirements)
- Activities (4 mock activities)

All mock data is stored in `src/lib/mockData.ts` and can be easily replaced with API calls.

## Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1023px
- **Desktop**: 1024px - 1279px
- **Large Desktop**: 1280px+

## Performance Optimizations

- CSS-in-JS with Tailwind (minimal runtime)
- Image optimization with Next.js Image component
- Code splitting per route
- Efficient component rendering with React
- Debounced search and filters

## Accessibility

- WCAG 2.1 AA compliance target
- Keyboard navigation support
- Focus visible indicators
- Semantic HTML
- ARIA labels where appropriate
- Color contrast ratios > 4.5:1

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Development Guidelines

### Code Style
- TypeScript strict mode
- ESLint configuration (Next.js)
- Tailwind CSS for styling
- Component-based architecture

### File Naming
- Components: PascalCase (e.g., `UserCard.tsx`)
- Pages: kebab-case (e.g., `dashboard/page.tsx`)
- Types: kebab-case (e.g., `user-types.ts`)

### Component Patterns
- Functional components with hooks
- Props interfaces for type safety
- Compound components for complex UI
- Custom hooks for reusable logic

## Customization

### Adding New Pages
1. Create a new folder in `src/app/`
2. Add `page.tsx` file
3. Import `AppLayout` for consistent navigation
4. Use existing components and styling

### Extending Components
- Modify component variants in `src/components/ui/`
- Update Tailwind config in `tailwind.config.ts`
- Add new color schemes or spacing values

### Updating Mock Data
- Edit `src/lib/mockData.ts`
- Import data in pages using `getMock*` functions
- Replace with API calls when backend is ready

## Future Enhancements

- Integration with backend API
- Real-time collaboration with WebSockets
- Advanced analytics and reporting
- AI-powered insights and recommendations
- Mobile app development
- Custom workflow automation
- Advanced permission management
- Data export functionality

## License

MIT

## Support

For documentation, refer to the requirements.md file in the Documents/crm directory.
