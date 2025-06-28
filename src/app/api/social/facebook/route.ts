import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { videoUrl, caption, accessToken, pageId } = body;

  try {
    const response = await fetch(
      `https://graph.facebook.com/${pageId}/videos`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: accessToken,
          file_url: videoUrl,
          description: caption,
        }),
      }
    );

    const result = await response.json();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: 'Facebook post failed', details: err.message }, { status: 500 });
  }
}
