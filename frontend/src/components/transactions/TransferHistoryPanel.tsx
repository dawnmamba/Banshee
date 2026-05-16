'use client';

import { DUMMY_TRANSFER_HISTORY } from './dummy-transfer-history';
import { TransferHistoryBanner } from './TransferHistoryBanner';

export function TransferHistoryPanel() {
  return (
    <div className="space-y-4" aria-label="Transfer history">
      {DUMMY_TRANSFER_HISTORY.map((record) => (
        <TransferHistoryBanner key={record.id} record={record} />
      ))}
    </div>
  );
}
