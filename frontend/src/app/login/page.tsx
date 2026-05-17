import { AuthBrandShell } from '@/components/user-auth/AuthBrandShell';
import { LoginForm } from '@/components/user-auth/LoginForm';

export default function LoginPage() {
  return (
    <AuthBrandShell
      badge="Secure sign in"
      title="Welcome back"
      subtitle="Sign in with your credentials to access your Banshee account."
    >
      <LoginForm variant="brand" />
    </AuthBrandShell>
  );
}
