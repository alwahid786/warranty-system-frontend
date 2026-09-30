import { useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const AttendanceChart = ({ data }) => {
  const [disabledSeries, setDisabledSeries] = useState({
    Active: false,
    Inactive: false
  });

  const toggleSeries = (key) => {
    setDisabledSeries((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
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
            hide={disabledSeries.Active}
            onClick={() => toggleSeries("Active")}
            style={{ cursor: "pointer" }}
          />
          <Line
            type="monotone"
            dataKey="Inactive"
            stroke="#EF4444"
            strokeWidth={2}
            hide={disabledSeries.Inactive}
            onClick={() => toggleSeries("Inactive")}
            style={{ cursor: "pointer" }}
          />
        </LineChart>
      </ResponsiveContainer>
      {/* Interactive Legend */}
      <div className="flex gap-6 mt-2">
        <button
          type="button"
          onClick={() => toggleSeries("Active")}
          className={`flex items-center space-x-2 cursor-pointer select-none transition-opacity ${
            disabledSeries.Active ? "opacity-40 line-through" : "opacity-100"
          }`}
        >
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="text-sm text-dark-text">Active</span>
        </button>
        <button
          type="button"
          onClick={() => toggleSeries("Inactive")}
          className={`flex items-center space-x-2 cursor-pointer select-none transition-opacity ${
            disabledSeries.Inactive ? "opacity-40 line-through" : "opacity-100"
          }`}
        >
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="text-sm text-dark-text">Inactive</span>
        </button>
      </div>
    </div>
  );
};

export default AttendanceChart;
