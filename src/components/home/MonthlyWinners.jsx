import { FaArrowRight } from "react-icons/fa";
import useFetch from "../../hooks/useFetch";
import LoadingPage from "../../pages/feedback/LoadingPage";
import { Link } from "react-router";


const MonthlyWinners = () => {
  //fetch data form monthlyWinners.json file in public folder,
  //useFetch is a custom hook. the hook get url and send data
  const {
    data,
    isLoading,
  } = useFetch("/monthlyWinners.json");


  return (
    <section className="  px-4 py-10 font-sans min-[350px]:px-4 sm:px-6 sm:py-12 md:px-8 lg:py-section">
      <div className="mx-auto max-w-main rounded-xl bg-primary px-3 py-7 text-center text-white min-[400px]:px-4 sm:rounded-2xl sm:px-6 sm:py-10 md:px-8 md:py-12">
        {/* Section Heading */}
        <div className="mb-6 sm:mb-8">
          <p className="mb-2 text-xs font-bold text-white sm:mb-3 sm:text-sm">
            MAY 2026
          </p>

          <h2 className="text-xl font-extrabold tracking-tight text-white min-[400px]:text-2xl sm:text-3xl">
            Monthly Winners
          </h2>

          <p className="mt-2 text-xs font-normal text-white min-[400px]:text-sm">
            Congratulations to our May 2026 champions
          </p>
        </div>

        {/* Winner Cards */}
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-3 min-[500px]:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {data?.map((winner) => (
            <article
              key={winner.id}
              className="flex flex-col items-center rounded-xl border border-white/10 bg-[#666DD7] px-4 py-5 text-center text-white min-[400px]:px-5 sm:rounded-2xl sm:px-5 sm:py-6"
            >
              {/* Medal */}
              <div
                className="mb-2 flex h-6 items-center justify-center text-xl sm:mb-3 sm:h-7 sm:text-2xl"
                aria-label={`Rank ${winner.rank}`}
              >
                {winner.medal}
              </div>

              {/* Avatar */}
              <img
                src={winner.avatar}
                alt={winner.name}
                className="mb-3 h-14 w-14 rounded-full border-2 border-white/20 object-cover sm:mb-4 sm:h-16 sm:w-16"
              />

              {/* Winner Details */}
              <h3 className="break-words text-sm font-bold text-white sm:text-base">
                {winner.name}
              </h3>

              <p className="mt-1 text-xs text-white/90 sm:text-sm">
                {winner.album}
              </p>

              <p className="mt-1 text-[11px] text-white/70 sm:text-xs">
                {winner.votes}
              </p>

              {/* Prize */}
              <p className="mt-3 text-xl font-extrabold text-white sm:mt-4 sm:text-2xl">
                {winner.prize}
              </p>

              <p className="mt-1 text-[11px] text-white/80 sm:text-xs">
                Cash prize via PayPal
              </p>

              {/* Album Button */}
              <Link
              to={`/photographers/${winner.userId}`}
               
                className="mt-4 w-full rounded-full border border-white/20 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:mt-5 sm:px-4"
                
              >
                View Album
              </Link>
            </article>
          ))}
        </div>

        {/* Previous Winners Link */}
        <Link
          to="/winners"
          className="mt-5 inline-flex items-center justify-center gap-2 text-xs font-medium text-white transition-opacity hover:opacity-80 sm:mt-7 sm:text-sm"
        >
          View all previous winners
          <FaArrowRight className="text-[10px] sm:text-xs" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
};

export default MonthlyWinners;