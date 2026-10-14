
const DEFAULT_VIDEO =
  "https://videos.pexels.com/video-files/854112/854112-hd_1920_1080_25fps.mp4";

const ArtworkVideo = ({ video }) => {
  const videoUrl = video || DEFAULT_VIDEO;

  return (
    <section className="mx-auto w-full max-w-main">
      <div className="overflow-hidden rounded-2xl bg-black">
        <video
          key={videoUrl}
          src={videoUrl}
          controls
          playsInline
          preload="metadata"
          className="max-h-[650px] w-full object-contain"
        >
          Your browser does not support the video element.
        </video>
      </div>
    </section>
  );
};

export default ArtworkVideo;
