'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import EmailPasswordSignUpContainer from '~/app/auth/components/EmailPasswordSignUpContainer';
import configuration from '~/configuration';
import EmailOtpContainer from '~/app/auth/components/EmailOtpContainer';
import Trans from '~/core/ui/Trans';

function SignUpMethodsContainer() {
  const router = useRouter();

  const onSignUp = useCallback(() => {
    const requireEmailConfirmation =
      configuration.auth.requireEmailConfirmation;

    // If the user is required to confirm their email, we show them a message
    if (requireEmailConfirmation) {
      return;
    }

    // Otherwise, we redirect them to the home page
    router.replace(configuration.paths.appHome);
  }, [router]);

  return (
    <>
      <EmailPasswordSignUpContainer onSignUp={onSignUp} />
      <div>
        <span className={'text-xs text-gray-400'}>
          <Trans i18nKey={'auth:orContinueWithEmail'} />
        </span>
      </div>
      <EmailOtpContainer shouldCreateUser={true} />
    </>
  );
}

export default SignUpMethodsContainer;
