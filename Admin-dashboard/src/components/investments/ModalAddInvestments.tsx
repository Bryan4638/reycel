import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  Textarea,
} from "@heroui/react";
import { FC, useEffect, useState } from "react";
import { toast } from "sonner";
import { getSedesRequest } from "../../services/sedes";

interface Props {
  addInvestment: (
    id: string,
    description: string,
    price: number
  ) => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
}

const ModalAddInvestments: FC<Props> = ({ isOpen, onClose, addInvestment }) => {
  const [loading, setLoading] = useState(false);
  const [sedes, setSedes] = useState<{ id: string; direction: string }[]>([]);
  const [sedeId, setSedeId] = useState<string>("");

  useEffect(() => {
    getSedesRequest().then((res) => {
      setSedes(res.data.data);
    });
  }, []);

  const handleSedeId = (value: React.ChangeEvent<HTMLSelectElement>) => {
    setSedeId(value.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));

    const description = data.description as string;
    const price = parseInt(data.price as string);

    if (!description || !price) {
      toast.error("Debe introducir todos los datos del formulario.");
      return;
    }

    addInvestment(sedeId, description, price)
      .then()
      .finally(() => {
        setLoading(false);
      });
    onClose();
  };

  return (
    <>
      <Modal backdrop={"opaque"} isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-end  space-x-2 gap-1 font-[sans-serif] ">
                <img src="./logo.webp" alt="Logo reycel" className="w-10 h-8" />
                <h1 className="text-2xl font-bold">Agregar Inversion o Merma</h1>
              </ModalHeader>
              <ModalBody>
                <Form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-4 min-w-full items-center">
                    <Select
                      isRequired
                      className="w-full"
                      label="Sede"
                      name="sede"
                      placeholder="Seleccione la Sede"
                      labelPlacement="outside"
                      onChange={handleSedeId}
                    >
                      {sedes &&
                        sedes.map((sede) => (
                          <SelectItem key={sede.id}>
                            {sede.direction}
                          </SelectItem>
                        ))}
                    </Select>
                  </div>
                  <div className="flex gap-2 min-w-full">
                    <Input
                      name="price"
                      autoFocus
                      startContent={
                        <span className="text-sm text-default-800 pointer-events-none flex-shrink-0">
                          $
                        </span>
                      }
                      label="Precio"
                      placeholder="Ingrese el precio de la inversion o merma"
                      variant="bordered"
                      labelPlacement="outside"
                    />
                  </div>
                  <Textarea
                    label="Descripcion:"
                    name="description"
                    isRequired
                    labelPlacement="outside"
                    placeholder="Introduce la descripcion de la inversion o merma."
                  />
                  <div className="flex min-w-full justify-end mt-5 gap-3">
                    <Button color="danger" variant="light" onPress={onClose}>
                      Cancelar
                    </Button>
                    <Button color="primary" type="submit">
                      {loading && <Spinner color="danger" />}
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

export default ModalAddInvestments;
