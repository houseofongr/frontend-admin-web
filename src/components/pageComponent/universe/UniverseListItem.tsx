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
import { PiEyesFill } from "react-icons/pi";
import { IoHeart } from "react-icons/io5";
import { convertUnixToDate } from "../../../utils/formatDate";

interface UniverseListItemProps {
  universe: Universe;
  onDelete: (id: number) => void;
  onEditThumbnail: () => void; // 썸네일 편집 버튼 클릭
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
    createdTime,
    updatedTime,
    view,
    like,
    title,
    description,
    category,
    publicStatus,
    tags,
  } = universe;
  function getCategoryLabel(key?: string): string {
    if (!key) return "";
    return UniverseCategory[key as keyof typeof UniverseCategory] ?? key;
  }

  return (
    <>
      <li className="hidden lg:flex p-2 items-center text-center rounded-md bg-[#fbfafa] shadow space-x-1">
        {/* 썸네일 - 편집버튼 */}
        <span style={{ width: universeListHeaderTitles[0].width }}>
          <div className="flex justify-center">
            <Thumbnail
              thumbnailId={thumbnailId}
              onEdit={() => onEditThumbnail()}
            />
          </div>
        </span>

        {/* 제목 + 설명 */}
        <div style={{ width: universeListHeaderTitles[1].width }}>
          <div className="flex flex-col items-start pl-1">
            <span>{title}</span>
            <span className="text-gray-500 text-sm break-words">
              {description}
            </span>
          </div>
        </div>

        {/* 썸뮤직 */}
        <div
          style={{ width: universeListHeaderTitles[2].width }}
          className="flex items-center justify-center"
        >
          <RiPlayCircleLine
            size={22}
            onClick={() => onPlayMusic(thumbMusicId)}
            className={` cursor-pointer hover:text-[${AOO_COLOR.Orange}]`}
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
          {convertUnixToDate(createdTime).default}
        </div>

        {/* 조회수 */}
        <div
          className="flex justify-center"
          style={{ width: universeListHeaderTitles[6].width }}
        >
          {view}
        </div>

        {/* 좋아요 */}
        <div
          className="flex justify-center"
          style={{ width: universeListHeaderTitles[7].width }}
        >
          {like}
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

      <li className="hidden sm:flex md:flex lg:hidden flex-col p-2 text-center rounded-md bg-[#fbfafa] shadow  space-y-3 ">
        {/* 1. 썸네일, 제목/설명, 카테고리, 공개여부*/}
        <div className="flex flex-row mb-2 items-center justify-around">
          {/* 썸네일 */}
          <span className="w-[20%] flex justify-center">
            <Thumbnail
              thumbnailId={thumbnailId}
              onEdit={() => onEditThumbnail()}
            />
          </span>
          {/* 제목 | 설명 */}
          <div className="w-[40%] flex flex-col items-start ml-2">
            <span>{title}</span>
            <span className="text-gray-500 text-sm break-words">
              {description}
            </span>
          </div>
          {/* 썸뮤직 */}
          <div className="w-[10%] flex items-center">
            <RiPlayCircleLine
              size={20}
              onClick={() => onPlayMusic(thumbMusicId)}
              className={`cursor-pointer hover:text-[${AOO_COLOR.Orange}]`}
            />
          </div>
          {/* 공개여부 */}
          <div className="w-[15%]">{publicStatus}</div>
          {/* 카테고리 */}
          <div className="w-[15%]">{getCategoryLabel(category)}</div>
        </div>

        {/* ✅ 3. 생성일, 조회수, 좋아요, 편집, 삭제 → 다음줄에 분리 */}
        <div className="flex flex-row items-center text-sm gap-3 justify-end mr-1">
          <div className="w-[100px] mt-1">
            {convertUnixToDate(createdTime).default}
          </div>
          <div className="w-[50px] flex flex-row gap-2 mt-1">
            <PiEyesFill size={15} /> {view}
          </div>
          <div className="w-[50px] flex flex-row gap-2 mt-1">
            <IoHeart size={15} /> {like}
          </div>
          <RiPencilLine
            size={18}
            onClick={() => onEdit(id as number)}
            className={`w-[30px] cursor-pointer hover:text-[${AOO_COLOR.Orange}]`}
          />
          <RiDeleteBin6Line
            size={18}
            onClick={() => onDelete(id as number)}
            className={`w-[30px] cursor-pointer hover:text-[${AOO_COLOR.Orange}]`}
          />
        </div>
      </li>

      <li className="flex sm:hidden md:hidden lg:hidden flex-col p-2 text-center rounded-md bg-[#fbfafa] shadow ">
        {/* 1. 썸네일, 제목/설명, 카테고리, 공개여부*/}
        <div className="flex flex-row mb-2 items-center justify-around">
          <span className="w-[30%] flex justify-center">
            <Thumbnail
              thumbnailId={thumbnailId}
              onEdit={() => onEditThumbnail()}
            />
          </span>
          <div className="w-[60%] flex flex-col items-start ml-2">
            <span>{title}</span>
            <span className="text-gray-500 text-sm break-words">
              {description}
            </span>
          </div>
          <div className="w-[10%] flex items-center">
            <RiPlayCircleLine
              size={20}
              onClick={() => onPlayMusic(thumbMusicId)}
              className={`cursor-pointer hover:text-[${AOO_COLOR.Orange}]`}
            />
          </div>
        </div>

        {/* 2. 카테고리, 공개여부*/}
        <div className="flex flex-row items-center text-sm gap-3 justify-end mb-1">
          <div className="w-[20%]">{publicStatus}</div>
          <div className="w-[20%]">{getCategoryLabel(category)}</div>
        </div>

        {/* ✅ 3. 생성일, 조회수, 좋아요, 편집, 삭제 → 다음줄에 분리 */}
        <div className="flex flex-row items-center text-sm gap-1 justify-end">
          <div className="w-[18%] mt-1">
            {convertUnixToDate(createdTime).default}
          </div>
          <div className="w-[18%] flex flex-row gap-2 mt-1">
            <PiEyesFill size={15} /> {view}
          </div>
          <div className="w-[18%] flex flex-row gap-2 mt-1">
            <IoHeart size={15} /> {like}
          </div>
          <RiPencilLine
            size={18}
            onClick={() => onEdit(id as number)}
            className={`w-[30px] cursor-pointer hover:text-[${AOO_COLOR.Orange}]`}
          />
          <RiDeleteBin6Line
            size={18}
            onClick={() => onDelete(id as number)}
            className={`w-[30px] cursor-pointer hover:text-[${AOO_COLOR.Orange}]`}
          />
        </div>
      </li>
    </>
  );
}
