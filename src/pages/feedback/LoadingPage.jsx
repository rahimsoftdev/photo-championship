import { useEffect, useState } from "react";
import { FiAperture } from "react-icons/fi";

const photos = [
  {
    src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=200&h=200&fit=crop",
    alt: "Mountain landscape",
  },
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=200&h=200&fit=crop",
    alt: "Nature landscape",
  },
  {
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    alt: "Portrait photography",
  },
  {
    src: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200&h=200&fit=crop",
    alt: "Ocean photography",
  },
  {
    src: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200&h=200&fit=crop",
    alt: "Flower photography",
  },
  {
    src: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=200&h=200&fit=crop",
    alt: "Night sky",
  },
  {
    src: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=200&h=200&fit=crop",
    alt: "Architecture photography",
  },
  {
    src: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=200&h=200&fit=crop",
    alt: "Sunrise landscape",
  },
  {
    src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    alt: "Portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=200&h=200&fit=crop",
    alt: "Outdoor photography",
  },
  {
    src: "https://images.unsplash.com/photo-1511497584788-876760111969?w=200&h=200&fit=crop",
    alt: "Forest photography",
  },
  {
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=200&fit=crop",
    alt: "Mountain photography",
  },
];

/**
 * Displays a branded loading screen inspired by My12Photos' 12-photo concept.
 */
const LoadingPage = () => {
  const [progress, setProgress] = useState(0);

  // Animate the progress indicator while the loading screen is visible.
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((current) => {
        if (current >= 90) return 90;
        return current + Math.floor(Math.random() * 4) + 1;
      });
    }, 180);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAFAFF] px-5 py-12 font-inter text-titleText">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#4048CD]/6 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-[#EE1C25]/5 blur-3xl" />

      <section className="relative flex w-full max-w-lg flex-col items-center text-center">
        {/* Brand logo */}
        <div className="mb-12 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
            <FiAperture size={24} />
          </div>

          <h1 className="text-xl font-extrabold tracking-tight">
            <span className="text-primary">championship  </span>Photos
          </h1>
        </div>

        {/* Twelve-photo loading mosaic */}
        <div className="relative mb-10 grid grid-cols-4 gap-2.5 sm:gap-3">
          {photos.map((photo, index) => (
            <div
              key={photo.src}
              className="group relative h-[68px] w-[68px] overflow-hidden rounded-2xl border border-white bg-white shadow-md shadow-slate-200/60 sm:h-[82px] sm:w-[82px]"
              style={{
                animation: "photoPulse 1.8s ease-in-out infinite",
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-primary/10" />
            </div>
          ))}

          {/* Floating center badge */}
          <div className="absolute left-1/2 top-1/2 flex h-[68px] w-[68px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border-4 border-[#FAFAFF] bg-primary text-white shadow-xl shadow-primary/30">
            <FiAperture size={32} className="animate-spin" />
          </div>
        </div>

        {/* Loading message */}
        <div className="mb-8 space-y-2">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Bringing your photos together<span className="text-secondary">.</span>
          </h2>

          <p className="mx-auto max-w-sm text-sm leading-6 text-subTitleText sm:text-base">
            Preparing your gallery, competitions, and creative space.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="w-full max-w-xs">
          <div className="mb-3 flex items-center justify-between text-xs font-semibold">
            <span className="text-primary">Preparing your experience</span>
            <span className="tabular-nums text-subTitleText">
              {progress}%
            </span>
          </div>

          <div
            className="h-1.5 overflow-hidden rounded-full bg-[#E8E9F8]"
            role="progressbar"
            aria-label="Loading progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div
              className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <p className="mt-8 text-xs text-subTitleText">
          Every photo has a story. <span className="text-secondary">♥</span>
        </p>
      </section>

      {/* Subtle animation for the photo tiles */}
      <style>{`
        @keyframes photoPulse {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.85;
          }
          50% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }
      `}</style>
    </main>
  );
};

export default LoadingPage;