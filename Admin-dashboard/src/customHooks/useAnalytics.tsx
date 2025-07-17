import { useEffect, useState } from "react";
import { Analytics, AnalyticsTable, PaymentAnalytics } from "../type";
import {
  getAnalytics,
  getPaymentsRequest,
  getBestSellingProductRequest,
  getLeastSellingProductRequest,
  getSedeWithMostSalesRequest,
  getSedeWithLeastSalesRequest,
} from "../services/analytics";
import { DateRangePickerValue } from "@tremor/react";
import { AxiosError } from "axios";

interface Props {
  value: DateRangePickerValue;
}

function useAnalytics({ value }: Props) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [payments, setPayments] = useState<PaymentAnalytics[] | null>(null);
  const [bestSellingProduct, setBestSellingProduct] = useState<AnalyticsTable[]>([]);
  const [leastSellingProduct, setLeastSellingProduct] = useState<AnalyticsTable[]>([]);
  const [sedeWithMostSales, setSedeWithMostSales] = useState<AnalyticsTable[]>([]);
  const [sedeWithLeastSales, setSedeWithLeastSales] = useState<AnalyticsTable[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getAnalytics()
      .then((res) => {
        setAnalytics(res.data);
      })
      .catch((err) => {
        console.log(err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
    if (value.from && value.to) {
      getPaymentsRequest(value.from?.toUTCString(), value.to?.toUTCString())
        .then((res) => {
          setPayments(res.data);
        })
        .catch((err: AxiosError) => {
          if (err.response?.status === 401) {
            setError("No tienes permiso para obtener los datos");
            return;
          }
          setError("Error al obtener los datos");
        })
        .finally(() => {
          setLoading(false);
        });
      getBestSellingProductRequest(
        value.from?.toUTCString(),
        value.to?.toUTCString()
      )
        .then((res) => {
          setBestSellingProduct(res.data.chartData);
        })
        .catch((err: AxiosError) => {
          if (err.response?.status === 401) {
            setError("No tienes permiso para obtener los datos");
            return;
          }
          setError("Error al obtener los datos");
        })
        .finally(() => {
          setLoading(false);
        });
      getLeastSellingProductRequest(
        value.from?.toUTCString(),
        value.to?.toUTCString()
      )
        .then((res) => {
          setLeastSellingProduct(res.data.chartData);
        })
        .catch((err: AxiosError) => {
          if (err.response?.status === 401) {
            setError("No tienes permiso para obtener los datos");
            return;
          }
          setError("Error al obtener los datos");
        })
        .finally(() => {
          setLoading(false);
        });
      getSedeWithMostSalesRequest(
        value.from?.toUTCString(),
        value.to?.toUTCString()
      )
        .then((res) => {
          setSedeWithMostSales(res.data.chartData);
        })
        .catch((err: AxiosError) => {
          if (err.response?.status === 401) {
            setError("No tienes permiso para obtener los datos");
            return;
          }
          setError("Error al obtener los datos");
        })
        .finally(() => {
          setLoading(false);
        });
      getSedeWithLeastSalesRequest(
        value.from?.toUTCString(),
        value.to?.toUTCString()
      )
        .then((res) => {
          setSedeWithLeastSales(res.data.chartData);
        })
        .catch((err: AxiosError) => {
          if (err.response?.status === 401) {
            setError("No tienes permiso para obtener los datos");
            return;
          }
          setError("Error al obtener los datos");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [value]);

  return { analytics, error, loading, payments, bestSellingProduct, leastSellingProduct, sedeWithMostSales, sedeWithLeastSales };
}

export default useAnalytics;
