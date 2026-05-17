'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Password } from 'primereact/password';
import { login } from '@/lib/api';
import { setAuthSession } from '@/lib/auth';
import { getRoleHomePath } from '@/lib/roles';
import {
  brandAuthPt,
  brandLabelClass,
  brandLinkClass,
  brandMutedTextClass,
  labelClass,
} from '@/lib/primereact/auth-pt';

type LoginFormProps = {
  variant?: 'default' | 'brand';
};

export function LoginForm({ variant = 'default' }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isBrand = variant === 'brand';
  const fieldLabelClass = isBrand ? brandLabelClass : labelClass;

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
    <div className="w-full space-y-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className={fieldLabelClass}>
            Email
          </label>
          {isBrand ? (
            <IconField>
              <InputIcon className="pi pi-envelope" />
              <InputText
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                pt={isBrand ? brandAuthPt.inputtext : undefined}
                required
              />
            </IconField>
          ) : (
            <InputText
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}
        </div>
        <div>
          <label htmlFor="password" className={fieldLabelClass}>
            Password
          </label>
          {isBrand ? (
            <IconField>
              <InputIcon className="pi pi-lock" />
              <Password
                inputId="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                feedback={false}
                toggleMask
                placeholder="••••••••"
                pt={brandAuthPt.password}
                required
                minLength={8}
              />
            </IconField>
          ) : (
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
          )}
        </div>
        <Button
          type="submit"
          label={loading ? 'Signing in…' : isBrand ? 'Sign in to portal' : 'Log in'}
          loading={loading}
          disabled={loading}
          pt={isBrand ? brandAuthPt.button : undefined}
        />
      </form>

      {error && (
        <Message
          severity="error"
          text={error}
          role="alert"
          pt={isBrand ? brandAuthPt.message : undefined}
        />
      )}

      <p className={isBrand ? brandMutedTextClass : 'text-center text-sm text-zinc-600 dark:text-zinc-400'}>
        No account?{' '}
        <Link href="/register" className={isBrand ? brandLinkClass : 'font-medium text-zinc-900 dark:text-zinc-50'}>
          Register
        </Link>
      </p>
    </div>
  );
}

