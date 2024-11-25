import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Await the params
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { message: 'ID is required' },
      { status: 400 }
    );
  }

  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: 'Invalid ID format' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json(); // Parse the request body

    const { db } = await connectToDatabase();
    const result = await db.collection('ferries').updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'No ferry found with the provided ID' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Ferry updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating ferry:', error);
    return NextResponse.json(
      { message: 'An error occurred while updating the ferry' },
      { status: 500 }
    );
  }
}
