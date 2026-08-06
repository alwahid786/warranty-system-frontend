// components/Pagination.jsx
import React from "react";

export default function Pagination({
  current,
  total,
  onPageChange,
  limit,
  onLimitChange,
  limitOptions = [10, 15, 25, 50, 100]
}) {
  return (
    <div className="flex flex-wrap justify-between sm:justify-end items-center mt-4 text-sm gap-4 pb-4">
      {onLimitChange && (
        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium mr-auto sm:mr-4">
          <span>Rows per page:</span>
          <select
            value={limit || 10}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 bg-white text-dark focus:outline-none cursor-pointer"
          >
            {limitOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={() => onPageChange(current - 1)}
          disabled={current === 1}
          className="text-gray-600 disabled:opacity-50 cursor-pointer hover:text-primary transition-colors"
        >
          &lt; Previous
        </button>
        <div className="flex flex-wrap justify-center items-center gap-1.5">
          {[...Array(total)].map((_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={
                i + 1 === current
                  ? "bg-primary text-white px-3 py-1 rounded cursor-pointer font-medium"
                  : "px-3 py-1 cursor-pointer hover:bg-gray-100 rounded transition-colors"
              }
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => onPageChange(current + 1)}
          disabled={current === total}
          className="text-gray-600 disabled:opacity-50 cursor-pointer hover:text-primary transition-colors"
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
}
