import clsx from "clsx";
import React, { ReactNode } from "react";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  bgColor: "white" | "neutral";
}

const Modal: React.FC<ModalProps> = ({ onClose, children, bgColor }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className={clsx("rounded-lg shadow-lg p-4 relative overflow-hidden min-w-[60%] max-w-[60%] ", {
          "bg-white": bgColor === "white",
          "bg-neutral-200": bgColor === "neutral",
        })}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-5 right-10 text-gray-500 hover:text-gray-700">
          <IoMdClose size={20} />
        </button>
        <div className="max-h-[60vh] overflow-y-auto p-4 ">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
