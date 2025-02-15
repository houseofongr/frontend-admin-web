import API_CONFIG from "../../config/api";
import { SoundSource } from "../../types/sound";
import WaveformWithAudio from "../Waveform";

type NotepadContentProps = {
  data: SoundSource;
};

export default function PreviewContent({ data }: NotepadContentProps) {
  const { name, description, audioFileId, updatedDate } = data;

  return (
    <div className="flex text-black  h-[560px] ">
      <div className="w-1/2 relative">
        <div
          className="absolute top-5 left-10 bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/notepad/notepad_v6.png")', width: 440, height: 500 }}
        />

        <div className="relative mt-30 pl-20 pr-15 text-gray-700">
          <div className="h-full flex flex-col pr-15">
            <h2 className="text-4xl pt-10 mb-1 text-start" style={{ fontFamily: "SangSangShinb7" }}>
              {name}
            </h2>
            <p className="leading-tight break-words text-2xl " style={{ fontFamily: "SangSangShinb7" }}>
              {description}
            </p>
            <span className="text-2xl text-end" style={{ fontFamily: "SangSangShinb7" }}>
              {updatedDate}
            </span>
          </div>
        </div>
      </div>

      <div className="w-1/2 flex-center p-10  ">
        {/* type = sound */}
        <WaveformWithAudio audioUrl={`${API_CONFIG.PRIVATE_AUDIO_LOAD_API}/${audioFileId}`} audioTitle={name} />
        {/* type = video */}
        {/* <video controls width="800" src={"/video/cat.mp4"} /> */}
      </div>
    </div>
  );
}
