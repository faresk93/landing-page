import { supabase } from '../services/supabase';

/**
 * Fetches the latest Instagram follower count via a Supabase Edge Function.
 * The Edge Function handles the Instagram Graph API call using the access token.
 */
export const fetchInstagramFollowers = async (): Promise<number | null> => {
    try {
        const { data, error } = await supabase.functions.invoke('get-instagram-followers');

        if (error) {
            console.error('Error invoking Supabase Edge Function:', error);
            return null;
        }

        // Expecting the edge function to return { followers_count: number }
        return data?.followers_count || null;
    } catch (error) {
        console.error('Unexpected error in fetchInstagramFollowers:', error);
        return null;
    }
};
