import { SoundSource } from "../../types/sound";
import WaveformWithAudio from "../Waveform";

type NotepadContentProps = {
  data: SoundSource;
};

export default function PreviewContent({ data }: NotepadContentProps) {
  const { name, description, updatedDate } = data;

  return (
    <div className="flex text-black  border-black h-[540px]">
      {/* left */}
      <div className="w-1/2 relative">
        <div
          className="absolute top-[20%]  bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/notepad/notepad_v2.png")', width: 500, height: 320 }}
        />
        {/* todo : 텍스트 길이 대응 */}
        <div className="relative mt-30 pl-10 pr-3 text-gray-700">
          <div className="h-full flex flex-col pl-4 pr-12">
            <span className="block text-xl pt-10 mb-3 text-center">{name}</span>

            <div className=" leading-tight break-words ">{description}</div>
            <span className="block text-end mr-21` ">작성일 {updatedDate}</span>
            {/* <img src="/images/player.png" /> */}
            {/* 상상폰트 적용시  */}
            {/* <span className="block text-5xl  pt-10 mb-4 ">{name}</span>
            <div className=" leading-tight break-words text-3xl">{description}</div>
            <span className="block  text-xl text-end ">작성일 {updatedDate}</span> */}
          </div>
        </div>
      </div>
      {/* right - 웨이브폼 */}
      <div className="w-1/2 flex-center p-10  ">
        {/* type = sound */}
        <WaveformWithAudio audioUrl={"/audio/HOO_02.mp3"} />
        {/* <audio controls src={`${API_CONFIG.PRIVATE_AUDIO_LOAD_API}/${sound.audioFileId}`}></audio> */}
        {/* type = video */}
        {/* <video controls width="800" src={"/video/cat.mp4"} /> */}
        {/* <video controls width="800" src={"/video/IMG_0992.mov"} /> */}
        {/* <video controls width="800" src={"/video/IMG_6070.mov"} /> */}
      </div>
    </div>
  );
}
