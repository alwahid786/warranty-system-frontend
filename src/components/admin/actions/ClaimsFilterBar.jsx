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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end ">
        {/* Search input and toggle */}
        <div className="flex flex-col gap-1 md:col-span-6">
          <label className="text-xs font-medium text-secondary">
            ADVANCED SEARCH
          </label>
          <div className="relative w-full">
            <input
              type="text"
              className="bg-white shadow-sm rounded px-3 py-2.5 text-sm w-full pr-36"
              placeholder={`Search by ${filters.searchType}`}
              value={filters.searchValue}
              onChange={(e) => onFilterChange({ searchValue: e.target.value })}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              {searchTypes.map((type) => (
                <button
                  key={type.key}
                  type="button"
                  className={`px-2 py-1.5 rounded text-xs font-medium border ${
                    filters.searchType === type.key
                      ? "bg-primary text-white"
                      : "bg-[#04365530] text-gray-500"
                  }`}
                  onClick={() => onFilterChange({ searchType: type.key })}
                  style={{ minWidth: 40 }}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* From RO date */}
        <div className="flex flex-col gap-1 md:col-span-3">
          <label className="text-xs font-medium text-secondary">
            FROM RO Date
          </label>
          <input
            type="date"
            className="bg-white shadow-sm rounded px-3 py-2.5 text-sm"
            value={filters.fromDate}
            onChange={(e) => onFilterChange({ fromDate: e.target.value })}
          />
        </div>

        {/* To RO date */}
        <div className="flex flex-col gap-1 md:col-span-3">
          <label className="text-xs font-medium text-secondary ">
            TO RO Date
          </label>
          <input
            type="date"
            className="bg-white shadow-sm rounded px-3 py-2.5 text-sm"
            value={filters.toDate}
            onChange={(e) => onFilterChange({ toDate: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
        {/* From Entry date */}
        <div className="flex flex-col gap-1 md:col-span-3">
          <label className="text-xs font-medium text-secondary">
            FROM Entry Date
          </label>
          <input
            type="date"
            className="bg-white shadow-sm rounded px-3 py-2.5 text-sm"
            value={filters.entryFromDate || ""}
            onChange={(e) => onFilterChange({ entryFromDate: e.target.value })}
          />
        </div>

        {/* To Entry date */}
        <div className="flex flex-col gap-1 md:col-span-3">
          <label className="text-xs font-medium text-secondary ">
            TO Entry Date
          </label>
          <input
            type="date"
            className="bg-white shadow-sm rounded px-3 py-2.5 text-sm"
            value={filters.entryToDate || ""}
            onChange={(e) => onFilterChange({ entryToDate: e.target.value })}
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex flex-col gap-1 md:col-span-3">
          <label className="text-xs font-medium text-secondary ">
            Order Statuses
          </label>
          <Dropdown
            title=""
            options={orderStatuses}
            defaultValue={orderStatuses.find(
              (opt) => opt.name.toLowerCase() === filters.status?.toLowerCase()
            )}
            onChange={(val) => onFilterChange({ status: val?.name || "" })}
            width="w-full"
          />
        </div>

        {/* Buttons */}
        <div className="col-span-12 md:col-span-3 gap-1 mt-5">
          <div className="grid grid-cols-2 gap-2 col-span-12 md:col-span-4">
            <Button
              text="Reset Filter"
              bg="bg-[#043655C4] "
              color="text-white"
              icon={<MdFilterAltOff className="text-sm" />}
              cn={"text-sm !py-2.5"}
              onClick={handleReset}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
