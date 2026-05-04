import { MdFilterAltOff } from "react-icons/md";

import Dropdown from "../../shared/small/Dropdown";
import Button from "../../shared/small/Button";

const searchTypes = [
  { key: "roNumber", label: "RO Number" },
  { key: "roSuffix", label: "RO Suffix" },
  { key: "quoted", label: "Quoted" }
];

const orderStatuses = [
  { id: 0, name: "All Status" },
  { id: 1, name: "PC" },
  { id: 2, name: "PO" },
  { id: 3, name: "PQ" },
  { id: 4, name: "PR" },
  { id: 5, name: "PA" },
  { id: 6, name: "CR" }
];

// same defaults as in Actions.jsx
const defaultFilters = {
  searchType: "roNumber",
  searchValue: "",
  fromDate: "",
  toDate: "",
  entryFromDate: "",
  entryToDate: "",
  status: ""
};

export default function ClaimsFilterBar({ filters = {}, onFilterChange }) {
  const handleReset = () => {
    onFilterChange(defaultFilters);
  };

  return (
    <div className="w-full mt-4 flex flex-col gap-4">
      {/* Search and Status Section */}
      <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          {/* Advanced Search */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-1">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">
              Advanced Search
            </label>
            <div className="relative group">
              <input
                type="text"
                className="bg-white border border-gray-200 shadow-sm rounded px-3 py-2.5 text-sm w-full lg:pr-44 transition-all focus:border-primary focus:ring-1 focus:ring-primary/20"
                placeholder={`Search by ${filters.searchType === "roNumber" ? "RO Number" : filters.searchType === "roSuffix" ? "RO Suffix" : "Quoted Amount"}`}
                value={filters.searchValue}
                onChange={(e) =>
                  onFilterChange({ searchValue: e.target.value })
                }
              />

              {/* Desktop Buttons - Hidden on MD and below */}
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
                    {type.label.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Tablet/Mobile Search Type Select */}
            <div className="flex lg:hidden gap-2 mt-2">
              {searchTypes.map((type) => (
                <button
                  key={type.key}
                  type="button"
                  className={`flex-1 py-2 rounded text-[10px] font-bold border transition-all ${
                    filters.searchType === type.key
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => onFilterChange({ searchType: type.key })}
                >
                  {type.label.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="lg:col-span-5 xl:col-span-4">
            <label className="text-[10px] font-bold text-secondary mb-1 block uppercase tracking-widest">
              Status
            </label>
            <Dropdown
              title=""
              options={orderStatuses}
              defaultValue={
                orderStatuses.find(
                  (opt) =>
                    opt.name.toLowerCase() === filters.status?.toLowerCase()
                ) || orderStatuses[0]
              }
              onChange={(val) => {
                onFilterChange({
                  status: val?.id === 0 ? "" : val?.name || ""
                });
              }}
              width="w-full"
            />
          </div>
        </div>
      </div>

      {/* Dates and Reset Section */}
      <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          {/* RO Date Range */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest truncate">
                From RO Date
              </label>
              <input
                type="date"
                className="bg-white border border-gray-200 shadow-sm rounded px-3 py-2.5 text-sm w-full focus:border-primary focus:ring-1 focus:ring-primary/20"
                value={filters.fromDate}
                onChange={(e) => onFilterChange({ fromDate: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest truncate">
                To RO Date
              </label>
              <input
                type="date"
                className="bg-white border border-gray-200 shadow-sm rounded px-3 py-2.5 text-sm w-full focus:border-primary focus:ring-1 focus:ring-primary/20"
                value={filters.toDate}
                onChange={(e) => onFilterChange({ toDate: e.target.value })}
              />
            </div>
          </div>

          {/* Entry Date Range */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest truncate">
                From Entry Date
              </label>
              <input
                type="date"
                className="bg-white border border-gray-200 shadow-sm rounded px-3 py-2.5 text-sm w-full focus:border-primary focus:ring-1 focus:ring-primary/20"
                value={filters.entryFromDate || ""}
                onChange={(e) =>
                  onFilterChange({ entryFromDate: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest truncate">
                To Entry Date
              </label>
              <input
                type="date"
                className="bg-white border border-gray-200 shadow-sm rounded px-3 py-2.5 text-sm w-full focus:border-primary focus:ring-1 focus:ring-primary/20"
                value={filters.entryToDate || ""}
                onChange={(e) =>
                  onFilterChange({ entryToDate: e.target.value })
                }
              />
            </div>
          </div>

          {/* Reset Button */}
          <div className="lg:col-span-2">
            <Button
              text="Reset"
              bg="bg-gray-600"
              color="text-white"
              icon={<MdFilterAltOff className="text-sm" />}
              cn={
                "text-sm !py-2.5 w-full px-6 hover:bg-gray-700 transition-colors shadow-sm"
              }
              onClick={handleReset}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
