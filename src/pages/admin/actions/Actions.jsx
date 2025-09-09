import React, { useEffect, useState } from "react";
import ClaimsListHeader from "../../../components/admin/actions/ClaimsListHeader";
import ClaimsDataTable from "../../../components/admin/actions/ClaimsDataTable";
import ClaimsFilterBar from "../../../components/admin/actions/ClaimsFilterBar";
import { useGetClaimsQuery } from "../../../redux/apis/claimsApis";

const defaultFilters = {
  searchType: "id",
  searchValue: "",
  fromDate: "",
  toDate: "",
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
    // Search filter
    if (filters.searchValue) {
      const val = filters.searchValue.toLowerCase();
      if (
        filters.searchType === "id" &&
        !row.claimId.toLowerCase().includes(val)
      )
        return false;
      if (
        filters.searchType === "name" &&
        !row.userName.toLowerCase().includes(val)
      )
        return false;
      if (filters.searchType === "phone") return true; // No phone in mock data
    }

    // Brand filter
    if (filters.selectedBrand && filters.selectedBrand.name) {
      if (
        !row.carBrand
          .toLowerCase()
          .includes(filters.selectedBrand.name.toLowerCase())
      )
        return false;
    }

    // Status filter
    if (filters.status && filters.status !== "all") {
      if (row.status.toLowerCase() !== filters.status.toLowerCase())
        return false;
    }

    // Date filter
    if (filters.fromDate || filters.toDate) {
      const [month, day, year] = row.claimDate.split("/");
      const rowDate = new Date(
        `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
      );

      if (filters.fromDate) {
        const from = new Date(filters.fromDate);
        if (rowDate < from) return false;
      }

      if (filters.toDate) {
        const to = new Date(filters.toDate);
        if (rowDate > to) return false;
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
