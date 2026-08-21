"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Archive,
  BadgePercent,
  Banknote,
  Bell,
  ClipboardCheck,
  LayoutDashboard,
  Menu,
  Receipt,
  RotateCcw,
  Search,
  Settings,
  LogOut,
  Truck,
  Users,
  X,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/cashier/dashboard" },
  { label: "Sales", icon: BadgePercent, path: "/cashier/dashboard/sales" },
  { label: "Returns", icon: RotateCcw, path: "/cashier/dashboard/returns" },
  { label: "Customer", icon: Users, path: "/cashier/dashboard/customer" },
  { label: "Delivery", icon: Truck, path: "/cashier/dashboard/delivery" },
  { label: "Daily Sale Statement", icon: Receipt, path: "/cashier/dashboard/daily-sales" },
  { label: "EOD Statement", icon: ClipboardCheck, path: "/cashier/dashboard/eod-statement" },
  { label: "Open Drawer", icon: Banknote, path: "/cashier/dashboard/open-drawer" },
  { label: "Settle Batch", icon: Archive, path: "/cashier/dashboard/settle-batch" },
];

export default function CashierLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <main className="h-dvh overflow-hidden bg-gray-50 font-nunito text-[#111111]">
      {/* Sidebar */}
      <aside
        className={`scrollbar-none fixed inset-y-0 left-0 z-30 flex h-dvh w-[min(280px,88vw)] flex-col overflow-y-auto border-r border-gray-200 bg-white transition-transform duration-200 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center gap-3 px-6 pb-8 pt-8">
          <div className="relative h-12 w-12 shrink-0">
            <Image
              src="/Images/Logo.png"
              alt="FlutterFlirt POS"
              fill
              className="object-contain"
            />
          </div>
          <span className="whitespace-nowrap font-poppins text-xl font-semibold text-gray-800">
            FlutterFlirt POS
          </span>
        </div>

        <nav className="space-y-1 px-4 pb-6">
          {menuItems.map(({ label, icon: Icon, path }) => {
            const isActive = pathname === path || pathname.startsWith(`${path}/`);
            return (
              <Link
                key={label}
                href={path}
                className={`flex min-h-12 items-center gap-4 rounded-lg px-3 text-sm transition-colors ${
                  isActive
                    ? "border-l-4 border-[#622581] bg-[#622581]/10 text-[#622581]"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${isActive ? "text-[#622581]" : "text-gray-500"}`}
                />
                <span className="whitespace-nowrap font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setIsSidebarOpen((open) => !open)}
        className="fixed left-3 top-3 z-40 rounded-lg bg-white p-2 shadow-sm hover:bg-gray-100 lg:hidden"
        aria-label={isSidebarOpen ? "Close cashier sidebar" : "Open cashier sidebar"}
      >
        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <button
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-black/20 lg:hidden"
          aria-label="Close cashier sidebar overlay"
        />
      )}

      {/* Main content */}
      <section
        className={`h-dvh overflow-hidden transition-all duration-200 ${
          isSidebarOpen ? "lg:ml-[280px]" : "lg:ml-0"
        }`}
      >
        {/* Header */}
        <header className="fixed right-0 top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-3 sm:px-6 lg:left-[280px]">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
              <Image src="/Images/Avatar.png" alt="Cashier avatar" fill className="object-cover" />
            </div>
            <h1 className="hidden font-poppins text-xl font-semibold text-gray-800 sm:block">
              Welcome back!
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search"
                className="w-48 rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm outline-none focus:border-[#622581] lg:w-64"
              />
            </div>

            <button
              type="button"
              className="relative rounded-lg p-2 text-gray-500 hover:bg-[#622581]/10 hover:text-[#622581]"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen((open) => !open)}
                className="rounded-lg p-2 text-gray-500 hover:bg-[#622581]/10 hover:text-[#622581]"
                aria-label="Open profile menu"
              >
                <Users className="h-5 w-5" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-11 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-red-50 text-gray-700 hover:text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="scrollbar-none h-full overflow-y-auto px-3 pb-6 pt-20 sm:px-6">
          {children}
        </div>
      </section>
    </main>
  );
}
