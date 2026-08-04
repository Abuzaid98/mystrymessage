// Syntax overload! It's a lot to memorize for interviews, but here's the breakdown:

import mongoose, { Document, Schema } from "mongoose";

// Define the interface extending mongoose's Document for type safety.
export interface Message extends Document {
    content: string;
    createdAt: Date;
}

// Create the schema for the Message model, with field types and validation.
const MessageSchema = new Schema<Message>({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

// Interface for the user document
export interface User extends Document {
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMessage: boolean,
    messages: Message[]
}

// Schema for the user
const UserSchema = new Schema<User>({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi, "Please use a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code is required"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "verify code expiry is required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema]
});

// This line checks if the 'User' model has already been registered in Mongoose (in mongoose.models).
// If it exists, it uses the existing model to avoid recompilation errors (which can occur during hot-reloading in development).
// If it does not exist, it creates a new model by calling mongoose.model() with the "User" name and the UserSchema.
const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;