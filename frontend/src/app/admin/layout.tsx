import { AdminPortalBackground } from '@/components/admin/AdminPortalBackground';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <AdminPortalBackground />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

