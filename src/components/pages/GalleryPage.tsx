import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getPublishedArtworks } from "@/services/api.artworks";
import { getAllCategories } from "@/services/api.categories";
import type { Artwork } from "@/schemas/artworks";
import type { Category } from "@/schemas/categories";
import { Badge } from "@/components/ui/badge";

const GalleryPage = () => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [artworksData, categoriesData] = await Promise.all([
                    getPublishedArtworks(),
                    getAllCategories(),
                ]);
                setArtworks(artworksData);
                setCategories(categoriesData);
            } catch (err) {
                console.error("Failed to load gallery:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const filtered = selectedCategory
        ? artworks.filter(a => a.categoryName === categories.find(c => c.id === selectedCategory)?.name)
        : artworks;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-gray-400">Loading gallery...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12">
            {/* Hero */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Mondaki<span className="text-[#e94560]">Comics</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-xl mx-auto">
                    Original comics and illustrations
                </p>
            </div>

            {/* Category filters */}
            {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center mb-10">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                            selectedCategory === null
                                ? "bg-[#e94560] text-white"
                                : "bg-[#16213e] text-gray-300 hover:bg-[#0f3460]"
                        }`}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                selectedCategory === cat.id
                                    ? "bg-[#e94560] text-white"
                                    : "bg-[#16213e] text-gray-300 hover:bg-[#0f3460]"
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="text-center text-gray-400 py-20">
                    No artworks found.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filtered.map((artwork) => (
                        <div
                            key={artwork.id}
                            onClick={() => navigate(`/artwork/${artwork.id}`)}
                            className="bg-[#16213e] rounded-lg overflow-hidden cursor-pointer
                                       border border-[#0f3460] hover:border-[#e94560]
                                       transition duration-300 hover:scale-105 group"
                        >
                            {/* Cover image */}
                            <div className="aspect-square overflow-hidden bg-[#0f3460]">
                                {artwork.coverImageUrl ? (
                                    <img
                                        src={artwork.coverImageUrl}
                                        alt={artwork.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                        No image
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <h3 className="text-white font-semibold truncate">
                                    {artwork.title}
                                </h3>
                                {artwork.categoryName && (
                                    <Badge
                                        variant="secondary"
                                        className="mt-2 bg-[#0f3460] text-gray-300 text-xs"
                                    >
                                        {artwork.categoryName}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GalleryPage;