# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The W.O.L.F. Den is an elite sales enablement tool for Campbell & Co. Group Benefits, designed to transform cold call preparation from anxiety into strategic confidence-building. It's a React-based web application that provides persona-driven intelligence, battle card generation, and post-call analysis.

## Development Commands

### Essential Commands
- `npm install` - Install dependencies
- `npm run dev` - Start development server (runs on http://localhost:5173)
- `npm run build` - Build for production (TypeScript compile + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint with TypeScript support
- `npm run typecheck` - Run TypeScript type checking without emitting files

### Code Quality
Always run both `npm run lint` and `npm run typecheck` before committing changes. The project uses ESLint with TypeScript and React hooks rules.

## Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **State Management**: Zustand with localStorage persistence
- **Styling**: Tailwind CSS with Campbell & Co. brand colors (#a5cf4c primary)
- **Build Tool**: Vite with path aliases (`@/` maps to `src/`)
- **PDF Generation**: jsPDF for battle card exports
- **Icons**: Lucide React

### Application Structure

The app is a single-page application with three main modules:
1. **Hunt Planner** (`hunt-planner`) - Prospect input and intelligence gathering
2. **Battle Card** (`battle-card`) - Printable reference card generation (now called CallCard)
3. **Post Game** (`post-game`) - Call logging and analysis

### State Management

Uses Zustand store (`src/store/index.ts`) with localStorage persistence for:
- Current prospect data
- Selected content for battle cards
- Dynamic intelligence from web search
- Call logs and battle card history
- UI state (current module, loading states)

**Important**: The following data is persisted to localStorage with validation and retention policies:
- `callLogs` - Call history (max 1000 items)
- `callCards` (formerly `battleCards`) - Generated reference cards (max 1000 items)
- `callSequences` - Call planning sequences
- `activeSequenceId` - Current active sequence
- `advancedMode` - UI preference
- `salesWizardMode` - UI preference
- `profile` - User profile data
- `competitiveEncounters` - Competitive intelligence (90-day retention)

### Key Data Models

- **Prospect**: Company, contact, industry, and persona
- **PersonaType**: 7 types - `cost-conscious-employer`, `benefits-optimizer`, `roi-focused-executive`, `gatekeeper`, `strategic-ceo`, `operations-leader`, `culture-champion`
- **ContentItem**: Persona-specific openers, thought leadership, and objection handlers
  - Now includes optional `source` and `dataPoints` fields for attribution
- **BattleCard/CallCard**: Generated reference cards with prospect data and selected content

### Component Architecture

```
src/components/
├── common/          # Reusable UI components (Button, Card, Input, Select, etc.)
├── gamification/    # CallTimer, CelebrationSystem, SuccessButton
├── intelligence/    # LiveIndustryIntelligence
└── modules/         # Feature components (HuntPlanner, CallCard, PostGame)
```

### Data Layer

Static data in `src/data/`:
- `personas.ts` - 7 detailed persona profiles with pressures, language, and red flags
  - Now includes source citations in keyPressures
- `industries.ts` - Industry-specific emerging risks and benefits connections
  - Expanded to 11 industries with 2025 data
- `content.ts` - Persona-matched content (openers, thought leadership, objection handlers)
- `industryIntelligence2025.ts` - Industry-specific intelligence and talking points
  - Added 5 new industries with comprehensive data
- `expandedContent.ts` - Extended content library with 200+ items
  - Includes source attribution for key statistics
- `digitalEngagementTemplates.ts` - Multi-channel outreach templates (NEW)
- `sourceReferences.ts` - Validated sources for all statistics (NEW)

### Web Search Service

Mock service in `src/services/webSearch.ts` simulates real-time industry intelligence. In production, this would integrate with actual search APIs.

## Brand Guidelines

- Primary color: `#a5cf4c` (Campbell & Co. green)
- Typography: Lato font family
- Professional, trustworthy aesthetic
- Campbell & Co. branding integration throughout

## Development Notes

- Uses absolute imports with `@/` alias
- All components are TypeScript with proper typing
- State updates are immutable via Zustand
- LocalStorage persistence only for call logs and battle cards
- PDF generation uses jsPDF for printable battle cards
- Responsive design with Tailwind CSS

## File Structure Patterns

- Components use PascalCase naming
- Data files use camelCase naming
- Type definitions centralized in `src/types/index.ts`
- Services isolated in `src/services/`
- Store is singleton pattern with Zustand

## Current Development Stage (2025-07-11)

### Recent Post-Game Analytics & Map Enhancements

Completed comprehensive updates to call logging and map visualization:

1. **Call History Improvements**
   - Call logs now display most recent calls first (sorted by createdAt descending)
   - Added timestamp display showing call start time in format "MMM d, yyyy h:mm a"
   - Enhanced call log visibility with better time tracking

2. **Canadian Map Integration**
   - Updated map view to center on Canada (coordinates: 56.1304, -106.3468)
   - Replaced US regions with Canadian regions: Western Canada, Central Canada, Atlantic Canada, Northern Canada
   - Updated geocoding to use Canadian cities (Toronto, Montreal, Vancouver, Calgary, Ottawa, Edmonton, Winnipeg, Halifax)
   - Added proper Canadian address support in CallLog type (additionalInfo.address field)

3. **Mock Data Enhancement**
   - Added 4 Canadian company call logs with proper addresses:
     - MapleTech Solutions (123 King Street West, Toronto, ON)
     - Vancouver Dynamics Inc. (456 Granville Street, Vancouver, BC)
     - Montreal Innovations Ltd. (789 Rue Saint-Jacques, Montreal, QC)
     - Calgary Energy Systems (321 7th Avenue SW, Calgary, AB)
   - Each includes realistic call data, timestamps, and Canadian addresses

### Recent Major Code Cleanup & Testing

Completed comprehensive error fixing and code cleanup with:

1. **Critical Fixes Completed** - All high-priority issues resolved
   - Fixed 6 React Hook dependency warnings
   - Replaced all hard-coded user IDs with proper authentication context
   - Fixed memory leak potential in CelebrationSystem.tsx
   - Resolved TypeScript compilation errors

2. **Component Refactoring** - Improved architecture
   - Replaced legacy LiveCallAssistance.tsx with refactored version (50% smaller codebase)
   - Extracted hooks from components to fix Fast Refresh warnings
   - Created proper hook structure in src/hooks/

3. **Authentication Integration** - Proper user context throughout
   - Store/index.ts now accepts optional userId parameter
   - All components using authentication properly (IntegratedCallPlanner, ContactImporter, CallCard)
   - No more hard-coded 'current-user' strings in critical paths

4. **Code Quality Improvements**
   - TypeScript compilation: Zero errors
   - ESLint: Reduced from 134 to 121 warnings (critical errors fixed)
   - Production build: Successful with optimized bundles
   - Fast Refresh warnings: Fixed by extracting non-component exports

### Technical Status
- **Build Health**: Production-ready (5-6s build time)
- **Type Safety**: Full TypeScript compliance with Zod schema validation
- **Performance**: Optimized bundles, proper code splitting
- **Memory Management**: Fixed CallTimer memory leak, proper cleanup in all effects
- **Authentication**: Properly integrated across all components
- **Localization**: Canadian-focused with proper regional support
- **Data Persistence**: Validated localStorage with retention policies and migration support

### Previous Milestones
- 2025-07-10: Major content overhaul with source attribution system
- Code progress compacted and current state saved as of 2024-02-07

## Progress Checkpoints

- Code progress compacted and current state saved as of 2024-02-07
- Major content overhaul completed with source attribution as of 2025-07-10
- Comprehensive code cleanup and testing completed as of 2025-07-11
- Post-Game analytics and Canadian map integration completed as of 2025-07-11

### Progress Tracking
- Memorizing project progress on 2025-07-11

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.