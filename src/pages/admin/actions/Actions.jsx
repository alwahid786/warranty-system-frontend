import React, { useState } from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  normalizeId,
  isDateInRange,
  matchesSearch
} from "../../../utils/filterUtils";
import ClaimsListHeader from "../../../components/admin/actions/ClaimsListHeader";
import ClaimsDataTable from "../../../components/admin/actions/ClaimsDataTable";
import ClaimsFilterBar from "../../../components/admin/actions/ClaimsFilterBar";
import { useGetClaimsQuery } from "../../../redux/apis/claimsApis";
import { useGetClientsQuery } from "../../../redux/apis/clientsApis";

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

const Actions = () => {
  const { user } = useSelector((state) => state.auth);
  const { clientId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const openChatClaimId = location.state?.openChatClaimId || null;
  const highlightClaimId = location.state?.highlightClaimId || null;

  const filtersFromState = location.state?.filters || {};

  const [filters, setFilters] = useState({
    ...defaultFilters,
    ...filtersFromState
  });

  const { data } = useGetClaimsQuery(
    user?.role === "user" || user?.role === "client"
      ? { clientId: user?._id }
      : clientId
        ? { clientId: clientId }
        : undefined,
    {
      refetchOnMountOrArgChange: true
    }
  );

  const { data: clientsData } = useGetClientsQuery(undefined, {
    skip: !(
      user?.role === "admin" ||
      (user?.role === "user" && user?.owner?.role === "admin")
    )
  });

  const [selectedClaims, setSelectedClaims] = useState([]);
  const claims = Array.isArray(data) ? data : (data?.data ?? []);
  const clients = clientsData?.data ?? [];
  const selectedClient = clients.find((client) => client._id === clientId);
  const initialData = claims;

  const filteredData = initialData.filter((row) => {
    // If this is the claim we need to open the chat for or highlight, ALWAYS include it
    const rowId = normalizeId(row._id);

    if (
      (openChatClaimId && rowId === normalizeId(openChatClaimId)) ||
      (highlightClaimId && rowId === normalizeId(highlightClaimId))
    ) {
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

  const handleNotificationChatOpened = () => {
    if (!openChatClaimId && !highlightClaimId) return;
    navigate(location.pathname, { replace: true, state: {} });
  };

  return (
    <div>
      <ClaimsListHeader
        selectedClaims={selectedClaims}
        setSelectedClaims={setSelectedClaims}
        claims={claims}
        showImportExport={true}
        targetClientId={clientId || ""}
        targetClientName={
          selectedClient?.storeName || selectedClient?.name || ""
        }
      />
      <ClaimsFilterBar filters={filters} onFilterChange={handleFilterChange} />
      <ClaimsDataTable
        data={filteredData}
        selectedClaims={selectedClaims}
        onSelectionChange={setSelectedClaims}
        archived={false}
        openChatClaimId={openChatClaimId}
        onNotificationChatOpened={handleNotificationChatOpened}
      />
    </div>
  );
};

export default Actions;
