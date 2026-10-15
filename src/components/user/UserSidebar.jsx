import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { useTheme } from "../../context/ThemeContext";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Star,
  Wallet,
  Bell,
  Settings,
  LogOut,
  X,
  Zap,
  ChevronLeft,
  ChevronRight,
  Home,
  BookOpen,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";

/* ===================== MENU SECTIONS ===================== */
const menuSections = [
  {
    title: "Overview",
    links: [
      { to: "/user/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/user/wallet", label: "Wallet", icon: Wallet },
    ],
  },
  {
    title: "Shopping",
    links: [
      { to: "/projects", label: "Browse Projects", icon: ShoppingBag },
      { to: "/user/purchases", label: "My Purchases", icon: Package, badge: "purchases" },
      { to: "/stars", label: "Buy Stars", icon: Star },
    ],
  },
  {
    title: "Account",
    links: [
      { to: "/user/notifications", label: "Notifications", icon: Bell, badge: "notifications" },
      { to: "/user/settings", label: "Settings", icon: Settings },
    ],
  },
  {
    title: "Explore",
    links: [
      { to: "/", label: "Home", icon: Home },
      { to: "/blog", label: "Blog", icon: BookOpen },
    ],
  },
];

/* ===================== THEME ICONS ===================== */
const themeIcons = {
  light: Sun,
  dark: Moon,
  midnight: Monitor,
};

/* ===================== STORAGE HELPER ===================== */
const readStorage = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

/* ===================== COMPONENT ===================== */
const UserSidebar = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((s) => s.auth);
  const { purchases = [] } = useSelector((s) => s.project);
  const { unreadCount = 0 } = useSelector((s) => s.notification || {});

  // ✅ THEME HOOK (shared with admin)
  const { themeKey, setThemeKey, currentTheme, themes } = useTheme();

  const [collapsed, setCollapsed] = useState(() =>
    readStorage("user-sidebar-collapsed", false)
  );
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  /* ---------- Persist collapsed + notify layout ---------- */
  useEffect(() => {
    try {
      localStorage.setItem(
        "user-sidebar-collapsed",
        JSON.stringify(collapsed)
      );
      window.dispatchEvent(new Event("user-sidebar-toggle"));
    } catch {}
  }, [collapsed]);

  /* ---------- Keyboard shortcuts ---------- */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setLogoutConfirm(false);
        setIsOpen?.(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsOpen]);

  /* ---------- Badge counts ---------- */
  const getCount = (key) => {
    if (key === "purchases") return purchases.length;
    if (key === "notifications") return unreadCount;
    return 0;
  };

  /* ---------- Actions ---------- */
  const handleLogout = () => {
    dispatch(logout());
    setLogoutConfirm(false);
    setIsOpen?.(false);
    navigate("/login");
  };

  const visitLink = (path) => {
    setIsOpen?.(false);
    navigate(path);
  };

  /* ===================== RENDER LINK ===================== */
  const renderLink = (link) => {
    const Icon = link.icon;
    const count = link.badge ? getCount(link.badge) : 0;

    return (
      <NavLink
        key={link.to}
        to={link.to}
        end={link.to === "/user/dashboard"}
        onClick={() => setIsOpen?.(false)}
        title={collapsed ? link.label : undefined}
        className={({ isActive }) =>
          `relative flex min-h-10 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors
          ${collapsed ? "justify-center px-2" : ""}
          ${
            isActive
              ? "bg-indigo-500/15 font-semibold text-indigo-400"
              : `${currentTheme.muted} ${currentTheme.hover}`
          }`
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-indigo-500" />
            )}
            <Icon size={18} className="shrink-0" />

            {!collapsed && (
              <span className="min-w-0 flex-1 truncate">{link.label}</span>
            )}

            {!collapsed && count > 0 && (
              <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs font-medium text-indigo-400">
                {count}
              </span>
            )}

            {collapsed && count > 0 && (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-indigo-500" />
            )}
          </>
        )}
      </NavLink>
    );
  };

  /* ===================== JSX ===================== */
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsOpen?.(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r transition-[width,transform,background-color] duration-200
          ${currentTheme.surface}
          ${collapsed ? "w-[76px]" : "w-64"}
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* ---------- Brand Header ---------- */}
        <div
          className={`flex h-[68px] shrink-0 items-center justify-between border-b px-3 ${currentTheme.border}`}
        >
          <button
            type="button"
            onClick={() => visitLink("/user/dashboard")}
            className={`flex min-w-0 items-center gap-3 rounded-lg p-1 text-left ${
              collapsed ? "mx-auto" : ""
            }`}
            title="User dashboard"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white">
              <Zap size={21} />
            </span>
            {!collapsed && (
              <span className="min-w-0">
                <span className={`block truncate text-[15px] font-bold tracking-tight ${currentTheme.text}`}>
                  User<span className="text-indigo-500">Panel</span>
                </span>
                <span className={`block text-[11px] ${currentTheme.muted}`}>
                  Marketplace
                </span>
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsOpen?.(false)}
            aria-label="Close sidebar"
            className={`rounded-lg p-2 ${currentTheme.hover} lg:hidden`}
          >
            <X size={18} />
          </button>

          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`hidden rounded-lg p-2 lg:block ${currentTheme.muted} ${currentTheme.hover}`}
          >
            {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          </button>
        </div>

        {/* ---------- Profile Card ---------- */}
        <div className={`border-b p-3 ${currentTheme.border}`}>
          <div
            className={`flex items-center gap-3 rounded-xl p-2 ${currentTheme.hover} ${
              collapsed ? "justify-center" : ""
            }`}
            title={collapsed ? user?.name || "User" : undefined}
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
              {user?.name?.trim()?.[0]?.toUpperCase() || "U"}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm font-semibold ${currentTheme.text}`}>
                  {user?.name || "User"}
                </p>
                <p className={`truncate text-xs ${currentTheme.muted}`}>
                  {user?.email}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ---------- Navigation ---------- */}
        <nav
          aria-label="User navigation"
          className="min-h-0 flex-1 space-y-6 overflow-y-auto overflow-x-hidden px-3 py-4 custom-scrollbar"
        >
          {menuSections.map((section) => (
            <div key={section.title} className="space-y-1.5">
              {!collapsed && (
                <p className={`px-3 text-[11px] font-bold uppercase tracking-wider ${currentTheme.muted}`}>
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.links.map(renderLink)}
              </div>
            </div>
          ))}
        </nav>

        {/* ---------- Footer (Theme Switcher + Logout) ---------- */}
        <div className={`shrink-0 border-t p-3 space-y-3 ${currentTheme.border}`}>
          {!collapsed && (
            <p className={`px-1 text-[10px] font-bold uppercase tracking-wider ${currentTheme.muted}`}>
              Appearance
            </p>
          )}

          <div className={`grid gap-1 ${collapsed ? "grid-cols-1" : "grid-cols-3"}`}>
            {[
              { key: "light", label: "Light", icon: Sun },
              { key: "dark", label: "Dark", icon: Moon },
              { key: "midnight", label: "Midnight", icon: Monitor },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setThemeKey(key)}
                aria-label={`${label} theme`}
                aria-pressed={themeKey === key}
                title={label}
                className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition ${
                  themeKey === key
                    ? "bg-indigo-500/15 text-indigo-400 border-transparent"
                    : `border-transparent ${currentTheme.muted} ${currentTheme.hover}`
                }`}
              >
                <Icon size={16} />
                {!collapsed && <span>{label}</span>}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setLogoutConfirm(true)}
            title="Logout"
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-500/10 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ---------- Logout Confirm ---------- */}
      {logoutConfirm && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setLogoutConfirm(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className={`w-full max-w-sm rounded-xl border p-5 shadow-xl ${currentTheme.surface} ${currentTheme.border}`}
          >
            <h2 className={`text-base font-semibold ${currentTheme.text}`}>
              Sign out?
            </h2>
            <p className={`mt-2 text-sm ${currentTheme.muted}`}>
              Are you sure you want to sign out?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setLogoutConfirm(false)}
                className={`rounded-lg border px-4 py-2 text-sm ${currentTheme.border} ${currentTheme.text} ${currentTheme.hover}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserSidebar;