import clsx from "clsx";

type CircleBtnProps = {
  label: string | React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  hasBorder?: boolean;
  text?: string;
};

export default function CircleButton({ label, onClick, disabled, hasBorder = true, text }: CircleBtnProps) {
  return (
    <div className="flex flex-col items-center ">
      <button
        disabled={disabled}
        onClick={onClick}
        className={clsx(
          "p-2  rounded-full text-sm ",
          { "border-2 border-gray-300  hover:border-[#F5946D]": hasBorder },
          { "hover:text-[#F5946D]": !hasBorder },
          "disabled:cursor-not-allowed disabled:border-stone-300 "
        )}
      >
        {label}
      </button>
      {text && <span className="text-xs text-white">{text}</span>}
    </div>
  );
}
