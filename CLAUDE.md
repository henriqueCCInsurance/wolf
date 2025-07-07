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
2. **Battle Card** (`battle-card`) - Printable reference card generation
3. **Post Game** (`post-game`) - Call logging and analysis

### State Management

Uses Zustand store (`src/store/index.ts`) with localStorage persistence for:
- Current prospect data
- Selected content for battle cards
- Dynamic intelligence from web search
- Call logs and battle card history
- UI state (current module, loading states)

**Important**: Only `callLogs` and `battleCards` are persisted to localStorage. Other state is session-only.

### Key Data Models

- **Prospect**: Company, contact, industry, and persona
- **PersonaType**: 4 types - `cost-conscious-employer`, `benefits-optimizer`, `roi-focused-executive`, `gatekeeper`
- **ContentItem**: Persona-specific openers, thought leadership, and objection handlers
- **BattleCard**: Generated reference cards with prospect data and selected content

### Component Architecture

```
src/components/
├── common/          # Reusable UI components (Button, Card, Input, Select, etc.)
├── gamification/    # CallTimer, CelebrationSystem, SuccessButton
├── intelligence/    # LiveIndustryIntelligence
└── modules/         # Feature components (HuntPlanner, BattleCard, PostGame)
```

### Data Layer

Static data in `src/data/`:
- `personas.ts` - 4 detailed persona profiles with pressures, language, and red flags
- `industries.ts` - Industry-specific emerging risks and benefits connections
- `content.ts` - Persona-matched content (openers, thought leadership, objection handlers)
- `industryIntelligence2025.ts` - Industry-specific intelligence and talking points

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

## Current Development Stage (2025-07-10)

Currently in a comprehensive scaling phase with multiple strategic enhancements:

- Transitioning from single-user prototype to multi-user enterprise platform
- Implementing role-based authentication system
- Expanding feature set with advanced call planning and analytics modules
- Focusing on scalability, performance optimization, and professional UX
- Preparing for potential pilot deployment with Campbell & Co. sales team
- Technical infrastructure being refined to support increased complexity
- Continuous integration of user feedback and iterative improvements

Key focus areas:
1. Authentication & user management
2. Advanced call sequence planning
3. Enhanced content library
4. Live call assistance interface
5. Comprehensive post-call analytics

Development momentum is strong, with significant progress towards a robust, production-ready sales enablement tool.

## Progress Checkpoints

- Code progress compacted and current state saved as of 2024-02-07