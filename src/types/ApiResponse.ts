import { Message } from "@/models/User";


export interface ApiResponse{
    success: boolean;
    message: string;
    status?: number;
    isAcceptingMessages?: boolean;
    messages?:Array<Message>;
}