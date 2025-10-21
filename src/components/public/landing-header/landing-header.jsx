import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import Button from "../../shared/small/landing-Button";
import getEnv from "../../../configs/config";

export default function LandingHeader() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false); // close menu after navigation
  };

  return (
    <header className="bg-[rgb(11,92,131)] text-white flex items-center justify-between px-6 md:px-10 py-4 shadow-md fixed top-0 left-0 right-0 z-50">
      {/* Logo + Company Name */}
      <div
        onClick={() => handleNavigate("/")}
        className="flex items-center gap-3 cursor-pointer"
      >
        <img
          src={getEnv("LOGO_URL_WITHOUT_BACKGROUND")}
          alt="Company Logo"
          className="h-10 w-10 rounded-full object-cover"
        />
        <h1 className="text-xl md:text-2xl font-bold tracking-wide">
          Precision Warranty Services
        </h1>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-3">
        <Button
          onClick={() => handleNavigate("/")}
          className="
            bg-transparent 
            border border-white 
            text-white 
            hover:bg-white hover:text-[rgb(11,92,131)] 
            transition-colors duration-300 
            rounded-md px-5 py-2 font-semibold
          "
        >
          Login
        </Button>
      </div>

      {/* Mobile Hamburger Icon */}
      <div className="md:hidden">
        <FontAwesomeIcon
          icon={menuOpen ? faXmark : faBars}
          onClick={toggleMenu}
          className="text-2xl cursor-pointer"
        />
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-[72px] left-0 w-full bg-[rgb(11,92,131)] shadow-md flex flex-col items-center gap-4 py-5 md:hidden animate-fadeIn">
          <Button
            onClick={() => handleNavigate("/login")}
            className="w-11/12 bg-transparent border border-white text-white hover:bg-white hover:text-[rgb(11,92,131)] rounded-md px-5 py-2 font-semibold transition-colors duration-300"
          >
            Login
          </Button>

          <Button
            onClick={() => handleNavigate("/become-member")}
            className="w-11/12 bg-transparent border border-white text-white hover:bg-white hover:text-[rgb(11,92,131)] rounded-md px-5 py-2 font-semibold transition-colors duration-300"
          >
            Become Member
          </Button>

          <Button
            onClick={() => handleNavigate("/donate-us")}
            className="w-11/12 bg-transparent border border-white text-white hover:bg-white hover:text-[rgb(11,92,131)] rounded-md px-5 py-2 font-semibold transition-colors duration-300"
          >
            Donate Us
          </Button>
        </div>
      )}
    </header>
  );
}
