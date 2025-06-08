type SelectFieldProps<T extends string> = {
  label: string;
  value?: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  placeholder?: string;
  disabled?: boolean;
};

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
  placeholder = "선택하세요",
  disabled = false,
}: SelectFieldProps<T>) {
  return (
    <div className="relative flex flex-col border border-gray-300 rounded-xl px-5 pt-3 pb-2 min-h-[75px]">
      <label className="text-neutral-500 mb-0.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        disabled={disabled}
        className="outline-none bg-transparent w-full text-gray-900"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
