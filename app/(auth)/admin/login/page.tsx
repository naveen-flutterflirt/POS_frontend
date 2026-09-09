'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, confirmSignIn } from 'aws-amplify/auth';
import { Eye, EyeOff } from 'lucide-react';

const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8, label: 'At least 8 characters' },
  { test: (p: string) => /[A-Z]/.test(p), label: 'One uppercase letter (A–Z)' },
  { test: (p: string) => /[a-z]/.test(p), label: 'One lowercase letter (a–z)' },
  { test: (p: string) => /[0-9]/.test(p), label: 'One number (0–9)' },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), label: 'One special character (@, #, $, !)' },
];
export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [newPasswordRequired, setNewPasswordRequired] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

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
      const { isSignedIn, nextStep } = await signIn({ 
        username: email.trim().toLowerCase(), 
        password 
      });

      if (isSignedIn) {
        // Successful login
        router.replace('/admin/dashboard');
      } else if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setNewPasswordRequired(true);
      } else if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        setError('Please confirm your account first. An OTP was sent to your email.');
      } else {
        setError('Login step incomplete.');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { isSignedIn, nextStep } = await confirmSignIn({
        challengeResponse: newPassword,
        options: {
          userAttributes: {
            name: email.split('@')[0] || 'Admin', // Automatically provide a name to satisfy Cognito
          },
        },
      });

      if (isSignedIn) {
        router.replace('/admin/dashboard');
      } else {
        setError('Login step incomplete. Step: ' + nextStep?.signInStep);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update password. Please try again.');
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

            {newPasswordRequired ? (
              <form onSubmit={handleNewPassword} className="space-y-5">
                <div>
                  <label className="mb-1.5 block font-nunito text-sm font-semibold text-gray-700">
                    New Permanent Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter a new strong password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 pr-10 font-nunito text-sm outline-none transition placeholder:text-gray-400 focus:border-[#1463ff] focus:bg-white focus:ring-2 focus:ring-[#1463ff]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {newPassword.length > 0 && (
                    <ul className="mt-2 grid gap-0.5">
                      {PASSWORD_RULES.map(({ test, label }) => {
                        const ok = test(newPassword);
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
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-[#1463ff] py-2.5 font-poppins text-lg font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {loading ? 'Updating...' : 'Update Password & Login'}
                </button>
              </form>
            ) : (
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
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 pr-10 font-nunito text-sm outline-none transition placeholder:text-gray-400 focus:border-[#1463ff] focus:bg-white focus:ring-2 focus:ring-[#1463ff]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
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
            )}

          </div>
        </section>
      </div>
    </main>
  );
}
