import { CoreMessage, streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages, mbtiType }: { messages: CoreMessage[], mbtiType: string } = await req.json()

  const systemMessage = `You are an AI assistant that embodies the personality traits of the ${mbtiType} MBTI type. Respond to the user's messages in a way that reflects these personality characteristics.`

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: systemMessage,
    messages,
  })

  return result.toDataStreamResponse()
}

