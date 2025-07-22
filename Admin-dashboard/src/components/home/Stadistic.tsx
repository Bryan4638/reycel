import {
  Card,
  DateRangePicker,
  DateRangePickerItem,
  DateRangePickerValue,
} from "@tremor/react";
import { MonthlyEarnings } from "./MonthlyEarnings";
import { PaymentStatus } from "./Paymnets/PaymentStatus";
//import { ProductAnalytics } from "./ProductAnalytics";
import useAnalytics from "../../customHooks/useAnalytics";
import { toast } from "sonner";
import { useState } from "react";
import { es } from "date-fns/locale";

export default function Stadistic() {
  const [dateRange, setDateRange] = useState<DateRangePickerValue>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(new Date().getFullYear(), 11, 31),
  });
  const {
    error,
    bestSellingProduct,
    leastSellingProduct,
    sedeWithMostSales,
    sedeWithLeastSales,
  } = useAnalytics({ value: dateRange });

  return (
    <>
      {error && toast.error(error)}
      <section className="px-2 ml-0 lg:px-5 lg:ml-5 pt-3">
        {/* <section className="grid gap-4 sm:grid-cols-2 ">
          {analytics?.dataProductsByMonth !== undefined && (
            <CardGeneralData
              title="Productos"
              chartdata={analytics?.dataProductsByMonth}
              growth={Number(analytics.growthProducts)}
              total={analytics.totalProduct}
            />
          )}
          {analytics?.dataUsersByMonth !== undefined && (
            <CardGeneralData
              title="Usuario"
              chartdata={analytics?.dataUsersByMonth}
              growth={Number(analytics.growthUsers)}
              total={analytics.totalUser}
            />
          )}
        </section> */}
        <div className="flex justify-end items-center pt-6 pb-1">
          <DateRangePicker
            value={dateRange}
            onValueChange={setDateRange}
            locale={es}
            selectPlaceholder="Seleccionar"
            color="rose"
          >
            <DateRangePickerItem
              key="lastYear"
              value="lastYear"
              from={new Date(new Date().getFullYear() - 1, 0, 1)}
              to={new Date(new Date().getFullYear() - 1, 11, 31)}
            >
              Año anterior
            </DateRangePickerItem>
            <DateRangePickerItem
              key="half"
              value="half"
              from={new Date(new Date().getFullYear(), 0, 1)}
              to={new Date(new Date().getFullYear(), 11, 31)}
            >
              Año Presente
            </DateRangePickerItem>
          </DateRangePicker>
        </div>

        <section className="pt-5">
          <Card>
            <MonthlyEarnings value={dateRange} />
          </Card>
        </section>

        <section className="pt-10 flex flex-col">
          <div className="pt-3 w-full grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {bestSellingProduct && (
              <Card>
                <PaymentStatus
                  chartData={bestSellingProduct}
                  text="Productos mas vendidos"
                  category="total_revenue"
                />
              </Card>
            )}
            {leastSellingProduct && (
              <Card>
                <PaymentStatus
                  chartData={leastSellingProduct}
                  text="Productos menos vendidos"
                  category="total_sold"
                />
              </Card>
            )}
            {sedeWithMostSales && (
              <Card>
                <PaymentStatus
                  chartData={sedeWithMostSales}
                  text="Sede con mas ventas"
                  category="total_revenue"
                />
              </Card>
            )}
            {sedeWithLeastSales && (
              <Card>
                <PaymentStatus
                  chartData={sedeWithLeastSales}
                  text="Sede con menos ventas"
                  category="total_revenue"
                />
              </Card>
            )}
          </div>
        </section>

        {/* <section className="pt-10">
          <Card className="bg-neutral-200/50 pt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <ProductAnalytics />
              <ProductAnalytics />
              <ProductAnalytics />
              <ProductAnalytics />
            </div>
          </Card>
        </section> */}
      </section>
    </>
  );
}
