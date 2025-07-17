import { lazy, Suspense } from "react";
import { Spinner } from "@heroui/react";

const ProductTable = lazy(() => import("../components/products/ProductTabe"));

export default function Products() {
  return (
    <div className="pt-14 p-2 lg:p-6 lg:pt-16 bg-neutral-100 h-screen">
      <Suspense
        fallback={
          <div className="w-full h-full flex justify-center items-center">
            <Spinner color="success" />
          </div>
        }
      >
        <ProductTable />
      </Suspense>
    </div>
  );
}
