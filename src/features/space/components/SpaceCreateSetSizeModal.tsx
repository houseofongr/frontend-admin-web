import { IoPlanetOutline } from "react-icons/io5";
import DraggableIconTitleModal from "../../../components/modal/DraggableIconTitleModal";
import { LuPaintbrush } from "react-icons/lu";

interface SpaceCreateSetSizeModalProps {
  title: string;
  description: string;
  showSaveModal: boolean;
  handleModalClose: () => void;
  resetSelection: () => void;
  onSubmit: () => void;
}

export default function SpaceCreateSetSizeModal({
  title,
  description,
  showSaveModal,
  handleModalClose,
  resetSelection,
  onSubmit,
}: SpaceCreateSetSizeModalProps) {
  return (
    <DraggableIconTitleModal
      onClose={handleModalClose}
      title={title}
      description={description}
      icon={<IoPlanetOutline className="text-blue-950" size={20} />}
      bgColor="white"
    >
      <div className="flex flex-col items-center justify-center text-center p-4 gap-4">
        <div>
          <p>원하는 크기로 조절을 완료하세요.</p>
          <p className="mt-1 text-sm text-neutral-500">
            (안내창은 드래그해서 이동할 수 있습니다.)
          </p>
        </div>
        <button
          onClick={resetSelection}
          className="px-10 py-2 border-2 border-neutral-600 text-neutral-600 font-bold rounded-lg hover:bg-neutral-200 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <LuPaintbrush size={20} />
            <span>다시 그리기</span>
          </div>
        </button>
        <div className="flex gap-3">
          <button
            className={`px-5 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition cursor-pointer disabled:opacity-20`}
            onClick={onSubmit}
            disabled={showSaveModal}
          >
            완료
          </button>
          <button
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition cursor-pointer"
            onClick={handleModalClose}
          >
            취소
          </button>
        </div>
      </div>
    </DraggableIconTitleModal>
  );
}
