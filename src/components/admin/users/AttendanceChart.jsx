import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AttendanceChart = ({ data }) => (
  <div className="bg-white p-3 rounded-md shadow">
    <h3 className="text-lg font-semibold mb-1 text-dark-text">
      Attendance Overview
    </h3>
    <ResponsiveContainer width="100%" height={270}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="Active"
          stroke="#10B981"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="OnLeave"
          stroke="#EF4444"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="Pending"
          stroke="#F59E0B"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
    {/* Custom Legend */}
    <div className="flex gap-6 mt-">
      <div className="flex items-center space-x-2">
        <span className="w-3 h-3 rounded-full bg-green-500"></span>
        <span className="text-sm text-dark-text">Active</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="w-3 h-3 rounded-full bg-red-500"></span>
        <span className="text-sm text-dark-text">On leave</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
        <span className="text-sm text-dark-text">Pending</span>
      </div>
    </div>
  </div>
);

export default AttendanceChart;
