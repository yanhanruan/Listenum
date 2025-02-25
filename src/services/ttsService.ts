import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { SdkStream } from "@aws-sdk/types";
import { Readable } from "stream";
import { streamToBuffer } from "@/lib/streamUtils";

// Singleton client mode (lazy initialization)
let cachedClient: PollyClient;

function getPollyClient(): PollyClient {
  if (!cachedClient) {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error("AWS_CREDENTIALS_NOT_CONFIGURED");
    }
    
    cachedClient = new PollyClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  return cachedClient;
}

// Core service interface
export interface TtsService {
  synthesize(text: string): Promise<Uint8Array>;
}

// AWS implementation class
export class AwsPollyService implements TtsService {
  async synthesize(text: string): Promise<Uint8Array> {
    try {
      const client = getPollyClient();
      const command = new SynthesizeSpeechCommand({
        OutputFormat: "mp3",
        Text: text,
        VoiceId: "Joanna",
        Engine: "neural",
      });

      const response = await client.send(command);
      return streamToBuffer(response.AudioStream as SdkStream<Readable>);
    } catch (error: any) {
      throw new TtsError(
        error.$metadata?.httpStatusCode || 500,
        "AWS_SYNTHESIS_FAILED",
        error.message
      );
    }
  }
}

// Custom error type
export class TtsError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message?: string
  ) {
    super(message);
    Object.setPrototypeOf(this, TtsError.prototype);
  }
}