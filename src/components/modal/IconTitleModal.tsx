import clsx from "clsx";
import React, { ReactNode } from "react";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  onClose: () => void;
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  bgColor: "white" | "dark";
}

const IconTitleModal: React.FC<ModalProps> = ({
  onClose,
  title,
  description,
  icon,
  children,
  bgColor,
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex-center z-10">
      <div
        className={clsx(
          "rounded-lg shadow-lg p-4 relative max-w-[1100px] max-h-[80vh] flex flex-col",
          {
            "bg-white": bgColor === "white",
            "bg-stone-800/90": bgColor === "dark",
          }
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={clsx("absolute top-10 right-10  ", {
            "text-gray-500": bgColor === "white",
            "text-white": bgColor === "dark",
          })}
        >
          <IoMdClose size={20} className="cursor-pointer hover:opacity-80" />
        </button>
        <div className="flex flex-col p-4 overflow-auto">
          {/* 상단 업로드 설명 부분 */}
          <div className="shrink-0 flex flex-row mx-5 gap-4 items-center">
            <div className="border w-10 h-10 border-gray-300 rounded-full p-2 inline-flex items-center justify-center">
              {icon}
            </div>
            <div>
              <div className="text-lg">{title}</div>
              <div className="text-gray-400 leading-tight">{description}</div>
            </div>
          </div>

          {/* 디바이더 */}
          <div className="shrink border-t border-gray-200 my-4" />

          {/* children */}
          <div className="flex flex-col mx-auto grow overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconTitleModal;