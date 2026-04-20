import { useNavigate, useParams } from "react-router";
import AttendanceChart from "../../../components/admin/clients/AttendanceChart";
import StatusOverviewCard from "../../../components/admin/clients/OverviewStats";
// import OverviewStats from "../../../components/admin/Clients/OverviewStats";
import TotalClientsCard from "../../../components/admin/clients/TotalClientsCard";
import ClientsDetailCard from "../../../components/admin/clients/ClientsDetailCard";
import ClientsFilterBar from "../../../components/admin//clients/ClientsFilterBar";
// import SummaryCard from "../../../components/admin/Clients/TotalClientsCard";
import ClientsHeader from "../../../components/admin/clients/ClientsHeader";
import ClientsPagination from "../../../components/admin/clients/ClientsPagination";
import { useEffect, useState } from "react";
import {
  useDeleteClientMutation,
  useGetClientsQuery,
  useGetClientsStatByFiltersQuery,
  useGetClientsActivityStatsQuery,
} from "../../../redux/apis/clientsApis";
import { useUpdateClientMutation } from "../../../redux/apis/clientsApis";
import ConfirmationModal from "../../../utils/ConfirmationModal";
import toast from "react-hot-toast";
import EditClientsModal from "../../../components/admin/clients/EditClientsModal";

const Clients = () => {
  const [filters, setFilters] = useState({
    searchType: "dealerId",
    searchValue: "",
    searchType2: "companyName",
    searchValue2: "",
    fromDate: "",
    toDate: "",
  });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [clientsData, setclientsData] = useState(null);

  const { data } = useGetClientsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { data: clientsStatsByFilters, refetch: refetchClientsStatByFilters } =
    useGetClientsStatByFiltersQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });

  const { data: clientsActivityStats, refetch: refetchClientsActivity } =
    useGetClientsActivityStatsQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });

  const clients = Array.isArray(clientsData)
    ? clientsData
    : clientsData?.data ?? [];

  const [deleteClient] = useDeleteClientMutation();

  const [updateClient] = useUpdateClientMutation();


  useEffect(() => {
    if (data) {
      setclientsData(data);
    }
  }, [data]);

  // Clients Handlers
  const handleOnDeleteConfirmation = (id) => {
    setIsDeleteOpen(true);
    setDeleteId(id);
  };

  const handleOnDelete = async (id) => {
    try {
      const res = await deleteClient(id).unwrap();
      if (res.success) {
        toast.success(res.message, { duration: 3000 });
        await refetchClientsStatByFilters();
        await refetchClientsActivity();
      }
    } catch (err) {
      toast.error(err.data.message, { duration: 3000 });
    }
  };

  const handleOnEdit = (client) => {
    setEditingClient(client);
    setIsEditOpen(true);
  };

  const handleSaveClient = async (updatedData) => {
    try {
      const res = await updateClient({
        id: editingClient._id,
        ...updatedData,
      }).unwrap();
      if (res.success) {
        toast.success(res.message, { duration: 3000 });
        setIsEditOpen(false);
        setEditingClient(null);
      }
    } catch (err) {
      toast.error(err.data.message, { duration: 3000 });
    }
  };
  //--------------------->

  const { pageId } = useParams();
  const navigate = useNavigate();

  const clientsPerPage = 8;
  const currentPage = parseInt(pageId) || 1;

  // filters handlers ----------->
  const filteredData = clients.filter((row) => {
    // Search 1
    if (filters.searchValue) {
      const val = filters.searchValue.toLowerCase();
      if (
        filters.searchType === "dealerId" &&
        !row.dealerId?.toString().toLowerCase().includes(val)
      )
        return false;
      if (
        filters.searchType === "name" &&
        !row.name?.toLowerCase().includes(val)
      )
        return false;
      if (
        filters.searchType === "email" &&
        !row.email?.toLowerCase().includes(val)
      )
        return false;
      if (
        filters.searchType === "phone" &&
        !row.phone?.toLowerCase().includes(val)
      )
        return false;
    }

    // Search 2
    if (filters.searchValue2) {
      const val2 = filters.searchValue2.toLowerCase();
      if (
        filters.searchType2 === "companyName" &&
        !(
          row.companyName?.toLowerCase().includes(val2) ||
          row.storeName?.toLowerCase().includes(val2)
        )
      )
        return false;
      if (
        filters.searchType2 === "accountOwner" &&
        !row.accountOwner?.toLowerCase().includes(val2)
      )
        return false;
      if (
        filters.searchType2 === "businessOwner" &&
        !row.businessOwner?.toLowerCase().includes(val2)
      )
        return false;
    }

    // Date range (inclusive)
    if (filters.fromDate) {
      const from = new Date(filters.fromDate);
      from.setHours(0, 0, 0, 0);
      const rowDate = new Date(row.createdAt);
      if (rowDate < from) return false;
    }

    if (filters.toDate) {
      const to = new Date(filters.toDate);
      to.setHours(23, 59, 59, 999);
      const rowDate = new Date(row.createdAt);
      if (rowDate > to) return false;
    }

    return true;
  });

  // Paginate the filtered data
  const totalPages = Math.ceil(filteredData.length / clientsPerPage);
  const startIndex = (currentPage - 1) * clientsPerPage;
  const currentClients = filteredData.slice(startIndex, startIndex + clientsPerPage);

  const handleResetFilters = () => {
    setFilters({
      searchType: "dealerId",
      searchValue: "",
      searchType2: "companyName",
      searchValue2: "",
      fromDate: "",
      toDate: "",
    });
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };
  //---------------------->

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      navigate(`/dashboard/clients/${page}`);
    }
  };

  return (
    <div className="p-1 bg-gray-50 min-h-screen">
      <ClientsHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="">
          <TotalClientsCard clientsStats={clientsStatsByFilters?.data} />
          {/* <TotalClientsCard /> */}
          <StatusOverviewCard clientCount={clientsData?.clientCount} />
        </div>
        <AttendanceChart data={clientsActivityStats?.data} />
      </div>

      <div className="bg-white py-6 px-5 rounded-[10px] shadow-sm mt-5">
        <p className="font-inter font-medium text-[22px] text-dark-text">
          Clients List
        </p>
        <ClientsFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        <div className="mt-5 ">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {currentClients.map((client) => (
              <ClientsDetailCard
                client={client}
                key={client._id}
                onEdit={() => handleOnEdit(client)}
                onDelete={() => handleOnDeleteConfirmation(client._id)}
              />
            ))}
          </div>

          <ClientsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <EditClientsModal
        client={editingClient}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveClient}
      />
      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSave={handleOnDelete}
        id={deleteId}
        data={"Are you sure you want to delete this client?"}
      />
    </div>
  );
};

export default Clients;
