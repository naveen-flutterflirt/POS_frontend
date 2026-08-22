import Link from "next/link";
import Image from "next/image";

const roles = [
  {
    href: "/admin/login",
    label: "Admin Login",
    desc: "Manage your store, products & reports",
    color: "bg-[#622581] hover:bg-[#52206d]",
  },
  {
    href: "/cashier/login",
    label: "Cashier Login",
    desc: "Process sales, returns & billing",
    color: "bg-[#1463ff] hover:bg-blue-700",
  },
  {
    href: "/inventory/login",
    label: "Inventory Login",
    desc: "Track stock, manage inventory levels",
    color: "bg-[#0f9e6e] hover:bg-emerald-700",
  },
];

export default function RootPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f9fb] px-4 py-10">
      <div className="w-full max-w-4xl">

        {/* Logo + title */}
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <div className="relative h-14 w-14">
            <Image src="/Images/icon.svg" alt="FlutterFlirt POS" fill className="object-contain" />
          </div>
          <h1 className="font-poppins text-3xl font-bold text-gray-900">FlutterFlirt POS</h1>
          <p className="font-nunito text-sm text-gray-500">Select your role to continue</p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {roles.map(({ href, label, desc, color }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col items-center gap-4 rounded-2xl bg-white p-8 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <span
                className={`inline-flex items-center justify-center rounded-xl px-6 py-2.5 font-poppins text-sm font-semibold text-white transition-colors ${color}`}
              >
                {label}
              </span>
              <p className="text-center font-nunito text-xs text-gray-500">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
