import React, { useState } from 'react';
import { Link } from 'react-router';
import { FiArrowLeft, FiUploadCloud, FiCheck, FiX, FiImage } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

const UploadMessagePage = () => {
    const [formData, setFormData] = useState({
        message: '',
        agreed: false,
        file: null,
    });

    const [previewUrl, setPreviewUrl] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Image Upload & Preview Handler
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFormData((prev) => ({ ...prev, file: selectedFile }));
            // Preview image URL create
            if (selectedFile.type.startsWith('image/')) {
                setPreviewUrl(URL.createObjectURL(selectedFile));
            } else {
                setPreviewUrl(null);
            }
        }
    };

    // Remove uploaded file
    const handleRemoveFile = () => {
        setFormData((prev) => ({ ...prev, file: null }));
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.message.trim()) {
            alert("Please write a message before submitting.");
            return;
        }

        console.log("Form submitted successfully:", formData);

        // Trigger Modern Success Modal
        setShowSuccessModal(true);
    };

    const handleModalClose = () => {
        setShowSuccessModal(false);
        // Reset Form Data
        setFormData({ message: '', agreed: false, file: null });
        setPreviewUrl(null);
    };

    return (
        <div className="min-h-screen bg-[#FAFAFF] p-4 md:p-8 relative">
            <div className="w-full max-w-7xl mx-auto">
                {/* Back Link */}
                <Link 
                    to="/userDashboard/news-message" 
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-6 transition"
                >
                    <FiArrowLeft size={16} />
                    Back to Selection
                </Link>

                {/* Main Container - Full Width */}
                <form onSubmit={handleSubmit} className="w-full bg-[#ECEDFA]/40 border border-[#ECEDFA] rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                    
                    {/* Message Section */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 w-full">
                        <label className="block text-sm font-semibold text-gray-800 mb-3">
                            Message
                        </label>
                        <textarea 
                            rows={5}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Share the creative narrative behind this cosmological series..."
                            className="w-full text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none resize-none"
                        ></textarea>
                    </div>

                    {/* Upload Photos / Videos Section */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 w-full">
                        <h3 className="text-sm font-semibold text-gray-800 mb-1">
                            Upload Photos / Videos
                        </h3>
                        <p className="text-xs text-gray-400 mb-4">
                            Help your pro prepare by showing them the work area. Optional but highly recommended.
                        </p>

                        {/* Drag & Drop Box */}
                        {!formData.file ? (
                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-10 cursor-pointer hover:border-gray-300 transition bg-gray-50/50 w-full">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mb-3">
                                    <FiUploadCloud size={24} />
                                </div>
                                <span className="text-sm font-medium text-gray-700 mb-1">
                                    Click to upload photos or drag & drop
                                </span>
                                <span className="text-xs text-gray-400">
                                    JPG, PNG, MP4 — max 20MB each
                                </span>
                                <input 
                                    type="file" 
                                    accept="image/*,video/*"
                                    className="hidden" 
                                    onChange={handleFileChange}
                                />
                            </label>
                        ) : (
                            /* Uploaded Image Preview Block */
                            <div className="relative w-full border border-gray-200 rounded-xl overflow-hidden bg-gray-50 p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600 truncate">
                                        <FiImage className="text-gray-400" size={16} />
                                        <span className="truncate">{formData.file.name}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemoveFile}
                                        className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-xs flex items-center gap-1"
                                    >
                                        <FiX size={14} /> Remove
                                    </button>
                                </div>

                                {previewUrl ? (
                                    <div className="w-full max-h-[420px] rounded-lg overflow-hidden border border-gray-200">
                                        <img 
                                            src={previewUrl} 
                                            alt="Uploaded Preview" 
                                            className="w-full h-full object-cover max-h-[420px]"
                                        />
                                    </div>
                                ) : (
                                    <div className="py-6 text-center text-xs text-gray-500 bg-white rounded-lg border border-dashed border-gray-200">
                                        Uploaded File: {formData.file.name}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Checkbox Section */}
                    <div className="flex items-center gap-3 pt-2">
                        <input 
                            type="checkbox" 
                            id="copyright"
                            checked={formData.agreed}
                            onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 text-secondary focus:ring-secondary cursor-pointer"
                        />
                        <label htmlFor="copyright" className="text-xs md:text-sm text-gray-600 cursor-pointer select-none">
                            I confirm that I own the full copyright for all uploaded photos and that they do not contain or promote anything illegal.
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit"
                        className="w-full bg-secondary text-white py-3.5 px-6 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition hover:opacity-95 shadow-md cursor-pointer active:scale-[0.99]"
                    >
                        <HiSparkles size={18} />
                        Submit your Message
                    </button>

                </form>
            </div>

            {/* Modern Beautiful Success Modal Feedback */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-gray-100 transform transition-all animate-scale-up">
                        {/* Animated Icon Circle */}
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                            <FiCheck size={40} className="stroke-[3]" />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Submitted!</h3>
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                            Your message and media have been successfully uploaded and published to your feed.
                        </p>

                        <div className="flex flex-col gap-3">
                            <Link
                                to="/userDashboard/news-message"
                                className="w-full bg-secondary text-white py-3 rounded-xl font-semibold text-sm transition hover:opacity-90 shadow-sm"
                            >
                                View My Messages
                            </Link>
                            <button
                                type="button"
                                onClick={handleModalClose}
                                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium text-sm hover:bg-gray-200 transition"
                            >
                                Upload Another
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadMessagePage;