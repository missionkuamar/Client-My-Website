
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Sparkles,
  Zap,
  Shield,
  Star,
  ArrowRight,
  Play,
  TrendingUp,
} from "lucide-react";

const HeroSection = () => {
  const { user, token } = useSelector((s) => s.auth);

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

  // Navbar ke theme changes ko detect karo
  useEffect(() => {
    const root = document.documentElement;

    const updateTheme = () => {
      let nextTheme = root.dataset.theme;

      if (!nextTheme) {
        try {
          nextTheme = localStorage.getItem("landing-theme");
        } catch {
          nextTheme = "day";
        }
      }

      setTheme(
        ["day", "night", "midnight"].includes(nextTheme)
          ? nextTheme
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
    section: isDay
      ? "from-slate-50 via-indigo-100 to-purple-100"
      : isMidnight
        ? "from-[#070b16] via-[#101a32] to-[#17102d]"
        : "from-slate-900 via-indigo-950 to-purple-950",

    heading: isDay ? "text-slate-900" : "text-white",
    paragraph: isDay ? "text-slate-600" : "text-white/80",
    badge: isDay
      ? "border-indigo-200 bg-white/70 text-slate-800"
      : "border-white/20 bg-white/10 text-white",

    card: isDay
      ? "border-indigo-200 bg-white/80 shadow-indigo-200/40"
      : isMidnight
        ? "border-[#33415f] bg-[#111c30]/90 shadow-black/30"
        : "border-white/20 bg-white/10 shadow-black/20",

    smallCard: isDay
      ? "border-indigo-100 bg-white/80"
      : isMidnight
        ? "border-[#293955] bg-[#182640]"
        : "border-white/10 bg-white/5",

    secondaryText: isDay ? "text-slate-500" : "text-white/60",
    primaryText: isDay ? "text-slate-800" : "text-white",
    gridLine: isDay
      ? "rgba(99,102,241,0.10)"
      : "rgba(255,255,255,0.1)",
  };

  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br pb-16 pt-28 transition-colors duration-300 sm:pb-20 lg:pb-24 lg:pt-36 ${styles.section}`}
    >
      {/* Animated Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute left-1/4 top-20 h-64 w-64 rounded-full blur-3xl sm:h-96 sm:w-96 ${
            isDay ? "bg-indigo-400/20" : "bg-indigo-500/30"
          } animate-pulse`}
        />

        <div
          className={`absolute bottom-20 right-1/4 h-64 w-64 rounded-full blur-3xl sm:h-96 sm:w-96 ${
            isDay ? "bg-purple-400/20" : "bg-purple-500/30"
          } animate-pulse`}
        />

        <div
          className={`absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl sm:h-[600px] sm:w-[600px] ${
            isDay ? "bg-pink-300/15" : "bg-pink-500/20"
          }`}
        />
      </div>

      {/* Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: isDay ? 0.6 : 1,
          backgroundImage: `linear-gradient(${styles.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${styles.gridLine} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="min-w-0">
            {/* Badge */}
            <div
              className={`mb-6 inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold backdrop-blur-md sm:px-4 ${styles.badge}`}
            >
              <Sparkles
                size={14}
                className="shrink-0 text-yellow-500"
              />
              <span>🚀 Trusted by 1000+ developers</span>
            </div>

            {/* Heading */}
            <h1
              className={`mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl ${styles.heading}`}
            >
              Buy Premium
              <br />
              <span className="bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Code Projects
              </span>
              <br />
              Build Faster ⚡
            </h1>

            {/* Description */}
            <p
              className={`mb-8 max-w-xl text-base leading-relaxed sm:text-lg lg:text-xl ${styles.paragraph}`}
            >
              Discover production-ready code projects from expert
              developers. Buy with{" "}
              <span className="font-semibold text-yellow-500">
                stars
              </span>
              , download instantly, and launch your next big idea today.
            </p>

            {/* CTA Buttons */}
            {!token ? (
              <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  to="/login"
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 font-bold text-white shadow-xl shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-purple-700 sm:px-7"
                >
                  🚀 Get Started Free
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/projects"
                  className={`group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border px-5 py-3 font-bold transition sm:px-7 ${
                    isDay
                      ? "border-indigo-200 bg-white/70 text-slate-800 hover:bg-white"
                      : "border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
                  }`}
                >
                  <Play size={16} fill="currentColor" />
                  Browse Projects
                </Link>
              </div>
            ) : (
              <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <div
                  className={`rounded-xl border px-5 py-3 ${styles.card}`}
                >
                  <p className={`text-xs ${styles.secondaryText}`}>
                    Welcome back
                  </p>
                  <p className={`break-words text-lg font-bold ${styles.primaryText}`}>
                    {user?.name || "Developer"} 👋
                  </p>
                </div>

                <Link
                  to={
                    user?.role === "admin"
                      ? "/admin/dashboard"
                      : "/user/dashboard"
                  }
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 font-bold text-white shadow-xl transition hover:-translate-y-0.5 sm:px-7"
                >
                  Dashboard
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            )}

            {/* Trust Stats */}
            <div className={`flex flex-wrap gap-x-6 gap-y-5 text-sm sm:gap-x-8 ${styles.paragraph}`}>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-500/15">
                  <Shield size={17} className="text-green-500" />
                </div>
                <div>
                  <p className={`font-semibold ${styles.primaryText}`}>
                    100% Secure
                  </p>
                  <p className={`text-xs ${styles.secondaryText}`}>
                    Google Auth
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-500/15">
                  <Zap size={17} className="text-yellow-500" />
                </div>
                <div>
                  <p className={`font-semibold ${styles.primaryText}`}>
                    Instant Access
                  </p>
                  <p className={`text-xs ${styles.secondaryText}`}>
                    After purchase
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pink-500/15">
                  <Star size={17} className="text-pink-500" />
                </div>
                <div>
                  <p className={`font-semibold ${styles.primaryText}`}>
                    100 Free Stars
                  </p>
                  <p className={`text-xs ${styles.secondaryText}`}>
                    On signup
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Dashboard Mockup */}
          <div className="relative mx-auto w-full max-w-xl min-w-0">
            {/* Main Card */}
            <div
              className={`relative rounded-3xl border p-4 shadow-2xl backdrop-blur-xl transition-colors duration-300 sm:p-6 ${styles.card}`}
            >
              {/* Window Header */}
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>

                <div className="flex items-center gap-1.5 rounded-lg bg-green-500/10 px-3 py-1">
                  <TrendingUp size={13} className="text-green-500" />
                  <span className="text-xs font-semibold text-green-500">
                    +12.5%
                  </span>
                </div>
              </div>

              {/* Balance Card */}
              <div className="mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-4 shadow-lg sm:p-5">
                <p className="mb-1 text-xs text-white/80">
                  Star Balance
                </p>
                <p className="flex flex-wrap items-center gap-2 text-3xl font-bold text-white sm:text-4xl">
                  ⭐ 2,748
                </p>
                <p className="mt-2 text-xs text-white/70">
                  Ready to spend on projects
                </p>
              </div>

              {/* Stats */}
              <div className="mb-4 grid grid-cols-2 gap-3">
                <div className={`rounded-xl border p-3 sm:p-4 ${styles.smallCard}`}>
                  <p className={`text-xs ${styles.secondaryText}`}>
                    Projects
                  </p>
                  <p className={`text-2xl font-bold ${styles.primaryText}`}>
                    41
                  </p>
                </div>

                <div className={`rounded-xl border p-3 sm:p-4 ${styles.smallCard}`}>
                  <p className={`text-xs ${styles.secondaryText}`}>
                    Purchased
                  </p>
                  <p className={`text-2xl font-bold ${styles.primaryText}`}>
                    12
                  </p>
                </div>
              </div>

              {/* Project List */}
              <div className="space-y-2">
                {[
                  { icon: "🛍️", name: "E-Commerce Site", price: "289" },
                  { icon: "📊", name: "Dashboard UI", price: "189" },
                  { icon: "🎨", name: "Portfolio Template", price: "99" },
                ].map((project) => (
                  <div
                    key={project.name}
                    className={`flex min-w-0 items-center gap-3 rounded-xl border p-3 transition ${
                      isDay
                        ? "border-indigo-100 bg-white/70 hover:bg-white"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-base">
                      {project.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-xs font-medium ${styles.primaryText}`}>
                        {project.name}
                      </p>
                    </div>

                    <span className="shrink-0 text-xs font-bold text-yellow-500">
                      ⭐ {project.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Card 1 */}
            <div
              className={`absolute -left-3 -top-4 hidden rounded-2xl border p-4 shadow-2xl lg:block ${styles.card}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                  <Zap size={20} className="text-green-500" />
                </div>
                <div>
                  <p className={`text-xs ${styles.secondaryText}`}>
                    New Project
                  </p>
                  <p className={`text-sm font-bold ${styles.primaryText}`}>
                    Just Added!
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Card 2 */}
            <div
              className={`absolute -bottom-4 -right-3 hidden rounded-2xl border p-4 shadow-2xl lg:block ${styles.card}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10">
                  <Star size={20} className="fill-yellow-500 text-yellow-500" />
                </div>
                <div>
                  <p className={`text-xs ${styles.secondaryText}`}>
                    Free Bonus
                  </p>
                  <p className={`text-sm font-bold ${styles.primaryText}`}>
                    100 Stars 🎉
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
