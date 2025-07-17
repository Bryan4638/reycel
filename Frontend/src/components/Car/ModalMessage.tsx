import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Snippet,
  Spinner,
  Tooltip,
} from "@heroui/react";
import { FC, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getPaymentMethodRequest,
  transactionRequest,
} from "../../services/transaction";
import { Order, TransactionType } from "../../types";
import { io } from "socket.io-client";
import { API_URL } from "../../conf";
import { useUserStore } from "../../store/useUserStore";
import { useNotificationStore } from "../../store/useNotificationStore";

interface Props {
  count: number;
  orderID: number | null;
  totalAmount: number;
  updateOrder: (order: Order) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface PaymentMethod {
  id: string;
  cardImage: string;
  cardNumber: null;
  createdAt: Date;
  paymentOptions: string;
  _count: Count;
}

export interface Count {
  payment: number;
}

//
export const domicilios = [
  { key: "Matanzas", label: "Matanzas" },
  { key: "Boca", label: "Boca" },
  { key: "Santa Marta", label: "Santa Marta" },
  { key: "Varadero", label: "Varadero" },
  { key: "Cantel", label: "Cantel" },
  { key: "Cardenas", label: "Cardenas" },
];

const ModalMessage: FC<Props> = ({
  count,
  orderID,
  totalAmount,
  isOpen,
  updateOrder,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [fastDelivery, setFastDelivery] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod[] | null>(
    null
  );

  const { isAuth } = useUserStore();

  const {addNotifications} = useNotificationStore()

  useEffect(() => {
    if (!isAuth) return;
    getPaymentMethodRequest()
      .then((res) => {
        setPaymentMethod(res.data.data);
      })
      .catch(() => {
        toast.error("Error al cargar los metodos de pago");
      });
  }, [isAuth]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(event.currentTarget));

    const inputMunicipio = data["municipio"] as string;
    const inputDireccion = data["direccion"] as string;
    const inputTransaction = data["transactionID"] as string;

    if (!inputTransaction) {
      toast.error("Debe introducir el id de la transferencia.");
      setLoading(false);
      return;
    }

    if (!inputMunicipio) {
      toast.error("Debe seleccionar el poblado");
      setLoading(false);
      return;
    }

    if (!inputDireccion) {
      toast.error("Debe escribir su dirección");
      setLoading(false);
      return;
    }

    const socket = io(API_URL);

    socket.emit("registerTransaction", inputTransaction);

    socket.on("transactionStatus", (data) => {
      if (data.status === "confirmed") {
        toast.success(`Transacción ${data.transactionID} confirmada.`);
        addNotifications(data.notification);
      } else if (data.status === "denied") {
        addNotifications(data.notification);
        toast.error(`Transacción ${data.transactionID} denegada.`);
      }
    });

    const value: TransactionType = {
      price: totalAmount,
      productCount: count,
      transactionID: inputTransaction,
      fastDelivery,
      address: inputDireccion,
      town: inputMunicipio,
      orderID: orderID,
      paymentMethodId: selectedMethod?.id,
    };

    await transactionRequest(value)
      .then((res) => {
        toast.success(res.data.message);
        updateOrder(res.data.order);
        onClose();
      })
      .catch(() => {
        toast.error("Error con la confirmacion de la transferencia.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-end  space-x-2 gap-1 font-[sans-serif] ">
                <img src="./logo.webp" alt="Logo reycel" className="w-10 h-8" />
                <h1 className="text-2xl font-bold">Confirme su Compra</h1>
              </ModalHeader>
              <ModalBody>
                <Form onSubmit={handleSubmit}>
                  <div className="w-full">
                    <ul>
                      <li className="flex space-x-2">
                        <strong className="text-neutral-700/80">
                          Precio:{" "}
                        </strong>
                        <h1 className="font-semibold">{totalAmount}$</h1>
                      </li>
                      <li className="flex space-x-2">
                        <strong className="text-neutral-700/80">
                          Cantidad de Productos:{" "}
                        </strong>
                        <h1 className="font-semibold">{count}</h1>
                      </li>
                      <li className="flex justify-between">
                        <div className="flex space-x-2">
                          <strong className="text-neutral-700/80">
                            Entrega Rápida:{" "}
                          </strong>
                          <h1 className="font-semibold">3$</h1>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <Checkbox
                            isSelected={fastDelivery}
                            onValueChange={setFastDelivery}
                            color="primary"
                            name="fastDeliver"
                          />
                          <Tooltip
                            content={
                              <div className="px-1 ">
                                <div className="text-small font-bold">
                                  Acerca de la Transferencia
                                </div>
                                <div className="text-tiny">
                                  <h1 className="font-medium ">
                                    Se aplicará un cargo extra por la entrega de
                                    los productos.
                                  </h1>
                                  <h1 className="font-medium ">
                                    Los productos llegarán en un plazo de 2 a 3
                                    días
                                  </h1>
                                </div>
                              </div>
                            }
                          >
                            <svg
                              className="w-6 h-6 text-gray-800 dark:text-white"
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
                                strokeWidth="2"
                                d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              />
                            </svg>
                          </Tooltip>
                        </div>
                      </li>
                      <li className="flex space-x-2">
                        <strong className="text-neutral-700/80">
                          Precio Total:{" "}
                        </strong>
                        <h1 className="font-semibold">
                          {fastDelivery ? totalAmount + 3 : totalAmount}$
                        </h1>
                      </li>
                    </ul>
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-col items-center md:items-start gap-2">
                        <h1 className="text-neutral-700/80 font-semibold gap-2">
                          Metodo de pago
                        </h1>
                        {paymentMethod && (
                          <RadioGroup
                            onValueChange={(id) => {
                              const result = paymentMethod.filter(
                                (method) => method.id === id
                              );
                              setSelectedMethod(result[0]);
                            }}
                            defaultValue={paymentMethod[0].id}
                          >
                            {paymentMethod.map((method) => (
                              <Radio value={method.id} key={method.id}>
                                {method.paymentOptions}
                              </Radio>
                            ))}
                          </RadioGroup>
                        )}
                      </div>
                      <div className="flex justify-center items-center pt-4">
                        {selectedMethod && (
                          <div className="flex flex-col md:w-64 w-52 space-y-1">
                            <img
                              className="rounded-md md:w-64 w-52 h-25"
                              src={selectedMethod.cardImage}
                              alt={selectedMethod.paymentOptions}
                            />
                            <Snippet
                              className="w-full"
                              symbol={`${selectedMethod.paymentOptions}:`}
                              size="sm"
                            >
                              {selectedMethod.cardNumber}
                            </Snippet>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-full flex flex-col md:flex-row gap-2 py-2">
                      <Select
                        className="w-full"
                        multiple={false}
                        size="sm"
                        label="Selecciona tu municipio"
                        name="municipio"
                      >
                        {domicilios.map((domicilio) => (
                          <SelectItem key={domicilio.key}>
                            {domicilio.label}
                          </SelectItem>
                        ))}
                      </Select>{" "}
                      <Input
                        size="sm"
                        variant="flat"
                        label="Direccion"
                        name="direccion"
                      />
                    </div>
                    <div className="flex flex-col self-center w-full gap-1 pt-3">
                      <div className="flex items-center justify-between gap-2">
                        <strong className=" ml-1">
                          Haga la Transferencia e ingrese el ID de Transacción:
                        </strong>
                        <Tooltip
                          content={
                            <div className="px-1 py-2">
                              <div className="text-small font-bold">
                                Acerca de la Transferencia
                              </div>
                              <div className="text-tiny">
                                <ol type="A">
                                  <li className="font-medium pt-2">
                                    - Copie el numero de la trajeta y haga la
                                    transferencia.
                                  </li>
                                  <li className="font-medium pt-1">
                                    - Copie el codigo de verificaion del mensaje
                                    q le envian.
                                  </li>
                                  <li className="font-medium pt-1">
                                    - Pegue el codigo en el campo para validar
                                    la compra.
                                  </li>
                                  <li className="font-medium pt-1">
                                    - Espere la confirmación de la compra.
                                  </li>
                                </ol>
                              </div>
                            </div>
                          }
                        >
                          <svg
                            className="w-6 h-6 text-gray-800 dark:text-white"
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
                              strokeWidth="2"
                              d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        </Tooltip>
                      </div>
                      <input
                        name="transactionID"
                        id="transactionID"
                        className="p-2 pl-4 border focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg w-full flex"
                        type="text"
                        placeholder="ID Transacción"
                      />
                    </div>
                    <div className="flex justify-end gap-3 py-3">
                      <Button color="danger" variant="light" onPress={onClose}>
                        Cancelar
                      </Button>
                      <Button color="primary" type="submit">
                        {loading && <Spinner color="default" />}
                        {!loading && "Confirmar"}
                      </Button>
                    </div>
                  </div>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalMessage;
