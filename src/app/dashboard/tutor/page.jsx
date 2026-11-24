import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import {
    BookOpen,
    Users,
    CheckCircle,
    Clock,
    Plus,
    ArrowUpRight,
    GraduationCap,
    Crown,
    Sparkles,
} from "lucide-react";

const stats = [
    {
        title: "Total Tuitions",
        value: "0",
        description: "Total tuition posts created",
        icon: BookOpen,
        color: "bg-blue-50 text-blue-600",
    },
    {
        title: "Approved Tuitions",
        value: "0",
        description: "Approved and active listings",
        icon: CheckCircle,
        color: "bg-green-50 text-green-600",
    },
    {
        title: "Total Applicants",
        value: "0",
        description: "Students applied to your tuitions",
        icon: Users,
        color: "bg-purple-50 text-purple-600",
    },
    {
        title: "Pending Tuitions",
        value: "0",
        description: "Waiting for admin approval",
        icon: Clock,
        color: "bg-orange-50 text-orange-600",
    },
];

const quickActions = [
    {
        title: "Post a Tuition",
        description: "Create a new tuition listing",
        icon: Plus,
        href: "/dashboard/tutor/post-tuition",
        color: "bg-green-100 text-green-700",
    },
    {
        title: "My Tuitions",
        description: "Manage your tuition posts",
        icon: BookOpen,
        href: "/dashboard/tutor/my-tuitions",
        color: "bg-blue-100 text-blue-700",
    },
    {
        title: "Manage Applicants",
        description: "Review student applications",
        icon: Users,
        href: "/dashboard/tutor/applicants",
        color: "bg-purple-100 text-purple-700",
    },
];

const TutorOverviewPage = async () => {
    const currentPlan = "Free";
    // Get logged-in tutor session
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const email = session?.user?.email;

    // Default statistics
    let dashboardStats = {
        totalTuitions: 0,
        approvedTuitions: 0,
        totalApplicants: 0,
        pendingTuitions: 0,
    };

    // Fetch statistics from Express backend
    if (email) {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/tutor-stats?email=${encodeURIComponent(email)}`,
                {
                    cache: "no-store",
                }
            );

            if (response.ok) {
                const result = await response.json();

                if (result.success) {
                    dashboardStats = result.stats;
                }
            }
        } catch (error) {
            console.error("Failed to fetch tutor statistics:", error);
        }
    }

    // Statistics
    const stats = [
        {
            title: "Total Tuitions",
            value: dashboardStats.totalTuitions,
            description: "Total tuition posts created",
            icon: BookOpen,
            color: "bg-blue-50 text-blue-600",
        },
        {
            title: "Approved Tuitions",
            value: dashboardStats.approvedTuitions,
            description: "Approved and active listings",
            icon: CheckCircle,
            color: "bg-green-50 text-green-600",
        },
        {
            title: "Total Applicants",
            value: dashboardStats.totalApplicants,
            description: "Students applied to your tuitions",
            icon: Users,
            color: "bg-purple-50 text-purple-600",
        },
        {
            title: "Pending Tuitions",
            value: dashboardStats.pendingTuitions,
            description: "Waiting for admin approval",
            icon: Clock,
            color: "bg-orange-50 text-orange-600",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

            {/* Welcome Section */}
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-green-600">
                        <Sparkles size={16} />
                        Tutor Dashboard
                    </div>

                    <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                        Welcome Back, Tutor!
                    </h1>

                    <p className="mt-2 text-sm text-slate-500 sm:text-base">
                        Manage your tuition posts and keep track of your students.
                    </p>
                </div>

                <Link
                    href="/dashboard/tutor/post-tuition"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                >
                    <Plus size={18} />
                    Post New Tuition
                </Link>
            </div>

            {/* Subscription Plan */}
            <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-green-700 to-emerald-500 p-6 text-white shadow-sm sm:p-8">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <Crown size={20} />
                            <span className="text-sm font-medium text-green-50">
                                Your Subscription
                            </span>
                        </div>

                        <h2 className="text-2xl font-bold">
                            {currentPlan} Plan
                        </h2>

                        <p className="mt-2 max-w-md text-sm leading-6 text-green-50">
                            {currentPlan === "Free"
                                ? "You can create up to 2 tuition posts with your current plan."
                                : "Enjoy unlimited tuition posts and additional Pro benefits."}
                        </p>
                    </div>

                    <Link
                        href="/checkout"
                        className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50"
                    >
                        Upgrade to Pro
                        <ArrowUpRight size={17} />
                    </Link>
                </div>
            </div>

            {/* Statistics */}
            <div className="mb-8">
                <h2 className="mb-4 text-lg font-bold text-slate-800">
                    Overview Statistics
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.title}
                                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <div className={`rounded-xl p-3 ${stat.color}`}>
                                        <Icon size={22} />
                                    </div>

                                    <ArrowUpRight
                                        size={18}
                                        className="text-slate-300"
                                    />
                                </div>

                                <h3 className="mt-5 text-3xl font-bold text-slate-800">
                                    {stat.value}
                                </h3>

                                <p className="mt-1 font-semibold text-slate-700">
                                    {stat.title}
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    {stat.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="mb-4 text-lg font-bold text-slate-800">
                    Quick Actions
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {quickActions.map((action) => {
                        const Icon = action.icon;

                        return (
                            <Link
                                key={action.title}
                                href={action.href}
                                className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-green-200 hover:shadow-md"
                            >
                                <div className={`rounded-xl p-3 ${action.color}`}>
                                    <Icon size={24} />
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-800">
                                        {action.title}
                                    </h3>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {action.description}
                                    </p>
                                </div>

                                <ArrowUpRight
                                    size={20}
                                    className="text-slate-300 transition group-hover:text-green-600"
                                />
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* Recent Tuitions */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="font-bold text-slate-800">
                            Recent Tuitions
                        </h2>

                        <Link
                            href="/dashboard/tutor/my-tuitions"
                            className="text-sm font-semibold text-green-600 hover:text-green-700"
                        >
                            View All
                        </Link>
                    </div>

                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="mb-3 rounded-full bg-slate-50 p-4">
                            <BookOpen size={28} className="text-slate-400" />
                        </div>

                        <h3 className="font-semibold text-slate-700">
                            No Tuitions Yet
                        </h3>

                        <p className="mt-2 max-w-xs text-sm text-slate-400">
                            You haven't created any tuition posts yet. Start by
                            creating your first tuition.
                        </p>

                        <Link
                            href="/dashboard/tutor/post-tuition"
                            className="mt-4 text-sm font-semibold text-green-600 hover:underline"
                        >
                            Create Tuition →
                        </Link>
                    </div>
                </div>

                {/* Recent Applicants */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="font-bold text-slate-800">
                            Recent Applicants
                        </h2>

                        <Link
                            href="/dashboard/tutor/applicants"
                            className="text-sm font-semibold text-green-600 hover:text-green-700"
                        >
                            View All
                        </Link>
                    </div>

                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="mb-3 rounded-full bg-slate-50 p-4">
                            <GraduationCap size={28} className="text-slate-400" />
                        </div>

                        <h3 className="font-semibold text-slate-700">
                            No Applicants Yet
                        </h3>

                        <p className="mt-2 max-w-xs text-sm text-slate-400">
                            Student applications will appear here when someone
                            applies to your approved tuition.
                        </p>

                        <Link
                            href="/dashboard/tutor/applicants"
                            className="mt-4 text-sm font-semibold text-green-600 hover:underline"
                        >
                            Manage Applicants →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TutorOverviewPage;