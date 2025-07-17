import { PaymentOptions } from "../type";
import axios from "./axios";

interface PaymentMethod {
  cardImage: string;
  cardNumber?: string;
  phoneNumber?: string;
  paymentOptions: PaymentOptions;
}

export const getPaymentMethodRequest = () => {
  return axios.get(`/paymentMethod`);
};

export const createPaymentMethodRequest = (data: PaymentMethod) => {
  return axios.post(`/paymentMethod`, data);
};

export const updatePaymentMethodRequest = (id: string, data: PaymentMethod) => {
  return axios.put(`/paymentMethod/${id}`, data);
};

export const deletePaymentMethodRequest = (id: string) => {
  return axios.delete(`/paymentMethod/${id}`);
};
