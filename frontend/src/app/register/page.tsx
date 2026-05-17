import { AuthBrandShell } from '@/components/user-auth/AuthBrandShell';
import { RegisterForm } from '@/components/user-auth/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthBrandShell
      badge="New account"
      title="Create your profile"
      subtitle="Register for secure access to Banshee banking and services."
      footerNote="By registering you agree to platform terms. Access is subject to verification."
    >
      <RegisterForm variant="brand" />
    </AuthBrandShell>
  );
}
