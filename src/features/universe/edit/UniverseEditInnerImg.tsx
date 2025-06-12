import { useState, useRef, useEffect } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import API_CONFIG from "../../../config/api";
import {
  RiImageEditFill,
  RiFileDownloadLine,
  RiFunctionAddLine,
  RiFileEditLine,
  RiDeleteBin6Line,
} from "react-icons/ri";
import {
  MdOutlineFullscreen,
  MdOutlineGpsFixed,
  MdOutlineGpsNotFixed,
} from "react-icons/md";
import { PiDownloadSimpleBold, PiGpsBold } from "react-icons/pi";
import { IoPlanetOutline } from "react-icons/io5";
import { LuPaintbrush } from "react-icons/lu";

import ContextMenu from "../../../components/ContextMenu";
import DraggableIconTitleModal from "../../../components/modal/DraggableIconTitleModal";
import ImageUploadModal from "../../../components/modal/ImageUploadModal";
import IconTitleModal from "../../../components/modal/IconTitleModal";
import SpaceSelector from "../../space/components/SpaceSelector";
import SpaceDetailInfoStep from "../../space/create/SpaceDetailInfoStep";

import { SpaceCreateStep } from "../../../constants/ProcessSteps";
import { PercentPoint } from "../../../constants/image";

import {
  PieceType,
  SpaceType,
  UniverseType,
  useUniverseStore,
} from "../../../context/useUniverseStore";
import { TbPencilCog } from "react-icons/tb";

interface UniverseEditInnerImgProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function UniverseEditInnerImg({
  onEdit,
  onDelete,
}: UniverseEditInnerImgProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [createStep, setCreateStep] = useState<SpaceCreateStep | null>(null);

  const [startPoint, setStartPoint] = useState<PercentPoint | null>(null);
  const [endPoint, setEndPoint] = useState<PercentPoint | null>(null);
  const [innerImg, setInnerImg] = useState<File | null>(null);
  const [innerImgId, setInnerImgId] = useState<number | null>(null);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [existingSpaces, setExistingSpaces] = useState<SpaceType[]>([]);
  const [existingPieces, setExistingPieces] = useState<PieceType[]>([]);

  const {
    setRootUniverse,
    parentSpaceId,
    rootUniverse,
    currentSpaceId,
    getSpaceById,
  } = useUniverseStore();

  useEffect(() => {
    console.log("currentSpaceId 바뀜", currentSpaceId);
    
    if (rootUniverse == null) loadInitialData();
    else if(currentSpaceId == rootUniverse.universeId){
      setExistingSpaces(rootUniverse.spaces);
      setExistingPieces(rootUniverse.pieces);
      setInnerImgId(rootUniverse.innerImageId);
    }
    else if (currentSpaceId != null) {
      var space = getSpaceById(currentSpaceId);
      console.log("space-------", space);
      
      if (space == null) return;

      setExistingSpaces(space.spaces);
      setExistingPieces(space?.pieces!);
      setInnerImgId(space.innerImageId);
      console.log(space);
    } else {
      console.log("에러");
    }
  }, [currentSpaceId]);

  const loadInitialData = async () => {
    try {
      if (currentSpaceId == null) return;

      const response = await fetch(
        `${API_CONFIG.BACK_API}/universes/tree/${currentSpaceId}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || "유니버스 조회 실패";
        alert(errorMessage);
        return;
      }

      const data: UniverseType = await response.json();
      setRootUniverse(data);
      setInnerImgId(data.innerImageId);
      setExistingSpaces(data.spaces);
      setExistingPieces(data.pieces);
      console.log("data", data);
    } catch (error) {
      console.error("유니버스 조회 오류:", error);
      alert("유니버스 조회 중 오류가 발생했습니다.");
    }
  };

  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 메뉴 닫기
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
    if (innerImgId !== -1) {
      const imageUrl = `${API_CONFIG.PUBLIC_IMAGE_LOAD_API}/attachment/${innerImgId}`;
      window.location.href = imageUrl;
    }
  };

  const createSpace = async (
    title: string,
    description: string
  ): Promise<void> => {
    if (!startPoint || !endPoint || !innerImg) {
      alert("스페이스 정보를 모두 입력해주세요.");
      return;
    }

    const formData = new FormData();
    const metadata = {
      universeId: rootUniverse?.universeId,
      parentSpaceId: currentSpaceId,
      title,
      description,
      startX: startPoint.xPercent,
      startY: startPoint.yPercent,
      endX: endPoint.xPercent,
      endY: endPoint.yPercent,
    };

    formData.append("metadata", JSON.stringify(metadata));
    formData.append("innerImage", innerImg);

    console.log(metadata);
    console.log(innerImg);

    try {
      const response = await fetch(`${API_CONFIG.BACK_API}/spaces`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || "스페이스 생성 실패";
        alert(errorMessage);
        return;
      }

      alert("스페이스가 생성되었습니다.");
    } catch (error) {
      console.error("스페이스 생성 오류:", error);
      alert("스페이스 생성 중 오류가 발생했습니다.");
    }
  };

  const handleSaveInnerImage = (file: File): void => {
    setInnerImg(file);
    setCreateStep(SpaceCreateStep.FillDetails);
  };

  const handleSubmit = (title: string, description: string) => {
    if (startPoint && endPoint && innerImg) {
      createSpace(title, description);
    }
  };

  const handleCreateModalClose = () => {
    setCreateStep(null);
    resetSelection();
    setInnerImg(null);
  };

  const menuItems =
    parentSpaceId === -1
      ? [
          {
            label: "이미지 수정",
            icon: <RiImageEditFill size={20} />,
            onClick: onEdit,
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
            onClick: onEdit,
          },
          {
            label: "이미지 다운로드",
            icon: <RiFileDownloadLine size={20} />,
            onClick: handleDownloadImage,
          },
          {
            label: "정보 수정",
            icon: <TbPencilCog size={20} />,
            onClick: onEdit,
          },
          {
            label: "좌표 수정",
            icon: <PiGpsBold size={20} />,
            onClick: handleDownloadImage,
          },
          {
            label: "스페이스 삭제",
            icon: <RiDeleteBin6Line size={20} />,
            onClick: onDelete,
          },
        ];

  return (
    <div
      ref={menuRef}
      className="h-full relative text-left group flex justify-center"
      onMouseLeave={() => setMenuOpen(false)}
    >
      {/* 점 메뉴 버튼 */}
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

      {/* 기능 버튼들 */}
      <button
        onClick={() => {}}
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
        onClick={() => {}}
        className="z-10 absolute cursor-pointer bottom-3 right-22 w-9 h-9 flex items-center justify-center backdrop-blur-sm rounded-full text-white hover:opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <MdOutlineFullscreen size={25} />
      </button>

      {/* 영역 선택 */}
      <SpaceSelector
        step={createStep}
        innerImageId={innerImgId}
        startPoint={startPoint}
        endPoint={endPoint}
        setStartPoint={setStartPoint}
        setEndPoint={setEndPoint}
        existingSpaces={existingSpaces}
        existingPieces={existingPieces}
      />

      {/* SetSize Step */}
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

      {/* UploadImage Step */}
      {createStep === SpaceCreateStep.UploadImage && (
        <ImageUploadModal
          title="스페이스 생성"
          description="새로운 스페이스를 생성합니다."
          labelText="스페이스 내부 이미지"
          maxFileSizeMB={100}
          onClose={handleCreateModalClose}
          onConfirm={handleSaveInnerImage}
          confirmText="다음"
          requireSquare={true}
        />
      )}

      {/* FillDetails Step */}
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
            detailInfo={{ title, description }}
            onSubmit={handleSubmit}
          />
        </IconTitleModal>
      )}
    </div>
  );
}
