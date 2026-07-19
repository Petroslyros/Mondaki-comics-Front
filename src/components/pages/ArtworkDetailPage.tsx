import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getArtworkById } from "@/services/api.artworks";
import type { Artwork } from "@/schemas/artworks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

const ArtworkDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [artwork, setArtwork] = useState<Artwork | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        if (!id) return;
        getArtworkById(Number(id))
            .then(setArtwork)
            .catch(() => navigate("/"))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-gray-400">Loading...</p>
            </div>
        );
    }

    if (!artwork) return null;

    const images = artwork.images ?? [];
    const currentImage = images[selectedImageIndex];

    return (
        <div className="container mx-auto px-6 py-12 max-w-5xl">
            {/* Back button */}
            <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="text-gray-400 hover:text-white mb-8"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Gallery
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Image viewer */}
                <div>
                    {/* Main image */}
                    <div className="bg-[#16213e] rounded-lg overflow-hidden border border-[#0f3460] aspect-square">
                        {currentImage ? (
                            <img
                                src={currentImage.imageUrl}
                                alt={currentImage.altText ?? artwork.title}
                                className="w-full h-full object-contain"
                            />
                        ) : artwork.coverImageUrl ? (
                            <img
                                src={artwork.coverImageUrl}
                                alt={artwork.title}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                No image
                            </div>
                        )}
                    </div>

                    {/* Image navigation */}
                    {images.length > 1 && (
                        <div className="mt-4">
                            {/* Prev/Next */}
                            <div className="flex items-center justify-between mb-3">
                                <button
                                    onClick={() => setSelectedImageIndex(i => Math.max(0, i - 1))}
                                    disabled={selectedImageIndex === 0}
                                    className="text-gray-400 hover:text-white disabled:opacity-30 transition"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <span className="text-gray-400 text-sm">
                                    {selectedImageIndex + 1} / {images.length}
                                </span>
                                <button
                                    onClick={() => setSelectedImageIndex(i => Math.min(images.length - 1, i + 1))}
                                    disabled={selectedImageIndex === images.length - 1}
                                    className="text-gray-400 hover:text-white disabled:opacity-30 transition"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {images.map((img, index) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition ${
                                            index === selectedImageIndex
                                                ? "border-[#e94560]"
                                                : "border-[#0f3460] hover:border-gray-400"
                                        }`}
                                    >
                                        <img
                                            src={img.imageUrl}
                                            alt={img.altText ?? `Image ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-4">
                    <div>
                        {artwork.categoryName && (
                            <Badge className="bg-[#e94560] text-white mb-3">
                                {artwork.categoryName}
                            </Badge>
                        )}
                        <h1 className="text-3xl font-bold text-white">
                            {artwork.title}
                        </h1>
                    </div>

                    {artwork.description && (
                        <p className="text-gray-300 leading-relaxed">
                            {artwork.description}
                        </p>
                    )}

                    <div className="mt-auto pt-8">
                        <p className="text-gray-500 text-sm mb-4">
                            Interested in this work? Get in touch!
                        </p>
                        <Button
                            onClick={() => navigate("/contact")}
                            className="bg-[#e94560] hover:bg-[#c73652] text-white w-full"
                        >
                            Contact Me
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtworkDetailPage;