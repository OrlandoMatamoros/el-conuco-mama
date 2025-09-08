export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex items-center">
            <span className="text-4xl mr-3">🏪</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">El Conuco de Mamá</h1>
              <p className="text-sm text-gray-600">Mini Market • Brooklyn, NY</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Ventas Hoy</h2>
            <p className="text-3xl font-bold text-green-600">$1,247.50</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Clientes</h2>
            <p className="text-3xl font-bold text-blue-600">67</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Margen</h2>
            <p className="text-3xl font-bold text-orange-600">35.4%</p>
          </div>
        </div>
      </main>
    </div>
  );
}
