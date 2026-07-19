import { useEffect, useState } from "react";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "@/services/api.categories";
import type { Category, CategoryInsert } from "@/schemas/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Plus, X, Check } from "lucide-react";
import { toast } from "sonner";

const CategoriesAdminPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<CategoryInsert>({ name: "", slug: "", description: "" });

    const loadCategories = async () => {
        try {
            const data = await getAllCategories();
            setCategories(data);
        } catch {
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const generateSlug = (name: string) =>
        name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const handleNameChange = (name: string) => {
        setForm(prev => ({
            ...prev,
            name,
            slug: editingId ? prev.slug : generateSlug(name),
        }));
    };

    const handleSubmit = async () => {
        if (!form.name || !form.slug) {
            toast.error("Name and slug are required");
            return;
        }

        try {
            if (editingId) {
                await updateCategory(editingId, form);
                toast.success("Category updated");
            } else {
                await createCategory(form);
                toast.success("Category created");
            }
            setShowForm(false);
            setEditingId(null);
            setForm({ name: "", slug: "", description: "" });
            loadCategories();
        } catch {
            toast.error("Failed to save category");
        }
    };

    const handleEdit = (cat: Category) => {
        setForm({ name: cat.name, slug: cat.slug, description: cat.description ?? "" });
        setEditingId(cat.id);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this category?")) return;
        try {
            await deleteCategory(id);
            toast.success("Category deleted");
            loadCategories();
        } catch {
            toast.error("Failed to delete category");
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setForm({ name: "", slug: "", description: "" });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-gray-400">Loading...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12 max-w-3xl">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Categories</h1>
                {!showForm && (
                    <Button
                        onClick={() => setShowForm(true)}
                        className="bg-[#e94560] hover:bg-[#c73652] text-white"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Category
                    </Button>
                )}
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-[#16213e] border border-[#0f3460] rounded-lg p-6 mb-8">
                    <h2 className="text-white font-semibold mb-4">
                        {editingId ? "Edit Category" : "New Category"}
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <Label className="text-gray-300">Name</Label>
                            <Input
                                value={form.name}
                                onChange={e => handleNameChange(e.target.value)}
                                className="bg-[#1a1a2e] border-[#0f3460] text-white mt-1"
                                placeholder="Fan Art"
                            />
                        </div>
                        <div>
                            <Label className="text-gray-300">Slug</Label>
                            <Input
                                value={form.slug}
                                onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
                                className="bg-[#1a1a2e] border-[#0f3460] text-white mt-1"
                                placeholder="fan-art"
                            />
                        </div>
                        <div>
                            <Label className="text-gray-300">Description (optional)</Label>
                            <Input
                                value={form.description}
                                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                                className="bg-[#1a1a2e] border-[#0f3460] text-white mt-1"
                                placeholder="Description..."
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button
                                onClick={handleSubmit}
                                className="bg-[#e94560] hover:bg-[#c73652] text-white"
                            >
                                <Check className="w-4 h-4 mr-2" />
                                {editingId ? "Update" : "Create"}
                            </Button>
                            <Button
                                onClick={handleCancel}
                                variant="outline"
                                className="border-[#0f3460] text-gray-300"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* List */}
            {categories.length === 0 ? (
                <div className="text-center text-gray-400 py-20">
                    No categories yet. Create one to get started.
                </div>
            ) : (
                <div className="space-y-3">
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            className="bg-[#16213e] border border-[#0f3460] rounded-lg p-4
                                       flex items-center justify-between"
                        >
                            <div>
                                <div className="text-white font-medium">{cat.name}</div>
                                <div className="text-gray-400 text-sm">/{cat.slug}</div>
                                {cat.description && (
                                    <div className="text-gray-500 text-sm mt-1">{cat.description}</div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleEdit(cat)}
                                    variant="outline"
                                    size="sm"
                                    className="border-[#0f3460] text-gray-300 hover:text-white"
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                    onClick={() => handleDelete(cat.id)}
                                    variant="destructive"
                                    size="sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoriesAdminPage;