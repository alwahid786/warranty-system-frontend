// import { invoices as allInvoices } from '../../../data/data';
// import InvoiceCard from "../../../components/admin/invoices/InvoicesCard";
import InvoicesGrid from "../../../components/admin/invoices/InvoicesGrid";
import Pagination from "../../../components/admin/invoices/InvoicesCardPagination";
import { useState } from "react";
import InvoicesListHeader from "../../../components/admin/invoices/InvoicesListHeader";
import InvoicesFilterBar from "../../../components/admin/invoices/InvoicesFilterBar";
import {
  useGetClientsQuery,
  useGetInvoicesQuery,
} from "../../../redux/apis/invoiceApis";

const ITEMS_PER_PAGE = 6;

const defaultFilters = {
  searchType: "invoiceNumber",
  searchValue: "",
  fromDate: "",
  toDate: "",
  selectedBrand: null,
  minFinalTotal: "",
  maxFinalTotal: "",
  status: "",
};

const Invoices = () => {
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const handleChatOpen = (invoice) => {
    // Chat functionality not fully implemented in this view
    console.log("Chat open for invoice:", invoice);
  };
  const { data } = useGetInvoicesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: clientsData } = useGetClientsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const allInvoices = Array.isArray(data) ? data : data?.data ?? [];

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleFilterChange = (updated) => {
    setFilters((prev) => ({ ...prev, ...updated }));
    setPage(1);
  };

  const filteredDataTotal = allInvoices.filter((invoice) => {
    let isMatch = true;

    if (filters.searchValue) {
      const fieldValue = String(
        invoice[filters.searchType] || ""
      ).toLowerCase();
      if (!fieldValue.includes(filters.searchValue.toLowerCase())) {
        isMatch = false;
      }
    }

    if (filters.fromDate || filters.toDate) {
      const invDate = new Date(invoice.createdAt || invoice.invoiceDate);
      if (filters.fromDate && invDate < new Date(filters.fromDate)) {
        isMatch = false;
      }
      if (filters.toDate && invDate > new Date(filters.toDate)) {
        isMatch = false;
      }
    }

    if (filters.selectedBrand) {
      if (
        invoice.statementType?.toLowerCase() !==
        filters.selectedBrand.name.toLowerCase()
      ) {
        isMatch = false;
      }
    }

    if (filters.status) {
      if (invoice.status?.toLowerCase() !== filters.status.toLowerCase()) {
        isMatch = false;
      }
    }

    if (filters.minFinalTotal) {
      if (Number(invoice.finalTotal) < Number(filters.minFinalTotal)) {
        isMatch = false;
      }
    }
    if (filters.maxFinalTotal) {
      if (Number(invoice.finalTotal) > Number(filters.maxFinalTotal)) {
        isMatch = false;
      }
    }

    return isMatch;
  });

  const sortedData = [...filteredDataTotal].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const currentInvoices = sortedData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full mx-auto ">
      <>
        <InvoicesListHeader
          showImportExport={true}
          clientsData={clientsData}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      </>
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
        clientsData={clientsData}
      />
      <Pagination current={page} total={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default Invoices;
