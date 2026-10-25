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

    // Ei duto block tomar component er bhitore ager jaygay boshaba
    // (if (isSuccess) { return (...) } ar niche final return (...)).

    if (isSuccess) {
        // Success Screen (Image onujayi exact layout ebong #EDEEEF background)
        return (
            // Outer wrapper gives side spacing on small screens
            <div className="w-full px-4 sm:px-6">
                <div className="mx-auto my-6 w-full max-w-xl overflow-hidden rounded-2xl border border-[#C6C6CD] bg-white shadow-sm sm:my-10 sm:rounded-3xl lg:my-12">

                    {/* Top Gray Header Section with #EDEEEF */}
                    <div className="border-b border-[#C6C6CD] bg-[#EDEEEF] px-4 py-8 text-center sm:px-8 sm:py-10">
                        <div className="mb-4 flex justify-center">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#111827] text-xl text-white shadow-md  sm:size-16 sm:text-2xl">
                                ✓
                            </div>
                        </div>
                        <h2 className="mb-2 text-base font-bold text-[#111827] sm:text-2xl">
                            Purchase Successful!
                        </h2>
                        <p className="mx-auto max-w-md text-xs leading-relaxed text-gray-600 sm:text-sm">
                            Thank you for your purchase. Your photo is now available in your account.
                        </p>
                    </div>

                    {/* Bottom Body Content */}
                    <div className="p-4 sm:p-6 md:p-8">
                        {/* Purchased item */}
                        <div className="mb-5 flex  items-center justify-center gap-3 rounded-2xl border border-[#C6C6CD] bg-[#F5F5F5] p-3 sm:mb-6 sm:p-4">
                            <div className="flex flex-col justify-center sm:flex-row min-w-0 items-center gap-3 text-left sm:gap-4">
                                <img
                                    src={image}
                                    alt={title}
                                    className="size-14 shrink-0 rounded-xl border border-[#C6C6CD] object-cover sm:size-16"
                                />
                                <div className="min-w-0 max-sm:text-center">
                                    <h4 className="break-words text-sm font-bold text-[#111827] sm:text-base">
                                        {title}
                                    </h4>
                                    <p className="break-words text-xs text-gray-500">by {author}</p>
                                </div>
                                <div className="shrink-0 text-lg font-bold text-[#111827] sm:text-xl">
                                    ${price}
                                </div>
                            </div>
                        </div>

                        {/* Transaction details */}
                        <div className="mb-6 space-y-4 rounded-2xl border border-[#C6C6CD] p-4 text-left text-sm sm:mb-8 sm:p-5">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                Transaction Details
                            </p>

                            <div className="sm:grid grid-cols-2 gap-3 sm:gap-4">
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500">Transaction ID</p>
                                    <p className="mt-0.5 break-all text-sm font-medium text-[#111827]">
                                        TXN-9824-LX7
                                    </p>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500">Date</p>
                                    <p className="mt-0.5 break-words text-sm font-medium text-[#111827]">
                                        October 24, 2024
                                    </p>
                                </div>
                            </div>

                            <div className="sm:grid grid-cols-2 gap-3 pt-2 sm:gap-4">
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500">Payment Method</p>
                                    <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-[#111827]">
                                        <span>💳</span> •••• 4242
                                    </p>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500">License</p>
                                    <p className="mt-0.5 break-words text-sm font-medium text-[#111827]">
                                        Standard Commercial
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleDownloadPhoto}
                            disabled={isDownloading}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-secondary py-2 text-sm font-medium text-white shadow-md transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70 sm:py-3.5 sm:text-base"
                        >
                            <FaDownload /> {isDownloading ? "Downloading..." : "Download Photo"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Checkout Form Screen
    return (
        <div className="mx-auto my-6 w-full max-w-6xl px-4 sm:my-8 sm:px-6 lg:px-8">
            <h1 className="mb-2 text-2xl font-bold text-[#111827] sm:mb-5 sm:text-3xl max-sm:text-center">
                Checkout
            </h1>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
                {/* Left Side: Order Summary (sticky on large screens) */}
                <div className="space-y-4 sm:space-y-6 lg:sticky lg:top-6 lg:col-span-5 lg:self-start">
                    <div className="rounded-2xl border border-[#C6C6CD] bg-white p-4 shadow-sm sm:p-6">
                        <h3 className="mb-4 text-sm font-bold text-[#111827] sm:text-lg  max-sm:text-center ">
                            Order Summary
                        </h3>

                        <div className="flex flex-col sm:flex-row  items-center gap-3 border-b border-[#C6C6CD] pb-5 sm:gap-4 sm:pb-6 max-sm:text-center  ">
                            <img
                                src={image}
                                alt={title}
                                className="size-14 shrink-0 rounded-xl border border-[#C6C6CD] object-cover sm:size-16"
                            />
                            <div className="min-w-0 flex-1">
                                <h4 className="break-words text-sm font-bold text-[#111827] sm:text-base">
                                    {title}
                                </h4>
                                <p className="break-words text-xs text-gray-500">@{author}</p>
                            </div>
                            <div className="shrink-0 text-sm font-bold text-[#111827] sm:text-base">
                                ${price}
                            </div>
                        </div>

                        <div className="flex justify-between gap-3 border-b border-[#C6C6CD] py-4 text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-medium text-[#111827]">${price}</span>
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-4">
                            <span className="text-base font-bold text-[#111827] sm:text-lg">Total</span>
                            <span className="text-xl font-bold text-[#111827] sm:text-2xl">${price}</span>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-2xl border border-[#C6C6CD] bg-[#F5F5F5] p-3 text-xs leading-relaxed text-gray-600 sm:p-4">
                        <FaShieldAlt className="mt-0.5 shrink-0 text-lg text-[#111827]" />
                        <p>Secure payment processed through PayPal. Your information is encrypted.</p>
                    </div>
                </div>

                {/* Right Side: Buyer Info & Payment Method */}
                <div className="space-y-4 sm:space-y-6 lg:col-span-7">
                    <form onSubmit={handlePaymentSubmit} className="space-y-4 sm:space-y-6">
                        {/* Buyer Information Box */}
                        <div className="space-y-4 rounded-2xl border border-[#C6C6CD] bg-white p-4 shadow-sm sm:p-6">
                            <h3 className="flex flex-col sm:flex-row items-center gap-2 border-b border-[#C6C6CD] pb-3 text-base font-bold text-[#111827] text-sm sm:text-lg  ">
                                <span>👤</span> Buyer Information
                            </h3>

                            <div>
                                <label
                                    htmlFor="buyer-name"
                                    className="mb-1 block text-xs font-semibold text-gray-600 sm:text-sm"
                                >
                                    Full Name
                                </label>
                                {/* text-base (16px) stops iOS from zooming in on focus */}
                                <input
                                    id="buyer-name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    placeholder="Jane Doe"
                                    className="w-full rounded border border-[#C6C6CD] px-4 py-1 sm:py-2.5 text-base focus:border-primary focus:outline-none"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="buyer-email"
                                    className="mb-1 block text-xs font-semibold text-gray-600 sm:text-sm"
                                >
                                    Email Address
                                </label>
                                <input
                                    id="buyer-email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="jane.doe@example.com"
                                    className="w-full rounded border border-[#C6C6CD] py-1 px-4 sm:py-2.5 text-base focus:border-primary focus:outline-none"
                                />
                                <p className="mt-1 text-xs mt-2 text-gray-400">
                                    We'll send your high-resolution download link here.
                                </p>
                            </div>
                        </div>

                        {/* Payment Method Box */}
                        <div className="space-y-4 rounded-2xl border border-[#C6C6CD] bg-white p-4 shadow-sm sm:p-6">
                            <h3 className="flex flex-col sm:flex-row items-center gap-2 border-b border-[#C6C6CD] pb-3 text-base font-bold text-[#111827] text-sm sm:text-lg  ">
                                <span>💳</span> Payment Method
                            </h3>

                            {/* label so tapping anywhere on the card selects the radio */}
                            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#111827] bg-white p-3 sm:p-4">
                                <div className="flex min-w-0 items-start gap-3">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        defaultChecked
                                        className="mt-1 size-4 shrink-0 accent-secondary"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-[#111827]">PayPal</p>
                                        <p className="text-xs leading-relaxed text-gray-500">
                                            Pay securely with your PayPal account or credit card.
                                        </p>
                                    </div>
                                </div>
                                <span className="shrink-0 rounded border bg-gray-50 px-2 py-1 text-sm font-bold">
                                    P
                                </span>
                            </label>

                            <button
                                type="submit"
                                className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-secondary py-2 text-sm font-medium text-white shadow-md transition-all hover:opacity-95 sm:mt-6 sm:py-2.5 sm:text-base"
                            >
                                Continue with PayPal →
                            </button>

                            <p className="mt-2 text-center text-xs leading-relaxed text-gray-400">
                                By clicking "Continue with PayPal", you agree to our{" "}
                                <span className="cursor-pointer underline">Terms of Service</span>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ByCheckOut;