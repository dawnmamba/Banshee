'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { FieldLabel } from '@/components/FieldLabel';
import { fetchProfile, updateAccount } from '@/lib/api';
import { errorMessagePt, successMessagePt } from '@/lib/primereact/auth-pt';
import { ChangePasswordForm } from './ChangePasswordForm';

export function AccountInfoSection() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchProfile()
      .then((profile) => {
        if (!cancelled) {
          setFirstName(profile.firstName);
          setLastName(profile.lastName);
          setEmail(profile.email);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Could not load profile',
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const updated = await updateAccount({ firstName, lastName, email });
      setFirstName(updated.firstName);
      setLastName(updated.lastName);
      setEmail(updated.email);
      setSuccess('Account details saved');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save account');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading…</p>;
  }

  return (
    <section className="w-full space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Account info
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Details from your registration
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="profile-firstName" required>
              First name
            </FieldLabel>
            <InputText
              id="profile-firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <FieldLabel htmlFor="profile-lastName" required>
              Last name
            </FieldLabel>
            <InputText
              id="profile-lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <FieldLabel htmlFor="profile-email" required>
            Email
          </FieldLabel>
          <InputText
            id="profile-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          label={saving ? 'Saving…' : 'Save account'}
          loading={saving}
          disabled={saving}
        />
      </form>

      {success && (
        <Message severity="success" text={success} pt={successMessagePt} />
      )}
      {error && (
        <Message severity="error" text={error} role="alert" pt={errorMessagePt} />
      )}

      <div className="border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-50">
          Change password
        </h3>
        <div className="mt-4">
          <ChangePasswordForm />
        </div>
      </div>
    </section>
  );
}
