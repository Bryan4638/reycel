import { DonutChart, Legend } from "@tremor/react";
import { AnalyticsTable } from "../../../type";

interface PaymentProps {
  chartData: AnalyticsTable[];
  text: string;
  category: string;
}

export function PaymentStatus({ chartData, text, category }: PaymentProps) {
  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-6 ">
        <div className="w-full flex justify-start">
          <h3 className="text-black/50">{text}</h3>
        </div>

        <DonutChart
          data={chartData}
          category={category}
          index="name"
          valueFormatter={(number: number) =>
            `$${Intl.NumberFormat("us").format(number).toString()}`
          }
          colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
          className="w-40"
        />
        <Legend
          categories={chartData.map((item) => item.name)}
          colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
          className="max-w-xs"
        />
      </div>
    </>
  );
}
