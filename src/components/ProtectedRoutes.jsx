/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, user, allowedRoles, redirect = "/" }) => {
  if (!user) return <Navigate to={redirect} />;
  if (allowedRoles && !allowedRoles?.includes(user.role))
    return <Navigate to={redirect} />;
  return children;
};

export default ProtectedRoute;
