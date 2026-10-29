import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiCheck,
  FiDownload,
  FiGlobe,
  FiInfo,
  FiMail,
  FiMapPin,
  FiPhone,
  FiShoppingBag,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */
const PINK = "#FDE8E9";
const INDIGO = "#4048CD";

const PAGES = ["Home", "About", "Gallery", "Blog", "Contact"];

const PLANS = [
  { days: 7, price: 35, popular: false },
  { days: 14, price: 60, popular: true },
  { days: 30, price: 100, popular: false },
];

const TAX_RATE = 0; // e.g. 0.05 hole 5% tax add hobe

const COMPANY = {
  name: "My12Photos",
  address: "1234 Business Avenue, Suite 100,\nSan Francisco, CA 94102",
  email: "my12photos@gmail.com",
  phone: "+1 (555) 123-4567",
};

const fmtDate = (d) =>
  d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};

const money = (n) =>
  `$${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/* ------------------------------------------------------------------ */
/* Reusable Modal (blur backdrop, mobile e niche theke ashe)           */
/* ------------------------------------------------------------------ */
function Modal({ open, onClose, children, maxWidth = "max-w-md" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* blur backdrop */}
      <div
        className="modal-fade absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* panel */}
      <div
        className={`modal-panel relative max-h-[92vh] w-full ${maxWidth} overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-2xl`}
      >
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small field helpers                                                 */
/* ------------------------------------------------------------------ */
const inputCls =
  "w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#4048CD] focus:ring-2 focus:ring-[#4048CD]/20";
const softInputCls =
  "w-full rounded-md border border-transparent bg-gray-100 px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#4048CD] focus:bg-white focus:ring-2 focus:ring-[#4048CD]/20";

function Label({ children, required, hint }) {
  return (
    <label className="mb-1.5 block text-xs font-semibold text-gray-700">
      {children}
      {required && <span className="text-red-500"> *</span>}
      {hint && <span className="ml-1 font-normal text-gray-400">{hint}</span>}
    </label>
  );
}

function ErrorText({ children }) {
  if (!children) return null;
  return <p className="mt-1 text-xs text-red-500">{children}</p>;
}

/* ------------------------------------------------------------------ */
/* Main Page                                                           */
/* ------------------------------------------------------------------ */
export default function AdvertisePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessType: "local", // local | online
    businessName: "",
    page: "",
    website: "",
    description: "",
    location: "",
  });
  const [image, setImage] = useState(null); // { file, url }
  const [dragging, setDragging] = useState(false);
  const [planDays, setPlanDays] = useState(14);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceMeta, setInvoiceMeta] = useState(null);
  const fileRef = useRef(null);

  // plan cards er date (aj theke porer din start)
  const startDate = useMemo(() => addDays(new Date(), 1), []);
  const plans = useMemo(
    () =>
      PLANS.map((p) => ({
        ...p,
        start: fmtDate(startDate),
        end: fmtDate(addDays(startDate, p.days)),
      })),
    [startDate]
  );
  const selectedPlan = plans.find((p) => p.days === planDays);

  const set = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  /* ---------------- image upload ---------------- */
  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (image?.url) URL.revokeObjectURL(image.url);
    setImage({ file, url: URL.createObjectURL(file) });
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  /* ---------------- submit ---------------- */
  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = "Valid email is required";
    if (!form.businessName.trim()) er.businessName = "Business name is required";
    if (!form.page) er.page = "Please select a page";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const handlePay = (e) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // TODO: ekhane payment gateway / API call korben (Stripe, SSLCommerz etc.)
    // Payment successful hole nicher code cholbe:
    const now = new Date();
    setInvoiceMeta({
      number: `INV-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        "0"
      )}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: now,
      due: addDays(now, 30),
    });
    setShowSuccess(true);
  };

  const subtotal = selectedPlan.price;
  const tax = subtotal * TAX_RATE;
  const grandTotal = subtotal + tax;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* print style + animations */}
      <style>{`
        @keyframes modalFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
        @keyframes popIn { from { opacity: 0; transform: scale(.95) } to { opacity: 1; transform: scale(1) } }
        .modal-fade { animation: modalFade .2s ease-out both; }
        .modal-panel { animation: slideUp .3s cubic-bezier(.2,.8,.2,1) both; }
        @media (min-width: 640px) { .modal-panel { animation: popIn .2s ease-out both; } }
        @media print {
          body * { visibility: hidden !important; }
          #invoice-print, #invoice-print * { visibility: visible !important; }
          #invoice-print { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* ================= HERO ================= */}
      <section
        className="relative px-4 pb-16 border pt-10 text-center  sm:pt-14"
        style={{
          background: `linear-gradient(90deg, ${PINK} 0%, #ffffff 50%, ${INDIGO}26 100%)`,
        }}
      >
        <span className="inline-block rounded-full border border-red-400 bg-white/70 px-3 py-1 text-[10px] font-medium text-red-600 sm:text-xs">
          Official Lumina Advertising Network
        </span>

        <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl md:text-5xl">
          <span className="text-red-600">Promote</span> Your Business to Our
          Photography <span style={{ color: INDIGO }}>Community</span>
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-xs leading-relaxed text-gray-500 sm:text-sm">
          Reach photographers, artists, and photography enthusiasts by
          displaying your business on our platform. High-intent audience,
          verified placements, and instant transparent analytics.
        </p>

        {/* bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* ================= FORM CARD ================= */}
      <main className="mx-auto mt-4 w-full max-w-main px-3  sm:px-4">
        <form
          onSubmit={handlePay}
          noValidate
          className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          {/* card header */}
          <div className="px-5 py-5 sm:px-7" style={{ background: PINK }}>
            <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
              Tell Us About Your Business
            </h2>
            <p className="mt-1 text-xs text-gray-600">
              This information will be associated with your advertiser account,
              commercial invoices, and campaign billing.
            </p>
          </div>

          <div className="space-y-5 px-5 py-6 sm:px-7">
            {/* Name */}
            <div>
              <Label>Name</Label>
              <input
                type="text"
                placeholder="Enter your full name..."
                value={form.name}
                onChange={set("name")}
                className={inputCls}
              />
              <ErrorText>{errors.name}</ErrorText>
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label>Email</Label>
                <input
                  type="email"
                  placeholder="Enter your email..."
                  value={form.email}
                  onChange={set("email")}
                  className={inputCls}
                />
                <ErrorText>{errors.email}</ErrorText>
              </div>
              <div>
                <Label>Phone</Label>
                <input
                  type="tel"
                  placeholder="Enter your phone number..."
                  value={form.phone}
                  onChange={set("phone")}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Business type toggle */}
            <div className="grid grid-cols-2 rounded-full border border-gray-200 bg-gray-100 p-0.5 text-xs font-medium">
              {[
                { key: "local", label: "Local Business", icon: FiShoppingBag },
                { key: "online", label: "Online Business", icon: FiGlobe },
              ].map(({ key, label, icon: Icon }) => {
                const active = form.businessType === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, businessType: key }))}
                    className={`flex items-center justify-center gap-1.5 rounded-full px-3 py-2 transition ${
                      active
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon className={active ? "text-[#4048CD]" : ""} />
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Business name */}
            <div>
              <Label required>Business Name</Label>
              <input
                type="text"
                placeholder="Your Business Name"
                value={form.businessName}
                onChange={set("businessName")}
                className={softInputCls}
              />
              <ErrorText>{errors.businessName}</ErrorText>
            </div>

            {/* Select page */}
            <div>
              <Label required>Select Page</Label>
              <select
                value={form.page}
                onChange={set("page")}
                className={`${softInputCls} cursor-pointer`}
              >
                <option value="">Home</option>
                {PAGES.slice(1).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <ErrorText>{errors.page}</ErrorText>
            </div>

            {/* Website */}
            <div>
              <Label>Website URL</Label>
              <input
                type="url"
                placeholder="https://yourbusiness.com"
                value={form.website}
                onChange={set("website")}
                className={softInputCls}
              />
            </div>

            {/* Description */}
            <div>
              <Label hint={`(${form.description.length}/200)`}>
                Description
              </Label>
              <textarea
                rows={3}
                maxLength={200}
                placeholder="Tell us about your business..."
                value={form.description}
                onChange={set("description")}
                className={`${softInputCls} resize-none`}
              />
            </div>

            {/* Location */}
            <div>
              <Label>Location</Label>
              <div className="relative">
                <FiMapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="123 Main St, City, State"
                  value={form.location}
                  onChange={set("location")}
                  className={`${softInputCls} pl-9`}
                />
              </div>
            </div>

            {/* Business image */}
            <div>
              <Label>Business Image</Label>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={`relative flex h-36 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md border border-dashed text-center transition sm:h-40 ${
                  dragging
                    ? "border-[#4048CD] bg-[#4048CD]/5"
                    : "border-gray-300 bg-white hover:bg-gray-50"
                }`}
              >
                {image ? (
                  <>
                    <img
                      src={image.url}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        URL.revokeObjectURL(image.url);
                        setImage(null);
                        if (fileRef.current) fileRef.current.value = "";
                      }}
                      className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
                      aria-label="Remove image"
                    >
                      <FiX />
                    </button>
                  </>
                ) : (
                  <>
                    <FiUploadCloud className="mb-2 text-2xl text-gray-500" />
                    <p className="px-3 text-[11px] text-gray-600">
                      Click to upload or drag and drop
                    </p>
                  </>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <h3 className="text-xs font-semibold text-gray-800">
                Select Advertisement Duration
              </h3>
              <p className="mb-3 mt-0.5 text-[10px] text-gray-500">
                Choose how long your advertisement will run. Payment is required
                to submit for review.
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {plans.map((p) => {
                  const active = p.days === planDays;
                  return (
                    <button
                      key={p.days}
                      type="button"
                      onClick={() => setPlanDays(p.days)}
                      className={`relative flex flex-col items-center rounded-lg border px-3 pb-4 pt-6 text-center transition ${
                        active
                          ? "border-[#4048CD] bg-[#4048CD]/10 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      {p.popular && (
                        <span
                          className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white"
                          style={{ background: INDIGO }}
                        >
                          Most Popular
                        </span>
                      )}
                      <span className="text-xl font-semibold text-gray-900">
                        {p.days}
                      </span>
                      <span className="text-[10px] text-gray-500">days</span>
                      <span
                        className="mt-2 text-2xl font-bold"
                        style={{ color: active ? INDIGO : "#111827" }}
                      >
                        ${p.price}
                      </span>
                      <span
                        className="mt-2 text-[9px]"
                        style={{ color: active ? INDIGO : "#9ca3af" }}
                      >
                        {p.start}
                      </span>
                      <span
                        className="text-[9px]"
                        style={{ color: active ? INDIGO : "#9ca3af" }}
                      >
                        {p.end}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pay button */}
            <button
              type="submit"
              className="w-full rounded-md px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-[.99] sm:w-auto"
              style={{ background: INDIGO }}
            >
              Pay Now
            </button>
          </div>
        </form>
      </main>

      {/* ================= PAYMENT SUCCESS MODAL ================= */}
      <Modal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        maxWidth="max-w-sm"
      >
        <div className="px-6 pb-6 pt-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#4048CD]/10">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-white"
              style={{ background: INDIGO }}
            >
              <FiCheck />
            </span>
          </div>

          <h3 className="mt-4 text-xl font-bold text-gray-900">
            Payment Successful!
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Your advertisement has been submitted successfully.
          </p>

          <div className="mt-4 flex items-start gap-2 rounded-md border border-gray-200 bg-gray-50 p-3 text-left text-[11px] leading-relaxed text-gray-600">
            <FiInfo className="mt-0.5 shrink-0" />
            <p>
              Please allow us up to <b>48 hours</b> to review and verify your
              advertisement. We'll make sure the content is authentic and does
              not contain anything illegal or violate applicable laws.
            </p>
          </div>

          <p className="mt-4 text-[11px] text-gray-500">
            Your advertisement will be published once it has been approved.
          </p>
          <p className="mt-3 text-[11px] text-gray-500">
            Thank you for your patience.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowSuccess(false)}
              className="rounded-md py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: INDIGO }}
            >
              Got it
            </button>
            <button
              onClick={() => {
                setShowSuccess(false);
                setShowInvoice(true);
              }}
              className="rounded-md bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Get Invoice
            </button>
          </div>
        </div>
      </Modal>

      {/* ================= INVOICE MODAL ================= */}
      <Modal
        open={showInvoice}
        onClose={() => setShowInvoice(false)}
        maxWidth="max-w-2xl"
      >
        <div className="bg-gray-50 p-3 sm:p-5">
          {/* top actions */}
          <div className="no-print mb-3 flex items-center justify-between sm:justify-end sm:gap-3">
            <button
              onClick={() => setShowInvoice(false)}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-200 sm:order-2"
              aria-label="Close"
            >
              <FiX />
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 sm:order-1"
            >
              <FiDownload /> Download Invoice
            </button>
          </div>

          {/* invoice paper */}
          <div
            id="invoice-print"
            className="overflow-hidden rounded-lg bg-white shadow-sm"
          >
            {/* header */}
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:justify-between sm:p-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-sm font-extrabold text-white ring-2 ring-blue-700">
                    12
                  </span>
                  <span className="text-xl font-extrabold italic text-gray-900">
                    {COMPANY.name}
                  </span>
                </div>
                <div className="mt-3 space-y-1.5 text-xs text-gray-600">
                  <p className="flex items-start gap-2">
                    <FiMapPin className="mt-0.5 shrink-0" />
                    <span className="whitespace-pre-line">
                      {COMPANY.address}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FiMail className="shrink-0" /> {COMPANY.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <FiPhone className="shrink-0" /> {COMPANY.phone}
                  </p>
                </div>
              </div>

              <div className="sm:text-right">
                <h2
                  className="text-3xl font-light tracking-wide"
                  style={{ color: INDIGO }}
                >
                  INVOICE
                </h2>
                <div className="mt-2 space-y-1 text-xs">
                  <p className="text-gray-500">Invoice Number:</p>
                  <p className="font-semibold text-gray-800">
                    {invoiceMeta?.number}
                  </p>
                  <p className="text-gray-500">Invoice Date:</p>
                  <p className="font-semibold text-gray-800">
                    {invoiceMeta && fmtDate(invoiceMeta.date)}
                  </p>
                  <p className="text-gray-500">Due Date:</p>
                  <p className="font-semibold text-gray-800">
                    {invoiceMeta && fmtDate(invoiceMeta.due)}
                  </p>
                </div>
              </div>
            </div>

            {/* customer + order */}
            <div className="grid grid-cols-1 gap-6 bg-gray-50 p-4 sm:grid-cols-2 sm:p-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  Customer Details
                </h4>
                <p className="mt-2 text-sm font-medium text-gray-800">
                  {form.name || "—"}
                </p>
                <div className="mt-2 space-y-1.5 text-xs text-gray-600">
                  <p className="flex items-center gap-2 break-all">
                    <FiMail className="shrink-0" /> {form.email || "—"}
                  </p>
                  <p className="flex items-center gap-2">
                    <FiPhone className="shrink-0" /> {form.phone || "—"}
                  </p>
                </div>
              </div>

              <div>
                <h4
                  className="text-sm font-semibold"
                  style={{ color: INDIGO }}
                >
                  Order Details
                </h4>
                <dl className="mt-2 space-y-1.5 text-xs">
                  {[
                    [
                      "Business Type:",
                      form.businessType === "local" ? "Offline" : "Online",
                    ],
                    ["Business Name:", form.businessName || "—"],
                    ["Select Page:", form.page || "Home"],
                    ["Ads Start Date:", selectedPlan.start],
                    ["Ads End Date:", selectedPlan.end],
                    ["Total Days:", `${selectedPlan.days} Days`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3">
                      <dt className="text-gray-500">{k}</dt>
                      <dd className="text-right font-medium text-gray-800">
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* totals */}
            <div className="p-4 sm:p-6">
              <div className="ml-auto w-full max-w-xs space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-medium text-gray-800">
                    {money(subtotal)}
                  </span>
                </div>
                {TAX_RATE > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tax ({(TAX_RATE * 100).toFixed(0)}%):</span>
                    <span className="font-medium text-gray-800">
                      {money(tax)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                  <span className="font-semibold text-gray-800">
                    Grand Total:
                  </span>
                  <span className="text-xl font-bold text-amber-500">
                    {money(grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}