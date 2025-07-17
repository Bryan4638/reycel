import Stadistic from "../components/home/Stadistic";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user, loading } = useAuth();

  if (user?.role !== "OWNER" && !loading) return <Navigate to="/products" replace />;

  return (
    <div className="py-14 bg-neutral-100 min-h-screen">
      <Stadistic />
    </div>
  );
}

export default Home;
