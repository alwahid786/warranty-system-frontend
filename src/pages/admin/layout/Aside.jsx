"use client";
import React, { useEffect, useState } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import getEnv from "../../../configs/config.js";
import {
  DashboardIcon,
  ActionsIcon,
  ArchievedIcon,
  SettingsIcon,
  NotifictionIcon,
  InvoicesIcon,
  UsersIcon,
  DonationIcon,
} from "../../../assets/icons/icons";
// import { BsThreeDots } from "react-icons/bs";
// import Modal from "../../../components/shared/small/Modal";
import { IoIosArrowDown } from "react-icons/io";
import ActionSubLink from "../../../assets/icons/aside/ActionSubLink";
import InvoicesSubLink from "../../../assets/icons/aside/InvoicesSubLink";
import { IoLogOutOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "../../../redux/apis/authApis";
import { userNotExist } from "../../../redux/slices/authSlice";
import { setNotifications } from "../../../redux/slices/notificationsSlice";
import toast from "react-hot-toast";

const Aside = () => {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [email, setEmail] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [logout, { data, isLoading, error }] = useLogoutMutation();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const pages = [
    {
      id: 1,
      title: "Dashboard",
      link: ["/"],
      icon: <DashboardIcon />,
    },
    {
      id: 2,
      title: "Actions",
      link: ["/dashboard/actions"],
      icon: <ActionsIcon />,
    },
    {
      id: 3,
      title: "Invoices",
      link: ["/dashboard/invoices"],
      icon: <InvoicesIcon />,
    },
    {
      id: 4,
      title: "Notification",
      link: ["/dashboard/notification"],
      icon: <NotifictionIcon />,
      showBadge: true,
    },
    {
      id: 4,
      title: "Users",
      link: ["/dashboard/users"],
      icon: <UsersIcon />,
    },
    {
      id: 5,
      title: "Archieved",
      link: ["/dashboard/archieved"],
      icon: <ArchievedIcon />,
      children: [
        {
          id: 1,
          title: "Actions",
          link: "/dashboard/archieved/actions",
          icon: <ActionSubLink />,
        },
        {
          id: 2,
          title: "Invoices",
          link: "/dashboard/archieved/invoices",
          icon: <InvoicesSubLink />,
        },
      ],
    },

    {
      id: 6,
      title: "Settings",
      link: ["/dashboard/settings"],
      icon: <SettingsIcon />,
    },
    {
      id: 7,
      title: "Clients",
      link: ["/dashboard/clients"],
      icon: <UsersIcon />,
    },
    {
      id: 8,
      title: "Donate Us",
      link: ["/dashboard/donate-us"],
      icon: <DonationIcon />,
    },
  ];

  const adminOnlyPages = [
    "Clients",
    "Dashboard",
    "Invoices",
    "Archieved",
    "Donate Us",
  ];

  const filteredPages = pages.filter((page) => {
    if (adminOnlyPages.includes(page.title) && user?.role !== "admin") {
      return false;
    }
    return true;
  });

  // handle logout

  const handleLogout = async () => {
    try {
      const res = await logout().unwrap();
      if (res.success) {
        dispatch(userNotExist());
        dispatch(setNotifications([]));
        toast.success(res.message, { duration: 3000 });
        return navigate("/");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Logout failed", { duration: 3000 });
    }
  };

  return (
    <aside
      style={{ background: 'url("/Sidebar.png")' }}
      className={`relative rounded-lg transition-all duration-300 h-full ${
        isMenuOpen ? "w-[84px]" : "w-[246px]"
      }`}
    >
      {/* Arrow icon */}
      <div
        className={`bg-white rounded-full p-1 absolute top-[37px] -right-[10px] cursor-pointer z-60 transition-all duration-300 hidden xl:block ${
          isMenuOpen ? "rotate-0" : "rotate-180"
        }`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <FaArrowCircleRight className="text-lg text-[#0C6189] " />
      </div>
      <div
        className="w-full h-full rounded-lg px-[11px] py-5 overflow-y-auto overflow-x-hidden scroll-0 flex flex-col justify-between gap-6 relative"
        style={{ boxShadow: "0px 4px 14px 0px #3582E729" }}
      >
        <div className="">
          <div>
            <div className="flex items-center justify-center gap-1">
              {isMenuOpen && (
                <img
                  src={getEnv("LOGO_URL_WITHOUT_BACKGROUND")}
                  alt="warranty-system-logo"
                  className="mx-auto"
                />
              )}
              {!isMenuOpen && (
                <h3 className="text-white font-semibold text-lg">
                  National Warranty
                </h3>
              )}
            </div>
            <div className="mt-7 lg:mt-10">
              <h4
                className={`text-xs text-white font-medium ${
                  isMenuOpen ? "text-center" : "pl-2"
                }`}
              >
                MENU
              </h4>
              <div className="mt-3 flex flex-col gap-[6px]">
                {filteredPages.map((page, i) => (
                  <LinkItem
                    key={i}
                    page={page}
                    pathname={pathname}
                    isMenuOpen={isMenuOpen}
                  />
                ))}
              </div>
            </div>
          </div>
          <div
            className={`cursor-pointer md:hidden flex items-center py-[10px] px-[12px] rounded-lg text-sm text-white hover:text-[#043655] bg-none hover:bg-white ${
              isMenuOpen ? "gap-0 justify-center" : "gap-2"
            } `}
          >
            {React.cloneElement(<IoLogOutOutline fontSize={18} />)}
            <button
              onClick={handleLogout}
              className={`transition-all duration-100 text-nowrap ${
                isMenuOpen
                  ? "opacity-0 scale-x-0 w-0 h-0"
                  : "opacity-100 scale-x-100 h-auto w-auto"
              }`}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Aside;

const LinkItem = ({ page, pathname, isMenuOpen }) => {
  const isLinkActive = page?.link.some((item) => item === pathname);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = useSelector((state) => state.notifications.unReadCount);

  if (page.title === "Archieved") {
    return (
      <div className={`flex flex-col rounded-lg`}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center py-[10px] px-[12px] rounded-lg text-sm cursor-pointer ${
            isLinkActive
              ? "bg-white text-[#043655]"
              : "text-white hover:text-primary bg-none hover:bg-white"
          } ${isMenuOpen ? "justify-center" : "gap-2"}`}
        >
          {React.cloneElement(page.icon, { isLinkActive })}
          {!isMenuOpen && (
            <>
              <span className="flex-1">{page.title}</span>
              <span
                className="text-xs transform transition-transform duration-200"
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <IoIosArrowDown />
              </span>
            </>
          )}
        </div>
        {/* Sub-links */}
        {isOpen && (
          <div className="ml-6 mt-1 flex flex-col gap-1 border-l border-gray-200 pl-2">
            {page.children.map((child) => {
              const isActive = pathname === child.link;
              return (
                <div
                  key={child.id}
                  onClick={() => navigate(child.link)}
                  className={`text-sm px-2 py-[6px] rounded cursor-pointer ${
                    isMenuOpen ? "!px-1" : ""
                  } ${
                    isActive
                      ? "bg-white text-[#043655]"
                      : "text-white hover:text-[#043655] hover:bg-white"
                  }`}
                >
                  {isMenuOpen
                    ? React.cloneElement(child.icon, { isActive })
                    : child.title}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={page?.link[0]}
      className={`flex items-center justify-between py-[10px] px-[12px] rounded-lg text-sm ${
        isMenuOpen ? "gap-0 justify-center" : "gap-2"
      } ${
        isLinkActive
          ? "bg-white text-[#043655]"
          : "text-white hover:text-[#043655] bg-none hover:bg-white"
      }`}
    >
      <div className="flex items-center gap-2">
        {React.cloneElement(page?.icon, { isLinkActive })}
        {!isMenuOpen && <span>{page?.title}</span>}
      </div>

      {/* 🔔 Show badge for notifications */}
      {page.showBadge && unreadCount > 0 && !isMenuOpen && (
        <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
          {unreadCount}
        </span>
      )}
    </Link>
  );
};
