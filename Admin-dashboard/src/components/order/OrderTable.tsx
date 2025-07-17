import {
  ChangeEvent,
  Key,
  lazy,
  Suspense,
  SVGProps,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  Tooltip,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import { ChevronDownIcon, EyeIcon, PlusIcon, SearchIcon } from "../Icons";
import useOrder from "../../customHooks/useOrder";
import { toast } from "sonner";
import { Order } from "../../type";
import { useNavigate } from "react-router-dom";
const ModalProductsView = lazy(() => import("./ModalProductsView"));

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export function Capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

const columns = [
  { name: "USUARIO", uid: "username", sortable: true },
  { name: "PRECIO TOTAL", uid: "totalAmount", sortable: true },
  { name: "CANTIDAD DE PRODUCTOS", uid: "productquantity", sortable: true },
  { name: "ESTADO", uid: "pending", sortable: true },
  { name: "FECHA", uid: "createdAt" },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "COMPLETADO", uid: "false" },
  { name: "PENDIENTE", uid: "true" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  false: "success",
  true: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "username",
  "totalAmount",
  "productquantity",
  "createdAt",
  "pending",
  "actions",
];

export default function OrderTable() {
  const { error, loading, orders } = useOrder();
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [filterValue, setFilterValue] = useState("");

  const [orderId, setOrderId] = useState<string>("");

  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });

  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    if (!orders) {
      return [];
    }

    let filteredOrders = [...orders];

    if (hasSearchFilter) {
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.client?.baseUser?.username
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          order.admin?.baseUser?.username
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          order.totalAmount
            .toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredOrders = filteredOrders.filter((order) =>
        Array.from(statusFilter).includes(String(order.pending))
      );
    }

    return filteredOrders;
  }, [orders, hasSearchFilter, statusFilter, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const sortedItems = useMemo(() => {
    const sorted = [...filteredItems].sort((a: Order, b: Order) => {
      const first = a[sortDescriptor.column as keyof Order] as number;
      const second = b[sortDescriptor.column as keyof Order] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sorted.slice(start, end);
  }, [
    filteredItems,
    page,
    rowsPerPage,
    sortDescriptor.column,
    sortDescriptor.direction,
  ]);

  const formatearFecha = (isoString: string) => {
    const meses = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];

    const fecha = new Date(isoString);

    const dia = fecha.getUTCDate();
    const mes = meses[fecha.getUTCMonth()];
    const anio = fecha.getUTCFullYear();

    return `${dia} ${mes} ${anio}`;
  };

  const renderCell = useCallback(
    (orders: Order, columnKey: Key) => {
      const cellValue = orders[columnKey as keyof Order];

      switch (columnKey) {
        case "username":
          return orders.client ? (
            <User
              avatarProps={{ radius: "lg", src: orders.client.baseUser.image }}
              name={orders.client?.baseUser.username}
            />
          ) : (
            <User
              avatarProps={{ radius: "lg", src: orders.admin.baseUser.image }}
              name={orders.admin?.baseUser?.username}
            />
          );
        case "totalAmount":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {orders.totalAmount}$
              </p>
            </div>
          );
        case "pending":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[String(orders.pending)]}
              size="sm"
              variant="flat"
            >
              {orders.pending ? "Pendiente" : "Completada"}
            </Chip>
          );
        case "productquantity":
          return (
            <span className="font-semibold flex justify-center">
              {orders._count.orderItems}
            </span>
          );
        case "createdAt":
          return (
            <div>
              <p className="text-bold text-small capitalize">
                {formatearFecha(orders.createdAt)}
              </p>
            </div>
          );
        case "actions":
          return (
            <div className="relative flex justify-center items-center gap-2">
              <Tooltip content="Details" color="success">
                <span className="text-lg text-success cursor-pointer active:opacity-50">
                  <EyeIcon
                    onClick={() => {
                      onOpen();
                      setOrderId(orders.id);
                    }}
                    color="success"
                  />
                </span>
              </Tooltip>
            </div>
          );

        default:
          return String(cellValue);
      }
    },
    [onOpen]
  );

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    const handleNavigate = () => {
      navigate("/neworder");
    };
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between gap-3 items-end ">
          <Input
            isClearable
            color="warning"
            className="w-full sm:max-w-[44%]"
            placeholder="Búsqueda..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3 w-full justify-center sm:w-auto ">
            <Dropdown>
              <DropdownTrigger >
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Estado
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {Capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columnas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {Capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              color="warning"
              endContent={<PlusIcon />}
              onPress={handleNavigate}
            >
              Nueva Orden
            </Button>
            {/* <ModalAddOrder isOpen={isOpen} onClose={onClose} /> */}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {orders?.length} Ordenes
          </span>
          <label className="flex items-center text-default-400 text-small">
            Filas por páginas:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    statusFilter,
    visibleColumns,
    orders?.length,
    onRowsPerPageChange,
    onClear,
    navigate,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="warning"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className=" justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="md"
            variant="flat"
            onPress={onPreviousPage}
            color="danger"
            className="mx-2"
          >
            Anterior
          </Button>
          <Button
            isDisabled={pages === 1}
            size="md"
            variant="flat"
            onPress={onNextPage}
            color="success"
          >
            Siguiente
          </Button>
        </div>
      </div>
    );
  }, [page, pages, onPreviousPage, onNextPage]);

  return (
    <>
      {error && error.map((err) => toast.error(err))}
      {isOpen && (
        <Suspense
          fallback={
            <div className="w-full flex justify-center fixed pt-2">
              <Spinner color="warning" />
            </div>
          }
        >
          <ModalProductsView isOpen={isOpen} onClose={onClose} id={orderId} />
        </Suspense>
      )}
      <Table
        isHeaderSticky
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[600px]",
        }}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={
                column.uid === "actions" ||
                column.uid === "productquantity" ||
                column.uid === "totalAmount"
                  ? "center"
                  : "start"
              }
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          isLoading={loading}
          loadingContent={<Spinner color="warning" />}
          emptyContent={"No se encontraron ordenes"}
          items={sortedItems}
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
    </>
  );
}
