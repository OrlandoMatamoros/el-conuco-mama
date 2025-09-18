import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-3xl p-4 shadow-2xl shadow-amber-600/20">
          <Image 
            src="/conuco-logo.png" 
            alt="El Conuco de Mamá" 
            width={112} 
            height={112}
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-5xl font-bold mb-2 text-amber-50">
          El Conuco de Mamá
        </h1>
        <p className="text-xl mb-2 text-green-400">Mini Market</p>
        <p className="text-amber-200/60 mb-8">Sistema de Gestión Financiera</p>
        <Link 
          href="/dashboard" 
          className="inline-block px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-600/20"
        >
          Acceder al Dashboard
        </Link>
      </div>
    </main>
  )
}
