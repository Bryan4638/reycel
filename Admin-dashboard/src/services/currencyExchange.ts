import axios from "./axios";

interface Currency {
  cup: number;
  eur: number;
  cad: number;
  gbp: number;
  zelle: number;
  cupTransfer: number;
  mlcTransfer: number;
}

export const editCurrency = (id: string, currency: Currency) => {
  console.log("editando");
  return axios.put(`/editCurrency/${id}`, currency);
};

export const addCurrency = (currency: Currency) => {
  console.log("creando");
  return axios.post(`/addCurrency`, currency);
};

export const getCurrency = () => {
  return axios.get("/currency");
};
