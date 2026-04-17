# Fares Khiary | AI Portfolio

Demo
https://www.fares-khiary.com/

A modern, interactive portfolio landing page featuring 3D graphics, AI-powered chat assistant, and a futuristic space theme.


## Features

### Core Features
- **Interactive 3D Background** - Immersive space-themed visuals using Three.js with React Three Fiber
- **Solar System View** - Interactive 3D solar system exploration mode
- **Multi-language Support (i18n)** - Full support for English, French, Arabic (Tunisian), and German
- **Dynamic Themes** - Seamless Light/Dark mode switching with persistent user preference
- **Responsive Design** - Fully responsive layout with Tailwind CSS
- **Smooth Animations** - Fluid transitions and effects with Framer Motion
- **Modern Stack** - Built with React 19, TypeScript, and Vite
- **Comprehensive Testing** - Unit, component, and integration tests with Vitest

### SEO & Social Media Optimization
- **Open Graph Protocol** - Full OG meta tags for rich social media previews (Facebook, LinkedIn)
- **Twitter Cards** - Summary large image cards with optimized 1200x630px images
- **Image Cache-Busting** - Dynamic versioning on OG/Twitter images for instant updates
- **Structured Data (JSON-LD)** - Schema.org Person type with social links
- **Meta Tags** - Title, description, keywords, author, canonical links
- **Facebook Integration** - Facebook App ID for social features
- **Fresh Timestamps** - Dynamic `og:updated_time` and `article:modified_time` metadata

### GDPR Compliance & Privacy
- **Cookie Consent Banner** - Glassmorphic modal with accept/decline/policy options
- **Persistent Consent Storage** - localStorage-based consent management (`fares_cookie_consent`)
- **Privacy Policy Modal** - Comprehensive policy covering data collection, security, transparency, and user rights
- **GDPR-First Design** - User control over data collection with clear opt-in mechanism
- **Minimal Data Collection** - Only voluntary name/message and Google OAuth basic profile data
- **No Third-Party Sharing** - All data encrypted and stored securely in Supabase

### AI Chat Assistant
- **N8N Webhook Integration** - Real-time AI conversations powered by GPT-4.1-mini via N8N
- **Multi-language Support** - Auto-detects and responds in the same language as the question
- **Sentiment Analysis** - Classifies questions as Positive 😊, Negative 🙁, Professional 🌐, or Neutral 😐
- **Smart Suggestions** - AI provides 3 contextual follow-up questions
- **Conversation Analytics** - All interactions logged to Google Sheets with metadata
- **Graceful Fallback** - Mock responses when webhook is unavailable

### Private Notes System with AI Feedback
- **Anonymous Notes** - Visitors can send private notes without signing in
- **Identified Notes** - Authenticated users can send notes with their identity
- **AI-Powered Feedback** - Second N8N webhook generates instant AI responses to submitted notes
- **Two-Webhook Architecture** - Separate webhooks for chat assistant and note feedback
- **Admin Dashboard** - Secure admin panel to view notes with AI comments, manage, and delete
- **Real-time Storage** - Notes and AI feedback stored securely in Supabase database
- **Input Sanitization** - XSS protection via HTML escaping on all user inputs
- **Rate Limiting** - Client-side rate limit (5 notes per 10 minutes) to prevent spam

### Multi-language Support (i18n)
- **Framework** - Powered by `react-i18next` and `i18next-browser-languagedetector`
- **Supported Languages**:
  - 🇺🇸 **English** (en)
  - 🇫🇷 **Français** (fr)
  - 🇹🇳 **العربية (تونسي)** (ar) - Features futuristic Arabic typography and RTL support
  - 🇩🇪 **Deutsch** (de)
- **Smart Detection** - Automatically detects browser language and persists user choice
- **Iconography** - High-quality SVG flags (via FlagCDN) for reliable cross-platform rendering (Windows/Mac/Mobile)

### Dynamic Theming
- **Mode Toggle** - Instant switching between futuristic Dark Mode and crisp Light Mode
- **Glassmorphism** - Adapts glass effects and neon accents for optimal visibility in both themes
- **Persistence** - Theme preference is saved locally (`localStorage`) and maintained across page reloads and 3D view changes
- **Full Coverage** - Consistent theming across all modals, chat interfaces, and private note popups

### Authentication (OAuth via Supabase)
- **Google OAuth** - Seamless one-click sign-in with Google
- **Session Persistence** - Authentication state maintained across page reloads
- **User Profile Display** - Shows logged-in user's name and avatar

## Project Structure

Nano Banana Pro 🍌 generated digram of the application workflow/arechitecture using a resume of this Readme file

<img width="2816" height="1536" alt="Gemini_Generated_Image_gsh0fwgsh0fwgsh0" src="https://github.com/user-attachments/assets/9c2950f3-1f88-461c-8355-acf6fee8b49b" />


```
landing-page/
├── components/
│   ├── AdminDashboard.tsx    # Admin panel for managing private notes with AI feedback
│   ├── Background3D.tsx      # Three.js 3D space background & solar system
│   ├── ChatInterface.tsx     # AI chat assistant component
│   ├── CookieConsent.tsx     # GDPR-compliant cookie consent banner
│   ├── NotePopup.tsx         # Private note submission modal with AI feedback
│   └── ProfileCard.tsx       # Main profile card with info & navigation
├── services/
│   ├── supabase.ts           # Supabase client initialization
│   └── webhookService.ts     # N8N webhook integration for AI chat & notes
├── utils/
│   └── security.ts           # Input sanitization and rate limiting
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
| Styling | Tailwind CSS 4 |
| Internationalization | react-i18next, i18next |
| Icons | Lucide React, FlagCDN (SVG) |
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
VITE_N8N_WEBHOOK_URL=your_n8n_webhook_url_for_chat
VITE_NOTES_WEBHOOK_URL=your_n8n_webhook_url_for_notes_feedback
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

The portfolio includes an AI chat assistant powered by a self-hosted N8N workflow that processes visitor questions with GPT-4.1-mini, performs sentiment analysis, and logs all conversations.

### N8N Workflow Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                              N8N AI CHAT WORKFLOW                                    │
│                                   "My Website"                                       │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌──────────┐   ┌─────────────┐   ┌───────────────────────┐   ┌──────────────────┐  │
│  │ Webhook  │──>│ Edit Fields │──>│      AI Agent         │──>│ Code (JavaScript)│  │
│  │ Trigger  │   │             │   │   (GPT-4.1-mini)      │   │ Response Parser  │  │
│  └──────────┘   └─────────────┘   └───────────────────────┘   └──────────────────┘  │
│       │               │                     │                          │            │
│       │               │              ┌──────┴──────┐                   │            │
│       │               │              │             │                   │            │
│       │               │         ┌────┴────┐  ┌─────┴─────┐             │            │
│       │               │         │ Simple  │  │  OpenAI   │             │            │
│       │               │         │ Memory  │  │   Model   │             │            │
│       │               │         └─────────┘  └───────────┘             │            │
│       │               │                                                │            │
│       ▼               ▼                                                ▼            │
│  ?question=       Injects:                                     Extracts from AI:    │
│  "user query"     • Resume (JSON)                              • Response text      │
│                   • Personal infos                             • Sentiment emoji    │
│                                                                • 3 suggestions      │
│                                                                                      │
│  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│  │                                                                              │   │
│  │   ┌────────┐   ┌────────────────────┐   ┌──────────────────────────────────┐ │   │
│  │   │  Wait  │──>│ Respond to Webhook │──>│   Google Sheets Logger           │ │   │
│  │   │  (1s)  │   │    (JSON)          │   │   (Analytics & Monitoring)       │ │   │
│  │   └────────┘   └────────────────────┘   └──────────────────────────────────┘ │   │
│  │                         │                              │                     │   │
│  │                         ▼                              ▼                     │   │
│  │               Returns to frontend:           Logs conversation:              │   │
│  │               {                              • Timestamp                     │   │
│  │                 "output": "...",             • Question & Response           │   │
│  │                 "suggestions": [...]         • Visitor IP & Country          │   │
│  │               }                              • User Agent & OS               │   │
│  │                                              • Sentiment Analysis            │   │
│  └──────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

### Workflow Nodes

| Node | Type | Purpose |
|------|------|---------|
| **Webhook** | `n8n-nodes-base.webhook` | Receives GET requests with `?question=` parameter |
| **Edit Fields** | `n8n-nodes-base.set` | Injects resume JSON and personal info context |
| **AI Agent** | `@n8n/n8n-nodes-langchain.agent` | Processes questions with custom system prompt |
| **Simple Memory** | `@n8n/n8n-nodes-langchain.memoryBufferWindow` | Maintains conversation context |
| **OpenAI Chat Model** | `@n8n/n8n-nodes-langchain.lmChatOpenAi` | GPT-4.1-mini language model |
| **Code in JavaScript** | `n8n-nodes-base.code` | Parses AI output into structured response |
| **Wait** | `n8n-nodes-base.wait` | 1-second processing delay |
| **Respond to Webhook** | `n8n-nodes-base.respondToWebhook` | Returns JSON response to frontend |
| **Google Sheets** | `n8n-nodes-base.googleSheets` | Logs all conversations for analytics |

### AI Agent Behavior

The AI is configured to:
- **Respond as Fares** in first person with direct, concise answers
- **Detect language** automatically and respond in the same language
- **Analyze sentiment**: Positive 😊 | Negative 🙁 | Professional 🌐 | Neutral 😐
- **Handle sensitive questions** politely with refusal
- **Counter insults** with witty, ironic comebacks
- **Generate 3 follow-up suggestions** based on context

### Response Format

**AI Agent Raw Output:**
```
{response} | {sentiment emoji} | {question1}? {question2}? {question3}?
```

**Parsed JSON Response:**
```json
{
  "output": "AI response text",
  "suggestions": ["Follow-up question 1?", "Follow-up question 2?", "Follow-up question 3?"]
}
```

### Analytics (Google Sheets Logging)

| Field | Data |
|-------|------|
| `time` | Request timestamp |
| `question` | User's original question |
| `response` | AI-generated response |
| `sentiment` | Detected sentiment with emoji |
| `ip` | Visitor IP (via `x-real-ip` header) |
| `country` | Country code (via Cloudflare `cf-ipcountry`) |
| `infos` | User agent string |
| `os` | Operating system (via `sec-ch-ua-platform`) |

### Configuration

**Chat Assistant Webhook:**
```env
VITE_N8N_WEBHOOK_URL=your_n8n_chat_webhook_url
```

**Notes Feedback Webhook:**
```env
VITE_NOTES_WEBHOOK_URL=your_n8n_notes_webhook_url
```

### Endpoint
```
GET {VITE_N8N_WEBHOOK_URL}?question={user_message}
```

### Features
- Multi-language support (auto-detects and responds in same language)
- Sentiment analysis with emoji indicators
- Conversation memory for context awareness
- Real-time analytics logging to Google Sheets
- Graceful fallback to mock responses when webhook is unavailable

---

## GDPR Compliance & Privacy Protection

The portfolio implements comprehensive GDPR compliance with transparent data handling and user consent management.

### Cookie Consent System

**Component:** `CookieConsent.tsx`

**Features:**
- **Glassmorphic Banner**: Modern design with backdrop blur effect
- **Delayed Display**: Appears 2 seconds after page load (if consent not given)
- **Consent Actions**:
  - ✅ **Confirm Handshake** - Accept cookies and dismiss banner
  - ❌ **Decline** - Reject cookies
  - 📋 **Policy** - View full privacy policy
- **Persistent Storage**: Consent saved to `localStorage` key: `fares_cookie_consent`
- **Animated Entrance**: Spring physics animation via Framer Motion

### Privacy Policy

**Location:** ProfileCard.tsx footer link + Cookie consent policy button

**Sections:**
1. **Data Collection**
   - Voluntary name/message submission
   - Google OAuth basic profile data (name, email, avatar)
   - No tracking without consent

2. **Data Security**
   - End-to-end encryption via Supabase
   - No third-party sharing
   - Secure OAuth token management

3. **Transparency**
   - Portfolio purpose clearly stated
   - All data flows are user-initiated
   - Open-source codebase (visible on GitHub)

4. **User Rights**
   - Data deletion requests via LinkedIn or email
   - Right to withdraw consent
   - Access to collected data

### Data Storage

| Data Type | Storage | Encryption | Retention |
|-----------|---------|------------|-----------|
| User session | Supabase Auth | ✅ Yes | Session-based |
| Private notes | Supabase PostgreSQL | ✅ Yes | Indefinite (deletable) |
| Cookie consent | localStorage | ❌ Not sensitive | Indefinite |
| Chat conversations | Google Sheets (N8N) | ⚠️ External | Per N8N policy |

### Security Measures

**Console Warning:**
```javascript
// App.tsx - Fares Neural Defense Protocol v5.2
// Warns developers against unauthorized code injection
```

**Input Sanitization:**
- All user inputs sanitized before database/webhook submission
- HTML entity escaping prevents XSS attacks

**Rate Limiting:**
- Client-side protection against spam/abuse
- 5 notes per 10 minutes per client

---

## SEO & Social Media Optimization

The portfolio is fully optimized for search engines and social media sharing with comprehensive meta tags and structured data.

### Open Graph Protocol

**Location:** `index.html` (`<head>` section)

**Implemented Tags:**
```html
<html prefix="og: http://ogp.me/ns#">
<!-- OG Prefix for namespace declaration -->

<!-- Primary OG Tags -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://fares-khiary.com/" />
<meta property="og:title" content="Fares Khiary | AI Engineer Portfolio" />
<meta property="og:description" content="Interactive portfolio..." />
<meta property="og:locale" content="en_US" />

<!-- OG Image Metadata -->
<meta property="og:image" content="https://fares-khiary.com/og-image.png?v=4" />
<meta property="og:image:secure_url" content="https://fares-khiary.com/og-image.png?v=4" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Fares Khiary AI Engineer Portfolio Preview" />

<!-- Timestamps -->
<meta property="og:updated_time" content="2026-01-20T20:13:00Z" />
<meta property="article:published_time" content="2025-01-15T00:00:00Z" />
<meta property="article:modified_time" content="2026-01-20T20:13:00Z" />
```

### Twitter Cards

```html
<!-- Twitter Card Tags -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="https://fares-khiary.com/" />
<meta name="twitter:title" content="Fares Khiary | AI Engineer Portfolio" />
<meta name="twitter:description" content="Interactive portfolio..." />
<meta name="twitter:image" content="https://fares-khiary.com/twitter-image.png?v=4" />
<meta name="twitter:image:alt" content="Fares Khiary Portfolio Preview" />
```

### Structured Data (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Fares Khiary",
  "jobTitle": "AI Engineer",
  "url": "https://fares-khiary.com",
  "sameAs": [
    "https://www.linkedin.com/in/fares-khiary",
    "https://github.com/faresk93",
    "https://www.instagram.com/faresk93"
  ]
}
```

### Facebook Integration

```html
<meta property="fb:app_id" content="1136552551741448" />
```

### Image Optimization

**Cache-Busting:**
- Dynamic versioning on OG/Twitter images: `?v=4`
- Ensures instant image updates on social platforms
- Prevents stale cache issues

**Image Specifications:**
- **OG Image**: 1200x630px (Facebook/LinkedIn optimal)
- **Twitter Image**: 1200x630px (summary_large_image format)
- **Format**: PNG for transparency support
- **Alt Text**: SEO-optimized descriptive text

### Primary Meta Tags

```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Fares Khiary | AI Engineer Portfolio</title>
<meta name="description" content="Interactive 3D portfolio..." />
<meta name="keywords" content="AI Engineer, Portfolio, React, Three.js..." />
<meta name="author" content="Fares Khiary" />
<link rel="canonical" href="https://fares-khiary.com/" />
```

### Benefits

✅ **Rich Previews**: LinkedIn, Facebook, Twitter show full preview cards
✅ **SEO Ranking**: Structured data helps search engines understand content
✅ **Social Engagement**: Eye-catching previews increase click-through rates
✅ **Fresh Content**: Version parameters ensure latest images display
✅ **Professional Branding**: Consistent metadata across all platforms

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

## Private Notes System with AI Feedback

Visitors can send private notes to the portfolio owner, with optional anonymous submission and instant AI-generated feedback.

### Features

- **Anonymous Notes**: Send notes without signing in
- **Identified Notes**: Authenticated users can attach their identity
- **AI-Powered Feedback**: Instant AI response generated via N8N webhook before saving
- **Two-Webhook Architecture**: Separate webhooks for chat assistant and note feedback
- **Input Sanitization**: XSS protection via HTML escaping on all user inputs
- **Rate Limiting**: Client-side protection (5 notes per 10 minutes)
- **Admin Dashboard**: Secure panel to view notes with AI comments and manage all notes
- **Delete Confirmation**: Protected delete operations with confirmation dialog

### Database Schema (Supabase)

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  sender_name TEXT,
  user_email TEXT,
  ai_comment TEXT,  -- AI-generated feedback from webhook
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Note Submission Flow with AI Feedback

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  Visitor    │────>│ Note Popup  │────>│ N8N Webhook  │────>│   Supabase   │
│ Clicks Send │     │  Modal      │     │  (AI Model)  │     │   Database   │
└─────────────┘     └─────────────┘     └──────────────┘     └──────────────┘
                          │                     │                    │
                          ▼                     ▼                    ▼
               User inputs:              AI generates:        Stores:
               - Name (optional)         - Feedback comment   - Note content
               - Email (optional)        - Response message   - Sender info
               - Note content                                 - AI comment
                                                              - Timestamp

Options:
- Anonymous (no auth required)
- Identified (uses Google session)
```

### Webhook Configuration

**Notes Feedback Webhook:**
```
URL: VITE_NOTES_WEBHOOK_URL
Parameters:
  - note: string (sanitized note content)
  - sender: string (sender name or "Anonymous")
  - email: string (sender email or empty)
  - isAnonymous: boolean

Response:
{
  "ai_comment": "AI-generated feedback text"
}
```

### Security Features

**Input Sanitization (`utils/security.ts`):**
```typescript
sanitizeInput(input: string): string
// Escapes HTML entities: & < > " '
// Prevents XSS attacks
```

**Rate Limiting:**
- **Limit**: 5 notes per 10 minutes per client
- **Storage**: localStorage timestamp tracking
- **Character Limit**: 2000 characters per note
- **Bypass**: Development environment unlimited

### Admin Access

The admin dashboard is restricted to the portfolio owner's email (`khiary.fares@gmail.com`). Features include:
- **View All Notes**: Complete note archive with sender info and timestamps
- **AI Feedback Display**: "Transmission Response" column shows AI-generated comments
- **Sort Options**: Sort by date (newest/oldest first)
- **Delete Notes**: Confirmation modal before deletion
- **Responsive Design**:
  - Desktop: Full table with Identity, Payload, AI Response, Timestamp columns
  - Mobile: Card-based layout with all data preserved
- **Real-time Refresh**: Manual refresh button to fetch latest notes
- **Metrics Footer**: Total note count display

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
- **Cairo** - Bold, modern Arabic typography
- **Readex Pro** - Futuristic look for Arabic names and UI elements

### Theming System

The application uses a hybrid CSS variable system for themes:

```css
:root {
  /* Dark Theme (Default) */
  --card-bg: rgba(13, 13, 21, 0.7);
  --card-border: rgba(255, 255, 255, 0.1);
  --card-text: #ffffff;
}

.light-theme {
  /* Light Theme Overrides */
  --card-bg: rgba(255, 255, 255, 0.8);
  --card-border: rgba(0, 0, 0, 0.1);
  --card-text: #1f2937;
  background-color: #f8fafc;
}
```

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

