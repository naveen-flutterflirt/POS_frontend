import Image from "next/image";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f9fb] p-1 sm:p-4">
      <div className="grid min-h-[calc(100vh-8px)] w-full max-w-[1060px] overflow-hidden bg-white shadow-sm md:min-h-[600px] md:grid-cols-2 md:rounded-none">
        <div className="relative hidden min-h-[600px] md:block">
          <Image
            src="/Images/Signup.jpg"
            alt="Administrator using a retail POS system"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-x-8 bottom-28 text-center lg:bottom-24">
            <p className="font-poppins text-4xl font-semibold leading-tight text-white drop-shadow-lg lg:text-5xl">
              Welcome Back,
              <br />
              Admin!
            </p>
          </div>
        </div>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10 md:bg-white md:px-9 lg:px-12">
          <div className="w-full max-w-[505px] rounded-[22px] bg-[#f7f7f7] px-7 py-14 sm:px-10 md:px-8 lg:px-10 lg:py-16">
            <h1 className="mb-9 text-center font-poppins text-3xl font-bold text-black sm:text-4xl">
              Login
            </h1>

            <form className="space-y-6">
              <div>
                <label className="mb-2 block font-nunito text-sm font-semibold text-gray-900">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 font-nunito text-sm outline-none transition placeholder:text-gray-400 focus:border-[#1463ff] focus:ring-2 focus:ring-[#1463ff]/20"
                />
              </div>

              <div>
                <label className="mb-2 block font-nunito text-sm font-semibold text-gray-900">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 font-nunito text-sm outline-none transition placeholder:text-gray-400 focus:border-[#1463ff] focus:ring-2 focus:ring-[#1463ff]/20"
                />
              </div>

              <div className="text-right">
                <Link
                  href="/admin/forgot-password"
                  className="font-nunito text-xs font-semibold text-gray-500 hover:text-[#1463ff]"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[#1463ff] py-2.5 font-poppins text-lg font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Login
              </button>

              <p className="pt-1 text-center font-nunito text-xs text-gray-500">
                Don&apos;t have an account yet?{" "}
                <Link
                  href="/admin/signup"
                  className="font-semibold text-gray-500 underline hover:text-[#1463ff]"
                >
                  Sign Up
                </Link>
              </p>

              <p className="text-center font-nunito text-xs text-gray-500">
                Are you a cashier?{" "}
                <Link
                  href="/cashier/login"
                  className="font-semibold text-gray-500 underline hover:text-[#1463ff]"
                >
                  Cashier Login
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
