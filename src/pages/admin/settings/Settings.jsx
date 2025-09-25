import React, { useRef, useState, useEffect } from "react";
import { MdUploadFile } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa6";
import Button from "../../../components/shared/small/Button";
import Input from "../../../components/shared/small/input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Dropdown from "../../../components/shared/small/Dropdown";
import { useGetMyProfileQuery } from "../../../redux/apis/authApis";
import { useUpdateMyProfileMutation } from "../../../redux/apis/authApis";
import { useDispatch, useSelector } from "react-redux";
import { userExist, userNotExist } from "../../../redux/slices/authSlice";
import toast from "react-hot-toast";

const Settings = () => {
  const user = useSelector((state) => state.auth.user);
  const imageInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(
    user?.image?.url || "/profile-pic.png"
  );
  const {
    data,
    isLoading: isLoadingForGetMyProfile,
    refetch: getMyProfileRefetch,
  } = useGetMyProfileQuery();
  const [updateProfile, { isLoading }] = useUpdateMyProfileMutation();
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (data?.data) {
      dispatch(userExist(data.data));
    }
  }, [data, dispatch]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "Male",
    companyName: "",
    designation: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "Male",
        companyName: user.companyName || user.storeName || "",
        designation: user.designation || "",
      });
      if (user?.image?.url) setImageSrc(user?.image?.url);
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImageSrc(URL.createObjectURL(file));
    }
  };

  const onImageInputClick = () => imageInputRef.current.click();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "Male",
        companyName: user.companyName || user.storeName || "",
        designation: user.designation || "",
      });
      if (user.image) setImageSrc(user.image.url);
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
      });
      if (selectedFile) {
        form.append("file", selectedFile);
      }
      const res = await updateProfile(form).unwrap();
      if (res.success) {
        await getMyProfileRefetch();
        toast.success(res.message, { duration: 3000 });
      }
    } catch (err) {
      toast.error(err.data.message, { duration: 3000 });
    }
    setIsEditing(false);
  };

  return (
    <div className="bg-white shadow-md">
      {/* Banner */}
      <div
        style={{
          background: 'url("/Frame.png")',
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
        }}
        className="h-29 flex justify-end px-4 py-3"
      ></div>

      {/* Profile Section */}
      <div className="relative -top-19">
        <div className="px-6 flex flex-col gap-4">
          <div className="w-29 h-29 rounded-full">
            <img src={imageSrc} alt="" className="w-full h-full rounded-full" />
          </div>
          <div className="flex flex-col sm:flex-row gap-5 items-start justify-between">
            <div className="flex flex-col gap-2">
              <p className="font-bold text-3xl text-[#1E293B]">
                {formData.name}
              </p>
              <p className="text-[18px] text-[#475569]">{formData.email}</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="mt-6 px-5 lg:px-15 gap-5 grid grid-cols-11">
          <div className="col-span-11 md:col-span-3 flex flex-col gap-1">
            <h3 className="text-base font-bold text-[#1E293B]">
              Personal Info
            </h3>
            <p className="text-sm text-[#475569]">
              You can change your personal information here.
            </p>
          </div>

          <div className="col-span-11 md:col-span-8 p-4 bg-white border grid grid-cols-2 gap-5 rounded">
            {/* Full Name */}
            <div className="col-span-2 md:col-span-1">
              <Input
                className={`bg-white border ${
                  !isEditing && "cursor-not-allowed"
                }`}
                label="Full Name"
                value={formData.name}
                readOnly={!isEditing}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="col-span-2 md:col-span-1">
              <Input
                className={`bg-white border cursor-not-allowed`}
                label="Email Address"
                value={formData.email}
                readOnly={true}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            {/* Phone */}
            <div className="col-span-2 md:col-span-1 flex flex-col gap-2">
              <label className="text-sm text-dark-text">Phone No</label>
              <PhoneInput
                value={formData.phone}
                country={"pk"}
                onChange={(value) => handleChange("phone", value)}
                disabled={!isEditing}
                inputClass={`!outline-none !border !border-[#e5e5e5] !h-[50px] !rounded-md !w-full !text-sm !text-[#535353] !bg-white ${
                  !isEditing && "cursor-not-allowed"
                }`}
              />
            </div>

            {/* Gender */}
            <div className="col-span-2 md:col-span-1 flex flex-col gap-2">
              <label className="text-sm text-dark-text">Gender</label>
              <Dropdown
                options={[
                  { id: 1, name: "Male" },
                  { id: 2, name: "Female" },
                  { id: 3, name: "Other" },
                ]}
                defaultValue={{ name: formData.gender }}
                onChange={(opt) => handleChange("gender", opt.name)}
                className="!py-3.5"
                width="w-full"
                disabled={!isEditing}
              />
            </div>

            {/* Company Name */}
            <div className="col-span-2 md:col-span-1">
              <Input
                className={`bg-white border ${
                  !isEditing && "cursor-not-allowed"
                }`}
                label="Company Name"
                value={formData.companyName}
                readOnly={!isEditing}
                onChange={(e) => handleChange("companyName", e.target.value)}
              />
            </div>

            {/* Designation */}
            <div className="col-span-2 md:col-span-1">
              <Input
                className={`bg-white border ${
                  !isEditing && "cursor-not-allowed"
                }`}
                label="Designation"
                value={formData.designation}
                readOnly={!isEditing}
                onChange={(e) => handleChange("designation", e.target.value)}
              />
            </div>

            {/* Image Upload */}
            {isEditing && (
              <div className="col-span-2 grid grid-cols-12 gap-5 pb-4">
                <div className="flex flex-col items-center gap-2 col-span-12 md:col-span-4">
                  <p>Change Profile</p>
                  <div className="rounded-full w-25 h-25">
                    <img
                      src={imageSrc}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                </div>
                <div className="col-span-12 md:col-span-8">
                  <div
                    onClick={onImageInputClick}
                    className="mt-2 flex h-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 hover:border-[#043655]"
                  >
                    <div className="bg-[#EEF2FF] rounded-full flex items-center justify-center h-10 w-10">
                      <MdUploadFile size={23} fill="#043655" />
                    </div>
                    <p className="mt-2 text-xs text-[#475569]">
                      <span className="text-[#043655] font-bold">
                        Click here
                      </span>{" "}
                      to upload your file or drag.
                    </p>
                    <p className="text-sm font-medium text-[#94A3B8]">
                      Supported Format: SVG, JPG, PNG (10mb each)
                    </p>
                    <input
                      onChange={handleImageChange}
                      type="file"
                      className="hidden"
                      ref={imageInputRef}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-5 col-span-11 justify-self-end mt-4">
            {!isEditing ? (
              <Button
                text="Edit"
                cn="!py-2"
                onClick={() => setIsEditing(true)}
              />
            ) : (
              <>
                <Button
                  text="Cancel"
                  cn="!bg-[#B1B1B1] !py-2 hover:!bg-gray-400"
                  onClick={handleCancel}
                />
                <Button text="Save" cn="!py-2" onClick={handleSave} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
