export default function InventoryDashboard() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-poppins text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="mt-1 flex items-center gap-1.5 font-nunito text-sm text-gray-500">
          <span>Inventory</span>
          <span className="text-base leading-none">›</span>
          <span className="font-semibold text-gray-700">Dashboard</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Stock",   value: "4,250" },
          { label: "Low Stock",     value: "18" },
          { label: "GRN Today",     value: "6" },
          { label: "Pending GRNs",  value: "3" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="font-nunito text-sm text-gray-500">{stat.label}</p>
            <p className="mt-1 font-poppins text-2xl font-semibold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
