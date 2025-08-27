import { useState } from "react";

const ITEMS_PER_PAGE = 5;

const ClaimsByBrandCard = ({ brands = [] }) => {
  const [page, setPage] = useState(1);

  // If brands is empty, no crash
  const totalPages = Math.ceil(brands.length / ITEMS_PER_PAGE) || 1;
  const currentBrands = brands.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const start = (page - 1) * ITEMS_PER_PAGE + 1;
  const end = Math.min(start + currentBrands.length - 1, brands.length);

  return (
    <div className="bg-white rounded-xl border shadow flex-1 pb-6">
      <h2 className="font-medium text-[14px] leading-5 text-primary mb-4 px-4 mt-4">
        Claims by Car Brand
      </h2>

      {brands.length === 0 ? (
        <p className="text-center text-gray-500 text-sm py-6">
          No data available
        </p>
      ) : (
        <>
          <table className="w-full text-sm">
            <thead className="bg-[#F9FAFB] border">
              <tr className="text-gray-500">
                <th className="text-left py-2 px-2 font-semibold text-[10px] leading-5 text-secondary ">
                  CAR BRAND
                </th>
                <th className="text-right py-2 px-2 font-semibold text-[10px] leading-5 text-secondary ">
                  TOTAL CLAIMS
                </th>
              </tr>
            </thead>
            <tbody>
              {currentBrands.map((brand, idx) => (
                <tr key={idx} className="border-b last:border-none">
                  <td className="py-2 px-5 font-medium text-[10px] leading-5 text-primary ">
                    {brand.name}
                  </td>
                  <td className="py-2 px-5 text-right font-medium text-[10px] leading-5 text-primary">
                    {brand.count}
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
              <p className="text-sm text-gray-600">
                {start}–{end} of {brands.length}
              </p>
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
        </>
      )}
    </div>
  );
};

export default ClaimsByBrandCard;
