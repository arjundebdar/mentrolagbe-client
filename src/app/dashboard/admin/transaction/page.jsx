import TransactionTable from "@/app/components/dashboard/TransactionTable";
import { cookies } from "next/headers";

const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 2,
    }).format(Number(amount || 0));
};

const summaryCards = (stats = {}) => [
    {
        title: "Total Transactions",
        value: stats.totalTransactions || 0,
        icon: "↗",
        color: "bg-blue-50 text-blue-600",
    },
    {
        title: "Total Revenue",
        value: formatAmount(stats.totalRevenue),
        icon: "৳",
        color: "bg-green-50 text-green-600",
    },
    {
        title: "Successful Payments",
        value: stats.successfulTransactions || 0,
        icon: "✓",
        color: "bg-emerald-50 text-emerald-600",
    },
    {
        title: "Failed Payments",
        value: stats.failedTransactions || 0,
        icon: "!",
        color: "bg-red-50 text-red-600",
    },
];


async function getTransactions() {
    try {

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/transactions`,
            {
                headers: {
                    cache: "no-store",
                },
            }
        );

        const responseText = await response.text();

        console.log("Transaction API Status:", response.status);
        console.log("Transaction API Response:", responseText);

        if (!response.ok) {
            throw new Error(
                `API Error ${response.status}: ${responseText}`
            );
        }

        return JSON.parse(responseText);

    } catch (error) {
        console.error("Transaction fetch error:", error);

        return {
            transactions: [],
            stats: {},
            error: error.message,
        };
    }
}


const AdminTransactionsPage = async () => {
    const data = await getTransactions();

    const transactions = data.transactions || [];
    const stats = data.stats || {};

    return (
        <section className="space-y-7 p-4 md:p-6 lg:p-8">

            {/* Header */}
            <div>
                <p className="mb-2 text-sm font-medium text-emerald-600">
                    ADMIN / TRANSACTIONS
                </p>

                <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
                    Transaction Management
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Monitor all payments and transaction activities.
                </p>
            </div>

            {/* Error */}
            {data.error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {data.error}
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {summaryCards(stats).map((card) => (
                    <div
                        key={card.title}
                        className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    {card.title}
                                </p>

                                <h2 className="mt-3 text-2xl font-bold text-gray-800">
                                    {card.value}
                                </h2>
                            </div>

                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold ${card.color}`}>
                                {card.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Client Component */}
            <TransactionTable transactions={transactions} />

        </section>
    );
}
export default AdminTransactionsPage;