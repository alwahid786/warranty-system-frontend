// components/Pagination.jsx
import React from "react";

export default function Pagination({ current, total, onPageChange }) {
  return (
    <div className="flex justify-end items-center mt-4 text-sm gap-3">
      <button
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
        className="text-gray-600 disabled:opacity-50"
      >
        &lt; Previous
      </button>
      <div className="space-x-2">
        {[...Array(total)].map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={
              i + 1 === current ? "bg-primary text-white px-3 py-1 rounded" : ""
            }
          >
            {i + 1}
          </button>
        ))}
      </div>
      <button
        onClick={() => onPageChange(current + 1)}
        disabled={current === total}
        className="text-gray-600 disabled:opacity-50"
      >
        Next &gt;
      </button>
    </div>
  );
}
