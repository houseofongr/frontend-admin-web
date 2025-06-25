
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FiMoreHorizontal } from "react-icons/fi";
import { LuFileMusic } from "react-icons/lu";
import { convertUnixToDate } from "../../../utils/formatDate";
import { useState } from "react";


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
        >
          <BiDotsVerticalRounded size={20} />
        </div>

        {/* 날짜 */}
        <div className="text-[11px]  absolute bottom-1 right-0">
          {convertUnixToDate(createdTime).default}
        </div>
      </div>
    </div>
  );
};

export default SoundItem;
