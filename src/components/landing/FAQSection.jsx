
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How do I sign up?",
    a: "Just click 'Sign in with Google'. No forms, no passwords. Your account is created automatically in 3 seconds with 100 free stars as a welcome bonus.",
  },
  {
    q: "What are stars and how do they work?",
    a: "Stars are our virtual currency. You buy stars with real money (₹100 = 199 stars, etc.) and spend them on premium projects. Stars never expire and can be used on any project.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "We accept all major payment methods via Razorpay — UPI, credit/debit cards, netbanking, wallets, and EMI. All transactions are 256-bit encrypted and PCI-DSS compliant.",
  },
  {
    q: "Can I download the project multiple times?",
    a: "Yes! Once you purchase a project, you own it forever. You can download it as many times as you want from your dashboard.",
  },
  {
    q: "What's included in the source code?",
    a: "Every project comes with complete source code, package.json, README with setup instructions, and often a live demo link. Some projects also include Figma designs.",
  },
  {
    q: "Do you offer refunds?",
    a: "Since these are digital products, we generally don't offer refunds. However, if the project doesn't work as described, contact our support team and we'll resolve the issue.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

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
    ? "bg-white"
    : isMidnight
      ? "bg-[#080e1b]"
      : "bg-slate-950";

  const headingStyle = isDay ? "text-gray-900" : "text-white";

  const descriptionStyle = isDay
    ? "text-gray-600"
    : "text-slate-300";

  const badgeStyle = isDay
    ? "bg-blue-50 text-blue-700 border-blue-100"
    : "bg-blue-500/10 text-blue-300 border-blue-500/20";

  const cardStyle = isDay
    ? "bg-white border-gray-200 hover:border-gray-300"
    : isMidnight
      ? "bg-[#111c30] border-[#293955] hover:border-slate-500"
      : "bg-slate-900 border-slate-700 hover:border-slate-500";

  const activeCardStyle = isDay
    ? "border-indigo-300 shadow-lg shadow-indigo-500/5"
    : "border-indigo-500/70 shadow-lg shadow-indigo-500/10";

  const questionStyle = isDay ? "text-gray-900" : "text-slate-100";

  const answerStyle = isDay
    ? "text-gray-600"
    : "text-slate-300";

  const dividerStyle = isDay
    ? "border-gray-100"
    : "border-slate-700";

  return (
    <section
      className={`py-16 transition-colors duration-300 sm:py-20 lg:py-28 ${sectionStyle}`}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center sm:mb-16">
          <div
            className={`mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold ${badgeStyle}`}
          >
            ❓ FAQ
          </div>

          <h2
            className={`mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl ${headingStyle}`}
          >
            Frequently Asked Questions
          </h2>

          <p className={`text-base sm:text-lg ${descriptionStyle}`}>
            Everything you need to know about our platform
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const answerId = `faq-answer-${index}`;

            return (
              <div
                key={faq.q}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? `${cardStyle.split(" ").filter((c) => !c.startsWith("hover:")).join(" ")} ${activeCardStyle}`
                    : cardStyle
                }`}
              >
                {/* Question */}
                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex(isOpen ? -1 : index)
                  }
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5"
                >
                  <span
                    className={`text-sm font-semibold leading-6 sm:text-base ${questionStyle}`}
                  >
                    {faq.q}
                  </span>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                      isOpen
                        ? "bg-indigo-500/10 text-indigo-500"
                        : isDay
                          ? "bg-gray-100 text-gray-500"
                          : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </button>

                {/* Answer */}
                {isOpen && (
                  <div
                    id={answerId}
                    className={`border-t px-4 pb-5 sm:px-5 ${dividerStyle}`}
                  >
                    <p
                      className={`pt-4 text-sm leading-7 sm:text-base ${answerStyle}`}
                    >
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
