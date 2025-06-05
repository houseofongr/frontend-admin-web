import clsx from "clsx";

type ButtonProps = {
  label: string | React.ReactNode;
  type?: "submit" | "button";
  onClick?: () => void;
  disabled?: boolean;
  size?: "small" | "default";
  variant?: "default" | "gray"; // <-- 추가
};

export default function Button({
  label,
  type = "button",
  onClick,
  disabled,
  size = "default",
  variant = "default",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={clsx(
        "rounded-lg cursor-pointer",
        {
          "text-white bg-[#F5946D] hover:bg-[#e7a68c]": variant === "default",
          "text-white bg-gray-400 hover:bg-gray-500": variant === "gray",
        },
        {
          "px-4 py-2 md:px-5 md:py-3 text-sm": size === "default",
          "px-2 py-2 text-xs": size === "small",
        }
      )}
    >
      {label}
    </button>
  );
}
