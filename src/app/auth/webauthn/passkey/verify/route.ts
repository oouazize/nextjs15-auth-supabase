import {
  verifyAuthenticationResponse,
  VerifyAuthenticationResponseOpts,
} from '@simplewebauthn/server';
import {
  AuthenticationResponseJSON,
  AuthenticatorTransportFuture,
} from '@simplewebauthn/types';
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

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const client = getSupabaseRouteHandlerClient({ admin: true });
  const challengeID = cookieStore.get('webauthn_state')?.value;
  const challenge = await getWebAuthnChallenge(client, challengeID!);
  await deleteWebAuthnChallenge(client, challengeID!);

  const data = await request.json();
  const credential = await getWebAuthnCredentialByCredentialId(client, data.id);
  if (!credential) {
    return NextResponse.json(
      { error: 'Could not sign in with passkey' },
      { status: 401 },
    );
  }

  const params: VerifyAuthenticationResponseOpts = {
    response: data,
    expectedChallenge: challenge?.value!,
    expectedOrigin: configuration.webauthn.relyingPartyOrigin!,
    expectedRPID: configuration.webauthn.relyingPartyID!,
    credential: {
      id: credential.credential_id,
      publicKey: new Uint8Array(Buffer.from(credential.public_key, 'base64')),
      counter: credential.sign_count,
      transports:
        credential.transports as unknown as AuthenticatorTransportFuture[],
    },
    requireUserVerification: false,
  };
  const verification = await verifyAuthenticationResponse(params);

  const { verified } = verification;

  const {
    data: { user },
  } = await client.auth.admin.getUserById(credential.user_id);

  if (verified) {
    await updateWebAuthnCredentialByCredentialId(
      client,
      credential.credential_id,
      {
        sign_count: verification.authenticationInfo.newCounter,
        last_used_at: new Date().toISOString(),
      },
    );
  }
  return NextResponse.json({ ...verification, user }, { status: 200 });
}
