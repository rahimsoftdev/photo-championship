// Reusable component for displaying a statistic and its label.
const Counter = ({ value, suffix = "", label }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <h3 className="text-2xl font-extrabold leading-tight text-[#212133] sm:text-3xl">
        {value}
        {suffix}
      </h3>

      <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-[#6B7280] sm:text-xs">
        {label}
      </p>
    </div>
  );
};

export default Counter;