import clsx from "clsx";

type CircleBtnProps = {
  label: string | React.ReactNode;
  onClick?: () => void;
};

export default function CircleButton({ label, onClick }: CircleBtnProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "ml-2 border-2 border-stone-300 p-3 rounded-full text-sm   cursor-pointer disabled:cursor-not-allowed  hover:border-[#F5946D] "
      )}
    >
      {label}
    </button>
  );
}
