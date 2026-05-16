import Link from 'next/link';
import { BackendStatus } from '@/components/BackendStatus';

export const metadata = {
  title: 'Backend status | Banshee',
  description: 'Life check — backend and database connectivity',
};

export default function HealthPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <main className="flex w-full max-w-lg flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Backend status
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Backend and PostgreSQL connectivity
          </p>
        </div>

        <BackendStatus />

        <Link
          href="/"
          className="text-sm font-medium text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
        >
          Back to home
        </Link>
      </main>
    </div>
  );
}
