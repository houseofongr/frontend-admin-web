type InputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

export default function CustomInput({ label, name, value, onChange, type = "text" }: InputProps) {
  return (
    <div className="flex flex-col">
      <label className="text-xs">{label}</label>
      <input
        onChange={onChange}
        type={type}
        value={value}
        name={name}
        className="p-2 text-sm md:text-base w-[200px] md:w-[220px]  rounded-lg outline-none border border-gray-300"
      />
    </div>
  );
}
