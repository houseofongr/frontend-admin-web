import { Category } from "../../types/universe";

type SelectFieldProps = {
  label: string;
  value?: Category;
  onChange: (value: Category) => void;
  options: Category[];
  placeholder?: string;
  disabled?: boolean;
};

export function CategorySelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "선택하세요",
  disabled = false,
}: SelectFieldProps) {
  return (
    <div className="relative flex flex-col border border-gray-300 rounded-xl px-5 pt-3 pb-2 min-h-[75px]">
      <label className="text-neutral-500 mb-0.5">{label}</label>
      <select
        value={value?.id ?? ""}
        onChange={(e) => {
          const selectedId = Number(e.target.value);
          const selectedCategory = options.find((cat) => cat.id === selectedId);
          if (selectedCategory) onChange(selectedCategory);
        }}
        disabled={disabled}
        className="outline-none bg-transparent w-full text-gray-900"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options != null && options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.kor}
          </option>
        ))}
      </select>
    </div>
  );
}
