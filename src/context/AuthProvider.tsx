import { useEffect, useState } from "react";
import type { UserLogin } from "@/schemas/login";
import { login } from "@/services/api.login";
import { deleteCookie, getCookie, setCookie } from "@/utils/cookies";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "@/context/AuthContext";

type JwtPayload = {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
    exp: number;
    iss: string;
    aud: string;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const token = getCookie("access_token");
        setAccessToken(token ?? null);

        if (token) {
            try {
                const decoded = jwtDecode<JwtPayload>(token);

                if (decoded.exp * 1000 < Date.now()) {
                    logoutUser();
                    return;
                }

                setUserId(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ?? null);
                setUsername(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ?? null);
                setUserRole(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? null);
            } catch (error) {
                console.error("Failed to decode token:", error);
                setUserId(null);
                setUsername(null);
                setUserRole(null);
            }
        } else {
            setUserId(null);
            setUsername(null);
            setUserRole(null);
        }

        setLoading(false);
    }, []);

    const loginUser = async (fields: UserLogin) => {
        const res = await login(fields);

        setCookie("access_token", res.token, {
            expires: 7,
            sameSite: "Lax",
            secure: false,
            path: "/",
        });

        setAccessToken(res.token);

        try {
            const decoded = jwtDecode<JwtPayload>(res.token);
            setUserId(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ?? null);
            setUsername(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ?? null);
            setUserRole(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? null);
        } catch (error) {
            console.error("Failed to decode token:", error);
        }
    };

    const logoutUser = () => {
        deleteCookie("access_token");
        setAccessToken(null);
        setUserId(null);
        setUsername(null);
        setUserRole(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!accessToken,
                accessToken,
                userId,
                username,
                userRole,
                loginUser,
                logoutUser,
                loading,
            }}
        >
            {loading ? <div className="p-8 text-center">Loading...</div> : children}
        </AuthContext.Provider>
    );
};