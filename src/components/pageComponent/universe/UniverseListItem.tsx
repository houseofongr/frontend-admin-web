import { Universe } from "../../../types/universe";
import { UniverseCategory } from "../../../constants/universeData";
import { universeListHeaderTitles } from "../../../constants/headerList";
import {
  RiDeleteBin6Line,
  RiPencilLine,
  RiPlayCircleLine,
} from "react-icons/ri";
import Thumbnail from "../../Thumbnail";
import { AOO_COLOR } from "../../../constants/color";

interface UniverseListItemProps {
  universe: Universe;
  onDelete: (id: number) => void;
  onEditThumbnail: (id: number) => void; // 썸네일 편집 버튼 클릭
  onPlayMusic: (id: number) => void; // 썸뮤직 클릭
  onEdit: (id: number) => void; // 편집 클릭
}

export default function UniverseListItem({
  universe,
  onDelete,
  onEditThumbnail,
  onPlayMusic: onPlayMusic,
  onEdit,
}: UniverseListItemProps) {
  const {
    id,
    thumbnailId,
    thumbMusicId,
    createdDate,
    updatedDate,
    viewCount,
    likeCount,
    title,
    description,
    category,
    publicStatus,
    hashtags,
  } = universe;

  function getCategoryLabel(key?: string): string {
    if (!key) return "";
    return UniverseCategory[key as keyof typeof UniverseCategory] ?? key;
  }

  return (
    <li
      key={id}
      className="p-2 flex items-center text-center rounded-md bg-[#fbfafa] shadow"
    >
      {/* 썸네일 - 편집버튼 */}
      <span
        style={{ width: universeListHeaderTitles[0].width }}
        className="flex justify-center"
      >
        <Thumbnail imageUrl="" onEdit={() => onEditThumbnail(thumbnailId)} />
      </span>

      {/* 제목 + 설명 */}
      <div
        className="flex flex-col items-start"
        style={{ width: universeListHeaderTitles[1].width }}
      >
        <span>{title}</span>
        <span className="text-gray-500 text-sm break-words">{description}</span>
      </div>

      {/* 썸뮤직 */}
      <div
        style={{ width: universeListHeaderTitles[2].width }}
        className="flex justify-center hover:"
      >
        <RiPlayCircleLine
          size={22}
          onClick={() => onPlayMusic(thumbMusicId)}
          className={`cursor-pointer hover:text-[${AOO_COLOR.Orange}]`}
        />
      </div>

      {/* 공개 여부 */}
      <div style={{ width: universeListHeaderTitles[3].width }}>
        {publicStatus}
      </div>

      {/* 카테고리 */}
      <div style={{ width: universeListHeaderTitles[4].width }}>
        {getCategoryLabel(category)}
      </div>

      {/* 생성일 */}
      <div style={{ width: universeListHeaderTitles[5].width }}>
        {createdDate}
      </div>

      {/* 조회수 */}
      <div
        className="flex justify-center"
        style={{ width: universeListHeaderTitles[6].width }}
      >
        {viewCount}
      </div>

      {/* 좋아요 */}
      <div
        className="flex justify-center"
        style={{ width: universeListHeaderTitles[7].width }}
      >
        {likeCount}
      </div>

      {/* 편집 아이콘 */}
      <div
        className="flex justify-center"
        style={{ width: universeListHeaderTitles[8].width }}
      >
        <RiPencilLine
          size={20}
          onClick={() => onEdit(id as number)}
          className={`cursor-pointer hover:text-[${AOO_COLOR.Orange}]`}
        />
      </div>

      {/* 삭제 아이콘 */}
      <div
        className="flex justify-center"
        style={{ width: universeListHeaderTitles[9].width }}
      >
        <RiDeleteBin6Line
          size={20}
          onClick={() => onDelete(id as number)}
          className={`cursor-pointer hover:text-[${AOO_COLOR.Orange}]`}
        />
      </div>
    </li>
  );
}
