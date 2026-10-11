import { FaStar } from "react-icons/fa";
import useFetch from "../../hooks/useFetch";
import LoadingPage from "../../pages/feedback/LoadingPage";


const Testimonials = () => {

  const {data, isLoading} = useFetch('/testimonials.json');
  console.log(data, 'th')

  if(isLoading){
    return <LoadingPage/>
  }
  return (
    <section className="bg-[#F7F8FA] py-section">
      <div className="container mx-auto px-4">

        {/* Section heading */}
        <div className="mb-10 text-center">
          <p className="text-base font-bold uppercase text-[#E31837]">
            Testimonials
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-[#0D0D14] sm:text-4xl lg:text-5xl">
            What Photographers Say
          </h2>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-gray-100 bg-white p-5 transition-shadow duration-300 hover:shadow-md"
            >
              {/* Star rating */}
              <div
                className="mb-4 flex items-center gap-1 text-[#FDC700]"
                aria-label="5 out of 5 stars"
              >
                {Array.from({ length: 5 }, (_, index) => (
                  <FaStar key={index} size={14} />
                ))}
              </div>

              {/* Review */}
              <p className="mb-5 text-sm font-normal leading-relaxed text-[#0D0D14]">
                "{item.review}"
              </p>

              {/* Profile */}
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                  loading="lazy"
                />

                <div>
                  <h3 className="text-sm font-bold text-[#0D0D14]">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-xs font-normal text-[#6B7280]">
                    {item.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
