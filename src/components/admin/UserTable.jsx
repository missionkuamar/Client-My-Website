import { useDispatch, useSelector } from "react-redux";
import { Eye, Trash2 } from "lucide-react";
import { updateUserRole } from "../../features/user/userSlice";

const UserTable = ({
  users = [],
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
  onView,
  onDelete,
}) => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((s) => s.auth);

  const handleRoleChange = (userId, newRole) => {
    dispatch(updateUserRole({ userId, role: newRole }));
  };

  if (users.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400 text-sm">
        <p className="text-4xl mb-2">👥</p>
        <p>No users</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-green-100 text-green-700",
      blocked: "bg-amber-100 text-amber-700",
      banned: "bg-red-100 text-red-700",
      suspended: "bg-orange-100 text-orange-700",
    };
    return styles[status] || styles.active;
  };

  const allSelected = users.length > 0 && selectedIds.length === users.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="px-3 sm:px-4 py-3 text-left w-10">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onChange={onToggleSelectAll}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
            </th>
            <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Stars
            </th>
            <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-3 sm:px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((u) => {
            const isSelf = u._id === currentUser?._id;
            const selected = selectedIds.includes(u._id);

            return (
              <tr
                key={u._id}
                className={`transition ${selected ? "bg-indigo-50/60" : "hover:bg-gray-50"}`}
              >
                <td className="px-3 sm:px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggleSelect?.(u._id)}
                    disabled={isSelf}
                    className="w-4 h-4 accent-indigo-600 cursor-pointer disabled:opacity-40"
                  />
                </td>

                <td className="px-3 sm:px-4 py-4">
                  <button
                    onClick={() => onView?.(u)}
                    className="flex items-center gap-3 text-left hover:opacity-80 transition group"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {u.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate group-hover:text-indigo-600 transition">
                        {u.name}
                        {isSelf && (
                          <span className="ml-2 text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                            YOU
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {u.email}
                      </p>
                    </div>
                  </button>
                </td>

                <td className="px-3 sm:px-4 py-4">
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-full">
                    ⭐ {u.stars ?? 0}
                  </span>
                </td>

                <td className="px-3 sm:px-4 py-4">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    disabled={isSelf}
                    className="px-2 py-1 border border-gray-200 rounded-lg text-xs font-medium bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>

                <td className="px-3 sm:px-4 py-4">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${getStatusBadge(u.status || "active")}`}
                  >
                    {u.status || "active"}
                  </span>
                </td>

                <td className="px-3 sm:px-4 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => onView?.(u)}
                      title="View"
                      className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white flex items-center justify-center transition"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => onDelete?.(u)}
                      disabled={isSelf}
                      title="Delete"
                      className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;