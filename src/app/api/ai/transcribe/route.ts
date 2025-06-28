import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import { config } from 'dotenv';
import OpenAI from 'openai';

config(); // carga las variables de entorno

export const configUpload = {
  api: {
    bodyParser: false
  }
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: NextRequest) {
  try {
    const form = formidable({ multiples: false });
    const data = await new Promise<any>((resolve, reject) => {
    interface ParsedForm {
      fields: formidable.Fields;
      files: formidable.Files;
    }

    form.parse(req as any, (err: any, fields: formidable.Fields, files: formidable.Files) => {
      if (err) reject(err);
      resolve({ fields, files } as ParsedForm);
    });
    });

    const file = data.files.file;
    const path = Array.isArray(file) ? file[0].filepath : file.filepath;

    const transcript = await openai.audio.transcriptions.create({
      file: fs.createReadStream(path),
      model: "whisper-1"
    });

    return NextResponse.json({ text: transcript.text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Transcription failed' }, { status: 500 });
  }
}
