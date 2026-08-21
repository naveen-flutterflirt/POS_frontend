'use client';

import Image from 'next/image';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';

export default function AdminForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter OTP + New Password
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Step 1: Send OTP to user's email via Cognito
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword({ username: email });
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please check the email and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    setError('');
    try {
      await resetPassword({ username: email });
      setSuccess('Verification code resent successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to resend code.');
    }
  };

  // Step 2: Submit OTP + New Password via Cognito
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: newPassword,
      });
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => router.push('/admin/login'), 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden min-h-[600px]">
        {/* Left side — image */}
        <div className="hidden md:block md:w-1/2 relative">
          <Image
            src="/Images/Signup.jpg"
            alt="Forgot Password Illustration"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 via-30% to-transparent to-70%" />
          <div className="absolute bottom-10 left-8 right-8">
            <p className="text-white font-poppins text-2xl font-medium leading-relaxed drop-shadow-lg">
              Welcome Back, <br />
              <span className="font-semibold">Admin!</span>
            </p>
          </div>
        </div>

        {/* Right side — form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h1 className="text-3xl font-poppins font-bold text-gray-900 mb-2">
            {step === 1 ? 'Forgot Password' : 'Reset Password'}
          </h1>

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 rounded-lg bg-green-50 p-3 text-sm text-green-600 border border-green-200">
              {success}
            </div>
          )}

          {step === 1 ? (
            <>
              <p className="text-sm font-nunito text-gray-600 mb-8">
                Enter your registered email address. We&apos;ll send you a verification code.
              </p>
              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block font-nunito text-sm font-semibold text-gray-900">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1463ff] hover:bg-blue-700 disabled:bg-blue-400 text-white font-poppins font-semibold py-2.5 rounded-full transition"
                >
                  {loading ? 'Sending...' : 'Send Verification Code'}
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="text-sm font-nunito text-gray-600 mb-8">
                Enter the 6-digit code sent to <strong>{email}</strong> and your new password.
              </p>
              <form onSubmit={handleResetSubmit} className="space-y-5">
                {/* OTP Input */}
                <div>
                  <label className="mb-2 block font-nunito text-sm font-semibold text-gray-900">
                    Verification Code
                  </label>
                  <div className="flex justify-start gap-2">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        maxLength={1}
                        value={otp[index]}
                        className="w-11 h-11 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                      />
                    ))}
                  </div>
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-sm font-nunito text-blue-600 hover:text-blue-800 font-semibold bg-transparent border-none cursor-pointer"
                    >
                      Resend Code
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="mb-2 block font-nunito text-sm font-semibold text-gray-900">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-2 block font-nunito text-sm font-semibold text-gray-900">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1463ff] hover:bg-blue-700 disabled:bg-blue-400 text-white font-poppins font-semibold py-2.5 rounded-full transition"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
