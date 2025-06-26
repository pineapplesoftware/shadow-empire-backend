// app/api/payment/checkout/route.ts
import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil'
})

export async function POST(req: Request) {
  const { email } = await req.json()

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Publicación automática con IA',
              description: 'Publica en redes sociales usando Shadow Empire AI',
            },
            unit_amount: 800, // $8 USD
          },
          quantity: 1,
        },
      ],
      success_url: 'https://shadow-empire-backend.vercel.app/success',
      cancel_url: 'https://shadow-empire-backend.vercel.app/cancel',
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    return NextResponse.json({ error: 'Stripe error', details: err }, { status: 500 })
  }
}
