'use client';

import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';
import Button from '~/core/ui/Button';
import If from '~/core/ui/If';
import { createPasskey } from '~/lib/server/passkeys';

export default function CreatePasskeyButton() {
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const handleCreatePasskey = async () => {
    try {
      setCreating(true);
      const passkey = await createPasskey();
      toast.success('Passkey created successfully');
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
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
