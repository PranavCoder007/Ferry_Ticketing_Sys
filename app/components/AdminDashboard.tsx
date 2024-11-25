'use client'

import { useState, useEffect } from 'react'

export default function AdminDashboard() {
  const [ferries, setFerries] = useState([])
  const [newFerry, setNewFerry] = useState({ name: '', route: '', time: '', capacity: 0 })

  useEffect(() => {
    fetchFerries()
  }, [])

  const fetchFerries = async () => {
    try {
      const response = await fetch('/api/passenger/schedules')
      const data = await response.json()
      setFerries(data)
    } catch (error) {
      console.error('Error fetching ferries:', error)
    }
  }

  const handleAddFerry = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...newFerry, availableSeats: newFerry.capacity })
      })
      if (response.ok) {
        alert('Ferry added successfully')
        fetchFerries()
        setNewFerry({ name: '', route: '', time: '', capacity: 0 })
      } else {
        const data = await response.json()
        alert(data.message)
      }
    } catch (error) {
      console.error('Error adding ferry:', error)
    }
  }

  const handleUpdateFerry = async (id, updatedFerry) => {
    try {
      const response = await fetch(`/api/admin/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedFerry)
      })
      if (response.ok) {
        alert('Ferry updated successfully')
        fetchFerries()
      } else {
        const data = await response.json()
        alert(data.message)
      }
    } catch (error) {
      console.error('Error updating ferry:', error)
    }
  }

  const handleCancelFerry = async (id) => {
    try {
      const response = await fetch(`/api/admin/cancel/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        alert('Ferry canceled successfully')
        fetchFerries()
      } else {
        const data = await response.json()
        alert(data.message)
      }
    } catch (error) {
      console.error('Error canceling ferry:', error)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Admin Dashboard</h2>
      <form onSubmit={handleAddFerry} className="mb-8 bg-white border-2 border-gray-200 rounded-lg px-8 pt-6 pb-8">
        <h3 className="text-2xl font-bold mb-6 text-gray-900">Add New Ferry</h3>
        <div className="mb-6">
          <label className="block text-gray-900 text-base font-semibold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="appearance-none border-2 border-gray-200 rounded w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:border-blue-500"
            id="name"
            type="text"
            value={newFerry.name}
            onChange={(e) => setNewFerry({ ...newFerry, name: e.target.value })}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-900 text-base font-semibold mb-2" htmlFor="route">
            Route
          </label>
          <input
            className="appearance-none border-2 border-gray-200 rounded w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:border-blue-500"
            id="route"
            type="text"
            value={newFerry.route}
            onChange={(e) => setNewFerry({ ...newFerry, route: e.target.value })}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-900 text-base font-semibold mb-2" htmlFor="time">
            Time
          </label>
          <input
            className="appearance-none border-2 border-gray-200 rounded w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:border-blue-500"
            id="time"
            type="text"
            value={newFerry.time}
            onChange={(e) => setNewFerry({ ...newFerry, time: e.target.value })}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-900 text-base font-semibold mb-2" htmlFor="capacity">
            Capacity
          </label>
          <input
            className="appearance-none border-2 border-gray-200 rounded w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:border-blue-500"
            id="capacity"
            type="number"
            value={newFerry.capacity}
            onChange={(e) => setNewFerry({ ...newFerry, capacity: parseInt(e.target.value) })}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
        >
          Add Ferry
        </button>
      </form>

      <h3 className="text-2xl font-bold mb-6 text-gray-900">Manage Ferries</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ferries.map((ferry) => (
          <div key={ferry._id} className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h4 className="text-xl font-bold text-gray-900 mb-4">{ferry.name}</h4>
            <p className="text-gray-900 text-base mb-2 font-medium">Route: {ferry.route}</p>
            <p className="text-gray-900 text-base mb-2 font-medium">Time: {ferry.time}</p>
            <p className="text-gray-900 text-base mb-2 font-medium">Capacity: {ferry.capacity}</p>
            <p className="text-gray-900 text-base mb-4 font-medium">Available Seats: {ferry.availableSeats}</p>
            <div className="flex justify-between space-x-4">
              <button
                onClick={() => {
                  const updatedFerry = { ...ferry }
                  updatedFerry.time = prompt('Enter new time:', ferry.time) || ferry.time
                  handleUpdateFerry(ferry._id, updatedFerry)
                }}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg text-base focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              >
                Update
              </button>
              <button
                onClick={() => handleCancelFerry(ferry._id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg text-base focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

