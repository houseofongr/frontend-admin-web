import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { soundListHeaderTitles } from "../constants/listHeader";
import { SoundListItem as SoundItem } from "../types/sound";
import CircleButton from "./common/buttons/CircleButton";
import API_CONFIG from "../config/api";
import { BiToggleLeft, BiToggleRight } from "react-icons/bi";
import { IoIosArrowForward } from "react-icons/io";
import { FaDoorClosed, FaDoorOpen, FaCloudDownloadAlt } from "react-icons/fa";

type SoundListItemProps = {
  sound: SoundItem;
  currentPage: number;
  size: number;
  index: number;
};

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

  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <li key={audioFileId} className="relative py-2 flex items-center text-center rounded-md bg-[#fbfafa] shadow ">
      <span style={{ width: soundListHeaderTitles[0].width }}>{listNumber}</span>
      <div className=" overflow-hidden line-clamp-2" style={{ width: soundListHeaderTitles[1].width }}>
        {userNickname}
      </div>

      <div className="flex justify-between items-center" style={{ width: soundListHeaderTitles[2].width }}>
        <span className="overflow-hidden line-clamp-1 w-[90%]">{homeName}</span>
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
            label={<FaCloudDownloadAlt size={18} color="#5f5c5d" className="hover:text-white" />}
            onClick={() => {}}
          />
        </a>
      </div>

      <button type="button" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <CircleButton
          hasBorder={false}
          label={
            isHovered ? (
              <FaDoorOpen
                size={20}
                color="#5f5c5d"
                className="hover:text-white"
                onClick={() => navigate(`/users/${userId}/${homeId}/${roomId}`)}
              />
            ) : (
              <FaDoorClosed size={20} color="#5f5c5d" className="hover:text-white" />
            )
          }
          onClick={() => {}}
        />
      </button>
    </li>
  );
}
