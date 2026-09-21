import UserModel from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { Message } from '@/models/User';
import returnResponse from '@/lib/returnResponse';

export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne({ username }).exec();

        if (!user) {
            return returnResponse(false, 'User not found', 404);
        }

        // Check if the user is accepting messages
        if (!user.isAcceptingMessage) {
            return returnResponse(false, 'User is not accepting messages', 403);
        }

        const newMessage = { content, createdAt: new Date() };

        // Push the new message to the user's messages array
        user.messages.push(newMessage as Message);
        await user.save();

        return returnResponse(true, 'Message sent successfully', 201);
    } catch (error) {
        console.error('Error adding message:', error);
        return returnResponse(false, 'Internal server error', 500);
    }
}