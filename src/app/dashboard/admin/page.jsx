
import Link from "next/link";
import { Suspense } from "react";
import {
    Users,
    GraduationCap,
    UserRound,
    BookOpen,
    Clock,
    Wallet,
    ArrowUpRight,
    ShieldCheck,
    AlertCircle,
} from "lucide-react";

const statCards = [
    {
        title: "Total Users",
        key: "totalUsers",
        icon: Users,
        color: "bg-blue-50 text-blue-600",
    },
    {
        title: "Total Students",
        key: "totalStudents",
        icon: UserRound,
        color: "bg-purple-50 text-purple-600",
    },
    {
        title: "Total Tutors",
        key: "totalTutors",
        icon: GraduationCap,
        color: "bg-emerald-50 text-emerald-600",
    },
    {
        title: "Total Tuitions",
        key: "totalTuitions",
        icon: BookOpen,
        color: "bg-orange-50 text-orange-600",
    },
    {
        title: "Pending Tuitions",
        key: "pendingTuitions",
        icon: Clock,
        color: "bg-amber-50 text-amber-600",
    },
    {
        title: "Total Revenue",
        key: "totalRevenue",
        icon: Wallet,
        color: "bg-green-50 text-green-600",
        money: true,
    },
];

const quickActions = [
    {
        title: "Manage Users",
        description: "View and manage platform users",
        href: "/dashboard/admin/users",
        icon: Users,
    },
    {
        title: "Manage Tuitions",
        description: "Review and approve tuition posts",
        href: "/dashboard/admin/tuitions",
        icon: BookOpen,
    },
    {
        title: "Transactions",
        description: "Monitor platform payments",
        href: "/dashboard/admin/transactions",
        icon: Wallet,
    },
];

const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-BD", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};


const page = () => {
    return (
        <Suspense fallback={<div>Loading my tuitions...</div>}>
            <AdminOverview />
        </Suspense>
    )
}

const AdminOverview = async () => {
    let overview = null;
    let error = "";

    try {

        // Fetch admin overview data
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/admin-overview`,
            {
                headers: {
                    cache: "no-store",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to load admin overview");
        }

        overview = await response.json();
    } catch (err) {
        console.error("Admin overview error:", err);
        error = "Unable to load dashboard data. Please try again.";
    }

    return (
        <div className="min-h-screen bg-[#F7F9FC] p-4 sm:p-6 lg:p-8">

            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <ShieldCheck size={22} className="text-[#16A37A]" />
                        <span className="text-sm font-semibold text-[#16A37A]">
                            Administration
                        </span>
                    </div>

                    <h1 className="text-2xl font-bold text-[#142D4E] sm:text-3xl">
                        Admin Overview
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Monitor users, tuition activities and platform revenue.
                    </p>
                </div>

                <Link
                    href="/dashboard/admin"
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#142D4E] transition hover:bg-gray-50"
                >
                    <span>↻</span>
                    Refresh Data
                </Link>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {/* Statistics */}
            <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {statCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.key}
                            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        {card.title}
                                    </p>

                                    <h2 className="mt-3 text-3xl font-bold text-[#142D4E]">
                                        {card.money
                                            ? `$${Number(
                                                overview?.stats?.[card.key] || 0
                                            ).toLocaleString("en-BD")}`
                                            : Number(
                                                overview?.stats?.[card.key] || 0
                                            ).toLocaleString("en-BD")}
                                    </h2>
                                </div>

                                <div className={`rounded-xl p-3 ${card.color}`}>
                                    <Icon size={25} />
                                </div>
                            </div>

                            <p className="mt-4 text-xs text-gray-400">
                                Platform overview statistics
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <section className="mb-8">
                <h2 className="mb-4 text-xl font-bold text-[#142D4E]">
                    Quick Actions
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {quickActions.map((action) => {
                        const Icon = action.icon;

                        return (
                            <Link
                                href={action.href}
                                key={action.title}
                                className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-[#16A37A] hover:shadow-md"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="rounded-xl bg-[#E9F7F1] p-3 text-[#16A37A]">
                                        <Icon size={23} />
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-[#142D4E]">
                                            {action.title}
                                        </h3>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {action.description}
                                        </p>
                                    </div>
                                </div>

                                <ArrowUpRight
                                    size={20}
                                    className="text-gray-400 transition group-hover:text-[#16A37A]"
                                />
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Recent Users and Pending Tuitions */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                {/* Recent Users */}
                <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 p-5">
                        <div>
                            <h2 className="font-bold text-[#142D4E]">
                                Recent Users
                            </h2>
                            <p className="mt-1 text-xs text-gray-500">
                                Recently registered members
                            </p>
                        </div>

                        <Link
                            href="/dashboard/admin/users"
                            className="text-sm font-semibold text-[#16A37A] hover:underline"
                        >
                            View All
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500">
                                <tr>
                                    <th className="px-5 py-3">User</th>
                                    <th className="px-5 py-3">Role</th>
                                    <th className="px-5 py-3">Joined</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {overview?.recentUsers?.length ? (
                                    overview.recentUsers.filter((user) => user.role !== "admin").
                                        map((user) => (
                                            <tr key={user._id}>
                                                <td className="px-5 py-4">
                                                    <p className="font-semibold text-[#142D4E]">
                                                        {user.name || "Unknown"}
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-400">
                                                        {user.email}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-600">
                                                        {user.role}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4 text-xs text-gray-500">
                                                    {formatDate(user.createdAt)}
                                                </td>
                                            </tr>
                                        ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="py-10 text-center text-gray-400">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Pending Tuitions */}
                <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 p-5">
                        <div>
                            <h2 className="font-bold text-[#142D4E]">
                                Pending Tuitions
                            </h2>
                            <p className="mt-1 text-xs text-gray-500">
                                Tuitions waiting for approval
                            </p>
                        </div>

                        <Link
                            href="/dashboard/admin/tuitions"
                            className="text-sm font-semibold text-[#16A37A] hover:underline"
                        >
                            View All
                        </Link>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {overview?.pendingTuitionList?.length ? (
                            overview.pendingTuitionList.map((tuition) => (
                                <div
                                    key={tuition._id}
                                    className="flex items-center justify-between gap-3 p-5"
                                >
                                    <div className="min-w-0">
                                        <h3 className="truncate text-sm font-semibold text-[#142D4E]">
                                            {tuition.title}
                                        </h3>

                                        <p className="mt-1 text-xs text-gray-500">
                                            {tuition.subject} · {tuition.tutorName || tuition.tutorEmail}
                                        </p>

                                        <p className="mt-2 text-xs font-semibold text-[#16A37A]">
                                            ৳{Number(tuition.monthlyFee || 0).toLocaleString("en-BD")} / month
                                        </p>
                                    </div>

                                    <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600">
                                        Pending
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="py-10 text-center text-sm text-gray-400">
                                No pending tuitions
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default page;
