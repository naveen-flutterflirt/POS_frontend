export default function Page() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-poppins text-2xl font-bold text-gray-900"></h1>
        <div className="mt-1 flex items-center gap-1.5 font-nunito text-sm text-gray-500">
          <span>Inventory</span>
          <span className="text-base leading-none">›</span>
          <span className="font-semibold text-gray-700"></span>
        </div>
      </div>
      <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="font-nunito text-sm text-gray-500">Content coming soon.</p>
      </div>
    </div>
  );
}
