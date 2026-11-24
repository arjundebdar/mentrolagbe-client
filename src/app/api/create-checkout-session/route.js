
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request) {
    try {
        const { tuitionId, title, amount, studentEmail } =
            await request.json();

        if (!tuitionId || !title || !amount || !studentEmail) {
            return NextResponse.json(
                { message: "Missing required payment information" },
                { status: 400 }
            );
        }

        if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
            return NextResponse.json(
                { message: "Invalid payment amount" },
                { status: 400 }
            );
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],

            mode: "payment",

            customer_email: studentEmail,

            line_items: [
                {
                    price_data: {
                        currency: "bdt",
                        product_data: {
                            name: title,
                            description: `Tuition ID: ${tuitionId}`,
                        },
                        unit_amount: Math.round(Number(amount) * 100),
                    },
                    quantity: 1,
                },
            ],

            metadata: {
                tuitionId: String(tuitionId),
                studentEmail: String(studentEmail),
            },

            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/student/payment-success?session_id={CHECKOUT_SESSION_ID}`,

            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/student/payment-cancel`,
        });

        return NextResponse.json({
            success: true,
            url: session.url,
        });

    } catch (error) {
        console.error("Stripe Checkout Error:", error);

        return NextResponse.json(
            { message: "Failed to create checkout session" },
            { status: 500 }
        );
    }
}
