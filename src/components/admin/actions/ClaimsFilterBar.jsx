import React from "react";
import Dropdown from "../../shared/small/Dropdown";
import Button from "../../shared/small/Button";
import { LuSearch } from "react-icons/lu";
import { MdFilterAltOff } from "react-icons/md";
import { createPortal } from "react-dom";

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

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="w-full rounded-md mt-4 flex flex-col gap-4">
      {/* ✅ SEARCH */}
      <div className="flex flex-wrap md:flex-nowrap gap-2 items-end">
        {/* Advanced Search */}
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-xs font-medium text-secondary">
            ADVANCED SEARCH
          </label>
          <div className="relative w-full">
            <input
              type="text"
              className="bg-white shadow-sm rounded px-3 py-2.5 text-sm w-full pr-36 md:pr-36"
              placeholder={`Search by ${filters.searchType}`}
              value={filters.searchValue}
              onChange={(e) => onFilterChange({ searchValue: e.target.value })}
            />

            {/* ✅ Desktop buttons */}
            <div className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 gap-1">
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

            {/* ✅ Mobile dropdown */}
            <div className="mt-2 md:hidden">
              <Dropdown
                title="Select Search Type"
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
        </div>

        {/* Status Dropdown */}
        <div className="flex flex-col gap-1 w-40">
          <label className="text-xs font-medium text-secondary">
            Order Statuses
          </label>
          <Dropdown
            title=""
            options={orderStatuses}
            defaultValue={orderStatuses.find(
              (opt) => opt.name.toLowerCase() === filters.status?.toLowerCase()
            )}
            onChange={(val) => {
              onFilterChange({ status: val?.name || "" });
              setIsOpen(false);
            }}
            width="w-full"
          />
        </div>

        {/* From RO date */}
        <div className="flex flex-col gap-1 min-w-[140px]">
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
        <div className="flex flex-col gap-1 min-w-[140px]">
          <label className="text-xs font-medium text-secondary">
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

      <div className="flex flex-col md:flex-row gap-4">
        <div className="mt-1 flex flex-wrap gap-3 md:col-span-12">
          {/* From Entry date */}
          <div className="flex flex-col gap-1 md:col-span-3">
            <label className="text-xs font-medium text-secondary">
              FROM Entry Date
            </label>
            <input
              type="date"
              className="bg-white shadow-sm rounded px-3 py-2.5 text-sm"
              value={filters.entryFromDate || ""}
              onChange={(e) =>
                onFilterChange({ entryFromDate: e.target.value })
              }
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
