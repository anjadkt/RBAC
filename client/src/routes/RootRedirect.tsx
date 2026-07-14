import { Navigate } from "react-router"
import { useAuth } from "../context/AuthContext"

function RootRedirect() {
    const { loading, navLinks } = useAuth();

    if (loading) return null;

    const to = navLinks[0]?.to;

    if (to) {
        return <Navigate to={to} replace />;
    }

    return (
        <Navigate to="/access-denied" replace />
    )
}

export default RootRedirect