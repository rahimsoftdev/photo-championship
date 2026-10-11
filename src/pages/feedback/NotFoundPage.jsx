import { Link } from "react-router";
import {
  FiAperture,
  FiArrowLeft,
  FiArrowUpRight,
  FiImage,
} from "react-icons/fi";

const photoTiles = [
  {
    src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=200&h=200&fit=crop",
    alt: "Mountain landscape",
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
    src: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=200&h=200&fit=crop",
    alt: "Nature photography",
  },
  {
    src: "https://images.unsplash.com/photo-1511497584788-876760111969?w=200&h=200&fit=crop",
    alt: "Forest photography",
  },
  {
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=200&fit=crop",
    alt: "Mountain photography",
  },
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=200&h=200&fit=crop",
    alt: "Landscape photography",
  },
  {
    src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    alt: "Portrait",
  },
];

/**
 * Displays a branded 404 page when a requested route is unavailable.
 */
const NotFound = () => {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAFAFF] px-5 py-12 font-inter text-titleText">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary/6 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />

      <section className="relative flex w-full max-w-lg flex-col items-center text-center">
        {/* Brand identity */}
        <Link
          to="/"
          aria-label="My12Photos home"
          className="mb-10 flex items-center gap-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
            <FiAperture size={24} />
          </div>

          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-primary">championship </span>Photos
          </span>
        </Link>

        {/* Photography-inspired 404 illustration */}
        <div className="relative mb-9">
          <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
            {photoTiles.map((photo, index) => (
              <div
                key={photo.src}
                className={`relative h-[58px] w-[58px] overflow-hidden rounded-xl border border-white bg-white shadow-md shadow-slate-200/60 sm:h-[68px] sm:w-[68px] ${
                  index === 1 || index === 10
                    ? "translate-y-2"
                    : index === 4 || index === 7
                      ? "-translate-y-2"
                      : ""
                }`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Floating 404 badge */}
          <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-3xl border-4 border-[#FAFAFF] bg-primary text-white shadow-xl shadow-primary/25 sm:h-28 sm:w-28">
            <FiImage size={25} />
            <span className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
              404
            </span>
          </div>

          {/* Decorative floating dot */}
          <span className="absolute -right-3 top-0 h-3 w-3 rounded-full bg-secondary" />
          <span className="absolute -bottom-1 -left-3 h-2.5 w-2.5 rounded-full bg-primary/50" />
        </div>

        {/* Error message */}
        <div className="mb-8 space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Oops! Wrong frame
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            This page is missing
            <span className="text-secondary">.</span>
          </h1>

          <p className="mx-auto max-w-sm text-sm leading-6 text-subTitleText sm:text-base">
            Looks like this photo took a different path. The page
            you're looking for doesn't exist or may have been moved.
          </p>
        </div>

        {/* Navigation actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90"
          >
            <FiArrowLeft size={18} />
            Back to Home
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-5 text-sm font-semibold text-titleText transition hover:border-primary/30 hover:bg-primary/5"
          >
            Go Back
            <FiArrowUpRight size={16} />
          </button>
        </div>

        {/* Footer message */}
        <p className="mt-9 text-xs text-subTitleText">
          Every photo has a story.{" "}
          <span className="text-secondary">♥</span>
        </p>
      </section>
    </main>
  );
};

export default NotFound;