import { AiOutlineHome } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import CardLabel from "../label/CardLabel";
import { formatDate } from "../../utils/formatDate";
import CircleButton from "../buttons/CircleButton";

interface UserHomeCardProps {
  home: {
    id: number;
    name: string;
    baseHouse: {
      author: string;
      description: string;
    };
    updatedDate: string;
  };
  isNew: boolean;
  onNavigate: (homeId: number) => void;
  onDelete: (homeId: number) => void;
}

export default function HomeCard({ home, isNew, onNavigate, onDelete }: UserHomeCardProps) {
  return (
    <li className="p-5 bg-[#fbfafa] shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex gap-1 justify-end">
          {isNew && <CardLabel text="NEW" size="default" hasPadding colorType="notice" />}
          <CardLabel text={`HOME ID#${home.id}`} size="default" hasPadding />
        </div>
        <p className="text-lg border-b border-gray-200 pt-1 pb-3">{home.name}</p>
      </div>
      <div className="pt-2">
        <div>
          <span className="mr-2">작가</span>
          <span className="font-light">{home.baseHouse.author}</span>
        </div>
        <div>
          <span className="mr-2">설명</span>
          <span className="font-light overflow-hidden">{home.baseHouse.description}</span>
        </div>
        <div>
          <span className="mr-2">음원 개수</span>
          <span className="font-light">10개</span>
        </div>
        <p className="text-sm font-thin text-gray-400">
          생성일 {formatDate(home.updatedDate)} / 수정일 {formatDate(home.updatedDate)}
        </p>
      </div>

      <div className="text-end">
        <CircleButton label={<BsTrash size={25} color="#352f2f" />} onClick={() => onDelete(home.id)} />
        <CircleButton label={<AiOutlineHome size={25} color="#352f2f" />} onClick={() => onNavigate(home.id)} />
      </div>
    </li>
  );
}
