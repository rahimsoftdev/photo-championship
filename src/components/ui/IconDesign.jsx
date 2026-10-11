import { FaTrophy } from "react-icons/fa";

const IconDesign = ({
  icon: Icon = FaTrophy,
  color = "#4F46E5",
  bgColor = "#EEF2FF",
  size = 16,
  className = "",
}) => {
  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <Icon size={size} color={color} />
    </div>
  );
};

export default IconDesign;