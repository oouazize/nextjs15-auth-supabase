const production = process.env.NODE_ENV === 'production';

const configuration = {
  site: {
    name: 'Your product name',
    description: 'Your product description',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'site Name',
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