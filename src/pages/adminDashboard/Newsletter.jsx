import { useEffect, useMemo, useRef, useState } from "react";
import {
    FiBold,
    FiItalic,
    FiUnderline,
    FiList,
    FiAlignLeft,
    FiCode,
    FiLink,
    FiMail,
    FiX,
    FiImage,
    FiUsers,
    FiUserCheck,
    FiUserPlus,
    FiCheck,
    FiSend,
    FiTrash2,
} from "react-icons/fi";
import { MdFormatQuote } from "react-icons/md";

/* ------------------------------ Fake data ------------------------------ */
// TODO: replace with real API data
const TOTAL_SUBSCRIBERS = 18420; // total count coming from the backend
const DAY = 24 * 60 * 60 * 1000;
const daysAgo = (n) => new Date(Date.now() - n * DAY).toISOString();

const SUBSCRIBERS = [
    { id: 1, email: "john.anderson@company.com", subscribedAt: "2026-06-09T12:00:00Z" },
    { id: 2, email: "sarah.m@email.com", subscribedAt: "2026-06-09T12:00:00Z" },
    { id: 3, email: "admin@buildpro.com", subscribedAt: "2026-06-09T12:00:00Z" },
    { id: 4, email: "contact@construction.com", subscribedAt: "2026-06-09T12:00:00Z" },
    ...Array.from({ length: 13 }, (_, i) => ({
        id: 5 + i,
        email: "emily.d@email.com",
        // last 3 rows are "new" (joined within the last 7 days) so the demo works
        subscribedAt: i >= 10 ? daysAgo(i - 9) : "2026-06-09T12:00:00Z",
    })),
];

const RECIPIENT_OPTIONS = [
    { value: "everyone", title: "Send to Everyone", Icon: FiUsers },
    { value: "selected", title: "Send to Selected Users", Icon: FiUserCheck },
    { value: "new", title: "Send to New Subscribers", Icon: FiUserPlus },
];

const MAX_BANNER_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_BANNER_TYPES = ["image/png", "image/jpeg"];

/* -------------------------------- Helpers -------------------------------- */

const formatDate = (iso) => new Date(iso).toLocaleDateString("en-US");
const isNewSubscriber = (iso) => Date.now() - new Date(iso).getTime() <= 7 * DAY;
const escapeHtml = (str) =>
    str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const isValidUrl = (value) => {
    try {
        const u = new URL(value);
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
};

/* ---------------------------- Shared UI pieces ---------------------------- */

const Label = ({ htmlFor, children }) => (
    <label
        htmlFor={htmlFor}
        className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-gray-500"
    >
        {children}
    </label>
);

const inputClass =
    "w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-gray-400 outline-none transition focus:border-indigo-400 focus:bg-white";

const FieldError = ({ message }) =>
    message ? <p className="mt-1.5 text-[11px] text-red-500">{message}</p> : null;

/* ------------------------------ Rich editor ------------------------------ */

const ToolbarButton = ({ label, onAction, children }) => (
    <button
        type="button"
        title={label}
        aria-label={label}
        // mousedown + preventDefault keeps the selection inside the editor
        onMouseDown={(e) => {
            e.preventDefault();
            onAction();
        }}
        className="rounded p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-slate-800"
    >
        {children}
    </button>
);

const RichTextEditor = ({ onChange }) => {
    const ref = useRef(null);

    const emit = () => {
        const el = ref.current;
        if (!el) return;
        // browsers leave a stray <br> after clearing; reset so the placeholder shows again
        if (!el.textContent.trim() && !el.querySelector("img")) el.innerHTML = "";
        onChange(el.innerHTML);
    };

    const exec = (cmd, value = null) => {
        ref.current?.focus();
        document.execCommand(cmd, false, value);
        emit();
    };

    const addLink = () => {
        const raw = window.prompt("Enter link URL");
        if (!raw) return;
        exec("createLink", /^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    };

    const wrapCode = () => {
        const text = window.getSelection()?.toString();
        if (text) exec("insertHTML", `<code>${escapeHtml(text)}</code>`);
    };

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 focus-within:border-indigo-400">
            <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-100 px-2 py-1">
                <ToolbarButton label="Bold" onAction={() => exec("bold")}>
                    <FiBold className="h-3 w-3" />
                </ToolbarButton>
                <ToolbarButton label="Italic" onAction={() => exec("italic")}>
                    <FiItalic className="h-3 w-3" />
                </ToolbarButton>
                <ToolbarButton label="Underline" onAction={() => exec("underline")}>
                    <FiUnderline className="h-3 w-3" />
                </ToolbarButton>
                <span className="mx-1 h-3.5 w-px bg-gray-200" />
                <ToolbarButton label="Bulleted list" onAction={() => exec("insertUnorderedList")}>
                    <FiList className="h-3 w-3" />
                </ToolbarButton>
                <ToolbarButton label="Align left" onAction={() => exec("justifyLeft")}>
                    <FiAlignLeft className="h-3 w-3" />
                </ToolbarButton>
                <ToolbarButton label="Quote" onAction={() => exec("formatBlock", "blockquote")}>
                    <MdFormatQuote className="h-3.5 w-3.5" />
                </ToolbarButton>
                <span className="mx-1 h-3.5 w-px bg-gray-200" />
                <ToolbarButton label="Code" onAction={wrapCode}>
                    <FiCode className="h-3 w-3" />
                </ToolbarButton>
                <ToolbarButton label="Insert link" onAction={addLink}>
                    <FiLink className="h-3 w-3" />
                </ToolbarButton>
            </div>

            <div
                ref={ref}
                id="newsletter-content"
                contentEditable
                suppressContentEditableWarning
                role="textbox"
                aria-multiline="true"
                data-placeholder="Start writing your newsletter..."
                onInput={emit}
                className="h-[110px] overflow-y-auto px-3.5 py-3 text-xs leading-relaxed text-slate-700 outline-none
          empty:before:text-gray-400 empty:before:content-[attr(data-placeholder)]
          [&_a]:text-blue-600 [&_a]:underline
          [&_ul]:list-disc [&_ul]:pl-5
          [&_blockquote]:border-l-2 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-gray-500
          [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:font-mono [&_code]:text-[11px]"
            />
        </div>
    );
};

/* ----------------------------- Banner uploader ----------------------------- */

const BannerUpload = ({ file, onChange }) => {
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState("");

    const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);
    useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl]);

    const pickFile = (f) => {
        if (!f) return;
        if (!ACCEPTED_BANNER_TYPES.includes(f.type)) {
            setError("Only PNG or JPG images are allowed.");
            return;
        }
        if (f.size > MAX_BANNER_SIZE) {
            setError("Image must be 4MB or smaller.");
            return;
        }
        setError("");
        onChange(f);
    };

    return (
        <>
            <input
                ref={inputRef}
                id="newsletter-banner"
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={(e) => {
                    pickFile(e.target.files?.[0]);
                    e.target.value = "";
                }}
            />

            {file ? (
                <div className="relative overflow-hidden rounded-lg border border-gray-200">
                    <img src={previewUrl} alt="Banner preview" className="h-28 w-full object-cover" />
                    <button
                        type="button"
                        onClick={() => onChange(null)}
                        aria-label="Remove banner image"
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                    >
                        <FiTrash2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setDragging(false);
                        pickFile(e.dataTransfer.files?.[0]);
                    }}
                    className={`flex w-full items-center justify-center gap-3 rounded-lg border border-dashed px-4 py-6 transition ${dragging
                            ? "border-indigo-400 bg-indigo-50/50"
                            : "border-gray-300 bg-gray-50/40 hover:bg-gray-50"
                        }`}
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-indigo-500">
                        <FiImage className="h-4 w-4" />
                    </span>
                    <span className="text-left">
                        <span className="block text-[11px] font-semibold text-slate-800">Click to upload</span>
                        <span className="block text-[10px] text-gray-400">
                            PNG, JPG up to 4MB &middot; 1200&times;600 recommended
                        </span>
                    </span>
                </button>
            )}
            <FieldError message={error} />
        </>
    );
};

/* ------------------------------ Recipient card ------------------------------ */

const RecipientOption = ({ option, description, checked, onSelect }) => {
    const { Icon, title } = option;
    return (
        <button
            type="button"
            role="radio"
            aria-checked={checked}
            onClick={onSelect}
            className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${checked
                    ? "border-indigo-500 bg-indigo-50/30 ring-1 ring-indigo-500"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
        >
            <span
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${checked ? "bg-indigo-600 text-white" : "bg-gray-50 text-gray-400"
                    }`}
            >
                <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-semibold text-slate-800">{title}</span>
                <span className="block text-[10px] text-gray-500">{description}</span>
            </span>
            <span
                className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border ${checked ? "border-indigo-600 bg-indigo-600 text-white" : "border-gray-300"
                    }`}
            >
                {checked && <FiCheck className="h-2.5 w-2.5" />}
            </span>
        </button>
    );
};

/* ------------------------------- Main page ------------------------------- */

const INITIAL_FORM = { subject: "", title: "", ctaText: "Read more", ctaUrl: "" };

const Newsletter = () => {
    const [form, setForm] = useState(INITIAL_FORM);
    const [contentHtml, setContentHtml] = useState("");
    const [banner, setBanner] = useState(null);
    const [recipientType, setRecipientType] = useState("everyone");
    const [selectedIds, setSelectedIds] = useState(() => new Set());
    const [errors, setErrors] = useState({});
    const [sending, setSending] = useState(false);
    const [toast, setToast] = useState("");
    const [editorKey, setEditorKey] = useState(0); // bump to clear the rich editor

    const newCount = SUBSCRIBERS.filter((s) => isNewSubscriber(s.subscribedAt)).length;
    const selectionMode = recipientType === "selected";
    const allSelected = selectedIds.size === SUBSCRIBERS.length;

    const recipientCount =
        recipientType === "everyone"
            ? TOTAL_SUBSCRIBERS
            : recipientType === "selected"
                ? selectedIds.size
                : newCount;

    const descriptions = {
        everyone: `All ${TOTAL_SUBSCRIBERS.toLocaleString()} subscribers`,
        selected:
            selectedIds.size > 0 ? `${selectedIds.size} selected` : "Choose specific subscribers",
        new: "Joined in the last 7 days",
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const toggleOne = (id) =>
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });

    const toggleAll = () =>
        setSelectedIds(allSelected ? new Set() : new Set(SUBSCRIBERS.map((s) => s.id)));

    const resetComposer = () => {
        setForm(INITIAL_FORM);
        setContentHtml("");
        setBanner(null);
        setErrors({});
        setEditorKey((k) => k + 1);
    };

    const validate = () => {
        const next = {};
        if (!form.subject.trim()) next.subject = "Subject is required.";
        if (!contentHtml.replace(/<[^>]*>/g, "").trim()) next.content = "Content is required.";
        if (form.ctaUrl.trim() && !isValidUrl(form.ctaUrl.trim()))
            next.ctaUrl = "Enter a valid URL (https://...).";
        if (recipientType === "selected" && selectedIds.size === 0)
            next.recipients = "Select at least one subscriber from the table.";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSend = async () => {
        if (!validate()) return;
        setSending(true);

        // TODO: call your API here. Example payload:
        const payload = new FormData();
        payload.append("subject", form.subject.trim());
        payload.append("title", form.title.trim());
        payload.append("content", contentHtml);
        payload.append("ctaText", form.ctaText.trim());
        payload.append("ctaUrl", form.ctaUrl.trim());
        payload.append("recipientType", recipientType);
        if (recipientType === "selected")
            payload.append("subscriberIds", JSON.stringify([...selectedIds]));
        if (banner) payload.append("banner", banner);

        await new Promise((r) => setTimeout(r, 900)); // fake network delay

        setSending(false);
        resetComposer();
        setSelectedIds(new Set());
        setToast(`Campaign sent to ${recipientCount.toLocaleString()} subscribers.`);
        setTimeout(() => setToast(""), 3500);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FC] p-6 font-sans text-slate-800 lg:p-8">
            <h1 className="text-2xl font-semibold text-slate-900">Newsletter</h1>
            <p className="mb-5 mt-1 text-[11px] text-gray-500">
                Manage newsletter subscribers and email campaigns.
            </p>

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
                {/* ======================= Left: Subscribers table ======================= */}
                <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                    <div className="max-h-[680px] overflow-y-auto">
                        <table className="w-full text-left text-[11px]">
                            <thead className="sticky top-0 z-10 bg-[#F6F9FD] text-slate-700">
                                <tr>
                                    {selectionMode && (
                                        <th className="w-10 px-4 py-3.5">
                                            <input
                                                type="checkbox"
                                                checked={allSelected}
                                                onChange={toggleAll}
                                                aria-label="Select all subscribers"
                                                className="h-3.5 w-3.5 accent-indigo-600"
                                            />
                                        </th>
                                    )}
                                    <th className="px-5 py-3.5 font-medium">Email</th>
                                    <th className="px-5 py-3.5 font-medium">Subscribed Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {SUBSCRIBERS.map((sub) => {
                                    const checked = selectedIds.has(sub.id);
                                    const isNew = isNewSubscriber(sub.subscribedAt);
                                    const highlight = recipientType === "new" && isNew;
                                    return (
                                        <tr
                                            key={sub.id}
                                            onClick={selectionMode ? () => toggleOne(sub.id) : undefined}
                                            className={`border-b border-gray-100 last:border-b-0 ${selectionMode ? "cursor-pointer hover:bg-gray-50" : ""
                                                } ${checked || highlight ? "bg-indigo-50/40" : ""}`}
                                        >
                                            {selectionMode && (
                                                <td className="px-4 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={() => toggleOne(sub.id)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        aria-label={`Select ${sub.email}`}
                                                        className="h-3.5 w-3.5 accent-indigo-600"
                                                    />
                                                </td>
                                            )}
                                            <td className="max-w-[150px] break-all px-5 py-4 text-slate-800">
                                                {sub.email}
                                                {isNew && (
                                                    <span className="ml-2 rounded bg-green-100 px-1.5 py-0.5 text-[9px] font-medium text-green-700">
                                                        New
                                                    </span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                                                {formatDate(sub.subscribedAt)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ======================= Right: Composer + Recipients ======================= */}
                <div className="space-y-5">
                    {/* ---------------- Email Composer ---------------- */}
                    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-2.5">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                    <FiMail className="h-3.5 w-3.5" />
                                </span>
                                <h2 className="text-sm font-semibold text-slate-900">Email Composer</h2>
                            </div>
                            <button
                                type="button"
                                onClick={resetComposer}
                                aria-label="Clear composer"
                                title="Clear composer"
                                className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                            >
                                <FiX className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="newsletter-subject">Subject</Label>
                                <input
                                    id="newsletter-subject"
                                    name="subject"
                                    type="text"
                                    value={form.subject}
                                    onChange={handleChange}
                                    placeholder="Enter email subject..."
                                    className={inputClass}
                                />
                                <FieldError message={errors.subject} />
                            </div>

                            <div>
                                <Label htmlFor="newsletter-title">Email Title</Label>
                                <input
                                    id="newsletter-title"
                                    name="title"
                                    type="text"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Headline shown inside the email..."
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <Label htmlFor="newsletter-content">Content</Label>
                                <RichTextEditor
                                    key={editorKey}
                                    onChange={(html) => {
                                        setContentHtml(html);
                                        setErrors((prev) => ({ ...prev, content: undefined }));
                                    }}
                                />
                                <FieldError message={errors.content} />
                            </div>

                            <div>
                                <Label htmlFor="newsletter-banner">Banner Image</Label>
                                <BannerUpload file={banner} onChange={setBanner} />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="newsletter-cta-text">CTA Button Text</Label>
                                    <input
                                        id="newsletter-cta-text"
                                        name="ctaText"
                                        type="text"
                                        value={form.ctaText}
                                        onChange={handleChange}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="newsletter-cta-url">CTA Button URL</Label>
                                    <input
                                        id="newsletter-cta-url"
                                        name="ctaUrl"
                                        type="url"
                                        value={form.ctaUrl}
                                        onChange={handleChange}
                                        placeholder="https://yoursite.com/post"
                                        className={inputClass}
                                    />
                                    <FieldError message={errors.ctaUrl} />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ---------------- Recipients ---------------- */}
                    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <h2 className="text-sm font-semibold text-slate-900">Recipients</h2>
                        <p className="mb-4 mt-1 text-[11px] text-gray-500">Choose who receives this campaign.</p>

                        <div role="radiogroup" aria-label="Recipients" className="space-y-2.5">
                            {RECIPIENT_OPTIONS.map((option) => (
                                <RecipientOption
                                    key={option.value}
                                    option={option}
                                    description={descriptions[option.value]}
                                    checked={recipientType === option.value}
                                    onSelect={() => {
                                        setRecipientType(option.value);
                                        setErrors((prev) => ({ ...prev, recipients: undefined }));
                                    }}
                                />
                            ))}
                        </div>
                        <FieldError message={errors.recipients} />

                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={sending}
                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 py-3 text-xs font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <FiSend className="h-3.5 w-3.5" />
                            {sending
                                ? "Sending..."
                                : `Send Campaign${recipientCount ? ` (${recipientCount.toLocaleString()})` : ""}`}
                        </button>
                    </section>
                </div>
            </div>

            {toast && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-xs text-white shadow-lg">
                    <FiCheck className="h-4 w-4 text-green-400" />
                    {toast}
                </div>
            )}
        </div>
    );
};

export default Newsletter;