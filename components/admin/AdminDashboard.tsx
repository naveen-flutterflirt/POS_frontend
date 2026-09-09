"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  AlertTriangle,
  ReceiptText,
  RefreshCcw
} from "lucide-react";

// --- Mock Data ---
const salesData = [
  { name: "Mon", revenue: 4000, orders: 24 },
  { name: "Tue", revenue: 3000, orders: 18 },
  { name: "Wed", revenue: 5500, orders: 35 },
  { name: "Thu", revenue: 4500, orders: 28 },
  { name: "Fri", revenue: 6000, orders: 42 },
  { name: "Sat", revenue: 8000, orders: 55 },
  { name: "Sun", revenue: 7500, orders: 48 },
];

const categoryData = [
  { name: "Spices", value: 45 },
  { name: "Whole", value: 30 },
  { name: "Ground", value: 15 },
  { name: "Blends", value: 10 },
];
const COLORS = ["#622581", "#8B5CF6", "#C4B5FD", "#EDE9FE"];

const recentOrders = [
  { id: "#ORD-001", customer: "John Doe", date: "2026-08-24", amount: "$125.00", status: "Completed" },
  { id: "#ORD-002", customer: "Jane Smith", date: "2026-08-24", amount: "$45.50", status: "Processing" },
  { id: "#ORD-003", customer: "Mike Johnson", date: "2026-08-23", amount: "$210.00", status: "Pending" },
  { id: "#ORD-004", customer: "Emily Davis", date: "2026-08-23", amount: "$89.99", status: "Completed" },
  { id: "#ORD-005", customer: "Chris Wilson", date: "2026-08-22", amount: "$350.00", status: "Cancelled" },
];

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch on charts

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-poppins text-2xl font-bold text-gray-900 sm:text-3xl">Dashboard</h1>
        <p className="text-gray-500 mt-1 font-nunito">Here's what's happening with your store today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Revenue"
          value="$24,560"
          trend="+12.5%"
          isPositive={true}
          icon={<DollarSign className="w-6 h-6 text-[#622581]" />}
        />
        <KpiCard
          title="Total Orders"
          value="1,245"
          trend="+8.2%"
          isPositive={true}
          icon={<ShoppingCart className="w-6 h-6 text-blue-600" />}
        />
        <KpiCard
          title="Total Products"
          value="456"
          trend="+0.0%"
          isPositive={true}
          icon={<Package className="w-6 h-6 text-orange-500" />}
        />
        <KpiCard
          title="Total Customers"
          value="892"
          trend="-2.4%"
          isPositive={false}
          icon={<Users className="w-6 h-6 text-green-500" />}
        />
        <KpiCard
          title="Active Cashiers"
          value="12"
          trend="+2.0%"
          isPositive={true}
          icon={<UserCheck className="w-6 h-6 text-indigo-500" />}
        />
        <KpiCard
          title="Low Stock Items"
          value="24"
          trend="-15.0%"
          isPositive={true}
          icon={<AlertTriangle className="w-6 h-6 text-yellow-500" />}
        />
        <KpiCard
          title="GST Collected"
          value="$1,450"
          trend="+5.3%"
          isPositive={true}
          icon={<ReceiptText className="w-6 h-6 text-teal-500" />}
        />
        <KpiCard
          title="Refunds"
          value="$320"
          trend="-1.2%"
          isPositive={true}
          icon={<RefreshCcw className="w-6 h-6 text-rose-500" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-poppins text-lg font-semibold text-gray-800">Revenue Trend (Last 7 Days)</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#622581" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#622581" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  labelStyle={{ fontWeight: "bold", color: "#374151" }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#622581" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-poppins text-lg font-semibold text-gray-800 mb-4">Sales by Category</h2>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Order Pipeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-poppins text-lg font-semibold text-gray-800">Recent Orders Pipeline</h2>
          <button className="text-sm font-medium text-[#622581] hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 font-nunito">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- Subcomponents ---

function KpiCard({ title, value, trend, isPositive, icon }: { title: string; value: string; trend: string; isPositive: boolean; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 font-nunito mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 font-poppins">{value}</h3>
        </div>
        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#622581]/5 transition-colors">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-md ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {trend}
        </span>
        <span className="text-xs text-gray-400 font-nunito">vs last month</span>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700";
    case "Processing":
      return "bg-blue-100 text-blue-700";
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}
