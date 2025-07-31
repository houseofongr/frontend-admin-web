import InitHouseImage from "../components/InitHouseImage";
import InitText from "../components/InitText";
import { Link } from "react-router-dom";
import { FOOTER_HEIGHT, HEADER_HEIGHT } from "../constants/size";
import AudioWaveform from "../components/Sound/V2/AudioWaveform";
import API_CONFIG from "../config/api";

export default function TestPage() {
  return (
    <div>
      {/* <AudioWaveform
        audioUrl={previewMusic}
        mode="light"
        audioTitle={thumbMusic?.name || "썸네일 음악 미리듣기"}
        waveVisible={false}
      /> */}
      <AudioWaveform
        audioUrl={`/public/sound/Heroic Reception - Kevin MacLeod.mp3`}
        mode="dark"
      />
    </div>
  );
}
