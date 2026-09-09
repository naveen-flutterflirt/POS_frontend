"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Layers,
  Tag,
  Package,
  CreditCard,
  UserCog,
  Warehouse,
  Store,
  Printer,
  ReceiptText,
  Users,
  X,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from 'aws-amplify/auth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {

  // Mobile sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Profile dropdown state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Error signing out of Cognito:', err);
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    router.replace("/admin/login");
  };

  // Close mobile sidebar when navigating/resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close mobile sidebar when Escape is pressed
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="h-dvh overflow-hidden bg-gray-50 font-nunito">
      {/* ==================== DESKTOP SIDEBAR ==================== */}
      <aside
        className={`
					fixed inset-y-0 left-0 z-30 hidden
					h-dvh flex-col overflow-y-auto
					border-r border-gray-200 bg-white
					transition-all duration-200
					lg:flex w-64
				`}
      >
        {/* Logo */}
        <div
          className={`
						flex items-center gap-3 px-6 py-5
					`}
        >
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
            <Image
              src="/Images/icon.svg"
              alt="FlutterFlirt POS logo"
              fill
              sizes="40px"
              className="object-contain"
            />
          </div>

          <span className="whitespace-nowrap font-poppins text-lg font-semibold text-gray-800">
            FlutterFlirt POS
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <SidebarLink
            href="/admin/dashboard"
            label="Dashboard"
            icon={<LayoutDashboard className="h-5 w-5 shrink-0" />}

          />
          <SidebarLink
            href="/admin/dashboard/categories"
            label="Category Management"
            icon={<Layers className="h-5 w-5 shrink-0" />}
          />
          <SidebarLink
            href="/admin/dashboard/price-management"
            label="Price Management"
            icon={<Tag className="h-5 w-5 shrink-0" />}

          />

          <SidebarLink
            href="/admin/dashboard/product-management"
            label="Product Management"
            icon={<Package className="h-5 w-5 shrink-0" />}

          />

          <SidebarLink
            href="/admin/dashboard/payment-details"
            label="Payment Details"
            icon={<CreditCard className="h-5 w-5 shrink-0" />}

          />

          <SidebarLink
            href="/admin/dashboard/cashier"
            label="Cashier"
            icon={<UserCog className="h-5 w-5 shrink-0" />}

          />

          <SidebarLink
            href="/admin/dashboard/inventory"
            label="Inventory"
            icon={<Warehouse className="h-5 w-5 shrink-0" />}

          />

          <SidebarLink
            href="/admin/dashboard/store-management"
            label="Store Management"
            icon={<Store className="h-5 w-5 shrink-0" />}

          />

          <SidebarLink
            href="/admin/dashboard/print-management"
            label="Print Management"
            icon={<Printer className="h-5 w-5 shrink-0" />}

          />

          <SidebarLink
            href="/admin/dashboard/tax-gst-management"
            label="Tax/GST Management"
            icon={<ReceiptText className="h-5 w-5 shrink-0" />}

          />

          <SidebarDropdown
            label="Customer Management"
            icon={<Users className="h-5 w-5 shrink-0" />}
          >
            <SidebarLink href="/admin/dashboard/customers" label="Customer Profiles" />
            <SidebarLink href="/admin/dashboard/loyalty" label="Loyalty Programs" />
            <SidebarLink href="/admin/dashboard/personalized-offers" label="Personalized Offers" />
            <SidebarLink href="/admin/dashboard/purchase-history" label="Purchase History" />
          </SidebarDropdown>
        </nav>
      </aside>

      {/* ==================== MOBILE SIDEBAR ==================== */}
      <aside
        className={`
					fixed inset-y-0 left-0 z-40
					flex h-dvh w-64 flex-col
					overflow-y-auto border-r border-gray-200 bg-white
					transition-transform duration-200
					lg:hidden
					${isMobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }
				`}
      >
        {/* Mobile Logo */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
              <Image
                src="/Images/icon.svg"
                alt="FlutterFlirt POS logo"
                fill
                sizes="40px"
                className="object-contain"
              />
            </div>

            <span className="whitespace-nowrap font-poppins text-lg font-semibold text-gray-800">
              FlutterFlirt POS
            </span>
          </div>

          <button
            type="button"
            onClick={closeMobileSidebar}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          <MobileSidebarLink
            href="/admin/dashboard"
            label="Dashboard"
            icon={<LayoutDashboard className="h-5 w-5" />}
            onClick={closeMobileSidebar}
          />

          <MobileSidebarLink
            href="/admin/dashboard/categories"
            label="Category Management"
            icon={<Layers className="h-5 w-5" />}
            onClick={closeMobileSidebar}
          />

          <MobileSidebarLink
            href="/admin/dashboard/price-management"
            label="Price Management"
            icon={<Tag className="h-5 w-5" />}
            onClick={closeMobileSidebar}
          />

          <MobileSidebarLink
            href="/admin/dashboard/product-management"
            label="Product Management"
            icon={<Package className="h-5 w-5" />}
            onClick={closeMobileSidebar}
          />

          <MobileSidebarLink
            href="/admin/dashboard/payment-details"
            label="Payment Details"
            icon={<CreditCard className="h-5 w-5" />}
            onClick={closeMobileSidebar}
          />

          <MobileSidebarLink
            href="/admin/dashboard/cashier"
            label="Cashier"
            icon={<UserCog className="h-5 w-5" />}
            onClick={closeMobileSidebar}
          />

          <MobileSidebarLink
            href="/admin/dashboard/inventory"
            label="Inventory"
            icon={<Warehouse className="h-5 w-5" />}
            onClick={closeMobileSidebar}
          />

          <MobileSidebarLink
            href="/admin/dashboard/store-management"
            label="Store Management"
            icon={<Store className="h-5 w-5" />}
            onClick={closeMobileSidebar}
          />

          <MobileSidebarLink
            href="/admin/dashboard/print-management"
            label="Print Management"
            icon={<Printer className="h-5 w-5" />}
            onClick={closeMobileSidebar}
          />

          <MobileSidebarLink
            href="/admin/dashboard/tax-gst-management"
            label="Tax/GST Management"
            icon={<ReceiptText className="h-5 w-5" />}
            onClick={closeMobileSidebar}
          />
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isMobileSidebarOpen && (
        <button
          type="button"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          aria-label="Close sidebar overlay"
        />
      )}

      {/* ==================== MAIN AREA ==================== */}
      <div
        className={`
					h-dvh min-w-0
					transition-all duration-200
					lg:ml-64
				`}
      >
        {/* ==================== HEADER ==================== */}
        <header
          className={`
						fixed right-0 top-0 z-20
						flex h-16 items-center justify-between
						border-b border-gray-200 bg-white
						px-3 py-3
						transition-all duration-200
						sm:px-6
						lg:left-64
						left-0
					`}
        >
          <div className="flex items-center gap-3">

            {/* Mobile menu */}
            <button
              type="button"
              onClick={() =>
                setIsMobileSidebarOpen(true)
              }
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-[#622581]/10 hover:text-[#622581] lg:hidden"
              aria-label="Open sidebar"
            >
              <Layers className="h-5 w-5" />
            </button>

            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
              <Image
                src="/Images/Avatar.png"
                alt="Admin avatar"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>

            <h1 className="hidden font-poppins text-xl font-semibold text-gray-800 sm:block">
              Welcome back!
            </h1>
          </div>

          <div className="flex items-center gap-1 sm:gap-4">


            <button
              type="button"
              className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-[#622581]/10 hover:text-[#622581]"
              aria-label="Notifications"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
              </svg>

              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="cursor-pointer rounded-lg p-2 text-gray-500 transition-all duration-200 hover:bg-[#622581]/10 hover:text-[#622581]"
                aria-label="User settings"
              >
                <UserCog className="h-5 w-5" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-12 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg z-20">
                  <button className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-[#622581]/10 hover:text-[#622581]">
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-[#622581]/10 hover:text-[#622581]"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ==================== PAGE CONTENT ==================== */}
        <main className="scrollbar-none h-full min-w-0 overflow-y-auto px-3 pb-6 pt-20 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}

/* ============================================================
   DESKTOP SIDEBAR LINK
============================================================ */

function SidebarLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
}) {
  const pathname = usePathname();
  // Exact match for dashboard root, otherwise startsWith to keep active on child pages
  const isActive = href === "/admin/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`
				group relative flex items-center gap-3
				rounded-lg px-3 py-2.5
				transition-all duration-200
				${isActive
          ? "bg-[#622581]/10 text-[#622581]"
          : "text-gray-700 hover:bg-[#622581]/10 hover:text-[#622581]"
        }
			`}
      title={label}
    >
      <span
        className={`
					absolute bottom-0 left-0 top-0 w-1 rounded-r-full
					bg-[#622581]
					${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
				`}
      />

      {icon && icon}

      <span className="whitespace-nowrap font-nunito text-sm font-medium">
        {label}
      </span>
    </Link>
  );
}

/* ============================================================
   DESKTOP DROPDOWN
============================================================ */

function SidebarDropdown({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`
					group relative flex w-full items-center
					rounded-lg px-3 py-2.5
					text-gray-700
					transition-all duration-200
					hover:bg-[#622581]/10 hover:text-[#622581]
					justify-between
				`}
        title={label}
      >
        <span
          className="
						absolute bottom-0 left-0 top-0 w-1
						rounded-r-full bg-[#622581]
						opacity-0 transition-opacity
						group-hover:opacity-100
					"
        />

        <div className="flex items-center gap-3">
          {icon}

          <span className="font-nunito text-sm font-medium">
            {label}
          </span>
        </div>

        <ChevronDown
          className={`
							h-4 w-4 transition-transform duration-200
							${open ? "rotate-180" : ""}
						`}
        />
      </button>

      {open && (
        <div className="ml-11 mt-1 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MOBILE SIDEBAR LINK
============================================================ */

function MobileSidebarLink({
  href,
  label,
  icon,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  const pathname = usePathname();
  const isActive = href === "/admin/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200
        ${isActive
          ? "bg-[#622581]/10 text-[#622581]"
          : "text-gray-700 hover:bg-[#622581]/10 hover:text-[#622581]"
        }
      `}
    >
      <span
        className={`
          absolute bottom-0 left-0 top-0 w-1 rounded-r-full bg-[#622581] transition-opacity
          ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
        `}
      />

      {icon}

      <span className="font-nunito text-sm font-medium">
        {label}
      </span>
    </Link>
  );
}