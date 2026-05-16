'use client';

import { FormEvent, useState } from 'react';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Password } from 'primereact/password';
import { FieldLabel } from '@/components/FieldLabel';
import { changePassword } from '@/lib/api';
import { errorMessagePt, successMessagePt } from '@/lib/primereact/auth-pt';

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await changePassword({ currentPassword, newPassword, confirmPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess('Password updated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not change password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div>
        <FieldLabel htmlFor="current-password" required>
          Current password
        </FieldLabel>
        <Password
          inputId="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          feedback={false}
          toggleMask
          required
          minLength={8}
        />
      </div>
      <div>
        <FieldLabel htmlFor="new-password" required>
          New password
        </FieldLabel>
        <Password
          inputId="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          feedback={false}
          toggleMask
          required
          minLength={8}
        />
      </div>
      <div>
        <FieldLabel htmlFor="confirm-password" required>
          Confirm password
        </FieldLabel>
        <Password
          inputId="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          feedback={false}
          toggleMask
          required
          minLength={8}
        />
      </div>
      <Button
        type="submit"
        label={loading ? 'Updating…' : 'Change password'}
        loading={loading}
        disabled={loading}
      />
      {success && (
        <Message severity="success" text={success} pt={successMessagePt} />
      )}
      {error && (
        <Message severity="error" text={error} role="alert" pt={errorMessagePt} />
      )}
    </form>
  );
}
