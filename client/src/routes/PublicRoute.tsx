import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import { FullPageLoader } from "../components/layout/Loading";

const PublicRoute = () => {

    const { user, loading } = useAuth();

    if (loading) {
        return <FullPageLoader isLoading={loading} z="z-50" text="App is Loading..." />;
    }

    if (user) {
        return <Navigate to="/root" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;