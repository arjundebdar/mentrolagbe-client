
import { redirect } from "next/navigation";

export default async function CheckoutPage({ searchParams }) {
    const params = await searchParams;
    const planId = params.plan;

    // ১. প্ল্যান আইডি না থাকলে প্রাইসিং পেজে রিডাইরেক্ট করুন
    if (!planId || planId !== "paid") {
        redirect("/pricing");
    }

    // ২. এখানে সার্ভার সাইড থেকে ইউজারের তথ্য চেক করতে পারেন (যেমন: সেশন বা কুকি থেকে)
    // const session = await auth();
    // if (!session) redirect("/login");

    const planDetails = {
        name: "Paid Plan (MentorLagbe)",
        price: 499,
        currency: "BDT",
    };

    // ৩. পেমেন্ট ইনিশিয়েট করার ফাংশন (Server Action)
    async function handlePaymentInitiate() {
        "use server";

        // এখানে পেমেন্ট গেটওয়ে (যেমন: SSLCommerz / bKash) API কল করতে হবে
        // এবং গেটওয়ে থেকে প্রাপ্ত পেমেন্ট ইউরল (paymentUrl) রিটার্ন করতে হবে

        // উদাহরণ স্বরূপ:
        // const paymentUrl = await createSSLCommerzSession(planDetails);
        // redirect(paymentUrl);
    }

    return (
        <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Checkout Summary</h1>
                <p className="text-slate-500 mb-6">Review your order details before proceeding to payment.</p>

                <div className="border-t border-b border-slate-200 py-4 mb-6 space-y-3">
                    <div className="flex justify-between text-slate-700">
                        <span>{planDetails.name}</span>
                        <span className="font-semibold">${planDetails.price}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-sm">
                        <span>Billing Cycle</span>
                        <span>Monthly</span>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                    <span className="font-bold text-slate-900">Total Payable</span>
                    <span className="text-2xl font-extrabold text-emerald-600">${planDetails.price}</span>
                </div>

                {/* Server Action দিয়ে পেমেন্ট শুরু করার ফর্ম */}
                <form action={handlePaymentInitiate}>
                    <button
                        type="submit"
                        className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                        Proceed to Payment $({planDetails.price})
                    </button>
                </form>
            </div>
        </div>
    );
}