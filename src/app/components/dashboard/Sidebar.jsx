"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import {
    LayoutDashboard,
    Users,
    BookOpen,
    PlusCircle,
    CheckCircle,
    Calendar,
    Settings,
    LogOut,
} from "lucide-react";

const roleMenus = {
    admin: [
        { name: "Overview", href: "/admin", icon: LayoutDashboard },
        { name: "Manage Users", href: "/admin/users", icon: Users },
        { name: "All Tuitions", href: "/admin/tuitions", icon: BookOpen },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
    tutor: [
        { name: "Overview", href: "/tutor", icon: LayoutDashboard },
        { name: "Applied Tuitions", href: "/tutor/applied", icon: CheckCircle },
        { name: "Class Schedule", href: "/tutor/schedule", icon: Calendar },
    ],
    student: [
        { name: "Overview", href: "/student", icon: LayoutDashboard },
        { name: "Post a Tuition", href: "/student/post-tuition", icon: PlusCircle },
        { name: "My Tutors", href: "/student/my-tutors", icon: Users },
    ],
};

const Sidebar = () => {
    const pathname = usePathname();

    // Logged-in user's session
    const { data: session, isPending } = authClient.useSession();

    // Database থেকে আসা actual role
    const role = session?.user?.role;

    if (isPending) {
        return <aside className="w-64 min-h-screen bg-[#101827]" />;
    }



    return (
        <aside className="w-60 bg-[#101827] text-white flex flex-col justify-between min-h-screen p-4 shrink-0 border-r border-slate-800/70">

            <div>
                {/* User Profile */}
                <div className="  px-2 py-5 border-b border-slate-700/60 mb-7">
                    <div className="flex items-center gap-3">

                        {/* Profile Picture */}
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-700 shrink-0 ring-2 ring-emerald-500/40 ring-offset-2 ring-offset-[#101827]">
                            <img
                                src={role.image || "/avatar-default.png"}
                                alt={session?.user?.name || "User"}
                                className="w-full h-full object-cover "
                            />
                        </div>

                        {/* User Info */}
                        <div className="min-w-0 flex-1">
                            <h2 className="text-sm font-bold text-white truncate">
                                {session?.user?.name || "User"}
                            </h2>

                            <div className="flex items-center gap-2 mt-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                <span className="text-[11px] uppercase tracking-widest font-semibold text-emerald-400">
                                    {role || "User"} Panel
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Plan Information */}
                    {roleMenus[role] !== "admin" && (
                        <div className="mt-4 px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/15 flex items-center justify-between">
                            <span className="text-xs text-slate-400">
                                Current Plan
                            </span>
                            <span className="text-xs font-bold text-emerald-400 capitalize">
                                {session?.user?.plan || "Free"}
                            </span>
                        </div>
                    )}
                </div>

                {/* Navigation Heading */}
                <div className="px-3 mb-3">
                    <p className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500">
                        Workspace
                    </p>
                </div>

                {/* Dynamic Navigation Links */}
                <nav className="space-y-2">
                    {roleMenus[role].map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                                    ? "bg-emerald-500/15 text-emerald-400 shadow-sm shadow-emerald-950/20"
                                    : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                                    }`}
                            >
                                {isActive && (
                                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-emerald-400"></span>
                                )}

                                <Icon
                                    className={`w-[19px] h-[19px] transition-colors ${isActive
                                        ? "text-emerald-400"
                                        : "text-slate-500 group-hover:text-emerald-400"
                                        }`}
                                />

                                <span>{item.name}</span>

                                {isActive && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;