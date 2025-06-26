// app/api/social/instagram/route.ts

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const { videoUrl, caption, token } = body;

  // Seguridad básica: validación de token
  if (token !== process.env.INSTAGRAM_TOKEN) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }

  // Simulación de publicación
  console.log('📤 Publicando en Instagram:', {
    videoUrl,
    caption
  });

  // Aquí iría la lógica real para publicar con la API de Meta
  return NextResponse.json({
    status: 'ok',
    message: 'Video simulado como publicado en Instagram',
  });
}
