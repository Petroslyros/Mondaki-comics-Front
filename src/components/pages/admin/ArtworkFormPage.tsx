import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { artworkInsertSchema, type ArtworkInsert, type ArtworkImage } from "@/schemas/artworks";
import {
    createArtwork,
    getArtworkById,
    updateArtwork,
    addImageToArtwork,
    deleteImage,
    setCoverImage,
} from "@/services/api.artworks";
import { getAllCategories } from "@/services/api.categories";
import type { Category } from "@/schemas/categories";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Upload, Trash2, Star } from "lucide-react";

const ArtworkFormPage = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [categories, setCategories] = useState<Category[]>([]);
    const [images, setImages] = useState<ArtworkImage[]>([]);
    const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch,
    } = useForm<ArtworkInsert>({
        resolver: zodResolver(artworkInsertSchema),
        defaultValues: {
            title: "",
            description: "",
            categoryId: undefined,
            isPublished: false,
            sortOrder: 0,
        },
    });

    const isPublished = watch("isPublished");

    useEffect(() => {
        const loadData = async () => {
            try {
                const cats = await getAllCategories();
                setCategories(cats);

                if (isEdit && id) {
                    const artwork = await getArtworkById(Number(id));
                    reset({
                        title: artwork.title,
                        description: artwork.description ?? "",
                        categoryId: artwork.categoryName
                            ? cats.find(c => c.name === artwork.categoryName)?.id
                            : undefined,
                        isPublished: artwork.isPublished,
                        sortOrder: artwork.sortOrder,
                    });
                    setImages(artwork.images ?? []);
                    setCoverImageUrl(artwork.coverImageUrl ?? null);
                }
            } catch {
                toast.error("Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const onSubmit = async (data: ArtworkInsert) => {
        try {
            if (isEdit && id) {
                await updateArtwork(Number(id), data);
                toast.success("Artwork updated");
                navigate("/admin/artworks");
                return;
            } else {
                const created = await createArtwork(data);
                toast.success("Artwork created");
                navigate(`/admin/artworks/${created.id}`);
                return;
            }
        } catch {
            toast.error("Failed to save artwork");
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!id || !e.target.files?.length) return;

        setUploading(true);
        try {
            const file = e.target.files[0];
            const newImage = await addImageToArtwork(Number(id), file);
            setImages(prev => [...prev, newImage]);

            // If first image, set as cover
            if (images.length === 0) {
                setCoverImageUrl(newImage.imageUrl);
            }
            toast.success("Image uploaded");
        } catch {
            toast.error("Failed to upload image");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const handleDeleteImage = async (imageId: number) => {
        if (!id || !confirm("Delete this image?")) return;
        try {
            await deleteImage(Number(id), imageId);
            setImages(prev => prev.filter(i => i.id !== imageId));
            toast.success("Image deleted");
        } catch {
            toast.error("Failed to delete image");
        }
    };

    const handleSetCover = async (imageId: number, imageUrl: string) => {
        if (!id) return;
        try {
            await setCoverImage(Number(id), imageId);
            setCoverImageUrl(imageUrl);
            toast.success("Cover image updated");
        } catch {
            toast.error("Failed to set cover image");
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
        <div className="container mx-auto px-6 py-12 max-w-4xl">
            <Button
                variant="ghost"
                onClick={() => navigate("/admin/artworks")}
                className="text-gray-400 hover:text-white mb-8"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Artworks
            </Button>

            <h1 className="text-3xl font-bold text-white mb-8">
                {isEdit ? "Edit Artwork" : "New Artwork"}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Form */}
                <div className="bg-[#16213e] border border-[#0f3460] rounded-lg p-6">
                    <h2 className="text-white font-semibold text-lg mb-6">Details</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label className="text-gray-300">Title</Label>
                            <Input
                                {...register("title")}
                                className="bg-[#1a1a2e] border-[#0f3460] text-white mt-1"
                                placeholder="My Amazing Comic"
                            />
                            {errors.title && (
                                <p className="text-[#e94560] text-sm mt-1">{errors.title.message}</p>
                            )}
                        </div>

                        <div>
                            <Label className="text-gray-300">Description</Label>
                            <Textarea
                                {...register("description")}
                                className="bg-[#1a1a2e] border-[#0f3460] text-white mt-1 min-h-[100px]"
                                placeholder="Tell us about this piece..."
                            />
                        </div>

                        <div>
                            <Label className="text-gray-300">Category</Label>
                            <select
                                {...register("categoryId", { valueAsNumber: true })}
                                className="w-full mt-1 px-3 py-2 bg-[#1a1a2e] border border-[#0f3460]
                                           text-white rounded-md"
                            >
                                <option value="">No category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label className="text-gray-300">Sort Order</Label>
                            <Input
                                type="number"
                                {...register("sortOrder", { valueAsNumber: true })}
                                className="bg-[#1a1a2e] border-[#0f3460] text-white mt-1"
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <Switch
                                checked={isPublished}
                                onCheckedChange={(val) => setValue("isPublished", val)}
                                id="isPublished"
                            />
                            <Label htmlFor="isPublished" className="text-gray-300 cursor-pointer">
                                {isPublished ? "Published" : "Draft"}
                            </Label>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#e94560] hover:bg-[#c73652] text-white mt-2"
                        >
                            {isSubmitting
                                ? "Saving..."
                                : isEdit ? "Update Artwork" : "Create Artwork"
                            }
                        </Button>
                    </form>
                </div>

                {/* Images */}
                <div className="bg-[#16213e] border border-[#0f3460] rounded-lg p-6">
                    <h2 className="text-white font-semibold text-lg mb-2">Images</h2>

                    {!isEdit ? (
                        <p className="text-gray-400 text-sm mb-6">
                            Save the artwork first, then you can upload images.
                        </p>
                    ) : (
                        <>
                            <p className="text-gray-400 text-sm mb-6">
                                Upload images for this artwork. Click the star to set the cover image.
                            </p>

                            {/* Upload button */}
                            <label className="block mb-6">
                                <div className={`flex items-center justify-center gap-2 w-full py-3
                                    border-2 border-dashed border-[#0f3460] rounded-lg cursor-pointer
                                    hover:border-[#e94560] transition text-gray-400 hover:text-white
                                    ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    <Upload className="w-4 h-4" />
                                    <span className="text-sm">
                                        {uploading ? "Uploading..." : "Click to upload image"}
                                    </span>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    className="hidden"
                                />
                            </label>

                            {/* Image grid */}
                            {images.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">
                                    No images yet.
                                </p>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    {images.map((img) => (
                                        <div
                                            key={img.id}
                                            className={`relative rounded-lg overflow-hidden border-2 ${
                                                img.imageUrl === coverImageUrl
                                                    ? "border-[#e94560]"
                                                    : "border-[#0f3460]"
                                            }`}
                                        >
                                            <img
                                                src={img.imageUrl}
                                                alt={img.altText ?? "Artwork image"}
                                                className="w-full aspect-square object-cover"
                                            />

                                            {/* Cover indicator */}
                                            {img.imageUrl === coverImageUrl && (
                                                <div className="absolute top-1 left-1 bg-[#e94560] rounded-full p-1">
                                                    <Star className="w-3 h-3 text-white fill-white" />
                                                </div>
                                            )}

                                            {/* Actions overlay */}
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/60
                                                            flex gap-1 p-1 opacity-0 hover:opacity-100 transition">
                                                {img.imageUrl !== coverImageUrl && (
                                                    <button
                                                        onClick={() => handleSetCover(img.id, img.imageUrl)}
                                                        className="flex-1 flex items-center justify-center
                                                                   gap-1 text-xs text-white py-1 rounded
                                                                   bg-[#e94560]/80 hover:bg-[#e94560]"
                                                        title="Set as cover"
                                                    >
                                                        <Star className="w-3 h-3" />
                                                        Cover
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteImage(img.id)}
                                                    className="flex items-center justify-center p-1 rounded
                                                               bg-red-800/80 hover:bg-red-700 text-white"
                                                    title="Delete image"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArtworkFormPage;