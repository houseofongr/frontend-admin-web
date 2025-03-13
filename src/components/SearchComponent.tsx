import { useState } from "react";
import SearchIcon from "./icons/SearchIcon";

type Option = {
  value: string;
  label: string;
};

type SearchProp = {
  onSearch: (filter: string, query: string) => void;
  options: Option[];
};

export default function SearchComponent({ onSearch, options }: SearchProp) {
  const [filter, setFilter] = useState<string>(options[0]?.value || "all");
  const [query, setQuery] = useState<string>("");

  const searchHandler = () => {
    onSearch(filter, query);
  };
  return (
    <div className="hidden lg:flex items-center gap-2 py-1 px-2">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border border-gray-300 rounded text-sm md:px-3 py-2 focus:outline-hidden focus:ring-1 focus:ring-[#f5946d]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색어를 입력하세요"
        className="flex-1 border border-gray-300 text-sm rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#f5946d]"
      />
      <SearchIcon onClick={searchHandler} />
    </div>
  );
}
