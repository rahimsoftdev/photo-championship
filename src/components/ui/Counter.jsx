
const Counter = ({ value, suffix, label }) => {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center text-center">
      <h3 className="whitespace-nowrap text-xl font-bold leading-tight  sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl">
        {value}
        {suffix}
      </h3>

      <p className="mt-2 max-w-full text-xs leading-relaxed text-gray-600 sm:text-sm md:text-xs lg:text-sm">
        {label}
      </p>
    </div>
  );
};

export default Counter;
