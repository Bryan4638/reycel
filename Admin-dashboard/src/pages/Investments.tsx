import { Spinner } from "@heroui/react";
import { lazy, Suspense } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const InvestmentsTable = lazy(() => import("../components/investments/InvestmentsTable"));

export default function Investments() {
  const { user, loading } = useAuth();

  if (user?.role !== "OWNER" && !loading) return <Navigate to="/products" replace />;
  return (
    <div className="flex flex-col gap-12 pt-20 p-16 bg-neutral-100 min-h-screen">
      <Suspense
        fallback={
          <div className="w-full h-full flex justify-center items-center">
            <Spinner color="success" />
          </div>
        }
      >
        <InvestmentsTable />
      </Suspense>
    </div>
  );
}