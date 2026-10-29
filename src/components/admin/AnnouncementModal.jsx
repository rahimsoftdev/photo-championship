import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiX, FiCheck, FiPlus } from "react-icons/fi";

const emojiOptions = [
  "🎉",
  "🏆",
  "🚩",
  "📸",
  "🔥",
  "🔒",
  "🌟",
  "📢",
  "🎁",
  "✨",
  "📷",
  "🚀",
];

const announcementTypes = [
  "General",
  "Winner Announcement",
  "Competition",
  "Promotion",
  "Important Notice",
];

const initialForm = {
  message: "",
  icon: "🎉",
  type: "General",
  linkType: "No Link",
  link: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  noEndDate: false,
  status: "Active",
  priority: "Medium",
};

const statusStyles = {
  Active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Scheduled: "border-blue-200 bg-blue-50 text-blue-600",
  Expired: "border-slate-200 bg-slate-50 text-slate-500",
  Inactive: "border-amber-200 bg-amber-50 text-amber-700",
};

function formatDate(date, time) {
  if (!date) return "—";

  const d = new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return time ? `${d}, ${time}` : d;
}

export default function AnnouncementModal({ onClose, onCreate }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null); // holds the created announcement
  const errorRef = useRef(null);

  // Lock background scroll while modal is open
  useEffect(() => {
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Bring the error into view when it appears
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [error]);

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const message = form.message.trim();

    if (!message) {
      setError("Please enter an announcement message.");
      return;
    }

    if (message.length > 120) {
      setError("Announcement message must be 120 characters or less.");
      return;
    }

    if (!form.startDate) {
      setError("Please select a start date.");
      return;
    }

    if (
      form.linkType === "Custom URL" &&
      !/^https?:\/\/.+/i.test(form.link.trim())
    ) {
      setError("Please enter a valid URL starting with http:// or https://.");
      return;
    }

    if (!form.noEndDate && form.endDate && form.endDate < form.startDate) {
      setError("End date cannot be before the start date.");
      return;
    }

    if (
      !form.noEndDate &&
      form.endDate &&
      form.endDate === form.startDate &&
      form.startTime &&
      form.endTime &&
      form.endTime < form.startTime
    ) {
      setError("End time cannot be before the start time.");
      return;
    }

    const now = new Date();
    const start = new Date(`${form.startDate}T${form.startTime || "00:00"}`);

    const end = form.endDate
      ? new Date(`${form.endDate}T${form.endTime || "23:59"}`)
      : null;

    let status = form.status;

    if (status === "Active" && start > now) {
      status = "Scheduled";
    } else if (status === "Active" && end && end < now) {
      status = "Expired";
    }

    const newAnnouncement = {
      id: `ANN-${Date.now().toString().slice(-6)}`,
      message: `${form.icon} ${message}`,
      type: form.type,
      startDate: form.startDate,
      startTime: form.startTime,
      endDate: form.noEndDate ? "" : form.endDate,
      endTime: form.endTime,
      noEndDate: form.noEndDate,
      priority: form.priority,
      status,
      icon: form.icon,
      linkType: form.linkType,
      link: form.linkType === "Custom URL" ? form.link.trim() : "",
    };

    onCreate(newAnnouncement);
    setCreated(newAnnouncement); // switch the modal to the success view
  }

  function handleCreateAnother() {
    setForm(initialForm);
    setError("");
    setCreated(null);
  }

  // text-base on mobile prevents iOS auto-zoom, sm:text-sm on larger screens
  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:text-sm";

  const labelClass = "block text-xs font-medium text-slate-700 sm:text-sm";
  const subLabelClass = "text-[11px] text-slate-500 sm:text-xs";
  const helpClass = "mt-1 text-[11px] text-slate-400 sm:text-xs";

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 backdrop-blur-sm sm:items-center sm:p-4"
      style={{ animation: "ann-fade .2s ease-out" }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <style>{`
        @keyframes ann-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes ann-sheet { from { transform: translateY(100%) } to { transform: translateY(0) } }
        @keyframes ann-pop { from { opacity: 0; transform: translateY(12px) scale(.97) } to { opacity: 1; transform: none } }
        @keyframes ann-check { 0% { transform: scale(0); opacity: 0 } 60% { transform: scale(1.15); opacity: 1 } 100% { transform: scale(1) } }
        .ann-panel { animation: ann-sheet .28s cubic-bezier(.2,.8,.2,1); }
        .ann-check { animation: ann-check .45s cubic-bezier(.2,.8,.2,1) .1s both; }
        @media (min-width: 640px) { .ann-panel { animation: ann-pop .2s ease-out; } }
        @media (prefers-reduced-motion: reduce) { .ann-panel, .ann-check { animation: none; } }
      `}</style>

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="announcement-modal-title"
        className="ann-panel flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:max-h-[90dvh] sm:max-w-lg sm:rounded-2xl lg:max-w-xl"
      >
        {/* Drag handle (mobile only) */}
        <div className="flex justify-center pt-2 sm:hidden">
          <span className="h-1 w-10 rounded-full bg-slate-300" />
        </div>

        {created ? (
          /* ───────────── SUCCESS VIEW ───────────── */
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex justify-end px-3 pt-2 sm:px-4 sm:pt-3">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <FiX size={18} />
              </button>
            </div>

            <div
              role="status"
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4 text-center sm:px-6"
            >
              <div className="ann-check mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 sm:h-20 sm:w-20">
                <FiCheck size={34} strokeWidth={3} />
              </div>

              <h2
                id="announcement-modal-title"
                className="mt-4 text-lg font-semibold text-slate-900 sm:text-xl"
              >
                Announcement Created Successfully!
              </h2>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Your announcement has been saved and added to the list.
              </p>

              {/* Summary */}
              <dl className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-slate-50/60 text-left">
                <div className="px-3 py-2.5 sm:px-4">
                  <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Message
                  </dt>
                  <dd className="mt-0.5 break-words text-sm font-medium text-slate-800">
                    {created.message}
                  </dd>
                </div>

                <div className="grid grid-cols-2 gap-3 px-3 py-2.5 sm:px-4">
                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Type
                    </dt>
                    <dd className="mt-0.5 break-words text-sm text-slate-700">
                      {created.type}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Status
                    </dt>
                    <dd className="mt-0.5">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium ${
                          statusStyles[created.status] || statusStyles.Inactive
                        }`}
                      >
                        {created.status}
                      </span>
                    </dd>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 px-3 py-2.5 min-[420px]:grid-cols-2 sm:px-4">
                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Starts
                    </dt>
                    <dd className="mt-0.5 text-sm text-slate-700">
                      {formatDate(created.startDate, created.startTime)}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Ends
                    </dt>
                    <dd className="mt-0.5 text-sm text-slate-700">
                      {created.endDate
                        ? formatDate(created.endDate, created.endTime)
                        : "Until manually disabled"}
                    </dd>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 px-3 py-2.5 sm:px-4">
                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Priority
                    </dt>
                    <dd className="mt-0.5 text-sm text-slate-700">
                      {created.priority}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      ID
                    </dt>
                    <dd className="mt-0.5 text-sm text-slate-700">
                      {created.id}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            <footer
              className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-white px-4 pt-3 sm:flex-row sm:justify-end sm:px-6 sm:py-4"
              style={{
                paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
              }}
            >
              <button
                type="button"
                onClick={handleCreateAnother}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 sm:w-auto sm:py-2.5"
              >
                <FiPlus size={15} />
                Create Another
              </button>

              <button
                type="button"
                onClick={onClose}
                autoFocus
                className="w-full rounded-lg bg-red-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 sm:w-auto sm:py-2.5"
              >
                Done
              </button>
            </footer>
          </div>
        ) : (
          /* ───────────── FORM VIEW ───────────── */
          <>
            <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 pb-3 pt-3 sm:px-6 sm:py-4">
              <div className="min-w-0">
                <h2
                  id="announcement-modal-title"
                  className="text-base font-semibold text-slate-900 sm:text-lg"
                >
                  Create Announcement
                </h2>

                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                  Create a short announcement that will appear above the website
                  navigation.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <FiX size={18} />
              </button>
            </header>

            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">
                {/* Announcement message */}
                <div>
                  <label className={labelClass} htmlFor="announcement-message">
                    Announcement Message <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    id="announcement-message"
                    name="message"
                    value={form.message}
                    onChange={updateField}
                    placeholder="Enter announcement message..."
                    maxLength={120}
                    rows={2}
                    required
                    className={`${inputClass} resize-none`}
                  />

                  <p className={helpClass}>{form.message.length} / 120</p>
                </div>

                {/* Emoji picker */}
                <div>
                  <p className={labelClass}>
                    Icon / Emoji{" "}
                    <span className="font-normal text-slate-400">
                      (optional)
                    </span>
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                    {emojiOptions.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        title={`Select ${emoji}`}
                        aria-pressed={form.icon === emoji}
                        onClick={() =>
                          setForm((previous) => ({ ...previous, icon: emoji }))
                        }
                        className={`flex h-10 w-10 items-center justify-center rounded-lg border text-lg transition sm:h-9 sm:w-9 ${
                          form.icon === emoji
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type + Priority */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="announcement-type">
                      Type
                    </label>

                    <select
                      id="announcement-type"
                      name="type"
                      value={form.type}
                      onChange={updateField}
                      className={inputClass}
                    >
                      {announcementTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className={labelClass}
                      htmlFor="announcement-priority"
                    >
                      Display Priority
                    </label>

                    <select
                      id="announcement-priority"
                      name="priority"
                      value={form.priority}
                      onChange={updateField}
                      className={inputClass}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <p className={`${helpClass} sm:col-span-2 sm:-mt-2`}>
                    Higher priority announcements appear first in the scrolling
                    bar.
                  </p>
                </div>

                {/* Link */}
                <div>
                  <label
                    className={labelClass}
                    htmlFor="announcement-link-type"
                  >
                    Link
                  </label>

                  <select
                    id="announcement-link-type"
                    name="linkType"
                    value={form.linkType}
                    onChange={updateField}
                    className={inputClass}
                  >
                    <option>No Link</option>
                    <option>Custom URL</option>
                  </select>

                  {form.linkType === "Custom URL" && (
                    <input
                      type="url"
                      name="link"
                      value={form.link}
                      onChange={updateField}
                      placeholder="https://example.com"
                      aria-label="Custom URL"
                      className={inputClass}
                    />
                  )}
                </div>

                {/* Display schedule */}
                <fieldset>
                  <legend className={labelClass}>Display Schedule</legend>

                  <div className="mt-2 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                    <div className="min-w-0">
                      <label htmlFor="start-date" className={subLabelClass}>
                        Start Date <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="start-date"
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={updateField}
                        required
                        className={inputClass}
                      />
                    </div>

                    <div className="min-w-0">
                      <label htmlFor="start-time" className={subLabelClass}>
                        Start Time
                      </label>

                      <input
                        id="start-time"
                        type="time"
                        name="startTime"
                        value={form.startTime}
                        onChange={updateField}
                        className={inputClass}
                      />
                    </div>

                    <div className="min-w-0">
                      <label htmlFor="end-date" className={subLabelClass}>
                        End Date
                      </label>

                      <input
                        id="end-date"
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={updateField}
                        disabled={form.noEndDate}
                        min={form.startDate || undefined}
                        className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-100`}
                      />
                    </div>

                    <div className="min-w-0">
                      <label htmlFor="end-time" className={subLabelClass}>
                        End Time
                      </label>

                      <input
                        id="end-time"
                        type="time"
                        name="endTime"
                        value={form.endTime}
                        onChange={updateField}
                        disabled={form.noEndDate}
                        className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-100`}
                      />
                    </div>
                  </div>

                  <label className="mt-3 flex cursor-pointer items-start gap-2.5 text-xs text-slate-600 sm:text-sm">
                    <input
                      type="checkbox"
                      name="noEndDate"
                      checked={form.noEndDate}
                      onChange={updateField}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
                    />
                    <span>No End Date — runs until manually deactivated</span>
                  </label>
                </fieldset>

                {/* Status */}
                <fieldset>
                  <legend className={labelClass}>Status</legend>

                  <div className="mt-2 flex items-center gap-5">
                    {["Active", "Inactive"].map((status) => (
                      <label
                        key={status}
                        className="flex cursor-pointer items-center gap-2 py-1 text-sm text-slate-600"
                      >
                        <input
                          type="radio"
                          name="status"
                          value={status}
                          checked={form.status === status}
                          onChange={updateField}
                          className="h-4 w-4 accent-blue-600"
                        />
                        {status}
                      </label>
                    ))}
                  </div>

                  <p className={helpClass}>
                    Active announcements can appear when their schedule is
                    valid.
                  </p>
                </fieldset>

                {/* Error */}
                {error && (
                  <p
                    ref={errorRef}
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-600 sm:text-sm"
                  >
                    {error}
                  </p>
                )}
              </div>

              {/* Footer (always visible) */}
              <footer
                className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-white px-4 pt-3 sm:flex-row sm:justify-end sm:px-6 sm:py-4"
                style={{
                  paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
                }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 sm:w-auto sm:py-2.5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-red-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 sm:w-auto sm:py-2.5"
                >
                  Create Announcement
                </button>
              </footer>
            </form>
          </>
        )}
      </section>
    </div>,
    document.body
  );
}