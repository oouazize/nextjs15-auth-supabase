'use client';

import { ColumnDef } from '@tanstack/react-table';
import DataTable from '~/core/ui/DataTable';
import { Passkey } from '../page';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/core/ui/Dropdown';
import IconButton from '~/core/ui/IconButton';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import Button from '~/core/ui/Button';
import Modal from '~/core/ui/Modal';
import { deleteWebAuthnCredentialByCredentialId } from '~/lib/server/passkeys';
import getSupabaseBrowserClient from '~/core/supabase/browser-client';
import { useRouter } from 'next/navigation';

function PasskeysTable(
  props: React.PropsWithChildren<{
    pageCount: number;
    passkeys: Passkey[];
  }>,
) {
  let TABLE_COLUMNS: ColumnDef<Passkey>[] = [
    {
      header: 'passkeys',
      cell: ({ row }) => {
        const passkey = row.original;

        return <span>{passkey.credential_id}</span>;
      },
    },
    {
      header: 'Friendly Name',
      cell: ({ row }) => {
        const passkey = row.original;

        return <span>{passkey.friendly_name}</span>;
      },
    },
    {
      header: 'credential Type',
      cell: ({ row }) => {
        const passkey = row.original;
        return <span>{passkey.credential_type}</span>;
      },
    },
    {
      header: 'device Type',
      cell: ({ row }) => {
        const passkey = row.original;
        return <span>{passkey.device_type}</span>;
      },
    },
    {
      header: 'Backup State',
      cell: ({ row }) => {
        const passkey = row.original;
        return <span>{passkey.backup_state}</span>;
      },
    },
    {
      header: 'Last Used At',
      cell: ({ row }) => {
        const passkey = row.original;
        return <span>{passkey.last_used_at ?? '-'}</span>;
      },
    },
    {
      header: 'Action',
      id: 'actions',
      cell: ({ row }) => {
        const passkey = row.original;

        return (
          <div className={'flex justify-end'}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton>
                  <EllipsisVerticalIcon className="w-5" />
                </IconButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                collisionPadding={{
                  right: 20,
                }}
              >
                <DeletePasskeyMenuItem passkey={passkey} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      pageCount={props.pageCount}
      pageSize={props.pageCount}
      data={props.passkeys}
      columns={TABLE_COLUMNS}
    />
  );
}

export default PasskeysTable;

function DeletePasskeyMenuItem({ passkey }: { passkey: Passkey }) {
  const [open, setOpen] = useState(false);
  const client = getSupabaseBrowserClient();
  const router = useRouter();

  return (
    <>
      <ConfirmDeletePasskeyModal
        open={open}
        setOpen={setOpen}
        onConfirm={async () => {
          await deleteWebAuthnCredentialByCredentialId(
            client,
            passkey.credential_id,
          );
          router.refresh();

          setOpen(false);
        }}
      />

      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        <span className={'text-red-500'}>Delete Passkey</span>
      </DropdownMenuItem>
    </>
  );
}

function ConfirmDeletePasskeyModal({
  open,
  setOpen,
  onConfirm,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Modal heading={`Deleting Passkey`} setIsOpen={setOpen} isOpen={open}>
      <div className={'flex flex-col space-y-4'}>
        <div className={'text-sm flex flex-col space-y-2'}>
          <p>You are about to delete the passkey</p>

          <p>Do you want to continue?</p>
        </div>

        <div className={'flex justify-end space-x-2'}>
          <Button variant={'destructive'} onClick={onConfirm}>
            Yep, delete passkey
          </Button>
        </div>
      </div>
    </Modal>
  );
}
