import type { PropsWithChildren } from 'react';
import classNames from 'clsx';

import If from '~/core/ui/If';
import Spinner from '~/core/ui/Spinner';
import LogoImage from './Logo/LogoImage';

export default function LoadingOverlay({
  children,
  className,
  fullPage = true,
  displayLogo = false,
}: PropsWithChildren<{
  className?: string;
  fullPage?: boolean;
  displayLogo?: boolean;
}>) {
  return (
    <div
      className={classNames(
        'flex flex-col items-center justify-center space-y-4',
        className,
        {
          [`fixed top-0 left-0 z-[100] h-screen w-screen bg-background`]:
            fullPage,
        },
      )}
    >
      <If condition={displayLogo}>
        <div className={'my-2'}>
          <LogoImage />
        </div>
      </If>

      <Spinner className={'h-12 w-12 text-primary'} />

      <div>{children}</div>
    </div>
  );
}
