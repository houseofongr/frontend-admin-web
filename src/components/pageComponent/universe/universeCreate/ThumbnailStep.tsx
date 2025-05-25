import { PiImagesThin } from "react-icons/pi";

interface Props {
  thumbnail: File | null;
  previewUrl: string | null;
  warning: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ThumbnailStep({
  thumbnail,
  previewUrl,
  warning,
  onFileChange,
}: Props) {
  return (
    <>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="thumbNailUpload"
        onChange={onFileChange}
      />

      <label htmlFor="thumbNailUpload" className="cursor-pointer block">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="미리보기"
            className="mx-auto max-h-60 rounded-md mb-4"
          />
        ) : (
          <PiImagesThin className="inline-flex mb-5 text-gray-500" size={50} />
        )}
        <p>
          썸네일로 사용할 이미지를
          <br />
          이곳에 드래그하거나 클릭해서 업로드하세요.
        </p>
        <p className="mt-3 mb-6 text-gray-400 text-sm">
          이미지는 정방향 크기에 2MB 이하만 가능합니다.
        </p>
      </label>

      {/* 업로드 메시지 */}
      {thumbnail && (
        <div className={`mt-2 text-green-700 text-sm font-medium`}>
          {thumbnail.name} 업로드됨
        </div>
      )}
      {warning && (
        <div className={`mt-1 text-sm text-warning font-normal`}>{warning}</div>
      )}
    </>
  );
}
