import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  console.log("🔥 Intentando crear usuario...");

  const body = await req.json()
  const { email, password } = body

  console.log("📨 Email:", email)
  console.log("🔐 Password:", password)

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )

  if (!email || !password) {
    console.log("⚠️ Datos incompletos")
    return NextResponse.json({ error: 'Email y password requeridos' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      console.log("❌ Error al crear usuario:", error.message)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log("✅ Usuario creado:", data)
    return NextResponse.json({ message: 'Usuario creado exitosamente', data }, { status: 200 })

  } catch (e) {
    console.error("🚨 Error inesperado:", e)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
