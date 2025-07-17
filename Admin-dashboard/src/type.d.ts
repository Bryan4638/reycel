export interface UserLogin {
  userName: string;
  password: string;
}

export interface Workers {
  id: string;
  baseUser: BaseUser;
}

export interface BaseUser {
  id: string;
  username: string;
  image: string;
  email: string;
  status: boolean;
  createdAt: string;
}

export interface User {
  userId: string;
  username: string;
  email: string;
  image: string;
  status: boolean;
  createdAt: string;
  sede: string;
  role: "OWNER" | "MODERATOR";
  orderCount: number;
}

export interface Worker {
  id: string;
  username: string;
  email: string;
  image: string;
  status: boolean;
  orderCount: number;
  createdAt: string;
  salary: number;
  mouthSalary: number;
  role: "OWNER" | "MODERATOR";
}

export interface AuthContextType {
  user: User | null;
  isAuth: boolean;
  errors: Array<string>;
  loading: boolean;
  signIn: (value: UserLogin) => Promise<void>;
  logout: () => void;
}

export interface Users {
  id: string;
  username: string;
  image: string;
  status: boolean;
  Sede: Sede;
  role: "USER" | "MODERADOR" | "ADMIN";
  createdAt: string;
  _count: Count;
}

interface Sede {
  id: string;
  image: string;
  phone: string;
  direction: string;
  workers: Workers[];
  _count: {
    producto: number;
  };
  rent: number;
  netProfits: number;
  finalLosses: number;
}

interface Investments {
  id: string;
  description: string;
  price: number;
  Sede: Sede;
}

interface Count {
  orders: number;
}

export interface Products {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  inicialInventory: number;
  imagen: string;
  createdAt: string;
  inventoryCount: number;
  investments: number;
  battery: number;
  ram: number;
  storage: number;
  mpxCameraFront: number;
  mpxCameraBack: number;
  category: Category;
  Sede: {
    direction: string;
    image: string;
    phone: string;
  };
}
export interface Category {
  id: string;
  name: string;
  profitsBySell: number;
  createdAt: string;
  _count: {
    products: number;
  };
}

type Client = {
  baseUser: BaseUser;
};

type Admin = {
  baseUser: BaseUser;
};

export interface Order {
  createdAt: string;
  id: string;
  totalAmount: number;
  pending: boolean;
  admin: Admin;
  client: Client;
  _count: {
    orderItems: number;
  };
}

export interface PaymentMethod {
  id: string;
  cardImage: string;
  cardNumber?: string;
  phoneNumber?: string;
  createdAt: string;
  _count: {
    payment: number;
  };
  paymentOptions: PaymentOptions;
}

export type PaymentOptions =
  | "TRANSFER_USD"
  | "TRANSFER_CUP"
  | "CASH"
  | "QVAPAY"
  | "ZELLE";

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  paymentStatus: string;
  createdAt: string;
  paymentMethodId: string;
  userId: string;
  client: {
    baseUser: {
      username: string;
      image: string;
      email: string;
    };
  };
  admin: {
    baseUser: {
      username: string;
      image: string;
      email: string;
    };
  };
  PaymentMethod: PaymentMethod;
  order: {
    _count: {
      orderItems: number;
    };
  };
}

export interface UserPayment {
  username: string;
  image: string;
  role: string;
}

export interface OrderAdd {
  id: string;
  createdAt: string;
  totalAmount: number;
  orderItems: OrderItem[];
  admin: Admin;
  _count: {
    orderItems: number;
  };
}

export interface OrderItem {
  id: string;
  createdAt: string;
  price: number;
  quantity: number;
  product: ProductOrder;
}

export interface ProductOrder {
  imagen: string;
  name: string;
  ratingAverage: number;
  inventoryCount: number;
}

export interface Analytics {
  dataProductsByMonth: DataSByMonth[];
  dataUsersByMonth: DataSByMonth[];
  dataCategoriesByMonth: DataSByMonth[];
  growthProducts: number;
  growthUsers: number;
  growthCategories: number;
  totalProduct: number;
  totalUser: number;
  totalCategory: number;
}

export interface DataSByMonth {
  month: string;
  total: string;
}

export interface Growth {
  month: string;
  total: string;
  growth: string;
}

export interface PaymentAnalytics {
  GananciasBrutas: number;
  Invercion: number;
  Monto_en_Ventas: number;
  month: string;
}

export interface AddPaymentMethodProps {
  id?: string;
  image: string;
  numberCard: string;
  phoneNumber?: string;
  selected: PaymentOptions;
}

export interface AnalyticsTable {
  name: string;
  total_sold: number;
  total_revenue: number;
}
