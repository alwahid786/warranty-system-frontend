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
      {/* Search Groups Row */}
      <div className="flex flex-wrap gap-4 items-end bg-gray-50/50 p-4 rounded-lg border border-gray-100">
        {/* First Search (Dealer, Name, Email, Phone) */}
        <div className="flex-1 min-w-[280px] max-w-full">
          <label className="text-xs font-semibold text-secondary mb-1 block uppercase tracking-wider">
            Search (Core Info)
          </label>
          <div className="relative w-full">
            <input
              type="text"
              className="bg-white border border-gray-200 shadow-sm rounded px-3 py-2.5 text-sm w-full pr-10 md:pr-48"
              placeholder={`Search by ${filters.searchType}`}
              value={filters.searchValue}
              onChange={(e) => onFilterChange({ searchValue: e.target.value })}
            />

            {/* Desktop Buttons */}
            <div className="hidden md:flex absolute right-1.5 top-1/2 -translate-y-1/2 gap-1">
              {searchTypes.map((type) => (
                <button
                  key={type.key}
                  type="button"
                  className={`px-2 py-1 transition-colors rounded text-[10px] font-bold border ${
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
          {/* Mobile Dropdown */}
          <div className="mt-2 md:hidden">
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
        </div>

        {/* Second Search (Company, Owners) */}
        <div className="flex-1 min-w-[280px] max-w-full">
          <label className="text-xs font-semibold text-secondary mb-1 block uppercase tracking-wider">
            Search (Owner/Company)
          </label>
          <div className="relative w-full">
            <input
              type="text"
              className="bg-white border border-gray-200 shadow-sm rounded px-3 py-2.5 text-sm w-full pr-10 md:pr-64"
              placeholder={`Search by ${filters.searchType2}`}
              value={filters.searchValue2}
              onChange={(e) => onFilterChange({ searchValue2: e.target.value })}
            />

            {/* Desktop Buttons */}
            <div className="hidden md:flex absolute right-1.5 top-1/2 -translate-y-1/2 gap-1">
              {searchTypes2.map((type) => (
                <button
                  key={type.key}
                  type="button"
                  className={`px-2 py-1 transition-colors rounded text-[10px] font-bold border ${
                    filters.searchType2 === type.key
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => onFilterChange({ searchType2: type.key })}
                >
                  {type.label.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          {/* Mobile Dropdown */}
          <div className="mt-2 md:hidden">
            <Dropdown
              options={searchTypes2.map((s) => ({ id: s.key, name: s.label }))}
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
        </div>
      </div>

      {/* Row 2: Date range + buttons */}
      <div className="flex flex-wrap gap-4 items-end bg-gray-50/50 p-4 rounded-lg border border-gray-100">
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

        <div className="w-full sm:w-auto">
          <Button
            text="Reset"
            bg="bg-gray-600"
            color="text-white"
            icon={<MdFilterAltOff className="text-sm" />}
            cn="!text-sm !py-2.5 w-full sm:w-auto px-6"
            onClick={onReset}
          />
        </div>
      </div>
    </div>
  );
}
