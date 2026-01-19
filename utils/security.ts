/**
 * Utility for input sanitization to prevent XSS and other injection attacks.
 * Since this is a client-side application, we focus on cleaning user-provided strings
 * before sending them to APIs (Supabase or n8n).
 */
export const sanitizeInput = (input: string): string => {
    if (!input) return '';

    // Basic HTML escaping
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .trim();
};

/**
 * Simple client-side rate limiting to prevent spamming from individual users.
 * Uses localStorage to track timestamps of recent actions.
 * 
 * @param key Unique key for the action (e.g., 'notes_submission', 'chat_message')
 * @param limit Maximum number of actions allowed within the window
 * @param windowMs Time window in milliseconds
 * @returns { boolean } True if the action is allowed, false if rate limited
 */
export const checkRateLimit = (key: string, limit: number, windowMs: number): boolean => {
    try {
        if (typeof window === 'undefined' || !window.localStorage) {
            return true;
        }

        const storageKey = `rate_limit_${key}`;
        const now = Date.now();

        // Get existing timestamps
        const storedData = localStorage.getItem(storageKey);
        let timestamps: number[] = storedData ? JSON.parse(storedData) : [];

        // Filter out timestamps older than the window
        timestamps = timestamps.filter(ts => now - ts < windowMs);

        if (timestamps.length >= limit) {
            return false; // Rate limited
        }

        // Add current timestamp and save
        timestamps.push(now);
        localStorage.setItem(storageKey, JSON.stringify(timestamps));

        return true;
    } catch (e) {
        console.warn('Rate limiting failed due to storage error:', e);
        return true; // Default to allow action if storage fails
    }
};
