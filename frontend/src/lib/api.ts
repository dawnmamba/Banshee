import { clearAuthToken, getAuthToken } from './auth';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export type HealthResponse = {
  status: string;
  timestamp: string;
  database?: string;
};

import type { UserRole } from './roles';

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
};

export type UserProfile = AuthUser & {
  accountNumber: string | null;
  nic: string | null;
  address: string | null;
  mobile: string | null;
  landline: string | null;
  secondaryEmail: string | null;
};

export type UpdateAccountInput = {
  firstName: string;
  lastName: string;
  email: string;
};

export type UpdatePersonalInput = {
  accountNumber: string;
  nic: string;
  address?: string;
  mobile?: string;
  landline?: string;
  secondaryEmail?: string;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
};

async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  auth = true,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string> | undefined),
  };

  if (auth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function fetchHealth(): Promise<HealthResponse> {
  return apiFetch<HealthResponse>('/health', { cache: 'no-store' }, false);
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  return apiFetch<AuthResponse>(
    '/auth/register',
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
    false,
  );
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    },
    false,
  );
}

export async function logout(): Promise<{ ok: true }> {
  try {
    return await apiFetch<{ ok: true }>(
      '/auth/logout',
      { method: 'POST' },
      false,
    );
  } finally {
    clearAuthToken();
  }
}

export async function fetchMe(): Promise<AuthUser> {
  return apiFetch<AuthUser>('/auth/me');
}

export async function fetchProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>('/profile');
}

export async function updateAccount(
  input: UpdateAccountInput,
): Promise<UserProfile> {
  return apiFetch<UserProfile>('/profile/account', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function updatePersonal(
  input: UpdatePersonalInput,
): Promise<UserProfile> {
  return apiFetch<UserProfile>('/profile/personal', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function changePassword(
  input: ChangePasswordInput,
): Promise<{ ok: true }> {
  return apiFetch<{ ok: true }>('/profile/change-password', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

async function parseApiErrorMessage(res: Response): Promise<string> {
  const text = await res.text();
  try {
    const json = JSON.parse(text) as {
      message?: string | string[];
    };
    if (Array.isArray(json.message)) {
      return json.message.join(', ');
    }
    if (typeof json.message === 'string') {
      return json.message;
    }
  } catch {
    /* use raw text */
  }
  return text || `HTTP ${res.status}`;
}

export async function fetchAccountBalance(): Promise<AccountBalanceResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/account/balance`, {
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    const message = await parseApiErrorMessage(res);
    if (
      res.status === 400 &&
      message.toLowerCase().includes('account number in profile')
    ) {
      throw new AccountBalanceError(message, 'missing_account');
    }
    throw new AccountBalanceError(
      message || 'Unable to retrieve account balance. Please try again.',
      'unavailable',
    );
  }

  return res.json() as Promise<AccountBalanceResponse>;
}

export type AccountBalanceResponse = {
  formattedBalance: string;
  currency: string;
  ledgerBalance: string;
};

export class AccountBalanceError extends Error {
  constructor(
    message: string,
    readonly kind: 'missing_account' | 'unavailable',
  ) {
    super(message);
    this.name = 'AccountBalanceError';
  }
}

export type TransactionHistoryItem = {
  id: string;
  postingDate: string;
  displayDate: string;
  formattedAmount: string;
  currency: string;
  transactionName: string;
  statusLabel: string;
  reference: string | null;
  summary: string;
  isDebit: boolean;
};

export type TransactionHistoryResponse = {
  dateFrom: string;
  dateTo: string;
  transactions: TransactionHistoryItem[];
};

export class TransactionHistoryError extends Error {
  constructor(
    message: string,
    readonly kind: 'missing_account' | 'unavailable' | 'invalid_range',
  ) {
    super(message);
    this.name = 'TransactionHistoryError';
  }
}

export async function fetchTransactionHistory(
  startDate: string,
  endDate: string,
): Promise<TransactionHistoryResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const params = new URLSearchParams({ startDate, endDate });
  const res = await fetch(`${API_BASE_URL}/transactions/history?${params}`, {
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    const message = await parseApiErrorMessage(res);
    if (
      res.status === 400 &&
      message.toLowerCase().includes('account number in profile')
    ) {
      throw new TransactionHistoryError(message, 'missing_account');
    }
    if (
      res.status === 400 &&
      message.toLowerCase().includes('start date must be')
    ) {
      throw new TransactionHistoryError(message, 'invalid_range');
    }
    throw new TransactionHistoryError(
      message || 'Unable to retrieve transaction history. Please try again.',
      'unavailable',
    );
  }

  return res.json() as Promise<TransactionHistoryResponse>;
}

export type WelcomeResponse = {
  message: string;
};

export async function postWelcome(
  firstName: string,
  lastName: string,
): Promise<WelcomeResponse> {
  return apiFetch<WelcomeResponse>('/welcome', {
    method: 'POST',
    body: JSON.stringify({ firstName, lastName }),
  });
}

export type AdminUserListItem = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  accountNumber: string | null;
  nic: string | null;
  mobile: string | null;
  createdAt: string;
};

export type AdminUsersResponse = {
  users: AdminUserListItem[];
};

export async function fetchAdminUsers(
  search?: string,
): Promise<AdminUsersResponse> {
  const params = search?.trim()
    ? `?${new URLSearchParams({ search: search.trim() })}`
    : '';
  return apiFetch<AdminUsersResponse>(`/admin/users${params}`);
}

export async function updateAdminUserRole(
  userId: string,
  role: UserRole,
): Promise<AdminUserListItem> {
  return apiFetch<AdminUserListItem>(`/admin/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
}

export type AdminDashboardStats = {
  totalUsers: number;
  adminCount: number;
  userCount: number;
};

export type AdminDashboardResponse = {
  message: string;
  stats: AdminDashboardStats;
};

export async function fetchAdminDashboard(): Promise<AdminDashboardResponse> {
  return apiFetch<AdminDashboardResponse>('/admin/dashboard');
}

export type TransactionImportResult = {
  customerCount: number;
  transactionCount: number;
};

export type TransactionImportSummaryRow = {
  customerId: string;
  accountShortName: string;
  accountBranch: string;
  currency: string;
  availableBalance: string;
  transactionCount: number;
};

export type ImportedCustomerTransaction = {
  uniqueKey: string;
  postingDate: string;
  transactionCodeName: string;
  postingAmount: string;
  runningBalance: string;
};

export async function importTransactionHistory(
  payload: unknown,
): Promise<TransactionImportResult> {
  return apiFetch<TransactionImportResult>('/customers/import', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchTransactionImportSummary(): Promise<
  TransactionImportSummaryRow[]
> {
  return apiFetch<TransactionImportSummaryRow[]>(
    '/customers/summary',
  );
}

export async function fetchImportedCustomerTransactions(
  customerId: string,
): Promise<ImportedCustomerTransaction[]> {
  return apiFetch<ImportedCustomerTransaction[]>(
    `/customers/${encodeURIComponent(customerId)}/transactions`,
  );
}
