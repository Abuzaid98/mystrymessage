import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import z from "zod";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect();

    try {

        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username'),
        }

        const result = UsernameQuerySchema.safeParse(queryParam)

        // console.log(result, "result");

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];

            return Response.json(
                {
                    success: false,
                    message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "Invalid query parameter"
                }, { status: 400 }
            )
        }

        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "username is already taken"
            }, { status: 500 })
        }

        return Response.json({
            success: true,
            message: "username is unique"
        }, { status: 200 })


    } catch (error) {
        // console.log("Something error with checking username", error);

        return Response.json(
            {
                success: false,
                message: "Error Checkinf username"
            },
            { status: 500 }
        )
    }
}