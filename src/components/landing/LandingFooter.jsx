
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Heart,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa6";



const socialLinks = [
  { name: "X", icon: FaXTwitter, href: "https://x.com/KumarMissi80901" },
  { name: "GitHub", icon: FaGithub, href: "https://github.com/missionkuamar" },
  { name: "LinkedIn", icon: FaLinkedin, href: "https://www.linkedin.com/in/mission-kumar-03b0742b4/" },
  { name: "YouTube", icon: FaYoutube, href: "https://www.youtube.com/@DramaDaily-s1p" },
  { name: "Instagram", icon: FaInstagram, href: "https://www.instagram.com/codewithmission_official/" },
  { name: "Facebook", icon: FaFacebookF, href: "https://www.facebook.com/profile.php?id=61567650055362" },
  { name: "Discord", icon: FaDiscord, href: "https://discord.com/channels/1488063436850991117/1488063437954088982" },
 
];

const productLinks = [
  { to: "/projects", label: "Browse Projects" },
  { to: "/stars", label: "Buy Stars" },
  { to: "/blog", label: "Blog" },
  { to: "/user/dashboard", label: "Dashboard" },
];

const companyLinks = [
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
  { to: "/support", label: "Support" },
];

const legalLinks = [
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms of Service" },
  { to: "/refund-policy", label: "Refund Policy" },
  { to: "/licensing", label: "Licensing" },
];

const LandingFooter = () => {
  const currentYear = new Date().getFullYear();

  const [theme, setTheme] = useState(() => {
    try {
      return (
        document.documentElement.dataset.theme ||
        localStorage.getItem("landing-theme") ||
        "day"
      );
    } catch {
      return "day";
    }
  });

  const [email, setEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  useEffect(() => {
    const root = document.documentElement;

    const updateTheme = () => {
      let currentTheme = root.dataset.theme;

      if (!currentTheme) {
        try {
          currentTheme = localStorage.getItem("landing-theme");
        } catch {
          currentTheme = "day";
        }
      }

      setTheme(
        ["day", "night", "midnight"].includes(currentTheme)
          ? currentTheme
          : "day"
      );
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const isDay = theme === "day";
  const isMidnight = theme === "midnight";

  const styles = {
    footer: isDay
      ? "bg-slate-50 text-slate-700"
      : isMidnight
        ? "bg-[#080e1b] text-slate-300"
        : "bg-slate-950 text-slate-300",

    heading: isDay ? "text-slate-900" : "text-white",

    paragraph: isDay ? "text-slate-600" : "text-slate-400",

    border: isDay ? "border-slate-200" : "border-slate-800",

    social: isDay
      ? "bg-white border-slate-200 text-slate-500 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white"
      : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white",

    input: isDay
      ? "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
      : "bg-slate-900 border-slate-800 text-white placeholder:text-slate-500",
  };

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    setNewsletterMessage("");

    if (!email.trim()) {
      setNewsletterMessage("Please enter your email address.");
      return;
    }

    // Connect this form to your newsletter API to save subscriptions.
    setNewsletterMessage(
      "Newsletter signup is not connected yet. Please connect your backend API."
    );
  };

  const renderLinks = (links) =>
    links.map((item) => (
      <li key={item.to}>
        <Link
          to={item.to}
          className={`text-sm transition-colors hover:text-indigo-500 ${
            styles.paragraph
          }`}
        >
          {item.label}
        </Link>
      </li>
    ));

  return (
    <footer
      className={`transition-colors duration-300 ${styles.footer}`}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Main Footer */}
        <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="mb-4 inline-flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl text-white shadow-lg">
                🛍️
              </div>

              <span className={`text-xl font-bold ${styles.heading}`}>
                My<span className="text-indigo-500">Store</span>
              </span>
            </Link>

            <p className={`mb-6 max-w-md text-sm leading-6 ${styles.paragraph}`}>
              A marketplace for premium source code projects. Discover
              projects, download code, and build your next idea faster.
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap gap-2">
              {socialLinks.map(({ name, icon: Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
                  title={name}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all ${styles.social}`}
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className={`mb-4 text-sm font-bold uppercase tracking-wider ${styles.heading}`}>
              Products
            </h4>

            <ul className="space-y-3">{renderLinks(productLinks)}</ul>
          </div>

          {/* Company */}
          <div>
            <h4 className={`mb-4 text-sm font-bold uppercase tracking-wider ${styles.heading}`}>
              Company
            </h4>

            <ul className="space-y-3">{renderLinks(companyLinks)}</ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className={`mb-4 text-sm font-bold uppercase tracking-wider ${styles.heading}`}>
              Legal
            </h4>

            <ul className="space-y-3">{renderLinks(legalLinks)}</ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className={`mb-8 border-y py-8 ${styles.border}`}>
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-md">
              <h4 className={`mb-1 text-base font-bold ${styles.heading}`}>
                Stay in the loop
              </h4>

              <p className={`text-sm leading-6 ${styles.paragraph}`}>
                Get updates about new projects, features, and tutorials.
              </p>
            </div>

            <form
              onSubmit={handleNewsletterSubmit}
              className="w-full md:max-w-md"
            >
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setNewsletterMessage("");
                    }}
                    placeholder="you@example.com"
                    aria-label="Email address"
                    required
                    className={`w-full rounded-lg border py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${styles.input}`}
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Subscribe
                </button>
              </div>

              {newsletterMessage && (
                <p
                  role="status"
                  className="mt-2 text-xs leading-5 text-amber-500"
                >
                  {newsletterMessage}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Payment Information */}
        <div className={`mb-8 flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${styles.border}`}>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
              <ShieldCheck size={21} />
            </div>

            <div>
              <h4 className={`text-sm font-semibold ${styles.heading}`}>
                Secure Payments
              </h4>

              <p className={`mt-1 text-xs leading-5 ${styles.paragraph}`}>
                Payments are processed through Razorpay when enabled at checkout.
                Never share your OTP or payment credentials.
              </p>
            </div>
          </div>

          <a
            href="https://razorpay.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-indigo-500 transition hover:text-indigo-400"
          >
            Razorpay
            <ExternalLink size={14} />
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className={`text-center text-xs sm:text-sm ${styles.paragraph}`}>
            © {currentYear} MyStore. All rights reserved.
          </p>

          <p className={`flex items-center gap-1.5 text-sm ${styles.paragraph}`}>
            Made with
            <Heart size={14} className="fill-red-500 text-red-500" />
            in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
