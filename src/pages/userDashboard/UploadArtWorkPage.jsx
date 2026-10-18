import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";
import { FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import useFetch from "../../hooks/useFetch";

import {
    ALBUM_CONFIG,
    MAX_PHOTO_SIZE_MB,
    MAX_VIDEO_SIZE_MB,
    THEMES,
    ZODIACS,
    formatBytes,
    getQualityLabel,
} from "../../components/userDashbaord/Uploadartworkdata";

//import form component
import UploadArtWorkForm from "../../components/userDashbaord/Uploadartworkform";

//single album component will show if album type = singe
import SingleAlbumSection from "../../components/userDashbaord/Singlealbumsection";

//Twelve album component will show if album type = Twelve
import TwelveAlbumSection from "../../components/userDashbaord/Twelvealbumsection";

//six album component will show if album type = six
import SixAlbumSection from "../../components/userDashbaord/Sixalbumsection";
import UploadSuccessModal from "../../components/userDashbaord/Uploadsuccessmoda";

const SELECTION_PATH = "/userDashboard/artwork-management/UploadArtWorkTypes";

// TODO: change this to the real file name of your categories JSON (inside /public)
const CATEGORIES_URL = "/albumCategories.json";

const INITIAL_FORM = {
    title: "",
    category: "", // category.value  (e.g. "nature")
    subCategory: "", // subcategory.value (e.g. "mountains")
    story: "",
    publishTo: "", // "competition" | "profile"
    isAI: null, // "yes" | "no"
    copyrightConfirmed: false,
};

// Reads the file, creates a preview URL and detects width/height
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

const UploadArtWorkPage = () => {
    const navigate = useNavigate();

    /* ---------- albumType from the URL (?albumType=single|six|twelve) ---------- */
    const [searchParams] = useSearchParams();
    const rawType = searchParams.get("albumType");
    const isValidType = Object.prototype.hasOwnProperty.call(ALBUM_CONFIG, rawType ?? "");
    const albumType = isValidType ? rawType : "single";
    const config = ALBUM_CONFIG[albumType];
    const requiredCount = config.count;

    /* ---------- categories (name/value + subcategories) ---------- */
    const { data: categoriesData, error: categoriesError } = useFetch(CATEGORIES_URL);
    const categories = Array.isArray(categoriesData) ? categoriesData : [];

    /* ---------- state (all upload state lives here) ---------- */
    const [selectedSignId, setSelectedSignId] = useState(1); // single: chosen zodiac sign
    const [theme, setTheme] = useState("red"); // six: "red" (1-6) | "blue" (7-12)
    const [photos, setPhotos] = useState({}); // { slotKey: { file, preview, width, height } }
    const [video, setVideo] = useState(null); // { file, preview } | null
    const [formValues, setFormValues] = useState(INITIAL_FORM);
    const [uploadError, setUploadError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successModal, setSuccessModal] = useState(null); // null | "competition" | "profile"

    // refs so we can revoke object URLs on unmount / reset
    const photosRef = useRef(photos);
    const videoRef = useRef(video);
    photosRef.current = photos;
    videoRef.current = video;

    const revokeAll = () => {
        Object.values(photosRef.current).forEach((p) => URL.revokeObjectURL(p.preview));
        if (videoRef.current) URL.revokeObjectURL(videoRef.current.preview);
    };

    const resetAll = () => {
        revokeAll();
        setPhotos({});
        setVideo(null);
        setTheme("red");
        setSelectedSignId(1);
        setFormValues(INITIAL_FORM);
        setUploadError("");
    };

    // Reset everything when the album type changes
    useEffect(() => {
        resetAll();
        setSuccessModal(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [albumType]);

    // Cleanup on unmount
    useEffect(() => revokeAll, []);

    /* ---------- which slots are active right now ---------- */
    const slotKeys = useMemo(() => {
        if (albumType === "single") return ["single"];
        if (albumType === "six") return THEMES[theme].signIds;
        return ZODIACS.map((z) => z.id);
    }, [albumType, theme]);

    const uploadedPhotos = slotKeys.map((key) => photos[key]).filter(Boolean);
    const uploadedCount = uploadedPhotos.length;

    /* ---------- values auto-filled from the uploaded photos ---------- */
    const derived = useMemo(() => {
        if (uploadedPhotos.length === 0) return { resolution: "", fileSize: "", quality: "" };

        const totalBytes = uploadedPhotos.reduce((sum, p) => sum + p.file.size, 0);
        const lowest = uploadedPhotos.reduce((min, p) =>
            p.width * p.height < min.width * min.height ? p : min
        );

        return {
            resolution: `${lowest.width}*${lowest.height}`,
            fileSize: formatBytes(totalBytes),
            quality: getQualityLabel(lowest.width, lowest.height),
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [photos, slotKeys]);

    /* ---------- validation ---------- */
    const missingItems = [];
    const missingPhotos = requiredCount - uploadedCount;
    if (missingPhotos > 0) missingItems.push(`${missingPhotos} more photo${missingPhotos > 1 ? "s" : ""}`);
    if (!formValues.title.trim()) missingItems.push("title");
    if (!formValues.category) missingItems.push("category");
    if (!formValues.subCategory) missingItems.push("subcategory");
    if (!formValues.story.trim()) missingItems.push("story");
    if (!formValues.publishTo) missingItems.push("publish option");
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

        try {
            const meta = await loadImageMeta(file);
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
            // changing the category clears the old subcategory
            ...(field === "category" ? { subCategory: "" } : {}),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid || isSubmitting) return;

        setIsSubmitting(true);

        const payload = new FormData();
        payload.append("albumType", albumType);
        payload.append("title", formValues.title.trim());
        payload.append("category", formValues.category);
        payload.append("subCategory", formValues.subCategory);
        payload.append("description", formValues.story.trim());
        payload.append("publishTo", formValues.publishTo);
        payload.append("isAI", formValues.isAI);
        payload.append("resolution", derived.resolution);
        payload.append("fileSize", derived.fileSize);
        payload.append("quality", derived.quality);

        slotKeys.forEach((key) => {
            payload.append("images", photos[key].file);
            const zodiacId = key === "single" ? selectedSignId : key;
            payload.append("zodiacs", ZODIACS.find((z) => z.id === zodiacId)?.name ?? "");
        });
        if (video) payload.append("video", video.file);

        // TODO: send `payload` to the API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsSubmitting(false);
        setSuccessModal(formValues.publishTo); // opens the success popup
    };

    /* ---------- success modal actions ---------- */
    const handleCloseModal = useCallback(() => {
        setSuccessModal(null);
        resetAll(); // clear the form so the same album can't be submitted twice
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleGoHome = () => navigate("/");
    const handleUploadAnother = () => navigate(SELECTION_PATH);

    /* ---------- invalid / missing albumType -> back to selection ---------- */
    if (!isValidType) {
        return <Navigate to={SELECTION_PATH} replace />;
    }

    /* ---------- render ---------- */
    const form = (
        <UploadArtWorkForm
            values={formValues}
            onFieldChange={handleFieldChange}
            categories={categories}
            categoriesError={categoriesError ? String(categoriesError) : ""}
            derived={derived}
            uploadedCount={uploadedCount}
            requiredCount={requiredCount}
            isValid={isFormValid}
            missingItems={missingItems}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
        />
    );

    const videoProps = {
        video,
        onVideoSelect: handleVideoSelect,
        onVideoRemove: handleVideoRemove,
    };

    return (
        <div className="w-full space-y-5 pb-12">
            <Link
                to={SELECTION_PATH}
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

            {albumType === "single" && (
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)]">
                    <SingleAlbumSection
                        selectedSignId={selectedSignId}
                        onSignChange={setSelectedSignId}
                        photo={photos.single}
                        onPhotoSelect={(file) => handlePhotoSelect("single", file)}
                        onPhotoRemove={() => handlePhotoRemove("single")}
                        {...videoProps}
                    />
                    {form}
                </div>
            )}

            {albumType === "six" && (
                <div className="space-y-6">
                    <SixAlbumSection
                        theme={theme}
                        onThemeChange={setTheme}
                        photos={photos}
                        onPhotoSelect={handlePhotoSelect}
                        onPhotoRemove={handlePhotoRemove}
                        {...videoProps}
                    />
                    {form}
                </div>
            )}

            {albumType === "twelve" && (
                <div className="space-y-6">
                    <TwelveAlbumSection
                        photos={photos}
                        onPhotoSelect={handlePhotoSelect}
                        onPhotoRemove={handlePhotoRemove}
                        {...videoProps}
                    />
                    {form}
                </div>
            )}

            {/* Success popup (competition / profile) */}
            <UploadSuccessModal
                isOpen={successModal !== null}
                type={successModal}
                onClose={handleCloseModal}
                onGoHome={handleGoHome}
                onUploadAnother={handleUploadAnother}
            />
        </div>
    );
};

export default UploadArtWorkPage;