import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  fetchMyUploads,
  updateProject,
  deleteProject,
} from "../../features/project/projectSlice";
import ProjectTable from "../../components/admin/ProjectTable";
import ProjectViewModal from "../../components/admin/ProjectViewModal";
import ProjectEditModal from "../../components/admin/ProjectEditModal";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";

/* ---------- Debounce hook ---------- */


function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/* ---------- Stat Pill ---------- */
const StatPill = ({ icon, label, value, color = "indigo" }) => {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-700",
    purple: "bg-purple-50 text-purple-700",
    green: "bg-green-50 text-green-700",
    yellow: "bg-yellow-50 text-yellow-700",
    orange: "bg-orange-50 text-orange-700",
  };
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${colors[color]}`}
    >
      <span>{icon}</span>
      <span>{label}:</span>
      <span>{value}</span>
    </div>
  );
};

/* ---------- Pagination ---------- */
const Pagination = ({ pagination, onPageChange }) => {
  const { page, totalPages, totalCount, limit } = pagination;
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalCount);

  const PrevIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
  const NextIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4 sm:px-5 py-4 border-t border-gray-100 bg-gray-50/50">
      <p className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
        Showing <strong className="text-gray-700">{startItem}</strong>–
        <strong className="text-gray-700">{endItem}</strong> of{" "}
        <strong className="text-gray-700">{totalCount}</strong>
      </p>
      <div className="flex items-center gap-1 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 transition"
        >
          <PrevIcon />
        </button>
        {getPages().map((p, idx) =>
          p === "..." ? (
            <span key={`e-${idx}`} className="w-9 h-9 flex items-center justify-center text-sm text-gray-400 select-none">
              ···
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                page === p
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 transition"
        >
          <NextIcon />
        </button>
      </div>
    </div>
  );
};

/* ---------- Main Component ---------- */
const Projects = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    myUploads = [],
    pagination = { page: 1, totalPages: 0, totalCount: 0, limit: 10 },
    stats = {},
    loading,
    error,
  } = useSelector((s) => s.project);

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [priceFilter, setPriceFilter] = useState(searchParams.get("price") || "all");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  const debouncedSearch = useDebounce(search, 400);
  const isFirstRender = useRef(true);

  /* ---------- Modal states ---------- */
  const [viewProject, setViewProject] = useState(null);
  const [editProject, setEditProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* ---------- Fetch ---------- */
  useEffect(() => {
    dispatch(
      fetchMyUploads({
        search: debouncedSearch,
        priceFilter,
        sortBy,
        page,
        limit: 10,
      })
    );
  }, [dispatch, debouncedSearch, priceFilter, sortBy, page]);

  /* ---------- URL sync ---------- */
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.q = debouncedSearch;
    if (priceFilter !== "all") params.price = priceFilter;
    if (sortBy !== "newest") params.sort = sortBy;
    if (page > 1) params.page = page;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, priceFilter, sortBy, page, setSearchParams]);

  /* ---------- Reset page on filter change ---------- */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPage(1);
  }, [debouncedSearch, priceFilter, sortBy]);

  /* ---------- Handlers ---------- */
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClear = () => {
    setSearch("");
    setPriceFilter("all");
    setSortBy("newest");
    setPage(1);
  };

  /* ---------- Save handler ---------- */
  const handleSaveEdit = async (data) => {
    setSaving(true);
    try {
      await dispatch(
        updateProject({ id: editProject._id, data })
      ).unwrap();
      toast.success("Project updated!");
      setEditProject(null);
      // Refresh list
      dispatch(
        fetchMyUploads({ search: debouncedSearch, priceFilter, sortBy, page, limit: 10 })
      );
    } catch (err) {
      toast.error(err || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  /* ---------- Delete handler ---------- */
  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteProject(deleteTarget._id)).unwrap();
      toast.success("Project deleted");
      setDeleteTarget(null);
      // If last item on page, go back a page
      if (myUploads.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        dispatch(
          fetchMyUploads({ search: debouncedSearch, priceFilter, sortBy, page, limit: 10 })
        );
      }
    } catch (err) {
      toast.error(err || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const hasActiveFilters =
    search || priceFilter !== "all" || sortBy !== "newest" || page > 1;

  /* ==================== RENDER ==================== */
  return (
    <>
      {/* ==================== PAGE HEADER ==================== */}
      <div className="mb-6 flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            📦 My Projects
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage your uploaded projects and track performance
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatPill icon="📦" label="Projects" value={stats.totalProjects ?? 0} color="indigo" />
          <StatPill
            icon="⬇️"
            label="Downloads"
            value={(stats.totalDownloads ?? 0).toLocaleString("en-IN")}
            color="green"
          />
          <StatPill
            icon="⭐"
            label="Earnings"
            value={(stats.totalEarnings ?? 0).toLocaleString("en-IN")}
            color="yellow"
          />
        </div>
      </div>

      {/* ==================== ACTION BAR ==================== */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1 min-w-0">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Prices</option>
              <option value="free">Free</option>
              <option value="low">Low (1-50⭐)</option>
              <option value="mid">Medium (51-200⭐)</option>
              <option value="high">High (200+⭐)</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="downloads-high">Most Downloads</option>
              <option value="downloads-low">Least Downloads</option>
              <option value="price-high">Highest Price</option>
              <option value="price-low">Lowest Price</option>
            </select>
            {hasActiveFilters && (
              <button
                onClick={handleClear}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                ✕ Clear
              </button>
            )}
            <Link
              to="/admin/upload"
              className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition text-center flex items-center justify-center gap-2"
            >
              📤 Upload New
            </Link>
          </div>
        </div>
        {!loading && (
          <p className="text-xs text-gray-500 mt-3">
            {pagination.totalCount > 0 ? (
              <>
                Showing <strong className="text-gray-700">{myUploads.length}</strong> of{" "}
                {pagination.totalCount} project{pagination.totalCount !== 1 ? "s" : ""}
                {search && (
                  <>
                    {" "}
                    for <strong>"{search}"</strong>
                  </>
                )}
              </>
            ) : (
              "No results"
            )}
          </p>
        )}
      </div>

      {/* ==================== TABLE ==================== */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading && (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-gray-500">Loading projects...</p>
          </div>
        )}

        {error && !loading && (
          <div className="p-12 text-center">
            <p className="text-3xl mb-2">⚠️</p>
            <p className="text-sm text-red-500 font-medium">Error: {error}</p>
            <button
              onClick={() =>
                dispatch(fetchMyUploads({ search: debouncedSearch, priceFilter, sortBy, page, limit: 10 }))
              }
              className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && myUploads.length === 0 && !hasActiveFilters && (
          <div className="p-12 text-center">
            <p className="text-5xl mb-3">📦</p>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No projects yet</h3>
            <p className="text-sm text-gray-500 mb-5">
              Start by uploading your first project to sell.
            </p>
            <Link
              to="/admin/upload"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
            >
              📤 Upload Your First Project
            </Link>
          </div>
        )}

        {!loading && !error && myUploads.length === 0 && hasActiveFilters && (
          <div className="p-12 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <h3 className="text-base font-bold text-gray-800 mb-1">No projects found</h3>
            <p className="text-sm text-gray-500 mb-5">
              {search ? `No results for "${search}"` : "No projects match your filters"}
            </p>
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800 text-white rounded-lg text-sm font-semibold hover:bg-gray-900"
            >
              ✕ Clear Filters
            </button>
          </div>
        )}

        {!loading && !error && myUploads.length > 0 && (
          <>
            <ProjectTable
              projects={myUploads}
              onView={(p) => setViewProject(p)}
              onEdit={(p) => setEditProject(p)}
              onDelete={(p) => setDeleteTarget(p)}
            />
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </>
        )}
      </div>

      {/* ==================== SEARCH TIPS ==================== */}
      {!loading && myUploads.length > 0 && (
        <div className="mt-5 bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-xs text-blue-800">
            💡 <strong>Tip:</strong> Click <strong>View</strong> for full details,{" "}
            <strong>Edit</strong> to modify, or <strong>Delete</strong> to remove permanently.
          </p>
        </div>
      )}

      {/* ==================== MODALS ==================== */}
      {viewProject && (
        <ProjectViewModal
          project={viewProject}
          onClose={() => setViewProject(null)}
        />
      )}

      {editProject && (
        <ProjectEditModal
          project={editProject}
          onClose={() => !saving && setEditProject(null)}
          onSave={handleSaveEdit}
          saving={saving}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          title="Delete Project"
          message={`Delete "${deleteTarget.title}"? This cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onClose={() => !deleting && setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </>
  );
};

export default Projects;