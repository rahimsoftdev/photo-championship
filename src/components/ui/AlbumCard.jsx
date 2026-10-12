import { HiCamera, HiBookOpen, HiSparkles } from "react-icons/hi2";
import { BsCheck } from "react-icons/bs";

/**
 * AlbumCard Component: Renders an individual competition album card with features, pricing, and dynamic icons.
 */
const AlbumCard = ({ album }) => {
  const { title, description, badge, isPopular, features, price, priceSub, buttonText, iconType } = album;

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

  return (
    <div className={`relative bg-white rounded-2xl p-6 sm:p-8 border border-[rgba(0,0,0,0.16)] ${isPopular ? 'shadow-xl' : 'shadow-sm'} flex flex-col justify-between transition-all duration-300`}>
      
      {/* Most Popular Badge */}
      {badge && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-[#4048CD] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider font-manrope">
            {badge}
          </span>
        </div>
      )}

      <div>
        {/* Card Icon Container */}
        <div className="w-[56px] h-[57px] bg-[#FDE8E9] p-3 rounded-[8px] flex items-center justify-center mb-6">
          {renderIcon(iconType)}
        </div>

        {/* Card Title */}
        <h3 className="font-manrope font-semibold text-2xl sm:text-[32px] leading-tight sm:leading-[28px] text-[#0D0D14] mb-3">
          {title}
        </h3>

        {/* Card Description */}
        <p className="font-manrope font-normal text-sm sm:text-[16px] leading-relaxed text-[#6B7280] mb-6">
          {description}
        </p>

        {/* Features List */}
        <ul className="space-y-3 mb-2  border-gray-100 pt-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center font-manrope font-normal text-[14px] leading-[20px] text-[#111827]">
              <BsCheck className="w-5 h-5 text-[#EE1C25] mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        {/* Pricing Section */}
        <div className="flex items-baseline mb-6">
          <span className="text-2xl sm:text-[32px] font-extrabold text-[#4048CD] font-manrope">{price}</span>
          <span className="text-[16px] font-normal text-[#1B1E56] ml-1 font-manrope">{priceSub}</span>
        </div>

        {/* Action Button */}
        <button className="w-full py-3.5 px-4 bg-[#EE1C25] hover:bg-red-700 text-white font-manrope font-semibold rounded-full transition-colors duration-200 flex items-center justify-center space-x-2">
          <span>{buttonText}</span>
          <span>→</span>
        </button>
      </div>

    </div>
  );
};

export default AlbumCard;