import { useRef, useState } from "react";
import { FiFilm, FiUploadCloud, FiX } from "react-icons/fi";
import { MAX_VIDEO_SIZE_MB, formatBytes } from "./UploadArtworkData";

/**
 * Optional video upload box (click or drag & drop).
 * State lives in the parent page: video = { file, preview } | null
 */
const VideoUploader = ({ video, onSelect, onRemove }) => {
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);

    const pickFile = (files) => {
        const file = files?.[0];
        if (file) onSelect(file);
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-bold text-gray-900">Upload Videos</h3>
            <p className="mt-1 text-[11px] text-gray-500">
                Help your pro prepare by showing them the work area. Optional but highly recommended.
            </p>

            {video ? (
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                    <video
                        src={video.preview}
                        className="h-16 w-24 shrink-0 rounded-lg bg-black object-cover"
                        muted
                        controls
                    />
                    <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-gray-900">
                            <FiFilm size={14} className="shrink-0 text-[#4048CD]" />
                            <span className="truncate">{video.file.name}</span>
                        </p>
                        <p className="mt-0.5 text-[11px] text-gray-500">{formatBytes(video.file.size)}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onRemove}
                        aria-label="Remove video"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-200"
                    >
                        <FiX size={16} />
                    </button>
                </div>
            ) : (
                <div
                    role="button"
                    tabIndex={0}
                    onClick={() => inputRef.current?.click()}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            inputRef.current?.click();
                        }
                    }}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setDragging(false);
                        pickFile(e.dataTransfer.files);
                    }}
                    className={`mt-4 flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-10 text-center transition ${
                        dragging ? "border-[#4048CD] bg-[#F6F7FF]" : "border-gray-200 hover:bg-gray-50"
                    }`}
                >
                    <FiUploadCloud size={22} className="text-gray-400" />
                    <p className="text-xs font-semibold text-gray-700">
                        Click to upload Videos or drag &amp; drop
                    </p>
                    <p className="text-[10px] text-gray-400">MP4 — max {MAX_VIDEO_SIZE_MB}MB each</p>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="video/mp4"
                className="hidden"
                onChange={(e) => {
                    pickFile(e.target.files);
                    e.target.value = "";
                }}
            />
        </div>
    );
};

export default VideoUploader;