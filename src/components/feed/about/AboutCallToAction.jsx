import React from 'react';

const AboutCallToAction = () => {
    return (
        // Main section container with responsive padding
        <section className="max-w-main mx-auto mt-3 px-4 md:px-5 bg-white flex justify-center">

            {/* Outer wrapper card with max-w-main and rgba border */}
            <div className="w-full  border border-[rgba(0,0,0,0.38)] rounded-3xl py-10 sm:py-12 lg:py-section px-6 md:px-12 text-center flex flex-col items-center shadow-sm">

                {/* Top small tag / badge */}
                <span className="text-primary font-bold text-sm sm:text-base tracking-wider uppercase mb-3">
                    No Fee to Register
                </span>

                {/* Main section heading */}
                <h2 className="text-lg sm:text-xl md:text-3xl lg:text-5xl font-extrabold text-titleText leading-tight max-w-3xl mb-4">
                    Ready to Share Your Photography With the World?
                </h2>

                {/* Description / Subtitle */}
                <p className="text-xs sm:text-base md:text-lg text-subTitleText font-normal max-w-2xl leading-relaxed mb-8">
                    Join thousands of photographers competing every month. Upload your best work, receive community votes, and become our next monthly winner.
                </p>

                {/* Action Button */}
                <button className="bg-btn2 cursor-pointer hover:opacity-95 text-white font-semibold text-xs sm:text-base md:text-lg px-8 py-2 md:py-3 rounded-full transition-all duration-200 shadow-sm">
                    Join Now
                </button>

            </div>
        </section>
    );
};

export default AboutCallToAction;