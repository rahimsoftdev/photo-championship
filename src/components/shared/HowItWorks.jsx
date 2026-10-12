
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

// Explains how the platform works in four steps.
const HowItWorks = () => {
  return (
    <section className="bg-white py-section">
      <div className="mx-auto grid w-full max-w-main grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20 xl:gap-28">

        {/* Left Content */}
        <div className="w-full">
          <span className="mb-4 block text-base font-bold uppercase tracking-wide text-redText">
            How it works
          </span>

          <h2 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-titleText sm:text-5xl">
            From Photo to Prize
            <br />
            in 4 Steps
          </h2>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-subTitleText sm:text-xl">
            A simple, transparent process. Join thousands of
            photographers who have already won.
          </p>
        </div>

        {/* Right Timeline */}
        <div className="relative w-full">
          <div className="relative flex flex-col gap-7 sm:gap-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative flex items-start gap-4"
              >
                {/* Connector Line: Between Each Number */}
                {index < steps.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="absolute left-[21.5px] top-[22px] bottom-[-32px] w-px -translate-x-1/2 bg-[rgba(0,0,0,0.08)]"
                  />
                )}

                {/* Number Counter */}
                <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[rgba(227,24,55,0.08)] text-xs font-bold text-redText">
                  {step.number}
                </div>

                {/* Step Details */}
                <div className="min-w-0 flex-1 pt-0.5">
                  <h3 className="text-base font-extrabold leading-snug text-titleText sm:text-xl">
                    {step.title}
                  </h3>

                  <p className="mt-1 text-sm leading-relaxed text-subTitleText sm:text-base">
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
