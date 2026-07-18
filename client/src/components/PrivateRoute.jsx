import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <h2>Loading...</h2>;

  return user ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;