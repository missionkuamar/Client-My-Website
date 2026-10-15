import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  X,
  ExternalLink,
  GitBranch,
  Eye,
  Heart,
  Calendar,
  Clock,
  Tag,
  Image as ImageIcon,
  Star,
  Copy,
  Check,
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import toast from "react-hot-toast";

/* ---------- Copy Button ---------- */
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed");
    }
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition"
    >
      {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
    </button>
  );
};

const BlogViewModal = ({ blog, onClose, onEdit, onDelete }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!blog) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-3 sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-5 border-b border-gray-100 gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-base sm:text-lg font-bold text-gray-800">
                {blog.title}
              </h2>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  blog.status === "published"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {blog.status === "published" ? "✅ Published" : "📝 Draft"}
              </span>
              {blog.isFeatured && (
                <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                  ⭐ Featured
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> {blog.readTime || 5} min read
              </span>
              {blog.category && (
                <span className="flex items-center gap-1 capitalize">
                  <Tag size={12} /> {blog.category}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* Thumbnail */}
          {blog.thumbnail ? (
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-56 object-cover rounded-xl border border-gray-200"
            />
          ) : (
            <div className="w-full h-56 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-6xl">
              📄
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-center">
              <p className="text-[10px] text-indigo-700 uppercase font-semibold">
                Views
              </p>
              <p className="text-lg font-bold text-indigo-700 mt-1 flex items-center justify-center gap-1">
                <Eye size={14} /> {blog.views || 0}
              </p>
            </div>
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-3 text-center">
              <p className="text-[10px] text-pink-700 uppercase font-semibold">
                Likes
              </p>
              <p className="text-lg font-bold text-pink-700 mt-1 flex items-center justify-center gap-1">
                <Heart size={14} /> {blog.likes || 0}
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-center">
              <p className="text-[10px] text-purple-700 uppercase font-semibold">
                Gallery
              </p>
              <p className="text-lg font-bold text-purple-700 mt-1 flex items-center justify-center gap-1">
                <ImageIcon size={14} /> {blog.gallery?.length || 0}
              </p>
            </div>
          </div>

          {/* Excerpt */}
          {blog.excerpt && (
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-1.5">
                📝 Excerpt
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {blog.excerpt}
              </p>
            </div>
          )}

          {/* Content */}
          {blog.content && (
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-1.5">
                📄 Content Preview
              </h3>
              <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100 max-h-60 overflow-y-auto">
                {blog.content}
              </div>
            </div>
          )}

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-2">🏷️ Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {blog.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {blog.gallery?.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-2">
                🖼️ Gallery ({blog.gallery.length})
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {blog.gallery.slice(0, 6).map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt={`Gallery ${i + 1}`}
                    className="w-full aspect-square object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
              {blog.gallery.length > 6 && (
                <p className="text-xs text-gray-400 mt-2">
                  +{blog.gallery.length - 6} more images
                </p>
              )}
            </div>
          )}

          {/* Links */}
          {(blog.liveLink || blog.videoLink || blog.githubLink) && (
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-2">🔗 Links</h3>
              <div className="space-y-2">
                {blog.liveLink && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
                    <ExternalLink size={16} className="text-indigo-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">Live Demo</p>
                      <p className="text-xs text-gray-500 truncate">{blog.liveLink}</p>
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
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
                    <FaYoutube size={16} className="text-red-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">Video Demo</p>
                      <p className="text-xs text-gray-500 truncate">{blog.videoLink}</p>
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
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
                    <GitBranch size={16} className="text-gray-700 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">GitHub</p>
                      <p className="text-xs text-gray-500 truncate">{blog.githubLink}</p>
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
        </div>

        {/* Footer actions */}
        <div className="border-t border-gray-100 p-3 sm:p-4 bg-gray-50 flex flex-wrap gap-2 justify-end">
          <Link
            to={`/blog/${blog.slug}`}
            target="_blank"
            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-blue-700 flex items-center gap-1.5"
          >
            <Eye size={14} /> Public View
          </Link>
          <button
            onClick={() => onEdit?.(blog)}
            className="px-3 py-2 bg-amber-500 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-amber-600"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => onDelete?.(blog)}
            className="px-3 py-2 bg-red-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-red-700"
          >
            🗑️ Delete
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-800 text-white rounded-lg text-sm font-semibold hover:bg-gray-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogViewModal;