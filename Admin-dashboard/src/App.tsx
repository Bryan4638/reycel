import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { HeroUIProvider } from "@heroui/react";
import Home from "./pages/Home";
import NavBar from "./components/navbar/NavBar";
import User from "./pages/User";
import Products from "./pages/Products";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { Toaster } from "sonner";
import Categories from "./pages/Categories";
import Payments from "./pages/Payments";
import Sedes from "./pages/Sedes";
import Order from "./pages/Order";
import Workers from "./pages/Workers";
import NewOrderPage from "./components/neworder/NewOrderPage";
import Investments from "./pages/Investments";

function App() {
  return (
    <HeroUIProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster richColors expand={true} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<NavBar />}>
              <Route element={<ProtectedRoutes />}>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<User />} />
                <Route path="/workers" element={<Workers />} />
                <Route path="/products" element={<Products />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/order" element={<Order />} />
                <Route path="/neworder" element={<NewOrderPage />} />
                <Route path="/sedes" element={<Sedes />} />
                <Route path="/trash" element={<Investments />}></Route>
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </HeroUIProvider>
  );
}

export default App;
