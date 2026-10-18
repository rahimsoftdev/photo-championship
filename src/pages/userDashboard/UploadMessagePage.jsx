import React, { useState } from 'react';
import { Link } from 'react-router';
import { FiArrowLeft, FiUploadCloud, FiCheckCircle } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

const UploadMessagePage = () => {
    const [formData, setFormData] = useState({
        message: '',
        agreed: false,
        file: null,
    });
    
    // Success feedback state
    const [successMessage, setSuccessMessage] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation check (optional)
        if (!formData.message.trim()) {
            alert("Please enter a message!");
            return;
        }

        console.log("Form submitted:", formData);
        
        // Show success feedback
        setSuccessMessage(true);

        // Form reset after successful submission
        setFormData({
            message: '',
            agreed: false,
            file: null,
        });

        // Hide success message after 4 seconds
        setTimeout(() => {
            setSuccessMessage(false);
        }, 4000);
    };

    return (
        <div className="min-h-screen bg-[#FAFAFF] p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Back to Selection Link */}
                <Link 
                    to="/userDashboard/news-message" 
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-6 transition"
                >
                    <FiArrowLeft size={16} />
                    Back to Selection
                </Link>

                {/* Success Feedback Alert */}
                {successMessage && (
                    <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm transition-all">
                        <FiCheckCircle size={20} className="text-emerald-600 shrink-0" />
                        <span className="text-sm font-medium">
                            Your message has been successfully uploaded and submitted!
                        </span>
                    </div>
                )}

                {/* Main Form Container */}
                <form onSubmit={handleSubmit} className="bg-[#ECEDFA]/40 border border-[#ECEDFA] rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                    
                    {/* Message Section */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <label className="block text-sm font-semibold text-gray-800 mb-3">
                            Message
                        </label>
                        <textarea 
                            rows={4}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Share the creative narrative behind this cosmological series..."
                            className="w-full text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none resize-none"
                        ></textarea>
                    </div>

                    {/* Upload Photos / Videos Section */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-800 mb-1">
                            Upload Photos / Videos
                        </h3>
                        <p className="text-xs text-gray-400 mb-4">
                            Help your pro prepare by showing them the work area. Optional but highly recommended.
                        </p>

                        {/* Drag & Drop Box */}
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-gray-300 transition bg-gray-50/50">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mb-3">
                                <FiUploadCloud size={20} />
                            </div>
                            <span className="text-sm font-medium text-gray-700 mb-1">
                                {formData.file ? formData.file.name : "Click to upload photos or drag & drop"}
                            </span>
                            <span className="text-xs text-gray-400">
                                JPG, PNG, MP4 — max 20MB each
                            </span>
                            <input 
                                type="file" 
                                className="hidden" 
                                onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                            />
                        </label>
                    </div>

                    {/* Checkbox Section */}
                    <div className="flex items-center gap-3 pt-2">
                        <input 
                            type="checkbox" 
                            id="copyright"
                            checked={formData.agreed}
                            onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                        />
                        <label htmlFor="copyright" className="text-xs md:text-sm text-gray-600 cursor-pointer select-none">
                            I confirm that I own the full copyright for all uploaded photos and that they do not contain or promote anything illegal.
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit"
                        className="w-full bg-secondary text-white py-3 px-6 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition hover:opacity-95 shadow-sm cursor-pointer"
                    >
                        <HiSparkles size={16} />
                        Submit your Message
                    </button>

                </form>
            </div>
        </div>
    );
};

export default UploadMessagePage;