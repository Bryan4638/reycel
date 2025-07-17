import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { FC, useState } from "react";
import { BiMoney, BiRename } from "react-icons/bi";
import {
  createCategoryRequest,
  updateCategoryRequest,
} from "../../services/category";
import { Category } from "../../type";
import { toast } from "sonner";

interface Props {
  id?: string;
  name?: string;
  profitsBySell?: number;
  setCategory: React.Dispatch<React.SetStateAction<Category[] | null>>;
  isOpen: boolean;
  onClose: () => void;
}

const ModalAddCategory: FC<Props> = ({
  id,
  name,
  profitsBySell,
  isOpen,
  onClose,
  setCategory,
}) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(event.currentTarget));

    const inputName = data["name"] as string;
    const inputProfits = parseInt(data["profits"] as string);

    if (!inputName) {
      toast.error("Debe poner un nombre a la categoría");
      setLoading(false);
      return;
    }

    if (id) {
      updateCategoryRequest(id, inputName, inputProfits)
        .then((res) => {
          const category = res.data.data;

          setCategory((prev) => {
            if (!prev) {
              return null;
            }
            const categoryFilter = prev.filter(
              (prevCategory) => prevCategory.id !== id
            );

            return [category, ...categoryFilter];
          });
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error al actualizar la categoría");
        })
        .finally(() => {
          setLoading(false);
          onClose();
        });
    }

    if (!id) {
      createCategoryRequest(inputName, inputProfits)
        .then((res) => {
          const category = res.data.data;

          setCategory((prev) => {
            if (!prev) {
              return null;
            }
            return [category, ...prev];
          });
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error al crear la categoría");
        })
        .finally(() => {
          setLoading(false);
          onClose();
        });
    }
  };
  return (
    <>
      <Modal backdrop={"opaque"} isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-end  space-x-2 gap-1 font-[sans-serif] ">
                <img src="./logo.webp" alt="Logo reycel" className="w-10 h-8" />
                <h1 className="text-2xl font-bold">Agregar Categoría</h1>
              </ModalHeader>
              <ModalBody>
                <Form onSubmit={handleSubmit}>
                  <Input
                    autoFocus
                    name="name"
                    defaultValue={name}
                    endContent={
                      <BiRename className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    label="Nombre"
                    placeholder="Inserte el Nombre de la categroría"
                    variant="bordered"
                    labelPlacement="outside"
                  />
                  <Input
                    name="profits"
                    defaultValue={profitsBySell?.toString()}
                    endContent={
                      <BiMoney className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    label="Ganancias del Moderador por Venta"
                    placeholder="Inserte la ganancia"
                    variant="bordered"
                    labelPlacement="outside"
                  />
                  <div className="flex min-w-full justify-end mt-5 gap-3">
                    <Button color="danger" variant="light" onPress={onClose}>
                      Cancelar
                    </Button>
                    <Button color="primary" type="submit" onPress={onClose}>
                      {loading && <Spinner color="default" />}
                      {!loading && <span className="font-medium">Guardar</span>}
                    </Button>
                  </div>
                </Form>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalAddCategory;
