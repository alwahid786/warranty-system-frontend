import { useState, useEffect, useRef } from "react";
import { FaAngleDown } from "react-icons/fa6";

export default function Select({
  options,
  defaultValue,
  onChange,
  className = "",
  width,
  iconColor,
}) {
  const [selected, setSelected] = useState(defaultValue || "");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (defaultValue) setSelected(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    setSelected(value);
    setOpen(false);
    onChange?.(value);
  };

  return (
    <div
      className={`relative inline-block text-sm md:text-base ${
        width ? width : "w-64"
      }`}
      ref={dropdownRef}
    >
      {/* Trigger */}
      <div
        onClick={() => setOpen(!open)}
        className={`
          flex justify-between items-center 
          w-full cursor-pointer 
          border border-[#101421] rounded-md 
          px-3 md:px-[18px] py-2 md:py-3
          bg-white text-dark-text 
          transition
          ${className}
        `}
      >
        <span>{selected || "Select an option"}</span>
        <FaAngleDown
          className={`text-sm md:text-lg  transition-transform duration-200 ${
            iconColor ? iconColor : "text-[#101421]"
          } ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <ul
          className="
            absolute z-10 mt-2 w-full 
            bg-white border border-[#E4E4E7] rounded-md p-1
            shadow-lg
            max-h-60 overflow-auto
          "
        >
          {options.map((opt) => (
            <li
              key={opt}
              onClick={() => handleSelect(opt)}
              className={`
                px-4 py-2 cursor-pointer text-xs md:text-sm text-[#09090B]
                hover:bg-gray-100 
                ${opt === selected ? "bg-gray-100 font-medium" : ""}
              `}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
