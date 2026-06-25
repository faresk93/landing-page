export const AI_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;
export const NOTES_WEBHOOK_URL = import.meta.env.VITE_NOTES_WEBHOOK_URL;
// Salma's own loving "Habibi" bot — a dedicated n8n webhook that holds the
// OpenAI/ChatGPT key server-side (never exposed to the browser).
export const SALMA_CHAT_WEBHOOK_URL = import.meta.env.VITE_SALMA_CHAT_WEBHOOK_URL;

export const SOCIAL_LINKS = {
  LINKEDIN: "https://www.linkedin.com/in/fares-khiary",
  INSTAGRAM: "https://www.instagram.com/khiary.fares",
  GITHUB: "https://github.com/faresk93",
  EMAIL: "contact@fares-khiary.com"
};

export const INITIAL_GREETING = "Hello! I am Fares's AI assistant. Ask me anything about his background, skills, or projects.";
