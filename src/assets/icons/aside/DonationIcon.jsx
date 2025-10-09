import React from "react";

const DonationIcon = ({ isLinkActive }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.001 4.529c2.349-2.362 6.152-2.362 8.501 0 2.349 2.362 2.349 6.189 0 8.55l-7.656 7.7a1 1 0 0 1-1.418 0l-7.656-7.7c-2.349-2.361-2.349-6.188 0-8.55 2.349-2.362 6.152-2.362 8.501 0l.364.365.364-.365Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.25 14.25c-.62 1.03-2.25 1.75-2.25 3 0 1.5 1.75 2.25 3 2.25h6c1.25 0 3-.75 3-2.25 0-1.25-1.63-1.97-2.25-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default DonationIcon;
