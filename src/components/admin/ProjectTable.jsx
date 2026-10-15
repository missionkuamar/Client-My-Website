import { Eye, Pencil, Trash2 } from "lucide-react";

const ProjectTable = ({ projects = [], onView, onEdit, onDelete }) => {
  if (projects.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400 text-sm">
        <p className="text-4xl mb-2">📦</p>
        <p>No projects</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Project
            </th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Downloads
            </th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Size
            </th>
            <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {projects.map((p) => (
            <tr key={p._id} className="hover:bg-gray-50 transition">
              <td className="px-4 sm:px-6 py-4">
                <div className="flex items-center gap-3">
                  {p.thumbnail ? (
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg flex-shrink-0">
                      📦
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
                      {p.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">
                      {p.description?.substring(0, 40)}...
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 sm:px-6 py-4">
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-full">
                  ⭐ {p.price}
                </span>
              </td>
              <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">
                {p.downloads || 0}
              </td>
              <td className="px-4 sm:px-6 py-4 text-xs text-gray-500">
                {p.fileSize ? `${(p.fileSize / 1024 / 1024).toFixed(2)} MB` : "—"}
              </td>
              <td className="px-4 sm:px-6 py-4">
                <div className="flex justify-end gap-1.5">
                  {/* View */}
                  <button
                    onClick={() => onView?.(p)}
                    title="View"
                    className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white flex items-center justify-center transition"
                  >
                    <Eye size={15} />
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => onEdit?.(p)}
                    title="Edit"
                    className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white flex items-center justify-center transition"
                  >
                    <Pencil size={15} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => onDelete?.(p)}
                    title="Delete"
                    className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white flex items-center justify-center transition"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;