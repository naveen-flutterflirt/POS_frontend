"use client";

import Image from "next/image";
import { useRef } from "react";

export default function AdminForgotPasswordPage() {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length === 1 && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
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
            Forgot Password
          </h1>
          <p className="text-sm font-nunito text-gray-600 mb-8">
            Enter the 4-digit verification code we have sent to your mobile number.
          </p>

          <form className="space-y-5">
            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  className="w-14 h-14 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                />
              ))}
            </div>

            <div className="text-right">
              <p className="text-sm font-nunito text-gray-600">
                Didn&apos;t receive the code?{" "}
                <button type="button" className="text-blue-600 hover:text-blue-800 font-semibold">
                  Resend
                </button>
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-poppins font-semibold py-2.5 rounded-lg transition duration-200 mt-4"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
