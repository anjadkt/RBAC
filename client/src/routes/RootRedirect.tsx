import { Navigate } from "react-router"
import { useAuth } from "../context/AuthContext"


function RootRedirect() {

    const { navLinks } = useAuth();
    if (navLinks) {
        return <Navigate to={navLinks[0].to} replace />;
    }
    return (
        <Navigate to="/" replace />
    )
}

export default RootRedirect