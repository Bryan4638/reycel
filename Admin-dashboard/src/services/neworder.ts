import axios from "./axios";

export const getOrderItemsRequest = (id: string | undefined) => {
  return axios.get(`/neworder/${id}`);
};

export const addItemOrderRequest = (id: string, quantity: number) => {
  return axios.post(`/neworder?p=${id}`, { quantity });
};

export const updateOrderItemRequest = (
  id: string,
  quantity: number,
  price: number
) => {
  return axios.put(`/neworder?p=${id}`, { quantity, price });
};

export const deleteOrderItemRequest = (id: string) => {
  return axios.delete(`/neworder?p=${id}`);
};

interface ConfirmParams {
  transactionID?: string;
  orderID?: string;
  amount?: number;
  paymentMethod: string;
  userId?: string;
  sede?: string
}

export const confirmOrderRequest = (params: ConfirmParams) => {
  return axios.post(`/neworder/confirm/`, params);
};
