// app/api/publish/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const data = await req.json();

  console.log("RECIBIDO DESDE N8N:", data);

  // Simulación: muestra qué recibirías desde el modelo
  // En el futuro, aquí conectarás con las APIs de redes sociales

  return NextResponse.json({
    status: "ok",
    mensaje: "Video recibido, simulando publicación"
  });
}
