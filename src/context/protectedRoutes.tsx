import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.user);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
