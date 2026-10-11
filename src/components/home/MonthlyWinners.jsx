import { FaArrowRight } from "react-icons/fa";
import useFetch from "../../hooks/useFetch";
import LoadingPage from "../../pages/feedback/LoadingPage";


const MonthlyWinners = () => {
    const {
    data,
    isLoading,
  } = useFetch("/monthlyWinners.json");

  if(isLoading){
    return <LoadingPage/>
  }
  return (
    <section className="px-5  ">
      <div className="mx-auto max-w-main rounded-2xl bg-primary px-5 py-12 text-center text-white sm:px-8 sm:py-16">
        {/* Section Heading */}
        <div className="mb-8">
          <p className="mb-3 text-base font-bold text-white">
            MAY 2026
          </p>

          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Monthly Winners
          </h2>

          <p className="mt-2 text-base font-normal text-white">
            Congratulations to our May 2026 champions
          </p>
        </div>

        {/* Winner Cards */}
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((winner) => (
            <article
              key={winner.id}
              className="flex flex-col items-center rounded-2xl border border-white/10 bg-[#666DD7] px-6 py-6 text-center text-white"
            >
              {/* Medal */}
              <div
                className="mb-3 flex h-7 items-center justify-center text-2xl"
                aria-label={`Rank ${winner.rank}`}
              >
                {winner.medal}
              </div>

              {/* Avatar */}
              <img
                src={winner.avatar}
                alt={winner.name}
                className="mb-4 h-16 w-16 rounded-full border-2 border-white/20 object-cover"
              />

              {/* Winner Details */}
              <h3 className="text-base font-bold text-white">
                {winner.name}
              </h3>

              <p className="mt-1 text-sm text-white/90">
                {winner.album}
              </p>

              <p className="mt-1 text-xs text-white/70">
                {winner.votes}
              </p>

              {/* Prize */}
              <p className="mt-4 text-2xl font-extrabold text-white">
                {winner.prize}
              </p>

              <p className="mt-1 text-xs text-white/80">
                Cash prize via PayPal
              </p>

              {/* Album Button */}
              <button
                type="button"
                className="mt-5 w-full rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                onClick={() => {
                  // Add your album navigation here.
                }}
              >
                View Album
              </button>
            </article>
          ))}
        </div>

        {/* Previous Winners Link */}
        <a
          href="/previous-winners"
          className="mt-7 inline-flex items-center justify-center gap-2 text-sm font-medium text-white transition-opacity hover:opacity-80"
        >
          View all previous winners
          <FaArrowRight className="text-xs" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
};

export default MonthlyWinners;