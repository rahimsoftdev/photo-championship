import React, { useState } from 'react';
import { useSearchParams } from 'react-router';
import { FaShieldAlt, FaDownload } from 'react-icons/fa';

const ByCheckOut = () => {
    const [searchParams] = useSearchParams();
    const [isSuccess, setIsSuccess] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // URL params theke data retrieve kora
    const title = searchParams.get('title') || "Golden Sunset";
    const author = searchParams.get('author') || "Emma Wilson";
    const price = searchParams.get('price') || "25.00";
    const image = searchParams.get('image') || "https://picsum.photos/seed/mountain-art-01/1200/800";

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        // Payment success simulate korar jonno
        setIsSuccess(true);
    };

    // Real image download handler function
    const handleDownloadPhoto = async () => {
        try {
            setIsDownloading(true);
            const response = await fetch(image);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = blobUrl;
            // File name set kora
            link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download failed:", error);
            // Fallback if CORS blocks blob
            window.open(image, '_blank');
        } finally {
            setIsDownloading(false);
        }
    };

    if (isSuccess) {
        // Success Screen (Image onujayi exact layout ebong #EDEEEF background)
        return (
            <div className="max-w-xl mx-auto my-12 bg-white border border-[#C6C6CD] rounded-3xl shadow-sm overflow-hidden">
                
                {/* Top Gray Header Section with #EDEEEF */}
                <div className="bg-[#EDEEEF] px-8 py-10 text-center border-b border-[#C6C6CD]">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-[#111827] text-white rounded-full flex items-center justify-center text-2xl shadow-md">
                            ✓
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-[#111827] mb-2">Purchase Successful!</h2>
                    <p className="text-sm text-gray-600">Thank you for your purchase. Your photo is now available in your account.</p>
                </div>

                {/* Bottom Body Content */}
                <div className="p-8">
                    <div className="bg-[#F5F5F5] border border-[#C6C6CD] rounded-2xl p-4 flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4 text-left">
                            <img src={image} alt={title} className="w-16 h-16 rounded-xl object-cover border border-[#C6C6CD]" />
                            <div>
                                <h4 className="font-bold text-[#111827]">{title}</h4>
                                <p className="text-xs text-gray-500">by {author}</p>
                            </div>
                        </div>
                        <div className="text-xl font-bold text-[#111827]">${price}</div>
                    </div>

                    <div className="border border-[#C6C6CD] rounded-2xl p-5 mb-8 text-left text-sm space-y-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Transaction Details</p>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-500 text-xs">Transaction ID</p>
                                <p className="font-medium text-[#111827] text-sm mt-0.5">TXN-9824-LX7</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Date</p>
                                <p className="font-medium text-[#111827] text-sm mt-0.5">October 24, 2024</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div>
                                <p className="text-gray-500 text-xs">Payment Method</p>
                                <p className="font-medium text-[#111827] text-sm mt-0.5 flex items-center gap-1.5">
                                    <span>💳</span> •••• 4242
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">License</p>
                                <p className="font-medium text-[#111827] text-sm mt-0.5">Standard Commercial</p>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleDownloadPhoto}
                        disabled={isDownloading}
                        className="w-full bg-secondary text-white py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md cursor-pointer disabled:opacity-70"
                    >
                        <FaDownload /> {isDownloading ? "Downloading..." : "Download Photo"}
                    </button>
                </div>
            </div>
        );
    }

    // Checkout Form Screen
    return (
        <div className="max-w-6xl mx-auto my-8 px-4">
            <h1 className="text-3xl font-bold text-[#111827] mb-8">Checkout</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Order Summary */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white border border-[#C6C6CD] rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-[#111827] mb-4">Order Summary</h3>
                        
                        <div className="flex items-center gap-4 pb-6 border-b border-[#C6C6CD]">
                            <img src={image} alt={title} className="w-16 h-16 rounded-xl object-cover border border-[#C6C6CD]" />
                            <div>
                                <h4 className="font-bold text-[#111827]">{title}</h4>
                                <p className="text-xs text-gray-500">@{author}</p>
                            </div>
                            <div className="ml-auto font-bold text-[#111827]">${price}</div>
                        </div>

                        <div className="py-4 flex justify-between text-sm border-b border-[#C6C6CD]">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-medium text-[#111827]">${price}</span>
                        </div>

                        <div className="pt-4 flex justify-between items-center">
                            <span className="text-lg font-bold text-[#111827]">Total</span>
                            <span className="text-2xl font-bold text-[#111827]">${price}</span>
                        </div>
                    </div>

                    <div className="bg-[#F5F5F5] border border-[#C6C6CD] rounded-2xl p-4 flex items-start gap-3 text-xs text-gray-600">
                        <FaShieldAlt className="text-lg text-[#111827] shrink-0 mt-0.5" />
                        <p>Secure payment processed through PayPal. Your information is encrypted.</p>
                    </div>
                </div>

                {/* Right Side: Buyer Info & Payment Method */}
                <div className="lg:col-span-7 space-y-6">
                    <form onSubmit={handlePaymentSubmit} className="space-y-6">
                        {/* Buyer Information Box */}
                        <div className="bg-white border border-[#C6C6CD] rounded-2xl p-6 shadow-sm space-y-4">
                            <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2 border-b border-[#C6C6CD] pb-3">
                                <span>👤</span> Buyer Information
                            </h3>
                            
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="Jane Doe" 
                                    className="w-full border border-[#C6C6CD] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" 
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
                                <input 
                                    type="email" 
                                    required 
                                    placeholder="jane.doe@example.com" 
                                    className="w-full border border-[#C6C6CD] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" 
                                />
                                <p className="text-[11px] text-gray-400 mt-1">We'll send your high-resolution download link here.</p>
                            </div>
                        </div>

                        {/* Payment Method Box */}
                        <div className="bg-white border border-[#C6C6CD] rounded-2xl p-6 shadow-sm space-y-4">
                            <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2 border-b border-[#C6C6CD] pb-3">
                                <span>💳</span> Payment Method
                            </h3>

                            <div className="border border-[#111827] rounded-xl p-4 flex items-center justify-between bg-white cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <input type="radio" defaultChecked className="accent-secondary w-4 h-4" />
                                    <div>
                                        <p className="font-bold text-sm text-[#111827]">PayPal</p>
                                        <p className="text-xs text-gray-500">Pay securely with your PayPal account or credit card.</p>
                                    </div>
                                </div>
                                <span className="font-bold text-sm border px-2 py-1 rounded bg-gray-50">P</span>
                            </div>

                            <button 
                                type="submit" 
                                className="w-full bg-secondary text-white py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md mt-6 cursor-pointer"
                            >
                                Continue with PayPal →
                            </button>
                            
                            <p className="text-[11px] text-center text-gray-400 mt-2">
                                By clicking "Continue with PayPal", you agree to our <span className="underline cursor-pointer">Terms of Service</span>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ByCheckOut;