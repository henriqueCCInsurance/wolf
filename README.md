# The W.O.L.F. Den - Sales Enablement Tool

**Wisdom • Opportunity • Leadership • Focus**

An elite, web-based sales enablement tool for the Campbell & Co. Group Benefits sales team, transforming cold call preparation from anxiety into strategic confidence-building.

## Features

### 🎯 The Hunt Planner
- **Target Acquisition**: Input prospect company, contact, industry, and persona
- **Persona Intelligence**: Deep insights into stakeholder pressures and communication preferences
- **Industry Analysis**: Emerging risks and connections to benefits solutions
- **Dynamic Intelligence**: Real-time industry news and talking points
- **Strategic Content**: Curated openers, thought leadership, and objection handlers

### 📋 The Battle Card Generator
- **Printable Reference**: One-page battle card for call preparation
- **Personalized Content**: Tailored to specific persona and industry
- **Quick Reference**: Key pressures, language, and red flags at a glance
- **Professional Design**: Campbell & Co. branded and optimized for printing

### 📊 Post-Game Analysis
- **Call Logging**: Track outcomes and gather intelligence
- **Performance Insights**: Meeting booking rates and success metrics
- **Success Mindset**: Reinforcement that every call provides value
- **Continuous Learning**: Feedback loop for system improvement

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with Campbell & Co. brand colors
- **State Management**: Zustand for lightweight, persistent state
- **Icons**: Lucide React for consistent iconography
- **PDF Generation**: jsPDF for battle card exports
- **Build Tool**: Vite for fast development and optimized builds

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   └── modules/         # Feature-specific components
├── data/               # Static data (personas, industries, content)
├── services/           # External services (web search)
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
└── assets/             # Images and static assets
```

## Key Components

### Personas
- **The Cost-Conscious Employer**: Small business owners focused on value
- **The Benefits Optimizer**: HR managers seeking strategic solutions
- **The ROI-Focused Executive**: CFOs requiring financial justification
- **The Gatekeeper**: Assistants controlling access to decision-makers

### Industries
- Manufacturing
- Technology  
- Professional Services
- Healthcare
- Retail
- Construction

### Content Types
- **Openers**: Persona-specific conversation starters
- **Thought Leadership**: Industry insights and statistics
- **Objection Handlers**: Response strategies for common objections

## Branding

The application follows Campbell & Co.'s brand guidelines:
- **Primary Color**: #a5cf4c (Campbell & Co. green)
- **Typography**: Lato font family
- **Design**: Clean, professional, trustworthy aesthetic
- **Logo**: Campbell & Co. branding integration

## Development Philosophy

Built on the principle that this is not a script book, but an intelligence engine. The tool empowers consultants to master the central strategic tension of blending high-touch, advisory-led service with high-tech efficiency that clients expect.

## Future Enhancements

### Phase 2: Integration & Mobility
- Zoho CRM integration for seamless data flow
- Enhanced mobile optimization
- Real-time web search API integration

### Phase 3: Communications Integration
- Zoom API for call transcription and analysis
- Automated call data capture
- Advanced analytics and reporting

## License

Proprietary - Campbell & Co. Internal Use Only

---

*"See what others don't" - Campbell & Co.*