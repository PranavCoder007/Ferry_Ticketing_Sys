import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const ferryData = await request.json()
    const { db } = await connectToDatabase()
    await db.collection('ferries').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: ferryData }
    )
    return NextResponse.json({ message: 'Ferry updated successfully' })
  } catch (error) {
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 })
  }
}