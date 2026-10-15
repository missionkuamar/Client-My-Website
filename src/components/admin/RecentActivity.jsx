const RecentActivity = ({ activities = [] }) => {
  if (activities.length === 0) {
    return (
      <div className="p-6 text-center text-gray-400 text-sm">
        <p className="text-3xl mb-2">🔕</p>
        <p>No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {activities.map((activity, idx) => (
        <div
          key={idx}
          className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-lg flex-shrink-0">
            {activity.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 leading-tight">
              {activity.title}
            </p>
            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2"></span>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;