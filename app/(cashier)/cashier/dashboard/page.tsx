"use client";

import Link from "next/link";
import {
  BadgePercent,
  Receipt,
  RotateCcw,
  ShoppingBag,
} from "lucide-react";

const stats = [
  { title: "Today's Sales", value: "$1,450", icon: ShoppingBag, color: "text-green-600", bg: "bg-green-50" },
  { title: "Total Orders", value: "23", icon: Receipt, color: "text-blue-600", bg: "bg-blue-50" },
  { title: "Items Sold", value: "45", icon: BadgePercent, color: "text-purple-600", bg: "bg-purple-50" },
  { title: "Returns", value: "2", icon: RotateCcw, color: "text-red-600", bg: "bg-red-50" },
];

const recentOrders = [
  { id: "#001", customer: "John Doe", items: 3, total: "$25.00", payment: "UPI", status: "Completed" },
  { id: "#002", customer: "Jane Smith", items: 2, total: "$40.00", payment: "Cash", status: "Pending" },
  { id: "#003", customer: "Bob Wilson", items: 5, total: "$65.00", payment: "Card", status: "Completed" },
  { id: "#004", customer: "Alice Brown", items: 4, total: "$35.00", payment: "UPI", status: "Processing" },
];

const statusColors: Record<string, string> = {
  Completed: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
};

export default function CashierDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-nunito text-gray-500 font-medium">{stat.title}</p>
                <p className="text-2xl font-poppins font-semibold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-poppins font-medium text-gray-800">Recent Orders</h2>
          <Link
            href="/cashier/dashboard/sales"
            className="text-sm font-nunito text-[#622581] hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Order ID", "Customer", "Items", "Total", "Payment", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-nunito font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-nunito font-medium text-gray-700">{order.id}</td>
                  <td className="px-6 py-4 text-sm font-nunito text-gray-600">{order.customer}</td>
                  <td className="px-6 py-4 text-sm font-nunito text-gray-600">{order.items}</td>
                  <td className="px-6 py-4 text-sm font-nunito font-medium text-gray-700">{order.total}</td>
                  <td className="px-6 py-4 text-sm font-nunito text-gray-600">{order.payment}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-nunito font-medium ${statusColors[order.status]}`}
                    >
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
