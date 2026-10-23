import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import {
    MAX_PHOTO_SIZE_MB,
    MAX_VIDEO_SIZE_MB,
    ZODIACS,
} from "../../components/userDashbaord/Uploadartworkdata";
import TwelveAlbumSection from "../../components/userDashbaord/Twelvealbumsection";
import BusinessLinkForm from "../../components/userDashbaord/BusinessLinkForm";
import BusinessSuccessModal from "../../components/userDashbaord/ui/BusinessSuccessModal";

// ⚠️ আপনার আসল সিলেকশন/ব্যাক পাথ বসান
const BACK_PATH = "/user-dashboard/artwork-management/UploadArtWorkTypes";

const INITIAL_FORM = {
    title: "",
    category: "",
    subCategory: "",
    story: "",
    isAI: null, // "yes" | "no"
    copyrightConfirmed: false,
};

const loadImageMeta = (file) =>
    new Promise((resolve, reject) => {
        const preview = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => resolve({ file, preview, width: img.naturalWidth, height: img.naturalHeight });
        img.onerror = () => {
            URL.revokeObjectURL(preview);
            reject(new Error("This image could not be read. Please try another file."));
        };
        img.src = preview;
    });

const BusinessLinkPage = () => {
    const requiredCount = ZODIACS.length; // 12
    const slotKeys = useMemo(() => ZODIACS.map((z) => z.id), []);

    /* ---------- state ---------- */
    const [categories, setCategories] = useState([]);
    const [categoriesError, setCategoriesError] = useState("");
    const [photos, setPhotos] = useState({});
    const [video, setVideo] = useState(null);
    const [formValues, setFormValues] = useState(INITIAL_FORM);
    const [uploadError, setUploadError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submittedInfo, setSubmittedInfo] = useState(null);

    const photosRef = useRef(photos);
    const videoRef = useRef(video);
    const sessionRef = useRef(0);
    photosRef.current = photos;
    videoRef.current = video;

    const revokeAll = () => {
        Object.values(photosRef.current).forEach((p) => URL.revokeObjectURL(p.preview));
        if (videoRef.current) URL.revokeObjectURL(videoRef.current.preview);
    };

    const resetAll = () => {
        sessionRef.current += 1;
        revokeAll();
        setPhotos({});
        setVideo(null);
        setFormValues(INITIAL_FORM);
        setUploadError("");
        setIsSubmitted(false);
        setSubmittedInfo(null);
    };

    // unmount-এ ক্লিনআপ
    useEffect(() => revokeAll, []);

    // categories লোড (public/albumCategories.json)
    useEffect(() => {
        const controller = new AbortController();
        fetch("/albumCategories.json", { signal: controller.signal })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load categories");
                return res.json();
            })
            .then((data) => setCategories(data))
            .catch((err) => {
                if (err.name !== "AbortError") setCategoriesError(err.message);
            });
        return () => controller.abort();
    }, []);

    const uploadedCount = slotKeys.filter((key) => photos[key]).length;

    /* ---------- validation ---------- */
    const missingItems = [];
    const missingPhotos = requiredCount - uploadedCount;
    if (missingPhotos > 0) missingItems.push(`${missingPhotos} more photo${missingPhotos > 1 ? "s" : ""}`);
    if (!formValues.title.trim()) missingItems.push("title");
    if (!formValues.category) missingItems.push("category");
    if (!formValues.subCategory) missingItems.push("subcategory");
    if (!formValues.story.trim()) missingItems.push("story");
    if (!formValues.isAI) missingItems.push("AI answer");
    if (!formValues.copyrightConfirmed) missingItems.push("copyright confirmation");

    const isFormValid = missingItems.length === 0;

    /* ---------- handlers ---------- */
    const handlePhotoSelect = async (slotKey, file) => {
        setUploadError("");

        if (!file.type.startsWith("image/")) {
            setUploadError("Only image files can be uploaded as photos.");
            return;
        }
        if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
            setUploadError(`Each photo must be ${MAX_PHOTO_SIZE_MB}MB or smaller.`);
            return;
        }

        const session = sessionRef.current;
        try {
            const meta = await loadImageMeta(file);
            if (session !== sessionRef.current) {
                URL.revokeObjectURL(meta.preview);
                return;
            }
            const old = photosRef.current[slotKey];
            if (old) URL.revokeObjectURL(old.preview);
            setPhotos((prev) => ({ ...prev, [slotKey]: meta }));
        } catch (err) {
            setUploadError(err.message);
        }
    };

    const handlePhotoRemove = (slotKey) => {
        const old = photosRef.current[slotKey];
        if (old) URL.revokeObjectURL(old.preview);
        setPhotos((prev) => {
            const next = { ...prev };
            delete next[slotKey];
            return next;
        });
    };

    const handleVideoSelect = (file) => {
        setUploadError("");
        if (file.type !== "video/mp4") {
            setUploadError("Only MP4 videos are allowed.");
            return;
        }
        if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
            setUploadError(`The video must be ${MAX_VIDEO_SIZE_MB}MB or smaller.`);
            return;
        }
        if (videoRef.current) URL.revokeObjectURL(videoRef.current.preview);
        setVideo({ file, preview: URL.createObjectURL(file) });
    };

    const handleVideoRemove = () => {
        if (videoRef.current) URL.revokeObjectURL(videoRef.current.preview);
        setVideo(null);
    };

    const handleFieldChange = (field, value) => {
        setFormValues((prev) => ({
            ...prev,
            [field]: value,
            ...(field === "category" ? { subCategory: "" } : {}),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid || isSubmitting) return;

        setIsSubmitting(true);
        setUploadError("");

        const payload = new FormData();
        payload.append("albumType", "twelve");
        payload.append("businessLink", "true");
        payload.append("title", formValues.title.trim());
        payload.append("category", formValues.category);
        payload.append("subCategory", formValues.subCategory);
        payload.append("description", formValues.story.trim());
        payload.append("isAI", formValues.isAI);
        payload.append("copyrightConfirmed", String(formValues.copyrightConfirmed));

        slotKeys.forEach((key) => {
            payload.append("images", photos[key].file);
            payload.append("zodiacs", ZODIACS.find((z) => z.id === key)?.name ?? "");
        });
        if (video) payload.append("video", video.file);

        try {
            // TODO: আসল API কল বসান, যেমন:
            // const res = await fetch("/api/business-links", { method: "POST", body: payload });
            // if (!res.ok) throw new Error("Submission failed. Please try again.");
            // const data = await res.json();
            await new Promise((resolve) => setTimeout(resolve, 1200));

            setSubmittedInfo({
                title: formValues.title.trim(),
                photoCount: requiredCount,
                hasVideo: Boolean(video),
                // API থেকে আইডি পেলে সেটা বসান (data.id)
                referenceId: `BL-${Date.now().toString().slice(-6)}`,
            });
            setIsSubmitted(true);
        } catch (err) {
            setUploadError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ---------- render ---------- */
    return (
        <div className="w-full space-y-5 pb-12">
            <Link
                to={BACK_PATH}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 transition hover:text-gray-900"
            >
                <FiArrowLeft size={14} />
                Back to Selection
            </Link>

            {uploadError && (
                <div
                    role="alert"
                    className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600"
                >
                    <FiAlertCircle size={15} className="shrink-0" />
                    {uploadError}
                </div>
            )}

            <div className="space-y-6">
                {/* আগের কম্পোনেন্ট রিইউজ: হেডার কার্ড + curve + ১২টা স্লট */}
                <TwelveAlbumSection
                    photos={photos}
                    onPhotoSelect={handlePhotoSelect}
                    onPhotoRemove={handlePhotoRemove}
                    video={video}
                    onVideoSelect={handleVideoSelect}
                    onVideoRemove={handleVideoRemove}
                />

                <BusinessLinkForm
                    values={formValues}
                    onFieldChange={handleFieldChange}
                    categories={categories}
                    categoriesError={categoriesError}
                    uploadedCount={uploadedCount}
                    requiredCount={requiredCount}
                    isValid={isFormValid}
                    missingItems={missingItems}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit}
                />
            </div>

            <BusinessSuccessModal
                open={isSubmitted}
                onClose={resetAll}
                info={submittedInfo}
                backPath={BACK_PATH}
            />
        </div>
    );
};

export default BusinessLinkPage;