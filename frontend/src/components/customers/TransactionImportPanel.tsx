'use client';

import { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { FileUpload, type FileUploadSelectEvent } from 'primereact/fileupload';
import { Message } from 'primereact/message';
import { importTransactionHistory } from '@/lib/api';
import { labelClass } from '@/lib/primereact/auth-pt';

type TransactionImportPanelProps = {
  onImported: () => void;
};

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function TransactionImportPanel({
  onImported,
}: TransactionImportPanelProps) {
  const fileUploadRef = useRef<FileUpload>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSelect(event: FileUploadSelectEvent) {
    const file = event.files[0] ?? null;
    setSelectedFile(file);
    setError(null);
    setSuccess(null);
  }

  async function handleImport() {
    if (!selectedFile) {
      setError('Choose a JSON file first.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const text = await readFileAsText(selectedFile);
      const payload = JSON.parse(text) as unknown;
      const result = await importTransactionHistory(payload);
      setSuccess(
        `Imported ${result.customerCount} customers and ${result.transactionCount} transactions.`,
      );
      setSelectedFile(null);
      fileUploadRef.current?.clear();
      onImported();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Import failed. Check the JSON file.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Import transaction history
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Upload a bank inquiry JSON file. This replaces all previously imported
          data.
        </p>
      </div>

      <div>
        <span className={labelClass}>JSON file</span>
        <FileUpload
          ref={fileUploadRef}
          mode="basic"
          name="inquiry"
          accept="application/json,.json"
          maxFileSize={10_000_000}
          chooseLabel="Choose JSON file"
          customUpload
          auto={false}
          onSelect={handleSelect}
        />
        {selectedFile && (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Selected: {selectedFile.name}
          </p>
        )}
      </div>

      <Button
        type="button"
        label={loading ? 'Importing…' : 'Import JSON'}
        loading={loading}
        disabled={loading || !selectedFile}
        onClick={() => void handleImport()}
      />

      {success && (
        <Message severity="success" text={success} role="status" />
      )}
      {error && <Message severity="error" text={error} role="alert" />}
    </section>
  );
}
