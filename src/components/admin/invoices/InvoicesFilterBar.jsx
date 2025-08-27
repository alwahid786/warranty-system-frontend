import Dropdown from '../../shared/small/Dropdown';
import Button from '../../shared/small/Button';
import { LuSearch } from 'react-icons/lu';
import { MdFilterAltOff } from 'react-icons/md';

const searchTypes = [
  { key: 'id', label: 'ID#' },
  { key: 'phone', label: 'PHONE#' },
  { key: 'name', label: 'NAME' },
];

const brands = [
  { id: 1, name: 'Toyota' },
  { id: 2, name: 'Honda' },
  { id: 3, name: 'BMW' },
  { id: 4, name: 'Mercedes' },
];
const orderStatuses = [
  { id: 1, name: 'Pending Credit' },
  { id: 2, name: 'Pending Correction' },
  { id: 3, name: 'Pending Question' },
  { id: 4, name: 'Pending Analysis' },
  { id: 5, name: 'Rejected' },
  { id: 6, name: 'Appealed' },
];
const InvoicesFilterBar = ({ filters = {}, onFilterChange }) => {
  return (
    <div className="w-full rounded-md  mt-4 flex flex-col  gap-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end ">
        {/* Search input and toggle */}
        <div className="flex flex-col gap-1 md:col-span-6">
          <label className="text-xs font-medium text-secondary">ADVANCED SEARCH</label>
          <div className="relative w-full">
            <input
              type="text"
              className="bg-white shadow-sm rounded px-3 py-2.5 text-sm w-full pr-36"
              placeholder={`Search by claims ${filters.searchType}`}
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
                      ? 'bg-primary text-white'
                      : 'bg-[#04365530] text-gray-500'
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
        <div className="grid md:grid-cols-2 gap-2">
          <div className="flex flex-col w-full gap-1">
            <label className="text-xs font-medium text-secondary ">Select brand</label>
            <Dropdown
              title=""
              options={brands}
              defaultValue={filters.selectedBrand}
              // onChange={(val) => onFilterChange({ selectedBrand: val })}
              width="w-full"
            />
          </div>
          <div className="flex flex-col w-full gap-1 ">
            <label className="text-xs font-medium text-secondary ">Select brand</label>
            <Dropdown
              title=""
              // options={brands}
              defaultValue={filters.selectedBrand}
              onChange={(val) => onFilterChange({ selectedBrand: val })}
              width="w-full"
            />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2 items-center">
          <div className="flex flex-col w-full gap-1 col-span-12 md:col-span-4">
            <label className="text-xs font-medium text-secondary ">Status</label>
            <Dropdown
              title=""
              // options={orderStatuses}
              defaultValue={orderStatuses.find(
                (opt) => opt.name.toLowerCase() === filters.status?.toLowerCase()
              )}
              onChange={(val) => onFilterChange({ status: val?.name || '' })}
              width="w-full"
            />
          </div>
          <div className="flex flex-col w-full gap-1 col-span-12 md:col-span-4">
            <label className="text-xs font-medium text-secondary "> Order Statuses</label>
            <Dropdown
              title=""
              options={orderStatuses}
              defaultValue={orderStatuses.find(
                (opt) => opt.name.toLowerCase() === filters.status?.toLowerCase()
              )}
              // onChange={(val) => onFilterChange({ status: val?.name || "" })}
              width="w-full"
            />
          </div>
          <div className="col-span-12 md:col-span-4 mt-5">
            <div className="grid grid-cols-2 gap-2 col-span-12 md:col-span-4">
              <Button
                text="Search"
                bg="bg-primary"
                color="text-white"
                icon={<LuSearch className="text-sm" />}
                cn={'!text-sm !py-3 !h-[40px]'}
              />
              <Button
                text=" Filter"
                bg="bg-[#043655C4] "
                color="text-white"
                icon={<MdFilterAltOff className="text-sm" />}
                cn={'text-sm !h-[40px]'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicesFilterBar;
