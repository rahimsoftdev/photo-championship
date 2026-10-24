const steps = [
  {
    number: "01",
    title: "Create an Account",
    description:
      "Sign up for free in seconds. No fees, no hidden costs — ever.",
  },
  {
    number: "02",
    title: "Submit Your Photos",
    description:
      "Choose a competition category and upload your best work before the deadline.",
  },
  {
    number: "03",
    title: "Earn Votes",
    description:
      "The photography community votes for their favourites. The more votes, the higher your rank.",
  },
  {
    number: "04",
    title: "Claim Your Prize",
    description:
      "Winners receive cash prizes via PayPal. Fast, transparent, and reliable.",
  },
];

const HowItWorks = ({pb}) => {
  return (
    <section className={`bg-white ${pb ? 'pt-10 sm:pt-12 md:pt-16 lg:pt-section' : 'py-10 sm:py-12 md:py-16 lg:py-section'} `}>
      <div className="mx-auto grid w-full max-w-main grid-cols-1 items-center gap-8 px-4 sm:gap-10 sm:px-6 md:px-8 lg:grid-cols-2 lg:gap-12 xl:gap-20 2xl:gap-28">

        {/* Left Content */}
        <div className="w-full min-w-0">
          <span className="mb-3 block text-xs font-bold uppercase tracking-wide text-redText sm:mb-4 sm:text-sm md:text-base">
            How it works
          </span>

          <h2 className="text-xl sm:text-2xl font-extrabold leading-tight tracking-tight text-titleText md:text-3xl ">
            From Photo to Prize
            <br />
            in 4 Steps
          </h2>

          <p className="mt-4 max-w-xl text-xs sm:text-base leading-relaxed text-subTitleText sm:mt-5 sm:text-base md:text-lg lg:text-xl">
            A simple, transparent process. Join thousands of
            photographers who have already won.
          </p>
        </div>

        {/* Right Timeline */}
        <div className="w-full min-w-0">
          <div className="relative flex flex-col gap-6 sm:gap-7 md:gap-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative flex min-w-0 items-start gap-3 sm:gap-4"
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="absolute bottom-[-28px] left-[19px] top-[20px] w-px -translate-x-1/2 bg-[rgba(0,0,0,0.08)] sm:bottom-[-32px] sm:left-[21.5px] sm:top-[22px]"
                  />
                )}

                {/* Number Counter */}
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[rgba(227,24,55,0.08)] text-[11px] font-bold text-redText sm:h-11 sm:w-11 sm:text-xs">
                  {step.number}
                </div>

                {/* Step Details */}
                <div className="min-w-0 flex-1 pt-0.5">
                  <h3 className="break-words text-sm font-extrabold leading-snug text-titleText min-[350px]:text-base sm:text-lg md:text-xl">
                    {step.title}
                  </h3>

                  <p className="mt-1 break-words text-xs leading-relaxed text-subTitleText min-[350px]:text-sm sm:text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
