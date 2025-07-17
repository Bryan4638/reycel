import axios from "./axios";

export const getOrderRequest = () => {
  return axios.get(`/order`);
};

export const getOrderItemsRequest = (id: string) => {
  return axios.get(`/order/${id}`);
};
