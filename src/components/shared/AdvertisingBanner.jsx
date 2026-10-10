
import bannerImage from "../../assets/images/advertising-banner.jpg";

const AdvertisingBanner = () => {
  return (
    <section className="px-4 py-6 sm:px-6">
      <div
        className="relative mx-auto flex min-h-[190px] h-[220px] md:h-[400px] max-w-[1280px] items-center justify-center overflow-hidden rounded-lg bg-cover bg-center px-5 py-8 sm:min-h-[220px] sm:px-10"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/65" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-[850px] text-center">
          <p className="text-sm font-medium leading-relaxed text-white sm:text-base">
            Turn your website traffic into revenue by enabling targeted
            advertising. Our platform allows businesses to showcase their
            products and services directly to your audience through
            strategically placed ads.
          </p>

          <a
            href="https://www.e-commerce.com"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-[24px] font-medium text-[#FFC300] transition-opacity hover:opacity-80"
          >
            www.e-commerce.com
          </a>
        </div>
      </div>
    </section>
  );
};

export default AdvertisingBanner;
