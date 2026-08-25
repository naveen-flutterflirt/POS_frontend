'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-redirect if already logged in (token exists)
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('access_token')) {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || 'Invalid email or password. Please try again.');
        return;
      }

      localStorage.setItem('access_token', data.access_token);
      // Store user info for display
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      router.replace('/admin/dashboard');
    } catch {
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f9fb] p-1 sm:p-4">
      <div className="grid min-h-[calc(100vh-8px)] w-full max-w-[1060px] overflow-hidden bg-white shadow-sm md:min-h-[600px] md:grid-cols-2 md:rounded-none">

        {/* ── Left image panel ── */}
        <div className="relative hidden min-h-[600px] md:block">
          <Image src="/Images/Signup.jpg" alt="Admin login" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-x-8 bottom-28 text-center lg:bottom-24">
            <p className="font-poppins text-4xl font-semibold leading-tight text-white drop-shadow-lg lg:text-5xl">
              Welcome Back,<br />Admin!
            </p>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <section className="flex items-center justify-center px-6 py-10 sm:px-10 md:bg-white md:px-9 lg:px-12">
          <div className="w-full max-w-[440px]">

            {error && (
              <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 font-nunito text-sm text-red-600">
                {error}
              </div>
            )}

            <h1 className="mb-8 font-poppins text-3xl font-bold text-gray-900 sm:text-4xl">Login</h1>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="mb-1.5 block font-nunito text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 font-nunito text-sm outline-none transition placeholder:text-gray-400 focus:border-[#1463ff] focus:bg-white focus:ring-2 focus:ring-[#1463ff]/20"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="font-nunito text-sm font-semibold text-gray-700">Password</label>
                  <Link href="/admin/forgot-password" className="font-nunito text-xs font-semibold text-[#1463ff] hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 font-nunito text-sm outline-none transition placeholder:text-gray-400 focus:border-[#1463ff] focus:bg-white focus:ring-2 focus:ring-[#1463ff]/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#1463ff] py-2.5 font-poppins text-lg font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading ? 'Signing In...' : 'Login'}
              </button>

              <p className="text-center font-nunito text-xs text-gray-500">
                Don&apos;t have an account?{' '}
                <Link href="/admin/signup" className="font-semibold text-[#1463ff] hover:underline">Sign Up</Link>
              </p>
              <p className="text-center font-nunito text-xs text-gray-500">
                Are you a cashier?{' '}
                <Link href="/cashier/login" className="font-semibold text-[#1463ff] hover:underline">Cashier Login</Link>
              </p>
            </form>

          </div>
        </section>
      </div>
    </main>
  );
}
