import React from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
}

export interface WebhookResponse {
  reply: string;
}

export interface SocialLink {
  icon: React.ElementType;
  url: string;
  label: string;
}

export interface Tag {
  icon?: React.ElementType;
  label: string;
  color?: string;
}