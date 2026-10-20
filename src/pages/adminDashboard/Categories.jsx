import React, { useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiX, FiChevronDown, FiCheckCircle } from 'react-icons/fi';
import useFetch from '../../hooks/useFetch';
// TODO: adjust this import path to where your useFetch hook lives
// import useFetch from '../../hooks/useFetch';

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

// Turns "Rivers & Lakes" into "rivers-lakes"
const slugify = (text) =>
    text
        .toLowerCase()
        .trim()
        .replace(/&/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

/* ------------------------------------------------------------------ */
/*  SMALL PIECES                                                       */
/* ------------------------------------------------------------------ */

// A single pill (category / subcategory) with a delete icon
const Chip = ({ label, onDelete }) => (
    <div className="inline-flex items-center gap-2 bg-[#ECEDFB] text-[#4F46E5] rounded-md px-3.5 py-2 text-xs sm:text-[13px] font-medium">
        <span>{label}</span>
        <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${label}`}
            className="text-[#EE1C25] hover:text-[#b9151c] transition-colors"
        >
            <FiTrash2 size={14} />
        </button>
    </div>
);

// Right-side sliding panel used for both "Add Category" and "Add Subcategory"
const SideDrawer = ({ open, title, onClose, children }) => {
    // Close on Escape key
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${
                    open ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            />

            {/* Panel */}
            <aside
                className={`fixed top-0 right-0 z-[70] h-full w-full sm:w-[380px] bg-[#F6F7FB] shadow-xl transition-transform duration-300 ease-in-out ${
                    open ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="p-5 sm:p-6">
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close"
                                className="text-gray-500 hover:text-gray-800"
                            >
                                <FiX size={18} />
                            </button>
                        </div>
                        {children}
                    </div>
                </div>
            </aside>
        </>
    );
};

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

const Categories = () => {
    // Data comes from /public/albumCategories.json
    // TODO: confirm the shape your useFetch hook returns ({ data, loading, error })
    const { data, loading, error } = useFetch('/albumCategories.json');

    // Local copy so add / delete update the UI instantly (frontend only)
    const [categories, setCategories] = useState([]);

    // Drawer state: null | 'category' | 'subcategory'
    const [drawer, setDrawer] = useState(null);

    // Form state
    const [categoryName, setCategoryName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [subcategoryName, setSubcategoryName] = useState('');
    const [formError, setFormError] = useState('');

    // Success toast message
    const [toast, setToast] = useState('');

    // Copy fetched data into local state once it arrives
    useEffect(() => {
        if (Array.isArray(data)) setCategories(data);
    }, [data]);

    // Auto-hide toast after 2.5s
    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(''), 2500);
        return () => clearTimeout(timer);
    }, [toast]);

    // Flatten every subcategory and remember its parent (for the Subcategory card)
    const allSubcategories = categories.flatMap((cat) =>
        (cat.subcategories || []).map((sub) => ({ ...sub, parentValue: cat.value }))
    );

    /* ---------------------------- Drawer controls --------------------------- */

    const openCategoryDrawer = () => {
        setCategoryName('');
        setFormError('');
        setDrawer('category');
    };

    const openSubcategoryDrawer = () => {
        setSelectedCategory('');
        setSubcategoryName('');
        setFormError('');
        setDrawer('subcategory');
    };

    const closeDrawer = () => setDrawer(null);

    /* ------------------------------- Actions -------------------------------- */

    // Delete category (UI only)
    const handleDeleteCategory = (value) => {
        // TODO: call real delete API here
        setCategories((prev) => prev.filter((cat) => cat.value !== value));
        setToast('Category deleted successfully');
    };

    // Delete subcategory (UI only)
    const handleDeleteSubcategory = (parentValue, subValue) => {
        // TODO: call real delete API here
        setCategories((prev) =>
            prev.map((cat) =>
                cat.value === parentValue
                    ? { ...cat, subcategories: cat.subcategories.filter((s) => s.value !== subValue) }
                    : cat
            )
        );
        setToast('Subcategory deleted successfully');
    };

    // Add category (UI only)
    const handleSaveCategory = (e) => {
        e.preventDefault();
        const name = categoryName.trim();
        if (!name) return setFormError('Please enter a category name');

        const value = slugify(name);
        if (categories.some((c) => c.value === value)) {
            return setFormError('This category already exists');
        }

        // TODO: call real add-category API here
        setCategories((prev) => [...prev, { name, value, subcategories: [] }]);
        setToast('Category added successfully');
        closeDrawer();
    };

    // Add subcategory (UI only)
    const handleSaveSubcategory = (e) => {
        e.preventDefault();
        const name = subcategoryName.trim();
        if (!selectedCategory) return setFormError('Please select a category');
        if (!name) return setFormError('Please enter a subcategory name');

        const value = slugify(name);
        const parent = categories.find((c) => c.value === selectedCategory);
        if (parent?.subcategories.some((s) => s.value === value)) {
            return setFormError('This subcategory already exists in that category');
        }

        // TODO: call real add-subcategory API here
        setCategories((prev) =>
            prev.map((cat) =>
                cat.value === selectedCategory
                    ? { ...cat, subcategories: [...cat.subcategories, { name, value }] }
                    : cat
            )
        );
        setToast('Subcategory added successfully');
        closeDrawer();
    };

    /* ------------------------------ Loading / error ------------------------- */

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center text-sm text-gray-500">
                Loading categories...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center text-sm text-red-600">
                Failed to load categories.
            </div>
        );
    }

    /* --------------------------------- UI ----------------------------------- */

    const inputClass =
        'w-full bg-[#F3F4F6] rounded-md px-3 py-2.5 text-xs text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EE1C25]/30';

    return (
        <div className="min-h-screen bg-[#F6F7FB] px-4 sm:px-6 lg:px-8 py-6 pt-20 lg:pt-8">
            {/* Success toast */}
            <div
                className={`fixed top-5 right-5 z-[80] flex items-center gap-2 bg-white border border-green-200 text-green-700 text-sm font-medium px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
                    toast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
                }`}
            >
                <FiCheckCircle size={18} />
                <span>{toast}</span>
            </div>

            {/* Header */}
            <header className="mb-6">
                <p className="text-[11px] tracking-[0.2em] uppercase text-gray-500 font-semibold">
                    Taxonomy
                </p>
                <h1 className="mt-2 text-3xl sm:text-4xl font-light text-gray-900">Categories</h1>
                <p className="mt-2 text-xs sm:text-sm text-gray-500">
                    Shape the places your photographers' work can belong.
                </p>
            </header>

            {/* Category card */}
            <section className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3 pb-4 border-b border-gray-100">
                    <h2 className="text-lg sm:text-xl font-medium text-gray-900">Category</h2>
                    <button
                        type="button"
                        onClick={openCategoryDrawer}
                        className="inline-flex items-center gap-1.5 bg-[#EE1C25] hover:bg-[#d4161e] text-white text-xs font-medium px-3.5 sm:px-4 py-2.5 rounded-md transition-colors"
                    >
                        <FiPlus size={14} />
                        <span>Add Category</span>
                    </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                    {categories.length === 0 && (
                        <p className="text-sm text-gray-400">No categories yet.</p>
                    )}
                    {categories.map((cat) => (
                        <Chip
                            key={cat.value}
                            label={cat.name}
                            onDelete={() => handleDeleteCategory(cat.value)}
                        />
                    ))}
                </div>
            </section>

            {/* Subcategory card */}
            <section className="mt-4 sm:mt-5 bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3 pb-4 border-b border-gray-100">
                    <h2 className="text-lg sm:text-xl font-medium text-gray-900">Subcategory</h2>
                    <button
                        type="button"
                        onClick={openSubcategoryDrawer}
                        className="inline-flex items-center gap-1.5 bg-[#EE1C25] hover:bg-[#d4161e] text-white text-xs font-medium px-3.5 sm:px-4 py-2.5 rounded-md transition-colors"
                    >
                        <FiPlus size={14} />
                        <span>Add Subcategory</span>
                    </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                    {allSubcategories.length === 0 && (
                        <p className="text-sm text-gray-400">No subcategories yet.</p>
                    )}
                    {allSubcategories.map((sub) => (
                        <Chip
                            key={`${sub.parentValue}-${sub.value}`}
                            label={sub.name}
                            onDelete={() => handleDeleteSubcategory(sub.parentValue, sub.value)}
                        />
                    ))}
                </div>
            </section>

            {/* Add Category drawer (right side) */}
            <SideDrawer open={drawer === 'category'} title="Category name" onClose={closeDrawer}>
                <form onSubmit={handleSaveCategory} noValidate>
                    <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => {
                            setCategoryName(e.target.value);
                            setFormError('');
                        }}
                        placeholder="Category name"
                        className={inputClass}
                    />
                    {formError && drawer === 'category' && (
                        <p className="mt-2 text-xs text-red-600">{formError}</p>
                    )}
                    <button
                        type="submit"
                        className="mt-4 w-full bg-[#EE1C25] hover:bg-[#d4161e] text-white text-xs font-semibold py-2.5 rounded-md transition-colors"
                    >
                        Save
                    </button>
                </form>
            </SideDrawer>

            {/* Add Subcategory drawer (right side) */}
            <SideDrawer open={drawer === 'subcategory'} title="Select Category" onClose={closeDrawer}>
                <form onSubmit={handleSaveSubcategory} noValidate>
                    <div className="relative">
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setFormError('');
                            }}
                            className={`${inputClass} appearance-none pr-9 cursor-pointer`}
                        >
                            <option value="">Category name</option>
                            {categories.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <FiChevronDown
                            size={16}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none"
                        />
                    </div>

                    <label className="block mt-4 mb-2 text-sm font-medium text-gray-900">
                        Subcategory name
                    </label>
                    <input
                        type="text"
                        value={subcategoryName}
                        onChange={(e) => {
                            setSubcategoryName(e.target.value);
                            setFormError('');
                        }}
                        placeholder="Subcategory name"
                        className={inputClass}
                    />

                    {formError && drawer === 'subcategory' && (
                        <p className="mt-2 text-xs text-red-600">{formError}</p>
                    )}

                    <button
                        type="submit"
                        className="mt-4 w-full bg-[#EE1C25] hover:bg-[#d4161e] text-white text-xs font-semibold py-2.5 rounded-md transition-colors"
                    >
                        Save
                    </button>
                </form>
            </SideDrawer>
        </div>
    );
};

export default Categories;