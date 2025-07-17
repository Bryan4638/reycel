import { Spinner } from "@heroui/react";
import { lazy, Suspense } from "react";

const OrderTable = lazy(() => import("../components/order/OrderTable"));

export default function Order() {
  return (
    <div className="flex flex-col gap-12 pt-20 p-2 lg:p-16 bg-neutral-100 min-h-screen">
      <Suspense
        fallback={
          <div className="w-full h-full flex justify-center items-center">
            <Spinner color="success" />
          </div>
        }
      >
        <OrderTable />
      </Suspense>
    </div>
  );
}
