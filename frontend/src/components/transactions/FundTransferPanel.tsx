'use client';

import { SelectButton } from 'primereact/selectbutton';
import { useState } from 'react';
import { transactionsTabSelectPt } from '@/lib/primereact/auth-pt';
import { ExternalTransferForm } from './ExternalTransferForm';
import { InternalTransferForm } from './InternalTransferForm';

export type TransferType = 'internal' | 'external';

const TRANSFER_TYPE_OPTIONS: { label: string; value: TransferType }[] = [
  { label: 'Internal', value: 'internal' },
  { label: 'External', value: 'external' },
];

export function FundTransferPanel() {
  const [transferType, setTransferType] = useState<TransferType>('internal');

  return (
    <div className="space-y-6">
      <SelectButton
        pt={transactionsTabSelectPt}
        value={transferType}
        onChange={(e) => {
          if (e.value) {
            setTransferType(e.value);
          }
        }}
        options={TRANSFER_TYPE_OPTIONS}
        optionLabel="label"
        optionValue="value"
        aria-label="Transfer type"
        itemTemplate={(option: (typeof TRANSFER_TYPE_OPTIONS)[number]) => (
          <span className="text-sm font-medium">{option.label}</span>
        )}
      />

      {transferType === 'internal' ? (
        <InternalTransferForm />
      ) : (
        <ExternalTransferForm />
      )}
    </div>
  );
}
