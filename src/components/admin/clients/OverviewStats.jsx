const StatusOverviewCard = (clientCount) => {
  const data = [
    {
      label: "Active",
      count: clientCount?.clientCount?.activeClients,
      color: "text-green-500",
      dotColor: "bg-green-500",
    },
    {
      label: "Inactive",
      count: clientCount?.clientCount?.inactiveClients,
      color: "text-red-500",
      dotColor: "bg-red-500",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-5">
      <h4 className="text-sm text-gray-500 font-medium mb-4">Overview</h4>
      <div className="flex justify-between items-cente ">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col justify-between flex-1">
            {/* Vertical bar */}
            <div className={`w-0.5 h-4 ${item.color} mb-1`} />
            <p className="text-2xl font-semibold text-black">{item.count}</p>

            {/* Label + dot */}
            <div className="flex items-center  gap-1 mt-1">
              <span className={`w-2 h-2 rounded-full ${item.dotColor}`} />
              <span className={`text-sm  ${item.color}`}>{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusOverviewCard;
