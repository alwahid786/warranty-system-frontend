import Dropdown from "../../shared/small/Dropdown";
import Button from "../../shared/small/Button";
import { LuSearch } from "react-icons/lu";
import { MdFilterAltOff } from "react-icons/md";

const searchTypes = [
  { key: "invoiceNumber", label: "INV-#" },
  { key: "warrantyCompany", label: "Company" },
  { key: "clientName", label: "Client" },
  { key: "statementNumber", label: "Statement-#" },
];

const statementTypes = [
  { id: 1, name: "Weekly" },
  { id: 2, name: "Monthly" },
  { id: 3, name: "Custom" },
];

const orderStatuses = [
  { id: 1, name: "Draft" },
  { id: 2, name: "Finalized" },
];

const defaultLocalFilters = {
  searchType: "invoiceNumber",
  searchValue: "",
  fromDate: "",
  toDate: "",
  selectedBrand: null,
  minFinalTotal: "",
  maxFinalTotal: "",
  status: "",
};

const InvoicesFilterBar = ({ filters = {}, onFilterChange }) => {
  const handleReset = () => {
    onFilterChange(defaultLocalFilters);
  };

  return (
    <div className="w-full rounded-md mt-4 flex flex-col gap-4">
      {/* Row 1: Search + Dates */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
        {/* Search input and toggle */}

        <div className="flex flex-col gap-1 md:col-span-6">
          <label className="text-xs font-medium text-secondary">
            ADVANCED SEARCH
          </label>
          <div className="relative w-full">
            <input
              type="text"
              className="bg-white shadow-sm rounded px-3 py-2.5 text-sm w-full pr-36"
              placeholder={`Search by invoices ${filters.searchType}`}
              value={filters.searchValue}
              onChange={(e) => onFilterChange({ searchValue: e.target.value })}
            />

            {/* Mobile: Dropdown */}
            <div className="absolute right-7 top-1/2 -translate-y-1/2 md:hidden">
              <select
                className="bg-[#04365530] text-gray-600 text-xs px-2 py-1.5 rounded border"
                value={filters.searchType}
                onChange={(e) => onFilterChange({ searchType: e.target.value })}
              >
                {searchTypes.map((type) => (
                  <option key={type.key} value={type.key}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop: Button group */}
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
          <label className="text-xs font-medium text-secondary">
            FROM Invoice Date
          </label>
          <input
            type="date"
            className="bg-white shadow-sm rounded px-3 py-2.5 text-sm"
            value={filters.fromDate}
            onChange={(e) => onFilterChange({ fromDate: e.target.value })}
          />
        </div>

        {/* To date */}
        <div className="flex flex-col gap-1 md:col-span-3">
          <label className="text-xs font-medium text-secondary">
            TO Invoice Date
          </label>
          <input
            type="date"
            className="bg-white shadow-sm rounded px-3 py-2.5 text-sm"
            value={filters.toDate}
            onChange={(e) => onFilterChange({ toDate: e.target.value })}
          />
        </div>
      </div>

      {/* Row 2: Statement, Totals, Status, Buttons */}
      <div className="grid grid-cols-12 gap-2 items-end w-full">
        {/* Statement Type */}
        <div className="flex flex-col w-full gap-1 col-span-12 md:col-span-3">
          <label className="text-xs font-medium text-secondary">
            Select Statement Type
          </label>
          <Dropdown
            title=""
            options={statementTypes}
            defaultValue={filters.selectedBrand}
            onChange={(val) => onFilterChange({ selectedBrand: val })}
            width="w-full"
          />
        </div>

        {/* Final Total Min */}
        <div className="flex flex-col w-full gap-1 col-span-6 md:col-span-2">
          <label className="text-xs font-medium text-secondary">
            Min Final Total
          </label>
          <input
            type="number"
            className="bg-white shadow-sm rounded px-3 py-2.5 text-sm w-full"
            placeholder="Min"
            value={filters.minFinalTotal}
            onChange={(e) => onFilterChange({ minFinalTotal: e.target.value })}
          />
        </div>

        {/* Final Total Max */}
        <div className="flex flex-col w-full gap-1 col-span-6 md:col-span-2">
          <label className="text-xs font-medium text-secondary">
            Max Final Total
          </label>
          <input
            type="number"
            className="bg-white shadow-sm rounded px-3 py-2.5 text-sm w-full"
            placeholder="Max"
            value={filters.maxFinalTotal}
            onChange={(e) => onFilterChange({ maxFinalTotal: e.target.value })}
          />
        </div>

        {/* Status */}
        <div className="flex flex-col w-full gap-1 col-span-12 md:col-span-2">
          <label className="text-xs font-medium text-secondary">Status</label>
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
        <div className="col-span-12 md:col-span-3 mt-5">
          <div className="grid grid-cols-2 gap-2">
            <Button
              text="Reset Filter"
              bg="bg-[#043655C4]"
              color="text-white"
              icon={<MdFilterAltOff className="text-sm" />}
              cn={"text-sm !h-[40px]"}
              onClick={handleReset}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicesFilterBar;
