import { soundListHeaderTitles } from "../constants/listHeader";
import { BsDownload } from "react-icons/bs";
import { SoundListItem as SoundItem } from "../types/sound";
import CircleButton from "./common/buttons/CircleButton";

import API_CONFIG from "../config/api";
import { BiToggleLeft, BiToggleRight } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

type SoundListItemProps = {
  sound: SoundItem;
  currentPage: number;
  size: number;
  index: number;
};

//  {
//     "name" : "골골송",
//     "description" : "2025년 골골송 V1",
//     "createdDate" : "2025.02.06.",
//     "updatedDate" : "2025.02.06.",
//     "isActive" : false,
//     "audioFileId" : 1,
//     "userNickname" : "leaf",
//     "userEmail" : null,
//     "userId" : 10,
//     "homeName" : "leaf의 cozy house",
//     "homeId" : 1,
//     "roomName" : "거실",
//     "roomId" : 1,
//     "itemName" : "설이",
//     "itemId" : 1
//  }

// export const soundListHeaderTitles = [
//   { name: "NO.", width: "5%" },
//   { name: "닉네임", width: "10%" },
//   { name: "홈", width: "20%" },
//   { name: "룸", width: "10%" },
//   { name: "아이템", width: "15%" },
//   { name: "소리", width: "25%" },
//   { name: "릴리즈", width: "5%" },
//   { name: "다운로드", width: "10%" },
// ];

export default function SoundListItem({ sound, currentPage, size, index }: SoundListItemProps) {
  const {
    userId,
    homeId,
    roomId,
    audioFileId,
    userNickname,
    homeName,
    roomName,
    itemName,
    name,
    // updatedDate,
    // createdDate,
    isActive,
  } = sound;
  const listNumber = (currentPage - 1) * size + index + 1;
  const navigation = useNavigate();

  return (
    <li key={audioFileId} className="relative py-2 flex items-center text-center rounded-md bg-[#fbfafa] shadow ">
      <span style={{ width: soundListHeaderTitles[0].width }}>{listNumber}</span>
      <div className=" overflow-hidden line-clamp-2" style={{ width: soundListHeaderTitles[1].width }}>
        {userNickname}
        {/* {"유저닉네임긴거테스트하기"} */}
      </div>

      <div className="flex justify-between items-center" style={{ width: soundListHeaderTitles[2].width }}>
        <span className="overflow-hidden line-clamp-1 w-[90%]">{homeName}</span>
        {/* <span className="overflow-hidden line-clamp-1 w-[90%]">{"아오옹의 시그니처 하우스"}</span> */}

        <IoIosArrowForward color="#F5946D" />
      </div>
      <div className="flex justify-between items-center" style={{ width: soundListHeaderTitles[3].width }}>
        <span className="overflow-hidden line-clamp-1 w-[90%]">{roomName}</span>
        <IoIosArrowForward color="#F5946D" />
      </div>

      <div className="flex justify-between items-center " style={{ width: soundListHeaderTitles[4].width }}>
        <span className="overflow-hidden line-clamp-1 w-[90%]">{itemName}</span>
        <IoIosArrowForward color="#F5946D" />
      </div>

      <div className=" overflow-hidden line-clamp-1 text-stone-600" style={{ width: soundListHeaderTitles[5].width }}>
        {name}
        {/* {"소리 타이틀 긴거테스트하기"} */}
      </div>

      <div className=" flex justify-center" style={{ width: soundListHeaderTitles[6].width }}>
        {isActive === true ? <BiToggleLeft size={25} color="#F5946D" /> : <BiToggleRight size={25} color="gray" />}
      </div>
      <div style={{ width: soundListHeaderTitles[7].width }}>
        <a
          href={`${API_CONFIG.PRIVATE_AUDIO_LOAD_API}/${audioFileId}`}
          // target="_blank"
        >
          <CircleButton
            hasBorder={false}
            label={<BsDownload size={20} color="#352f2f" className="hover:text-white" />}
            onClick={() => {}}
          />
        </a>
      </div>

      {/* 추후 삭제 */}
      <button
        className="absolute right-0 bg-amber-400 text-xs rounded-full p-2"
        onClick={() => navigation(`/users/${userId}/${homeId}/${roomId}`)}
      >
        go
      </button>
    </li>
  );
}
