import { FiMoon, FiSun } from "react-icons/fi";
import CurveDivider from "./CurveDivider";
import VideoUploader from "./VideoUploader";
import ZodiacSlot from "./ZodiacSlot";
import {
    THEME_STYLES,
    TWELVE_DISPLAY_ORDER,
    ZODIACS,
    getThemeKeyBySignId,
} from "./uploadArtworkData";

/** Top section for albumType = "twelve": all 12 signs, red (1-6) + blue (7-12). */
const TwelveAlbumSection = ({
    photos,
    onPhotoSelect,
    onPhotoRemove,
    video,
    onVideoSelect,
    onVideoRemove,
}) => {
    const orderedSigns = TWELVE_DISPLAY_ORDER.map((id) => ZODIACS.find((z) => z.id === id));

    return (
        <div className="space-y-5">
            <CurveDivider leftColor={THEME_STYLES.red.hex} rightColor={THEME_STYLES.blue.hex} />

            {/* Header */}
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5">
                <FiSun className="hidden shrink-0 text-[#EE1C25] sm:block" size={40} />
                <div className="flex-1 text-center">
                    <h2 className="text-lg font-extrabold text-gray-900 sm:text-xl">
                        Spring, Summer, Autumn and Winter –{" "}
                        <span className="text-[#EE1C25]">Red</span> and{" "}
                        <span className="text-[#4048CD]">Blue</span> Full 12 Zodiac Story
                    </h2>
                    <p className="mt-1 text-xs text-gray-500">
                        Upload 12 photo - One for each zodiac sign to complete your story
                    </p>
                </div>
                <FiMoon className="hidden shrink-0 text-[#4048CD] sm:block" size={40} />
            </div>

            {/* Slots */}
            <div>
                <h2 className="mb-3 text-sm font-bold text-gray-900">Professional 12-Zodiac Visual Frame</h2>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {orderedSigns.map((sign) => (
                        <ZodiacSlot
                            key={sign.id}
                            sign={sign}
                            themeKey={getThemeKeyBySignId(sign.id)}
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

export default TwelveAlbumSection;