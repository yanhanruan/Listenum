import { NextRequest, NextResponse } from "next/server";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { SdkStream } from "@aws-sdk/types";
import { Readable } from "stream";

// Stream conversion utility function
async function streamToBuffer(stream: SdkStream<Readable>): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks)));
    });
}

// Validate before initializing the client
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS credentials are not configured");
}

const client = new PollyClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

// Handle POST requests
// Optimized POST handling logic
export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json();
        if (!text) return NextResponse.json({ error: "Missing text parameter" }, { status: 400 });

        const command = new SynthesizeSpeechCommand({
            OutputFormat: "mp3",
            Text: text,
            VoiceId: "Joanna",
            Engine: "neural",
        });

        const response = await client.send(command);
        // Convert stream to Uint8Array
        const audioBuffer = await streamToBuffer(response.AudioStream as SdkStream<Readable>);

        return new NextResponse(audioBuffer, {
            headers: {
                "Content-Type": "audio/mpeg",
                "Content-Length": audioBuffer.length.toString(),
            },
        });
    } catch (error: any) {
        // Simplified error logging to avoid leaking sensitive information
        console.error("AWS Polly call failed:", error.message);
        return NextResponse.json(
            { error: "Speech synthesis failed" },
            { status: error.$metadata?.httpStatusCode || 500 }
        );
    }
}