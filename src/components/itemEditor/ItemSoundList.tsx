import SoundItem from "./SoundItem";
import { ItemSoundsData } from "../../types/sound";

type SoundListProps = {
  sounds: ItemSoundsData;
  onSoundSelect: (soundSourceId: number) => void;
};

export default function ItemSoundList({ sounds, onSoundSelect }: SoundListProps) {
  console.log("item sound list", sounds);

  if (sounds.soundSource.length === 0)
    return (
      <section className="w-[50%] h-full px-5  bg-black/20 ">
        <div className="text-center py-4 ">아이템 음원 목록</div>
        <p>'{sounds.itemName}' 에 소리를 등록해주세요.</p>
      </section>
    );

  return (
    <section className="w-[50%] h-full px-5  bg-black/20 overflow-auto">
      <div className="text-center py-4 ">아이템 음원 목록</div>

      <ul className="" role="list">
        <div className="pb-2">'{sounds.itemName}' 에 기록되고 있는 소리 모음</div>
        {sounds?.soundSource.map((sound) => (
          <SoundItem key={sound.id} sound={sound} onClick={() => onSoundSelect(sound.id!)} />
        ))}
        {/* {ITEM_SOUND_LIST.soundSource.map((sound) => (
          <SoundItem key={sound.id} sound={sound} onClick={() => onSoundSelect(sound.id!)} />
        ))} */}
      </ul>
    </section>
  );
}
