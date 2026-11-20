import { CreditCard, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CreditCard size={30} className="text-green-600" />
                </div>

                <h1 className="text-2xl font-bold text-slate-800">
                    Upgrade to Pro
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                    Unlock premium features and enjoy more opportunities
                    with MentorLagbe.
                </p>

                <div className="my-6 rounded-xl bg-slate-50 p-4">
                    <h2 className="font-bold text-slate-800">
                        Pro Tutor Plan
                    </h2>
                    <p className="mt-2 text-3xl font-bold text-green-600">
                        $15
                        <span className="text-sm font-normal text-slate-500">
                            / month
                        </span>
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                        Unlimited tuition posts
                    </p>
                </div>

                <button
                    disabled
                    className="w-full cursor-not-allowed rounded-xl bg-green-600 px-5 py-3 font-semibold text-white opacity-60"
                >
                    <ShieldCheck className="mr-2 inline" size={18} />
                    Stripe Integration Pending
                </button>

                <Link
                    href="/dashboard/tutor"
                    className="mt-5 inline-block text-sm font-medium text-green-600 hover:underline"
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}