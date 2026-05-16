'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Message } from 'primereact/message';
import { FieldLabel } from '@/components/FieldLabel';
import { fetchProfile, updatePersonal } from '@/lib/api';
import { isValidSriLankaNic } from '@/lib/sri-lanka-nic';
import { errorMessagePt, successMessagePt } from '@/lib/primereact/auth-pt';

const NIC_ERROR =
  'NIC must be 9 digits followed by V or X, or a 12-digit number';

export function PersonalInfoSection() {
  const [accountNumber, setAccountNumber] = useState('');
  const [nic, setNic] = useState('');
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [landline, setLandline] = useState('');
  const [secondaryEmail, setSecondaryEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchProfile()
      .then((profile) => {
        if (!cancelled) {
          setAccountNumber(profile.accountNumber ?? '');
          setNic(profile.nic ?? '');
          setAddress(profile.address ?? '');
          setMobile(profile.mobile ?? '');
          setLandline(profile.landline ?? '');
          setSecondaryEmail(profile.secondaryEmail ?? '');
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

    if (!isValidSriLankaNic(nic)) {
      setError(NIC_ERROR);
      return;
    }

    setSaving(true);
    try {
      const updated = await updatePersonal({
        accountNumber,
        nic,
        address: address || undefined,
        mobile: mobile || undefined,
        landline: landline || undefined,
        secondaryEmail: secondaryEmail || undefined,
      });
      setAccountNumber(updated.accountNumber ?? '');
      setNic(updated.nic ?? '');
      setAddress(updated.address ?? '');
      setMobile(updated.mobile ?? '');
      setLandline(updated.landline ?? '');
      setSecondaryEmail(updated.secondaryEmail ?? '');
      setSuccess('Personal info saved');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save personal info');
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
          Personal info
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Banking and contact details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div>
          <FieldLabel htmlFor="account-number" required>
            Account number
          </FieldLabel>
          <InputText
            id="account-number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <FieldLabel htmlFor="nic" required>
            NIC
          </FieldLabel>
          <InputText
            id="nic"
            value={nic}
            onChange={(e) => setNic(e.target.value)}
            required
          />
        </div>
        <div>
          <FieldLabel htmlFor="address">Address</FieldLabel>
          <InputTextarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            autoResize
          />
        </div>

        <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <h3 className="mb-4 text-base font-medium text-zinc-900 dark:text-zinc-50">
            Contact details
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <FieldLabel htmlFor="mobile">Mobile</FieldLabel>
              <InputText
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            <div>
              <FieldLabel htmlFor="landline">Landline</FieldLabel>
              <InputText
                id="landline"
                value={landline}
                onChange={(e) => setLandline(e.target.value)}
              />
            </div>
            <div>
              <FieldLabel htmlFor="secondary-email">Secondary email</FieldLabel>
              <InputText
                id="secondary-email"
                type="email"
                value={secondaryEmail}
                onChange={(e) => setSecondaryEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          label={saving ? 'Saving…' : 'Save personal'}
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
    </section>
  );
}
