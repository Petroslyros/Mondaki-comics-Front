import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getNewsById } from "@/services/api.news";
import type { NewsPost } from "@/schemas/news";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NewsDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<NewsPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        getNewsById(Number(id))
            .then(setPost)
            .catch(() => navigate("/news"))
            .finally(() => setLoading(false));
    }, [id]);

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString("el-GR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-gray-500 dark:text-gray-400">Φόρτωση...</p>
            </div>
        );
    }

    if (!post) return null;

    return (
        <div className="container mx-auto px-6 py-12 max-w-3xl">
            <Button
                variant="ghost"
                onClick={() => navigate("/news")}
                className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white mb-8"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Πίσω στα Νέα
            </Button>

            {post.imageUrl && (
                <div className="w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-[#121212] mb-8">
                    <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-auto max-h-[600px] object-contain mx-auto"
                    />
                </div>
            )}

            <div className="text-gray-400 dark:text-gray-500 text-sm mb-2">
                {formatDate(post.insertedAt)}
            </div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-6">
                {post.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {post.content}
            </p>
        </div>
    );
};

export default NewsDetailPage;