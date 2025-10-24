/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import Loader from "../components/shared/small/Loader";

const ProtectedRoute = ({ children, user, allowedRoles, redirect = "/" }) => {
  if (user === undefined) {
    return <Loader />;
  }
  if (!user) return <Navigate to={redirect} />;
  if (allowedRoles && !allowedRoles?.includes(user.role))
    return <Navigate to={redirect} />;
  return children;
};

export default ProtectedRoute;
