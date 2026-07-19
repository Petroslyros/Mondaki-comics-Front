import type { UserLogin } from "@/schemas/login";

const API_URL = import.meta.env.VITE_API_URL;

export type LoginResponse = {
    token: string;
    username: string;
    role: string;
    expiresAt: string;
};

export async function login({ username, password }: UserLogin): Promise<LoginResponse> {
    const res = await fetch(`${API_URL}/auth/login/access-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
        let detail = "Login failed";
        try {
            const data = await res.json();
            if (typeof data?.message === "string") detail = data.message;
        } catch {
            console.error("Error parsing error response");
        }
        throw new Error(detail);
    }

    return await res.json();
}