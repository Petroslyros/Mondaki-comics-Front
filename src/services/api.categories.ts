import type { Category, CategoryInsert } from "@/schemas/categories";
import { getAuthHeaders } from "@/utils/api.helpers";

const API_URL = import.meta.env.VITE_API_URL;

export async function getAllCategories(): Promise<Category[]> {
    const res = await fetch(`${API_URL}/ArtworkCategories/GetAllCategories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return await res.json();
}

export async function getCategoryById(id: number): Promise<Category> {
    const res = await fetch(`${API_URL}/ArtworkCategories/GetCategoryById/${id}`);
    if (!res.ok) throw new Error("Failed to fetch category");
    return await res.json();
}

export async function createCategory(data: CategoryInsert): Promise<Category> {
    const res = await fetch(`${API_URL}/ArtworkCategories/CreateCategory`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create category");
    return await res.json();
}

export async function updateCategory(id: number, data: CategoryInsert): Promise<Category> {
    const res = await fetch(`${API_URL}/ArtworkCategories/UpdateCategory/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update category");
    return await res.json();
}

export async function deleteCategory(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/ArtworkCategories/DeleteCategory/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete category");
}