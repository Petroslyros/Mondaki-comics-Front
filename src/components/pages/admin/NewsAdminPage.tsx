import { useEffect, useState } from "react";
import { getAllNewsAdmin, createNews, updateNews, deleteNews, toggleNewsPublish, setNewsImage } from "@/services/api.news";
import type { NewsPost, NewsInsert } from "@/schemas/news";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, X, Check, Eye, EyeOff, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

const NewsAdminPage = () => {
    const [news, setNews] = useState<NewsPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<NewsInsert>({ title: "", content: "", isPublished: false, sortOrder: 0 });
    const [uploadingId, setUploadingId] = useState<number | null>(null);

    const loadNews = async () => {
        try {
            const data = await getAllNewsAdmin();
            setNews(data);
        } catch {
            toast.error("Αποτυχία φόρτωσης νέων");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNews();
    }, []);

    const handleSubmit = async () => {
        if (!form.title || !form.content) {
            toast.error("Ο τίτλος και το περιεχόμενο είναι υποχρεωτικά");
            return;
        }
        try {
            if (editingId) {
                await updateNews(editingId, form);
                toast.success("Το νέο ενημερώθηκε");
            } else {
                await createNews(form);
                toast.success("Το νέο δημιουργήθηκε");
            }
            setShowForm(false);
            setEditingId(null);
            setForm({ title: "", content: "", isPublished: false, sortOrder: 0 });
            loadNews();
        } catch {
            toast.error("Αποτυχία αποθήκευσης");
        }
    };

    const handleEdit = (post: NewsPost) => {
        setForm({ title: post.title, content: post.content, isPublished: post.isPublished, sortOrder: post.sortOrder });
        setEditingId(post.id);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Διαγραφή αυτού του νέου;")) return;
        try {
            await deleteNews(id);
            toast.success("Το νέο διαγράφηκε");
            loadNews();
        } catch {
            toast.error("Αποτυχία διαγραφής");
        }
    };

    const handleTogglePublish = async (id: number) => {
        try {
            const result = await toggleNewsPublish(id);
            setNews(prev => prev.map(n => n.id === id ? { ...n, isPublished: result.isPublished } : n));
        } catch {
            toast.error("Αποτυχία αλλαγής κατάστασης");
        }
    };

    const handleImageUpload = async (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setUploadingId(id);
        try {
            const file = e.target.files[0];
            const updated = await setNewsImage(id, file);
            setNews(prev => prev.map(n => n.id === id ? updated : n));
            toast.success("Η εικόνα ανέβηκε");
        } catch {
            toast.error("Αποτυχία ανεβάσματος εικόνας");
        } finally {
            setUploadingId(null);
            e.target.value = "";
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setForm({ title: "", content: "", isPublished: false, sortOrder: 0 });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-gray-500 dark:text-gray-400">Φόρτωση...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12 max-w-3xl">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-black dark:text-white">Νέα</h1>
                {!showForm && (
                    <Button
                        onClick={() => setShowForm(true)}
                        className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Νέα Ανάρτηση
                    </Button>
                )}
            </div>

            {showForm && (
                <div className="bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-[#2a2a2a] rounded-lg p-6 mb-8">
                    <h2 className="text-black dark:text-white font-semibold mb-4">
                        {editingId ? "Επεξεργασία Νέου" : "Νέα Ανάρτηση"}
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <Label className="text-gray-600 dark:text-gray-300">Τίτλος</Label>
                            <Input
                                value={form.title}
                                onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                                className="bg-white dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a] text-black dark:text-white mt-1"
                                placeholder="π.χ. Θα με βρείτε στη Comicdom!"
                            />
                        </div>
                        <div>
                            <Label className="text-gray-600 dark:text-gray-300">Περιεχόμενο</Label>
                            <Textarea
                                value={form.content}
                                onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
                                className="bg-white dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a] text-black dark:text-white mt-1 min-h-[120px]"
                                placeholder="Λεπτομέρειες..."
                            />
                        </div>
                        {!editingId && (
                            <p className="text-gray-400 dark:text-gray-500 text-sm">
                                Αποθήκευσε πρώτα το νέο, και μετά θα μπορείς να ανεβάσεις φωτογραφία.
                            </p>
                        )}
                        <div className="flex gap-3 pt-2">
                            <Button
                                onClick={handleSubmit}
                                className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
                            >
                                <Check className="w-4 h-4 mr-2" />
                                {editingId ? "Ενημέρωση" : "Δημιουργία"}
                            </Button>
                            <Button
                                onClick={handleCancel}
                                variant="outline"
                                className="border-gray-300 dark:border-[#2a2a2a] text-gray-600 dark:text-gray-300"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Ακύρωση
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {news.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-20">
                    Δεν υπάρχουν νέα ακόμα.
                </div>
            ) : (
                <div className="space-y-3">
                    {news.map((post) => (
                        <div
                            key={post.id}
                            className="bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-[#2a2a2a] rounded-lg p-4"
                        >
                            <div className="flex gap-4">
                                {/* Image thumbnail / upload */}
                                <div className="flex-shrink-0">
                                    <label className="block w-20 h-20 rounded-lg overflow-hidden border border-gray-300 dark:border-[#2a2a2a] cursor-pointer relative bg-gray-100 dark:bg-[#0a0a0a]">
                                        {post.imageUrl ? (
                                            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                                                {uploadingId === post.id ? (
                                                    <span className="text-xs">...</span>
                                                ) : (
                                                    <>
                                                        <Upload className="w-4 h-4" />
                                                        <span className="text-[10px] mt-1">Εικόνα</span>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(post.id, e)}
                                            disabled={uploadingId === post.id}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-black dark:text-white font-medium">{post.title}</span>
                                            <Badge className={post.isPublished
                                                ? "bg-green-600 text-white"
                                                : "bg-gray-400 dark:bg-gray-600 text-white"
                                            }>
                                                {post.isPublished ? "Δημοσιευμένο" : "Πρόχειρο"}
                                            </Badge>
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0">
                                            <Button onClick={() => handleTogglePublish(post.id)} variant="outline" size="sm"
                                                    className="border-gray-300 dark:border-[#2a2a2a] text-gray-600 dark:text-gray-300">
                                                {post.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </Button>
                                            <Button onClick={() => handleEdit(post)} variant="outline" size="sm"
                                                    className="border-gray-300 dark:border-[#2a2a2a] text-gray-600 dark:text-gray-300">
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button onClick={() => handleDelete(post.id)} variant="destructive" size="sm">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                                        {post.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NewsAdminPage;