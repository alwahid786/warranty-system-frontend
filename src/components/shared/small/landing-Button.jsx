import React from "react";
import clsx from "clsx";

export default function Button({
  variant = "filled",
  children,
  className,
  disabled,
  ...props
}) {
  const baseStyles =
    "px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1";

  const filled =
    "bg-[rgb(11,92,131)] text-white hover:bg-[rgb(8,78,112)] focus:ring-[rgb(11,92,131)]";

  const outline =
    "border border-[rgb(11,92,131)] text-[rgb(11,92,131)] hover:bg-[rgb(11,92,131)] hover:text-white focus:ring-[rgb(11,92,131)]";

  const disabledStyles =
    "disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:opacity-80 disabled:pointer-events-none";

  return (
    <button
      disabled={disabled}
      className={clsx(
        baseStyles,
        variant === "filled" ? filled : outline,
        disabledStyles,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
