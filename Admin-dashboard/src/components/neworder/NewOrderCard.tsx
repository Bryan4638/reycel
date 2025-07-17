import { Button } from "@heroui/react";
import { OrderAdd, Products } from "../../type";
import { toast } from "sonner";
import { addItemOrderRequest } from "../../services/neworder";

interface Props {
  product: Products;
  setOrder: (order: OrderAdd | null) => void;
}

export default function NewOrderCard({ product, setOrder }: Props) {
  const handleClikAddProduct = (id: string) => {
    addItemOrderRequest(id, 1)
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
          setOrder(res.data.data);
        }
        if (res.status === 202) {
          toast.error(
            `Aviso: ${res.data.message || "Hubo un problema con la solicitud."}`
          );
        }
        if (res.status === 203) {
          toast.warning(
            `Aviso: ${res.data.message || "Hubo un problema con la solicitud."}`
          );
        }
      })
      .catch((err) => {
        toast.error("Error al añadir un producto al carrito.");
        console.log(err);
      });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm ">
      <div className="h-56 w-full">
        <img
          className="mx-auto h-full"
          src={product.imagen}
          alt={product.name}
        />
      </div>
      <div className="pt-6">
        <div className=" flex items-center justify-between gap-4">
          {product.inventoryCount !== 0 && (
            <span className="me-2 rounded bg-emerald-300 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
              {" "}
              En Stock{" "}
            </span>
          )}
          {product.inventoryCount === 0 && (
            <span className="me-2 rounded bg-red-400 px-2.5 py-0.5 text-xs font-medium text-zinc-100">
              {" "}
              No hay uniddades{" "}
            </span>
          )}
        </div>

        <div className="w-full h-8 flex items-center">
          {product.inventoryCount <= 4 && product.inventoryCount !== 0 && (
            <span className="me-2 py-3 text-sm font-medium text-red-400">
              {`Queda(n) ${product.inventoryCount}, más en camino.`}
            </span>
          )}
          {product.inventoryCount === 0 && (
            <span className="me-2 py-3 text-sm font-medium text-red-400">
              Más unidades en camino.
            </span>
          )}
        </div>
        <h1 className="text-lg overflow-hidden font-semibold min-h-12 leading-tight text-gray-900 hover:underline line-clamp-2">
          <>{product.name} </>
        </h1>

        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center mt-2">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  className={`h-5 w-5 fill-current ${
                    product.rating - 0.5 > index
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.122-6.545L.368 6.91l6.564-.955L10 0l3.068 5.955 6.564.955-4.878 4.635 1.122 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600 ml-2">{product.rating} de 5</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white">
            ${product.price}
          </p>

          <Button
            isDisabled={product.inventoryCount === 0}
            onPress={() => handleClikAddProduct(product.id)}
            color="primary"
            className="inline-flex items-center rounded-lg "
          >
            <>
              <svg
                className="-ms-2 me-2 h-5 w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                />
              </svg>
              Añadir
            </>
          </Button>
        </div>
      </div>
    </div>
  );
}
