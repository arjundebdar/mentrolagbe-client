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
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}