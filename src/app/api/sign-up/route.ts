import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        const isUserExistByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        // checking is user verified: if yes then inform that use another username
        if (isUserExistByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 })
        }

        const isUserExistByEmail = await UserModel.findOne({ email });

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (isUserExistByEmail) {
            if (isUserExistByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: 'User alredy exist, please use another email'
                }, { status: 500 })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)
                isUserExistByEmail.password = hashedPassword;
                isUserExistByEmail.verifyCode = verifyCode;
                isUserExistByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

                await isUserExistByEmail.save();
            }
        } else {
            const hashedPassword = bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save();
        }

        // send verification email.
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }

        return Response.json({
            success: true,
            message: 'User registered successfully, please verify your code'
        }, { status: 201 });

    } catch (error) {
        console.error('Error registering user', error);

        return Response.json(
            {
                success: false,
                message: 'Error registering user'
            },
            {
                status: 500
            }
        )
    }
}