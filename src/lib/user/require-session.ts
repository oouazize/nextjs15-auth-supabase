import { cache } from 'react';
import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';

import configuration from '~/configuration';
import { Database } from '~/database.types';
import getLogger from '~/core/logger';

/**
 * @name requireSession
 * @description Require a session to be present in the request
 * @param client
 * @param verifyFromServer
 */
const requireSession = cache(async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.auth.getUser();

  if (!data.user || error) {
    return redirectToSignIn(error);
  }

  return data.user;
});

export default requireSession;

function redirectToSignIn(error: unknown, userId: Maybe<string> = undefined) {
  getLogger().info(
    { error, userId },
    `No session found. Redirecting to sign in page...`,
  );

  return redirect(configuration.paths.signIn);
}
