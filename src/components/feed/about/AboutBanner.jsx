import aboutImg from "../../../assets/images/about.jpg";

/**
 * About Component: Renders a full-width hero/about section with a background image,
 * left-side dark blue gradient, badge, title, description, and action buttons.
 */
const AboutBanner = () => {
    return (
        <section className="relative w-full min-h-[400px] lg:h-[700px] flex items-center overflow-hidden">

            {/* Background Image with Full Width */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${aboutImg})` }}
            >
                {/* Left-side Dark Blue Gradient Overlay (#1B1E56) for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1B1E56] via-[#1B1E56]/80 to-transparent"></div>
            </div>

            {/* Content Container (Max width aligned with max-w-main / max-w-7xl) */}
            <div className="relative z-10 w-full max-w-main mx-auto px-4 sm:px-6 lg:px-8 md:py-section">
                <div className="max-w-2xl">

                    {/* Top Badge */}
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/20 px-4 py-1 backdrop-blur-sm">
                        <span
                            className="h-2 w-2 shrink-0 rounded-full bg-[#05DF72]"
                            aria-hidden="true"
                        />
                        <span className="text-xs  md:text-xl font-semibold text-white font-manrope">
                            Empowering Creative Visuals
                        </span>
                    </div>

                    {/* Main Title: White, 64px, SemiBold */}
                    <h1 className="font-manrope font-semibold text-xl sm:text-2xl lg:text-5xl leading-tight text-white mb-6">
                        About My12Photos
                    </h1>

                    {/* Description: White/Light Gray, 20px, Regular */}
                    <p className="font-manrope font-normal  text-xs sm:text-base md:text-xl lg:text-2xl leading-relaxed text-gray-200 mb-8">
                        Discover a global photography community where creativity is celebrated, stories are shared, and talented photographers compete for monthly recognition and cash prizes.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Join Now Button (#EE1C25) */}
                        <button className="cursor-pointer px-8 py-2 md:py-3.5 bg-secondary hover:bg-red-700 text-white font-manrope font-medium rounded-full transition-colors duration-200 shadow-md text-xs sm:text-base md:text-xl">
                            Join Now
                        </button>

                        {/* Learn How It Works Button (#4048CD) */}
                        <button className="px-8 cursor-pointer py-2 md:py-3.5 bg-primary hover:bg-blue-800 text-white font-manrope font-medium rounded-full transition-colors duration-200 shadow-md text-xs sm:text-base md:text-xl">
                            Learn How It Works
                        </button>
                    </div>

                </div>
            </div>

        </section>
    );
};

export default AboutBanner;