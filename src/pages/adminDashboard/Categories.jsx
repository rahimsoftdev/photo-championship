import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
    FiPlus,
    FiTrash2,
    FiX,
    FiChevronDown,
    FiCheckCircle,
} from 'react-icons/fi';
// TODO: adjust this import path to where your useFetch hook lives
import useFetch from '../../hooks/useFetch';

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
    <div className="inline-flex items-center gap-2 bg-[#ECEDFB] text-[#4F46E5] rounded-md px-3.5 py-2 text-xs sm:text-[13px] font-medium max-w-full">
        <span className="truncate">{label}</span>
        <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${label}`}
            className="shrink-0 text-[#EE1C25] hover:text-[#b9151c] transition-colors"
        >
            <FiTrash2 size={14} />
        </button>
    </div>
);

/**
 * Modal
 * - Rendered into document.body, so it covers the whole screen (sidebar too)
 * - Blurred backdrop, page scroll locked while open
 * - Mobile: bottom sheet | Tablet/Desktop: centered card
 * - `locked` stops closing (used while a delete is running)
 */
const Modal = ({ open, onClose, locked = false, labelledBy, children }) => {
    // Lock page scroll while open
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === 'Escape' && !locked) onClose();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, locked, onClose]);

    if (!open) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
        >
            {/* Blurred backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => !locked && onClose()}
            />

            {/* Panel */}
            <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 sm:p-7 max-h-[90vh] overflow-y-auto">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={locked}
                    aria-label="Close"
                    className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition disabled:opacity-40"
                >
                    <FiX size={18} />
                </button>
                {children}
            </div>
        </div>,
        document.body
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

    // Add modal state: null | 'category' | 'subcategory'
    const [addModal, setAddModal] = useState(null);

    // Add form state
    const [categoryName, setCategoryName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [subcategoryName, setSubcategoryName] = useState('');
    const [formError, setFormError] = useState('');

    // Delete modal state
    // deleteTarget: { kind: 'category' | 'subcategory', name, value, parentValue? } | null
    // deleteStep:   null | 'confirm' | 'success'
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteStep, setDeleteStep] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    // Success toast (used after adding)
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

    /* ----------------------------- Add modal ------------------------------- */

    const openCategoryModal = () => {
        setCategoryName('');
        setFormError('');
        setAddModal('category');
    };

    const openSubcategoryModal = () => {
        setSelectedCategory('');
        setSubcategoryName('');
        setFormError('');
        setAddModal('subcategory');
    };

    const closeAddModal = () => setAddModal(null);

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
        closeAddModal();
    };

    // Add subcategory (UI only)
    const handleSaveSubcategory = (e) => {
        e.preventDefault();
        const name = subcategoryName.trim();
        if (!selectedCategory) return setFormError('Please select a category');
        if (!name) return setFormError('Please enter a subcategory name');

        const value = slugify(name);
        const parent = categories.find((c) => c.value === selectedCategory);
        if (parent?.subcategories?.some((s) => s.value === value)) {
            return setFormError('This subcategory already exists in that category');
        }

        // TODO: call real add-subcategory API here
        setCategories((prev) =>
            prev.map((cat) =>
                cat.value === selectedCategory
                    ? { ...cat, subcategories: [...(cat.subcategories || []), { name, value }] }
                    : cat
            )
        );
        setToast('Subcategory added successfully');
        closeAddModal();
    };

    /* ---------------------------- Delete modal ----------------------------- */

    // Click on a chip's trash icon -> open the confirm modal
    const askDeleteCategory = (cat) => {
        setDeleteError('');
        setDeleteTarget({ kind: 'category', name: cat.name, value: cat.value });
        setDeleteStep('confirm');
    };

    const askDeleteSubcategory = (sub) => {
        setDeleteError('');
        setDeleteTarget({
            kind: 'subcategory',
            name: sub.name,
            value: sub.value,
            parentValue: sub.parentValue,
        });
        setDeleteStep('confirm');
    };

    // Cancel / X / backdrop / Escape / Done
    const closeDeleteModal = () => {
        if (isDeleting) return;
        setDeleteStep(null);
        setDeleteTarget(null);
        setDeleteError('');
    };

    // Confirm Delete -> data is deleted, then the modal shows the success message
    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;

        try {
            setIsDeleting(true);
            setDeleteError('');

            // TODO: call the real delete API here, for example:
            // if (deleteTarget.kind === 'category') await axiosSecure.delete(`/categories/${deleteTarget.value}`);
            // else await axiosSecure.delete(`/categories/${deleteTarget.parentValue}/subcategories/${deleteTarget.value}`);
            await new Promise((resolve) => setTimeout(resolve, 600)); // fake delay, remove with the API

            if (deleteTarget.kind === 'category') {
                setCategories((prev) => prev.filter((cat) => cat.value !== deleteTarget.value));
            } else {
                setCategories((prev) =>
                    prev.map((cat) =>
                        cat.value === deleteTarget.parentValue
                            ? {
                                  ...cat,
                                  subcategories: (cat.subcategories || []).filter(
                                      (s) => s.value !== deleteTarget.value
                                  ),
                              }
                            : cat
                    )
                );
            }

            setDeleteStep('success');
        } catch (err) {
            console.error('Delete failed:', err);
            setDeleteError('Could not delete. Please try again.');
        } finally {
            setIsDeleting(false);
        }
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
        'w-full bg-[#F3F4F6] rounded-md px-3 py-2.5 text-sm sm:text-xs text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EE1C25]/30';

    const deleteLabel = deleteTarget?.kind === 'subcategory' ? 'subcategory' : 'category';

    return (
        <div className="">
            {/* Success toast (after adding) */}
            <div
                className={`fixed top-5 right-5 left-5 sm:left-auto z-[120] flex items-center gap-2 bg-white border border-green-200 text-green-700 text-sm font-medium px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
                    toast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
                }`}
            >
                <FiCheckCircle size={18} className="shrink-0" />
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
                        onClick={openCategoryModal}
                        className="inline-flex items-center gap-1.5 bg-[#EE1C25] hover:bg-[#d4161e] text-white text-xs font-medium px-3.5 sm:px-4 py-2.5 rounded-md transition-colors whitespace-nowrap"
                    >
                        <FiPlus size={14} />
                        <span>Add Category</span>
                    </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2.5 sm:gap-3">
                    {categories.length === 0 && (
                        <p className="text-sm text-gray-400">No categories yet.</p>
                    )}
                    {categories.map((cat) => (
                        <Chip
                            key={cat.value}
                            label={cat.name}
                            onDelete={() => askDeleteCategory(cat)}
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
                        onClick={openSubcategoryModal}
                        className="inline-flex items-center gap-1.5 bg-[#EE1C25] hover:bg-[#d4161e] text-white text-xs font-medium px-3.5 sm:px-4 py-2.5 rounded-md transition-colors whitespace-nowrap"
                    >
                        <FiPlus size={14} />
                        <span>Add Subcategory</span>
                    </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2.5 sm:gap-3">
                    {allSubcategories.length === 0 && (
                        <p className="text-sm text-gray-400">No subcategories yet.</p>
                    )}
                    {allSubcategories.map((sub) => (
                        <Chip
                            key={`${sub.parentValue}-${sub.value}`}
                            label={sub.name}
                            onDelete={() => askDeleteSubcategory(sub)}
                        />
                    ))}
                </div>
            </section>

            {/* ---------------- Add Category modal ---------------- */}
            <Modal
                open={addModal === 'category'}
                onClose={closeAddModal}
                labelledBy="add-category-title"
            >
                <h3 id="add-category-title" className="text-lg sm:text-xl font-semibold text-gray-900 pr-8">
                    Add Category
                </h3>
                <p className="mt-1 text-xs text-gray-500">Enter a name for the new category.</p>

                <form onSubmit={handleSaveCategory} noValidate className="mt-5">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                        Category name
                    </label>
                    <input
                        type="text"
                        autoFocus
                        value={categoryName}
                        onChange={(e) => {
                            setCategoryName(e.target.value);
                            setFormError('');
                        }}
                        placeholder="Category name"
                        className={inputClass}
                    />
                    {formError && addModal === 'category' && (
                        <p className="mt-2 text-xs text-red-600" role="alert">{formError}</p>
                    )}

                    <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3">
                        <button
                            type="button"
                            onClick={closeAddModal}
                            className="w-full sm:flex-1 border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium py-2.5 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full sm:flex-1 bg-[#EE1C25] hover:bg-[#d4161e] text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ---------------- Add Subcategory modal ---------------- */}
            <Modal
                open={addModal === 'subcategory'}
                onClose={closeAddModal}
                labelledBy="add-subcategory-title"
            >
                <h3 id="add-subcategory-title" className="text-lg sm:text-xl font-semibold text-gray-900 pr-8">
                    Add Subcategory
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                    Choose a category and enter the subcategory name.
                </p>

                <form onSubmit={handleSaveSubcategory} noValidate className="mt-5">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                        Select Category
                    </label>
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

                    {formError && addModal === 'subcategory' && (
                        <p className="mt-2 text-xs text-red-600" role="alert">{formError}</p>
                    )}

                    <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3">
                        <button
                            type="button"
                            onClick={closeAddModal}
                            className="w-full sm:flex-1 border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium py-2.5 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full sm:flex-1 bg-[#EE1C25] hover:bg-[#d4161e] text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ---------------- Delete modal (confirm -> success) ---------------- */}
            <Modal
                open={deleteStep !== null}
                onClose={closeDeleteModal}
                locked={isDeleting}
                labelledBy="delete-modal-title"
            >
                <div className="text-center">
                    {deleteStep === 'confirm' && (
                        <>
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-[#EE1C25]">
                                <FiTrash2 size={24} />
                            </div>

                            <h3
                                id="delete-modal-title"
                                className="text-lg sm:text-xl font-semibold text-gray-900"
                            >
                                Delete this {deleteLabel}?
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                                Are you sure you want to delete{' '}
                                <span className="font-semibold text-gray-800 break-words">
                                    "{deleteTarget?.name}"
                                </span>
                                ? This action cannot be undone.
                            </p>
                            {deleteTarget?.kind === 'category' && (
                                <p className="mt-2 text-xs text-gray-400">
                                    All subcategories inside this category will be deleted too.
                                </p>
                            )}

                            {deleteError && (
                                <p className="mt-3 text-xs font-medium text-[#EE1C25]" role="alert">
                                    {deleteError}
                                </p>
                            )}

                            <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3">
                                <button
                                    type="button"
                                    onClick={closeDeleteModal}
                                    disabled={isDeleting}
                                    className="w-full sm:flex-1 border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmDelete}
                                    disabled={isDeleting}
                                    className="w-full sm:flex-1 bg-[#EE1C25] hover:bg-[#d4161e] text-white text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-70"
                                >
                                    {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                                </button>
                            </div>
                        </>
                    )}

                    {deleteStep === 'success' && (
                        <>
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
                                <FiCheckCircle size={26} />
                            </div>

                            <h3
                                id="delete-modal-title"
                                className="text-lg sm:text-xl font-semibold text-gray-900"
                            >
                                Deleted successfully
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                                The {deleteLabel} has been deleted successfully.
                            </p>

                            <button
                                type="button"
                                onClick={closeDeleteModal}
                                className="mt-6 w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                            >
                                Done
                            </button>
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default Categories;