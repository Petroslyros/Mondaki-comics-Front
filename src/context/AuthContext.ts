import { createContext } from "react";
import type { UserLogin } from "@/schemas/login";

type AuthContextProps = {
    isAuthenticated: boolean;
    accessToken: string | null;
    userId: string | null;
    username: string | null;
    userRole: string | null;
    loginUser: (fields: UserLogin) => Promise<void>;
    logoutUser: () => void;
    loading: boolean;
};

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);