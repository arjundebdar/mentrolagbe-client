
"use client";

import { useState } from "react";
import {
    CheckCircle2,
    XCircle,
    Clock,
    Users,
    CalendarDays,
    Mail,
    Phone,
    BookOpen,
    MessageSquare,
} from "lucide-react";
import { toast } from "react-toastify";

const statusStyles = {
    pending: "bg-amber-100 text-amber-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
};

export default function ApplicantsClient({
    applicants: initialApplicants,
    tutorEmail,
}) {
    const [applicants, setApplicants] = useState(initialApplicants);
    const [loadingId, setLoadingId] = useState(null);
    const [filter, setFilter] = useState("all");

    const filteredApplicants =
        filter === "all"
            ? applicants
            : applicants.filter((item) => item.status === filter);

    const updateStatus = async (id, status) => {
        try {
            setLoadingId(id);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/applications/${id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        status,
                        tutorEmail,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            setApplicants((previous) =>
                previous.map((applicant) =>
                    applicant._id === id
                        ? { ...applicant, status }
                        : applicant
                )
            );

            toast.success(
                `Application ${status} successfully`
            );
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoadingId(null);
        }
    };

    const pending = applicants.filter(
        (item) => item.status === "pending"
    ).length;

    const accepted = applicants.filter(
        (item) => item.status === "accepted"
    ).length;

    const rejected = applicants.filter(
        (item) => item.status === "rejected"
    ).length;

    return (
        <div className="space-y-7">

            {/* Header */}
            <div>
                <p className="text-sm font-medium text-emerald-600">
                    Tutor Dashboard
                </p>

                <h1 className="mt-2 text-3xl font-bold text-gray-900">
                    Tutor Applicants
                </h1>

                <p className="mt-2 text-gray-500">
                    Review students who have applied to your tuition posts.
                </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="Total Applicants"
                    value={applicants.length}
                    icon={<Users />}
                />

                <StatCard
                    title="Pending"
                    value={pending}
                    icon={<Clock />}
                />

                <StatCard
                    title="Accepted"
                    value={accepted}
                    icon={<CheckCircle2 />}
                />

                <StatCard
                    title="Rejected"
                    value={rejected}
                    icon={<XCircle />}
                />

            </div>

            {/* Filter */}
            <div className="flex flex-wrap items-center justify-between gap-4">

                <h2 className="text-xl font-bold text-gray-800">
                    All Applications
                </h2>

                <div className="flex flex-wrap gap-2">
                    {["all", "pending", "accepted", "rejected"].map(
                        (item) => (
                            <button
                                key={item}
                                onClick={() => setFilter(item)}
                                className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${filter === item
                                    ? "bg-emerald-600 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {item}
                            </button>
                        )
                    )}
                </div>
            </div>

            {/* Applicants */}
            {filteredApplicants.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                    <Users className="mx-auto mb-4 text-gray-400" size={42} />

                    <h3 className="text-lg font-semibold text-gray-800">
                        No applicants found
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                        Applications will appear here when students apply
                        to your tuition posts.
                    </p>
                </div>
            ) : (
                <div className="grid gap-5 lg:grid-cols-2">

                    {filteredApplicants.map((applicant) => (
                        <div
                            key={applicant._id}
                            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                        >

                            {/* Student Info */}
                            <div className="flex flex-wrap items-start justify-between gap-3">

                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {applicant.studentName}
                                    </h3>

                                    <span className="mt-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                        Student
                                    </span>
                                </div>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[applicant.status] ||
                                        statusStyles.pending
                                        }`}
                                >
                                    {applicant.status || "pending"}
                                </span>

                            </div>

                            {/* Contact */}
                            <div className="mt-5 space-y-3 text-sm text-gray-600">

                                <Info
                                    icon={<Mail size={17} />}
                                    value={applicant.studentEmail}
                                />

                                <Info
                                    icon={<Phone size={17} />}
                                    value={applicant.studentPhone || "Not provided"}
                                />

                                <Info
                                    icon={<BookOpen size={17} />}
                                    value={applicant.tuitionTitle || "Tuition title unavailable"}
                                />

                                <Info
                                    icon={<CalendarDays size={17} />}
                                    value={applicant.preferredSchedule || "Not provided"}
                                />

                            </div>

                            {/* Student Note */}
                            <div className="mt-5 rounded-xl bg-gray-50 p-4">

                                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <MessageSquare size={16} />
                                    Student Note
                                </div>

                                <p className="text-sm leading-6 text-gray-600">
                                    {applicant.studentNote || "No additional note."}
                                </p>

                            </div>

                            {/* Actions */}
                            {applicant.status === "pending" && (
                                <div className="mt-5 flex gap-3">

                                    <button
                                        disabled={loadingId === applicant._id}
                                        onClick={() =>
                                            updateStatus(
                                                applicant._id,
                                                "accepted"
                                            )
                                        }
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                                    >
                                        <CheckCircle2 size={17} />
                                        Accept
                                    </button>

                                    <button
                                        disabled={loadingId === applicant._id}
                                        onClick={() =>
                                            updateStatus(
                                                applicant._id,
                                                "rejected"
                                            )
                                        }
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                                    >
                                        <XCircle size={17} />
                                        Reject
                                    </button>

                                </div>
                            )}

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

function StatCard({ title, value, icon }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{title}</p>

                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                    {icon}
                </div>
            </div>

            <p className="mt-4 text-3xl font-bold text-gray-900">
                {value}
            </p>
        </div>
    );
}

function Info({ icon, value }) {
    return (
        <div className="flex items-center gap-3 break-all">
            <span className="text-emerald-600">{icon}</span>
            <span>{value}</span>
        </div>
    );
}
