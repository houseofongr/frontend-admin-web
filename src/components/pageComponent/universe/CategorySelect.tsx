import { useState } from "react";

type Option = {
  value: string;
  label: string;
};

type SearchProp = {
  onSearch: (filter: string, query: string) => void;
  options: Option[];
};

export default function CategorySelect({ onSearch, options }: SearchProp) {
  const [filter, setFilter] = useState<string>(options[0]?.value || "all");
  const [query, setQuery] = useState<string>("");
  const [open, setOpen] = useState(false);


  const searchHandler = () => {
    onSearch(filter, query);
  };

  return (
    <div className="hidden lg:flex items-center py-1">
      <button
        onClick={() => setOpen(!open)}
        className="text-white mx-2 bg-[#f5946d] hover:opacity-90 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
      >
        카테고리
      </button>
      {open && (
        <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-72 mt-64">
          <ul
            className="p-3 space-y-1 text-sm text-gray-700"
            aria-labelledby="dropdownToggleButton"
          >
            {options.map((option) => (
              <li key={option.value} value={option.value}>
                <div className="flex p-2 rounded-sm hover:bg-gray-100">
                  <label className="inline-flex items-center w-full cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none  rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-[#f5946d] dark:peer-checked:bg-[#f5946d]"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                      {option.label}
                    </span>
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border border-gray-300 rounded text-sm md:px-3 py-2  focus:outline-hidden focus:ring-1 focus:ring-[#f5946d]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select> */}
    </div>
  );
}

// {
//   options.map((option) => (
//     <li key={option.value} value={option.value}>
//       {option.label}
//     </li>
//   ));
// }