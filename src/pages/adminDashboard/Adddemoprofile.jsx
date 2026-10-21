import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { FiArrowLeft, FiEye, FiEyeOff, FiTrash2, FiUpload, FiX } from "react-icons/fi";

const LIST_PATH = "/adminDashboard/demo-profile"; // TODO: match your route

const BIO_MAX = 200;
const MAX_SOCIAL_LINKS = 5;
const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const INITIAL_FORM = {
  fullName: "",
  username: "",
  phone: "",
  email: "",
  bio: "",
  password: "",
};

/* ------------------------------- Helpers ------------------------------- */

const isValidUrl = (value) => {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

const inputClass =
  "w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-xs text-slate-800 placeholder-gray-400 outline-none transition focus:border-blue-500";

/* --------------------------- Small components --------------------------- */

const Field = ({ label, htmlFor, required, error, children }) => (
  <div>
    <label htmlFor={htmlFor} className="mb-1.5 block text-[10px] font-semibold text-slate-800">
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-[10px] text-red-500">{error}</p>}
  </div>
);

const ImageUpload = ({ id, label, buttonText, hint, file, onChange }) => {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);
  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl]);

  const pickFile = (f) => {
    if (!f) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(f.type)) {
      setError("Only JPG, PNG or WebP images are allowed.");
      return;
    }
    if (f.size > MAX_IMAGE_SIZE) {
      setError("Image must be 4MB or smaller.");
      return;
    }
    setError("");
    onChange(f);
  };

  return (
    <div>
      <p className="mb-1.5 text-[10px] font-semibold text-slate-800">{label}</p>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          pickFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {file ? (
        <div className="relative h-[92px] overflow-hidden rounded-md border border-gray-200">
          <img src={previewUrl} alt={`${label} preview`} className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label={`Remove ${label}`}
            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
          >
            <FiTrash2 className="h-3 w-3" />
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
          className={`flex h-[92px] w-full flex-col items-center justify-center gap-1 rounded-md border border-dashed transition ${
            dragging ? "border-blue-500 bg-blue-50/50" : "border-gray-300 bg-gray-50/40 hover:bg-gray-50"
          }`}
        >
          <FiUpload className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-[10px] font-medium text-gray-500">{buttonText}</span>
          <span className="text-[9px] text-gray-400">{hint}</span>
        </button>
      )}
      {error && <p className="mt-1 text-[10px] text-red-500">{error}</p>}
    </div>
  );
};

/* ------------------------------- Main page ------------------------------- */

const AddDemoProfile = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [socialLinks, setSocialLinks] = useState([""]);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const updateSocial = (index, value) => {
    setSocialLinks((prev) => prev.map((l, i) => (i === index ? value : l)));
    setErrors((prev) => ({ ...prev, social: undefined }));
  };
  const addSocial = () =>
    setSocialLinks((prev) => (prev.length < MAX_SOCIAL_LINKS ? [...prev, ""] : prev));
  const removeSocial = (index) => setSocialLinks((prev) => prev.filter((_, i) => i !== index));

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";

    if (!form.username.trim()) next.username = "Username is required.";
    else if (!/^[a-zA-Z0-9._]{3,30}$/.test(form.username.trim()))
      next.username = "3-30 characters: letters, numbers, dot or underscore.";

    if (!form.phone.trim()) next.phone = "Phone number is required.";
    else if (!/^[+()\d\s-]{7,20}$/.test(form.phone.trim())) next.phone = "Enter a valid phone number.";

    if (!form.email.trim()) next.email = "Email address is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = "Enter a valid email address.";

    if (!form.password) next.password = "Password is required.";
    else if (form.password.length < 8) next.password = "Password must be at least 8 characters.";

    const filledLinks = socialLinks.map((l) => l.trim()).filter(Boolean);
    if (filledLinks.some((l) => !isValidUrl(l))) next.social = "Enter valid URLs (https://...).";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    // TODO: call your API here. Payload is ready:
    const payload = new FormData();
    payload.append("fullName", form.fullName.trim());
    payload.append("username", form.username.trim());
    payload.append("phone", form.phone.trim());
    payload.append("email", form.email.trim());
    payload.append("bio", form.bio.trim());
    payload.append("password", form.password); // hash it on the server, never store plain text
    payload.append("socialLinks", JSON.stringify(socialLinks.map((l) => l.trim()).filter(Boolean)));
    payload.append("status", isActive ? "Active" : "Inactive");
    if (profilePhoto) payload.append("profilePhoto", profilePhoto);
    if (coverPhoto) payload.append("coverPhoto", coverPhoto);

    await new Promise((r) => setTimeout(r, 800)); // fake network delay

    setSubmitting(false);
    navigate(LIST_PATH);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] p-6 font-sans text-slate-800">
      <button
        type="button"
        onClick={() => navigate(LIST_PATH)}
        className="mb-4 inline-flex items-center gap-1.5 text-[10px] text-gray-600 transition hover:text-slate-900"
      >
        <FiArrowLeft className="h-3 w-3" />
        Back to Selection
      </button>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <h1 className="text-sm font-bold text-slate-900">Add Demo Profile</h1>
        <p className="mb-5 mt-1 text-[10px] text-gray-500">
          Create a new demo profile for the platform.
        </p>

        <div className="space-y-4">
          {/* Name + username */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full Name" htmlFor="dp-fullName" required error={errors.fullName}>
              <input
                id="dp-fullName"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                className={inputClass}
              />
            </Field>
            <Field label="Username" htmlFor="dp-username" required error={errors.username}>
              <input
                id="dp-username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter username"
                className={inputClass}
              />
            </Field>
          </div>

          {/* Phone + email */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Phone Number" htmlFor="dp-phone" required error={errors.phone}>
              <input
                id="dp-phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={inputClass}
              />
            </Field>
            <Field label="Email Address" htmlFor="dp-email" required error={errors.email}>
              <input
                id="dp-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className={inputClass}
              />
            </Field>
          </div>

          {/* Short bio */}
          <Field label="Short Bio" htmlFor="dp-bio">
            <textarea
              id="dp-bio"
              name="bio"
              rows={3}
              maxLength={BIO_MAX}
              value={form.bio}
              onChange={handleChange}
              placeholder="Write a short introduction about this photographer..."
              className={`${inputClass} resize-none`}
            />
            <p className="mt-1 text-[9px] text-gray-400">
              {form.bio.length} / {BIO_MAX}
            </p>
          </Field>

          {/* Social media links */}
          <div>
            <p className="mb-1.5 text-[10px] font-semibold text-slate-800">Social Media Link</p>
            <div className="space-y-2">
              {socialLinks.map((link, i) => (
                <div key={i} className="flex items-center gap-2 sm:max-w-[50%]">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => updateSocial(i, e.target.value)}
                    placeholder="https://instagram.com/username"
                    aria-label={`Social media link ${i + 1}`}
                    className={inputClass}
                  />
                  {socialLinks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSocial(i)}
                      aria-label="Remove link"
                      className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                    >
                      <FiX className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.social && <p className="mt-1 text-[10px] text-red-500">{errors.social}</p>}
            {socialLinks.length < MAX_SOCIAL_LINKS && (
              <button
                type="button"
                onClick={addSocial}
                className="mt-2 text-[10px] font-medium text-red-500 hover:underline"
              >
                Add Another
              </button>
            )}
          </div>

          {/* Photos */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ImageUpload
              id="dp-profile-photo"
              label="Profile Photo"
              buttonText="Upload Profile Photo"
              hint="JPG, PNG or WebP • 800×800px"
              file={profilePhoto}
              onChange={setProfilePhoto}
            />
            <ImageUpload
              id="dp-cover-photo"
              label="Cover Photo"
              buttonText="Upload Cover Photo"
              hint="JPG, PNG or WebP • 1600×500px"
              file={coverPhoto}
              onChange={setCoverPhoto}
            />
          </div>

          {/* Password */}
          <Field label="Password" htmlFor="dp-password" required error={errors.password}>
            <div className="relative">
              <input
                id="dp-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Write a password"
                autoComplete="new-password"
                className={`${inputClass} pr-9`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff className="h-3.5 w-3.5" /> : <FiEye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </Field>

          {/* Profile status */}
          <div className="flex items-start justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50/60 px-4 py-3">
            <div>
              <p className="text-[10px] font-semibold text-slate-800">Profile Status</p>
              <p className="mt-0.5 text-[9px] text-gray-400">
                Inactive profiles will not be displayed as active demo profiles on the platform.
              </p>
              <span
                className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-medium ${
                  isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`}
                />
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              aria-label="Profile status"
              onClick={() => setIsActive((v) => !v)}
              className={`relative mt-1 h-5 w-9 flex-shrink-0 rounded-full transition ${
                isActive ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
                  isActive ? "left-[18px]" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate(LIST_PATH)}
            className="rounded-md border border-gray-200 px-5 py-2 text-[11px] font-medium text-slate-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-blue-600 px-5 py-2 text-[11px] font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDemoProfile;