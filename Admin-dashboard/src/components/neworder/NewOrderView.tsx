import { Input } from "@heroui/react";
import { FC, useState } from "react";
import { OrderAdd } from "../../type";
import { toast } from "sonner";
import {
  deleteOrderItemRequest,
  updateOrderItemRequest,
} from "../../services/neworder";

interface Product {
  quantity: number;
  image: string;
  name: string;
  price: number;
  id: string;
  inventoryCount: number;
  setOrder: (order: OrderAdd | null) => void;
  setErrors: (errors: Array<string>) => void;
}

const NewOrderView: FC<Product> = ({
  id,
  image,
  name,
  quantity,
  price,
  inventoryCount,
  setOrder,
  setErrors,
}) => {
  const [value, setvalue] = useState(`${quantity}`);
  const [realPrice] = useState(price);

  console.log(inventoryCount);

  const handleOrderDelete = () => {
    deleteOrderItemRequest(id)
      .then((res) => {
        setOrder(res.data.data);
        toast.success("Producto eliminado del carrito");
      })
      .catch((error) => {
        console.log(error);
        setErrors(["Error al elimiar el producto del carrito"]);
      });
  };

  const handleQuantity = (value: string, id: string, price: number) => {
    updateOrderItemRequest(id, Number(value), price)
      .then((res) => {
        setOrder(res.data.data);
        toast.success("Cantidad actualizado en el carrito");
      })
      .catch((error) => {
        console.log(error);
        setErrors(["Error al actualizar el producto en el carrito"]);
      });
  };

  return (
    <div className="bg-white p-3 cursor-pointer shadow-sm rounded-md transition-all">
      <div className="w-full overflow-hidden mx-auto">
        <img
          src={image}
          alt={name}
          className="aspect-[108/82] w-full object-contain"
        />
      </div>
      <div className="text-left mt-4">
        <h3 className="text-sm font-bold text-gray-800 line-clamp-1">{name}</h3>
        <div className="flex justify-between items-center gap-2">
          <h4 className="text-md text-sky-900 font-bold mt-2">${price}</h4>
          <Input
            className="w-16 pl-2 mt-2"
            placeholder="0"
            labelPlacement="outside"
            color="primary"
            value={value}
            onValueChange={(value) => {
              if (parseInt(value) > 0 && parseInt(value) <= inventoryCount) {
                setvalue(value);
                handleQuantity(value, id, realPrice);
              }
            }}
            type="number"
          />{" "}
          <button
            onClick={handleOrderDelete}
            className="mt-2 min-w-5 min-h-5 text-white bg-red-500 text-sm font-bold rounded"
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewOrderView;
