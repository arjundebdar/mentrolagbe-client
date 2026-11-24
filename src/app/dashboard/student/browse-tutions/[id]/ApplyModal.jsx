
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
    X,
    Send,
    Loader2,
    CheckCircle2,
    BookOpen,
} from "lucide-react";

export default function ApplyModal({ tuition }) {
    const router = useRouter();
    const { data: session } = useSession();

    const [isOpen, setIsOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        studentPhone: "",
        preferredSchedule: "",
        studentNote: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!session?.user) {
            router.push("/signin");
            return;
        }

        if (session.user.role !== "student") {
            setError("Only students can apply for tuition.");
            return;
        }

        if (
            tuition.approvalStatus !== "approved" ||
            tuition.isActive !== true
        ) {
            setError("This tuition is not available.");
            return;
        }

        try {
            setSubmitting(true);

            // Get JWT token
            const tokenResponse = await fetch("/api/auth/token", {
                credentials: "include",
            });

            if (!tokenResponse.ok) {
                throw new Error("Authentication failed. Please login again.");
            }

            const tokenData = await tokenResponse.json();
            const token = tokenData.token;

            if (!token) {
                throw new Error("Unable to verify your session.");
            }

            const applicationData = {
                tuitionId: tuition._id,
                tuitionTitle: tuition.title,
                subject: tuition.subject,
                monthlyFee: tuition.monthlyFee,
                tutorEmail: tuition.tutorEmail,

                studentName: session.user.name,
                studentEmail: session.user.email,
                studentPhone: formData.studentPhone,
                preferredSchedule: formData.preferredSchedule,
                studentNote: formData.studentNote,
            };

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/applications`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(applicationData),
                }
            );

            const data = await response.json();

            if (response.status === 409) {
                throw new Error(
                    "You have already applied for this tuition."
                );
            }

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to submit application."
                );
            }

            setSuccess("Application submitted successfully!");

            setTimeout(() => {
                setIsOpen(false);
                router.push("/dashboard/my-applications");
                router.refresh();
            }, 1200);

        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const isAvailable =
        tuition.approvalStatus === "approved" &&
        tuition.isActive === true;

    return (
        <>
            {/* Apply Button */}
            <button
                onClick={() => setIsOpen(true)}
                disabled={!isAvailable}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Apply Now
                <Send size={17} />
            </button>

            {/* Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setIsOpen(false);
                        }
                    }}
                >
                    <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

                        {/* Header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between bg-emerald-700 px-6 py-5 text-white">
                            <div>
                                <h2 className="text-xl font-extrabold">
                                    Apply for Tuition
                                </h2>
                                <p className="mt-1 text-sm text-emerald-100">
                                    Complete your application
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-full p-2 transition hover:bg-white/20"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        <div className="p-6 sm:p-8">

                            {/* Tuition Information */}
                            <div className="mb-6 flex items-center gap-3 rounded-xl bg-emerald-50 p-4">
                                <div className="rounded-lg bg-emerald-100 p-3 text-emerald-700">
                                    <BookOpen size={23} />
                                </div>

                                <div className="min-w-0">
                                    <h3 className="truncate font-bold text-slate-800">
                                        {tuition.title}
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        {tuition.subject} · ৳
                                        {Number(tuition.monthlyFee || 0).toLocaleString("en-BD")}
                                    </p>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            {/* Success */}
                            {success && (
                                <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                                    <CheckCircle2 size={19} />
                                    {success}
                                </div>
                            )}

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >
                                {/* Student Name */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Student Name
                                    </label>

                                    <input
                                        type="text"
                                        value={session?.user?.name || ""}
                                        readOnly
                                        className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm outline-none"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Student Email
                                    </label>

                                    <input
                                        type="email"
                                        value={session?.user?.email || ""}
                                        readOnly
                                        className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm outline-none"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Phone Number *
                                    </label>

                                    <input
                                        type="tel"
                                        name="studentPhone"
                                        value={formData.studentPhone}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                        required
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                                    />
                                </div>

                                {/* Schedule */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Preferred Schedule *
                                    </label>

                                    <select
                                        name="preferredSchedule"
                                        value={formData.preferredSchedule}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
                                    >
                                        <option value="">
                                            Select schedule
                                        </option>
                                        <option value="Morning">Morning</option>
                                        <option value="Afternoon">Afternoon</option>
                                        <option value="Evening">Evening</option>
                                        <option value="Flexible">Flexible</option>
                                    </select>
                                </div>

                                {/* Note */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Learning Note (Optional)
                                    </label>

                                    <textarea
                                        name="studentNote"
                                        value={formData.studentNote}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Tell the tutor about your learning goals..."
                                        className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={submitting || !isAvailable}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2
                                                size={18}
                                                className="animate-spin"
                                            />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Application
                                            <Send size={17} />
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-xs text-slate-400">
                                    Your application will initially have Pending status.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
