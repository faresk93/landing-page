import { AI_WEBHOOK_URL } from '../constants';

export interface WebhookResponse {
  output: string;
  suggestions: string[];
}

export const sendMessageToWebhook = async (message: string): Promise<WebhookResponse> => {
  // Extra safety check: prevent ridiculously long messages
  if (message.length > 2000) {
    return {
      output: "Message exceeds neural processing capacity. Please keep it under 2000 characters.",
      suggestions: []
    };
  }

  try {
    // If no webhook is configured (default state), return a mock response for demo purposes
    if (!AI_WEBHOOK_URL.includes("n8n.fares-khiary.com")) {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      return {
        output: "I am a simulated AI response. Please configure the AI_WEBHOOK_URL in constants.ts to connect to your real backend!",
        suggestions: ["What's your background?", "Tell me about your projects", "How can I contact you?"]
      };
    }

    const url = new URL(AI_WEBHOOK_URL);
    url.searchParams.append('question', message);

    const response = await fetch(url.toString(), {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      output: data.output || "Message received, but format was unexpected.",
      suggestions: data.suggestions || []
    };

  } catch (error) {
    console.error("Failed to send message:", error);
    return {
      output: "Connection to Fares's neural network lost. Unable to retrieve data from his digital mind right now.",
      suggestions: []
    };
  }
};