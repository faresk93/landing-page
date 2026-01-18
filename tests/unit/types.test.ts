import { describe, it, expect } from 'vitest';
import type { ChatMessage, WebhookResponse, SocialLink, Tag } from '../../types';

describe('TypeScript Type Definitions', () => {
  describe('ChatMessage', () => {
    it('should accept valid ChatMessage objects', () => {
      const message: ChatMessage = {
        id: '123',
        role: 'user',
        text: 'Hello',
        timestamp: Date.now(),
      };

      expect(message.id).toBe('123');
      expect(message.role).toBe('user');
      expect(message.text).toBe('Hello');
      expect(typeof message.timestamp).toBe('number');
    });

    it('should accept ai role', () => {
      const message: ChatMessage = {
        id: '456',
        role: 'ai',
        text: 'Hello, how can I help?',
        timestamp: Date.now(),
      };

      expect(message.role).toBe('ai');
    });
  });

  describe('WebhookResponse', () => {
    it('should accept valid WebhookResponse objects', () => {
      const response: WebhookResponse = {
        reply: 'This is a response',
      };

      expect(response.reply).toBe('This is a response');
    });
  });

  describe('SocialLink', () => {
    it('should accept valid SocialLink objects', () => {
      const MockIcon = () => null;

      const link: SocialLink = {
        icon: MockIcon,
        url: 'https://example.com',
        label: 'Example',
      };

      expect(link.url).toBe('https://example.com');
      expect(link.label).toBe('Example');
      expect(link.icon).toBe(MockIcon);
    });
  });

  describe('Tag', () => {
    it('should accept Tag with all properties', () => {
      const MockIcon = () => null;

      const tag: Tag = {
        icon: MockIcon,
        label: 'TypeScript',
        color: 'blue',
      };

      expect(tag.label).toBe('TypeScript');
      expect(tag.color).toBe('blue');
    });

    it('should accept Tag with only required properties', () => {
      const tag: Tag = {
        label: 'React',
      };

      expect(tag.label).toBe('React');
      expect(tag.icon).toBeUndefined();
      expect(tag.color).toBeUndefined();
    });
  });
});
