import { useRef } from "react";
import { FiCheck, FiUpload, FiX } from "react-icons/fi";
import { THEME_STYLES } from "./uploadArtworkData";

/**
 * One zodiac photo slot: shows sign info + "Add Photo" button.
 * After upload it shows the image preview with a remove button.
 */
const ZodiacSlot = ({ sign, themeKey, photo, onSelect, onRemove }) => {
    const inputRef = useRef(null);
    const style = THEME_STYLES[themeKey];

    const handleChange = (e) => {
        const file = e.target.files?.[0];
        if (file) onSelect(file);
        e.target.value = ""; // allow picking the same file again
    };

    return (
        <div
            className={`flex h-full flex-col rounded-xl border bg-white p-3 transition ${
                photo ? style.borderStrong : style.border
            }`}
        >
            <div className="flex items-center justify-between text-[11px] font-bold">
                <span className={style.text}>#{sign.id}</span>
                <span className="uppercase tracking-wide text-gray-400">{sign.element}</span>
            </div>

            <div className="mt-2 flex flex-1 flex-col items-center text-center">
                {photo ? (
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">
                        <img
                            src={photo.preview}
                            alt={`${sign.name} upload`}
                            className="h-full w-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={onRemove}
                            aria-label={`Remove ${sign.name} photo`}
                            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                        >
                            <FiX size={14} />
                        </button>
                        <span className="absolute bottom-1.5 left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#059669] text-white">
                            <FiCheck size={12} strokeWidth={3} />
                        </span>
                    </div>
                ) : (
                    <span
                        className={`flex h-10 w-10 items-center justify-center rounded-lg text-2xl ${style.iconBg} ${style.text}`}
                    >
                        {sign.symbol}
                    </span>
                )}

                <p className="mt-2 text-sm font-semibold text-gray-900">{sign.name}</p>
                <p className="text-[10px] leading-snug text-gray-500">{sign.dates}</p>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
            />

            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className={`mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-md border bg-white py-1.5 text-xs font-semibold transition ${style.button}`}
            >
                <FiUpload size={13} />
                {photo ? "Replace Photo" : "Add Photo"}
            </button>
        </div>
    );
};

export default ZodiacSlot;