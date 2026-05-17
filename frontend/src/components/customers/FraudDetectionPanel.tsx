'use client';

import { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import { runFraudAnalysis, type FraudAnalysisResponse } from '@/lib/api';
import { fraudDialogPt, historySearchButtonPt } from '@/lib/primereact/auth-pt';

type FraudDetectionPanelProps = {
  hasCustomers: boolean;
};

function riskLabel(riskLevel: FraudAnalysisResponse['riskLevel']): string {
  return `${riskLevel.charAt(0).toUpperCase()}${riskLevel.slice(1)} risk`;
}

export function FraudDetectionPanel({ hasCustomers }: FraudDetectionPanelProps) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FraudAnalysisResponse | null>(null);

  async function handleDetectFraud() {
    setVisible(true);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await runFraudAnalysis();
      setResult(analysis);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Fraud analysis failed',
      );
    } finally {
      setLoading(false);
    }
  }

  function handleHide() {
    if (loading) {
      return;
    }
    setVisible(false);
    setError(null);
    setResult(null);
  }

  return (
    <>
      <Button
        type="button"
        label="Detect fraud"
        aria-label="Detect fraud"
        disabled={!hasCustomers}
        pt={historySearchButtonPt}
        onClick={() => void handleDetectFraud()}
      />

      <Dialog
        header="Fraud analysis"
        visible={visible}
        modal
        dismissableMask={!loading}
        closable={!loading}
        draggable={false}
        resizable={false}
        pt={fraudDialogPt}
        onHide={handleHide}
      >
        {loading && (
          <p className="text-zinc-600 dark:text-zinc-400" role="status">
            Analyzing imported customers with Azure AI…
          </p>
        )}

        {!loading && error && (
          <Message severity="error" text={error} role="alert" />
        )}

        {!loading && result && (
          <FraudAnalysisResult result={result} />
        )}
      </Dialog>
    </>
  );
}

function FraudAnalysisResult({ result }: { result: FraudAnalysisResponse }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <p className="font-medium text-zinc-900 dark:text-zinc-50">
          {riskLabel(result.riskLevel)}
        </p>
        <p className="text-zinc-700 dark:text-zinc-300">
          Fraud detected: {result.fraudDetected ? 'Yes' : 'No'}
        </p>
      </div>

      {result.flaggedCustomers.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">No customers flagged.</p>
      ) : (
        <div className="space-y-2">
          <h4 className="font-medium text-zinc-900 dark:text-zinc-50">
            Flagged customers
          </h4>
          <ul className="list-disc space-y-1 pl-5">
            {result.flaggedCustomers.map((item) => (
              <li key={item.customerId}>
                <span className="font-mono text-xs">{item.customerId}</span>
                {' — '}
                {item.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      <FraudNarrative narrative={result.narrative} />
    </div>
  );
}

function FraudNarrative({ narrative }: { narrative: string }) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium text-zinc-900 dark:text-zinc-50">Analysis</h4>
      <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
        {narrative}
      </p>
    </div>
  );
}
