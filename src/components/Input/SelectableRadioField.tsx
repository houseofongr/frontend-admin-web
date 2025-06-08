type SelectableRadioFieldProps<T extends string> = {
  label: string;
  value?: T;
  onChange: (value: T) => void;
  options: {
    value: T;
    icon?: React.ReactNode;
    label: string;
  }[];
  name: string;
};

export function SelectableRadioField<T extends string>({
  label,
  value,
  onChange,
  options,
  name,
}: SelectableRadioFieldProps<T>) {
  return (
    <div className="relative flex flex-col border border-gray-300 rounded-xl px-5 pt-3 pb-2 min-h-[75px]">
      <label className="text-neutral-500 mb-0.5">{label}</label>
      <div className="flex space-x-10 justify-center">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="radio"
              name={name}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="hidden"
            />
            <span className="h-5 w-5 border border-neutral-500 rounded-full flex items-center justify-center">
              {value === option.value && (
                <span className="h-3 w-3 bg-neutral-400 rounded-full" />
              )}
            </span>
            <span className="flex items-center gap-2 text-neutral-600">
              {option.icon} {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
