import { BiDotsVerticalRounded } from "react-icons/bi";
import { FiMoreHorizontal } from "react-icons/fi";
import { LuFileMusic } from "react-icons/lu";
import { convertUnixToDate } from "../../../utils/formatDate";
import { useState } from "react";
import {
  RiDeleteBin6Line,
  RiFileDownloadLine,
  RiImageEditFill,
} from "react-icons/ri";
import { PiGpsBold } from "react-icons/pi";
import { TbPencilCog } from "react-icons/tb";
import ContextMenu from "../../../components/ContextMenu";

interface SoundItemProps {
  index: number;
  title: string;
  description: string;
  createdTime: number;
}

const SoundItem: React.FC<SoundItemProps> = ({
  index,
  title,
  description,
  createdTime,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleInnerImgEdit = (type: string) => {
    console.log("이미지 수정", type);
    setMenuOpen(false);
  };
  const handleDownloadImage = () => {
    console.log("이미지 다운로드");
    setMenuOpen(false);
  };
  const setShowInfoEdit = (show: boolean) => {
    console.log("정보 수정 열기");
    setMenuOpen(false);
  };
  const handleCoordinatesEdit = () => {
    console.log("좌표 수정");
    setMenuOpen(false);
  };
  const handleSpaceDelete = () => {
    console.log("스페이스 삭제");
    setMenuOpen(false);
  };

  const menuItems = [
    {
      label: "이미지 수정",
      icon: <RiImageEditFill size={20} />,
      onClick: () => handleInnerImgEdit("space"),
    },
    {
      label: "이미지 다운로드",
      icon: <RiFileDownloadLine size={20} />,
      onClick: handleDownloadImage,
    },
    {
      label: "정보 수정",
      icon: <TbPencilCog size={20} />,
      onClick: () => setShowInfoEdit(true),
    },
    {
      label: "좌표 수정",
      icon: <PiGpsBold size={20} />,
      onClick: handleCoordinatesEdit,
    },
    {
      label: "피스 삭제",
      icon: <RiDeleteBin6Line size={20} />,
      onClick: handleSpaceDelete,
    },
  ];

  return (
    <div
      key={index}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      className="relative flex flex-col items-start gap-2 border-b py-3 group text-white"
    >
      {/* 트랙 번호 */}
      <div className="font-semibold text-primary">TRACK NO. {index + 1}</div>
      <div className="flex flex-row">
        {/* 아이콘 */}
        <div className="mr-3 mt-1">
          <LuFileMusic size={25} />
        </div>

        {/* 정보 영역 */}
        <div className="flex-1 relative mb-2">
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs mt-1 mr-5">{description}</div>
        </div>

        {/* 수정 아이콘 - hoveredIndex가 현재 인덱스일 때만 표시 */}
        <div
          className="absolute top-2 right-0 transition-opacity duration-400 cursor-pointer"
          style={{ opacity: hoveredIndex === index ? 1 : 0 }}
                  onClick={() => setMenuOpen(true)}

        >
          <BiDotsVerticalRounded size={20} />
        </div>

        {/* 날짜 */}
        <div className="text-[11px]  absolute bottom-1 right-0">
          {convertUnixToDate(createdTime).default}
        </div>

        {/* ContextMenu 렌더링 */}
        {menuOpen && (
          <ContextMenu
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            items={menuItems}
            position={{ right: 53, top: 37 }}
          />
        )}
      </div>
    </div>
  );
};

export default SoundItem;
