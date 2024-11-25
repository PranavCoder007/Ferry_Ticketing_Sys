import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { connectToDatabase } from '../../../../lib/mongodb'

export async function POST(request: Request) {
  try {
    const { username, password, role } = await request.json()
    const { db } = await connectToDatabase()

    const existingUser = await db.collection('users').findOne({ username })
    if (existingUser) {
      return NextResponse.json({ message: 'Username already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await db.collection('users').insertOne({ username, password: hashedPassword, role })

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 })
  }
}