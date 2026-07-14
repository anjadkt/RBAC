import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { FullPageLoader } from '../components/layout/Loading';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <FullPageLoader isLoading={loading} z='z-50' text='Page Loading...' />;

    if (!user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};