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

// Mock Background3D component
vi.mock('../../components/Background3D', () => ({
  Background3D: ({ showSolarSystem }: { showSolarSystem: boolean }) => (
    <div data-testid="background-3d" data-solar-system={showSolarSystem.toString()}>
      Background3D
    </div>
  ),
}));

// Mock ProfileCard component
vi.mock('../../components/ProfileCard', () => ({
  ProfileCard: ({ onEnterUniverse }: { onEnterUniverse: () => void }) => (
    <div data-testid="profile-card">
      <button onClick={onEnterUniverse} data-testid="enter-universe-btn">
        Enter Universe
      </button>
    </div>
  ),
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the main container', () => {
    render(<App />);

    expect(screen.getByTestId('background-3d')).toBeInTheDocument();
  });

  it('renders ProfileCard in initial view', () => {
    render(<App />);

    expect(screen.getByTestId('profile-card')).toBeInTheDocument();
  });

  it('does not show solar system initially', () => {
    render(<App />);

    const background = screen.getByTestId('background-3d');
    expect(background).toHaveAttribute('data-solar-system', 'false');
  });

  it('switches to solar system view when Enter Universe is clicked', async () => {
    render(<App />);

    const enterButton = screen.getByTestId('enter-universe-btn');
    fireEvent.click(enterButton);

    await waitFor(() => {
      const background = screen.getByTestId('background-3d');
      expect(background).toHaveAttribute('data-solar-system', 'true');
    });
  });

  it('hides ProfileCard when in solar system view', async () => {
    render(<App />);

    const enterButton = screen.getByTestId('enter-universe-btn');
    fireEvent.click(enterButton);

    await waitFor(() => {
      expect(screen.queryByTestId('profile-card')).not.toBeInTheDocument();
    });
  });

  it('shows back button when in solar system view', async () => {
    render(<App />);

    const enterButton = screen.getByTestId('enter-universe-btn');
    fireEvent.click(enterButton);

    await waitFor(() => {
      expect(screen.getByText(/BACK TO PROFILE/i)).toBeInTheDocument();
    });
  });

  it('returns to profile view when back button is clicked', async () => {
    render(<App />);

    // Go to solar system view
    const enterButton = screen.getByTestId('enter-universe-btn');
    fireEvent.click(enterButton);

    await waitFor(() => {
      expect(screen.getByText(/BACK TO PROFILE/i)).toBeInTheDocument();
    });

    // Click back button
    const backButton = screen.getByText(/BACK TO PROFILE/i);
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.getByTestId('profile-card')).toBeInTheDocument();
    });
  });
});
