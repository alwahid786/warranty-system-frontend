// import { invoices as allInvoices } from '../../../data/data';
// import InvoiceCard from "../../../components/admin/invoices/InvoicesCard";
import { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import InvoicesGrid from "../../../components/admin/invoices/InvoicesGrid";
import Pagination from "../../../components/admin/invoices/InvoicesCardPagination";
import InvoicesListHeader from "../../../components/admin/invoices/InvoicesListHeader";
import InvoicesFilterBar from "../../../components/admin/invoices/InvoicesFilterBar";
import { useGetArchiveInvoicesQuery } from "../../../redux/apis/invoiceApis";
import { isDateInRange, matchesSearch } from "../../../utils/filterUtils";

const ITEMS_PER_PAGE = 6;

const defaultFilters = {
  searchType: "id",
  searchValue: "",
  fromDate: "",
  toDate: "",
  selectedBrand: null,
  status: ""
};

const ArchivedInvoices = () => {
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const location = useLocation();
  const navigate = useNavigate();
  const openInvoiceNumber = location.state?.openInvoiceNumber || null;

  const handleNotificationOpened = () => {
    if (!openInvoiceNumber) return;
    navigate(location.pathname, { replace: true, state: {} });
  };

  const handleChatOpen = (invoice) => {
    // Chat functionality not fully implemented in this archived view
    console.log("Chat open for archived invoice:", invoice);
  };

  const { data } = useGetArchiveInvoicesQuery(undefined, {
    refetchOnMountOrArgChange: true
  });

  const allInvoices = Array.isArray(data) ? data : (data?.data ?? []);

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Apply all filters
  const filteredDataTotal = allInvoices.filter((invoice) => {
    let isMatch = true;

    // Search filter
    if (!matchesSearch(invoice, filters.searchValue, filters.searchType)) {
      isMatch = false;
    }

    // Date range filter
    if (
      !isDateInRange(
        invoice.createdAt || invoice.invoiceDate,
        filters.fromDate,
        filters.toDate
      )
    ) {
      isMatch = false;
    }

    // Brand filter
    if (filters.selectedBrand) {
      if (
        invoice.statementType?.toLowerCase() !==
        filters.selectedBrand.name.toLowerCase()
      ) {
        isMatch = false;
      }
    }

    // Status filter
    if (filters.status) {
      if (invoice.status?.toLowerCase() !== filters.status.toLowerCase()) {
        isMatch = false;
      }
    }

    // Price range filters
    if (
      filters.minFinalTotal &&
      Number(invoice.finalTotal) < Number(filters.minFinalTotal)
    ) {
      isMatch = false;
    }
    if (
      filters.maxFinalTotal &&
      Number(invoice.finalTotal) > Number(filters.maxFinalTotal)
    ) {
      isMatch = false;
    }

    // If this is the invoice we need to show, ALWAYS include it
    if (
      openInvoiceNumber &&
      String(invoice.invoiceNumber) === String(openInvoiceNumber)
    ) {
      return true;
    }

    return isMatch;
  });

  const handleFilterChange = (updated) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const totalPages = Math.ceil(filteredDataTotal.length / ITEMS_PER_PAGE) || 1;

  const currentInvoices = filteredDataTotal.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full mx-auto flex flex-col min-h-full p-6">
      <div className="flex-1">
        <InvoicesListHeader
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          showImportExport={false}
        />
        <div className="mb-4">
          <InvoicesFilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
        <h1 className="text-xl font-semibold mb-4">Invoices</h1>
        <InvoicesGrid
          invoices={currentInvoices}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onChatOpen={handleChatOpen}
          openInvoiceNumber={openInvoiceNumber}
          onNotificationOpened={handleNotificationOpened}
        />
      </div>
      <div className="mt-auto">
        <Pagination current={page} total={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default ArchivedInvoices;
