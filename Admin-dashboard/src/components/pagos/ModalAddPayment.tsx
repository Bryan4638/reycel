import {
  Button,
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
  Spinner,
} from "@heroui/react";
import { FC, useState } from "react";
import { toast } from "sonner";
import { AddPaymentMethodProps, PaymentOptions } from "../../type";

interface Props {
  id?: string;
  image?: string;
  numberCard?: string;
  numberPhone?: string;
  selected?: PaymentOptions;
  updatePaymentMethod: (
    id: string,
    { image, numberCard, selected }: AddPaymentMethodProps
  ) => Promise<void>;
  addPaymentMethod: ({
    image,
    numberCard,
    selected,
  }: AddPaymentMethodProps) => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
}

export const paymentOptions = [
  { key: "TRANSFER_CUP", label: "Transferencia en CUP" },
  { key: "TRANSFER_USD", label: "Transferencia en MLC" },
  { key: "ZELLE", label: "Zelle" },
  { key: "CASH", label: "Efectivo" },
];

const ModalAddPayment: FC<Props> = ({
  id,
  numberCard,
  numberPhone,
  selected,
  isOpen,
  onClose,
  updatePaymentMethod,
  addPaymentMethod,
}) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(event.currentTarget));

    const imageData = data["radioGrup"] as string;
    const numberCardData = data["inputNumberCard"] as string;
    const selectedData = data["paymentOptions"] as PaymentOptions;
    const numberPhoneData = data["inputNumberPhone"] as string;

    if (!imageData && selectedData !== "CASH") {
      toast.error("Debe selelcionar una imagen.");
      setLoading(false);
      return;
    }

    if (!selectedData) {
      toast.error("Debe selelcionar un metodo de pago.");
      setLoading(false);
      return;
    }

    if (!numberPhoneData) {
      toast.error("Debe selelcionar un numero a confirmar.");
      setLoading(false);
      return;
    }

    if (!numberCardData && selectedData !== "CASH") {
      toast.error("Debe introducir un número de cuenta.");
      setLoading(false);
      return;
    }

    if (!id) {
      addPaymentMethod({
        image: imageData,
        numberCard: numberCardData,
        phoneNumber: numberPhoneData,
        selected: selectedData,
      })
        .then(() => {
          toast.success("Guardado con exito ");
          onClose();
        })
        .catch(() => {
          toast.error("Error al hacer la petiicon");
        })
        .finally(() => {
          setLoading(false);
        });
    }

    if (id) {
      updatePaymentMethod(id, {
        image: imageData,
        numberCard: numberCardData,
        phoneNumber: numberPhoneData,
        selected: selectedData,
      })
        .then(() => {
          toast.success("Guardado con exito ");
          onClose();
        })
        .catch(() => {
          toast.error("Error al hacer la petiicon");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  return (
    <>
      <Modal backdrop={"opaque"} isOpen={isOpen} onClose={onClose} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-end  space-x-2 gap-1 font-[sans-serif] ">
                <img src="./logo.webp" alt="Logo reycel" className="w-10 h-8" />
                <h1 className="text-2xl font-bold">Tarjetas Magnéticas</h1>
              </ModalHeader>
              <ModalBody>
                <Form onSubmit={handleSubmit}>
                  <div className="mx-auto">
                    <RadioGroup orientation="horizontal" name="radioGrup">
                      <Radio value="https://lademajagua.cu/wp-content/uploads/2024/02/unnamed-1-2.jpg">
                        <img
                          className="rounded-md w-28 h-14"
                          src="https://lademajagua.cu/wp-content/uploads/2024/02/unnamed-1-2.jpg"
                          alt="Tarjeta bpa"
                        />
                      </Radio>
                      <Radio
                        value="https://media.diariolasamericas.com/p/08a9e753c5262913be4253bf2336983f/adjuntos/216/imagenes/002/018/0002018550/855x0/smart/tarjeta-banco-popular-cubajpg.jpg"
                        className="mx-2"
                      >
                        <img
                          className="rounded-md w-28 h-14"
                          src="https://media.diariolasamericas.com/p/08a9e753c5262913be4253bf2336983f/adjuntos/216/imagenes/002/018/0002018550/855x0/smart/tarjeta-banco-popular-cubajpg.jpg"
                          alt="Tarjeta bpa"
                        />
                      </Radio>
                      <Radio value="https://s28126.pcdn.co/blogs/ask-experian/wp-content/uploads/Zelle.jpg.optimal.jpg">
                        <img
                          className="rounded-md w-28 h-14"
                          src="https://s28126.pcdn.co/blogs/ask-experian/wp-content/uploads/Zelle.jpg.optimal.jpg"
                          alt="Zelle"
                        />
                      </Radio>
                    </RadioGroup>
                  </div>
                  <Select
                    name="paymentOptions"
                    className="pt-5 w-full"
                    defaultSelectedKeys={selected}
                    items={paymentOptions}
                    label="Opciones de pago"
                    placeholder="Seleccione una opción"
                  >
                    {(options) => <SelectItem>{options.label}</SelectItem>}
                  </Select>
                  <Input
                    name="inputNumberCard"
                    defaultValue={numberCard}
                    className="min-w-1/5 pt-5"
                    startContent={
                      <span className="text-md text-default-800 pointer-events-none flex-shrink-0">
                        #
                      </span>
                    }
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    label="Numero de Tarjeta"
                    variant="bordered"
                    labelPlacement="outside"
                  />
                  <Input
                    name="inputNumberPhone"
                    defaultValue={numberPhone}
                    className="min-w-1/5 pt-5"
                    startContent={
                      <span className="text-md text-default-800 pointer-events-none flex-shrink-0">
                        +53
                      </span>
                    }
                    placeholder="55555555"
                    variant="bordered"
                    label="Movil a Confirmar"
                    labelPlacement="outside"
                  />
                  <div className="flex min-w-full justify-end mt-5 gap-3">
                    <Button color="danger" variant="light" onPress={onClose}>
                      Cancelar
                    </Button>

                    <Button color="primary" type="submit" disabled={loading}>
                      {loading && <Spinner color="default" />}
                      {!loading && <span>Guardar</span>}
                    </Button>
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

export default ModalAddPayment;
