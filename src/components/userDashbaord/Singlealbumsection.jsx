import { FiChevronDown } from "react-icons/fi";
import CurveDivider from "./CurveDivider";
import VideoUploader from "./Videouploader.jsx";
import ZodiacSlot from "./Zodiacslot.jsx";

// import { THEME_STYLES, ZODIACS } from "./uploadArtworkData";
import { THEME_STYLES, ZODIACS } from "./Uploadartworkdata.jsx";

/** Top section for albumType = "single": pick one sign + upload 1 photo. */
const SingleAlbumSection = ({
    selectedSignId,
    onSignChange,
    photo,
    onPhotoSelect,
    onPhotoRemove,
    video,
    onVideoSelect,
    onVideoRemove,
}) => {
    const sign = ZODIACS.find((z) => z.id === selectedSignId) ?? ZODIACS[0];
    const blue = THEME_STYLES.blue.hex;

    return (
        <div className="space-y-5">
            {/* Sign select */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <label
                    htmlFor="astro-sign"
                    className="text-[11px] font-bold uppercase tracking-widest text-gray-500"
                >
                    Select Astro Sign
                </label>

                <div className="relative mt-3">
                    <span className="pointer-events-none absolute left-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md bg-[#4048CD] text-sm text-white">
                        {sign.symbol}
                    </span>
                    <select
                        id="astro-sign"
                        value={selectedSignId}
                        onChange={(e) => onSignChange(Number(e.target.value))}
                        className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-3 pl-14 pr-10 text-sm text-gray-800 outline-none transition focus:border-[#4048CD] focus:ring-2 focus:ring-[#4048CD]/20"
                    >
                        {ZODIACS.map((z) => (
                            <option key={z.id} value={z.id}>
                                {z.name} ({z.short})
                            </option>
                        ))}
                    </select>
                    <FiChevronDown
                        size={16}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                </div>
            </div>

            <CurveDivider leftColor={blue} rightColor={blue} />

            {/* Slot */}
            <div>
                <h2 className="text-base font-bold text-gray-900">Zodiac Photo Slots Grid</h2>
                <p className="mb-3 mt-1 text-[11px] text-gray-500">
                    Click any slot to assign or upload a visual representational image.
                </p>
                <ZodiacSlot
                    sign={sign}
                    themeKey="blue"
                    photo={photo}
                    onSelect={onPhotoSelect}
                    onRemove={onPhotoRemove}
                />
            </div>

            <VideoUploader video={video} onSelect={onVideoSelect} onRemove={onVideoRemove} />
        </div>
    );
};

export default SingleAlbumSection;