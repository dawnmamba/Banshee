import { WelcomeForm } from '@/components/welcome-message/WelcomeForm';

export default function WelcomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Welcome
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Enter your name to receive a personalized greeting.
        </p>
      </div>
      <WelcomeForm />
    </div>
  );
}
