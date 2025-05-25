import { PiMusicNotesPlusLight } from "react-icons/pi";

interface Props {
  thumbMusic: File | null;
  warning: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ThumbMusicStep({
  thumbMusic,
  warning,
  onFileChange,
}: Props) {
  return (
    <>
      <input
        type="file"
        accept="audio/*"
        className="hidden"
        id="thumbMusicUpload"
        onChange={onFileChange}
      />

      <label htmlFor="thumbMusicUpload" className="cursor-pointer block">
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
      {thumbMusic && (
        <div className="mt-2 text-green-700 text-sm font-medium">
          {thumbMusic.name} 업로드됨
        </div>
      )}
      {warning && (
        <div className="mt-1 text-sm text-warning font-normal">{warning}</div>
      )}
    </>
  );
}
