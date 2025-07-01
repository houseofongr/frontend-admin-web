import { BiDotsVerticalRounded } from "react-icons/bi";
import { convertUnixToDate } from "../../../utils/formatDate";
import { useEffect, useRef, useState } from "react";
import {
  RiDeleteBin6Line,
  RiFileDownloadLine,
  RiImageEditFill,
} from "react-icons/ri";
import { PiGpsBold } from "react-icons/pi";
import { TbMusic, TbPencilCog } from "react-icons/tb";
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
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // ✅ 메뉴와 아이템을 감지할 ref
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // ✅ 외부 클릭 감지용 useEffect
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

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

  const handleClick = (e: React.MouseEvent) => {
    setMenuOpen(true);
    const rect = e.currentTarget.getBoundingClientRect();

    setMenuOpen(true);
    setMenuPosition({
      top: rect.bottom + 4, // 요소 아래에 위치
      left: rect.left - 180,
    });
  };

  return (
    <div
      key={index}
      onClick={() => {
        if (!menuOpen) {
          console.log("클릭"); // 전체 박스 클릭 시 처리할 함수
        }
      }}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      className="relative overflow-visible"
    >
      <div className="flex flex-col items-start gap-2 border-b py-3 group text-white cursor-pointer hover:opacity-70 transition-all duration-200">
        {/* 트랙 번호 */}
        <div className="font-semibold text-primary">TRACK NO. {index + 1}</div>

        <div className="flex flex-row w-full">
          {/* 아이콘 */}
          <div className="mr-3">
            <TbMusic size={25} />
          </div>

          {/* 정보 영역 */}
          <div className="flex-1 relative mb-2">
            <div className="text-sm font-semibold">{title}</div>
            <div className="text-xs mt-1 mr-5">{description}</div>
          </div>

          {/* 수정 아이콘 */}
          <div
            className="absolute top-2 right-0 transition-opacity duration-400 cursor-pointer"
            style={{ opacity: hoveredIndex === index ? 1 : 0 }}
            onClick={(e) => {
              e.stopPropagation(); // 부모 onClick 막기!
              // setMenuOpen(true);
              handleClick(e);
            }}
          >
            <BiDotsVerticalRounded size={20} />
          </div>

          {/* 날짜 */}
          <div className="text-[11px] absolute bottom-1 right-0">
            {convertUnixToDate(createdTime).default}
          </div>
        </div>
      </div>

      {/* ContextMenu 렌더링 */}
      {menuOpen && (
        <div ref={wrapperRef}>
          <ContextMenu
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            items={menuItems}
            position={menuPosition}
            positionMode="fixed"
          />
        </div>
      )}
    </div>
  );
};

export default SoundItem;
