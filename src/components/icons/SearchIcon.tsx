import { IoSearch } from "react-icons/io5";

type Prop = {
  onClick: () => void;
};
export default function SearchIcon({ onClick }: Prop) {
  return (
    <div
      onClick={onClick}
      className="p-2 border border-[#f5946d] bg-[#f5946d] rounded-full flex-center text-white cursor-pointer"
    >
      <IoSearch className="w-5 h-5" />
    </div>
  );
}
