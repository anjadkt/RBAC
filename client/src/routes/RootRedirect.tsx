import { Navigate } from "react-router"
import { useAuth } from "../context/AuthContext"


function RootRedirect() {

    const { navLinks } = useAuth();

    const to = navLinks[0]?.to;

    if (!to) {
        return <Navigate to={to} replace />;
    }
    return (
        <Navigate to="/" replace />
    )
}

export default RootRedirect