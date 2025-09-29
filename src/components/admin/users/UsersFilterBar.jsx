import React from "react";
import Dropdown from "../../shared/small/Dropdown";
import Button from "../../shared/small/Button";
import { LuSearch } from "react-icons/lu";
import { MdFilterAltOff } from "react-icons/md";

const searchTypes = [
  { key: "name", label: "NAME" },
  { key: "email", label: "EMAIL" },
  { key: "phone", label: "PHONE" },
];

const orderStatuses = [
  { id: 1, name: "Active" },
  { id: 2, name: "Inactive" },
];

export default function UsersFilterBar({
  filters = {},
  onFilterChange,
  onReset,
}) {
  return (
    <div className="w-full rounded-md  mt-4 flex flex-col  gap-4">
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
              placeholder={`Search by users ${filters.searchType}`}
              value={filters.searchValue}
              onChange={(e) => onFilterChange({ searchValue: e.target.value })}
            />

            {/* Mobile Dropdown */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-28 md:hidden">
              <Dropdown
                title=""
                options={searchTypes.map((t) => ({
                  id: t.key,
                  name: t.label,
                }))}
                defaultValue={{
                  id: filters.searchType,
                  name:
                    searchTypes.find((t) => t.key === filters.searchType)
                      ?.label || searchTypes[0].label,
                }}
                onChange={(val) =>
                  onFilterChange({ searchType: val?.id || "name" })
                }
                width="w-full"
              />
            </div>

            {/* Desktop Buttons */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:flex gap-1">
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
        {/* From date */}
        <div className="flex flex-col gap-1 md:col-span-3">
          <label className="text-xs font-medium text-secondary  ">FROM</label>
          <input
            type="date"
            className="bg-white shadow-sm rounded px-3 py-2.5 text-sm"
            value={filters.fromDate}
            onChange={(e) => onFilterChange({ fromDate: e.target.value })}
          />
        </div>
        {/* To date */}
        <div className="flex flex-col gap-1 md:col-span-3">
          <label className="text-xs font-medium text-secondary ">TO</label>
          <input
            type="date"
            className="bg-white shadow-sm rounded px-3 py-2.5 text-sm"
            value={filters.toDate}
            onChange={(e) => onFilterChange({ toDate: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <div className="flex justify-start mt-5">
          <Button
            text="Reset Filter"
            bg="bg-[#043655C4]"
            color="text-white"
            icon={<MdFilterAltOff className="text-sm" />}
            cn="text-sm !py-2.5"
            onClick={onReset}
          />
        </div>
      </div>
    </div>
  );
}
