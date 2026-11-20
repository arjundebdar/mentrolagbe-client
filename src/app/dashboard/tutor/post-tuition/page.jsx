"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    BookOpen,
    UploadCloud,
    ImagePlus,
    X,
    Loader2,
    MapPin,
    Wallet,
    CalendarDays,
    GraduationCap,
    FileText,
    Sparkles,
    FileImage,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Bangla",
    "ICT",
    "Programming",
    "IELTS",
    "Accounting",
    "Economics",
    "Other",
];

const classLevels = [
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
    "SSC",
    "HSC",
    "University",
    "Admission Test",
    "Professional",
];

const initialForm = {
    title: "",
    subject: "",
    classLevel: "",
    mode: "Online",
    location: "",
    monthlyFee: "",
    daysPerWeek: "",
    description: "",
};

const inputStyle =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const labelStyle = "mb-2 block text-sm font-semibold text-slate-700";

const PostTuitionPage = () => {
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();

    const [form, setForm] = useState(initialForm);
    const [image, setImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files?.[0];

        if (!selectedImage) return;

        if (!selectedImage.type.startsWith("image/")) {
            toast.error("Please select a valid image.");
            e.target.value = "";
            return;
        }

        if (selectedImage.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5 MB.");
            e.target.value = "";
            return;
        }

        setImage(selectedImage);
    };

    const removeImage = () => {
        setImage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            toast.error("Please upload a tuition banner image.");
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Create FormData
            const formData = new FormData();

            // 2. Add form information
            formData.append("title", form.title);
            formData.append("subject", form.subject);
            formData.append("classLevel", form.classLevel);
            formData.append("mode", form.mode);
            formData.append("location", form.location);
            formData.append("monthlyFee", form.monthlyFee);
            formData.append("daysPerWeek", form.daysPerWeek);
            formData.append("description", form.description);

            // 3. Add tutor information
            formData.append("tutorName", session.user.name || "");
            formData.append("tutorEmail", session.user.email || "");
            // 4. Add image file
            formData.append("image", image);

            // 5. Send data to Express server
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/tuitions`,
                {
                    method: "POST",
                    body: formData,
                }
            );
            // 6. Read raw response first
            const responseText = await response.text();
            console.log("Response Status:", response.status);
            console.log("Response Content:", responseText);
            // 7. Convert response to JSON
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (error) {
                throw new Error(
                    "Server returned an invalid response. Check backend console."
                );
            }
            // 8. Check response
            if (!response.ok) {
                throw new Error(result.message || "Failed to post tuition");
            }
            // 9. Success
            toast.success("Tuition posted successfully!");
            setForm(initialForm);
            setImage(null);
            router.refresh();

        } catch (error) {
            console.error("Post tuition error:", error);
            toast.error(error.message || "Something went wrong!");

        } finally {
            setIsSubmitting(false);
        }
    };

    if (isPending) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="animate-spin text-emerald-600" size={32} />
            </div>
        );
    }

    if (!session?.user) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <h2 className="text-xl font-bold text-slate-800">
                    Sign in required
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    Please sign in to post a tuition.
                </p>
                <button
                    onClick={() => router.push("/sign-in")}
                    className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 text-white"
                >
                    Sign In
                </button>
            </div>
        );
    }

    if (session.user.role !== "tutor") {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <GraduationCap size={42} className="text-slate-400" />
                <h2 className="mt-4 text-xl font-bold text-slate-800">
                    Access Restricted
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    Only registered tutors can create tuition posts.
                </p>
                <button
                    onClick={() => router.push("/dashboard")}
                    className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 text-white"
                >
                    Go to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

            {/* Page Header */}
            <div className="mb-8">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-emerald-600">
                    <Sparkles size={16} />
                    Tutor Dashboard
                </div>

                <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                    Post a New Tuition
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Share your teaching opportunity and connect with students.
                </p>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="mx-auto max-w-4xl space-y-6"
            >
                {/* Basic Information */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
                    <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                            <BookOpen size={21} />
                        </div>

                        <div>
                            <h2 className="font-bold text-slate-800">
                                Basic Information
                            </h2>
                            <p className="text-xs text-slate-400">
                                Enter the main details of your tuition.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className={labelStyle}>
                                Tuition Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g. Experienced Physics Tutor Needed"
                                className={inputStyle}
                                required
                                maxLength={100}
                            />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className={labelStyle}>
                                    Subject *
                                </label>
                                <select
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleChange}
                                    className={inputStyle}
                                    required
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map((subject) => (
                                        <option key={subject} value={subject}>
                                            {subject}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={labelStyle}>
                                    Class Level *
                                </label>
                                <select
                                    name="classLevel"
                                    value={form.classLevel}
                                    onChange={handleChange}
                                    className={inputStyle}
                                    required
                                >
                                    <option value="">Select Class Level</option>
                                    {classLevels.map((level) => (
                                        <option key={level} value={level}>
                                            {level}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className={labelStyle}>
                                Tuition Description *
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe your teaching experience, learning goals, requirements and other details..."
                                className={`${inputStyle} min-h-36 resize-y`}
                                required
                                minLength={20}
                                maxLength={2000}
                            />
                            <p className="mt-1 text-right text-xs text-slate-400">
                                {form.description.length}/2000 characters
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tuition Details */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
                    <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                            <CalendarDays size={21} />
                        </div>

                        <div>
                            <h2 className="font-bold text-slate-800">
                                Tuition Details
                            </h2>
                            <p className="text-xs text-slate-400">
                                Set your tuition schedule and fee.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className={labelStyle}>
                                Teaching Mode *
                            </label>

                            <div className="grid grid-cols-2 gap-4">
                                {["Online", "Offline"].map((mode) => (
                                    <button
                                        key={mode}
                                        type="button"
                                        onClick={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                mode,
                                            }))
                                        }
                                        className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${form.mode === mode
                                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                            : "border-slate-200 text-slate-600 hover:border-emerald-300"
                                            }`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className={labelStyle}>
                                <span className="inline-flex items-center gap-2">
                                    <MapPin size={16} />
                                    Location {form.mode === "Offline" ? "*" : "(Optional)"}
                                </span>
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder={
                                    form.mode === "Offline"
                                        ? "e.g. Dhanmondi, Dhaka"
                                        : "e.g. Dhaka (if applicable)"
                                }
                                className={inputStyle}
                                required={form.mode === "Offline"}
                            />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className={labelStyle}>
                                    <Wallet size={15} className="mr-1 inline" />
                                    Monthly Fee *
                                </label>

                                <input
                                    type="number"
                                    name="monthlyFee"
                                    value={form.monthlyFee}
                                    onChange={handleChange}
                                    placeholder="e.g. 5000"
                                    className={inputStyle}
                                    min="1"
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelStyle}>
                                    <CalendarDays size={15} className="mr-1 inline" />
                                    Days Per Week *
                                </label>

                                <select
                                    name="daysPerWeek"
                                    value={form.daysPerWeek}
                                    onChange={handleChange}
                                    className={inputStyle}
                                    required
                                >
                                    <option value="">Select Days</option>
                                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                                        <option key={day} value={day}>
                                            {day} {day === 1 ? "Day" : "Days"}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Banner Image */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
                    <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600">
                            <ImagePlus size={21} />
                        </div>

                        <div>
                            <h2 className="font-bold text-slate-800">
                                Tuition Banner Image
                            </h2>
                            <p className="text-xs text-slate-400">
                                Upload an image for your tuition (only file name will be shown).
                            </p>
                        </div>
                    </div>

                    {image ? (
                        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600">
                                    <FileImage size={20} />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-700">
                                        {image.name}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {(image.size / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={removeImage}
                                className="rounded-full p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                                aria-label="Remove image"
                            >
                                <X size={19} />
                            </button>
                        </div>
                    ) : (
                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center transition hover:border-emerald-400 hover:bg-emerald-50/50">
                            <div className="mb-4 rounded-full bg-emerald-100 p-4 text-emerald-600">
                                <UploadCloud size={30} />
                            </div>

                            <p className="font-semibold text-slate-700">
                                Click to upload banner image
                            </p>

                            <p className="mt-2 text-xs text-slate-400">
                                PNG, JPG, JPEG or WEBP (Maximum 5 MB)
                            </p>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>

                {/* Tutor Information */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="rounded-xl bg-orange-50 p-2.5 text-orange-600">
                            <GraduationCap size={21} />
                        </div>

                        <div>
                            <h2 className="font-bold text-slate-800">
                                Tutor Information
                            </h2>
                            <p className="text-xs text-slate-400">
                                Your account information is added automatically.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className={labelStyle}>Tutor Name</label>
                            <input
                                value={session.user.name || ""}
                                readOnly
                                className={`${inputStyle} cursor-not-allowed bg-slate-50`}
                            />
                        </div>

                        <div>
                            <label className={labelStyle}>Tutor Email</label>
                            <input
                                value={session.user.email || ""}
                                readOnly
                                className={`${inputStyle} cursor-not-allowed bg-slate-50`}
                            />
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                        className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Publishing...
                            </>
                        ) : (
                            <>
                                <FileText size={18} />
                                Submit Tuition
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostTuitionPage;