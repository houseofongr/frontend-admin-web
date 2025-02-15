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
    <div className="fixed inset-0 bg-black/70 flex-center z-10" onClick={onClose}>
      {/* min-w-[60%] max-w-[60%] */}
      <div
        className={clsx("rounded-lg shadow-lg p-4 relative overflow-hidden max-w-[1100px] ", {
          "bg-white": bgColor === "white",
          "bg-[#2C3333]": bgColor === "dark",
        })}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={clsx("absolute top-5 right-10  ", {
            "text-gray-500": bgColor === "white",
            "text-white": bgColor === "dark",
          })}
        >
          <IoMdClose size={20} />
        </button>
        <div className="overflow-y-auto p-4 ">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
