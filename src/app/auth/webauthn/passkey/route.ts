import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import configuration from '~/configuration';
import getSupabaseRouteHandlerClient from '~/core/supabase/route-handler-client';
import { insertWebAuthnChallenge } from '~/lib/server/passkeys';

export async function POST() {
  const client = await getSupabaseRouteHandlerClient();
  const options = await generateAuthenticationOptions({
    rpID: configuration.webauthn.relyingPartyID!,
    userVerification: 'preferred',
    allowCredentials: [],
  });

  const { data: challenge } = await insertWebAuthnChallenge(client, {
    value: options.challenge,
  });

  // Store the challenge ID in the "session"
  const cookieStore = await cookies();
  cookieStore.set('webauthn_state', challenge?.id!, {
    httpOnly: true,
    sameSite: true,
    secure: process.env.NODE_ENV === 'production',
  });

  return NextResponse.json(options, { status: 200 });
}
