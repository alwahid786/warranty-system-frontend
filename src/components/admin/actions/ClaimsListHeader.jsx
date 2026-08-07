import { useState, useRef } from "react";

import { MdOutlineFileDownload } from "react-icons/md";
import { LuUpload } from "react-icons/lu";
import toast from "react-hot-toast";
import { saveAs } from "file-saver";
import { useSelector } from "react-redux";

import Button from "../../shared/small/Button";
import { ArchivedIcon } from "../../../assets/icons/icons";
import ImportClaimsModal from "./ImportClaimsModal";
import { useAddClaimsMutation } from "../../../redux/apis/claimsApis";
import { useAddArchiveClaimsMutation } from "../../../redux/apis/claimsApis";
import { useRemoveArchiveClaimsMutation } from "../../../redux/apis/claimsApis";
import { useLazyExportClaimsQuery } from "../../../redux/apis/claimsApis";

const ClaimsListHeader = ({
  claims,
  selectedClaims,
  setSelectedClaims,
  showImportExport = true,
  targetClientId = "",
  targetClientName = "",
  clients = []
}) => {
  const { user } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [addClaims] = useAddClaimsMutation();
  const [addArchiveClaims] = useAddArchiveClaimsMutation();
  const [removeArchiveClaims] = useRemoveArchiveClaimsMutation();
  const [getExportClaims] = useLazyExportClaimsQuery();

  const isAdminSide =
    user?.role === "superadmin" ||
    user?.role === "admin" ||
    (user?.role === "user" &&
      ["admin", "superadmin"].includes(user?.owner?.role));

  const handleAddArchiveClaims = async (e) => {
    e.preventDefault();
    let selectedClaimsIds = [];

    selectedClaims.forEach((claim) => {
      selectedClaimsIds.push(claim._id);
    });
    if (showImportExport) {
      try {
        const res = await addArchiveClaims(selectedClaimsIds).unwrap();

        toast.success(res?.message || "Claims archived successfully", {
          duration: 3000
        });
        setSelectedClaims([]);
      } catch (err) {
        toast.error(
          err?.data?.message || err?.message || "Something went wrong",
          { duration: 3000 }
        );
      }
    } else {
      try {
        const res = await removeArchiveClaims(selectedClaimsIds).unwrap();

        toast.success(res?.message || "Claims unarchived successfully", {
          duration: 3000
        });
        setSelectedClaims([]);
      } catch (err) {
        toast.error(
          err?.data?.message || err?.message || "Something went wrong",
          { duration: 3000 }
        );
      }
    }
  };

  const handleDirectFileChange = async (e) => {
    const file = e.target.files?.[0];

    if (file && (file.type === "text/csv" || file.name.endsWith(".csv"))) {
      const formData = new FormData();

      formData.append("file", file);
      if (targetClientId) {
        formData.append("targetClientId", targetClientId);
      }
      try {
        const response = await addClaims(formData).unwrap();

        toast.success(response.message || "Claims imported successfully", {
          duration: 3000
        });
      } catch (err) {
        toast.error(
          err?.data?.message || err?.message || "Something went wrong",
          { duration: 3000 }
        );
      }
    } else if (file) {
      toast.error("Please upload a valid CSV file", { duration: 3000 });
    }

    if (e.target) {
      e.target.value = null;
    }
  };

  const handleImportSubmit = async (formData) => {
    try {
      const response = await addClaims(formData).unwrap();

      toast.success(response.message || "Claims imported successfully", {
        duration: 3000
      });
    } catch (err) {
      toast.error(
        err?.data?.message || err?.message || "Something went wrong",
        { duration: 3000 }
      );
      throw err;
    }
  };

  const handleImportClick = () => {
    if (isAdminSide) {
      setIsImportModalOpen(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleExportClaims = async () => {
    if (!selectedClaims || selectedClaims.length === 0) {
      toast.error("Please select claims to export", { duration: 3000 });

      return;
    }

    try {
      const selectedClaimIds = selectedClaims.map((claim) => claim._id);
      const blob = await getExportClaims(selectedClaimIds).unwrap();

      saveAs(blob, "claims_export.csv");
      toast.success(
        `${selectedClaims.length} claim${selectedClaims.length > 1 ? "s" : ""} exported successfully`,
        { duration: 3000 }
      );
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Failed to export", {
        duration: 3000
      });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center p- rounded-md">
        {/* Title & Description */}
        <div className="">
          <h2 className="text-2xl font-medium font-inter text-primary">
            {targetClientName ? `${targetClientName} Claims` : "Claims List"}
          </h2>
          <p className="text-sm font-inter font-medium text-secondary">
            Review, update, and organize user-submitted warranty claims. Use
            filters to sort by status, date, or brand.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 justify-start lg:justify-end flex-wrap items-center">
          <Button
            icon={<ArchivedIcon className="text-xs sm:text-sm" />}
            text={showImportExport ? "Move To Archive" : "Move Out of Archive"}
            bg="bg-[#04365599] hover:bg-slate-600"
            color="text-white"
            disabled={claims?.length === 0 || selectedClaims?.length === 0}
            style={{
              cursor: selectedClaims?.length === 0 ? "not-allowed" : "pointer",
              opacity: selectedClaims?.length === 0 ? 0.6 : 1
            }}
            onClick={handleAddArchiveClaims}
            cn="flex !py-2.5 text-xs sm:text-sm justify-center items-center truncate"
          />

          {showImportExport && (
            <>
              <Button
                icon={<LuUpload className="text-xs sm:text-sm" />}
                text="Export"
                bg="bg-[#04365599] hover:bg-slate-600"
                color="text-white"
                cn="flex !py-2.5 text-xs sm:text-sm justify-center items-center"
                onClick={handleExportClaims}
                disabled={selectedClaims?.length === 0}
                style={{
                  cursor:
                    selectedClaims?.length === 0 ? "not-allowed" : "pointer",
                  opacity: selectedClaims?.length === 0 ? 0.6 : 1
                }}
              />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".csv"
                onChange={handleDirectFileChange}
              />
              <Button
                icon={<MdOutlineFileDownload className="text-xs sm:text-sm" />}
                text="Import"
                bg="bg-primary hover:bg-sky-900"
                color="text-white"
                cn="flex !py-2.5 text-xs sm:text-sm justify-center items-center"
                onClick={handleImportClick}
              />
            </>
          )}
        </div>
      </div>

      {/* Import Modal Component for Admin / Admin Sub-Users */}
      {isAdminSide && (
        <ImportClaimsModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          clients={clients}
          defaultClientId={targetClientId}
          onImport={handleImportSubmit}
        />
      )}
    </>
  );
};

export default ClaimsListHeader;
