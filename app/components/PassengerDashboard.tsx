'use client'

import { useState, useEffect } from 'react'

export default function PassengerDashboard({ userId }) {
  const [ferries, setFerries] = useState([])
  const [selectedFerry, setSelectedFerry] = useState(null)
  const [seats, setSeats] = useState(1)

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

  const handleBooking = async () => {
    try {
      const response = await fetch('/api/passenger/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          passengerId: userId,
          ferryId: selectedFerry._id,
          seats: seats
        })
      })
      const data = await response.json()
      if (response.ok) {
        alert('Booking confirmed')
        fetchFerries()
        setSelectedFerry(null)
        setSeats(1)
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.error('Booking error:', error)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Ferry Schedules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ferries.map((ferry) => (
          <div key={ferry._id} className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{ferry.name}</h3>
            <p className="text-gray-900 text-base mb-2 font-medium">Route: {ferry.route}</p>
            <p className="text-gray-900 text-base mb-2 font-medium">Time: {ferry.time}</p>
            <p className="text-gray-900 text-base mb-2 font-medium">Available Seats: {ferry.availableSeats}</p>
            <button
              onClick={() => setSelectedFerry(ferry)}
              className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Select
            </button>
          </div>
        ))}
      </div>
      {selectedFerry && (
        <div className="mt-8 bg-white shadow-md rounded-lg p-4">
          <h3 className="text-2xl font-bold mb-6 text-gray-900">Book Ferry: {selectedFerry.name}</h3>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="seats">
              Number of Seats
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="seats"
              type="number"
              min="1"
              max={selectedFerry.availableSeats}
              value={seats}
              onChange={(e) => setSeats(parseInt(e.target.value))}
            />
          </div>
          <button
            onClick={handleBooking}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  )
}

