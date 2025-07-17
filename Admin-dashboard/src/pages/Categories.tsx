import { Spinner } from "@heroui/react";
import { lazy, Suspense } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const CategoryTable = lazy(
  () => import("../components/categories/CategoryTable")
);

export default function Categories() {
  const { user, loading } = useAuth();

  if (user?.role !== "OWNER" && !loading) return <Navigate to="/products" replace />;
  return (
    <div className="pt-20 p-2 lg:p-16 bg-neutral-100 h-screen">
      <Suspense
        fallback={
          <div className="w-full h-full flex justify-center items-center">
            <Spinner color="success" />
          </div>
        }
      >
        <CategoryTable />
      </Suspense>
    </div>
  );
}
