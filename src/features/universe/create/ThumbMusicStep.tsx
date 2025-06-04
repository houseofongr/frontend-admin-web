import { PiMusicNotesPlusLight } from "react-icons/pi";
import AudioLight from "../../../components/Sound/AudioLight";

interface Props {
  thumbMusic: File | null;
  previewMusic: string | null;
  warning: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ThumbMusicStep({
  thumbMusic,
  previewMusic,
  warning,
  onFileChange,
}: Props) {
  return (
    <div className="flex flex-col items-center w-full">
      <input
        type="file"
        accept="audio/*"
        className="hidden"
        id="thumbMusicUpload"
        onChange={onFileChange}
      />

      <label htmlFor="thumbMusicUpload" className=" cursor-pointer">
        <PiMusicNotesPlusLight
          className="inline-flex mb-7.5 text-gray-500"
          size={40}
        />
        <p>
          썸뮤직으로 사용할 사운드를
          <br />
          이곳에 드래그하거나 클릭해서 업로드하세요.
        </p>
        <p className="mt-3 mb-6 text-gray-400 text-sm">
          사운드는 2MB 이하만 가능하며, 10초까지만 노출됩니다.
        </p>
      </label>

      {/* 업로드 메시지 */}
      {/* {thumbMusic && (
        <div className="mt-2 text-green-700 text-sm font-medium">
          {thumbMusic.name} 업로드됨
        </div>
      )} */}

      {/* 이 부분은 label 바깥에 둬야 클릭 이벤트 방지됨 */}
      {previewMusic && (
        <div className="w-[80%] w-min-[300px]">
          <AudioLight
            audioUrl={previewMusic}
            audioTitle={thumbMusic?.name || "썸네일 음악 미리듣기"}
          />
        </div>
      )}

      {warning && (
        <div className="mt-1 text-sm text-warning font-normal">{warning}</div>
      )}
    </div>
  );
}
