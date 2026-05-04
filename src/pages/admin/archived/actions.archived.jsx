import { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import {
  normalizeId,
  isDateInRange,
  matchesSearch
} from "../../../utils/filterUtils";
import { useGetArchiveClaimsQuery } from "../../../redux/apis/claimsApis";
import ClaimsListHeader from "../../../components/admin/actions/ClaimsListHeader";
import ClaimsDataTable from "../../../components/admin/actions/ClaimsDataTable";
import ClaimsFilterBar from "../../../components/admin/actions/ClaimsFilterBar";

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

const ArchivedActions = () => {
  const { data } = useGetArchiveClaimsQuery(undefined, {
    refetchOnMountOrArgChange: true
  });

  const location = useLocation();
  const navigate = useNavigate();
  const highlightClaimId = location.state?.highlightClaimId || null;

  const [filters, setFilters] = useState(defaultFilters);
  const [selectedClaims, setSelectedClaims] = useState([]);

  const claims = Array.isArray(data) ? data : (data?.data ?? []);

  const handleNotificationOpened = () => {
    if (!highlightClaimId) return;
    navigate(location.pathname, { replace: true, state: {} });
  };

  const filteredData = claims.filter((row) => {
    // If this is the claim we need to highlight, ALWAYS include it
    const rowId = normalizeId(row._id);

    if (highlightClaimId && rowId === normalizeId(highlightClaimId)) {
      return true;
    }

    // Search filter
    if (
      filters.searchValue &&
      !matchesSearch(row, filters.searchValue, filters.searchType)
    ) {
      return false;
    }

    // Status filter
    if (filters.status && filters.status !== "all") {
      if (row.status?.toLowerCase() !== filters.status.toLowerCase())
        return false;
    }

    // RO Date Range filter
    if (!isDateInRange(row.roDate, filters.fromDate, filters.toDate)) {
      return false;
    }

    // Entry Date Range filter
    if (
      !isDateInRange(row.entryDate, filters.entryFromDate, filters.entryToDate)
    ) {
      return false;
    }

    return true;
  });

  // Handler to update filters
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="flex flex-col min-h-full p-6">
      <div className="flex-1">
        <ClaimsListHeader
          claims={claims}
          selectedClaims={selectedClaims}
          setSelectedClaims={setSelectedClaims}
          showImportExport={false}
        />
        <ClaimsFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <ClaimsDataTable
          data={filteredData}
          selectedClaims={selectedClaims}
          onSelectionChange={setSelectedClaims}
          archived={true}
          onNotificationChatOpened={handleNotificationOpened}
        />
      </div>
    </div>
  );
};

export default ArchivedActions;
