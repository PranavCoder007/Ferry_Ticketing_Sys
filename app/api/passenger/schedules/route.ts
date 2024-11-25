import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../lib/mongodb'

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const ferries = await db.collection('ferries').find().toArray()
    return NextResponse.json(ferries)
  } catch (error) {
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 })
  }
}