export type TransferHistoryType = 'internal' | 'external';

export type TransferHistoryStatus = 'Completed' | 'Pending';

export type TransferHistoryRecord = {
  id: string;
  date: string;
  type: TransferHistoryType;
  amount: string;
  status: TransferHistoryStatus;
  summary: string;
};

export const DUMMY_TRANSFER_HISTORY: TransferHistoryRecord[] = [
  {
    id: 'th-1',
    date: 'May 15, 2026',
    type: 'internal',
    amount: '$150.00',
    status: 'Completed',
    summary: 'To account ••••3210',
  },
  {
    id: 'th-2',
    date: 'May 12, 2026',
    type: 'external',
    amount: '$500.00',
    status: 'Completed',
    summary: 'Jane Doe • Chase Bank',
  },
  {
    id: 'th-3',
    date: 'May 8, 2026',
    type: 'internal',
    amount: '$75.25',
    status: 'Pending',
    summary: 'To account ••••9044',
  },
  {
    id: 'th-4',
    date: 'May 2, 2026',
    type: 'external',
    amount: '$1,200.00',
    status: 'Completed',
    summary: 'Acme Corp • Wells Fargo',
  },
];
