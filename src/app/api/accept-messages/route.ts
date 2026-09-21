import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import returnResponse from "@/lib/returnResponse";

export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user

    if (!session || !session?.user) {
        return returnResponse(false, "Not Authenticated", 401)
    }

    const userId = user._id

    const { acceptMessages } = await request.json()

    try {
        const udpatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )

        if (!udpatedUser) {
            return returnResponse(false, "Failed to update user status to accept messages", 401)
        }

        return returnResponse(true, "Message acceptance status updated", 200, udpatedUser)

    } catch (error) {
        console.log("Failed to update user status to accept messages", error)
        return returnResponse(false, "Failed to update user status to accept messages", 500)
    }
}

export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user

    if (!session || !session?.user) {
        return returnResponse(false, "Not Authenticated", 401)
    }

    const userId = user._id

    try {
        const foundUser = await UserModel.findById(userId);

        if (!foundUser) {
            return returnResponse(false, "User not found", 404)
        }
        return returnResponse(true, "Accepting message is enabled", 200, { isAcceptingMessages: foundUser.isAcceptingMessage })

    } catch (error) {
        const msg: string = "Error in getting message acceptance status";
        console.log(msg, error)
        return returnResponse(false, msg, 500)
    }
}