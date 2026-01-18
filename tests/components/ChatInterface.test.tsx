import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInterface } from '../../components/ChatInterface';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, exit, transition, whileHover, whileTap, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
    button: ({ children, onClick, initial, animate, exit, transition, whileHover, whileTap, ...props }: any) => (
      <button onClick={onClick} {...props}>{children}</button>
    ),
    span: ({ children, initial, animate, exit, transition, ...props }: any) => (
      <span {...props}>{children}</span>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock the webhook service
vi.mock('../../services/webhookService', () => ({
  sendMessageToWebhook: vi.fn().mockResolvedValue({
    output: 'This is a test response from the AI.',
    suggestions: ['Suggestion 1', 'Suggestion 2'],
  }),
}));

// Mock constants
vi.mock('../../constants', () => ({
  INITIAL_GREETING: 'Hello! I am the AI assistant. How can I help you?',
}));

describe('ChatInterface', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when closed', () => {
    it('does not render when isOpen is false', () => {
      render(<ChatInterface isOpen={false} onClose={mockOnClose} />);

      expect(screen.queryByText('FARES_AI_MIND_CLONE')).not.toBeInTheDocument();
    });
  });

  describe('when open', () => {
    it('renders the chat interface header', () => {
      render(<ChatInterface isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('FARES_AI_MIND_CLONE')).toBeInTheDocument();
    });

    it('renders the neural connection status', () => {
      render(<ChatInterface isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('Neural Connection Stable')).toBeInTheDocument();
    });

    it('renders the initial greeting message', () => {
      render(<ChatInterface isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('Hello! I am the AI assistant. How can I help you?')).toBeInTheDocument();
    });

    it('renders the input field', () => {
      render(<ChatInterface isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders multiple buttons including submit', () => {
      render(<ChatInterface isOpen={true} onClose={mockOnClose} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);

      // Find the submit button
      const submitButton = buttons.find(btn => btn.getAttribute('type') === 'submit');
      expect(submitButton).toBeTruthy();
    });

    it('calls onClose when close button is clicked', () => {
      render(<ChatInterface isOpen={true} onClose={mockOnClose} />);

      // Find all buttons and get the one that's not the submit button
      const buttons = screen.getAllByRole('button');
      const closeButton = buttons.find(btn => btn.getAttribute('type') !== 'submit');

      if (closeButton) {
        fireEvent.click(closeButton);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      }
    });

    it('disables submit button when input is empty', () => {
      render(<ChatInterface isOpen={true} onClose={mockOnClose} />);

      const buttons = screen.getAllByRole('button');
      const submitButton = buttons.find(btn => btn.getAttribute('type') === 'submit');
      expect(submitButton).toBeDisabled();
    });

    it('enables submit button when input has text', async () => {
      const user = userEvent.setup();
      render(<ChatInterface isOpen={true} onClose={mockOnClose} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Hello');

      const buttons = screen.getAllByRole('button');
      const submitButton = buttons.find(btn => btn.getAttribute('type') === 'submit');
      expect(submitButton).not.toBeDisabled();
    });

    it('clears input after form submission', async () => {
      const user = userEvent.setup();
      render(<ChatInterface isOpen={true} onClose={mockOnClose} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Test message');

      const form = input.closest('form');
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(input).toHaveValue('');
      });
    });

    it('adds user message to chat after submission', async () => {
      const user = userEvent.setup();
      render(<ChatInterface isOpen={true} onClose={mockOnClose} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Test message');

      const form = input.closest('form');
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(screen.getByText('Test message')).toBeInTheDocument();
      });
    });
  });
});
