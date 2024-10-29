import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { AuthenticatorTransportFuture } from '@simplewebauthn/types';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import configuration from '~/configuration';
import getSupabaseRouteHandlerClient from '~/core/supabase/route-handler-client';
import {
  deleteWebAuthnChallenge,
  getWebAuthnChallenge,
  getWebAuthnCredentialByCredentialId,
  updateWebAuthnCredentialByCredentialId,
} from '~/lib/server/passkeys';
import { sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const client = getSupabaseRouteHandlerClient();
  const challengeID = cookieStore.get('webauthn_state')?.value;
  console.log('Get challenge ID from cookies', challengeID);
  const challenge = await getWebAuthnChallenge(client, challengeID!);
  console.log('Get challenge from DB', challenge);
  await deleteWebAuthnChallenge(client, challengeID!);

  const data = await request.json();
  const credential = await getWebAuthnCredentialByCredentialId(client, data.id);
  console.log('Get credential from DB', credential);
  if (!credential) {
    return NextResponse.json(
      { error: 'Could not sign in with passkey' },
      { status: 401 },
    );
  }

  const verification = await verifyAuthenticationResponse({
    response: data,
    expectedChallenge: challenge?.value!,
    expectedOrigin: configuration.webauthn.relyingPartyOrigin!,
    expectedRPID: configuration.webauthn.relyingPartyID!,
    credential: {
      id: credential.credential_id,
      publicKey: credential.public_key as unknown as Uint8Array,
      counter: credential.sign_count,
      transports:
        credential.transports as unknown as AuthenticatorTransportFuture[],
    },
  });
  console.log('Verify authentication', verification);

  const { verified } = verification;

  if (verified) {
    await updateWebAuthnCredentialByCredentialId(
      client,
      credential.credential_id,
      {
        sign_count: verification.authenticationInfo.newCounter,
        last_used_at: sql`now()` as unknown as string,
      },
    );
  }
}
