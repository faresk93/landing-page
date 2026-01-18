import { describe, it, expect } from 'vitest';
import { SOCIAL_LINKS, INITIAL_GREETING } from '../../constants';

describe('constants', () => {
  describe('SOCIAL_LINKS', () => {
    it('should have a valid LinkedIn URL', () => {
      expect(SOCIAL_LINKS.LINKEDIN).toMatch(/^https:\/\/www\.linkedin\.com\/in\/.+/);
    });

    it('should have a valid Instagram URL', () => {
      expect(SOCIAL_LINKS.INSTAGRAM).toMatch(/^https:\/\/www\.instagram\.com\/.+/);
    });

    it('should have a valid GitHub URL', () => {
      expect(SOCIAL_LINKS.GITHUB).toMatch(/^https:\/\/github\.com\/.+/);
    });

    it('should have a valid email address', () => {
      expect(SOCIAL_LINKS.EMAIL).toMatch(/^[\w.-]+@[\w.-]+\.\w+$/);
    });

    it('should contain all required social link keys', () => {
      expect(SOCIAL_LINKS).toHaveProperty('LINKEDIN');
      expect(SOCIAL_LINKS).toHaveProperty('INSTAGRAM');
      expect(SOCIAL_LINKS).toHaveProperty('GITHUB');
      expect(SOCIAL_LINKS).toHaveProperty('EMAIL');
    });
  });

  describe('INITIAL_GREETING', () => {
    it('should be a non-empty string', () => {
      expect(typeof INITIAL_GREETING).toBe('string');
      expect(INITIAL_GREETING.length).toBeGreaterThan(0);
    });

    it('should contain greeting-related content', () => {
      expect(INITIAL_GREETING.toLowerCase()).toContain('hello');
    });
  });
});
