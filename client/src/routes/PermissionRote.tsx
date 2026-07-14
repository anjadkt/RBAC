// routes/PermissionRoute.tsx
import { Navigate } from 'react-router';
import { usePermissions } from '../context/PermissionContext';
import { FullPageLoader } from '../components/layout/Loading';

export const PermissionRoute = ({
    requiredPermission,
    children,
}: {
    requiredPermission: string;
    children: React.ReactNode;
}) => {

    const { can, loading } = usePermissions();

    if (loading) return <FullPageLoader isLoading={loading} z='z-50' text='Page Loading...' />;

    if (!can(requiredPermission)) {
        return <Navigate to="/access-denied" replace />;
    }

    return <>{children}</>;
};