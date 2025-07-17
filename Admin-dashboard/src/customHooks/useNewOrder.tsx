import { useEffect } from "react";
import { useNewOrderStore } from "../store/useProductStore";
import { getOrderItemsRequest } from "../services/neworder";

export default function useNewOrder(id: string | undefined) {
  const { order, setOrder, errors, setErrors, isLoading, setIsLoading } =
    useNewOrderStore();

  useEffect(() => {
    setErrors([]);
    setIsLoading(true);
    getOrderItemsRequest(id)
      .then((res) => {
        setOrder(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        setErrors(["Error al cargar las ordenes"]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id, setOrder, setErrors, setIsLoading]);

  return {
    order,
    setOrder,
    errors,
    setErrors,
    isLoading,
    setIsLoading,
  };
}
