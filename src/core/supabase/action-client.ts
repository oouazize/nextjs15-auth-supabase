import 'server-only';

import { cookies } from 'next/headers';

import { createClient } from '@supabase/supabase-js';

import { createServerClient } from '@supabase/ssr';

import { Database } from '~/database.types';
import getSupabaseClientKeys from './get-supabase-client-keys';

const keys = getSupabaseClientKeys();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function createServerSupabaseClient<
  GenericSchema extends Database = Database,
>() {
  return createServerClient<GenericSchema>(keys.url, keys.anonKey, {
    cookies: getCookiesStrategy(),
  });
}

/**
 * @name getSupabaseServerComponentClient
 * @deprecated Use `getSupabaseServerClient` instead.
 * @param params
 */
export default function getSupabaseServerActionClient<
  GenericSchema extends Database = Database,
>(params?: { admin: boolean }) {
  const keys = getSupabaseClientKeys();
  const admin = params?.admin ?? false;

  if (admin) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[Dev Only] This is a simple warning to let you know you are using the Supabase Service Role. Make sure it's the right call.`,
      );
    }
    return createClient<GenericSchema>(keys.url, serviceRoleKey, 
      {
      auth: {
        persistSession: false,
        detectSessionInUrl: false,
        autoRefreshToken: false,
      },
    });
  }

  return createServerSupabaseClient();
}

function getCookiesStrategy() {
  return {
    get: async (name: string) => {
      const cookieStore = await cookies();
      const cookie = cookieStore.get(name);

      return cookie?.value;
    },
    set: async (name: string, value: string, options: object) => {
      const cookieStore = await cookies();

      cookieStore.set({ name, value, ...options });
    },
    remove: async (name: string, options: object) => {
      const cookieStore = await cookies();

      cookieStore.set({
        name,
        value: '',
        ...options,
      });
    },
  };
}
