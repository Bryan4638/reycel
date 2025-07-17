import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { FC, useEffect, useState } from "react";
import { BiLock, BiUser } from "react-icons/bi";
import { toast } from "sonner";
import { editUsersRequest } from "../services/user";

interface Props {
  id?: string;
  username?: string;
  image?: string;
  isOpen: boolean;
  onClose: () => void;
}

const ModalEditUser: FC<Props> = ({
  id,
  username,
  image,

  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("./logo.webp");

  useEffect(() => {
    if (id) {
      setImageUrl(image || "./logo.webp");
    }
    return () => {
      setImageUrl("./logo.webp");
    };
  }, [id, image]);

  const handleImageUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(event.currentTarget));

    const inputImage = data["image"] as string;
    const inputUser = data["user"] as string;
    const inputPassword = data["password"] as string;
    const inputPasswordConfirm = data["passwordConfirm"] as string;

    // Validaciones
    if (!inputUser) {
      toast.error("El nombre del usuario es requerido.");
      setLoading(false);
      return;
    }
    if (!inputPassword) {
      toast.error("La contraseña es requerida.");
      setLoading(false);
      return;
    }
    if (!inputPasswordConfirm || inputPasswordConfirm !== inputPassword) {
      toast.error("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    if (id) {
      editUsersRequest(id, {
        image: inputImage,
        password: inputPassword,
        username: inputUser,
      })
        .then(() => {
          toast.success("Usuario editado con exito");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error al editar el usuario");
        })
        .finally(() => {
          setLoading(false);
          onClose();
        });
    }
  };

  return (
    <>
      <Modal backdrop={"opaque"} isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-end  space-x-2 gap-1 font-[sans-serif] ">
                <img src="./logo.webp" alt="Logo reycel" className="w-10 h-8" />
                <h1 className="text-2xl font-bold">Agregar Usuario</h1>
              </ModalHeader>
              <ModalBody>
                <Form onSubmit={handleSubmit}>
                  <div className="flex gap-4 w-full">
                    <div className="flex flex-col items-center w-full gap-4">
                      <img
                        className="size-36 bg-neutral-300"
                        src={imageUrl}
                        alt="Imagen de Usuario"
                      />
                      <Input
                        autoFocus
                        name="image"
                        defaultValue={image}
                        onChange={handleImageUrlChange}
                        endContent={
                          <BiUser className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        label="Url Imagen"
                        placeholder="https://image.example"
                        variant="bordered"
                        labelPlacement="outside"
                      />
                    </div>
                    <div className="flex flex-col gap-4 w-full">
                      <Input
                        autoFocus
                        name="user"
                        defaultValue={username}
                        endContent={
                          <BiUser className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        label="Usuario"
                        placeholder="Entra el usuario"
                        variant="bordered"
                        labelPlacement="outside"
                      />
                      <Input
                        endContent={
                          <BiLock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        label="Password"
                        name="password"
                        placeholder="Entra el password"
                        type="password"
                        variant="bordered"
                        labelPlacement="outside"
                      />
                      <Input
                        endContent={
                          <BiLock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        label="Confirmar Password"
                        name="passwordConfirm"
                        placeholder="Confirma el password"
                        type="password"
                        variant="bordered"
                        labelPlacement="outside"
                      />
                    </div>
                  </div>
                  <div className="flex min-w-full justify-end mt-5 gap-3">
                    <Button color="danger" variant="light" onPress={onClose}>
                      Cancelar
                    </Button>
                    <Button color="primary" type="submit">
                      {loading && <Spinner color="default" />}
                      {!loading && (
                        <span className=" font-semibold">Guardar</span>
                      )}
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

export default ModalEditUser;
