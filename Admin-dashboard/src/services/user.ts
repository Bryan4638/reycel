import axios from "./axios";

export const getUsersRequest = () => {
  return axios.get(`/users`);
};

interface UserRequest {
  username: string;
  password: string;
  image: string;
  sedeId?: string;
  role?: "USER" | "MODERADOR" | "ADMIN";
}

export const createUsersRequest = (user: UserRequest) => {
  return axios.post(`/user`, user);
};

export const editUsersRequest = (id: string, user: UserRequest) => {
  return axios.put(`/worker/${id}`, user);
};

export const deleteUsersRequest = (id: string) => {
  return axios.delete(`/user/${id}`);
};
