'use client';

import { AccountInfoSection } from './AccountInfoSection';
import { PersonalInfoSection } from './PersonalInfoSection';

const sectionShellClass =
  'w-full rounded-xl border border-zinc-200 bg-white p-6 lg:p-8 dark:border-zinc-800 dark:bg-zinc-950';

export function ProfilePage() {
  return (
    <main className="flex w-full flex-1 flex-col px-8 py-10">
      <div className="mx-auto flex w-full max-w-[75%] flex-col gap-8">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Profile
        </h1>
        <div className="flex w-full flex-col gap-8">
          <div className={sectionShellClass}>
            <AccountInfoSection />
          </div>
          <div className={sectionShellClass}>
            <PersonalInfoSection />
          </div>
        </div>
      </div>
    </main>
  );
}
