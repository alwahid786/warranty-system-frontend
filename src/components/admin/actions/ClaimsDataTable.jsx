import React, { useState, useRef } from "react";
import DataTable from "react-data-table-component";
import { HiChatBubbleLeftRight, HiChevronDown } from "react-icons/hi2";
import ChatModal from "../../shared/small/ChatModal";
import { useUpdateClaimsMutation } from "../../../redux/apis/claimsApis";
import toast from "react-hot-toast";

// Custom Status Dropdown styled as button
const StatusDropdown = ({ status, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const options = [
    "Pending Credit",
    "Pending Correction",
    "Pending Question",
    "Pending Analysis",
    "Rejected",
    "Appealed",
  ];

  // Color logic for button
  let btnColor = "bg-[#FFCC00] text-white";
  if (status === "Rejected") btnColor = "bg-red-500 text-white";
  else if (status === "Appealed") btnColor = "bg-blue-500 text-white";

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

  // Handler to update status for a row
  const handleStatusChange = async (rowIdx, newStatus, row) => {
    setTableData((prev) =>
      prev.map((row, idx) =>
        idx === rowIdx ? { ...row, status: newStatus } : row
      )
    );

    if (newStatus === "Pending Credit") {
      try {
        const res = await updateClaims({
          id: row._id,
          status: "Pending Credit",
          archived: archived,
        }).unwrap();
        toast.success(res.message, { duration: 3000 });
      } catch (err) {
        toast.error(err.data.message, { duration: 3000 });
      }
    }
  };

  const handleChatClose = () => {
    setShowChat(null);
  };

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => {
      handleChatClose();
    }, 1000); // Match duration-500
  };

  React.useEffect(() => {
    setTableData(data);
  }, [data]);

  // Table columns
  const columns = [
    {
      name: "Claim ID",
      selector: (row) => row.claimId,
      cell: (row) => (
        <span className="text-dark font-normal text-xs ">{row.claimId}</span>
      ),
      sortable: true,
    },
    {
      name: "User Name",
      selector: (row) => row.userName,
      cell: (row) => (
        <span className="text-dark font-normal text-xs ">{row.userName}</span>
      ),
      sortable: true,
    },
    {
      name: "Car Brand",
      selector: (row) => row.carBrand,
      cell: (row) => (
        <span className="text-dark font-normal text-xs ">{row.carBrand}</span>
      ),
      sortable: true,
    },
    {
      name: "Claim Date",
      selector: (row) => row.claimDate,
      cell: (row) => (
        <span className="text-dark font-normal text-xs ">{row.claimDate}</span>
      ),
      sortable: true,
    },
    {
      name: "Notes",
      selector: (row) => row.notes,
      cell: (row) => (
        <span className="text-dark font-normal text-xs ">{row.notes}</span>
      ),
      sortable: false,
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
    },
    {
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
    },
  ];

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
    </div>
  );
};
export default ClaimsDataTable;
