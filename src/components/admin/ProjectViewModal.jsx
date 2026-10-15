import { useEffect, useState, useCallback } from "react";
import {
  X,
  ExternalLink,
  Download,
  Eye,
  GitBranchPlus,
  Copy,
  Check,
  Share2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Calendar,
  Tag,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  FileText,
  Link as LinkIcon,
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import toast from "react-hot-toast";

/* ============ Image Lightbox ============ */
const Lightbox = ({ images, startIndex, onClose }) => {
  const [current, setCurrent] = useState(startIndex);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + images.length) % images.length);
  }, [images.length]);

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
  }, [onClose, next, prev]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex items-center justify-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition z-10"
      >
        <X size={20} />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 text-white px-4 py-2 rounded-full text-sm">
        {current + 1} / {images.length}
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={prev}
          className="absolute left-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition z-10"
          aria-label="Previous"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Image */}
      <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center p-4">
        <img
          src={images[current].url}
          alt={`Image ${current + 1}`}
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
        />
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={next}
          className="absolute right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition z-10"
          aria-label="Next"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Thumbnails strip (bottom) */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto p-2 bg-white/10 rounded-xl backdrop-blur">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${
                i === current
                  ? "border-white"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img.url}
                alt={`Thumb ${i}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ============ Copy Button ============ */
const CopyButton = ({ text, label = "Copy" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition"
      title={label}
    >
      {copied ? (
        <Check size={14} className="text-green-600" />
      ) : (
        <Copy size={14} />
      )}
    </button>
  );
};

/* ============ Main Modal ============ */
const ProjectViewModal = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && lightboxIndex === null) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose, lightboxIndex]);

  if (!project) return null;

  /* ---------- Share handler ---------- */
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.description?.substring(0, 100),
          url: window.location.origin + `/projects/${project._id}`,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(
          window.location.origin + `/projects/${project._id}`
        );
        toast.success("Link copied!");
      } catch {
        toast.error("Share failed");
      }
    }
  };

  /* ---------- All images for lightbox ---------- */
  const allImages = [
    ...(project.thumbnail
      ? [{ url: project.thumbnail, isThumbnail: true }]
      : []),
    ...(project.gallery || []),
  ];

  /* ---------- Tabs config ---------- */
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: FileText,
      count: null,
    },
    {
      id: "gallery",
      label: "Gallery",
      icon: ImageIcon,
      count: allImages.length,
    },
    {
      id: "links",
      label: "Links",
      icon: LinkIcon,
      count: [
        project.liveLink,
        project.videoLink,
        project.githubLink,
      ].filter(Boolean).length,
    },
  ];

  return (
    <>
      <div
        className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-2 sm:p-4"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
          {/* ==================== HEADER ==================== */}
          <div className="flex items-start justify-between p-4 sm:p-5 border-b border-gray-100 gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-base sm:text-lg font-bold text-gray-800 truncate">
                  {project.title}
                </h2>
                {project.isActive ? (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    <CheckCircle2 size={10} /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                    <XCircle size={10} /> Inactive
                  </span>
                )}
                {project.isFeatured && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                    ⭐ Featured
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(project.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                {project.category && (
                  <span className="flex items-center gap-1 capitalize">
                    <Tag size={12} /> {project.category}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={handleShare}
                className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition"
                title="Share"
              >
                <Share2 size={16} />
              </button>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* ==================== TABS ==================== */}
          <div className="flex border-b border-gray-100 px-4 sm:px-5 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                    active
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                  {tab.count !== null && tab.count > 0 && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        active
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ==================== BODY ==================== */}
          <div className="flex-1 overflow-y-auto">
            {/* ---------- OVERVIEW TAB ---------- */}
            {activeTab === "overview" && (
              <div className="p-4 sm:p-5 space-y-5">
                {/* Thumbnail / main image */}
                {project.thumbnail ? (
                  <div
                    onClick={() => setLightboxIndex(0)}
                    className="relative group cursor-pointer rounded-xl overflow-hidden border border-gray-200"
                  >
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-56 sm:h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition bg-white/90 text-gray-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                        <Maximize2 size={14} /> Click to enlarge
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-56 sm:h-64 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-6xl">
                    📦
                  </div>
                )}

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
                    <p className="text-[10px] sm:text-xs text-yellow-700 uppercase tracking-wider font-semibold">
                      Price
                    </p>
                    <p className="text-base sm:text-lg font-bold text-yellow-700 mt-1 flex items-center justify-center gap-1">
                      <Star size={14} className="fill-yellow-500 text-yellow-500" />
                      {project.price}
                    </p>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-center">
                    <p className="text-[10px] sm:text-xs text-indigo-700 uppercase tracking-wider font-semibold">
                      Downloads
                    </p>
                    <p className="text-base sm:text-lg font-bold text-indigo-700 mt-1 flex items-center justify-center gap-1">
                      <Download size={14} />
                      {project.downloads || 0}
                    </p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-center">
                    <p className="text-[10px] sm:text-xs text-purple-700 uppercase tracking-wider font-semibold">
                      Views
                    </p>
                    <p className="text-base sm:text-lg font-bold text-purple-700 mt-1 flex items-center justify-center gap-1">
                      <Eye size={14} />
                      {project.views || 0}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {project.description && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                      📝 Description
                    </h3>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
                      {project.description}
                    </p>
                  </div>
                )}

                {/* Tech Stack */}
                {project.techStack?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                      ⚙️ Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.map((t, i) => (
                        <span
                          key={i}
                          className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-lg font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {project.tags?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                      🏷️ Tags
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((t, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ---------- GALLERY TAB ---------- */}
            {activeTab === "gallery" && (
              <div className="p-4 sm:p-5">
                {allImages.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <ImageIcon size={40} className="mx-auto mb-3" />
                    <p className="text-sm">No images uploaded</p>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-gray-500 mb-3">
                      {allImages.length} image
                      {allImages.length !== 1 ? "s" : ""} · Click to enlarge
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                      {allImages.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setLightboxIndex(i)}
                          className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 hover:border-indigo-400 transition"
                        >
                          <img
                            src={img.url}
                            alt={`Image ${i + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
                            <Maximize2
                              size={20}
                              className="text-white opacity-0 group-hover:opacity-100 transition"
                            />
                          </div>
                          {img.isThumbnail && (
                            <span className="absolute top-2 left-2 bg-yellow-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                              COVER
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ---------- LINKS TAB ---------- */}
            {activeTab === "links" && (
              <div className="p-4 sm:p-5 space-y-3">
                {!project.liveLink &&
                  !project.videoLink &&
                  !project.githubLink && (
                    <div className="text-center py-12 text-gray-400">
                      <LinkIcon size={40} className="mx-auto mb-3" />
                      <p className="text-sm">No links added</p>
                    </div>
                  )}

                {project.liveLink && (
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                      <ExternalLink size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">
                        Live Demo
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {project.liveLink}
                      </p>
                    </div>
                    <CopyButton text={project.liveLink} />
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition flex-shrink-0"
                    >
                      Open
                    </a>
                  </div>
                )}

                {project.videoLink && (
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50/40 transition">
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                      <FaYoutube size={18} className="text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">
                        Video Demo
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {project.videoLink}
                      </p>
                    </div>
                    <CopyButton text={project.videoLink} />
                    <a
                      href={project.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition flex-shrink-0"
                    >
                      Watch
                    </a>
                  </div>
                )}

                {project.githubLink && (
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <GitBranchPlus size={18} className="text-gray-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">
                        GitHub Repository
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {project.githubLink}
                      </p>
                    </div>
                    <CopyButton text={project.githubLink} />
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-gray-800 text-white rounded-lg text-xs font-semibold hover:bg-gray-900 transition flex-shrink-0"
                    >
                      View
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ==================== FOOTER ==================== */}
          <div className="border-t border-gray-100 p-3 sm:p-4 flex justify-between items-center gap-3 bg-gray-50">
            <p className="text-xs text-gray-500 hidden sm:block">
              Project ID: {project._id?.substring(0, 12)}...
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-gray-800 text-white rounded-lg text-sm font-semibold hover:bg-gray-900 transition ml-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* ==================== LIGHTBOX ==================== */}
      {lightboxIndex !== null && (
        <Lightbox
          images={allImages}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
};

export default ProjectViewModal;