import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import mongoose from 'mongoose';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import returnResponse from '@/lib/returnResponse';

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user: User = session?.user;

    if (!session || !_user) {
        return returnResponse(false, 'Not authenticated', 401);
    }

    const userId = new mongoose.Types.ObjectId(_user._id);
    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },
        ]).exec();

        if (!user || user.length === 0) {
            return returnResponse(false, 'User not found', 404);
        }

        return returnResponse(true, 'Messages fetched successfully', 200, { messages: user[0].messages });
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return returnResponse(false, 'Internal server error', 500);
    }
}