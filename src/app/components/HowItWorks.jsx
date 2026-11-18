import React from 'react';
import { Search, CalendarCheck, SquareCheckBig } from 'lucide-react';



const steps = [
    {
        number: 1,
        title: 'Search & Explore',
        description: 'Find the perfect tutor or tuition batch.',
        icon: <Search className="w-6 h-6 text-[#1a2b56]" strokeWidth={2} />,
    },
    {
        number: 2,
        title: 'Apply or Book',
        description: 'Send an application or book a session.',
        icon: <CalendarCheck className="w-6 h-6 text-[#1a2b56]" strokeWidth={2} />,
    },
    {
        number: 3,
        title: 'Start Learning',
        description: 'Begin your learning journey!',
        icon: <SquareCheckBig className="w-6 h-6 text-[#1a2b56]" strokeWidth={2} />,
    },
];

export default function HowItWorks() {
    return (
        <section className="w-full  mx-auto ">
            {/* Main Soft Mint Container */}
            <div className="relative bg-[#ecfbf2] px-5 py-5   p-8 md:p-12 overflow-hidden">

                {/* Top-Right Decorative Curved Arrow */}
                <svg
                    className="hidden sm:block absolute top-6 right-8 w-14 h-14 text-[#1a2b56]"
                    viewBox="0 0 60 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M52 8C54 26 42 40 16 42"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M23 36L14 42.5L23 48"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                {/* Header */}
                <div className="flex flex-col justify-center items-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#1a2b56] tracking-tight">
                        How It Works?
                    </h2>
                    <p className="text-sm md:text-base text-[#475569] mt-1">
                        Get started in 3 simple steps
                    </p>
                </div>

                {/* Steps Grid / Flex Container */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 max-w-4xl mx-auto">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.number}>
                            {/* Individual Step Block */}
                            <div className="flex flex-col items-start">
                                {/* Top Row: Number Badge + Small Arrow + Icon Circle */}
                                <div className="flex items-center gap-3 mb-3">
                                    {/* Green Number Badge */}
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#00994d] text-white font-bold text-sm shadow-sm">
                                        {step.number}
                                    </span>

                                    {/* Subtle Dashed/Thin Connector between Badge and Icon */}
                                    <svg
                                        className="w-5 h-3 text-[#b8e2cb]"
                                        viewBox="0 0 24 12"
                                        fill="none"
                                    >
                                        <path
                                            d="M1 6H22M22 6L17 1M22 6L17 11"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>

                                    {/* Soft Blue-Tinted Icon Circle */}
                                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#e3effa]">
                                        {step.icon}
                                    </div>
                                </div>

                                {/* Bottom Row: Downward Subtle Arrow + Text Content */}
                                <div className="flex items-start gap-3 pl-9">
                                    {/* Subtle Downward Greenish Arrow */}
                                    <svg
                                        className="w-3 h-6 text-[#9cd4b5] mt-1 shrink-0"
                                        viewBox="0 0 12 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M6 1V22M6 22L1 17M6 22L11 17"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>

                                    <div>
                                        <h3 className="font-bold text-[#1a2b56] text-base">
                                            {step.title}
                                        </h3>
                                        <p className="text-xs md:text-sm text-[#475569] mt-1 max-w-[175px] leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Horizontal Connector Arrow Between Steps (Desktop Only) */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:flex items-center justify-center px-2">
                                    <svg
                                        className="w-12 h-4 text-[#b8e2cb]"
                                        viewBox="0 0 50 16"
                                        fill="none"
                                    >
                                        <path
                                            d="M2 8H47M47 8L40 2M47 8L40 14"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
}