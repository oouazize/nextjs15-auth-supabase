import getSupabaseRouteHandlerClient from '~/core/supabase/route-handler-client';
import { NextResponse } from 'next/server';
import {
  getRegistrationOptions,
  insertWebAuthnChallenge,
} from '~/lib/server/passkeys';

export async function POST() {
  console.log('POST /api/passkeys/challenge');
  const client = getSupabaseRouteHandlerClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  console.log('User:', user);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const options = await getRegistrationOptions(client, user);
  console.log('options:', options);

  await insertWebAuthnChallenge(client, {
    user_id: user.id,
    value: options.challenge,
  });
  return NextResponse.json(options, { status: 200 });
}
