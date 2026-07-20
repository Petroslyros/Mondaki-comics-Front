import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getAllArtworksAdmin, deleteArtwork, togglePublish } from "@/services/api.artworks";
import type { Artwork } from "@/schemas/artworks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Eye, EyeOff, Image } from "lucide-react";
import { toast } from "sonner";

const ArtworksAdminPage = () => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadArtworks = async () => {
        try {
            const data = await getAllArtworksAdmin();
            setArtworks(data);
        } catch {
            toast.error("Failed to load artworks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadArtworks();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this artwork and all its images?")) return;
        try {
            await deleteArtwork(id);
            toast.success("Artwork deleted");
            setArtworks(prev => prev.filter(a => a.id !== id));
        } catch {
            toast.error("Failed to delete artwork");
        }
    };

    const handleTogglePublish = async (id: number) => {
        try {
            const result = await togglePublish(id);
            setArtworks(prev =>
                prev.map(a => a.id === id ? { ...a, isPublished: result.isPublished } : a)
            );
            toast.success(result.isPublished ? "Artwork published" : "Artwork unpublished");
        } catch {
            toast.error("Failed to toggle publish status");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-gray-400">Loading...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Artworks</h1>
                    <p className="text-gray-400 mt-1">
                        {artworks.length} total · {artworks.filter(a => a.isPublished).length} published
                    </p>
                </div>
                <Button
                    onClick={() => navigate("/admin/artworks/new")}
                    className="bg-[#e94560] hover:bg-[#c73652] text-white"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Artwork
                </Button>
            </div>

            {artworks.length === 0 ? (
                <div className="text-center text-gray-400 py-20">
                    No artworks yet. Create your first one!
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {artworks.map((artwork) => (
                        <div
                            key={artwork.id}
                            className="bg-[#16213e] border border-[#0f3460] rounded-lg overflow-hidden"
                        >
                            {/* Cover image */}
                            <div className="aspect-square bg-[#0f3460] relative">
                                {artwork.coverImageUrl ? (
                                    <img
                                        src={artwork.coverImageUrl}
                                        alt={artwork.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                                        <Image className="w-8 h-8" />
                                        <span className="text-xs">No image</span>
                                    </div>
                                )}

                                {/* Published badge */}
                                <div className="absolute top-2 right-2">
                                    <Badge
                                        className={artwork.isPublished
                                            ? "bg-green-600 text-white"
                                            : "bg-gray-600 text-white"
                                        }
                                    >
                                        {artwork.isPublished ? "Published" : "Draft"}
                                    </Badge>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <h3 className="text-white font-semibold truncate mb-1">
                                    {artwork.title}
                                </h3>
                                {artwork.categoryName && (
                                    <p className="text-gray-400 text-sm mb-3">
                                        {artwork.categoryName}
                                    </p>
                                )}
                                <p className="text-gray-500 text-xs mb-3">
                                    {artwork.images?.length ?? 0} image{(artwork.images?.length ?? 0) !== 1 ? "s" : ""}
                                </p>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => navigate(`/admin/artworks/${artwork.id}`)}
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 border-[#0f3460] text-gray-300 hover:text-white"
                                    >
                                        <Pencil className="w-3 h-3 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => handleTogglePublish(artwork.id)}
                                        variant="outline"
                                        size="sm"
                                        className="border-[#0f3460] text-gray-300 hover:text-white"
                                        title={artwork.isPublished ? "Unpublish" : "Publish"}
                                    >
                                        {artwork.isPublished
                                            ? <EyeOff className="w-3 h-3" />
                                            : <Eye className="w-3 h-3" />
                                        }
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(artwork.id)}
                                        variant="destructive"
                                        size="sm"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ArtworksAdminPage;