import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import api from "../utils/api";
import type { NavItem } from "../components/layout/SideBar";
import { NAV_ITEMS } from "../config/navlinks";

export interface Permission {
    _id?: string;
    module: {
        _id: string;
        name: string;
        code: string;
    };
    operation: {
        _id: string;
        name: string;
        code: string;
    };
    code: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: {
        _id: string;
        name: string;
        permissions: Permission[]
    };
    permissions: Set<string>
    isActive: boolean;
}

export interface LoginPayload {
    email: string;
    password: string;
}


interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    navLinks: NavItem[];

    login: () => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

export const AuthContext =
    createContext<AuthContextType | null>(null);

interface Props {
    children: ReactNode;
}

export function AuthProvider({ children }: Props) {

    const [user, setUser] = useState<User | null>(null);
    const [navLinks, setNavlinks] = useState<NavItem[] | null>(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user;

    const refreshUser = async () => {
        try {
            const { data } = await api.get("/auth/me");

            const permissions = new Set(data.response.role.permissions.map((p: Permission) => p.code));

            const navLinks = NAV_ITEMS.filter((item) => {
                if (!item.permission) return true;
                return permissions.has(item.permission);
            });

            setNavlinks(navLinks)

            setUser({
                ...data.response,
                permissions
            });
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async () => {
        await refreshUser();
    };

    const logout = async () => {
        setUser(null);
    };

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated,
                login,
                logout,
                refreshUser,
                navLinks: navLinks ?? []
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}
