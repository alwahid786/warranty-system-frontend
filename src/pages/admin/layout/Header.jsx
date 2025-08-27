import { useEffect, useRef, useState } from "react";
import { getDate } from "../../../utils/getDate";
import { Link, Router, useLocation } from "react-router-dom";
// import { RxHamburgerMenu } from "react-icons/rx";
// import logo from "../../../assets/images/logo.svg";
import Aside from "./Aside";
import { HiChevronDown } from "react-icons/hi";
import { IoChevronForwardOutline, IoLogOutOutline } from "react-icons/io5";
import { useGetMyProfileQuery } from "../../../redux/apis/authApis";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userExist, userNotExist } from "../../../redux/slices/authSlice";

const Header = () => {
  const [mobileNav, setMobileNav] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [date, setDate] = useState("");
  const { pathname } = useLocation();
  const profileRef = useRef(null);
  const pathSegment = pathname.split("/");
  const path = pathSegment[pathSegment.length - 1];
  const menuRef = useRef(null);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { data, isLoading } = useGetMyProfileQuery();

  useEffect(() => {
    if (data?.data) {
      dispatch(userExist(data.data));
    }
  }, [data, dispatch]);

  const profileOpenHandler = () => {
    setIsProfileOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        profileRef.current &&
        !menuRef.current.contains(e.target) &&
        !profileRef.current.contains(e.target)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setDate(getDate());
  }, []);

  return (
    <header className="flex h-[74px] items-center justify-between gap-4 rounded-lg bg-white p-4 lg:px-7 lg:py-4 shadow-sm">
      <div className="flex items-center gap-4">
        <button className="block xl:hidden" onClick={() => setMobileNav(true)}>
          <svg
            width="27"
            height="25"
            viewBox="0 0 27 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.5 4.62189H2.20429C2.00602 4.62189 2.15785 4.62123 2.10883 4.62145C1.8179 4.62275 1.57048 4.62386 1.26251 4.5192C0.677745 4.32049 0.296118 3.89123 0.117506 3.39154C0.039172 3.17238 0 2.94098 0 2.71085C0 2.48072 0.039172 2.24931 0.117506 2.03015C0.296118 1.53045 0.677735 1.1012 1.26251 0.902496C1.57048 0.79784 1.8179 0.798946 2.10883 0.800248C2.15785 0.800463 2.00602 0.799805 2.20429 0.799805H24.7957C24.994 0.799805 24.8421 0.800463 24.8912 0.800248C25.1821 0.798946 25.4295 0.79784 25.7375 0.902496C26.3223 1.10121 26.7039 1.53046 26.8825 2.03016C26.9608 2.24931 27 2.48072 27 2.71085C27 2.94098 26.9608 3.17239 26.8825 3.39155C26.7039 3.89124 26.3223 4.32049 25.7375 4.5192C25.4295 4.62386 25.1821 4.62275 24.8912 4.62145C24.8421 4.62123 24.994 4.62189 24.7957 4.62189H13.5ZM2.20429 20.3777H24.7957C24.994 20.3777 24.8421 20.3784 24.8912 20.3782C25.1821 20.3769 25.4295 20.3758 25.7375 20.4804C26.3223 20.6791 26.7039 21.1084 26.8825 21.6081C26.9608 21.8272 27 22.0586 27 22.2888C27 22.5189 26.9608 22.7503 26.8825 22.9695C26.7039 23.4691 26.3223 23.8984 25.7375 24.0971C25.4295 24.2018 25.1821 24.2007 24.8912 24.1994C24.8421 24.1991 24.994 24.1998 24.7957 24.1998H2.20429C2.00602 24.1998 2.15785 24.1991 2.10883 24.1994C1.8179 24.2007 1.57048 24.2018 1.26251 24.0971C0.677735 23.8984 0.296118 23.4692 0.117506 22.9695C0.039172 22.7503 0 22.5189 0 22.2888C0 22.0586 0.039172 21.8272 0.117506 21.6081C0.296118 21.1084 0.677745 20.6791 1.26251 20.4804C1.57048 20.3758 1.8179 20.3769 2.10883 20.3782C2.15785 20.3784 2.00602 20.3777 2.20429 20.3777ZM13.5 14.4108H2.20429C2.00602 14.4108 2.15785 14.4102 2.10883 14.4104C1.8179 14.4117 1.57048 14.4128 1.26251 14.3082C0.677745 14.1094 0.296118 13.6802 0.117506 13.1805C0.039172 12.9613 0 12.7299 0 12.4998C0 12.2697 0.039172 12.0383 0.117506 11.8191C0.296118 11.3194 0.677735 10.8902 1.26251 10.6915C1.57048 10.5868 1.8179 10.5879 2.10883 10.5892C2.15785 10.5894 2.00602 10.5888 2.20429 10.5888H24.7957C24.994 10.5888 24.8421 10.5894 24.8912 10.5892C25.1821 10.5879 25.4295 10.5868 25.7375 10.6915C26.3223 10.8902 26.7039 11.3194 26.8825 11.8191C26.9608 12.0383 27 12.2697 27 12.4998C27 12.7299 26.9608 12.9613 26.8825 13.1805C26.7039 13.6802 26.3223 14.1095 25.7375 14.3082C25.4295 14.4128 25.1821 14.4117 24.8912 14.4104C24.8421 14.4102 24.994 14.4108 24.7957 14.4108H13.5Z"
              fill="#143893"
            />
          </svg>
        </button>
        <div>
          <h2 className="text-dark-text text-xl lg:text-2xl font-medium capitalize lg:text-[22px]">
            {path === "" ? "Dashboard" : path}
          </h2>
          <p className="text-xs text-primary">{date}</p>
        </div>
      </div>
      {/* Dropdown */}
      <div className="hidden md:flex items-center gap-4 bg-white">
        <div className="relative flex items-center gap-2">
          <img
            src={user.image.url || "/profile-pic.png"}
            alt="User avatar"
            className="h-12 w-12 rounded-full border border-gray-700 object-cover"
          />
          <div className="flex flex-col gap-1">
            <h6 className="text-sm font-semibold text-gray-800">{user.name}</h6>
            <p className="text-xs text-gray-600">{user.email}</p>
          </div>
          <div
            onClick={profileOpenHandler}
            ref={profileRef}
            className={`cursor-pointer transition-transform duration-300 ${
              isProfileOpen ? "rotate-180" : ""
            }`}
          >
            <HiChevronDown size={20} />
          </div>

          {/* Dropdown */}
          <div
            className={`custom-scroll absolute top-[45px] right-0 z-10 w-[150px] rounded-lg border bg-white shadow transition-all duration-300 ${
              isProfileOpen ? "opacity-100" : "invisible opacity-0"
            }`}
          >
            <Profile menuRef={menuRef} />
          </div>
        </div>
      </div>
      <div
        className={`block xl:hidden fixed w-full h-full inset-0 bg-[#00000071] z-50 transition-all duration-500 ${
          mobileNav
            ? "visible opacity-100"
            : "invisible opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileNav(false)}
      >
        <div
          className={`absolute top-3 left-3 h-[calc(100svh-24px)] transition-transform duration-500 ${
            mobileNav ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Aside />
        </div>
      </div>
    </header>
  );
};

export default Header;

const Profile = ({ menuRef }) => {
  return (
    <div className="w-full">
      <div
        ref={menuRef}
        className="flex items-center gap-2 rounded-md border-b bg-white px-2 py-2 cursor-pointer hover:bg-gray-100"
      >
        <IoLogOutOutline fontSize={18} />
        <h6>Logout</h6>
      </div>
    </div>
  );
};
