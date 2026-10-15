
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Users,
  ShieldCheck,
  Package,
  Download,
  Upload,
  ChartNoAxesCombined,
  ArrowRight,
  Activity,
} from "lucide-react";

import { fetchAllUsers } from "../../features/user/userSlice";
import { fetchMyUploads } from "../../features/project/projectSlice";

import StatCard from "../../components/admin/StatCard";
import UserTable from "../../components/admin/UserTable";
import ProjectTable from "../../components/admin/ProjectTable";

const themeStyles = {
  light: {
    text: "text-slate-800",
    muted: "text-slate-500",
    card: "bg-white border-slate-200",
    divider: "border-slate-100",
    hover: "hover:bg-slate-50",
    surface: "bg-slate-50",
  },
  dark: {
    text: "text-slate-100",
    muted: "text-slate-400",
    card: "bg-slate-950 border-slate-800",
    divider: "border-slate-800",
    hover: "hover:bg-slate-800/70",
    surface: "bg-slate-900",
  },
  midnight: {
    text: "text-slate-100",
    muted: "text-slate-400",
    card: "bg-[#101b30] border-[#293955]",
    divider: "border-[#293955]",
    hover: "hover:bg-[#1c2b46]",
    surface: "bg-[#0b1424]",
  },
};

const readTheme = () => {
  try {
    const value = localStorage.getItem("admin-sidebar-theme");
    return value ? JSON.parse(value) : "light";
  } catch {
    return "light";
  }
};

const SectionCard = ({ title, subtitle, action, children, t }) => (
  <section className={`min-w-0 overflow-hidden rounded-2xl border shadow-sm ${t.card}`}>
    <div className={`flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 ${t.divider}`}>
      <div className="min-w-0">
        <h2 className={`text-base font-bold ${t.text}`}>{title}</h2>
        {subtitle && (
          <p className={`mt-1 text-sm ${t.muted}`}>{subtitle}</p>
        )}
      </div>

      {action && <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div>}
    </div>

    {children}
  </section>
);

const LoadingState = ({ text, t }) => (
  <div className={`p-8 text-center text-sm ${t.muted}`} role="status">
    {text}
  </div>
);

const EmptyState = ({ icon: Icon = Package, text, t }) => (
  <div className={`p-8 text-center ${t.muted}`}>
    <Icon size={30} className="mx-auto mb-3 opacity-60" />
    <p className="text-sm">{text}</p>
  </div>
);

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const { users = [], loading: usersLoading } = useSelector(
    (state) => state.user
  );

  const { myUploads = [], loading: projectsLoading } = useSelector(
    (state) => state.project
  );

  const { user: currentUser } = useSelector((state) => state.auth);

  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchMyUploads());
  }, [dispatch]);

  useEffect(() => {
    const syncTheme = () => setTheme(readTheme());

    window.addEventListener("storage", syncTheme);
    window.addEventListener("admin-theme-change", syncTheme);

    return () => {
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener("admin-theme-change", syncTheme);
    };
  }, []);

  const t = themeStyles[theme] || themeStyles.light;

  const totalAdmins = users.filter((user) => user.role === "admin").length;

  const totalDownloads = myUploads.reduce(
    (total, project) => total + (Number(project.downloads) || 0),
    0
  );

  const stats = [
    {
      icon: Users,
      label: "Total Users",
      value: users.length.toLocaleString("en-IN"),
      color: "blue",
    },
    {
      icon: ShieldCheck,
      label: "Total Admins",
      value: totalAdmins.toLocaleString("en-IN"),
      color: "purple",
    },
    {
      icon: Package,
      label: "My Projects",
      value: myUploads.length.toLocaleString("en-IN"),
      color: "orange",
    },
    {
      icon: Download,
      label: "Total Downloads",
      value: totalDownloads.toLocaleString("en-IN"),
      color: "green",
    },
  ];

  const activities = [
    {
      icon: Upload,
      title: "Project management",
      description: "Review your latest uploaded projects.",
      to: "/admin/projects",
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      icon: Users,
      title: "Customer management",
      description: "View registered users and account details.",
      to: "/admin/users",
      color: "text-green-500 bg-green-500/10",
    },
    {
      icon: ChartNoAxesCombined,
      title: "Analytics",
      description: "Review your available platform analytics.",
      to: "/admin/analytics",
      color: "text-purple-500 bg-purple-500/10",
    },
  ];

  return (
    <div className="min-w-0 space-y-6">
      {/* Heading */}
      <div>
        <p className={`text-sm ${t.muted}`}>Overview / Dashboard</p>

        <h1 className={`mt-1 text-2xl font-bold sm:text-3xl ${t.text}`}>
          Dashboard Overview
        </h1>

        <p className={`mt-2 text-sm ${t.muted}`}>
          Welcome back, {currentUser?.name || "Admin"}! Here is your store overview.
        </p>
      </div>

      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5 text-white shadow-lg sm:p-7">
        <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-white/75">
              YOUR ADMIN WORKSPACE
            </p>

            <h2 className="text-xl font-bold sm:text-2xl">
              Welcome back, {currentUser?.name || "Admin"}!
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/80">
              Manage projects, review users, and keep track of your marketplace.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/upload"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
            >
              <Upload size={17} />
              Upload Project
            </Link>

            <Link
              to="/admin/analytics"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <ChartNoAxesCombined size={17} />
              Analytics
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="min-w-0">
            <StatCard
              icon={<stat.icon size={22} />}
              label={stat.label}
              value={stat.value}
              color={stat.color}
            />
          </div>
        ))}
      </section>

      {/* Users + Quick Links */}
      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <SectionCard
            title="Recent Users"
            subtitle="Latest registered users on your platform"
            t={t}
            action={
              <Link
                to="/admin/users"
                className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-500 hover:text-indigo-400"
              >
                View All <ArrowRight size={15} />
              </Link>
            }
          >
            {usersLoading ? (
              <LoadingState text="Loading users..." t={t} />
            ) : users.length === 0 ? (
              <EmptyState icon={Users} text="No users registered yet." t={t} />
            ) : (
              <div className="max-w-full overflow-x-auto">
                <UserTable users={users.slice(0, 5)} />
              </div>
            )}
          </SectionCard>
        </div>

        <SectionCard
          title="Quick Access"
          subtitle="Common admin destinations"
          t={t}
        >
          <div className="space-y-1 p-3">
            {activities.map((activity) => {
              const Icon = activity.icon;

              return (
                <Link
                  key={activity.title}
                  to={activity.to}
                  className={`flex min-w-0 items-start gap-3 rounded-xl p-3 transition ${t.hover}`}
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${activity.color}`}>
                    <Icon size={19} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className={`block text-sm font-semibold ${t.text}`}>
                      {activity.title}
                    </span>
                    <span className={`mt-1 block text-xs leading-5 ${t.muted}`}>
                      {activity.description}
                    </span>
                  </span>

                  <ArrowRight size={16} className={`mt-1 shrink-0 ${t.muted}`} />
                </Link>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* Projects */}
      <SectionCard
        title="Recent Projects"
        subtitle="Your latest uploaded projects"
        t={t}
        action={
          <>
            <Link
              to="/admin/projects"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-indigo-500 transition hover:bg-indigo-500/10"
            >
              View All
            </Link>

            <Link
              to="/admin/upload"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <Upload size={15} />
              Add Project
            </Link>
          </>
        }
      >
        {projectsLoading ? (
          <LoadingState text="Loading projects..." t={t} />
        ) : myUploads.length === 0 ? (
          <EmptyState
            icon={Package}
            text="No projects uploaded yet. Upload your first project to get started."
            t={t}
          />
        ) : (
          <div className="max-w-full overflow-x-auto">
            <ProjectTable projects={myUploads.slice(0, 5)} />
          </div>
        )}
      </SectionCard>

      {/* Footer */}
      <div className={`flex flex-col gap-2 border-t pt-4 text-xs sm:flex-row sm:items-center sm:justify-between ${t.divider} ${t.muted}`}>
        <p>Admin Dashboard</p>
        <p className="inline-flex items-center gap-1">
          <Activity size={13} />
          Statistics reflect the data currently loaded from your API.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
