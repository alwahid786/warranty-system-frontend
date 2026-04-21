import React from "react";
import Dropdown from "../../shared/small/Dropdown";
import Button from "../../shared/small/Button";
import { LuSearch } from "react-icons/lu";
import { MdFilterAltOff } from "react-icons/md";

const searchTypes = [
  { key: "roNumber", label: "RO Number" },
  { key: "roSuffix", label: "RO Suffix" },
  { key: "quoted", label: "Quoted" },
];

const orderStatuses = [
  { id: 0, name: "All Status" },
  { id: 1, name: "PC" },
  { id: 2, name: "PO" },
  { id: 3, name: "PQ" },
  { id: 4, name: "PR" },
  { id: 5, name: "PA" },
  { id: 6, name: "CR" },
];

// same defaults as in Actions.jsx
const defaultFilters = {
  searchType: "roNumber",
  searchValue: "",
  fromDate: "",
  toDate: "",
  entryFromDate: "",
  entryToDate: "",
  status: "",
};

export default function ClaimsFilterBar({ filters = {}, onFilterChange }) {
  const handleReset = () => {
    onFilterChange(defaultFilters);
  };

  return (
    <div className="w-full rounded-md mt-4 flex flex-col gap-4">
      {/* Search and Status Row */}
      <div className="flex flex-wrap gap-4 items-end bg-gray-50/50 p-4 rounded-lg border border-gray-100">
        {/* Advanced Search */}
        <div className="flex-1 min-w-[280px] max-w-full lg:max-w-[45%]">
          <label className="text-xs font-semibold text-secondary mb-1 block uppercase tracking-wider">
            Advanced Search
          </label>
          <div className="relative w-full">
            <input
              type="text"
              className="bg-white border border-gray-200 shadow-sm rounded px-3 py-2.5 text-sm w-full pr-10 md:pr-40"
              placeholder={`Search by ${filters.searchType}`}
              value={filters.searchValue}
              onChange={(e) => onFilterChange({ searchValue: e.target.value })}
            />

            {/* Desktop buttons */}
            <div className="hidden md:flex absolute right-1.5 top-1/2 -translate-y-1/2 gap-1">
              {searchTypes.map((type) => (
                <button
                  key={type.key}
                  type="button"
                  className={`px-2.5 py-1.5 rounded text-[10px] font-bold border transition-colors ${
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

            {/* Mobile icon placeholder (optional) */}
          </div>

          {/* Mobile dropdown for search type */}
          <div className="mt-2 md:hidden">
            <Dropdown
              title="Search By"
              options={searchTypes.map((s) => ({ id: s.key, name: s.label }))}
              defaultValue={{
                id: filters.searchType,
                name:
                  searchTypes.find((s) => s.key === filters.searchType)
                    ?.label || "Select",
              }}
              onChange={(val) => onFilterChange({ searchType: val?.id })}
              width="w-full"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-4 flex-1">
          {/* Status Dropdown */}
          <div className="w-full sm:w-52 lg:w-60">
            <label className="text-xs font-semibold text-secondary mb-1 block uppercase tracking-wider">
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
                onFilterChange({ status: val?.id === 0 ? "" : (val?.name || "") });
              }}
              width="w-full"
            />
          </div>

          {/* RO Date Range */}
          <div className="flex flex-wrap sm:flex-nowrap gap-2 flex-1 min-w-[280px]">
            <div className="flex-1">
              <label className="text-xs font-semibold text-secondary mb-1 block uppercase tracking-wider text-nowrap">
                From RO Date
              </label>
              <input
                type="date"
                className="bg-white border border-gray-200 shadow-sm rounded px-3 py-2.5 text-sm w-full"
                value={filters.fromDate}
                onChange={(e) => onFilterChange({ fromDate: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-secondary mb-1 block uppercase tracking-wider text-nowrap">
                To RO Date
              </label>
              <input
                type="date"
                className="bg-white border border-gray-200 shadow-sm rounded px-3 py-2.5 text-sm w-full"
                value={filters.toDate}
                onChange={(e) => onFilterChange({ toDate: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4 bg-gray-50/50 p-4 rounded-lg border border-gray-100">
        <div className="flex flex-wrap sm:flex-nowrap gap-4 flex-1 min-w-[280px]">
          <div className="flex-1">
            <label className="text-xs font-semibold text-secondary mb-1 block uppercase tracking-wider text-nowrap">
              From Entry Date
            </label>
            <input
              type="date"
              className="bg-white border border-gray-200 shadow-sm rounded px-3 py-2.5 text-sm w-full"
              value={filters.entryFromDate || ""}
              onChange={(e) => onFilterChange({ entryFromDate: e.target.value })}
            />
          </div>
          <div className="flex-1">
            <label className="text-xs font-semibold text-secondary mb-1 block uppercase tracking-wider text-nowrap">
              To Entry Date
            </label>
            <input
              type="date"
              className="bg-white border border-gray-200 shadow-sm rounded px-3 py-2.5 text-sm w-full"
              value={filters.entryToDate || ""}
              onChange={(e) => onFilterChange({ entryToDate: e.target.value })}
            />
          </div>
        </div>

        <div className="w-full sm:w-auto">
          <Button
            text="Reset"
            bg="bg-gray-600"
            color="text-white"
            icon={<MdFilterAltOff className="text-sm" />}
            cn={"text-sm !py-2.5 w-full sm:w-auto px-6"}
            onClick={handleReset}
          />
        </div>
      </div>
    </div>
  );
}
