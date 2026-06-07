import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

let client: Groq;

function getClient(): Groq {
  if (!client) {
    client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return client;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function getChatResponse(messages: Message[]): Promise<string> {
  const response = await getClient().chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      ...messages,
    ],
    max_tokens: 1000,
  });

  return response.choices[0].message.content ?? 'No response';
}