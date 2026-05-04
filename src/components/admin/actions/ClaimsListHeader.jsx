import { useRef } from "react";

import { MdOutlineFileDownload } from "react-icons/md";
import { LuUpload } from "react-icons/lu";
import toast from "react-hot-toast";
import { saveAs } from "file-saver";

import Button from "../../shared/small/Button";
import { ArchivedIcon } from "../../../assets/icons/icons";
// import ClaimsFilterBar from "./ClaimsFilterBar";
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
  targetClientName = ""
}) => {
  const fileInputRef = useRef(null);
  const [addClaims] = useAddClaimsMutation();
  const [addArchiveClaims] = useAddArchiveClaimsMutation();
  const [removeArchiveClaims] = useRemoveArchiveClaimsMutation();
  const [getExportClaims] = useLazyExportClaimsQuery();

  const handleAddArchiveClaims = async (e) => {
    e.preventDefault();
    let selectedClaimsIds = [];

    selectedClaims.forEach((claim) => {
      selectedClaimsIds.push(claim._id);
    });
    if (showImportExport) {
      try {
        await addArchiveClaims(selectedClaimsIds).unwrap();
        setSelectedClaims([]);
      } catch (err) {
        toast.error(
          err?.data?.message || err?.message || "Something went wrong",
          { duration: 3000 }
        );
      }
    } else {
      try {
        await removeArchiveClaims(selectedClaimsIds).unwrap();
        setSelectedClaims([]);
      } catch (err) {
        toast.error(
          err?.data?.message || err?.message || "Something went wrong",
          { duration: 3000 }
        );
      }
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file && file.type === "text/csv") {
      // send to backend
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
    }
  };

  const handleExportClaims = async () => {
    try {
      const blob = await getExportClaims().unwrap();

      saveAs(blob, "claims_export.csv");
      toast.success("Claims exported successfully", { duration: 3000 });
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
          {/* ClaimsFilterBar below the title/description */}
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
                disabled={claims?.length === 0}
                style={{
                  cursor: claims?.length === 0 ? "not-allowed" : "pointer",
                  opacity: claims?.length === 0 ? 0.6 : 1
                }}
              />
              <div className="flex gap-2 justify-end">
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept=".csv"
                  onChange={handleFileChange}
                />
                <Button
                  icon={
                    <MdOutlineFileDownload className="text-xs sm:text-sm" />
                  }
                  text="Import"
                  bg="bg-primary hover:bg-sky-900"
                  color="text-white"
                  cn="flex !py-2.5 text-xs sm:text-sm justify-center items-center"
                  onClick={() => fileInputRef.current.click()}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ClaimsListHeader;
