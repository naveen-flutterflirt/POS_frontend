'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8, label: 'At least 8 characters' },
  { test: (p: string) => /[A-Z]/.test(p), label: 'One uppercase letter (A–Z)' },
  { test: (p: string) => /[a-z]/.test(p), label: 'One lowercase letter (a–z)' },
  { test: (p: string) => /[0-9]/.test(p), label: 'One number (0–9)' },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), label: 'One special character (@, #, $, !)' },
];

export default function AdminSignUpPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic password validation
    if (password.length < 8) { setError('Password must be at least 8 characters long.'); return; }
    if (!/[A-Z]/.test(password)) { setError('Password must include at least one uppercase letter.'); return; }
    if (!/[a-z]/.test(password)) { setError('Password must include at least one lowercase letter.'); return; }
    if (!/[0-9]/.test(password)) { setError('Password must include at least one number.'); return; }
    if (!/[^A-Za-z0-9]/.test(password)) { setError('Password must include at least one special character.'); return; }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/signup`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            mobileNumber: mobileNumber.trim(),
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || 'Registration failed. Please try again.');
        return;
      }

      localStorage.setItem('access_token', data.access_token);
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
      <div className="grid min-h-[calc(100vh-8px)] w-full max-w-[1060px] overflow-hidden bg-white shadow-sm md:min-h-[620px] md:grid-cols-2 md:rounded-none">

        {/* ── Left image panel ── */}
        <div className="relative hidden min-h-[620px] md:block">
          <Image src="/Images/Signup.jpg" alt="Admin sign up" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-x-8 bottom-28 text-center lg:bottom-24">
            <p className="font-poppins text-4xl font-semibold leading-tight text-white drop-shadow-lg lg:text-5xl">
              Create your<br />Admin Account
            </p>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <section className="flex items-center justify-center px-6 py-10 sm:px-10 md:bg-white md:px-9 lg:px-12">
          <div className="w-full max-w-[460px]">

            {error && (
              <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 font-nunito text-sm text-red-600">
                {error}
              </div>
            )}

            <h1 className="mb-6 font-poppins text-3xl font-bold text-gray-900">Sign Up</h1>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="mb-1.5 block font-nunito text-sm font-semibold text-gray-700">Full Name</label>
                <input
                  type="text" placeholder="Enter your full name"
                  value={name} onChange={(e) => setName(e.target.value)} required
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 font-nunito text-sm outline-none transition placeholder:text-gray-400 focus:border-[#1463ff] focus:bg-white focus:ring-2 focus:ring-[#1463ff]/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-nunito text-sm font-semibold text-gray-700">Mobile Number</label>
                <input
                  type="tel" placeholder="Enter your mobile number"
                  value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 font-nunito text-sm outline-none transition placeholder:text-gray-400 focus:border-[#1463ff] focus:bg-white focus:ring-2 focus:ring-[#1463ff]/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-nunito text-sm font-semibold text-gray-700">Email Address</label>
                <input
                  type="email" placeholder="Enter your email"
                  value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 font-nunito text-sm outline-none transition placeholder:text-gray-400 focus:border-[#1463ff] focus:bg-white focus:ring-2 focus:ring-[#1463ff]/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-nunito text-sm font-semibold text-gray-700">Password</label>
                <input
                  type="password" placeholder="Create a strong password"
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 font-nunito text-sm outline-none transition placeholder:text-gray-400 focus:border-[#1463ff] focus:bg-white focus:ring-2 focus:ring-[#1463ff]/20"
                />
                {password.length > 0 && (
                  <ul className="mt-2 grid gap-0.5">
                    {PASSWORD_RULES.map(({ test, label }) => {
                      const ok = test(password);
                      return (
                        <li key={label} className={`flex items-center gap-1.5 font-nunito text-xs transition-colors ${ok ? 'text-green-600' : 'text-gray-400'}`}>
                          <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${ok ? 'bg-green-100' : 'bg-gray-100'}`}>
                            {ok ? '✓' : '○'}
                          </span>
                          {label}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <button
                type="submit" disabled={loading}
                className="mt-2 w-full rounded-full bg-[#1463ff] py-2.5 font-poppins text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              <p className="pt-1 text-center font-nunito text-xs text-gray-500">
                Already have an account?{' '}
                <Link href="/admin/login" className="font-semibold text-[#1463ff] hover:underline">Log in</Link>
              </p>
            </form>

          </div>
        </section>
      </div>
    </main>
  );
}
