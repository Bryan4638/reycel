import { Spinner } from "@heroui/react";
import { lazy, Suspense } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const UsersTable = lazy(() => import("../components/user/UsersTable"));

export default function User() {
  const { user, loading } = useAuth();

  if (user?.role !== "OWNER" && !loading) return <Navigate to="/products" replace />;
  return (
    <div className="pt-20 p-2 lg:p-16 bg-neutral-100 h-screen">
      <Suspense
        fallback={
          <div className="w-full h-full flex justify-center items-center">
            <Spinner color="primary" />
          </div>
        }
      >
        <UsersTable />
      </Suspense>
    </div>
  );
}
