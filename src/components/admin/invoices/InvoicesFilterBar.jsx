import { MdFilterAltOff } from "react-icons/md";

import Dropdown from "../../shared/small/Dropdown";
import Button from "../../shared/small/Button";

const searchTypes = [
  { key: "invoiceNumber", label: "INV-#" },
  { key: "warrantyCompany", label: "Company" },
  { key: "clientName", label: "Client" },
  { key: "statementNumber", label: "Statement-#" }
];

const statementTypes = [
  { id: 1, name: "Weekly" },
  { id: 2, name: "Monthly" },
  { id: 3, name: "Custom" }
];

const orderStatuses = [
  { id: 1, name: "Draft" },
  { id: 2, name: "Finalized" }
];

const defaultLocalFilters = {
  searchType: "invoiceNumber",
  searchValue: "",
  fromDate: "",
  toDate: "",
  selectedBrand: null,
  minFinalTotal: "",
  maxFinalTotal: "",
  status: ""
};

const InvoicesFilterBar = ({ filters = {}, onFilterChange }) => {
  const handleReset = () => {
    onFilterChange(defaultLocalFilters);
  };

  return (
    <div className="w-full mt-4 flex flex-col gap-4">
      {/* Row 1: Search + Dates */}
      <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          {/* Advanced Search */}
          <div className="lg:col-span-6 flex flex-col gap-1">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">
              ADVANCED SEARCH
            </label>
            <div className="relative group">
              <input
                type="text"
                className="bg-white border border-gray-200 shadow-sm rounded px-3 py-2.5 text-sm w-full lg:pr-72 transition-all focus:border-primary focus:ring-1 focus:ring-primary/20"
                placeholder={`Search by ${searchTypes.find((t) => t.key === filters.searchType)?.label}`}
                value={filters.searchValue}
                onChange={(e) =>
                  onFilterChange({ searchValue: e.target.value })
                }
              />

              {/* Desktop Button Group - Hidden on MD and below */}
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

          {/* Date Range */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest truncate">
                FROM Invoice Date
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
                TO Invoice Date
              </label>
              <input
                type="date"
                className="bg-white border border-gray-200 shadow-sm rounded px-3 py-2.5 text-sm w-full focus:border-primary focus:ring-1 focus:ring-primary/20"
                value={filters.toDate}
                onChange={(e) => onFilterChange({ toDate: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Statement, Totals, Status, Buttons */}
      <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          {/* Statement Type */}
          <div className="lg:col-span-3 flex flex-col gap-1">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">
              Statement Type
            </label>
            <Dropdown
              title=""
              options={statementTypes}
              defaultValue={filters.selectedBrand}
              onChange={(val) => onFilterChange({ selectedBrand: val })}
              width="w-full"
            />
          </div>

          {/* Totals */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest truncate">
                Min Total
              </label>
              <input
                type="number"
                min="0"
                className="bg-white border border-gray-200 shadow-sm rounded px-3 py-2.5 text-sm w-full"
                placeholder="Min"
                value={filters.minFinalTotal}
                onChange={(e) => {
                  const value = e.target.value;

                  if (value < 0) return;

                  onFilterChange({ minFinalTotal: value });
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest truncate">
                Max Total
              </label>
              <input
                type="number"
                min="0"
                className="bg-white border border-gray-200 shadow-sm rounded px-3 py-2.5 text-sm w-full"
                placeholder="Max"
                value={filters.maxFinalTotal}
                onChange={(e) => {
                  const value = e.target.value;

                  if (value < 0) return;

                  onFilterChange({ maxFinalTotal: value });
                }}
              />
            </div>
          </div>

          {/* Status */}
          <div className="lg:col-span-3 flex flex-col gap-1">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">
              Status
            </label>
            <Dropdown
              title=""
              options={orderStatuses}
              defaultValue={orderStatuses.find(
                (opt) =>
                  opt.name.toLowerCase() === filters.status?.toLowerCase()
              )}
              onChange={(val) => onFilterChange({ status: val?.name || "" })}
              width="w-full"
            />
          </div>

          {/* Reset Button */}
          <div className="lg:col-span-2">
            <Button
              text="Reset Filter"
              bg="bg-[#043655C4]"
              color="text-white"
              icon={<MdFilterAltOff className="text-sm" />}
              cn={
                "text-sm !py-2.5 w-full px-4 hover:bg-[#043655E0] transition-colors shadow-sm"
              }
              onClick={handleReset}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicesFilterBar;
