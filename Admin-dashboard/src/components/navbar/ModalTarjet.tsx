import {
  Spinner,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { PaymentMethod } from "../../type";
import {
  getPaymentMethodRequest,
} from "../../services/paymentMethod";
import { toast } from "sonner";
import ModalAddPayment from "../pagos/ModalAddPayment";
import usePaymentMethod from "../../customHooks/usePaymentMethod";



const ModalTarjet = () => {
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [paymentCard, setPaymentCard] = useState<PaymentMethod[] | null>(null);
  const {addPaymentMethod, updatePaymentMethod} = usePaymentMethod();

  useEffect(() => {
    setLoading(true);
    getPaymentMethodRequest()
      .then((res) => {
        setPaymentCard(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error al cargar los metodos de pago");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);



  return (
    <>
      <Tooltip
        placement="bottom"
        content={
          <div className="px-1">
            <div className="text-small font-bold">
              Sobre las tarjetas magnéticas
            </div>
            <div className="flex flex-col items-center text-tiny justify-center font-medium py-3 space-y-1">
              {loading && <Spinner color="success" />}
              {!loading &&
                paymentCard &&
                paymentCard.map((card, index) => {
                  return (
                    <p key={index}>
                      <span className="pr-3 font-semibold">
                        {card.paymentOptions} :
                      </span>
                      {card.cardNumber}
                    </p>
                  );
                })}
            </div>
          </div>
        }
      >
        <div
          onClick={onOpen}
          className="block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 group"
        >
          <svg
            className="mx-auto mb-2 w-5 h-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 20"
          >
            <path d="M7 11H5v1h2v-1Zm4 3H9v1h2v-1Zm-4 0H5v1h2v-1ZM5 5V.13a2.98 2.98 0 0 0-1.293.749L.88 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM13 16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v6Zm-1-8H9a1 1 0 0 1 0-2h3a1 1 0 1 1 0 2Zm0-3H9a1 1 0 0 1 0-2h3a1 1 0 1 1 0 2Z" />
            <path d="M11 11H9v1h2v-1Z" />
          </svg>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            Tarjetas
          </div>
        </div>
      </Tooltip>
      <ModalAddPayment isOpen={isOpen} onClose={onClose} addPaymentMethod={addPaymentMethod} updatePaymentMethod={updatePaymentMethod}/>


    </>
  );
};

export default ModalTarjet;
