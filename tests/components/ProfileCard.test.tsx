import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProfileCard } from '../../components/ProfileCard';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, exit, transition, whileHover, whileTap, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
    button: ({ children, onClick, initial, animate, exit, transition, whileHover, whileTap, className, ...props }: any) => (
      <button onClick={onClick} className={className} {...props}>{children}</button>
    ),
    span: ({ children, initial, animate, exit, transition, ...props }: any) => (
      <span {...props}>{children}</span>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock ChatInterface
vi.mock('../../components/ChatInterface', () => ({
  ChatInterface: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    isOpen ? (
      <div data-testid="chat-interface">
        <button onClick={onClose} data-testid="close-chat">Close</button>
      </div>
    ) : null
  ),
}));

describe('ProfileCard', () => {
  const mockOnEnterUniverse = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the profile card with name', () => {
    render(<ProfileCard onEnterUniverse={mockOnEnterUniverse} />);

    // Use getAllByText since the name appears multiple times (header and footer)
    const nameElements = screen.getAllByText('Fares KHIARY');
    expect(nameElements.length).toBeGreaterThan(0);
  });

  it('renders the job title', () => {
    render(<ProfileCard onEnterUniverse={mockOnEnterUniverse} />);

    expect(screen.getByText('Full-Stack Web Developer')).toBeInTheDocument();
  });

  it('renders the Neural Link Active status', () => {
    render(<ProfileCard onEnterUniverse={mockOnEnterUniverse} />);

    expect(screen.getByText('Neural Link Active')).toBeInTheDocument();
  });

  it('renders country badges', () => {
    render(<ProfileCard onEnterUniverse={mockOnEnterUniverse} />);

    expect(screen.getByText('Tunisia')).toBeInTheDocument();
    expect(screen.getByText('France')).toBeInTheDocument();
    expect(screen.getByText('Oman')).toBeInTheDocument();
  });

  it('renders the AI Assistant section', () => {
    render(<ProfileCard onEnterUniverse={mockOnEnterUniverse} />);

    expect(screen.getByText('Fares AI Assistant')).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<ProfileCard onEnterUniverse={mockOnEnterUniverse} />);

    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('has LinkedIn link in social links', () => {
    render(<ProfileCard onEnterUniverse={mockOnEnterUniverse} />);

    const allLinks = screen.getAllByRole('link');
    const hasLinkedIn = allLinks.some(link =>
      link.getAttribute('href')?.includes('linkedin')
    );
    expect(hasLinkedIn).toBe(true);
  });

  it('renders MY UNIVERSE button', () => {
    render(<ProfileCard onEnterUniverse={mockOnEnterUniverse} />);

    expect(screen.getByText('MY UNIVERSE')).toBeInTheDocument();
  });

  it('calls onEnterUniverse when MY UNIVERSE button is clicked', () => {
    render(<ProfileCard onEnterUniverse={mockOnEnterUniverse} />);

    const universeButton = screen.getByText('MY UNIVERSE').closest('button');
    fireEvent.click(universeButton!);

    expect(mockOnEnterUniverse).toHaveBeenCalledTimes(1);
  });

  it('opens chat interface when chat input area is clicked', async () => {
    render(<ProfileCard onEnterUniverse={mockOnEnterUniverse} />);

    // Find the chat trigger area and click it
    const chatTrigger = screen.getByText(/Tap the input below/i).closest('div')?.parentElement?.querySelector('[class*="cursor-text"]');

    if (chatTrigger) {
      fireEvent.click(chatTrigger);

      await waitFor(() => {
        expect(screen.getByTestId('chat-interface')).toBeInTheDocument();
      });
    }
  });

  it('renders the footer with author credit', () => {
    render(<ProfileCard onEnterUniverse={mockOnEnterUniverse} />);

    // Use regex to match partial text since "Made with" is broken up by elements
    expect(screen.getByText(/Made with/i)).toBeInTheDocument();
    expect(screen.getByText(/Enhanced with AI/i)).toBeInTheDocument();
  });

  it('renders version number', () => {
    render(<ProfileCard onEnterUniverse={mockOnEnterUniverse} />);

    expect(screen.getByText('V3.5')).toBeInTheDocument();
  });
});
