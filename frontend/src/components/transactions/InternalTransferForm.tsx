'use client';

import { FormEvent, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Message } from 'primereact/message';
import { FieldLabel } from '@/components/FieldLabel';
import { errorMessagePt, successMessagePt } from '@/lib/primereact/auth-pt';
import {
  TRANSFER_VALIDATED_MESSAGE,
  validateInternalTransfer,
} from './transfer-validation';

export function InternalTransferForm() {
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSuccess(null);

    const validationError = validateInternalTransfer({ toAccount, amount });
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSuccess(TRANSFER_VALIDATED_MESSAGE);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <FieldLabel htmlFor="internal-to-account" required>
          To account number
        </FieldLabel>
        <InputText
          id="internal-to-account"
          value={toAccount}
          onChange={(e) => setToAccount(e.target.value)}
          inputMode="numeric"
          autoComplete="off"
        />
      </div>
      <div>
        <FieldLabel htmlFor="internal-amount" required>
          Amount
        </FieldLabel>
        <InputText
          id="internal-amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
          autoComplete="off"
        />
      </div>
      <div>
        <FieldLabel htmlFor="internal-memo">Memo</FieldLabel>
        <InputTextarea
          id="internal-memo"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={3}
          autoResize
        />
      </div>
      <Button type="submit" label="Submit transfer" />
      {success && (
        <Message severity="success" text={success} pt={successMessagePt} />
      )}
      {error && (
        <Message severity="error" text={error} role="alert" pt={errorMessagePt} />
      )}
    </form>
  );
}
