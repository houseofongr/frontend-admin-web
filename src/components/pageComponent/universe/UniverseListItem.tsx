import { Universe } from "../../../types/universe";
import { UniverseCategory } from "../../../constants/universeData";
import { universeListHeaderTitles } from "../../../constants/headerList";
import { RiDeleteBin6Line, RiPencilLine } from "react-icons/ri";
import Thumbnail from "../../Thumbnail";


interface UniverseListItemProps {
  universe: Universe;
}

export default function UniverseListItem({ universe: universe }: UniverseListItemProps) {
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
      className="py-2 flex items-center text-center rounded-md bg-[#fbfafa] shadow "
    >
      <span style={{ width: universeListHeaderTitles[0].width }} className="flex justify-center">
        <Thumbnail imageUrl="" onEdit={() => {}}/>
      </span>
      <div
        className="flex flex-col items-start"
        style={{ width: universeListHeaderTitles[1].width }}
      >
        <span>{title}</span>
        <span className="text-gray-500 text-sm break-words">{description}</span>
      </div>
      <div style={{ width: universeListHeaderTitles[2].width }}>
        {thumbMusicId}
      </div>
      <div style={{ width: universeListHeaderTitles[3].width }}>
        {publicStatus}
      </div>
      <div style={{ width: universeListHeaderTitles[4].width }}>
        {getCategoryLabel(category)}
      </div>
      <div style={{ width: universeListHeaderTitles[5].width }}>
        {createdDate}
      </div>
      <div
        className="flex-center pr-3"
        style={{ width: universeListHeaderTitles[6].width }}
      >
        {viewCount}
      </div>
      <div
        className="flex-center pr-3"
        style={{ width: universeListHeaderTitles[7].width }}
      >
        {likeCount}
      </div>
      <div
        className="flex-center pr-3"
        style={{ width: universeListHeaderTitles[8].width }}
      >
        <RiPencilLine />
      </div>
      <div
        className="flex-center pr-3"
        style={{ width: universeListHeaderTitles[9].width }}
      >
        <RiDeleteBin6Line />
      </div>
    </li>
  );
}
