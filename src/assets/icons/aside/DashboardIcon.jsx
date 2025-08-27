const DashboardIcon = ({ isLinkActive }) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse
        cx="14.7917"
        cy="5.20829"
        rx="3.54167"
        ry="3.54167"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="5.20833" cy="5.20829" r="3.54167" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14.7917" cy="14.7917" r="3.54167" stroke="currentColor" strokeWidth="1.5" />
      <ellipse
        cx="5.20833"
        cy="14.7917"
        rx="3.54167"
        ry="3.54167"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
};

export default DashboardIcon;
