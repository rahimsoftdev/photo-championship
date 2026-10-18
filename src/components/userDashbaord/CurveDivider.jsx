import { useId } from "react";

/**
 * Decorative curved line with a dot at each end.
 * Pass different colors for leftColor / rightColor to get the red + blue split.
 */
const CurveDivider = ({ leftColor = "#4048CD", rightColor = "#4048CD" }) => {
    const gradientId = useId().replace(/:/g, "");

    return (
        <div className="relative h-8 w-full" aria-hidden="true">
            <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 1000 32"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={leftColor} />
                        <stop offset="50%" stopColor={leftColor} />
                        <stop offset="50%" stopColor={rightColor} />
                        <stop offset="100%" stopColor={rightColor} />
                    </linearGradient>
                </defs>
                <path
                    d="M 0 5 Q 500 55 1000 5"
                    fill="none"
                    stroke={`url(#${gradientId})`}
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>
            <span
                className="absolute left-0 top-0 h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: leftColor }}
            />
            <span
                className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: rightColor }}
            />
        </div>
    );
};

export default CurveDivider;