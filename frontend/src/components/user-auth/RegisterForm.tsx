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
import { register } from '@/lib/api';
import { setAuthSession } from '@/lib/auth';
import { getRoleHomePath } from '@/lib/roles';
import {
  brandAuthPt,
  brandLabelClass,
  brandLinkClass,
  brandMutedTextClass,
  labelClass,
} from '@/lib/primereact/auth-pt';

type RegisterFormProps = {
  variant?: 'default' | 'brand';
};

export function RegisterForm({ variant = 'default' }: RegisterFormProps) {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isBrand = variant === 'brand';
  const fieldLabelClass = isBrand ? brandLabelClass : labelClass;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const data = await register({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });
      setAuthSession(data.accessToken, data.user.role);
      router.replace(getRoleHomePath(data.user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  const textField = (
    id: string,
    label: string,
    value: string,
    onChange: (v: string) => void,
    options: {
      type?: string;
      autoComplete?: string;
      icon?: string;
      placeholder?: string;
    },
  ) => (
    <div>
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      {isBrand && options.icon ? (
        <IconField>
          <InputIcon className={options.icon} />
          <InputText
            id={id}
            type={options.type ?? 'text'}
            autoComplete={options.autoComplete}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={options.placeholder}
            pt={brandAuthPt.inputtext}
            required
          />
        </IconField>
      ) : (
        <InputText
          id={id}
          type={options.type ?? 'text'}
          autoComplete={options.autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
        />
      )}
    </div>
  );

  return (
    <div className="w-full space-y-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {textField('firstName', 'First name', firstName, setFirstName, {
            autoComplete: 'given-name',
            icon: 'pi pi-user',
            placeholder: 'Jane',
          })}
          {textField('lastName', 'Last name', lastName, setLastName, {
            autoComplete: 'family-name',
            icon: 'pi pi-user',
            placeholder: 'Doe',
          })}
        </div>
        {textField('email', 'Email', email, setEmail, {
          type: 'email',
          autoComplete: 'email',
          icon: 'pi pi-envelope',
          placeholder: 'you@example.com',
        })}
        <div>
          <label htmlFor="password" className={fieldLabelClass}>
            Password
          </label>
          {isBrand ? (
            <IconField>
              <InputIcon className="pi pi-lock" />
              <Password
                inputId="password"
                autoComplete="new-password"
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              feedback={false}
              toggleMask
              required
              minLength={8}
            />
          )}
        </div>
        <div>
          <label htmlFor="confirmPassword" className={fieldLabelClass}>
            Confirm password
          </label>
          {isBrand ? (
            <IconField>
              <InputIcon className="pi pi-lock" />
              <Password
                inputId="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              inputId="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              feedback={false}
              toggleMask
              required
              minLength={8}
            />
          )}
        </div>
        <Button
          type="submit"
          label={
            loading
              ? 'Creating account…'
              : isBrand
                ? 'Create account'
                : 'Register'
          }
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

      <p
        className={
          isBrand
            ? brandMutedTextClass
            : 'text-center text-sm text-zinc-600 dark:text-zinc-400'
        }
      >
        Already have an account?{' '}
        <Link
          href="/login"
          className={
            isBrand ? brandLinkClass : 'font-medium text-zinc-900 dark:text-zinc-50'
          }
        >
          Log in
        </Link>
      </p>
    </div>
  );
}

