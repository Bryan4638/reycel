import axios from "./axios";

interface Sede {
  image: string;
  direction: string;
  phone: string;
  rent: number;
}

export const getSedesRequest = () => {
  return axios.get(`/sedes`);
};

export const getWorkersRequest = () => {
  return axios.get(`/workers`);
};

export const getSedeIdRequest = (id: string) => {
  return axios.get(`/sedes/${id}`);
};

export const createSedeRequest = (data: Sede) => {
  return axios.post(`/sedes`, data);
};

export const updateSedeRequest = (id: string, data: Sede) => {
  return axios.put(`/sedes/${id}`, data);
};

export const addLossesRequest = (id: string, monto: number) => {
  console.log(monto)
  return axios.put(`/losses/${id}`, {monto});
};

export const deleteSedeRequest = (id: string) => {
  return axios.delete(`/sedes/${id}`);
};
