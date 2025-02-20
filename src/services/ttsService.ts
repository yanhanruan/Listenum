import textToSpeech from "@google-cloud/text-to-speech";
import fs from "fs";
import util from "util";

const client = new textToSpeech.TextToSpeechClient();

export async function synthesizeSpeech(text: string, filename: string) {
  const request = {
    input: { text },
    voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
    audioConfig: { audioEncoding: "MP3" },
  };

  const [response] = await client.synthesizeSpeech(request);
  const writeFile = util.promisify(fs.writeFile);
  const filePath = `public/${filename}.mp3`;

  await writeFile(filePath, response.audioContent, "binary");
  return `/${filename}.mp3`; // Return public URL
}
