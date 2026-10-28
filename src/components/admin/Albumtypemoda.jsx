import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiChevronDown } from 'react-icons/fi';

// TODO: add real info or data (icon options should match the iconType values AlbumCard supports)
const iconOptions = [
    { label: 'Camera', value: 'Camera' },
    { label: 'Book Open', value: 'BookOpen' },
    { label: 'Sparkles', value: 'Sparkles' },
];

// TODO: add real info or data (album type options used in the ?albumType= query param)
const albumTypeOptions = [
    { label: 'Single', value: 'single' },
    { label: 'Six', value: 'six' },
    { label: 'Twelve', value: 'twelve' },
];

const emptyForm = {
    title: '',
    price: '',
    iconType: 'Camera',
    albumType: 'single',
    description: '',
    featuresText: '',
};

// Turns "$1500.00" into "1500.00" for the price input
const priceToNumberString = (price = '') => String(price).replace(/[^0-9.]/g, '');

/**
 * AlbumTypeModal
 * - album = null  -> "New Album type" (create)
 * - album = {...} -> "Edit Album type" (edit)
 * onSave receives the finished album object (without id for new albums).
 *
 * Responsive layout:
 * - Mobile (portrait/landscape): bottom sheet, header + footer stay fixed,
 *   only the form body scrolls (uses dvh so the browser address bar doesn't cut it)
 * - Tablet: centered card (max-w-lg)
 * - Laptop/Desktop: wider card (max-w-xl / 2xl)
 * - Backdrop is blurred and covers the whole screen (portal into document.body)
 */
const AlbumTypeModal = ({ open, album, onClose, onSave }) => {
    const isEditing = Boolean(album);
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState('');

    // Fill the form every time the modal opens
    useEffect(() => {
        if (!open) return;
        setError('');
        if (album) {
            setForm({
                title: album.title || '',
                price: priceToNumberString(album.price),
                iconType: album.iconType || 'Camera',
                albumType: album.albumType || 'single',
                description: album.description || '',
                featuresText: (album.features || []).join('\n'),
            });
        } else {
            setForm(emptyForm);
        }
    }, [open, album]);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    // Lock page scroll while modal is open
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    if (!open) return null;

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const title = form.title.trim();
        const description = form.description.trim();
        const features = form.featuresText
            .split('\n')
            .map((f) => f.trim())
            .filter(Boolean);
        const priceNumber = Number(form.price);

        if (!title) return setError('Please enter an album name');
        if (!form.price || Number.isNaN(priceNumber) || priceNumber < 0) {
            return setError('Please enter a valid price');
        }
        if (!description) return setError('Please enter a description');
        if (features.length === 0) return setError('Please add at least one feature');

        onSave({
            // keep old values (id, badge, isPopular, priceSub, buttonText) when editing
            ...(album || {
                // TODO: add real info or data (defaults for a brand new album type)
                badge: '',
                isPopular: false,
                priceSub: 'prize money',
                buttonText: 'Enter Now',
            }),
            title,
            description,
            features,
            price: `$${priceNumber.toFixed(2)}`,
            iconType: form.iconType,
            albumType: form.albumType,
        });
    };

    const labelClass = 'block mb-1.5 text-xs font-medium text-gray-600';
    // text-base on mobile avoids iOS zoom on focus, smaller from sm up
    const inputClass =
        'w-full bg-[#F3F4F6] rounded-md px-3 py-2.5 text-base sm:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EE1C25]/30';

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="album-type-modal-title"
        >
            {/* Blurred backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel: header + footer fixed, body scrolls */}
            <div className="relative flex w-full flex-col overflow-hidden bg-white shadow-2xl rounded-t-3xl sm:rounded-2xl sm:max-w-lg lg:max-w-xl max-h-[94dvh] sm:max-h-[90dvh]">
                {/* Header (fixed) */}
                <div className="relative shrink-0 px-4 pt-3 pb-3 sm:px-6 sm:pt-6 sm:pb-4 border-b border-gray-100">
                    {/* Drag handle look (mobile only) */}
                    <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-200 sm:hidden" />

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition"
                    >
                        <FiX size={18} />
                    </button>

                    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#EE1C25]">
                        Album type
                    </p>
                    <h3
                        id="album-type-modal-title"
                        className="mt-1 pr-10 text-lg sm:text-xl font-semibold text-gray-900"
                    >
                        {isEditing ? 'Edit Album type' : 'New Album type'}
                    </h3>
                    <p className="mt-1 pr-10 text-xs text-gray-500">
                        {isEditing
                            ? 'Update the details shown on this album card.'
                            : 'Fill in the details to create a new album card.'}
                    </p>
                </div>

                {/* Form: body scrolls, footer stays visible */}
                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="flex min-h-0 flex-1 flex-col"
                >
                    {/* Body (scrollable) */}
                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5 space-y-4">
                        {/* Row 1: name + price */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="min-w-0">
                                <label className={labelClass}>Album name</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Single Photo"
                                    className={inputClass}
                                />
                            </div>
                            <div className="min-w-0">
                                <label className={labelClass}>Price ($)</label>
                                <input
                                    type="number"
                                    name="price"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="1500.00"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Row 2: icon + album type */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="min-w-0">
                                <label className={labelClass}>Icon</label>
                                <div className="relative">
                                    <select
                                        name="iconType"
                                        value={form.iconType}
                                        onChange={handleChange}
                                        className={`${inputClass} appearance-none pr-9 cursor-pointer`}
                                    >
                                        {iconOptions.map((o) => (
                                            <option key={o.value} value={o.value}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </select>
                                    <FiChevronDown
                                        size={16}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
                                    />
                                </div>
                            </div>
                            <div className="min-w-0">
                                <label className={labelClass}>Album type</label>
                                <div className="relative">
                                    <select
                                        name="albumType"
                                        value={form.albumType}
                                        onChange={handleChange}
                                        className={`${inputClass} appearance-none pr-9 cursor-pointer`}
                                    >
                                        {albumTypeOptions.map((o) => (
                                            <option key={o.value} value={o.value}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </select>
                                    <FiChevronDown
                                        size={16}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className={labelClass}>Description</label>
                            <textarea
                                name="description"
                                rows={3}
                                value={form.description}
                                onChange={handleChange}
                                placeholder="A short description of this album type"
                                className={`${inputClass} resize-none`}
                            />
                        </div>

                        {/* Features */}
                        <div>
                            <label className={labelClass}>Features (one per line)</label>
                            <textarea
                                name="featuresText"
                                rows={4}
                                value={form.featuresText}
                                onChange={handleChange}
                                placeholder={'Worldwide competition\nBest photo wins'}
                                className={`${inputClass} resize-none`}
                            />
                        </div>

                        {error && (
                            <p className="text-xs text-red-600" role="alert">
                                {error}
                            </p>
                        )}
                    </div>

                    {/* Footer (fixed): stacked on mobile, side by side from sm up */}
                    <div className="shrink-0 border-t border-gray-100 px-4 pt-3 sm:px-6 sm:py-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 sm:gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full sm:w-auto bg-[#EE1C25] hover:bg-[#d4161e] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
                        >
                            Save Album
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default AlbumTypeModal;