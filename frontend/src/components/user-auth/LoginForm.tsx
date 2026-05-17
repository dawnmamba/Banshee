'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Password } from 'primereact/password';
import { login } from '@/lib/api';
import { setAuthSession } from '@/lib/auth';
import { getRoleHomePath } from '@/lib/roles';
import { labelClass } from '@/lib/primereact/auth-pt';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await login(email, password);
      setAuthSession(data.accessToken, data.user.role);
      router.replace(getRoleHomePath(data.user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <InputText
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <Password
            inputId="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            feedback={false}
            toggleMask
            required
            minLength={8}
          />
        </div>
        <Button
          type="submit"
          label={loading ? 'Signing in…' : 'Log in'}
          loading={loading}
          disabled={loading}
        />
      </form>

      {error && <Message severity="error" text={error} role="alert" />}

      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        No account?{' '}
        <Link href="/register" className="font-medium text-zinc-900 dark:text-zinc-50">
          Register
        </Link>
      </p>
    </div>
  );
}
