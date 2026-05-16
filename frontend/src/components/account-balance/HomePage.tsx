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
    <div className="flex flex-1 flex-col bg-zinc-50 px-6 py-10 dark:bg-black sm:px-10">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {user ? `Welcome, ${user.firstName}` : 'Welcome'}
          </h1>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            Your banking overview at a glance.
          </p>
        </header>

        <AccountBalanceBanner />
      </div>
    </div>
  );
}
