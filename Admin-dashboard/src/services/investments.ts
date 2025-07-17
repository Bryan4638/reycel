import axios from "./axios";

interface Investment {
    price: number
    description: string
}

export const getInvestmentsRequest = () => {
  return axios.get(`/losses`);
};

export const createInvestmentsRequest = (id: string, data: Investment) => {
  return axios.post(`/losses/${id}`, data);
};
