'use client';

import React from 'react';
import useSignOut from '~/core/hooks/use-sign-out';
import Button from '~/core/ui/Button';
import Heading from '~/core/ui/Heading';

export default function PageHeader({ title }: { title: string }) {
  const signOut = useSignOut();

  return (
    <div className={'flex items-start justify-between p-container'}>
      <div
        className={
          'flex space-x-2 items-center lg:items-start lg:flex-col' +
          ' lg:space-x-0'
        }
      >
        <Heading type={3}>
          <span className={'flex items-center space-x-0.5 lg:space-x-2'}>
            <span className={'font-semibold dark:text-white'}>{title}</span>
          </span>
        </Heading>
      </div>
      <Button variant={'destructive'} onClick={signOut}>
        Sign Out
      </Button>
    </div>
  );
}
