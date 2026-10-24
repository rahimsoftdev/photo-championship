
import Counter from "../ui/Counter";

const StatsSection = () => {
  const stats = [
    {
      id: 1,
      value: "14,820",
      suffix: "+",
      label: "Registered Photographers",
    },
    {
      id: 2,
      value: "89,450",
      suffix: "+",
      label: "Photos Submitted",
    },
    {
      id: 3,
      value: "342,100",
      suffix: "+",
      label: "Votes Cast",
    },
    {
      id: 4,
      value: "120",
      suffix: "x",
      label: "Cash Prizes Awarded",
    },
  ];

  return (
    <section className="w-full bg-white px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:py-16">
      <div className="mx-auto grid max-w-main grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-4 md:gap-6 lg:gap-10">
        {stats.map((stat) => (
          <Counter
            key={stat.id}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
          />
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
