import { openai } from "@ai-sdk/openai";
import { createTextStreamResponse, streamText } from "ai";
import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST() {
    try {
        const prompt =
            "Create a list of three open-ended and engaging questions formatted as a single string. " +
            "Each question should be separated by '||'. " +
            "These questions are for an anonymous social messaging platform, like Qooh.me, " +
            "and should be suitable for a diverse audience. " +
            "Avoid personal or sensitive topics, focusing instead on universal themes " +
            "that encourage friendly interaction. " +
            "Ensure the questions are intriguing, friendly, and welcoming.";

        const result = streamText({
            model: openai("gpt-5"),
            prompt,
        });

        return createTextStreamResponse({
            stream: result.textStream,
        });

    } catch (error) {
        console.error("Error generating suggested messages:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to generate suggested messages",
            },
            { status: 500 }
        );
    }
}