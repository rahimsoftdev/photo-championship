
import { useState } from "react";
import { FiMail } from "react-icons/fi";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    // Connect your newsletter API here
    console.log("Subscribed email:", email);
    setEmail("");
  };

  return (
    <section className="px-4 pb-20 sm:px-6 ">
      <div className="relative mx-auto max-w-main   overflow-hidden rounded-lg bg-btn px-4 py-9 text-white sm:py-10">
        {/* Contour background pattern */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1200 350"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <g
            stroke="white"
            strokeWidth="1.2"
            strokeOpacity="0.22"
          >
            <path d="M-80 30 C20 -50 100 110 180 35 S300 -30 350 50 S470 125 530 45 S650 -35 710 40 S850 110 920 30 S1080 -40 1280 60" />
            <path d="M-80 45 C20 -35 100 125 180 50 S300 -15 350 65 S470 140 530 60 S650 -20 710 55 S850 125 920 45 S1080 -25 1280 75" />
            <path d="M-80 60 C20 -20 100 140 180 65 S300 0 350 80 S470 155 530 75 S650 -5 710 70 S850 140 920 60 S1080 -10 1280 90" />
            <path d="M-80 75 C20 -5 100 155 180 80 S300 15 350 95 S470 170 530 90 S650 10 710 85 S850 155 920 75 S1080 5 1280 105" />

            <path d="M-80 145 C50 80 100 200 220 145 S380 100 460 165 S600 225 710 150 S900 95 980 165 S1130 220 1280 145" />
            <path d="M-80 160 C50 95 100 215 220 160 S380 115 460 180 S600 240 710 165 S900 110 980 180 S1130 235 1280 160" />
            <path d="M-80 175 C50 110 100 230 220 175 S380 130 460 195 S600 255 710 180 S900 125 980 195 S1130 250 1280 175" />
            <path d="M-80 190 C50 125 100 245 220 190 S380 145 460 210 S600 270 710 195 S900 140 980 210 S1130 265 1280 190" />

            <path d="M-80 270 C40 200 130 325 260 265 S420 220 520 280 S700 330 810 265 S980 220 1080 280 S1200 310 1280 270" />
            <path d="M-80 285 C40 215 130 340 260 280 S420 235 520 295 S700 345 810 280 S980 235 1080 295 S1200 325 1280 285" />
            <path d="M-80 300 C40 230 130 355 260 295 S420 250 520 310 S700 360 810 295 S980 250 1080 310 S1200 340 1280 300" />

            <path d="M50 -30 C10 25 80 65 50 100 S20 165 75 185 S110 245 55 290 S30 350 80 380" />
            <path d="M70 -30 C30 25 100 65 70 100 S40 165 95 185 S130 245 75 290 S50 350 100 380" />
            <path d="M90 -30 C50 25 120 65 90 100 S60 165 115 185 S150 245 95 290 S70 350 120 380" />

            <path d="M1120 -30 C1080 30 1150 75 1120 120 S1090 190 1140 215 S1180 280 1130 330 S1110 365 1150 390" />
            <path d="M1140 -30 C1100 30 1170 75 1140 120 S1110 190 1160 215 S1200 280 1150 330 S1130 365 1170 390" />
            <path d="M1160 -30 C1120 30 1190 75 1160 120 S1130 190 1180 215 S1220 280 1170 330 S1150 365 1190 390" />
          </g>

          {/* Decorative contour shapes */}
          <g
            stroke="white"
            strokeOpacity="0.2"
            strokeWidth="8"
          >
            <ellipse
              cx="95"
              cy="195"
              rx="24"
              ry="11"
              transform="rotate(-25 95 195)"
            />
            <ellipse
              cx="1080"
              cy="205"
              rx="24"
              ry="11"
              transform="rotate(-25 1080 205)"
            />
          </g>
        </svg>

        {/* Newsletter content */}
        <div className="relative z-10 mx-auto flex max-w-lg flex-col items-center text-center h-[260px] 2xl:h-[360px] flex justify-center items-center">
          <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">
            Stay Updated
          </h2>

          <p className="mt-1 max-w-sm text-xs font-normal leading-relaxed text-white/90">
            Receive competition announcements, winner reveals,
            <br className="hidden sm:block" />
            and photography tips.
          </p>

          {/* Email and Subscribe container */}
          <form
            onSubmit={handleSubmit}
            className="mt-5 flex w-full max-w-[390px] items-center gap-1.5 rounded-full bg-[rgba(255,255,255,0.24)] p-1"
          >
            {/* Email input */}
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white px-3">
              <FiMail className="shrink-0 text-xs text-gray-400" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                aria-label="Email address"
                required
                className="w-full min-w-0 bg-transparent py-2 text-xs text-[#191818] outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Subscribe button */}
            <button
              type="submit"
              className="shrink-0 rounded-full bg-[#EE1C25] px-5 py-2 text-xs font-medium text-white transition-colors hover:bg-red-700"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
