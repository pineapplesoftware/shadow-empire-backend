// src/app/api/ai/transcribe/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const blob = new Blob([buffer]);

  const apiForm = new FormData();
  apiForm.append("file", blob, file.name);
  apiForm.append("model", "whisper-1");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY || ""}`,
    },
    body: apiForm,
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json({ error: data.error }, { status: 500 });
  }

  return NextResponse.json({ transcription: data.text });
}
