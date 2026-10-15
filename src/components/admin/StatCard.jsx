const StatCard = ({ icon, label, value, color = "primary" }) => {
  const themes = {
    primary: {
      text: "text-blue-600",
      bg: "bg-blue-50",
      ring: "ring-blue-100",
      hover: "hover:border-blue-300",
    },
    purple: {
      text: "text-purple-600",
      bg: "bg-purple-50",
      ring: "ring-purple-100",
      hover: "hover:border-purple-300",
    },
    green: {
      text: "text-green-600",
      bg: "bg-green-50",
      ring: "ring-green-100",
      hover: "hover:border-green-300",
    },
    orange: {
      text: "text-orange-500",
      bg: "bg-orange-50",
      ring: "ring-orange-100",
      hover: "hover:border-orange-300",
    },
    red: {
      text: "text-red-600",
      bg: "bg-red-50",
      ring: "ring-red-100",
      hover: "hover:border-red-300",
    },
    yellow: {
      text: "text-yellow-600",
      bg: "bg-yellow-50",
      ring: "ring-yellow-100",
      hover: "hover:border-yellow-300",
    },
  };

  const t = themes[color] || themes.primary;

  return (
    <div
      className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ${t.hover}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {label}
          </p>
          <p className={`text-3xl font-bold mt-2 ${t.text}`}>{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-xl ${t.bg} flex items-center justify-center text-2xl ring-4 ${t.ring} flex-shrink-0`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;