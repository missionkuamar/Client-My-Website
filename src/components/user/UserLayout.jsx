import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { Menu, Sun, Moon, MoonStar } from "lucide-react";
import { useSelector } from "react-redux";
import UserSidebar from "./UserSidebar";
import { useTheme } from "../../context/ThemeContext";

const themeIcons = {
  day: Sun,
  night: Moon,
  midnight: MoonStar,
};

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { themeKey, setThemeKey, currentTheme, themes } = useTheme();

  const [collapsed, setCollapsed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user-sidebar-collapsed")) || false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const syncCollapsed = () => {
      try {
        const value =
          JSON.parse(localStorage.getItem("user-sidebar-collapsed")) || false;
        setCollapsed(value);
      } catch {}
    };

    window.addEventListener("user-sidebar-toggle", syncCollapsed);
    window.addEventListener("storage", syncCollapsed);

    return () => {
      window.removeEventListener("user-sidebar-toggle", syncCollapsed);
      window.removeEventListener("storage", syncCollapsed);
    };
  }, []);

  const { user } = useSelector((s) => s.auth);

  // Cycle theme on top navbar button click
  const cycleTheme = () => {
    const keys = Object.keys(themes);
    const idx = keys.indexOf(themeKey);
    setThemeKey(keys[(idx + 1) % keys.length]);
  };

  const ThemeIcon = themeIcons[themeKey] || Sun;

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      {/* Sidebar */}
      <UserSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Content area */}
      <div
        className={`min-h-screen min-w-0 transition-[padding] duration-200 ${
          collapsed ? "lg:pl-[76px]" : "lg:pl-64"
        }`}
      >
        {/* Top Navbar */}
        <header
          className={`sticky top-0 z-30 border-b ${currentTheme.border} ${currentTheme.surface}`}
        >
          <div className="flex items-center justify-between gap-3 px-4 lg:px-6 py-4">
            {/* Left — Hamburger */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`lg:hidden w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${currentTheme.hover}`}
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>

              <div className="hidden sm:block">
                <p className={`text-sm ${currentTheme.muted}`}>
                  Welcome back,{" "}
                  <span className={`font-semibold ${currentTheme.text}`}>
                    {user?.name}
                  </span>
                </p>
              </div>
            </div>

            {/* Right — Theme toggle + Balance */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* ✅ THEME BUTTON (Top Navbar) */}
              <button
                onClick={cycleTheme}
                title={`Theme: ${currentTheme.name} (click to change)`}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${currentTheme.hover}`}
              >
                <ThemeIcon size={18} />
              </button>

              <Link
                to="/stars"
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 rounded-lg px-3 py-2 hover:from-yellow-200 hover:to-orange-200 transition"
              >
                <span className="text-yellow-600 text-lg">⭐</span>
                <span className="text-sm font-bold text-yellow-700">
                  {user?.stars ?? 0}
                </span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={`w-full p-4 sm:p-6 ${currentTheme.text}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;