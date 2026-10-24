import { HiCamera, HiBookOpen, HiSparkles, HiPencilSquare } from "react-icons/hi2";
import { BsCheck } from "react-icons/bs";
import { Link } from "react-router";

/**
 * AlbumCard Component: Renders an individual competition album card with features, pricing, and dynamic icons.
 *
 * Normal mode (isEdit = false):
 *   "Enter Now" button navigates to the upload page with the albumType query param.
 *   Example: /user-dashboard/artwork-management/UploadArtWork?albumType=single
 *
 * Admin mode (isEdit = true):
 *   Shows an "Edit Album" button with an edit icon instead of "Enter Now".
 *   Clicking it calls onEdit(album) so the parent can open the edit modal.
 */
const AlbumCard = ({ album, isEdit = false, onEdit }) => {
  const {
    title,
    description,
    badge,
    isPopular,
    features = [],
    price,
    priceSub,
    buttonText,
    iconType,
    albumType = "single",
  } = album;

  // Render appropriate icon based on the iconType prop
  const renderIcon = (type) => {
    switch (type) {
      case "Camera":
        return <HiCamera className="w-8 h-8 text-[#D91922]" />;
      case "BookOpen":
        return <HiBookOpen className="w-8 h-8 text-[#D91922]" />;
      case "Sparkles":
        return <HiSparkles className="w-8 h-8 text-[#D91922]" />;
      default:
        return null;
    }
  };

  const buttonClass =
    "w-full px-3 py-2 text-xs sm:px-4 sm:py-3 md:py-3 sm:text-sm md:text-base bg-[#EE1C25] hover:bg-red-700 text-white font-manrope font-semibold rounded-full transition-colors duration-200 flex items-center justify-center gap-2";

  return (


    <div
      className={`relative flex h-full min-w-0 flex-col justify-between rounded-2xl border border-[rgba(0,0,0,0.16)] bg-white p-4 transition-all duration-300 sm:p-5 md:p-6 lg:p-8 ${isPopular ? "shadow-xl" : "shadow-sm"
        }`}
    >
      {/* Most Popular Badge */}
      {badge && (
        <div className="absolute -top-3 left-1/2 z-10 max-w-[90%] -translate-x-1/2">
          <span className="block whitespace-nowrap rounded-full bg-[#4048CD] px-3 py-1 text-center font-manrope text-[10px] font-semibold uppercase tracking-wider text-white sm:text-xs">
            {badge}
          </span>
        </div>
      )}

      <div>
        {/* Card Icon */}
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#FDE8E9] p-2 sm:mb-5 sm:h-12 sm:w-12 md:mb-6 md:h-14 md:w-14">
          {renderIcon(iconType)}
        </div>

        {/* Card Title */}
        <h3 className="mb-2 break-words font-manrope text-xl font-semibold leading-tight text-[#0D0D14] sm:mb-3 sm:text-2xl  ">
          {title}
        </h3>

        {/* Card Description */}
        <p className="mb-2 break-words font-manrope text-xs font-normal leading-relaxed text-[#6B7280] sm:mb-5 sm:text-sm md:text-base line-clamp-2">
          {description}
        </p>

        {/* Features List */}
        <ul className="space-y-2 pt-1 sm:space-y-2.5 md:space-y-3">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex min-w-0 items-start font-manrope text-xs font-normal leading-relaxed text-[#111827] sm:text-sm lg:text-base"
            >
              <BsCheck className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-[#EE1C25] sm:h-5 sm:w-5" />
              <span className="min-w-0 break-words">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pricing and Action */}
      <div className="mt-2 sm:mt-6">
        {/* Pricing */}
        <div className="mb-2 flex flex-wrap items-baseline gap-x-1.5 gap-y-1 sm:mb-5">
          <span className="break-words font-manrope text-xl font-extrabold leading-tight text-[#4048CD] sm:text-2xl ">
            {price}
          </span>

          <span className="font-manrope text-xs font-normal text-[#1B1E56] sm:text-sm md:text-base max-md:my-3">
            {priceSub}
          </span>
        </div>

        {/* Action Button - Existing Style Preserved */}
        {isEdit ? (
          <button
            type="button"
            onClick={() => onEdit && onEdit(album)}
            className={`${buttonClass} w-full`}
          >
            <HiPencilSquare className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
            <span className="min-w-0 text-xs sm:text-sm md:text-base">
              Edit Album
            </span>
          </button>
        ) : (
          <Link
            to={`/user-dashboard/artwork-management/UploadArtWork?albumType=${encodeURIComponent(albumType)}`}
            className={`${buttonClass} w-full`}
          >
            <span className="min-w-0 text-xs sm:text-sm md:text-base">
              {buttonText}
            </span>
            <span className="flex-shrink-0">→</span>
          </Link>
        )}
      </div>
    </div>


  );
};

export default AlbumCard;