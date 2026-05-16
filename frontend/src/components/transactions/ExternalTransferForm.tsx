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
  validateExternalTransfer,
} from './transfer-validation';

export function ExternalTransferForm() {
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSuccess(null);

    const validationError = validateExternalTransfer({
      beneficiaryName,
      routingNumber,
      accountNumber,
      amount,
    });
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
        <FieldLabel htmlFor="external-beneficiary" required>
          Beneficiary name
        </FieldLabel>
        <InputText
          id="external-beneficiary"
          value={beneficiaryName}
          onChange={(e) => setBeneficiaryName(e.target.value)}
          autoComplete="name"
        />
      </div>
      <div>
        <FieldLabel htmlFor="external-routing" required>
          Routing number
        </FieldLabel>
        <InputText
          id="external-routing"
          value={routingNumber}
          onChange={(e) => setRoutingNumber(e.target.value)}
          inputMode="numeric"
          autoComplete="off"
        />
      </div>
      <div>
        <FieldLabel htmlFor="external-account" required>
          Account number
        </FieldLabel>
        <InputText
          id="external-account"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          inputMode="numeric"
          autoComplete="off"
        />
      </div>
      <div>
        <FieldLabel htmlFor="external-amount" required>
          Amount
        </FieldLabel>
        <InputText
          id="external-amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
          autoComplete="off"
        />
      </div>
      <div>
        <FieldLabel htmlFor="external-memo">Memo</FieldLabel>
        <InputTextarea
          id="external-memo"
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
