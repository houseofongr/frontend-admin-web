import { MdOutlineArrowBackIos } from "react-icons/md";
import { Link } from "react-router-dom";

type ArrowIconType = {
  href: string;
};
export default function ArrowBackIcon({ href }: ArrowIconType) {
  return (
    <Link to={`${href}`} className="cursor-pointer hover:bg-[#F5946D] hover:text-white rounded-full p-2">
      <MdOutlineArrowBackIos size={20} />
    </Link>
  );
}
