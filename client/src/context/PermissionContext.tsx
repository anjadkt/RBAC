import { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

export interface PermissionContextType {
    permissions: Set<string>;
    can: (code: string) => boolean;
    canAny: (codes: string[]) => boolean;
    canAll: (codes: string[]) => boolean;
    loading: boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider = ({ children }: { children: React.ReactNode }) => {

    const { user, loading } = useAuth();

    const permissions = user?.permissions ?? new Set<string>();

    const can = (code: string) => permissions.has(code);
    const canAny = (codes: string[]) => codes.some(code => permissions.has(code));
    const canAll = (codes: string[]) => codes.every(code => permissions.has(code));

    return (
        <PermissionContext.Provider value={{ permissions, can, canAny, canAll, loading }}>
            {children}
        </PermissionContext.Provider>
    );
};

export const usePermissions = () => {
    const ctx = useContext(PermissionContext);
    if (!ctx) throw new Error('usePermissions must be used within a PermissionProvider');
    return ctx;
};