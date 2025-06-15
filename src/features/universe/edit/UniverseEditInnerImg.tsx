import { useState, useRef, useEffect } from "react";
import {
  RiImageEditFill,
  RiFileDownloadLine,
  RiFunctionAddLine,
  RiDeleteBin6Line,
} from "react-icons/ri";
import { MdOutlineFullscreen } from "react-icons/md";
import { PiDownloadSimpleBold, PiGpsBold } from "react-icons/pi";
import { IoPlanetOutline } from "react-icons/io5";
import { LuPaintbrush } from "react-icons/lu";
import { TbPencilCog } from "react-icons/tb";
import { BiDotsVerticalRounded } from "react-icons/bi";

import API_CONFIG from "../../../config/api";
import {
  postSpaceCreate,
  patchSpaceInnerImageEdit,
} from "../../../service/spaceService";
import {
  getUniverseTree,
  patchUniverseInnerImageEdit,
} from "../../../service/universeService";

import ContextMenu from "../../../components/ContextMenu";
import DraggableIconTitleModal from "../../../components/modal/DraggableIconTitleModal";
import ImageUploadModal from "../../../components/modal/ImageUploadModal";
import IconTitleModal from "../../../components/modal/IconTitleModal";
import ModalAlertMessage, {
  AlertType,
} from "../../../components/modal/ModalAlertMessage";
import Button from "../../../components/buttons/Button";

import SpaceSelector from "../../space/components/SpaceSelector";
import SpaceDetailInfoStep from "../../space/create/SpaceDetailInfoStep";

import { SpaceCreateStep } from "../../../constants/ProcessSteps";
import { PercentPoint } from "../../../constants/image";
import {
  PieceType,
  SaveTargetType,
  UniverseType,
  useUniverseStore,
} from "../../../context/useUniverseStore";

export default function UniverseEditInnerImg() {
  const menuRef = useRef<HTMLDivElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [createStep, setCreateStep] = useState<SpaceCreateStep | null>(null);
  const [startPoint, setStartPoint] = useState<PercentPoint | null>(null);
  const [endPoint, setEndPoint] = useState<PercentPoint | null>(null);
  const [innerImg, setInnerImg] = useState<File | null>(null);
  const [alert, setAlert] = useState<{
    text: string;
    type: AlertType;
    subText: string | null;
  } | null>(null);
  const [showInnerImgEdit, setShowInnerImgEdit] = useState<{
    show: boolean;
    type: SaveTargetType;
    id: number;
  }>({ show: false, type: null, id: -1 });

  const {
    existingSpaces,
    existingPieces,
    innerImageId,
    rootUniverse,
    currentSpaceId,
    parentSpaceId,
    getSpaceById,
    setCurrentSpaceId,
    setRootUniverse,
    setUniverseData,
  } = useUniverseStore();

  useEffect(() => {
    if (rootUniverse == null) loadInitialData(null);
    else if (currentSpaceId === rootUniverse.universeId) {
      setCurrentSpaceId(-1);
      setUniverseData(
        rootUniverse.innerImageId,
        rootUniverse.spaces,
        rootUniverse.pieces
      );
    } else if (currentSpaceId != null) {
      const space = getSpaceById(currentSpaceId);
      if (!space) return;
      setUniverseData(space.innerImageId, space.spaces, space.pieces);
    }
  }, [currentSpaceId]);

  const loadInitialData = async (spaceId: number | null) => {
    try {
      if (currentSpaceId == null) return;
      const data: UniverseType = await getUniverseTree(currentSpaceId);

      setRootUniverse(data);
      const space = spaceId == null ? data : getSpaceById(currentSpaceId);
      if (!space) return;

      setUniverseData(space.innerImageId, space.spaces, space.pieces);
    } catch (error: any) {
      showAlert(
        error?.message || "유니버스 조회 중 오류가 발생했습니다.",
        "fail",
        null
      );
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resetSelection = () => {
    setStartPoint(null);
    setEndPoint(null);
  };

  const handleDownloadImage = () => {
    if (innerImageId !== -1) {
      const imageUrl = `${API_CONFIG.PUBLIC_IMAGE_LOAD_API}/attachment/${innerImageId}`;
      window.location.href = imageUrl;
    }
  };

  const onInnerImgEdit = (type: SaveTargetType, id: number) => {
    setShowInnerImgEdit({ show: true, type, id });
  };

  const onSpaceDelete = () => {
    showAlert(
      "정말로 스페이스를 삭제하시겠습니까?",
      "check",
      "* 관련된 이미지와 음원, 내부 스페이스 및 요소가 모두 삭제됩니다."
    );
  };

  const handleEditInnerImage = (file: File) => {
    EditInnerImgSave(file, showInnerImgEdit.type, showInnerImgEdit.id);
    setShowInnerImgEdit({ show: false, type: null, id: -1 });
  };

  const EditInnerImgSave = async (
    file: File,
    targetType: SaveTargetType,
    targetId: number
  ) => {
    try {
      if (targetType === "universe") {
        await patchUniverseInnerImageEdit(targetId, file);
      } else if (targetType === "space") {
        await patchSpaceInnerImageEdit(targetId, file);
      } else {
        throw new Error("잘못된 대상 유형입니다.");
      }
      showAlert("변경사항이 저장되었습니다.", "success", null);
    } catch (error) {
      console.error("저장 에러:", error);
      showAlert("저장 중 오류가 발생했습니다.", "fail", null);
    }
  };

  const createSpace = async (
    title: string,
    description: string
  ): Promise<void> => {
    if (!startPoint || !endPoint || !innerImg) {
      showAlert("스페이스 정보를 모두 입력해주세요.", "fail", null);
      return;
    }
    const metadata = {
      universeId: rootUniverse?.universeId,
      parentSpaceId:
        currentSpaceId === rootUniverse?.universeId ? -1 : currentSpaceId,
      title,
      description,
      startX: startPoint.xPercent,
      startY: startPoint.yPercent,
      endX: endPoint.xPercent,
      endY: endPoint.yPercent,
    };
    try {
      await postSpaceCreate(metadata, innerImg);
      showAlert("스페이스가 생성되었습니다.", "success", null);
      loadInitialData(currentSpaceId);
    } catch (error: any) {
      showAlert(
        error?.message || "스페이스 생성 중 오류가 발생했습니다.",
        "fail",
        null
      );
    }
  };

  const handleCreateSubmit = (title: string, description: string) => {
    if (startPoint && endPoint && innerImg) createSpace(title, description);
  };

  const handleCreateInnerImage = (file: File) => {
    setInnerImg(file);
    setCreateStep(SpaceCreateStep.FillDetails);
  };

  const handleCreateModalClose = () => {
    setCreateStep(null);
    resetSelection();
    setInnerImg(null);
  };

  const showAlert = (text: string, type: AlertType, subText: string | null) => {
    setAlert({ text, type, subText });
  };

  const menuItems =
    (parentSpaceId === -1 && currentSpaceId == -1)
      ? [
        {
          label: "이미지 수정",
          icon: <RiImageEditFill size={20} />,
          onClick: () =>
            onInnerImgEdit("universe", rootUniverse?.universeId!),
        },
        {
          label: "이미지 다운로드",
          icon: <RiFileDownloadLine size={20} />,
          onClick: handleDownloadImage,
        },
      ]
      : [
        {
          label: "이미지 수정",
          icon: <RiImageEditFill size={20} />,
          onClick: () => onInnerImgEdit("space", currentSpaceId!),
        },
        {
          label: "이미지 다운로드",
          icon: <RiFileDownloadLine size={20} />,
          onClick: handleDownloadImage,
        },
        {
          label: "정보 수정",
          icon: <TbPencilCog size={20} />,
          onClick: () => { },
        },
        {
          label: "좌표 수정",
          icon: <PiGpsBold size={20} />,
          onClick: () => { },
        },
        {
          label: "스페이스 삭제",
          icon: <RiDeleteBin6Line size={20} />,
          onClick: onSpaceDelete,
        },
      ];

  return (
    <div
      ref={menuRef}
      className="h-full relative text-left group flex justify-center"
      onMouseLeave={() => setMenuOpen(false)}
    >
      {alert && (
        <ModalAlertMessage
          text={alert.text}
          type={alert.type}
          onClose={() => setAlert(null)}
          okButton={<Button label="확인" onClick={() => setAlert(null)} />}
          cancelButton={
            alert.type === "check" ? (
              <Button
                label="취소"
                variant="gray"
                onClick={() => setAlert(null)}
              />
            ) : undefined
          }
          {...(alert.subText ? { subText: alert.subText } : {})}
        />
      )}

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="z-10 absolute cursor-pointer top-2 right-2 w-7 h-7 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <BiDotsVerticalRounded size={20} />
      </button>

      <ContextMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={menuItems}
      />

      <button
        onClick={() => { }}
        className="z-10 absolute cursor-pointer bottom-3 right-3 w-9 h-9 flex items-center justify-center backdrop-blur-sm rounded-full text-white hover:opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <PiDownloadSimpleBold size={20} />
      </button>
      <button
        onClick={() => setCreateStep(SpaceCreateStep.SetSize)}
        className="z-10 absolute cursor-pointer bottom-3 right-12 w-9 h-9 flex items-center justify-center backdrop-blur-sm rounded-full text-white hover:opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <RiFunctionAddLine size={20} />
      </button>
      <button
        onClick={() => { }}
        className="z-10 absolute cursor-pointer bottom-3 right-22 w-9 h-9 flex items-center justify-center backdrop-blur-sm rounded-full text-white hover:opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <MdOutlineFullscreen size={25} />
      </button>

      <SpaceSelector
        step={createStep}
        innerImageId={innerImageId}
        startPoint={startPoint}
        endPoint={endPoint}
        setStartPoint={setStartPoint}
        setEndPoint={setEndPoint}
      />

      {createStep === SpaceCreateStep.SetSize && (
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
      )}

      {createStep === SpaceCreateStep.UploadImage && (
        <ImageUploadModal
          title="스페이스 생성"
          description="새로운 스페이스를 생성합니다."
          labelText="스페이스 내부 이미지"
          maxFileSizeMB={100}
          onClose={handleCreateModalClose}
          onConfirm={handleCreateInnerImage}
          confirmText="다음"
          requireSquare
        />
      )}

      {createStep === SpaceCreateStep.FillDetails && (
        <IconTitleModal
          onClose={handleCreateModalClose}
          title="스페이스 생성"
          description="새로운 스페이스를 생성합니다."
          icon={<IoPlanetOutline size={20} />}
          bgColor="white"
        >
          <SpaceDetailInfoStep
            innerImg={innerImg}
            onSubmit={handleCreateSubmit}
          />
        </IconTitleModal>
      )}

      {showInnerImgEdit.show && (
        <ImageUploadModal
          title="이미지 수정"
          description="내부 이미지를 변경할 수 있습니다."
          labelText="내부이미지"
          maxFileSizeMB={5}
          onClose={() => setShowInnerImgEdit(
            { show: false, type: null, id: -1 }
          )}
          onConfirm={(file) => handleEditInnerImage(file)}
          confirmText="저장"
          requireSquare
        />
      )}
    </div>
  );
}
