import { useState, useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { ChevronDown } from "lucide-react";
import { BsArrowUpRightCircle } from "react-icons/bs";

const FILTER_OPTIONS = ["Today", "This Week", "This Month"];

const TotalUsersCard = ({ stats }) => {
  // Default filter
  const [selectedFilter, setSelectedFilter] = useState("This Month");
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // Map API data to UI structure
  const DATA_MAP = useMemo(() => {
    if (!stats) return {};

    return {
      Today: {
        value: stats.today?.count || 0,
        growth: stats.today?.change || 0,
        chart: [
          { name: "Today", value: stats.today?.count || 0 },
          { name: "Yesterday", value: stats.today?.prev || 0 },
        ],
      },
      "This Week": {
        value: stats.thisWeek?.count || 0,
        growth: stats.thisWeek?.change || 0,
        chart: [
          { name: "This Week", value: stats.thisWeek?.count || 0 },
          { name: "Last Week", value: stats.thisWeek?.prev || 0 },
        ],
      },
      "This Month": {
        value: stats.thisMonth?.count || 0,
        growth: stats.thisMonth?.change || 0,
        chart: [
          { name: "This Month", value: stats.thisMonth?.count || 0 },
          { name: "Last Month", value: stats.thisMonth?.prev || 0 },
        ],
      },
    };
  }, [stats]);

  const currentData = DATA_MAP[selectedFilter] || {
    value: 0,
    growth: 0,
    chart: [],
  };

  return (
    <div className="bg-white rounded-lg shadow-sm py-[14px] px-6 flex items-center justify-between relative">
      {/* Left content */}
      <div>
        <h4 className="text-[16px] text-dark-text font-inter font-normal mt-5">
          Total Users
        </h4>
        <p className="text-5xl font-semibold text-dark-text mt-2">
          {currentData.value}
        </p>

        <div className="flex items-center mt-5 gap-2">
          <BsArrowUpRightCircle
            className={
              Number(currentData.growth) >= 0
                ? "text-green-500"
                : "text-red-500"
            }
          />
          <span
            className={`text-sm font-medium ${
              Number(currentData.growth) >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {currentData.growth}%
          </span>
          <span className="text-sm text-gray-400 ml-1">from last period</span>
        </div>
      </div>

      {/* Right content */}
      <div className="flex flex-col items-end">
        {/* Dropdown */}
        <div className="relative mt-2">
          <button
            type="button"
            className="border border-gray-300 text-sm px-3 py-1.5 rounded-md flex items-center gap-1 text-gray-600"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          >
            {selectedFilter}
            <ChevronDown className="w-4 h-4" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 bg-white border rounded shadow z-10 w-28">
              {FILTER_OPTIONS.map((option) => (
                <div
                  key={option}
                  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedFilter(option);
                    setDropdownOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="w-20 h-16 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentData.chart}>
              <Bar dataKey="value" radius={[2, 2, 0, 0]} barSize={14}>
                {currentData.chart.map((entry, index) => {
                  const colors = ["#1292DB1A", "#073C5B"];
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index] || "#075985"}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TotalUsersCard;
