import { useState, useEffect, useRef } from 'react';
import { FaAngleDown } from 'react-icons/fa6';
//pull
export default function Dropdown({
  title,
  options,
  defaultValue,
  onChange,
  className = '',
  width,
  iconColor,
  disabled,
  bgColor,
}) {
  const [selected, setSelected] = useState(defaultValue || null);
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setSelected(option);
    setOpen(false);
    onChange?.(option); // Send full object
  };

  return (
    <div
      className={`relative inline-block text-sm md:text-base ${width ? width : 'w-64'}`}
      ref={dropdownRef}
    >
      {/* Trigger */}
      <div
        onClick={() => {
          if (!disabled) setOpen(!open);
        }}
        className={`!py-2.5
    flex justify-between items-center gap-1 w-full ${
      bgColor ? bgColor : 'bg-white'
    } py-[14px] px-5 rounded-sm text-dark-text transition border
    ${
      disabled
        ? 'cursor-not-allowed bg-gray-100 text-gray-500 border-gray-300'
        : 'cursor-pointer border-[#E4E4E7]'
    }
    ${className}
  `}
      >
        <span className="text-sm text-nowrap overflow-hidden">
          {title}{' '}
          <span className="font-semibold">{selected?.name || defaultValue || 'Select'}</span>
        </span>
        <FaAngleDown
          className={`text-sm  transition-transform duration-200 
    ${open ? 'rotate-180' : ''} 
    ${bgColor ? 'text-white' : iconColor || 'text-[#101421]'}
  `}
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
          {options?.map((opt) => (
            <li
              key={opt.id}
              onClick={() => !disabled && handleSelect(opt)}
              className={`
                px-4 py-2 cursor-pointer text-xs md:text-sm text-[#09090B]
                hover:bg-gray-100 }
                ${selected?.id === opt.id ? 'bg-gray-100 font-medium' : ''}
              `}
            >
              {opt.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
