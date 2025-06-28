import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();
import { config } from 'dotenv';
// Asegúrate de que dotenv se configure correctamente
dotenv.config({ path: '.env.local' }); // o el archivo que estés usando
// Si estás usando un archivo .env en la raíz del proyecto, puedes usar simplemente dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Missing text input." }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4", // puedes usar "gpt-3.5-turbo" si prefieres
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes transcripts into short, engaging text."
        },
        {
          role: "user",
          content: `Please summarize the following transcript:\n\n${text}`
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    const summary = completion.choices[0]?.message?.content;

    return NextResponse.json({ summary });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Summary failed." }, { status: 500 });
  }
}
