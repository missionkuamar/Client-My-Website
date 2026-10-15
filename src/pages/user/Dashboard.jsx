import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchProjects,
  fetchMyPurchases,
} from "../../features/project/projectSlice";
import {
  ShoppingBag,
  Package,
  Star,
  CreditCard,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import DailyBonusCard from "../../components/user/DailyBonusCard";
import { useTheme } from "../../context/ThemeContext";

/* ============ Stat Card ============ */
const StatCard = ({ icon, label, value, sub, color = "indigo", to }) => {
  const { currentTheme } = useTheme();

  const colors = {
    indigo: "from-indigo-500 to-blue-500",
    purple: "from-purple-500 to-pink-500",
    yellow: "from-yellow-500 to-orange-500",
    green: "from-green-500 to-emerald-500",
  };

  const Wrapper = to ? Link : "div";
  const wrapperProps = to ? { to } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`rounded-2xl border shadow-sm p-5 ${currentTheme.card} ${currentTheme.text} ${
        to ? `hover:shadow-md hover:border-indigo-400 transition cursor-pointer` : ""
      }`}
    >
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white mb-3 shadow-lg`}
      >
        {icon}
      </div>
      <p className={`text-xs font-semibold uppercase tracking-wider ${currentTheme.muted}`}>
        {label}
      </p>
      <p className={`text-2xl font-bold mt-1 ${currentTheme.text}`}>{value}</p>
      {sub && <p className={`text-xs mt-1 ${currentTheme.muted}`}>{sub}</p>}
    </Wrapper>
  );
};

/* ============ Section Card ============ */
const SectionCard = ({ title, subtitle, action, children }) => {
  const { currentTheme } = useTheme();

  return (
    <section className={`rounded-2xl border shadow-sm overflow-hidden ${currentTheme.card}`}>
      <div className={`flex flex-wrap items-center justify-between gap-3 border-b p-5 ${currentTheme.border}`}>
        <div>
          <h2 className={`text-base font-bold ${currentTheme.text}`}>{title}</h2>
          {subtitle && (
            <p className={`text-xs mt-0.5 ${currentTheme.muted}`}>{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
};

/* ============ Project Card ============ */
const ProjectCard = ({ project }) => {
  const { currentTheme } = useTheme();

  return (
    <Link
      to={`/projects/${project._id}`}
      className={`group border rounded-xl overflow-hidden hover:border-indigo-400 hover:shadow-md transition flex flex-col ${currentTheme.card}`}
    >
      {project.thumbnail ? (
        <img
          src={project.thumbnail}
          alt={project.title}
          loading="lazy"
          className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-36 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl">
          📦
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col">
        <h3 className={`font-semibold text-sm line-clamp-2 group-hover:text-indigo-500 transition ${currentTheme.text}`}>
          {project.title}
        </h3>
        <p className={`text-xs mt-1 line-clamp-2 flex-1 ${currentTheme.muted}`}>
          {project.description}
        </p>
        <div className={`mt-3 flex justify-between items-center pt-3 border-t ${currentTheme.border}`}>
          <span className="text-yellow-500 font-bold text-sm">
            ⭐ {project.price}
          </span>
          <span className="text-xs text-indigo-500 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            View <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
};

/* ============ Purchase Row ============ */
const PurchaseRow = ({ purchase }) => {
  const { currentTheme } = useTheme();
  const p = purchase.project;
  if (!p) return null;

  return (
    <div className={`p-4 transition flex flex-col sm:flex-row sm:items-center gap-3 ${currentTheme.hover}`}>
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-xl flex-shrink-0">
        📦
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={`font-semibold text-sm truncate ${currentTheme.text}`}>
          {p.title}
        </h3>
        <p className={`text-xs mt-0.5 ${currentTheme.muted}`}>
          Purchased for ⭐ {purchase.starsSpent}
        </p>
      </div>
      <Link
        to={`/projects/${p._id}`}
        className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-green-700 transition flex-shrink-0 text-center"
      >
        ⬇️ Download
      </Link>
    </div>
  );
};

/* ============ Main Dashboard ============ */
const UserDashboard = () => {
  const dispatch = useDispatch();
  const { currentTheme } = useTheme();
  const { user } = useSelector((s) => s.auth);
  const { projects = [], purchases = [], loading } = useSelector(
    (s) => s.project
  );

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchMyPurchases());
  }, [dispatch]);

  return (
    <>
      {/* ==================== PAGE HEADER ==================== */}
      <div className="mb-5 sm:mb-6">
        <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${currentTheme.text}`}>
          Dashboard 🏠
        </h1>
        <p className={`mt-1 text-xs sm:text-sm ${currentTheme.muted}`}>
          Welcome back, {user?.name}! Here's your overview.
        </p>
      </div>

      {/* ==================== WELCOME BANNER ==================== */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg p-5 sm:p-8 mb-5 sm:mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
              Hello, {user?.name}! 👋
            </h2>
            <p className="mt-2 opacity-90 text-sm sm:text-base">
              Role:{" "}
              <span className="font-semibold capitalize">{user?.role}</span>
            </p>
            <p className="opacity-90 text-sm sm:text-base truncate">
              {user?.email}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
            <div className="bg-white/20 backdrop-blur rounded-xl px-5 sm:px-6 py-3 sm:py-4 text-center w-full md:w-auto">
              <p className="text-xs sm:text-sm opacity-90">Your Stars</p>
              <p className="text-2xl sm:text-3xl font-bold">
                ⭐ {user?.stars ?? 0}
              </p>
            </div>

            <Link
              to="/stars"
              className="bg-white text-indigo-600 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-yellow-50 transition shadow w-full md:w-auto text-center"
            >
              💳 Buy Stars
            </Link>
          </div>
        </div>
      </div>

      {/* ==================== DAILY BONUS ==================== */}
      <div className="mb-5 sm:mb-6">
        <DailyBonusCard />
      </div>

      {/* ==================== QUICK STATS ==================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
        <StatCard
          icon={<ShoppingBag size={22} />}
          label="Projects"
          value={projects.length}
          sub="Available to buy"
          color="indigo"
          to="/projects"
        />
        <StatCard
          icon={<Package size={22} />}
          label="Purchased"
          value={purchases.length}
          sub="Projects owned"
          color="purple"
          to="/user/purchases"
        />
        <StatCard
          icon={<Star size={22} />}
          label="Stars"
          value={user?.stars ?? 0}
          sub="Your balance"
          color="yellow"
          to="/stars"
        />
        <StatCard
          icon={<CreditCard size={22} />}
          label="Buy Stars"
          value="₹100+"
          sub="Starting price"
          color="green"
          to="/stars"
        />
      </div>

      {/* ==================== AVAILABLE PROJECTS ==================== */}
      <div className="mb-5 sm:mb-6">
        <SectionCard
          title="🛍️ Available Projects"
          subtitle="Explore projects you can buy with stars"
          action={
            <Link
              to="/projects"
              className="text-indigo-500 text-sm font-semibold hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </Link>
          }
        >
          {loading && (
            <div className="p-10 text-center">
              <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
              <p className={`text-sm ${currentTheme.muted}`}>Loading projects...</p>
            </div>
          )}

          {!loading && projects.length === 0 && (
            <div className="p-10 sm:p-12 text-center">
              <p className="text-5xl mb-3">📭</p>
              <h3 className={`text-base font-bold mb-1 ${currentTheme.text}`}>
                No projects yet
              </h3>
              <p className={`text-xs sm:text-sm ${currentTheme.muted}`}>
                Check back later for new uploads!
              </p>
            </div>
          )}

          {!loading && projects.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-5">
              {projects.slice(0, 6).map((p) => (
                <ProjectCard key={p._id} project={p} />
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* ==================== MY PURCHASES ==================== */}
      <SectionCard
        title="📦 My Purchases"
        subtitle={`${purchases.length} project${purchases.length !== 1 ? "s" : ""} owned`}
        action={
          purchases.length > 0 && (
            <Link
              to="/user/purchases"
              className="text-indigo-500 text-sm font-semibold hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </Link>
          )
        }
      >
        {purchases.length === 0 && (
          <div className="p-10 sm:p-12 text-center">
            <p className="text-5xl mb-3">🛒</p>
            <h3 className={`text-base font-bold mb-1 ${currentTheme.text}`}>
              No purchases yet
            </h3>
            <p className={`text-xs sm:text-sm mb-5 ${currentTheme.muted}`}>
              Buy your first project and start building!
            </p>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
            >
              <ShoppingBag size={16} /> Browse Projects
            </Link>
          </div>
        )}

        {purchases.length > 0 && (
          <div className={`divide-y ${currentTheme.border}`}>
            {purchases.slice(0, 3).map((purchase) => (
              <PurchaseRow key={purchase._id} purchase={purchase} />
            ))}
          </div>
        )}
      </SectionCard>

      {/* ==================== TIP FOOTER ==================== */}
      <div className={`mt-5 border rounded-2xl p-4 sm:p-5 ${currentTheme.card}`}>
        <p className={`text-xs sm:text-sm flex items-start gap-2 ${currentTheme.muted}`}>
          <TrendingUp size={16} className="mt-0.5 flex-shrink-0" />
          <span>
            <strong className={currentTheme.text}>Tip:</strong> Top up your stars to unlock premium projects.
            All purchases are permanent — download anytime!
          </span>
        </p>
      </div>
    </>
  );
};

export default UserDashboard;