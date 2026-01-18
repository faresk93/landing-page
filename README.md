# Fares Khiary | AI Portfolio

Demo
https://www.fares-khiary.com/

A modern, interactive portfolio landing page featuring 3D graphics, AI-powered chat assistant, and a futuristic space theme.

## Features

- **Interactive 3D Background** - Immersive space-themed visuals using Three.js with React Three Fiber
- **AI Chat Assistant** - Conversational AI powered by N8N webhook integration
- **Solar System View** - Interactive 3D solar system exploration mode
- **Responsive Design** - Fully responsive layout with Tailwind CSS
- **Smooth Animations** - Fluid transitions and effects with Framer Motion
- **Modern Stack** - Built with React 19, TypeScript, and Vite
- **Comprehensive Testing** - Unit, component, and integration tests with Vitest

## Project Structure

```
landing-page/
├── components/
│   ├── Background3D.tsx      # Three.js 3D space background & solar system
│   ├── ChatInterface.tsx     # AI chat assistant component
│   └── ProfileCard.tsx       # Main profile card with info & navigation
├── services/
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
        ├── ci.yml                    # CI pipeline (test, build, docker)
        └── merge_claude_to_main.yml  # Auto-merge workflow with tests
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
| Container | Docker with Nginx |
| Reverse Proxy | Traefik (via Docker Compose) |
| CI/CD | GitHub Actions |

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
GEMINI_API_KEY=your_gemini_api_key
VITE_N8N_WEBHOOK_URL=your_n8n_webhook_url
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

## CI/CD Workflows

### CI Pipeline (`.github/workflows/ci.yml`)

Triggered on pushes to `main` and `claude/**` branches, and on pull requests.

**Jobs:**

1. **Test** - Runs on Node.js 18 and 20
   - Install dependencies
   - TypeScript type checking
   - Run unit tests
   - Generate coverage report

2. **Build** - Runs after tests pass
   - Build production bundle
   - Upload artifacts

3. **Docker Build** - Verify Docker image builds correctly

### Auto-Merge Claude Branches (`.github/workflows/merge_claude_to_main.yml`)

Automatically merges `claude/**` branches into `main` after tests pass.

**Process:**
1. Run TypeScript checks
2. Run all tests
3. Build application
4. If all checks pass, merge into main

**Trigger:** Push to any `claude/**` branch

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

## AI Chat Integration

The portfolio includes an AI chat assistant that communicates via N8N webhook:

**Configuration:** Set `VITE_N8N_WEBHOOK_URL` in your environment

**Features:**
- Real-time conversation with AI
- Suggested follow-up questions
- Graceful fallback to mock responses when webhook is unavailable
- Error handling with user-friendly messages

**Endpoint Format:**
```
GET {WEBHOOK_URL}?question={user_message}
```

**Expected Response:**
```json
{
  "output": "AI response text",
  "suggestions": ["Suggestion 1", "Suggestion 2"]
}
```

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
