import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Componentes/AuthContext";

const ProtectedRoute = ()=>{
    const {user, isloading} = useAuth();

    if (isloading) {
        return <div>Cargando...</div>
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />
 
};
export default ProtectedRoute;