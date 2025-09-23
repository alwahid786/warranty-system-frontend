import { FaArchive, FaUpload, FaDownload } from "react-icons/fa";
import { MdOutlineFileDownload } from "react-icons/md";
import { LuUpload } from "react-icons/lu";
import Button from "../../shared/small/Button";
import { ArchievedIcon } from "../../../assets/icons/icons";
// import ClaimsFilterBar from "./ClaimsFilterBar";
import { useRef } from "react";
import { useAddClaimsMutation } from "../../../redux/apis/claimsApis";
import { useAddArchieveClaimsMutation } from "../../../redux/apis/claimsApis";
import { useRemoveArchieveClaimsMutation } from "../../../redux/apis/claimsApis";
import toast from "react-hot-toast";
import { saveAs } from "file-saver";
import { useLazyExportClaimsQuery } from "../../../redux/apis/claimsApis";
import { useSelector } from "react-redux";

const ClaimsListHeader = ({ selectedClaims, showImportExport = true }) => {
  const fileInputRef = useRef(null);
  const [addClaims] = useAddClaimsMutation();
  const [addArchieveClaims] = useAddArchieveClaimsMutation();
  const [removeArchieveClaims] = useRemoveArchieveClaimsMutation();
  const [getExportClaims] = useLazyExportClaimsQuery();
  const { user } = useSelector((state) => state.auth);

  const handleAddArchieveClaims = async (e) => {
    e.preventDefault();
    let selectedClaimsIds = [];
    selectedClaims.forEach((claim) => {
      selectedClaimsIds.push(claim._id);
    });
    if (showImportExport) {
      try {
        const res = await addArchieveClaims(selectedClaimsIds).unwrap();
        toast.success(res.message, { duration: 3000 });
      } catch (err) {
        toast.error(err.data.message, { duration: 3000 });
      }
    } else {
      try {
        const res = await removeArchieveClaims(selectedClaimsIds).unwrap();
        toast.success(res.message, { duration: 3000 });
      } catch (err) {
        toast.error(err.data.message, { duration: 3000 });
      }
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      // send to backend
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await addClaims(formData).unwrap();
        if (res.success) {
          toast.success(res.message, { duration: 3000 });
        }
      } catch (err) {
        toast.error(err.data.message, { duration: 3000 });
      }
    }
  };

  const handleExportClaims = async () => {
    try {
      const blob = await getExportClaims().unwrap();
      saveAs(blob, "claims_export.csv");
      toast.success(res.message || "Claims exported", { duration: 3000 });
    } catch (err) {
      toast.error(err.data.message || "Failed to export", { duration: 3000 });
    }
  };
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center p- rounded-md">
        {/* Title & Description */}
        <div className="">
          <h2 className="text-2xl font-medium font-inter text-primary">
            Claims List
          </h2>
          <p className="text-sm font-inter font-medium text-secondary">
            Review, update, and organize user-submitted warranty claims. Use
            filters to sort by status, date, or brand.
          </p>
          {/* ClaimsFilterBar below the title/description */}
        </div>

        {/* Buttons */}
        <div className="flex gap-1 sm:gap-2 justify-end">
          {user?.role === "admin" && (
            <Button
              icon={<ArchievedIcon className="text-xs sm:text-sm" />}
              text={
                showImportExport ? "Move To Archive" : "Move Out of Archive"
              }
              bg="bg-[#04365599] hover:bg-slate-600"
              color="text-white"
              disabled={selectedClaims?.length === 0}
              style={{
                cursor:
                  selectedClaims?.length === 0 ? "not-allowed" : "pointer",
                opacity: selectedClaims?.length === 0 ? 0.6 : 1,
              }}
              onClick={handleAddArchieveClaims}
              cn="flex !py-2.5 text-xs sm:text-sm justify-center items-center truncate"
            />
          )}

          {showImportExport && (
            <>
              <Button
                icon={<LuUpload className="text-xs sm:text-sm" />}
                text="Export"
                bg="bg-[#04365599] hover:bg-slate-600"
                color="text-white"
                cn="flex !py-2.5 text-xs sm:text-sm justify-center items-center"
                onClick={handleExportClaims}
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
