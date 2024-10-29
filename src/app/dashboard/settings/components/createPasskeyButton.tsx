'use client';

import { PlusCircleIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { toast } from 'sonner';
import Button from '~/core/ui/Button';
import If from '~/core/ui/If';
import { createPasskey } from '~/lib/server/passkeys';

export default function CreatePasskeyButton() {
  const [creating, setCreating] = useState(false);

  const handleCreatePasskey = async () => {
    try {
      setCreating(true);
      const passkey = await createPasskey();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          toast.error('This request has been cancelled by the user.');
          return;
        }
        toast.error(error.message);
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <Button onClick={handleCreatePasskey}>
      <span className={'flex space-x-2 items-center'}>
        <If condition={!creating}>
          <PlusCircleIcon className={'w-4'} />
        </If>
        <span>{creating ? 'Creating...' : 'Create Passkey'}</span>
      </span>
    </Button>
  );
}
