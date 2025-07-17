import {
  ChangeEvent,
  Key,
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
  SortDescriptor,
  Tooltip,
  useDisclosure,
  Spinner,
} from "@heroui/react";
import {
  ChevronDownIcon,
  DeleteIcon,
  EditIcon,
  PlusIcon,
  SearchIcon,
} from "../Icons";
import ModalAddPayment from "./ModalAddPayment";
import usePaymentMethod from "../../customHooks/usePaymentMethod";
import { toast } from "sonner";
import { AddPaymentMethodProps, PaymentMethod } from "../../type";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export function Capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

const columns = [
  { name: "TARJETA", uid: "card", sortable: true },
  { name: "NÚMERO", uid: "number", sortable: true },
  { name: "MOVIL A CONFIRMAR", uid: "movil", sortable: true },
  { name: "CANTIDAD DE PAGOS", uid: "payment", sortable: true },
  { name: "FECHA", uid: "createdAt", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "card",
  "number",
  "movil",
  "payment",
  "createdAt",
  "actions",
];

export default function PaymentsMethodTable() {
  const {
    error,
    loading,
    paymentMethod,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
  } = usePaymentMethod();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [filterValue, setFilterValue] = useState("");

  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();

  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const [selectedPaymantMethod, setSelectedPaymantMethod] =
    useState<AddPaymentMethodProps | null>(null);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    if (!paymentMethod) {
      return [];
    }
    let filteredPayments = [...paymentMethod];

    if (hasSearchFilter) {
      filteredPayments = filteredPayments.filter(
        (payment) =>
          payment.paymentOptions
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          payment.cardNumber
            ?.toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase())
      );
    }

    return filteredPayments;
  }, [paymentMethod, hasSearchFilter, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const sortedItems = useMemo(() => {
    const sorted = [...filteredItems].sort(
      (a: PaymentMethod, b: PaymentMethod) => {
        const first = a[sortDescriptor?.column as never] as number;
        const second = b[sortDescriptor?.column as never] as number;
        const cmp = first < second ? -1 : first > second ? 1 : 0;

        return sortDescriptor?.direction === "descending" ? -cmp : cmp;
      }
    );

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

  const handleDelete = useCallback(
    (id: string) => () => {
      deletePaymentMethod(id);
    },
    [deletePaymentMethod]
  );

  const renderCell = useCallback(
    (paymentMethod: PaymentMethod, columnKey: Key) => {
      const cellValue = paymentMethod[columnKey as keyof PaymentMethod];

      switch (columnKey) {
        case "card":
          return (
            <User
              avatarProps={{ radius: "lg", src: paymentMethod.cardImage }}
              description={paymentMethod.id}
              name={paymentMethod.paymentOptions}
            />
          );
        case "number":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {paymentMethod.cardNumber}
              </p>
            </div>
          );
          case "movil":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {paymentMethod.phoneNumber}
              </p>
            </div>
          );
        case "payment":
          return (
            <div className="flex justify-center">
              <Chip
                className="capitalize"
                color="success"
                size="sm"
                variant="flat"
              >
                {paymentMethod._count.payment}
              </Chip>
            </div>
          );
        case "createdAt":
          return (
            <div>
              <p className="text-bold text-small capitalize">
                {formatearFecha(paymentMethod.createdAt)}
              </p>
            </div>
          );
        case "actions":
          return (
            <div className="relative flex justify-center items-center gap-2">
              <Tooltip content="Edit Payment Method" color="warning">
                <button
                  onClick={() => {
                    if (paymentMethod.cardNumber) {
                      onOpen();
                      setSelectedPaymantMethod({
                        image: paymentMethod.cardImage,
                        numberCard: paymentMethod.cardNumber,
                        phoneNumber: paymentMethod.phoneNumber,
                        selected: paymentMethod.paymentOptions,
                        id: paymentMethod.id,
                      });
                    }
                  }}
                  className="text-lg text-warning cursor-pointer active:opacity-50"
                >
                  <EditIcon />
                </button>
              </Tooltip>
              <Tooltip color="danger" content="Delete Payment Method">
                <button
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                  onClick={handleDelete(paymentMethod.id)}
                >
                  <DeleteIcon />
                </button>
              </Tooltip>
            </div>
          );
        default:
          return String(cellValue);
      }
    },
    [handleDelete, onOpen]
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
            color="success"
            className="w-full sm:max-w-[44%]"
            placeholder="Búsqueda..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3 w-full justify-center sm:w-auto">
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
            <Button
              color="success"
              endContent={<PlusIcon />}
              onPress={() => {
                onOpen();
                setSelectedPaymantMethod(null);
              }}
            >
              Nuevo metodo de pago
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {paymentMethod?.length} pagos
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
    visibleColumns,
    onOpen,
    paymentMethod?.length,
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
      <h1 className="text-4xl font-medium text-left">Metodos de Pago</h1>
      {error && error.map((err) => toast.error(err))}

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
                column.uid === "actions" || column.uid === "payment"
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
          loadingContent={<Spinner color="white" />}
          emptyContent={"No users found"}
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
      <ModalAddPayment
        isOpen={isOpen}
        onClose={onClose}
        updatePaymentMethod={updatePaymentMethod}
        addPaymentMethod={addPaymentMethod}
        {...selectedPaymantMethod}
      />
    </div>
  );
}
