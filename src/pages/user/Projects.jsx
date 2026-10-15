import { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { fetchProjects } from "../../features/project/projectSlice";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Star,
  Sparkles,
  Layers,
  Grid3x3,
  List,
  Heart,
  ArrowRight,
} from "lucide-react";

/* ---------- Debounce ---------- */
function useDebounce(value, delay = 400) {
  const [d, setD] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setD(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return d;
}

/* ---------- Project Card (Grid) ---------- */
const ProjectCard = ({ project }) => (
  <Link
    to={`/projects/${project._id}`}
    className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-indigo-400 hover:shadow-lg transition flex flex-col"
  >
    {/* Thumbnail */}
    {project.thumbnail ? (
      <img
        src={project.thumbnail}
        alt={project.title}
        loading="lazy"
        className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
      />
    ) : (
      <div className="w-full h-44 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl">
        📦
      </div>
    )}

    {/* Content */}
    <div className="p-5 flex-1 flex flex-col">
      {/* Badges */}
      <div className="flex items-center gap-1.5 mb-2">
        {project.isFeatured && (
          <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide flex items-center gap-1">
            <Sparkles size={10} /> Featured
          </span>
        )}
        {project.category && (
          <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">
            {project.category}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-bold text-gray-800 text-base line-clamp-2 group-hover:text-indigo-600 transition mb-2">
        {project.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500 line-clamp-2 flex-1">
        {project.description}
      </p>

      {/* Tech stack preview */}
      {project.techStack?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {project.techStack.slice(0, 3).map((t, i) => (
            <span
              key={i}
              className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded"
            >
              {t}
            </span>
          ))}
          {project.techStack.length > 3 && (
            <span className="text-[10px] text-gray-400">
              +{project.techStack.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Price + View */}
      <div className="mt-4 flex justify-between items-center pt-3 border-t border-gray-100">
        <span className="text-yellow-600 font-bold text-lg">
          ⭐ {project.price}
        </span>
        <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
          View <ArrowRight size={12} />
        </span>
      </div>
    </div>
  </Link>
);

/* ---------- Project Row (List View) ---------- */
const ProjectRow = ({ project }) => (
  <Link
    to={`/projects/${project._id}`}
    className="group flex gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-400 hover:shadow-md transition"
  >
    {/* Thumbnail */}
    {project.thumbnail ? (
      <img
        src={project.thumbnail}
        alt={project.title}
        loading="lazy"
        className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
      />
    ) : (
      <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl flex-shrink-0">
        📦
      </div>
    )}

    {/* Content */}
    <div className="flex-1 min-w-0 flex flex-col">
      <div className="flex flex-wrap items-center gap-1.5 mb-1">
        {project.isFeatured && (
          <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">
            ⭐ Featured
          </span>
        )}
        {project.category && (
          <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium capitalize">
            {project.category}
          </span>
        )}
      </div>

      <h3 className="font-bold text-gray-800 text-sm line-clamp-1 group-hover:text-indigo-600 transition">
        {project.title}
      </h3>
      <p className="text-xs text-gray-500 line-clamp-2 mt-0.5 flex-1">
        {project.description}
      </p>

      {project.techStack?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {project.techStack.slice(0, 4).map((t, i) => (
            <span
              key={i}
              className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded"
            >
              {t}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="text-[10px] text-gray-400">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>
      )}
    </div>

    {/* Price + Action */}
    <div className="flex flex-col items-end justify-between flex-shrink-0">
      <span className="text-yellow-600 font-bold text-lg">
        ⭐ {project.price}
      </span>
      <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
        View <ArrowRight size={12} />
      </span>
    </div>
  </Link>
);

/* ---------- Pagination ---------- */
const Pagination = ({ pagination, onPageChange }) => {
  const { page, totalPages, totalCount, limit } = pagination;
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible)
      start = Math.max(1, end - maxVisible + 1);
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

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-200">
      <p className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
        Showing <strong className="text-gray-700">{startItem}</strong>–
        <strong className="text-gray-700">{endItem}</strong> of{" "}
        <strong className="text-gray-700">{totalCount}</strong> projects
      </p>
      <div className="flex items-center gap-1 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 transition"
        >
          <ChevronLeft size={16} />
        </button>
        {getPages().map((p, idx) =>
          p === "..." ? (
            <span
              key={`e-${idx}`}
              className="w-9 h-9 flex items-center justify-center text-sm text-gray-400 select-none"
            >
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
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

/* ---------- Main Component ---------- */
const Projects = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const isFirstRender = useRef(true);

  const { user } = useSelector((s) => s.auth);
  const {
    projects = [],
    publicPagination = { page: 1, totalPages: 0, totalCount: 0, limit: 9 },
    publicStats = { total: 0, featured: 0, free: 0 },
    categories = [],
    loading,
    error,
  } = useSelector((s) => s.project);

  /* ---------- Filters (URL synced) ---------- */
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get("category") || "all"
  );
  const [priceFilter, setPriceFilter] = useState(
    searchParams.get("price") || "all"
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [viewMode, setViewMode] = useState(
    searchParams.get("view") || "grid"
  );

  const debouncedSearch = useDebounce(search, 400);

  /* ---------- Fetch ---------- */
  useEffect(() => {
    dispatch(
      fetchProjects({
        search: debouncedSearch,
        category: categoryFilter,
        priceFilter,
        sortBy,
        page,
        limit: 9,
      })
    );
  }, [dispatch, debouncedSearch, categoryFilter, priceFilter, sortBy, page]);

  /* ---------- URL sync ---------- */
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.q = debouncedSearch;
    if (categoryFilter !== "all") params.category = categoryFilter;
    if (priceFilter !== "all") params.price = priceFilter;
    if (sortBy !== "newest") params.sort = sortBy;
    if (page > 1) params.page = page;
    if (viewMode !== "grid") params.view = viewMode;
    setSearchParams(params, { replace: true });
  }, [
    debouncedSearch,
    categoryFilter,
    priceFilter,
    sortBy,
    page,
    viewMode,
    setSearchParams,
  ]);

  /* ---------- Reset page on filter change ---------- */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPage(1);
  }, [debouncedSearch, categoryFilter, priceFilter, sortBy]);

  /* ---------- Handlers ---------- */
  const handlePageChange = (p) => {
    if (p < 1 || p > publicPagination.totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClear = () => {
    setSearch("");
    setCategoryFilter("all");
    setPriceFilter("all");
    setSortBy("newest");
    setPage(1);
  };

  const hasActiveFilters =
    search ||
    categoryFilter !== "all" ||
    priceFilter !== "all" ||
    sortBy !== "newest" ||
    page > 1;

  /* ==================== RENDER ==================== */
  return (
    <>
      {/* ==================== PAGE HEADER ==================== */}
      <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingBag size={24} /> Browse Projects
          </h1>
          <p className="text-gray-500 mt-1 text-xs sm:text-sm">
            Discover {publicStats.total} projects to boost your skills
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Stars balance */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 text-yellow-800 px-4 py-2.5 rounded-lg font-bold text-sm flex items-center gap-1.5">
            ⭐ {user?.stars ?? 0} Stars
          </div>
        </div>
      </div>

      {/* ==================== FILTERS BAR ==================== */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-5 sm:mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by title, description, or tech..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.count})
                </option>
              ))}
            </select>

            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer"
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
              className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Downloads</option>
              <option value="featured">Featured First</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={handleClear}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                ✕ Clear
              </button>
            )}

            {/* View toggle */}
            <div className="flex bg-gray-50 border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition ${
                  viewMode === "grid"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="Grid view"
              >
                <Grid3x3 size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition ${
                  viewMode === "list"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {!loading && (
          <p className="text-xs text-gray-500 mt-3">
            Showing <strong className="text-gray-700">{projects.length}</strong>{" "}
            of {publicPagination.totalCount} projects
            {debouncedSearch && (
              <>
                {" "}
                for "<strong>{debouncedSearch}</strong>"
              </>
            )}
          </p>
        )}
      </div>

      {/* ==================== LOADING ==================== */}
      {loading && (
        <div className="p-16 text-center">
          <div className="inline-block w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-gray-500">Loading projects...</p>
        </div>
      )}

      {/* ==================== ERROR ==================== */}
      {error && !loading && (
        <div className="p-12 text-center bg-white rounded-2xl border border-red-200">
          <p className="text-3xl mb-2">⚠️</p>
          <p className="text-sm text-red-500 font-medium">Error: {error}</p>
          <button
            onClick={() =>
              dispatch(
                fetchProjects({
                  search: debouncedSearch,
                  category: categoryFilter,
                  priceFilter,
                  sortBy,
                  page,
                  limit: 9,
                })
              )
            }
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* ==================== EMPTY ==================== */}
      {!loading && !error && projects.length === 0 && (
        <div className="p-16 text-center bg-white rounded-2xl border border-gray-200">
          <p className="text-6xl mb-3">📭</p>
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {hasActiveFilters ? "No projects found" : "No projects yet"}
          </h3>
          <p className="text-sm text-gray-500 mb-5">
            {hasActiveFilters
              ? "Try adjusting your search or filters"
              : "Check back later for new uploads"}
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* ==================== PROJECTS GRID/LIST ==================== */}
      {!loading && !error && projects.length > 0 && (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {projects.map((p) => (
                <ProjectCard key={p._id} project={p} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((p) => (
                <ProjectRow key={p._id} project={p} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            pagination={publicPagination}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </>
  );
};

export default Projects;