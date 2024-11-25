import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(request: Request) {
  try {
    const { passengerId, ferryId, seats } = await request.json()
    const { db } = await connectToDatabase()

    const ferry = await db.collection('ferries').findOne({ _id: new ObjectId(ferryId) })
    if (!ferry || ferry.availableSeats < seats) {
      return NextResponse.json({ message: 'Not enough seats available' }, { status: 400 })
    }

    await db.collection('bookings').insertOne({ passengerId, ferryId, seats, date: new Date() })
    await db.collection('ferries').updateOne(
      { _id: new ObjectId(ferryId) },
      { $inc: { availableSeats: -seats } }
    )

    return NextResponse.json({ message: 'Booking confirmed' }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 })
  }
}