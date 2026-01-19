# Fares Khiary | AI Portfolio

Demo
https://www.fares-khiary.com/

A modern, interactive portfolio landing page featuring 3D graphics, AI-powered chat assistant, and a futuristic space theme.

## Features

### Core Features
- **Interactive 3D Background** - Immersive space-themed visuals using Three.js with React Three Fiber
- **Solar System View** - Interactive 3D solar system exploration mode
- **Responsive Design** - Fully responsive layout with Tailwind CSS
- **Smooth Animations** - Fluid transitions and effects with Framer Motion
- **Modern Stack** - Built with React 19, TypeScript, and Vite
- **Comprehensive Testing** - Unit, component, and integration tests with Vitest

### AI Chat Assistant
- **N8N Webhook Integration** - Real-time AI conversations powered by custom N8N workflows
- **Smart Suggestions** - AI provides contextual follow-up questions
- **Graceful Fallback** - Mock responses when webhook is unavailable

### Private Notes System
- **Anonymous Notes** - Visitors can send private notes without signing in
- **Identified Notes** - Authenticated users can send notes with their identity
- **Admin Dashboard** - Secure admin panel to view, manage, and delete notes
- **Real-time Storage** - Notes stored securely in Supabase database

### Authentication (OAuth via Supabase)
- **Google OAuth** - Seamless one-click sign-in with Google
- **Session Persistence** - Authentication state maintained across page reloads
- **User Profile Display** - Shows logged-in user's name and avatar

## Project Structure

```
landing-page/
├── components/
│   ├── AdminDashboard.tsx    # Admin panel for managing private notes
│   ├── Background3D.tsx      # Three.js 3D space background & solar system
│   ├── ChatInterface.tsx     # AI chat assistant component
│   ├── NotePopup.tsx         # Private note submission modal
│   └── ProfileCard.tsx       # Main profile card with info & navigation
├── services/
│   ├── supabase.ts           # Supabase client initialization
│   └── webhookService.ts     # N8N webhook integration for AI responses
├── tests/
│   ├── setup.ts              # Test setup and global mocks
│   ├── components/           # Component tests
│   │   ├── App.test.tsx
│   │   ├── ProfileCard.test.tsx
│   │   └── ChatInterface.test.tsx
│   ├── unit/                 # Unit tests
│   │   ├── constants.test.ts
│   │   └── types.test.ts
│   └── integration/          # Integration tests
│       └── userFlow.test.tsx
├── App.tsx                   # Main application component
├── index.tsx                 # React entry point
├── index.html                # HTML template with Tailwind config
├── index.css                 # Global styles and Tailwind imports
├── types.ts                  # TypeScript type definitions
├── constants.ts              # Application constants & social links
├── vite.config.ts            # Vite configuration
├── vitest.config.ts          # Vitest test configuration
├── tsconfig.json             # TypeScript configuration
├── Dockerfile                # Multi-stage Docker build
├── docker-compose.yml        # Docker Compose with Traefik integration
└── .github/
    └── workflows/
        └── merge_claude_to_main.yml  # Auto-merge workflow
```

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Language | TypeScript 5.8 |
| Build Tool | Vite 6 |
| Testing | Vitest, Testing Library, jsdom |
| 3D Graphics | Three.js, React Three Fiber, React Three Drei |
| Animations | Framer Motion |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Backend/Auth | Supabase (PostgreSQL, OAuth) |
| AI Workflow | N8N (Self-hosted) |
| Container | Docker with Nginx |
| Reverse Proxy | Traefik (via Docker Compose) |

## Prerequisites

- Node.js 18+ (recommended: Node.js 20)
- npm or yarn
- Docker & Docker Compose (for containerized deployment)

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the project root:

```env
VITE_N8N_WEBHOOK_URL=your_n8n_webhook_url
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:ui` | Open Vitest UI for interactive testing |

## Testing

The project uses **Vitest** as the testing framework with **React Testing Library** for component testing.

### Test Structure

```
tests/
├── setup.ts              # Global test setup (mocks for WebGL, ResizeObserver, etc.)
├── components/           # React component tests
├── unit/                 # Pure unit tests (types, constants)
└── integration/          # End-to-end user flow tests
```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Open interactive Vitest UI
npm run test:ui
```

### Test Coverage

Coverage reports are generated in the `coverage/` directory when running `npm run test:coverage`. The report includes:

- **Text** - Terminal output
- **JSON** - Machine-readable format
- **HTML** - Interactive browser report (`coverage/index.html`)

### Writing Tests

**Component Test Example:**

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from '../components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<MyComponent onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

**Service Test Example:**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { myService } from '../services/myService';

describe('myService', () => {
  it('returns expected data', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: 'test' }),
    });

    const result = await myService.getData();
    expect(result.data).toBe('test');
  });
});
```

### Test Configuration

The test configuration is defined in `vitest.config.ts`:

- **Environment:** jsdom (browser-like environment)
- **Global APIs:** `describe`, `it`, `expect`, `vi` available globally
- **Setup file:** `tests/setup.ts` runs before all tests
- **Coverage provider:** V8

## Build for Production

```bash
npm run build
```

Output files will be generated in the `dist/` directory.

## Docker Deployment

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t portfolio .

# Run the container
docker run -p 80:80 portfolio
```

### Using Docker Compose with Traefik

The `docker-compose.yml` is configured for deployment with Traefik reverse proxy:

```bash
# Set environment variables
export DOMAIN_NAME=your-domain.com
export SUBDOMAIN=portfolio
export CHICHA_SUBDOMAIN=chicha

# Deploy
docker-compose up -d
```

**Docker Compose Features:**
- Multi-stage build (Node.js for build, Nginx for serving)
- Traefik integration with automatic HTTPS via Let's Encrypt
- Support for multiple domain configurations
- External network integration (`n8n_default`)

### Environment Variables for Docker Compose

| Variable | Description |
|----------|-------------|
| `DOMAIN_NAME` | Your root domain (e.g., `example.com`) |
| `SUBDOMAIN` | Subdomain for portfolio (e.g., `portfolio`) |
| `CHICHA_SUBDOMAIN` | Additional subdomain for secondary site |

## CI/CD Workflow

### Auto-Merge Claude Branches

The repository includes a GitHub Actions workflow that automatically merges branches prefixed with `claude/` into `main`:

**File:** `.github/workflows/merge_claude_to_main.yml`

**Trigger:** Push to any `claude/**` branch

**Process:**
1. Checkout repository with full history
2. Fetch and verify the Claude branch
3. Merge into main with `--no-ff` flag
4. Push changes to origin

This enables seamless integration of AI-assisted development branches.

## Configuration Files

### TypeScript Configuration (`tsconfig.json`)

- Target: ES2022
- Module: ESNext
- JSX: react-jsx
- Path alias: `@/*` maps to project root
- Strict type checking with `skipLibCheck` enabled

### Vite Configuration (`vite.config.ts`)

- React plugin with Fast Refresh
- Development server on port 3000 with `0.0.0.0` host
- Environment variable injection for API keys
- Output directory: `dist/`
- Path alias resolution

### Vitest Configuration (`vitest.config.ts`)

- Environment: jsdom
- Global test APIs enabled
- Setup file for mocks
- V8 coverage provider

## AI Chat Integration (N8N Workflow)

The portfolio includes an AI chat assistant powered by a custom N8N workflow that processes visitor questions and returns AI-generated responses.

### N8N Workflow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         N8N AI CHAT WORKFLOW                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐    ┌──────────────┐    ┌─────────────┐    ┌───────────────┐  │
│  │ Webhook  │───>│ AI Agent     │───>│ Process     │───>│ Return JSON   │  │
│  │ Trigger  │    │ (Claude/GPT) │    │ Response    │    │ Response      │  │
│  └──────────┘    └──────────────┘    └─────────────┘    └───────────────┘  │
│       │                 │                   │                   │          │
│       │                 │                   │                   │          │
│       ▼                 ▼                   ▼                   ▼          │
│  Receives        Processes query      Formats output      Sends back       │
│  visitor         with context         and generates       response with    │
│  question        about portfolio      suggestions         AI output        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Workflow Components

| Node | Purpose |
|------|---------|
| **Webhook Trigger** | Receives incoming chat requests from the portfolio |
| **AI Agent** | Processes the question using LLM with portfolio context |
| **Response Formatter** | Structures the AI output with suggestions |
| **HTTP Response** | Returns JSON to the portfolio frontend |

### Configuration

Set `VITE_N8N_WEBHOOK_URL` in your environment.

### Endpoint Format
```
GET {WEBHOOK_URL}?question={user_message}
```

### Expected Response
```json
{
  "output": "AI response text",
  "suggestions": ["Follow-up question 1", "Follow-up question 2"]
}
```

### Features
- Real-time conversation with AI
- Contextual follow-up suggestions
- Graceful fallback to mock responses when webhook is unavailable
- Error handling with user-friendly messages

---

## Authentication (Supabase OAuth)

The portfolio uses Supabase for authentication, providing a seamless Google OAuth sign-in experience.

### Setup

1. Create a [Supabase](https://supabase.com) project
2. Enable Google OAuth in Authentication > Providers
3. Configure your Google Cloud OAuth credentials
4. Add your site URL to the allowed redirect URLs

### Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Authentication Flow

```
┌─────────┐     ┌──────────┐     ┌────────────┐     ┌──────────┐
│  User   │────>│ Portfolio│────>│   Google   │────>│ Supabase │
│ Clicks  │     │ Redirects│     │   OAuth    │     │ Session  │
│ Sign In │     │ to Google│     │  Consent   │     │ Created  │
└─────────┘     └──────────┘     └────────────┘     └──────────┘
                                       │
                                       ▼
                              User metadata stored:
                              - Full name
                              - Avatar URL
                              - Email
```

### Features
- One-click Google sign-in
- Session persistence across page reloads
- User profile display (name & avatar)
- Secure token management via Supabase

---

## Private Notes System

Visitors can send private notes to the portfolio owner, with optional anonymous submission.

### Features

- **Anonymous Notes**: Send notes without signing in
- **Identified Notes**: Authenticated users can attach their identity
- **Admin Dashboard**: Secure panel to view and manage all notes
- **Delete Confirmation**: Protected delete operations with confirmation dialog

### Database Schema (Supabase)

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  sender_name TEXT,
  user_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Note Submission Flow

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│  Visitor    │────>│ Note Popup  │────>│   Supabase   │
│ Clicks Send │     │  Modal      │     │   Database   │
└─────────────┘     └─────────────┘     └──────────────┘
                          │
                          ▼
               Options:
               - Anonymous (no auth required)
               - Identified (uses Google session)
```

### Admin Access

The admin dashboard is restricted to the portfolio owner's email. Features include:
- View all notes with sender info and timestamps
- Sort notes by date (ascending/descending)
- Delete notes with confirmation
- Responsive design (table on desktop, cards on mobile)

## Customization

### Social Links

Edit `constants.ts` to update social media links:

```typescript
export const SOCIAL_LINKS = {
  LINKEDIN: "https://www.linkedin.com/in/your-profile",
  INSTAGRAM: "https://www.instagram.com/your-handle",
  GITHUB: "https://github.com/your-username",
  EMAIL: "your@email.com"
};
```

### Theme Colors

Modify the Tailwind configuration in `index.html`:

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        neonBlue: '#00f3ff',
        neonPurple: '#bc13fe',
        neonOrange: '#ff9e00',
        deepSpace: '#050510',
      }
    }
  }
}
```

### Fonts

The project uses three custom fonts from Google Fonts:
- **Orbitron** - Headers and accent text
- **Rajdhani** - Secondary headings
- **Inter** - Body text

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

WebGL support is required for 3D graphics.

## License

Private project - All rights reserved.

## Author

**Fares Khiary**
- Website: [fares-khiary.com](https://fares-khiary.com)
- LinkedIn: [fares-khiary](https://www.linkedin.com/in/fares-khiary)
- GitHub: [faresk93](https://github.com/faresk93)
