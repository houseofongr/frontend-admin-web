import { useState } from "react";
import SearchIcon from "./icons/SearchIcon";

type Option = {
  value: string;
  label: string;
};

type SearchProp = {
  onSearch: (searchType: string, keyword: string) => void;
  options: Option[];
};

export default function SearchComponent({ onSearch, options }: SearchProp) {
  const [searchType, setSearchType] = useState<string>(options[0]?.value || "NAME");
  const [keyword, setKeyword] = useState<string>("");

  const searchHandler = () => {
    onSearch(searchType, keyword);
  };
  return (
    <div className="flex items-center gap-2 py-1 px-2">
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
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
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="검색어를 입력하세요"
        className="flex-1 border border-gray-300 text-sm rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#f5946d]"
      />
      <SearchIcon onClick={searchHandler} />
    </div>
  );
}
