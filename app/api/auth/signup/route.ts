import { NextResponse } from 'next/server'

export async function POST() {
  console.log("🚀 /signup funcionando")
  return NextResponse.json({ message: "Funciona correctamente 🎉" })
}
