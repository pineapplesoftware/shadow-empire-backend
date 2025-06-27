import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  console.log("🔥 Intentando login...");

  const body = await req.json()
  const { email, password } = body

  console.log("📨 Email recibido:", email)
  console.log("🔐 Password recibido:", password)

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )

  if (!email || !password) {
    console.log("⚠️ Faltan datos")
    return NextResponse.json({ error: 'Email y password requeridos' }, { status: 400 })
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    console.log("❌ Error al loguear:", error.message)
    return NextResponse.json({ error: error.message }, { status: 401 })
  }

  console.log("✅ Login exitoso:", data)
  return NextResponse.json({ message: 'Login exitoso', data }, { status: 200 })
}
