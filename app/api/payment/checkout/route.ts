import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// 👉 Inicializa Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

// 👉 Inicializa Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    // 👉 Crea la sesión de pago
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Video AI Premium',
            },
            unit_amount: 800, // $8.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://shadow-ai.vercel.app/success',
      cancel_url: 'https://shadow-ai.vercel.app/cancel',
    })

    // 👉 Guarda el pago en Supabase
    const { error } = await supabase.from('payments').insert([
      {
        email: email,
        amount: 800,
        status: 'pending',
        stripe_id: session.id,
      },
    ])

    if (error) {
      console.error('Error al guardar en Supabase:', error.message)
    }

    // 👉 Devuelve la URL de pago
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Error al crear pago:', err)
    return NextResponse.json({ error: 'Error al procesar el pago' }, { status: 500 })
  }
}
