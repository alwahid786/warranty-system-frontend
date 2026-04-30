import React, { useState } from "react";

import ClaimsListHeader from "../../../components/admin/actions/ClaimsListHeader";
import ClaimsDataTable from "../../../components/admin/actions/ClaimsDataTable";
import ClaimsFilterBar from "../../../components/admin/actions/ClaimsFilterBar";
import { useGetArchieveClaimsQuery } from "../../../redux/apis/claimsApis";

const defaultFilters = {
  searchType: "roNumber",
  searchValue: "",
  fromDate: "",
  toDate: "",
  entryFromDate: "",
  entryToDate: "",
  selectedBrand: null,
  status: ""
};

const parseStringDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== "string") return null;
  const parts = dateStr.split("/");

  if (parts.length !== 3) return null;

  let [month, day, year] = parts;

  // Handle 2-digit years (e.g., "25" -> "2025")
  if (year.length === 2) {
    year = `20${year}`;
  }

  const date = new Date(
    `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
  );

  return isNaN(date.getTime()) ? null : date;
};

const ArchievedActions = () => {
  const [filters, setFilters] = useState(defaultFilters);

  const { data } = useGetArchieveClaimsQuery(undefined, {
    refetchOnMountOrArgChange: true
  });

  const [selectedClaims, setSelectedClaims] = useState([]);

  const claims = Array.isArray(data) ? data : (data?.data ?? []);

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

    // Filter by RO Date
    if (filters.fromDate || filters.toDate) {
      const roDate = parseStringDate(row.roDate);

      if (roDate) {
        if (filters.fromDate) {
          const from = new Date(filters.fromDate);

          from.setHours(0, 0, 0, 0);
          if (roDate < from) return false;
        }

        if (filters.toDate) {
          const to = new Date(filters.toDate);

          to.setHours(23, 59, 59, 999);
          if (roDate > to) return false;
        }
      }
    }

    // Filter by Entry Date
    if (filters.entryFromDate || filters.entryToDate) {
      const entryDate = parseStringDate(row.entryDate);

      if (entryDate) {
        if (filters.entryFromDate) {
          const from = new Date(filters.entryFromDate);

          from.setHours(0, 0, 0, 0);
          if (entryDate < from) return false;
        }

        if (filters.entryToDate) {
          const to = new Date(filters.entryToDate);

          to.setHours(23, 59, 59, 999);
          if (entryDate > to) return false;
        }
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
        showImportExport={false}
      />
      <ClaimsFilterBar filters={filters} onFilterChange={handleFilterChange} />
      <ClaimsDataTable
        data={filteredData}
        selectedClaims={selectedClaims}
        onSelectionChange={setSelectedClaims}
        archived={true}
      />
    </div>
  );
};

export default ArchievedActions;
