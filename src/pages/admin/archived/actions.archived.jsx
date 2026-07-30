import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  normalizeId,
  isDateInRange,
  matchesSearch
} from "../../../utils/filterUtils";
import { useGetArchiveClaimsQuery } from "../../../redux/apis/claimsApis";
import { useGetClientsQuery } from "../../../redux/apis/clientsApis";
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
  status: "",
  company: ""
};

const ArchivedActions = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const highlightClaimId = location.state?.highlightClaimId || null;

  const isAdminSide =
    user?.role === "superadmin" ||
    user?.role === "admin" ||
    (user?.role === "user" &&
      ["admin", "superadmin"].includes(user?.owner?.role));

  const { data } = useGetArchiveClaimsQuery(undefined, {
    refetchOnMountOrArgChange: true
  });

  const { data: clientsData } = useGetClientsQuery(undefined, {
    skip: !isAdminSide
  });

  const [filters, setFilters] = useState(defaultFilters);
  const [selectedClaims, setSelectedClaims] = useState([]);

  const claims = Array.isArray(data) ? data : (data?.data ?? []);
  const clients = clientsData?.data ?? [];

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

    // Company filter
    if (filters.company) {
      const rowOwnerId = row.owner?._id || row.owner;
      const rowClientId =
        row.clientId?._id ||
        row.clientId ||
        row.owner?.owner?._id ||
        row.owner?.owner;

      const ownerComp =
        row.owner?.companyName ||
        row.owner?.warrantyCompany ||
        row.owner?.storeName ||
        row.owner?.owner?.companyName ||
        row.owner?.owner?.warrantyCompany ||
        row.owner?.owner?.storeName ||
        "";

      const selectedComp = clients.find((c) => c._id === filters.company);
      const targetId = filters.company;
      const targetName =
        selectedComp?.companyName ||
        selectedComp?.storeName ||
        selectedComp?.name ||
        filters.company;

      const isMatch =
        rowOwnerId === targetId ||
        rowClientId === targetId ||
        (ownerComp && ownerComp.toLowerCase() === targetName.toLowerCase());

      if (!isMatch) return false;
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
          companies={clients}
          showCompanyFilter={isAdminSide}
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
