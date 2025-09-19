import React, { useState, useRef } from "react";
import DataTable from "react-data-table-component";
import {
  HiChatBubbleLeftRight,
  HiChevronDown,
  HiOutlineCheck,
  HiOutlineXMark,
} from "react-icons/hi2";

import { MdClose } from "react-icons/md";

import ChatModal from "../../shared/small/ChatModal";
import {
  useUpdateClaimsMutation,
  useUpdateClaimsAdditionalDataMutation,
} from "../../../redux/apis/claimsApis";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

// Custom Status Dropdown styled as button=======
const StatusDropdown = ({ status, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const options = ["PC", "PO", "PQ", "PR", "PA", "CR"];

  // Color logic for button
  let btnColor = "bg-[#FFCC00] text-white";

  if (status === "PC") btnColor = "bg-[#3B82F6] text-white"; // Blue
  else if (status === "PO") btnColor = "bg-[#22C55E] text-white"; // Green
  else if (status === "PQ") btnColor = "bg-[#F97316] text-white"; // Orange
  else if (status === "PR") btnColor = "bg-[#A855F7] text-white"; // Purple
  else if (status === "PA") btnColor = "bg-[#EAB308] text-black";
  // Yellow (better contrast with black text)
  else if (status === "CR") btnColor = "bg-[#EF4444] text-white"; // Red

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="w-full relative inline-block" ref={ref}>
      <button
        type="button"
        className={`flex items-center gap- ${btnColor} font-semibold rounded-lg px-2 py-2 text-sm w-full justify-between focus:outline-none shadow`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-xs text-nowrap truncate max-w-fit">{status}</span>
        <HiChevronDown className="text-sm" />
      </button>
      {open && (
        <div className="absolute left-0 z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200">
          {options.map((opt) => {
            let optColor = "";
            if (opt === "Rejected") optColor = "bg-red-500 text-white";
            else if (opt === "Appealed") optColor = "bg-blue-500 text-white";
            else if (opt === status) optColor = "bg-[#FFCC00] text-white";
            return (
              <div
                key={opt}
                className={`px-4 py-2 text-xs cursor-pointer hover:bg-[#FFCC00]  hover:text-white rounded-lg ${
                  opt === status ? optColor : "text-gray-800"
                }`}
                onClick={() => {
                  setOpen(false);
                  if (onChange) onChange(opt);
                }}
              >
                {opt}
              </div>
            );
          })}
        </div>
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
};

const ClaimsDataTable = ({ data, onSelectionChange, archived = false }) => {
  const [tableData, setTableData] = useState(data);
  const [chatUser, setChatUser] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [updateClaims] = useUpdateClaimsMutation();
  const [updateClaimsAdditionalData] = useUpdateClaimsAdditionalDataMutation();
  const [editingCell, setEditingCell] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const [infoModal, setInfoModal] = useState(null);
  const [infoModalTitle, setInfoModalTitle] = useState(null);

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
    console.log("new status", newStatus);
    try {
      const res = await updateClaims({
        id: row._id,
        status: newStatus,
        archived: archived,
      }).unwrap();
      toast.success(res.message, { duration: 3000 });
    } catch (err) {
      toast.error(err.data.message, { duration: 3000 });
    }
  };

  const handleClaimsUpdate = async (rowId, claimField, claimValue) => {
    const claimData = {
      claimField: claimField,
      claimValue: claimValue,
    };
    try {
      const res = await updateClaimsAdditionalData({
        id: rowId,
        claimData: claimData,
      }).unwrap();
      toast.success(res.message, { duration: 3000 });
    } catch (err) {
      toast.error(err.data.message, { duration: 3000 });
    }
  };

  const handleChatClose = () => {
    setShowChat(null);
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
      minWidth: "150px",
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
      width: "130px",
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
      minWidth: "250px",
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
      minWidth: "200px",
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
      minWidth: "200px",
    });
  }

  columns.push({
    name: "Actions",
    cell: (row) => (
      <button className="text-primary">
        <HiChatBubbleLeftRight
          fill="#043655"
          onClick={() => {
            setChatUser(row);
            setShowChat(true);
          }}
          size={30}
        />
      </button>
    ),
    right: true,
    width: "100px",
  });

  return (
    <div className="p-2 overflow-auto w-[97vw] md:w-[98vw] xl:w-[100%] rounded-lg bg-white shadow mt-5 mb-10">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Recent Claims
      </h2>
      <div className="w-[100%]">
        <DataTable
          columns={columns}
          data={tableData}
          selectableRows
          pagination
          highlightOnHover
          customStyles={customStyles}
          className="border- p-1 bg-white"
          onSelectedRowsChange={({ selectedRows }) => {
            onSelectionChange(selectedRows);
          }}
        />
      </div>
      <div>
        {showChat && (
          <ChatModal
            setAnimateIn={setAnimateIn}
            animateIn={animateIn}
            isOpen={!!showChat}
            onClose={handleClose}
            user={chatUser}
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
    </div>
  );
};
export default ClaimsDataTable;
