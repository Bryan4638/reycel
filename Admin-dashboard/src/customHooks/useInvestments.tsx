import { useCallback, useState } from "react";
import { Investments } from "../type";
import {
  createInvestmentsRequest,
  getInvestmentsRequest,
} from "../services/investments";

function useInvestments() {
  const [investments, setInvestments] = useState<Investments[] | null>([]);
  const [error, setError] = useState<Array<string> | null>(null);
  const [loading, setLoading] = useState(false);

  const getInvestments = useCallback(() => {
    setLoading(true);
    getInvestmentsRequest()
      .then((res) => {
        setInvestments(res.data.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const addInvestments = async (id: string, description: string, price: number) => {
    createInvestmentsRequest(id, { description, price })
      .then((res) => {
        if (!investments) {
          setInvestments(res.data.data);
          return;
        }
        setInvestments([...investments, res.data.data]);
      })
      .catch((err) => {
        console.log(err);
        setError(["Error al crear la sede."]);
      });
  };

  return {
    investments,
    setInvestments,
    setError,
    error,
    loading,
    getInvestments,
    addInvestments,
  };
}

export default useInvestments;
