import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import z from "zod";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

