import { useCallback, useState } from "react";
import { Sede } from "../type";
import {
  createSedeRequest,
  deleteSedeRequest,
  getSedesRequest,
  updateSedeRequest,
} from "../services/sedes";

function useSede() {
  const [sedes, setSedes] = useState<Sede[] | null>([]);
  const [error, setError] = useState<Array<string> | null>(null);
  const [loading, setLoading] = useState(false);

  const getSedes = useCallback(() => {
    setLoading(true);
    getSedesRequest()
      .then((res) => {
        setSedes(res.data.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const addSede = async (
    image: string,
    direction: string,
    phone: string,
    rent: number
  ) => {
    createSedeRequest({ image, direction, phone, rent })
      .then((res) => {
        if (!sedes) {
          setSedes(res.data.data);
          return;
        }
        setSedes([...sedes, res.data.data]);
      })
      .catch((err) => {
        console.log(err);
        setError(["Error al crear la sede."]);
      });
  };

  const updateSede = async (
    id: string,
    image: string,
    direction: string,
    phone: string,
    rent: number
  ) => {
    updateSedeRequest(id, { image, direction, phone, rent })
      .then((res) => {
        const index = sedes?.findIndex((sede) => sede.id === id);
        sedes?.splice(index as number, 1, res.data.sede);
        setSedes([...(sedes as Sede[])]);
      })
      .catch((err) => {
        setError(err);
      });
  };

  const deleteSede = async (id: string) => {
    deleteSedeRequest(id)
      .then(() => {
        setSedes((prev) => {
          if (prev) {
            return prev.filter((sede) => sede.id !== id);
          }
          return [];
        });
      })
      .catch((err) => {
        setError(err);
      });
  };

  return {
    sedes,
    setSedes,
    setError,
    error,
    loading,
    getSedes,
    addSede,
    updateSede,
    deleteSede,
  };
}

export default useSede;
