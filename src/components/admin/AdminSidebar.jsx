import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { useTheme } from "../../context/ThemeContext";
import {
  ChartNoAxesCombined,
  Package,
  PlusCircle,
  Users,
  FileText,
  FilePlus,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  X,
  Zap,
  LayoutDashboard,
} from "lucide-react";

/* ===================== MENU ===================== */
const menuSections = [
  {
    title: "Overview",
    links: [
      { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/admin/analytics", label: "Analytics", icon: ChartNoAxesCombined },
    ],
  },
  {
    title: "Store",
    links: [
      { to: "/admin/projects", label: "My Projects", icon: Package },
      { to: "/admin/upload", label: "Add Project", icon: PlusCircle },
    ],
  },
  {
    title: "Customers & Content",
    links: [
      { to: "/admin/users", label: "Customers", icon: Users },
      { to: "/admin/blogs", label: "Blogs", icon: FileText },
      { to: "/admin/create-blog", label: "Create Blog", icon: FilePlus },
    ],
  },
];

const themeIcons = {
  light: Sun,
  dark: Moon,
  midnight: Monitor,
};

/* ===================== STORAGE ===================== */
const readStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

/* ===================== COMPONENT ===================== */
export default function AdminSidebar({ isOpen, setIsOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { themeKey, setThemeKey, currentTheme, themes } = useTheme();

  const [collapsed, setCollapsed] = useState(() =>
    readStorage("admin-sidebar-collapsed", false)
  );
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  /* ---------- Persist collapsed ---------- */
  useEffect(() => {
    try {
      localStorage.setItem(
        "admin-sidebar-collapsed",
        JSON.stringify(collapsed)
      );
      window.dispatchEvent(new Event("sidebar-toggle"));
    } catch {}
  }, [collapsed]);

  /* ---------- Esc key ---------- */
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

  const visitLink = (path) => {
    setIsOpen?.(false);
    navigate(path);
  };

  const handleLogout = () => {
    dispatch(logout());
    setLogoutConfirm(false);
    setIsOpen?.(false);
    navigate("/login");
  };

  const renderLink = (link) => {
    const Icon = link.icon;
    return (
      <NavLink
        key={link.to}
        to={link.to}
        end={link.to === "/admin/dashboard"}
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
          </>
        )}
      </NavLink>
    );
  };

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
        {/* ---------- Logo ---------- */}
        <div
          className={`flex h-[68px] shrink-0 items-center justify-between border-b px-3 ${currentTheme.border}`}
        >
          <button
            type="button"
            onClick={() => visitLink("/admin/dashboard")}
            className={`flex min-w-0 items-center gap-3 rounded-lg p-1 text-left ${
              collapsed ? "mx-auto" : ""
            }`}
            title="Go to dashboard"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white">
              <Zap size={21} />
            </span>
            {!collapsed && (
              <span className="min-w-0">
                <span className={`block truncate text-[15px] font-bold tracking-tight ${currentTheme.text}`}>
                  Admin<span className="text-indigo-500">Panel</span>
                </span>
                <span className={`block text-[11px] ${currentTheme.muted}`}>
                  Control center
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
            className={`hidden rounded-lg p-2 lg:block ${currentTheme.muted} ${currentTheme.hover}`}
          >
            {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          </button>
        </div>

        {/* ---------- Navigation ---------- */}
        <nav
          aria-label="Admin navigation"
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
            {Object.entries(themes).map(([key, t]) => {
              const Icon = themeIcons[key] || Sun;
              const active = themeKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setThemeKey(key)}
                  aria-label={`${t.name} theme`}
                  aria-pressed={active}
                  title={t.name}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition ${
                    active
                      ? "bg-indigo-500/15 text-indigo-400 border-transparent"
                      : `border-transparent ${currentTheme.muted} ${currentTheme.hover}`
                  }`}
                >
                  <Icon size={16} />
                  {!collapsed && <span>{t.name}</span>}
                </button>
              );
            })}
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

      {/* ---------- Logout Confirm Modal ---------- */}
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
}