import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import { useTheme } from "../../context/ThemeContext";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  UserRound,
  Settings,
  LogOut,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";

const themeIcons = {
  light: Sun,
  dark: Moon,
  midnight: Monitor,
};

const TopNavbar = ({ title = "", onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);
  const { themeKey, setThemeKey, currentTheme, themes } = useTheme();

  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setShowDropdown(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") setShowDropdown(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const handleLogout = () => {
    setShowDropdown(false);
    dispatch(logout());
    navigate("/login");
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    if (!query) return;
    navigate(`/admin/projects?search=${encodeURIComponent(query)}`);
  };

  // Cycle theme on icon click
  const cycleTheme = () => {
    const keys = Object.keys(themes);
    const idx = keys.indexOf(themeKey);
    setThemeKey(keys[(idx + 1) % keys.length]);
  };

  const ThemeIcon = themeIcons[themeKey] || Sun;

  return (
    <header
      className={`sticky top-0 z-30 border-b transition-colors ${currentTheme.surface}`}
    >
      <div className="flex min-h-[68px] items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-5 lg:px-6">
        {/* Left */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition lg:hidden ${currentTheme.hover} ${currentTheme.text}`}
          >
            <Menu size={21} />
          </button>

          {title ? (
            <h1 className={`truncate text-base font-bold sm:text-lg ${currentTheme.text}`}>
              {title}
            </h1>
          ) : (
            <span className={`hidden text-sm font-semibold sm:block ${currentTheme.text}`}>
              Admin Dashboard
            </span>
          )}
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:block">
            <div className="relative">
              <Search
                size={17}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${currentTheme.muted}`}
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className={`w-44 rounded-xl border py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 lg:w-60 ${currentTheme.surface} ${currentTheme.border} ${currentTheme.text}`}
              />
            </div>
          </form>

          {/* ✅ THEME TOGGLE BUTTON (Top Navbar) */}
          <button
            type="button"
            onClick={cycleTheme}
            title={`Theme: ${currentTheme.name} (click to change)`}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${currentTheme.hover} ${currentTheme.text}`}
          >
            <ThemeIcon size={18} />
          </button>

          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => navigate("/admin/notifications")}
            className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition ${currentTheme.hover} ${currentTheme.text}`}
          >
            <Bell size={19} />
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDropdown((v) => !v)}
              aria-expanded={showDropdown}
              className={`flex items-center gap-2 rounded-xl p-1.5 transition sm:px-2 ${currentTheme.hover}`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
                {user?.name?.[0]?.toUpperCase() || "A"}
              </div>

              <div className="hidden min-w-0 text-left md:block">
                <p className={`max-w-28 truncate text-sm font-semibold ${currentTheme.text}`}>
                  {user?.name || "Admin"}
                </p>
                <p className={`max-w-28 truncate text-xs ${currentTheme.muted}`}>
                  {user?.role || "Administrator"}
                </p>
              </div>

              <ChevronDown size={15} className={`hidden sm:block ${currentTheme.muted}`} />
            </button>

            {showDropdown && (
              <>
                <button
                  type="button"
                  aria-label="Close profile menu"
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => setShowDropdown(false)}
                />

                <div
                  className={`absolute right-0 z-20 mt-2 w-[min(18rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border shadow-xl ${currentTheme.surface}`}
                >
                  <div className={`border-b px-4 py-3 ${currentTheme.border}`}>
                    <p className={`truncate text-sm font-semibold ${currentTheme.text}`}>
                      {user?.name || "Admin"}
                    </p>
                    <p className={`truncate text-xs ${currentTheme.muted}`}>
                      {user?.email || ""}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowDropdown(false);
                      navigate("/user/dashboard");
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition ${currentTheme.text} ${currentTheme.hover}`}
                  >
                    <UserRound size={17} /> My Profile
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowDropdown(false);
                      navigate("/admin/settings");
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition ${currentTheme.text} ${currentTheme.hover}`}
                  >
                    <Settings size={17} /> Settings
                  </button>

                  <div className={`border-t p-2 ${currentTheme.border}`}>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-500/10"
                    >
                      <LogOut size={17} /> Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <form onSubmit={handleSearch} className="px-3 pb-3 md:hidden">
        <div className="relative">
          <Search
            size={16}
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${currentTheme.muted}`}
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${currentTheme.surface} ${currentTheme.border} ${currentTheme.text}`}
          />
        </div>
      </form>
    </header>
  );
};

export default TopNavbar;