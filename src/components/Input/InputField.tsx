export function InputField({
  label,
  value,
  onChange,
  onBlur,
  maxLength,
  placeholder = "",
  extra,
}: {
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>; // ← 추가
  maxLength: number;
  placeholder?: string;
  extra?: string;
}) {
  return (
    <div className="relative flex flex-col border border-gray-300 rounded-xl px-5 pt-3 pb-2">
      <label className="text-neutral-500 mb-0.5">{label}</label>
      <input
        value={value}
        onChange={onChange}
        onBlur={onBlur} // ← 연결
        maxLength={maxLength}
        placeholder={placeholder}
        className="outline-none bg-transparent w-full text-gray-900 pr-13"
      />
      <div className="absolute bottom-2 right-4 text-xs text-gray-500">
        {extra ?? `${value.length} / ${maxLength}`}
      </div>
    </div>
  );
}