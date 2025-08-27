"use client";
import React, { useEffect, useState } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DashboardIcon,
  ActionsIcon,
  ArchievedIcon,
  SettingsIcon,
  NotifictionIcon,
  InvoicesIcon,
  UsersIcon,
} from "../../../assets/icons/icons";
// import logo from "../../../assets/images/logo.svg";
// import logoWithText from "../../../assets/images/logo-with-text.svg";
// import profilePic from "../../../assets/images/default/profile.png";
// import { BsThreeDots } from "react-icons/bs";
// import Modal from "../../../components/shared/small/Modal";
import { IoIosArrowDown } from "react-icons/io";
import ActionSubLink from "../../../assets/icons/aside/ActionSubLink";
import InvoicesSubLink from "../../../assets/icons/aside/InvoicesSubLink";
import { IoLogOutOutline } from "react-icons/io5";
// import { jwtDecode } from "jwt-decode";

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
    link: ["/actions"],
    icon: <ActionsIcon />,
  },
  {
    id: 3,
    title: "Invoices",
    link: ["/invoices"],
    icon: <InvoicesIcon />,
  },
  {
    id: 4,
    title: "Notification",
    link: ["/notification"],
    icon: <NotifictionIcon />,
  },
  {
    id: 4,
    title: "Users",
    link: ["/users"],
    icon: <UsersIcon />,
  },
  {
    id: 5,
    title: "Archieved",
    link: ["/archieved"],
    icon: <ArchievedIcon />,
    children: [
      {
        id: 1,
        title: "Actions",
        link: "/archieved/actions",
        icon: <ActionSubLink />,
      },
      {
        id: 2,
        title: "Invoices",
        link: "/archieved/invoices",
        icon: <InvoicesSubLink />,
      },
    ],
  },

  {
    id: 6,
    title: "Settings",
    link: ["/settings"],
    icon: <SettingsIcon />,
  },
];

const Aside = () => {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [email, setEmail] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [avatar, setAvatar] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;

    const checkTokenExpiryAndSetTimeout = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setEmail(decodedToken?.email);
          setFirstName(decodedToken?.first_name);
          setAvatar(decodedToken?.avatar);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp && decodedToken.exp < currentTime) {
            setIsTokenExpired(true);
          } else if (decodedToken.exp) {
            const timeLeft = decodedToken.exp * 1000 - Date.now() - 60 * 1000; // 1 minute before expiration
            timeoutId = setTimeout(checkTokenExpiryAndSetTimeout, timeLeft); // Set the next check
          }
        } catch (error) {
          console.error("Invalid token");
        }
      }
    };

    checkTokenExpiryAndSetTimeout();

    // Cleanup timeout on unmount or when dependencies change
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [navigate]);

  return (
    <aside
      style={{ background: 'url("/Sidebar.png")' }}
      className={`relative rounded-lg transition-all duration-300 h-full ${
        isMenuOpen ? "w-[84px]" : "w-[246px]"
      }`}
    >
      {/* Arrow icon */}
      <div
        className={`bg-white rounded-full p-1 absolute top-[37px] -right-[10px] cursor-pointer z-50 transition-all duration-300 hidden xl:block ${
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
        <div>
          <div className="flex items-center justify-center gap-1">
            {/* <img
              src={isMenuOpen ? logo : "Logo"}
              // alt="logo"
              className="mx-auto"
            /> */}
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
              {pages.map((page, i) => (
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
          <span
            className={`transition-all duration-100 text-nowrap ${
              isMenuOpen
                ? "opacity-0 scale-x-0 w-0 h-0"
                : "opacity-100 scale-x-100 h-auto w-auto"
            }`}
          >
            Logout
          </span>
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
      className={`flex items-center py-[10px] px-[12px] rounded-lg text-sm ${
        isMenuOpen ? "gap-0 justify-center" : "gap-2"
      } ${
        isLinkActive
          ? "bg-white text-[#043655]"
          : "text-white hover:text-[#043655] bg-none hover:bg-white"
      }`}
    >
      {React.cloneElement(page?.icon, { isLinkActive })}
      <span
        className={`transition-all duration-100 text-nowrap ${
          isMenuOpen
            ? "opacity-0 scale-x-0 w-0 h-0"
            : "opacity-100 scale-x-100 h-auto w-auto"
        }`}
      >
        {page?.title}
      </span>
    </Link>
  );
};
