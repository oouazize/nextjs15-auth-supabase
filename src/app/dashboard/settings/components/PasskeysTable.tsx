'use client';

import { ColumnDef } from '@tanstack/react-table';
import DataTable from '~/core/ui/DataTable';
import { Passkey } from '../page';

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
