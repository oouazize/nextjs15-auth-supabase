// src/app/auth/passkey/route.ts

import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import configuration from '~/configuration';
import getSupabaseRouteHandlerClient from '~/core/supabase/route-handler-client';
import { insertWebAuthnChallenge } from '~/lib/server/passkeys';

export async function POST() {
  const client = await getSupabaseRouteHandlerClient();
  console.log('Generating authentication options');
  const options = await generateAuthenticationOptions({
    rpID: configuration.webauthn.relyingPartyID!,
  });

  console.log('Store the challenge in DB: ', options);

  const { data: challenge } = await insertWebAuthnChallenge(client, {
    value: options.challenge,
  });

  console.log('Store the challenge ID in the session');

  // Store the challenge ID in the "session"
  const cookieStore = await cookies();
  cookieStore.set('webauthn_state', challenge?.id!, {
    httpOnly: true,
    sameSite: true,
    secure: !process.env.LOCAL,
  });

  return NextResponse.json(options, { status: 200 });
}
