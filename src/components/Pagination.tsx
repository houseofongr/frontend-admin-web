import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};
export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center space-x-2 my-10 ">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1  ${
          currentPage === 1 ? "text-gray-400 border-gray-300 cursor-not-allowed" : "hover:  hover:text-[#f5946d]"
        }`}
      >
        <GrPrevious size={20} />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 border-[#f5946d] rounded-full ${
            currentPage === page ? "bg-[#f5946d] text-white" : "text-slate-700 hover:bg-[#f5946d] hover:text-white"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1  ${
          currentPage === totalPages ? "text-gray-400 border-gray-300 cursor-not-allowed" : "hover:text-[#f5946d]"
        }`}
      >
        <GrNext size={20} />
      </button>
    </div>
  );
}
