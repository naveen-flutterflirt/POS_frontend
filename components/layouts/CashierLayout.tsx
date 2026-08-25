

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import {
  Archive,
  BadgePercent,
  Banknote,
  Bell,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  MonitorCheck,
  Receipt,
  RotateCcw,
  Search,
  Settings,
  Truck,
  UserCog,
  Users,
  X,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/cashier/dashboard" },
  { label: "POS", icon: MonitorCheck, path: "/cashier/dashboard/pos" },
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
  const router = useRouter();

  const [activePath, setActivePath] = useState(pathname);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  /* sync active path */
  useEffect(() => {
    startTransition(() => setActivePath(pathname));
  }, [pathname]);

  /* open sidebar on desktop, close on mobile */
  useEffect(() => {
    const sync = () => setIsSidebarOpen(window.innerWidth >= 1024);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    router.replace("/cashier/login");
  };

  return (
    <div className="h-dvh overflow-hidden bg-gray-50 font-nunito">

      {/* ══ Sidebar ══ */}
      <aside
        className={`scrollbar-none fixed inset-y-0 left-0 z-30 flex h-dvh shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white transition-all duration-200 lg:sticky lg:top-0 lg:z-auto ${isSidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-6 py-5 ${!isSidebarOpen ? "justify-center px-3" : ""}`}>
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
            <Image src="/Images/icon.svg" alt="FlutterFlirt POS logo" fill className="object-contain" />
          </div>
          {isSidebarOpen && (
            <span className="whitespace-nowrap font-poppins text-lg font-semibold text-gray-800">
              FlutterFlirt POS
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className={`flex-1 space-y-1 py-4 ${isSidebarOpen ? "px-3" : "px-2"}`}>
          {menuItems.map(({ label, icon: Icon, path }) => {
            const isActive = activePath === path || activePath.startsWith(`${path}/`);
            return (
              <Link
                key={label}
                href={path}
                onClick={() => setActivePath(path)}
                title={!isSidebarOpen ? label : undefined}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${!isSidebarOpen ? "justify-center" : ""
                  } ${isActive ? "bg-[#622581]/10 text-[#622581]" : "text-gray-700 hover:bg-[#622581]/10 hover:text-[#622581]"}`}
              >
                <span className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-[#622581] transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                <Icon className="h-5 w-5 shrink-0 transition-colors duration-200" />
                {isSidebarOpen && <span className="font-nunito text-sm font-medium">{label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <button type="button" onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 z-20 bg-black/20 lg:hidden" aria-label="Close sidebar overlay" />
      )}

      {/* ══ Main area ══ */}
      <div className={`h-dvh min-w-0 transition-all duration-200 ${isSidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>

        {/* Header — left-0 ensures full width on mobile */}
        <header
          className={`fixed left-0 right-0 top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-3 py-3 transition-all duration-200 sm:px-6 ${isSidebarOpen ? "lg:left-64" : "lg:left-20"
            }`}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen((o) => !o)}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-[#622581]/10 hover:text-[#622581]"
              aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              aria-expanded={isSidebarOpen}
            >
              <span className="hidden lg:block">
                {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </span>
              <span className="lg:hidden">
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </span>
            </button>
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
              <Image src="/Images/Avatar.png" alt="Cashier avatar" fill className="object-cover" />
            </div>
            <h1 className="hidden font-poppins text-xl font-semibold text-gray-800 sm:block">Welcome back!</h1>
          </div>

          <div className="flex items-center gap-1 sm:gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input placeholder="Search" className="w-48 rounded-lg border border-gray-200 py-2 pl-9 pr-4 font-nunito text-sm outline-none transition focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/30 lg:w-64" />
            </div>
            <button type="button" className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-[#622581]/10 hover:text-[#622581]" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="relative">
              <button type="button" onClick={() => setIsProfileOpen((o) => !o)} className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-[#622581]/10 hover:text-[#622581]" aria-label="Open profile menu">
                <UserCog className="h-5 w-5" />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 top-11 z-20 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  <button type="button" className="flex w-full items-center gap-3 px-4 py-2 font-nunito text-sm text-gray-700 transition-colors hover:bg-[#622581]/10 hover:text-[#622581]">
                    <Settings className="h-4 w-4" /> Settings
                  </button>
                  <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-2 font-nunito text-sm text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="scrollbar-none h-full min-w-0 overflow-y-auto px-3 pb-6 pt-20 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
