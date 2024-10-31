import getSupabaseRouteHandlerClient from '~/core/supabase/route-handler-client';
import { NextResponse } from 'next/server';
import {
  getRegistrationOptions,
  insertWebAuthnChallenge,
} from '~/lib/server/passkeys';

export async function POST() {
  const client = getSupabaseRouteHandlerClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: 'No User Found' }, { status: 404 });
  }
  const options = await getRegistrationOptions(client, user);

  await insertWebAuthnChallenge(client, {
    user_id: user.id,
    value: options.challenge,
  });
  return NextResponse.json(options, { status: 200 });
}
