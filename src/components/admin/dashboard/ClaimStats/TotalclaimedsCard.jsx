import React, { useState, useMemo } from "react";
import Dropdown from "../../../shared/small/Dropdown";

const ITEMS_PER_PAGE = 6;

const TotalClaimsCard = ({ data }) => {
  const [page, setPage] = useState(1);

  const tableData = useMemo(() => {
    if (!data) return [];

    const metrics = [
      {
        metric: "Pending Correction Claims",
        value: data.pendingCorrection ?? 0,
      },
      {
        metric: "Pending Order Claims",
        value: data.pendingOrder ?? 0,
      },
      {
        metric: "Pending Question Claims",
        value: data.pendingQuestion ?? 0,
      },
      {
        metric: "Pending Review Claims",
        value: data.pendingReview ?? 0,
      },
      {
        metric: "Pending Analysis Claims",
        value: data.pendingAnalysis ?? 0,
      },
      {
        metric: "Credit Ready Claims",
        value: data.creditReady ?? 0,
      },
    ];

    // flatten claimsByBrand
    const brandMetrics = data.claimsByBrand
      ? Object.entries(data.claimsByBrand).map(([brand, value]) => ({
          metric: `${brand} Claims`,
          value,
        }))
      : [];

    return [...metrics, ...brandMetrics];
  }, [data]);

  const totalPages = Math.ceil(tableData.length / ITEMS_PER_PAGE);
  const currentTotal = tableData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const start = (page - 1) * ITEMS_PER_PAGE + 1;
  const end = Math.min(page * ITEMS_PER_PAGE, tableData.length);

  return (
    <div className="bg-white rounded-xl border shadow flex-1">
      <div className="flex items-center justify-between mb-4 px-4 mt-4">
        <h2 className="font-medium text-[14px] leading-5 text-primary">
          Total Claims By Statuses
        </h2>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-[#F9FAFB] border w-full">
          <tr className="text-gray-500">
            <th className="text-left py-2 px-2 font-semibold text-secondary text-[10px] leading-[18px] ">
              METRIC
            </th>
            <th className="text-right py-2 px-2 font-semibold text-secondary text-[10px] leading-[18px]">
              VALUE
            </th>
          </tr>
        </thead>
        <tbody>
          {currentTotal.map((item, idx) => (
            <tr key={idx} className="border-b last:border-none">
              <td className="py-2 px-5 font-semibold text-primary text-[10px] leading-[18px]">
                {item.metric}
              </td>
              <td className="py-2 px-5 text-right font-semibold text-primary text-[10px] leading-[18px]">
                {item.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TotalClaimsCard;
