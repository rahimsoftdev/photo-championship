import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
    FiArrowLeft,
    FiUploadCloud,
    FiPlus,
    FiX,
    FiCheckCircle,
    FiVideo,
    FiImage,
} from "react-icons/fi";
const initialForm = {
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    country: "",
    about: "",
    socialLinks: [""],
    password: "",
};
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB
//tailwind class for input filed
const inputClass =
    "mt-1.5 w-full rounded-md border border-transparent bg-[#ECEDFA] px-3 py-2.5 text-sm text-[#373737] outline-none transition placeholder:text-[#8C8C8C] focus:border-[#E8EAED] focus:ring-2 focus:ring-secondary/20";
//tailwind class for label filed:
const labelClass = "block text-[12px] font-medium text-[#373737]";
function Register() {
    const navigate = useNavigate();
    const profileInputRef = useRef(null);
    const coverInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const [form, setForm] = useState(initialForm);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [coverPhoto, setCoverPhoto] = useState(null);
    const [introVideo, setIntroVideo] = useState(null);
    const [profilePreview, setProfilePreview] = useState("");
    const [coverPreview, setCoverPreview] = useState("");
    const [videoPreview, setVideoPreview] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        return () => {
            if (profilePreview.startsWith("blob:")) {
                URL.revokeObjectURL(profilePreview);
            }
            if (coverPreview.startsWith("blob:")) {
                URL.revokeObjectURL(coverPreview);
            }
            if (videoPreview.startsWith("blob:")) {
                URL.revokeObjectURL(videoPreview);
            }
        };
    }, [profilePreview, coverPreview, videoPreview]);
    const updateField = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError("");
        setSuccess("");
    };
    const handleSocialChange = (index, value) => {
        setForm((prev) => ({
            ...prev,
            socialLinks: prev.socialLinks.map((link, i) =>
                i === index ? value : link
            ),
        }));
        setError("");
    };
    const addSocialLink = () => {
        setForm((prev) => ({
            ...prev,
            socialLinks: [...prev.socialLinks, ""],
        }));
    };
    const removeSocialLink = (index) => {
        setForm((prev) => ({
            ...prev,
            socialLinks: prev.socialLinks.filter((_, i) => i !== index),
        }));
    };
    const handleImageChange = async (event, type) => {
        const file = event.target.files?.[0];
        // Allow selecting the same file again later.
        event.target.value = "";
        if (!file) return;
        setError("");
        setSuccess("");
        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            return;
        }
        if (file.size > MAX_IMAGE_SIZE) {
            setError("Image size must be 5 MB or less.");
            return;
        }
        try {
            const preview = URL.createObjectURL(file);
            if (type === "profile") {
                setProfilePhoto(file);
                setProfilePreview(preview);
            } else {
                setCoverPhoto(file);
                setCoverPreview(preview);
            }
        } catch {
            setError("Could not preview this image. Please try again.");
        }
    };
    const handleVideoChange = (event) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;
        setError("");
        setSuccess("");
        if (!file.type.startsWith("video/")) {
            setError("Please select a valid video file.");
            return;
        }
        if (file.size > MAX_VIDEO_SIZE) {
            setError("Video size must be 50 MB or less.");
            return;
        }
        const preview = URL.createObjectURL(file);
        setIntroVideo(file);
        setVideoPreview(preview);
        setSuccess(`Video selected successfully: ${file.name}`);
    };
    const validateForm = () => {
        const requiredFields = [
            ["fullName", "Full name"],
            ["username", "Username"],
            ["email", "Email"],
            ["phoneNumber", "Phone number"],
            ["country", "Country"],
            ["about", "About"],
            ["password", "Password"],
        ];
        for (const [field, label] of requiredFields) {
            if (!form[field].trim()) {
                return `${label} is required.`;
            }
        }
        if (form.about.trim().length > 150) {
            return "About must not exceed 150 characters.";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            return "Please enter a valid email address.";
        }
        if (!/^[a-zA-Z0-9_]{3,30}$/.test(form.username)) {
            return "Username must be 3–30 characters and contain only letters, numbers, and underscores.";
        }
        if (form.password.length < 8) {
            return "Password must contain at least 8 characters.";
        }
        if (!profilePhoto) {
            return "Please upload your profile photo.";
        }
        if (!coverPhoto) {
            return "Please upload your cover photo.";
        }
        if (!introVideo) {
            return "Please upload your introduction video.";
        }
        const socialLinks = form.socialLinks.map((link) => link.trim());
        if (
            socialLinks.length === 0 ||
            socialLinks.some((link) => !link)
        ) {
            return "Please fill in every social media link.";
        }
        for (const link of socialLinks) {
            try {
                const url = new URL(link);
                if (!["http:", "https:"].includes(url.protocol)) {
                    return "Social links must start with http:// or https://.";
                }
            } catch {
                return "Please enter valid social media URLs.";
            }
        }
        return "";
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSubmitting(true);

        try {
            // Only the email is saved in localStorage.
            const trimmedEmail = form.email.trim().toLowerCase();
            localStorage.setItem("rememberedEmail", trimmedEmail);

            setSuccess("Registration successful! Redirecting to home...");
            navigate("/", { replace: true });
        } catch (err) {
            console.error("Email save error:", err);
            setError("Could not save your email. Please check your browser storage settings and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <main className="min-h-dvh w-full overflow-x-hidden bg-white px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
            <div className="mx-auto w-full min-w-0 max-w-[940px]">
                {/* Home link */}
                <div className="mx-auto w-full min-w-0 max-w-[700px]">
                    <Link
                        to="/"
                        className="mb-5 inline-flex items-center gap-2 text-sm text-[#6B7280] transition hover:text-secondary"
                    >
                        <FiArrowLeft size={16} />
                        Go Home
                    </Link>
                    <h1 className="mb-5 break-words text-xl font-bold tracking-tight text-[#0C0C0C] min-[380px]:text-2xl sm:mb-6 sm:text-[30px]">
                        Create your Account
                    </h1>
                    {error && (
                        <div
                            role="alert"
                            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                        >
                            {error}
                        </div>
                    )}
                    {success && (
                        <div
                            role="status"
                            className="mb-5 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                        >
                            <FiCheckCircle className="mt-0.5 shrink-0" size={17} />
                            <span>{success}</span>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} noValidate>
                        {/* Full name and username */}
                        <div className="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="fullName" className={labelClass}>
                                    Full Name <span className="text-secondary">*</span>
                                </label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={updateField}
                                    placeholder="Enter your full name"
                                    autoComplete="name"
                                    className={inputClass}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="username" className={labelClass}>
                                    Username <span className="text-secondary">*</span>
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    value={form.username}
                                    onChange={updateField}
                                    placeholder="@username"
                                    autoComplete="username"
                                    className={inputClass}
                                    required
                                />
                            </div>
                            {/* Email and phone */}
                            <div>
                                <label htmlFor="email" className={labelClass}>
                                    Email <span className="text-secondary">*</span>
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={updateField}
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    className={inputClass}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="phoneNumber" className={labelClass}>
                                    Phone Number <span className="text-secondary">*</span>
                                </label>
                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    value={form.phoneNumber}
                                    onChange={updateField}
                                    placeholder="Enter your phone number"
                                    autoComplete="tel"
                                    className={inputClass}
                                    required
                                />
                            </div>
                        </div>
                        {/* Country */}
                        <div className="mt-4">
                            <label htmlFor="country" className={labelClass}>
                                Country <span className="text-secondary">*</span>
                            </label>
                            <input
                                id="country"
                                name="country"
                                value={form.country}
                                onChange={updateField}
                                placeholder="Country Name"
                                autoComplete="country-name"
                                className={inputClass}
                                required
                            />
                        </div>
                        {/* About */}
                        <div className="mt-4">
                            <label htmlFor="about" className={labelClass}>
                                About ( MAX 150 WORDS ){" "}
                                <span className="text-secondary">*</span>
                            </label>
                            <textarea
                                id="about"
                                name="about"
                                value={form.about}
                                onChange={updateField}
                                placeholder="Write about your information"
                                maxLength={150}
                                rows={3}
                                className={`${inputClass} min-h-[80px] resize-y`}
                                required
                            />
                            <p className="mt-1 text-right text-[11px] text-[#8C8C8C]">
                                {form.about.length}/150 characters
                            </p>
                        </div>
                        {/* Social links */}
                        <div className="mt-4">
                            <label className={labelClass}>
                                Social Media Link <span className="text-secondary">*</span>
                            </label>
                            <div className="mt-1.5 space-y-2">
                                {form.socialLinks.map((link, index) => (
                                    <div key={index} className="flex min-w-0 items-center gap-2">
                                        <input
                                            type="url"
                                            value={link}
                                            onChange={(event) =>
                                                handleSocialChange(index, event.target.value)
                                            }
                                            placeholder="https://instagram.com/username"
                                            className="min-w-0 flex-1 rounded-md border border-[#E8EAED] bg-white px-3 py-2.5 text-sm text-[#373737] outline-none placeholder:text-[#8C8C8C] focus:border-secondary"
                                            required
                                        />
                                        {form.socialLinks.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSocialLink(index)}
                                                aria-label="Remove social link"
                                                className="rounded-md p-2 text-[#8C8C8C] hover:bg-red-50 hover:text-secondary"
                                            >
                                                <FiX size={17} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={addSocialLink}
                                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-secondary hover:underline"
                            >
                                <FiPlus size={14} />
                                Add Another
                            </button>
                        </div>
                        {/* Profile and cover photos */}
                        <div className="mt-5 grid grid-cols-2 gap-2.5 min-[420px]:gap-3 sm:mt-6 sm:gap-3">
                            {/* Profile photo */}
                            <div>
                                <label className={labelClass}>
                                    Profile Photo <span className="text-secondary">*</span>
                                </label>
                                <input
                                    ref={profileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={(event) => handleImageChange(event, "profile")}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => profileInputRef.current?.click()}
                                    className="mt-1.5 flex min-h-[88px] w-full min-w-0 flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-[#D3D7DE] bg-[#FAFAFA] p-2 text-center transition hover:border-secondary sm:min-h-[104px] sm:p-3"
                                >
                                    {profilePreview ? (
                                        <img
                                            src={profilePreview}
                                            alt="Profile photo preview"
                                            className="h-9 w-9 rounded-full border border-[#E8EAED] object-cover sm:h-14 sm:w-14"
                                        />
                                    ) : (
                                        <FiUploadCloud size={18} className="shrink-0 text-[#8C98A8] sm:h-5 sm:w-5" />
                                    )}
                                    <span className="mt-1.5 break-words text-[10px] leading-tight text-[#526581] min-[420px]:text-xs">
                                        {profilePhoto ? "Change Profile Photo" : "Upload Profile Photo"}
                                    </span>
                                    <span className="mt-1 break-words text-[9px] leading-tight text-[#8C8C8C] sm:text-[10px]">
                                        JPG, PNG or WebP • Max 5 MB
                                    </span>
                                </button>
                            </div>
                            {/* Cover photo */}
                            <div>
                                <label className={labelClass}>
                                    Cover Photo <span className="text-secondary">*</span>
                                </label>
                                <input
                                    ref={coverInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={(event) => handleImageChange(event, "cover")}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => coverInputRef.current?.click()}
                                    className="mt-1.5 flex min-h-[88px] w-full min-w-0 flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-[#D3D7DE] bg-[#FAFAFA] p-2 text-center transition hover:border-secondary sm:min-h-[104px] sm:p-3"
                                >
                                    {coverPreview ? (
                                        <img
                                            src={coverPreview}
                                            alt="Cover photo preview"
                                            className="h-9 w-full max-w-[100px] rounded-md object-cover sm:h-14 sm:max-w-[130px]"
                                        />
                                    ) : (
                                        <FiUploadCloud size={18} className="shrink-0 text-[#8C98A8] sm:h-5 sm:w-5" />
                                    )}
                                    <span className="mt-1.5 break-words text-[10px] leading-tight text-[#526581] min-[420px]:text-xs">
                                        {coverPhoto ? "Change Cover Photo" : "Upload Cover Photo"}
                                    </span>
                                    <span className="mt-1 break-words text-[9px] leading-tight text-[#8C8C8C] sm:text-[10px]">
                                        JPG, PNG or WebP • Max 5 MB
                                    </span>
                                </button>
                            </div>
                        </div>
                        {/* Introduction video */}
                        <div className="mt-5">
                            <label className={labelClass}>
                                Introduction Video <span className="text-secondary">*</span>
                            </label>
                            <input
                                ref={videoInputRef}
                                type="file"
                                accept="video/mp4,video/webm,video/quicktime"
                                onChange={handleVideoChange}
                                className="hidden"
                            />
                            <div className="mt-1.5 overflow-hidden rounded-lg border border-dashed border-[#D3D7DE] bg-[#FAFAFA]">
                                {videoPreview ? (
                                    <div className="p-2 sm:p-3">
                                        <video
                                            src={videoPreview}
                                            controls
                                            className="max-h-36 w-full rounded-md bg-black sm:max-h-56"
                                        />
                                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                                            <span className="flex items-center gap-2 text-xs text-green-700">
                                                <FiCheckCircle size={16} />
                                                Video selected successfully
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => videoInputRef.current?.click()}
                                                className="text-xs font-medium text-secondary hover:underline"
                                            >
                                                Change video
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => videoInputRef.current?.click()}
                                        className="flex min-h-[88px] w-full flex-col items-center justify-center p-2 text-center transition hover:bg-gray-50 sm:min-h-[120px] sm:p-4"
                                    >
                                        <FiUploadCloud size={18} className="shrink-0 text-[#8C98A8] sm:h-5 sm:w-5" />
                                        <span className="mt-1.5 text-[10px] leading-tight text-[#526581] sm:mt-2 sm:text-xs">
                                            Upload Video
                                        </span>
                                        <span className="mt-1 break-words text-[9px] leading-tight text-[#8C8C8C] sm:text-[10px]">
                                            MP4, WebM or MOV • Max 50 MB
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>
                        {/* Password */}
                        <div className="mt-5">
                            <label htmlFor="password" className={labelClass}>
                                Password <span className="text-secondary">*</span>
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={updateField}
                                placeholder="Write a strong password"
                                autoComplete="new-password"
                                minLength={8}
                                className={inputClass}
                                required
                            />
                            <p className="mt-1 break-words text-[9px] leading-tight text-[#8C8C8C] sm:text-[10px]">
                                Minimum 8 characters. This demo does not save the password.
                            </p>
                        </div>
                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-secondary px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                "Creating Account..."
                            ) : (
                                <>
                                    <FiCheckCircle size={16} />
                                    Sign Up
                                </>
                            )}
                        </button>
                    </form>
                    {/* Login link */}
                    <p className="mt-5 text-center text-sm text-[#373737]">
                        Already Have an account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-secondary hover:underline"
                        >
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
export default Register;
