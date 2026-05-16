import { RegisterForm } from '@/components/user-auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-black">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Create account
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Register to use Banshee
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
