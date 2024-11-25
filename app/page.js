'use client'

import { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import PassengerDashboard from './components/PassengerDashboard'
import AdminDashboard from './components/AdminDashboard'

export default function Home() {
  const [user, setUser] = useState(null)

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl text-center font-bold mb-8 text-gray-900">Ferry Ticketing System</h1>
        {!user ? (
          <div className="flex justify-center space-x-4">
            <Login setUser={setUser} />
            <Register />
          </div>
        ) : (
          user.role === 'admin' ? <AdminDashboard /> : <PassengerDashboard userId={user.userId} />
        )}
      </div>
    </main>
  )
}

