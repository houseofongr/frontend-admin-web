import React, { ReactNode } from "react";
import clsx from "clsx";
import Draggable from "react-draggable";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  onClose: () => void;
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  bgColor: "white" | "dark";
}

const DraggableIconTitleModal: React.FC<ModalProps> = ({
  onClose,
  title,
  description,
  icon,
  children,
  bgColor,
}) => {
  return (
    <div className="fixed inset-0 flex justify-end items-start m-10 z-10 pointer-events-none">
      <Draggable handle=".modal-header">
        <div
          className={clsx(
            "rounded-lg shadow-2xl p-4 relative max-w-[1100px] max-h-[80vh] overflow-auto pointer-events-auto",
            {
              "bg-white": bgColor === "white",
              "bg-stone-800/90": bgColor === "dark",
            }
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className={clsx("absolute top-5 right-5", {
              "text-gray-500": bgColor === "white",
              "text-white": bgColor === "dark",
            })}
          >
            <IoMdClose size={20} className="cursor-pointer hover:opacity-80" />
          </button>

          {/* 모달 콘텐츠 */}
          <div className="p-4">
            {/* 드래그 가능한 헤더 영역 */}
            <div className="flex flex-row mx-5 gap-4 items-center cursor-move modal-header">
              <div className="border w-10 h-10 border-gray-300 rounded-full p-2 inline-flex items-center justify-center">
                {icon}
              </div>
              <div>
                <div className="text-lg">{title}</div>
                <div className="text-gray-400 leading-tight">{description}</div>
              </div>
            </div>

            {/* 구분선 */}
            <div className="border-t border-gray-200 my-4" />

            {/* 자식 콘텐츠 */}
            {children}
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default DraggableIconTitleModal;
