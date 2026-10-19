import { FiLoader, FiUploadCloud } from "react-icons/fi";

const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#4048CD] focus:ring-2 focus:ring-[#4048CD]/20 disabled:cursor-not-allowed disabled:bg-gray-50";

const Field = ({ label, htmlFor, children }) => (
    <div>
        <label
            htmlFor={htmlFor}
            className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-500"
        >
            {label}
        </label>
        {children}
    </div>
);

/** Business Link ফর্ম। কোনো নিজস্ব স্টেট নেই, সব প্যারেন্ট পেজ থেকে আসে। */
const BusinessLinkForm = ({
    values,
    onFieldChange,
    categories = [],
    categoriesError = "",
    uploadedCount,
    requiredCount,
    isValid,
    missingItems,
    isSubmitting,
    onSubmit,
}) => {
    const selectedCategory = categories.find((c) => c.value === values.category);
    const subCategories = selectedCategory?.subcategories ?? [];

    const categoryPlaceholder = categoriesError
        ? "Failed to load categories"
        : categories.length === 0
          ? "Loading categories..."
          : "Select category";

    return (
        <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-2xl bg-[#F1F2FB] p-4 sm:p-5">
            <Field label="Collection Title" htmlFor="bl-title">
                <input
                    id="bl-title"
                    type="text"
                    value={values.title}
                    onChange={(e) => onFieldChange("title", e.target.value)}
                    placeholder="e.g., Celestial Archetypes of Fire"
                    className={inputClass}
                />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Artistic Category" htmlFor="bl-category">
                    <select
                        id="bl-category"
                        disabled={categories.length === 0}
                        value={values.category}
                        onChange={(e) => onFieldChange("category", e.target.value)}
                        className={inputClass}
                    >
                        <option value="">{categoryPlaceholder}</option>
                        {categories.map((c) => (
                            <option key={c.value} value={c.value}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Subcategory" htmlFor="bl-subCategory">
                    <select
                        id="bl-subCategory"
                        disabled={!values.category}
                        value={values.subCategory}
                        onChange={(e) => onFieldChange("subCategory", e.target.value)}
                        className={inputClass}
                    >
                        <option value="">Select subcategory</option>
                        {subCategories.map((s) => (
                            <option key={s.value} value={s.value}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </Field>
            </div>

            <Field label="Story / Concept / Creative Log" htmlFor="bl-story">
                <textarea
                    id="bl-story"
                    rows={5}
                    value={values.story}
                    onChange={(e) => onFieldChange("story", e.target.value)}
                    placeholder="Share the creative narrative behind this cosmological series..."
                    className={`${inputClass} resize-none`}
                />
            </Field>

            {/* AI question */}
            <div>
                <p className="mb-2 text-xs font-semibold text-gray-700">Was that photo or video created by AI?</p>
                <div className="flex items-center gap-5">
                    {[
                        { value: "yes", label: "Yes" },
                        { value: "no", label: "No" },
                    ].map((opt) => (
                        <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-xs text-gray-700">
                            <input
                                type="checkbox"
                                checked={values.isAI === opt.value}
                                onChange={() => onFieldChange("isAI", values.isAI === opt.value ? null : opt.value)}
                                className="h-4 w-4 accent-[#EE1C25]"
                            />
                            {opt.label}
                        </label>
                    ))}
                </div>
            </div>

            {/* Copyright */}
            <label className="flex cursor-pointer items-start gap-2 text-xs text-gray-700">
                <input
                    type="checkbox"
                    checked={values.copyrightConfirmed}
                    onChange={(e) => onFieldChange("copyrightConfirmed", e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#EE1C25]"
                />
                <span>
                    I confirm that I own the full copyright for all uploaded photos and that they do not contain or
                    promote anything illegal.
                </span>
            </label>

            {/* Submit */}
            <div>
                <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#EE1C25] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#EE1C25]"
                >
                    {isSubmitting ? (
                        <FiLoader size={16} className="animate-spin" />
                    ) : (
                        <FiUploadCloud size={16} />
                    )}
                    {isSubmitting ? "Submitting..." : "Submit your photos"}
                </button>

                <p className="mt-2 text-center text-[11px] text-gray-500">
                    Photos uploaded: {uploadedCount}/{requiredCount}
                    {!isValid && missingItems.length > 0 && (
                        <span className="block text-[#EE1C25]">Still needed: {missingItems.join(", ")}</span>
                    )}
                </p>
            </div>
        </form>
    );
};

export default BusinessLinkForm;