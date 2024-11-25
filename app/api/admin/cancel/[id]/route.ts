import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  // Await the params object before accessing its properties
  const { id } = context.params;

  // Optional: Validate the ID format
  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: 'Invalid ID format' },
      { status: 400 }
    );
  }

  try {
    const { db } = await connectToDatabase();
    const deleteResult = await db.collection('ferries').deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { message: 'No ferry found with the provided ID' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Ferry canceled successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error canceling ferry:', error);
    return NextResponse.json(
      { message: 'An error occurred while canceling the ferry' },
      { status: 500 }
    );
  }
}
