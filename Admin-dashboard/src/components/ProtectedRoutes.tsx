import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "@heroui/react";

function ProtectedRoutes() {
  const { isAuth, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner color="danger" />
      </div>
    );
  }

  if (!isAuth && !loading) return <Navigate to="/login" replace />;

  //if (user?.role !== "OWNER" && !loading) return <Navigate to="/products" replace />;

  return <Outlet />;
}

export default ProtectedRoutes;
