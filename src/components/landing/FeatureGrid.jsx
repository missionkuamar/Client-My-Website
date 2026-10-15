
import { useEffect, useState } from "react";
import {
  Zap,
  Shield,
  Star,
  Download,
  BookOpen,
  Rocket,
  Lock,
  RefreshCw,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Access",
    desc: "Download purchased projects immediately. No waiting, no delays.",
    color: "from-yellow-400 to-orange-500",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    desc: "Powered by Razorpay. UPI, cards, netbanking — all supported.",
    color: "from-green-400 to-emerald-500",
  },
  {
    icon: Star,
    title: "Star System",
    desc: "Simple pay-per-project model. Buy stars once, spend anytime.",
    color: "from-yellow-400 to-amber-500",
  },
  {
    icon: Download,
    title: "Full Source Code",
    desc: "Get complete project files with documentation and setup guides.",
    color: "from-indigo-400 to-blue-500",
  },
  {
    icon: BookOpen,
    title: "Free Tutorials",
    desc: "Learn from our blog. Tutorials, guides, and best practices.",
    color: "from-pink-400 to-rose-500",
  },
  {
    icon: Rocket,
    title: "Production Ready",
    desc: "Every project is tested and ready to deploy on real servers.",
    color: "from-purple-400 to-violet-500",
  },
  {
    icon: Lock,
    title: "Lifetime Access",
    desc: "Purchase once, own forever. Download anytime, anywhere.",
    color: "from-cyan-400 to-teal-500",
  },
  {
    icon: RefreshCw,
    title: "Free Updates",
    desc: "Get bug fixes and improvements delivered directly to you.",
    color: "from-slate-400 to-gray-500",
  },
];

const FeatureGrid = () => {
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
      const nextTheme =
        root.dataset.theme || localStorage.getItem("landing-theme") || "day";

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
      ? "bg-white"
      : isMidnight
        ? "bg-[#080e1b]"
        : "bg-slate-950",

    heading: isDay ? "text-gray-900" : "text-white",

    description: isDay ? "text-gray-600" : "text-slate-300",

    badge: isDay
      ? "bg-indigo-50 text-indigo-700 border-indigo-100"
      : isMidnight
        ? "bg-indigo-400/10 text-indigo-300 border-indigo-400/20"
        : "bg-indigo-400/10 text-indigo-300 border-indigo-400/20",

    card: isDay
      ? "bg-white border-gray-200 hover:border-indigo-300"
      : isMidnight
        ? "bg-[#111c30] border-[#293955] hover:border-indigo-400/60"
        : "bg-slate-900 border-slate-700 hover:border-indigo-400/60",

    cardTitle: isDay ? "text-gray-900" : "text-white",

    cardDescription: isDay ? "text-gray-600" : "text-slate-300",
  };

  return (
    <section
      className={`py-16 transition-colors duration-300 sm:py-20 lg:py-28 ${styles.section}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <div
            className={`mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold ${styles.badge}`}
          >
            ⚡ Everything You Need
          </div>

          <h2
            className={`mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl ${styles.heading}`}
          >
            Built for{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Modern Developers
            </span>
          </h2>

          <p className={`text-base leading-relaxed sm:text-lg ${styles.description}`}>
            All the tools, projects, and resources you need to ship faster.
          </p>
        </div>

        {/* Responsive Feature Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6 ${styles.card}`}
              >
                {/* Icon */}
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={22} />
                </div>

                {/* Content */}
                <h3
                  className={`mb-2 text-base font-bold ${styles.cardTitle}`}
                >
                  {feature.title}
                </h3>

                <p
                  className={`text-sm leading-relaxed ${styles.cardDescription}`}
                >
                  {feature.desc}
                </p>

                {/* Hover Glow */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-[0.06]" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
