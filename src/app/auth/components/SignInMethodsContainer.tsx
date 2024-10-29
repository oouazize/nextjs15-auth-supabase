'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import EmailPasswordSignInContainer from '~/app/auth/components/EmailPasswordSignInContainer';
import EmailLinkAuth from '~/app/auth/components/EmailLinkAuth';

import configuration from '~/configuration';
import Trans from '~/core/ui/Trans';
import PasskeySignInContainer from './PasskeySignInContainer';

function SignInMethodsContainer() {
  const router = useRouter();

  const onSignIn = useCallback(() => {
    router.replace(configuration.paths.appHome);
  }, [router]);

  return (
    <>
      <PasskeySignInContainer />
      <div>
        <span className={'text-xs text-gray-400'}>
          <Trans i18nKey={'auth:orContinueWithEmail'} />
        </span>
      </div>
      <EmailPasswordSignInContainer onSignIn={onSignIn} />
      <div>
        <span className={'text-xs text-gray-400'}>
          <Trans i18nKey={'auth:orContinueWithEmail'} />
        </span>
      </div>
      <EmailLinkAuth />
    </>
  );
}

export default SignInMethodsContainer;
