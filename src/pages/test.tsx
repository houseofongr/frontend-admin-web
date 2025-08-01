import InitHouseImage from "../components/InitHouseImage";
import InitText from "../components/InitText";
import { Link } from "react-router-dom";
import { FOOTER_HEIGHT, HEADER_HEIGHT } from "../constants/size";
import AudioWaveform from "../components/Sound/V2/AudioWaveform";
import API_CONFIG from "../config/api";
import SpaceSelector_MultiSelect from "../features/space/components/SpaceSelector_multiSelect";
import { useEffect, useState } from "react";
import { PercentPoint } from "../constants/image";
import { useUniverseStore } from "../context/useUniverseStore";
import { SpacePiece_CreateEditStep } from "../constants/ProcessSteps";

export default function TestPage() {
  const [selectedPoints, setSelectedPoints] = useState<PercentPoint[]>([]);
  const { editStep, setEditStep } = useUniverseStore();

  useEffect(() => {
    setEditStep(SpacePiece_CreateEditStep.Space_SetSizeOnEdit);
  }, []);

  useEffect(() => {
    console.log(selectedPoints);
  }, [selectedPoints]);

  return (
    <div>
      <div
        className="w-200 h-200 bg-amber-200"
        onClick={() => console.log(editStep?.toString())}
      >
        <SpaceSelector_MultiSelect
          innerImageId={`/images/house/AOO_INIT_HOUSE_GRAY.png`}
          selectedPoints={selectedPoints}
          setSelectedPoints={setSelectedPoints}
        />
      </div>
      {/* <AudioWaveform
        audioUrl={`/public/sound/Heroic Reception - Kevin MacLeod.mp3`}
        mode="dark"
      /> */}
    </div>
  );
}
