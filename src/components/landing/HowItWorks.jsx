
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LogIn,
  ShoppingBag,
  Rocket,
  ArrowRight,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";

const steps = [
  {
    number: "01",
    icon: LogIn,
    googleIcon: true,
    title: "Sign in with Google",
    desc: "One click. No passwords, no forms. Your account is ready in 3 seconds.",
    color: "from-red-500 to-orange-500",
  },
  {
    number: "02",
    icon: ShoppingBag,
    title: "Buy Stars",
    desc: "Top up your wallet with stars. Choose from ₹100, ₹500, or ₹1000 packs.",
    color: "from-yellow-500 to-amber-500",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Download & Build",
    desc: "Purchase premium projects instantly. Download full source code and start building.",
    color: "from-indigo-500 to-purple-600",
  },
];

const HowItWorks = () => {
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
      ? "bg-gradient-to-b from-gray-50 to-white"
      : isMidnight
        ? "bg-gradient-to-b from-[#080e1b] to-[#111c30]"
        : "bg-gradient-to-b from-slate-950 to-slate-900",

    heading: isDay ? "text-gray-900" : "text-white",
    description: isDay ? "text-gray-600" : "text-slate-300",

    badge: isDay
      ? "bg-purple-50 text-purple-700 border-purple-100"
      : "bg-purple-500/10 text-purple-300 border-purple-400/20",

    card: isDay
      ? "bg-white border-gray-200 hover:border-indigo-300"
      : isMidnight
        ? "bg-[#111c30] border-[#293955] hover:border-indigo-400/60"
        : "bg-slate-900 border-slate-700 hover:border-indigo-400/60",

    stepText: isDay ? "text-gray-900" : "text-white",
    stepDescription: isDay ? "text-gray-600" : "text-slate-300",

    connector: isDay
      ? "via-indigo-200"
      : "via-indigo-500/40",

    footer: isDay ? "text-gray-500" : "text-slate-400",
  };

  return (
    <section
      className={`py-16 transition-colors duration-300 sm:py-20 lg:py-28 ${styles.section}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-16">
          <div
            className={`mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold ${styles.badge}`}
          >
            🚀 Getting Started
          </div>

          <h2
            className={`mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl ${styles.heading}`}
          >
            Three Simple Steps
          </h2>

          <p className={`text-base sm:text-lg ${styles.description}`}>
            From signup to your first project in under 2 minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Desktop Connector */}
          <div
            className={`absolute left-0 right-0 top-24 hidden h-0.5 bg-gradient-to-r from-transparent ${styles.connector} to-transparent lg:block`}
          />

          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-5 lg:gap-6">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div key={step.number} className="relative pt-3">
                  <div
                    className={`relative h-full rounded-2xl border p-6 pt-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-8 sm:pt-9 ${styles.card}`}
                  >
                    {/* Step Number */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-1 text-xs font-bold text-white shadow-lg">
                      STEP {step.number}
                    </div>

                    {/* Icon */}
                    <div
                      className={`mx-auto mb-6 mt-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-xl transition-transform duration-300 hover:scale-105 sm:h-20 sm:w-20 ${step.color}`}
                    >
                      {step.googleIcon ? (
                        <FaGoogle size={30} />
                      ) : (
                        <Icon size={30} />
                      )}
                    </div>

                    {/* Content */}
                    <h3
                      className={`mb-3 text-lg font-bold sm:text-xl ${styles.stepText}`}
                    >
                      {step.title}
                    </h3>

                    <p
                      className={`text-sm leading-relaxed ${styles.stepDescription}`}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center sm:mt-14">
          <Link
            to="/login"
            className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-bold text-white shadow-xl shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:from-indigo-700 hover:to-purple-700 sm:px-7 sm:py-4"
          >
            🚀 Get Started Free
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          <p className={`mt-3 text-sm ${styles.footer}`}>
            No credit card required · 100 free stars
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
