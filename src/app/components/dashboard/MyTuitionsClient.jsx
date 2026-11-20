
"use client";

import { useState } from "react";
import Link from "next/link";
import {
    BookOpen,
    Plus,
    Search,
    MapPin,
    CalendarDays,
    Wallet,
    Pencil,
    Trash2,
    Clock,
    CheckCircle2,
    XCircle,
    Loader2,
    GraduationCap,
    X,
    RefreshCw,
    Power,
} from "lucide-react";
import { toast } from "react-toastify";


const MyTuitionsClient = ({ initialTuitions }) => {
    const [tuitions, setTuitions] = useState(initialTuitions);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const [editingTuition, setEditingTuition] = useState(null);

    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Refresh tuition posts
    const fetchMyTuitions = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/tuitions/my-tuitions`,
                {
                    credentials: "include",
                    cache: "no-store",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to load tuition posts"
                );
            }

            const data = Array.isArray(result)
                ? result
                : result.tuitions || result.data || [];

            setTuitions(data);
            toast.success("Tuition posts refreshed");
        } catch (error) {
            console.error("Refresh error:", error);
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Delete tuition
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this tuition post?"
        );

        if (!confirmed) return;

        try {
            setDeletingId(id);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/tuitions/${id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const result = await res.json();

            if (!res.ok) {
                throw new Error(
                    result.message || "Failed to delete tuition"
                );
            }

            setTuitions((prev) =>
                prev.filter((tuition) => tuition._id !== id)
            );

            toast.success("Tuition deleted successfully");
        } catch (error) {
            console.error("Delete error:", error);
            toast.error(error.message || "Failed to delete tuition");
        } finally {
            setDeletingId(null);
        }
    };

    // Toggle active / closed status
    const handleToggleStatus = async (tuition) => {
        const id = tuition._id;

        try {
            setUpdatingId(id);

            const response = await fetch(
                `${API_URL}/tuitions/${id}/status`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        isActive: !tuition.isActive,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to update status"
                );
            }

            setTuitions((prev) =>
                prev.map((item) =>
                    item._id === id
                        ? { ...item, isActive: !tuition.isActive }
                        : item
                )
            );

            toast.success(
                tuition.isActive
                    ? "Tuition closed successfully"
                    : "Tuition activated successfully"
            );
        } catch (error) {
            console.error("Status update error:", error);
            toast.error(error.message || "Status update failed");
        } finally {
            setUpdatingId(null);
        }
    };

    // Open edit modal
    const handleEdit = (tuition) => {
        setEditingTuition({
            _id: tuition._id,
            title: tuition.title || "",
            subject: tuition.subject || "",
            classLevel: tuition.classLevel || "",
            mode: tuition.mode || "",
            location: tuition.location || "",
            monthlyFee: tuition.monthlyFee ?? "",
            daysPerWeek: tuition.daysPerWeek ?? "",
            description: tuition.description || "",
        });
    };

    // Edit input handler
    const handleEditChange = (e) => {
        const { name, value } = e.target;

        setEditingTuition((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Save edited tuition
    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!editingTuition) return;

        try {
            setSaving(true);

            const {
                _id,
                title,
                subject,
                classLevel,
                mode,
                location,
                monthlyFee,
                daysPerWeek,
                description,
            } = editingTuition;

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/tuitions/${_id}`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title,
                        subject,
                        classLevel,
                        mode,
                        location,
                        monthlyFee: Number(monthlyFee),
                        daysPerWeek: Number(daysPerWeek),
                        description,
                    }),
                }
            );

            const result = await res.json();

            console.log("API Status:", res.status);
            console.log("API Response:", result);

            if (!res.ok) {
                throw new Error(
                    result.message || "Failed to update tuition"
                );
            }

            const updatedTuition =
                result.tuition || result.data || {
                    ...editingTuition,
                };

            setTuitions((prev) =>
                prev.map((item) =>
                    item._id === _id
                        ? { ...item, ...updatedTuition }
                        : item
                )
            );

            setEditingTuition(null);
            toast.success("Tuition updated successfully");
        } catch (error) {
            console.error("Update error:", error);
            toast.error(error.message || "Failed to update tuition");
        } finally {
            setSaving(false);
        }
    };

    // Search and filter
    const filteredTuitions = tuitions.filter((tuition) => {
        const searchTerm = search.toLowerCase();

        const matchesSearch =
            tuition.title?.toLowerCase().includes(searchTerm) ||
            tuition.subject?.toLowerCase().includes(searchTerm) ||
            tuition.location?.toLowerCase().includes(searchTerm);

        const matchesFilter =
            filter === "all" ||
            (filter === "pending" &&
                tuition.approvalStatus === "pending") ||
            (filter === "approved" &&
                tuition.approvalStatus === "approved") ||
            (filter === "rejected" &&
                tuition.approvalStatus === "rejected") ||
            (filter === "active" && tuition.isActive === true) ||
            (filter === "closed" && tuition.isActive === false);

        return matchesSearch && matchesFilter;
    });

    // Statistics
    const totalTuitions = tuitions.length;

    const pendingTuitions = tuitions.filter(
        (item) => item.approvalStatus === "pending"
    ).length;

    const approvedTuitions = tuitions.filter(
        (item) => item.approvalStatus === "approved"
    ).length;

    const rejectedTuitions = tuitions.filter(
        (item) => item.approvalStatus === "rejected"
    ).length;

    const getStatusStyle = (status) => {
        switch (status) {
            case "approved":
                return "bg-green-100 text-green-700";

            case "rejected":
                return "bg-red-100 text-red-700";

            default:
                return "bg-amber-100 text-amber-700";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "approved":
                return <CheckCircle2 size={14} />;

            case "rejected":
                return <XCircle size={14} />;

            default:
                return <Clock size={14} />;
        }
    };

    const inputStyle =
        "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100";

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-green-600">
                            <GraduationCap size={22} />
                            <span className="text-sm font-semibold">
                                Tutor Dashboard
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                            My Tuitions
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Manage your tuition posts, update information
                            and track approval status.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={fetchMyTuitions}
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
                        >
                            <RefreshCw
                                size={17}
                                className={loading ? "animate-spin" : ""}
                            />
                            Refresh
                        </button>

                        <Link
                            href="/dashboard/tutor/post-tuition"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                        >
                            <Plus size={18} />
                            Post New Tuition
                        </Link>
                    </div>
                </div>

                {/* Statistics */}
                <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <BookOpen size={20} />
                        </div>
                        <p className="text-sm text-gray-500">
                            Total Tuitions
                        </p>
                        <h2 className="mt-1 text-2xl font-bold text-gray-900">
                            {totalTuitions}
                        </h2>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <Clock size={20} />
                        </div>
                        <p className="text-sm text-gray-500">
                            Pending
                        </p>
                        <h2 className="mt-1 text-2xl font-bold text-gray-900">
                            {pendingTuitions}
                        </h2>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                            <CheckCircle2 size={20} />
                        </div>
                        <p className="text-sm text-gray-500">
                            Approved
                        </p>
                        <h2 className="mt-1 text-2xl font-bold text-gray-900">
                            {approvedTuitions}
                        </h2>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                            <XCircle size={20} />
                        </div>
                        <p className="text-sm text-gray-500">
                            Rejected
                        </p>
                        <h2 className="mt-1 text-2xl font-bold text-gray-900">
                            {rejectedTuitions}
                        </h2>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="relative w-full lg:max-w-md">
                            <Search
                                size={19}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by title, subject or location..."
                                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {[
                                "all",
                                "pending",
                                "approved",
                                "rejected",
                                "active",
                                "closed",
                            ].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => setFilter(item)}
                                    className={`rounded-lg px-4 py-2 text-xs font-semibold capitalize transition ${filter === item
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tuition Table */}
                {filteredTuitions.length === 0 ? (
                    <div className="rounded-2xl border border-gray-100 bg-white px-5 py-16 text-center shadow-sm">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
                            <BookOpen size={30} />
                        </div>

                        <h3 className="text-lg font-bold text-gray-900">
                            No Tuitions Found
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                            {tuitions.length === 0
                                ? "You haven't posted any tuition yet. Create your first tuition post to get started."
                                : "No tuition posts match your search or selected filter."}
                        </p>

                        {tuitions.length === 0 && (
                            <Link
                                href="/dashboard/tutor/post-tuition"
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                            >
                                <Plus size={17} />
                                Post Your First Tuition
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

                        <div className="border-b border-gray-100 px-5 py-4">
                            <h2 className="text-lg font-bold text-gray-900">
                                Your Tuition Posts
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Manage and monitor all your tuition posts.
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[850px] text-left">

                                {/* Table Header */}
                                <thead className="bg-gray-50">
                                    <tr className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        <th className="px-6 py-4">Tuitions</th>
                                        <th className="px-6 py-4">Subject</th>
                                        <th className="px-6 py-4">Approval Status</th>
                                        <th className="px-6 py-4">Active Status</th>
                                        <th className="px-6 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody className="divide-y divide-gray-100">
                                    {filteredTuitions.map((tuition) => (
                                        <tr
                                            key={tuition._id}
                                            className="transition hover:bg-gray-50"
                                        >
                                            {/* Tuition */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {tuition.bannerImage ? (
                                                        <img
                                                            src={tuition.bannerImage}
                                                            alt={tuition.title || "Tuition"}
                                                            className="h-12 w-12 rounded-xl object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                                                            <BookOpen size={22} />
                                                        </div>
                                                    )}

                                                    <div className="min-w-0">
                                                        <p className="max-w-[220px] truncate text-sm font-semibold text-gray-900">
                                                            {tuition.title}
                                                        </p>

                                                        <p className="mt-1 text-xs text-gray-400">
                                                            {tuition.classLevel || "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Subject */}
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-gray-700">
                                                    {tuition.subject || "N/A"}
                                                </span>
                                            </td>

                                            {/* Approval Status */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                                                        tuition.approvalStatus
                                                    )}`}
                                                >
                                                    {getStatusIcon(
                                                        tuition.approvalStatus
                                                    )}
                                                    {tuition.approvalStatus || "pending"}
                                                </span>
                                            </td>

                                            {/* Active Status */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${tuition.isActive
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-600"
                                                        }`}
                                                >
                                                    <span
                                                        className={`h-2 w-2 rounded-full ${tuition.isActive
                                                            ? "bg-green-500"
                                                            : "bg-gray-400"
                                                            }`}
                                                    />
                                                    {tuition.isActive ? "Active" : "Closed"}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">

                                                    {/* Edit */}
                                                    <button
                                                        onClick={() => handleEdit(tuition)}
                                                        title="Edit Tuition"
                                                        className="rounded-lg bg-blue-50 p-2.5 text-blue-600 transition hover:bg-blue-100"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>

                                                    {/* Toggle Status */}
                                                    <button
                                                        onClick={() =>
                                                            handleToggleStatus(tuition)
                                                        }
                                                        disabled={updatingId === tuition._id}
                                                        title={
                                                            tuition.isActive
                                                                ? "Close Tuition"
                                                                : "Activate Tuition"
                                                        }
                                                        className="rounded-lg bg-amber-50 p-2.5 text-amber-600 transition hover:bg-amber-100 disabled:opacity-50"
                                                    >
                                                        {updatingId === tuition._id ? (
                                                            <Loader2
                                                                size={16}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <Power size={16} />
                                                        )}
                                                    </button>

                                                    {/* Delete */}
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(tuition._id)
                                                        }
                                                        disabled={deletingId === tuition._id}
                                                        title="Delete Tuition"
                                                        className="rounded-lg bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                                                    >
                                                        {deletingId === tuition._id ? (
                                                            <Loader2
                                                                size={16}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <Trash2 size={16} />
                                                        )}
                                                    </button>

                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Table Footer */}
                        <div className="border-t border-gray-100 px-6 py-4">
                            <p className="text-sm text-gray-500">
                                Showing{" "}
                                <span className="font-semibold text-gray-900">
                                    {filteredTuitions.length}
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold text-gray-900">
                                    {tuitions.length}
                                </span>{" "}
                                tuition posts
                            </p>
                        </div>
                    </div>
                )}

            </div>

            {/* Edit Modal */}
            {editingTuition && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
                    <div className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-gray-100 p-5">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Edit Tuition
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Update your tuition information.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setEditingTuition(null)}
                                disabled={saving}
                                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                            >
                                <X size={21} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form
                            onSubmit={handleUpdate}
                            className="space-y-5 p-5"
                        >
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Tuition Title
                                    </label>

                                    <input
                                        type="text"
                                        name="title"
                                        value={editingTuition.title}
                                        onChange={handleEditChange}
                                        required
                                        className={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Subject
                                    </label>

                                    <input
                                        type="text"
                                        name="subject"
                                        value={editingTuition.subject}
                                        onChange={handleEditChange}
                                        required
                                        className={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Class Level
                                    </label>

                                    <input
                                        type="text"
                                        name="classLevel"
                                        value={editingTuition.classLevel}
                                        onChange={handleEditChange}
                                        required
                                        className={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Teaching Mode
                                    </label>

                                    <select
                                        name="mode"
                                        value={editingTuition.mode}
                                        onChange={handleEditChange}
                                        required
                                        className={inputStyle}
                                    >
                                        <option value="">
                                            Select Mode
                                        </option>
                                        <option value="online">
                                            Online
                                        </option>
                                        <option value="offline">
                                            Offline
                                        </option>
                                        <option value="both">
                                            Both
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Location
                                    </label>

                                    <input
                                        type="text"
                                        name="location"
                                        value={editingTuition.location}
                                        onChange={handleEditChange}
                                        required
                                        className={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Monthly Fee (৳)
                                    </label>

                                    <input
                                        type="number"
                                        name="monthlyFee"
                                        min="0"
                                        value={editingTuition.monthlyFee}
                                        onChange={handleEditChange}
                                        required
                                        className={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Days Per Week
                                    </label>

                                    <input
                                        type="number"
                                        name="daysPerWeek"
                                        min="1"
                                        max="7"
                                        value={editingTuition.daysPerWeek}
                                        onChange={handleEditChange}
                                        required
                                        className={inputStyle}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        rows={4}
                                        value={editingTuition.description}
                                        onChange={handleEditChange}
                                        required
                                        className={`${inputStyle} resize-none`}
                                    />
                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditingTuition(null)
                                    }
                                    disabled={saving}
                                    className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2
                                                size={17}
                                                className="animate-spin"
                                            />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={17} />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyTuitionsClient;
