import axios from "./axios";

export const getProductRequest = () => {
  return axios.get(`/product`);
};

interface CreateProps {
  name: string;
  description: string;
  price: number;
  rating: number;
  imagen: File;
  investments: number;
  inventoryCount: number;
  categoryId: string;
  ram?: number;
  storage?: number;
  battery?: number;
  mpxCameraFront?: number;
  mpxCameraBack?: number;
  sedeId: string;
}

export const createProductRequest = (product: CreateProps) => {
  const formData = new FormData();
  Object.entries(product).forEach(([key, value]) => {
    // Si el valor es undefined o null, lo saltamos
    if (value === undefined || value === null) return;
    // Si es un array (por ejemplo, para múltiples imágenes o tags)
    if (Array.isArray(value)) {
      value.forEach((item, idx) => {
        formData.append(`${key}[${idx}]`, item);
      });
    } else {
      formData.append(key, value);
    }
  });
  return axios.post(`/product`, formData);
};

export const updateProductRequest = (id: string, productUpdated: CreateProps) => {
  const formData = new FormData();
  Object.entries(productUpdated).forEach(([key, value]) => {
    // Si el valor es undefined o null, lo saltamos
    if (value === undefined || value === null) return;
    // Si es un array (por ejemplo, para múltiples imágenes o tags)
    if (Array.isArray(value)) {
      value.forEach((item, idx) => {
        formData.append(`${key}[${idx}]`, item);
      });
    } else {
      formData.append(key, value);
    }
  });
  return axios.put(`/product/${id}`, formData);
};

export const deleteProductRequest = (id: string) => {
  return axios.delete(`/product/${id}`);
};
