import clsx from "clsx";
import React, { ReactNode } from "react";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  bgColor: "white" | "dark";
}

const Modal: React.FC<ModalProps> = ({ onClose, children, bgColor }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex-center z-20" onClick={onClose}>
      <div
        className={clsx("rounded-lg shadow-lg p-4 relative max-w-[1100px]   max-h-[80vh] overflow-auto", {
          "bg-white": bgColor === "white",
          "bg-stone-800/90": bgColor === "dark",
        })}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={clsx("absolute top-10 right-10  ", {
            "text-gray-500": bgColor === "white",
            "text-white": bgColor === "dark",
          })}
        >
          <IoMdClose size={20} className="cursor-pointer hover:opacity-80"/>
        </button>
        <div className=" p-4 ">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
