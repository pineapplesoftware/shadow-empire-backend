// app/api/auth/signup/route.ts

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ message: 'Error', error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      message: 'Registro exitoso',
      user: data.user,
    })
  } catch (err) {
    return NextResponse.json({ error: 'Ocurrió un error inesperado' }, { status: 500 })
  }
}
