import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { NextApiRequest, NextApiResponse } from "next";

const client = new PollyClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text } = JSON.parse(req.body);
    
    const command = new SynthesizeSpeechCommand({
      OutputFormat: "mp3",
      Text: text,
      VoiceId: "Joanna", // 选择发音人
      Engine: "neural",  // 使用神经引擎
    });

    // 方法1：直接获取音频流
    // const response = await client.send(command);
    // res.setHeader("Content-Type", "audio/mpeg");
    // res.send(response.AudioStream);

    // 方法2：生成预签名URL（推荐）
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    res.status(200).json({ url });
    
  } catch (error) {
    console.error("Polly error:", error);
    res.status(500).json({ error: "Failed to synthesize speech" });
  }
}