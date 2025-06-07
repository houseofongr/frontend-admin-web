import { useState, useEffect } from "react";
import { InputField } from "../../../components/Input/InputField";
import { TextareaField } from "../../../components/Input/TextareaField";

interface DetailInfoStepProps {
  innerImg: File | null;
  detailInfo: {
    title: string;
    description: string;

  };
  onSubmit: (
    title: string,
    description: string
  ) => void;
}

export default function SpaceDetailInfoStep({
  innerImg,
  detailInfo,
  onSubmit,
}: DetailInfoStepProps) {
  // 미리보기
  const [previewInnerImg, setPreviewInnerImg] = useState<string | null>(null);

  // 입력값 상태
  const [title, setTitle] = useState(detailInfo.title);
  const [description, setDescription] = useState(detailInfo.description);

  // 미리보기 처리
  useEffect(() => {
    if (innerImg) {
      const url = URL.createObjectURL(innerImg);
      setPreviewInnerImg(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewInnerImg(null);
  }, [innerImg]);




  return (
    <div className="flex w-full h-full mx-auto flex-col">
      {/* 헤더 + 공개여부 */}
      <div className="text-xl font-semibold  mb-4">세부정보 작성</div>


      <div className="flex flex-col lg:flex-row gap-4">
        {/* 좌측 미리보기 영역 */}
        <div className="flex flex-col gap-3 w-full lg:max-w-[500px] max-h-[500px]">
          {/* 이미지 미리보기 박스 */}
          <div className="flex justify-center items-center border border-gray-300 rounded-xl p-5 grow overflow-hidden">
            {previewInnerImg ? (
              <img
                src={previewInnerImg}
                alt="내부 이미지"
                className="object-contain max-h-full max-w-full"
              />
            ) : (
              "내부이미지"
            )}
          </div>

          {/* 제목 필드 */}
          <div className="shrink-0">
            <InputField
              label="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              placeholder="제목을 입력하세요"
            />
          </div>
        </div>


        {/* 우측 입력 영역 */}
        <div className="flex flex-col flex-1 gap-3 min-w-[450px]">


          {/* 설명 */}
          <TextareaField
            label="설명"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
          />
        </div>
      </div>
      {/* 제출 버튼 */}
      <div className="flex justify-end mt-2">
        <button
          onClick={() => onSubmit(title, description)}
          className="px-5 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition"
        >
          다음
        </button>
      </div>
    </div>
  );
}