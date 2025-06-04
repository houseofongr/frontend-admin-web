import { ReactNode } from "react";
import clsx from "clsx";
import CircleButton from "../buttons/CircleButton";
import { TbDoorExit } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

type RoomDetailLayoutProp = {
  children: ReactNode;
  isEditable: boolean;
};

export default function RoomDetailLayout({ isEditable, children }: RoomDetailLayoutProp) {
  const navigate = useNavigate();
  const exitCurrentPage = () => {
    navigate("/sound-sources");
  };
  return (
    <div
      className={clsx("relative w-full h-screen", { "bg-stone-700": isEditable }, { "bg-neutral-300": !isEditable })}
    >
      {children}
      <div className="fixed bottom-5 right-5" onClick={exitCurrentPage}>
        <CircleButton label={<TbDoorExit size={25} color="white" />} />
      </div>
    </div>
  );
}
