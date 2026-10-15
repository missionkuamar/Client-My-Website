
import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Full Stack Developer",
    initials: "RS",
    color: "from-blue-500 to-indigo-500",
    rating: 5,
    text: "The projects here saved me weeks of development time. The code quality is outstanding and the documentation is crystal clear.",
  },
  {
    name: "Priya Patel",
    role: "Freelance Developer",
    initials: "PP",
    color: "from-pink-500 to-purple-500",
    rating: 5,
    text: "I've bought 5 projects already. Each one was worth every star. The star system is super convenient and payments are smooth.",
  },
  {
    name: "Amit Kumar",
    role: "Startup Founder",
    initials: "AK",
    color: "from-green-500 to-emerald-500",
    rating: 5,
    text: "Saved my startup months of dev time. Just buy, download, and customize. Best investment I've made this year!",
  },
];

const Testimonials = () => {
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

  const isDay = theme === "day";
  const isMidnight = theme === "midnight";

  const sectionStyle = isDay
    ? "bg-gradient-to-b from-gray-50 to-white"
    : isMidnight
      ? "bg-gradient-to-b from-[#080e1b] to-[#0c1424]"
      : "bg-gradient-to-b from-slate-950 to-slate-900";

  const headingStyle = isDay ? "text-gray-900" : "text-white";

  const descriptionStyle = isDay
    ? "text-gray-600"
    : "text-slate-300";

  const badgeStyle = isDay
    ? "bg-pink-50 text-pink-700 border-pink-100"
    : "bg-pink-500/10 text-pink-300 border-pink-500/20";

  const cardStyle = isDay
    ? "bg-white border-gray-200 hover:border-indigo-300"
    : isMidnight
      ? "bg-[#111c30] border-[#293955] hover:border-indigo-400/60"
      : "bg-slate-900 border-slate-700 hover:border-indigo-400/60";

  const authorNameStyle = isDay ? "text-gray-900" : "text-white";

  const mutedStyle = isDay ? "text-gray-500" : "text-slate-400";

  const quoteStyle = isDay
    ? "bg-indigo-50 text-indigo-600"
    : "bg-indigo-500/15 text-indigo-300";

  const dividerStyle = isDay
    ? "border-gray-100"
    : "border-slate-700";

  const quoteTextStyle = isDay
    ? "text-gray-600"
    : "text-slate-300";

  return (
    <section
      className={`py-16 transition-colors duration-300 sm:py-20 lg:py-28 ${sectionStyle}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <div
            className={`mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold ${badgeStyle}`}
          >
            💬 Testimonials
          </div>

          <h2
            className={`mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl ${headingStyle}`}
          >
            Loved by Developers
          </h2>

          <p className={`text-base sm:text-lg ${descriptionStyle}`}>
            Join thousands of developers who build faster with us
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.initials}
              className={`flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7 ${cardStyle}`}
            >
              {/* Quote Icon */}
              <div
                className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${quoteStyle}`}
              >
                <Quote size={20} />
              </div>

              {/* Rating */}
              <div
                className="mb-4 flex items-center gap-0.5"
                aria-label={`${testimonial.rating} out of 5 stars`}
              >
                {Array.from(
                  { length: testimonial.rating },
                  (_, index) => (
                    <Star
                      key={index}
                      size={15}
                      className="fill-yellow-500 text-yellow-500"
                    />
                  )
                )}
              </div>

              {/* Testimonial Text */}
              <p
                className={`mb-6 flex-1 text-sm leading-7 sm:text-base ${quoteTextStyle}`}
              >
                “{testimonial.text}”
              </p>

              {/* Author */}
              <div
                className={`flex items-center gap-3 border-t pt-4 ${dividerStyle}`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow-sm ${testimonial.color}`}
                >
                  {testimonial.initials}
                </div>

                <div className="min-w-0">
                  <p
                    className={`truncate text-sm font-bold ${authorNameStyle}`}
                  >
                    {testimonial.name}
                  </p>

                  <p className={`mt-1 text-xs ${mutedStyle}`}>
                    {testimonial.role}
                  </p>
                </div>

                <div
                  className="ml-auto shrink-0 text-green-500"
                  title="5-star rating"
                >
                  <Star size={18} className="fill-current" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
