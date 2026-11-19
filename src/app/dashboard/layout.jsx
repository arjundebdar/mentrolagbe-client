import Sidebar from "../components/dashboard/Sidebar";

export default async function DashboardLayout({ children }) {
    // Replace this with your actual session/auth role fetch:
    // const session = await auth.api.getSession({ headers: await headers() });
    // const userRole = session?.user?.role || "student";
    const userRole = "tutor"; // Example: "admin" | "tutor" | "student"

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* Static Left Sidebar */}
            <Sidebar role={userRole} />

            {/* Dynamic Right Content Area */}
            <div className="flex-1 flex flex-col overflow-y-auto">
                {/* Optional Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <h1 className="text-lg font-semibold text-slate-800 capitalize">
                        {userRole} Dashboard
                    </h1>
                    <div className="text-sm text-slate-500">Welcome back!</div>
                </header>

                {/* Changing Page Content */}
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}