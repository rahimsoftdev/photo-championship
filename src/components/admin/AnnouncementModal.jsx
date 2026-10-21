import { useState } from "react";
import { FiX } from "react-icons/fi";

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

export default function AnnouncementModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
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
  });

  const [error, setError] = useState("");

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

    if (
      !form.noEndDate &&
      form.endDate &&
      form.endDate < form.startDate
    ) {
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
    const start = new Date(
      `${form.startDate}T${form.startTime || "00:00"}`
    );

    const end = form.endDate
      ? new Date(`${form.endDate}T${form.endTime || "23:59"}`)
      : null;

    let status = form.status;

    if (status === "Active" && start > now) {
      status = "Scheduled";
    } else if (
      status === "Active" &&
      end &&
      end < now
    ) {
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
  }

  const inputClass =
    "mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

  const labelClass = "block text-[11px] font-medium text-slate-700";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-3 backdrop-blur-[2px] sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="announcement-modal-title"
        className="flex max-h-[95vh] w-full max-w-[390px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
      >
        {/* Modal header */}
        <header className="flex items-start justify-between border-b border-slate-100 px-4 py-3.5">
          <div>
            <h2
              id="announcement-modal-title"
              className="text-sm font-semibold text-slate-900"
            >
              Create Announcement
            </h2>

            <p className="mt-0.5 text-[10px] text-slate-500">
              Create a short announcement that will appear above the website
              navigation.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <FiX size={16} />
          </button>
        </header>

        {/* Modal form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto px-4 py-3.5"
        >
          <div className="space-y-3.5">
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

              <p className="mt-1 text-[10px] text-slate-400">
                {form.message.length} / 120
              </p>
            </div>

            {/* Emoji picker */}
            <div>
              <p className={labelClass}>
                Icon / Emoji <span className="font-normal text-slate-400">(optional)</span>
              </p>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    title={`Select ${emoji}`}
                    aria-pressed={form.icon === emoji}
                    onClick={() =>
                      setForm((previous) => ({ ...previous, icon: emoji }))
                    }
                    className={`flex h-7 w-7 items-center justify-center rounded-md border text-sm transition ${
                      form.icon === emoji
                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Type */}
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

            {/* Link */}
            <div>
              <label className={labelClass} htmlFor="announcement-link-type">
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
                  className={inputClass}
                />
              )}
            </div>

            {/* Display schedule */}
            <fieldset>
              <legend className={labelClass}>Display Schedule</legend>

              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <label
                    htmlFor="start-date"
                    className="text-[10px] text-slate-500"
                  >
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

                <div>
                  <label
                    htmlFor="start-time"
                    className="text-[10px] text-slate-500"
                  >
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

                <div>
                  <label
                    htmlFor="end-date"
                    className="text-[10px] text-slate-500"
                  >
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

                <div>
                  <label
                    htmlFor="end-time"
                    className="text-[10px] text-slate-500"
                  >
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

              <label className="mt-2 flex cursor-pointer items-center gap-2 text-[10px] text-slate-600">
                <input
                  type="checkbox"
                  name="noEndDate"
                  checked={form.noEndDate}
                  onChange={updateField}
                  className="accent-blue-600"
                />
                No End Date — runs until manually deactivated
              </label>
            </fieldset>

            {/* Status */}
            <fieldset>
              <legend className={labelClass}>Status</legend>

              <div className="mt-2 flex items-center gap-4">
                {["Active", "Inactive"].map((status) => (
                  <label
                    key={status}
                    className="flex cursor-pointer items-center gap-1.5 text-[11px] text-slate-600"
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={form.status === status}
                      onChange={updateField}
                      className="accent-blue-600"
                    />
                    {status}
                  </label>
                ))}
              </div>

              <p className="mt-1 text-[10px] text-slate-400">
                Active announcements can appear when their schedule is valid.
              </p>
            </fieldset>

            {/* Priority */}
            <div>
              <label className={labelClass} htmlFor="announcement-priority">
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

              <p className="mt-1 text-[10px] text-slate-400">
                Higher priority announcements appear first in the scrolling bar.
              </p>
            </div>

            {/* Error */}
            {error && (
              <p
                role="alert"
                className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600"
              >
                {error}
              </p>
            )}
          </div>

          {/* Modal footer */}
          <footer className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Create Announcement
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}