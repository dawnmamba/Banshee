'use client';

import { useEffect, useState } from 'react';
import { fetchMe, type AuthUser } from '@/lib/api';
import { AccountBalanceBanner } from './AccountBalanceBanner';

export function HomePage() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    void fetchMe()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <div className="mx-auto w-full max-w-3xl space-y-6 px-6 py-8">
        <AccountBalanceBanner />
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {user ? `Welcome, ${user.firstName}` : 'Welcome'}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Your banking overview at a glance.
          </p>
        </div>
      </div>
    </div>
  );
}
