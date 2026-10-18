import { FiAward, FiLoader, FiUploadCloud, FiUser } from "react-icons/fi";
import { COMPETITION_INFO } from "./uploadArtworkData";

const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#4048CD] focus:ring-2 focus:ring-[#4048CD]/20 disabled:cursor-not-allowed disabled:bg-gray-50";

const readOnlyClass =
    "w-full cursor-default rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 outline-none";

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

/**
 * Upload form. It holds NO state of its own — everything comes from the parent page.
 * `categories` = [{ name, value, subcategories: [{ name, value }] }] (from the categories JSON)
 * Submit is enabled only when `isValid` is true (all fields filled + all required photos uploaded).
 */
const UploadArtWorkForm = ({
    values,
    onFieldChange,
    categories = [],
    categoriesError = "",
    derived,
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
        <form
            onSubmit={onSubmit}
            noValidate
            className="space-y-4 rounded-2xl bg-[#F1F2FB] p-4 sm:p-5"
        >
            <Field label="Collection Title" htmlFor="title">
                <input
                    id="title"
                    type="text"
                    required
                    value={values.title}
                    onChange={(e) => onFieldChange("title", e.target.value)}
                    placeholder="e.g., Celestial Archetypes of Fire"
                    className={inputClass}
                />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Artistic Category" htmlFor="category">
                    <select
                        id="category"
                        required
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

                <Field label="Subcategory" htmlFor="subCategory">
                    <select
                        id="subCategory"
                        required
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

            <Field label="Story / Concept / Creative Log" htmlFor="story">
                <textarea
                    id="story"
                    required
                    rows={5}
                    value={values.story}
                    onChange={(e) => onFieldChange("story", e.target.value)}
                    placeholder="Share the creative narrative behind this cosmological series..."
                    className={`${inputClass} resize-none`}
                />
            </Field>

            {/* Auto-filled from uploaded photos */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Resolution" htmlFor="resolution">
                    <input
                        id="resolution"
                        readOnly
                        value={derived.resolution}
                        placeholder="Auto-detected"
                        className={readOnlyClass}
                    />
                </Field>
                <Field label="File Size" htmlFor="fileSize">
                    <input
                        id="fileSize"
                        readOnly
                        value={derived.fileSize}
                        placeholder="Auto-detected"
                        className={readOnlyClass}
                    />
                </Field>
                <Field label="Quality" htmlFor="quality">
                    <input
                        id="quality"
                        readOnly
                        value={derived.quality}
                        placeholder="Auto-detected"
                        className={readOnlyClass}
                    />
                </Field>
            </div>

            {/* Publish destination */}
            <fieldset className="rounded-xl border border-gray-200 bg-white p-4">
                <legend className="sr-only">Choose where this artwork should be published</legend>
                <p className="mb-3 text-xs font-semibold text-gray-700">
                    Choose where this artwork should be published:
                </p>

                <div className="space-y-3">
                    <label
                        className={`block cursor-pointer rounded-lg border p-3 transition ${
                            values.publishTo === "competition"
                                ? "border-[#4048CD] bg-[#F6F7FF]"
                                : "border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                        <span className="flex items-start gap-2.5">
                            <input
                                type="radio"
                                name="publishTo"
                                value="competition"
                                checked={values.publishTo === "competition"}
                                onChange={() => onFieldChange("publishTo", "competition")}
                                className="mt-0.5 accent-[#4048CD]"
                            />
                            <span className="flex-1">
                                <span className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                                    <FiAward size={13} className="text-amber-500" />
                                    Add this artwork to this month's competition
                                </span>
                                <span className="mt-2 block rounded-md border border-gray-200 bg-white p-2.5 shadow-sm">
                                    <span className="block text-xs font-bold text-gray-900">
                                        {COMPETITION_INFO.name}
                                    </span>
                                    <span className="mt-0.5 block text-[10px] text-gray-500">
                                        Voting Period: {COMPETITION_INFO.votingPeriod}
                                    </span>
                                    <span className="mt-1 block text-[11px] font-bold text-gray-900">
                                        Prize Pool: {COMPETITION_INFO.prizePool}
                                    </span>
                                </span>
                            </span>
                        </span>
                    </label>

                    <label
                        className={`block cursor-pointer rounded-lg border p-3 transition ${
                            values.publishTo === "profile"
                                ? "border-[#4048CD] bg-[#F6F7FF]"
                                : "border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                        <span className="flex items-start gap-2.5">
                            <input
                                type="radio"
                                name="publishTo"
                                value="profile"
                                checked={values.publishTo === "profile"}
                                onChange={() => onFieldChange("publishTo", "profile")}
                                className="mt-0.5 accent-[#4048CD]"
                            />
                            <span>
                                <span className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                                    <FiUser size={13} className="text-gray-500" />
                                    Add this artwork only to my profile
                                </span>
                                <span className="mt-1 block text-[11px] text-gray-500">
                                    Keep on your personal showcase portfolio. You can always enter it into future
                                    monthly competitions later.
                                </span>
                            </span>
                        </span>
                    </label>
                </div>
            </fieldset>

            {/* AI question */}
            <div>
                <p className="mb-2 text-xs font-semibold text-gray-700">
                    Was that photo or video created by AI?
                </p>
                <div className="flex items-center gap-5">
                    {[
                        { value: "yes", label: "Yes" },
                        { value: "no", label: "No" },
                    ].map((opt) => (
                        <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-xs text-gray-700">
                            <input
                                type="checkbox"
                                checked={values.isAI === opt.value}
                                onChange={() =>
                                    onFieldChange("isAI", values.isAI === opt.value ? null : opt.value)
                                }
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

export default UploadArtWorkForm;