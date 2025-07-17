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
} from "@heroui/react";
import { FC, useEffect, useState } from "react";
import { BiDollar, BiLock, BiMailSend, BiUser } from "react-icons/bi";
import { toast } from "sonner";
import { Sede, Worker } from "../../type";
import { getSedesRequest } from "../../services/sedes";
import {
  createWorkersRequest,
  editWorkersRequest,
} from "../../services/workers";

interface Props {
  id?: string;
  username?: string;
  email?: string;
  image?: string;
  Sede?: Sede;
  role?: "MODERATOR" | "OWNER";
  salary?: number;
  setWorkers: React.Dispatch<React.SetStateAction<Worker[] | null>>;
  isOpen: boolean;
  onClose: () => void;
}

const roles = [
  { key: "OWNER", label: "Admin" },
  { key: "MODERATOR", label: "Moderador" },
];

const ModalAddWorker: FC<Props> = ({
  id,
  username,
  image,
  email,
  salary,
  isOpen,
  onClose,
  setWorkers,
}) => {
  const [loading, setLoading] = useState(false);

  const [imageUrl, setImageUrl] = useState("./logo.webp");
  const [selectedRole, setSelectedRole] = useState<string | null>();
  const [sedes, setSedes] = useState<{ id: string; direction: string }[]>([]);
  const [disable, setDisable] = useState<boolean | undefined>(true);

  useEffect(() => {
    if (selectedRole === "MODERATOR") {
      setDisable(false);
      getSedesRequest().then((res) => {
        setSedes(res.data.data);
      });
    } else setDisable(true);
  }, [selectedRole]);

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

  const handleRoleChange = (value: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(value.target.value);
    console.log(value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(event.currentTarget));

    const inputImage = data["image"] as string;
    const selectedRole = data["role"] as "MODERATOR" | "OWNER";
    const selectedSede = data["sede"] as string;

    const inputUser = data["user"] as string;
    const inputPassword = data["password"] as string;
    const inputPasswordConfirm = data["passwordConfirm"] as string;
    const inputEmail = data["email"] as string;
    const inputSalary = Number(data["salary"]);

    // Validaciones
    if (!selectedRole) {
      toast.error("El rol del usuario es requerido.");
      setLoading(false);
      return;
    }
    if (selectedRole === "MODERATOR" && !selectedSede) {
      toast.error("Debe elegir una sede para el moderador.");
      setLoading(false);
      return;
    }
    if (selectedRole === "MODERATOR" && !inputSalary) {
      toast.error("Debe escribir el salario del moderador.");
      setLoading(false);
      return;
    }
    if (!inputUser) {
      toast.error("El nombre del usuario es requerido.");
      setLoading(false);
      return;
    }
    if (!inputEmail) {
      toast.error("El email es requerido.");
      setLoading(false);
      return;
    }
    if (!inputPassword && !id) {
      toast.error("La contraseña es requerida.");
      setLoading(false);
      return;
    }
    if (
      (!inputPasswordConfirm || inputPasswordConfirm !== inputPassword) &&
      !id
    ) {
      toast.error("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    if (id) {
      editWorkersRequest(id, {
        image: inputImage,
        password: inputPassword,
        role: selectedRole,
        sedeId: selectedSede,
        username: inputUser,
        email: inputEmail,
        salary: inputSalary,
      })
        .then((res) => {
          setWorkers((prev) => {
            if (!prev) {
              return null;
            }
            const user = res.data.data;

            const userFilter = prev.filter((prevUser) => {
              return prevUser.id !== id;
            });
            return [user, ...userFilter];
          });
          toast.success("Trabajador editado con exito");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error al editar el trabajador");
        })
        .finally(() => {
          setLoading(false);
          onClose();
          setSelectedRole(null);
        });
    }

    if (!id) {
      createWorkersRequest({
        image: inputImage,
        email: inputEmail,
        password: inputPassword,
        role: selectedRole,
        sedeId: selectedSede,
        username: inputUser,
        salary: inputSalary,
      })
        .then((res) => {
          setWorkers((prev) => {
            return prev ? [res.data.data, ...prev] : null;
          });
          toast.success("Trabajador creacto con exito");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error al crear el trabajador");
        })
        .finally(() => {
          setLoading(false);
          onClose();
          setSelectedRole(null);
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
                        className="size-56 bg-neutral-300"
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
                          <BiMailSend className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        label="Email"
                        defaultValue={email}
                        name="email"
                        placeholder="Entra su email"
                        type="email"
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
                  <div className="w-full flex justify-between gap-4">
                    <Input
                      endContent={
                        <BiDollar className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                      }
                      label="Salario Fijo"
                      name="salary"
                      defaultValue={String(salary)}
                      placeholder="Salario Fijo"
                      type="text"
                      variant="bordered"
                      isDisabled={disable}
                      labelPlacement="outside"
                    />
                    <Select
                      variant="bordered"
                      label="Role"
                      name="role"
                      defaultOpen
                      placeholder="Seleccione el role"
                      labelPlacement="outside"
                      onChange={handleRoleChange}
                    >
                      {roles.map((rol) => (
                        <SelectItem key={rol.key}>{rol.label}</SelectItem>
                      ))}
                    </Select>
                  </div>
                  <Select
                    className="w-full"
                    variant="bordered"
                    label="Sede"
                    name="sede"
                    placeholder="Seleccione la Sede"
                    labelPlacement="outside"
                    isDisabled={disable}
                    defaultSelectedKeys={sedes.flatMap((sede) => sede.id)}
                  >
                    {sedes.map((sede) => (
                      <SelectItem key={sede.id}>{sede.direction}</SelectItem>
                    ))}
                  </Select>

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

export default ModalAddWorker;
