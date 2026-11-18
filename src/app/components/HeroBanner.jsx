"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    ShieldCheck,
    BookOpen,
    CalendarCheck,
    GraduationCap,
    Users,
    Sparkles,
    Award,
    BookMarked,
    Video
} from "lucide-react";

const HeroBanner = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        router.push(`/tutors?q=${encodeURIComponent(searchQuery.trim())}`);
    };

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#F4FBF7] via-[#E8F8EE] to-[#DCF5E7] pt-12 pb-16 lg:pt-20 lg:pb-24">
            {/* Subtle Background Organic Mint Blobs */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 right-[-5%] h-[520px] w-[520px] rounded-full bg-[#CDEEDB]/60 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-[-8%] h-[380px] w-[380px] rounded-full bg-[#D1F3E1]/50 blur-3xl"
            />

            <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                {/* Grid Container for Left Content & Right Creative Illustration Card */}
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">

                    {/* LEFT COLUMN: Content, Search Bar & Trust Badges (span 7) */}
                    <div className="z-10 lg:col-span-7">
                        {/* Top Pill Badge */}
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-xs font-bold tracking-wide text-[#0A8A43] shadow-sm backdrop-blur-md sm:text-sm border border-[#0A8A43]/15">
                            <Sparkles className="h-4 w-4 text-[#0A8A43]" />
                            Smart Tuition &amp; Mentorship Platform
                        </div>

                        {/* Main Two-Tone Headline */}
                        <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-[#0F172A] sm:text-5xl lg:text-[54px]">
                            Find the Right Tutor.
                            <span className="mt-1 block text-[#0A8A43]">
                                Build a Brighter Future.
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="mt-4 max-w-xl text-base leading-relaxed text-[#475569] sm:text-lg">
                            Connect with verified tutors for personalized learning — anytime,
                            anywhere.
                        </p>

                        {/* Search Bar */}
                        <form
                            onSubmit={handleSearch}
                            className="mt-8 flex w-full max-w-xl items-center rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-shadow focus-within:border-[#0A8A43]/40 focus-within:shadow-[0_10px_35px_rgba(10,138,67,0.12)]"
                        >
                            <div className="flex flex-1 items-center pl-3.5 pr-2">
                                <Search className="h-5 w-5 shrink-0 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search subject, class or tutor..."
                                    aria-label="Search subject, class or tutor"
                                    className="w-full bg-transparent px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none sm:text-base"
                                />
                            </div>
                            <button
                                type="submit"
                                className="shrink-0 rounded-xl bg-[#0A8A43] px-7 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#087337] active:scale-[0.98] sm:px-8 sm:text-base"
                            >
                                Search
                            </button>
                        </form>

                        {/* Bottom Feature Badges */}
                        <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-4">
                            {/* Feature 1: Verified Tutors */}
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#DCF5E7] text-[#0A8A43]">
                                    <ShieldCheck className="h-5 w-5" strokeWidth={2.2} />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-[#0F172A]">
                                        Verified Tutors
                                    </h2>
                                    <p className="text-xs text-[#64748B]">Trusted &amp; Verified</p>
                                </div>
                            </div>

                            {/* Feature 2: Flexible Learning */}
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-[#7C3AED]">
                                    <BookOpen className="h-5 w-5" strokeWidth={2.2} />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-[#0F172A]">
                                        Flexible Learning
                                    </h2>
                                    <p className="text-xs text-[#64748B]">Online / Offline</p>
                                </div>
                            </div>

                            {/* Feature 3: Easy Booking */}
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E0F2FE] text-[#0284C7]">
                                    <CalendarCheck className="h-5 w-5" strokeWidth={2.2} />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-[#0F172A]">
                                        Easy Booking
                                    </h2>
                                    <p className="text-xs text-[#64748B]">Quick &amp; Secure</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Unique Icon-Based Interactive Showcase (span 5) */}
                    <div className="relative flex items-center justify-center lg:col-span-5">

                        {/* Glowing Background Ring */}
                        <div className="absolute h-[340px] w-[340px] rounded-full bg-gradient-to-tr from-[#0A8A43]/15 to-[#34D399]/20 blur-2xl sm:h-[420px] sm:w-[420px]" />

                        {/* Central Interactive Card Cluster */}
                        <div className="relative z-10 w-full max-w-md space-y-4 p-4">

                            {/* Main Feature Box */}
                            <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/80 p-6 shadow-[0_20px_50px_rgba(10,138,67,0.12)] backdrop-blur-xl">
                                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#0A8A43]/10 blur-xl" />

                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0A8A43] text-white shadow-md shadow-[#0A8A43]/30">
                                        <GraduationCap className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">Expert Mentorship</h3>
                                        <p className="text-xs text-slate-500">Learn directly from top university graduates &amp; pros</p>
                                    </div>
                                </div>

                                <div className="mt-5 grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-2.5 rounded-xl bg-[#F8FCFA] p-3 border border-slate-100">
                                        <Video className="h-5 w-5 text-[#0A8A43]" />
                                        <div>
                                            <p className="text-xs font-bold text-slate-800">Live Classes</p>
                                            <p className="text-[10px] text-slate-500">Interactive sessions</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2.5 rounded-xl bg-[#F8FCFA] p-3 border border-slate-100">
                                        <BookMarked className="h-5 w-5 text-[#7C3AED]" />
                                        <div>
                                            <p className="text-xs font-bold text-slate-800">Custom Notes</p>
                                            <p className="text-[10px] text-slate-500">Structured modules</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Stats / Trust Pill 1 */}
                            <div className="flex items-center gap-3.5 rounded-2xl border border-white/85 bg-white/90 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-md transform transition-transform hover:translate-x-1">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                                    <Award className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-800">Top Rated Tutors</span>
                                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">4.9/5.0</span>
                                    </div>
                                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                        <div className="h-full w-[95%] rounded-full bg-amber-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Floating Stats / Trust Pill 2 */}
                            <div className="flex items-center justify-between rounded-2xl border border-white/85 bg-white/90 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-md transform transition-transform hover:translate-x-1">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DCF5E7] text-[#0A8A43]">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800">Active Community</p>
                                        <p className="text-[11px] text-slate-500">5,000+ Students Enrolled</p>
                                    </div>
                                </div>
                                <div className="flex -space-x-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white border-2 border-white">A</div>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white border-2 border-white">S</div>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white border-2 border-white">R</div>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-white border-2 border-white">+</div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default HeroBanner;