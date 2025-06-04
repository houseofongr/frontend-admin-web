import { LuFileImage } from "react-icons/lu";

type FileNameProp = {
  fileName: string;
};
export default function FileName({ fileName }: FileNameProp) {
  return (
    <div className="flex px-1 py-0.5 rounded-xs gap-1 items-center text-white bg-[#343131] ">
      <LuFileImage color="#EEDF7A" size={20} />
      <span className="w-full text-xs">{fileName}</span>
    </div>
  );
}
