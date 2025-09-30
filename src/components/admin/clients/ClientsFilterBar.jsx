import React from "react";
import Dropdown from "../../shared/small/Dropdown";
import Button from "../../shared/small/Button";
import { LuSearch } from "react-icons/lu";
import { MdFilterAltOff } from "react-icons/md";

const searchTypes = [
  { key: "dealerId", label: "Dealer-ID" },
  { key: "name", label: "NAME" },
  { key: "email", label: "EMAIL" },
  { key: "phone", label: "PHONE" },
];

const searchTypes2 = [
  { key: "companyName", label: "Company" },
  { key: "accountOwner", label: "Account Owner" },
  { key: "businessOwner", label: "Business Owner" },
];

export default function ClientsFilterBar({
  filters = {},
  onFilterChange,
  onReset,
}) {
  return (
    <div className="w-full rounded-md mt-4 flex flex-col gap-4">
      {/* Row 1: Two search bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Search */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-secondary">
            SEARCH (Dealer, Name, Email, Phone)
          </label>
          <div className="relative w-full flex flex-wrap gap-2">
            <input
              type="text"
              className="bg-white shadow-sm rounded px-3 py-2.5 text-sm w-full"
              placeholder={`Search by ${filters.searchType}`}
              value={filters.searchValue}
              onChange={(e) => onFilterChange({ searchValue: e.target.value })}
            />

            {/* Dropdown on mobile */}
            <div className="my-3 md:hidden">
              <Dropdown
                options={searchTypes.map((s) => ({ id: s.key, name: s.label }))}
                defaultValue={{
                  id: filters.searchType,
                  name:
                    searchTypes.find((s) => s.key === filters.searchType)
                      ?.label || "Select Search Type",
                }}
                onChange={(val) => onFilterChange({ searchType: val?.id })}
                width="w-full"
              />
            </div>

            {/* Inline buttons on desktop */}
            <div className="hidden md:flex gap-1 absolute right-2 top-1/2 -translate-y-1/2">
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
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Second Search */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-secondary">
            SEARCH (Company, Account Owner, Business Owner)
          </label>
          <div className="relative w-full flex gap-2 flex-wrap">
            <input
              type="text"
              className="bg-white shadow-sm rounded px-3 py-2.5 text-sm w-full"
              placeholder={`Search by ${filters.searchType2}`}
              value={filters.searchValue2}
              onChange={(e) => onFilterChange({ searchValue2: e.target.value })}
            />

            {/* Dropdown on mobile */}
            <div className="my-3 md:hidden">
              <Dropdown
                options={searchTypes2.map((s) => ({
                  id: s.key,
                  name: s.label,
                }))}
                defaultValue={{
                  id: filters.searchType2,
                  name:
                    searchTypes2.find((s) => s.key === filters.searchType2)
                      ?.label || "Select Search Type",
                }}
                onChange={(val) => onFilterChange({ searchType2: val?.id })}
                width="w-full"
              />
            </div>

            {/* Inline buttons on desktop */}
            <div className="hidden md:flex gap-1 absolute right-2 top-1/2 -translate-y-1/2">
              {searchTypes2.map((type) => (
                <button
                  key={type.key}
                  type="button"
                  className={`px-2 py-1.5 rounded text-xs font-medium border ${
                    filters.searchType2 === type.key
                      ? "bg-primary text-white"
                      : "bg-[#04365530] text-gray-500"
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

      {/* Row 2: Date range + buttons */}
      <div className="flex flex-col items-end md:flex-row gap-4">
        <div className="flex flex-wrap gap-1 md:col-span-8">
          {/* From date */}
          <div className="flex flex-col gap-1 md:col-span-4">
            <label className="text-xs font-medium text-secondary">FROM</label>
            <input
              type="date"
              className="bg-white shadow-sm rounded px-3 py-2.5 text-sm"
              value={filters.fromDate}
              onChange={(e) => onFilterChange({ fromDate: e.target.value })}
            />
          </div>

          {/* To date */}
          <div className="flex flex-col gap-1 md:col-span-4">
            <label className="text-xs font-medium text-secondary">TO</label>
            <input
              type="date"
              className="bg-white shadow-sm rounded px-3 py-2.5 text-sm"
              value={filters.toDate}
              onChange={(e) => onFilterChange({ toDate: e.target.value })}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="">
          <Button
            text="Reset Filters"
            bg="bg-[#043655C4]"
            color="text-white"
            icon={<MdFilterAltOff className="text-sm" />}
            cn="!text-sm !py-2.5"
            onClick={onReset}
          />
        </div>
      </div>
    </div>
  );
}
