import { getCookie } from "@/utils/cookies";

export const getAuthHeaders = () => {
    const token = getCookie("access_token");
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

export const getAuthHeadersMultipart = () => {
    const token = getCookie("access_token");
    return {
        ...(token && { Authorization: `Bearer ${token}` }),
        // No Content-Type here — browser sets it automatically for FormData with boundary
    };
};