import API_CONFIG from "../../config/api";
import { SoundSource } from "../../types/sound";
import WaveformWithAudio from "../Waveform";

type NotepadContentProps = {
  data: SoundSource;
};

export default function PreviewContent({ data }: NotepadContentProps) {
  const { name, description, audioFileId, updatedDate } = data;

  return (
    <div className="flex text-black  border-black h-[560px]">
      {/* left */}
      <div className="w-1/2 relative">
        <div
          className="absolute top-[14%] bg-cover bg-center "
          style={{ backgroundImage: 'url("/images/notepad/notepad_v3.png")', width: 500, height: 380 }}
        />
        {/* todo : 텍스트 길이 대응 */}
        <div className="relative mt-30 pl-15 text-gray-700">
          <div className="h-full flex flex-col pr-15">
            <div className="block text-4xl pt-10 mb-1 text-start" style={{ fontFamily: "SangSangShinb7" }}>
              {name}
            </div>
            <div className=" leading-tight break-words text-2xl " style={{ fontFamily: "SangSangShinb7" }}>
              {description}
            </div>
            <span className="block text-2xl text-end mr-10" style={{ fontFamily: "SangSangShinb7" }}>
              {updatedDate}
            </span>
          </div>
        </div>
      </div>
      {/* right - 웨이브폼 */}
      <div className="w-1/2 flex-center p-10  ">
        {/* type = sound */}
        <WaveformWithAudio audioUrl={`${API_CONFIG.PRIVATE_AUDIO_LOAD_API}/${audioFileId}`} audioTitle={name} />
        {/* type = video */}
        {/* <video controls width="800" src={"/video/cat.mp4"} /> */}
      </div>
    </div>
  );
}
