import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from "@heroui/react";
import React, { FC, useEffect, useMemo, useState } from "react";
import { getOrderItemsRequest } from "../../services/order";
import { OrderItem } from "../../type";
import { toast } from "sonner";

interface Props {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

const columns = [
  { name: "NOMBRE", uid: "name" },
  { name: "CANTIDAD", uid: "quantity" },
  { name: "PRECIO TOTAL", uid: "totalPrice" },
];

const ModalPayDetails: FC<Props> = ({ id, isOpen, onClose }) => {
  const [items, setItems] = useState<OrderItem[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getOrderItemsRequest(id)
      .then((res) => {
        setItems(res.data.data.orderItems);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error al cargar los productos");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const itemsFilter = useMemo((): OrderItem[] => {
    if (!items) {
      return [];
    }

    return items;
  }, [items]);

  const renderCell = React.useCallback(
    (item: OrderItem, columnKey: React.Key) => {
      const cellValue = item[columnKey as keyof OrderItem];

      switch (columnKey) {
        case "name":
          return (
            <User
              avatarProps={{ radius: "lg", src: item.product.imagen }}
              description={
                <div className=" flex items-center justify-center gap-2">
                  <div className="flex items-center">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          className={`h-4 w-4 fill-current ${
                            item.product.ratingAverage - 0.5 > index
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
                  </div>
                </div>
              }
              name={item.product.name}
            ></User>
          );
        case "quantity":
          return (
            <div className="flex  justify-center">
              <p className="text-bold text-sm capitalize">{item.quantity}</p>
            </div>
          );
        case "totalPrice":
          return (
            <div className="flex justify-center ">
              <p className="text-bold text-sm capitalize">{item.price}</p>
            </div>
          );
        default:
          return String(cellValue);
      }
    },
    []
  );

  return (
    <>
      <Modal
        classNames={{ body: "px-1" }}
        backdrop={"opaque"}
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-end  space-x-2 gap-1 font-[sans-serif] ">
                <img src="./logo.webp" alt="Logo reycel" className="w-10 h-8" />
                <h1 className="text-2xl font-bold">Detalles del Pago</h1>
              </ModalHeader>
              <ModalBody>
                <Table
                  aria-label="Example table with custom cells"
                  shadow="none"
                  isHeaderSticky
                  classNames={{ wrapper: "max-h-[500px] max-w-full" }}
                >
                  <TableHeader columns={columns}>
                    {(column) => (
                      <TableColumn
                        key={column.uid}
                        align={
                          column.uid === "quantity" ||
                          column.uid === "totalPrice"
                            ? "center"
                            : "start"
                        }
                      >
                        {column.name}
                      </TableColumn>
                    )}
                  </TableHeader>
                  <TableBody
                    items={itemsFilter}
                    isLoading={loading}
                    loadingContent={<Spinner color="warning" />}
                  >
                    {(item) => (
                      <TableRow key={item.id}>
                        {(columnKey) => (
                          <TableCell>{renderCell(item, columnKey)}</TableCell>
                        )}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter className="flex min-w-full justify-end gap-3">
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalPayDetails;
