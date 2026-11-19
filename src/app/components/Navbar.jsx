
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Menu,
  X,
  LayoutDashboard,
  UserRound,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

const Navbar = () => {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const user = session?.user;

  // Role-based Dashboard Route
  const dashboardRoutes = {
    student: "/dashboard/student",
    tutor: "/dashboard/tutor",
    admin: "/dashboard/admin",
  };

  const role = user?.role?.toLowerCase() || "Student";

  const dashboardHref = dashboardRoutes[role] || "/dashboard";
  // Role Badge Colors
  const roleStyles = {
    student: "bg-blue-100 text-blue-700",
    tutor: "bg-emerald-100 text-emerald-700",
    admin: "bg-purple-100 text-purple-700",
  };

  // Sign Out
  const handleSignOut = async () => {
    setLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Sign out failed!");
        return;
      }

      toast.success("Signed out successfully!");

      setProfileMenu(false);
      setMobileMenu(false);

      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      setLoggingOut(false);
    }
  };

  // Public Navigation Links
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Tuitions", href: "/tuitions" },
    { name: "Pricing", href: "/#pricing" },
    { name: "How It Works", href: "/#how-it-works" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-100">

      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-[76px] flex items-center justify-between gap-4 " >
          {/* Logo & Brand Name */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0"
          >
            <GraduationCap
              size={38}
              className="text-emerald-600"
            />
            <span className="text-2xl font-extrabold tracking-tight text-[#06294d]">
              Mentor<span className="text-emerald-600">Lagbe</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition"
              >
                {link.name}
              </Link>
            ))}

          </div>

          {/* Authentication Section */}
          <div className="hidden md:flex items-center gap-3">

            {isPending ? (
              <div className="w-24 h-9 bg-slate-100 animate-pulse rounded-lg" />
            ) : user ? (

              /* Authenticated User */
              <div className="flex items-center gap-3">

                {/* Dashboard */}
                {/* <Link
                  href={dashboardHref}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-600 transition"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link> */}

                {/* Profile Dropdown */}
                <div className="relative">

                  <button
                    type="button"
                    onClick={() => setProfileMenu(!profileMenu)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
                  >

                    {/* User Avatar */}
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "User"}
                        width="38"
                        height="38"
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                        <UserRound size={21} />
                      </div>
                    )}

                    {/* User Name & Role */}
                    <div className="text-left">

                      <p className="text-sm font-bold text-slate-800 max-w-28 truncate">
                        {user.name}
                      </p>

                      <span
                        className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${roleStyles[role] || "bg-slate-100 text-slate-600"
                          }`}
                      >
                        {role}
                      </span>

                    </div>

                    <ChevronDown
                      size={16}
                      className={`text-slate-500 transition ${profileMenu ? "rotate-180" : ""
                        }`}
                    />

                  </button>

                  {/* Dropdown Menu */}
                  {profileMenu && (
                    <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-slate-100 rounded-xl shadow-xl p-2">

                      <div className="px-3 py-2 border-b border-slate-100 mb-2">
                        <p className="text-sm font-bold text-slate-800 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        href="/dashboard/profile"
                        onClick={() => setProfileMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition"
                      >
                        <UserRound size={17} />
                        Update Profile
                      </Link>

                      <Link
                        href={dashboardHref}
                        onClick={() => setProfileMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition"
                      >
                        <LayoutDashboard size={17} />
                        Dashboard
                      </Link>

                      <button
                        type="button"
                        onClick={handleSignOut}
                        disabled={loggingOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                      >
                        <LogOut size={17} />
                        {loggingOut ? "Signing Out..." : "Sign Out"}
                      </button>

                    </div>
                  )}

                </div>

              </div>

            ) : (

              /* Unauthenticated User */
              <>
                <Link
                  href="/signin"
                  className="px-5 py-2.5 text-sm font-bold text-[#06294d] border border-[#06294d] rounded-lg hover:bg-blue-50 transition"
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}

          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenu ? <X size={25} /> : <Menu size={25} />}
          </button>

        </div>

        {/* Mobile Navigation */}
        {mobileMenu && (
          <div className="md:hidden border-t border-slate-100 py-4 space-y-3">

            {/* Public Links */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenu(false)}
                className="block px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition"
              >
                {link.name}
              </Link>
            ))}

            <div className="border-t border-slate-100 pt-4">

              {isPending ? (
                <p className="px-3 text-sm text-slate-400">
                  Loading account...
                </p>
              ) : user ? (

                /* Mobile Authenticated User */
                <div className="space-y-3 px-3">

                  <div className="flex items-center gap-3">

                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User"}
                        width={42}
                        height={42}
                        unoptimized
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                        <UserRound size={22} />
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {user.name}
                      </p>

                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${roleStyles[role] || "bg-slate-100 text-slate-600"
                          }`}
                      >
                        {role}
                      </span>
                    </div>

                  </div>

                  <Link
                    href={dashboardHref}
                    onClick={() => setMobileMenu(false)}
                    className="flex items-center gap-2 py-2 text-sm font-semibold text-slate-700"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    onClick={() => setMobileMenu(false)}
                    className="flex items-center gap-2 py-2 text-sm font-semibold text-slate-700"
                  >
                    <UserRound size={18} />
                    Update Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={loggingOut}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 font-semibold text-sm rounded-lg disabled:opacity-50"
                  >
                    <LogOut size={17} />
                    {loggingOut ? "Signing Out..." : "Sign Out"}
                  </button>

                </div>

              ) : (

                /* Mobile Unauthenticated User */
                <div className="flex gap-3 px-3">

                  <Link
                    href="/signin"
                    onClick={() => setMobileMenu(false)}
                    className="flex-1 text-center py-2.5 border border-[#06294d] text-[#06294d] rounded-lg font-bold text-sm"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() => setMobileMenu(false)}
                    className="flex-1 text-center py-2.5 bg-emerald-600 text-white rounded-lg font-bold text-sm"
                  >
                    Sign Up
                  </Link>

                </div>
              )}

            </div>
          </div>
        )}

      </nav>
    </header>
  );
}

export default Navbar;