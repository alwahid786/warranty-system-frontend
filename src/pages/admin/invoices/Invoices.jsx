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
  searchType: "id",
  searchValue: "",
  fromDate: "",
  toDate: "",
  selectedBrand: null,
  status: "",
};

const Invoices = () => {
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [animateIn, setAnimateIn] = useState(false);
  const handleChatOpen = (invoice) => setChatUser(invoice);
  const { data } = useGetInvoicesQuery();
  const { data: clientsData } = useGetClientsQuery();

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

  const filteredData = currentInvoices.filter((row) => {
    if (filters.searchValue) {
      const val = filters.searchValue.toLowerCase();
      if (
        filters.searchType === "id" &&
        !row.claimId.toString().toLowerCase().includes(val)
      )
        return false;
      if (
        filters.searchType === "name" &&
        !row.brand.toLowerCase().includes(val)
      )
        return false;
      if (filters.searchType === "phone") return true;
    }
    return true;
  });

  // Handler to update filters
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="w-full mx-auto ">
      <>
        <InvoicesListHeader
          selectedIds={selectedIds}
          showImportExport={true}
          clientsData={clientsData}
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
      <ChatModal
        setAnimateIn={setAnimateIn}
        animateIn={animateIn}
        isOpen={!!chatUser}
        onClose={handleClose}
        user={chatUser}
        forInvoice
      />
      <Pagination current={page} total={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default Invoices;
