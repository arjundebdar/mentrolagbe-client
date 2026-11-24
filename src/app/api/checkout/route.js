import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '../../../lib/stripe'

export async function POST(request) {
    try {
        const headersList = await headers()
        const origin = headersList.get('origin') || process.env.BETTER_AUTH_URL || 'http://localhost:3000'

        let body = {}
        try {
            body = await request.json()
        } catch {
            body = {}
        }

        const {
            tuitionTitle = 'Mathematics Private Tuition',
            studentEmail,
            monthlyFee,
            applicationId,
        } = body

        const lineItems = monthlyFee
            ? [
                {
                    price_data: {
                        currency: 'bdt',
                        product_data: {
                            name: tuitionTitle,
                            description: 'Monthly tuition fee via MentorLagbe',
                        },
                        unit_amount: Math.round(Number(monthlyFee) * 100),
                    },
                    quantity: 1,
                },
            ]
            : [
                {
                    price: 'price_1UeDupGtdM5fEkSXHWZwDRqH',
                    quantity: 1,
                },
            ]

        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: 'payment',
            ...(studentEmail ? { customer_email: studentEmail } : {}),
            metadata: {
                ...(applicationId ? { applicationId: String(applicationId) } : {}),
                tuitionTitle,
            },
            success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/checkout?canceled=true`,
            integration_identifier: 'mentorlagbe_checkout_0001',
        })

        return NextResponse.json({ url: session.url, sessionId: session.id })
    } catch (err) {
        return NextResponse.json(
            { error: err.message || 'Failed to create checkout session' },
            { status: err.statusCode || 500 }
        )
    }
}