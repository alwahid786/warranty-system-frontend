import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#0C6189", "#073C5B", "#60A5FA", "#38BDF8", "#BAE6FD"];

const TopClaimBrandsChart = ({ data = [] }) => {
  return (
    <div className="bg-white border rounded-xl shadow p-4 flex-1">
      <h2 className="font-semibold mb-4">Top Claim Brands</h2>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="name"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopClaimBrandsChart;
