'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Password reset is handled on the forgot-password page (OTP + new password together).
// This page redirects there to avoid any broken direct links.
export default function AdminCreateNewPasswordPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/forgot-password');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="font-nunito text-gray-500">Redirecting...</p>
    </div>
  );
}
