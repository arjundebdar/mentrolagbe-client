import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import MyTuitionsClient from "@/app/components/dashboard/MyTuitionsClient";
import { Suspense } from "react";

const MyTuitionsPage = () => {
    return (
        <Suspense fallback={<div>Loading my tuitions...</div>}>
            <MyTuitionsContent />
        </Suspense>
    );
}

const MyTuitionsContent = async () => {
    // 1. Get current request headers
    const requestHeaders = await headers();

    // 2. Check logged-in user
    const session = await auth.api.getSession({
        headers: requestHeaders,
    });

    if (!session?.user) {
        redirect("/signin");
    }

    // 3. Check tutor role
    if (session.user.role !== "tutor") {
        redirect("/dashboard");
    }

    // 4. Fetch tutor's tuition posts
    let tuitions = [];
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tuitions/my-tuitions`);
    if (response.ok) {
        const result = await response.json();

        tuitions = Array.isArray(result)
            ? result
            : result.tuitions || result.data || [];
    } else {
        console.error("Failed to fetch tutor tuitions");
    }

    // 5. Send initial data to Client Component
    return <MyTuitionsClient initialTuitions={tuitions} />;
}

export default MyTuitionsPage;