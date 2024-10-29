import 'server-only';

import { cookies } from 'next/headers';

import { createClient } from '@supabase/supabase-js';

import { createServerClient } from '@supabase/ssr';
import getSupabaseClientKeys from './get-supabase-client-keys';
import { Database } from '~/database.types';

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const keys = getSupabaseClientKeys();

/**
 * @name getSupabaseServerComponentClient
 * @description Get a Supabase client for use in the Server Components
 */
export default function getSupabaseServerComponentClient<
  GenericSchema = Database,
>(
  params = {
    admin: false,
  },
) {
  if (params.admin) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[Dev Only] This is a simple warning to let you know you are using the Supabase Service Role. Make sure it's the right call.`,
      );
    }
    return createClient<GenericSchema>(keys.url, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }

  return createServerClient<GenericSchema>(keys.url, keys.anonKey, {
    cookies: getCookiesStrategy(),
  });
}

function getCookiesStrategy() {
  return {
    get: async (name: string) => {
      const cookieStore = await cookies();

      return cookieStore.get(name)?.value;
    },
  };
}
