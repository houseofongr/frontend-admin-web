import { formatDate } from "../../utils/formatDate";
import { FcAudioFile } from "react-icons/fc";
import CardLabel from "../label/CardLabel";
import { SoundSource } from "../../types/sound";

type SoundItemProps = {
  sound: SoundSource;
  onClick: () => void;
};
export default function SoundItem({ sound, onClick }: SoundItemProps) {
  return (
    <li className="flex flex-col p-2  border-black cursor-pointer" onClick={onClick}>
      <div className="flex justify-between">
        <CardLabel text={`AUDIO ID#${sound.id}`} hasBorder={false} />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex">
          <FcAudioFile size={40} />
          <div>
            <p className="text-[14px]">{sound.name}</p>
            <div className="text-xs text-gray-400">
              {formatDate(sound.createdDate)} / {formatDate(sound.updatedDate)}
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-300 line-clamp-2">{sound.description}</p>
      </div>
    </li>
  );
}
