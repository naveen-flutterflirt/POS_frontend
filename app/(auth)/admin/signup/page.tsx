'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signUp, confirmSignUp, resendSignUpCode, signIn } from 'aws-amplify/auth';
import { Eye, EyeOff } from 'lucide-react';

const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8, label: 'At least 8 characters' },
  { test: (p: string) => /[A-Z]/.test(p), label: 'One uppercase letter (A–Z)' },
  { test: (p: string) => /[a-z]/.test(p), label: 'One lowercase letter (a–z)' },
  { test: (p: string) => /[0-9]/.test(p), label: 'One number (0–9)' },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), label: 'One special character (@, #, $, !)' },
];

export default function AdminSignUpPage() {
  const router = useRouter();
  
  // Step 1: Sign up
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Step 2: OTP
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // State
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) { setError('Password must be at least 8 characters long.'); return; }
    if (!/[A-Z]/.test(password)) { setError('Password must include at least one uppercase letter.'); return; }
    if (!/[a-z]/.test(password)) { setError('Password must include at least one lowercase letter.'); return; }
    if (!/[0-9]/.test(password)) { setError('Password must include at least one number.'); return; }
    if (!/[^A-Za-z0-9]/.test(password)) { setError('Password must include at least one special character.'); return; }

    setLoading(true);
    try {
      const { isSignUpComplete, nextStep } = await signUp({
        username: email.trim().toLowerCase(),
        password,
        options: {
          userAttributes: {
            email: email.trim().toLowerCase(),
            name: name.trim(),
            phone_number: mobileNumber.trim() || undefined,
          }
        }
      });
      
      if (!isSignUpComplete && nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setStep(2);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const code = otp.join('');
    if (code.length < 6) return;

    setLoading(true);
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: email.trim().toLowerCase(),
        confirmationCode: code
      });
      
      if (isSignUpComplete) {
        // Automatically sign them in
        await signIn({ username: email.trim().toLowerCase(), password });
        router.replace('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Invalid code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    try {
      await resendSignUpCode({ username: email.trim().toLowerCase() });
      alert('Verification code resent! Check your email.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend code.');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      const newOtp = [...otp];
      for (let i = 0; i < pasted.length; i++) {
        newOtp[i] = pasted[i];
      }
      setOtp(newOtp);
      const nextIndex = Math.min(pasted.length, 5);
      otpRefs.current[nextIndex]?.focus();
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

            {/* ── Step 1: Sign Up ── */}
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

                  <div>
                    <label className="mb-1.5 block font-nunito text-sm font-semibold text-gray-700">Mobile Number (Optional)</label>
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
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
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
