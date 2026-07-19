import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getAllArtworksAdmin } from "@/services/api.artworks";
import { getAllCategories } from "@/services/api.categories";
import { getUnreadCount } from "@/services/api.contact";
import { Images, FolderOpen, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalArtworks: 0,
        publishedArtworks: 0,
        totalCategories: 0,
        unreadMessages: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [artworks, categories, messages] = await Promise.all([
                    getAllArtworksAdmin(),
                    getAllCategories(),
                    getUnreadCount(),
                ]);
                setStats({
                    totalArtworks: artworks.length,
                    publishedArtworks: artworks.filter(a => a.isPublished).length,
                    totalCategories: categories.length,
                    unreadMessages: messages.unreadCount,
                });
            } catch (err) {
                console.error("Failed to load stats:", err);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    const cards = [
        {
            label: "Total Artworks",
            value: stats.totalArtworks,
            sub: `${stats.publishedArtworks} published`,
            icon: Images,
            action: () => navigate("/admin/artworks"),
            color: "text-[#e94560]",
        },
        {
            label: "Categories",
            value: stats.totalCategories,
            sub: "Manage categories",
            icon: FolderOpen,
            action: () => navigate("/admin/categories"),
            color: "text-blue-400",
        },
        {
            label: "Unread Messages",
            value: stats.unreadMessages,
            sub: "View all messages",
            icon: MessageSquare,
            action: () => navigate("/admin/messages"),
            color: "text-green-400",
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-gray-400">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-gray-400 mt-1">Welcome back, Mondaki!</p>
                </div>
                <Button
                    onClick={() => navigate("/admin/artworks/new")}
                    className="bg-[#e94560] hover:bg-[#c73652] text-white"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Artwork
                </Button>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <button
                            key={card.label}
                            onClick={card.action}
                            className="bg-[#16213e] border border-[#0f3460] hover:border-[#e94560]
                                       rounded-lg p-6 text-left transition duration-200 group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <Icon className={`w-8 h-8 ${card.color}`} />
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">
                                {card.value}
                            </div>
                            <div className="text-white font-medium">{card.label}</div>
                            <div className="text-gray-400 text-sm mt-1">{card.sub}</div>
                        </button>
                    );
                })}
            </div>

            {/* Quick actions */}
            <div className="bg-[#16213e] border border-[#0f3460] rounded-lg p-6">
                <h2 className="text-white font-semibold text-lg mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                    <Button
                        onClick={() => navigate("/admin/artworks/new")}
                        className="bg-[#e94560] hover:bg-[#c73652] text-white"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Artwork
                    </Button>
                    <Button
                        onClick={() => navigate("/admin/artworks")}
                        variant="outline"
                        className="border-[#0f3460] text-gray-300 hover:text-white"
                    >
                        <Images className="w-4 h-4 mr-2" />
                        Manage Artworks
                    </Button>
                    <Button
                        onClick={() => navigate("/admin/categories")}
                        variant="outline"
                        className="border-[#0f3460] text-gray-300 hover:text-white"
                    >
                        <FolderOpen className="w-4 h-4 mr-2" />
                        Manage Categories
                    </Button>
                    <Button
                        onClick={() => navigate("/admin/messages")}
                        variant="outline"
                        className="border-[#0f3460] text-gray-300 hover:text-white"
                    >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        View Messages
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;