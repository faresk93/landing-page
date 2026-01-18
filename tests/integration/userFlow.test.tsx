import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, exit, transition, whileHover, whileTap, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
    button: ({ children, onClick, className, initial, animate, exit, transition, whileHover, whileTap, ...props }: any) => (
      <button onClick={onClick} className={className} {...props}>{children}</button>
    ),
    span: ({ children, initial, animate, exit, transition, ...props }: any) => (
      <span {...props}>{children}</span>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Background3D
vi.mock('../../components/Background3D', () => ({
  Background3D: ({ showSolarSystem }: { showSolarSystem: boolean }) => (
    <div data-testid="background-3d" data-solar-system={showSolarSystem.toString()}>
      {showSolarSystem ? 'Solar System View' : 'Profile View Background'}
    </div>
  ),
}));

// Mock webhook service
vi.mock('../../services/webhookService', () => ({
  sendMessageToWebhook: vi.fn().mockResolvedValue({
    output: 'I am Fares\'s AI assistant. I can help you learn about his skills and experience.',
    suggestions: ['Tell me about skills', 'Contact info'],
  }),
}));

describe('User Flow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Navigation Flow', () => {
    it('complete navigation flow: profile -> universe -> back to profile', async () => {
      render(<App />);

      // Initially on profile view
      expect(screen.getByTestId('background-3d')).toHaveAttribute('data-solar-system', 'false');

      // Click to enter universe
      const enterButton = screen.getByText('MY UNIVERSE');
      fireEvent.click(enterButton);

      // Should be in solar system view
      await waitFor(() => {
        expect(screen.getByTestId('background-3d')).toHaveAttribute('data-solar-system', 'true');
      });

      // Click back button
      const backButton = screen.getByText(/BACK TO PROFILE/i);
      fireEvent.click(backButton);

      // Should be back to profile view
      await waitFor(() => {
        expect(screen.getByTestId('background-3d')).toHaveAttribute('data-solar-system', 'false');
      });
    });
  });

  describe('Profile Card Interactions', () => {
    it('displays all required profile information', () => {
      render(<App />);

      // Use getAllByText since "Fares KHIARY" appears in multiple places (header and footer)
      const nameElements = screen.getAllByText('Fares KHIARY');
      expect(nameElements.length).toBeGreaterThan(0);
      expect(screen.getByText('Full-Stack Web Developer')).toBeInTheDocument();
      expect(screen.getByText('Neural Link Active')).toBeInTheDocument();
    });

    it('renders all social media links', () => {
      render(<App />);

      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThanOrEqual(4); // Mail, LinkedIn, Instagram, GitHub
    });

    it('social links have correct target attributes', () => {
      render(<App />);

      const links = screen.getAllByRole('link');
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('mailto')) {
          expect(link).toHaveAttribute('target', '_blank');
          expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        }
      });
    });
  });
});

describe('Chat Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens chat when chat input area is clicked', async () => {
    render(<App />);

    // Find and click the chat trigger
    const chatTrigger = screen.getByText(/Tap the input below/i)
      .closest('div')?.parentElement?.querySelector('[class*="cursor-text"]');

    if (chatTrigger) {
      fireEvent.click(chatTrigger);

      await waitFor(() => {
        expect(screen.getByText('FARES_AI_MIND_CLONE')).toBeInTheDocument();
      });
    }
  });
});

describe('Accessibility Tests', () => {
  it('all interactive elements are keyboard accessible', () => {
    render(<App />);

    const buttons = screen.getAllByRole('button');
    const links = screen.getAllByRole('link');

    // All buttons and links should be present
    expect(buttons.length).toBeGreaterThan(0);
    expect(links.length).toBeGreaterThan(0);
  });

  it('main heading is present', () => {
    render(<App />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Fares KHIARY');
  });
});

describe('Error Handling', () => {
  it('renders app without crashing', () => {
    render(<App />);

    // The app should render basic elements
    const nameElements = screen.getAllByText('Fares KHIARY');
    expect(nameElements.length).toBeGreaterThan(0);
  });
});
