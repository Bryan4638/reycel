import { AreaChart } from "@tremor/react";
import { useCallback, useEffect, useState } from "react";
import { getPaymentsRequest } from "../../services/analytics";
import { PaymentAnalytics } from "../../type";
import { toast } from "sonner";
import { DateRangePickerValue } from "@tremor/react";

interface Props {
  value: DateRangePickerValue;
}

export function MonthlyEarnings({ value }: Props) {
  const [payments, setPayments] = useState<PaymentAnalytics[] | null>(null);
  useEffect(() => {
    const startDate = value.from?.toUTCString();
    const endDate = value.to?.toUTCString();

    if (startDate && endDate) {
      getPaymentsRequest(startDate, endDate)
        .then((res) => {
          setPayments(res.data.chartData);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error al cargar el esatdo de los pagos");
        });
    }
  }, [value.from, value.to]);

  const precioTotal = useCallback(
    () =>
      payments?.reduce((total, payments) => {
        return total + payments.GananciasBrutas;
      }, 0),
    [payments]
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between items-center w-full">
        <div>
          <h3 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
            Ganancias Anuales
          </h3>
          <p className="text-tremor-metric text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
            ${precioTotal()}
          </p>
        </div>
      </div>
      {payments && value.from && value.to && (
        <AreaChart
          data={payments}
          index="month"
          categories={["Monto_en_Ventas", "Invercion", "GananciasBrutas"]}
          colors={["red", "blue", "green"]}
          showLegend={false}
          showYAxis={false}
          startEndOnly={true}
          className="-mb-2 mt-8 h-48"
        />
      )}
    </>
  );
}
