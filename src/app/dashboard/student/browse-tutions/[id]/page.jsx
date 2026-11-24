
import Link from "next/link";
import { notFound } from "next/navigation";
import ApplyModal from "./ApplyModal";

import {
    ArrowLeft,
    MapPin,
    BookOpen,
    GraduationCap,
    CalendarDays,
    UserRound,
    Clock,
    CheckCircle2,
} from "lucide-react";

async function getTuition(id) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tuitions/${id}`,
        { cache: "no-store" }
    );

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Failed to fetch tuition");
    }

    const data = await response.json();
    return data.tuition;
}

export default async function TuitionDetailsPage({ params }) {
    const { id } = await params;
    const tuition = await getTuition(id);

    if (!tuition) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#F7F9FC] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">

                <Link
                    href="/browse-tutions"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-600"
                >
                    <ArrowLeft size={18} />
                    Back to Tuitions
                </Link>

                <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">

                    {/* Banner */}
                    <div className="relative h-64 bg-slate-100 sm:h-80">
                        {tuition.bannerImage ? (
                            <img
                                src={tuition.bannerImage}
                                alt={tuition.title}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-slate-300">
                                <BookOpen size={64} />
                            </div>
                        )}

                        <span className="absolute left-5 top-5 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
                            {tuition.mode}
                        </span>
                    </div>

                    <div className="p-5 sm:p-8">

                        {/* Title */}
                        <div className="flex flex-col justify-between gap-5 border-b border-slate-100 pb-6 md:flex-row md:items-start">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">
                                    {tuition.subject}
                                </p>

                                <h1 className="mt-2 text-2xl font-extrabold text-slate-800 sm:text-3xl">
                                    {tuition.title}
                                </h1>

                                <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                                    <MapPin size={17} />
                                    {tuition.location || "Location not specified"}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-emerald-50 p-5 md:min-w-44">
                                <p className="text-sm text-slate-500">
                                    Monthly Fee
                                </p>

                                <p className="mt-1 text-2xl font-extrabold text-emerald-700">
                                    ৳{Number(tuition.monthlyFee || 0).toLocaleString("en-BD")}
                                </p>
                            </div>
                        </div>

                        {/* Information */}
                        <div className="grid grid-cols-1 gap-4 py-7 sm:grid-cols-2 lg:grid-cols-3">
                            <InfoItem
                                icon={GraduationCap}
                                label="Class Level"
                                value={tuition.classLevel}
                            />

                            <InfoItem
                                icon={BookOpen}
                                label="Subject"
                                value={tuition.subject}
                            />

                            <InfoItem
                                icon={Clock}
                                label="Teaching Mode"
                                value={tuition.mode}
                            />

                            <InfoItem
                                icon={CalendarDays}
                                label="Days Per Week"
                                value={`${tuition.daysPerWeek || "—"} Days`}
                            />

                            <InfoItem
                                icon={UserRound}
                                label="Tutor"
                                value={tuition.tutorName || "Not specified"}
                            />

                            <InfoItem
                                icon={CheckCircle2}
                                label="Approval Status"
                                value="Approved"
                            />
                        </div>

                        {/* Description */}
                        <div className="border-t border-slate-100 pt-7">
                            <h2 className="text-xl font-bold text-slate-800">
                                Tuition Description
                            </h2>

                            <p className="mt-4 whitespace-pre-line text-sm leading-8 text-slate-600">
                                {tuition.description || "No description available."}
                            </p>
                        </div>

                        {/* Apply Button */}
                        <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="font-bold text-slate-800">
                                    Interested in this tuition?
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Submit your application to connect with the tutor.
                                </p>
                            </div>

                            <ApplyModal
                                tuition={JSON.parse(JSON.stringify(tuition))}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function InfoItem({ icon: Icon, label, value }) {
    return (
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <Icon size={20} />
                </div>

                <div className="min-w-0">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-1 truncate text-sm font-bold text-slate-800">
                        {value || "Not specified"}
                    </p>
                </div>
            </div>
        </div>
    );
}
