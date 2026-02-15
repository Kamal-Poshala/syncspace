import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User } from "../types";
import { apiRequest } from "../lib/api";

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: any) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    updateProfile: (data: Partial<User> & { password?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                try {
                    const userData = await apiRequest<User>("/auth/me", { token: storedToken });
                    // Map response to User interface if needed (backend returns _id)
                    setUser({ ...userData, _id: (userData as any)._id || (userData as any).id });
                    setToken(storedToken);
                } catch (err) {
                    console.error("Auth check failed", err);
                    logout();
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = (newToken: string, newUser: any) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setUser({ ...newUser, _id: newUser.id || newUser._id });
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    const updateProfile = async (data: Partial<User> & { password?: string }) => {
        const updatedUser = await apiRequest<User>("/users/update", {
            method: "PUT",
            body: JSON.stringify(data),
            token: token!,
        });
        setUser({ ...updatedUser, _id: updatedUser._id || (updatedUser as any).id });
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, updateProfile, isAuthenticated: !!user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
