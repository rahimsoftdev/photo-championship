import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useProduct from '../../hooks/useProduct';

const ProductDetaisPage = () => {
    const { id } = useParams();
    const product = useProduct(id);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPurchased, setIsPurchased] = useState(false);
    const [activeImage, setActiveImage] = useState(null);

    // useProduct ekta object ba array dile duita-i handle kore
    const item = Array.isArray(product?.data) ? product.data[0] : product?.data;

    // Modal open thakle page scroll lock
    useEffect(() => {
        if (isModalOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';

            return () => {
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [isModalOpen]);

    // ESC diye modal close
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') closeModal();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const openModal = () => {
        setIsPurchased(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsPurchased(false);
    };

    const handleConfirm = () => {
        // ekhane real order API call korte paro
        setIsPurchased(true);
    };

    if (product?.isLoading || product?.isPending) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
            </div>
        );
    }

    if (!item) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center px-4 text-center text-gray-500">
                Product not found.
            </div>
        );
    }

    const mainImage = activeImage || item.bannerImage;
    const allImages = [item.bannerImage, ...(item.othersImages || [])];

    return (
        <>
            {/* Page content - modal open hole blur hobe */}
            <section
                className={`w-full min-h-screen bg-gray-50 transition duration-300 ${
                    isModalOpen ? 'blur-sm pointer-events-none select-none' : ''
                }`}
            >
                <div className="mx-auto w-full  ">
                    <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2 lg:gap-12">
                        {/* Images */}
                        <div className="w-full">
                            <div className="w-full overflow-hidden rounded-2xl bg-white shadow-sm">
                                <img
                                    src={mainImage}
                                    alt={item.collectionTitle}
                                    className="aspect-[4/3] w-full object-cover sm:aspect-[16/10] lg:aspect-[4/3]"
                                />
                            </div>

                            {allImages.length > 1 && (
                                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                                    {allImages.map((img, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setActiveImage(img)}
                                            className={`overflow-hidden rounded-xl border-2 transition ${
                                                mainImage === img
                                                    ? 'border-black'
                                                    : 'border-transparent hover:border-gray-300'
                                            }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`${item.collectionTitle} ${index + 1}`}
                                                className="aspect-square w-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="flex flex-col justify-center rounded-2xl bg-white p-5 shadow-sm sm:p-8">
                            <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-gray-600 sm:text-sm">
                                {item.category}
                            </span>

                            <h1 className="mt-4 text-xl font-bold leading-tight text-gray-900 sm:text-2xl lg:text-3xl xl:text-4xl">
                                {item.collectionTitle}
                            </h1>

                            <p className="mt-3 text-sm font-medium text-amber-600 sm:text-base">
                                {item.editionSize}
                            </p>

                            <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base lg:text-lg">
                                {item.description}
                            </p>

                            <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-3xl font-bold text-gray-900 sm:text-4xl">
                                    {item.price}
                                </p>

                                <button
                                    type="button"
                                    onClick={openModal}
                                    className="w-full rounded-xl bg-black px-8 py-3.5 text-base font-semibold text-white transition hover:bg-gray-800 active:scale-95 sm:w-auto"
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center overflow-hidden bg-black/50 backdrop-blur-md sm:items-center sm:p-4"
                    onClick={closeModal}
                    role="dialog"
                    aria-modal="true"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-md sm:rounded-3xl sm:p-8"
                    >
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={closeModal}
                            aria-label="Close"
                            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-600 transition hover:bg-gray-200"
                        >
                            &times;
                        </button>

                        {!isPurchased ? (
                            <div className="pt-2">
                                <h2 className="pr-10 text-xl font-bold text-gray-900 sm:text-2xl">
                                    Confirm your order
                                </h2>

                                <div className="mt-5 flex items-center gap-4 rounded-2xl bg-gray-50 p-3">
                                    <img
                                        src={item.bannerImage}
                                        alt={item.collectionTitle}
                                        className="h-16 w-16 shrink-0 rounded-xl object-cover sm:h-20 sm:w-20"
                                    />
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                                            {item.collectionTitle}
                                        </p>
                                        <p className="text-xs text-gray-500 sm:text-sm">
                                            {item.editionSize}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4">
                                    <span className="text-gray-600">Total price</span>
                                    <span className="text-2xl font-bold text-gray-900">
                                        {item.price}
                                    </span>
                                </div>

                                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="w-full rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleConfirm}
                                        className="w-full rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 active:scale-95"
                                    >
                                        Confirm Order
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center py-6 text-center">
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                                    <svg
                                        className="h-10 w-10 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>

                                <h2 className="mt-5 text-2xl font-bold text-gray-900">
                                    Buy Successful!
                                </h2>
                                <p className="mt-2 text-sm text-gray-600 sm:text-base">
                                    Thank you for purchasing{' '}
                                    <span className="font-semibold">{item.collectionTitle}</span>.
                                </p>

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="mt-6 w-full rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 sm:w-auto sm:px-10"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductDetaisPage;