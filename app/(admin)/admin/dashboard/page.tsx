export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-poppins font-bold text-gray-900">Dashboard</h1>
      <p className="text-gray-600 mt-2 font-nunito">Welcome to your POS dashboard</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-nunito">Total Sales</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">$12,345</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-nunito">Orders</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">1,234</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-nunito">Products</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">456</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-nunito">Customers</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">789</p>
        </div>
      </div>
    </div>
  );
}
