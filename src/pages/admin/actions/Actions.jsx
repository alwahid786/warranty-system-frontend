import React, { useEffect, useState } from "react";
import ClaimsListHeader from "../../../components/admin/actions/ClaimsListHeader";
import ClaimsDataTable from "../../../components/admin/actions/ClaimsDataTable";
import ClaimsFilterBar from "../../../components/admin/actions/ClaimsFilterBar";
import { useGetClaimsQuery } from "../../../redux/apis/claimsApis";

const defaultFilters = {
  searchType: "roNumber",
  searchValue: "",
  fromDate: "",
  toDate: "",
  entryFromDate: "",
  entryToDate: "",
  selectedBrand: null,
  status: "",
};

const Actions = () => {
  const [filters, setFilters] = useState(defaultFilters);
  const { data } = useGetClaimsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [selectedClaims, setSelectedClaims] = useState([]);
  const claims = Array.isArray(data) ? data : data?.data ?? [];
  const initialData = claims;

  const filteredData = initialData.filter((row) => {
    if (filters.searchValue) {
      const val = filters.searchValue.toLowerCase();
      if (
        filters.searchType === "roNumber" &&
        !row.roNumber?.toLowerCase().includes(val)
      )
        return false;
      if (
        filters.searchType === "roSuffix" &&
        !row.roSuffix?.toLowerCase().includes(val)
      )
        return false;
      if (
        filters.searchType === "quoted" &&
        !row.quoted?.toLowerCase().includes(val)
      )
        return false;
    }

    if (filters.status && filters.status !== "all") {
      if (row.status?.toLowerCase() !== filters.status.toLowerCase())
        return false;
    }

    if (filters.fromDate || filters.toDate) {
      const [month, day, year] = row.roDate.split("/");
      const roDate = new Date(
        `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
      );

      if (filters.fromDate) {
        const from = new Date(filters.fromDate);
        if (roDate < from) return false;
      }

      if (filters.toDate) {
        const to = new Date(filters.toDate);
        if (roDate > to) return false;
      }
    }

    if (filters.entryFromDate || filters.entryToDate) {
      const [month, day, year] = row.entryDate.split("/");
      const entryDate = new Date(
        `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
      );

      if (filters.entryFromDate) {
        const from = new Date(filters.entryFromDate);
        if (entryDate < from) return false;
      }

      if (filters.entryToDate) {
        const to = new Date(filters.entryToDate);
        if (entryDate > to) return false;
      }
    }

    return true;
  });

  // Handler to update filters
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div>
      <ClaimsListHeader
        selectedClaims={selectedClaims}
        showImportExport={true}
      />
      <ClaimsFilterBar filters={filters} onFilterChange={handleFilterChange} />
      <ClaimsDataTable
        data={filteredData}
        onSelectionChange={setSelectedClaims}
        archived={false}
      />
    </div>
  );
};

export default Actions;
