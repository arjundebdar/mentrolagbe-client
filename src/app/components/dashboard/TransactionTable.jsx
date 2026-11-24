"use client";

import { useState } from "react";

const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 2,
    }).format(Number(amount || 0));
};

const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-BD", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const getStatus = (payment) => {
    return (
        payment.paymentStatus ||
        payment.status ||
        "pending"
    ).toLowerCase();
};

const statusStyles = {
    paid: "bg-green-100 text-green-700",
    successful: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
    refunded: "bg-purple-100 text-purple-700",
};

const TransactionTable = ({ transactions = [] }) => {
    const [activeFilter, setActiveFilter] = useState("all");
    const [search, setSearch] = useState("");

    const filteredTransactions = transactions.filter((payment) => {
        const status = getStatus(payment);

        const matchesFilter =
            activeFilter === "all" ||
            (
                activeFilter === "successful" &&
                ["paid", "successful"].includes(status)
            ) ||
            status === activeFilter;

        const searchText = search.toLowerCase();

        const matchesSearch = [
            payment.transactionId,
            payment.paymentIntentId,
            payment.studentEmail,
            payment.userEmail,
            payment.studentName,
            payment.tuitionTitle,
            payment.title,
        ].some((value) =>
            String(value || "").toLowerCase().includes(searchText)
        );

        return matchesFilter && matchesSearch;
    });

    const filters = [
        { label: "All Transactions", value: "all" },
        { label: "Successful", value: "successful" },
        { label: "Pending", value: "pending" },
        { label: "Failed", value: "failed" },
        { label: "Refunded", value: "refunded" },
    ];

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">
                        All Transactions
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        View and monitor payment records.
                    </p>
                </div>

                <input
                    type="text"
                    placeholder="Search transaction..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 lg:w-72"
                />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 border-b border-gray-100 px-5 py-4">
                {filters.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => setActiveFilter(filter.value)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${activeFilter === filter.value
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[950px] text-left">
                    <thead className="bg-gray-50">
                        <tr className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            <th className="px-5 py-4">Transaction ID</th>
                            <th className="px-5 py-4">Student</th>
                            <th className="px-5 py-4">Tuition</th>
                            <th className="px-5 py-4">Amount</th>
                            <th className="px-5 py-4">Payment Status</th>
                            <th className="px-5 py-4">Payment Date</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {filteredTransactions.map((payment) => {
                            const status = getStatus(payment);

                            return (
                                <tr
                                    key={payment._id}
                                    className="transition hover:bg-gray-50"
                                >
                                    <td className="px-5 py-4">
                                        <p className="max-w-[180px] truncate text-sm font-semibold text-gray-700">
                                            {payment.transactionId ||
                                                payment.paymentIntentId ||
                                                payment._id}
                                        </p>
                                    </td>

                                    <td className="px-5 py-4">
                                        <p className="text-sm font-medium text-gray-800">
                                            {payment.studentName || "Student"}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            {payment.studentEmail ||
                                                payment.userEmail || "N/A"}
                                        </p>
                                    </td>

                                    <td className="px-5 py-4">
                                        <p className="text-sm text-gray-700">
                                            {payment.tuitionTitle ||
                                                payment.title || "N/A"}
                                        </p>
                                    </td>

                                    <td className="px-5 py-4">
                                        <p className="text-sm font-bold text-gray-800">
                                            {formatAmount(payment.amount)}
                                        </p>
                                    </td>

                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[status] ||
                                                "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {status}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4 text-sm text-gray-600">
                                        {formatDate(
                                            payment.createdAt ||
                                            payment.paymentDate
                                        )}
                                    </td>
                                </tr>
                            );
                        })}

                        {filteredTransactions.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-5 py-16 text-center">
                                    <div className="text-4xl">৳</div>

                                    <p className="mt-3 font-semibold text-gray-700">
                                        No transactions found
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        No payment records match your search.
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-5 py-4">
                <p className="text-sm text-gray-500">
                    Showing{" "}
                    <span className="font-semibold text-gray-800">
                        {filteredTransactions.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-800">
                        {transactions.length}
                    </span>{" "}
                    transactions
                </p>
            </div>
        </div>
    );
}
export default TransactionTable;