"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  UserRound,
  Mail,
  LockKeyhole,
  Laptop,
  BookOpen,
  Users,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();

  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        plan: "free",
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Registration failed!");
        return;
      }

      toast.success("Account created successfully!");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
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
            <h1 className="text-2xl font-bold mb-2">Join MentorLagbe</h1>
            <hr className="w-50 mb-5" />
            <p className="text-blue-100 text-base leading-7 max-w-xs mx-auto">
              Start learning and teaching today! Connect with mentors and
              discover new opportunities.
            </p>
          </div>

          {/* Illustration */}
          <div className="flex justify-center items-center mt-10 md:mt-0">
            <Image
              src={"/sign_up_img.png"}
              height={250}
              width={200}
              alt="Sign Up Image"
            />
          </div>

          <p className="text-center text-xs text-blue-200 mt-8">
            Learn. Teach. Grow Together.
          </p>
        </div>

        {/* Right Signup Form */}
        <div className="md:col-span-3 flex items-center justify-center p-6 sm:p-10 md:p-12">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-extrabold text-[#102b4e] text-center mb-8">
              Sign Up
            </h2>

            <form onSubmit={handleSignup} className="space-y-5">
              {/* Role Selection */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold transition ${
                    role === "student"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Users size={18} />
                  Student
                </button>

                <button
                  type="button"
                  onClick={() => setRole("tutor")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold transition ${
                    role === "tutor"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <GraduationCap size={19} />
                  Tutor
                </button>
              </div>

              {/* Full Name */}
              <div className="relative">
                <UserRound
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail
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

              {/* Password */}
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
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl transition shadow-md shadow-emerald-100"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-sm text-slate-600 mt-8">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-bold text-emerald-600 hover:text-emerald-700"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
