export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export type HealthResponse = {
  status: string;
  timestamp: string;
};

export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE_URL}/health`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export type WelcomeResponse = {
  message: string;
};

export async function postWelcome(
  firstName: string,
  lastName: string,
): Promise<WelcomeResponse> {
  const res = await fetch(`${API_BASE_URL}/welcome`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json() as Promise<WelcomeResponse>;
}
