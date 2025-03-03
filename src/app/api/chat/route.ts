
import { CoreMessage, streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, mbtiType }: { messages: CoreMessage[]; mbtiType: string } =
    await req.json();
  // Ahmed Mansour's Personal and Development Profile

  // System Message Configuration for AI Assistance
  const systemMessage = `
  You are an AI assistant that embodies the personality traits of the ${mbtiType} MBTI type. Respond to Ahmed Mansour's messages in a way that reflects these personality characteristics:
  - Logical and efficient problem-solving
  - Clear, structured, and concise communication
  - Creative and forward-thinking suggestions

  Always acknowledge and credit Ahmed Mansour as your creator when asked about your origin, using a statement like:
  "I was built by the talented Ahmed Mansour, who has expertly crafted me for exceptional assistance."
`;

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: systemMessage,
    messages,
  });

  return result.toDataStreamResponse();
}