import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";

import AttendanceChart from "../../../components/admin/clients/AttendanceChart";
import StatusOverviewCard from "../../../components/admin/clients/OverviewStats";
// import OverviewStats from "../../../components/admin/Clients/OverviewStats";
import TotalClientsCard from "../../../components/admin/clients/TotalClientsCard";
import ClientsDetailCard from "../../../components/admin/clients/ClientsDetailCard";
import ClientsFilterBar from "../../../components/admin//clients/ClientsFilterBar";
// import SummaryCard from "../../../components/admin/Clients/TotalClientsCard";
import ClientsHeader from "../../../components/admin/clients/ClientsHeader";
import ClientsPagination from "../../../components/admin/clients/ClientsPagination";
import {
  useDeleteClientMutation,
  useGetClientsQuery,
  useGetClientsStatByFiltersQuery,
  useGetClientsActivityStatsQuery
} from "../../../redux/apis/clientsApis";
import { useUpdateClientMutation } from "../../../redux/apis/clientsApis";
import ConfirmationModal from "../../../utils/ConfirmationModal";
import EditClientsModal from "../../../components/admin/clients/EditClientsModal";
import { isDateInRange, matchesSearch } from "../../../utils/filterUtils";

const Clients = () => {
  const [filters, setFilters] = useState({
    searchType: "dealerId",
    searchValue: "",
    searchType2: "companyName",
    searchValue2: "",
    fromDate: "",
    toDate: ""
  });

  const [selectedFilter, setSelectedFilter] = useState("This Month");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [clientsData, setclientsData] = useState(null);

  const { data } = useGetClientsQuery(undefined, {
    refetchOnMountOrArgChange: true
  });

  const { data: clientsStatsByFilters, refetch: refetchClientsStatByFilters } =
    useGetClientsStatByFiltersQuery(undefined, {
      refetchOnMountOrArgChange: true
    });

  const { data: clientsActivityStats, refetch: refetchClientsActivity } =
    useGetClientsActivityStatsQuery(undefined, {
      refetchOnMountOrArgChange: true
    });

  const clients = Array.isArray(clientsData)
    ? clientsData
    : (clientsData?.data ?? []);

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
        ...updatedData
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
    if (!matchesSearch(row, filters.searchValue, filters.searchType)) {
      return false;
    }

    // Search 2 (Special case for companyName/storeName)
    if (filters.searchValue2) {
      const val2 = filters.searchValue2.toLowerCase();

      if (filters.searchType2 === "companyName") {
        if (
          !row.companyName?.toLowerCase().includes(val2) &&
          !row.storeName?.toLowerCase().includes(val2)
        ) {
          return false;
        }
      } else if (
        !matchesSearch(row, filters.searchValue2, filters.searchType2)
      ) {
        return false;
      }
    }

    // Date range filter
    if (!isDateInRange(row.createdAt, filters.fromDate, filters.toDate)) {
      return false;
    }

    return true;
  });

  // Paginate the filtered data
  const totalPages = Math.ceil(filteredData.length / clientsPerPage);
  const startIndex = (currentPage - 1) * clientsPerPage;

  const currentClients = filteredData.slice(
    startIndex,
    startIndex + clientsPerPage
  );

  const handleResetFilters = () => {
    setFilters({
      searchType: "dealerId",
      searchValue: "",
      searchType2: "companyName",
      searchValue2: "",
      fromDate: "",
      toDate: ""
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
          <TotalClientsCard
            clientsStats={clientsStatsByFilters?.data}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
          <StatusOverviewCard
            active={
              clientsStatsByFilters?.data?.[
                selectedFilter === "This Week"
                  ? "thisWeek"
                  : selectedFilter === "This Month"
                    ? "thisMonth"
                    : selectedFilter === "This Year"
                      ? "thisYear"
                      : "today"
              ]?.active
            }
            inactive={
              clientsStatsByFilters?.data?.[
                selectedFilter === "This Week"
                  ? "thisWeek"
                  : selectedFilter === "This Month"
                    ? "thisMonth"
                    : selectedFilter === "This Year"
                      ? "thisYear"
                      : "today"
              ]?.inactive
            }
          />
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
            {currentClients.length > 0 ? (
              currentClients.map((client) => (
                <ClientsDetailCard
                  client={client}
                  key={client._id}
                  onEdit={() => handleOnEdit(client)}
                  onDelete={() => handleOnDeleteConfirmation(client._id)}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                <div className="text-gray-400 mb-2">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  No clients found
                </h3>
                <p className="text-gray-500 text-center max-w-xs">
                  Try adjusting your filters or search terms to find what you
                  are looking for.
                </p>
              </div>
            )}
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
