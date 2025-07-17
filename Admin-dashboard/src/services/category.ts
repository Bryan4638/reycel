import axios from "./axios";

export const categoryRequest = () => {
  return axios.get(`/products/category`);
};

export const createCategoryRequest = (name: string, profitsBySell: number) => {
  return axios.post(`/products/category`, { name, profitsBySell });
};

export const updateCategoryRequest = (id: string, name: string, profitsBySell: number) => {
  return axios.put(`/products/category/${id}`, { name, profitsBySell });
};

export const deleteCategoryRequest = (id: string) => {
  return axios.delete(`/products/category/${id}`);
};
