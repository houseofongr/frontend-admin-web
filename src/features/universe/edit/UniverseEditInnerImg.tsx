import { useState, useRef, useEffect } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import API_CONFIG from "../../../config/api";
import { RiImageEditFill, RiFileDownloadLine, RiFunctionAddLine } from "react-icons/ri";
import ContextMenu from "../../../components/ContextMenu";
import { MdOutlineFullscreen } from "react-icons/md";
import { PiDownloadSimpleBold, PiPaintBrushBroad, PiPaintBrushBroadDuotone } from "react-icons/pi";
import { IoPlanetOutline } from "react-icons/io5";
import DraggableIconTitleModal from "../../../components/modal/DraggableIconTitleModal";
import SpaceSelector from "../components/SpaceSelector";
import { HiOutlinePaintBrush } from "react-icons/hi2";
import { LuPaintbrush } from "react-icons/lu";

interface UniverseEditInnerImgProps {
  innerImageId: number;
  onEdit: () => void;
}

export default function UniverseEditInnerImg({
  innerImageId,
  onEdit,
}: UniverseEditInnerImgProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [createSpaceModalOpen, setCreateSpaceModalOpen] = useState(false);

  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [endPoint, setEndPoint] = useState<{ x: number; y: number } | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  const resetSelection = () => {
    setStartPoint(null);
    setEndPoint(null);
  };

  const menuRef = useRef<HTMLDivElement>(null);

  const handleDownloadImage = async () => {
    try {
      if (innerImageId!= -1 ){
        const imageUrl = `${API_CONFIG.PUBLIC_IMAGE_LOAD_API}/attachment/${innerImageId}`;
        window.location.href = imageUrl;
      }
    } catch (error) {
      console.error("이미지 다운로드 실패:", error);
    }
  };
  // 외부 클릭 감지 후 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
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
  ];

  return (
    <div
      ref={menuRef}
      className="h-full relative text-left group flex justify-center"
      onMouseLeave={() => setMenuOpen(false)}
    >
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="z-20 absolute cursor-pointer top-2 right-2 w-7 h-7 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <BiDotsVerticalRounded size={20} />
      </button>

      <ContextMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={menuItems}
      />

      <button
        onClick={() => {}}
        className="z-50 absolute cursor-pointer bottom-3 right-3 w-9 h-9 flex items-center justify-center backdrop-blur-sm rounded-full text-white hover:opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <PiDownloadSimpleBold size={20} />
      </button>
      <button
        onClick={() => {}}
        className="z-50 absolute cursor-pointer bottom-3 right-12 w-9 h-9 flex items-center justify-center backdrop-blur-sm rounded-full text-white hover:opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <RiFunctionAddLine size={20} />
      </button>
      <button
        onClick={() => {
          setCreateSpaceModalOpen(true);
        }}
        className="z-50 absolute cursor-pointer bottom-3 right-22 w-9 h-9 flex items-center justify-center backdrop-blur-sm rounded-full text-white hover:opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <MdOutlineFullscreen size={25} />
      </button>

      <SpaceSelector
        createSpaceModalOpen={createSpaceModalOpen}
        innerImageId={innerImageId}
        startPoint={startPoint}
        endPoint={endPoint}
        setStartPoint={setStartPoint}
        setEndPoint={setEndPoint}
      />

      {createSpaceModalOpen && (
        <DraggableIconTitleModal
          onClose={() => setCreateSpaceModalOpen(false)}
          title="스페이스 생성"
          description="새로운 스페이스를 생성합니다."
          icon={<IoPlanetOutline className="text-blue-950" size={20} />}
          bgColor="white"
        >
          <div className="flex flex-col items-center justify-center text-center p-4 gap-4">
            <div>
              <p>원하는 크기로 조절을 완료하세요.</p>
              <p className="mt-1 text-sm text-neutral-500">
                {"(안내창은 드래그해서 이동할 수 있습니다.)"}
              </p>
            </div>

            <button
              onClick={resetSelection}
              className="px-10 py-2 border-2 border-neutral-600 text-neutral-600 font-bold rounded-lg hover:bg-neutral-200 transition cursor-pointer"
            >
              <div className="flex flex-row justify-center gap-3">
                <LuPaintbrush size={20} />
                <p>다시 그리기</p>
              </div>
            </button>
            <div className="flex gap-3">
              <button className="px-5 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition cursor-pointer">
                완료
              </button>
              <button className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition cursor-pointer">
                취소
              </button>
            </div>
          </div>
        </DraggableIconTitleModal>
      )}
    </div>
  );
}
