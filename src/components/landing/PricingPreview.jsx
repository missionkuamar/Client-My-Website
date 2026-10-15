
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Check,
  Crown,
  Sparkles,
  Zap,
  ArrowRight,
} from "lucide-react";

const plans = [
  {
    name: "Silver",
    icon: Star,
    price: 100,
    stars: 199,
    bonus: 0,
    popular: false,
    color: "from-slate-400 to-gray-500",
  },
  {
    name: "Gold",
    icon: Crown,
    price: 500,
    stars: 1099,
    bonus: 99,
    popular: true,
    color: "from-yellow-400 to-orange-500",
  },
  {
    name: "Platinum",
    icon: Sparkles,
    price: 1000,
    stars: 2499,
    bonus: 499,
    popular: false,
    color: "from-purple-500 to-pink-500",
  },
];

const features = [
  "Instant credit",
  "Never expires",
  "Buy any project",
  "Lifetime access",
];

const PricingPreview = () => {
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
      ? "bg-white"
      : isMidnight
        ? "bg-[#080e1b]"
        : "bg-slate-950",

    heading: isDay ? "text-gray-900" : "text-white",
    description: isDay ? "text-gray-600" : "text-slate-300",

    badge: isDay
      ? "bg-yellow-50 text-yellow-700 border-yellow-100"
      : "bg-yellow-400/10 text-yellow-300 border-yellow-400/20",

    card: isDay
      ? "bg-white border-gray-200 hover:border-indigo-300"
      : isMidnight
        ? "bg-[#111c30] border-[#293955] hover:border-indigo-400/60"
        : "bg-slate-900 border-slate-700 hover:border-indigo-400/60",

    planName: isDay ? "text-gray-900" : "text-white",
    price: isDay ? "text-gray-900" : "text-white",
    muted: isDay ? "text-gray-500" : "text-slate-400",

    featureText: isDay ? "text-gray-600" : "text-slate-300",

    starsBox: isDay
      ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200"
      : "bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20",

    starsLabel: isDay ? "text-gray-600" : "text-slate-300",

    secondaryButton: isDay
      ? "bg-gray-900 text-white hover:bg-gray-800"
      : "bg-slate-700 text-white hover:bg-slate-600",

    bottomLink: isDay
      ? "text-indigo-600 hover:text-indigo-700"
      : "text-indigo-400 hover:text-indigo-300",
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
            ⭐ Star Packs
          </div>

          <h2
            className={`mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl ${styles.heading}`}
          >
            Simple, Transparent Pricing
          </h2>

          <p className={`text-base sm:text-lg ${styles.description}`}>
            Buy once, use forever. Stars never expire.
          </p>
        </div>

        {/* Pricing Plans */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-stretch gap-8 md:grid-cols-3 md:gap-5 lg:gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <div
                key={plan.name}
                className={`relative flex h-full flex-col rounded-3xl border-2 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8 ${
                  plan.popular
                    ? "border-indigo-500 shadow-2xl shadow-indigo-500/20 md:scale-[1.03] lg:scale-105"
                    : `${styles.card}`
                } ${
                  plan.popular && !isDay
                    ? "bg-[#15152c]"
                    : plan.popular
                      ? "bg-white"
                      : ""
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                    ⭐ MOST POPULAR
                  </div>
                )}

                {/* Icon and Name */}
                <div className="mb-6 mt-2 text-center">
                  <div
                    className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${plan.color}`}
                  >
                    <Icon size={26} />
                  </div>

                  <h3 className={`text-xl font-bold ${styles.planName}`}>
                    {plan.name}
                  </h3>
                </div>

                {/* Price */}
                <div className="mb-6 text-center">
                  <p className={`text-4xl font-bold sm:text-5xl ${styles.price}`}>
                    ₹{plan.price.toLocaleString("en-IN")}
                  </p>

                  <p className={`mt-1 text-xs ${styles.muted}`}>
                    One-time payment
                  </p>
                </div>

                {/* Stars */}
                <div
                  className={`mb-6 rounded-xl border p-4 text-center ${styles.starsBox}`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Star
                      size={22}
                      className="fill-yellow-500 text-yellow-500"
                    />

                    <span className="text-2xl font-bold text-yellow-600">
                      {plan.stars.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <p className={`mt-1 text-xs ${styles.starsLabel}`}>
                    Stars
                  </p>

                  {plan.bonus > 0 && (
                    <p className="mt-1 text-xs font-semibold text-green-600">
                      🎁 +{plan.bonus} bonus stars!
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="mb-6 flex-1 space-y-3">
                  {features.map((feature) => (
                    <li
                      key={feature}
                      className={`flex items-center gap-2 text-sm ${styles.featureText}`}
                    >
                      <Check
                        size={15}
                        className="shrink-0 text-green-500"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Buy Button */}
                <Link
                  to="/stars"
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-700 hover:to-purple-700"
                      : styles.secondaryButton
                  }`}
                >
                  <Zap size={16} />
                  Buy {plan.name}
                  <ArrowRight size={15} />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center sm:mt-14">
          <Link
            to="/stars"
            className={`group inline-flex items-center gap-2 font-semibold transition ${styles.bottomLink}`}
          >
            View all star packs

            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingPreview;
