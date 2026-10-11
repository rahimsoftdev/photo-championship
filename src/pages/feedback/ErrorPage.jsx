import { Link } from "react-router";
import { FiAperture, FiAlertTriangle, FiRefreshCw, FiArrowLeft } from "react-icons/fi";

/**
 * Displays a branded error page with retry and home navigation actions.
 */
const ErrorPage = ({
  title = "Something went wrong",
  message = "We couldn't load your photos right now. Please try again in a moment.",
  onRetry,
}) => {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAFAFF] px-5 py-12 font-inter text-titleText">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary/6 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />

      <section className="relative flex w-full max-w-lg flex-col items-center text-center">
        {/* Brand identity */}
        <Link to="/" className="mb-12 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
            <FiAperture size={24} />
          </div>

          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-primary">My12</span>Photos
          </span>
        </Link>

        {/* Error illustration */}
        <div className="relative mb-9 flex h-40 w-40 items-center justify-center rounded-[2.5rem] border border-[#E8E9F8] bg-white shadow-xl shadow-primary/5">
          <div className="absolute inset-3 rounded-[2rem] border border-dashed border-primary/20" />

          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#FFF0F1] text-secondary">
            <FiAlertTriangle size={46} strokeWidth={1.5} />
          </div>

          <span className="absolute -right-2 top-5 h-4 w-4 rounded-full bg-primary" />
          <span className="absolute -bottom-1 left-6 h-3 w-3 rounded-full bg-secondary" />
        </div>

        {/* Error message */}
        <div className="mb-8 space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">
            Unexpected error
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {title}
            <span className="text-secondary">.</span>
          </h1>

          <p className="mx-auto max-w-sm text-sm leading-6 text-subTitleText sm:text-base">
            {message}
          </p>
        </div>

        {/* Recovery actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90"
            >
              <FiRefreshCw size={17} />
              Try Again
            </button>
          )}

          <Link
            to="/"
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-5 text-sm font-semibold text-titleText transition hover:border-primary/30 hover:bg-primary/5"
          >
            <FiArrowLeft size={17} />
            Back to Home
          </Link>
        </div>

        {/* Brand footer */}
        <p className="mt-9 text-xs text-subTitleText">
          Every photo has a story.{" "}
          <span className="text-secondary">♥</span>
        </p>
      </section>
    </main>
  );
};

export default ErrorPage;