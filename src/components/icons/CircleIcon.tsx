import React from "react";

type CicleIconProps = {
  icon: React.ReactNode;
  text?: string;
};

export default function CircleIcon({ icon, text }: CicleIconProps) {
  return (
    <div className={`flex-center gap-2 border-4 bg-white border-[#F5946D] text-[#552816]  px-8  py-2 rounded-full `}>
      <div>{icon}</div>
      {text && <span className="font-light">{text}</span>}
    </div>
  );
}
