import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';

import getLogger from '~/core/logger';
import configuration from '~/configuration';
import getSupabaseRouteHandlerClient from '~/core/supabase/route-handler-client';

export async function GET(request: NextRequest) {
  console.log('GET request');
  const requestUrl = new URL(request.url);
  const logger = getLogger();
  const searchParams = requestUrl.searchParams;

  const authCode = searchParams.get('code');
  const error = searchParams.get('error');
  const nextUrl = searchParams.get('next') ?? configuration.paths.appHome;

  let userId: Maybe<string> = undefined;

  if (authCode) {
    const client = getSupabaseRouteHandlerClient();

    try {
      const { error, data } =
        await client.auth.exchangeCodeForSession(authCode);

      // if we have an error, we redirect to the error page
      if (error) {
        return onError({ error: error.message });
      }

      userId = data.user.id;
    } catch (error) {
      logger.error(
        {
          error,
        },
        `An error occurred while exchanging code for session`,
      );

      const message = error instanceof Error ? error.message : error;

      return onError({ error: message as string });
    }
  }

  if (error) {
    return onError({ error });
  }

  return redirect(nextUrl);
}

function onError({ error }: { error: string }) {
  const errorMessage = getAuthErrorMessage(error);

  getLogger().error(
    {
      error,
    },
    `An error occurred while signing user in`,
  );

  const redirectUrl = `${configuration.paths.authCallback}/error?error=${errorMessage}`;

  return redirect(redirectUrl);
}

/**
 * Checks if the given error message indicates a verifier error.
 * We check for this specific error because it's highly likely that the
 * user is trying to sign in using a different browser than the one they
 * used to request the sign in link. This is a common mistake, so we
 * want to provide a helpful error message.
 */
function isVerifierError(error: string) {
  return error.includes('both auth code and code verifier should be non-empty');
}

function getAuthErrorMessage(error: string) {
  return isVerifierError(error)
    ? `auth:errors.codeVerifierMismatch`
    : `auth:authenticationErrorAlertBody`;
}
