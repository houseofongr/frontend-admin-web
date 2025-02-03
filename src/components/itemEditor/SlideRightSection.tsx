import { ItemSoundsData } from "../../types/sound";
import NewSoundForm from "./NewSoundForm";
import ItemSoundList from "./ItemSoundList";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchSoundDetails } from "../../service /soundService";

type SoundListProps = {
  sounds: ItemSoundsData;
  itemId: number | null;
};
export default function SlideRightSection({ sounds, itemId }: SoundListProps) {
  const [selectedSoundId, setSelectedSoundId] = useState<number | null>(null);

  //   음원 한 개 상세 데이터 조회
  const { data: soundMetadata, isLoading } = useQuery({
    queryKey: ["soundDetails", selectedSoundId],
    queryFn: () => fetchSoundDetails(selectedSoundId!),
    enabled: !!selectedSoundId,
  });

  return (
    <div
      className={`flex h-screen w-full items-center transition-all duration-300  
       `}
    >
      <ItemSoundList sounds={sounds} onSoundSelect={setSelectedSoundId} />
      {itemId && !isLoading && (
        <NewSoundForm itemId={itemId} soundOriginData={soundMetadata} soundId={selectedSoundId} />
      )}
    </div>
  );
}
