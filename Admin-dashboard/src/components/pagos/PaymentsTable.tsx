import {
  ChangeEvent,
  Key,
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
import { ChevronDownIcon, EyeIcon, SearchIcon } from "../Icons";
import usePayments from "../../customHooks/usePayments";
import { Payment } from "../../type";
import { toast } from "sonner";
import ModalPayDetails from "./ModalPayDetails";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export function Capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

const columns = [
  { name: "USUARIO", uid: "user", sortable: true },
  { name: "PRECIO TOTAL", uid: "price", sortable: true },
  { name: "FAST DELIVERY", uid: "fastDelivery", sortable: true },
  { name: "CANTIDAD DE PRODUCTOS", uid: "productquantity", sortable: true },
  { name: "METODO DE PAGO", uid: "paymentMethod" },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "FECHA", uid: "date" },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "COMPLETADO", uid: "COMPLETED" },
  { name: "PENDIENTE", uid: "PENDING" },
  { name: "CANCELADO", uid: "FAILED" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  COMPLETED: "success",
  PENDING: "warning",
  FAILED: "danger",
};

const INITIAL_VISIBLE_COLUMNS = [
  "user",
  "fastDelivery",
  "price",
  "productquantity",
  "paymentMethod",
  "date",
  "idorder",
  "status",
  "actions",
];

export default function PaymentsTable() {
  const { error, loading, payments } = usePayments();

  const [orderId, setOrderId] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [filterValue, setFilterValue] = useState("");

  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();

  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    if (!payments) {
      return [];
    }
    let filteredPayments = [...payments];

    if (hasSearchFilter) {
      filteredPayments = filteredPayments.filter(
        (payment) =>
          payment.client.baseUser.username
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          payment.PaymentMethod.paymentOptions
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          payment.paymentStatus
            .toLowerCase()
            .includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredPayments = filteredPayments.filter((payment) =>
        Array.from(statusFilter).includes(payment.paymentStatus)
      );
    }

    return filteredPayments;
  }, [payments, hasSearchFilter, statusFilter, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const sortedItems = useMemo(() => {
    const sorted = [...filteredItems].sort((a: Payment, b: Payment) => {
      const first = a[sortDescriptor?.column as keyof Payment] as number;
      const second = b[sortDescriptor?.column as keyof Payment] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor?.direction === "descending" ? -cmp : cmp;
    });

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sorted.slice(start, end);
  }, [
    filteredItems,
    page,
    rowsPerPage,
    sortDescriptor?.column,
    sortDescriptor?.direction,
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
    (payments: Payment, columnKey: Key) => {
      const cellValue = payments[columnKey as keyof Payment];

      switch (columnKey) {
        case "user":
          return payments.client ? (
            <User
              avatarProps={{ radius: "lg", src: payments.client.baseUser.image }}
              name={payments.client?.baseUser.username}
            />
          ) : (
            <User
              avatarProps={{ radius: "lg", src: payments.admin.baseUser.image }}
              name={payments.admin?.baseUser?.username}
            />
          );
        case "price":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {payments.amount}$
              </p>
            </div>
          );
        case "productquantity":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {payments.order._count.orderItems}
              </p>
            </div>
          );
        case "paymentMethod":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {payments.PaymentMethod.paymentOptions}
              </p>
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[payments.paymentStatus]}
              size="sm"
              variant="flat"
            >
              {payments.paymentStatus}
            </Chip>
          );
        case "date":
          return (
            <div>
              <p className="text-bold text-small capitalize">
                {formatearFecha(payments.createdAt)}
              </p>
            </div>
          );
        case "actions":
          return (
            <div className="relative flex justify-center items-center gap-2">
              <Tooltip content="Detalles" color="success">
                <span className="text-lg text-success cursor-pointer active:opacity-50">
                  <EyeIcon
                    onClick={() => {
                      onOpen();
                      setOrderId(payments.orderId);
                    }}
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
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            color="success"
            placeholder="Búsqueda..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3 w-full justify-center sm:w-auto ">
            <Dropdown>
              <DropdownTrigger>
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
              <DropdownTrigger >
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
            {/*       <Button color="success" endContent={<PlusIcon />} onPress={onOpen}>
              Nuevo Pago
            </Button>
            <ModalAddPayment isOpen={isOpen} onClose={onClose} /> */}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {payments?.length} pagos
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
    payments?.length,
    onRowsPerPageChange,
    onClear,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="success"
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
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-medium text-left">Tabla de Pagos</h1>
      {error && error.map((err) => toast.error(err))}
      {isOpen && (
        <Suspense
          fallback={
            <div className="w-full flex justify-center fixed pt-2">
              <Spinner color="warning" />
            </div>
          }
        >
          <ModalPayDetails isOpen={isOpen} onClose={onClose} id={orderId} />
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
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          isLoading={loading}
          loadingContent={<Spinner color="success" />}
          emptyContent={"No hay pagos aún"}
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
    </div>
  );
}
