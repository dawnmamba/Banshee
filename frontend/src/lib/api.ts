import { clearAuthToken, getAuthToken } from './auth';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export type HealthResponse = {
  status: string;
  timestamp: string;
  database?: string;
};

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
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
