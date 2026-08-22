import type { NewsPost, NewsInsert, NewsUpdate } from "@/schemas/news";
import {getAuthHeaders, getAuthHeadersMultipart} from "@/utils/api.helpers";

const API_URL = import.meta.env.VITE_API_URL;

export async function getPublishedNews(): Promise<NewsPost[]> {
    const res = await fetch(`${API_URL}/News/GetPublishedNews`);
    if (!res.ok) throw new Error("Failed to fetch news");
    return await res.json();
}

export async function getAllNewsAdmin(): Promise<NewsPost[]> {
    const res = await fetch(`${API_URL}/News/GetAllNewsAdmin`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch news");
    return await res.json();
}

export async function createNews(data: NewsInsert): Promise<NewsPost> {
    const res = await fetch(`${API_URL}/News/CreateNews`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create news post");
    return await res.json();
}

export async function updateNews(id: number, data: NewsUpdate): Promise<NewsPost> {
    const res = await fetch(`${API_URL}/News/UpdateNews/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update news post");
    return await res.json();
}

export async function deleteNews(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/News/DeleteNews/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete news post");
}

export async function toggleNewsPublish(id: number): Promise<{ isPublished: boolean }> {
    const res = await fetch(`${API_URL}/News/TogglePublish/${id}/toggle-publish`, {
        method: "PATCH",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to toggle publish status");
    return await res.json();
}

export async function setNewsImage(id: number, file: File): Promise<NewsPost> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/News/SetImage/${id}/image`, {
        method: "POST",
        headers: getAuthHeadersMultipart(),
        body: formData,
    });
    if (!res.ok) throw new Error("Failed to upload image");
    return await res.json();
}