'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';

/**
 * Layout para rutas protegidas (/registrar/*)
 */
export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login');
    }
  }, [router]);

  if (!isLoggedIn()) {
    return null;
  }

  return <>{children}</>;
}
