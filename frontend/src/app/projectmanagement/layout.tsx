
'use client';

import DashboardLayout from '@/components/DashboardLayout';

export default function ProjectManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
