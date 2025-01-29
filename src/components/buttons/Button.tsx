import clsx from "clsx";

type ButtonProps = {
  label: string | React.ReactNode;
  type?: "submit" | "button";
  onClick?: () => void;
  disabled?: boolean;
  size?: "small" | "default";
};

export default function Button({ label, type = "button", onClick, disabled, size = "default" }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={clsx(
        "rounded-lg text-sm text-white bg-[#F5946D] cursor-pointer disabled:cursor-not-allowed hover:bg-[#e7a68c]",
        {
          "px-4 py-2 md:px-8 md:py-3": size === "default",
          "px-2 py-2": size === "small",
        }
      )}
    >
      {label}
    </button>
  );
}
