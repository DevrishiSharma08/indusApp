
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProjectManagementPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/projectmanagement/dashboard');
  }, [router]);

  return null;
}
