import React, { useRef, useState, useEffect } from "react";

import { MdUploadFile } from "react-icons/md";
import { Eye, EyeOff } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import Button from "../../../components/shared/small/Button";
import Input from "../../../components/shared/small/input";
import "react-phone-input-2/lib/style.css";
import Dropdown from "../../../components/shared/small/Dropdown";
import { useGetMyProfileQuery } from "../../../redux/apis/authApis";
import { useUpdateMyProfileMutation } from "../../../redux/apis/authApis";
import { userExist } from "../../../redux/slices/authSlice";
import Loader from "../../../components/shared/small/Loader";
import { getInitials } from "../../../utils/getInitials";

const Settings = () => {
  const user = useSelector((state) => state.auth.user);
  const isClient = user?.role === "client";
  const canEditCompanyName = user?.role === "admin" || user?.role === "client";
  const imageInputRef = useRef(null);

  const [imageSrc, setImageSrc] = useState(user?.image?.url || "");
  const [showPassword, setShowPassword] = useState(false);

  const { data, isLoading: isLoadingForGetMyProfile } = useGetMyProfileQuery(
    undefined,
    {
      skip: !!user?._id,
      refetchOnMountOrArgChange: false
    }
  );

  const [updateProfile, { isLoading }] = useUpdateMyProfileMutation();
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (!data?.data) return;
    if (!user?._id || data.data._id !== user._id) {
      dispatch(userExist(data.data));
    }
  }, [data, dispatch, user]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    gender: "",
    companyName: "",
    designation: "",
    dealerId: "",
    storeName: "",
    address: {
      store: "",
      street: "",
      area: "",
      city: "",
      state: "",
      country: "",
      zip: ""
    },
    storePhone: "",
    emails: [""],
    accountOwner: "",
    businessOwner: ""
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
        gender: user.gender || "",
        companyName:
          user.role === "user"
            ? user.inheritedCompanyName || ""
            : user.companyName || user.storeName || "",
        designation: user.designation || "",
        dealerId: user.dealerId || "",
        storeName: user.storeName || user.address?.store || "",
        address: {
          store: user.address?.store || user.storeName || "",
          street: user.address?.street || "",
          area: user.address?.area || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          country: user.address?.country || "",
          zip: user.address?.zip || ""
        },
        storePhone: user.storePhone || "",
        emails:
          Array.isArray(user.emails) && user.emails.length > 0
            ? user.emails
            : [""],
        accountOwner: user.accountOwner || "",
        businessOwner: user.businessOwner || ""
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

  const handleAddressChange = (field, value) => {
    let filteredValue = value;

    if (field === "city" || field === "state") {
      filteredValue = value.replace(/[^a-zA-Z\s]/g, "");
    } else if (field === "zip") {
      filteredValue = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: filteredValue }
    }));
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
        gender: user.gender || "",
        companyName:
          user.role === "user"
            ? user.inheritedCompanyName || ""
            : user.companyName || user.storeName || "",
        designation: user.designation || "",
        dealerId: user.dealerId || "",
        storeName: user.storeName || user.address?.store || "",
        address: {
          store: user.address?.store || user.storeName || "",
          street: user.address?.street || "",
          area: user.address?.area || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          country: user.address?.country || "",
          zip: user.address?.zip || ""
        },
        storePhone: user.storePhone || "",
        emails:
          Array.isArray(user.emails) && user.emails.length > 0
            ? user.emails
            : [""],
        accountOwner: user.accountOwner || "",
        businessOwner: user.businessOwner || ""
      });
      if (user.image) setImageSrc(user.image.url);
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "address") {
          form.append("address", JSON.stringify(formData.address));
        } else if (key === "emails") {
          const filteredEmails = formData.emails.filter((e) => e.trim() !== "");

          form.append("emails", JSON.stringify(filteredEmails));
        } else if (key === "password") {
          if (formData.password) {
            form.append("password", formData.password);
          }
        } else if (formData[key] !== undefined && formData[key] !== null) {
          form.append(key, formData[key]);
        }
      });

      if (selectedFile) {
        form.append("file", selectedFile);
      }
      const res = await updateProfile(form).unwrap();

      if (res.success) {
        dispatch(userExist(res.newuser));
        setIsEditing(false);
        setFormData((prev) => ({ ...prev, password: "" }));
        toast.success(res.message, { duration: 3000 });
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong", {
        duration: 3000
      });
    }
  };

  if (isLoadingForGetMyProfile) return <Loader />;

  return (
    <div className="bg-white shadow-md pb-8">
      {/* Banner */}
      <div
        style={{
          background: 'url("/Frame.png")',
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%"
        }}
        className="h-29 flex justify-end px-4 py-3"
      ></div>

      {/* Profile Section */}
      <div className="relative -top-19">
        <div className="px-6 flex flex-col gap-4">
          <div className="w-29 h-29 rounded-full overflow-hidden">
            {user?.image?.url ||
            (selectedFile && imageSrc !== user?.image?.url) ? (
              <img
                src={imageSrc}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary flex items-center justify-center text-white text-4xl font-bold">
                {getInitials(user?.name)}
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-5 items-start justify-between">
            <div className="flex flex-col gap-2">
              <p className="font-bold text-3xl text-[#1E293B]">
                {formData.name}
              </p>
            </div>
          </div>
        </div>

        {/* Form Section Container */}
        <div className="mt-6 px-5 lg:px-15 flex flex-col gap-8">
          {/* Section 1: Client / Personal Info */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold text-[#1E293B]">
                {isClient ? "Client Info" : "Personal Info"}
              </h3>
              <p className="text-sm text-[#475569]">
                You can change your personal information here.
              </p>
            </div>

            <div className="p-4 bg-white border grid grid-cols-2 gap-5 rounded">
              {/* Client Name */}
              <div className="col-span-2 md:col-span-1">
                <Input
                  className={`bg-white border ${
                    !isEditing && "cursor-not-allowed"
                  }`}
                  label={isClient ? "Client Name" : "Full Name"}
                  value={formData.name}
                  readOnly={!isEditing}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="col-span-2 md:col-span-1">
                <Input
                  className={`bg-white border cursor-not-allowed`}
                  label={isClient ? "Client Email" : "Email Address"}
                  value={formData.email}
                  readOnly={true}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>

              {/* Client Password */}
              <div className="col-span-2 md:col-span-1 flex flex-col gap-2">
                <label className="text-sm text-dark-text font-medium">
                  {isClient ? "Client Password" : "Password"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={isEditing ? "Enter new password" : "••••••••"}
                    value={formData.password}
                    readOnly={!isEditing}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className={`w-full border border-[#e5e5e5] h-[50px] px-3 pr-10 rounded-md text-sm text-[#535353] bg-white outline-none ${
                      !isEditing && "cursor-not-allowed"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Phone */}
              <div className="col-span-2 md:col-span-1 flex flex-col gap-2">
                <label className="text-sm text-dark-text font-medium">
                  {isClient ? "Client Phone" : "Phone No"}
                </label>
                <PhoneInput
                  value={formData.phone}
                  country={"us"}
                  onChange={(value) => handleChange("phone", value)}
                  disabled={!isEditing}
                  inputClass={`!outline-none !border !border-[#e5e5e5] !h-[50px] !rounded-md !w-full !text-sm !text-[#535353] !bg-white ${
                    !isEditing && "cursor-not-allowed"
                  }`}
                />
              </div>

              {/* Gender */}
              <div className="col-span-2 md:col-span-1 flex flex-col gap-2">
                <label className="text-sm text-dark-text font-medium">
                  Gender
                </label>
                <Dropdown
                  options={[
                    { id: 0, name: "Select Gender" },
                    { id: 1, name: "Male" },
                    { id: 2, name: "Female" },
                    { id: 3, name: "Other" }
                  ]}
                  defaultValue={{ name: formData.gender || "Select Gender" }}
                  onChange={(opt) =>
                    handleChange(
                      "gender",
                      opt.name === "Select Gender" ? "" : opt.name
                    )
                  }
                  className="!py-3.5"
                  width="w-full"
                  disabled={!isEditing}
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
                    <div className="rounded-full w-25 h-25 overflow-hidden">
                      {imageSrc && imageSrc !== "/profile-pic.png" ? (
                        <img
                          src={imageSrc}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      ) : (
                        <div className="w-full h-full bg-primary flex items-center justify-center text-white text-3xl font-bold">
                          {getInitials(user?.name)}
                        </div>
                      )}
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
          </div>

          {/* Client-Only Sections */}
          {isClient && (
            <>
              {/* Section 2: Company Info */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-bold text-[#1E293B]">
                    Company Info
                  </h3>
                  <p className="text-sm text-[#475569]">
                    Manage company name and dealer identification.
                  </p>
                </div>

                <div className="p-4 bg-white border grid grid-cols-2 gap-5 rounded">
                  <div className="col-span-2 md:col-span-1">
                    <Input
                      className={`bg-white border ${
                        (!isEditing || !canEditCompanyName) &&
                        "cursor-not-allowed"
                      }`}
                      label="Company Name *"
                      value={formData.companyName}
                      readOnly={!isEditing || !canEditCompanyName}
                      onChange={(e) =>
                        handleChange("companyName", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <Input
                      className={`bg-white border ${
                        !isEditing && "cursor-not-allowed"
                      }`}
                      label="Dealer ID *"
                      value={formData.dealerId}
                      readOnly={!isEditing}
                      onChange={(e) => handleChange("dealerId", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Store Address */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-bold text-[#1E293B]">
                    Store Address
                  </h3>
                  <p className="text-sm text-[#475569]">
                    Physical store location and address information.
                  </p>
                </div>

                <div className="p-4 bg-white border grid grid-cols-2 gap-5 rounded">
                  {/* Store Name */}
                  <div className="col-span-2 md:col-span-1">
                    <Input
                      className={`bg-white border ${
                        !isEditing && "cursor-not-allowed"
                      }`}
                      label="Store Name"
                      value={formData.address.store}
                      readOnly={!isEditing}
                      onChange={(e) =>
                        handleAddressChange("store", e.target.value)
                      }
                    />
                  </div>

                  {/* Street */}
                  <div className="col-span-2 md:col-span-1">
                    <Input
                      className={`bg-white border ${
                        !isEditing && "cursor-not-allowed"
                      }`}
                      label="Street"
                      value={formData.address.street}
                      readOnly={!isEditing}
                      onChange={(e) =>
                        handleAddressChange("street", e.target.value)
                      }
                    />
                  </div>

                  {/* Main Area */}
                  <div className="col-span-2 md:col-span-1">
                    <Input
                      className={`bg-white border ${
                        !isEditing && "cursor-not-allowed"
                      }`}
                      label="Main Area"
                      value={formData.address.area}
                      readOnly={!isEditing}
                      onChange={(e) =>
                        handleAddressChange("area", e.target.value)
                      }
                    />
                  </div>

                  {/* City */}
                  <div className="col-span-2 md:col-span-1">
                    <Input
                      className={`bg-white border ${
                        !isEditing && "cursor-not-allowed"
                      }`}
                      label="City"
                      value={formData.address.city}
                      readOnly={!isEditing}
                      onChange={(e) =>
                        handleAddressChange("city", e.target.value)
                      }
                    />
                  </div>

                  {/* State */}
                  <div className="col-span-2 md:col-span-1">
                    <Input
                      className={`bg-white border ${
                        !isEditing && "cursor-not-allowed"
                      }`}
                      label="State"
                      value={formData.address.state}
                      readOnly={!isEditing}
                      onChange={(e) =>
                        handleAddressChange("state", e.target.value)
                      }
                    />
                  </div>

                  {/* Country */}
                  <div className="col-span-2 md:col-span-1">
                    <Input
                      className={`bg-white border ${
                        !isEditing && "cursor-not-allowed"
                      }`}
                      label="Country"
                      value={formData.address.country}
                      readOnly={!isEditing}
                      onChange={(e) =>
                        handleAddressChange("country", e.target.value)
                      }
                    />
                  </div>

                  {/* Zip Code */}
                  <div className="col-span-2 md:col-span-1">
                    <Input
                      className={`bg-white border ${
                        !isEditing && "cursor-not-allowed"
                      }`}
                      label="Zip Code"
                      value={formData.address.zip}
                      readOnly={!isEditing}
                      onChange={(e) =>
                        handleAddressChange("zip", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-dark-text font-medium">
                      Store Phone
                    </label>
                    <PhoneInput
                      value={formData.storePhone}
                      country={"us"}
                      onChange={(value) => handleChange("storePhone", value)}
                      disabled={!isEditing}
                      inputClass={`!outline-none !border !border-[#e5e5e5] !h-[50px] !rounded-md !w-full !text-sm !text-[#535353] !bg-white ${
                        !isEditing && "cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Ownership */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-bold text-[#1E293B]">
                    Ownership
                  </h3>
                  <p className="text-sm text-[#475569]">
                    Account owner and business owner assignments.
                  </p>
                </div>

                <div className="p-4 bg-white border grid grid-cols-2 gap-5 rounded">
                  <div className="col-span-2 md:col-span-1">
                    <Input
                      className={`bg-white border ${
                        !isEditing && "cursor-not-allowed"
                      }`}
                      label="Account Owner"
                      value={formData.accountOwner}
                      readOnly={!isEditing}
                      onChange={(e) =>
                        handleChange("accountOwner", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <Input
                      className={`bg-white border ${
                        !isEditing && "cursor-not-allowed"
                      }`}
                      label="Business Owner"
                      value={formData.businessOwner}
                      readOnly={!isEditing}
                      onChange={(e) =>
                        handleChange("businessOwner", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-5 justify-end mt-4">
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
                  disabled={isLoading}
                />
                <Button
                  text={isLoading ? "Saving..." : "Save"}
                  cn="!py-2"
                  onClick={handleSave}
                  disabled={isLoading}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
