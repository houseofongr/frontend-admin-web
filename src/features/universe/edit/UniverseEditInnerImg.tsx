import { useState, useRef, useEffect } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import API_CONFIG from "../../../config/api";
import { RiImageEditFill, RiFileDownloadLine } from "react-icons/ri";
import ContextMenu from "../../../components/ContextMenu";

interface UniverseEditInnerImgProps {
  innerImageId: number;
  onEdit: () => void;
}

export default function UniverseEditInnerImg({
  innerImageId,
  onEdit,
}: UniverseEditInnerImgProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleDownloadImage = async () => {
    try {
      if (innerImageId!= -1 ){
        const imageUrl = `${API_CONFIG.PUBLIC_IMAGE_LOAD_API}/attachment/${innerImageId}`;
        window.location.href = imageUrl;
      }


      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);

      // const link = document.createElement("a");
      // link.href = url;
      // link.download = "image.jpg";
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);

      // window.URL.revokeObjectURL(url); // 메모리 해제
    } catch (error) {
      console.error("이미지 다운로드 실패:", error);
    }
  };
  // 외부 클릭 감지 후 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
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
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen(!open)}
        className="absolute cursor-pointer top-1 right-1 w-7 h-7 flex items-center justify-center bg-black/10 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <BiDotsVerticalRounded size={20} />
      </button>

      <ContextMenu
        open={open}
        onClose={() => setOpen(false)}
        items={menuItems}
      />

      {innerImageId !== -1 && (
        <img
          src={`${API_CONFIG.PUBLIC_IMAGE_LOAD_API}/${innerImageId}`}
          alt=""
          className="object-contain block mx-auto"
        />
      )}
    </div>
  );
}
