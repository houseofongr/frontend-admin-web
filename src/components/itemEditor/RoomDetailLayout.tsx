import { ReactNode } from "react";
import clsx from "clsx";

type RoomDetailLayoutProp = {
  isEditable: boolean;
  children: ReactNode;
};

export default function RoomDetailLayout({ isEditable, children }: RoomDetailLayoutProp) {
  return (
    <div
      className={clsx("relative w-full h-screen", { "bg-stone-700": isEditable }, { "bg-neutral-300": !isEditable })}
    >
      {children}
    </div>
  );
}
