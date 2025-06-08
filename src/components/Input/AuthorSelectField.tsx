import { FiSearch } from "react-icons/fi";

export function AuthorSelectField({
  label,
  value,
  placeholder,
  onClick,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onClick: () => void;
}) {
  return (
    <div className="relative flex flex-col border border-gray-300 rounded-xl px-5 pt-3 pb-2 min-h-[75px]">
      <label className="text-neutral-500 mb-1">{label}</label>
      <div className="relative w-full" onClick={onClick}>
        <input
          type="text"
          value={value}
          readOnly
          placeholder={placeholder}
          className="w-full pr-10 cursor-pointer bg-transparent outline-none text-gray-900"
        />
        <FiSearch
          size={20}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
    </div>
  );
}

