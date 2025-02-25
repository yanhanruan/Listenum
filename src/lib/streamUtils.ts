// src/lib/streamUtils.ts
import { SdkStream } from "@aws-sdk/types";
import { Readable } from "stream";

export async function streamToBuffer(
  stream: SdkStream<Readable>
): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}