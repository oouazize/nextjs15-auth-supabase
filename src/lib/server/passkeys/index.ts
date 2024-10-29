import {
  startAuthentication,
  startRegistration,
} from '@simplewebauthn/browser';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { isoUint8Array } from '@simplewebauthn/server/helpers';
import { AuthenticatorTransportFuture } from '@simplewebauthn/types';
import { SupabaseClient } from '@supabase/supabase-js';
import configuration from '~/configuration';
import { Database } from '~/database.types';

export async function listWebAuthnCredentialsForUser(
  client: SupabaseClient<Database>,
  userId: string,
) {
  const { data: credentials, count } = await client
    .from('credentials')
    .select('*', { count: 'exact' })
    .eq('user_id', userId);
  return { credentials, count };
}

export async function getWebAuthnCredentialByCredentialId(
  client: SupabaseClient<Database>,
  credentialId: string,
) {
  const { data: credentials } = await client
    .from('credentials')
    .select('*')
    .eq('credential_id', credentialId)
    .maybeSingle();
  return credentials;
}

export async function updateWebAuthnCredentialByCredentialId(
  client: SupabaseClient<Database>,
  credentialId: string,
  updates: Partial<Database['public']['Tables']['credentials']['Insert']>,
) {
  await client
    .from('credentials')
    .update(updates)
    .eq('credential_id', credentialId);
}

export function insertWebAuthnChallenge(
  client: SupabaseClient<Database>,
  params: { user_id?: string; value: string },
) {
  return client.from('challenges').insert([params]).select('*').maybeSingle();
}

export async function getWebAuthnChallengeByUser(
  client: SupabaseClient<Database>,
  userId: string,
) {
  const { data: challenges } = await client
    .from('challenges')
    .select('*')
    .eq('user_id', userId)
    .single();
  return challenges;
}

export async function getWebAuthnChallenge(
  client: SupabaseClient<Database>,
  challengeId: string,
) {
  const { data: challenges } = await client
    .from('challenges')
    .select('*')
    .eq('id', challengeId)
    .maybeSingle();
  return challenges;
}

export async function deleteWebAuthnChallenge(
  client: SupabaseClient<Database>,
  challengeId: string,
) {
  await client.from('challenges').delete().eq('id', challengeId);
}

export async function getRegistrationOptions(
  client: SupabaseClient<Database>,
  user: any,
) {
  const { credentials } = await listWebAuthnCredentialsForUser(client, user.id);
  const options = await generateRegistrationOptions({
    rpName: configuration.webauthn.relyingPartyName!,
    rpID: configuration.webauthn.relyingPartyID!,
    userName: user.email,
    userID: isoUint8Array.fromASCIIString(user.id),
    userDisplayName: user.user_metadata.display_name,
    attestationType: 'none',
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
      authenticatorAttachment: 'platform',
    },
    excludeCredentials: credentials?.map((credential) => ({
      id: credential.credential_id,
      transports: credential.transports as AuthenticatorTransportFuture[],
    })),
  });
  return options;
}

export function saveWebAuthnCredential(
  client: SupabaseClient<Database>,
  credential: Database['public']['Tables']['credentials']['Insert'],
) {
  return client
    .from('credentials')
    .insert([credential])
    .select('*')
    .maybeSingle();
}

export async function createPasskey() {
  const options = await sendPOSTRequest('/api/passkeys/challenge');
  const credential = await startRegistration(options);
  const newPasskey = await sendPOSTRequest('/api/passkeys/verify', credential);
  if (!newPasskey) {
    throw new Error('No passkey returned from server');
  }
  return newPasskey;
}

async function sendPOSTRequest(url: string, data?: any) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data || ''),
  });
  if (!response.ok) {
    console.log('error ===>', response);
    throw new Error(`Failed to send POST request to ${url}`);
  }
  return await response.json();
}

export async function signInWithPasskey(useBrowserAutofill: boolean = false) {
  console.log('Signing in with passkey');
  const options = await sendPOSTRequest('/auth/passkey');
  console.log('Starting authentication');
  const authenticationResponse = await startAuthentication({
    optionsJSON: options,
    useBrowserAutofill,
  });
  console.log('Verifying authentication response', authenticationResponse);
  const { verified } = await sendPOSTRequest(
    '/auth/passkey/verify',
    authenticationResponse,
  );
  if (!verified) {
    throw new Error('Could not sign in with passkey');
  }
  return { verified };
}
