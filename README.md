# Sahaay - AI

Sahaay is a mental health support platform that blends daily check-ins, guided coping tools, reflective journaling, and community support. It includes an explainable AI recommendation system to personalize coping strategies based on recent mood and chat context.

## Features (Detailed)

### Authentication and onboarding
- Secure sign-in and account setup for personalized experiences.
- Onboarding flow that helps users set goals, preferences, and safety context.
- Session handling on the client with a clear separation of auth and user data contexts.

### Emotion-aware conversation layer
- Natural, structured conversations adapt to emotional tone and context in real time.
- Detects signals like stress, anxiety, low mood, and crisis indicators from user inputs.
- Responses remain empathetic, context-aware, and aligned with clinical safety guardrails.

### Daily mood check-ins and emotional baseline tracking
- Daily mood and intensity logging builds a reliable emotional baseline over time.
- Trend tracking highlights fluctuations, recurring patterns, and early warning signals.
- Intensity levels influence whether the system recommends lighter reflections or active coping.

### Explainable AI recommendation engine
- Transparent scoring balances mood compatibility, emotional intensity, sentiment, and time fit.
- Every recommendation includes a clear rationale to build user trust and accountability.
- Remains auditable and safe, avoiding opaque, black-box suggestions.

### Guided micro-interventions
- Short, evidence-based tools (breathing, grounding, reframing, journaling, movement) for quick relief.
- Time-boxed formats fit student and professional schedules with low friction.
- Consistent structure reduces overwhelm and encourages steady engagement.

### Journaling
- Structured entries to help users reflect on thoughts and patterns.
- Designed to pair with coping tools and check-ins for better continuity.

### Safety and crisis preparedness layer
- Detects high-risk emotional signals and triggers structured safety guidance.
- Supports proactive planning with accessible, step-by-step support resources.
- Responsible AI safeguards prioritize user wellbeing and ethical boundaries.

### Community
- Peer support space for shared experiences and encouragement.
- Designed to complement self-guided tools with social connection.

### Institutional analytics and wellbeing insights
- Privacy-preserving, anonymized trend analytics for schools and workplaces.
- Surfaces patterns like rising stress, burnout clusters, and engagement gaps.
- Enables preventive, data-driven support without exposing individual data.

### Analytics and insights
- Charts and summaries that help users notice trends over time.
- Supports personal growth by showing how coping choices align with mood changes.

### Settings and preferences
- Control personal data, notification preferences, and experience tuning.
- Clear boundaries between user profile and app behavior customization.

## AI Recommendation System (Summary)

The recommendation engine is explainable and clinically grounded. It builds a recommendation context from check-ins and chat tags, scores each coping tool using fixed weights, and returns ranked results with reasons.

- Mood compatibility: up to 40 points
- Chat sentiment: up to 30 points
- Intensity matching: up to 20 points
- Duration preference: up to 10 points

For deeper algorithm details, see the design notes in RECOMMENDATION_FLOW_DIAGRAMS.md.

## Tech Stack

### Frontend
- Vite + React 18 + TypeScript
- Tailwind CSS + shadcn/ui + Radix UI
- React Router for navigation
- TanStack React Query for data fetching and caching
- React Hook Form + Zod for forms and validation
- Recharts for analytics visualizations
- Firebase client SDK and IndexedDB (idb)

### Backend
- Node.js + Express + TypeScript
- Firebase Admin SDK
- OpenAI SDK (for AI services integration)
- Zod for validation
- bcryptjs for password hashing
- web-push for notifications
- helmet, cors, morgan for security and logging
- Luxon for time and timezone handling

### Tooling and quality
- Vitest + Testing Library
- ESLint + TypeScript ESLint
- PostCSS + Autoprefixer

## Project Structure

```
.
├── backend/               # Express API and services
├── public/                # Static assets
├── src/                   # Frontend React app
│   ├── components/        # Layout and UI components
│   ├── contexts/          # Auth and user context
│   ├── hooks/             # Reusable hooks
│   ├── lib/               # API, AI logic, data, utilities
│   └── pages/             # Route pages
├── index.html
├── package.json
└── vite.config.ts
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm (or bun)

### Frontend
1. Install dependencies
	- npm install
2. Start dev server
	- npm run dev

### Backend
1. Install dependencies
	- cd backend
	- npm install
2. Start API in watch mode
	- npm run dev

## Scripts

### Frontend
- npm run dev
- npm run build
- npm run preview
- npm run test
- npm run lint

### Backend
- npm run dev
- npm run build
- npm run start
- npm run seed

## Deployment (Render)

This repo contains a frontend (Vite) and a backend (Express). Deploy them as separate services.

### 1) Deploy the backend (Web Service)

1. Create a new **Web Service** on Render and connect this repo.
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to:
	- `npm install ; npm run build`
4. Set **Start Command** to:
	- `npm run start`
5. Add required environment variables in Render (see list below).
6. Deploy and copy the public service URL.
	- Current backend URL: https://sahaay-ai-y9v3.onrender.com

### 2) Deploy the frontend (Static Site)

1. Create a new **Static Site** on Render and connect this repo.
2. Set **Root Directory** to the repo root.
3. Set **Build Command** to:
	- `npm install ; npm run build`
4. Set **Publish Directory** to:
	- `dist`
5. Add frontend environment variables (for example, API base URL pointing to the backend service).
6. Deploy and open the site URL.

### 2a) SPA rewrite rule (required for React Router)

In Render → Static Site → Redirects/Rewrites, add:
- Source: `/*`
- Destination: `/index.html`
- Action: `Rewrite`

### 3) Wire frontend to backend

- If the frontend expects an API base URL, set it in Render for the static site.
	- Use `VITE_API_BASE_URL` and set it to your backend URL, for example:
		- https://sahaay-ai-y9v3.onrender.com
- Make sure CORS in the backend allows the frontend domain.
- If you use Firebase, set the same Firebase config values in Render.

## Notes

- The AI recommendation system is rule-based today and designed to be safely upgraded to LLM scoring.
- Clinical safety guardrails are enforced in tool metadata and recommendation logic.
