import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
    BookOpen,
    CheckCircle2,
    Clock,
    GraduationCap,
    ArrowRight,
    FileText,
    Search,
    UserRound,
} from "lucide-react";



export default async function StudentOverviewPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/sign-in");
    }

    const email = session.user.email;

    let dashboard = {
        totalApplications: 0,
        acceptedApplications: 0,
        pendingApplications: 0,
        plan: "free",
        recentApplications: [],
    };

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/dashboard/student/stats?email=${encodeURIComponent(email)}`,
            { cache: "no-store" }
        );

        if (response.ok) {
            dashboard = {
                ...dashboard,
                ...(await response.json()),
            };
        }
    } catch (error) {
        console.error("Student dashboard error:", error);
    }

    const stats = [
        {
            title: "Total Applications",
            value: dashboard.totalApplications,
            icon: FileText,
            color: "bg-blue-100 text-blue-600",
        },
        {
            title: "Accepted Applications",
            value: dashboard.acceptedApplications,
            icon: CheckCircle2,
            color: "bg-emerald-100 text-emerald-600",
        },
        {
            title: "Pending Applications",
            value: dashboard.pendingApplications,
            icon: Clock,
            color: "bg-amber-100 text-amber-600",
        },
        {
            title: "Current Plan",
            value: dashboard.plan?.toUpperCase() || "FREE",
            icon: GraduationCap,
            color: "bg-purple-100 text-purple-600",
        },
    ];

    const quickActions = [
        {
            title: "Browse Tuitions",
            description: "Find the right tuition for you.",
            href: "/tuitions",
            icon: Search,
        },
        {
            title: "My Applications",
            description: "Track your tuition applications.",
            href: "/dashboard/student/my-applications",
            icon: BookOpen,
        },
        {
            title: "My Profile",
            description: "Manage your personal information.",
            href: "/dashboard/profile",
            icon: UserRound,
        },
    ];

    return (
        <div className="min-h-screen space-y-8 bg-[#F7F9FC] p-4 sm:p-6 lg:p-8">
            {/* Welcome */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-medium text-emerald-600">
                        Student Dashboard
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
                        Welcome back, {session.user.name || "Student"}!
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Track your applications and find your next learning
                        opportunity.
                    </p>
                </div>
            </div>

            {/* Statistics */}
            <section>
                <h2 className="mb-4 text-lg font-bold text-slate-800">
                    Your Overview
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.title}
                                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {stat.title}
                                        </p>

                                        <h3 className="mt-3 text-2xl font-bold text-slate-800">
                                            {stat.value}
                                        </h3>
                                    </div>

                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                                    >
                                        <Icon size={23} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Quick Actions */}
            <section>
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
                                className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                        <Icon size={22} />
                                    </div>

                                    <ArrowRight
                                        size={19}
                                        className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600"
                                    />
                                </div>

                                <h3 className="mt-4 font-bold text-slate-800">
                                    {action.title}
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    {action.description}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Recent Applications */}
            <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="font-bold text-slate-800">
                            Recent Applications
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Your latest tuition applications.
                        </p>
                    </div>

                    <Link
                        href="/dashboard/student/my-applications"
                        className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                        View All
                    </Link>
                </div>

                {dashboard.recentApplications?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px] text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500">
                                <tr>
                                    <th className="px-5 py-4 font-medium">
                                        Tuition
                                    </th>
                                    <th className="px-5 py-4 font-medium">
                                        Subject
                                    </th>
                                    <th className="px-5 py-4 font-medium">
                                        Applied Date
                                    </th>
                                    <th className="px-5 py-4 font-medium">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {dashboard.recentApplications.map((item) => (
                                    <tr key={item._id}>
                                        <td className="px-5 py-4 font-semibold text-slate-700">
                                            {item.tuitionTitle || "Untitled Tuition"}
                                        </td>

                                        <td className="px-5 py-4 text-slate-500">
                                            {item.subject || "—"}
                                        </td>

                                        <td className="px-5 py-4 text-slate-500">
                                            {item.appliedAt
                                                ? new Date(
                                                    item.appliedAt
                                                ).toLocaleDateString("en-GB")
                                                : "—"}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${item.status === "accepted"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : item.status === "rejected"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-amber-100 text-amber-700"
                                                    }`}
                                            >
                                                {item.status || "pending"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="px-5 py-12 text-center">
                        <BookOpen
                            size={38}
                            className="mx-auto text-slate-300"
                        />

                        <h3 className="mt-3 font-semibold text-slate-700">
                            No applications yet
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Browse available tuitions and submit your first
                            application.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}