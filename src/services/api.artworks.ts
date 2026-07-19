import type { Artwork, ArtworkInsert, ArtworkUpdate, ArtworkImage } from "@/schemas/artworks";
import { getAuthHeaders, getAuthHeadersMultipart } from "@/utils/api.helpers";

const API_URL = import.meta.env.VITE_API_URL;

// Public
export async function getPublishedArtworks(): Promise<Artwork[]> {
    const res = await fetch(`${API_URL}/Artworks/GetPublishedArtworks`);
    if (!res.ok) throw new Error("Failed to fetch artworks");
    return await res.json();
}

export async function getArtworkById(id: number): Promise<Artwork> {
    const res = await fetch(`${API_URL}/Artworks/GetArtworkById/${id}`);
    if (!res.ok) throw new Error("Failed to fetch artwork");
    return await res.json();
}

export async function getArtworksByCategory(categoryId: number): Promise<Artwork[]> {
    const res = await fetch(`${API_URL}/Artworks/GetArtworksByCategory/category/${categoryId}`);
    if (!res.ok) throw new Error("Failed to fetch artworks by category");
    return await res.json();
}

// Admin
export async function getAllArtworksAdmin(): Promise<Artwork[]> {
    const res = await fetch(`${API_URL}/Artworks/GetAllArtworksAdmin`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch all artworks");
    return await res.json();
}

export async function createArtwork(data: ArtworkInsert): Promise<Artwork> {
    const res = await fetch(`${API_URL}/Artworks/CreateArtwork`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create artwork");
    return await res.json();
}

export async function updateArtwork(id: number, data: ArtworkUpdate): Promise<Artwork> {
    const res = await fetch(`${API_URL}/Artworks/UpdateArtwork/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update artwork");
    return await res.json();
}

export async function deleteArtwork(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/Artworks/DeleteArtwork/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete artwork");
}

export async function togglePublish(id: number): Promise<{ isPublished: boolean }> {
    const res = await fetch(`${API_URL}/Artworks/TogglePublish/${id}/toggle-publish`, {
        method: "PATCH",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to toggle publish");
    return await res.json();
}

// Image management
export async function addImageToArtwork(artworkId: number, file: File): Promise<ArtworkImage> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/Artworks/AddImage/${artworkId}/images`, {
        method: "POST",
        headers: getAuthHeadersMultipart(),
        body: formData,
    });
    if (!res.ok) throw new Error("Failed to upload image");
    return await res.json();
}

export async function deleteImage(artworkId: number, imageId: number): Promise<void> {
    const res = await fetch(`${API_URL}/Artworks/DeleteImage/${artworkId}/images/${imageId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete image");
}

export async function setCoverImage(artworkId: number, imageId: number): Promise<void> {
    const res = await fetch(`${API_URL}/Artworks/SetCoverImage/${artworkId}/images/${imageId}/set-cover`, {
        method: "PATCH",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to set cover image");
}