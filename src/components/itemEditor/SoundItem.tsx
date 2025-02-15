import { formatDate } from "../../utils/formatDate";
import CardLabel from "../label/CardLabel";
import { SoundSource } from "../../types/sound";
import { MdAudiotrack } from "react-icons/md";

type SoundItemProps = {
  sound: SoundSource;
  onClick: () => void;
};
export default function SoundItem({ sound, onClick }: SoundItemProps) {
  return (
    <li className="group/item flex flex-col  cursor-pointer py-3 px-1 w-full" onClick={onClick}>
      <div className="pl-1">
        <CardLabel text={`AUDIO ID#${sound.id}`} hasBorder={false} hasPadding={false} />
      </div>

      <div className="group/edit">
        <div className="group-hover/edit:bg-gray-300/20">
          <div className="flex ">
            <div className="px-1 pt-2">
              <MdAudiotrack size={20} color="" />
            </div>

            <div>
              <p className="text-[14px]">{sound.name}</p>
              <div className="text-xs text-gray-400">
                {formatDate(sound.createdDate)} / {formatDate(sound.updatedDate)}
              </div>
            </div>
          </div>
          <p className="text-xs pl-1 text-gray-300 line-clamp-2">{sound.description}</p>
        </div>
      </div>
    </li>
  );
}
