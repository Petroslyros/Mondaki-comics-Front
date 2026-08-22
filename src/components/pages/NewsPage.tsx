import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getPublishedNews } from "@/services/api.news";
import type { NewsPost } from "@/schemas/news";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NewsPage = () => {
    const [news, setNews] = useState<NewsPost[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getPublishedNews()
            .then(setNews)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

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

    return (
        <div className="container mx-auto px-6 py-12 max-w-3xl">
            <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white mb-8"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Πίσω στη Gallery
            </Button>

            <h1 className="text-4xl font-bold text-black dark:text-white mb-10 text-center">
                Νέα
            </h1>

            {news.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-20">
                    Δεν υπάρχουν νέα αυτή τη στιγμή.
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {news.map((post) => (
                        <div
                            key={post.id}
                            className="bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-[#2a2a2a] rounded-lg p-6 flex gap-5"
                        >
                            {post.imageUrl && (
                                <div className="flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gray-200 dark:bg-[#0a0a0a]">
                                    <img
                                        src={post.imageUrl}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="text-gray-400 dark:text-gray-500 text-sm mb-2">
                                    {formatDate(post.insertedAt)}
                                </div>
                                <h2 className="text-black dark:text-white font-semibold text-xl mb-3">
                                    {post.title}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                    {post.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NewsPage;