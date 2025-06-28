import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { videoUrl, caption, apiKey, apiSecret, accessToken, accessSecret } = body;

  try {
    // 1. Descargar el video
    const videoRes = await fetch(videoUrl);
    const videoBuffer = Buffer.from(await videoRes.arrayBuffer());

    // 2. Autenticarse en Twitter
    const client = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken: accessToken,
      accessSecret: accessSecret,
    });

    const rwClient = client.readWrite;

    // 3. Subir el video
    const mediaId = await rwClient.v1.uploadMedia(videoBuffer, {
      type: 'video/mp4',
    });

    // 4. Crear el tweet con el video
    const tweet = await rwClient.v2.tweet({
      text: caption,
      media: { media_ids: [mediaId] },
    });

    return NextResponse.json(tweet);
  } catch (err: any) {
    return NextResponse.json({ error: 'Twitter post failed', details: err.message }, { status: 500 });
  }
}
