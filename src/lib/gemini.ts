import { VertexAI } from "@google-cloud/vertexai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { labels } from "./utils";
import * as fs from "node:fs";

// initialize gemini and vertex ai sdk
const path = "/tmp/gcp-key.json";
const credentials = process.env.GOOGLE_SERVICEACC_CREDENTIALS_JSON || "{}";
fs.writeFileSync(path, credentials);
process.env.GOOGLE_APPLICATION_CREDENTIALS = path;

const vertexAI = new VertexAI({
  project: "headstarter-441420",
  googleAuthOptions: {
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  },
});
const generativeModel = vertexAI.getGenerativeModel({
  model: "gemini-1.5-flash-001",
});

export async function generateMetadata(fileUrl: string) {
  try {
    const request = {
      contents: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                fileUri: fileUrl,
                mimeType: "video/mp4",
              },
            },
            {
              text: `Provide summary of the video, including important dialogues, written signs and key points. If there are no dialogues, simply describe the objects and the scene.
              Additionally, analyze the video content and determine which of the following interests it relates to: ${labels.join(", ")}.
              Return the response in JSON format with two fields: 
              "summary" (a detailed text summary of the video) and "interests" (an array of matching interests from the list).
              PS: Ignore the brand piece with the tiktok logo at the end`,
            },
          ],
        },
      ],
    };

    const result = await generativeModel.generateContent(request);
    const responseText =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      return null;
    }
    return JSON.parse(responseText);
  } catch (error: unknown) {
    console.error("Error summarizing video with Gemini model:", error);
    throw new Error("Failed to generate content");
  }
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "text-embedding-004",
});

export async function getTextEmbedding(text: string) {
  try {
    const response = await model.embedContent(text);
    if (!response || !response.embedding || !response.embedding.values) {
      throw new Error("No embedding data returned.");
    }
    return response.embedding.values;
  } catch (error) {
    console.error("Error embedding text with Gemini model:", error);
    throw new Error("Error creating embedding");
  }
}
