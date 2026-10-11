// import React from "react";
// import Counter from "./ui/Counter";

import Counter from "../ui/Counter";
// Displays key photography competition statistics in a responsive grid.
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
    <section className="w-full bg-white  py-8 sm:px-8 sm:py-[60px]">
      <div className="mx-auto grid max-w-main grid-cols-[repeat(auto-fit,minmax(250px,1fr))] justify-between gap-x-4 gap-y-8  md:gap-10">
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