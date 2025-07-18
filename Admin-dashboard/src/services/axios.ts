import axios from "axios";
import {API_URL} from '../conf'

const instance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

export default instance;