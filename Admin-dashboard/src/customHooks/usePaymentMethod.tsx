import { useEffect, useState } from "react";
import { AddPaymentMethodProps, PaymentMethod } from "../type";
import {
  createPaymentMethodRequest,
  deletePaymentMethodRequest,
  getPaymentMethodRequest,
  updatePaymentMethodRequest,
} from "../services/paymentMethod";
import { toast } from "sonner";

function usePaymentMethod() {
  const [paymentMethod, setPaymentMethod] = useState<
    PaymentMethod[] | undefined
  >();
  const [error, setError] = useState<Array<string> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError(null);
    setLoading(true);
    getPaymentMethodRequest()
      .then((res) => {
        setPaymentMethod(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        setError(["Error al cargar los metodos de pago"]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const deletePaymentMethod = (id: string) => {
    deletePaymentMethodRequest(id)
      .then(() => {
        setPaymentMethod((prevState) => {
          return prevState?.filter((prev) => prev.id !== id);
        });
        toast.success("Eliminado con exito");
      })
      .catch(() => {
        setError(["Error al eliminar."]);
      });
  };

  const addPaymentMethod = ({
    image,
    numberCard,
    selected,
    phoneNumber,
  }: AddPaymentMethodProps): Promise<void> => {
    return new Promise((resolve, reject) => {
      createPaymentMethodRequest({
        cardImage: image,
        cardNumber: numberCard,
        paymentOptions: selected,
        phoneNumber: phoneNumber,
      })
        .then((res) => {
          if (paymentMethod) {
            setPaymentMethod([...paymentMethod, res.data.data]);
          }
          if (!paymentMethod) {
            setPaymentMethod([res.data.data]);
          }
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  };

  const updatePaymentMethod = (
    id: string,
    { image, numberCard, selected, phoneNumber }: AddPaymentMethodProps
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      updatePaymentMethodRequest(id, {
        cardImage: image,
        cardNumber: numberCard,
        paymentOptions: selected,
        phoneNumber: phoneNumber,
      })
        .then((res) => {
          setPaymentMethod((prevState) => {
            return prevState?.map((prev) => {
              if (prev.id === id) {
                return res.data.data;
              }
              return prev;
            });
          });
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  };

  return {
    paymentMethod,
    error,
    loading,
    addPaymentMethod,
    deletePaymentMethod,
    updatePaymentMethod,
  };
}

export default usePaymentMethod;
