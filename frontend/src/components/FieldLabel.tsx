import { labelClass, requiredMarkClass } from '@/lib/primereact/auth-pt';

type FieldLabelProps = {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
};

export function FieldLabel({ htmlFor, required, children }: FieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className={labelClass}>
      {children}
      {required ? (
        <span className={requiredMarkClass} aria-hidden="true">
          {' '}
          *
        </span>
      ) : null}
    </label>
  );
}
