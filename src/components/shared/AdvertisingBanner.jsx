
import { useLocation } from "react-router";
import bannerImage from "../../assets/images/advertising-banner.jpg";

const AdvertisingBanner = () => {
  const location = useLocation()
  console.log(location.pathname, 'c')
  return (
   <section className={`px-4 pb-10 min-[350px]:px-4 sm:px-6 sm:pb-12 md:px-8 lg:pb-section ${location.pathname.trim() === '/' && ' pt-10 sm:pt-12  lg:pt-section '}`}>
  <div
    className="relative mx-auto flex min-h-[190px] h-[220px] md:h-[400px] max-w-main items-center justify-center overflow-hidden rounded-lg bg-cover bg-center px-5 py-8 sm:min-h-[220px] sm:px-10"
    style={{ backgroundImage: `url(${bannerImage})` }}
  >
    {/* Dark overlay */}
    <div className="absolute inset-0 bg-black/65" />

    {/* Content */}
    <div className="relative z-10 mx-auto w-full max-w-[850px] text-center">
      <p className="text-xs font-medium leading-relaxed text-white min-[400px]:text-sm sm:text-base">
        Turn your website traffic into revenue by enabling targeted
        advertising. Our platform allows businesses to showcase their
        products and services directly to your audience through
        strategically placed ads.
      </p>

      <a
        href="https://www.e-commerce.com"
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-block break-all text-base font-medium text-[#FFC300] transition-opacity hover:opacity-80 min-[400px]:text-lg sm:mt-3 sm:text-xl md:text-2xl"
      >
        www.e-commerce.com
      </a>
    </div>
  </div>
</section>
  );
};

export default AdvertisingBanner;
