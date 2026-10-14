import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

const ArtworkImages = ({ images = [] }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isVisible, setIsVisible] = useState(true);

  // URL query params (index) theke current index nia asha, na thakle 0
  const queryIndex = parseInt(searchParams.get("index")) || 0;
  const currentIndex = queryIndex < images.length && queryIndex >= 0 ? queryIndex : 0;

  useEffect(() => {
    setIsVisible(true);
  }, [currentIndex, images]);

  const changeImage = (newIndex) => {
    if (newIndex === currentIndex) return;

    setIsVisible(false);

    // Allow the fade-out animation to finish before changing the image & updating URL search params.
    setTimeout(() => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("index", newIndex);
        return newParams;
      });
      setIsVisible(true);
    }, 200);
  };

  const handlePrevious = () => {
    const newIndex =
      currentIndex === 0 ? images.length - 1 : currentIndex - 1;

    changeImage(newIndex);
  };

  const handleNext = () => {
    const newIndex =
      currentIndex === images.length - 1 ? 0 : currentIndex + 1;

    changeImage(newIndex);
  };

  if (!images.length) {
    return (
      <div className="mx-auto flex min-h-64 w-full max-w-main items-center justify-center rounded-xl bg-gray-100">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const hasMultipleImages = images.length > 1;

  return (
    <section className="mx-auto w-full max-w-main">
      <div className="relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
        {/* Main Image */}
        <img
          src={images[currentIndex]}
          alt={`Artwork image ${currentIndex + 1}`}
          className={`block max-h-[650px] w-full object-cover transition-opacity duration-300 ease-in-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Carousel Controls */}
        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={handlePrevious}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-2xl text-white transition-colors duration-200 hover:bg-black/80 sm:left-5 sm:size-12"
            >
              &#8249;
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-2xl text-white transition-colors duration-200 hover:bg-black/80 sm:right-5 sm:size-12"
            >
              &#8250;
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/65 px-4 py-1.5 text-sm text-white">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ArtworkImages;