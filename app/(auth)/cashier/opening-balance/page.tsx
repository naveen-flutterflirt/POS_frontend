"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const denominations = [100, 50, 20, 10] as const;
type Counts = Record<(typeof denominations)[number], string>;

export default function CashierOpeningBalancePage() {
  const router = useRouter();
  const [counts, setCounts] = useState<Counts>({ 100: "", 50: "", 20: "", 10: "" });

  const total = denominations.reduce(
    (sum, denomination) => sum + denomination * (Number(counts[denomination]) || 0),
    0,
  );

  const updateCount = (denomination: (typeof denominations)[number], value: string) => {
    setCounts((current) => ({ ...current, [denomination]: value.replace(/[^0-9]/g, "") }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    router.push("/cashier/dashboard");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f9fb] p-1 sm:p-4">
      <div className="grid min-h-[calc(100vh-8px)] w-full max-w-[1060px] overflow-hidden bg-white shadow-sm md:min-h-[600px] md:grid-cols-2 md:rounded-none">
        <div className="relative hidden min-h-[600px] md:block">
          <Image
            src="/Images/Signup.jpg"
            alt="Cashier using a retail POS system"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-x-8 bottom-28 text-center lg:bottom-24">
            <p className="font-poppins text-4xl font-semibold leading-tight text-white drop-shadow-lg lg:text-5xl">
              Welcome Back,
              <br />
              Cashier!
            </p>
          </div>
        </div>

        <section className="flex items-center justify-center px-4 py-6 sm:px-10 md:bg-white md:px-9 lg:px-12">
          <div className="w-full max-w-[505px] rounded-[22px] bg-[#f7f7f7] px-5 py-12 sm:px-8 md:px-8 lg:px-8 lg:py-14">
            <h1 className="mb-9 text-center font-poppins text-3xl font-bold text-black sm:text-4xl">
              Add Opening Balance
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {denominations.map((denomination) => (
                  <label
                    key={denomination}
                    className="flex items-center gap-2 bg-[#f3f3f3] px-3 py-2.5 font-nunito text-xs text-gray-800"
                  >
                    <span className="w-8 shrink-0 text-right font-semibold">{denomination} x</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={counts[denomination]}
                      onChange={(e) => updateCount(denomination, e.target.value)}
                      placeholder="Enter Amount"
                      aria-label={`${denomination} denomination count`}
                      className="min-w-0 flex-1 rounded-md border-0 bg-[#e7e7e7] px-3 py-1.5 text-center font-nunito text-xs text-gray-700 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#1463ff]/20"
                    />
                  </label>
                ))}
              </div>

              <div className="flex items-center bg-[#f3f3f3] text-xs font-nunito">
                <div className="flex-1 bg-[#e2f8e7] px-4 py-4 text-center font-semibold text-gray-800">
                  Total Opening Balance
                </div>
                <output
                  className="flex-1 px-4 py-4 text-center font-semibold text-gray-800"
                  aria-live="polite"
                >
                  ₹{total}
                </output>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[#1463ff] py-2.5 font-poppins text-lg font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
