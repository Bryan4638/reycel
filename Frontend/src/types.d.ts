export type User = {
  username?: string;
  userId: string;
  password?: string;
  status?: boolean;
  image: string;
};

export type Specs = {
  id: string;
  ram: number;
  storage: number;
  battery: number | null;
  mpxCameraFront: number | null;
  mpxCameraBack: number | null;
};

export interface Products {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  imagen: string;
  originImage: string;
  color?: string;
  ram: number;
  ratingAverage?: number;
  storage: number;
  battery?: number;
  mpxCameraFront?: number;
  mpxCameraBack?: number;
  inventoryCount: number;
  category: {
    name: string;
    id: string;
  };
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  client: {
    baseUser: {
      username: string;
    };
  };
}

export interface orderItems {
  id: string;
  orderId: string;
  quantity: number;
  price: number;
  product: Products;
}

export interface Rating {
  createdAt: string;
  id: number;
  productID: string;
  userID: string;
  value: number;
}

export interface OrderItem {
  id: string;
  price: number;
  quantity: number;
  product: Products;
}

export interface Order {
  totalAmount: number;
  id: number;
  _count: {
    orderItems: number;
  };
  orderItems: OrderItem[];
}

interface UserAuth {
  email?: string;
  password: string;
  username: string;
}

export type AuthContextType = {
  user: User | null;
  isAuth: boolean;
  loading: boolean;
  errors: Array<string>;
  confirmEmail: (values: string) => Promise<void>;
  signIn: (value: UserAuth) => Promise<void>;
  signUp: (value: UserAuth) => Promise<void>;
  logout: () => void;
};

export interface TransactionType {
  transactionID: string;
  productCount: number;
  price: number;
  fastDelivery: boolean;
  address: string;
  town: string;
  orderID: number | null;
  paymentMethodId: string | undefined;
}

export interface Category {
  id: string;
  name: string;
}

export interface FiltersType {
  minPrice?: number;
  maxPrice?: number;
  category?: string[] | string;
  rating?: number;
  color?: string;
}

export type SortOption = {
  field: "createdAt" | "price" | "ratingAverage"; // Campos permitidos
  order: "asc" | "desc"; // Órdenes permitidas
};

export type ProductContextType = {
  products: Products[] | [];
  currentPage: number;
  querySeach: string;
  errorSerch: Array<string> | null;
  isNextPage: boolean;
  error: Array<string> | null;
  filters: FiltersType;
  sortParmas: SortOption[];
  searchProduct: (value: boolean) => void;
  setSortParmas: (value: Array<SortOption>) => void;
  setFilters: (value: FiltersType) => void;
  setCurrentPage: (value: number) => void;
  setIsNextPage: (vaule: boolean) => void;
  setErrorSearch: (value: Array<string> | null) => void;
  setQuerySeach: (value: string) => void;
};

export interface Sedes {
  id?: string;
  direction: string;
  image: string;
  phone: number;
  workers: {
    id: string;
    username: string;
    image: string;
  }[];
}
