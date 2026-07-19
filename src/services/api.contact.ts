import type { ContactMessage, ContactInsert } from "@/schemas/contact";
import { getAuthHeaders } from "@/utils/api.helpers";

const API_URL = import.meta.env.VITE_API_URL;

export async function sendMessage(data: ContactInsert): Promise<void> {
    const res = await fetch(`${API_URL}/ContactMessages/SendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to send message");
}

export async function getAllMessages(): Promise<ContactMessage[]> {
    const res = await fetch(`${API_URL}/ContactMessages/GetAllMessages`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch messages");
    return await res.json();
}

export async function getMessageById(id: number): Promise<ContactMessage> {
    const res = await fetch(`${API_URL}/ContactMessages/GetMessageById/${id}`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch message");
    return await res.json();
}

export async function markAsRead(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/ContactMessages/MarkAsRead/${id}/mark-read`, {
        method: "PATCH",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to mark as read");
}

export async function getUnreadCount(): Promise<{ unreadCount: number }> {
    const res = await fetch(`${API_URL}/ContactMessages/GetUnreadCount/unread-count`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch unread count");
    return await res.json();
}

export async function deleteMessage(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/ContactMessages/DeleteMessage/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete message");
}