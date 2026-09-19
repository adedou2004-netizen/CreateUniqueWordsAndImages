import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://dbqrenlvinqheyjppxby.supabase.co';

const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    'sb_publishable__twdY8fk0pZo7dU-BNDwWg_0-JQ1BjJ';

if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error('Missing Supabase public configuration');
}

// This browser client intentionally uses only a publishable key.
// Never put a Supabase service-role key in a NEXT_PUBLIC_* environment variable.
export const supabase = createClient(supabaseUrl, supabasePublishableKey);
