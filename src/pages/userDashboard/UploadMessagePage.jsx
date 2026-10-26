import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { FiArrowLeft, FiUploadCloud, FiX, FiPlay } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import UploadSuccessModal from '../../components/userDashbaord/ui/UploadSuccessModal';

const BACK_PATH = '/user-dashboard/news-message';
const MAX_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'video/mp4'];

const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const fileKey = (f) => `${f.name}-${f.size}-${f.lastModified}`;

const UploadMessagePage = () => {
    const [message, setMessage] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [files, setFiles] = useState([]); // [{ id, file, url }]
    const [errors, setErrors] = useState({});
    const [dragging, setDragging] = useState(false);
    const [success, setSuccess] = useState({ open: false, message: '', fileCount: 0 });
    const inputRef = useRef(null);
    const filesRef = useRef([]);

    // Latest files ref-e rakha (preview URL cleanup-er jonno)
    useEffect(() => {
        filesRef.current = files;
    }, [files]);

    // Page theke ber hole shob preview URL free kora
    useEffect(() => {
        return () => {
            filesRef.current.forEach((f) => URL.revokeObjectURL(f.url));
        };
    }, []);

    // File add kora (type & size check shoho, duplicate bad)
    const addFiles = (incoming) => {
        const list = Array.from(incoming || []);
        if (!list.length) return;

        const problems = [];
        const existing = new Set(filesRef.current.map((f) => f.id));
        const added = [];

        list.forEach((file) => {
            if (!ALLOWED_TYPES.includes(file.type)) {
                problems.push(`${file.name}: only JPG, PNG or MP4 allowed`);
                return;
            }
            if (file.size > MAX_SIZE) {
                problems.push(`${file.name}: larger than 20MB`);
                return;
            }
            const id = fileKey(file);
            if (existing.has(id)) return;
            existing.add(id);
            added.push({ id, file, url: URL.createObjectURL(file) });
        });

        if (added.length) setFiles((prev) => [...prev, ...added]);
        setErrors((prev) => ({ ...prev, files: problems.length ? problems.join(' • ') : undefined }));
    };

    const removeFile = (id) => {
        setFiles((prev) => {
            const target = prev.find((f) => f.id === id);
            if (target) URL.revokeObjectURL(target.url);
            return prev.filter((f) => f.id !== id);
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        addFiles(e.dataTransfer.files);
    };

    const validate = () => {
        const next = {};
        if (!message.trim()) next.message = 'Please enter a message.';
        if (files.length > 0 && !agreed) next.agreed = 'Please confirm the copyright statement.';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        console.log('Form submitted:', {
            message,
            files: files.map((f) => f.file),
            agreed,
        });

        // Modal-er jonno submit howa data rakha
        setSuccess({ open: true, message: message.trim(), fileCount: files.length });

        // Form reset
        files.forEach((f) => URL.revokeObjectURL(f.url));
        setMessage('');
        setAgreed(false);
        setFiles([]);
        setErrors({});
        if (inputRef.current) inputRef.current.value = '';
    };

    const closeModal = () => setSuccess((prev) => ({ ...prev, open: false }));

    return (
        <div className="w-full max-w-full overflow-x-hidden">
            {/* Back link */}
            <Link
                to={BACK_PATH}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 mb-3 sm:mb-5 transition"
            >
                <FiArrowLeft size={16} />
                Back to Selection
            </Link>

            {/* Main Form Container */}
            <form
                onSubmit={handleSubmit}
                noValidate
                className="w-full bg-[#ECEDFA] rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 space-y-3 sm:space-y-4"
            >
                {/* Message Section */}
                <div>
                    <label
                        htmlFor="message"
                        className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5"
                    >
                        Message
                    </label>
                    <textarea
                        id="message"
                        rows={3}
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                            if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                        }}
                        placeholder="Share the creative narrative behind this cosmological series..."
                        className="w-full min-h-20 sm:min-h-24 lg:min-h-28 bg-[#FAFAFF] rounded-lg p-2.5 sm:p-3 text-xs sm:text-sm text-gray-700 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#EE1C25]/20"
                    />
                    {errors.message && (
                        <p className="mt-1 text-[11px] sm:text-xs text-red-500">{errors.message}</p>
                    )}
                </div>

                {/* Upload Photos / Videos Section */}
                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5">
                    <h3 className="text-sm sm:text-base font-bold text-[#0F1B3D]">
                        Upload Photos / Videos
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 mb-3">
                        Help your pro prepare by showing them the work area. Optional but highly recommended.
                    </p>

                    {files.length === 0 ? (
                        /* Upload input (file na thakle) */
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragging(true);
                            }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={handleDrop}
                            className={`rounded-lg border border-dashed transition ${
                                dragging ? 'border-[#EE1C25] bg-red-50/40' : 'border-gray-300 bg-white'
                            }`}
                        >
                            <label
                                htmlFor="file-upload"
                                className="flex flex-col items-center justify-center text-center px-3 py-5 sm:py-6 lg:py-8 cursor-pointer"
                            >
                                <FiUploadCloud className="text-gray-400 mb-1.5 w-5 h-5 sm:w-6 sm:h-6" />
                                <span className="text-[11px] sm:text-xs lg:text-sm font-semibold text-[#0F1B3D] break-words">
                                    Click to upload photos or drag &amp; drop
                                </span>
                                <span className="text-[9px] sm:text-[10px] text-gray-400 mt-1">
                                    JPG, PNG, MP4 — max 20MB each
                                </span>
                                <input
                                    ref={inputRef}
                                    id="file-upload"
                                    type="file"
                                    multiple
                                    accept=".jpg,.jpeg,.png,.mp4,image/jpeg,image/png,video/mp4"
                                    className="hidden"
                                    onChange={(e) => {
                                        addFiles(e.target.files);
                                        e.target.value = ''; // same file abar select korar jonno
                                    }}
                                />
                            </label>
                        </div>
                    ) : (
                        /* Upload howar por input-er jaygay chhoto image preview */
                        <ul className="flex flex-wrap gap-2 sm:gap-3">
                            {files.map(({ id, file, url }) => {
                                const isVideo = file.type.startsWith('video/');
                                return (
                                    <li key={id} className="w-20 sm:w-24 lg:w-28 min-w-0">
                                        <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-[#FAFAFF]">
                                            {isVideo ? (
                                                <>
                                                    <video
                                                        src={url}
                                                        muted
                                                        playsInline
                                                        preload="metadata"
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <span className="absolute inset-0 flex items-center justify-center bg-black/25 text-white">
                                                        <FiPlay size={16} />
                                                    </span>
                                                </>
                                            ) : (
                                                <img
                                                    src={url}
                                                    alt={file.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => removeFile(id)}
                                                aria-label={`Remove ${file.name}`}
                                                className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-[#EE1C25]"
                                            >
                                                <FiX size={12} />
                                            </button>
                                        </div>
                                        <p className="mt-1 truncate text-[10px] font-medium text-gray-700">
                                            {file.name}
                                        </p>
                                        <p className="text-[9px] text-gray-400">
                                            {formatSize(file.size)}
                                        </p>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    {errors.files && (
                        <p className="mt-2 text-[11px] sm:text-xs text-red-500 break-words">{errors.files}</p>
                    )}
                </div>

                {/* Checkbox Section */}
                <div>
                    <div className="flex items-start gap-2 sm:gap-2.5">
                        <input
                            type="checkbox"
                            id="copyright"
                            checked={agreed}
                            onChange={(e) => {
                                setAgreed(e.target.checked);
                                if (errors.agreed) setErrors((prev) => ({ ...prev, agreed: undefined }));
                            }}
                            className="mt-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 rounded border-gray-400 accent-[#EE1C25] cursor-pointer"
                        />
                        <label
                            htmlFor="copyright"
                            className="text-[10px] sm:text-xs text-gray-700 leading-relaxed cursor-pointer select-none"
                        >
                            I confirm that I own the full copyright for all uploaded photos and that they do not contain or promote anything illegal.
                        </label>
                    </div>
                    {errors.agreed && (
                        <p className="mt-1 text-[11px] sm:text-xs text-red-500">{errors.agreed}</p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-[#EE1C25] text-white py-2.5 px-4 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition hover:bg-red-700 active:scale-[0.99] cursor-pointer"
                >
                    <HiSparkles size={15} />
                    Submit your Message
                </button>
            </form>

            <UploadSuccessModal
                open={success.open}
                onClose={closeModal}
                message={'news added'}
                fileCount={success.fileCount}
                selectionPath={BACK_PATH}
            />
        </div>
    );
};

export default UploadMessagePage;