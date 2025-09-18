'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/dashboard')
  }, [router])
  
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">El Conuco de Mamá</h1>
        <p className="text-gray-600">Redirigiendo al dashboard...</p>
      </div>
    </div>
  )
}
