import { User } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import getSupabaseServerActionClient from '~/core/supabase/action-client';

const jwtSecret = process.env.SUPABASE_AUTH_JWT_SECRET!;
const jwtIssuer = process.env.SUPABASE_AUTH_JWT_ISSUER;

export function createWebAuthnAccessTokenForUser(user: User) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expirationTime = issuedAt + 3600; // 1 hour expiry
  const payload = {
    iss: jwtIssuer,
    sub: user.id,
    aud: 'authenticated',
    exp: expirationTime,
    iat: issuedAt,

    email: user.email,
    phone: user.phone,
    app_metadata: user.app_metadata,
    user_metadata: user.user_metadata,
    role: 'authenticated',
    is_anonymous: false,
  };

  return jwt.sign(payload, jwtSecret, {
    algorithm: 'HS256',
    header: {
      alg: 'HS256',
      typ: 'JWT',
    },
  });
}

export async function createWebAuthnSessionforUser(user: User) {
  const accessToken = createWebAuthnAccessTokenForUser(user);

  const supabase = getSupabaseServerActionClient();
  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: '', // dummy value
  });
  if (error) {
    throw error;
  }
}
