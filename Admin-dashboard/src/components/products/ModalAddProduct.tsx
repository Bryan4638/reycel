import {
  Alert,
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ScrollShadow,
  Select,
  SelectItem,
  Spinner,
  Textarea,
} from "@heroui/react";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import Selected from "./Selected";
import Rating from "./Rating";
import {
  createProductRequest,
  updateProductRequest,
} from "../../services/product";
import { toast } from "sonner";
import { Category, Products } from "../../type";
import { getSedesRequest } from "../../services/sedes";
import { BiUpload, BiX } from "react-icons/bi";

interface Props {
  setProducts: React.Dispatch<React.SetStateAction<Products[] | null>>;
  isOpen: boolean;
  onClose: () => void;
  rating?: number;
  id?: string;
  price?: number;
  inventoryCount?: number;
  name?: string;
  description?: string;
  imagen?: string;
  category?: Category;
  battery?: number;
  ram?: number;
  storage?: number;
  mpxCameraFront?: number;
  mpxCameraBack?: number;
  investments?: number;
}

const ModalAddProduct: FC<Props> = ({
  description,
  isOpen,
  id,
  onClose,
  inventoryCount,
  price,
  name,
  rating,
  category,
  setProducts,
  imagen: initialImageUrl,
  battery,
  ram,
  storage,
  mpxCameraFront,
  mpxCameraBack,
  investments,
}) => {
  const [ratingValue, setRatingValue] = useState(rating || 0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sedes, setSedes] = useState<{ id: string; direction: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sedeId, setSedeId] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getSedesRequest().then((res) => {
      setSedes(res.data.data);
    });
  }, []);

  useEffect(() => {
    if (id) {
      setRatingValue(rating || 0);
      if (initialImageUrl) {
        setPreviewUrl(initialImageUrl);
      }
    } else {
      setPreviewUrl(null);
    }
    return () => {
      setRatingValue(0);
      if (initialImageUrl) {
        setPreviewUrl(initialImageUrl);
      }
    };
  }, [id, initialImageUrl, rating]);

  const [loading, setLoading] = useState(false);

  const handleSedeId = (value: React.ChangeEvent<HTMLSelectElement>) => {
    setSedeId(value.target.value);
  };

  const validateFile = (file: File): string | null => {
    const maxSize = 15 * 1024 * 1024; // 5MB
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return "Tipo de archivo no permitido. Solo se permiten imágenes JPEG, PNG, GIF y WebP.";
    }

    if (file.size > maxSize) {
      return "El archivo es demasiado grande. Máximo 15MB permitido.";
    }

    return null;
  };

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(event.currentTarget));

    const selectedCategoryId = data["selected"] as string;
    const inputName = data["name"] as string;
    const price = parseInt(data["price"] as string);
    const description = data["description"] as string;
    const inventoryCount = parseInt(data["inventoryCount"] as string);
    const inputRating = ratingValue;
    const imagen = selectedFile
    const inversion = parseInt(data["inversion"] as string);

    // Validaciones
    if (!inputName) {
      toast.error("El nombre del producto es requerido.");
      setLoading(false);
      return;
    }
    if (!selectedCategoryId) {
      toast.error("La categoría del producto es requerida.");
      setLoading(false);
      return;
    }
    if (!price) {
      toast.error("El precio del producto es requerido.");
      setLoading(false);
      return;
    }
    if (!description) {
      toast.error("La descripción del producto es requerida.");
      setLoading(false);
      return;
    }
    if (!inventoryCount) {
      toast.error("La cantidad de inventario del producto es requerida.");
      setLoading(false);
      return;
    }
    if (!imagen) {
      toast.error("La URL de la imagen del producto es requerida.");
      setLoading(false);
      return;
    }
    if (!sedeId) {
      toast.error("La sede del producto es requerida.");
      setLoading(false);
      return;
    }
    if (!inversion) {
      toast.error("La inversion del producto es requerida.");
      setLoading(false);
      return;
    }

    if (
      selectedCategory === "Smartphones" ||
      selectedCategory === "Telefonos"
    ) {
      const storage = parseInt(data["storage"] as string);
      const ram = parseInt(data["ram"] as string);
      const mpxback = parseInt(data["back"] as string);
      const mpxfront = parseInt(data["front"] as string);
      const battery = parseInt(data["bateria"] as string);

      if (!storage) {
        toast.error("El storage del producto es requerido.");
        setLoading(false);
        return;
      }
      if (!ram) {
        toast.error("La ram del producto es requerida.");
        setLoading(false);
        return;
      }
      if (!mpxback) {
        toast.error("Los mpx traseros del producto son requeridos.");
        setLoading(false);
        return;
      }
      if (!mpxfront) {
        toast.error("Los mpx frontales del producto son requeridos.");
        setLoading(false);
        return;
      }
      if (!battery) {
        toast.error("La bateria del producto es requerida.");
        setLoading(false);
        return;
      }

      if (name && id && category) {
        let categoryId = selectedCategoryId;
        if (selectedCategoryId === "") {
          categoryId = category.id;
        }
        updateProductRequest(id, {
          categoryId: categoryId,
          name: inputName,
          price,
          description,
          inventoryCount,
          rating: inputRating,
          imagen,
          ram,
          investments: inversion,
          storage,
          mpxCameraBack: mpxback,
          mpxCameraFront: mpxfront,
          battery,
          sedeId,
        })
          .then((res) => {
            toast.success("Producto actualizado con exito.");
            setProducts((prev) => {
              const products = prev?.filter((product) => {
                return product.id !== id;
              });
              res.data.data.rating = ratingValue;
              return prev ? [res.data.data, ...(products || [])] : null;
            });
          })
          .catch((err) => {
            console.log(err);
            toast.error("Error al crear el producto.");
          })
          .finally(() => {
            setLoading(false);
            onClose();
          });
      }

      if (!name) {
        console.log("Creando telefono");
        console.log("Creando telefono");
        createProductRequest({
          categoryId: selectedCategoryId,
          name: inputName,
          price,
          description,
          inventoryCount,
          rating: inputRating,
          imagen,
          investments: inversion,
          ram,
          storage,
          mpxCameraBack: mpxback,
          mpxCameraFront: mpxfront,
          battery,
          sedeId,
        })
          .then((res) => {
            toast.success("Producto creado con exito.");
            setProducts((prev) => {
              res.data.data.rating = ratingValue;
              return prev ? [res.data.data, ...prev] : null;
            });
          })
          .catch((err) => {
            console.log(err);
            toast.error("Error al crear el producto.");
          })
          .finally(() => {
            setLoading(false);
            onClose();
          });
      }
    } else {
      if (name && id && category) {
        let categoryId = selectedCategoryId;
        if (selectedCategoryId === "") {
          categoryId = category.id;
        }
        updateProductRequest(id, {
          categoryId: categoryId,
          name: inputName,
          price,
          description,
          inventoryCount,
          investments: inversion,
          rating: inputRating,
          imagen,
          sedeId,
        })
          .then((res) => {
            toast.success("Producto actualizado con exito.");
            setProducts((prev) => {
              const products = prev?.filter((product) => {
                return product.id !== id;
              });
              res.data.data.rating = ratingValue;
              return prev ? [res.data.data, ...(products || [])] : null;
            });
          })
          .catch((err) => {
            console.log(err);
            toast.error("Error al crear el producto.");
          })
          .finally(() => {
            setLoading(false);
            onClose();
          });
      }

      if (!name) {
        createProductRequest({
          categoryId: selectedCategoryId,
          name: inputName,
          price,
          description,
          inventoryCount,
          investments: inversion,
          rating: inputRating,
          imagen,
          sedeId,
        })
          .then((res) => {
            toast.success("Producto creado con exito.");
            setProducts((prev) => {
              res.data.data.rating = ratingValue;
              return prev ? [res.data.data, ...prev] : null;
            });
          })
          .catch((err) => {
            console.log(err);
            toast.error("Error al crear el producto.");
          })
          .finally(() => {
            setLoading(false);
            onClose();
          });
      }
    }
  };

  return (
    <Modal isOpen={isOpen} size="5xl" onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h1 className="text-2xl">Agregar Porducto</h1>
            </ModalHeader>
            <ModalBody>
              <Form onSubmit={handleSubmit}>
                <ScrollShadow
                  hideScrollBar
                  className=" flex gap-8 w-full flex-col lg:flex-row h-96 lg:h-auto"
                >
                  <div className="flex flex-col items-center w-full gap-4">
                    {/* Content */}
                    <div className="p-6">
                      {!selectedFile && !previewUrl ? (
                        // Upload Area
                        <div className="border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200  border-gray-300 hover:border-gray-400 ">
                          <BiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-sm text-gray-500 mb-4">
                            Haz clic para seleccionar
                          </p>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            type="button"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                          >
                            Seleccionar archivo
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileInputChange}
                            className="hidden"
                          />
                          <p className="text-xs text-gray-400 mt-3">
                            JPEG, PNG, GIF, WebP (máx. 15MB)
                          </p>
                        </div>
                      ) : (
                        // Preview Area
                        <div className="space-y-4">
                          {/* Image Preview */}
                          <div className="relative">
                            <img
                              src={previewUrl || ""}
                              alt="Preview"
                              className="w-full h-64 object-cover rounded-lg border border-gray-200"
                            />
                            {!loading && (
                              <button
                                onClick={() => {
                                  setSelectedFile(null);
                                  setPreviewUrl(null);
                                  setError(null);
                                }}
                                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200"
                              >
                                <BiX className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Error Message */}
                      {error && (
                        <div className="mt-4 flex items-center p-3 bg-red-50 text-red-800 rounded-lg">
                          <Alert className="w-5 h-5 mr-2 flex-shrink-0" />
                          <span className="text-sm">{error}</span>
                        </div>
                      )}
                    </div>
                    <Textarea
                      label="Descripción:"
                      name="description"
                      isRequired
                      defaultValue={description}
                      labelPlacement="outside"
                      placeholder="Introduce la descripción del Producto."
                    />
                  </div>
                  <div className="flex flex-col gap-6 w-full justify-center">
                    <div className="flex gap-8 justify-between flex-col lg:flex-row">
                      <Input
                        name="name"
                        label="Nombre:"
                        defaultValue={name}
                        labelPlacement="outside"
                        isRequired
                        placeholder="Introduce el nombre del Producto."
                        type="text"
                      />
                      {selectedCategory === "Smartphones" ||
                        (selectedCategory === "Telefonos" && (
                          <Input
                            name="bateria"
                            label="Bateria:"
                            labelPlacement="outside"
                            defaultValue={battery?.toString()}
                            isRequired
                            placeholder="Introduce la bateria del Producto."
                            type="text"
                          />
                        ))}
                    </div>
                    <div className="flex gap-8 justify-between flex-col lg:flex-row">
                      <Selected setSelectedCategory={setSelectedCategory} />
                      <Select
                        isRequired
                        className="w-full"
                        label="Sede"
                        name="sede"
                        placeholder="Seleccione la Sede"
                        labelPlacement="outside"
                        onChange={handleSedeId}
                      >
                        {sedes.map((sede) => (
                          <SelectItem key={sede.id}>
                            {sede.direction}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                    {selectedCategory === "Smartphones" ||
                      (selectedCategory === "Telefonos" && (
                        <div className="flex flex-col gap-4">
                          <div className="flex gap-8">
                            <Input
                              name="ram"
                              label="RAM:"
                              defaultValue={ram?.toString()}
                              labelPlacement="outside"
                              isRequired
                              placeholder="Introduce la RAM del Producto."
                              type="text"
                            />
                            <Input
                              name="storage"
                              label="Storage:"
                              defaultValue={storage?.toString()}
                              labelPlacement="outside"
                              isRequired
                              placeholder="Introduce el almacenamiento del Producto."
                              type="text"
                            />
                          </div>
                          <div className="flex gap-8">
                            <Input
                              name="front"
                              label="MPX Frontal:"
                              defaultValue={mpxCameraFront?.toString()}
                              labelPlacement="outside"
                              isRequired
                              placeholder="Introduce los mpx frontal del Producto."
                              type="text"
                            />
                            <Input
                              name="back"
                              label="MPX Trasera:"
                              defaultValue={mpxCameraBack?.toString()}
                              labelPlacement="outside"
                              isRequired
                              placeholder="Introduce los mpx traseros del Producto."
                              type="text"
                            />
                          </div>
                        </div>
                      ))}
                    <div className="flex gap-8 flex-col lg:flex-row">
                      <Rating
                        ratingValue={ratingValue}
                        setRatingValue={setRatingValue}
                      />
                      <Input
                        label="Inversion"
                        name="inversion"
                        isRequired
                        labelPlacement="outside"
                        defaultValue={investments?.toString()}
                        placeholder="0.00"
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">
                              $
                            </span>
                          </div>
                        }
                        type="number"
                      />
                    </div>
                    <div className="flex justify-between w-full gap-8 flex-col lg:flex-row">
                      <Input
                        label="Precio"
                        name="price"
                        isRequired
                        defaultValue={price?.toString()}
                        labelPlacement="outside"
                        placeholder="0.00"
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">
                              $
                            </span>
                          </div>
                        }
                        type="number"
                      />
                      <Input
                        label="Cantidad"
                        required
                        isRequired
                        name="inventoryCount"
                        defaultValue={inventoryCount?.toString()}
                        labelPlacement="outside"
                        placeholder="Introduce la cantidad"
                        type="number"
                      />
                    </div>
                  </div>
                </ScrollShadow>
                <div className="flex justify-end p-5 w-full gap-8">
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => {
                      onClose();
                      setRatingValue(0);
                    }}
                  >
                    Cerrar
                  </Button>
                  <Button color="primary" type="submit" disabled={loading}>
                    {loading && <Spinner color="default" />}
                    {!loading && "Guardar"}
                  </Button>
                </div>
              </Form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalAddProduct;
