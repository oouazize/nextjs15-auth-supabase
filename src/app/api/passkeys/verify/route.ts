import { NextRequest, NextResponse } from 'next/server';
import getSupabaseRouteHandlerClient from '~/core/supabase/route-handler-client';
import {
  deleteWebAuthnChallenge,
  getWebAuthnChallengeByUser,
  saveWebAuthnCredential,
} from '~/lib/server/passkeys';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import configuration from '~/configuration';
import { Database } from '~/database.types';

export async function POST(request: NextRequest) {
  const client = getSupabaseRouteHandlerClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  console.log('Get challenge of the user');
  const challenge = await getWebAuthnChallengeByUser(client, user.id);
  console.log('Challenge:', challenge);
  if (challenge) {
    await deleteWebAuthnChallenge(client, challenge.id);
  }

  const data = await request.json();
  console.log('Data:', data);
  const verification = await verifyRegistrationResponse({
    response: data,
    expectedChallenge: challenge?.value!,
    expectedOrigin: configuration.webauthn.relyingPartyOrigin!,
    expectedRPID: configuration.webauthn.relyingPartyID,
  });
  console.log('Verification:', verification);
  const { verified } = verification;
  if (!verified) {
    return NextResponse.json(
      { error: 'Could not verify passkey' },
      { status: 401 },
    );
  }

  const { registrationInfo } = verification;

  const values: Database['public']['Tables']['credentials']['Insert'] = {
    user_id: user.id,
    friendly_name: `Passkey created ${new Date().toLocaleString()}`,

    credential_type: registrationInfo?.credentialType!,
    credential_id: registrationInfo?.credential.id!,

    public_key: Buffer.from(registrationInfo?.credential.publicKey!).toString('base64'),
    aaguid: registrationInfo?.aaguid,
    sign_count: registrationInfo?.credential.counter!,

    transports: data.response.transports ?? [],
    user_verification_status: registrationInfo?.userVerified
      ? 'verified'
      : 'unverified',
    device_type:
      registrationInfo?.credentialDeviceType === 'singleDevice'
        ? 'single_device'
        : 'multi_device',
    backup_state: registrationInfo?.credentialBackedUp
      ? 'backed_up'
      : 'not_backed_up',
  };

  const { data: savedCredential } = await saveWebAuthnCredential(
    client,
    values,
  );
  console.log('Saved credential:', savedCredential);
  const passkeyDisplayData = {
    credential_id: savedCredential?.credential_id,
    friendly_name: savedCredential?.friendly_name,

    credential_type: savedCredential?.credential_type,
    device_type: savedCredential?.device_type,
    backup_state: savedCredential?.backup_state,

    created_at: savedCredential?.created_at,
    updated_at: savedCredential?.updated_at,
    last_used_at: savedCredential?.last_used_at,
  };

  return NextResponse.json(passkeyDisplayData, { status: 201 });
}
