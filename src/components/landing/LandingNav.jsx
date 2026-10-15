
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import {
  Menu,
  X,
  ShoppingBag,
  LayoutDashboard,
  Star,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  CloudMoon,
} from "lucide-react";

const themes = [
  { id: "day", label: "Day", Icon: Sun },
  { id: "night", label: "Night", Icon: Moon },
  { id: "midnight", label: "Midnight", Icon: CloudMoon },
];

const themeStyles = {
  day: {
    header: "bg-white/95 border-gray-200",
    text: "text-gray-800",
    muted: "text-gray-500",
    hover: "hover:bg-gray-100",
    panel: "bg-white border-gray-200",
    mobile: "bg-white border-gray-200",
    link: "text-gray-700 hover:bg-gray-100",
    divider: "border-gray-200",
  },
  night: {
    header: "bg-slate-900/95 border-slate-700",
    text: "text-slate-100",
    muted: "text-slate-400",
    hover: "hover:bg-slate-800",
    panel: "bg-slate-900 border-slate-700",
    mobile: "bg-slate-900 border-slate-700",
    link: "text-slate-200 hover:bg-slate-800",
    divider: "border-slate-700",
  },
  midnight: {
    header: "bg-[#0b1120]/95 border-[#293955]",
    text: "text-blue-50",
    muted: "text-blue-200/60",
    hover: "hover:bg-[#1b2942]",
    panel: "bg-[#111c30] border-[#293955]",
    mobile: "bg-[#0b1120] border-[#293955]",
    link: "text-blue-100 hover:bg-[#1b2942]",
    divider: "border-[#293955]",
  },
};

const LandingNav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("landing-theme");
      return themes.some((item) => item.id === saved) ? saved : "day";
    } catch {
      return "day";
    }
  });

  const current = themeStyles[theme] || themeStyles.day;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme =
      theme === "day" ? "light" : "dark";

    try {
      localStorage.setItem("landing-theme", theme);
    } catch {
      // Continue even when browser storage is unavailable.
    }
  }, [theme]);

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    setMobileOpen(false);
    navigate("/login");
  };

  const dashboardLink =
    user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard";

  const navLinks = [
    { to: "/projects", label: "Projects" },
    { to: "/blog", label: "Blog" },
    { to: "/stars", label: "Pricing" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? `${current.header} shadow-lg backdrop-blur-xl`
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3 lg:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="group flex shrink-0 items-center gap-2.5"
            onClick={() => setMobileOpen(false)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl text-white shadow-lg transition group-hover:scale-105">
              🛍️
            </div>

            <span
              className={`text-lg font-bold tracking-tight sm:text-xl ${
                scrolled
                  ? current.text
                  : theme === "day"
                    ? "text-white"
                    : current.text
              }`}
            >
              My<span className="text-indigo-500">Store</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  scrolled
                    ? `${current.text} ${current.hover}`
                    : theme === "day"
                      ? "text-white/90 hover:bg-white/10"
                      : `${current.text} ${current.hover}`
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* Theme Switcher */}
            <div
              className={`flex items-center gap-0.5 rounded-xl border p-1 ${
                scrolled
                  ? `${current.panel}`
                  : theme === "day"
                    ? "border-white/20 bg-black/10"
                    : `${current.panel}`
              }`}
              aria-label="Choose website theme"
            >
              {themes.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  title={`${label} theme`}
                  aria-label={`${label} theme`}
                  aria-pressed={theme === id}
                  onClick={() => setTheme(id)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition sm:h-9 sm:w-9 ${
                    theme === id
                      ? "bg-indigo-600 text-white shadow"
                      : scrolled
                        ? `${current.muted} ${current.hover}`
                        : theme === "day"
                          ? "text-white hover:bg-white/20"
                          : `${current.muted} ${current.hover}`
                  }`}
                >
                  <Icon size={17} />
                </button>
              ))}
            </div>

            {!token ? (
              <>
                <Link
                  to="/login"
                  className={`hidden rounded-lg px-3 py-2 text-sm font-semibold transition sm:inline-flex ${
                    scrolled
                      ? `${current.text} ${current.hover}`
                      : theme === "day"
                        ? "text-white hover:bg-white/10"
                        : `${current.text} ${current.hover}`
                  }`}
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-700 hover:to-purple-700 sm:px-5 sm:text-sm"
                >
                  <span className="sm:hidden">Join</span>
                  <span className="hidden sm:inline">Get Started</span>
                </Link>
              </>
            ) : (
              <>
                {/* Stars */}
                <Link
                  to="/stars"
                  className="hidden items-center gap-1.5 rounded-lg border border-yellow-200 bg-gradient-to-r from-yellow-100 to-orange-100 px-3 py-2 transition hover:from-yellow-200 hover:to-orange-200 sm:flex"
                >
                  <Star
                    size={14}
                    className="fill-yellow-500 text-yellow-500"
                  />
                  <span className="text-sm font-bold text-yellow-700">
                    {user?.stars ?? 0}
                  </span>
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((open) => !open)}
                    aria-expanded={userMenuOpen}
                    aria-label="User menu"
                    className={`flex items-center gap-2 rounded-lg p-1.5 transition ${
                      scrolled
                        ? `${current.hover}`
                        : theme === "day"
                          ? "hover:bg-white/10"
                          : current.hover
                    }`}
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user?.name || "User"}
                        className="h-8 w-8 rounded-full border-2 border-white/50 object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}

                    <ChevronDown
                      size={14}
                      className={
                        scrolled
                          ? current.muted
                          : theme === "day"
                            ? "text-white/70"
                            : current.muted
                      }
                    />
                  </button>

                  {userMenuOpen && (
                    <>
                      <button
                        type="button"
                        aria-label="Close user menu"
                        className="fixed inset-0 z-10 cursor-default"
                        onClick={() => setUserMenuOpen(false)}
                      />

                      <div
                        className={`absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border py-2 shadow-2xl ${current.panel}`}
                      >
                        <div
                          className={`border-b px-4 py-3 ${current.divider}`}
                        >
                          <p
                            className={`truncate text-sm font-semibold ${current.text}`}
                          >
                            {user?.name}
                          </p>
                          <p
                            className={`truncate text-xs ${current.muted}`}
                          >
                            {user?.email}
                          </p>
                        </div>

                        <Link
                          to={dashboardLink}
                          onClick={() => setUserMenuOpen(false)}
                          className={`flex items-center gap-2 px-4 py-2.5 text-sm ${current.link}`}
                        >
                          <LayoutDashboard size={16} />
                          Dashboard
                        </Link>

                        <Link
                          to="/projects"
                          onClick={() => setUserMenuOpen(false)}
                          className={`flex items-center gap-2 px-4 py-2.5 text-sm ${current.link}`}
                        >
                          <ShoppingBag size={16} />
                          Browse Projects
                        </Link>

                        <Link
                          to="/stars"
                          onClick={() => setUserMenuOpen(false)}
                          className={`flex items-center gap-2 px-4 py-2.5 text-sm ${current.link}`}
                        >
                          <Star size={16} />
                          Buy Stars
                        </Link>

                        <hr className={`my-1 ${current.divider}`} />

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-500 transition hover:bg-red-500/10"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => {
                setMobileOpen((open) => !open);
                setUserMenuOpen(false);
              }}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className={`rounded-lg p-2 transition lg:hidden ${
                scrolled
                  ? `${current.text} ${current.hover}`
                  : theme === "day"
                    ? "text-white hover:bg-white/10"
                    : `${current.text} ${current.hover}`
              }`}
            >
              {mobileOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Navigation */}
        {mobileOpen && (
          <div
            className={`mb-3 rounded-2xl border p-3 shadow-xl lg:hidden ${current.mobile}`}
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition ${current.link}`}
                >
                  {item.label === "Projects" ? (
                    <span className="flex items-center gap-2">
                      <ShoppingBag size={16} />
                      Browse Projects
                    </span>
                  ) : (
                    item.label
                  )}
                </Link>
              ))}

              {token && (
                <>
                  <Link
                    to={dashboardLink}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-4 py-3 text-sm font-medium transition ${current.link}`}
                  >
                    <span className="flex items-center gap-2">
                      <LayoutDashboard size={16} />
                      Dashboard
                    </span>
                  </Link>

                  <Link
                    to="/stars"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition ${current.link}`}
                  >
                    <Star size={16} />
                    My Stars: {user?.stars ?? 0}
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-lg px-4 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-500/10"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </>
              )}

              {!token && (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-semibold text-indigo-500 transition hover:bg-indigo-500/10"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default LandingNav;
