import { FiMoon, FiSun } from "react-icons/fi";
import CurveDivider from "./CurveDivider";
import VideoUploader from "./VideoUploader";
import ZodiacSlot from "./ZodiacSlot";
// সঠিক ফাইল পাথ দিয়ে নিচের লাইনটি ঠিক করুন (যেমন: `./uploadArtworkData` অথবা অন্য কোনো পাথ)
import { THEMES, THEME_STYLES, ZODIACS } from "./uploadArtworkData";

const THEME_BUTTON = {
    red: {
        active: "border-[#EE1C25] bg-[#FEE7E8] text-[#EE1C25]",
        icon: FiSun,
    },
    blue: {
        active: "border-[#4048CD] bg-[#E8EAFB] text-[#4048CD]",
        icon: FiMoon,
    },
};

/** Top section for albumType = "six": choose red (1-6) or blue (7-12) theme, then upload 6 photos. */
const SixAlbumSection = ({
    theme,
    onThemeChange,
    photos,
    onPhotoSelect,
    onPhotoRemove,
    video,
    onVideoSelect,
    onVideoRemove,
}) => {
    const activeTheme = THEMES[theme];
    const hex = THEME_STYLES[theme].hex;
    const slots = ZODIACS.filter((z) => activeTheme.signIds.includes(z.id));

    return (
        <div className="space-y-5">
            {/* Theme selector */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="text-sm font-bold text-gray-900">Select Astro-Acoustic Theme Accent</h2>

                <div className="mt-4 grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
                    {Object.values(THEMES).map((t, index) => {
                        const isActive = theme === t.key;
                        const { active, icon: Icon } = THEME_BUTTON[t.key];

                        return (
                            <div key={t.key} className="contents">
                                {index === 1 && (
                                    <span className="text-center text-xs font-bold text-gray-400">OR</span>
                                )}
                                <button
                                    type="button"
                                    onClick={() => onThemeChange(t.key)}
                                    aria-pressed={isActive}
                                    className={`rounded-xl border p-3 text-left transition ${
                                        isActive ? active : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                                    }`}
                                >
                                    <span className="flex items-center justify-between gap-2">
                                        <span className="flex items-center gap-2 text-sm font-semibold">
                                            <Icon size={15} />
                                            {t.title}
                                        </span>
                                        <span
                                            className={`h-2 w-2 shrink-0 rounded-full ${
                                                isActive ? "" : "bg-gray-300"
                                            }`}
                                            style={isActive ? { backgroundColor: THEME_STYLES[t.key].hex } : undefined}
                                        />
                                    </span>
                                    <span className="mt-1 block text-[11px] text-gray-600">{t.description}</span>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            <CurveDivider leftColor={hex} rightColor={hex} />

            {/* Slots */}
            <div>
                <h2 className="text-base font-bold text-gray-900">Zodiac Photo Slots Grid</h2>
                <p className="mb-3 mt-1 text-[11px] text-gray-500">
                    Click any slot to assign or upload a visual representational image.
                </p>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {slots.map((sign) => (
                        <ZodiacSlot
                            key={sign.id}
                            sign={sign}
                            themeKey={theme}
                            photo={photos[sign.id]}
                            onSelect={(file) => onPhotoSelect(sign.id, file)}
                            onRemove={() => onPhotoRemove(sign.id)}
                        />
                    ))}
                </div>
            </div>

            <VideoUploader video={video} onSelect={onVideoSelect} onRemove={onVideoRemove} />
        </div>
    );
};

export default SixAlbumSection;