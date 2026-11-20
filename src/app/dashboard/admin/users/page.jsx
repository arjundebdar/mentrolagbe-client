
import Link from "next/link";
import { revalidatePath } from "next/cache";
export const instant = false;

// Update user role
async function updateUserRole(formData) {
    "use server";

    const email = formData.get("email");
    const role = formData.get("role");

    if (!email || !["student", "tutor", "admin"].includes(role)) {
        throw new Error("Invalid user information");
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/role/${encodeURIComponent(email)}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ role }),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update user role");
    }

    revalidatePath("/dashboard/admin/users");
}

// Suspend / Activate user
async function updateUserStatus(formData) {
    "use server";

    const email = formData.get("email");
    const isActive = formData.get("isActive") === "true";

    if (!email) {
        throw new Error("User email is required");
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${encodeURIComponent(email)}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ isActive }),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update user status");
    }

    revalidatePath("/dashboard/admin/users");
}

export default async function ManageUsersPage({ searchParams }) {
    const params = await searchParams;
    const selectedRole = params?.role || "all";
    const search = params?.q || "";

    let users = [];
    let error = "";

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URLAPI_URL}/users`,
            {
                cache: "no-store",
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }

        const data = await response.json();

        users = Array.isArray(data)
            ? data
            : data.users || [];
    } catch (err) {
        error = err.message;
    }

    // Filter users by role
    const filteredUsers = users.filter((user) => {
        const matchesRole =
            selectedRole === "all" ||
            user.role === selectedRole;

        const matchesSearch =
            user.name?.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase());

        return matchesRole && matchesSearch;
    });

    const totalUsers = users.length;
    const totalStudents = users.filter(
        (user) => user.role === "student"
    ).length;
    const totalTutors = users.filter(
        (user) => user.role === "tutor"
    ).length;
    const totalAdmins = users.filter(
        (user) => user.role === "admin"
    ).length;

    const filters = [
        { label: "All Users", value: "all", count: totalUsers },
        { label: "Students", value: "student", count: totalStudents },
        { label: "Tutors", value: "tutor", count: totalTutors },
        { label: "Admins", value: "admin", count: totalAdmins },
    ];

    return (
        <div className="min-h-screen bg-[#f8faf9] p-4 md:p-8">

            {/* Header */}
            <div className="mb-8">
                <p className="mb-2 text-sm font-medium text-green-600">
                    Admin Dashboard / Users
                </p>

                <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
                    Manage Users
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    View, manage and control all registered users.
                </p>
            </div>

            {/* Statistics */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {[
                    { title: "Total Users", value: totalUsers },
                    { title: "Students", value: totalStudents },
                    { title: "Tutors", value: totalTutors },
                    { title: "Admins", value: totalAdmins },
                ].map((item) => (
                    <div
                        key={item.title}
                        className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                    >
                        <p className="text-sm text-gray-500">
                            {item.title}
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-gray-800">
                            {item.value}
                        </h2>
                    </div>
                ))}

            </div>

            {/* Users Table */}
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

                <div className="border-b border-gray-100 p-5">

                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                All Registered Users
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Manage user roles and account status.
                            </p>
                        </div>

                        {/* Search */}
                        <form className="flex gap-2">
                            <input
                                type="text"
                                name="q"
                                defaultValue={search}
                                placeholder="Search name or email..."
                                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-green-500 sm:w-64"
                            />

                            {selectedRole !== "all" && (
                                <input
                                    type="hidden"
                                    name="role"
                                    value={selectedRole}
                                />
                            )}

                            <button
                                type="submit"
                                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                            >
                                Search
                            </button>
                        </form>

                    </div>

                    {/* Role Filters */}
                    <div className="mt-5 flex flex-wrap gap-2">
                        {filters.map((filter) => (
                            <Link
                                key={filter.value}
                                href={`/dashboard/admin/users?role=${filter.value}`}
                                className={`rounded-lg px-4 py-2 text-sm font-medium ${selectedRole === filter.value
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {filter.label} ({filter.count})
                            </Link>
                        ))}
                    </div>

                </div>

                {/* Error */}
                {error ? (
                    <div className="p-8 text-center text-red-500">
                        {error}
                    </div>
                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1000px] text-left text-sm">

                            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-5 py-4">User</th>
                                    <th className="px-5 py-4">Phone</th>
                                    <th className="px-5 py-4">Role</th>
                                    <th className="px-5 py-4">Plan</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4">Joined Date</th>
                                    <th className="px-5 py-4">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50">

                                        {/* User */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">

                                                {user.image ? (
                                                    <img
                                                        src={user.image}
                                                        alt={user.name || "User"}
                                                        className="h-10 w-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 font-semibold text-green-700">
                                                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                                                    </div>
                                                )}

                                                <div>
                                                    <p className="font-semibold text-gray-800">
                                                        {user.name || "Unknown"}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        {user.email}
                                                    </p>
                                                </div>

                                            </div>
                                        </td>

                                        {/* Phone */}
                                        <td className="px-5 py-4 text-gray-600">
                                            {user.phone || "N/A"}
                                        </td>

                                        {/* Role */}
                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium capitalize text-blue-700">
                                                {user.role}
                                            </span>
                                        </td>

                                        {/* Plan */}
                                        <td className="px-5 py-4">
                                            <span className="font-medium capitalize text-gray-600">
                                                {user.plan || "Free"}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${user.isActive === false
                                                    ? "bg-red-50 text-red-600"
                                                    : "bg-green-50 text-green-600"
                                                    }`}
                                            >
                                                {user.isActive === false
                                                    ? "Suspended"
                                                    : "Active"}
                                            </span>
                                        </td>

                                        {/* Joined Date */}
                                        <td className="px-5 py-4 text-gray-500">
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString("en-GB")
                                                : "N/A"}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4">

                                            <div className="flex items-center gap-3">

                                                {/* Role Update */}
                                                <form action={updateUserRole} className="flex items-center gap-2">

                                                    <input
                                                        type="hidden"
                                                        name="email"
                                                        value={user.email}
                                                    />

                                                    <select
                                                        name="role"
                                                        defaultValue={user.role}
                                                        className="rounded-md border border-gray-200 px-2 py-2 text-xs outline-none"
                                                    >
                                                        <option value="student">Student</option>
                                                        <option value="tutor">Tutor</option>
                                                        <option value="admin">Admin</option>
                                                    </select>

                                                    <button
                                                        type="submit"
                                                        className="rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
                                                    >
                                                        Save
                                                    </button>

                                                </form>

                                                {/* Suspend / Activate */}
                                                <form action={updateUserStatus}>
                                                    <input
                                                        type="hidden"
                                                        name="email"
                                                        value={user.email}
                                                    />

                                                    <input
                                                        type="hidden"
                                                        name="isActive"
                                                        value={user.isActive === false ? "true" : "false"}
                                                    />

                                                    <button
                                                        type="submit"
                                                        className={`rounded-md px-3 py-2 text-xs font-medium text-white ${user.isActive === false
                                                            ? "bg-green-600 hover:bg-green-700"
                                                            : "bg-red-500 hover:bg-red-600"
                                                            }`}
                                                    >
                                                        {user.isActive === false
                                                            ? "Activate"
                                                            : "Suspend"}
                                                    </button>
                                                </form>

                                            </div>

                                        </td>

                                    </tr>
                                ))}

                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-5 py-12 text-center text-gray-500"
                                        >
                                            No users found.
                                        </td>
                                    </tr>
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
    );
}
