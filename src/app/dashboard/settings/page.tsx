import { use } from 'react';

import { withI18n } from '~/i18n/with-i18n';

import Heading from '~/core/ui/Heading';
import If from '~/core/ui/If';
import { listWebAuthnCredentialsForUser } from '~/lib/server/passkeys';
import getSupabaseServerComponentClient from '~/core/supabase/server-component-client';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '~/database.types';
import CreatePasskeyButton from './components/createPasskeyButton';
import PasskeysTable from './components/PasskeysTable';

export const metadata = {
  title: 'Settings',
};

export type Passkey = {
  credential_id: string;
  friendly_name: string | null;
  credential_type: 'public-key';
  device_type: 'single_device' | 'multi_device';
  backup_state: 'not_backed_up' | 'backed_up';
  created_at: string;
  updated_at: string;
  last_used_at: string | null;
};

async function PasskeysPage() {
  const client = getSupabaseServerComponentClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  const { passkeys, count } = await loadData(client, user?.id!);

  return (
    <>
      <div className={'flex items-start justify-between p-container'}>
        <div
          className={
            'flex space-x-2 items-center lg:items-start lg:flex-col' +
            ' lg:space-x-0'
          }
        >
          <Heading type={3}>
            <span className={'flex items-center space-x-0.5 lg:space-x-2'}>
              <span className={'font-semibold dark:text-white'}>
                Manage your passkeys
              </span>
            </span>
          </Heading>
        </div>
      </div>
      <div className={'w-full px-container flex flex-col flex-1'}>
        <If condition={!count}>
          <PasskeysEmptyState />
        </If>

        <PasskeysTableContainer pageCount={count} passkeys={passkeys} />
      </div>
    </>
  );
}

async function loadData(client: SupabaseClient<Database>, userId: string) {
  const { credentials, count } = await listWebAuthnCredentialsForUser(
    client,
    userId,
  );
  const passkeys = credentials?.map((credential) => ({
    credential_id: credential.credential_id,
    friendly_name: credential.friendly_name,
    credential_type: credential.credential_type,
    device_type: credential.device_type,
    backup_state: credential.backup_state,
    created_at: credential.created_at,
    updated_at: credential.updated_at,
    last_used_at: credential.last_used_at,
  }));

  return {
    passkeys: passkeys!,
    count: count ?? 0,
  };
}

export default withI18n(PasskeysPage);

async function PasskeysTableContainer({
  passkeys,
  pageCount,
}: React.PropsWithChildren<{
  passkeys: Passkey[];
  pageCount: number;
}>) {
  return (
    <div className={'flex flex-col space-y-4'}>
      <div className={'flex space-x-4 justify-between items-center'}>
        <div className={'flex'}>
          <CreatePasskeyButton />
        </div>
      </div>

      <PasskeysTable pageCount={pageCount} passkeys={passkeys} />
    </div>
  );
}

function PasskeysEmptyState() {
  return (
    <div className={'flex flex-col space-y-8 p-4'}>
      <div className={'flex flex-col'}>
        <Heading type={2}>
          <span className={'font-semibold'}>
            Hey, it looks like you don&apos;t have any passkey yet... 🤔
          </span>
        </Heading>

        <Heading type={4}>
          Create your first paskkey by clicking on the button below
        </Heading>
      </div>
    </div>
  );
}
