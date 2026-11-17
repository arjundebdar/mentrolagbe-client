import { ArrowUpRight, GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { SocialIcon } from "react-social-icons";
const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Find Tutors", href: "/tutors" },
  { name: "Browse Tuitions", href: "/tuitions" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

const supportLinks = [
  { name: "Sign In", href: "/signin" },
  { name: "Create Account", href: "/signup" },
  { name: "Become a Tutor", href: "/signup" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms & Conditions", href: "/terms" },
];

const Footer = () => {
  return (
    <footer className="bg-[#06294d] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Information */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-5">
              <GraduationCap size={38} className="text-emerald-400" />

              <span className="text-2xl font-extrabold tracking-tight">
                Mentor<span className="text-emerald-400">Lagbe</span>
              </span>
            </Link>

            <p className="text-blue-100 text-sm leading-7 max-w-xs mb-6">
              Connecting passionate learners with dedicated mentors. Discover
              the right tutor, unlock your potential, and make learning a better
              experience.
            </p>

            {/* Social Media */}
            <div className="flex items-center gap-3">
              <SocialIcon url="https://www.facebook.com" size={15} />

              <SocialIcon url="https://www.instagram.com" size={19} />

              {/* New X Logo */}

              <SocialIcon url="https://x.com" size={19} />
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-blue-100 text-sm hover:text-emerald-400 transition flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:scale-150 transition" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Useful Links</h3>

            <ul className="space-y-4">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-blue-100 text-sm hover:text-emerald-400 transition flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:scale-150 transition" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold mb-6">Get In Touch</h3>

            <p className="text-blue-100 text-sm leading-6 mb-6">
              Have questions or need assistance? We'd love to hear from you.
            </p>

            <div className="space-y-5">
              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-white/10 flex items-center justify-center text-emerald-400">
                  <Mail size={19} />
                </div>

                <div>
                  <p className="text-xs text-blue-200 mb-1">Email Address</p>

                  <a
                    href="mailto:contact@yourdomain.com"
                    className="text-sm text-white hover:text-emerald-400 transition break-all"
                  >
                    contact@yourdomain.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-white/10 flex items-center justify-center text-emerald-400">
                  <Phone size={19} />
                </div>

                <div>
                  <p className="text-xs text-blue-200 mb-1">Phone Number</p>

                  <a
                    href="tel:+8801XXXXXXXXX"
                    className="text-sm text-white hover:text-emerald-400 transition"
                  >
                    +880 1XXXXXXXXX
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-white/10 flex items-center justify-center text-emerald-400">
                  <MapPin size={19} />
                </div>

                <div>
                  <p className="text-xs text-blue-200 mb-1">Our Location</p>

                  <p className="text-sm text-white">Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-blue-200 text-sm text-center">
            © 2026 MentorLagbe. All rights reserved.
          </p>

          <div className="flex items-center gap-5 text-sm text-blue-200">
            <Link
              href="/privacy-policy"
              className="hover:text-emerald-400 transition"
            >
              Privacy
            </Link>

            <Link href="/terms" className="hover:text-emerald-400 transition">
              Terms
            </Link>

            <Link
              href="/contact"
              className="hover:text-emerald-400 transition flex items-center gap-1"
            >
              Support
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
