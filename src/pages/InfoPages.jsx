
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  ShieldCheck,
  FileText,
  RefreshCw,
  Code2,
  Building2,
  Headphones,
} from "lucide-react";

const pages = {
  about: {
    icon: Building2,
    label: "About Us",
    title: "Building faster, one project at a time.",
    description:
      "MyStore is a marketplace designed to help developers discover, purchase, and customize source code projects.",
    sections: [
      {
        title: "Our mission",
        text: "Our goal is to help developers save development time by providing access to useful source code, starter projects, and reusable solutions.",
      },
      {
        title: "What we offer",
        text: "Explore available projects, review their descriptions, purchase projects using stars where supported, and access your purchased projects through your account.",
      },
      {
        title: "Our approach",
        text: "We aim to make discovering and using code projects simple. Please review each project's description, requirements, and license before purchasing.",
      },
    ],
  },

  contact: {
    icon: Mail,
    label: "Contact Us",
    title: "Let's talk.",
    description:
      "Have a question about your account, a project, or a payment? Get in touch with our team.",
    sections: [
      {
        title: "General enquiries",
        text: "Contact us for questions about MyStore, partnerships, or general information.",
      },
      {
        title: "Payments and purchases",
        text: "For a payment or purchase issue, include your registered email, project name, and transaction reference. Never share your password, OTP, or full card details.",
      },
      {
        title: "Email support",
        text: "Replace the example email below with your real support email before publishing this page.",
        action: {
          label: "Email Support",
          href: "mailto:support@yourdomain.com",
        },
      },
    ],
  },

  support: {
    icon: Headphones,
    label: "Support",
    title: "How can we help?",
    description:
      "Find guidance for your account, purchased projects, stars, and payments.",
    sections: [
      {
        title: "Account help",
        text: "If you cannot access your account, use the sign-in method associated with your account. Contact support if the problem continues.",
      },
      {
        title: "Project downloads",
        text: "Open your dashboard or purchase history to find projects you have purchased. Download access depends on the product and platform rules.",
      },
      {
        title: "Payment issues",
        text: "If your payment succeeds but your purchase is not visible, keep your payment reference and contact support. Do not make repeated payments before checking the transaction status.",
      },
      {
        title: "Need more help?",
        text: "Email our support team with a short description of the problem and relevant transaction or project details.",
        action: {
          label: "Contact Support",
          href: "mailto:support@yourdomain.com",
        },
      },
    ],
  },

  privacy: {
    icon: ShieldCheck,
    label: "Privacy Policy",
    title: "Your privacy matters.",
    description:
      "This policy explains how MyStore may collect, use, and protect information when you use the platform.",
    sections: [
      {
        title: "Information we collect",
        text: "Depending on the features you use, we may collect account details, contact information, purchase history, transaction references, and technical information needed to operate and secure the service.",
      },
      {
        title: "How information is used",
        text: "Information may be used to manage accounts, deliver purchased projects, process transactions, provide support, prevent fraud, and improve the platform.",
      },
      {
        title: "Payments",
        text: "Payments may be handled by Razorpay or another enabled payment provider. Payment information is subject to the provider's policies and processing requirements.",
      },
      {
        title: "Sharing and security",
        text: "Information may be shared with service providers when necessary to operate the platform or meet legal obligations. We should apply reasonable security measures, but no internet service can guarantee absolute security.",
      },
      {
        title: "Your choices",
        text: "For questions about your information or requests relating to your account, contact support. Applicable privacy rights depend on the laws relevant to you.",
      },
      {
        title: "Policy updates",
        text: "We may update this policy when our services or legal requirements change. Publish the actual effective date and notify users where required.",
      },
    ],
  },

  terms: {
    icon: FileText,
    label: "Terms of Service",
    title: "Terms for using MyStore.",
    description:
      "These terms describe the basic rules for accessing and using the MyStore marketplace.",
    sections: [
      {
        title: "Accounts",
        text: "You are responsible for maintaining access to your account and providing accurate information. You must not use another person's account without authorization.",
      },
      {
        title: "Purchases and stars",
        text: "Prices, star packs, bonuses, and purchase conditions are shown on the relevant pages. A purchase is subject to successful payment verification and the applicable checkout terms.",
      },
      {
        title: "Permitted use",
        text: "You may not use the platform to distribute unlawful content, bypass access controls, commit fraud, or infringe another person's intellectual property rights.",
      },
      {
        title: "Source code and licenses",
        text: "Your rights to use, modify, or redistribute purchased source code depend on the specific project's license. Purchasing a project does not automatically grant unrestricted redistribution rights.",
      },
      {
        title: "Availability",
        text: "We aim to keep the platform available, but cannot guarantee uninterrupted service or that every project will remain available indefinitely.",
      },
      {
        title: "Changes and termination",
        text: "We may update platform features and these terms. Access may be restricted when necessary for security, legal compliance, or serious violations of the terms.",
      },
      {
        title: "Contact",
        text: "Contact support if you have questions about these terms or a purchase.",
        action: {
          label: "Contact Support",
          href: "mailto:support@yourdomain.com",
        },
      },
    ],
  },

  refund: {
    icon: RefreshCw,
    label: "Refund Policy",
    title: "Our refund policy.",
    description:
      "Please review these conditions before purchasing digital products or star packs.",
    sections: [
      {
        title: "Digital products",
        text: "Because source code and digital downloads can be accessed or copied, refunds may be limited after delivery, subject to applicable consumer laws and the terms presented at checkout.",
      },
      {
        title: "Incorrect or defective products",
        text: "If a purchased project materially differs from its description, is corrupted, or cannot be accessed due to a platform issue, contact support with details and evidence so the issue can be reviewed.",
      },
      {
        title: "Payment problems",
        text: "If money is debited but your order is not confirmed, contact support with the transaction reference. Duplicate payments and failed transactions will be reviewed against the payment provider's records.",
      },
      {
        title: "Refund requests",
        text: "Submit your registered email, order details, transaction reference, and a clear explanation of the issue. Approved refunds are processed through the applicable payment method and provider timelines.",
      },
      {
        title: "Legal rights",
        text: "Nothing in this policy removes consumer rights that cannot legally be excluded. The actual refund conditions must be reviewed for compliance with applicable law before publication.",
      },
    ],
  },

  licensing: {
    icon: Code2,
    label: "Licensing",
    title: "Understand your code rights.",
    description:
      "Every project may have different rules for personal, commercial, and redistribution use.",
    sections: [
      {
        title: "Check each project's license",
        text: "Before using a project, review its listing, included LICENSE file, third-party notices, and any additional restrictions.",
      },
      {
        title: "Personal and commercial use",
        text: "Personal or commercial use is allowed only to the extent granted by the applicable project license. Do not assume every purchase includes the same rights.",
      },
      {
        title: "Redistribution",
        text: "Do not resell, republish, or redistribute source code as a standalone product unless the applicable license explicitly permits it.",
      },
      {
        title: "Third-party components",
        text: "Projects may include libraries, fonts, images, or other assets governed by separate licenses. You are responsible for reviewing those terms before distributing your own product.",
      },
      {
        title: "Questions about a license",
        text: "If a project does not include clear licensing information, contact support or the project owner before using it commercially.",
        action: {
          label: "Ask Support",
          href: "mailto:support@yourdomain.com",
        },
      },
    ],
  },
};

const routeMap = [
  { key: "about", to: "/about" },
  { key: "contact", to: "/contact" },
  { key: "support", to: "/support" },
  { key: "privacy", to: "/privacy-policy" },
  { key: "terms", to: "/terms" },
  { key: "refund", to: "/refund-policy" },
  { key: "licensing", to: "/licensing" },
];

const InfoPage = ({ pageKey }) => {
  const page = pages[pageKey];
  const Icon = page.icon;

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

  const colors = {
    page: isDay
      ? "bg-slate-50 text-slate-800"
      : isMidnight
        ? "bg-[#080e1b] text-slate-200"
        : "bg-slate-950 text-slate-200",

    card: isDay
      ? "border-slate-200 bg-white"
      : isMidnight
        ? "border-[#293955] bg-[#111c30]"
        : "border-slate-800 bg-slate-900",

    heading: isDay ? "text-slate-900" : "text-white",

    muted: isDay ? "text-slate-600" : "text-slate-400",

    divider: isDay ? "border-slate-100" : "border-slate-700",

    link: isDay
      ? "text-indigo-600 hover:text-indigo-700"
      : "text-indigo-400 hover:text-indigo-300",
  };

  return (
    <main className={`min-h-screen transition-colors duration-300 ${colors.page}`}>
      {/* Page Header */}
      <div className="relative overflow-hidden border-b border-indigo-500/10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-4 py-16 text-white sm:py-20">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-pink-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-white/80 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15">
            <Icon size={24} />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/75">
            MyStore · {page.label}
          </p>

          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            {page.title}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
            {page.description}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className={`rounded-2xl border p-5 shadow-sm sm:p-8 lg:p-10 ${colors.card}`}>
          {page.sections.map((section, index) => (
            <section
              key={section.title}
              className={index > 0 ? `mt-8 border-t pt-8 ${colors.divider}` : ""}
            >
              <h2 className={`text-lg font-bold sm:text-xl ${colors.heading}`}>
                {section.title}
              </h2>

              <p className={`mt-3 text-sm leading-7 sm:text-base ${colors.muted}`}>
                {section.text}
              </p>

              {section.action && (
                <a
                  href={section.action.href}
                  className={`mt-4 inline-flex items-center gap-2 text-sm font-semibold ${colors.link}`}
                >
                  <Mail size={16} />
                  {section.action.label}
                  <ArrowRight size={15} />
                </a>
              )}
            </section>
          ))}
        </div>

        {/* Other Pages */}
        <div className="mt-10">
          <h2 className={`mb-4 text-lg font-bold ${colors.heading}`}>
            Explore more
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {routeMap
              .filter((item) => item.key !== pageKey)
              .map((item) => (
                <Link
                  key={item.key}
                  to={item.to}
                  className={`flex items-center justify-between rounded-xl border p-4 transition hover:border-indigo-500 ${
                    isDay
                      ? "border-slate-200 bg-white"
                      : "border-slate-700 bg-slate-900"
                  }`}
                >
                  <span className={`text-sm font-medium ${colors.heading}`}>
                    {pages[item.key].label}
                  </span>
                  <ArrowRight size={16} className={colors.link} />
                </Link>
              ))}
          </div>
        </div>

        <p className={`mt-8 text-xs leading-6 ${colors.muted}`}>
          Important: Replace example contact details and review all policy
          content against your actual business practices before publishing.
          Privacy, consumer protection, refund, and licensing obligations may
          depend on applicable law.
        </p>
      </div>
    </main>
  );
};

export const AboutUs = () => <InfoPage pageKey="about" />;
export const ContactUs = () => <InfoPage pageKey="contact" />;
export const Support = () => <InfoPage pageKey="support" />;
export const PrivacyPolicy = () => <InfoPage pageKey="privacy" />;
export const TermsOfService = () => <InfoPage pageKey="terms" />;
export const RefundPolicy = () => <InfoPage pageKey="refund" />;
export const Licensing = () => <InfoPage pageKey="licensing" />;
