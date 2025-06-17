import { IoPlanetOutline } from "react-icons/io5";
import DraggableIconTitleModal from "../../../components/modal/DraggableIconTitleModal";
import { LuPaintbrush } from "react-icons/lu";
import { SpaceCreateStep } from "../../../constants/ProcessSteps";

interface SpaceCreateSetSizeModalProps {
  handleCreateModalClose: () => void;
  resetSelection: () => void;
  setCreateStep: (step: SpaceCreateStep) => void;
}

export default function SpaceCreateSetSizeModal({
  handleCreateModalClose,
  resetSelection,
  setCreateStep,
}: SpaceCreateSetSizeModalProps) {
  return (
    <DraggableIconTitleModal
      onClose={handleCreateModalClose}
      title="스페이스 생성"
      description="새로운 스페이스를 생성합니다."
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
          className="px-10 py-2 border-2 border-neutral-600 text-neutral-600 font-bold rounded-lg hover:bg-neutral-200 transition"
        >
          <div className="flex items-center gap-2">
            <LuPaintbrush size={20} />
            <span>다시 그리기</span>
          </div>
        </button>
        <div className="flex gap-3">
          <button
            className="px-5 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition"
            onClick={() => setCreateStep(SpaceCreateStep.UploadImage)}
          >
            완료
          </button>
          <button
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            onClick={handleCreateModalClose}
          >
            취소
          </button>
        </div>
      </div>
    </DraggableIconTitleModal>
  );
}
