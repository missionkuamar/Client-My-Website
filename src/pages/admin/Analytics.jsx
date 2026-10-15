import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  fetchOverviewStats,
  fetchRevenueChart,
  fetchUserGrowthChart,
  fetchSalesChart,
  fetchTopProjects,
  fetchRoleDistribution,
  setRange,
} from "../../features/analytics/analyticsSlice";
import StatCard from "../../components/admin/StatCard";

/* ============================================================
   Time Range Options
   ============================================================ */
const RANGES = [
  { value: "day", label: "Today" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "4months", label: "4 Months" },
  { value: "6months", label: "6 Months" },
  { value: "year", label: "1 Year" },
  { value: "5years", label: "5 Years" },
  { value: "all", label: "All Time" },
];

/* ============================================================
   Reusable Components
   ============================================================ */
const ChartCard = ({ icon, title, subtitle, children, height = 300 }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
    <div className="mb-4">
      <h3 className="text-sm sm:text-base font-bold text-gray-800">
        {icon} {title}
      </h3>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      )}
    </div>
    <div style={{ height }}>{children}</div>
  </div>
);

const EmptyChart = ({ text = "No data available for this range" }) => (
  <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
    <p className="text-3xl mb-2">📊</p>
    <p className="text-center px-4">{text}</p>
  </div>
);

/* Format date for x-axis */
const formatDate = (dateStr, range) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);

  if (range === "day" || range === "week" || range === "month") {
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  }
  if (range === "4months" || range === "6months" || range === "year") {
    return d.toLocaleDateString("en-IN", {
      month: "short",
      year: "2-digit",
    });
  }
  return d.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
};

const Analytics = () => {
  const dispatch = useDispatch();
  const {
    range,
    stats,
    revenueData = [],
    userGrowthData = [],
    salesData = [],
    topProjects = [],
    roleDistribution = [],
    loading,
  } = useSelector((s) => s.analytics);

  /* ---------- Load all data on range change ---------- */
  useEffect(() => {
    dispatch(fetchOverviewStats(range));
    dispatch(fetchRevenueChart(range));
    dispatch(fetchUserGrowthChart(range));
    dispatch(fetchSalesChart(range));
    dispatch(fetchTopProjects(range));
    dispatch(fetchRoleDistribution());
  }, [dispatch, range]);

  const COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444"];

  /* Format data for charts */
  const formattedRevenue = revenueData.map((d) => ({
    ...d,
    label: formatDate(d.date, range),
  }));

  const formattedGrowth = userGrowthData.map((d) => ({
    ...d,
    label: formatDate(d.date, range),
  }));

  const formattedSales = salesData.map((d) => ({
    ...d,
    label: formatDate(d.date, range),
  }));

  return (
    <>
      {/* ==================== PAGE HEADER ==================== */}
      <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            📈 Analytics
          </h1>
          <p className="text-gray-500 mt-1 text-xs sm:text-sm">
            Real-time insights about your store
          </p>
        </div>

        {/* ---------- Range Selector ---------- */}
        <div className="bg-white border border-gray-200 rounded-xl p-1 flex flex-wrap gap-1">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => dispatch(setRange(r.value))}
              className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition ${
                range === r.value
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* ==================== STATS GRID ==================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
        <StatCard
          icon="💰"
          label="Total Revenue"
          value={`₹${(stats.totalRevenue || 0).toLocaleString("en-IN")}`}
          color="green"
        />
        <StatCard
          icon="👥"
          label="New Users"
          value={stats.totalUsers || 0}
          color="primary"
        />
        <StatCard
          icon="🛒"
          label="Orders"
          value={stats.totalOrders || 0}
          color="purple"
        />
        <StatCard
          icon="⭐"
          label="Stars Sold"
          value={(stats.totalStars || 0).toLocaleString("en-IN")}
          color="orange"
        />
      </div>

      {/* ==================== CHARTS GRID ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mb-5 sm:mb-6">
        {/* 1. Revenue Trend */}
        <ChartCard
          icon="💰"
          title="Revenue Trend"
          subtitle={`Revenue over ${RANGES.find((r) => r.value === range)?.label.toLowerCase()}`}
        >
          {formattedRevenue.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" stroke="#888" fontSize={11} />
                <YAxis stroke="#888" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                  }}
                  formatter={(val) => [`₹${val}`, "Revenue"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* 2. User Growth */}
        <ChartCard
          icon="👥"
          title="User Growth"
          subtitle="New users over time"
        >
          {formattedGrowth.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" stroke="#888" fontSize={11} />
                <YAxis stroke="#888" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* 3. Sales / Orders */}
        <ChartCard
          icon="🛒"
          title="Project Sales"
          subtitle="Number of project purchases"
        >
          {formattedSales.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedSales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" stroke="#888" fontSize={11} />
                <YAxis stroke="#888" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="sales" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* 4. Role Distribution */}
        <ChartCard
          icon="🎭"
          title="User Roles"
          subtitle="Distribution of users by role"
        >
          {roleDistribution.every((r) => r.value === 0) ? (
            <EmptyChart text="No users yet" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={55}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={3}
                  label={({ name, value }) =>
                    value > 0 ? `${name}: ${value}` : ""
                  }
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* ==================== TOP PROJECTS ==================== */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100">
          <h3 className="text-sm sm:text-base font-bold text-gray-800">
            🏆 Top Performing Projects
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Based on purchases in selected range
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-gray-500">Loading...</p>
          </div>
        ) : topProjects.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            <p className="text-3xl mb-2">📭</p>
            <p>No purchases in this period</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {topProjects.map((p, idx) => (
              <div
                key={p._id}
                className="p-4 flex items-center gap-3 sm:gap-4 hover:bg-gray-50 transition"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
                  #{idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm sm:text-base truncate">
                    {p.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    ⭐ {p.price} · {p.downloads} downloads
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm sm:text-base font-bold text-indigo-600">
                    {p.purchases} sold
                  </p>
                  <p className="text-xs text-green-600 font-semibold">
                    ⭐ {p.starsEarned} earned
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Analytics;