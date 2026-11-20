
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
    ArrowLeft,
    BookOpen,
    CalendarDays,
    CheckCircle2,
    XCircle,
    Clock,
    MapPin,
    Wallet,
    GraduationCap,
    UserRound,
    Mail,
    Phone,
    BookMarked,
    ShieldCheck,
    Power,
    CalendarClock,
    Info,
} from "lucide-react";

// SERVER ACTION

async function updateTuition(formData) {
    "use server";

    const id = formData.get("id");
    const actionType = formData.get("actionType");
    const value = formData.get("value");

    const cookieStore = await cookies();

    const cookieHeader = cookieStore
        .getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join("; ");

    let body = {};

    if (actionType === "approvalStatus") {
        if (!["approved", "rejected"].includes(value)) {
            throw new Error("Invalid approval status");
        }

        body = { approvalStatus: value };
    } else if (actionType === "isActive") {
        body = { isActive: value === "true" };
    } else {
        throw new Error("Invalid action");
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tuitions/${id}/status`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieHeader,
            },
            body: JSON.stringify(body),
            cache: "no-store",
        }
    );

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to update tuition");
    }

    revalidatePath("/dashboard/admin/tuitions");
    revalidatePath(`/dashboard/admin/tuitions/${id}`);
}

// HELPERS

const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

const getLocation = (location) => {
    if (!location) return "Not specified";

    if (typeof location === "string") return location;

    if (typeof location === "object") {
        return [
            location.area,
            location.city,
            location.district,
        ].filter(Boolean).join(", ") || "Not specified";
    }

    return String(location);
};

// REUSABLE COMPONENTS

function InfoItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#16A37A] shadow-sm">
                <Icon size={19} />
            </div>

            <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">
                    {label}
                </p>

                <p className="mt-1 break-words text-sm font-semibold text-[#142D4E]">
                    {value || "Not specified"}
                </p>
            </div>
        </div>
    );
}

function StatusBadge({ status, active }) {
    const approved = status === "approved";

    return (
        <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${status === "approved"
                ? "bg-emerald-50 text-emerald-600"
                : status === "rejected"
                    ? "bg-red-50 text-red-600"
                    : "bg-amber-50 text-amber-600"
                }`}>
                {status || "pending"}
            </span>

            {approved && (
                <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${active
                    ? "bg-blue-50 text-blue-600"
                    : "bg-slate-100 text-slate-500"
                    }`}>
                    {active ? "Active" : "Inactive"}
                </span>
            )}
        </div>
    );
}

// ADMIN TUITION DETAILS PAGE

export default async function TuitionDetailsPage({ params }) {
    const { id } = await params;

    const cookieStore = await cookies();

    const cookieHeader = cookieStore
        .getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join("; ");

    let tuition;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/tuitions/${id}`,
            {
                headers: {
                    Cookie: cookieHeader,
                },
                cache: "no-store",
            }
        );

        if (response.status === 404) {
            notFound();
        }

        if (!response.ok) {
            throw new Error("Failed to fetch tuition details");
        }

        const data = await response.json();

        tuition = data.tuition || data.data || data;

    } catch (error) {
        console.error("Tuition details error:", error);
        throw error;
    }

    if (!tuition || !tuition._id) {
        notFound();
    }

    const approvalStatus = tuition.approvalStatus || "pending";

    return (
        <main className="min-h-screen bg-[#F7F9FC] p-4 sm:p-6 lg:p-8">

            <div className="mx-auto max-w-6xl">

                {/* BACK BUTTON */}
                <Link
                    href="/dashboard/admin/tuitions"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#16A37A]"
                >
                    <ArrowLeft size={18} />
                    Back to All Tuitions
                </Link>

                {/* HEADER */}
                <div className="mb-7 flex flex-col justify-between gap-5 rounded-2xl bg-[#142D4E] p-6 text-white shadow-lg sm:flex-row sm:items-center sm:p-8">

                    <div>
                        <div className="mb-3 flex items-center gap-2 text-emerald-400">
                            <ShieldCheck size={19} />
                            <span className="text-xs font-bold uppercase tracking-widest">
                                Admin Panel / Tuition Details
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold sm:text-3xl">
                            Tuition Overview
                        </h1>

                        <p className="mt-2 text-sm text-slate-300">
                            Review complete tuition information and manage its status.
                        </p>
                    </div>

                    <div>
                        <StatusBadge
                            status={approvalStatus}
                            active={tuition.isActive}
                        />
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* LEFT CONTENT */}
                    <div className="space-y-6 lg:col-span-2">

                        {/* TUITION INFORMATION */}
                        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">

                            <div className="flex items-center gap-3 border-b border-slate-100 p-5 sm:p-6">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#16A37A]">
                                    <BookOpen size={22} />
                                </div>

                                <div>
                                    <h2 className="font-bold text-[#142D4E]">
                                        Tuition Information
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-400">
                                        Complete listing information
                                    </p>
                                </div>
                            </div>

                            <div className="p-5 sm:p-6">

                                <h3 className="text-xl font-bold text-[#142D4E] sm:text-2xl">
                                    {tuition.title}
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    {tuition.description || "No description provided."}
                                </p>

                                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">

                                    <InfoItem
                                        icon={BookMarked}
                                        label="Subject"
                                        value={tuition.subject}
                                    />

                                    <InfoItem
                                        icon={GraduationCap}
                                        label="Class / Level"
                                        value={tuition.classLevel}
                                    />

                                    <InfoItem
                                        icon={Wallet}
                                        label="Monthly Fee"
                                        value={`$${Number(tuition.monthlyFee || 0).toLocaleString("en-BD")}`}
                                    />

                                    <InfoItem
                                        icon={MapPin}
                                        label="Location"
                                        value={getLocation(tuition.location)}
                                    />

                                    <InfoItem
                                        icon={CalendarClock}
                                        label="Days Per Week"
                                        value={tuition.daysPerWeek ? `${tuition.daysPerWeek} Days` : null}
                                    />

                                    <InfoItem
                                        icon={Clock}
                                        label="Preferred Time"
                                        value={tuition.preferredTime || tuition.time}
                                    />

                                    <InfoItem
                                        icon={UserRound}
                                        label="Preferred Gender"
                                        value={tuition.preferredGender}
                                    />

                                    <InfoItem
                                        icon={BookOpen}
                                        label="Medium"
                                        value={tuition.medium}
                                    />

                                </div>
                            </div>
                        </section>

                        {/* TUTOR INFORMATION */}
                        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">

                            <div className="flex items-center gap-3 border-b border-slate-100 p-5 sm:p-6">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <UserRound size={22} />
                                </div>

                                <div>
                                    <h2 className="font-bold text-[#142D4E]">
                                        Tutor Information
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-400">
                                        Listing owner details
                                    </p>
                                </div>
                            </div>

                            <div className="p-5 sm:p-6">

                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-[#16A37A]">
                                        <UserRound size={28} />
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="font-bold text-[#142D4E]">
                                            {tuition.tutorName || "Unknown Tutor"}
                                        </h3>

                                        <p className="mt-1 text-xs text-slate-400">
                                            Tuition Provider
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-3 sm:grid-cols-2">

                                    <InfoItem
                                        icon={Mail}
                                        label="Email Address"
                                        value={tuition.tutorEmail}
                                    />

                                    <InfoItem
                                        icon={Phone}
                                        label="Phone Number"
                                        value={tuition.phone}
                                    />

                                </div>
                            </div>
                        </section>



                    </div>

                    {/* RIGHT SIDEBAR */}
                    <aside className="space-y-6">

                        {/* MANAGEMENT */}
                        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">

                            <h2 className="font-bold text-[#142D4E]">
                                Manage Tuition
                            </h2>

                            <p className="mt-1 text-xs text-slate-400">
                                Control listing approval and availability.
                            </p>

                            <div className="mt-6 space-y-3">

                                {/* APPROVE */}
                                {approvalStatus !== "approved" && (
                                    <form action={updateTuition}>
                                        <input type="hidden" name="id" value={id} />
                                        <input type="hidden" name="actionType" value="approvalStatus" />
                                        <input type="hidden" name="value" value="approved" />

                                        <button
                                            type="submit"
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
                                        >
                                            <CheckCircle2 size={18} />
                                            Approve Tuition
                                        </button>
                                    </form>
                                )}

                                {/* REJECT */}
                                {approvalStatus !== "rejected" && (
                                    <form action={updateTuition}>
                                        <input type="hidden" name="id" value={id} />
                                        <input type="hidden" name="actionType" value="approvalStatus" />
                                        <input type="hidden" name="value" value="rejected" />

                                        <button
                                            type="submit"
                                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
                                        >
                                            <XCircle size={18} />
                                            Reject Tuition
                                        </button>
                                    </form>
                                )}

                                {/* ACTIVE TOGGLE */}
                                {approvalStatus === "approved" && (
                                    <form action={updateTuition}>
                                        <input type="hidden" name="id" value={id} />
                                        <input type="hidden" name="actionType" value="isActive" />
                                        <input
                                            type="hidden"
                                            name="value"
                                            value={String(!tuition.isActive)}
                                        />

                                        <button
                                            type="submit"
                                            className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${tuition.isActive
                                                ? "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                                                : "bg-[#142D4E] text-white hover:bg-[#1c416d]"
                                                }`}
                                        >
                                            <Power size={18} />
                                            {tuition.isActive
                                                ? "Deactivate Tuition"
                                                : "Activate Tuition"}
                                        </button>
                                    </form>
                                )}

                            </div>

                            <div className="mt-5 rounded-xl bg-slate-50 p-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                    <ShieldCheck size={16} className="text-[#16A37A]" />
                                    Admin Control
                                </div>

                                <p className="mt-2 text-xs leading-5 text-slate-400">
                                    Changes to approval and availability status will be saved immediately.
                                </p>
                            </div>
                        </section>

                        {/* CURRENT STATUS */}
                        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">

                            <h2 className="font-bold text-[#142D4E]">
                                Current Status
                            </h2>

                            <div className="mt-5 space-y-4">

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500">
                                        Approval
                                    </span>

                                    <span className="text-sm font-bold capitalize text-[#142D4E]">
                                        {approvalStatus}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500">
                                        Availability
                                    </span>

                                    <span className={`text-sm font-bold ${tuition.isActive
                                        ? "text-emerald-600"
                                        : "text-slate-400"
                                        }`}>
                                        {tuition.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500">
                                        Created
                                    </span>

                                    <span className="text-sm font-semibold text-[#142D4E]">
                                        {formatDate(tuition.createdAt)}
                                    </span>
                                </div>

                            </div>
                        </section>

                    </aside>
                </div>
            </div>
        </main>
    );
}
