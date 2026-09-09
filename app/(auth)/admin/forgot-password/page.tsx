'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function AdminForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f9fb] p-1 sm:p-4">
      <div className="grid min-h-[calc(100vh-8px)] w-full max-w-[1060px] overflow-hidden bg-white shadow-sm md:min-h-[500px] md:grid-cols-2 md:rounded-none">

        {/* ── Left image panel ── */}
        <div className="relative hidden min-h-[500px] md:block">
          <Image src="/Images/Signup.jpg" alt="Forgot password" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-x-8 bottom-28 text-center lg:bottom-24">
            <p className="font-poppins text-4xl font-semibold leading-tight text-white drop-shadow-lg lg:text-5xl">
              Reset your<br />Password
            </p>
          </div>
        </div>

        {/* ── Right panel ── */}
        <section className="flex items-center justify-center px-6 py-10 sm:px-10 md:bg-white md:px-9 lg:px-12">
          <div className="w-full max-w-[440px] text-center">

            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#1463ff]/10">
              <svg className="h-8 w-8 text-[#1463ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h1 className="mb-3 font-poppins text-2xl font-bold text-gray-900">Forgot Password?</h1>

            <p className="mb-2 font-nunito text-sm text-gray-500">
              Password reset is managed by your system administrator.
            </p>
            <p className="mb-8 font-nunito text-sm text-gray-500">
              Please contact your admin to reset your password.
            </p>

            <Link
              href="/admin/login"
              className="inline-block w-full rounded-full bg-[#1463ff] py-2.5 font-poppins text-base font-semibold text-white transition-colors hover:bg-blue-700"
            >
              ← Back to Login
            </Link>

          </div>
        </section>
      </div>
    </main>
  );
}
