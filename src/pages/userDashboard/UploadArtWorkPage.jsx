import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router";
import { FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import {
    ALBUM_CONFIG,
    MAX_PHOTO_SIZE_MB,
    MAX_VIDEO_SIZE_MB,
    THEMES,
    ZODIACS,
    formatBytes,
    getQualityLabel,
} from "../../components/userDashbaord/Uploadartworkdata";
import UploadArtWorkForm from "../../components/userDashbaord/Uploadartworkform";
import SingleAlbumSection from "../../components/userDashbaord/Singlealbumsection";
import TwelveAlbumSection from "../../components/userDashbaord/Twelvealbumsection";
import SixAlbumSection from "../../components/userDashbaord/Sixalbumsection";
import UploadSuccessModal from "../../components/userDashbaord/ui/UploadSuccessModal";

const SELECTION_PATH = "/userDashboard/artwork-management/UploadArtWorkTypes";
// ⚠️ sell-photos এর সিলেকশন পেজের আসল পাথ বসান
const SELL_SELECTION_PATH = "/userDashboard/sell-photos";
const SELL_PARAM = "bayphoto"; // ?bayphoto=yes

const INITIAL_FORM = {
    title: "",
    category: "",
    subCategory: "",
    story: "",
    price: "",
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
    /* ---------- URL params ---------- */
    const [searchParams] = useSearchParams();
    const rawType = searchParams.get("albumType");
    const isValidType = Object.prototype.hasOwnProperty.call(ALBUM_CONFIG, rawType ?? "");
    const albumType = isValidType ? rawType : "single";
    const config = ALBUM_CONFIG[albumType];
    const requiredCount = config.count;
    const isSellMode = searchParams.get(SELL_PARAM) === "yes";
    const selectionPath = isSellMode ? SELL_SELECTION_PATH : SELECTION_PATH;

    /* ---------- state ---------- */
    const [categories, setCategories] = useState([]);
    const [categoriesError, setCategoriesError] = useState("");
    const [selectedSignId, setSelectedSignId] = useState(1);
    const [theme, setTheme] = useState("red");
    const [photos, setPhotos] = useState({});
    const [video, setVideo] = useState(null);
    const [formValues, setFormValues] = useState(INITIAL_FORM);
    const [uploadError, setUploadError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submittedInfo, setSubmittedInfo] = useState(null);

    // refs
    const photosRef = useRef(photos);
    const videoRef = useRef(video);
    const sessionRef = useRef(0); // রিসেটের পর পুরোনো async ফলাফল বাতিল করার জন্য
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
        setTheme("red");
        setSelectedSignId(1);
        setFormValues(INITIAL_FORM);
        setUploadError("");
        setIsSubmitted(false);
        setSubmittedInfo(null);
    };

    // albumType বা মোড বদলালে সব রিসেট
    useEffect(() => {
        resetAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [albumType, isSellMode]);

    // unmount-এ ক্লিনআপ
    useEffect(() => revokeAll, []);

    // categories JSON লোড (public/albumCategories.json)
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

    /* ---------- active slots ---------- */
    const slotKeys = useMemo(() => {
        if (albumType === "single") return ["single"];
        if (albumType === "six") return THEMES[theme].signIds;
        return ZODIACS.map((z) => z.id);
    }, [albumType, theme]);

    const uploadedPhotos = slotKeys.map((key) => photos[key]).filter(Boolean);
    const uploadedCount = uploadedPhotos.length;

    /* ---------- auto-filled values ---------- */
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
    const priceNumber = Number(formValues.price);

    const missingItems = [];
    const missingPhotos = requiredCount - uploadedCount;
    if (missingPhotos > 0) missingItems.push(`${missingPhotos} more photo${missingPhotos > 1 ? "s" : ""}`);
    if (!formValues.title.trim()) missingItems.push("title");
    if (!formValues.category) missingItems.push("category");
    if (!formValues.subCategory) missingItems.push("subcategory");

    if (isSellMode) {
        if (!formValues.price || !(priceNumber > 0)) missingItems.push("price");
    } else {
        if (!formValues.story.trim()) missingItems.push("story");
        if (!formValues.publishTo) missingItems.push("publish option");
    }

    if (!formValues.isAI) missingItems.push("AI answer");
    if (!formValues.copyrightConfirmed) missingItems.push("copyright confirmation");

    const isFormValid = missingItems.length === 0;

    /* ---------- handlers ---------- */
    const handlePhotoSelect = async (slotKey, file) => {
        setUploadError("");
        setIsSubmitted(false);

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

            // এর মধ্যে রিসেট হয়ে গেলে এই ছবি বাতিল
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
        setIsSubmitted(false);
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
        payload.append("albumType", albumType);
        payload.append("title", formValues.title.trim());
        payload.append("category", formValues.category);
        payload.append("subCategory", formValues.subCategory);
        payload.append("isAI", formValues.isAI);
        payload.append("copyrightConfirmed", String(formValues.copyrightConfirmed));
        payload.append("resolution", derived.resolution);
        payload.append("fileSize", derived.fileSize);
        payload.append("quality", derived.quality);

        if (isSellMode) {
            payload.append("forSale", "true");
            payload.append("price", priceNumber.toFixed(2));
        } else {
            payload.append("description", formValues.story.trim());
            payload.append("publishTo", formValues.publishTo);
        }

        slotKeys.forEach((key) => {
            payload.append("images", photos[key].file);
            const zodiacId = key === "single" ? selectedSignId : key;
            payload.append("zodiacs", ZODIACS.find((z) => z.id === zodiacId)?.name ?? "");
        });
        if (video) payload.append("video", video.file);

        try {
            // TODO: এখানে আসল API কল বসান, যেমন:
            // const res = await fetch("/api/artworks", { method: "POST", body: payload });
            // if (!res.ok) throw new Error("Upload failed. Please try again.");
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setSubmittedInfo({
                title: formValues.title.trim(),
                photoCount: requiredCount,
                price: isSellMode ? priceNumber : null,
            });
            setIsSubmitted(true);
        } catch (err) {
            setUploadError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ---------- invalid / missing albumType -> back to selection ---------- */
    if (!isValidType) {
        return <Navigate to={selectionPath} replace />;
    }

    /* ---------- render ---------- */
    const form = (
        <UploadArtWorkForm
            values={formValues}
            onFieldChange={handleFieldChange}
            isSellMode={isSellMode}
            categories={categories}
            categoriesError={categoriesError}
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
                to={selectionPath}
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

            <UploadSuccessModal
                open={isSubmitted}
                onClose={resetAll}
                title={submittedInfo?.title ?? ""}
                photoCount={submittedInfo?.photoCount ?? 0}
                price={submittedInfo?.price ?? null}
                selectionPath={selectionPath}
            />
        </div>
    );
};

export default UploadArtWorkPage;