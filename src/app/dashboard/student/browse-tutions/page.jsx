
import Link from "next/link";
import {
    Search,
    MapPin,
    BookOpen,
    GraduationCap,
    CalendarDays,
    ArrowRight,
    SlidersHorizontal,
} from "lucide-react";



async function getTuitions(searchParams) {
    const params = new URLSearchParams();

    if (searchParams.search) {
        params.set("search", searchParams.search);
    }

    if (searchParams.classLevel) {
        params.set("classLevel", searchParams.classLevel);
    }

    if (searchParams.mode) {
        params.set("mode", searchParams.mode);
    }

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/tuitions?${params.toString()}`,
            { cache: "no-store" }
        );

        if (!response.ok) return [];

        return await response.json();
    } catch (error) {
        console.error("Tuition fetch error:", error);
        return [];
    }
}

const TuitionsPage = async ({ searchParams }) => {
    const filters = await searchParams;
    const tuitions = await getTuitions(filters);

    return (
        <main className="min-h-screen bg-[#F7F9FC]">


            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                {/* Search and Filter */}
                <form
                    action="/tuitions"
                    method="GET"
                    className="mb-9 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5"
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div className="relative md:col-span-2">
                            <Search
                                size={19}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                name="search"
                                defaultValue={filters.search || ""}
                                placeholder="Search by tuition or subject..."
                                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        <select
                            name="classLevel"
                            defaultValue={filters.classLevel || ""}
                            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 outline-none focus:border-emerald-500"
                        >
                            <option value="">All Classes</option>
                            {[
                                "Class 1",
                                "Class 2",
                                "Class 3",
                                "Class 4",
                                "Class 5",
                                "Class 6",
                                "Class 7",
                                "Class 8",
                                "Class 9",
                                "Class 10",
                                "Class 11",
                                "Class 12",
                                "HSC",
                                "Admission",
                            ].map((level) => (
                                <option key={level} value={level}>
                                    {level}
                                </option>
                            ))}
                        </select>

                        <select
                            name="mode"
                            defaultValue={filters.mode || ""}
                            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 outline-none focus:border-emerald-500"
                        >
                            <option value="">All Modes</option>
                            <option value="Online">Online</option>
                            <option value="Offline">Offline</option>
                        </select>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                            <SlidersHorizontal size={17} />
                            Apply Filters
                        </button>

                        <Link
                            href="/tuitions"
                            className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            Clear Filters
                        </Link>
                    </div>
                </form>

                {/* Results Heading */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Available Tuitions
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Find an opportunity that matches your goals.
                        </p>
                    </div>

                    <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                        {tuitions.length} Results
                    </span>
                </div>

                {/* Tuition Cards */}
                {tuitions.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {tuitions.map((tuition) => (
                            <article
                                key={tuition._id}
                                className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="relative h-48 overflow-hidden bg-slate-100">
                                    {tuition.bannerImage ? (
                                        <img
                                            src={tuition.bannerImage}
                                            alt={tuition.title}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-slate-300">
                                            <BookOpen size={48} />
                                        </div>
                                    )}

                                    <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-700 shadow-sm">
                                        {tuition.mode}
                                    </span>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                                            {tuition.subject}
                                        </span>

                                        <span className="text-xs text-slate-400">
                                            {tuition.classLevel}
                                        </span>
                                    </div>

                                    <h3 className="mt-3 line-clamp-1 text-lg font-bold text-slate-800">
                                        {tuition.title}
                                    </h3>

                                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                        <GraduationCap size={16} />
                                        {tuition.tutorName || "Experienced Tutor"}
                                    </p>

                                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                        <MapPin size={16} />
                                        <span className="line-clamp-1">
                                            {tuition.location || "Location not specified"}
                                        </span>
                                    </p>

                                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                        <CalendarDays size={16} />
                                        {tuition.daysPerWeek || "—"} Days / Week
                                    </p>

                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                                        <div>
                                            <p className="text-xs text-slate-400">
                                                Monthly Fee
                                            </p>
                                            <p className="text-lg font-extrabold text-slate-800">
                                                ${Number(tuition.monthlyFee || 0).toLocaleString("en-BD")}
                                            </p>
                                        </div>

                                        <Link
                                            href={`./browse-tutions/${tuition._id}`}
                                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                        >
                                            Details
                                            <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-slate-100 bg-white px-5 py-16 text-center">
                        <BookOpen
                            size={48}
                            className="mx-auto text-slate-300"
                        />

                        <h3 className="mt-4 text-xl font-bold text-slate-800">
                            No Tuitions Found
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Try changing your search or filter options.
                        </p>

                        <Link
                            href="/tuitions"
                            className="mt-5 inline-block rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                            View All Tuitions
                        </Link>
                    </div>
                )}
            </section>
        </main>
    );
}


export default TuitionsPage;