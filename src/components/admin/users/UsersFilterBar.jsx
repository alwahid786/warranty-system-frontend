import React from "react";

import { MdFilterAltOff } from "react-icons/md";

import Dropdown from "../../shared/small/Dropdown";
import Button from "../../shared/small/Button";

const searchTypes = [
  { key: "name", label: "NAME" },
  { key: "email", label: "EMAIL" },
  { key: "phone", label: "PHONE" }
];

export default function UsersFilterBar({
  filters = {},
  onFilterChange,
  onReset
}) {
  return (
    <div className="w-full rounded-md mt-4 flex flex-col gap-4">
      <div className="flex flex-wrap gap-4 items-end bg-gray-50/50 p-4 rounded-lg border border-gray-100">
        {/* Search Input Group */}
        <div className="flex-1 min-w-[300px] max-w-full lg:max-w-[50%]">
          <label className="text-xs font-semibold text-secondary mb-1 block uppercase tracking-wider">
            Advanced Search
          </label>
          <div className="relative w-full">
            <input
              type="text"
              className="bg-white border border-gray-200 shadow-sm rounded px-3 py-2.5 text-sm w-full md:pr-40"
              placeholder={`Search by users ${filters.searchType}`}
              value={filters.searchValue}
              onChange={(e) => onFilterChange({ searchValue: e.target.value })}
            />

            {/* Desktop Buttons */}
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 hidden md:flex gap-1">
              {searchTypes.map((type) => (
                <button
                  key={type.key}
                  type="button"
                  className={`px-3 py-1.5 rounded text-[10px] font-bold border transition-colors ${
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
          {/* Mobile Dropdown */}
          <div className="mt-2 md:hidden">
            <Dropdown
              options={searchTypes.map((t) => ({
                id: t.key,
                name: t.label
              }))}
              defaultValue={{
                id: filters.searchType,
                name:
                  searchTypes.find((t) => t.key === filters.searchType)
                    ?.label || searchTypes[0].label
              }}
              onChange={(val) =>
                onFilterChange({ searchType: val?.id || "name" })
              }
              width="w-full"
            />
          </div>
        </div>

        {/* Date Range Group */}
        <div className="flex flex-wrap sm:flex-nowrap gap-4 flex-1 min-w-[280px]">
          <div className="flex-1">
            <label className="text-xs font-semibold text-secondary mb-1 block uppercase tracking-wider">
              From
            </label>
            <input
              type="date"
              className="bg-white border border-gray-200 shadow-sm rounded px-3 py-2.5 text-sm w-full"
              value={filters.fromDate}
              onChange={(e) => onFilterChange({ fromDate: e.target.value })}
            />
          </div>
          <div className="flex-1">
            <label className="text-xs font-semibold text-secondary mb-1 block uppercase tracking-wider">
              To
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

      <div className="flex justify-start">
        <Button
          text="Reset"
          bg="bg-gray-600"
          color="text-white"
          icon={<MdFilterAltOff className="text-sm" />}
          cn="text-sm !py-2.5 px-6"
          onClick={onReset}
        />
      </div>
    </div>
  );
}
