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
const requireSession = cache(
  async (client: SupabaseClient<Database>, verifyFromServer = true) => {
    const { data, error } = await client.auth.getSession();

    if (!data.session || error) {
      return redirectToSignIn(error);
    }

    if (verifyFromServer) {
      const { data: user, error } = await client.auth.getUser();

      if (!user || error) {
        redirectToSignIn(error, data.session?.user.id);
      }
    }

    return data.session;
  },
);

export default requireSession;

function redirectToSignIn(error: unknown, userId: Maybe<string> = undefined) {
  getLogger().info(
    { error, userId },
    `No session found. Redirecting to sign in page...`,
  );

  return redirect(configuration.paths.signIn);
}
