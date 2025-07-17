import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Spinner,
  Form,
  Input,
  Select,
  SelectItem,
  Button,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BiTransferAlt } from "react-icons/bi";
import usePaymentMethod from "../../customHooks/usePaymentMethod";
import { useNavigate } from "react-router-dom";
import NewOrderView from "./NewOrderView";
import useNewOrder from "../../customHooks/useNewOrder";
import { useAuth } from "../../context/AuthContext";
import { confirmOrderRequest } from "../../services/neworder";

interface Props {
  onClose: () => void;
  isOpen: boolean;
}

export default function DrawerOrderView({ onClose, isOpen }: Props) {
  const { paymentMethod } = usePaymentMethod();
  const [selectedMethod, setSelectedMethod] = useState<string | null>("CASH");
  const [selectedId, setSelectedId] = useState<string>("");
  const [disable, setDisable] = useState<boolean>(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { order, setOrder, errors, setErrors, isLoading } =
    useNewOrder(user?.userId);

  useEffect(() => {
    if (selectedMethod === "CASH" || selectedMethod === "") {
      setDisable(true);
    } else setDisable(false);
  }, [selectedMethod]);

  const handleMethodChange = (value: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMethod(value.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));
    const transactionIdInput = data["transactionId"] as string;

    if (!selectedId || selectedId === "") {
      toast.error("No se ha seleccionado un metodo de pago");
      return;
    }

    if (!transactionIdInput || transactionIdInput === "") {
      confirmOrderRequest({
        orderID: order?.id,
        amount: order?.totalAmount,
        paymentMethod: selectedId,
        userId: user?.userId,
        sede: user?.sede
      })
        .then((res) => {
          toast.success("Orden Confirmada");
          setOrder(res.data.data);

          onClose();
          navigate("/order");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error al confirmar la orden");
        });
    } else {
      confirmOrderRequest({
        orderID: order?.id,
        amount: order?.totalAmount,
        paymentMethod: selectedId,
        userId: user?.userId,
        transactionID: transactionIdInput,
        sede: user?.sede
      })
        .then((res) => {
          toast.success("Orden Confirmada");
          setOrder(res.data.data);

          onClose();
          navigate("/order");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error al confirmar la orden");
        });
    }
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        size="5xl"
        placement="right"
        backdrop="transparent"
        hideCloseButton
        onClose={onClose}
      >
        <DrawerContent className="dark:bg-gray-800 fixed bg-white top-14 lg:mt-1">
          {(onClose) => (
            <>
              <DrawerHeader>
                <h3 className="w-full text-center text-xl font-bold text-gray-800">
                  Nueva Orden
                </h3>
              </DrawerHeader>
              <DrawerBody>
                <div className="flex md:grid flex-col md:grid-cols-2 gap-8">
                  <Form
                    className="md:fixed md:w-1/3 flex w-full"
                    onSubmit={handleSubmit}
                  >
                    {paymentMethod && (
                      <div className="flex gap-2 min-w-full">
                        <Select
                          name="Metodo"
                          variant="bordered"
                          label="Metodo"
                          placeholder="Seleccione el Metodo del Pago"
                          labelPlacement="outside"
                          onChange={handleMethodChange}
                        >
                          {paymentMethod.map((method) => (
                            <SelectItem
                              key={method.id}
                              onClick={() => {
                                setSelectedId(method.id);
                              }}
                            >
                              {method.paymentOptions}
                            </SelectItem>
                          ))}
                        </Select>
                        <Input
                          endContent={
                            <span className="text-md text-default-400 pointer-events-none flex-shrink-0">
                              <BiTransferAlt />
                            </span>
                          }
                          name="transactionId"
                          label="ID Transferencia"
                          placeholder="ID Transferencia"
                          variant="bordered"
                          labelPlacement="outside"
                          isDisabled={disable}
                        />
                      </div>
                    )}
                    <div className="flex min-w-full justify-end mt-5 gap-3">
                      <Button color="danger" variant="light" onPress={onClose}>
                        Cancelar
                      </Button>
                      <Button color="primary" type="submit" onPress={onClose}>
                        Agregar
                      </Button>
                    </div>
                  </Form>
                  <div className="bg-gray-50 p-4 min-h-full w-full rounded-lg md:col-start-2">
                    <div className="flex w-full justify-center">
                      <ul className="text-gray-800 text-sm divide-x flex gap-4 mt-4">
                        <li className="flex flex-wrap gap-4 py-3">
                          Cantidad de productos{" "}
                          <span className="ml-auto font-bold">
                            {order?._count.orderItems}
                          </span>
                        </li>
                        <li className="flex flex-wrap gap-4 py-3 font-bold pl-4">
                          Total{" "}
                          <span className="ml-auto">${order?.totalAmount}</span>
                        </li>
                      </ul>
                    </div>

                    {isLoading && (
                      <div className="min-w-full min-h-full flex items-center justify-center">
                        <Spinner></Spinner>
                      </div>
                    )}

                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-2 gap-2 md:max-h-full overflow-auto  scrollbar-default">
                      {order?.orderItems &&
                        !isLoading &&
                        order.orderItems.map((item) => (
                          <NewOrderView
                            id={item.id}
                            key={item.id}
                            image={item.product.imagen}
                            name={item.product.name}
                            price={item.price}
                            inventoryCount={item.product.inventoryCount}
                            setErrors={setErrors}
                            setOrder={setOrder}
                            quantity={item.quantity}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
      {errors.length > 0 && toast.error("Error al incrementar el producto")}
    </>
  );
}
