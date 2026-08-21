'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, confirmSignIn } from 'aws-amplify/auth';

// ── error helper ──────────────────────────────────────────────────────────────

function parseCognitoError(err: any): string {
  const msg: string = err?.message || '';
  if (msg.includes('NotAuthorizedException') || msg.includes('Incorrect username or password'))
    return 'Incorrect email or password. Please try again.';
  if (msg.includes('UserNotFoundException'))
    return 'No account found with this email address.';
  if (msg.includes('UserNotConfirmedException'))
    return 'Your account is not verified yet. Please check your email for the verification code.';
  if (msg.includes('LimitExceededException'))
    return 'Too many failed attempts. Please wait a few minutes and try again.';
  if (msg.includes('name is missing') || msg.includes('Invalid attributes given'))
    return 'Please enter your full name to complete first-time setup.';
  if (msg.includes('Password did not conform') || msg.includes('InvalidPasswordException'))
    return 'Password does not meet requirements. Use 8+ characters with uppercase, lowercase, number and special character.';
  if (msg.includes('Password not long enough')) return 'Password must be at least 8 characters long.';
  if (msg.includes('uppercase')) return 'Password must include at least one uppercase letter (A–Z).';
  if (msg.includes('lowercase')) return 'Password must include at least one lowercase letter (a–z).';
  if (msg.includes('numeric') || msg.includes('number')) return 'Password must include at least one number (0–9).';
  if (msg.includes('symbol') || msg.includes('special')) return 'Password must include at least one special character (@, #, $, !).';
  return msg || 'Something went wrong. Please try again.';
}

function validatePassword(pwd: string): string | null {
  if (pwd.length < 8) return 'Password must be at least 8 characters long.';
  if (!/[A-Z]/.test(pwd)) return 'Must include at least one uppercase letter (A–Z).';
  if (!/[a-z]/.test(pwd)) return 'Must include at least one lowercase letter (a–z).';
  if (!/[0-9]/.test(pwd)) return 'Must include at least one number (0–9).';
  if (!/[^A-Za-z0-9]/.test(pwd)) return 'Must include at least one special character (@, #, $, !).';
  return null;
}

const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8, label: 'At least 8 characters' },
  { test: (p: string) => /[A-Z]/.test(p), label: 'One uppercase letter (A–Z)' },
  { test: (p: string) => /[a-z]/.test(p), label: 'One lowercase letter (a–z)' },
  { test: (p: string) => /[0-9]/.test(p), label: 'One number (0–9)' },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), label: 'One special character (@, #, $, !)' },
];

import { getCurrentUser } from 'aws-amplify/auth';
import { useEffect } from 'react';

// ── component ─────────────────────────────────────────────────────────────────

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Auto redirect if already signed in
  useEffect(() => {
    getCurrentUser()
      .then(() => {
        window.location.href = '/admin/dashboard';
      })
      .catch(() => {
        // Not signed in, continue normal rendering
      });
  }, []);

  // First-login / admin-created user flow
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [userName, setUserName] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ── normal login ────────────────────────────────────────────────────────────

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { nextStep } = await signIn({
        username: email.trim().toLowerCase(),
        password,
      });

      if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        // Admin-created account — must set a permanent password
        setIsFirstLogin(true);
      } else {
        // Self-signed-up user — go straight to dashboard
        window.location.href = '/admin/dashboard';
      }
    } catch (err: any) {
      setError(parseCognitoError(err));
    } finally {
      setLoading(false);
    }
  };

  // ── first-login password setup (admin-created accounts only) ───────────────

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userName.trim()) {
      setError('Please enter your full name to complete account setup.');
      return;
    }
    const pwdError = validatePassword(newPassword);
    if (pwdError) { setError(pwdError); return; }

    setLoading(true);
    try {
      await confirmSignIn({
        challengeResponse: newPassword,
        options: { userAttributes: { name: userName.trim() } },
      });
      window.location.href = '/admin/dashboard';
    } catch (err: any) {
      setError(parseCognitoError(err));
    } finally {
      setLoading(false);
    }
  };

  // ── render ──────────────────────────────────────────────────────────────────

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

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 font-nunito text-sm text-red-600">
                {error}
              </div>
            )}

            {/* ── Normal login form ── */}
            {!isFirstLogin ? (
              <>
                <h1 className="mb-8 font-poppins text-3xl font-bold text-gray-900 sm:text-4xl">Login</h1>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="mb-1.5 block font-nunito text-sm font-semibold text-gray-700">Email Address</label>
                    <input
                      type="email" placeholder="Enter your email"
                      value={email} onChange={(e) => setEmail(e.target.value)} required
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
                      type="password" placeholder="Enter your password"
                      value={password} onChange={(e) => setPassword(e.target.value)} required
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 font-nunito text-sm outline-none transition placeholder:text-gray-400 focus:border-[#1463ff] focus:bg-white focus:ring-2 focus:ring-[#1463ff]/20"
                    />
                  </div>

                  <button
                    type="submit" disabled={loading}
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
              </>
            ) : (
              /* ── First-login / admin-created account: set permanent password ── */
              <>
                <h1 className="mb-2 font-poppins text-3xl font-bold text-gray-900">Set Your Password</h1>
                <p className="mb-7 font-nunito text-sm text-gray-500">
                  Your account was set up by an administrator. Please enter your name and create a permanent password to continue.
                </p>

                <form onSubmit={handleSetNewPassword} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block font-nunito text-sm font-semibold text-gray-700">Full Name</label>
                    <input
                      type="text" placeholder="Enter your full name"
                      value={userName} onChange={(e) => setUserName(e.target.value)} required
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 font-nunito text-sm outline-none transition placeholder:text-gray-400 focus:border-[#1463ff] focus:bg-white focus:ring-2 focus:ring-[#1463ff]/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block font-nunito text-sm font-semibold text-gray-700">New Password</label>
                    <input
                      type="password" placeholder="Create a strong password"
                      value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 font-nunito text-sm outline-none transition placeholder:text-gray-400 focus:border-[#1463ff] focus:bg-white focus:ring-2 focus:ring-[#1463ff]/20"
                    />
                    {newPassword.length > 0 && (
                      <ul className="mt-2 grid gap-0.5">
                        {PASSWORD_RULES.map(({ test, label }) => {
                          const ok = test(newPassword);
                          return (
                            <li key={label} className={`flex items-center gap-1.5 font-nunito text-xs ${ok ? 'text-green-600' : 'text-gray-400'}`}>
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
                    className="w-full rounded-full bg-[#1463ff] py-2.5 font-poppins text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {loading ? 'Saving...' : 'Save Password & Continue'}
                  </button>

                  <button type="button" onClick={() => { setIsFirstLogin(false); setError(''); }}
                    className="w-full rounded-full border border-gray-300 py-2.5 font-poppins text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                  >
                    ← Back to Login
                  </button>
                </form>
              </>
            )}

          </div>
        </section>
      </div>
    </main>
  );
}
