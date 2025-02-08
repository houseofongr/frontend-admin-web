import { MdOutlineBedroomChild } from "react-icons/md";
import { GoHome } from "react-icons/go";
import { LuBedSingle } from "react-icons/lu";
import { RiFileMusicFill } from "react-icons/ri";

type HeaderProps = {
  headerTitles: List[];
};
type List = {
  name: string;
  width: string;
};

export default function GridHeader({ headerTitles }: HeaderProps) {
  const gridTemplate = headerTitles.map((item) => item.width).join(" ");

  return (
    <ul className="w-full grid py-2 invisible md:visible" style={{ gridTemplateColumns: gridTemplate }}>
      {headerTitles.map((item) => (
        <li key={item.name} className="pt-5 flex-center gap-[1px] ">
          <span> {item.name}</span>
          <div>{item.name === "홈" && <GoHome />}</div>
          <div>{item.name === "룸" && <MdOutlineBedroomChild />}</div>
          <div>{item.name === "아이템" && <LuBedSingle />}</div>
          <div>{item.name === "소리" && <RiFileMusicFill />}</div>
        </li>
      ))}
    </ul>
  );
}
