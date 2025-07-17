import React, { useEffect, useState } from "react";
import Card from "../components/Car/Card";
import { Order, OrderItem } from "../types";
import { getOrderRequest, updateOrderItemRequest } from "../services/order";
import axios, { AxiosError } from "axios";
import { Spinner } from "@heroui/spinner";
import { toast } from "sonner";
import { useDisclosure } from "@heroui/react";
import { useUserStore } from "../store/useUserStore";
import PurchaseConfirmationModal from "../components/checkout/PurchaseConfirmationModal";

const App: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isAuth } = useUserStore();

  const [order, setOrder] = useState<OrderItem[] | null>(null);
  const [orderID, setOrderID] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<Array<string> | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (!isAuth) {
      setLoading(false);
      return;
    }
    getOrderRequest()
      .then((res) => {
        setOrder(res.data.data.orderItems);
        setOrderID(res.data.data.id);
        setTotalAmount(res.data.data.totalAmount);
        setCount(res.data.data._count.orderItems);
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;

          if (axiosError.response) {
            setError(axiosError.response.data as Array<string>);
          } else if (axiosError.request) {
            toast.error("No se recibió respuesta:");
          }
        } else {
          toast.error("Error desconocido:");
          setError(["Error con la peticion al servidor"]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isAuth]);

  const updateOrder = (order: Order) => {
    setOrder(order.orderItems);
    setOrderID(order.id);
    setTotalAmount(order.totalAmount);
    setCount(order._count.orderItems);
  };

  const handleQuantity = (value: string, id: string, price: number) => {
    try {
      updateOrderItemRequest(id, Number(value), price)
        .then((res) => {
          if (res.status === 200) {
            setTotalAmount(res.data.data.totalAmount);
          }
          if (res.status === 202) {
            toast.error(
              `Aviso: ${
                res.data.message || "Hubo un problema con la solicitud."
              }`
            );
          }
          if (res.status === 203) {
            toast.warning(
              `Aviso: ${
                res.data.message || "Hubo un problema con la solicitud."
              }`
            );
          }
        })
        .catch(() => {
          setError(["Error al incrementar el producto"]);
        });
    } catch (error) {
      setError(["Error al incrementar el producto"]);
    }
  };

  return (
    <div className="font-[sans-serif] min-h-screen bg-gradient-to-tr from-gray-200 via-gray-100 to-gray-50 pt-16">
      <div className="max-w-7xl max-lg:max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-3">
          Tu carrito de compras
        </h2>

        <div className="grid grid-cols-[auto_auto] gap-5 max-lg:grid-cols-1">
          <div className="bg-white h-max rounded-md p-6 shadow-[0_0px_4px_0px_rgba(6,81,237,0.2)] max-lg:w-full lg:max-w-[335px] top-16 ">
            <h3 className="text-xl font-bold text-gray-800">Orden</h3>

            <ul className="text-gray-800 text-sm divide-y mt-4">
              <li className="flex flex-wrap gap-4 py-3">
                Subtotal{" "}
                <span className="ml-auto font-bold">${totalAmount}</span>
              </li>
              <li className="flex flex-wrap gap-4 py-3">
                Entrega Rapida <span className="ml-auto font-bold">$3.00</span>
              </li>
              <li className="flex flex-wrap gap-4 py-3">
                Cantidad de productos{" "}
                <span className="ml-auto font-bold">{count}</span>
              </li>
              <li className="flex flex-wrap gap-4 py-3 font-bold">
                Total <span className="ml-auto">${totalAmount}</span>
              </li>
            </ul>

            <button
              onClick={onOpen}
              type="button"
              className="mt-4 text-sm px-6 py-3 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Realizar Pago
            </button>

            {orderID !== null && (
              <PurchaseConfirmationModal
                count={count}
                totalAmount={totalAmount}
                orderID={orderID}
                isOpen={isOpen}
                onClose={onClose}
                updateOrder={updateOrder}
              />
            )}
          </div>

          <div className="grid  gap-4 relative max-lg:pt-5 z-0">
            <div className="lg:col-span-2 space-y-4">
              {order?.length === 0 && (
                <h1 className="text-2xl font-medium text-neutral-500">
                  No hay productos en el carrito.
                </h1>
              )}
              {order !== null &&
                order.map((orderItem) => {
                  return (
                    <Card
                      key={orderItem.product.id}
                      id={orderItem.id}
                      product={orderItem.product}
                      quantity={orderItem.quantity}
                      handleQuantity={handleQuantity}
                      setCount={setCount}
                      setError={setError}
                      setOrder={setOrder}
                      setTotalAmount={setTotalAmount}
                    />
                  );
                })}

              {loading && (
                <div className="w-full flex justify-center pt-4">
                  <Spinner color="primary" />
                </div>
              )}

              {error && error.map((err) => toast.error(err))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
