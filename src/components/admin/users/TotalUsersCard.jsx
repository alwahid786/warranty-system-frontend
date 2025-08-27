import { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { ChevronDown } from 'lucide-react';
import { BsArrowUpRightCircle } from 'react-icons/bs';

// Dropdown options
const FILTER_OPTIONS = ['Today', 'This Week', 'This Month'];

// Mock data for each filter
const DATA_MAP = {
  Today: {
    value: 25,
    growth: 1.2,
    chart: [
      { name: 'A', value: 5 },
      { name: 'B', value: 15 },
      { name: 'C', value: 5 },
    ],
  },
  'This Week': {
    value: 60,
    growth: 1.8,
    chart: [
      { name: 'A', value: 10 },
      { name: 'B', value: 20 },
      { name: 'C', value: 30 },
    ],
  },
  'This Month': {
    value: 100,
    growth: 2.7,
    chart: [
      { name: 'A', value: 30 },
      { name: 'B', value: 100 },
      { name: 'C', value: 60 },
    ],
  },
};

const TotalUsersCard = () => {
  const [selectedFilter, setSelectedFilter] = useState('This Month');
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const currentData = DATA_MAP[selectedFilter];

  return (
    <div className="bg-white rounded-lg shadow-sm py-[14px] px-6 flex items-center justify-between relative ">
      {/* Left content */}
      <div className="">
        <h4 className="text-[16px] text-dark-text font-inter font-normal mt-5">Total Users</h4>
        <p className="text-5xl font-semibold text-dark-text mt-2">{currentData.value}</p>

        <div className="flex items-center mt-5 gap-2">
          <BsArrowUpRightCircle />
          <span className="text-sm text-green-500 font-medium">{currentData.growth}%</span>
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
                  const colors = ['#1292DB1A', '#073C5B', '#1292DB1A'];
                  return <Cell key={`cell-${index}`} fill={colors[index] || '#075985'} />;
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
