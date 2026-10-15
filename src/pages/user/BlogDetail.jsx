import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import toast from "react-hot-toast";
import {
  fetchBlogBySlug,
  fetchRelatedBlogs,
  likeBlog,
  clearCurrentBlog,
} from "../../features/blog/blogSlice";
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  Copy,
  Check,
  ChevronLeft,
  ExternalLink,
  GitBranch,
  Tag,
  ArrowRight,
  BookOpen,
  User as UserIcon,
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";

/* ============ Copy Button ============ */
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed");
    }
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition"
      title="Copy"
    >
      {copied ? (
        <Check size={14} className="text-green-600" />
      ) : (
        <Copy size={14} />
      )}
    </button>
  );
};

/* ============ Table of Contents ============ */
const TableOfContents = ({ content }) => {
  const headings = useMemo(() => {
    if (!content) return [];
    const lines = content.split("\n");
    const items = [];
    lines.forEach((line) => {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        items.push({ level, text, id });
      }
    });
    return items;
  }, [content]);

  if (headings.length < 3) return null;

  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4">
      <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
        📑 Table of Contents
      </h3>
      <nav className="space-y-1.5">
        {headings.map((h, i) => (
          <a
            key={i}
            href={`#${h.id}`}
            className={`block text-xs text-gray-600 hover:text-indigo-600 transition truncate ${
              h.level === 1
                ? "font-semibold"
                : h.level === 2
                ? "pl-3"
                : "pl-6 text-gray-500"
            }`}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </div>
  );
};

/* ============ Related Blog Card ============ */
const RelatedBlogCard = ({ blog }) => (
  <Link
    to={`/blog/${blog.slug}`}
    className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-indigo-300 hover:shadow-md transition flex flex-col"
  >
    {blog.thumbnail ? (
      <img
        src={blog.thumbnail}
        alt={blog.title}
        className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
      />
    ) : (
      <div className="w-full h-36 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl">
        📄
      </div>
    )}
    <div className="p-4 flex-1 flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium capitalize">
          {blog.category}
        </span>
        <span className="text-[10px] text-gray-400">
          ⏱️ {blog.readTime || 5} min
        </span>
      </div>
      <h3 className="text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-indigo-600 transition">
        {blog.title}
      </h3>
      <p className="text-xs text-gray-500 line-clamp-2 mt-1.5 flex-1">
        {blog.excerpt}
      </p>
      <div className="flex items-center gap-3 text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
        <span>👁️ {blog.views || 0}</span>
        <span>❤️ {blog.likes || 0}</span>
        <span className="ml-auto text-indigo-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
          Read <ArrowRight size={12} />
        </span>
      </div>
    </div>
  </Link>
);

/* ============ Main Component ============ */
const BlogDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const {
    currentBlog: blog,
    relatedBlogs = [],
    blogLoading: loading,
    error,
  } = useSelector((s) => s.blog);

  const [liked, setLiked] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  /* ---------- Fetch ---------- */
  useEffect(() => {
    if (slug) {
      dispatch(fetchBlogBySlug(slug));
      dispatch(fetchRelatedBlogs(slug));
    }
    return () => dispatch(clearCurrentBlog());
  }, [dispatch, slug]);

  /* ---------- Scroll top on load ---------- */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  /* ---------- Like ---------- */
  const handleLike = async () => {
    if (liked || !blog?._id) return;
    try {
      await dispatch(likeBlog(blog._id)).unwrap();
      setLiked(true);
      toast.success("Thanks for the like!");
    } catch {
      toast.error("Failed to like");
    }
  };

  /* ---------- Share ---------- */
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.excerpt,
          url,
        });
      } catch {
        /* cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied!");
      } catch {
        toast.error("Share failed");
      }
    }
  };

  /* ---------- Format date ---------- */
  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  /* ---------- All images for lightbox ---------- */
  const allImages = useMemo(() => {
    if (!blog) return [];
    return [
      ...(blog.thumbnail ? [{ url: blog.thumbnail }] : []),
      ...(blog.gallery || []),
    ];
  }, [blog]);

  /* ==================== LOADING ==================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-gray-500">Loading blog...</p>
        </div>
      </div>
    );
  }

  /* ==================== ERROR ==================== */
  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <p className="text-6xl mb-4">📄</p>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Blog not found
          </h1>
          <p className="text-gray-500 mb-6">
            {error || "The blog you're looking for doesn't exist."}
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            <ChevronLeft size={16} /> Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  /* ==================== MAIN ==================== */
  return (
    <>
      {/* ============ BREADCRUMB ============ */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
            <Link to="/" className="hover:text-indigo-600 transition">
              Home
            </Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-indigo-600 transition">
              Blog
            </Link>
            <span>/</span>
            <span className="text-gray-800 truncate max-w-[200px]">
              {blog.title}
            </span>
          </div>
        </div>
      </div>

      {/* ============ ARTICLE ============ */}
      <article className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* ---------- HEADER (compact) ---------- */}
          <header className="mb-6">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-semibold capitalize">
                {blog.category || "Article"}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock size={12} /> {blog.readTime || 5} min read
              </span>
              {blog.isFeatured && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold">
                  ⭐ Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3">
              {blog.title}
            </h1>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                {blog.excerpt}
              </p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {blog.author?.name?.[0]?.toUpperCase() || "A"}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {blog.author?.name || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(blog.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-auto text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Eye size={13} /> {blog.views || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Heart size={13} /> {blog.likes || 0}
                </span>
              </div>
            </div>
          </header>

          {/* ---------- THUMBNAIL (compact) ---------- */}
          {blog.thumbnail && (
            <div
              onClick={() => setLightboxIndex(0)}
              className="relative cursor-pointer rounded-2xl overflow-hidden mb-6 group"
            >
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="w-full h-48 sm:h-64 md:h-72 object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition bg-white/90 text-gray-800 px-3 py-1.5 rounded-lg text-xs font-semibold">
                  🔍 Click to enlarge
                </div>
              </div>
            </div>
          )}

          {/* ---------- GRID: Content + Sidebar ---------- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Markdown */}
              <div className="prose prose-sm sm:prose-base max-w-none blog-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h1: ({ children }) => (
                      <h2
                        id={String(children)
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")}
                        className="text-2xl font-bold text-gray-900 mt-8 mb-4"
                      >
                        {children}
                      </h2>
                    ),
                    h2: ({ children }) => (
                      <h3
                        id={String(children)
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")}
                        className="text-xl font-bold text-gray-900 mt-8 mb-3"
                      >
                        {children}
                      </h3>
                    ),
                    h3: ({ children }) => (
                      <h4 className="text-lg font-bold text-gray-900 mt-6 mb-2">
                        {children}
                      </h4>
                    ),
                    p: ({ children }) => (
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-6 mb-4 space-y-1 text-gray-700">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-6 mb-4 space-y-1 text-gray-700">
                        {children}
                      </ol>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        {children}
                      </a>
                    ),
                    code: ({ inline, children }) =>
                      inline ? (
                        <code className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono">
                          {children}
                        </code>
                      ) : (
                        <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 overflow-x-auto my-4 text-sm">
                          <code>{children}</code>
                        </pre>
                      ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-gray-700 my-4 bg-indigo-50/50 py-3 rounded-r-lg">
                        {children}
                      </blockquote>
                    ),
                    img: ({ src, alt }) => (
                      <img
                        src={src}
                        alt={alt}
                        className="w-full rounded-xl my-4 border border-gray-200"
                      />
                    ),
                  }}
                >
                  {blog.content}
                </ReactMarkdown>
              </div>

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag size={16} className="text-gray-400" />
                    {blog.tags.map((tag, i) => (
                      <Link
                        key={i}
                        to={`/blog?tag=${tag}`}
                        className="text-xs bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 text-gray-600 px-3 py-1 rounded-md transition"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {(blog.liveLink || blog.videoLink || blog.githubLink) && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-gray-800 mb-3">
                    🔗 Links
                  </h3>
                  <div className="space-y-2">
                    {blog.liveLink && (
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition">
                        <ExternalLink
                          size={16}
                          className="text-indigo-600 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800">
                            Live Demo
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {blog.liveLink}
                          </p>
                        </div>
                        <CopyButton text={blog.liveLink} />
                        <a
                          href={blog.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 flex-shrink-0"
                        >
                          Open
                        </a>
                      </div>
                    )}
                    {blog.videoLink && (
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50/40 transition">
                        <FaYoutube
                          size={16}
                          className="text-red-600 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800">
                            Video Demo
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {blog.videoLink}
                          </p>
                        </div>
                        <CopyButton text={blog.videoLink} />
                        <a
                          href={blog.videoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 flex-shrink-0"
                        >
                          Watch
                        </a>
                      </div>
                    )}
                    {blog.githubLink && (
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition">
                        <GitBranch
                          size={16}
                          className="text-gray-700 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800">
                            GitHub Repository
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {blog.githubLink}
                          </p>
                        </div>
                        <CopyButton text={blog.githubLink} />
                        <a
                          href={blog.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-gray-800 text-white rounded-lg text-xs font-semibold hover:bg-gray-900 flex-shrink-0"
                        >
                          View
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {blog.gallery?.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    🖼️ Gallery ({blog.gallery.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {blog.gallery.map((img, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          setLightboxIndex(i + (blog.thumbnail ? 1 : 0))
                        }
                        className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200"
                      >
                        <img
                          src={img.url}
                          alt={`Gallery ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition"></div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
                <button
                  onClick={handleLike}
                  disabled={liked}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    liked
                      ? "bg-pink-100 text-pink-700"
                      : "bg-pink-600 text-white hover:bg-pink-700"
                  }`}
                >
                  <Heart size={16} className={liked ? "fill-pink-700" : ""} />
                  {liked ? "Liked" : "Like"} ({blog.likes || 0})
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
                >
                  <Share2 size={16} /> Share
                </button>

                <div className="flex items-center gap-1 px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="text-xs text-gray-500 mr-1">Copy link</span>
                  <CopyButton text={window.location.href} />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <TableOfContents content={blog.content} />

              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <UserIcon size={14} /> About Author
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {blog.author?.name?.[0]?.toUpperCase() || "A"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {blog.author?.name || "Admin"}
                    </p>
                    <p className="text-xs text-gray-500">Author</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* ============ RELATED BLOGS ============ */}
      {relatedBlogs.length > 0 && (
        <section className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                <BookOpen size={20} /> Related Articles
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                More blogs you might like
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedBlogs.map((r) => (
                <RelatedBlogCard key={r._id} blog={r} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ LIGHTBOX ============ */}
      {lightboxIndex !== null && allImages.length > 0 && (
        <Lightbox
          images={allImages}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
};

/* ============ Lightbox ============ */
const Lightbox = ({ images, startIndex, onClose }) => {
  const [current, setCurrent] = useState(startIndex);

  const next = () => setCurrent((c) => (c + 1) % images.length);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  });

  return (
    <div
      className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex items-center justify-center"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-10 text-xl"
      >
        ✕
      </button>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 text-white px-4 py-2 rounded-full text-sm">
        {current + 1} / {images.length}
      </div>
      {images.length > 1 && (
        <button
          onClick={prev}
          className="absolute left-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-10 text-2xl"
        >
          ‹
        </button>
      )}
      <img
        src={images[current].url}
        alt={`Image ${current + 1}`}
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
      />
      {images.length > 1 && (
        <button
          onClick={next}
          className="absolute right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-10 text-2xl"
        >
          ›
        </button>
      )}
    </div>
  );
};

export default BlogDetail;