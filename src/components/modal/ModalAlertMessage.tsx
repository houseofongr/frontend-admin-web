import { MdError, MdCancel } from "react-icons/md";
import { IoIosWarning, IoMdClose } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";

export type AlertType = "success" | "warning" | "fail" | "info";

type AlertMessageProps = {
  text: string;
  type: AlertType;
  icon?: React.ReactNode;
  okButton?: React.ReactNode;
  cancelButton?: React.ReactNode;
  onClose: () => void;
  subText?:string;
};

export default function ModalAlertMessage({
  text,
  type,
  icon,
  okButton,
  cancelButton,
  onClose,
  subText,
}: AlertMessageProps) {
  // 타입별 기본 아이콘 매핑
  const iconMapping = {
    success: <FaCircleCheck size={24} className="text-green-500" />,
    warning: <IoIosWarning size={24} className="text-yellow-500" />,
    fail: <MdCancel size={24} className="text-red-500" />,
    info: <MdError size={24} className="text-blue-500" />,
  };

  const titleMapping = {
    success: "성공",
    warning: "알림",
    fail: "실패",
    info: "알림",
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-[30%] py-7 px-7 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-700"
        >
          <IoMdClose size={20} />
        </button>
        {/* 헤더 */}
        <div className="flex items-center gap-2 pb-3 mb-4">
          {icon || iconMapping[type]}
          <p className="text-xl ">{titleMapping[type]}</p>
        </div>
        {/* 메시지 */}
        <div className="flex items-start gap-2 p-4 flex-col">
          <div className="flex-1 max-h-[70vh] overflow-y-auto">{text}</div>
          <div className="flex-1 text-sm text-neutral-600">{subText}</div>
        </div>
        {/* 버튼 */}
        <div className="mt-4 flex justify-end gap-1">
          {okButton}
          {cancelButton}
        </div>
      </div>
    </div>
  );
}
