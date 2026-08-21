'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signUp, confirmSignUp, resendSignUpCode, signIn } from 'aws-amplify/auth';

// ── helpers ──────────────────────────────────────────────────────────────────

function parseCognitoError(err: any): string {
  const msg: string = err?.message || '';
  if (msg.includes('UsernameExistsException') || msg.includes('already exists'))
    return 'An account with this email already exists. Please log in instead.';
  if (msg.includes('InvalidPasswordException') || msg.includes('Password did not conform'))
    return 'Password does not meet requirements. Use 8+ characters with uppercase, lowercase, number and special character.';
  if (msg.includes('Password not long enough')) return 'Password must be at least 8 characters long.';
  if (msg.includes('uppercase')) return 'Password must include at least one uppercase letter (A–Z).';
  if (msg.includes('lowercase')) return 'Password must include at least one lowercase letter (a–z).';
  if (msg.includes('numeric') || msg.includes('number')) return 'Password must include at least one number (0–9).';
  if (msg.includes('symbol') || msg.includes('special')) return 'Password must include at least one special character (@, #, $, !).';
  if (msg.includes('InvalidParameterException') && msg.includes('phone'))
    return 'Invalid phone number format. Please enter with country code (e.g. +91XXXXXXXXXX).';
  if (msg.includes('CodeMismatchException') || msg.includes('Invalid verification code'))
    return 'Incorrect verification code. Please check and try again.';
  if (msg.includes('ExpiredCodeException') || msg.includes('expired'))
    return 'Verification code has expired. Please request a new one.';
  if (msg.includes('LimitExceededException'))
    return 'Too many attempts. Please wait a few minutes before trying again.';
  return msg || 'Something went wrong. Please try again.';
}

function validatePassword(pwd: string): string | null {
  if (pwd.length < 8) return 'Password must be at least 8 characters long.';
  if (!/[A-Z]/.test(pwd)) return 'Password must include at least one uppercase letter (A–Z).';
  if (!/[a-z]/.test(pwd)) return 'Password must include at least one lowercase letter (a–z).';
  if (!/[0-9]/.test(pwd)) return 'Password must include at least one number (0–9).';
  if (!/[^A-Za-z0-9]/.test(pwd)) return 'Password must include at least one special character (@, #, $, !).';
  return null;
}

const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8, label: 'At least 8 characters' },
  { test: (p: string) => /[A-Z]/.test(p), label: 'One uppercase letter (A–Z)' },
  { test: (p: string) => /[a-z]/.test(p), label: 'One lowercase letter (a–z)' },
  { test: (p: string) => /[0-9]/.test(p), label: 'One number (0–9)' },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), label: 'One special character (@, #, $, !)' },
];

// ── component ─────────────────────────────────────────────────────────────────

export default function AdminSignUpPage() {
  const router = useRouter();

  // Step 1 fields
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState(''); // collected for future use
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Step 2 OTP (6 boxes)
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // ── Step 1: Sign Up ─────────────────────────────────────────────────────────

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const pwdError = validatePassword(password);
    if (pwdError) { setError(pwdError); return; }

    setLoading(true);
    try {
      const { nextStep } = await signUp({
        username: email.trim().toLowerCase(),
        password,
        options: {
          userAttributes: {
            email: email.trim().toLowerCase(),
            name: name.trim(),
          },
        },
      });

      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setStep(2);
      }
    } catch (err: any) {
      setError(parseCognitoError(err));
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ──────────────────────────────────────────────────────

  const handleOtpChange = (index: number, value: string) => {
    const next = [...otp];
    next[index] = value.replace(/\D/g, '');
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(''));
      otpRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const code = otp.join('');
    if (code.length < 6) { setError('Please enter the full 6-digit verification code.'); return; }

    setLoading(true);
    try {
      // Step 1: Confirm the account
      await confirmSignUp({ username: email.trim().toLowerCase(), confirmationCode: code });

      // Step 2: Auto sign-in with the same credentials — skip the login page
      await signIn({ username: email.trim().toLowerCase(), password });

      // Redirect directly to dashboard
      window.location.href = '/admin/dashboard';
    } catch (err: any) {
      setError(parseCognitoError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    try {
      await resendSignUpCode({ username: email.trim().toLowerCase() });
      setSuccess('A new verification code has been sent to your email.');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(parseCognitoError(err));
    }
  };

  // ── render ──────────────────────────────────────────────────────────────────

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f9fb] p-1 sm:p-4">
      <div className="grid min-h-[calc(100vh-8px)] w-full max-w-[1060px] overflow-hidden bg-white shadow-sm md:min-h-[620px] md:grid-cols-2 md:rounded-none">

        {/* ── Left image panel ── */}
        <div className="relative hidden min-h-[620px] md:block">
          <Image src="/Images/Signup.jpg" alt="Admin sign up" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-x-8 bottom-28 text-center lg:bottom-24">
            <p className="font-poppins text-4xl font-semibold leading-tight text-white drop-shadow-lg lg:text-5xl">
              {step === 1 ? <>Create your<br />Admin Account</> : <>Verify your<br />Email</>}
            </p>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <section className="flex items-center justify-center px-6 py-10 sm:px-10 md:bg-white md:px-9 lg:px-12">
          <div className="w-full max-w-[460px]">

            {/* Step indicator */}
            <div className="mb-8 flex items-center gap-3">
              {['Account Info', 'Verify Email'].map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold font-poppins transition-colors ${
                    step > i + 1 ? 'bg-green-500 text-white' :
                    step === i + 1 ? 'bg-[#1463ff] text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <span className={`hidden sm:block font-nunito text-xs font-semibold ${step === i + 1 ? 'text-[#1463ff]' : 'text-gray-400'}`}>{label}</span>
                  {i < 1 && <div className="h-px w-8 bg-gray-200" />}
                </div>
              ))}
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 font-nunito text-sm text-red-600">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-5 rounded-xl bg-green-50 border border-green-200 px-4 py-3 font-nunito text-sm text-green-600">
                {success}
              </div>
            )}

            {/* ── Step 1: Registration form ── */}
            {step === 1 && (
              <>
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

                  {/* Mobile number — collected for future use, not sent to Cognito yet */}
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
                    {/* Live password rules */}
                    {password.length > 0 && (
                      <ul className="mt-2 grid grid-cols-1 gap-0.5">
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
              </>
            )}

            {/* ── Step 2: OTP Verification ── */}
            {step === 2 && (
              <>
                <h1 className="mb-2 font-poppins text-3xl font-bold text-gray-900">Check your email</h1>
                <p className="mb-8 font-nunito text-sm text-gray-500">
                  We sent a 6-digit code to <span className="font-semibold text-gray-700">{email}</span>.<br />
                  Enter it below to verify your account.
                </p>

                <form onSubmit={handleConfirm} className="space-y-6">
                  <div>
                    <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <input
                          key={i}
                          ref={(el) => { otpRefs.current[i] = el; }}
                          type="text" inputMode="numeric" maxLength={1}
                          value={otp[i]}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          className="h-12 w-12 rounded-xl border border-gray-300 bg-gray-50 text-center text-xl font-bold text-gray-900 outline-none transition focus:border-[#1463ff] focus:bg-white focus:ring-2 focus:ring-[#1463ff]/20"
                        />
                      ))}
                    </div>
                    <p className="mt-4 text-center font-nunito text-xs text-gray-500">
                      Didn&apos;t receive it?{' '}
                      <button type="button" onClick={handleResend} className="font-semibold text-[#1463ff] hover:underline">
                        Resend code
                      </button>
                    </p>
                  </div>

                  <button
                    type="submit" disabled={loading || otp.join('').length < 6}
                    className="w-full rounded-full bg-[#1463ff] py-2.5 font-poppins text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {loading ? 'Verifying...' : 'Verify & Continue'}
                  </button>

                  <button type="button" onClick={() => { setStep(1); setOtp(Array(6).fill('')); setError(''); }}
                    className="w-full rounded-full border border-gray-300 py-2.5 font-poppins text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                  >
                    ← Back to Sign Up
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
