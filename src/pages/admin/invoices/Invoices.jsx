// import { invoices as allInvoices } from '../../../data/data';
// import InvoiceCard from "../../../components/admin/invoices/InvoicesCard";
import InvoicesGrid from "../../../components/admin/invoices/InvoicesGrid";
import Pagination from "../../../components/admin/invoices/InvoicesCardPagination";
import { useState } from "react";
import ChatModal from "../../../components/shared/small/ChatModal";
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
  const [chatUser, setChatUser] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [animateIn, setAnimateIn] = useState(false);
  const handleChatOpen = (invoice) => setChatUser(invoice);
  const { data } = useGetInvoicesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: clientsData } = useGetClientsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const allInvoices = Array.isArray(data) ? data : data?.data ?? [];

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => {
      handleChatClose();
    }, 1000); // Match duration-500
  };

  const handleChatClose = () => setChatUser(null);
  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const totalPages = Math.ceil(allInvoices.length / ITEMS_PER_PAGE);
  const currentInvoices = allInvoices.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleFilterChange = (updated) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  // Apply all filters
  const filteredData = currentInvoices.filter((invoice) => {
    let isMatch = true;

    // 1. Search by field type
    if (filters.searchValue) {
      const fieldValue = String(
        invoice[filters.searchType] || ""
      ).toLowerCase();
      if (!fieldValue.includes(filters.searchValue.toLowerCase())) {
        isMatch = false;
      }
    }

    // 2. From / To Invoice Date
    if (filters.fromDate) {
      const invDate = new Date(invoice.createdAt || invoice.invoiceDate);
      if (invDate < new Date(filters.fromDate)) {
        isMatch = false;
      }
    }
    if (filters.toDate) {
      const invDate = new Date(invoice.createdAt || invoice.invoiceDate);
      if (invDate > new Date(filters.toDate)) {
        isMatch = false;
      }
    }

    // 3. Statement Type
    if (filters.selectedBrand) {
      if (
        invoice.statementType?.toLowerCase() !==
        filters.selectedBrand.name.toLowerCase()
      ) {
        isMatch = false;
      }
    }

    // 4. Status
    if (filters.status) {
      if (invoice.status?.toLowerCase() !== filters.status.toLowerCase()) {
        isMatch = false;
      }
    }

    // 5. Min / Max Final Total
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
        invoices={filteredData}
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
