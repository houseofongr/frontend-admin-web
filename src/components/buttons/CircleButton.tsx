import clsx from "clsx";

type CircleBtnProps = {
  label: string | React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export default function CircleButton({ label, onClick, disabled }: CircleBtnProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "ml-2 p-3  rounded-full text-sm  cursor-pointer",
        "border-2 border-gray-300",
        "disabled:cursor-not-allowed disabled:border-stone-300  hover:border-[#F5946D]"
      )}
    >
      {label}
    </button>
  );
}
