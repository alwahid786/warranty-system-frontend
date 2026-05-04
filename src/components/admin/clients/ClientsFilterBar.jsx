import { MdFilterAltOff } from "react-icons/md";

import Button from "../../shared/small/Button";

const searchTypes = [
  { key: "dealerId", label: "Dealer-ID" },
  { key: "name", label: "NAME" },
  { key: "email", label: "EMAIL" },
  { key: "phone", label: "PHONE" }
];

const searchTypes2 = [
  { key: "companyName", label: "Company" },
  { key: "accountOwner", label: "Account Owner" },
  { key: "businessOwner", label: "Business Owner" }
];

export default function ClientsFilterBar({
  filters = {},
  onFilterChange,
  onReset
}) {
  return (
    <div className="w-full mt-4 flex flex-col gap-4">
      {/* Row 1: Search Groups */}
      <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-100">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* First Search Group (Core Info) */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">
              Search (Core Info)
            </label>
            <div className="relative group">
              <input
                type="text"
                className="bg-white border border-gray-200 shadow-sm rounded px-3 py-2.5 text-sm w-full lg:pr-56 transition-all focus:border-primary focus:ring-1 focus:ring-primary/20"
                placeholder={`Search by ${searchTypes.find((t) => t.key === filters.searchType)?.label}`}
                value={filters.searchValue}
                onChange={(e) =>
                  onFilterChange({ searchValue: e.target.value })
                }
              />
              {/* Desktop Buttons */}
              <div className="hidden lg:flex absolute right-1.5 top-1/2 -translate-y-1/2 gap-1 bg-white pl-2">
                {searchTypes.map((type) => (
                  <button
                    key={type.key}
                    type="button"
                    className={`px-2 py-1.5 rounded text-[10px] font-bold border transition-all ${
                      filters.searchType === type.key
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                    }`}
                    onClick={() => onFilterChange({ searchType: type.key })}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Tablet/Mobile Search Type Toggle */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:hidden gap-2 mt-2">
              {searchTypes.map((type) => (
                <button
                  key={type.key}
                  type="button"
                  className={`py-2 rounded text-[10px] font-bold border transition-all ${
                    filters.searchType === type.key
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => onFilterChange({ searchType: type.key })}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Second Search Group (Owner/Company) */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">
              Search (Owner/Company)
            </label>
            <div className="relative group">
              <input
                type="text"
                className="bg-white border border-gray-200 shadow-sm rounded px-3 py-2.5 text-sm w-full lg:pr-72 transition-all focus:border-primary focus:ring-1 focus:ring-primary/20"
                placeholder={`Search by ${searchTypes2.find((t) => t.key === filters.searchType2)?.label}`}
                value={filters.searchValue2}
                onChange={(e) =>
                  onFilterChange({ searchValue2: e.target.value })
                }
              />
              {/* Desktop Buttons */}
              <div className="hidden lg:flex absolute right-1.5 top-1/2 -translate-y-1/2 gap-1 bg-white pl-2">
                {searchTypes2.map((type) => (
                  <button
                    key={type.key}
                    type="button"
                    className={`px-2 py-1.5 rounded text-[10px] font-bold border transition-all ${
                      filters.searchType2 === type.key
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                    }`}
                    onClick={() => onFilterChange({ searchType2: type.key })}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Tablet/Mobile Search Type Toggle */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:hidden gap-2 mt-2">
              {searchTypes2.map((type) => (
                <button
                  key={type.key}
                  type="button"
                  className={`py-2 rounded text-[10px] font-bold border transition-all ${
                    filters.searchType2 === type.key
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => onFilterChange({ searchType2: type.key })}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Date Range + Reset */}
      <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          <div className="lg:col-span-10 grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                From Date
              </label>
              <input
                type="date"
                className="bg-white border border-gray-200 shadow-sm rounded px-3 py-2.5 text-sm w-full focus:border-primary focus:ring-1 focus:ring-primary/20"
                value={filters.fromDate}
                onChange={(e) => onFilterChange({ fromDate: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                To Date
              </label>
              <input
                type="date"
                className="bg-white border border-gray-200 shadow-sm rounded px-3 py-2.5 text-sm w-full focus:border-primary focus:ring-1 focus:ring-primary/20"
                value={filters.toDate}
                onChange={(e) => onFilterChange({ toDate: e.target.value })}
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <Button
              text="Reset"
              bg="bg-gray-600"
              color="text-white"
              icon={<MdFilterAltOff className="text-sm" />}
              cn="!text-sm !py-2.5 w-full px-6 hover:bg-gray-700 transition-colors shadow-sm"
              onClick={onReset}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
