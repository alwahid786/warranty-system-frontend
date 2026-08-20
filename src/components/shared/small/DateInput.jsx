import React, { useState } from "react";

const DateInput = ({
  value,
  onChange,
  placeholder = "mm/dd/yyyy",
  className = "",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // When value is empty and input is not focused, use type="text" to display placeholder on mobile browsers (iOS Safari / Mobile Chrome)
  const inputType = value || isFocused ? "date" : "text";

  return (
    <input
      type={inputType}
      placeholder={placeholder}
      value={value || ""}
      onChange={onChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={`bg-white border border-gray-200 shadow-sm rounded px-3 py-2 text-sm w-full h-[42px] min-h-[42px] text-gray-700 leading-normal focus:border-primary focus:ring-1 focus:ring-primary/20 ${className}`}
      {...props}
    />
  );
};

export default DateInput;
