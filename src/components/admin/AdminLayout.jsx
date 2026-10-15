import { useEffect, useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import TopNavbar from "./TopNavbar";
import { useTheme } from "../../context/ThemeContext";

const getStoredValue = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return fallback;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch {
    return fallback;
  }
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { themeKey, currentTheme } = useTheme();

  const [collapsed, setCollapsed] = useState(() =>
    Boolean(getStoredValue("admin-sidebar-collapsed", false))
  );

  /* ---------- Listen for sidebar collapse ---------- */
  const syncCollapsed = useCallback(() => {
    setCollapsed(Boolean(getStoredValue("admin-sidebar-collapsed", false)));
  }, []);

  useEffect(() => {
    window.addEventListener("storage", syncCollapsed);
    window.addEventListener("sidebar-toggle", syncCollapsed);
    syncCollapsed();

    return () => {
      window.removeEventListener("storage", syncCollapsed);
      window.removeEventListener("sidebar-toggle", syncCollapsed);
    };
  }, [syncCollapsed]);

  return (
    <div
      className={`admin-layout min-h-screen transition-colors duration-200 ${currentTheme.bg}`}
      data-theme={themeKey}
      data-admin-theme={themeKey}
    >
      <AdminSidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div
        className={`min-h-screen min-w-0 transition-[padding] duration-200 ${
          collapsed ? "lg:pl-[76px]" : "lg:pl-64"
        }`}
      >
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="w-full min-w-0 p-3 sm:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;