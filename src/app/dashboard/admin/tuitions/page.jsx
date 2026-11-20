
import Link from "next/link";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
    BookOpen,
    Clock,
    CheckCircle2,
    XCircle,
    Layers,
    ShieldCheck,
    Power,
    Eye,
    AlertCircle,
} from "lucide-react";
import { Suspense } from "react";

const page = ({ searchParams }) => {
    return (
        <Suspense fallback={<div>Loading my tuitions...</div>}>
            <AdminTuitionsPage searchParams={searchParams} />
        </Suspense>
    )
}
export default page;

async function updateTuition(formData) {
    "use server";

    const id = formData.get("id");
    const actionType = formData.get("actionType");
    const value = formData.get("value");

    try {
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
            console.error("Tuition update failed:", response.status, message);
            throw new Error(message || "Failed to update tuition");
        }

        revalidatePath("/dashboard/admin/tuitions");

    } catch (error) {
        console.error("Update tuition error:", error);
        throw error;
    }
}

// STATUS CONFIGURATION

const statusStyles = {
    pending: "bg-amber-50 text-amber-600",
    approved: "bg-emerald-50 text-emerald-600",
    rejected: "bg-red-50 text-red-600",
};

// DATE FORMAT

const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-BD", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

// ADMIN TUITION PAGE

const AdminTuitionsPage = async ({ searchParams }) => {

    const params = await searchParams;

    const currentStatus = params?.status || "pending";

    const validStatuses = ["pending", "approved", "rejected", "all"];

    const activeFilter = validStatuses.includes(currentStatus)
        ? currentStatus
        : "pending";

    let tuitions = [];
    let error = "";

    // Fetch all tuitions from backend
    try {
        const cookieStore = await cookies();

        const cookieHeader = cookieStore
            .getAll()
            .map(({ name, value }) => `${name}=${value}`)
            .join("; ");

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/tuitions`,
            {
                headers: {
                    Cookie: cookieHeader,
                },
                cache: "no-store",
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch tuitions");
        }

        const data = await response.json();

        tuitions = Array.isArray(data)
            ? data
            : data.tuitions || data.data || [];

    } catch (err) {
        console.error("Admin tuitions error:", err);
        error = "Unable to load tuition data. Please try again.";
    }

    // Filter tuitions
    const filteredTuitions =
        activeFilter === "all"
            ? tuitions
            : tuitions.filter(
                (tuition) => tuition.approvalStatus === activeFilter
            );

    // Filter buttons
    const filters = [
        {
            label: "Pending",
            value: "pending",
            icon: Clock,
            count: tuitions.filter(
                (item) => item.approvalStatus === "pending"
            ).length,
        },
        {
            label: "Approved",
            value: "approved",
            icon: CheckCircle2,
            count: tuitions.filter(
                (item) => item.approvalStatus === "approved"
            ).length,
        },
        {
            label: "Rejected",
            value: "rejected",
            icon: XCircle,
            count: tuitions.filter(
                (item) => item.approvalStatus === "rejected"
            ).length,
        },
        {
            label: "All Tuitions",
            value: "all",
            icon: Layers,
            count: tuitions.length,
        },
    ];

    return (
        <div className="min-h-screen bg-[#F7F9FC] p-4 sm:p-6 lg:p-8">

            {/* HEADER */}
            <div className="mb-8">
                <div className="mb-2 flex items-center gap-2">
                    <ShieldCheck
                        size={22}
                        className="text-[#16A37A]"
                    />
                    <span className="text-sm font-semibold text-[#16A37A]">
                        Administration
                    </span>
                </div>

                <h1 className="text-2xl font-bold text-[#142D4E] sm:text-3xl">
                    Manage Tuitions
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Review, approve and manage all tuition listings.
                </p>
            </div>

            {/* FILTER BUTTONS */}
            <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {filters.map((filter) => {
                    const Icon = filter.icon;
                    const isActive = activeFilter === filter.value;

                    return (
                        <Link
                            key={filter.value}
                            href={`/dashboard/admin/tuitions?status=${filter.value}`}
                            className={`flex items-center justify-between rounded-xl border p-4 transition ${isActive
                                ? "border-[#142D4E] bg-[#142D4E] text-white shadow-md"
                                : "border-gray-100 bg-white text-[#142D4E] hover:border-[#16A37A]"
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Icon size={19} />
                                <span className="text-sm font-semibold">
                                    {filter.label}
                                </span>
                            </div>

                            <span
                                className={`rounded-full px-2.5 py-1 text-xs font-bold ${isActive
                                    ? "bg-white/15 text-white"
                                    : "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                {filter.count}
                            </span>
                        </Link>
                    );
                })}
            </div>

            {/* ERROR */}
            {error && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {/* TABLE */}
            <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

                {/* TABLE HEADER */}
                <div className="flex flex-col gap-2 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-bold text-[#142D4E]">
                            {filters.find(
                                (filter) => filter.value === activeFilter
                            )?.label}
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            {filteredTuitions.length} tuition listings found
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <BookOpen size={16} />
                        Tuition Management
                    </div>
                </div>

                {/* RESPONSIVE TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1100px] text-left text-sm">

                        <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                            <tr>
                                <th className="px-5 py-4">Title</th>
                                <th className="px-5 py-4">Subject</th>
                                <th className="px-5 py-4">Tutor</th>
                                <th className="px-5 py-4">Monthly Fee</th>
                                <th className="px-5 py-4">Approval Status</th>
                                <th className="px-5 py-4">Active</th>
                                <th className="px-5 py-4">Created Date</th>
                                <th className="px-5 py-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">

                            {filteredTuitions.length > 0 ? (
                                filteredTuitions.map((tuition) => (

                                    <tr
                                        key={tuition._id}
                                        className="transition hover:bg-gray-50/70"
                                    >

                                        {/* TITLE */}
                                        <td className="max-w-[200px] px-5 py-4">
                                            <p className="truncate font-semibold text-[#142D4E]">
                                                {tuition.title}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-400">
                                                {tuition.classLevel || "N/A"}
                                            </p>
                                        </td>

                                        {/* SUBJECT */}
                                        <td className="px-5 py-4">
                                            <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600">
                                                {tuition.subject}
                                            </span>
                                        </td>

                                        {/* TUTOR */}
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-[#142D4E]">
                                                {tuition.tutorName || "N/A"}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-400">
                                                {tuition.tutorEmail}
                                            </p>
                                        </td>

                                        {/* MONTHLY FEE */}
                                        <td className="whitespace-nowrap px-5 py-4 font-semibold text-[#142D4E]">
                                            ${Number(
                                                tuition.monthlyFee || 0
                                            ).toLocaleString("en-BD")}
                                        </td>

                                        {/* APPROVAL STATUS */}
                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${statusStyles[tuition.approvalStatus] ||
                                                    "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {tuition.approvalStatus}
                                            </span>
                                        </td>

                                        {/* ACTIVE STATUS */}
                                        <td className="px-5 py-4">
                                            {tuition.approvalStatus === "approved" ? (
                                                <form action={updateTuition}>
                                                    <input
                                                        type="hidden"
                                                        name="id"
                                                        value={tuition._id.toString()}
                                                    />
                                                    <input
                                                        type="hidden"
                                                        name="actionType"
                                                        value="isActive"
                                                    />
                                                    <input
                                                        type="hidden"
                                                        name="value"
                                                        value={String(!tuition.isActive)}
                                                    />

                                                    <button
                                                        type="submit"
                                                        className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${tuition.isActive
                                                            ? "bg-emerald-50 text-emerald-600"
                                                            : "bg-gray-100 text-gray-500"
                                                            }`}
                                                    >
                                                        <Power size={13} />
                                                        {tuition.isActive
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </button>
                                                </form>
                                            ) : (
                                                <span className="text-xs text-gray-400">
                                                    —
                                                </span>
                                            )}
                                        </td>

                                        {/* CREATED DATE */}
                                        <td className="whitespace-nowrap px-5 py-4 text-xs text-gray-500">
                                            {formatDate(tuition.createdAt)}
                                        </td>

                                        {/* ACTIONS */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">

                                                {/* APPROVE */}
                                                {tuition.approvalStatus !== "approved" && (
                                                    <form action={updateTuition}>
                                                        <input
                                                            type="hidden"
                                                            name="id"
                                                            value={tuition._id.toString()}
                                                        />
                                                        <input
                                                            type="hidden"
                                                            name="actionType"
                                                            value="approvalStatus"
                                                        />
                                                        <input
                                                            type="hidden"
                                                            name="value"
                                                            value="approved"
                                                        />

                                                        <button
                                                            type="submit"
                                                            title="Approve Tuition"
                                                            className="rounded-lg bg-emerald-50 p-2 text-emerald-600 transition hover:bg-emerald-100"
                                                        >
                                                            <CheckCircle2 size={17} />
                                                        </button>
                                                    </form>
                                                )}

                                                {/* REJECT */}
                                                {tuition.approvalStatus !== "rejected" && (
                                                    <form action={updateTuition}>
                                                        <input
                                                            type="hidden"
                                                            name="id"
                                                            value={tuition._id.toString()}
                                                        />
                                                        <input
                                                            type="hidden"
                                                            name="actionType"
                                                            value="approvalStatus"
                                                        />
                                                        <input
                                                            type="hidden"
                                                            name="value"
                                                            value="rejected"
                                                        />

                                                        <button
                                                            type="submit"
                                                            title="Reject Tuition"
                                                            className="rounded-lg bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                                                        >
                                                            <XCircle size={17} />
                                                        </button>
                                                    </form>
                                                )}

                                                {/* VIEW DETAILS */}
                                                <Link
                                                    href={`/dashboard/admin/tuitions/${tuition._id}`}
                                                    title="View Tuition"
                                                    className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                                                >
                                                    <Eye size={17} />
                                                </Link>

                                            </div>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="px-5 py-16 text-center"
                                    >
                                        <div className="flex flex-col items-center">
                                            <BookOpen
                                                size={35}
                                                className="mb-3 text-gray-300"
                                            />

                                            <h3 className="font-semibold text-[#142D4E]">
                                                No Tuitions Found
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-400">
                                                There are no {activeFilter === "all"
                                                    ? ""
                                                    : activeFilter} tuition listings.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>
            </section>

        </div>
    );
};

