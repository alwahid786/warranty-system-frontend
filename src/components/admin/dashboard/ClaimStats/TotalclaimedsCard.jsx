import React, { useState, useMemo } from "react";
import Dropdown from "../../../shared/small/Dropdown";

const ITEMS_PER_PAGE = 5;

const TotalClaimsCard = ({ data }) => {
  const [page, setPage] = useState(1);

  // ✅ Transform object into array of { metric, value }
  const tableData = useMemo(() => {
    if (!data) return [];

    const metrics = [
      { metric: "Approved Claims", value: data.approvedClaims ?? 0 },
      { metric: "Rejected Claims", value: data.rejectedClaims ?? 0 },
      { metric: "Appealed Claims", value: data.appealedClaims ?? 0 },
      { metric: "Pending Credit Claims", value: data.pendingCreditClaims ?? 0 },
      {
        metric: "Pending Correction Claims",
        value: data.pendingCorrectionClaims ?? 0,
      },
      {
        metric: "Pending Question Claims",
        value: data.pendingQuestionClaims ?? 0,
      },
      {
        metric: "Pending Analysis Claims",
        value: data.pendingAnalysisClaims ?? 0,
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
          Total Claims
        </h2>
        <Dropdown
          className="h-8 !px-2 !py-1 gap-2 !p-0"
          title=""
          options={[
            { id: 1, name: "Claims" },
            { id: 2, name: "Statuses" },
          ]}
          defaultValue={{ id: 1, name: "Claims" }}
          onChange={() => {}}
          width="text-center px-2"
        />
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

      {/* Pagination */}
      <div className="flex items-center justify-center">
        <div className="flex justify-end items-center mt-4 text-sm gap-3">
          {page > 1 && (
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="text-[#1C64F2] hover:text-[#143893] text-[12px] cursor-pointer disabled:opacity-50"
            >
              &lt; Previous
            </button>
          )}
          <div className="space-x-2">
            <p className="text-sm text-gray-600">
              {start}–{end} of {tableData.length}
            </p>
          </div>
          {page < totalPages && (
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="text-[#1C64F2] hover:text-[#143893] text-[12px] cursor-pointer disabled:opacity-50"
            >
              Next &gt;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TotalClaimsCard;
