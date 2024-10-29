import { createBrowserClient } from '@supabase/ssr';
import invariant from 'tiny-invariant';

let client: ReturnType<typeof createBrowserClient>;

/**
 * @name getSupabaseBrowserClient
 * @description Get a Supabase client for use in the Browser
 */
function getSupabaseBrowserClient() {
  if (client) {
    return client;
  }

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  invariant(SUPABASE_URL, `Supabase URL was not provided`);
  invariant(SUPABASE_ANON_KEY, `Supabase Anon key was not provided`);

  client = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  return client;
}

export default getSupabaseBrowserClient;
