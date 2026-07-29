// components/Pagination.jsx
import React from "react";

export default function Pagination({ current, total, onPageChange }) {
  return (
    <div className="flex flex-wrap justify-center sm:justify-end items-center mt-4 text-sm gap-3 pb-4">
      <button
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
        className="text-gray-600 disabled:opacity-50 cursor-pointer"
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
                ? "bg-primary text-white px-3 py-1 rounded cursor-pointer"
                : "px-3 py-1 cursor-pointer"
            }
          >
            {i + 1}
          </button>
        ))}
      </div>
      <button
        onClick={() => onPageChange(current + 1)}
        disabled={current === total}
        className="text-gray-600 disabled:opacity-50 cursor-pointer"
      >
        Next &gt;
      </button>
    </div>
  );
}
