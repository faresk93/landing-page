import { SALMA_CHAT_WEBHOOK_URL } from '../constants';

/**
 * Habibi Bot — Salma's own little AI companion. 💖
 *
 * It talks to a dedicated n8n webhook (VITE_SALMA_CHAT_WEBHOOK_URL) where Fares
 * keeps the OpenAI/ChatGPT key safe, server-side, together with a loving
 * "Habibi" persona prompt. The key is NEVER shipped to the browser.
 *
 * If the webhook isn't configured yet (or the network hiccups), we still answer
 * with a warm little message from Fares so Salma is never left hanging.
 */

export interface SalmaChatResponse {
  output: string;
  /** Whether this came from the real AI (n8n) or the offline loving fallback. */
  source: 'ai' | 'fallback';
}

/** Sweet offline messages, signed Fares, used when n8n isn't reachable. */
const LOVING_FALLBACKS = [
  'Mon Habibi n’est pas connecté là, tout de suite… mais sache une chose : Fares pense à toi en ce moment même. 💖',
  'Je n’arrive pas à joindre mon cerveau numérique, mais mon cœur, lui, te répond toujours : je t’aime, Salma. 🌹',
  'Connexion perdue… sauf celle qui me lie à toi. Respire, souris, tu gères tout merveilleusement. 🫶',
  'Petit bug de mon côté, ya hayati. En attendant : tu es belle, brillante et aimée. — Fares 💌',
  'Je reviens dans un instant, le temps de me reconnecter. D’ici là, garde en tête que tu es mon plus beau projet. ✨',
];

function lovingFallback(): SalmaChatResponse {
  const output = LOVING_FALLBACKS[Math.floor(Math.random() * LOVING_FALLBACKS.length)];
  return { output, source: 'fallback' };
}

export const askHabibi = async (message: string): Promise<SalmaChatResponse> => {
  const trimmed = message.trim();
  if (!trimmed) {
    return { output: 'Dis-moi tout, Habibi… je t’écoute. 💕', source: 'fallback' };
  }
  if (trimmed.length > 2000) {
    return {
      output: 'Oups, c’est un peu long pour mon petit cœur numérique 😅 — raccourcis un peu et renvoie-moi ça ?',
      source: 'fallback',
    };
  }

  // No webhook configured → graceful loving fallback (still feels alive).
  if (!SALMA_CHAT_WEBHOOK_URL) {
    await new Promise((r) => setTimeout(r, 700));
    return lovingFallback();
  }

  try {
    const url = new URL(SALMA_CHAT_WEBHOOK_URL);
    url.searchParams.append('message', trimmed);
    url.searchParams.append('from', 'salma');

    const res = await fetch(url.toString(), { method: 'GET' });
    if (!res.ok) throw new Error(`Habibi webhook error: ${res.status} ${res.statusText}`);

    const data = await res.json();
    const output =
      data.output || data.reply || data.message || data.text || '';

    if (!output) return lovingFallback();
    return { output, source: 'ai' };
  } catch (error) {
    if (import.meta.env.DEV) console.error('askHabibi failed:', error);
    return lovingFallback();
  }
};
