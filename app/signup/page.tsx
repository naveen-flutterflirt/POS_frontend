// app/signup/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden min-h-[600px]">
        
        {/* Left Side - Image with White Gradient Overlay */}
        <div className="hidden md:block md:w-1/2 relative">
          <Image
            src="/Images/Signup.jpg"
            alt="Sign Up Illustration"
            fill
            className="object-cover"
            priority
          />
          
          {/* White Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 via-30% to-transparent to-70%"></div>
          
          {/* Welcome Text */}
          <div className="absolute bottom-10 left-8 right-8">
            <p className="text-white font-poppins text-2xl font-medium leading-relaxed drop-shadow-lg">
              Welcome Back, <br />
              <span className="font-semibold">Admin!</span>
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          {/* Header */}
          <h1 className="text-3xl font-poppins font-bold text-gray-900 mb-8">
            Sign Up
          </h1>

          {/* Form */}
          <form className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-nunito font-semibold text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter Name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            {/* Mobile Number Field */}
            <div>
              <label className="block text-sm font-nunito font-semibold text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                placeholder="Enter Mobile Number"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-nunito font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter Email"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-nunito font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-nunito focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-poppins font-semibold py-2.5 rounded-lg transition duration-200"
            >
              Sign Up
            </button>

            {/* Login Link */}
            <p className="text-center text-sm font-nunito text-gray-600 mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}