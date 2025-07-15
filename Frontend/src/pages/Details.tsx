import { useState } from "react";
import { Spinner } from "@heroui/spinner";
import { toast } from "sonner";
import Comment from "../components/Details/Comment";
import FormComment from "../components/Details/FormComment";
import Star from "../components/Details/Star";
import { Input, useDisclosure } from "@heroui/react";
import AuthUser from "./auth/AuthUser";
import { useProductDetails } from "../customHooks/useProductDetails";
import { useUserStore } from "../store/useUserStore";
// import ModalLogin from "./auth/ModalLogin";

export default function Details() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [quantity, setQuantity] = useState("1");
  const [query] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("p") ?? "";
  });

  const {
    rating,
    ratingAverage,
    loading,
    error,
    product,
    comments,
    updateRating,
    createComment,
    addItemCarShop,
  } = useProductDetails(query);

  const { isAuth } = useUserStore();

  const handleRating = (value: number) => {
    if (!isAuth) {
      onOpen();
      return;
    }
    updateRating(value);
  };


  const handleFormComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAuth) {
      onOpen();
      return;
    }
    const { elements } = event.currentTarget;
    const input = elements.namedItem("comment") as RadioNodeList;

    await createComment(input.value);

    input.value = "";
  };

  const handleAddCorShop = () => {
    if (!isAuth) {
      onOpen();
      return;
    }
    addItemCarShop(parseInt(quantity))
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
        }
        if (res.status === 202) {
          toast.error(
            `Aviso: ${res.data.message || "Hubo un problema con la solicitud."}`
          );
        }
        if (res.status === 203) {
          toast.warning(
            `Aviso: ${res.data.message || "Hubo un problema con la solicitud."}`
          );
        }
      })
      .catch(() => {
        toast.error("Error al añadir un producto al carrito.");
      });
  };

  return (
    <>
      <div className="bg-white min-h-screen p-4 pt-20 rounded-lg shadow-md max-w-full max-h-full mx-auto mt-1">
        {product && (
          <div className="flex flex-col md:grid md:grid-cols-2 md:justify-evenly">
            <div className="md:w-2/5 md:fixed md:left-20">
              <img
                src={product.originImage}
                alt={product.name}
                className="md:w-11/12 w-full rounded-lg"
              />
            </div>
            <div className="md:w-full md:pr-8 mt-4 md:mt-0 md:col-start-2">
              <h1 className="text-4xl font-semibold text-gray-800">
                {product.category.name === "Smartphones" && (
                  <>
                    {`${product.name},  Ram ${product.ram}GB, Almacenamiento ${product.storage}GB `}
                  </>
                )}

                {product.category.name !== "Smartphones" && (
                  <>{`${product.name} `}</>
                )}
              </h1>
              <p className="text-2xl text-gray-600 mt-2">
                ${product.price * parseInt(quantity)}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className={`h-5 w-5 fill-current ${
                          ratingAverage > index + 0.5
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.122-6.545L.368 6.91l6.564-.955L10 0l3.068 5.955 6.564.955-4.878 4.635 1.122 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-600 ml-2">
                    {ratingAverage} de 5
                  </span>
                </div>
              </div>
              {product.inventoryCount >= 1 && (
                <div className="mt-3">
                  <span className="text-green-600 font-medium">En stock</span>
                </div>
              )}

              {product.inventoryCount === 0 && (
                <span className="me-2 rounded bg-red-400 px-2.5 py-0.5 text-xs font-medium text-zinc-100">
                  {" "}
                  No hay uniddades{" "}
                </span>
              )}
              {product.inventoryCount <= 4 && product.inventoryCount !== 0 && (
                <span className="me-2 py-0.5 text-sm font-medium text-red-400">
                  {`Queda(n) ${product.inventoryCount} hay más unidades en camino`}
                </span>
              )}

              <div className="flex gap-2 items-center mt-4">
                <h4 className="text-slate-600 font-semibold">Cantidad:</h4>
                <Input
                  className="w-20"
                  placeholder="0"
                  labelPlacement="outside"
                  color="primary"
                  value={quantity}
                  onValueChange={(value) => {
                    if (
                      parseInt(value) > 0 &&
                      parseInt(value) <= product.inventoryCount
                    ) {
                      setQuantity(value);
                    }
                  }}
                  type="number"
                />
                <button
                  onClick={handleAddCorShop}
                  className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-800"
                >
                  {
                    <svg
                      className="-ms-2 me-2 h-5 w-5"
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
                        d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                      />
                    </svg>
                  }
                  Añadir
                </button>
              </div>
              <div className="mt-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Descripción del producto
                </h2>
                <p className="mt-2 text-gray-600">{product.description}</p>
              </div>
              <div className="mt-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Valoraciones y Reseñas
                </h2>
                <Star value={rating} onChange={handleRating} />
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Reseñas
                  </h3>
                  <FormComment onSubmit={handleFormComment} />
                  <strong className="pt-5">
                    {comments?.length} Reseñas de este producto.
                  </strong>
                  {comments !== null &&
                    comments.length > 0 &&
                    comments.map((comment) => {
                      return (
                        <Comment
                          key={comment.id}
                          content={comment.content}
                          client={comment.client}
                          createdAt={comment.createdAt}
                        ></Comment>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}
        {loading && (
          <div className="w-full h-screen flex justify-center items-center">
            <Spinner size="lg" color="primary" />
          </div>
        )}
        {error && error.map((err) => toast.error(err))}

        <AuthUser
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onClose={onClose}
        ></AuthUser>
      </div>
    </>
  );
}
