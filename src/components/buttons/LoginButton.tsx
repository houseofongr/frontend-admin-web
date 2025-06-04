type LoginButtonProps = {
  label: string;
  type?: "submit" | "button";
  onClick?: () => void;
  disabled?: boolean;
};

export default function LoginButton({ label, type = "button", onClick, disabled }: LoginButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={
        "rounded-lg text-white bg-[#545354]  disabled:cursor-not-allowed disabled:hover:bg-[#545354] hover:bg-[#1E1E1E]/50 px-4 py-2 md:px-5 md:py-3 text-sm"
      }
    >
      {label}
    </button>
  );
}
