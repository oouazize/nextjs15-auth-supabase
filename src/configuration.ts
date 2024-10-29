import { Provider } from '@supabase/supabase-js';

const production = process.env.NODE_ENV === 'production';

enum Themes {
  Light = 'light',
  Dark = 'dark',
}

const configuration = {
  site: {
    name: 'UnitFit - Your Personal Fitness Coach',
    description: 'Your Personal Fitness Coach',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'UnitFit',
    locale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
  },
  auth: {
    // ensure this is the same as your Supabase project. By default - it's true
    requireEmailConfirmation:
      process.env.NEXT_PUBLIC_REQUIRE_EMAIL_CONFIRMATION === 'true',
  },
  production,
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
  webauthn: {
    relyingPartyID: process.env.WEBAUTHN_RELYING_PARTY_ID,
    relyingPartyName: process.env.WEBAUTHN_RELYING_PARTY_NAME,
    relyingPartyOrigin: process.env.WEBAUTHN_RELYING_PARTY_ORIGIN,
  },
  paths: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    appPrefix: '/dashboard',
    appHome: '/dashboard',
    authCallback: '/auth/callback',
  },
};

export default configuration;

function getBoolean(value: unknown, defaultValue: boolean) {
  if (typeof value === 'string') {
    return value === 'true';
  }

  return defaultValue;
}
