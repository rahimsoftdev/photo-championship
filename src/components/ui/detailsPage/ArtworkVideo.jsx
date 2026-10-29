import { FaPlay } from "react-icons/fa";

const DEFAULT_IMAGE = "https://picsum.photos/id/1015/1600/900";

// Sudhu look er jonno: ekta image + upore play button (asol video play hoy na)
const ArtworkVideo = ({ image, alt = "Artwork preview" }) => {
  const imageUrl = image || DEFAULT_IMAGE;

  return (
    <section className="mx-auto w-full max-w-main">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black  max-h-[260px] sm:max-h-[310px] mt-5 md:max-h-[360px] xl:max-h-[400px]">
        <img
          src={imageUrl}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover"
        />

        {/* dark overlay */}
        <div className="absolute inset-0 bg-black/25" />

        {/* play button (shudhu design) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-[#4C2A9E] shadow-lg backdrop-blur-sm sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24">
            <FaPlay className="ml-1 h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
          </span>
        </div>
      </div>
    </section>
  );
};

export default ArtworkVideo;