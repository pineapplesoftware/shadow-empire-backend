// app/api/social/youtube/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const data = await req.json()

  const { title, description, video_url, token } = data

  const youtubeToken = process.env.YOUTUBE_TOKEN

  if (!token || token !== youtubeToken) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }

  return NextResponse.json({
    status: 'ok',
    message: 'Video simulado como publicado en YouTube',
    data: {
      title,
      description,
      video_url,
    },
  })
}
