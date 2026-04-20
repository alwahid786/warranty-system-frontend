import React, { useState, useRef, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  HiChatBubbleLeftRight,
  HiChevronDown,
  HiOutlinePencil,
  HiOutlineTrash,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi2";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import ChatModal from "../../shared/small/ChatModal";
import {
  useUpdateClaimsMutation,
  useUpdateClaimsAdditionalDataMutation,
  useDeleteClaimMutation,
} from "../../../redux/apis/claimsApis";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import EditClaimsModal from "./EditClaimsModal";
import ConfirmationModal from "../../../utils/ConfirmationModal";
import { createPortal } from "react-dom";

const normalizeId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value.$oid) return value.$oid;
  if (typeof value?.toString === "function") return value.toString();
  return String(value);
};

// Custom Status Dropdown styled as button=
const StatusDropdown = ({ status, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const dropdownRef = useRef();
  const options = ["PC", "PO", "PQ", "PR", "PA", "CR"];

  // Button color logic
  let btnColor = "bg-[#FFCC00] text-white";
  if (status === "PC") btnColor = "bg-[#3B82F6] text-white";
  else if (status === "PO") btnColor = "bg-[#22C55E] text-white";
  else if (status === "PQ") btnColor = "bg-[#F97316] text-white";
  else if (status === "PR") btnColor = "bg-[#A855F7] text-white";
  else if (status === "PA") btnColor = "bg-[#EAB308] text-black";
  else if (status === "CR") btnColor = "bg-[#EF4444] text-white";

  // Close on outside click --
  useEffect(() => {
    const handleClick = (e) => {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Positioning
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  useEffect(() => {
    if (open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [open]);

  return (
    <div className="w-full relative inline-block" ref={ref}>
      <button
        type="button"
        className={`flex items-center ${btnColor} font-semibold rounded-lg px-2 py-2 text-sm w-full justify-between focus:outline-none shadow`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-xs truncate">{status}</span>
        <HiChevronDown className="text-sm" />
      </button>

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className="absolute z-[9999] bg-white rounded-lg shadow-lg border border-gray-200"
            style={{
              top: coords.top,
              left: coords.left,
              width: coords.width,
            }}
          >
            {options.map((opt) => (
              <div
                key={opt}
                className={`px-4 py-2 text-xs cursor-pointer hover:bg-[#FFCC00] hover:text-white ${
                  opt === status ? "bg-gray-100 font-semibold" : "text-gray-800"
                }`}
                onClick={() => {
                  setOpen(false);
                  if (onChange) onChange(opt);
                }}
              >
                {opt}
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
};

const customStyles = {
  rows: {
    style: {
      minHeight: "64px",
      padding: "20px 0",
      "&:nth-of-type(even)": {
        backgroundColor: "#f9fafb",
      },
    },
    highlightOnHoverStyle: {
      backgroundColor: "#32B0FF21",
    },
  },
  headCells: {
    style: {
      fontWeight: "bold",
      fontSize: "14px",
    },
  },
  pagination: {
    style: {
      borderTop: "1px solid #e5e7eb",
      minHeight: "56px",
    },
  },
  pageButtonsStyle: {
    borderRadius: "50%",
    height: "40px",
    width: "40px",
    padding: "8px",
    margin: "1px",
    cursor: "pointer",
    transition: "0.4s",
    color: "#043655",
    fill: "#043655",
    backgroundColor: "transparent",
    "&:hover:not(:disabled)": {
      backgroundColor: "#f3f4f6",
    },
    "&:focus": {
      outline: "none",
      backgroundColor: "#f3f4f6",
    },
  },
};


const ClaimsDataTable = ({
  data,
  onSelectionChange,
  archived = false,
  openChatClaimId = null,
  onNotificationChatOpened,
}) => {
  const [tableData, setTableData] = useState(data);
  const [chatUser, setChatUser] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [updateClaims] = useUpdateClaimsMutation();
  const [updateClaimsAdditionalData] = useUpdateClaimsAdditionalDataMutation();
  // const [editingCell, setEditingCell] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const [infoModal, setInfoModal] = useState(null);
  const [infoModalTitle, setInfoModalTitle] = useState(null);
  const [toggleActionsMenu, setToggleActionsMenu] = useState(null);
  const menuRef = useRef(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editClaim, setEditClaim] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteClaimId, setDeleteClaimId] = useState(null);
  const [deleteClaim] = useDeleteClaimMutation();

  const handleShowMore = (title, text) => {
    setInfoModal(text);
    setInfoModalTitle(title);
  };

  // Handler to update status for a row
  const handleStatusChange = async (rowIdx, newStatus, row) => {
    setTableData((prev) =>
      prev.map((row, idx) =>
        idx === rowIdx ? { ...row, status: newStatus } : row
      )
    );
    try {
      await updateClaims({
        id: row._id,
        status: newStatus,
        archived: archived,
      }).unwrap();
    } catch (err) {
      toast.error(err.data.message, { duration: 3000 });
    }
  };

  const handleEdit = (row) => {
    setIsEditModalOpen(true);
    setEditClaim(row);
  };

  const handleDelete = (row) => {
    setIsDeleteOpen(true);
    setDeleteClaimId(row._id);
  };

  const handleDeleteClaim = async (id) => {
    try {
      await deleteClaim(id).unwrap();
    } catch (err) {
      toast.error(err.data.message, { duration: 3000 });
    }
  };

  const handleOnSubmit = async (updatedClaim) => {
    try {
      await updateClaimsAdditionalData({
        id: updatedClaim._id,
        claimData: updatedClaim,
      }).unwrap();
    } catch (err) {
      toast.error(err.data.message, { duration: 3000 });
    }
  };

  const handleChatClose = () => {
    setShowChat(null);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setEditClaim(null);
  };

  const handleDeleteClose = () => {
    setIsDeleteOpen(false);
    setDeleteClaimId(null);
  };

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => {
      handleChatClose();
    }, 1000);
  };

  React.useEffect(() => {
    setTableData(data);
  }, [data]);

  useEffect(() => {
    if (!openChatClaimId || !Array.isArray(data) || data.length === 0) return;

    const matchedClaim = data.find(
      (row) => normalizeId(row?._id) === normalizeId(openChatClaimId)
    );

    if (!matchedClaim) return;

    setChatUser(matchedClaim);
    setShowChat(true);
    onNotificationChatOpened?.();
  }, [data, openChatClaimId, onNotificationChatOpened]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setToggleActionsMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Table columns--------
  const columns = [
    {
      name: "RO Information",
      selector: (row) => row,
      cell: (row) => (
        <div className="flex flex-col gap-1.5">
          <span className="text-dark font-normal text-xs ">
            RO Number: {row.roNumber}
          </span>
          <span className="text-dark font-normal text-xs ">
            RO Suffix: {row.roSuffix}
          </span>
          <span className="text-dark font-normal text-xs ">
            RO Date: {row.roDate}
          </span>
        </div>
      ),
      sortable: false,
      grow: 2,
      width: "200px",
    },
    {
      name: "Job #",
      selector: (row) => row.jobNumber,
      cell: (row) => (
        <span className="text-dark font-normal text-xs ">{row.jobNumber}</span>
      ),
      sortable: true,
      width: "90px",
    },
    {
      name: "Quoted",
      selector: (row) => row.quoted,
      cell: (row) => (
        <span className="text-dark font-normal text-xs ">{row.quoted}</span>
      ),
      sortable: true,
      width: "110px",
    },
    {
      name: "Status",
      cell: (row, idx) => (
        <StatusDropdown
          status={row.status}
          onChange={(newStatus) => handleStatusChange(idx, newStatus, row)}
        />
      ),
      sortable: false,
      width: "100px",
    },
    {
      name: "Entry Date",
      selector: (row) => row.entryDate,
      cell: (row) => (
        <span className="text-dark font-normal text-xs ">{row.entryDate}</span>
      ),
      sortable: false,
      width: "110px",
    },
    {
      name: "Entry By",
      selector: (row) => row.owner,
      cell: (row) => {
        const owner = row.owner;
        if (!owner) return <span className="text-xs">Unknown</span>;
        if (owner.role === "admin")
          return <span className="text-xs font-semibold">Admin</span>;
        const displayName =
          owner.role === "user"
            ? owner.owner?.companyName || owner.owner?.name || owner.name
            : owner.companyName || owner.name;

        return <span className="text-xs">{displayName}</span>;
      },
      sortable: true,
      width: "129px",
    },
    {
      name: "Error Description",
      selector: (row) => row?.errorDescription,
      cell: (row) => (
        <div
          className="flex items-center text-dark font-normal text-xs max-w-[150px]"
          title={row.errorDescription}
        >
          <span className="truncate">
            {row.errorDescription.length > 30
              ? row.errorDescription.slice(0, 30) + "..."
              : row.errorDescription}
          </span>
          {row.errorDescription && (
            <button
              onClick={() =>
                handleShowMore("Error Description", row.errorDescription)
              }
              className="ml-1 text-blue-500 hover:underline shrink-0"
            >
              View
            </button>
          )}
        </div>
      ),
      grow: 3,
      width: "180px",
    },
    {
      name: "Additional Information",
      selector: (row) => row?.additionalInfo,
      cell: (row) => (
        <div
          className="flex items-center text-dark font-normal text-xs max-w-[150px]"
          title={row.additionalInfo}
        >
          <span className="truncate">
            {row.additionalInfo.length > 30
              ? row.additionalInfo.slice(0, 30) + "..."
              : row.additionalInfo}
          </span>
          {row.additionalInfo && (
            <button
              onClick={() =>
                handleShowMore("Additional Information", row.additionalInfo)
              }
              className="ml-1 text-blue-500 hover:underline shrink-0"
            >
              View
            </button>
          )}
        </div>
      ),
      grow: 2,
      width: "190px",
    },
  ];

  // to show internal notes to admin only
  if (user?.role === "admin") {
    columns.push({
      name: "Internal Notes",
      selector: (row) => row?.internalNotes,
      cell: (row) => (
        <div
          className="flex items-center text-dark font-normal text-xs max-w-[150px]"
          title={row.internalNotes}
        >
          <span className="truncate">
            {row.internalNotes.length > 30
              ? row.internalNotes.slice(0, 30) + "..."
              : row.internalNotes}
          </span>
          {row.internalNotes && (
            <button
              onClick={() =>
                handleShowMore("Internal Notes", row.internalNotes)
              }
              className="ml-1 text-blue-500 hover:underline shrink-0"
            >
              View
            </button>
          )}
        </div>
      ),
      grow: 2,
      width: "130px",
    });
  }

  columns.push({
    name: "Actions",
    cell: (row) => (
      <div className="relative flex justify-end w-full">
        <button
          className="relative p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
          onClick={() =>
            setToggleActionsMenu(
              toggleActionsMenu?._id === row._id ? null : row
            )
          }
        >
          <HiOutlineDotsVertical className="text-gray-600" size={20} />
          {row.unreadChatCount > 0 && (
            <span className="absolute top-1 right-1 h-3 w-3 bg-red-600 rounded-full border-2 border-white shadow-sm animate-pulse"></span>
          )}
        </button>

        {toggleActionsMenu?._id === row._id && (
          <div
            ref={menuRef}
            className="absolute bottom-12 right-0 mt-2 w-40 bg-white border rounded-xl shadow-xl z-[9999] overflow-hidden py-1"
          > 
            <button
              onClick={() => {
                handleEdit(row);
                setToggleActionsMenu(null);
              }}
              className="flex items-center w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors duration-150"
            >
              <HiOutlinePencil
                size={20}
                className="mr-3 text-yellow-600"
              />
              Edit Claim
            </button>
            <button
              onClick={() => {
                handleDelete(row);
                setToggleActionsMenu(null);
              }}
              className="flex items-center w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-red-50 text-red-500 transition-colors duration-150"
            >
              <HiOutlineTrash
                size={20}
                className="mr-3 text-red-600"
              />
              Delete
            </button>
            <button
              onClick={() => {
                setChatUser(row);
                setShowChat(true);
                setToggleActionsMenu(null);
              }}
              className="flex items-center w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 hover:text-primary transition-colors duration-150"
            >
              <HiChatBubbleLeftRight
                size={20}
                className="mr-3 text-primary"
              />
              <span className="flex-1">Chat</span>
              {row.unreadChatCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                  {row.unreadChatCount}
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    ),
    width: "100px",
  });

  return (
    <div className="p-2 overflow-hidden w-full rounded-lg bg-white shadow mt-5 mb-10">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Recent Claims
      </h2>
      <div className="w-full">
        <div className="w-full overflow-x-auto">
          {" "}
          <DataTable
            columns={columns}
            data={tableData}
            selectableRows
            pagination
            highlightOnHover
            customStyles={customStyles}
            className="border- p-1 bg-white relative z-5 "
            onSelectedRowsChange={({ selectedRows }) => {
              onSelectionChange(selectedRows);
            }}
            paginationComponentOptions={{
              rowsPerPageText: "Rows per page:",
              rangeSeparatorText: "of",
              noRowsPerPage: false,
              selectAllRowsItem: false,
              selectAllRowsItemText: "All",
            }}
            paginationIconNext={<HiChevronRight size={20} />}
            paginationIconPrevious={<HiChevronLeft size={20} />}
          />
        </div>
      </div>
      <div>
        {showChat && (
          <ChatModal
            setAnimateIn={setAnimateIn}
            animateIn={animateIn}
            isOpen={!!showChat}
            onClose={handleClose}
            row={chatUser}
            forInvoice={false}
          />
        )}
      </div>
      <div>
        {infoModal && (
          <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-50">
            <div className="relative bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
              <button
                onClick={() => setInfoModal(null)}
                className="absolute top-3 right-3 text-gray-700 hover:text-gray-500"
              >
                <MdClose className="text-2xl" />
              </button>

              <div className="flex flex-col gap-2 text-center">
                <h3 className="font-semibold mb-2">{infoModalTitle}</h3>
                <p className="text-sm text-gray-700">{infoModal}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      {isEditModalOpen && (
        <EditClaimsModal
          isOpen={isEditModalOpen}
          onClose={handleEditClose}
          claim={editClaim}
          isAdmin={user.role === "admin" ? true : false}
          onSubmit={handleOnSubmit}
        />
      )}
      {isDeleteOpen && (
        <ConfirmationModal
          isOpen={isDeleteOpen}
          onClose={handleDeleteClose}
          onSave={handleDeleteClaim}
          data="Are you sure you want to delete this claim?"
          id={deleteClaimId}
        />
      )}
    </div>
  );
};
export default ClaimsDataTable;
