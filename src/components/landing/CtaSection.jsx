
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Rocket, ArrowRight, Sparkles } from "lucide-react";

const CtaSection = () => {
  const { token } = useSelector((state) => state.auth);

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

  if (token) return null;

  const isDay = theme === "day";
  const isMidnight = theme === "midnight";

  const backgroundStyle = isDay
    ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"
    : isMidnight
      ? "bg-gradient-to-br from-[#11152f] via-[#24164b] to-[#40183e]"
      : "bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950";

  return (
    <section
      className={`relative overflow-hidden py-16 transition-colors duration-500 sm:py-20 lg:py-28 ${backgroundStyle}`}
    >
      {/* Animated Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-0 h-64 w-64 animate-pulse rounded-full bg-white/10 blur-3xl sm:left-1/4 sm:h-96 sm:w-96" />

        <div className="absolute -bottom-20 -right-20 h-64 w-64 animate-pulse rounded-full bg-yellow-400/20 blur-3xl sm:right-1/4 sm:h-96 sm:w-96" />

        <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-400/10 blur-3xl sm:h-72 sm:w-72" />
      </div>

      {/* Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="mb-6 inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur sm:text-sm">
          <Sparkles
            size={15}
            className="shrink-0 text-yellow-300"
          />

          <span>Limited Time: 100 Free Stars</span>
        </div>

        {/* Heading */}
        <h2 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
          Ready to Build
          <br />

          <span className="bg-gradient-to-r from-yellow-200 via-yellow-300 to-orange-300 bg-clip-text text-transparent">
            Something Amazing?
          </span>
        </h2>

        {/* Description */}
        <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-white/85 sm:mb-10 sm:text-lg lg:text-xl">
          Join 1000+ developers who are building faster with premium code
          projects. Get started in 3 seconds.
        </p>

        {/* CTA Button */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/login"
            className="group inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-bold text-purple-700 shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-50 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/30 sm:w-auto sm:max-w-none sm:px-8 sm:py-4 sm:text-lg"
          >
            <Rocket
              size={20}
              className="transition-transform duration-300 group-hover:-rotate-12"
            />

            Get Started Free

            <ArrowRight
              size={20}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs text-white/80 sm:gap-x-6 sm:text-sm">
          <span className="inline-flex items-center gap-1.5">
            <span className="font-bold text-green-300">✓</span>
            No credit card required
          </span>

          <span className="inline-flex items-center gap-1.5">
            <span className="font-bold text-green-300">✓</span>
            100 free stars
          </span>

          <span className="inline-flex items-center gap-1.5">
            <span className="font-bold text-green-300">✓</span>
            Cancel anytime
          </span>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
