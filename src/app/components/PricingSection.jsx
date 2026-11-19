"use client";

import { useRouter } from "next/navigation";
import { Check, Crown, Sparkles } from "lucide-react";

const plans = [
    {
        id: "free",
        name: "Free Plan",
        price: "0",
        description: "Perfect for getting started",
        features: [
            "1 Active Tuition Post",
            "Basic Tutor Profile",
            "Standard Listing Visibility",
            "View Tuition Applications",
            "Basic Dashboard",
        ],
        popular: false,
    },
    {
        id: "paid",
        name: "Paid Plan",
        price: "499",
        description: "Grow your tutoring opportunities",
        features: [
            "Unlimited Active Tuition Posts",
            "Premium Tutor Profile Badge",
            "Featured Tuition Listings",
            "Priority Listing Visibility",
            "Advanced Dashboard",
            "Priority Customer Support",
        ],
        popular: true,
    },
];

const PricingSection = () => {
    const router = useRouter();

    // এখানে প্যারামিটার হিসেবে planId রিসিভ করা হচ্ছে
    const handleSubscribe = (planId) => {
        if (planId === "free") {
            router.push("/dashboard");
        } else {
            router.push(`/checkout?plan=${planId}`);
        }
    };

    return (
        <section className="bg-slate-50 py-20 px-4" id="pricing">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                        Choose Your Perfect Plan
                    </h2>
                    <p className="text-slate-500 mt-4 max-w-xl mx-auto">
                        Start for free and upgrade anytime to unlock
                        more opportunities with MentorLagbe.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative bg-white rounded-2xl p-8 border-2
                            transition-all duration-300 hover:-translate-y-2
                            ${plan.popular
                                    ? "border-emerald-500 shadow-xl"
                                    : "border-slate-200 shadow-sm"
                                }`}
                        >
                            {plan.popular && (
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2
                                bg-emerald-600 text-white text-sm font-semibold
                                px-5 py-2 rounded-full">
                                    Most Popular
                                </span>
                            )}

                            <div className={`w-12 h-12 rounded-xl flex items-center
                            justify-center mb-5
                            ${plan.popular
                                    ? "bg-emerald-100 text-emerald-600"
                                    : "bg-slate-100 text-slate-600"
                                }`}>
                                {plan.popular ? <Crown size={25} /> : <Sparkles size={25} />}
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                            <p className="text-slate-500 mt-2">{plan.description}</p>

                            <div className="flex items-baseline gap-2 mt-7 mb-7">
                                <span className="text-4xl font-extrabold text-slate-900">
                                    ৳{plan.price}
                                </span>
                                <span className="text-slate-500">/ month</span>
                            </div>

                            <div className="border-t border-slate-200 pt-6">
                                <p className="font-semibold text-slate-800 mb-5">
                                    What's included:
                                </p>
                                <ul className="space-y-4">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3 text-slate-600">
                                            <Check size={19} className="text-emerald-600 shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* এখানে plan.id পাঠানো হচ্ছে */}
                            <button
                                onClick={() => handleSubscribe(plan.id)}
                                className={`w-full mt-9 py-3 rounded-xl font-semibold
                                transition-colors cursor-pointer
                                ${plan.popular
                                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                        : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                                    }`}
                            >
                                {plan.popular ? "Get Started" : "Start for Free"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;