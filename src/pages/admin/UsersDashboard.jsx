import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchProjects,
  fetchMyPurchases,
} from "../../features/project/projectSlice";

const UsersDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { projects, purchases, loading } = useSelector((s) => s.project);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchMyPurchases());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow p-8 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.name}! 👋</h1>
            <p className="mt-2 opacity-90">Role: {user?.role}</p>
            <p className="opacity-90">Email: {user?.email}</p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="bg-white/20 backdrop-blur rounded-xl px-6 py-4 text-center">
              <p className="text-sm opacity-90">Your Stars</p>
              <p className="text-3xl font-bold">⭐ {user?.stars ?? 0}</p>
            </div>
            {/* ⬇️ NEW: Buy Stars button */}
            <Link
              to="/stars"
              className="bg-white text-purple-600 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-50 transition shadow"
            >
              💳 Buy Stars
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Link
            to="/projects"
            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition group"
          >
            <p className="text-3xl mb-2">🛍️</p>
            <h3 className="font-semibold text-gray-800 group-hover:text-primary">
              Browse Projects
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Explore all available projects
            </p>
          </Link>

          {/* ⬇️ NEW: Buy Stars quick action */}
          <Link
            to="/stars"
            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition group border-2 border-yellow-200"
          >
            <p className="text-3xl mb-2">💳</p>
            <h3 className="font-semibold text-gray-800 group-hover:text-primary">
              Buy Stars
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Recharge with ₹100, ₹500, ₹1000
            </p>
          </Link>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-3xl mb-2">📦</p>
            <h3 className="font-semibold text-gray-800">My Purchases</h3>
            <p className="text-sm text-gray-500 mt-1">
              {purchases.length} project{purchases.length !== 1 ? "s" : ""} owned
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-3xl mb-2">⭐</p>
            <h3 className="font-semibold text-gray-800">Stars Balance</h3>
            <p className="text-sm text-gray-500 mt-1">
              {user?.stars ?? 0} stars available
            </p>
          </div>
        </div>

        {/* Available Projects Section */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              🛍️ Available Projects
            </h2>
            <Link
              to="/projects"
              className="text-primary text-sm font-semibold hover:underline"
            >
              View All →
            </Link>
          </div>

          {loading && <p className="text-gray-500">Loading projects...</p>}

          {!loading && projects.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-4xl mb-2">📭</p>
              <p>No projects available yet.</p>
              <p className="text-sm">Check back later!</p>
            </div>
          )}

          {!loading && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.slice(0, 6).map((p) => (
                <Link
                  key={p._id}
                  to={`/projects/${p._id}`}
                  className="border rounded-xl p-4 hover:border-primary hover:shadow transition"
                >
                  <h3 className="font-semibold text-gray-800 line-clamp-1">
                    {p.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {p.description}
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-yellow-600 font-bold">
                      ⭐ {p.price}
                    </span>
                    <span className="text-xs text-gray-400">View →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* My Purchases Section */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📦 My Purchases
          </h2>

          {purchases.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-4xl mb-2">🛒</p>
              <p>You haven't purchased anything yet.</p>
              <Link
                to="/projects"
                className="inline-block mt-3 px-4 py-2 bg-primary text-white rounded-lg text-sm"
              >
                Browse Projects
              </Link>
            </div>
          )}

          {purchases.length > 0 && (
            <div className="space-y-3">
              {purchases.map((purchase) => {
                const p = purchase.project;
                if (!p) return null;
                return (
                  <div
                    key={purchase._id}
                    className="flex justify-between items-center border rounded-xl p-4"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-800">{p.title}</h3>
                      <p className="text-sm text-gray-500">
                        Purchased for ⭐ {purchase.starsSpent}
                      </p>
                    </div>
                    <Link
                      to={`/projects/${p._id}`}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                    >
                      ⬇️ Download
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersDashboard;