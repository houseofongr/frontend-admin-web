import { Link } from "react-router-dom";
import { House } from "../types/house";
import HouseCard from "./HouseCard";
import Pagination from "./Pagination";
import SpinnerIcon from "./icons/SpinnerIcon";

type Props = {
  houses: House[];
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  totalItems?: number;
};

export default function GridHouseList({ houses, currentPage, onPageChange, totalPages, totalItems }: Props) {
  if (houses.length === 0 || totalItems === 0) return <SpinnerIcon />;
  return (
    <div>
      <ul className="mx-5 md:mx-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {houses.map((house) => (
          <Link
            to={`/houses/${house.id}`}
            key={house.id}
            className="flex w-full px-2  md:py-4 md:px-3 bg-white border shadow-sm border-[#f5946d] "
          >
            <HouseCard house={house} />
          </Link>
        ))}
      </ul>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}
