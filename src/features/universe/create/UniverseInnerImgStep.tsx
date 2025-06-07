import { PiImagesThin } from "react-icons/pi";

interface Props {
  innerImg: File | null;
  previewInnerImg: string | null;
  warning: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InnerImgStep({
  innerImg: innerImg,
  previewInnerImg,
  warning,
  onFileChange,
}: Props) {
  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="innerImgUpload"
        onChange={onFileChange}
      />

      <label
        htmlFor="innerImgUpload"
        className="flex flex-col justify-center items-center cursor-pointer"
      >
        {previewInnerImg ? (
          <img
            src={previewInnerImg}
            alt="미리보기"
            className="w-30 h-30 rounded-md mb-4"
          />
        ) : (
          <PiImagesThin className="inline-flex mb-5 text-gray-500" size={50} />
        )}
        <p>
          내부이미지로 사용할 이미지를
          <br />
          이곳에 드래그하거나 클릭해서 업로드하세요.
        </p>
        <p className="mt-3 mb-6 text-gray-400 text-sm">
          이미지는 정방향 크기에 100MB 이하만 가능합니다.
        </p>
      </label>

      {/* 업로드 메시지 */}
      {innerImg && (
        <div className={`mt-2 text-green-700 text-sm font-medium`}>
          {innerImg.name} 업로드됨
        </div>
      )}
      {warning && (
        <div className={`mt-1 text-sm text-warning font-normal`}>{warning}</div>
      )}
    </div>
  );
}
