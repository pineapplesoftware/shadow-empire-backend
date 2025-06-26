// app/api/auth/login/route.ts

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

export async function POST(req: Request) {
  const { email, password } = await req.json()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.json({ message: 'Error', error: error.message }, { status: 401 })
  }

  return NextResponse.json({
    message: 'Login exitoso',
    user: data.user,
    session: data.session,
  })
}
