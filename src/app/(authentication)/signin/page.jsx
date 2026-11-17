"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GraduationCap, UserRound, LockKeyhole } from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

export default function SigninPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  // Email Sign In
  const handleSignin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: email.trim(),
        password,
        rememberMe,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Invalid email or password!");
        return;
      }

      toast.success("Signed in successfully!");

      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Google Sign In
  const handleSocialSignin = async () => {
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Google login failed!");
      }
    } catch (error) {
      toast.error(error.message || "Social login failed!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl min-h-[620px] bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-5">
        {/* Left Sidebar */}
        <div className="relative md:col-span-2 bg-[#06294d] text-white p-8 md:p-10 flex flex-col justify-between overflow-hidden">
          {/* Logo */}
          <Link href="/" className="flex justify-center items-center gap-2">
            <GraduationCap size={35} className="text-emerald-400" />

            <span className="text-xl font-bold tracking-tight">
              MentorLagbe
            </span>
          </Link>

          {/* Sidebar Text */}
          <div className="flex flex-col justify-center items-center mt-12 md:mt-0 text-center">
            <h1 className="text-2xl font-bold mb-2">Welcome Back!</h1>

            <hr className="w-50 mb-5" />

            <p className="text-blue-100 text-base leading-7 max-w-xs mx-auto">
              Sign in to continue your learning journey. Connect with mentors
              and achieve your goals.
            </p>
          </div>

          {/* Illustration */}
          <div className="flex justify-center items-center mt-10 md:mt-0">
            <Image
              src="/sign_in_image.png"
              height={200}
              width={300}
              alt="Graduation books illustration"
              className="object-contain"
              priority
            />
          </div>

          <p className="text-center text-xs text-blue-200 mt-8">
            Learn. Teach. Grow Together.
          </p>
        </div>

        {/* Right Sign In Form */}
        <div className="md:col-span-3 flex items-center justify-center p-6 sm:p-10 md:p-12">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-extrabold text-[#102b4e] text-center mb-8">
              Sign In
            </h2>

            <form onSubmit={handleSignin} className="space-y-5">
              {/* Email Tab */}

              {/* Email Input */}
              <div className="relative">
                <UserRound
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between gap-2 text-sm">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                  Remember me
                </label>

                <Link
                  href="/forgot-password"
                  className="font-medium text-slate-600 hover:text-emerald-600 transition"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl transition shadow-md shadow-emerald-100"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* Social Login */}
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-slate-200" />

                <span className="text-sm text-slate-500 font-medium">
                  or continue with
                </span>

                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Google */}
                <button
                  type="button"
                  onClick={handleSocialSignin}
                  className="col-span-2 h-11 flex items-center justify-center gap-2 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <span className="text-xl font-bold text-blue-600">G</span>
                  Google
                </button>
              </div>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-slate-600 mt-7">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-bold text-emerald-600 hover:text-emerald-700 transition"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
