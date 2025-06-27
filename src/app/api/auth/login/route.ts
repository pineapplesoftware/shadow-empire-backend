import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { email, password } = body

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )

  if (!email || !password) {
    return NextResponse.json({ error: 'Email y password requeridos' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({
      message: 'Login exitoso',
      user: data.user,
      session: data.session
    }, { status: 200 })

  } catch (e) {
    console.error("❌ Error inesperado:", e)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
