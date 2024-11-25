import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    await db.collection('ferries').deleteOne({ _id: new ObjectId(params.id) })
    return NextResponse.json({ message: 'Ferry canceled successfully' })
  } catch (error) {
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 })
  }
}