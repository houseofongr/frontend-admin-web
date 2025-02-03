type InputProps = {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  type?: string;
  elType?: "input" | "textarea";
};

export default function CustomInput({ label, name, value, onChange, type = "text", elType = "input" }: InputProps) {
  const isInputElement = elType === "input";
  return (
    <div className="flex flex-col">
      {label && <label className="text-xs">{label}</label>}
      {isInputElement ? (
        <input
          onChange={onChange}
          type={type}
          value={value}
          name={name}
          className="p-2 text-sm md:text-base w-[200px] md:w-[220px]  rounded-lg border border-gray-300"
        />
      ) : (
        <textarea
          onChange={onChange}
          value={value}
          name={name}
          rows={10}
          className="p-2 text-sm md:text-base w-full rounded-lg border border-gray-300"
        />
      )}
    </div>
  );
}
