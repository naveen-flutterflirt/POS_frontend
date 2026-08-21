"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import { startTransition, useEffect, useState } from "react";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Printer,
  ReceiptText,
  Search,
  Settings,
  Store,
  Tag,
  UserCog,
  Users,
  Warehouse,
  X,
} from "lucide-react";

type MenuItem =
  | { name: string; icon: React.ElementType; path: string; subItems?: never }
  | { name: string; icon: React.ElementType; path?: never; subItems: { name: string; path: string }[] };

const menuItems: MenuItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  {
    name: "Category Management", icon: Layers,
    subItems: [
      { name: "Categories", path: "/admin/dashboard/categories" },
      { name: "Sub-Categories", path: "/admin/dashboard/sub-categories" },
    ],
  },
  { name: "Price Management", icon: Tag, path: "/admin/dashboard/price-management" },
  { name: "Product Management", icon: Package, path: "/admin/dashboard/product-management" },
  { name: "Payment Details", icon: CreditCard, path: "/admin/dashboard/payment-details" },
  { name: "Cashier", icon: UserCog, path: "/admin/dashboard/cashier" },
  { name: "Inventory", icon: Warehouse, path: "/admin/dashboard/inventory" },
  { name: "Store Management", icon: Store, path: "/admin/dashboard/store-management" },
  { name: "Print Management", icon: Printer, path: "/admin/dashboard/print-management" },
  { name: "Tax/GST Management", icon: ReceiptText, path: "/admin/dashboard/tax-gst-management" },
  {
    name: "Customer Management", icon: Users,
    subItems: [
      { name: "Customer Profiles", path: "/admin/dashboard/customer-profiles" },
      { name: "Purchase History", path: "/admin/dashboard/purchase-history" },
      { name: "Loyalty Programs", path: "/admin/dashboard/loyalty-programs" },
      { name: "Coupons & Gift Cards", path: "/admin/dashboard/coupons-and-gift-cards" },
      { name: "Personalized Offers", path: "/admin/dashboard/personalized-offers" },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [activePath, setActivePath]       = useState(pathname);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [openGroups, setOpenGroups]       = useState<Record<string, boolean>>({});
  const [mounted, setMounted]             = useState(false);
 
  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/admin/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
 
  useEffect(() => {
    setMounted(true);
    startTransition(() => setActivePath(pathname));
  }, [pathname]);
 
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };
    handleResize(); // set correct initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
 
  const toggleGroup = (name: string) =>
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <div className="h-dvh overflow-hidden bg-gray-50 font-nunito">

      {/* ══════════ Sidebar ══════════ */}
      <aside
        className={`scrollbar-none fixed inset-y-0 left-0 z-30 flex h-dvh shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white transition-all duration-200 lg:sticky lg:top-0 lg:z-auto ${isSidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-6 py-5 ${!isSidebarOpen ? "justify-center px-3" : ""}`}>
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
            <Image src="/Images/Logo.png" alt="FlutterFlirt POS logo" fill className="object-contain" />
          </div>
          {isSidebarOpen && (
            <span className="whitespace-nowrap font-poppins text-lg font-semibold text-gray-800">
              FlutterFlirt POS
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className={`flex-1 space-y-1 py-4 ${isSidebarOpen ? "px-3" : "px-2"}`}>
          {menuItems.map((item) => {
            const isActive = item.path
              ? activePath === item.path || activePath.startsWith(`${item.path}/`)
              : false;
            const groupOpen = !!openGroups[item.name];

            if (item.subItems) {
              return (
                <div key={item.name}>
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.name)}
                    title={!isSidebarOpen ? item.name : undefined}
                    className={`group relative flex w-full items-center justify-between rounded-lg px-3 py-2.5 transition-all duration-200 ${!isSidebarOpen ? "justify-center" : ""
                      } text-gray-700 hover:bg-[#622581]/10 hover:text-[#622581]`}
                  >
                    <span className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-[#622581] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 shrink-0" />
                      {isSidebarOpen && (
                        <span className="font-nunito text-sm font-medium">{item.name}</span>
                      )}
                    </div>
                    {isSidebarOpen && (
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${groupOpen ? "rotate-180" : ""}`} />
                    )}
                  </button>

                  {groupOpen && isSidebarOpen && (
                    <div className="ml-9 mt-1 space-y-1">
                      {item.subItems.map((sub) => {
                        const isSubActive = activePath === sub.path;
                        return (
                          <Link
                            key={sub.name}
                            href={sub.path}
                            onClick={() => setActivePath(sub.path)}
                            className={`group relative block rounded-lg px-3 py-2 font-nunito text-sm transition-all duration-200 ${isSubActive
                                ? "bg-[#622581]/10 font-semibold text-[#622581]"
                                : "text-gray-600 hover:bg-[#622581]/10 hover:text-[#622581]"
                              }`}
                          >
                            <span
                              className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-[#622581] transition-opacity duration-200 ${isSubActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                }`}
                            />
                            {sub.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.path!}
                onClick={() => setActivePath(item.path!)}
                title={!isSidebarOpen ? item.name : undefined}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${!isSidebarOpen ? "justify-center" : ""
                  } ${isActive
                    ? "bg-[#622581]/10 text-[#622581]"
                    : "text-gray-700 hover:bg-[#622581]/10 hover:text-[#622581]"
                  }`}
              >
                <span
                  className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-[#622581] transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                />
                <item.icon className="h-5 w-5 shrink-0 transition-colors duration-200" />
                {isSidebarOpen && (
                  <span className="font-nunito text-sm font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <button
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-black/20 lg:hidden"
          aria-label="Close sidebar overlay"
        />
      )}

      {/* ══════════ Main area ══════════ */}
      <div
        className={`h-dvh min-w-0 transition-all duration-200 ${isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
          }`}
      >
        {/* Header */}
        <header
          className={`fixed left-0 right-0 top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-3 py-3 transition-all duration-200 sm:px-6 ${isSidebarOpen ? "lg:left-64" : "lg:left-20"
            }`}
        >
          {/* Left: toggle + avatar + greeting */}
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
              <Image src="/Images/Avatar.png" alt="Admin avatar" fill className="object-cover" />
            </div>
            <h1 className="hidden font-poppins text-xl font-semibold text-gray-800 sm:block">
              Welcome back!
            </h1>
          </div>

          {/* Right: search + bell + profile */}
          <div className="flex items-center gap-1 sm:gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="w-48 rounded-lg border border-gray-200 py-2 pl-9 pr-4 font-nunito text-sm outline-none transition focus:border-[#622581] focus:ring-2 focus:ring-[#622581]/30 lg:w-64"
              />
            </div>
            <button
              type="button"
              className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-[#622581]/10 hover:text-[#622581]"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
 
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="p-2 text-gray-500 hover:text-[#622581] hover:bg-[#622581]/10 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <UserCog className="w-5 h-5" />
            </button>
 
            {isProfileOpen && (
              <div className="absolute right-4 top-14 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#622581]/10 hover:text-[#622581] transition-colors duration-200 cursor-pointer">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#622581]/10 hover:text-[#622581] transition-colors duration-200 cursor-pointer">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
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
