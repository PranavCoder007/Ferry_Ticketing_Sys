import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../lib/mongodb'

export async function POST(request: Request) {
  try {
    const ferryData = await request.json()
    const { db } = await connectToDatabase()
    await db.collection('ferries').insertOne(ferryData)
    return NextResponse.json({ message: 'Ferry added successfully' }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 })
  }
}