
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FiMoreHorizontal } from "react-icons/fi";
import { LuFileMusic } from "react-icons/lu";
import { convertUnixToDate } from "../../../utils/formatDate";


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

  return (
    <div className="relative flex flex-col items-start gap-2 border-b py-3 group text-white">
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

        {/* 수정 아이콘 (hover 시 보임) */}
        <div className="absolute top-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
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
